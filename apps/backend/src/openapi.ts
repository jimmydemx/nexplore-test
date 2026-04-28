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
          },
          '503': {
            description: 'Database is unreachable',
          },
        },
      },
    },
  },
} as const;