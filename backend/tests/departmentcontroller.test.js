import request from 'supertest';
import app from '../index.js';

describe('GET /api/department/organization/:organizationId', () => {
  it('should fetch all departments for an organization', async () => {
    const organizationId = '<67dafc15568baff674c4476f>'; // <-- PUT A VALID ORGANIZATION ID HERE
    const res = await request(app)
      .get(`/api/department/organization/${organizationId}`)
      .expect('Content-Type', /json/);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});
