import { prisma } from '../utils/prismaClient';
import { AppError } from '../utils/AppError';
import { Status, Workspace } from '@prisma/client';

export const workspaceService = {
  async createWorkspace(userId: string, data: { name: string }) {
    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        ownerId: userId,
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
      },
    });

    console.log("Create workspce", workspace);
    
    await this.addMember(workspace.id, userId, userId);

    return workspace;
  },

  async getWorkspaces(userId: string) {
    return prisma.workspace.findMany({
      where: {
        status: Status.ACTIVE,
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
        projects: {
          where: {
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
          },
        },
      },
    });
  },

  async getWorkspaceById(workspaceId: string, userId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
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
        projects: {
          where: {
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
          },
        },
      },
    });

    if (!workspace) {
      throw AppError.notFound('Workspace not found');
    }

    return workspace;
  },

  async updateWorkspace(
    workspaceId: string,
    userId: string,
    data: { name?: string; status?: Status }
  ) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw AppError.notFound('Workspace not found or unauthorized');
    }

    return prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        ...(data.name && { name: data.name }),
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
      },
    });
  },

  async deleteWorkspace(workspaceId: string, userId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw AppError.notFound('Workspace not found or unauthorized');
    }

    // Soft delete by setting status to INACTIVE
    return prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        status: Status.INACTIVE,
        projects: {
          updateMany: {
            where: {
              status: Status.ACTIVE,
            },
            data: {
              status: Status.INACTIVE,
            },
          },
        },
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

  async getMembersByWorkspaceId(workspaceId: string, userId: string) {
    // console.log("Get members of " + workspaceId + " ," + userId);
    
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
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
      throw AppError.notFound('Workspace not found or unauthorized');
    }
  
    return prisma.workspaceMember.findMany({
      where: {
        workspaceId,
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
  

  async addMember(workspaceId: string, userId: string, memberId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw AppError.notFound('Workspace not found or unauthorized');
    }

    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId,
        },
      },
    });

    if (existingMember) {
      if (existingMember.status === Status.ACTIVE) {
        throw AppError.badRequest('User is already a member');
      }

      // Reactivate inactive member
      return prisma.workspaceMember.update({
        where: {
          workspaceId_userId: {
            workspaceId,
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

    return prisma.workspaceMember.create({
      data: {
        workspaceId,
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
  async addMembers(workspaceId: string, userId: string, memberIds: string[]) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw AppError.notFound('Workspace not found or unauthorized');
    }

    // Get existing members to handle reactivation
    const existingMembers = await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
        userId: {
          in: memberIds,
        },
      },
    });

    const existingMemberIds = new Set(existingMembers.map(member => member.userId));
    const activeMembers = new Set(
      existingMembers
        .filter(member => member.status === Status.ACTIVE)
        .map(member => member.userId)
    );

    // Check for already active members
    const alreadyActiveMembers = memberIds.filter(id => activeMembers.has(id));
    if (alreadyActiveMembers.length > 0) {
      throw AppError.badRequest(
        `Users with IDs ${alreadyActiveMembers.join(', ')} are already active members`
      );
    }

    // Separate members into reactivate and create new
    const membersToReactivate = memberIds.filter(id => existingMemberIds.has(id));
    const membersToCreate = memberIds.filter(id => !existingMemberIds.has(id));

    // Perform all operations in a transaction
    return prisma.$transaction(async tx => {
      // Reactivate existing inactive members
      if (membersToReactivate.length > 0) {
        await tx.workspaceMember.updateMany({
          where: {
            workspaceId,
            userId: {
              in: membersToReactivate,
            },
          },
          data: {
            status: Status.ACTIVE,
          },
        });
      }

      // Create new members
      if (membersToCreate.length > 0) {
        await tx.workspaceMember.createMany({
          data: membersToCreate.map(memberId => ({
            workspaceId,
            userId: memberId,
            status: Status.ACTIVE,
          })),
        });
      }

      // Return updated members list
      return tx.workspaceMember.findMany({
        where: {
          workspaceId,
          userId: {
            in: memberIds,
          },
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
    });
  },
  async removeMembers(workspaceId: string, userId: string, memberIds: string[]) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw AppError.notFound('Workspace not found or unauthorized');
    }

    // Get existing active members
    const existingMembers = await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
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
      await tx.workspaceMember.updateMany({
        where: {
          workspaceId,
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
      return tx.workspaceMember.findMany({
        where: {
          workspaceId,
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
