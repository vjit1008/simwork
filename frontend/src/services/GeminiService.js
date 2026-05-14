// src/services/geminiService.js
// Centralized Gemini API service for SimWork

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt, systemInstruction = "") {
  const response = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: systemInstruction
        ? { parts: [{ text: systemInstruction }] }
        : undefined,
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    if (response.status === 429) {
      throw new Error("Rate limit reached. Please wait a moment and try again.");
    }
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── Projects Page ─────────────────────────────────────────────────────────────

export async function getProjectIdeas({ role, skills, difficulty }) {
  const system = `You are SimWork's AI project advisor. SimWork is a workplace simulation platform where users practice real-world tasks. Generate practical, engaging project ideas tailored to the user's role and skill level. Always respond with valid JSON only.`;

  const prompt = `Generate 4 unique project ideas for:
- Role: ${role}
- Skills: ${skills}
- Difficulty: ${difficulty}

Return ONLY this JSON (no markdown, no explanation):
{
  "ideas": [
    {
      "title": "Project title",
      "description": "2-sentence description",
      "tags": ["tag1", "tag2"],
      "estimatedHours": 4,
      "learningOutcomes": ["outcome1", "outcome2"]
    }
  ]
}`;

  const raw = await callGemini(prompt, system);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ── Simulation Page ────────────────────────────────────────────────────────────

export async function getSimulationHint({ taskDescription, currentProgress, role }) {
  const system = `You are SimWork's AI simulation coach. Help users complete workplace simulation tasks without giving away the answer directly. Be encouraging and concise.`;

  const prompt = `A user is stuck on a simulation task.
Role: ${role}
Task: ${taskDescription}
Current progress: ${currentProgress || "Just started"}

Provide:
1. One helpful hint (not the full answer)
2. A motivational tip
3. What skill this builds

Keep it under 150 words and conversational.`;

  return callGemini(prompt, system);
}

export async function evaluateSimulationAnswer({ taskDescription, userAnswer, role, rubric }) {
  const system = `You are SimWork's AI evaluator. Score workplace simulation answers fairly and constructively. Always respond with valid JSON only.`;

  const prompt = `Evaluate this simulation answer:
Task: ${taskDescription}
Role: ${role}
User's answer: ${userAnswer}
Rubric: ${rubric || "Quality, completeness, professionalism"}

Return ONLY this JSON:
{
  "score": 85,
  "grade": "B+",
  "feedback": "Overall feedback paragraph",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "nextSteps": "One sentence on what to practice next"
}`;

  const raw = await callGemini(prompt, system);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ── Leaderboard Page ──────────────────────────────────────────────────────────

export async function getLeaderboardInsights({ userData, topUsers, userRank }) {
  const system = `You are SimWork's AI performance coach. Analyze leaderboard data and give personalized, motivating insights. Be specific and data-driven.`;

  const prompt = `Analyze this user's leaderboard performance:
User score: ${userData.score}
User rank: ${userRank}
User's role: ${userData.role}
Top 3 users scores: ${topUsers.slice(0, 3).map(u => u.score).join(", ")}
Points gap to next rank: ${userData.pointsToNextRank || "N/A"}

Give:
1. A 2-sentence performance analysis
2. Two specific tips to climb the leaderboard
3. One motivational insight

Keep it personal and under 120 words.`;

  return callGemini(prompt, system);
}

export async function getChallengeRecommendation({ userScore, completedChallenges, role }) {
  const system = `You are SimWork's AI challenge curator. Recommend the perfect next challenge based on user performance. Always respond with valid JSON only.`;

  const prompt = `Recommend the best next challenge for:
Score: ${userScore}
Role: ${role}
Completed: ${completedChallenges.join(", ") || "None yet"}

Return ONLY this JSON:
{
  "challengeName": "Challenge title",
  "reason": "Why this challenge fits",
  "difficulty": "Intermediate",
  "estimatedPoints": 150,
  "skillsFocused": ["skill1", "skill2"]
}`;

  const raw = await callGemini(prompt, system);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}   