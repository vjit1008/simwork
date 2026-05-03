const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User      = require('../models/User');
const Interview = require('../models/Interview');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('📦 MODEL TESTS', () => {

  describe('User Model', () => {

    test('✅ Should hash password before saving', async () => {
      const email = `hash_${Date.now()}@test.com`;
      const user  = new User({ name:'Hash Test', email, password:'plaintext123' });
      await user.save();
      const saved = await User.findById(user._id).select('+password');
      expect(saved.password).not.toBe('plaintext123');
      expect(saved.password).toMatch(/^\$2[ab]\$/);
      await User.deleteOne({ _id: user._id });
    });

    test('✅ comparePassword returns true for correct password', async () => {
      const email = `cmp_${Date.now()}@test.com`;
      const user  = new User({ name:'Compare', email, password:'mypassword' });
      await user.save();
      const saved = await User.findById(user._id).select('+password');
      const match = await saved.comparePassword('mypassword');
      expect(match).toBe(true);
      await User.deleteOne({ _id: user._id });
    });

    test('✅ comparePassword returns false for wrong password', async () => {
      const email = `wrong_${Date.now()}@test.com`;
      const user  = new User({ name:'Wrong', email, password:'correctpass' });
      await user.save();
      const saved = await User.findById(user._id).select('+password');
      const match = await saved.comparePassword('wrongpass');
      expect(match).toBe(false);
      await User.deleteOne({ _id: user._id });
    });

    test('✅ Password NOT returned by default query', async () => {
      const email = `nopass_${Date.now()}@test.com`;
      const user  = new User({ name:'NoPass', email, password:'secret' });
      await user.save();
      const found = await User.findOne({ email });
      expect(found.password).toBeUndefined();
      await User.deleteOne({ _id: user._id });
    });

    test('✅ User has timestamps', async () => {
      const email = `ts_${Date.now()}@test.com`;
      const user  = new User({ name:'Timestamp', email, password:'pass123' });
      await user.save();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      await User.deleteOne({ _id: user._id });
    });

    test('❌ Should fail without name', async () => {
      const user = new User({ email:'noname@test.com', password:'123456' });
      await expect(user.save()).rejects.toThrow();
    });

    test('❌ Should fail with duplicate email', async () => {
  const email = `dup_${Date.now()}@test.com`;
  const user1 = new User({ name:'User1', email, password:'pass123' });
  await user1.save();
  const user2 = new User({ name:'User2', email, password:'pass456' });
  await expect(user2.save()).rejects.toThrow();
  await User.deleteOne({ _id: user1._id });
});
  });

  describe('Interview Model', () => {

    let testUserId;

    beforeAll(async () => {
      const u = new User({
        name: 'IntModel',
        email: `intmodel_${Date.now()}@test.com`,
        password: 'pass123'
      });
      await u.save();
      testUserId = u._id;
    });

    afterAll(async () => {
      await User.deleteOne({ _id: testUserId });
    });

    test('✅ Should create interview with all fields', async () => {
      const interview = new Interview({
        userId: testUserId,
        role: 'Software Developer',
        questions: ['Q1', 'Q2'],
        answers:   ['A1', 'A2'],
        feedback: [
          { question:'Q1', answer:'A1', score:8, feedback:'Good', improvement:'Better' },
          { question:'Q2', answer:'A2', score:7, feedback:'OK',   improvement:'More'   },
        ],
        totalScore: 7.5,
        status: 'completed',
      });
      const saved = await interview.save();
      expect(saved._id).toBeDefined();
      expect(saved.totalScore).toBe(7.5);
      expect(saved.status).toBe('completed');
      await Interview.deleteOne({ _id: saved._id });
    });

    test('✅ Default status should be completed', async () => {
      const interview = new Interview({
        userId: testUserId,
        questions: ['Q1'],
        answers:   ['A1'],
        feedback: [{ question:'Q1', answer:'A1', score:5, feedback:'ok', improvement:'more' }],
        totalScore: 5,
      });
      const saved = await interview.save();
      expect(saved.status).toBe('completed');
      await Interview.deleteOne({ _id: saved._id });
    });

    test('✅ Interview has createdAt timestamp', async () => {
      const interview = new Interview({
        userId: testUserId,
        questions: ['Q'],
        answers:   ['A'],
        feedback: [{ question:'Q', answer:'A', score:5, feedback:'ok', improvement:'more' }],
        totalScore: 5,
      });
      const saved = await interview.save();
      expect(saved.createdAt).toBeDefined();
      await Interview.deleteOne({ _id: saved._id });
    });

    test('❌ Should fail without userId', async () => {
      const interview = new Interview({
        questions:['Q'], answers:['A'], totalScore:5,
        feedback:[{ question:'Q', answer:'A', score:5, feedback:'ok', improvement:'more' }],
      });
      await expect(interview.save()).rejects.toThrow();
    });

    test('❌ Score should not exceed 10', async () => {
      const interview = new Interview({
        userId: testUserId,
        questions:['Q'], answers:['A'],
        feedback:[{ question:'Q', answer:'A', score:15, feedback:'x', improvement:'y' }],
        totalScore: 15,
      });
      await expect(interview.save()).rejects.toThrow();
    });
  });
});