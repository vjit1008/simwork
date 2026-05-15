import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSim } from '../context/SimContext';
import { LEADERBOARD_OTHERS } from '../data/simulations';

export default function Dashboard() {
  const { user } = useAuth();
  const { sims }  = useSim();
  const navigate  = useNavigate();
  const greeting =  () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};
  const done = sims.filter(s=>s.status==='done').length;
  const fullName = user ? `${user.name||''} ${user.lname||''}`.trim() : 'User';
  const initials = user ? ((user.name||'?')[0]+((user.lname||'')[0]||'')).toUpperCase() : '?';

  const sorted = [
    { name:fullName, score:user?.xp||0, avatar:initials, color:user?.avatarColor||'#7C6EFA', sims:done, isMe:true },
    ...LEADERBOARD_OTHERS
  ].sort((a,b)=>b.score-a.score);
  const top5 = sorted.slice(0,5);
  const lb = top5.some(e=>e.isMe) ? top5 : [...top5.slice(0,4), sorted.find(e=>e.isMe)];

  const card = { background:'var(--s1)', border:'1px solid var(--border)', borderRadius:14, padding:22, overflow:'hidden' };

  return (
    <div className="page-pad" style={{padding:'28px 32px', overflowY:'auto', flex:1}}>

      {/* Welcome */}
      <div style={{marginBottom:28,padding:'24px 28px',background:'linear-gradient(135deg,rgba(124,110,250,.1),rgba(52,211,153,.06))',border:'1px solid rgba(124,110,250,.15)',borderRadius:16}}>
        <h1 style={{fontSize:26,fontWeight:800,letterSpacing:'-.03em',marginBottom:4}}>{greeting ()}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p style={{fontSize:14,color:'var(--muted2)'}}>Ready to level up your skills today?</p>
      </div>

      {/* Stats */}
      <div className="dash-stats" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[['Total XP','var(--accent)',user?.xp||0],['Sims Done','var(--accent2)',done],['Certificates','var(--accent3)',(user?.certs||[]).length],['Rank', 'var(--rose)', '#' + (sorted.findIndex(e => e.isMe) + 1)]].map(([label,color,val])=>(
          <div key={label} style={{background:'var(--s1)',border:'1px solid var(--border)',borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:'-.03em',color,marginBottom:2}}>{val}</div>
            <div style={{fontSize:12,color:'var(--muted2)'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="dash-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>

        {/* Simulations */}
        <div style={card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>🎯 Your Simulations</div>
          {sims.map(s=>(
            <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}} onClick={()=>navigate('/simulations')}>
              <div style={{width:36,height:36,borderRadius:8,background:s.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{s.title}</div>
                <div style={{fontSize:11,color:'var(--muted2)'}}>3 stages · {s.totalXP} XP max</div>
              </div>
              <div style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:600,
                background:s.status==='done'?'rgba(52,211,153,.12)':'rgba(124,110,250,.15)',
                color:s.status==='done'?'var(--accent2)':'var(--accent)'}}>
                {s.status==='done'?'✓ Done':'Active'}
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>🏆 Top Performers</div>
          {lb.map((l,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--muted)',width:24}}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1)}</div>
              <div style={{width:28,height:28,borderRadius:'50%',background:l.color+'22',color:l.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>{l.avatar}</div>
              <div style={{flex:1,fontSize:13,fontWeight:l.isMe?700:500,color:l.isMe?'var(--accent)':'var(--text)'}}>{l.name}{l.isMe?' (you)':''}</div>
              <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--accent2)'}}>{l.score} XP</div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>💡 Quick Tips</div>
          {[['var(--accent)','Validate first, Submit after.','Use Validate to check your code before final submission.'],
            ['var(--accent2)','Choose your stage wisely.','Beginner → Intermediate → Hard. Each stage unlocks the next.'],
            ['var(--accent3)','Tasks are sequential.','Complete Task 1 to unlock Task 2, and so on.']].map(([c,t,d])=>(
            <div key={t} style={{background:`rgba(${c.includes('accent2')?'52,211,153':c.includes('accent3')?'245,158,11':'124,110,250'},.08)`,border:`1px solid rgba(${c.includes('accent2')?'52,211,153':c.includes('accent3')?'245,158,11':'124,110,250'},.15)`,borderRadius:8,padding:12,fontSize:12,color:'var(--muted2)',lineHeight:1.6,marginBottom:10}}>
              <strong style={{color:c}}>{t}</strong> {d}
            </div>
          ))}
        </div>

        {/* Workflow */}
        <div style={card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>🔄 Company Workflow</div>
          {[['BA','Gathers requirements, writes user stories, defines acceptance criteria.'],
            ['PM','Tracks roadmap, prioritizes tasks, coordinates standups.'],
            ['Developer','Builds features, writes code, opens PRs, updates tickets.'],
            ['QA','Tests submitted code, logs bugs, verifies fixes in staging.'],
            ['DevOps','Deploys code, manages environments, runs pipeline checks.'],
            ['Operations','Monitors production, handles incidents, feeds back to BA.']].map(([role,desc])=>(
            <div key={role} style={{fontSize:12,color:'var(--muted2)',marginBottom:8,lineHeight:1.6}}>
              <strong style={{color:'var(--text)'}}>{role}:</strong> {desc}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}