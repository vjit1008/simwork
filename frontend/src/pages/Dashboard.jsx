import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlassCard  from '../components/ui/GlassCard';
import GlowButton  from '../components/ui/GlowButton';
import StatCard    from '../components/ui/StatCard';

const ACTIVITY = [
  { time: '2m ago',  text: 'Completed REST API task',      accent: '#00d4aa', icon: '✓' },
  { time: '1h ago',  text: 'Earned Junior Dev certificate', accent: '#ffb700', icon: '🏅' },
  { time: '3h ago',  text: 'Submitted Middleware Chain',    accent: '#6c63ff', icon: '⬆' },
  { time: '1d ago',  text: 'Started Backend Simulation',    accent: '#7dd3fc', icon: '⚡' },
  { time: '2d ago',  text: 'Joined SimWork platform',       accent: '#a99fff', icon: '⬡' },
];

const QUICK_ACTIONS = [
  { label: 'Continue Sim',   icon: '▶', path: '/ide',          accent: '#6c63ff', bg: 'rgba(108,99,255,.1)'  },
  { label: 'Browse Sims',    icon: '⚡', path: '/simulations',  accent: '#00d4aa', bg: 'rgba(0,212,170,.1)'   },
  { label: 'Leaderboard',    icon: '◈', path: '/leaderboard',  accent: '#ffb700', bg: 'rgba(255,183,0,.1)'   },
  { label: 'My Profile',     icon: '◎', path: '/profile',      accent: '#ff6b6b', bg: 'rgba(255,107,107,.1)' },
];

const SIM_PROGRESS = [
  { title: 'Backend Developer',  stage: 'Junior',    pct: 72, color: '#6c63ff' },
  { title: 'Data Scientist',     stage: 'Locked',    pct: 0,  color: '#3d4d6a' },
  { title: 'UI/UX Designer',     stage: 'Locked',    pct: 0,  color: '#3d4d6a' },
  { title: 'DevOps Engineer',    stage: 'Locked',    pct: 0,  color: '#3d4d6a' },
];

