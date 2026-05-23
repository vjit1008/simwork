import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSim }  from '../context/SimContext';
import { useNavigate } from 'react-router-dom';
import { LEADERBOARD_OTHERS } from '../data/simulations';
import { showToast } from '../components/Toast';
import API from '../api/axios';

export default function Profile() {
  const { user, update } = useAuth();
  const { sims }         = useSim();
  const navigate         = useNavigate();

  // ✅ Always fetch fresh profile from DB on mount
  // Fixes: XP=0, certs=0, education empty after refresh
  const [profile, setProfile] = useState(user);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    API.get('/api/users/me')
      .then(({ data }) => {
        if (data.success && data.user) {
          setProfile(data.user);
          update(data.user); // sync AuthContext too
        }
      })
      .catch(() => {
        setProfile(user); // fallback to local state if offline
      })
      .finally(() => setFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const u        = profile || user;
  const initials = u ? ((u.name||'?')[0]+((u.lname||'')[0]||'')).toUpperCase() : '?';
  const fullName = u ? `${u.name||''} ${u.lname||''}`.trim() : 'User';
  const done     = sims.filter(s => s.status === 'done').length;

  const sorted = [
    { name: fullName, score: u?.xp || 0, isMe: true },
    ...LEADERBOARD_OTHERS,
  ].sort((a, b) => b.score - a.score);
  const myRank = '#' + (sorted.findIndex(e => e.isMe) + 1);

  const card = {
    background: 'var(--s1)', border: '1px solid var(--border)',
    borderRadius: 12, padding: 20, marginBottom: 12,
  };

  // Show skeleton while fetching
  if (fetching) return (
    <div style={{ padding: '28px 32px', flex: 1 }}>
      <div style={{ ...card, borderRadius: 16, height: 140, background: 'var(--s2)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ ...card, height: 80, background: 'var(--s2)', marginBottom: 0, animation: 'pulse 1.5s infinite' }} />)}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </div>
  );

  const skills = Array.isArray(u?.skills)
    ? u.skills
    : (u?.skills || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>

      {/* Header */}
      <div style={{ display:'flex', gap:24, alignItems:'flex-start', marginBottom:24, padding:28, ...card, borderRadius:16, flexWrap:'wrap' }}>
        <div style={{
          width:80, height:80, borderRadius:'50%',
          background: (u?.avatarColor || '#7C6EFA') + '33',
          color: u?.avatarColor || '#7C6EFA',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:28, fontWeight:800,
          border: '3px solid rgba(124,110,250,.3)', flexShrink:0,
        }}>{initials}</div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-.02em', marginBottom:4 }}>{fullName}</h2>
          <div style={{ fontFamily:'var(--mono)', fontSize:13, color:'var(--muted2)', marginBottom:4 }}>✉️ {u?.email}</div>
          <div style={{ fontSize:13, color:'var(--muted2)', marginBottom:12 }}>📍 {u?.city || 'India'}</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {u?.role && (
              <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(124,110,250,.12)', border:'1px solid rgba(124,110,250,.2)', color:'var(--accent)' }}>
                {u.role}
              </span>
            )}
            {skills.slice(0, 4).map(sk => (
              <span key={sk} style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(124,110,250,.12)', border:'1px solid rgba(124,110,250,.2)', color:'var(--accent)' }}>
                {sk}
              </span>
            ))}
            {u?.degree && (
              <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(96,165,250,.1)', border:'1px solid rgba(96,165,250,.2)', color:'var(--sky)' }}>
                🎓 {u.degree}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Profile link copied! 🔗'); }}
          style={{ padding:'10px 20px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>
          Share Profile
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          ['Total XP',     'var(--accent)',  u?.xp || 0],
          ['Sims Done',    'var(--accent2)', done],
          ['Certificates', 'var(--accent3)', (u?.certs || []).length],
          ['Rank',         'var(--rose)',    myRank],
        ].map(([l, c, v]) => (
          <div key={l} style={{ ...card, textAlign:'center', marginBottom:0 }}>
            <div style={{ fontSize:28, fontWeight:800, color:c, letterSpacing:'-.03em' }}>{v}</div>
            <div style={{ fontSize:11, color:'var(--muted2)', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>🎓 Education</div>
      {u?.college ? (
        <div style={{ ...card, display:'flex', gap:16, alignItems:'flex-start' }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'rgba(96,165,250,.1)', border:'1px solid rgba(96,165,250,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🏛️</div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>{u.college}</div>
            <div style={{ fontSize:12, color:'var(--muted2)', marginBottom:4 }}>{u.degree}{u.branch ? ` · ${u.branch}` : ''}</div>
            <div style={{ fontSize:11, color:'var(--accent3)', fontFamily:'var(--mono)' }}>
              {u.gradyear ? `Graduating ${u.gradyear}` : 'Current Student'}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...card, textAlign:'center', color:'var(--muted)', fontSize:13 }}>
          No education info added.{' '}
          <span style={{ color:'var(--accent)', cursor:'pointer' }} onClick={() => navigate('/settings')}>
            Add education →
          </span>
        </div>
      )}

      {/* Certificates */}
      <div style={{ fontSize:14, fontWeight:700, margin:'24px 0 14px' }}>🏅 Certificates Earned</div>
      {!(u?.certs?.length) ? (
        <div style={{ ...card, textAlign:'center', color:'var(--muted)', fontSize:13 }}>
          Complete simulation stages to earn certificates 🏅
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {u.certs.map((c, i) => (
            <div key={i} style={{ ...card, borderTop:`3px solid ${c.color}`, marginBottom:0 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{c.title} Certificate</div>
              <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'var(--mono)', marginBottom:10 }}>{c.date} · {c.id}</div>
              <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:20, background: c.color + '18', color: c.color }}>
                {c.score}/100
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}