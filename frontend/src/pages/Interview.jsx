import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import QuestionCard from '../components/QuestionCard';
import AnswerBox from '../components/AnswerBox';

const Interview = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await API.get('/interview/questions');
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(''));
      } catch {
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => !a.trim()).length;
    if (unanswered > 0) {
      const confirm = window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`);
      if (!confirm) return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { data } = await API.post('/interview/submit', { answers });
      navigate(`/result/${data.interviewId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;
  const answeredCount = answers.filter(a => a.trim()).length;

  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner}>⏳</div>
      <p style={{ color: '#a0aec0' }}>Loading interview questions...</p>
    </div>
  );

  if (error && questions.length === 0) return (
    <div style={styles.centered}>
      <p style={{ color: '#fc8181' }}>{error}</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>💻 Software Developer Interview</h2>
            <p style={styles.subtitle}>{answeredCount} of {questions.length} answered</p>
          </div>
          <div style={styles.progressInfo}>
            {current + 1}/{questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        {/* Question */}
        <QuestionCard
          number={current + 1}
          total={questions.length}
          question={questions[current]}
        />

        {/* Answer */}
        <AnswerBox
          value={answers[current]}
          onChange={handleAnswer}
          disabled={submitting}
          placeholder="Share your experience and thoughts clearly and concisely..."
        />

        {error && <div style={styles.error}>{error}</div>}

        {/* Navigation */}
        <div style={styles.navRow}>
          <button
            onClick={handlePrev}
            disabled={current === 0 || submitting}
            style={{ ...styles.navBtn, opacity: current === 0 ? 0.4 : 1 }}
          >
            ← Previous
          </button>

          <div style={styles.dotRow}>
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  ...styles.dot,
                  backgroundColor: i === current ? '#e94560' : answers[i]?.trim() ? '#48bb78' : '#2d3748'
                }}
              />
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button onClick={handleNext} style={styles.nextBtn} disabled={submitting}>
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} style={styles.submitBtn} disabled={submitting}>
              {submitting ? '⏳ Evaluating...' : '🚀 Submit & Evaluate'}
            </button>
          )}
        </div>

        {submitting && (
          <div style={styles.evaluatingBox}>
            <p style={{ color: '#a0aec0', textAlign: 'center' }}>
              🤖 AI is evaluating your answers... This may take 10–20 seconds.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0f0f1a', paddingBottom: '3rem' },
  container: { maxWidth: '750px', margin: '0 auto', padding: '2rem 1rem' },
  centered: { minHeight: '100vh', backgroundColor: '#0f0f1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  spinner: { fontSize: '3rem', marginBottom: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  title: { color: 'white', margin: '0 0 0.3rem', fontSize: '1.4rem' },
  subtitle: { color: '#718096', margin: 0, fontSize: '0.9rem' },
  progressInfo: { color: '#e94560', fontWeight: 'bold', fontSize: '1.2rem' },
  progressBar: { backgroundColor: '#2d3748', borderRadius: '4px', height: '6px', marginBottom: '1.5rem', overflow: 'hidden' },
  progressFill: { backgroundColor: '#e94560', height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
  error: { backgroundColor: '#742a2a', color: '#fc8181', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' },
  navBtn: { backgroundColor: '#16213e', color: 'white', border: '1px solid #2d3748', padding: '0.7rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  nextBtn: { backgroundColor: '#16213e', color: 'white', border: '1px solid #e94560', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  submitBtn: { backgroundColor: '#e94560', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' },
  dotRow: { display: 'flex', gap: '6px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 },
  evaluatingBox: { marginTop: '1.5rem', backgroundColor: '#16213e', borderRadius: '10px', padding: '1rem', border: '1px solid #2d3748' },
};

export default Interview;