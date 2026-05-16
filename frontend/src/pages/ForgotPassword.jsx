import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | loading | done | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStatus('done');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
      setStatus('error');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🔐</div>
        <h2 style={s.title}>Forgot Password</h2>
        <p style={s.sub}>Enter your email and we'll send you a reset link.</p>

        {status === 'done' ? (
          <div style={s.success}>
            ✅ {message}
            <br /><br />
            <Link to="/login" style={s.link}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={s.input}
            />
            {status === 'error' && <div style={s.err}>{message}</div>}
            <button type="submit" disabled={status === 'loading'} style={s.btn}>
              {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
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
  title:   { fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' },
  sub:     { fontSize: 14, color: 'var(--muted2)', margin: '0 0 24px' },
  form:    { display: 'flex', flexDirection: 'column', gap: 12 },
  input:   { padding: '11px 14px', borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--s2)', color: 'var(--text)', fontSize: 14, outline: 'none' },
  btn:     { padding: '12px', background: '#7C6EFA', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  link:    { color: '#7C6EFA', fontSize: 13, textDecoration: 'none', marginTop: 4 },
  err:     { color: '#F87171', fontSize: 13 },
  success: { color: 'var(--text)', fontSize: 14, lineHeight: 1.6 },
};