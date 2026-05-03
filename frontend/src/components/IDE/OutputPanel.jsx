export default function OutputPanel({ activeTab, onTab, output, tests, valResult, score }) {
  const tabs = ['console','tests','validate','score','hints'];

  const Ring = ({s}) => {
    const R=40,circ=2*Math.PI*R,offset=circ-(s/100)*circ;
    const col=s>=80?'var(--accent2)':s>=50?'var(--accent3)':'var(--rose)';
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'20px 0'}}>
        <div style={{width:100,height:100,position:'relative'}}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="var(--s3)" strokeWidth="8"/>
            <circle cx="50" cy="50" r={R} fill="none" stroke={col} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:'stroke-dashoffset .5s'}}/>
          </svg>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontSize:22,fontWeight:800,color:col}}>{s}</div>
            <div style={{fontSize:10,color:'var(--muted)'}}>/100</div>
          </div>
        </div>
        {[['Correctness',Math.round(s*.5),50,'var(--accent)'],['Test coverage',Math.round(s*.3),30,'var(--accent2)'],['Code quality',Math.round(s*.2),20,'var(--accent3)']].map(([l,v,m,c])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:8,fontSize:11,width:'100%',padding:'0 16px',marginTop:8}}>
            <div style={{flex:1,color:'var(--muted2)'}}>{l}</div>
            <div style={{flex:2,height:4,background:'var(--s2)',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${(v/m)*100}%`,background:c,borderRadius:2}}/></div>
            <div style={{fontFamily:'var(--mono)',color:'var(--muted2)',minWidth:32}}>{v}/{m}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{background:'var(--s1)',borderLeft:'1px solid var(--border)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{display:'flex',borderBottom:'1px solid var(--border)',flexShrink:0}}>
        {tabs.map(t=>(
          <div key={t} onClick={()=>onTab(t)} style={{flex:1,padding:'10px 6px',fontSize:11,fontWeight:600,textAlign:'center',cursor:'pointer',
            color:activeTab===t?'var(--accent)':'var(--muted)',borderBottom:`2px solid ${activeTab===t?'var(--accent)':'transparent'}`,transition:'all .15s'}}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </div>
        ))}
      </div>
      <div style={{flex:1,overflowY:'auto'}}>
        {activeTab==='console'&&<div style={{padding:12,fontFamily:'var(--mono)',fontSize:12,lineHeight:1.7}}>
          {output.map((l,i)=><div key={i} style={{marginBottom:2,color:l.type==='ok'?'var(--accent2)':l.type==='err'?'var(--rose)':l.type==='info'?'var(--accent)':l.type==='warn'?'var(--accent3)':'var(--muted)'}}>{l.text}</div>)}
        </div>}
        {activeTab==='tests'&&<div style={{padding:12}}>
          {tests.map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:7,marginBottom:6,fontSize:12,border:'1px solid',
              background:t.status==='pass'?'rgba(52,211,153,.06)':t.status==='fail'?'rgba(248,113,113,.06)':'var(--s2)',
              borderColor:t.status==='pass'?'rgba(52,211,153,.2)':t.status==='fail'?'rgba(248,113,113,.2)':'var(--border)'}}>
              <div>{t.status==='pass'?'✅':t.status==='fail'?'❌':'○'}</div>
              <div style={{flex:1,color:'var(--muted2)'}}>{t.name}</div>
              <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)'}}>{t.ms?`${t.ms}ms`:t.status==='fail'?'FAIL':'—'}</div>
            </div>
          ))}
        </div>}
        {activeTab==='validate'&&<div style={{padding:12}}>
          {!valResult?<div style={{padding:20,textAlign:'center',color:'var(--muted)',fontSize:12}}>Click <strong style={{color:'var(--sky)'}}>🔍 Validate</strong> to check your code</div>:
          <>{valResult.items.map((item,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,padding:'8px 10px',borderRadius:7,marginBottom:6,fontSize:12,border:'1px solid',
              background:item.type==='pass'?'rgba(52,211,153,.06)':item.type==='warn'?'rgba(245,158,11,.07)':'rgba(248,113,113,.06)',
              borderColor:item.type==='pass'?'rgba(52,211,153,.2)':item.type==='warn'?'rgba(245,158,11,.2)':'rgba(248,113,113,.2)',
              color:item.type==='pass'?'var(--accent2)':item.type==='warn'?'var(--accent3)':'var(--rose)'}}>
              <span>{item.type==='pass'?'✅':item.type==='warn'?'⚠️':'❌'}</span><span style={{flex:1,lineHeight:1.5}}>{item.msg}</span>
            </div>
          ))}
          <div style={{padding:'10px 12px',borderRadius:8,fontSize:13,fontWeight:700,textAlign:'center',marginTop:4,
            background:valResult.summary==='pass'?'rgba(52,211,153,.1)':valResult.summary==='partial'?'rgba(245,158,11,.1)':'rgba(248,113,113,.1)',
            border:`1px solid ${valResult.summary==='pass'?'rgba(52,211,153,.25)':valResult.summary==='partial'?'rgba(245,158,11,.25)':'rgba(248,113,113,.25)'}`,
            color:valResult.summary==='pass'?'var(--accent2)':valResult.summary==='partial'?'var(--accent3)':'var(--rose)'}}>
            {valResult.text}
          </div></>}
        </div>}
        {activeTab==='score'&&<Ring s={score}/>}
        {activeTab==='hints'&&<div style={{padding:12,display:'flex',flexDirection:'column',gap:8}}>
          {[['Free Hint','Read the task requirements carefully — the expected return format is in the description.',0],
            ['Hint 2 (-5 XP)','Look at the test names — they describe exactly what each assertion checks.',5],
            ['Hint 3 (-10 XP)','Structure your solution line by line matching each requirement.',10]].map(([t,d,cost])=>(
            <div key={t} style={{background:'rgba(245,158,11,.07)',border:'1px solid rgba(245,158,11,.2)',borderRadius:8,padding:'10px 12px',fontSize:12,color:'var(--muted2)',lineHeight:1.5,cursor:'pointer'}}>
              <strong style={{color:'var(--accent3)'}}>{t}:</strong> {d}
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}