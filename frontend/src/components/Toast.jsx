import { useEffect, useState } from 'react';

let _show = null;
export const showToast = (msg) => _show?.(msg);

export default function Toast() {
  const [msg, setMsg]     = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    _show = (m) => {
      setMsg(m); setVisible(true);
      setTimeout(() => setVisible(false), 2800);
    };
  }, []);

  return (
    <div style={{
      position:'fixed', bottom:24, right:24,
      background:'var(--s2)', border:'1px solid var(--border2)',
      borderRadius:10, padding:'12px 20px', fontSize:13, fontWeight:600,
      zIndex:600, transition:'all .3s',
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0, maxWidth:300,
    }}>{msg}</div>
  );
}