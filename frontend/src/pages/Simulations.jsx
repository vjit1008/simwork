import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSim } from '../context/SimContext';
import { buildTasksForRole, STAGES } from '../data/simulations';
import { showToast } from '../components/Toast';

export default function Simulations() {
  const { sims, setCurrentSim, setCurrentStage, setCurrentTask, setTaskResults, setValidationPassed } = useSim();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = filter==='all' ? sims : filter==='done' ? sims.filter(s=>s.status==='done') : sims.filter(s=>s.status!=='done');

  const openStage = (sim, stage) => {
    const tasks = buildTasksForRole(sim.id);
    if (!tasks[stage]?.length) { showToast('🚧 Coming soon!'); return; }
    setCurrentSim(sim);
    setCurrentStage(stage);
    setCurrentTask(0);
    setTaskResults({});
    setValidationPassed(false);
    navigate('/ide');
  };

  const stageColors = { beginner:'var(--accent2)', intermediate:'var(--accent3)', hard:'var(--rose)' };

  return (
    <div className="page-pad" style={{padding:'28px 32px',overflowY:'auto',flex:1}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <h1 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em'}}>Job Simulations</h1>
        <div style={{display:'flex',gap:6}}>
          {['all','active','done'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 16px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',border:'1px solid var(--border)',background:filter===f?'var(--accent)':'transparent',color:filter===f?'#fff':'var(--muted2)'}}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="sim-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {filtered.map(sim => {
          const tasks = buildTasksForRole(sim.id);
          return (
            <div key={sim.id} style={{background:'var(--s1)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden',display:'flex',flexDirection:'column'}}>
              <div style={{height:90,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,background:sim.color+'18'}}>{sim.icon}</div>
              <div style={{padding:16,flex:1,display:'flex',flexDirection:'column'}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{sim.title} Simulation</div>
                <div style={{fontSize:12,color:'var(--muted2)',lineHeight:1.5,marginBottom:8,flex:1}}>{sim.desc}</div>
                <div style={{fontSize:12,color:'var(--muted2)',marginBottom:10}}>Languages: <strong>{sim.languages.join(', ')}</strong></div>
                <div style={{display:'flex',gap:8,fontSize:11,color:'var(--muted)',marginBottom:12}}>
                  <span>⚡ {sim.totalXP} XP</span>
                  <span>📋 {Object.values(tasks).reduce((a,b)=>a+b.length,0)} tasks</span>
                </div>
                <div style={{fontSize:11,color:'var(--muted)',marginBottom:8,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>Select Stage</div>
                <div style={{display:'flex',gap:6,marginBottom:10}}>
                  {Object.entries(STAGES).map(([key,stage])=>{
                    const done = (sim.stageProgress?.[key]||0) >= 100;
                    return (
                      <button key={key} onClick={()=>openStage(sim,key)} style={{
                        flex:1, padding:'8px 4px', borderRadius:7, border:`1px solid ${stageColors[key]}44`,
                        background: done ? stageColors[key]+'22' : 'transparent',
                        color: stageColors[key], fontSize:11, fontWeight:600, cursor:'pointer', textAlign:'center' }}>
                        {done?'✓ ':''}{stage.label}<br/>
                        <span style={{fontSize:10,opacity:.7}}>{tasks[key]?.length||0} tasks</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{height:3,background:'var(--s2)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:(sim.progress||0)+'%',background:sim.color,borderRadius:2,transition:'width .4s'}}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}