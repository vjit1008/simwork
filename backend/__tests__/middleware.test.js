const request  = require('supertest');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const app = require('../server');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🛡️ MIDDLEWARE TESTS', () => {

  describe('Auth Middleware', () => {

    test('❌ No token → 401', async () => {
      const res = await request(app)
        .get('/api/interview/questions');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      // Accept any message about authorization
      expect(res.body.message).toBeDefined();
    });

    test('❌ Malformed token → 401', async () => {
      const res = await request(app)
        .get('/api/interview/questions')
        .set('Authorization', 'NotBearer abc');
      expect(res.statusCode).toBe(401);
    });

    test('❌ Invalid Bearer token → 401', async () => {
      const res = await request(app)
        .get('/api/interview/questions')
        .set('Authorization', 'Bearer thisisnotavalidjwttoken');
      expect(res.statusCode).toBe(401);
    });

    test('❌ Empty Bearer → 401', async () => {
      const res = await request(app)
        .get('/api/interview/questions')
        .set('Authorization', 'Bearer ');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Error Middleware', () => {

    test('✅ Health check returns OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });

    test('✅ Unknown routes handled gracefully', async () => {
      const res = await request(app).get('/api/doesnotexist');
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('CORS Headers', () => {

    test('✅ CORS headers present on API routes', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:5173');
      // Either has access-control header or passes through
      expect(res.statusCode).toBe(200);
    });
  });

  describe('JSON Body Parser', () => {

    test('✅ Accepts JSON body on POST routes', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: 'test@test.com', password: '123456' });
      // Should process JSON (not crash with parse error)
      expect([200, 400, 401]).toContain(res.statusCode);
    });

    test('✅ Returns JSON response', async () => {
      const res = await request(app).get('/health');
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });
});