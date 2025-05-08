import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { environment } from '../config/environment';
import { prisma } from '../utils/prismaClient';
import { Status } from '@prisma/client';

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

interface JwtPayload {
  id: string;
}

export class UserService {
  private static generateToken(userId: string): string {
    const payload: JwtPayload = { id: userId };
    const options: SignOptions = {
      expiresIn: '24h', // Hardcode the expiration time to avoid type issues
    };

    return jwt.sign(payload, Buffer.from(environment.JWT_SECRET), options);
  }

  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      },
    });

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  static async logout() {
    return {
      status: 'success',
      message: 'Logged out successfully',
    };
  }

  // Get all users
  static async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Get user by ID
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ownedProjects: true,
        memberProjects: true,
        ownedWorkspaces: true,
        workspaceMembers: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Update user
  static async updateUser(id: string, input: UpdateUserInput) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // If email is being updated, check if new email is already in use
    if (input.email && input.email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (emailInUse) {
        throw new AppError('Email already in use', 400);
      }
    }

    // Hash password if it's being updated
    const data: any = { ...input };
    if (input.password) {
      data.password = await bcrypt.hash(input.password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  // Delete user (soft delete by updating status to INACTIVE)
  static async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return {
      status: 'success',
      message: 'User deleted successfully',
    };
  }
  // Get all users with pagination (excluding specific users)
  static async getAllUsersWithPagination(
    page = 1,
    limit = 10,
    excludeUserIds: string[] = []
  ) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          id: {
            notIn: excludeUserIds
          }
        },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({
        where: {
          status: 'ACTIVE',
          id: {
            notIn: excludeUserIds
          }
        }
      }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Get available workspace users with pagination
  static async getAvailableWorkspaceUsers(workspaceId: string, page = 1, limit = 10) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          where: {
            status: Status.ACTIVE,
          },
          select: {
            userId: true
          }
        }
      }
    });

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Get IDs of users already in the workspace
    const existingUserIds = [
      workspace.ownerId,
      ...workspace.members.map(member => member.userId)
    ];

    return this.getAllUsersWithPagination(page, limit, existingUserIds);
  }

  // Get available project users with pagination
  static async getAvailableProjectUsers(projectId: string, page = 1, limit = 10) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: {
            status: Status.ACTIVE,
          },
          select: {
            userId: true
          }
        }
      }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Get IDs of users already in the project
    const existingUserIds = [
      project.ownerId,
      ...project.members.map(member => member.userId)
    ];

    return this.getAllUsersWithPagination(page, limit, existingUserIds);
  }
}
