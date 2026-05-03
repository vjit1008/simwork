import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSim } from '../../context/SimContext';
import { useAuth } from '../../context/AuthContext';
import { buildTasksForRole, STAGES } from '../../data/simulations';
import { showToast } from '../Toast';
import TaskPanel from './TaskPanel';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import TeamPanel from './TeamPanel';

export default function IDEPage() {
  const navigate = useNavigate();
  const { user, update } = useAuth();
  const { currentSim, currentStage, currentTask, setCurrentTask,
          taskResults, setTaskResults, validationPassed, setValidationPassed,
          updateSim, sims } = useSim();

  const [code, setCode]           = useState('');
  const [output, setOutput]       = useState([{ type:'info', text:'$ SimWork IDE ready' },{ type:'muted', text:'$ Write → Validate → Submit' }]);
  const [tests, setTests]         = useState([]);
  const [valResult, setValResult] = useState(null);
  const [score, setScore]         = useState(0);
  const [activeTab, setActiveTab] = useState('console');
  const [timerSec, setTimerSec]   = useState(0);
  const [lang, setLang]           = useState('JavaScript');
  const [teamMsgs, setTeamMsgs]   = useState({ ba:'Ready to discuss requirements', pm:'Waiting for task completion', qa:'Waiting for your submission...', devops:'On standby for deployment', ops:'Ready to support production' });
  const [modalDone, setModalDone]   = useState(null);
  const [modalStage, setModalStage] = useState(null);
  // Mobile panel: 'tasks' | 'editor' | 'output' | 'team'
  const [mobilePanel, setMobilePanel] = useState('editor');
  const editorRef = useRef(null);

// When switching to editor panel on mobile, focus textarea after render
useEffect(() => {
  if (mobilePanel === 'editor') {
    setTimeout(() => {
      const ta = document.querySelector('.ide-panel-editor.mob-active textarea');
      ta?.focus();
    }, 50);
  }
}, [mobilePanel]);
  const [taskPanelOpen, setTaskPanelOpen] = useState(false);
  const timerRef = useRef(null);

  const tasks = currentSim ? buildTasksForRole(currentSim.id)[currentStage] : [];
  const task  = tasks[currentTask];
  const stageInfo = STAGES[currentStage];

  useEffect(() => {
    if (!currentSim) { navigate('/simulations'); return; }
    loadTask(currentTask);
  }, [currentSim, currentStage]);

  const loadTask = useCallback((idx) => {
    const t = tasks[idx];
    if (!t) return;
    setCurrentTask(idx);
      setCode(t.starterCodes?.[lang] || t.starterCode);
    setCode(t.starterCode);
    setValidationPassed(false);
    setOutput([{ type:'info', text:'$ SimWork IDE ready' },{ type:'muted', text:'$ Write your solution → Validate → Submit' }]);
    setTests(t.tests.map(name => ({ name, status:'pending' })));
    setScore(0); setValResult(null); setActiveTab('console');
    setTaskPanelOpen(false); // close task panel when loading new task
    clearInterval(timerRef.current);
    const sec = Math.round(parseInt(t.time) * 60 * stageInfo.timeMult);
    setTimerSec(sec);
    timerRef.current = setInterval(() => {
      setTimerSec(p => { if (p <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; } return p - 1; });
    }, 1000);
  },  [tasks, stageInfo, lang]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const estimateScore = (c, t) => {
    if (!t?.solution) return 50;
    const words = t.solution.replace(/[^a-zA-Z0-9]/g,' ').split(/\s+/).filter(w=>w.length>2);
    const hits  = words.filter(w => c.toLowerCase().includes(w.toLowerCase())).length;
    let s = Math.min(100, Math.round((hits/Math.max(words.length,1))*100));
    if (!c.includes('TODO')) s = Math.min(100, s+10);
    if (c.length > 150) s = Math.min(100, s+10);
    return Math.max(s, c.length>80 ? 40 : 15);
  };

  const runCode = () => {
    setOutput(p => [...p, { type:'info', text:'$ Running...' }]);
    setMobilePanel('output');
    setTimeout(() => {
      if (code.trim() === task.starterCode.trim() || code.length < 50) {
        setOutput(p => [...p, { type:'err', text:'✗ No implementation found.' }]);
        return;
      }
      const sc = estimateScore(code, task);
      const passed = Math.round((sc/100)*tests.length);
      setOutput(p => [...p, { type:'ok', text:`✓ ${code.split('\n').length} lines parsed` },
        { type: passed>=tests.length?'ok':'warn', text:`${passed}/${tests.length} checks passing` }]);
      setTests(tests.map((t,i) => ({ ...t, status: i<passed?'pass':'fail', ms: i<passed?Math.floor(Math.random()*40+8):null })));
      setScore(sc);
      setActiveTab('tests');
    }, 500);
  };

  const validateCode = () => {
    setMobilePanel('output');
    if (code.trim() === task.starterCode.trim()) {
      setValResult({ items:[{ type:'fail', msg:'Code is unchanged. Write your solution first.' }], summary:'fail', text:'❌ Validation Failed' });
      setValidationPassed(false); setActiveTab('validate'); return;
    }
    if (code.trim().length < 30) {
      setValResult({ items:[{ type:'fail', msg:'Code too short. Write a proper solution.' }], summary:'fail', text:'❌ Too short' });
      setValidationPassed(false); setActiveTab('validate'); return;
    }
    const rules = task.validationRules || [];
    const items = rules.map(rule => {
      const words = rule.replace(/[^a-zA-Z0-9]/g,' ').split(/\s+/).filter(w=>w.length>2);
      const pass  = words.some(w => code.toLowerCase().includes(w.toLowerCase())) || code.length > 100;
      return { type: pass?'pass':'fail', msg: rule };
    });
    const passCount = items.filter(i=>i.type==='pass').length;
    const pct = rules.length ? Math.round((passCount/rules.length)*100) : 60;
    const hasTodo = code.includes('TODO');
    if (hasTodo) items.push({ type:'warn', msg:'TODO comments remain — consider completing them' });
    const summary = pct>=80?'pass':pct>=50?'partial':'fail';
    const text = pct>=80?`✅ Validation Passed (${passCount}/${rules.length})`:pct>=50?`⚠️ Partial (${passCount}/${rules.length})`:(`❌ Failed (${passCount}/${rules.length})`);
    setValResult({ items, summary, text });
    setValidationPassed(pct >= 50);
    setActiveTab('validate');
    showToast(pct>=80?'✅ Ready to submit!':pct>=50?'⚠️ Partially valid — can submit':'❌ Fix issues first');
  };

  const handleSubmit = (auto = false) => {
    if (!validationPassed && !auto) { showToast('🔍 Validate first!'); validateCode(); return; }
    clearInterval(timerRef.current);
    const sc = Math.max(estimateScore(code, task), validationPassed ? 55 : 25);
    const xpPerTask = Math.round((currentSim.totalXP/3/tasks.length)*stageInfo.xpMult);
    const xpEarned  = Math.round((sc/100)*xpPerTask);
    update({ xp: (user?.xp||0) + xpEarned });
    const newResults = { ...taskResults, [currentTask]:{ score:sc, xpEarned } };
    setTaskResults(newResults);
    setTeamMsgs(p=>({...p, qa:'📋 Testing your submission...'}));
    setTimeout(()=>{
      setTeamMsgs(p=>({...p, qa:'✅ Tests passed! Approved.', devops:'🚀 Deploying to production...'}));
      setTimeout(()=>setTeamMsgs(p=>({...p, devops:'✅ Live in production!', ops:'📊 Monitoring — all healthy'})), 2000);
    }, 2000);
    const isLast = currentTask === tasks.length - 1;
    const sim = sims.find(s=>s.id===currentSim.id);
    const newStageProgress = { ...(sim?.stageProgress||{}), [currentStage]: isLast?100:Math.round((Object.keys(newResults).length/tasks.length)*100) };
    const allDone = Object.values(newStageProgress).every(v=>v>=100);
    const totalProgress = Math.round(Object.values(newStageProgress).reduce((a,b)=>a+b,0)/3);
    updateSim(currentSim.id, { stageProgress:newStageProgress, progress:totalProgress, status:allDone?'done':'active' });
    showToast(`+${xpEarned} XP! Score: ${sc}/100`);
    if (isLast) {
      const avg = Math.round(Object.values({...newResults}).reduce((a,b)=>a+(b.score||0),0)/Object.keys({...newResults}).length);
      const cert = { id:`CERT-${currentSim.id.toUpperCase()}-${currentStage.slice(0,3).toUpperCase()}-${String(Date.now()).slice(-4)}`,
        title:`${currentSim.title} (${stageInfo.label})`, icon:currentSim.icon, color:currentSim.color, score:avg, stage:currentStage,
        date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) };
      update({ certs:[...(user?.certs||[]),cert] });
      setModalStage({ cert, avg });
    } else {
      setModalDone({ score:sc });
    }
  };

  const nextTask = () => { setModalDone(null); loadTask(currentTask+1); };

  const mm = `${String(Math.floor(timerSec/60)).padStart(2,'0')}:${String(timerSec%60).padStart(2,'0')}`;
  const timerColor = timerSec>300?'rgba(52,211,153,.1)':timerSec>60?'rgba(245,158,11,.1)':'rgba(248,113,113,.1)';
  const timerBorder = timerSec>300?'rgba(52,211,153,.2)':timerSec>60?'rgba(245,158,11,.2)':'rgba(248,113,113,.2)';
  const timerText = timerSec>300?'var(--accent2)':timerSec>60?'var(--accent3)':'var(--rose)';

  if (!currentSim || !task) return (
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)',flexDirection:'column',gap:12}}>
      No simulation selected.
      <span style={{color:'var(--accent)',cursor:'pointer'}} onClick={()=>navigate('/simulations')}>Browse simulations →</span>
    </div>
  );

  return (
    <>
      <style>{`
        .ide-topbar { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .ide-topbar::-webkit-scrollbar { display: none; }

        /* Desktop layout */
        .ide-body { display: grid; grid-template-columns: 280px 1fr 260px 280px; flex: 1; overflow: hidden; }
        .ide-panel-tasks, .ide-panel-editor, .ide-panel-output, .ide-panel-team { display: flex !important; }
        .ide-mob-tabs { display: none; }
        .ide-task-toggle { display: none !important; }

        @media (max-width: 768px) {
          /* Mobile: single column, tab-switched */
          .ide-body { display: flex; flex-direction: column; }
          .ide-panel-tasks  { display: none !important; }
          .ide-panel-editor { display: none !important; }
          .ide-panel-output { display: none !important; }
          .ide-panel-team   { display: none !important; }

          .ide-panel-tasks.mob-active  { display: flex !important; flex: 1; }
          .ide-panel-editor.mob-active { display: flex !important; flex: 1; }
          .ide-panel-output.mob-active { display: flex !important; flex: 1; }
          .ide-panel-team.mob-active   { display: flex !important; flex: 1; }

          .ide-mob-tabs { display: flex; background: var(--s2); border-bottom: 1px solid var(--border); flex-shrink: 0; }
          .ide-mob-tab  { flex: 1; padding: 10px 4px; font-size: 11px; font-weight: 600; text-align: center; cursor: pointer; border-bottom: 2px solid transparent; color: var(--muted2); }
          .ide-mob-tab.active { color: var(--accent); border-color: var(--accent); }
        }
      `}</style>

      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

        {/* IDE Topbar — fixed, all buttons visible via scroll */}
        <div className="ide-topbar" style={{
          height:44, background:'var(--s2)', borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', padding:'0 12px', gap:8,
          flexShrink:0, whiteSpace:'nowrap',
        }}>
          <div style={{fontFamily:'var(--mono)',fontSize:12,padding:'4px 10px',borderRadius:6,fontWeight:700,
            background:timerColor,color:timerText,border:`1px solid ${timerBorder}`,flexShrink:0}}>
            ⏱ {mm}
          </div>
          <button onClick={runCode} style={{padding:'6px 16px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:7,fontSize:13,fontWeight:700,cursor:'pointer',flexShrink:0}}>▶ Run</button>
          <button onClick={validateCode} style={{padding:'6px 14px',background:'rgba(96,165,250,.12)',color:'#60A5FA',border:'1px solid rgba(96,165,250,.25)',borderRadius:7,fontSize:13,fontWeight:700,cursor:'pointer',flexShrink:0}}>🔍 Validate</button>
          <button onClick={()=>handleSubmit(false)} disabled={!validationPassed} style={{padding:'6px 14px',background:validationPassed?'rgba(52,211,153,.18)':'var(--s3)',color:validationPassed?'var(--accent2)':'var(--muted)',border:`1px solid ${validationPassed?'rgba(52,211,153,.45)':'var(--border)'}`,borderRadius:7,fontSize:13,fontWeight:700,cursor:validationPassed?'pointer':'not-allowed',flexShrink:0}}>✓ Submit</button>
          <select value={lang}
           onChange={e => {
               const newLang = e.target.value;
               setLang(newLang);
               const starter = task.starterCodes?.[newLang] || task.starterCode;
                setCode(starter);
                showToast(`Switched to ${newLang}`);
                }}
                 style={{background:'var(--s3)',border:'1px solid var(--border)',borderRadius:6,color:'var(--text)',padding:'4px 8px',fontSize:12,outline:'none',flexShrink:0}}>
            {(currentSim.languages||['JavaScript']).map(l=><option key={l}>{l}</option>)}
          </select>
          <div style={{fontSize:12,color:'var(--muted2)',flexShrink:0}}>Task {currentTask+1}/{tasks.length}</div>
        </div>

        {/* Mobile panel tabs */}
        <div className="ide-mob-tabs">
          {[['tasks','📋 Tasks'],['editor','💻 Code'],['output','📊 Output'],['team','👥 Team']].map(([key,label])=>(
            <div key={key} className={`ide-mob-tab${mobilePanel===key?' active':''}`}
              onClick={()=>setMobilePanel(key)}>{label}</div>
          ))}
        </div>

        {/* IDE Body */}
        <div className="ide-body">
          <div className={`ide-panel-tasks${mobilePanel==='tasks'?' mob-active':''}`}
            style={{flexDirection:'column',overflow:'hidden'}}>
            <TaskPanel tasks={tasks} current={currentTask} results={taskResults} onSwitch={(i)=>{loadTask(i);setMobilePanel('editor');}}/>
          </div>

          <div className={`ide-panel-editor${mobilePanel==='editor'?' mob-active':''}`}
            style={{flexDirection:'column',overflow:'hidden'}}>
            <CodeEditor code={code} onChange={setCode}/>
          </div>

          <div className={`ide-panel-output${mobilePanel==='output'?' mob-active':''}`}
            style={{flexDirection:'column',overflow:'hidden'}}>
            <OutputPanel activeTab={activeTab} onTab={setActiveTab} output={output} tests={tests} valResult={valResult} score={score}/>
          </div>

          <div className={`ide-panel-team${mobilePanel==='team'?' mob-active':''}`}
            style={{flexDirection:'column',overflow:'hidden'}}>
            <TeamPanel msgs={teamMsgs}/>
          </div>
        </div>

        {/* Task Complete Modal */}
        {modalDone && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',backdropFilter:'blur(6px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <div style={{background:'var(--s2)',border:'1px solid var(--border2)',borderRadius:20,padding:40,maxWidth:400,width:'100%',textAlign:'center'}}>
              <div style={{fontSize:52,marginBottom:16}}>🎉</div>
              <div style={{fontSize:24,fontWeight:800,marginBottom:8}}>Task Complete!</div>
              <div style={{fontSize:56,fontWeight:900,color:'var(--accent2)',margin:'8px 0'}}>{modalDone.score}</div>
              <div style={{fontSize:14,color:'var(--muted2)',marginBottom:24}}>Score out of 100</div>
              <div style={{display:'flex',gap:12,justifyContent:'center'}}>
                <button onClick={nextTask} style={{padding:'12px 28px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer'}}>Next Task →</button>
                <button onClick={()=>setModalDone(null)} style={{padding:'12px 28px',background:'transparent',border:'1px solid var(--border2)',color:'var(--muted2)',borderRadius:10,fontSize:14,cursor:'pointer'}}>Stay Here</button>
              </div>
            </div>
          </div>
        )}

        {/* Stage Complete Modal */}
        {modalStage && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',backdropFilter:'blur(6px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <div style={{background:'var(--s2)',border:'1px solid var(--border2)',borderRadius:20,padding:40,maxWidth:500,width:'100%',textAlign:'center'}}>
              <div style={{fontSize:52,marginBottom:16}}>🏆</div>
              <div style={{fontSize:24,fontWeight:800,marginBottom:8}}>Stage Complete!</div>
              <div style={{background:'var(--s1)',border:'1px solid var(--border)',borderRadius:12,padding:20,margin:'16px 0',textAlign:'left'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--accent)',marginBottom:6}}>{modalStage.cert.id}</div>
                <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{user?.fname} {user?.lname}</div>
                <div style={{fontSize:13,color:'var(--muted2)',marginBottom:8}}>has completed the {currentSim.title} Simulation — {stageInfo.label} Stage</div>
                <div style={{fontSize:12,color:'var(--accent2)'}}>Score: <strong>{modalStage.avg}</strong>/100 · {modalStage.cert.date}</div>
              </div>
              <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                <button onClick={()=>{showToast('📄 Certificate saved to your profile!');setModalStage(null);navigate('/profile');}} style={{padding:'12px 24px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer'}}>View Profile 📄</button>
                <button onClick={()=>{setModalStage(null);navigate('/simulations');}} style={{padding:'12px 24px',background:'transparent',border:'1px solid var(--border2)',color:'var(--muted2)',borderRadius:10,fontSize:14,cursor:'pointer'}}>Back to Sims</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}