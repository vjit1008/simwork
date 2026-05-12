const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const projectRoutes      = require('./routes/projectRoutes');
const channelRoutes      = require('./routes/channelRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
require('express-async-errors');

dotenv.config();

console.log('🔧 ENV check:', {
  MONGO_URI:  process.env.MONGO_URI  ? '✅ set' : '❌ MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ MISSING',
  NODE_ENV:   process.env.NODE_ENV   || 'undefined',
  PORT:       process.env.PORT       || 5000,
});

const authRoutes      = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const userRoutes      = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ✅ FIX 3 — include your deployed Vercel frontend URL via env var
const allowedOrigins = [
  'http://localhost:5173','http://localhost:5174','http://localhost:5175',
  'http://localhost:5176','http://localhost:5177','http://localhost:3000',
  process.env.CLIENT_URL,       // e.g. https://simwork.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`⚠️  CORS blocked origin: ${origin}`);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/interview',     interviewRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/channels',      channelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user',          userRoutes);

app.get('/health', (req, res) => res.json({
  status: 'OK', timestamp: new Date(),
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
}));

app.use(errorHandler);

// ✅ FIX 2 — cache the connection across serverless invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGO_URI) {
    // ✅ FIX 1 — throw instead of process.exit() so Vercel can return a 500
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('✅ MongoDB connected to:', mongoose.connection.host);
  console.log('✅ DB name:', mongoose.connection.name);
}

// Local dev only — Vercel ignores app.listen() and uses module.exports
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
    .catch((err) => {
      console.error('❌ Startup failed:', err.message);
      process.exit(1); // safe here — only runs locally, not on Vercel
    });
}

// ✅ Wrap app to ensure DB is connected before handling any request on Vercel
const serverlessApp = async (req, res) => {
  await connectDB();
  return app(req, res);
};

module.exports = serverlessApp;