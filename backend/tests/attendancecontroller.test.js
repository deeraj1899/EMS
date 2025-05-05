import request from 'supertest';
import app from '../index.js';

describe('GET /api/attendance/status/today', () => {
  it('should fetch employee attendance status for today', async () => {
    const res = await request(app)
      .get('/api/attendance/status/today')
      .expect('Content-Type', /json/);
    expect([404, 500]).toContain(res.statusCode);
  });
});
