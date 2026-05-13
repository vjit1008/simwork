// src/components/ai/AISimulationCoach.jsx
// Add this floating panel to your Simulation page

import { useState } from "react";
import { getSimulationHint, evaluateSimulationAnswer } from "../../services/geminiService";

export default function AISimulationCoach({ task, role = "Employee" }) {
  // task = { id, description, rubric }  — pass from your simulation state
  const [tab, setTab] = useState("hint");
  const [hint, setHint] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function fetchHint() {
    setLoading(true);
    setHint("");
    try {
      const h = await getSimulationHint({
        taskDescription: task?.description || "Complete the simulation task",
        currentProgress: progress,
        role,
      });
      setHint(h);
    } catch {
      setHint("Could not load hint. Check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  }

  async function submitForEval() {
    if (!answer.trim()) return;
    setLoading(true);
    setEvaluation(null);
    try {
      const ev = await evaluateSimulationAnswer({
        taskDescription: task?.description || "Complete the simulation task",
        userAnswer: answer,
        role,
        rubric: task?.rubric,
      });
      setEvaluation(ev);
    } catch {
      setEvaluation({ feedback: "Evaluation failed. Check your Gemini API key.", score: 0 });
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button style={styles.fab} onClick={() => setOpen(true)} title="AI Coach">
        <span style={{ fontSize: "20px" }}>✦</span>
        <span style={{ fontSize: "12px", fontWeight: 700 }}>AI Coach</span>
      </button>
    );
  }

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.panelHeader}>
        <div>
          <span style={styles.aiChip}>✦ Gemini AI</span>
          <h3 style={styles.panelTitle}>Simulation Coach</h3>
        </div>
        <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["hint", "evaluate"].map(t => (
          <button
            key={t}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t === "hint" ? "💡 Get Hint" : "📋 Evaluate"}
          </button>
        ))}
      </div>

      {/* Hint Tab */}
      {tab === "hint" && (
        <div style={styles.tabContent}>
          <label style={styles.label}>What have you tried so far? (optional)</label>
          <textarea
            style={styles.textarea}
            rows={2}
            placeholder="Describe your current approach…"
            value={progress}
            onChange={e => setProgress(e.target.value)}
          />
          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            onClick={fetchHint}
            disabled={loading}
          >
            {loading ? "Thinking…" : "Get AI Hint"}
          </button>
          {hint && (
            <div style={styles.hintBox}>
              <p style={styles.hintLabel}>💡 Hint</p>
              <p style={styles.hintText}>{hint}</p>
            </div>
          )}
        </div>
      )}

      {/* Evaluate Tab */}
      {tab === "evaluate" && (
        <div style={styles.tabContent}>
          <label style={styles.label}>Your answer / work</label>
          <textarea
            style={styles.textarea}
            rows={5}
            placeholder="Paste your solution, explanation, or work here…"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
          <button
            style={{ ...styles.btn, opacity: loading || !answer.trim() ? 0.7 : 1 }}
            onClick={submitForEval}
            disabled={loading || !answer.trim()}
          >
            {loading ? "Evaluating…" : "Submit for AI Review"}
          </button>

          {evaluation && (
            <div style={styles.evalBox}>
              {/* Score */}
              <div style={styles.scoreRow}>
                <div style={styles.scoreCircle}>
                  <span style={styles.scoreNum}>{evaluation.score}</span>
                  <span style={styles.scoreMax}>/100</span>
                </div>
                <div>
                  <div style={styles.grade}>{evaluation.grade}</div>
                  <p style={styles.evalFeedback}>{evaluation.feedback}</p>
                </div>
              </div>

              {/* Strengths */}
              {evaluation.strengths?.length > 0 && (
                <div style={styles.evalSection}>
                  <p style={styles.evalSectionLabel}>✅ Strengths</p>
                  <ul style={styles.evalList}>
                    {evaluation.strengths.map((s, i) => <li key={i} style={styles.evalListItem}>{s}</li>)}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {evaluation.improvements?.length > 0 && (
                <div style={styles.evalSection}>
                  <p style={styles.evalSectionLabel}>🎯 Improve</p>
                  <ul style={styles.evalList}>
                    {evaluation.improvements.map((s, i) => <li key={i} style={styles.evalListItem}>{s}</li>)}
                  </ul>
                </div>
              )}

              {evaluation.nextSteps && (
                <div style={styles.nextSteps}>
                  <span>→ </span>{evaluation.nextSteps}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  fab: {
    position: "fixed", bottom: "24px", right: "24px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "none", borderRadius: "16px", color: "#fff",
    padding: "12px 18px", cursor: "pointer", zIndex: 1000,
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
    boxShadow: "0 8px 32px rgba(79,70,229,0.4)",
  },
  panel: {
    position: "fixed", bottom: "24px", right: "24px",
    width: "340px", maxHeight: "80vh", overflowY: "auto",
    background: "#0f1117", border: "1px solid #1e2330",
    borderRadius: "16px", zIndex: 1000,
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e8eaf0",
    display: "flex", flexDirection: "column",
  },
  panelHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "20px 20px 0",
  },
  aiChip: {
    display: "inline-block",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff", fontSize: "10px", fontWeight: 700,
    letterSpacing: "0.08em", padding: "2px 8px", borderRadius: "100px",
    marginBottom: "6px",
  },
  panelTitle: { margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff" },
  closeBtn: {
    background: "none", border: "none", color: "#6b7280",
    fontSize: "16px", cursor: "pointer", padding: "0",
  },
  tabs: { display: "flex", gap: "8px", padding: "16px 20px 0" },
  tab: {
    flex: 1, background: "#161b27", border: "1px solid #2d3448",
    borderRadius: "8px", color: "#6b7280", padding: "8px",
    fontSize: "13px", cursor: "pointer", fontWeight: 500,
  },
  tabActive: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "1px solid transparent", color: "#fff",
  },
  tabContent: { padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  textarea: {
    background: "#161b27", border: "1px solid #2d3448", borderRadius: "8px",
    color: "#e8eaf0", padding: "10px 12px", fontSize: "13px",
    outline: "none", resize: "vertical", fontFamily: "inherit",
  },
  btn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "none", borderRadius: "8px", color: "#fff",
    padding: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer",
  },
  hintBox: {
    background: "#161b27", border: "1px solid #2d3448",
    borderRadius: "10px", padding: "14px",
  },
  hintLabel: { margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.05em" },
  hintText: { margin: 0, fontSize: "13px", color: "#d1d5db", lineHeight: 1.6 },
  evalBox: { display: "flex", flexDirection: "column", gap: "12px" },
  scoreRow: { display: "flex", gap: "14px", alignItems: "center" },
  scoreCircle: {
    minWidth: "60px", height: "60px", borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  scoreNum: { fontSize: "20px", fontWeight: 800, color: "#fff", lineHeight: 1 },
  scoreMax: { fontSize: "10px", color: "rgba(255,255,255,0.7)" },
  grade: { fontSize: "18px", fontWeight: 800, color: "#a5b4fc", marginBottom: "4px" },
  evalFeedback: { margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.5 },
  evalSection: {},
  evalSectionLabel: { margin: "0 0 4px", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  evalList: { margin: 0, padding: "0 0 0 16px" },
  evalListItem: { fontSize: "12px", color: "#d1d5db", lineHeight: 1.6 },
  nextSteps: {
    background: "#161b27", border: "1px solid #2d3448",
    borderRadius: "8px", padding: "10px 12px",
    fontSize: "12px", color: "#a5b4fc", lineHeight: 1.5,
  },
};