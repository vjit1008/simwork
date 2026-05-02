const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Interview = require('../models/Interview');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const HR_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Why are you interested in this Software Developer role?",
  "Describe a challenging project you worked on and how you handled it.",
  "How do you prioritize tasks when working on multiple projects?",
  "Tell me about a time you worked in a team and faced a conflict. How did you resolve it?",
  "What are your greatest technical strengths and weaknesses?",
  "Where do you see yourself professionally in the next 3–5 years?",
  "Describe a situation where you had to learn a new technology quickly.",
  "How do you handle tight deadlines and pressure?",
  "Do you have any questions for us?"
];

// Auth middleware inline
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found.' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

router.get('/questions', protect, async (req, res) => {
  res.json({ success: true, role: 'Software Developer', questions: HR_QUESTIONS });
});

router.get('/history', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .select('role totalScore status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, interviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/result/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, interview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length !== HR_QUESTIONS.length) {
      return res.status(400).json({ success: false, message: 'Invalid answers.' });
    }

    const evalPrompt = HR_QUESTIONS.map((q, i) =>
      `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || '(no answer)'}`
    ).join('\n\n');

    const systemPrompt = `You are an expert HR evaluator. Evaluate each interview answer and respond ONLY in this exact JSON format, no extra text:
{"evaluations":[{"score":<0-10>,"feedback":"<brief feedback>","improvement":"<one actionable tip>"}],"totalScore":<average 0-10>}`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: evalPrompt }
      ],
      temperature: 0.4,
      max_tokens: 1200
    });

    let parsed;
    try {
      parsed = JSON.parse(aiResponse.choices[0].message.content.trim());
    } catch {
      return res.status(500).json({ success: false, message: 'AI response parsing failed.' });
    }

    const feedbackItems = HR_QUESTIONS.map((q, i) => ({
      question: q,
      answer: answers[i] || '',
      score: parsed.evaluations[i]?.score ?? 0,
      feedback: parsed.evaluations[i]?.feedback ?? '',
      improvement: parsed.evaluations[i]?.improvement ?? ''
    }));

    const interview = await Interview.create({
      userId: req.user._id,
      role: 'Software Developer',
      questions: HR_QUESTIONS,
      answers,
      feedback: feedbackItems,
      totalScore: parsed.totalScore,
      status: 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Interview submitted.',
      interviewId: interview._id,
      totalScore: interview.totalScore
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;