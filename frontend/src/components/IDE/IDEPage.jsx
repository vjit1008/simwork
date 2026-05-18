import { useEffect, useState, useRef, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const LANGUAGES = ['JavaScript', 'Python', 'TypeScript'];

const TASKS = [
  {
    id: 1,
    title: 'Hello World API',
    duration: '25 min',
    description: 'Create a basic Express.js GET /hello endpoint.',
    requirements: [
      'Return HTTP 200',
      'JSON body: { message: "Hello, SimWork!" }',
      'Include timestamp field',
    ],
    starterCode: {
      JavaScript: `// Task 1: Hello World API
const express = require('express');
const app = express();

// TODO: Create GET /hello endpoint
app.get('/hello', (req, res) => {
  // Your code here

});

app.listen(3000);
module.exports = app;`,
      Python: `# Task 1: Hello World API
from flask import Flask, jsonify
import datetime

app = Flask(__name__)

# TODO: Create GET /hello endpoint
@app.route('/hello')
def hello():
    # Your code here
    pass

if __name__ == '__main__':
    app.run(port=3000)`,
      TypeScript: `// Task 1: Hello World API
import express, { Request, Response } from 'express';
const app = express();

// TODO: Create GET /hello endpoint
app.get('/hello', (req: Request, res: Response) => {
  // Your code here

});

app.listen(3000);
export default app;`,
    },
    tests: [
      { id: 't1', label: 'GET /hello returns 200', hint: 'res.status(200)' },
      { id: 't2', label: 'Response has message field', hint: 'res.json({ message: ... })' },
      { id: 't3', label: 'message equals "Hello, SimWork!"', hint: 'Check the string exactly' },
      { id: 't4', label: 'Response has timestamp field', hint: 'new Date().toISOString()' },
    ],
    solutionKeywords: ['hello', 'simwork', 'timestamp', '200'],
    xp: 100,
  },
  {
    id: 2,
    title: 'Sum Function',
    duration: '15 min',
    description: 'Write a function that sums an array of numbers.',
    requirements: [
      'Accept an array of numbers',
      'Return the total sum',
      'Handle empty arrays (return 0)',
    ],
    starterCode: {
      JavaScript: `// Task 2: Sum Function
// TODO: Implement the sum function
function sum(numbers) {
  // Your code here

}

module.exports = { sum };`,
      Python: `# Task 2: Sum Function
# TODO: Implement the sum function
def sum_numbers(numbers):
    # Your code here
    pass`,
      TypeScript: `// Task 2: Sum Function
// TODO: Implement the sum function
function sum(numbers: number[]): number {
  // Your code here

}

export { sum };`,
    },
    tests: [
      { id: 't1', label: 'sum([1, 2, 3]) returns 6', hint: 'Basic addition' },
      { id: 't2', label: 'sum([]) returns 0', hint: 'Handle empty array' },
      { id: 't3', label: 'sum([-1, 1]) returns 0', hint: 'Negatives cancel out' },
      { id: 't4', label: 'sum([100]) returns 100', hint: 'Single element' },
    ],
    solutionKeywords: ['reduce', 'sum', 'return', '0'],
    xp: 75,
  },
  {
    id: 3,
    title: 'Array Filter',
    duration: '15 min',
    description: 'Filter an array of objects based on a property value.',
    requirements: [
      'Accept array and filter key/value',
      'Return matching items only',
      'Case-insensitive string match',
    ],
    starterCode: {
      JavaScript: `// Task 3: Array Filter
// TODO: Implement filterByProperty
function filterByProperty(arr, key, value) {
  // Your code here

}

module.exports = { filterByProperty };`,
      Python: `# Task 3: Array Filter
# TODO: Implement filter_by_property
def filter_by_property(arr, key, value):
    # Your code here
    pass`,
      TypeScript: `// Task 3: Array Filter
function filterByProperty<T>(arr: T[], key: keyof T, value: any): T[] {
  // Your code here

}

export { filterByProperty };`,
    },
    tests: [
      { id: 't1', label: 'Filters by exact match', hint: 'item[key] === value' },
      { id: 't2', label: 'Case-insensitive for strings', hint: '.toLowerCase()' },
      { id: 't3', label: 'Returns empty array when no match', hint: 'filter returns []' },
      { id: 't4', label: 'Does not mutate original array', hint: 'Use .filter()' },
    ],
    solutionKeywords: ['filter', 'toLowerCase', 'key', 'value'],
    xp: 75,
  },
  {
    id: 4,
    title: 'String Reversal',
    duration: '10 min',
    description: 'Reverse a string without using built-in reverse methods.',
    requirements: [
      'No .reverse() allowed',
      'Handle empty string',
      'Preserve Unicode characters',
    ],
    starterCode: {
      JavaScript: `// Task 4: String Reversal
// TODO: Reverse a string manually
function reverseString(str) {
  // Your code here — no .reverse() allowed!

}

module.exports = { reverseString };`,
      Python: `# Task 4: String Reversal
# TODO: Reverse a string manually (no [::-1] shortcut)
def reverse_string(s):
    # Your code here
    pass`,
      TypeScript: `// Task 4: String Reversal
function reverseString(str: string): string {
  // Your code here — no .reverse() allowed!

}

export { reverseString };`,
    },
    tests: [
      { id: 't1', label: '"hello" → "olleh"', hint: 'Loop backwards' },
      { id: 't2', label: 'Empty string returns ""', hint: 'Edge case' },
      { id: 't3', label: '"a" returns "a"', hint: 'Single char' },
      { id: 't4', label: 'No .reverse() used', hint: 'Static analysis check' },
    ],
    solutionKeywords: ['for', 'result', 'return', 'i--'],
    xp: 50,
  },
  {
    id: 5,
    title: 'Async Fetch',
    duration: '20 min',
    description: 'Fetch data from an API and handle errors gracefully.',
    requirements: [
      'Use async/await',
      'Handle network errors',
      'Return parsed JSON',
    ],
    starterCode: {
      JavaScript: `// Task 5: Async Fetch
// TODO: Implement fetchData with error handling
async function fetchData(url) {
  // Your code here

}

module.exports = { fetchData };`,
      Python: `# Task 5: Async Fetch
import aiohttp
import asyncio

# TODO: Implement fetch_data with error handling
async def fetch_data(url):
    # Your code here
    pass`,
      TypeScript: `// Task 5: Async Fetch
async function fetchData(url: string): Promise<any> {
  // Your code here

}

export { fetchData };`,
    },
    tests: [
      { id: 't1', label: 'Returns parsed JSON on success', hint: 'response.json()' },
      { id: 't2', label: 'Throws on 4xx/5xx status', hint: 'Check response.ok' },
      { id: 't3', label: 'Catches network errors', hint: 'try/catch block' },
      { id: 't4', label: 'Function is async', hint: 'async keyword' },
    ],
    solutionKeywords: ['async', 'await', 'fetch', 'catch', 'json'],
    xp: 125,
  },
];

const AGENTS = [
  { id: 'ba',  label: 'BA',  color: '#7C6EFA', role: 'Business Analyst',  tagline: 'Clarifies requirements', idle: 'Ready to discuss requirements', active: 'Reviewing your approach…', done: 'Requirements look good!' },
  { id: 'pm',  label: 'PM',  color: '#F59E0B', role: 'Product Manager',   tagline: 'Tracks priorities',      idle: 'Waiting for task start',      active: 'Monitoring progress…',    done: 'On track — well done!' },
  { id: 'dev', label: 'DEV', color: '#34D399', role: 'Developer',         tagline: 'Building code locally',  idle: 'Standby…',                    active: 'Code review in progress…', done: 'LGTM! Clean code.' },
  { id: 'qa',  label: 'QA',  color: '#60A5FA', role: 'QA Tester',         tagline: 'Ready to validate',      idle: 'Awaiting build…',             active: 'Running test suite…',     done: 'All tests green!' },
];

const AGENT_HINTS = {
  ba:  ['Check the task requirements carefully.', 'The endpoint path must match exactly.', 'Return type matters — check the spec.'],
  pm:  ['You have plenty of time, stay focused.', 'Break it into small steps.', 'Think about edge cases early.'],
  dev: ['Try console.log to debug your values.', 'Check your syntax — missing brackets?', 'Remember to return the value!'],
  qa:  ['Test with empty input first.', 'Check the exact string casing.', 'What happens at the boundary?'],
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const simulateRun = (code, lang, task) => {
  const lines = [];
  const lower = code.toLowerCase();

  lines.push(`$ Running ${lang} solution for Task ${task.id}…`);
  lines.push('');

  const hasTodo = lower.includes('// your code here') || lower.includes('# your code here') || lower.includes('pass\n') || (lower.includes('pass') && !lower.includes('password'));

  if (hasTodo && !task.solutionKeywords.some(k => lower.includes(k))) {
    lines.push('⚠  Detected unimplemented TODO block.');
    lines.push('   Add your solution before running.');
    return { output: lines, success: false, hasOutput: true };
  }

  lines.push('> Process started on port 3000');
  lines.push('> Module loaded successfully');
  lines.push('');

  const score = task.solutionKeywords.filter(k => lower.includes(k)).length;
  if (score >= task.solutionKeywords.length * 0.75) {
    lines.push('✓  No syntax errors detected');
    lines.push('✓  Module exports resolved');
    lines.push('');
    lines.push(`$ Output:`);
    if (task.id === 1) {
      lines.push('  GET /hello → 200 OK');
      lines.push('  {"message":"Hello, SimWork!","timestamp":"' + new Date().toISOString() + '"}');
    } else if (task.id === 2) {
      lines.push('  sum([1,2,3]) → 6');
      lines.push('  sum([])      → 0');
    } else if (task.id === 3) {
      lines.push('  filterByProperty([...], "role", "admin") → [{...}]');
    } else if (task.id === 4) {
      lines.push('  reverseString("hello") → "olleh"');
    } else {
      lines.push('  fetchData("https://api.example.com") → {data: [...]}');
    }
    lines.push('');
    lines.push('✓  Run completed in 142ms');
    return { output: lines, success: true, hasOutput: true };
  } else {
    lines.push('✗  Runtime error:');
    lines.push('   Solution incomplete or incorrect logic detected.');
    lines.push('   Check your implementation and try again.');
    return { output: lines, success: false, hasOutput: true };
  }
};

const simulateValidate = (code, lang, task) => {
  const lower = code.toLowerCase();
  const score = task.solutionKeywords.filter(k => lower.includes(k)).length;
  const ratio = score / task.solutionKeywords.length;
  const hasTodo = lower.includes('your code here') || (lower.includes('pass') && lower.length < 200);

  return task.tests.map((t, i) => {
    if (hasTodo) return { ...t, status: 'fail', msg: 'No implementation found' };
    if (ratio >= 0.75 && i < 3) return { ...t, status: 'pass', msg: 'Assertion passed' };
    if (ratio >= 0.75 && i === 3) return { ...t, status: ratio >= 1.0 ? 'pass' : 'fail', msg: ratio >= 1.0 ? 'Assertion passed' : 'Edge case not handled' };
    return { ...t, status: 'fail', msg: 'Expected value did not match' };
  });
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function IDETasks() {
  const { user } = useAuth();

  /* ── task state ── */
  const [activeTaskIdx, setActiveTaskIdx]   = useState(0);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [xp, setXp]                         = useState(0);
  const [xpAnim, setXpAnim]                 = useState(false);

  /* ── editor state ── */
  const [lang, setLang]           = useState('JavaScript');
  const [codes, setCodes]         = useState(() =>
    TASKS.reduce((acc, t) => {
      acc[t.id] = { ...t.starterCode };
      return acc;
    }, {})
  );
  const [snapshots, setSnapshots] = useState({});
  const [activeFile, setActiveFile] = useState('solution');
  const [cursorLine, setCursorLine] = useState(1);

  /* ── console / test state ── */
  const [activeTab, setActiveTab]       = useState('console');
  const [consoleLines, setConsoleLines] = useState(['$ SimWork IDE ready', '$ Write your solution → Validate → Submit']);
  const [running, setRunning]           = useState(false);
  const [validating, setValidating]     = useState(false);
  const [testResults, setTestResults]   = useState(null);
  const [validated, setValidated]       = useState(false);
  const [runSuccess, setRunSuccess]     = useState(null);

  /* ── timer ── */
  const TOTAL_SECS = 45 * 60;
  const [secsLeft, setSecsLeft]   = useState(TOTAL_SECS);
  const [timerRunning, setTimerRunning] = useState(true);
  const timerRef = useRef(null);

  /* ── panels ── */
  const [sidebarW, setSidebarW]     = useState(220);
  const [rightW, setRightW]         = useState(260);
  const [draggingLeft, setDraggingLeft]   = useState(false);
  const [draggingRight, setDraggingRight] = useState(false);

  /* ── agents ── */
  const [agentStates, setAgentStates] = useState(() =>
    AGENTS.reduce((a, ag) => ({ ...a, [ag.id]: 'idle' }), {})
  );
  const [agentHint, setAgentHint] = useState(null); // { agentId, text }
  const [pingCooldown, setPingCooldown] = useState({});

  /* ── score ── */
  const [scoreHistory, setScoreHistory] = useState([]);

  /* ── search ── */
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState([]);

  const editorRef = useRef(null);

  /* ════ timer ════ */
  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => {
      setSecsLeft(s => {
        if (s <= 1) { clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const timerPct = secsLeft / TOTAL_SECS;
  const timerColor = secsLeft < 300 ? '#F87171' : secsLeft < 600 ? '#F59E0B' : '#34D399';
  const timerFmt = `${String(Math.floor(secsLeft / 60)).padStart(2, '0')}:${String(secsLeft % 60).padStart(2, '0')}`;

  /* ════ panel resize ════ */
  useEffect(() => {
    const onMove = (e) => {
      if (draggingLeft)  setSidebarW(Math.max(160, Math.min(360, e.clientX)));
      if (draggingRight) setRightW(Math.max(200, Math.min(420, window.innerWidth - e.clientX)));
    };
    const onUp = () => { setDraggingLeft(false); setDraggingRight(false); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [draggingLeft, draggingRight]);

  /* ════ derived ════ */
  const task     = TASKS[activeTaskIdx];
  const code     = codes[task.id]?.[lang] ?? '';
  const setCode  = (val) => setCodes(prev => ({ ...prev, [task.id]: { ...prev[task.id], [lang]: val } }));

  const lineCount = code.split('\n').length;
  const isUnlocked = (idx) => idx === 0 || completedTasks.has(TASKS[idx - 1].id);

  /* ════ agent animations ════ */
  const setAgentActive = () =>
    setAgentStates(AGENTS.reduce((a, ag) => ({ ...a, [ag.id]: 'active' }), {}));
  const setAgentDone = () =>
    setAgentStates(AGENTS.reduce((a, ag) => ({ ...a, [ag.id]: 'done' }), {}));
  const setAgentIdle = () =>
    setAgentStates(AGENTS.reduce((a, ag) => ({ ...a, [ag.id]: 'idle' }), {}));

  /* ════ actions ════ */
  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setActiveTab('console');
    setAgentActive();

    // Snapshot before run
    setSnapshots(prev => ({
      ...prev,
      [`${task.id}_${lang}_${Date.now()}`]: code,
    }));

    const lines = ['$ Running…'];
    setConsoleLines(lines);

    setTimeout(() => {
      const result = simulateRun(code, lang, task);
      setConsoleLines(result.output);
      setRunSuccess(result.success);
      setRunning(false);
      if (result.success) setAgentDone(); else setAgentIdle();
    }, 900);
  };

  const handleValidate = () => {
    if (validating) return;
    setValidating(true);
    setActiveTab('tests');
    setTestResults(null);
    setAgentActive();

    setTimeout(() => {
      const results = simulateValidate(code, lang, task);
      setTestResults(results);
      const allPass = results.every(r => r.status === 'pass');
      setValidated(allPass);
      setValidating(false);
      if (allPass) setAgentDone(); else setAgentIdle();

      // Add to score history
      const passed = results.filter(r => r.status === 'pass').length;
      const pct    = Math.round((passed / results.length) * 100);
      setScoreHistory(prev => [...prev, { taskId: task.id, taskTitle: task.title, pct, time: new Date() }]);
    }, 1200);
  };

  const handleSubmit = () => {
    if (!validated) return;
    const already = completedTasks.has(task.id);
    if (!already) {
      setCompletedTasks(prev => new Set([...prev, task.id]));
      setXp(prev => prev + task.xp);
      setXpAnim(true);
      setTimeout(() => setXpAnim(false), 1000);
      setConsoleLines([
        `✓  Task ${task.id} submitted successfully!`,
        `+${task.xp} XP awarded`,
        `Total XP: ${xp + task.xp}`,
        '',
        activeTaskIdx < TASKS.length - 1
          ? `→ Task ${task.id + 1} is now unlocked.`
          : '🎉 All tasks complete! Outstanding work.',
      ]);
      setActiveTab('console');
      setAgentDone();
      if (activeTaskIdx < TASKS.length - 1) {
        setTimeout(() => setActiveTaskIdx(activeTaskIdx + 1), 800);
      }
    }
  };

  const handlePingAgent = (agentId) => {
    if (pingCooldown[agentId]) return;
    const hints = AGENT_HINTS[agentId];
    const hint  = hints[Math.floor(Math.random() * hints.length)];
    setAgentHint({ agentId, text: hint });
    setPingCooldown(prev => ({ ...prev, [agentId]: true }));
    setTimeout(() => {
      setAgentHint(null);
      setPingCooldown(prev => ({ ...prev, [agentId]: false }));
    }, 4000);
  };

  const handleRestoreSnapshot = () => {
    const keys = Object.keys(snapshots).filter(k => k.startsWith(`${task.id}_${lang}_`));
    if (keys.length === 0) return;
    const last = keys[keys.length - 1];
    setCode(snapshots[last]);
    setConsoleLines(['$ Restored last snapshot.']);
  };

  /* ════ search ════ */
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchMatches([]); return; }
    const q = searchQuery.toLowerCase();
    const matches = [];
    code.split('\n').forEach((line, i) => {
      if (line.toLowerCase().includes(q)) matches.push(i + 1);
    });
    setSearchMatches(matches);
  }, [searchQuery, code]);

  /* ════ keyboard shortcut ════ */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f')    { e.preventDefault(); setShowSearch(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [code, lang, task]);

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .ide-root { font-family: 'Inter', system-ui, sans-serif; height: calc(100vh - 56px); display: flex; flex-direction: column; background: #0f1117; color: #e2e8f0; overflow: hidden; }
        .ide-topbar { height: 48px; border-bottom: 1px solid #1e2433; display: flex; align-items: center; gap: 10px; padding: 0 14px; flex-shrink: 0; background: #0f1117; }
        .ide-panels { display: flex; flex: 1; overflow: hidden; }
        .ide-sidebar { display: flex; flex-direction: column; border-right: 1px solid #1e2433; overflow: hidden; flex-shrink: 0; background: #0b0d14; }
        .ide-editor-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .ide-right { display: flex; flex-direction: column; border-left: 1px solid #1e2433; overflow: hidden; flex-shrink: 0; background: #0b0d14; }
        .resize-handle { width: 4px; cursor: col-resize; background: transparent; flex-shrink: 0; transition: background .15s; z-index: 10; }
        .resize-handle:hover, .resize-handle.active { background: #7C6EFA44; }
        .task-item { padding: 10px 14px; cursor: pointer; border-radius: 7px; margin: 2px 8px; transition: background .15s; }
        .task-item:hover { background: rgba(124,110,250,.08); }
        .task-item.active { background: rgba(124,110,250,.16); }
        .task-item.locked { opacity: .45; cursor: not-allowed; }
        .tab-btn { padding: 6px 14px; border: none; background: none; color: #64748b; cursor: pointer; font-size: 12px; border-bottom: 2px solid transparent; transition: all .15s; }
        .tab-btn.active { color: #7C6EFA; border-bottom-color: #7C6EFA; }
        .tab-btn:hover:not(.active) { color: #94a3b8; }
        .top-btn { padding: 6px 14px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; transition: all .15s; }
        .top-btn:active { transform: scale(.97); }
        .run-btn { background: #7C6EFA; color: #fff; }
        .run-btn:hover { background: #6d5ff0; }
        .run-btn:disabled { opacity: .5; cursor: not-allowed; }
        .validate-btn { background: rgba(52,211,153,.12); color: #34D399; border: 1px solid rgba(52,211,153,.25); }
        .validate-btn:hover { background: rgba(52,211,153,.2); }
        .submit-btn { background: rgba(245,158,11,.12); color: #F59E0B; border: 1px solid rgba(245,158,11,.25); }
        .submit-btn:hover:not(:disabled) { background: rgba(245,158,11,.22); }
        .submit-btn:disabled { opacity: .35; cursor: not-allowed; }
        .console-out { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 12px; line-height: 1.7; white-space: pre-wrap; }
        .console-out.pass { color: #34D399; }
        .console-out.fail { color: #F87171; }
        .console-out.warn { color: #F59E0B; }
        .console-out.info { color: #60A5FA; }
        .editor-wrap { flex: 1; display: flex; overflow: hidden; }
        .line-nums { padding: 12px 0; min-width: 44px; text-align: right; color: #3d4a5e; font-family: monospace; font-size: 13px; line-height: 1.6; user-select: none; border-right: 1px solid #1e2433; }
        .line-num { padding: 0 10px 0 6px; height: 20.8px; display: flex; align-items: center; justify-content: flex-end; }
        .line-num.highlight { color: #7C6EFA; background: rgba(124,110,250,.06); }
        .line-num.search-match { background: rgba(245,158,11,.15); color: #F59E0B; }
        .code-editor { flex: 1; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.6; resize: none; border: none; outline: none; background: transparent; color: #e2e8f0; padding: 12px 16px; overflow-y: auto; tab-size: 2; }
        .agent-card { margin: 8px 10px; padding: 10px 12px; border-radius: 10px; background: #12151f; border: 1px solid #1e2433; transition: border-color .3s; cursor: pointer; }
        .agent-card:hover { border-color: #2e3a52; }
        .agent-card.active { border-color: rgba(124,110,250,.35); animation: agent-pulse 2s infinite; }
        .agent-card.done { border-color: rgba(52,211,153,.3); }
        @keyframes agent-pulse { 0%,100%{border-color:rgba(124,110,250,.35)} 50%{border-color:rgba(124,110,250,.7)} }
        .agent-status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; transition: background .3s; }
        .agent-hint-bubble { background: #1a2035; border: 1px solid #2e3a52; border-radius: 8px; padding: 8px 10px; margin: 4px 10px 8px; font-size: 11px; color: #94a3b8; animation: hint-in .2s ease; }
        @keyframes hint-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .xp-badge { background: #1a2035; border: 1px solid #2e3a52; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 700; color: #F59E0B; transition: all .3s; }
        .xp-badge.anim { background: rgba(245,158,11,.2); border-color: #F59E0B; transform: scale(1.15); }
        .test-row { display: flex; align-items: flex-start; gap: 10px; padding: 8px 12px; border-radius: 7px; margin: 2px 0; }
        .test-row.pass { background: rgba(52,211,153,.05); }
        .test-row.fail { background: rgba(248,113,113,.05); }
        .test-row.pending { background: rgba(100,116,139,.05); }
        .test-icon { font-size: 14px; margin-top: 1px; flex-shrink: 0; }
        .score-bar-track { background: #1e2433; border-radius: 4px; height: 4px; overflow: hidden; }
        .score-bar-fill { height: 100%; border-radius: 4px; transition: width .6s ease; }
        .timer-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
        .timer-svg { transform: rotate(-90deg); }
        .timer-track { fill: none; stroke: #1e2433; stroke-width: 3; }
        .timer-prog { fill: none; stroke-width: 3; stroke-linecap: round; transition: stroke-dashoffset .9s linear, stroke .9s; }
        .timer-text { position: absolute; font-size: 11px; font-weight: 700; letter-spacing: .03em; }
        .search-bar { padding: 6px 14px; border-bottom: 1px solid #1e2433; display: flex; align-items: center; gap: 8px; background: #0b0d14; }
        .search-input { flex: 1; background: #1a2035; border: 1px solid #2e3a52; border-radius: 6px; color: #e2e8f0; padding: 4px 10px; font-size: 12px; outline: none; }
        .kbd { background: #1a2035; border: 1px solid #2e3a52; border-radius: 4px; padding: 1px 6px; font-size: 10px; color: #64748b; font-family: monospace; }
        .hint-tooltip { font-size: 10px; color: #64748b; margin-top: 2px; }
        .snapshot-btn { font-size: 11px; background: #1a2035; border: 1px solid #2e3a52; color: #94a3b8; border-radius: 5px; padding: 3px 8px; cursor: pointer; transition: all .15s; }
        .snapshot-btn:hover { border-color: #7C6EFA; color: #7C6EFA; }
        .lock-tooltip { font-size: 11px; color: #F87171; margin-top: 2px; }
        .mobile-tabs { display: none; }
        @media (max-width: 700px) {
          .ide-panels { flex-direction: column; }
          .ide-sidebar { display: none; }
          .ide-right { display: none; }
          .ide-sidebar.mobile-show { display: flex; width: 100% !important; height: 200px; border-right: none; border-bottom: 1px solid #1e2433; }
          .ide-right.mobile-show { display: flex; width: 100% !important; height: 260px; border-left: none; border-top: 1px solid #1e2433; }
          .mobile-tabs { display: flex; border-bottom: 1px solid #1e2433; background: #0b0d14; padding: 0 10px; flex-shrink: 0; }
          .resize-handle { display: none; }
        }
      `}</style>

      <div className="ide-root">

        {/* ── TOP BAR ── */}
        <div className="ide-topbar">
          {/* Timer */}
          <div className="timer-ring" title={timerRunning ? 'Click to pause' : 'Click to resume'}
            style={{ cursor: 'pointer' }} onClick={() => setTimerRunning(p => !p)}>
            <svg className="timer-svg" width={44} height={44} viewBox="0 0 44 44">
              <circle className="timer-track" cx={22} cy={22} r={18} />
              <circle className="timer-prog"
                cx={22} cy={22} r={18}
                stroke={timerColor}
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - timerPct)}`}
              />
            </svg>
            <span className="timer-text" style={{ color: timerColor }}>{timerFmt}</span>
          </div>

          <button className="top-btn run-btn" onClick={handleRun} disabled={running}
            title="Run (Ctrl+Enter)">
            {running ? '⟳' : '▶'} {running ? 'Running…' : 'Run'}
          </button>
          <button className="top-btn validate-btn" onClick={handleValidate} disabled={validating}>
            {validating ? '⟳' : '✓'} {validating ? 'Validating…' : 'Validate'}
          </button>
          <button className="top-btn submit-btn" onClick={handleSubmit} disabled={!validated || completedTasks.has(task.id)}
            title={!validated ? 'Validate first' : completedTasks.has(task.id) ? 'Already submitted' : 'Submit'}>
            ✉ Submit
          </button>

          {/* Language selector */}
          <select value={lang} onChange={e => setLang(e.target.value)}
            style={{ marginLeft: 4, background: '#1a2035', border: '1px solid #2e3a52', color: '#e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', outline: 'none' }}>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>

          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 2 }}>
            Task {activeTaskIdx + 1}/{TASKS.length}
          </span>

          <div style={{ flex: 1 }} />

          {/* Keyboard hint */}
          <span style={{ fontSize: 11, color: '#3d4a5e', display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd className="kbd">Ctrl+Enter</kbd> Run &nbsp;
            <kbd className="kbd">Ctrl+F</kbd> Search
          </span>

          {/* XP */}
          <div className={`xp-badge${xpAnim ? ' anim' : ''}`}>XP: {xp}</div>
        </div>

        {/* ── MOBILE TABS ── */}
        <div className="mobile-tabs">
          {['Tasks', 'Editor', 'Team'].map(t => (
            <button key={t} className={`tab-btn${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        <div className="ide-panels">

          {/* ── SIDEBAR: TASK LIST ── */}
          <div className="ide-sidebar" style={{ width: sidebarW }}>
            <div style={{ padding: '10px 16px 6px', fontSize: 10, fontWeight: 700, color: '#3d4a5e', letterSpacing: '.1em', textTransform: 'uppercase' }}>Tasks</div>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
              {TASKS.map((t, idx) => {
                const unlocked = isUnlocked(idx);
                const done     = completedTasks.has(t.id);
                const active   = activeTaskIdx === idx;
                return (
                  <div key={t.id}
                    className={`task-item${active ? ' active' : ''}${!unlocked ? ' locked' : ''}`}
                    onClick={() => unlocked && setActiveTaskIdx(idx)}
                    title={!unlocked ? `Complete Task ${idx} to unlock` : ''}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: '#3d4a5e', fontWeight: 700 }}>TASK {t.id}</span>
                      {!unlocked && <span style={{ fontSize: 12 }}>🔒</span>}
                      {done && <span style={{ fontSize: 12 }}>✅</span>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#7C6EFA' : '#94a3b8' }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: '#3d4a5e', marginTop: 2 }}>{t.duration}</div>
                    {!unlocked && (
                      <div className="lock-tooltip">Complete task {idx} first</div>
                    )}
                    {done && (
                      <div style={{ marginTop: 4 }}>
                        <div className="score-bar-track"><div className="score-bar-fill" style={{ width: '100%', background: '#34D399' }} /></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Task description */}
            <div style={{ borderTop: '1px solid #1e2433', padding: '12px 14px', background: '#0b0d14' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7C6EFA', marginBottom: 6 }}>Task {task.id}: {task.title}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{task.description}</div>
              {task.requirements.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
                  <span style={{ color: '#34D399', flexShrink: 0 }}>•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RESIZE LEFT ── */}
          <div className={`resize-handle${draggingLeft ? ' active' : ''}`}
            onMouseDown={() => setDraggingLeft(true)} />

          {/* ── EDITOR AREA ── */}
          <div className="ide-editor-area">

            {/* File tabs */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1e2433', background: '#0b0d14', padding: '0 6px' }}>
              {['solution', 'utils'].map(f => (
                <button key={f} className={`tab-btn${activeFile === f ? ' active' : ''}`}
                  onClick={() => setActiveFile(f)}>
                  {f === 'solution' ? `solution.${lang === 'Python' ? 'py' : lang === 'TypeScript' ? 'ts' : 'js'}` : 'utils.js'}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              {/* Snapshot restore */}
              {Object.keys(snapshots).some(k => k.startsWith(`${task.id}_${lang}_`)) && (
                <button className="snapshot-btn" onClick={handleRestoreSnapshot} title="Restore last auto-saved snapshot">
                  ↺ Restore snapshot
                </button>
              )}
              {/* Search toggle */}
              <button className="snapshot-btn" onClick={() => setShowSearch(p => !p)} title="Search in file (Ctrl+F)"
                style={{ marginLeft: 6 }}>
                🔍
              </button>
              <span style={{ fontSize: 11, color: '#3d4a5e', marginLeft: 10, marginRight: 6 }}>Ln {cursorLine}</span>
            </div>

            {/* Search bar */}
            {showSearch && (
              <div className="search-bar">
                <input className="search-input" placeholder="Search in file…" autoFocus
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  {searchMatches.length > 0 ? `${searchMatches.length} match${searchMatches.length > 1 ? 'es' : ''} on line${searchMatches.length > 1 ? 's' : ''} ${searchMatches.slice(0, 5).join(', ')}${searchMatches.length > 5 ? '…' : ''}` : searchQuery ? 'No matches' : ''}
                </span>
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>✕</button>
              </div>
            )}

            {/* Editor */}
            <div className="editor-wrap">
              {/* Line numbers */}
              <div className="line-nums">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className={`line-num${i + 1 === cursorLine ? ' highlight' : ''}${searchMatches.includes(i + 1) ? ' search-match' : ''}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Textarea */}
              <textarea ref={editorRef}
                className="code-editor"
                value={activeFile === 'solution' ? code : '// utils.js\n// Helper utilities — import in your solution\n\nmodule.exports = {};'}
                readOnly={activeFile !== 'solution'}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Tab') { e.preventDefault(); const s = e.target.selectionStart; const v = code; setCode(v.slice(0, s) + '  ' + v.slice(e.target.selectionEnd)); setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0); }
                }}
                onClick={e => {
                  const lines = code.slice(0, e.target.selectionStart).split('\n');
                  setCursorLine(lines.length);
                }}
                onKeyUp={e => {
                  const lines = code.slice(0, e.target.selectionStart).split('\n');
                  setCursorLine(lines.length);
                }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            {/* Console / Tests / Validate / Score / Hints */}
            <div style={{ height: 200, borderTop: '1px solid #1e2433', display: 'flex', flexDirection: 'column', background: '#080a10' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #1e2433', background: '#0b0d14' }}>
                {['console', 'tests', 'validate', 'score', 'hints'].map(t => (
                  <button key={t} className={`tab-btn${activeTab === t ? ' active' : ''}`}
                    onClick={() => setActiveTab(t)}
                    style={{ textTransform: 'capitalize' }}>
                    {t}
                    {t === 'tests' && testResults && (
                      <span style={{ marginLeft: 5, fontSize: 10, background: testResults.every(r => r.status === 'pass') ? 'rgba(52,211,153,.2)' : 'rgba(248,113,113,.2)', color: testResults.every(r => r.status === 'pass') ? '#34D399' : '#F87171', borderRadius: 4, padding: '1px 5px' }}>
                        {testResults.filter(r => r.status === 'pass').length}/{testResults.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>

                {/* Console */}
                {activeTab === 'console' && (
                  <div>
                    {consoleLines.map((line, i) => {
                      const cls = line.startsWith('✓') || line.startsWith('+') ? 'pass'
                        : line.startsWith('✗') || line.startsWith('⚠') ? 'fail'
                        : line.startsWith('$') ? 'info'
                        : line.startsWith('→') ? 'warn'
                        : '';
                      return <div key={i} className={`console-out ${cls}`}>{line || '\u00A0'}</div>;
                    })}
                    {running && <div className="console-out info" style={{ animation: 'agent-pulse 1s infinite' }}>…</div>}
                  </div>
                )}

                {/* Tests */}
                {activeTab === 'tests' && (
                  <div>
                    {validating && <div className="console-out info">Running test suite…</div>}
                    {!validating && !testResults && task.tests.map(t => (
                      <div key={t.id} className="test-row pending">
                        <span className="test-icon" style={{ color: '#3d4a5e' }}>○</span>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{t.label}</div>
                          <div className="hint-tooltip">{t.hint}</div>
                        </div>
                      </div>
                    ))}
                    {testResults && testResults.map(t => (
                      <div key={t.id} className={`test-row ${t.status}`}>
                        <span className="test-icon">{t.status === 'pass' ? '✓' : '✗'}</span>
                        <div>
                          <div style={{ fontSize: 12, color: t.status === 'pass' ? '#34D399' : '#F87171' }}>{t.label}</div>
                          <div className="hint-tooltip">{t.msg}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Validate summary */}
                {activeTab === 'validate' && (
                  <div>
                    {!testResults ? (
                      <div style={{ color: '#64748b', fontSize: 12 }}>Click Validate to check your solution against the test suite.</div>
                    ) : (
                      <>
                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 14, color: validated ? '#34D399' : '#F87171', fontWeight: 700 }}>
                            {validated ? '✓ All tests passing' : '✗ Some tests failed'}
                          </span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>
                            {testResults.filter(r => r.status === 'pass').length}/{testResults.length} passed
                          </span>
                        </div>
                        <div className="score-bar-track" style={{ marginBottom: 12 }}>
                          <div className="score-bar-fill" style={{
                            width: `${(testResults.filter(r => r.status === 'pass').length / testResults.length) * 100}%`,
                            background: validated ? '#34D399' : '#F59E0B',
                          }} />
                        </div>
                        {validated ? (
                          <div style={{ color: '#34D399', fontSize: 12 }}>
                            ✓ Ready to submit! Click Submit to earn {task.xp} XP.
                          </div>
                        ) : (
                          <div style={{ color: '#94a3b8', fontSize: 12 }}>
                            Fix the failing tests and re-validate.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Score history */}
                {activeTab === 'score' && (
                  <div>
                    {scoreHistory.length === 0 ? (
                      <div style={{ color: '#64748b', fontSize: 12 }}>No validation runs yet. Validate a task to see your score.</div>
                    ) : (
                      <>
                        <div style={{ marginBottom: 10, fontSize: 11, color: '#64748b' }}>Validation history</div>
                        {scoreHistory.map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: '#3d4a5e', minWidth: 60 }}>Task {s.taskId}</span>
                            <div className="score-bar-track" style={{ flex: 1 }}>
                              <div className="score-bar-fill" style={{ width: `${s.pct}%`, background: s.pct === 100 ? '#34D399' : s.pct >= 50 ? '#F59E0B' : '#F87171' }} />
                            </div>
                            <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 32 }}>{s.pct}%</span>
                          </div>
                        ))}
                        <div style={{ marginTop: 10, fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>
                          Total XP earned: {xp}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Hints */}
                {activeTab === 'hints' && (
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Task-specific hints — click an agent to get personalised advice.</div>
                    {task.requirements.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                        <span style={{ color: '#7C6EFA' }}>💡</span>
                        <span>{r}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, fontSize: 11, color: '#3d4a5e' }}>
                      Tip: Click any team agent on the right → "Ping" for a code hint.
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── RESIZE RIGHT ── */}
          <div className={`resize-handle${draggingRight ? ' active' : ''}`}
            onMouseDown={() => setDraggingRight(true)} />

          {/* ── RIGHT: TEAM WORKFLOW ── */}
          <div className="ide-right" style={{ width: rightW }}>
            <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 700, color: '#3d4a5e', letterSpacing: '.1em', textTransform: 'uppercase' }}>Team Workflow</div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {AGENTS.map(ag => {
                const state = agentStates[ag.id];
                const dotColor = state === 'idle' ? '#3d4a5e' : state === 'active' ? '#7C6EFA' : '#34D399';
                const statusText = ag[state];
                const isHinting = agentHint?.agentId === ag.id;
                const onCooldown = pingCooldown[ag.id];

                return (
                  <div key={ag.id}>
                    <div className={`agent-card${state === 'active' ? ' active' : state === 'done' ? ' done' : ''}`}
                      onClick={() => handlePingAgent(ag.id)}
                      title={onCooldown ? 'Agent is responding…' : 'Click to ask for a hint'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ background: ag.color, color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>{ag.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', flex: 1 }}>{ag.role}</span>
                        <div className="agent-status-dot" style={{ background: dotColor }} />
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{ag.tagline}</div>
                      <div style={{ background: '#0f1117', borderRadius: 6, padding: '5px 8px', fontSize: 11, color: state === 'active' ? '#7C6EFA' : state === 'done' ? '#34D399' : '#3d4a5e', fontStyle: state === 'idle' ? 'italic' : 'normal' }}>
                        {state === 'active' && <span style={{ marginRight: 6 }}>⟳</span>}
                        {statusText}
                      </div>
                      {!onCooldown && (
                        <div style={{ marginTop: 6, fontSize: 10, color: '#3d4a5e', textAlign: 'right' }}>
                          click to ping ↗
                        </div>
                      )}
                    </div>
                    {isHinting && (
                      <div className="agent-hint-bubble">
                        💬 <strong style={{ color: ag.color }}>{ag.label}:</strong> {agentHint.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress summary */}
            <div style={{ borderTop: '1px solid #1e2433', padding: '10px 14px', background: '#0b0d14' }}>
              <div style={{ fontSize: 10, color: '#3d4a5e', fontWeight: 700, marginBottom: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Progress</div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                {TASKS.map(t => (
                  <div key={t.id} style={{
                    flex: 1, height: 5, borderRadius: 3,
                    background: completedTasks.has(t.id) ? '#34D399' : activeTaskIdx === TASKS.indexOf(t) ? '#7C6EFA' : '#1e2433',
                    transition: 'background .3s',
                  }} title={t.title} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>{completedTasks.size}/{TASKS.length} tasks done</span>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>{xp} XP</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}