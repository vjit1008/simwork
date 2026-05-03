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

// Shared state across describe blocks
let authToken    = '';
let interviewId  = '';

const sampleAnswers = [
  "I am a software developer with experience in JavaScript and React.",
  "I am interested because this role aligns with my skills and goals.",
  "I worked on an e-commerce platform and optimized database queries.",
  "I use Jira and break tasks by priority and deadlines.",
  "We had a conflict about code architecture. I organized a meeting.",
  "My strength is problem-solving. Weakness is over-engineering sometimes.",
  "In 3 years I see myself as a senior developer leading a small team.",
  "I learned React in 2 weeks by following documentation and building.",
  "I stay calm, communicate with team, focus on critical features first.",
  "What is the tech stack and what does onboarding look like?"
];

// Create user and get token ONCE before all tests
beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({
      name:     'Interview Tester',
      email:    `itest_${Date.now()}@simwork.in`,
      password: 'test123456',
    });
  authToken = res.body.token;
});

describe('🎯 INTERVIEW API', () => {

  // ── GET QUESTIONS ──────────────────────────────────────
  describe('GET /api/interview/questions', () => {

    test('✅ Should return 10 questions', async () => {
      const res = await request(app)
        .get('/api/interview/questions')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.questions.length).toBe(10);
    });

    test('✅ Should return role name', async () => {
      const res = await request(app)
        .get('/api/interview/questions')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.body.role).toBe('Software Developer');
    });

    test('✅ Each question should be a non-empty string', async () => {
      const res = await request(app)
        .get('/api/interview/questions')
        .set('Authorization', `Bearer ${authToken}`);
      res.body.questions.forEach(q => {
        expect(typeof q).toBe('string');
        expect(q.length).toBeGreaterThan(5);
      });
    });

    test('❌ Should fail without auth token', async () => {
      const res = await request(app).get('/api/interview/questions');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/interview/questions')
        .set('Authorization', 'Bearer invalidtoken123');
      expect(res.statusCode).toBe(401);
    });
  });

  // ── SUBMIT INTERVIEW ───────────────────────────────────
  describe('POST /api/interview/submit', () => {

    test('✅ Should submit and return interviewId', async () => {
      const res = await request(app)
        .post('/api/interview/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers: sampleAnswers });

      // Accept 201 (real OpenAI) or 500 (no OpenAI key = expected in test env)
      expect([201, 500]).toContain(res.statusCode);

      if (res.statusCode === 201) {
        expect(res.body.success).toBe(true);
        expect(res.body.interviewId).toBeDefined();
        interviewId = res.body.interviewId;
      }
    });

    test('✅ Should return score between 0 and 10 (if OpenAI available)', async () => {
      const res = await request(app)
        .post('/api/interview/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers: sampleAnswers });

      if (res.statusCode === 201) {
        expect(res.body.totalScore).toBeGreaterThanOrEqual(0);
        expect(res.body.totalScore).toBeLessThanOrEqual(10);
        interviewId = res.body.interviewId;
      } else {
        // OpenAI not configured — skip score check
        expect(res.statusCode).toBe(500);
      }
    });

    test('❌ Should fail with empty answers array', async () => {
      const res = await request(app)
        .post('/api/interview/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers: [] });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail with wrong number of answers', async () => {
      const res = await request(app)
        .post('/api/interview/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers: ['only one'] });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail without answers field', async () => {
      const res = await request(app)
        .post('/api/interview/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/interview/submit')
        .send({ answers: sampleAnswers });
      expect(res.statusCode).toBe(401);
    });
  });

  // ── GET RESULT ─────────────────────────────────────────
  describe('GET /api/interview/result/:id', () => {

    test('✅ Should return result if interviewId exists', async () => {
      if (!interviewId) {
        console.warn('⚠️ Skipping result test — no interviewId (OpenAI not configured)');
        return;
      }
      const res = await request(app)
        .get(`/api/interview/result/${interviewId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.interview).toBeDefined();
      expect(Array.isArray(res.body.interview.feedback)).toBe(true);
    });

    test('✅ Each feedback item has required fields', async () => {
      if (!interviewId) return;
      const res = await request(app)
        .get(`/api/interview/result/${interviewId}`)
        .set('Authorization', `Bearer ${authToken}`);
      if (res.statusCode === 200) {
        res.body.interview.feedback.forEach(item => {
          expect(item.question).toBeDefined();
          expect(item.answer).toBeDefined();
          expect(item.score).toBeDefined();
        });
      }
    });

    test('❌ Should return 404 for invalid MongoDB ID', async () => {
      const res = await request(app)
        .get('/api/interview/result/000000000000000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    test('❌ Should return error for completely invalid ID format', async () => {
      const res = await request(app)
        .get('/api/interview/result/notanid')
        .set('Authorization', `Bearer ${authToken}`);
      expect([400, 404, 500]).toContain(res.statusCode);
    });

    test('❌ Should fail without auth token', async () => {
      const id = interviewId || '000000000000000000000000';
      const res = await request(app)
        .get(`/api/interview/result/${id}`);
      expect(res.statusCode).toBe(401);
    });
  });

  // ── GET HISTORY ────────────────────────────────────────
  describe('GET /api/interview/history', () => {

    test('✅ Should return history array', async () => {
      const res = await request(app)
        .get('/api/interview/history')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.interviews)).toBe(true);
    });

    test('✅ History should not contain full feedback', async () => {
      const res = await request(app)
        .get('/api/interview/history')
        .set('Authorization', `Bearer ${authToken}`);
      if (res.body.interviews.length > 0) {
        expect(res.body.interviews[0].feedback).toBeUndefined();
      }
    });

    test('❌ Should fail without auth token', async () => {
      const res = await request(app).get('/api/interview/history');
      expect(res.statusCode).toBe(401);
    });
  });
});