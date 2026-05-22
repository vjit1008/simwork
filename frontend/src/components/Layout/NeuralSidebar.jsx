import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { group: 'MAIN',
    items: [
      { path: '/',             icon: '⬡', label: 'Dashboard'   },
      { path: '/simulations',  icon: '⚡', label: 'Simulations', badge: 4 },
      { path: '/ide',          icon: '⟨⟩', label: 'IDE & Tasks' },
    ]
  },
  { group: 'WORKSPACE',
    items: [
      { path: '/profile',      icon: '◎', label: 'My Profile'  },
      { path: '/projects',     icon: '▦', label: 'Projects'    },
      { path: '/leaderboard',  icon: '◈', label: 'Leaderboard' },
      { path: '/teamwork',     icon: '⊹', label: 'Teamwork'    },
    ]
  },
  { group: 'ACCOUNT',
    items: [
      { path: '/settings',     icon: '⚙', label: 'Settings'    },
    ]
  },
];

export default function NeuralSidebar({ collapsed = false, onToggle }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [hovered, setHovered] = useState(null);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SW';

  const W = collapsed ? 64 : 220;

  return (
    <aside style={{
      width: W, minWidth: W,
      height: '100vh',
      display: 'flex', flexDirection: 'column',
      background: 'rgba(6,9,18,.95)',
      borderRight: '1px solid rgba(255,255,255,.05)',
      backdropFilter: 'blur(20px)',
      transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
      overflow: 'hidden',
      position: 'relative', flexShrink: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center',
        padding: collapsed ? '0 18px' : '0 20px',
        borderBottom: '1px solid rgba(255,255,255,.04)',
        gap: 10, flexShrink: 0,
        cursor: 'pointer',
      }} onClick={onToggle}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #7c74ff, #6c63ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 900, color: '#fff', flexShrink: 0,
          boxShadow: '0 0 16px rgba(108,99,255,.4)',
        }}>S</div>
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Sim<span className="grad-plasma">Work</span>
          </span>
        )}
      </div>

      {/* User chip */}
      {!collapsed && user && (
        <div style={{
          margin: '12px 12px 4px',
          padding: '10px 12px',
          background: 'rgba(108,99,255,.08)',
          border: '1px solid rgba(108,99,255,.15)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: user.avatarColor || '#6c63ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
              XP: {user.xp || 0}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0', overflowX: 'hidden' }}>
        {NAV.map(group => (
          <div key={group.group}>
            {!collapsed && (
              <div style={{
                padding: '12px 20px 4px',
                fontSize: 9, fontWeight: 700,
                color: 'var(--text-3)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>{group.group}</div>
            )}
            {group.items.map(item => {
              const active = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <div key={item.path}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setHovered(item.path)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: 10, padding: collapsed ? '10px 16px' : '9px 14px 9px 18px',
                    margin: '1px 8px',
                    borderRadius: 9, cursor: 'pointer',
                    background: active
                      ? 'rgba(108,99,255,.15)'
                      : hovered === item.path
                      ? 'rgba(255,255,255,.04)'
                      : 'transparent',
                    borderLeft: active
                      ? '2px solid #6c63ff'
                      : '2px solid transparent',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}>
                  <span style={{
                    fontSize: 15, width: 18, textAlign: 'center',
                    color: active ? '#6c63ff' : 'var(--text-2)',
                    flexShrink: 0, lineHeight: 1,
                  }}>{item.icon}</span>
                  {!collapsed && (
                    <span style={{
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      color: active ? 'var(--text-1)' : 'var(--text-2)',
                      whiteSpace: 'nowrap', flex: 1,
                      transition: 'color 0.15s',
                    }}>{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: '#6c63ff', color: '#fff',
                      borderRadius: 10, padding: '1px 6px',
                      minWidth: 18, textAlign: 'center',
                    }}>{item.badge}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '8px 8px 16px', borderTop: '1px solid rgba(255,255,255,.04)', flexShrink: 0 }}>
        <div onClick={() => { logout(); navigate('/auth'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px 16px' : '9px 14px 9px 18px',
            borderRadius: 9, cursor: 'pointer',
            color: 'var(--text-3)',
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255,107,107,.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}>
          <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>⏻</span>
          {!collapsed && <span style={{ fontSize: 13 }}>Sign Out</span>}
        </div>
      </div>
    </aside>
  );
}