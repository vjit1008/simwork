export default function TeamPanel({ msgs }) {
  const roles = [
    { key:'ba',     badge:'BA',     name:'Business Analyst',   color:'#60A5FA', desc:'Clarifies requirements' },
    { key:'pm',     badge:'PM',     name:'Product Manager',    color:'#F59E0B', desc:'Tracks priorities' },
    { key:'dev',    badge:'DEV',    name:'Developer',          color:'#7C6EFA', desc:'Building code locally' },
    { key:'qa',     badge:'QA',     name:'QA Tester',          color:'#34D399', desc:'Ready to validate' },
    { key:'devops', badge:'DevOps', name:'DevOps Engineer',    color:'#F87171', desc:'Ready to deploy' },
    { key:'ops',    badge:'OPS',    name:'Operations',         color:'#A78BFA', desc:'Will monitor live' },
  ];

  return (
    <div style={{background:'var(--s1)',borderLeft:'1px solid var(--border)',display:'flex',flexDirection:'column',overflow:'hidden',minWidth:280}}>
      <div style={{padding:14,borderBottom:'1px solid var(--border)',fontWeight:700,fontSize:13}}>👥 Team Workflow</div>
      <div style={{flex:1,overflowY:'auto',padding:12}}>
        {roles.map(r=>(
          <div key={r.key} style={{background:'var(--s2)',border:'1px solid var(--border)',borderRadius:8,padding:10,marginBottom:8}}>
            <div style={{display:'inline-block',padding:'2px 8px',borderRadius:4,fontWeight:600,marginBottom:6,fontSize:10,background:r.color+'22',color:r.color}}>{r.badge}</div>
            <div style={{fontWeight:600,marginBottom:4,color:'var(--text)',fontSize:12}}>{r.name}</div>
            <div style={{fontSize:10,color:'var(--muted2)',marginBottom:6}}>{r.desc}</div>
            <div style={{background:'rgba(255,255,255,.05)',borderLeft:`2px solid ${r.color}`,padding:'6px 8px',fontSize:10,color:'var(--muted2)',borderRadius:3}} dangerouslySetInnerHTML={{__html:msgs[r.key]||'Standby...'}}/>
          </div>
        ))}
      </div>
    </div>
  );
}