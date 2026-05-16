import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token }               = useParams();
  const navigate                = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [status,   setStatus]   = useState('idle');
  const [message,  setMessage]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("Passwords don't match.");
    if (password.length < 6)  return setMessage('Password must be at least 6 characters.');
    setStatus('loading');
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setStatus('done');
      setTimeout(() => navigate('/login'), 2500);
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
          <div style={s.success}>✅ {message}<br /><span style={{ color: 'var(--muted2)', fontSize: 12 }}>Redirecting to login…</span></div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>
            <input type="password" placeholder="New password" value={password}
              onChange={e => setPassword(e.target.value)} required style={s.input} />
            <input type="password" placeholder="Confirm password" value={confirm}
              onChange={e => setConfirm(e.target.value)} required style={s.input} />
            {message && <div style={status === 'error' ? s.err : s.warn}>{message}</div>}
            <button type="submit" disabled={status === 'loading'} style={s.btn}>
              {status === 'loading' ? 'Resetting…' : 'Reset Password'}
            </button>
            <Link to="/login" style={s.link}>← Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
}

const s = {
  page:    { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' },
  card:    { width: 380, padding: '40px 36px', background: 'var(--s1)', borderRadius: 16, border: '1px solid var(--border)', textAlign: 'center' },
  logo:    { fontSize: 40, marginBottom: 12 },
  title:   { fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 24px' },
  form:    { display: 'flex', flexDirection: 'column', gap: 12 },
  input:   { padding: '11px 14px', borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--s2)', color: 'var(--text)', fontSize: 14, outline: 'none' },
  btn:     { padding: '12px', background: '#7C6EFA', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  link:    { color: '#7C6EFA', fontSize: 13, textDecoration: 'none', marginTop: 4 },
  err:     { color: '#F87171', fontSize: 13 },
  warn:    { color: '#FBBF24', fontSize: 13 },
  success: { color: 'var(--text)', fontSize: 14, lineHeight: 1.8 },
};