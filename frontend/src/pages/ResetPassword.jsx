import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function ResetPassword() {
  const { token }               = useParams();
  const navigate                = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [status,   setStatus]   = useState('idle');
  const [message,  setMessage]  = useState('');

  const strength = !password ? 0
    : password.length < 6  ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ['', 'Too short', 'Weak',  'Good',    'Strong'];
  const strengthColor = ['', '#F87171',   '#F59E0B','#60A5FA', '#34D399'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("Passwords don't match.");
    if (password.length < 6)  return setMessage('Password must be at least 6 characters.');
    setStatus('loading');
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setStatus('done');
      setTimeout(() => navigate('/auth'), 2500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Link is invalid or expired.');
      setStatus('error');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🔑</div>
        <h2 style={s.title}>Set New Password</h2>

        {status === 'done' ? (
          <div style={s.success}>
            ✅ {message}
            <br />
            <span style={{ color:'var(--muted2)', fontSize:12 }}>Redirecting to login…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>

            {/* ── New password ── */}
            <div style={{ textAlign:'left' }}>
              <label style={s.label}>New Password</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ ...s.input, paddingRight:44 }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={s.eye} title={showPass ? 'Hide' : 'Show'}>
                  {showPass ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop:5 }}>
                  <div style={{ height:3, background:'var(--s3,#1e2433)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:2, transition:'width .3s,background .3s', width:`${(strength/4)*100}%`, background:strengthColor[strength] }} />
                  </div>
                  <span style={{ fontSize:11, color:strengthColor[strength] }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            {/* ── Confirm password ── */}
            <div style={{ textAlign:'left' }}>
              <label style={s.label}>Confirm Password</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showConf ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  style={{
                    ...s.input, paddingRight:44,
                    borderColor: confirm
                      ? confirm === password ? '#34D399' : '#F87171'
                      : undefined,
                  }}
                />
                <button type="button" onClick={() => setShowConf(p => !p)} style={s.eye} title={showConf ? 'Hide' : 'Show'}>
                  {showConf ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
              {confirm && (
                <span style={{ fontSize:11, color: confirm === password ? '#34D399' : '#F87171' }}>
                  {confirm === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                </span>
              )}
            </div>

            {message && (
              <div style={{ ...s.err, color: status === 'error' ? '#F87171' : '#FBBF24' }}>
                {message}
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} style={s.btn}>
              {status === 'loading' ? 'Resetting…' : 'Reset Password'}
            </button>

            <Link to="/auth" style={s.link}>← Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── SVG eye icons ── */
const EyeOn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const s = {
  page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' },
  card:  { width:400, padding:'40px 36px', background:'var(--s1)', borderRadius:16, border:'1px solid var(--border)', textAlign:'center' },
  logo:  { fontSize:40, marginBottom:12 },
  title: { fontSize:22, fontWeight:700, color:'var(--text)', margin:'0 0 24px' },
  form:  { display:'flex', flexDirection:'column', gap:14 },
  label: { fontSize:12, fontWeight:600, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'.05em', display:'block', marginBottom:5 },
  input: { width:'100%', padding:'11px 14px', borderRadius:9, border:'1px solid var(--border2)', background:'var(--s2)', color:'var(--text)', fontSize:14, outline:'none', boxSizing:'border-box' },
  eye:   { position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted2,#64748b)', padding:0, display:'flex', alignItems:'center' },
  btn:   { padding:'12px', background:'#7C6EFA', color:'#fff', border:'none', borderRadius:9, cursor:'pointer', fontWeight:700, fontSize:14, marginTop:4 },
  link:  { color:'#7C6EFA', fontSize:13, textDecoration:'none', marginTop:4 },
  err:   { fontSize:13, textAlign:'left' },
  success: { color:'var(--text)', fontSize:14, lineHeight:1.8 },
};