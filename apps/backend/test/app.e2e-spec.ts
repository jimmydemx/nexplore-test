import request from 'supertest';
import { createApp } from './../src/app';
import { openApiDocument } from './../src/openapi';

describe('Express backend (e2e)', () => {
  const app = createApp();

  it('/ (GET)', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect({
        message: 'Hello from Express!',
        service: 'backend',
      });
  });

  it('/health (GET)', () => {
    return request(app)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', database: 'not-configured' });
  });

  it('/docs.json (GET)', () => {
    return request(app)
      .get('/docs.json')
      .expect(200)
      .expect(openApiDocument);
  });
});
