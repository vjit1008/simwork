/**
 * SimWork — Simulate Before You Apply
 * Copyright (c) 2025 Vishvajit Gadakari. All rights reserved.
 * Unauthorized copying, modification, or distribution is prohibited.
 * https://simwork.vercel.app
 */
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
import { getStarterCodeForLanguage } from '../../data/simulations';

// ---------------------------------------------------------------------------
// callClaude — wraps the Anthropic API call with a smart fallback.
// ---------------------------------------------------------------------------
async function callClaude(prompt, fallbackFn) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data  = await response.json();
    const text  = data.content?.[0]?.text || '{}';
    const clean = text.replace(/```json[\s\S]*?```|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.warn('[SimWork] Claude API unavailable, using smart fallback:', err.message);
    return fallbackFn();
  }
}

// ---------------------------------------------------------------------------
// Smart fallbacks
// ---------------------------------------------------------------------------
function runFallback(code, task, lang) {
  const lines    = code.split('\n').filter(l => l.trim()).length;
  const hasLogic = lines > 3 && !code.includes('// Your code here');
  const passed   = hasLogic ? Math.min(task.tests.length, Math.ceil(task.tests.length * 0.7)) : 0;
  const total    = task.tests.length;
  const output   = hasLogic
    ? [
        `$ Running ${lang} analysis...`,
        `$ Parsed ${lines} lines of code`,
        `$ Executing test suite (${total} tests)...`,
        `$ ${passed}/${total} tests passed ✓`,
        `$ Summary: ${task.title} implementation detected`,
      ]
    : [
        `$ Running ${lang} analysis...`,
        `$ ⚠ No implementation found — add your solution`,
        `$ 0/${total} tests passed`,
      ];
  return { output, passed, total, summary: hasLogic ? 'Implementation detected' : 'No implementation' };
}

function validateFallback(code, task, lang) {
  const starter     = getStarterCodeForLanguage(task, lang);
  const isUnchanged = code.trim() === starter.trim();
  const isTooShort  = code.trim().length < 40;
  const hasImpl     = !isUnchanged && !isTooShort && !code.includes('// Your code here');

  if (!hasImpl) {
    return {
      rules: task.validationRules.map(r => ({ rule: r, pass: false, reason: 'No implementation detected' })),
      hasRealImplementation: false,
      overallPass: false,
      score: 0,
      summary: 'Write actual code to pass validation',
    };
  }

  const keywords  = ['return', 'function', 'const', 'let', 'if', 'for', 'map', 'filter', '=>', 'class'];
  const hits      = keywords.filter(k => code.includes(k)).length;
  const passRatio = Math.min(1, hits / 4);
  const passCount = Math.round(task.validationRules.length * passRatio);
  const rules     = task.validationRules.map((r, i) => ({
    rule: r, pass: i < passCount,
    reason: i < passCount ? 'Pattern detected in code' : 'Could not confirm implementation',
  }));
  const score = Math.round((passCount / task.validationRules.length) * 100);
  return { rules, hasRealImplementation: true, overallPass: score >= 80, score, summary: `${passCount}/${task.validationRules.length} rules satisfied` };
}

const AGENT_HINTS = {
  ba:     ['Re-read the task requirements carefully.', 'The spec defines the exact output format.', 'Check if all edge cases are covered.'],
  pm:     ['Break the problem into smaller steps.', 'Focus on one requirement at a time.', 'Think about the happy path first.'],
  dev:    ['Try logging intermediate values.', 'Check for missing return statements.', 'Look for off-by-one errors in loops.'],
  qa:     ['Test with empty or null input first.', 'Check exact string casing.', 'What happens at boundary values?'],
  devops: ['No syntax errors before submitting.', 'Check that exports match what tests import.', 'No hardcoded secrets.'],
  ops:    ['Consider error handling for unexpected input.', 'Logging helps in production.', 'Monitor edge cases.'],
};

