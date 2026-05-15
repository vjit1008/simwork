import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import GeminiRankInsight from '../components/GeminiRankInsight';

export default function Leaderboard() {
  const { user } = useAuth();
  const [board, setBoard]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/leaderboard')
      .then(r => setBoard(r.data.leaderboard))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const me = board.find(u => u.name === user?.name);
  const myRank = me?.rank || board.length + 1;
  const topXP  = board[0]?.xp || 0;

  const medal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>🏆 Leaderboard</h2>
          <p style={s.sub}>Top performers this month</p>
        </div>
        {me && (
          <div style={s.myRank}>
            <span style={s.myRankNum}>{medal(myRank)}</span>
            <span style={s.myRankLabel}>Your rank</span>
          </div>
        )}
      </div>

      {/* Gemini AI Insight */}
      <GeminiRankInsight
        userRank={myRank}
        totalUsers={board.length}
        userXP={user?.xp || 0}
        topXP={topXP}
      />

      {loading ? (
        <div style={s.empty}>Loading leaderboard...</div>
      ) : board.length === 0 ? (
        <div style={s.empty}>No users yet. Be the first to earn XP!</div>
      ) : (
        <div style={s.table}>
          {board.map((u, i) => {
            const isMe = u.name === user?.name;
            return (
              <div key={u.id} style={{ ...s.row, ...(isMe ? s.meRow : {}) }}>
                <span style={s.rank}>{medal(u.rank)}</span>
                <div style={{ ...s.dot, background: u.avatarColor }}>
                  {u.avatar}
                </div>
                <div style={s.info}>
                  <span style={s.name}>
                    {u.name} {isMe && <span style={s.youTag}>(you)</span>}
                  </span>
                  <span style={s.role}>{u.role || 'SimWork User'}</span>
                </div>
                <div style={s.xpBlock}>
                  <span style={s.xp}>{u.xp.toLocaleString()} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page:       { padding: '24px 28px', maxWidth: 800, margin: '0 auto' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title:      { fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  sub:        { fontSize: 13, color: 'var(--muted2)' },
  myRank:     { background: 'var(--s2)', borderRadius: 12, padding: '10px 20px', textAlign: 'center', border: '1px solid var(--border2)' },
  myRankNum:  { display: 'block', fontSize: 24, fontWeight: 800, color: '#7C6EFA' },
  myRankLabel:{ fontSize: 11, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '.05em' },
  empty:      { textAlign: 'center', padding: 60, color: 'var(--muted2)', fontSize: 14 },
  table:      { display: 'flex', flexDirection: 'column', gap: 8 },
  row:        { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--s2)', borderRadius: 12, border: '1px solid var(--border2)' },
  meRow:      { border: '1px solid #7C6EFA', background: 'rgba(124,110,250,.08)' },
  rank:       { width: 36, textAlign: 'center', fontSize: 18, fontWeight: 700, color: 'var(--text)', flexShrink: 0 },
  dot:        { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 },
  info:       { flex: 1 },
  name:       { display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 },
  role:       { fontSize: 12, color: 'var(--muted2)' },
  youTag:     { fontSize: 11, color: '#7C6EFA', fontWeight: 700 },
  xpBlock:    { textAlign: 'right' },
  xp:         { fontSize: 15, fontWeight: 700, color: '#34D399' },
};