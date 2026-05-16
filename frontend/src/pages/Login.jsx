import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/api/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
    <Link to="/forgot-password" style={{ color: '#7C6EFA', fontSize: 13, textDecoration: 'none' }}>
  Forgot password?
</Link>
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🎯 SimWork</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue your interview practice</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#1a1a2e',
    padding: '2.5rem',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  logo: {
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    margin: '0 0 0.3rem',
    fontSize: '1.5rem',
  },
  subtitle: {
    color: '#718096',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '0.9rem',
  },
  error: {
    backgroundColor: '#742a2a',
    color: '#fc8181',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  field: { marginBottom: '1.2rem' },
  label: {
    display: 'block',
    color: '#a0aec0',
    fontSize: '0.85rem',
    marginBottom: '0.4rem',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#16213e',
    border: '1px solid #2d3748',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
  },
  btn: {
    width: '100%',
    padding: '0.85rem',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  footer: {
    color: '#718096',
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
  },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: 'bold' },
};

export default Login;