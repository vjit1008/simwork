import { useEffect, useState } from 'react';

const BOOT_LINES = [
  '> Initializing SimWork Neural Core...',
  '> Loading simulation engine v3.1.0',
  '> Establishing secure AI pipeline',
  '> Connecting to job simulation matrix',
  '> Calibrating performance metrics',
  '> Neural networks online',
  '> All systems nominal',
  '> Welcome to SimWork',
];

export default function BootLoader({ onComplete }) {
  const [lines,    setLines]    = useState([]);
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState('boot'); // boot | reveal | done

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[idx]]);
        setProgress(Math.round(((idx + 1) / BOOT_LINES.length) * 100));
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('reveal'), 400);
        setTimeout(() => { setPhase('done'); onComplete?.(); }, 1200);
      }
    }, 160);
    return () => clearInterval(interval);
  }, []);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99997,
      background: 'var(--void)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
      transition: phase === 'reveal' ? 'opacity 0.8s, transform 0.8s' : 'none',
      opacity: phase === 'reveal' ? 0 : 1,
      transform: phase === 'reveal' ? 'scale(1.03)' : 'scale(1)',
    }}>
      {/* Core ring */}
      <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 40 }}>
        <svg width={80} height={80} viewBox="0 0 80 80" style={{ position: 'absolute', inset: 0 }}>
          <circle cx={40} cy={40} r={34} fill="none" stroke="rgba(108,99,255,.15)" strokeWidth={2} />
          <circle cx={40} cy={40} r={34} fill="none" stroke="#6c63ff" strokeWidth={2}
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px', transition: 'stroke-dashoffset 0.15s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: '#6c63ff',
        }}>{progress}%</div>
        {/* Orbit dot */}
        <div style={{
          position: 'absolute', width: 6, height: 6, borderRadius: '50%',
          background: '#00d4aa', boxShadow: '0 0 8px #00d4aa',
          top: '50%', left: '50%',
          animation: 'orbitDot 1.5s linear infinite',
        }} />
      </div>

      {/* Brand */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 32, letterSpacing: '-0.02em' }}>
        <span style={{ color: 'var(--text-1)' }}>Sim</span>
        <span className="grad-plasma">Work</span>
      </div>

      {/* Terminal lines */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-3)', lineHeight: 1.9,
        textAlign: 'left', width: 320,
        maxHeight: 180, overflow: 'hidden',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            color: i === lines.length - 1 ? '#00d4aa' : 'var(--text-3)',
            opacity: i === lines.length - 1 ? 1 : 0.6,
            transition: 'color 0.3s',
          }}>
            {line}
            {i === lines.length - 1 && (
              <span style={{ display: 'inline-block', width: 6, height: 12, background: '#00d4aa', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}