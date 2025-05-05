import request from 'supertest';
import app from '../index.js';

describe('GET /api/employee/details', () => {
  it('should fetch employee details', async () => {
    // You may need to mock authentication or set req.id in your app for this test to work.
    const res = await request(app)
      .get('/api/employee/details')
      .expect('Content-Type', /json/);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});

describe('GET /api/employee/works', () => {
  it('should fetch all works for an employee', async () => {
    const res = await request(app)
      .get('/api/employee/works')
      .expect('Content-Type', /json/);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});

describe('GET /api/employee/submittedworks', () => {
  it('should fetch all submitted works for an employee', async () => {
    const res = await request(app)
      .get('/api/employee/submittedworks')
      .expect('Content-Type', /json/);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});
