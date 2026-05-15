import { useState } from 'react';
import { askGemini } from '../api/gemini';
import { useAuth } from '../context/AuthContext';

export default function GeminiRankInsight({ userRank, totalUsers, userXP, topXP }) {
  const { user } = useAuth();
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    const prompt = `A student on SimWork (job simulation platform) has:
- Current rank: #${userRank} out of ${totalUsers} users
- Their XP: ${userXP}
- Top player XP: ${topXP}
- Their role: ${user?.role || 'Software Developer'}
- Skills: ${Array.isArray(user?.skills) ? user.skills.join(', ') : 'not specified'}

Give them:
1. A motivational one-liner about their rank
2. Exactly what they need to do to reach the top 3 (specific tasks/stages)
3. One skill they should focus on this week

Keep it personal, specific, and under 120 words. Be encouraging but honest.`;

    const result = await askGemini(prompt);
    setInsight(result);
    setLoading(false);
    setGenerated(true);
  };

  return (
    <div style={s.box}>
      <div style={s.top}>
        <div>
          <div style={s.title}>🤖 Your AI Rank Insight</div>
          <div style={s.sub}>Personalised advice to climb the leaderboard</div>
        </div>
        <span style={s.badge}>Gemini</span>
      </div>

      {!generated ? (
        <button style={s.btn} onClick={generate} disabled={loading}>
          {loading ? '⏳ Analysing your rank...' : '✨ Get My Personalised Insight'}
        </button>
      ) : (
        <>
          <div style={s.result}>
            <pre style={s.pre}>{insight}</pre>
          </div>
          <button style={s.refresh} onClick={generate} disabled={loading}>
            🔄 Refresh insight
          </button>
        </>
      )}
    </div>
  );
}

const s = {
  box:     { background: 'var(--s2)', borderRadius: 14, padding: 20, border: '1px solid var(--border2)', marginBottom: 20 },
  top:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  title:   { fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  sub:     { fontSize: 12, color: 'var(--muted2)' },
  badge:   { fontSize: 10, background: '#4285F4', color: '#fff', padding: '3px 10px', borderRadius: 10, fontWeight: 600, flexShrink: 0 },
  btn:     { width: '100%', padding: '11px 0', background: 'linear-gradient(135deg,#7C6EFA,#4285F4)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  result:  { background: 'var(--bg)', borderRadius: 10, padding: 14, marginBottom: 10 },
  pre:     { margin: 0, fontFamily: 'inherit', fontSize: 13, color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 },
  refresh: { background: 'none', border: '1px solid var(--border2)', borderRadius: 8, padding: '6px 14px', color: 'var(--muted2)', cursor: 'pointer', fontSize: 12 },
};