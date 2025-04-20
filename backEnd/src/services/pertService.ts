import { prisma } from '../utils/prismaClient';
import { AppError } from '../utils/AppError';

export const pertService = {
  async createPert(data: { taskNodes: any[]; taskEdges: any[]; projectId: string }) {
    // Create the Pert first
    const createdPert = await prisma.pert.create({
      data: {
        projectId: data.projectId,
      },
    });

    // Create task nodes and associate them with the created Pert
    const createdTaskNodes = await Promise.all(
      data.taskNodes.map((taskNode) =>
        prisma.taskNode.create({
          data: {
            ...taskNode,
            pert: {
              connect: { id: createdPert.id }, // Connect to the created Pert
            },
          },
        })
      )
    );

    // Create task edges and associate them with the created Pert
    const createdTaskEdges = await Promise.all(
      data.taskEdges.map((taskEdge) =>
        prisma.taskEdge.create({
          data: {
            ...taskEdge,
            pert: {
              connect: {id: createdPert.id}, // Use the `pert` relation to connect to the Pert
            },
          },
        })
      )
    );

    // Return the created Pert with its associated task nodes and edges
    return prisma.pert.findUnique({
      where: { id: createdPert.id },
      include: {
        taskNodes: true,
        taskEdges: true,
      },
    });
  },

  async getPerts() {
    return prisma.pert.findMany({
      include: {
        taskNodes: true,
        taskEdges: true,
      },
    });
  },

  async getPertById(id: string) {
    const pert = await prisma.pert.findUnique({
      where: { id },
      include: {
        taskNodes: true,
        taskEdges: true,
      },
    });

    if (!pert) {
      throw AppError.notFound('Pert not found');
    }

    return pert;
  },

  async updatePert(id: string, data: { taskNodes?: any[]; taskEdges?: any[] }) {
    const pert = await prisma.pert.findUnique({ where: { id } });

    if (!pert) {
      throw AppError.notFound('Pert not found');
    }

    return prisma.pert.update({
      where: { id },
      data: {
        taskNodes: {
          deleteMany: {}, // Clear existing nodes
          create: data.taskNodes || [],
        },
        taskEdges: {
          deleteMany: {}, // Clear existing edges
          create: data.taskEdges || [],
        },
      },
      include: {
        taskNodes: true,
        taskEdges: true,
      },
    });
  },

  async deletePert(id: string) {
    const pert = await prisma.pert.findUnique({ where: { id } });

    if (!pert) {
      throw AppError.notFound('Pert not found');
    }

    return prisma.pert.delete({ where: { id } });
  },

  async getPertsByProjectId(projectId: string) {
    const perts = await prisma.pert.findMany({
      where: { projectId },
      include: {
        taskNodes: true,
        taskEdges: true,
      },
    });

    if (perts.length === 0) {
      throw AppError.notFound('No Perts found for the specified project');
    }

    return perts;
  },
};