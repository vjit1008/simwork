import { useEffect, useState } from 'react';
import { fetchProjects, pushWork, pullBack } from '../api/projects';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchProjects()
      .then(r => setProjects(r.data.projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePush = async (id) => {
    await pushWork(id, note);
    setNote('');
    const r = await fetchProjects();
    setProjects(r.data.projects);
  };

  const handlePullback = async (id) => {
    await pullBack(id, note);
    setNote('');
    const r = await fetchProjects();
    setProjects(r.data.projects);
  };

  if (loading) return <div style={s.center}>Loading projects...</div>;

  return (
    <div style={s.page}>
      <h2 style={s.heading}>Projects</h2>
      {projects.length === 0 && (
        <div style={s.empty}>No projects assigned yet.</div>
      )}
      {projects.map(p => (
        <div key={p._id} style={s.card}>
          <div style={s.cardTop}>
            <span style={s.title}>{p.title}</span>
            <span style={{ ...s.badge, background: statusColor(p.status) }}>
              {p.status}
            </span>
          </div>
          <p style={s.desc}>{p.description}</p>
          <div style={s.depts}>
            {p.departments.map((d, i) => (
              <div key={i} style={{
                ...s.dept,
                borderLeft: `3px solid ${deptColor(d.status)}`,
              }}>
                <span style={s.deptName}>{d.name}</span>
                <span style={s.deptStatus}>{d.status}</span>
                <div style={s.deptStudents}>
                  {(d.students || []).map(st => (
                    <span key={st._id || st} style={s.student}>
                      {st.name || 'Student'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Actions for current dept */}
          {p.status === 'active' && (
            <div style={s.actions}>
              <input
                style={s.noteInput}
                placeholder="Add a note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              {user?.role === 'student' && (
                <button style={s.pushBtn} onClick={() => handlePush(p._id)}>
                  Push work ↑
                </button>
              )}
              {(user?.role === 'mentor' || user?.role === 'admin') && (
                <button style={s.pullBtn} onClick={() => handlePullback(p._id)}>
                  Send back ↩
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const statusColor = (s) => ({
  active: '#34D399', completed: '#7C6EFA',
  'on-hold': '#F59E0B', open: '#60A5FA',
}[s] || '#888');

const deptColor = (s) => ({
  'in-progress': '#34D399', completed: '#7C6EFA',
  pending: '#888', review: '#F59E0B',
}[s] || '#888');

const s = {
  page: { padding: '24px', maxWidth: 860, margin: '0 auto' },
  center: { textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' },
  heading: { color: 'var(--color-text-primary)', marginBottom: 20, fontSize: 22, fontWeight: 500 },
  empty: { color: 'var(--color-text-secondary)', textAlign: 'center', padding: 40 },
  card: { background: 'var(--color-background-secondary)', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid var(--color-border-tertiary)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' },
  badge: { fontSize: 11, padding: '3px 10px', borderRadius: 20, color: '#fff', fontWeight: 600 },
  desc: { fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 },
  depts: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  dept: { background: 'var(--color-background-tertiary)', borderRadius: 8, padding: '10px 14px', minWidth: 160 },
  deptName: { display: 'block', fontWeight: 500, fontSize: 13, color: 'var(--color-text-primary)' },
  deptStatus: { display: 'block', fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 6 },
  deptStudents: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  student: { fontSize: 11, background: 'var(--color-background-primary)', padding: '2px 8px', borderRadius: 10, color: 'var(--color-text-secondary)' },
  actions: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  noteInput: { flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border-secondary)', background: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)', fontSize: 13 },
  pushBtn: { padding: '8px 18px', background: '#34D399', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
  pullBtn: { padding: '8px 18px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
};