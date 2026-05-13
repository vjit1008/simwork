// src/components/ai/AILeaderboardInsights.jsx
// Add this to your Leaderboard page — shows AI-personalized insights

import { useState, useEffect } from "react";
import { getLeaderboardInsights, getChallengeRecommendation } from "../../services/geminiService";

export default function AILeaderboardInsights({ currentUser, topUsers, userRank }) {
  // currentUser = { score, role, completedChallenges, pointsToNextRank }
  // topUsers = [{ username, score }, ...]
  // userRank = number

  const [insights, setInsights] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadInsights() {
    setLoading(true);
    try {
      const [insightText, challengeData] = await Promise.all([
        getLeaderboardInsights({
          userData: currentUser,
          topUsers,
          userRank,
        }),
        getChallengeRecommendation({
          userScore: currentUser.score,
          completedChallenges: currentUser.completedChallenges || [],
          role: currentUser.role,
        }),
      ]);
      setInsights(insightText);
      setChallenge(challengeData);
      setLoaded(true);
    } catch {
      setInsights("Could not load AI insights. Check your Gemini API key.");
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  // Rank badge color
  const rankColor =
    userRank === 1 ? "#fbbf24" :
    userRank === 2 ? "#94a3b8" :
    userRank === 3 ? "#f97316" : "#6b7280";

  return (
    <div style={styles.container}>
      <div style={styles.topRow}>
        {/* Rank card */}
        <div style={styles.rankCard}>
          <p style={styles.rankLabel}>Your Rank</p>
          <div style={{ ...styles.rankBadge, color: rankColor }}>
            #{userRank}
          </div>
          <p style={styles.rankScore}>{currentUser.score?.toLocaleString()} pts</p>
          {currentUser.pointsToNextRank && (
            <p style={styles.rankGap}>
              {currentUser.pointsToNextRank} pts to #{userRank - 1}
            </p>
          )}
        </div>

        {/* AI Insights */}
        <div style={styles.insightCard}>
          <div style={styles.insightHeader}>
            <span style={styles.aiChip}>✦ Gemini AI</span>
            <span style={styles.insightTitle}>Performance Insights</span>
          </div>

          {!loaded && !loading && (
            <button style={styles.btn} onClick={loadInsights}>
              Analyze My Performance
            </button>
          )}

          {loading && (
            <div style={styles.loadingRow}>
              <span style={styles.spinner}>⟳</span>
              <span style={styles.loadingText}>AI is analyzing your performance…</span>
            </div>
          )}

          {loaded && insights && (
            <p style={styles.insightText}>{insights}</p>
          )}
        </div>
      </div>

      {/* Challenge Recommendation */}
      {challenge && (
        <div style={styles.challengeCard}>
          <div style={styles.challengeLeft}>
            <span style={styles.challengeChip}>🎯 Recommended Next Challenge</span>
            <h3 style={styles.challengeName}>{challenge.challengeName}</h3>
            <p style={styles.challengeReason}>{challenge.reason}</p>
            <div style={styles.challengeMeta}>
              <span style={styles.metaBadge}>{challenge.difficulty}</span>
              <span style={styles.metaBadge}>+{challenge.estimatedPoints} pts</span>
              {challenge.skillsFocused?.map(s => (
                <span key={s} style={{ ...styles.metaBadge, background: "#1e1b4b", color: "#a5b4fc" }}>{s}</span>
              ))}
            </div>
          </div>
          <button style={styles.challengeBtn}>
            Start Challenge →
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex", flexDirection: "column", gap: "16px",
    fontFamily: "'DM Sans', sans-serif", color: "#e8eaf0",
    marginBottom: "28px",
  },
  topRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  rankCard: {
    background: "#0f1117", border: "1px solid #1e2330",
    borderRadius: "14px", padding: "24px",
    display: "flex", flexDirection: "column", alignItems: "center",
    minWidth: "140px",
  },
  rankLabel: { margin: "0 0 8px", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  rankBadge: { fontSize: "48px", fontWeight: 900, lineHeight: 1 },
  rankScore: { margin: "8px 0 0", fontSize: "16px", fontWeight: 700, color: "#e8eaf0" },
  rankGap: { margin: "4px 0 0", fontSize: "11px", color: "#6b7280" },
  insightCard: {
    flex: 1, minWidth: "260px",
    background: "#0f1117", border: "1px solid #1e2330",
    borderRadius: "14px", padding: "24px",
  },
  insightHeader: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" },
  aiChip: {
    display: "inline-block",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff", fontSize: "10px", fontWeight: 700,
    letterSpacing: "0.08em", padding: "2px 8px", borderRadius: "100px",
    width: "fit-content",
  },
  insightTitle: { fontSize: "15px", fontWeight: 700, color: "#fff" },
  btn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "none", borderRadius: "8px", color: "#fff",
    padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer",
  },
  loadingRow: { display: "flex", alignItems: "center", gap: "10px" },
  spinner: { fontSize: "18px", color: "#818cf8", animation: "spin 1s linear infinite" },
  loadingText: { fontSize: "13px", color: "#6b7280" },
  insightText: { margin: 0, fontSize: "14px", color: "#d1d5db", lineHeight: 1.7 },
  challengeCard: {
    background: "linear-gradient(135deg, #0f0c29, #1a1060)",
    border: "1px solid #2d2b6b",
    borderRadius: "14px", padding: "24px",
    display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap",
  },
  challengeLeft: { flex: 1 },
  challengeChip: {
    display: "inline-block", fontSize: "11px", fontWeight: 600,
    color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.05em",
    marginBottom: "8px",
  },
  challengeName: { margin: "0 0 6px", fontSize: "18px", fontWeight: 800, color: "#fff" },
  challengeReason: { margin: "0 0 12px", fontSize: "13px", color: "#818cf8", lineHeight: 1.5 },
  challengeMeta: { display: "flex", gap: "8px", flexWrap: "wrap" },
  metaBadge: {
    background: "#161b27", border: "1px solid #2d3448",
    borderRadius: "100px", padding: "3px 10px",
    fontSize: "11px", color: "#9ca3af",
  },
  challengeBtn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "none", borderRadius: "10px", color: "#fff",
    padding: "12px 24px", fontSize: "14px", fontWeight: 700,
    cursor: "pointer", whiteSpace: "nowrap",
  },
};