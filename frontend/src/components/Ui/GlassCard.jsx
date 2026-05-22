import { useRef } from 'react';

/**
 * GlassCard — reactive glow follows mouse, optional animated border
 * variant: 'default' | 'plasma' | 'aurora' | 'flat'
 */
export default function GlassCard({
  children, variant = 'default', glow = true,
  padding = '24px', borderRadius = 16,
  style: extStyle = {}, onClick, className = '',
}) {
  const cardRef = useRef(null);

  const glowColor = {
    default: 'rgba(108,99,255,.4)',
    plasma:  'rgba(108,99,255,.6)',
    aurora:  'rgba(0,212,170,.5)',
    flat:    'none',
  }[variant];

  const borderColor = {
    default: 'rgba(255,255,255,.06)',
    plasma:  'rgba(108,99,255,.2)',
    aurora:  'rgba(0,212,170,.2)',
    flat:    'rgba(255,255,255,.04)',
  }[variant];

  const handleMouseMove = (e) => {
    if (!glow || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', x + 'px');
    cardRef.current.style.setProperty('--my', y + 'px');
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (cardRef.current) {
          cardRef.current.style.setProperty('--mx', '-200px');
          cardRef.current.style.setProperty('--my', '-200px');
        }
      }}
      style={{
        position: 'relative',
        padding,
        borderRadius,
        background: 'rgba(10,15,30,.75)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        border: `1px solid ${borderColor}`,
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        transition: 'border-color 0.3s, transform 0.2s, box-shadow 0.3s',
        '--mx': '-200px', '--my': '-200px',
        ...extStyle,
      }}
    >
      {/* Mouse follow glow */}
      {glow && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          background: `radial-gradient(300px circle at var(--mx) var(--my), ${glowColor.replace('.4', '.06')}, transparent 70%)`,
          transition: 'background 0.1s',
          borderRadius: 'inherit',
          zIndex: 0,
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}