import { Status } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../utils/prismaClient';
import { AppError } from '../utils/AppError';

export const projectService = {
  async createProject(
    userId: string,
    data: { name: string; description?: string; workspaceId: string }
  ) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: data.workspaceId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
                status: Status.ACTIVE,
              },
            },
          },
        ],
      },
    });

    if (!workspace) {
      throw AppError.notFound('Workspace not found or access denied');
    }
    // TODO: check if key is unique, implement later
    // const existingProject = await prisma.project.findUnique({
    //   where: {
    //     key: data.key,
    //   },
    // });

    // if (existingProject) {
    //   throw AppError.badRequest('Project key already exists');
    // }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        key: 'PRJ-' + uuidv4().slice(0, 7),
        description: data.description,
        ownerId: userId,
        workspaceId: data.workspaceId,
        status: Status.ACTIVE,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    this.addMember(project.id, userId, userId);

    return project;
  },

  async getProjects(userId: string, workspaceId?: string) {
    const whereClause = {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
              status: Status.ACTIVE,
            },
          },
        },
      ],
      status: Status.ACTIVE,
      ...(workspaceId && { workspaceId }),
    };

    return prisma.project.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            issues: true,
            members: true,
          },
        },
      },
    });
  },

  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
                status: Status.ACTIVE,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          where: {
            status: Status.ACTIVE,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        labels: true,
      },
    });

    if (!project) {
      throw AppError.notFound('Project not found');
    }

    return project;
  },

  async updateProject(
    projectId: string,
    userId: string,
    data: { name?: string; description?: string; status?: Status }
  ) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw AppError.notFound('Project not found or unauthorized');
    }

    return prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.status && { status: data.status }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async deleteProject(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw AppError.notFound('Project not found or unauthorized');
    }

    // Soft delete by setting status to INACTIVE
    return prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: Status.INACTIVE,
        members: {
          updateMany: {
            where: {
              status: Status.ACTIVE,
            },
            data: {
              status: Status.INACTIVE,
            },
          },
        },
      },
    });
  },

  async checkExistMemberInProject(projectId: string, userId: string, memberId: string): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            workspace: {
              ownerId: userId,
            },
          },
        ],
      },
    });

    if (!project) {
      throw AppError.notFound('Project not found or unauthorized');
    }
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: memberId,
        },
      },
      select: {
        status: true,
      },
    });
  
    return member?.status === Status.ACTIVE;
  },
  

  async addMember(projectId: string, userId: string, memberId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            workspace: {
              ownerId: userId,
            },
          },
        ],
      },
    });

    if (!project) {
      throw AppError.notFound('Project not found or unauthorized');
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
    });

    if (existingMember) {
      if (existingMember.status === Status.ACTIVE) {
        throw AppError.badRequest('User is already a member');
        // return res.status(400).json({status: 'User is already a member', message: 'User is already a member'});
      }

      // Reactivate inactive member
      return prisma.projectMember.update({
        where: {
          projectId_userId: {
            projectId,
            userId: memberId,
          },
        },
        data: {
          status: Status.ACTIVE,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    return prisma.projectMember.create({
      data: {
        projectId,
        userId: memberId,
        status: Status.ACTIVE,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },
  async removeMembers(projectId: string, userId: string, memberIds: string[]) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            workspace: {
              ownerId: userId,
            },
          },
        ],
      },
      include: {
        workspace: true,
      },
    });

    if (!project) {
      throw AppError.notFound('Project not found or unauthorized');
    }

    // Get existing active members
    const existingMembers = await prisma.projectMember.findMany({
      where: {
        projectId,
        userId: {
          in: memberIds,
        },
        status: Status.ACTIVE,
      },
    });

    if (existingMembers.length === 0) {
      throw AppError.notFound('No active members found');
    }

    // Perform the update in a transaction
    return prisma.$transaction(async tx => {
      // Deactivate all specified members
      await tx.projectMember.updateMany({
        where: {
          projectId,
          userId: {
            in: memberIds,
          },
          status: Status.ACTIVE,
        },
        data: {
          status: Status.INACTIVE,
        },
      });

      // Return updated members list
      return tx.projectMember.findMany({
        where: {
          projectId,
          userId: {
            in: memberIds,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });
  },
};
