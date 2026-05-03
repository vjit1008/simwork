const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
require('express-async-errors');

dotenv.config();

const authRoutes      = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
  ],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/interview', interviewRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use(errorHandler);

// ✅ Only start server if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

// ✅ Export app for Jest/Supertest
module.exports = app;