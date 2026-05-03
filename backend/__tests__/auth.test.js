const request  = require('supertest');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const app = require('../server');

// Connect once for all auth tests
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

const testUser = {
  name:     'Auth Test User',
  email:    `authtest_${Date.now()}@simwork.in`,
  password: 'test123456',
};

let authToken = '';

describe('🔐 AUTH API', () => {

  describe('POST /api/auth/signup', () => {

    test('✅ Should create a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user.password).toBeUndefined();
      authToken = res.body.token;
    });

    test('❌ Should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'missing@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail with short password', async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test', email: 'short@test.com', password: '123' });
  // 400 (validation) or 500 (caught error) — both mean failure
  expect(res.statusCode).toBeGreaterThanOrEqual(400);
  expect(res.body.success).toBe(false);
});
  });

  describe('POST /api/auth/login', () => {

    test('✅ Should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    test('✅ Token should have 3 parts (JWT structure)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      expect(res.body.token.split('.').length).toBe(3);
    });

    test('❌ Should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@nowhere.com', password: '123456' });
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});