import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NeuralTopbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [search,  setSearch]  = useState('');
  const [focused, setFocused] = useState(false);
  const xpRef = useRef(user?.xp || 0);

  const XP_NEXT = 500;
  const xpPct   = Math.min(((user?.xp || 0) / XP_NEXT) * 100, 100);

  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 14,
      background: 'rgba(6,9,18,.9)',
      borderBottom: '1px solid rgba(255,255,255,.05)',
      backdropFilter: 'blur(20px)',
      flexShrink: 0, position: 'relative', zIndex: 50,
    }}>

      {/* Mobile menu toggle */}
      <button onClick={onMenuClick}
        className="mobile-menu-btn"
        style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 18, padding: 4, display: 'none' }}>
        ☰
      </button>

      {/* Breadcrumb / page title */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          SIMWORK / {window.location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD'}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search simulations, tasks..."
          style={{
            width: focused ? 240 : 180,
            padding: '7px 14px 7px 32px',
            background: focused ? 'rgba(108,99,255,.08)' : 'rgba(255,255,255,.04)',
            border: `1px solid ${focused ? 'rgba(108,99,255,.4)' : 'rgba(255,255,255,.07)'}`,
            borderRadius: 8,
            color: 'var(--text-1)',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            outline: 'none',
            transition: 'all 0.25s var(--ease-expo)',
            boxShadow: focused ? '0 0 0 3px rgba(108,99,255,.1)' : 'none',
          }}
        />
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 13, pointerEvents: 'none' }}>
          ⌕
        </span>
      </div>

      {/* XP pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,183,0,.08)', border: '1px solid rgba(255,183,0,.2)',
        borderRadius: 20, padding: '4px 12px',
      }}>
        <span style={{ fontSize: 12 }}>⚡</span>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffb700', lineHeight: 1 }}>
            {user?.xp || 0} XP
          </div>
          <div style={{ width: 48, height: 2, background: 'rgba(255,183,0,.2)', borderRadius: 1, marginTop: 3 }}>
            <div style={{ height: '100%', width: `${xpPct}%`, background: '#ffb700', borderRadius: 1, transition: 'width 0.5s' }} />
          </div>
        </div>
      </div>

      {/* Notification bell */}
      <button style={{
        background: 'none', border: '1px solid rgba(255,255,255,.07)',
        borderRadius: 8, width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-2)', fontSize: 15, position: 'relative',
        cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,.4)'; e.currentTarget.style.color = '#6c63ff'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
        🔔
        <span style={{
          position: 'absolute', top: 4, right: 4,
          width: 6, height: 6, borderRadius: '50%',
          background: '#6c63ff', border: '1.5px solid var(--void)',
        }} />
      </button>

      {/* Avatar */}
      <div onClick={() => navigate('/profile')}
        style={{
          width: 34, height: 34, borderRadius: 9,
          background: user?.avatarColor || '#6c63ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
          cursor: 'pointer', flexShrink: 0,
          border: '1.5px solid rgba(108,99,255,.4)',
          boxShadow: '0 0 12px rgba(108,99,255,.25)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(108,99,255,.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(108,99,255,.25)'; }}>
        {user?.name?.slice(0,2).toUpperCase() || 'SW'}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}