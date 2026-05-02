const QuestionCard = ({ number, total, question }) => {
  return (
    <div style={styles.card}>
      <div style={styles.badge}>
        Question {number} of {total}
      </div>
      <p style={styles.question}>{question}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderLeft: '4px solid #e94560',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#e94560',
    color: 'white',
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginBottom: '0.8rem',
  },
  question: {
    color: '#e2e8f0',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default QuestionCard;