import { useRef, useEffect } from 'react';

export default function CodeEditor({ code, onChange }) {
  const taRef = useRef(null);
  const lnRef = useRef(null);

  const updateLines = () => {
    if (!taRef.current || !lnRef.current) return;
    const lines = taRef.current.value.split('\n').length;
    lnRef.current.innerHTML = Array.from({length:lines},(_,i)=>`<span>${i+1}</span>`).join('');
  };

  useEffect(() => { updateLines(); }, [code]);

  // Auto-focus on mount so keyboard opens immediately on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      taRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKey = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart;
      const v = e.target.value;
      e.target.value = v.substring(0,s) + '  ' + v.substring(e.target.selectionEnd);
      e.target.selectionStart = e.target.selectionEnd = s + 2;
      onChange(e.target.value);
    }
  };

  return (
    <div style={{display:'flex', flexDirection:'column', background:'var(--bg)', overflow:'hidden', flex:1}}>
      {/* File tabs */}
      <div style={{height:36, background:'var(--s2)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'flex-end', padding:'0 12px', gap:2, flexShrink:0}}>
        <div style={{padding:'6px 14px', fontSize:12, color:'var(--text)', background:'var(--bg)', borderRadius:'6px 6px 0 0', border:'1px solid var(--border)', borderBottom:'none', fontWeight:600}}>solution.js</div>
        <div style={{padding:'6px 14px', fontSize:12, color:'var(--muted2)', cursor:'pointer'}}>utils.js</div>
      </div>

      {/* Editor area */}
      <div style={{flex:1, overflow:'hidden', position:'relative', minHeight:0}}>
        {/* Line numbers */}
        <div ref={lnRef} style={{
          position:'absolute', left:0, top:0, bottom:0, width:40,
          background:'var(--s1)', padding:'16px 10px 16px 0',
          display:'flex', flexDirection:'column', alignItems:'flex-end',
          fontFamily:'var(--mono)', fontSize:13, color:'var(--muted)',
          lineHeight:1.7, pointerEvents:'none',
          borderRight:'1px solid var(--border)', overflow:'hidden',
          zIndex:1,
        }}/>

        {/* Textarea — key mobile fixes here */}
        <textarea
          ref={taRef}
          value={code}
          onChange={e => { onChange(e.target.value); updateLines(); }}
          onKeyDown={handleKey}
          onTouchStart={() => taRef.current?.focus()} // ← force focus on touch
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"  // ← prevents mobile from auto-capitalizing
          autoComplete="off"
          inputMode="text"       // ← tells mobile to show text keyboard
          style={{
            position:'absolute', inset:0,
            background:'transparent', border:'none', outline:'none',
            fontFamily:'var(--mono)', fontSize:13, color:'#C9D1D9',
            padding:16, paddingLeft:52,
            resize:'none', lineHeight:1.7, tabSize:2,
            width:'100%', height:'100%', boxSizing:'border-box',
            WebkitUserSelect:'text', // ← iOS fix
            userSelect:'text',
            touchAction:'manipulation', // ← prevents double-tap zoom
          }}
        />
      </div>
    </div>
  );
}