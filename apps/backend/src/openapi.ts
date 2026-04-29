export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Nexplore Test Backend API',
    version: '1.0.0',
    description: 'Express backend API documentation.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    schemas: {
      Duty: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'f8a4c786-85f0-4127-84f2-68aa7fa8f59a' },
          name: { type: 'string', example: 'Write page tests' },
          completed: { type: 'boolean', example: false },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-29T12:00:00.000Z',
          },
        },
        required: ['id', 'name', 'completed', 'createdAt'],
      },
      CreateDutyRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Write page tests' },
        },
        required: ['name'],
      },
      UpdateDutyRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Refine page tests' },
        },
        required: ['name'],
      },
      SetDutyCompletionRequest: {
        type: 'object',
        properties: {
          completed: { type: 'boolean', example: true },
        },
        required: ['completed'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Duty not found.' },
        },
        required: ['message'],
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          database: { type: 'string', example: 'connected' },
        },
        required: ['status', 'database'],
      },
    },
  },
  paths: {
    '/': {
      get: {
        summary: 'Get backend welcome payload',
        responses: {
          '200': {
            description: 'Welcome response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Hello from Express!' },
                    service: { type: 'string', example: 'backend' },
                  },
                  required: ['message', 'service'],
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Check API and database health',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
          '503': {
            description: 'Database is unreachable',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/duties': {
      get: {
        summary: 'List duties',
        responses: {
          '200': {
            description: 'A list of duties',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Duty',
                  },
                },
              },
            },
          },
          '503': {
            description: 'Database is not configured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a duty',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateDutyRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created duty',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Duty',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '503': {
            description: 'Database is not configured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/duties/{id}': {
      patch: {
        summary: 'Rename a duty',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateDutyRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated duty',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Duty',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Duty not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '503': {
            description: 'Database is not configured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a duty',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Duty deleted',
          },
          '404': {
            description: 'Duty not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '503': {
            description: 'Database is not configured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/duties/{id}/completion': {
      patch: {
        summary: 'Update duty completion',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SetDutyCompletionRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated duty',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Duty',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Duty not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '503': {
            description: 'Database is not configured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
} as const;