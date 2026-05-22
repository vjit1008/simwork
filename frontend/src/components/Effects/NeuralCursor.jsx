import { useEffect, useRef } from 'react';

export default function NeuralCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });
  const raf     = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top  = e.clientY + 'px';
      }
    };

    const onEnter = () => {
      if (ringRef.current) ringRef.current.classList.add('hover');
    };
    const onLeave = () => {
      if (ringRef.current) ringRef.current.classList.remove('hover');
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top  = ring.current.y + 'px';
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 99999,
        width: 8, height: 8,
        background: '#6c63ff',
        borderRadius: '50%',
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 12px #6c63ff, 0 0 24px rgba(108,99,255,.5)',
        transition: 'transform 0.05s',
        mixBlendMode: 'screen',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 99998,
        width: 32, height: 32,
        border: '1px solid rgba(108,99,255,.5)',
        borderRadius: '50%',
        transform: 'translate(-50%,-50%)',
        transition: 'width 0.2s, height 0.2s, border-color 0.2s, background 0.2s',
        mixBlendMode: 'screen',
      }}
      className=""
      />
      <style>{`
        .hover {
          width: 48px !important;
          height: 48px !important;
          border-color: #6c63ff !important;
          background: rgba(108,99,255,.05) !important;
        }
      `}</style>
    </>
  );
}