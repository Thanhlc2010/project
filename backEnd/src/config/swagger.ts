import swaggerJSDoc from 'swagger-jsdoc';
import { environment } from './environment';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Documentation for the REST API endpoints',
  },
  servers: [
    {
      url: `http://localhost:${environment.PORT}`,
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Error message',
              },
              code: {
                type: 'string',
                example: 'ERROR_CODE',
              },
              statusCode: {
                type: 'number',
                example: 400,
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          name: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          }
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
          key: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
          },
          ownerId: {
            type: 'string',
            format: 'uuid',
          },
          workspaceId: {
            type: 'string',
            format: 'uuid',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          }
        },
      },
      Issue: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          issueStatus: {
            type: 'string',
            enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'],
          },
          priority: {
            type: 'string',
            enum: ['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'],
          },
          projectId: {
            type: 'string',
            format: 'uuid',
          },
          creatorId: {
            type: 'string',
            format: 'uuid',
          },
          assigneeId: {
            type: 'string',
            format: 'uuid',
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          }
        },
      },
      Workspace: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
          ownerId: {
            type: 'string',
            format: 'uuid',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          }
        },
      },
      TaskNode: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          type: {
            type: 'string',
          },
          position_x: {
            type: 'number',
          },
          position_y: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
          duration: {
            type: 'number',
          },
          priority: {
            type: 'string',
          },
          ES: {
            type: 'number',
          },
          EF: {
            type: 'number',
          },
          LS: {
            type: 'number',
          },
          LF: {
            type: 'number',
          },
          data_position_x: {
            type: 'number',
          },
          data_position_y: {
            type: 'number',
          },
          dependencies: {
            type: 'string',
          },
          pertId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['id', 'type', 'position_x', 'position_y', 'name', 'duration', 'priority', 'pertId'],
      },
      TaskEdge: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          source: {
            type: 'string',
          },
          target: {
            type: 'string',
          },
          pertId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['id', 'source', 'target', 'pertId'],
      },
      Pert: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          projectId: {
            type: 'string',
            format: 'uuid',
          },
          taskNodes: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/TaskNode',
            },
          },
          taskEdges: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/TaskEdge',
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['id', 'taskNodes', 'taskEdges'],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJSDoc(options);