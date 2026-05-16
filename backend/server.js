/**
 * SimWork — Simulate Before You Apply
 * Copyright (c) 2025 Vishvajit Gadakari. All rights reserved.
 */

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
require('express-async-errors');

dotenv.config();

console.log('🔧 ENV check:', {
  MONGO_URI:  process.env.MONGO_URI  ? '✅ set' : '❌ MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ MISSING',
  NODE_ENV:   process.env.NODE_ENV   || 'undefined',
  PORT:       process.env.PORT       || 5000,
});

// ── Load routes ───────────────────────────────────────────────
const authRoutes          = require('./routes/authRoutes');
const interviewRoutes     = require('./routes/interviewRoutes');
const projectRoutes       = require('./routes/projectRoutes');
const channelRoutes       = require('./routes/channelRoutes');
const notificationRoutes  = require('./routes/notificationRoutes');
const userRoutes          = require('./routes/userRoutes');
const leaderboardRoutes   = require('./routes/leaderboardRoutes');
const { errorHandler }    = require('./middleware/errorMiddleware');

const app = express();

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000',
  process.env.CLIENT_URL,
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

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/interview',     interviewRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/channels',      channelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/leaderboard',   leaderboardRoutes);

app.get('/health', (req, res) => res.json({
  status: 'OK',
  timestamp: new Date(),
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
}));

app.get('/ping', (req, res) => res.json({ ok: true, time: new Date() }));

app.use(errorHandler);

// ── Start server — always, on both local and Render ───────────
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined — cannot start.');
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected to:', mongoose.connection.host);
      console.log('✅ DB name:', mongoose.connection.name);
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;