import { useRef } from 'react';

/**
 * GlowButton — magnetic, ripple, glow-on-hover
 * variant: 'plasma' | 'aurora' | 'ghost' | 'danger'
 * size:    'sm' | 'md' | 'lg'
 */
export default function GlowButton({
  children, onClick, variant = 'plasma', size = 'md',
  disabled = false, loading = false, icon, style: extStyle = {}, type = 'button',
}) {
  const btnRef  = useRef(null);
  const ripples = useRef([]);

  const configs = {
    plasma: {
      bg:     'linear-gradient(135deg, #7c74ff, #6c63ff)',
      color:  '#fff',
      shadow: '0 0 20px rgba(108,99,255,.4)',
      hover:  '0 0 30px rgba(108,99,255,.6), 0 0 60px rgba(108,99,255,.2)',
      border: 'transparent',
    },
    aurora: {
      bg:     'linear-gradient(135deg, #00d4aa, #00b894)',
      color:  '#001a14',
      shadow: '0 0 20px rgba(0,212,170,.35)',
      hover:  '0 0 30px rgba(0,212,170,.6)',
      border: 'transparent',
    },
    ghost: {
      bg:     'rgba(108,99,255,.08)',
      color:  '#a99fff',
      shadow: 'none',
      hover:  '0 0 20px rgba(108,99,255,.2)',
      border: 'rgba(108,99,255,.3)',
    },
    danger: {
      bg:     'rgba(255,107,107,.1)',
      color:  '#ff6b6b',
      shadow: 'none',
      hover:  '0 0 20px rgba(255,107,107,.3)',
      border: 'rgba(255,107,107,.3)',
    },
  };

  const sizes = {
    sm: { padding: '7px 16px', fontSize: 12, borderRadius: 8,  gap: 6  },
    md: { padding: '11px 24px', fontSize: 14, borderRadius: 10, gap: 8  },
    lg: { padding: '15px 32px', fontSize: 16, borderRadius: 12, gap: 10 },
  };

  const cfg = configs[variant];
  const sz  = sizes[size];

  const addRipple = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = document.createElement('span');
    el.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:8px; height:8px;
      left:${x - 4}px; top:${y - 4}px;
      background:rgba(255,255,255,.35);
      transform:scale(0); opacity:.6;
      animation:ripple 0.6s ease-out forwards;
    `;
    btnRef.current.appendChild(el);
    setTimeout(() => el.remove(), 700);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled || loading}
      onClick={(e) => { addRipple(e); onClick?.(e); }}
      onMouseMove={(e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
        btnRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onMouseLeave={() => {
        if (btnRef.current) btnRef.current.style.transform = 'translate(0,0)';
      }}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: sz.gap,
        padding: sz.padding,
        fontSize: sz.fontSize,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '0.01em',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: sz.borderRadius,
        boxShadow: cfg.shadow,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'box-shadow 0.2s, transform 0.15s, opacity 0.2s',
        userSelect: 'none',
        ...extStyle,
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = cfg.hover; }}
      onBlur={(e)  => { e.currentTarget.style.boxShadow = cfg.shadow; }}
    >
      <style>{`@keyframes ripple{from{transform:scale(0);opacity:.6}to{transform:scale(12);opacity:0}}`}</style>
      {loading ? (
        <span style={{
          width: 14, height: 14, border: `2px solid ${cfg.color}`,
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          display: 'inline-block',
        }} />
      ) : icon ? <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span> : null}
      {children}
    </button>
  );
}