export default function Dashboard() {
  const { user }    = useNavigate();
  const navigate    = useNavigate();
  const { user: u } = useAuth();
  const [tick, setTick] = useState(0);

  /* live pulse every 4 s */
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const greeting =  () => {
  const h = new Date().getHours();
  if (h < 12 && h >= 4) return 'Good morning';
  if (h < 4) return 'It\'s late! Time to rest';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

  return (
    <div style={{ padding: '28px 28px 48px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div className="anim-fade-up" style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 6 }}>
            {greeting()},
          </div>
          <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
            {u?.name || 'Learner'} 👋
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>
            Your simulation journey continues — keep pushing.
          </p>
        </div>
        <GlowButton variant="plasma" onClick={() => navigate('/simulations')}>
          ⚡ Continue Simulation
        </GlowButton>
      </div>

      {/* ── Stats row ── */}
      <div className="anim-fade-up d2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total XP"        value={u?.xp || 0}  unit="xp" trend={12}  trendLabel="this week" icon="⚡" accent="amber"  delay={0}   />
        <StatCard label="Certs Earned"    value={u?.certs?.length || 0} trend={1} trendLabel="new"  icon="🏅" accent="aurora" delay={100} />
        <StatCard label="Tasks Completed" value={24}           trend={8}  trendLabel="this week" icon="✓"  accent="plasma" delay={200} />
        <StatCard label="Global Rank"     value={142}          unit="#"  trend={-5} trendLabel="up" icon="◈" accent="amber"  delay={300} />
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>

          {/* Quick actions */}
          <GlassCard padding="20px" className="anim-fade-up d3">
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              Quick Actions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {QUICK_ACTIONS.map((a, i) => (
                <div key={i} onClick={() => navigate(a.path)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 8, padding: '16px 8px',
                    background: a.bg,
                    border: `1px solid ${a.accent}25`,
                    borderRadius: 12, cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${a.accent}25`;
                    e.currentTarget.style.borderColor = `${a.accent}60`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = `${a.accent}25`;
                  }}>
                  <span style={{ fontSize: 22, color: a.accent }}>{a.icon}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Simulation progress */}
          <GlassCard padding="20px" className="anim-fade-up d4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Simulation Progress
              </div>
              <span onClick={() => navigate('/simulations')}
                style={{ fontSize: 12, color: '#6c63ff', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
                View all →
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SIM_PROGRESS.map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: s.pct === 0 ? 'var(--text-3)' : 'var(--text-1)' }}>{s.title}</span>
                      <span style={{ fontSize: 10, color: s.pct === 0 ? 'var(--text-3)' : s.color, fontFamily: 'var(--font-mono)', marginLeft: 8 }}>
                        {s.stage}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: s.pct === 0 ? 'var(--text-3)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                      {s.pct}%
                    </span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${s.pct}%`,
                      background: s.pct === 0 ? 'var(--rim)' : `linear-gradient(90deg, ${s.color}88, ${s.color})`,
                      boxShadow: s.pct > 0 ? `0 0 8px ${s.color}60` : 'none',
                      transition: 'width 1s var(--ease-expo)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* XP Chart placeholder */}
          <GlassCard padding="20px" className="anim-fade-up d5">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                XP Over Time
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['7D','30D','ALL'].map((t, i) => (
                  <button key={t} style={{
                    padding: '3px 9px', fontSize: 10, borderRadius: 5, border: 'none', cursor: 'pointer',
                    background: i === 0 ? 'rgba(108,99,255,.2)' : 'transparent',
                    color: i === 0 ? '#a99fff' : 'var(--text-3)',
                    fontFamily: 'var(--font-mono)',
                  }}>{t}</button>
                ))}
              </div>
            </div>
            {/* Micro sparkline */}
            <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
              {[20,35,28,50,45,60,72,58,80,75,90,85].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{
                    height: `${h}%`, borderRadius: '3px 3px 0 0',
                    background: `linear-gradient(180deg, rgba(108,99,255,.8), rgba(108,99,255,.2))`,
                    transition: 'height 0.5s var(--ease-expo)',
                    transitionDelay: `${i * 0.04}s`,
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Jan','Feb','Mar','Apr','May','Jun'].map(m => (
                <span key={m} style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{m}</span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* AI status */}
          <GlassCard variant="plasma" padding="18px" className="anim-fade-up d3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#00d4aa',
                boxShadow: '0 0 8px #00d4aa',
                animation: 'pulseGlow 2s infinite',
              }} />
              <span style={{ fontSize: 11, color: '#00d4aa', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                AI SYSTEM ONLINE
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Neural Validator',  status: 'Active',  color: '#00d4aa' },
                { label: 'Code Analyser',     status: 'Active',  color: '#00d4aa' },
                { label: 'Scoring Engine',    status: 'Standby', color: '#ffb700' },
                { label: 'Certificate Gen.',  status: 'Ready',   color: '#6c63ff' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.label}</span>
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    color: item.color,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                    borderRadius: 4, padding: '2px 7px',
                  }}>{item.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Live activity */}
          <GlassCard padding="18px" className="anim-fade-up d4" style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              Recent Activity
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: `${a.accent}18`, border: `1px solid ${a.accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: a.accent,
                  }}>{a.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.4 }}>{a.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Cert badge */}
          {u?.certs?.length > 0 && (
            <GlassCard variant="aurora" padding="18px" className="anim-fade-up d5">
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Latest Certificate
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(0,212,170,.1), rgba(108,99,255,.1))',
                border: '1px solid rgba(0,212,170,.2)', borderRadius: 10,
                padding: '14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🏅</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>
                  {u.certs[u.certs.length - 1]?.title || 'Certificate'}
                </div>
                <div style={{ fontSize: 11, color: '#00d4aa', fontFamily: 'var(--font-mono)' }}>
                  Score: {u.certs[u.certs.length - 1]?.score || 0}/100
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
