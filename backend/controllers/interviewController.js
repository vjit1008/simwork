const OpenAI = require('openai');
const Interview = require('../models/Interview');

//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

const getQuestions = async (req, res) => {
  res.json({ success: true, role: 'Software Developer', questions: HR_QUESTIONS });
};

const submitInterview = async (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ success: false, message: 'Answers array is required.' });
  }

  let parsed;

  /*
  ============================================================
  REAL OPENAI EVALUATION - Uncomment when credits are available
  ============================================================

  const evalPrompt = HR_QUESTIONS.map((q, i) =>
    `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || '(no answer)'}`
  ).join('\n\n');

  const systemPrompt = `You are an expert HR evaluator. Evaluate each interview answer and respond ONLY in this exact JSON format, no extra text:
{
  "evaluations": [
    { "score": <0-10>, "feedback": "<brief feedback>", "improvement": "<one actionable tip>" }
  ],
  "totalScore": <average score 0-10>
}`;

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: evalPrompt }
    ],
    temperature: 0.4,
    max_tokens: 1200
  });

  parsed = JSON.parse(aiResponse.choices[0].message.content.trim());

  ============================================================
  END OPENAI BLOCK
  ============================================================
  */

  // MOCK EVALUATION - Remove this block when OpenAI credits are available
  const scores = answers.map(a => {
    const words = a.trim().split(/\s+/).filter(Boolean).length;
    if (words >= 50) return Math.floor(Math.random() * 2) + 8;
    if (words >= 30) return Math.floor(Math.random() * 2) + 6;
    if (words >= 10) return Math.floor(Math.random() * 2) + 4;
    return Math.floor(Math.random() * 2) + 2;
  });

  const feedbacks = [
    "Good answer! You communicated your thoughts clearly and concisely.",
    "Solid response. You showed good self-awareness and relevant experience.",
    "Nice answer. You highlighted your skills well.",
    "Good effort. Your response shows enthusiasm for the role.",
    "Well structured answer with relevant examples.",
  ];

  const improvements = [
    "Use the STAR method (Situation, Task, Action, Result) for more structure.",
    "Add specific metrics or numbers to quantify your achievements.",
    "Include a concrete example from your past experience.",
    "Elaborate more on the outcome and what you learned.",
    "Try to connect your answer more directly to the role requirements.",
  ];

  parsed = {
    evaluations: HR_QUESTIONS.map((_, i) => ({
      score: scores[i],
      feedback: feedbacks[i % feedbacks.length],
      improvement: improvements[i % improvements.length]
    })),
    totalScore: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
  };
  // END MOCK BLOCK

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
    message: 'Interview submitted and evaluated.',
    interviewId: interview._id,
    totalScore: interview.totalScore
  });
};

const getResult = async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview result not found.' });
  }

  res.json({ success: true, interview });
};

const getHistory = async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id })
    .select('role totalScore status createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ success: true, interviews });
};

module.exports = { getQuestions, submitInterview, getResult, getHistory };