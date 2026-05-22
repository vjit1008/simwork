import { useEffect, useRef, useState } from 'react';

/**
 * StatCard — animated counter, trend indicator, glow accent
 */
export default function StatCard({ label, value, unit = '', trend, trendLabel, icon, accent = 'plasma', delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const targetRef  = useRef(Number(String(value).replace(/[^0-9.]/g, '')) || 0);

  useEffect(() => {
    const target = Number(String(value).replace(/[^0-9.]/g, '')) || 0;
    targetRef.current = target;
    let start = null;
    const duration = 1200;
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(ease(progress) * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    const timeout = setTimeout(() => requestAnimationFrame(step), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  const accentColor = { plasma: '#6c63ff', aurora: '#00d4aa', amber: '#ffb700', flare: '#ff6b6b' }[accent];
  const trendUp     = trend > 0;

  return (
    <div style={{
      position: 'relative', padding: '20px 22px',
      background: 'rgba(10,15,30,.8)',
      border: `1px solid rgba(255,255,255,.06)`,
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,.4), 0 0 24px ${accentColor}22`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        opacity: 0.6,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15,
          }}>{icon}</div>
        )}
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30, fontWeight: 800,
          color: 'var(--text-1)',
          letterSpacing: '-0.03em',
        }}>
          {displayed.toLocaleString()}
        </span>
        {unit && <span style={{ fontSize: 13, color: accentColor, fontWeight: 600 }}>{unit}</span>}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
          <span style={{ color: trendUp ? '#00d4aa' : '#ff6b6b' }}>
            {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          {trendLabel && <span style={{ color: 'var(--text-3)' }}>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}