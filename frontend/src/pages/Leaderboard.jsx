import { useAuth } from '../context/AuthContext';
import { useSim }  from '../context/SimContext';
import { LEADERBOARD_OTHERS } from '../data/simulations';

export default function Leaderboard() {
  const { user } = useAuth();
  const { sims } = useSim();
  const done = sims.filter(s=>s.status==='done').length;
  const fullName = user ? `${user.name||''} ${user.lname||''}`.trim() : 'User';
  const initials = user ? ((user.name||'?')[0]+((user.lname||'')[0]||'')).toUpperCase() : '?';

  const all = [
    { name:fullName, score:user?.xp||0, avatar:initials, color:user?.avatarColor||'#7C6EFA', sims:done, isMe:true },
    ...LEADERBOARD_OTHERS
  ].sort((a,b)=>b.score-a.score);

  return (
    <div style={{padding:'28px 32px',overflowY:'auto',flex:1}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:6}}>🏆 Leaderboard</h1>
        <p style={{fontSize:14,color:'var(--muted2)'}}>Top performers this month</p>
      </div>
      <div style={{background:'var(--s1)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
        {all.map((l,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 20px',borderBottom:'1px solid var(--border)',background:l.isMe?'rgba(124,110,250,.06)':'transparent'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:700,width:36,color:'var(--muted)'}}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1)}</div>
            <div style={{width:36,height:36,borderRadius:'50%',background:l.color+'22',color:l.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700}}>{l.avatar}</div>
            <div style={{flex:1,fontSize:14,fontWeight:l.isMe?700:500,color:l.isMe?'var(--accent)':'var(--text)'}}>{l.name}{l.isMe?' (you)':''}</div>
            <div style={{fontSize:12,color:'var(--muted)',width:80,textAlign:'right'}}>{l.sims} sim{l.sims!==1?'s':''}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:13,color:'var(--accent2)'}}>{l.score} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}