const ResultCard = ({ number, question, answer, score, feedback, improvement }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return '#48bb78';
    if (score >= 5) return '#f6ad55';
    return '#fc8181';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 5) return 'Good';
    return 'Needs Work';
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.qNumber}>Q{number}</span>
        <div style={{ ...styles.scoreBadge, backgroundColor: getScoreColor(score) }}>
          {score}/10 — {getScoreLabel(score)}
        </div>
      </div>

      <p style={styles.question}>{question}</p>

      <div style={styles.section}>
        <p style={styles.label}>📝 Your Answer</p>
        <p style={styles.answer}>{answer || '(No answer provided)'}</p>
      </div>

      <div style={styles.section}>
        <p style={styles.label}>💬 Feedback</p>
        <p style={styles.feedbackText}>{feedback}</p>
      </div>

      <div style={{ ...styles.section, ...styles.improvementBox }}>
        <p style={styles.label}>🚀 How to Improve</p>
        <p style={styles.improvementText}>{improvement}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #2d3748',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  qNumber: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '0.2rem 0.7rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  scoreBadge: {
    color: 'white',
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  question: {
    color: '#e2e8f0',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  section: {
    marginBottom: '1rem',
  },
  label: {
    color: '#a0aec0',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.3rem',
  },
  answer: {
    color: '#cbd5e0',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    backgroundColor: '#0f3460',
    padding: '0.8rem',
    borderRadius: '6px',
  },
  feedbackText: {
    color: '#e2e8f0',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  improvementBox: {
    backgroundColor: '#1a2744',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '3px solid #48bb78',
    marginBottom: 0,
  },
  improvementText: {
    color: '#9ae6b4',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default ResultCard;