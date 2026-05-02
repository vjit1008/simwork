import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        🎯 SimWork
      </Link>
      <div style={styles.right}>
        {isAuthenticated ? (
          <>
            <span style={styles.username}>👋 {user?.name}</span>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a2e',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e94560',
    textDecoration: 'none',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    color: '#a0aec0',
    fontSize: '0.9rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  signupBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
};

export default Navbar;