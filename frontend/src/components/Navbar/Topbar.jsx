import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onToggleSidebar, onToggleTheme, theme, breadcrumb }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = user ? ((user.fname||'?')[0] + ((user.lname||'')[0]||'')).toUpperCase() : '?';
  const fullName = user ? `${user.fname||''} ${user.lname||''}`.trim() : 'User';

  const handleLogout = () => { logout(); navigate('/login'); };

  const s = {
    bar:{ height:'var(--topbar-h)', background:'var(--s1)', borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', padding:'0 20px', gap:16, flexShrink:0, zIndex:50, position:'relative' },
    logo:{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:16, letterSpacing:'-.02em' },
    sq:{ width:26, height:26, background:'var(--accent)', borderRadius:6, display:'flex',
      alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff' },
    sep:{ width:1, height:24, background:'var(--border)', margin:'0 4px' },
    bc:{ fontSize:13, color:'var(--muted2)' },
    right:{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 },
    btn:{ background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:8,
      cursor:'pointer', padding:'6px 9px', color:'var(--muted2)', fontSize:16,
      display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 },
    xp:{ fontFamily:'var(--mono)', fontSize:12, color:'var(--accent2)',
      background:'rgba(52,211,153,.1)', border:'1px solid rgba(52,211,153,.2)', padding:'4px 12px', borderRadius:20 },
    av:{ width:30, height:30, borderRadius:'50%', background: user?.avatarColor||'var(--accent)',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:11,
      fontWeight:700, cursor:'pointer', position:'relative', color:'#fff' },
    dd:{ position:'absolute', top:40, right:0, background:'var(--s2)', border:'1px solid var(--border2)',
      borderRadius:12, padding:6, minWidth:180, zIndex:200,
      display: open ? 'block' : 'none', boxShadow:'0 8px 32px rgba(0,0,0,.4)' },
    ddi:{ padding:'9px 12px', borderRadius:8, fontSize:13, cursor:'pointer',
      color:'var(--muted2)', display:'flex', alignItems:'center', gap:8 },
    ddu:{ padding:12, fontSize:12, color:'var(--muted)', borderBottom:'1px solid var(--border)', marginBottom:4 },
  };

  return (
    <div style={s.bar}>
      <button style={s.btn} onClick={onToggleSidebar}>☰</button>
      <div style={s.logo}><div style={s.sq}>S</div>SimWork</div>
      <div style={s.sep}/>
      <div style={s.bc}>{breadcrumb}</div>
      <div style={s.right}>
        <button style={s.btn} onClick={onToggleTheme}>{theme==='dark'?'🌙':'☀️'}</button>
        <div style={s.xp}>XP: {user?.xp||0}</div>
        <div style={s.av} onClick={()=>setOpen(!open)}>
          {initials}
          <div style={s.dd} onClick={e=>e.stopPropagation()}>
            <div style={s.ddu}><strong style={{display:'block',fontSize:13,color:'var(--text)',marginBottom:2}}>{fullName}</strong>{user?.email}</div>
            <div style={s.ddi} onClick={()=>{navigate('/profile');setOpen(false);}}>👤 My Profile</div>
            <div style={s.ddi} onClick={()=>{navigate('/settings');setOpen(false);}}>⚙️ Settings</div>
            <div style={{height:1,background:'var(--border)',margin:'4px 0'}}/>
            <div style={{...s.ddi,color:'var(--rose)'}} onClick={handleLogout}>🚪 Sign Out</div>
          </div>
        </div>
      </div>
    </div>
  );
}