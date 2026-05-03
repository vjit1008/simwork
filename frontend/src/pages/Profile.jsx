import { useAuth } from '../context/AuthContext';
import { useSim }  from '../context/SimContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user }    = useAuth();
  const { sims }    = useSim();
  const navigate    = useNavigate();
  const initials = user ? ((user.fname||'?')[0]+((user.lname||'')[0]||'')).toUpperCase() : '?';
  const fullName = user ? `${user.fname||''} ${user.lname||''}`.trim() : 'User';
  const done = sims.filter(s=>s.status==='done').length;

  const card = { background:'var(--s1)', border:'1px solid var(--border)', borderRadius:12, padding:20, marginBottom:12 };

  return (
    <div style={{padding:'28px 32px',overflowY:'auto',flex:1}}>
      {/* Header */}
      <div style={{display:'flex',gap:24,alignItems:'flex-start',marginBottom:24,padding:28,...card,borderRadius:16,flexWrap:'wrap'}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:(user?.avatarColor||'#7C6EFA')+'33',color:user?.avatarColor||'#7C6EFA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:800,border:'3px solid rgba(124,110,250,.3)',flexShrink:0}}>{initials}</div>
        <div style={{flex:1}}>
          <h2 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>{fullName}</h2>
          <div style={{fontFamily:'var(--mono)',fontSize:13,color:'var(--muted2)',marginBottom:4}}>✉️ {user?.email}</div>
          <div style={{fontSize:13,color:'var(--muted2)',marginBottom:12}}>📍 {user?.city||'India'}</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {user?.role&&<span style={{fontSize:11,padding:'3px 10px',borderRadius:20,background:'rgba(124,110,250,.12)',border:'1px solid rgba(124,110,250,.2)',color:'var(--accent)'}}>{user.role}</span>}
            {(user?.skills||[]).slice(0,4).map(sk=><span key={sk} style={{fontSize:11,padding:'3px 10px',borderRadius:20,background:'rgba(124,110,250,.12)',border:'1px solid rgba(124,110,250,.2)',color:'var(--accent)'}}>{sk}</span>)}
            {user?.degree&&<span style={{fontSize:11,padding:'3px 10px',borderRadius:20,background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',color:'var(--sky)'}}>🎓 {user.degree}</span>}
          </div>
        </div>
        <button onClick={()=>navigator.clipboard.writeText(window.location.href)} style={{padding:'10px 20px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>Share Profile</button>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[['Total XP','var(--accent)',user?.xp||0],['Sims Done','var(--accent2)',done],['Certificates','var(--accent3)',(user?.certs||[]).length],['Rank','var(--rose)','#42']].map(([l,c,v])=>(
          <div key={l} style={{...card,textAlign:'center',marginBottom:0}}>
            <div style={{fontSize:28,fontWeight:800,color:c,letterSpacing:'-.03em'}}>{v}</div>
            <div style={{fontSize:11,color:'var(--muted2)',marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>🎓 Education</div>
      {user?.college ? (
        <div style={{...card,display:'flex',gap:16,alignItems:'flex-start'}}>
          <div style={{width:40,height:40,borderRadius:10,background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>🏛️</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{user.college}</div>
            <div style={{fontSize:12,color:'var(--muted2)',marginBottom:4}}>{user.degree}{user.branch?` · ${user.branch}`:''}</div>
            <div style={{fontSize:11,color:'var(--accent3)',fontFamily:'var(--mono)'}}>{user.gradyear?`Graduating ${user.gradyear}`:'Current Student'}</div>
          </div>
        </div>
      ) : (
        <div style={{...card,textAlign:'center',color:'var(--muted)',fontSize:13}}>No education info added. <span style={{color:'var(--accent)',cursor:'pointer'}} onClick={()=>navigate('/settings')}>Add education →</span></div>
      )}

      {/* Certificates */}
      <div style={{fontSize:14,fontWeight:700,margin:'24px 0 14px'}}>🏅 Certificates Earned</div>
      {!(user?.certs?.length) ? (
        <div style={{...card,textAlign:'center',color:'var(--muted)',fontSize:13}}>Complete simulation stages to earn certificates 🏅</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {user.certs.map((c,i)=>(
            <div key={i} style={{...card,borderTop:`3px solid ${c.color}`,marginBottom:0}}>
              <div style={{fontSize:28,marginBottom:12}}>{c.icon}</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{c.title} Certificate</div>
              <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--mono)',marginBottom:10}}>{c.date} · {c.id}</div>
              <span style={{fontSize:12,fontWeight:700,padding:'3px 10px',borderRadius:20,background:c.color+'18',color:c.color}}>{c.score}/100</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}