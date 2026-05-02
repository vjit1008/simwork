import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/interview/history');
        setHistory(data.interviews);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) return '#48bb78';
    if (score >= 5) return '#f6ad55';
    return '#fc8181';
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Hero */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p style={styles.heroSub}>Ready to ace your next interview? Practice makes perfect.</p>
        </div>

        {/* Role Card */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Available Interviews</h2>
          <div style={styles.roleCard}>
            <div style={styles.roleLeft}>
              <span style={styles.roleIcon}>💻</span>
              <div>
                <h3 style={styles.roleName}>Software Developer</h3>
                <p style={styles.roleDesc}>10 HR questions • AI-powered evaluation • Instant feedback</p>
                <div style={styles.tags}>
                  <span style={styles.tag}>Communication</span>
                  <span style={styles.tag}>Problem Solving</span>
                  <span style={styles.tag}>Teamwork</span>
                </div>
              </div>
            </div>
            <button style={styles.startBtn} onClick={() => navigate('/interview')}>
              Start Interview →
            </button>
          </div>
        </div>

        {/* History */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Past Interviews</h2>
          {loading ? (
            <div style={styles.loadingBox}>Loading history...</div>
          ) : history.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={{ fontSize: '2rem' }}>📋</p>
              <p style={{ color: '#718096' }}>No interviews yet. Start your first one above!</p>
            </div>
          ) : (
            <div style={styles.historyList}>
              {history.map((item, idx) => (
                <div key={item._id} style={styles.historyCard}>
                  <div style={styles.historyLeft}>
                    <span style={styles.historyNum}>#{idx + 1}</span>
                    <div>
                      <p style={styles.historyRole}>{item.role}</p>
                      <p style={styles.historyDate}>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div style={styles.historyRight}>
                    <span style={{ ...styles.scoreChip, backgroundColor: getScoreColor(item.totalScore) }}>
                      {item.totalScore?.toFixed(1)}/10
                    </span>
                    <button
                      style={styles.viewBtn}
                      onClick={() => navigate(`/result/${item._id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0f0f1a', paddingBottom: '3rem' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    borderLeft: '4px solid #e94560',
  },
  heroTitle: { color: 'white', fontSize: '1.8rem', margin: '0 0 0.5rem' },
  heroSub: { color: '#a0aec0', margin: 0 },
  section: { marginBottom: '2rem' },
  sectionTitle: { color: '#e2e8f0', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' },
  roleCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #2d3748',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  roleLeft: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
  roleIcon: { fontSize: '2.5rem' },
  roleLeft: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
  roleIcon: { fontSize: '2.5rem' },
  roleName: { color: 'white', margin: '0 0 0.3rem', fontSize: '1.2rem' },
  roleDesc: { color: '#718096', margin: '0 0 0.8rem', fontSize: '0.9rem' },
  tags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#16213e',
    color: '#a0aec0',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    border: '1px solid #2d3748',
  },
  startBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '0.85rem 1.8rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  loadingBox: { color: '#718096', textAlign: 'center', padding: '2rem' },
  emptyBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    border: '1px dashed #2d3748',
  },
  historyList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  historyCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: '10px',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #2d3748',
  },
  historyLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  historyNum: { color: '#4a5568', fontSize: '0.85rem', minWidth: '24px' },
  historyRole: { color: '#e2e8f0', margin: '0 0 0.2rem', fontWeight: '600' },
  historyDate: { color: '#718096', margin: 0, fontSize: '0.85rem' },
  historyRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  scoreChip: { color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' },
  viewBtn: {
    backgroundColor: 'transparent',
    color: '#e94560',
    border: '1px solid #e94560',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

export default Dashboard;