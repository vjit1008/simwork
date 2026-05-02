const AnswerBox = ({ value, onChange, placeholder, disabled }) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div style={styles.wrapper}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Type your answer here...'}
        disabled={disabled}
        style={{
          ...styles.textarea,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        rows={5}
      />
      <div style={styles.footer}>
        <span style={styles.wordCount}>{wordCount} words</span>
        {wordCount < 30 && value.length > 0 && (
          <span style={styles.hint}>💡 Aim for at least 30 words for better evaluation</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    marginBottom: '1.5rem',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#0f3460',
    color: '#e2e8f0',
    border: '1px solid #2d3748',
    borderRadius: '8px',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.4rem',
  },
  wordCount: {
    color: '#718096',
    fontSize: '0.8rem',
  },
  hint: {
    color: '#f6ad55',
    fontSize: '0.8rem',
  },
};

export default AnswerBox;