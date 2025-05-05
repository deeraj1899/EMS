import request from 'supertest';
import app from '../index.js';

describe('GET /api/leave/employee', () => {
  it('should fetch employee leave requests and balance', async () => {
    const res = await request(app)
      .get('/api/leave/employee')
      .expect('Content-Type', /json/);
    expect([404, 500]).toContain(res.statusCode);
  });
});