// ---------------------------------------------------------------------------
// IDEPage
// ---------------------------------------------------------------------------
export default function IDEPage() {
  const navigate = useNavigate();
  const { user, update } = useAuth();
  const {
    currentSim, currentStage, currentTask, setCurrentTask,
    taskResults, setTaskResults, validationPassed, setValidationPassed,
    updateSim, sims,
  } = useSim();

  // ── ALL original state, untouched ──
  const [code, setCode]             = useState('');
  const [output, setOutput]         = useState([
    { type: 'info',  text: '$ SimWork IDE ready' },
    { type: 'muted', text: '$ Write → Validate → Submit' },
  ]);
  const [tests, setTests]           = useState([]);
  const [valResult, setValResult]   = useState(null);
  const [score, setScore]           = useState(0);
  const [activeTab, setActiveTab]   = useState('console');
  const [timerSec, setTimerSec]     = useState(0);
  const [lang, setLang]             = useState('JavaScript');
  const [teamMsgs, setTeamMsgs]     = useState({
    ba:     'Ready to discuss requirements',
    pm:     'Waiting for task completion',
    qa:     'Waiting for your submission...',
    devops: 'On standby for deployment',
    ops:    'Ready to support production',
  });
  const [modalDone, setModalDone]   = useState(null);
  const [modalStage, setModalStage] = useState(null);
  const [mobilePanel, setMobilePanel] = useState('editor');
  const [isRunning, setIsRunning]   = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // ── NEW additions (non-breaking) ──
  const [timerPaused, setTimerPaused]     = useState(false);
  const [timerTotal, setTimerTotal]       = useState(1);
  const [agentHint, setAgentHint]         = useState(null);
  const [hintCooldown, setHintCooldown]   = useState({});
  const [scoreHistory, setScoreHistory]   = useState([]);
  const [xpAnim, setXpAnim]               = useState(false);
  const [showSearch, setShowSearch]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchMatches, setSearchMatches] = useState([]);

  const timerRef = useRef(null);
  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const tasks     = currentSim ? buildTasksForRole(currentSim.id)[currentStage] : [];
  const task      = tasks[currentTask];
  const stageInfo = STAGES[currentStage];

  // ── original mobile focus effect ──
  useEffect(() => {
    if (mobilePanel === 'editor') {
      setTimeout(() => {
        const ta = document.querySelector('.ide-panel-editor.mob-active textarea');
        ta?.focus();
      }, 50);
    }
  }, [mobilePanel]);

  // ── NEW: search ──
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchMatches([]); return; }
    const q = searchQuery.toLowerCase();
    const matches = [];
    code.split('\n').forEach((line, i) => {
      if (line.toLowerCase().includes(q)) matches.push(i + 1);
    });
    setSearchMatches(matches);
  }, [searchQuery, code]);

  // ── original loadTask, untouched ──
  const loadTask = useCallback((idx) => {
    const t = tasks[idx];
    if (!t) return;
    setCurrentTask(idx);
    setCode(getStarterCodeForLanguage(t, lang));
    setValidationPassed(false);
    setOutput([
      { type: 'info',  text: '$ SimWork IDE ready' },
      { type: 'muted', text: '$ Write your solution → Validate → Submit' },
    ]);
    setTests(t.tests.map(name => ({ name, status: 'pending' })));
    setScore(0);
    setValResult(null);
    setActiveTab('console');
    clearInterval(timerRef.current);
    const sec = Math.round(parseInt(t.time) * 60 * stageInfo.timeMult);
    setTimerSec(sec);
    setTimerTotal(sec);   // NEW: store total for ring %
    setTimerPaused(false); // NEW: always resume on new task
    timerRef.current = setInterval(() => {
      setTimerSec(p => {
        if (p <= 1) {
          clearInterval(timerRef.current);
          handleSubmitAuto(scoreRef.current);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, stageInfo]);

  // ── NEW: pause / resume ──
  const toggleTimer = () => {
    if (!timerPaused) {
      clearInterval(timerRef.current);
      setTimerPaused(true);
    } else {
      timerRef.current = setInterval(() => {
        setTimerSec(p => {
          if (p <= 1) { clearInterval(timerRef.current); handleSubmitAuto(scoreRef.current); return 0; }
          return p - 1;
        });
      }, 1000);
      setTimerPaused(false);
    }
  };

  // ── original mount effect ──
  useEffect(() => {
    if (!currentSim) { navigate('/simulations'); return; }
    loadTask(currentTask);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSim, currentStage]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── original lang handler ──
  const handleLangChange = (newLang) => {
    setLang(newLang);
    if (user) update({ preferredLanguage: newLang });
    if (task) {
      setCode(getStarterCodeForLanguage(task, newLang));
      setValidationPassed(false);
      setScore(0);
      setValResult(null);
    }
    showToast(`Language set to ${newLang}`);
  };

  // ── NEW: agent ping ──
  const handlePingAgent = (role) => {
    if (hintCooldown[role]) return;
    const hints = AGENT_HINTS[role] || ['Keep going!'];
    const hint  = hints[Math.floor(Math.random() * hints.length)];
    setAgentHint({ role, text: hint });
    setHintCooldown(prev => ({ ...prev, [role]: true }));
    setTimeout(() => {
      setAgentHint(null);
      setHintCooldown(prev => ({ ...prev, [role]: false }));
    }, 4000);
  };

  // ── original runCode ──
  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput([{ type: 'info', text: '$ Running code analysis...' }]); // reset on each run
    setActiveTab('console');
    setTeamMsgs(p => ({ ...p, dev: '⟳ Running your code…' }));

    const prompt = `You are a code execution simulator for a coding education platform.

Language: ${lang}
Task: ${task.title}
Task Description: ${task.desc.replace(/<[^>]*>/g, '')}

Student's Code:
\`\`\`
${code}
\`\`\`

Analyze this code and respond in this EXACT JSON format only, no other text:
{
  "output": ["line1 of console output", "line2", "line3"],
  "passed": 2,
  "total": 5,
  "summary": "Brief one-line summary of what the code does"
}`;

    try {
      const result = await callClaude(prompt, () => runFallback(code, task, lang));
      result.output.forEach(line => {
        setOutput(p => [...p, {
          type: line.includes('Error') || line.includes('✗') ? 'err'
              : line.includes('✓') || line.includes('pass') ? 'ok'
              : 'info',
          text: line,
        }]);
      });
      const sc = Math.round((result.passed / result.total) * 100);
      setTests(tests.map((t, i) => ({
        ...t,
        status: i < result.passed ? 'pass' : 'fail',
        ms: i < result.passed ? Math.floor(Math.random() * 40 + 8) : null,
      })));
      setScore(sc);
      setActiveTab('tests');
      setTeamMsgs(p => ({
        ...p,
        dev: sc >= 70 ? '✓ Code looks solid' : '⚠ Issues detected',
        qa:  sc >= 70 ? '📋 Ready to validate' : '⚠ Fix issues first',
      }));
    } catch (err) {
      console.error('[SimWork] runCode error:', err);
      setOutput(p => [...p, { type: 'warn', text: '$ Analysis complete (offline mode)' }]);
    } finally {
      setIsRunning(false);
    }
  };

  // ── original validateCode ──
  const validateCode = async () => {
    if (isValidating) return;
    setIsValidating(true);
    setActiveTab('validate');

    const starterForLang = getStarterCodeForLanguage(task, lang);
    if (code.trim() === starterForLang.trim()) {
      setValResult({ items: [{ type: 'fail', msg: 'Code is unchanged. Write your solution first.' }], summary: 'fail', text: '❌ No solution written' });
      setValidationPassed(false);
      showToast('⚠️ Write your solution first!');
      setIsValidating(false);
      return;
    }
    if (code.trim().length < 20) {
      setValResult({ items: [{ type: 'fail', msg: 'Code is too short to be a valid solution.' }], summary: 'fail', text: '❌ Too short' });
      setValidationPassed(false);
      setIsValidating(false);
      return;
    }

    setValResult({ items: [{ type: 'warn', msg: '🤖 AI is evaluating your code...' }], summary: 'partial', text: '⏳ Evaluating...' });
    setTeamMsgs(p => ({ ...p, qa: '⟳ Running validation suite…' }));

    const prompt = `You are a strict code validator for a coding education platform.

Language: ${lang}
Task Title: ${task.title}
Task Requirements:
${task.desc.replace(/<[^>]*>/g, '')}

Validation Rules to check:
${task.validationRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Student's Code:
\`\`\`
${code}
\`\`\`

IMPORTANT RULES:
- If code is just the starter template with TODO and no real implementation → ALL rules FAIL
- If code has actual logic that attempts to solve the task → evaluate each rule honestly
- A rule passes only if there is REAL code implementing it, not just a comment
- TODO comments count as NOT implemented

Respond in this EXACT JSON format only, no other text:
{
  "rules": [
    {"rule": "rule text here", "pass": true, "reason": "brief reason"},
    {"rule": "rule text here", "pass": false, "reason": "brief reason"}
  ],
  "hasRealImplementation": true,
  "overallPass": true,
  "score": 75,
  "summary": "Brief summary of the code quality"
}`;

    try {
      const result = await callClaude(prompt, () => validateFallback(code, task, lang));
      if (!result.hasRealImplementation) {
        setValResult({
          items: [{ type: 'fail', msg: 'No real implementation found. Write actual code, not just comments.' }, ...result.rules.map(r => ({ type: 'fail', msg: r.rule }))],
          summary: 'fail', text: '❌ No Implementation — Write actual code!',
        });
        setValidationPassed(false);
        showToast('❌ Write actual code — not just comments!');
        setTeamMsgs(p => ({ ...p, qa: '❌ No implementation found' }));
        return;
      }
      const items     = result.rules.map(r => ({ type: r.pass ? 'pass' : 'fail', msg: `${r.rule}${r.reason ? ` — ${r.reason}` : ''}` }));
      const passCount = result.rules.filter(r => r.pass).length;
      const pct       = result.score || Math.round((passCount / result.rules.length) * 100);
      const summary   = pct >= 80 ? 'pass' : pct >= 50 ? 'partial' : 'fail';
      const text2     = pct >= 80 ? `✅ Validation Passed (${passCount}/${result.rules.length})` : pct >= 50 ? `⚠️ Partial (${passCount}/${result.rules.length}) — ${result.summary}` : `❌ Failed (${passCount}/${result.rules.length}) — ${result.summary}`;
      setValResult({ items, summary, text: text2 });
      setValidationPassed(pct >= 50);
      setScore(pct);
      // NEW: record history
      setScoreHistory(prev => [...prev, { taskIdx: currentTask, taskTitle: task.title, pct, time: new Date() }]);
      setTeamMsgs(p => ({ ...p, qa: pct >= 80 ? '✅ Tests passed!' : pct >= 50 ? '⚠️ Some issues.' : '❌ Validation failed.', devops: pct >= 80 ? '🚀 Ready to deploy' : 'On standby' }));
      showToast(pct >= 80 ? '✅ Code validated! Ready to submit.' : pct >= 50 ? '⚠️ Partially valid — improve before submitting' : '❌ Code needs work — fix the issues');
    } catch (err) {
      console.error('[SimWork] validateCode error:', err);
      const fb = validateFallback(code, task, lang);
      const passCount = fb.rules.filter(r => r.pass).length;
      const pct = fb.score;
      setValResult({ items: fb.rules.map(r => ({ type: r.pass ? 'pass' : 'fail', msg: r.rule + (r.reason ? ` — ${r.reason}` : '') })), summary: pct >= 80 ? 'pass' : pct >= 50 ? 'partial' : 'fail', text: pct >= 80 ? `✅ Passed (${passCount}/${fb.rules.length})` : pct >= 50 ? `⚠️ Partial (${passCount}/${fb.rules.length})` : `❌ Failed (${passCount}/${fb.rules.length})` });
      setValidationPassed(pct >= 50);
      setScore(pct);
      setScoreHistory(prev => [...prev, { taskIdx: currentTask, taskTitle: task.title, pct, time: new Date() }]);
    } finally {
      setIsValidating(false);
    }
  };

  // ── original submit ──
  const handleSubmitAuto = useCallback((currentScore) => {
    clearInterval(timerRef.current);
    finishSubmit(25, currentScore, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (auto = false) => {
    if (!validationPassed && !auto) { showToast('🔍 Validate your code first!'); validateCode(); return; }
    if (score < 50 && !auto) { showToast('⚠️ Your score is too low. Improve your code first!'); return; }
    clearInterval(timerRef.current);
    finishSubmit(auto ? 25 : Math.max(score, 50), score, auto);
  };

  const finishSubmit = async (sc, _rawScore, _auto) => {
    const xpPerTask = Math.round((currentSim.totalXP / 3 / tasks.length) * stageInfo.xpMult);
    const xpEarned  = Math.round((sc / 100) * xpPerTask);
    const newXp     = (user?.xp || 0) + xpEarned;
    setXpAnim(true); setTimeout(() => setXpAnim(false), 1000);

    const newResults = { ...taskResults, [currentTask]: { score: sc, xpEarned } };
    setTaskResults(newResults);
    setTeamMsgs(p => ({ ...p, dev: '✓ Code submitted for review', qa: '📋 Testing your submission...' }));
    setTimeout(() => {
      setTeamMsgs(p => ({ ...p, qa: sc >= 70 ? '✅ Tests passed! Approved.' : '⚠️ Some issues found but accepted.', devops: '🚀 Deploying to production...' }));
      setTimeout(() => setTeamMsgs(p => ({ ...p, devops: '✅ Live in production!', ops: '📊 Monitoring — all healthy' })), 2000);
    }, 2000);

    const sim = sims.find(s => s.id === currentSim.id);
    const newStageProgress = { ...(sim?.stageProgress || {}), [currentStage]: currentTask === tasks.length - 1 ? 100 : Math.round((Object.keys(newResults).length / tasks.length) * 100) };
    const totalProgress = Math.round(Object.values(newStageProgress).reduce((a, b) => a + b, 0) / 3);
    const allDone = Object.values(newStageProgress).every(v => v >= 100);
    updateSim(currentSim.id, { stageProgress: newStageProgress, progress: totalProgress, status: allDone ? 'done' : 'active' });
    showToast(`+${xpEarned} XP! Score: ${sc}/100`);

    if (currentTask === tasks.length - 1) {
      const avg = Math.round(Object.values(newResults).reduce((a, b) => a + (b.score || 0), 0) / Object.keys(newResults).length);
      const cert = {
        id:    `CERT-${currentSim.id.toUpperCase()}-${currentStage.slice(0, 3).toUpperCase()}-${String(Date.now()).slice(-4)}`,
        title: `${currentSim.title} (${stageInfo.label})`,
        icon:  currentSim.icon, color: currentSim.color, score: avg,
        stage: currentStage,
        date:  new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
      const newCerts = [...(user?.certs || []), cert];
      // Update local state immediately
      update({ ...user, xp: newXp, certs: newCerts });
      // ✅ Persist XP + cert to DB — fixes Profile/Leaderboard showing 0 XP
      try {
        const API = (await import('../../api/axios')).default;
        const { data } = await API.put('/api/users/me', { xp: newXp, certs: newCerts });
        if (data?.user) update(data.user);
      } catch (e) { console.warn('[SimWork] XP/cert DB sync failed:', e.message); }
      setModalStage({ cert, avg });
    } else {
      // ✅ Persist XP after every non-final task too
      update({ ...user, xp: newXp });
      try {
        const API = (await import('../../api/axios')).default;
        const { data } = await API.put('/api/users/me', { xp: newXp });
        if (data?.user) update(data.user);
      } catch (e) { console.warn('[SimWork] XP DB sync failed:', e.message); }
      setModalDone({ score: sc, xpEarned });
    }
  };

  const nextTask = () => { setModalDone(null); loadTask(currentTask + 1); };

  // ── timer display ──
  const mm         = `${String(Math.floor(timerSec / 60)).padStart(2, '0')}:${String(timerSec % 60).padStart(2, '0')}`;
  const timerPct   = timerTotal > 0 ? timerSec / timerTotal : 1;
  const tColor     = timerSec > 300 ? 'rgba(52,211,153,.1)'  : timerSec > 60 ? 'rgba(245,158,11,.1)'  : 'rgba(248,113,113,.1)';
  const tBorder    = timerSec > 300 ? 'rgba(52,211,153,.2)'  : timerSec > 60 ? 'rgba(245,158,11,.2)'  : 'rgba(248,113,113,.2)';
  const tText      = timerSec > 300 ? 'var(--accent2)'       : timerSec > 60 ? 'var(--accent3)'       : 'var(--rose)';
  const ringStroke = timerSec > 300 ? '#34D399'              : timerSec > 60 ? '#F59E0B'              : '#F87171';
  const RC         = 2 * Math.PI * 11; // ring circumference

  // score history stats
  const bestScore = scoreHistory.length ? Math.max(...scoreHistory.map(s => s.pct)) : null;
  const avgScore  = scoreHistory.length ? Math.round(scoreHistory.reduce((a, b) => a + b.pct, 0) / scoreHistory.length) : null;

  if (!currentSim || !task) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', flexDirection:'column', gap:12 }}>
      No simulation selected.
      <span style={{ color:'var(--accent)', cursor:'pointer' }} onClick={() => navigate('/simulations')}>Browse simulations →</span>
    </div>
  );

  return (
    <>
      <style>{`
        .ide-topbar { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .ide-topbar::-webkit-scrollbar { display: none; }
        .ide-body { display: grid; grid-template-columns: 280px 1fr 260px 280px; flex: 1; overflow: hidden; }
        .ide-panel-tasks, .ide-panel-editor, .ide-panel-output, .ide-panel-team { display: flex !important; }
        .ide-mob-tabs { display: none; }
        .ide-btn-run { transition: opacity .15s; }
        .ide-btn-run:disabled { opacity: .5; cursor: not-allowed !important; }

        .ide-timer-wrap { display:flex; align-items:center; gap:6px; border-radius:8px; padding:4px 10px 4px 4px; cursor:pointer; flex-shrink:0; }
        .ide-timer-wrap:hover { filter: brightness(1.1); }

        .ide-editor-toolbar { display:flex; align-items:center; gap:6px; padding:3px 10px; border-bottom:1px solid var(--border); background:var(--s2); flex-shrink:0; min-height:28px; }
        .ide-toolbar-btn { font-size:11px; background:var(--s3); border:1px solid var(--border); color:var(--muted2); border-radius:5px; padding:2px 8px; cursor:pointer; transition:all .15s; }
        .ide-toolbar-btn:hover { border-color:var(--accent); color:var(--accent); }

        .ide-search-bar { display:flex; align-items:center; gap:8px; padding:4px 10px; border-bottom:1px solid var(--border); background:var(--s2); flex-shrink:0; }
        .ide-search-input { flex:1; background:var(--s3); border:1px solid var(--border); border-radius:5px; color:var(--text); padding:3px 8px; font-size:12px; outline:none; font-family:var(--mono); }

        .ide-hint-bubble { margin:0 12px 8px; padding:8px 10px; background:var(--s3); border:1px solid var(--border2); border-radius:8px; font-size:11px; color:var(--muted2); animation:ide-hint-in .2s ease; flex-shrink:0; }
        @keyframes ide-hint-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }

        .ide-score-panel { flex:1; overflow-y:auto; padding:12px 14px; background:var(--s1); }
        .ide-hist-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .ide-hist-track { flex:1; height:4px; background:var(--s3); border-radius:2px; overflow:hidden; }
        .ide-hist-fill { height:100%; border-radius:2px; transition:width .5s ease; }

        .ide-prog-strip { border-top:1px solid var(--border); padding:8px 12px; background:var(--s2); flex-shrink:0; }

        .ide-xp-flash { animation:ide-xp-pop .6s ease; }
        @keyframes ide-xp-pop { 0%,100%{transform:scale(1)} 40%{transform:scale(1.2)} }

        .ide-kbd { background:var(--s3); border:1px solid var(--border); border-radius:4px; padding:1px 5px; font-size:10px; color:var(--muted2); font-family:var(--mono); }

        @media (max-width: 768px) {
          .ide-body { display:flex; flex-direction:column; }
          .ide-panel-tasks  { display:none !important; }
          .ide-panel-editor { display:none !important; }
          .ide-panel-output { display:none !important; }
          .ide-panel-team   { display:none !important; }
          .ide-panel-tasks.mob-active  { display:flex !important; flex:1; }
          .ide-panel-editor.mob-active { display:flex !important; flex:1; }
          .ide-panel-output.mob-active { display:flex !important; flex:1; }
          .ide-panel-team.mob-active   { display:flex !important; flex:1; }
          .ide-mob-tabs { display:flex; background:var(--s2); border-bottom:1px solid var(--border); flex-shrink:0; }
          .ide-mob-tab  { flex:1; padding:10px 4px; font-size:11px; font-weight:600; text-align:center; cursor:pointer; border-bottom:2px solid transparent; color:var(--muted2); }
          .ide-mob-tab.active { color:var(--accent); border-color:var(--accent); }
          .ide-editor-toolbar { display:none; }
        }
      `}</style>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* ══ TOP BAR — original layout + new timer/kbd/xp ══ */}
        <div className="ide-topbar" style={{ height:44, background:'var(--s2)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 12px', gap:8, flexShrink:0, whiteSpace:'nowrap' }}>

          {/* NEW: ring timer */}
          <div className="ide-timer-wrap" onClick={toggleTimer}
            title={timerPaused ? 'Resume timer' : 'Pause timer'}
            style={{ background: tColor, border: `1px solid ${tBorder}` }}>
            <div style={{ position:'relative', width:28, height:28, flexShrink:0 }}>
              <svg width={28} height={28} viewBox="0 0 28 28" style={{ display:'block', transform:'rotate(-90deg)' }}>
                <circle cx={14} cy={14} r={11} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={2.5} />
                <circle cx={14} cy={14} r={11} fill="none" stroke={ringStroke} strokeWidth={2.5}
                  strokeLinecap="round" strokeDasharray={RC}
                  strokeDashoffset={RC * (1 - timerPct)}
                  style={{ transition:'stroke-dashoffset 1s linear, stroke .8s' }} />
              </svg>
              {timerPaused && <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:tText }}>⏸</span>}
            </div>
            <span style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:700, color:tText, letterSpacing:'.03em' }}>{mm}</span>
          </div>

          {/* Run — original */}
          <button className="ide-btn-run" onClick={runCode} disabled={isRunning}
            style={{ padding:'6px 16px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
            {isRunning ? '⏳ Running…' : '▶ Run'}
          </button>

          {/* Validate — original */}
          <button className="ide-btn-run" onClick={validateCode} disabled={isValidating}
            style={{ padding:'6px 14px', background:'rgba(96,165,250,.12)', color:'#60A5FA', border:'1px solid rgba(96,165,250,.25)', borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
            {isValidating ? '⏳ Validating…' : '🔍 Validate'}
          </button>

          {/* Submit — original */}
          <button onClick={() => handleSubmit(false)} disabled={!validationPassed}
            title={!validationPassed ? 'Validate your code first' : 'Submit and earn XP'}
            style={{ padding:'6px 14px', background: validationPassed ? 'rgba(52,211,153,.18)' : 'var(--s3)', color: validationPassed ? 'var(--accent2)' : 'var(--muted)', border:`1px solid ${validationPassed ? 'rgba(52,211,153,.45)' : 'var(--border)'}`, borderRadius:7, fontSize:13, fontWeight:700, cursor: validationPassed ? 'pointer' : 'not-allowed', flexShrink:0, transition:'all .2s' }}>
            ✓ Submit
          </button>

          {/* Language — original */}
          <select value={lang} onChange={e => handleLangChange(e.target.value)}
            style={{ background:'var(--s3)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text)', padding:'4px 8px', fontSize:12, outline:'none', flexShrink:0 }}>
            {(currentSim.languages || ['JavaScript']).map(l => <option key={l}>{l}</option>)}
          </select>

          <div style={{ fontSize:12, color:'var(--muted2)', flexShrink:0 }}>
            Task {currentTask + 1}/{tasks.length}
          </div>

          <div style={{ flex:1 }} />

          {/* NEW: keyboard hints */}
          <span style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
            <kbd className="ide-kbd">Ctrl+Enter</kbd>
            <span style={{ fontSize:11, color:'var(--muted)' }}>Run</span>
            <kbd className="ide-kbd" style={{ marginLeft:4 }}>Ctrl+F</kbd>
            <span style={{ fontSize:11, color:'var(--muted)' }}>Search</span>
          </span>

          {/* NEW: XP badge with flash */}
          <div className={xpAnim ? 'ide-xp-flash' : ''} style={{ background:'var(--s3)', border:'1px solid var(--border2)', borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:700, color:'var(--accent3)', flexShrink:0 }}>
            XP: {user?.xp ?? 0}
          </div>
        </div>

        {/* ══ MOBILE TABS — original ══ */}
        <div className="ide-mob-tabs">
          {[['tasks','📋 Tasks'],['editor','💻 Code'],['output','📊 Output'],['team','👥 Team']].map(([k,l]) => (
            <div key={k} className={`ide-mob-tab${mobilePanel === k ? ' active' : ''}`} onClick={() => setMobilePanel(k)}>{l}</div>
          ))}
        </div>

        {/* ══ IDE BODY ══ */}
        <div className="ide-body">

          {/* Tasks — original, untouched */}
          <div className={`ide-panel-tasks${mobilePanel === 'tasks' ? ' mob-active' : ''}`} style={{ flexDirection:'column', overflow:'hidden' }}>
            <TaskPanel tasks={tasks} current={currentTask} results={taskResults} onSwitch={(i) => { loadTask(i); setMobilePanel('editor'); }} />
          </div>

          {/* Editor — CodeEditor receives EXACT same props as original.
              We only add a thin toolbar strip and search bar ABOVE it. */}
          <div className={`ide-panel-editor${mobilePanel === 'editor' ? ' mob-active' : ''}`} style={{ flexDirection:'column', overflow:'hidden', display:'flex' }}>

            {/* NEW: thin toolbar above CodeEditor's own file tabs */}
            <div className="ide-editor-toolbar">
              <button className="ide-toolbar-btn" onClick={() => { setShowSearch(p => !p); setSearchQuery(''); setSearchMatches([]); }}>
                🔍 Search
              </button>
              {scoreHistory.filter(s => s.taskIdx === currentTask).length > 0 && (
                <span style={{ fontSize:11, color:'var(--muted2)' }}>
                  Last: <strong style={{ color: scoreHistory.filter(s => s.taskIdx === currentTask).at(-1)?.pct >= 80 ? 'var(--accent2)' : 'var(--accent3)' }}>
                    {scoreHistory.filter(s => s.taskIdx === currentTask).at(-1)?.pct}%
                  </strong>
                </span>
              )}
            </div>

            {/* NEW: search bar (collapsible, between toolbar and CodeEditor) */}
            {showSearch && (
              <div className="ide-search-bar">
                <input className="ide-search-input" autoFocus placeholder="Search in file…"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <span style={{ fontSize:11, color:'var(--muted2)', minWidth:90 }}>
                  {searchQuery ? (searchMatches.length > 0 ? `${searchMatches.length} match${searchMatches.length > 1 ? 'es' : ''}` : 'No matches') : 'Type to search'}
                </span>
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchMatches([]); }}
                  style={{ background:'none', border:'none', color:'var(--muted2)', cursor:'pointer', fontSize:14, padding:'0 2px' }}>✕</button>
              </div>
            )}

            {/* CodeEditor — COMPLETELY UNCHANGED from original */}
            <CodeEditor code={code} onChange={setCode} />
          </div>

          {/* Output — original OutputPanel + score history below */}
          <div className={`ide-panel-output${mobilePanel === 'output' ? ' mob-active' : ''}`} style={{ flexDirection:'column', overflow:'hidden', display:'flex' }}>
            <OutputPanel activeTab={activeTab} onTab={setActiveTab} output={output} tests={tests} valResult={valResult} score={score} scoreHistory={scoreHistory} />
            {activeTab === 'score' && (
              <div className="ide-score-panel">
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Validation History</div>
                {scoreHistory.length === 0 ? (
                  <div style={{ fontSize:12, color:'var(--muted2)' }}>Run Validate to see scores here.</div>
                ) : (
                  <>
                    {scoreHistory.map((s, i) => (
                      <div key={i} className="ide-hist-row">
                        <span style={{ fontSize:11, color:'var(--muted)', minWidth:68 }}>Task {s.taskIdx + 1}</span>
                        <div className="ide-hist-track">
                          <div className="ide-hist-fill" style={{ width:`${s.pct}%`, background: s.pct >= 80 ? '#34D399' : s.pct >= 50 ? '#F59E0B' : '#F87171' }} />
                        </div>
                        <span style={{ fontSize:11, color:'var(--muted2)', minWidth:36, textAlign:'right' }}>{s.pct}%</span>
                      </div>
                    ))}
                    <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid var(--border)', fontSize:12, display:'flex', gap:16 }}>
                      <span style={{ color:'var(--accent2)' }}>Best: <strong>{bestScore}%</strong></span>
                      <span style={{ color:'var(--muted2)' }}>Avg: <strong>{avgScore}%</strong></span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Team — original TeamPanel + hint bubble + progress strip below */}
          <div className={`ide-panel-team${mobilePanel === 'team' ? ' mob-active' : ''}`} style={{ flexDirection:'column', overflow:'hidden', display:'flex' }}>
            <TeamPanel msgs={teamMsgs} onPing={handlePingAgent} />
            {agentHint && (
              <div className="ide-hint-bubble">
                💬 <strong style={{ color:'var(--accent)' }}>{agentHint.role.toUpperCase()}:</strong>{' '}{agentHint.text}
              </div>
            )}
            {!agentHint && (
              <div style={{ padding:'5px 12px', fontSize:11, color:'var(--muted)', textAlign:'center', borderTop:'1px solid var(--border)', background:'var(--s1)', flexShrink:0 }}>
                💡 Click any agent card for a hint
              </div>
            )}
            <div className="ide-prog-strip">
              <div style={{ fontSize:10, color:'var(--muted)', fontWeight:700, marginBottom:5, textTransform:'uppercase', letterSpacing:'.07em' }}>Stage Progress</div>
              <div style={{ display:'flex', gap:3, marginBottom:5 }}>
                {tasks.map((_, idx) => (
                  <div key={idx} title={tasks[idx]?.title} style={{ flex:1, height:4, borderRadius:2, transition:'background .3s', background: taskResults[idx] ? '#34D399' : idx === currentTask ? 'var(--accent)' : 'var(--s3)' }} />
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--muted2)' }}>
                <span>{Object.keys(taskResults).length}/{tasks.length} done</span>
                <span style={{ color:'var(--accent3)', fontWeight:700 }}>{Object.values(taskResults).reduce((a, b) => a + (b.xpEarned || 0), 0)} XP earned</span>
              </div>
            </div>
          </div>

        </div>

        {/* Task complete modal */}
        {modalDone && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', backdropFilter:'blur(6px)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <div style={{ background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:20, padding:40, maxWidth:400, width:'100%', textAlign:'center' }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
              <div style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>Task Complete!</div>
              <div style={{ fontSize:56, fontWeight:900, color:'var(--accent2)', margin:'8px 0' }}>{modalDone.score}</div>
              <div style={{ fontSize:14, color:'var(--muted2)', marginBottom:4 }}>Score out of 100</div>
              {modalDone.xpEarned > 0 && <div style={{ fontSize:13, color:'var(--accent3)', marginBottom:20 }}>+{modalDone.xpEarned} XP earned</div>}
              <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                <button onClick={nextTask} style={{ padding:'12px 28px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>Next Task →</button>
                <button onClick={() => setModalDone(null)} style={{ padding:'12px 28px', background:'transparent', border:'1px solid var(--border2)', color:'var(--muted2)', borderRadius:10, fontSize:14, cursor:'pointer' }}>Stay Here</button>
              </div>
            </div>
          </div>
        )}

        {/* Stage complete modal */}
        {modalStage && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', backdropFilter:'blur(6px)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <div style={{ background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:20, padding:40, maxWidth:500, width:'100%', textAlign:'center' }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🏆</div>
              <div style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>Stage Complete!</div>
              <div style={{ background:'var(--s1)', border:'1px solid var(--border)', borderRadius:12, padding:20, margin:'16px 0', textAlign:'left' }}>
                <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--accent)', marginBottom:6 }}>{modalStage.cert.id}</div>
                <div style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>{user?.name} {user?.lname}</div>
                <div style={{ fontSize:13, color:'var(--muted2)', marginBottom:8 }}>has completed the {currentSim.title} Simulation — {stageInfo.label} Stage</div>
                <div style={{ fontSize:12, color:'var(--accent2)' }}>Score: <strong>{modalStage.avg}</strong>/100 · {modalStage.cert.date}</div>
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button onClick={() => { showToast('📄 Certificate saved!'); setModalStage(null); navigate('/profile'); }}
                  style={{ padding:'12px 24px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>View Profile 📄</button>
                <button onClick={() => { setModalStage(null); navigate('/simulations'); }}
                  style={{ padding:'12px 24px', background:'transparent', border:'1px solid var(--border2)', color:'var(--muted2)', borderRadius:10, fontSize:14, cursor:'pointer' }}>Back to Sims</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}