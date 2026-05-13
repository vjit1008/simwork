// src/components/ai/AIProjectIdeas.jsx
// Drop this into your Projects page — it adds a Gemini-powered idea generator

import { useState } from "react";
import { getProjectIdeas } from "../../services/GeminiService.js";

const ROLES = ["Software Developer", "Data Analyst", "UI/UX Designer", "Project Manager", "DevOps Engineer", "Marketing Specialist"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function AIProjectIdeas() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!role || !skills.trim()) {
      setError("Please select a role and enter your skills.");
      return;
    }
    setError("");
    setLoading(true);
    setIdeas(null);
    try {
      const result = await getProjectIdeas({ role, skills, difficulty });
      setIdeas(result.ideas);
    } catch (e) {
      setError("Failed to generate ideas. Check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.aiChip}>✦ Gemini AI</span>
        <h2 style={styles.title}>Project Idea Generator</h2>
        <p style={styles.subtitle}>Tell us your role & skills, get 4 tailored project ideas instantly.</p>
      </div>

      {/* Form */}
      <div style={styles.form}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Your Role</label>
            <select style={styles.select} value={role} onChange={e => setRole(e.target.value)}>
              <option value="">Select role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Difficulty</label>
            <div style={styles.pillGroup}>
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  style={{ ...styles.pill, ...(difficulty === d ? styles.pillActive : {}) }}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Skills (comma-separated)</label>
          <input
            style={styles.input}
            placeholder="e.g. React, Node.js, REST APIs"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <span>⟳ Generating ideas…</span>
          ) : (
            <span>✦ Generate Project Ideas</span>
          )}
        </button>
      </div>

      {/* Results */}
      {ideas && (
        <div style={styles.results}>
          <p style={styles.resultsLabel}>4 ideas for <strong>{role}</strong> · {difficulty}</p>
          <div style={styles.grid}>
            {ideas.map((idea, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.cardNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={styles.cardHours}>~{idea.estimatedHours}h</span>
                </div>
                <h3 style={styles.cardTitle}>{idea.title}</h3>
                <p style={styles.cardDesc}>{idea.description}</p>

                <div style={styles.tags}>
                  {idea.tags?.map(t => (
                    <span key={t} style={styles.tag}>{t}</span>
                  ))}
                </div>

                <div style={styles.outcomes}>
                  <p style={styles.outcomesLabel}>You'll learn</p>
                  <ul style={styles.outcomesList}>
                    {idea.learningOutcomes?.map((o, j) => (
                      <li key={j} style={styles.outcomeItem}>→ {o}</li>
                    ))}
                  </ul>
                </div>

                <button
                  style={styles.startBtn}
                  onClick={() => alert(`Starting project: ${idea.title}`)}
                >
                  Start this project
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "#0f1117",
    border: "1px solid #1e2330",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "28px",
    color: "#e8eaf0",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: { marginBottom: "24px" },
  aiChip: {
    display: "inline-block",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "3px 10px",
    borderRadius: "100px",
    marginBottom: "10px",
  },
  title: { margin: "0 0 6px", fontSize: "20px", fontWeight: 700, color: "#fff" },
  subtitle: { margin: 0, fontSize: "14px", color: "#6b7280" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  formRow: { display: "flex", gap: "14px", flexWrap: "wrap" },
  formGroup: { flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" },
  select: {
    background: "#161b27", border: "1px solid #2d3448", borderRadius: "8px",
    color: "#e8eaf0", padding: "10px 12px", fontSize: "14px", outline: "none",
  },
  input: {
    background: "#161b27", border: "1px solid #2d3448", borderRadius: "8px",
    color: "#e8eaf0", padding: "10px 12px", fontSize: "14px", outline: "none",
  },
  pillGroup: { display: "flex", gap: "6px", flexWrap: "wrap" },
  pill: {
    background: "#161b27", border: "1px solid #2d3448", borderRadius: "100px",
    color: "#9ca3af", padding: "6px 14px", fontSize: "13px", cursor: "pointer",
    transition: "all 0.15s",
  },
  pillActive: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "1px solid transparent", color: "#fff",
  },
  btn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "none", borderRadius: "10px", color: "#fff",
    padding: "12px 24px", fontSize: "14px", fontWeight: 700,
    cursor: "pointer", alignSelf: "flex-start", letterSpacing: "0.02em",
  },
  error: { color: "#ef4444", fontSize: "13px", margin: 0 },
  results: { marginTop: "28px" },
  resultsLabel: { color: "#6b7280", fontSize: "13px", marginBottom: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },
  card: {
    background: "#161b27", border: "1px solid #2d3448", borderRadius: "12px",
    padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardNum: { fontSize: "28px", fontWeight: 800, color: "#2d3448", lineHeight: 1 },
  cardHours: {
    background: "#0f1117", border: "1px solid #2d3448", borderRadius: "100px",
    padding: "3px 10px", fontSize: "11px", color: "#6b7280",
  },
  cardTitle: { margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.3 },
  cardDesc: { margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: 1.6 },
  tags: { display: "flex", gap: "6px", flexWrap: "wrap" },
  tag: {
    background: "#0f1117", border: "1px solid #2d3448",
    borderRadius: "100px", padding: "3px 10px", fontSize: "11px", color: "#818cf8",
  },
  outcomes: {},
  outcomesLabel: { margin: "0 0 4px", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  outcomesList: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "3px" },
  outcomeItem: { fontSize: "12px", color: "#a5b4fc" },
  startBtn: {
    marginTop: "auto", background: "transparent",
    border: "1px solid #4f46e5", borderRadius: "8px",
    color: "#818cf8", padding: "8px", fontSize: "13px",
    fontWeight: 600, cursor: "pointer",
  },
};