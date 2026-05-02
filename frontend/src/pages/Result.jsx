import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ResultCard from '../components/ResultCard';

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await API.get(`/interview/result/${id}`);
        setInterview(data.interview);
      } catch {
        setError('Failed to load results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 8) return '#48bb78';
    if (score >= 5) return '#f6ad55';
    return '#fc8181';
  };

  const getScoreMessage = (score) => {
    if (score >= 8) return '🏆 Excellent Performance!';
    if (score >= 6) return '👍 Good Job!';
    if (score >= 4) return '📈 Room for Improvement';
    return '💪 Keep Practicing!';
  };

  if (loading) return (
    <div style={styles.centered}>
      <p style={{ color: '#a0aec0', fontSize: '1.1rem' }}>⏳ Loading your results...</p>
    </div>
  );

  if (error) return (
    <div style={styles.centered}>
      <p style={{ color: '#fc8181' }}>{error}</p>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Score Summary */}
        <div style={styles.scoreCard}>
          <h1 style={styles.scoreTitle}>{getScoreMessage(interview.totalScore)}</h1>
          <div style={{ ...styles.scoreBig, color: getScoreColor(interview.totalScore) }}>
            {interview.totalScore?.toFixed(1)}<span style={styles.scoreMax}>/10</span>
          </div>
          <p style={styles.scoreRole}>💻 {interview.role} Interview</p>
          <p style={styles.scoreDate}>
            Completed {new Date(interview.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>

          {/* Score breakdown bar */}
          <div style={styles.scoreBar}>
            <div style={{
              ...styles.scoreBarFill,
              width: `${(interview.totalScore / 10) * 100}%`,
              backgroundColor: getScoreColor(interview.totalScore)
            }} />
          </div>
        </div>

        {/* Detailed Feedback */}
        <h2 style={styles.detailTitle}>📊 Detailed Feedback</h2>
        {interview.feedback.map((item, idx) => (
          <ResultCard
            key={idx}
            number={idx + 1}
            question={item.question}
            answer={item.answer}
            score={item.score}
            feedback={item.feedback}
            improvement={item.improvement}
          />
        ))}

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={() => navigate('/interview')} style={styles.retryBtn}>
            🔄 Try Again
          </button>
          <button onClick={() => navigate('/dashboard')} style={styles.dashBtn}>
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0f0f1a', paddingBottom: '3rem' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' },
  centered: { minHeight: '100vh', backgroundColor: '#0f0f1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  scoreCard: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '16px',
    padding: '2.5rem',
    textAlign: 'center',
    marginBottom: '2rem',
    border: '1px solid #2d3748',
  },
  scoreTitle: { color: 'white', fontSize: '1.8rem', margin: '0 0 1rem' },
  scoreBig: { fontSize: '4rem', fontWeight: 'bold', lineHeight: 1 },
  scoreMax: { fontSize: '1.5rem', color: '#718096' },
  scoreRole: { color: '#a0aec0', margin: '0.5rem 0 0.3rem' },
  scoreDate: { color: '#4a5568', fontSize: '0.85rem', marginBottom: '1.5rem' },
  scoreBar: { backgroundColor: '#2d3748', borderRadius: '8px', height: '10px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' },
  scoreBarFill: { height: '100%', borderRadius: '8px', transition: 'width 1s ease' },
  detailTitle: { color: '#e2e8f0', fontSize: '1.3rem', marginBottom: '1.5rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' },
  retryBtn: { backgroundColor: '#e94560', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  dashBtn: { backgroundColor: 'transparent', color: '#a0aec0', border: '1px solid #2d3748', padding: '0.85rem 2rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  backBtn: { backgroundColor: '#16213e', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer' },
};

export default Result;