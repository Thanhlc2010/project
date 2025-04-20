import { prisma } from '../utils/prismaClient';
import { AppError } from '../utils/AppError';
import { IssueStatus, Priority, Status } from '@prisma/client';

interface CreateIssueData {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: Priority;
  dueDate?: Date;
  parentId?: string;
}

interface UpdateIssueData {
  title?: string;
  description?: string;
  assigneeId?: string;
  priority?: Priority;
  issueStatus?: IssueStatus;
  dueDate?: Date;
}

export const issueService = {
  async createIssue(userId: string, data: CreateIssueData) {
    // Check if user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
                status: Status.ACTIVE
              }
            }
          }
        ]
      }
    });

    if (!project) {
      throw AppError.notFound('Project not found or access denied');
    }

    // If parent issue is specified, verify it exists in the same project
    if (data.parentId) {
      const parentIssue = await prisma.issue.findFirst({
        where: {
          id: data.parentId,
          projectId: data.projectId
        }
      });

      if (!parentIssue) {
        throw AppError.badRequest('Parent issue not found in the specified project');
      }
    }

    // If assignee is specified, verify they are a project member
    if (data.assigneeId) {
      const projectMember = await prisma.projectMember.findFirst({
        where: {
          projectId: data.projectId,
          userId: data.assigneeId,
          status: Status.ACTIVE
        }
      });

      if (!projectMember) {
        throw AppError.badRequest('Assignee must be a project member');
      }
    }

    return prisma.issue.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        creatorId: userId,
        assigneeId: data.assigneeId,
        priority: data.priority || Priority.MEDIUM,
        dueDate: data.dueDate,
        parentId: data.parentId,
        issueStatus: IssueStatus.TODO
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true
          }
        },
        parent: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
  },

  async getIssues(userId: string, filters: {
    projectId?: string;
    assigneeId?: string;
    status?: IssueStatus;
    priority?: Priority;
  }) {
    const whereClause = {
      OR: [
        {
          project: {
            OR: [
              { ownerId: userId },
              {
                members: {
                  some: {
                    userId: userId,
                    status: Status.ACTIVE
                  }
                }
              }
            ]
          }
        }
      ],
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.status && { issueStatus: filters.status }),
      ...(filters.priority && { priority: filters.priority })
    };

    return prisma.issue.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true
          }
        },
        labels: {
          include: {
            label: true
          }
        },
        _count: {
          select: {
            comments: true,
            subIssues: true,
            attachments: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  },

  async getIssueById(issueId: string, userId: string) {
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        project: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId,
                  status: Status.ACTIVE
                }
              }
            }
          ]
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true
          }
        },
        parent: {
          select: {
            id: true,
            title: true
          }
        },
        subIssues: {
          select: {
            id: true,
            title: true,
            issueStatus: true
          }
        },
        labels: {
          include: {
            label: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        attachments: true
      }
    });

    if (!issue) {
      throw AppError.notFound('Issue not found');
    }

    return issue;
  },

  async updateIssue(issueId: string, userId: string, data: UpdateIssueData) {
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        project: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId,
                  status: Status.ACTIVE
                }
              }
            }
          ]
        }
      },
      include: {
        project: true
      }
    });

    if (!issue) {
      throw AppError.notFound('Issue not found or unauthorized');
    }

    // If changing assignee, verify they are a project member
    if (data.assigneeId) {
      const projectMember = await prisma.projectMember.findFirst({
        where: {
          projectId: issue.projectId,
          userId: data.assigneeId,
          status: Status.ACTIVE
        }
      });

      if (!projectMember) {
        throw AppError.badRequest('Assignee must be a project member');
      }
    }

    // Create history record for changes
    const changes: any[] = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && issue[key as keyof typeof issue] !== value) {
        changes.push({
          issueId,
          field: key,
          oldValue: String(issue[key as keyof typeof issue]),
          newValue: String(value),
          updatedBy: userId
        });
      }
    });

    // Update issue and create history records in a transaction
    return prisma.$transaction(async (prisma) => {
      const updatedIssue = await prisma.issue.update({
        where: { id: issueId },
        data: {
          ...data,
          history: {
            createMany: {
              data: changes
            }
          }
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          project: {
            select: {
              id: true,
              name: true,
              key: true
            }
          }
        }
      });

      return updatedIssue;
    });
  },

  async addComment(issueId: string, userId: string, content: string) {
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        project: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId,
                  status: Status.ACTIVE
                }
              }
            }
          ]
        }
      }
    });

    if (!issue) {
      throw AppError.notFound('Issue not found or unauthorized');
    }

    return prisma.comment.create({
      data: {
        content,
        issueId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  },

  async addLabel(issueId: string, userId: string, labelId: string) {
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        project: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId,
                  status: Status.ACTIVE
                }
              }
            }
          ]
        }
      },
      include: {
        project: true
      }
    });

    if (!issue) {
      throw AppError.notFound('Issue not found or unauthorized');
    }

    const label = await prisma.label.findFirst({
      where: {
        id: labelId,
        projectId: issue.projectId
      }
    });

    if (!label) {
      throw AppError.badRequest('Label not found in project');
    }

    const existingLabel = await prisma.issueLabel.findUnique({
      where: {
        issueId_labelId: {
          issueId,
          labelId
        }
      }
    });

    if (existingLabel) {
      if (existingLabel.status === Status.ACTIVE) {
        throw AppError.badRequest('Label already added to issue');
      }

      return prisma.issueLabel.update({
        where: {
          issueId_labelId: {
            issueId,
            labelId
          }
        },
        data: {
          status: Status.ACTIVE
        },
        include: {
          label: true
        }
      });
    }

    return prisma.issueLabel.create({
      data: {
        issueId,
        labelId,
        status: Status.ACTIVE
      },
      include: {
        label: true
      }
    });
  }
};