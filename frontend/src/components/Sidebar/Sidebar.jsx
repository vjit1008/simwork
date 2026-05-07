import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSim } from '../../context/SimContext';

export default function Sidebar({ collapsed, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const { sims, currentSim } = useSim();

  const initials = user ? ((user.name||'?')[0]+((user.lname||'')[0]||'')).toUpperCase() : '?';
  const fullName  = user ? `${user.name||''} ${user.lname||''}`.trim() : 'User';
  const done      = sims.filter(s=>s.status==='done').length;
  const pct       = Math.round((done/sims.length)*100);

  const go = (path) => { navigate(path); onClose?.(); };
  const isActive = (p) => location.pathname === p;

  const s = {
    backdrop: {
  display: collapsed ? 'none' : 'block',
  position: 'fixed',
  inset: 0,
  zIndex: 98,
  background: 'rgba(0,0,0,0.5)',
},
    sb:{
      width: 'var(--sidebar-w)',
      background: 'var(--s1)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto',
      transition: 'transform .25s',
      // Always fixed on mobile, relative on desktop handled by CSS
      zIndex: 99,
    },
    uc:{ margin:'12px 10px', background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:12 },
    un:{ fontSize:13, fontWeight:700, marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
    ur:{ fontSize:11, color:'var(--muted2)' },
    sec:{ padding:'12px 10px 4px', fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.1em', fontWeight:600 },
    item:(active)=>({ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8,
      margin:'1px 6px', cursor:'pointer', fontSize:13, fontWeight:500,
      color: active ? 'var(--accent)' : 'var(--muted2)',
      background: active ? 'rgba(124,110,250,.12)' : 'transparent',
      border: active ? '1px solid rgba(124,110,250,.2)' : '1px solid transparent' }),
    icon:{ fontSize:15, width:20, textAlign:'center' },
    prog:{ padding:'12px 14px', marginTop:'auto', borderTop:'1px solid var(--border)' },
    bar:{ height:4, background:'var(--s3)', borderRadius:2, overflow:'hidden', marginTop:6 },
    fill:{ height:'100%', width:pct+'%', background:'linear-gradient(90deg,var(--accent),var(--accent2))', borderRadius:2, transition:'width .4s' },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sidebar { 
            position: fixed !important;
            top: var(--topbar-h) !important;
            left: 0 !important;
            bottom: 0 !important;
            transform: ${collapsed ? 'translateX(-100%)' : 'translateX(0)'} !important;
          }
          .sidebar-backdrop {
            display: ${collapsed ? 'none' : 'block'} !important;
            top: var(--topbar-h) !important;
          }
        }
        @media (min-width: 769px) {
          .sidebar {
            position: relative !important;
            transform: none !important;
            ${collapsed ? 'width: 0 !important; overflow: hidden !important; border: none !important;' : ''}
          }
          .sidebar-backdrop { display: none !important; }
        }
      `}</style>

      {/* Backdrop — closes sidebar when tapped on mobile */}
      <div className="sidebar-backdrop" style={s.backdrop} onClick={onClose} />

      <div className="sidebar" style={s.sb}>
        <div style={s.uc}>
          <div style={s.un}>{fullName}</div>
          <div style={s.ur}>{user?.role||'Learner'}</div>
        </div>
        <div style={s.sec}>Main</div>
        <div style={s.item(isActive('/'))} onClick={()=>go('/')}>
          <span style={s.icon}>🏠</span>Dashboard
        </div>
        <div style={s.item(isActive('/simulations'))} onClick={()=>go('/simulations')}>
          <span style={s.icon}>🎯</span>Simulations
          <span style={{marginLeft:'auto',fontFamily:'var(--mono)',fontSize:10,background:'var(--accent)',color:'#fff',padding:'2px 7px',borderRadius:10}}>4</span>
        </div>
        <div style={s.item(isActive('/profile'))} onClick={()=>go('/profile')}>
          <span style={s.icon}>👤</span>My Profile
        </div>
        <div style={s.item(isActive('/leaderboard'))} onClick={()=>go('/leaderboard')}>
          <span style={s.icon}>🏆</span>Leaderboard
        </div>
        {currentSim && (
          <>
            <div style={s.sec}>Active Sim</div>
            <div style={s.item(isActive('/ide'))} onClick={()=>go('/ide')}>
              <span style={s.icon}>💻</span>IDE & Tasks
            </div>
          </>
        )}
        <div style={s.sec}>Account</div>
        <div style={s.item(isActive('/settings'))} onClick={()=>go('/settings')}>
          <span style={s.icon}>⚙️</span>Settings
        </div>
        <div style={{...s.item(false),color:'var(--rose)'}} onClick={()=>{logout();go('/login');}}>
          <span style={s.icon}>🚪</span>Sign Out
        </div>
        <div style={s.prog}>
          <div style={{fontSize:11,color:'var(--muted)'}}>Overall Progress</div>
          <div style={s.bar}><div style={s.fill}/></div>
          <div style={{fontSize:11,color:'var(--muted2)',marginTop:6,fontFamily:'var(--mono)'}}>{done} / {sims.length} simulations</div>
        </div>
      </div>
    </>
  );
}