import { prisma } from '../utils/prismaClient';
import { AppError } from '../utils/AppError';

interface CreatePertTaskInput {
  issueId: string;
  parentIssueId?: string;
  position_x?: number;
  position_y?: number;
  ES?: number;
  EF?: number;
  LS?: number;
  LF?: number;
  data_position_x?: number;
  data_position_y?: number;
  dependencies?: string;
}

interface CreatePertInput {
  projectId: string;
  name: string;
  tasks: CreatePertTaskInput[];
}

export const pertService = {
  async createPert(data: CreatePertInput) {
    // Create the Pert first
    const createdPert = await prisma.pert.create({
      data: {
        projectId: data.projectId,
        name: data.name
      },
    });

    // Create pert tasks
    if (data.tasks.length > 0) {
      await Promise.all(
        data.tasks.map((task) =>
          prisma.pertTask.create({
            data: {
              issueId: task.issueId,
              parentIssueId: task.parentIssueId,
              pertId: createdPert.id,
              position_x: task.position_x ?? 0,
              position_y: task.position_y ?? 0,
              ES: task.ES ?? 0,
              EF: task.EF ?? 0,
              LS: task.LS ?? 0,
              LF: task.LF ?? 0,
              data_position_x: task.data_position_x ?? 0,
              data_position_y: task.data_position_y ?? 0,
              dependencies: task.dependencies ?? '',
            },
          })
        )
      );
    }

    // Return the created Pert with its tasks
    return prisma.pert.findUnique({
      where: { id: createdPert.id },
      include: {
        pertTasks: {
          include: {
            issue: true,
            parentIssue: true
          }
        }
      }
    });
  },

  async getPerts() {
    return prisma.pert.findMany({
      include: {
        pertTasks: {
          include: {
            issue: true,
            parentIssue: true
          }
        }
      },
    });
  },

  async getPertById(id: string) {
    const pert = await prisma.pert.findUnique({
      where: { id },
      include: {
        pertTasks: {
          include: {
            issue: true,
            parentIssue: true
          }
        }
      },
    });

    if (!pert) {
      throw AppError.notFound('Pert not found');
    }

    return pert;
  },

  async updatePert(id: string, data: { name?: string; tasks?: CreatePertTaskInput[] }) {
    const pert = await prisma.pert.findUnique({ where: { id } });

    if (!pert) {
      throw AppError.notFound('Pert not found');
    }

    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
    }

    // Start a transaction
    return prisma.$transaction(async (tx) => {
      // Update pert name if provided
      const updatedPert = await tx.pert.update({
        where: { id },
        data: updateData
      });

      // Update tasks if provided
      if (data.tasks) {
        // Delete existing tasks
        await tx.pertTask.deleteMany({
          where: { pertId: id }
        });

        // Create new tasks
        await Promise.all(
          data.tasks.map((task) =>
            tx.pertTask.create({
              data: {
                issueId: task.issueId,
                parentIssueId: task.parentIssueId,
                pertId: id,
                position_x: task.position_x ?? 0,
                position_y: task.position_y ?? 0,
                ES: task.ES ?? 0,
                EF: task.EF ?? 0,
                LS: task.LS ?? 0,
                LF: task.LF ?? 0,
                data_position_x: task.data_position_x ?? 0,
                data_position_y: task.data_position_y ?? 0,
                dependencies: task.dependencies ?? '',
              },
            })
          )
        );
      }

      // Return updated pert with tasks
      return tx.pert.findUnique({
        where: { id },
        include: {
          pertTasks: {
            include: {
              issue: true,
              parentIssue: true
            }
          }
        }
      });
    });
  },

  async deletePert(id: string) {
    const pert = await prisma.pert.findUnique({ where: { id } });

    if (!pert) {
      throw AppError.notFound('Pert not found');
    }

    return prisma.$transaction(async (tx) => {
      // Delete all tasks first
      await tx.pertTask.deleteMany({
        where: { pertId: id }
      });

      // Then delete the pert
      return tx.pert.delete({
        where: { id }
      });
    });
  },

  async getPertsByProjectId(projectId: string) {
    const perts = await prisma.pert.findMany({
      where: { projectId },
      include: {
        pertTasks: {
          include: {
            issue: true,
            parentIssue: true
          }
        }
      },
    });

    if (perts.length === 0) {
      throw AppError.notFound('No Perts found for the specified project');
    }

    return perts;
  },
};
