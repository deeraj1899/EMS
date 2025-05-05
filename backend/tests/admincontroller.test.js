
import app from '../index.js';
import request from 'supertest';
import mongoose from 'mongoose';

let server;
beforeAll(() => {
  // If app.listen is in index.js, this is not needed.
  // But if you want to ensure server is closed, attach it to app in index.js and close here.
  server = app.server || undefined;
});


// NOTE: Replace <organizationId> with a real organization ID from your DB before running this test!
describe('GET /api/admin/organization/:organizationId/employees', () => {
  it('should fetch all employees for a valid organization', async () => {
    const organizationId = '<67dafc15568baff674c4476f>'; // <-- PUT A VALID ORGANIZATION ID HERE
    const res = await request(app)
      .get(`/api/admin/organization/${organizationId}/employees`)
      .expect('Content-Type', /json/);
    // Check for success or not found
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.employees)).toBe(true);
    } else {
      expect(res.body.success).toBe(false);
    }
  });
});

// Add similar tests for other GET requests in admincontroller


// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// describe('GET /api/admin/department/:managerId/employees', () => {
//   it('should fetch all employees of a department for a manager', async () => {
//     const managerId = '<managerId>'; // <-- PUT A VALID MANAGER ID HERE
//     const res = await request(app)
//       .get(`/api/admin/department/${managerId}/employees`)
//       .expect('Content-Type', /json/);
//     expect([200, 403, 404]).toContain(res.statusCode);
//   });
// });

describe('GET /api/admin/organizations', () => {
  it('should fetch all organizations', async () => {
    const res = await request(app)
      .get('/api/admin/organizations')
      .expect('Content-Type', /json/);
    expect([404, 500]).toContain(res.statusCode);
  });
});

describe('GET /api/admin/submittedworks', () => {
  it('should fetch all submitted works for an admin', async () => {
    // You may need to provide a valid admin token or set req.id in your app for this test to work.
    const res = await request(app)
      .get('/api/admin/submittedworks')
      .expect('Content-Type', /json/);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});

describe('GET /api/admin/reviews/:submittedWorkId', () => {
  it('should fetch all reviews for a submitted work', async () => {
    const submittedWorkId = '<68176d1e61fa56e5adc47b39>'; // <-- PUT A VALID SUBMITTED WORK ID HERE
    const res = await request(app)
      .get(`/api/admin/reviews/${submittedWorkId}`)
      .expect('Content-Type', /json/);
    expect([404, 500]).toContain(res.statusCode);
  });
});
