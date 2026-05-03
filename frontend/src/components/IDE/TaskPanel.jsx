export default function TaskPanel({ tasks, current, results, onSwitch }) {
  return (
    <div style={{background:'var(--s1)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'8px 14px',borderBottom:'1px solid var(--border)',fontSize:10,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.1em',fontWeight:600}}>Tasks</div>
      <div style={{overflowY:'auto',flex:1}}>
        {tasks.map((t,i)=>{
          const done   = !!results[i];
          const locked = i>0 && !results[i-1] && i!==current;
          return (
            <div key={i} onClick={()=>locked?null:onSwitch(i)} style={{padding:'10px 12px',borderRadius:8,margin:'4px 6px',cursor:locked?'not-allowed':'pointer',opacity:locked?.5:1,
              background:i===current?'rgba(124,110,250,.1)':done?'rgba(52,211,153,.05)':'transparent',
              border:`1px solid ${i===current?'rgba(124,110,250,.25)':done?'rgba(52,211,153,.15)':'transparent'}`}}>
              <div style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--muted)',marginBottom:3}}>TASK {i+1} {done?'✓':locked?'🔒':''}</div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{t.title}</div>
              <div style={{fontSize:11,color:'var(--muted2)'}}>{t.time} min</div>
            </div>
          );
        })}
      </div>
      <div style={{padding:14,borderTop:'1px solid var(--border)',overflowY:'auto',flex:'0 0 auto',maxHeight:220}}>
        <div style={{fontSize:12,color:'var(--muted2)',lineHeight:1.7}} dangerouslySetInnerHTML={{__html:tasks[current]?.desc}}/>
      </div>
    </div>
  );
}