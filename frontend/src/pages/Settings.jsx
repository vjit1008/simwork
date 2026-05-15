import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import API from '../api/axios';

const AVATAR_COLORS = [
  '#7C6EFA','#34D399','#F59E0B',
  '#F87171','#60A5FA','#A78BFA','#EC4899'
];

const SECTIONS = ['Account','Education','Notifications','Privacy','Danger Zone'];

export default function Settings() {
  const { user, update, logout } = useAuth();
  const [section, setSection] = useState('Account');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name:        user?.name        || '',
    email:       user?.email       || '',
    city:        user?.city        || '',
    role:        user?.role        || '',
    avatarColor: user?.avatarColor || '#7C6EFA',
    college:     user?.college     || '',
    degree:      user?.degree      || '',
    branch:      user?.branch      || '',
    gradyear:    user?.gradyear    || '',
    skills:      Array.isArray(user?.skills) ? user.skills.join(', ') : '',
    notifications: user?.notifications || { email: true, browser: true, weekly: true },
    privacy:       user?.privacy       || { publicProfile: true, showEducation: true, showOnLeaderboard: true },
  });

  // Sync form if user context updates
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name:        user.name        || '',
        email:       user.email       || '',
        city:        user.city        || '',
        role:        user.role        || '',
        avatarColor: user.avatarColor || '#7C6EFA',
        college:     user.college     || '',
        degree:      user.degree      || '',
        branch:      user.branch      || '',
        gradyear:    user.gradyear    || '',
        skills:      Array.isArray(user.skills) ? user.skills.join(', ') : '',
        notifications: user.notifications || { email: true, browser: true, weekly: true },
        privacy:       user.privacy       || { publicProfile: true, showEducation: true, showOnLeaderboard: true },
      }));
    }
  }, [user]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setNot = (key, val) => setForm(f => ({ ...f, notifications: { ...f.notifications, [key]: val } }));
  const setPri = (key, val) => setForm(f => ({ ...f, privacy: { ...f.privacy, [key]: val } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await API.put('/api/users/me', payload);
      update(data.user);
      showToast('Settings saved! ✅');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.name || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>⚙️ Settings</h2>

      <div style={s.layout}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          {SECTIONS.map(sec => (
            <div
              key={sec}
              style={{ ...s.navItem, ...(section === sec ? s.navActive : {}) }}
              onClick={() => setSection(sec)}
            >
              {sec === 'Account'       && '👤 '}
              {sec === 'Education'     && '🎓 '}
              {sec === 'Notifications' && '🔔 '}
              {sec === 'Privacy'       && '🔒 '}
              {sec === 'Danger Zone'   && '⚠️ '}
              {sec}
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={s.panel}>

          {/* ── ACCOUNT ── */}
          {section === 'Account' && (
            <div>
              <h3 style={s.sectionTitle}>Account Settings</h3>
              <p style={s.sectionSub}>Manage your credentials and preferences</p>

              {/* Avatar */}
              <div style={s.avatarRow}>
                <div style={{ ...s.avatar, background: form.avatarColor }}>
                  {initials}
                </div>
                <div>
                  <p style={s.label}>Avatar Color</p>
                  <div style={s.colorRow}>
                    {AVATAR_COLORS.map(c => (
                      <div
                        key={c}
                        onClick={() => set('avatarColor', c)}
                        style={{
                          ...s.colorDot,
                          background: c,
                          outline: form.avatarColor === c ? `3px solid ${c}` : 'none',
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={s.grid2}>
                <div>
                  <p style={s.label}>Full Name</p>
                  <input style={s.inp} value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <p style={s.label}>Email</p>
                  <input style={{ ...s.inp, opacity: 0.6 }} value={form.email} disabled />
                </div>
                <div>
                  <p style={s.label}>City</p>
                  <input style={s.inp} value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Pune" />
                </div>
                <div>
                  <p style={s.label}>Target Role</p>
                  <select style={s.sel} value={form.role} onChange={e => set('role', e.target.value)}>
                    <option value="">Select...</option>
                    {['Software Developer','Data Scientist','Finance Analyst','UI/UX Designer','DevOps Engineer','AI Engineer'].map(r => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p style={s.label}>Skills (comma separated)</p>
              <input
                style={s.inp}
                value={form.skills}
                onChange={e => set('skills', e.target.value)}
                placeholder="JavaScript, Python, React, SQL"
              />

              <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* ── EDUCATION ── */}
          {section === 'Education' && (
            <div>
              <h3 style={s.sectionTitle}>Education</h3>
              <p style={s.sectionSub}>Your academic background</p>

              <p style={s.label}>College / University</p>
              <input style={s.inp} value={form.college} onChange={e => set('college', e.target.value)} placeholder="e.g. Pune University" />

              <div style={s.grid2}>
                <div>
                  <p style={s.label}>Degree</p>
                  <select style={s.sel} value={form.degree} onChange={e => set('degree', e.target.value)}>
                    <option value="">Select...</option>
                    {['B.Tech / B.E.','B.Sc','BCA','MCA','M.Tech','MBA','B.Com','Other'].map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p style={s.label}>Branch / Stream</p>
                  <input style={s.inp} value={form.branch} onChange={e => set('branch', e.target.value)} placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <p style={s.label}>Graduation Year</p>
                  <input type="number" style={s.inp} value={form.gradyear} onChange={e => set('gradyear', e.target.value)} placeholder="e.g. 2025" min="1990" max="2035" />
                </div>
              </div>

              <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Education'}
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {section === 'Notifications' && (
            <div>
              <h3 style={s.sectionTitle}>Notifications</h3>
              <p style={s.sectionSub}>Choose what you want to be notified about</p>

              {[
                { key: 'email',   label: 'Email notifications',   sub: 'Receive updates and alerts via email' },
                { key: 'browser', label: 'Browser notifications', sub: 'Push notifications in your browser' },
                { key: 'weekly',  label: 'Weekly digest',         sub: 'A summary of your progress every week' },
              ].map(item => (
                <div key={item.key} style={s.toggleRow}>
                  <div>
                    <p style={s.toggleLabel}>{item.label}</p>
                    <p style={s.toggleSub}>{item.sub}</p>
                  </div>
                  <div
                    style={{ ...s.toggle, background: form.notifications[item.key] ? '#7C6EFA' : 'var(--border2)' }}
                    onClick={() => setNot(item.key, !form.notifications[item.key])}
                  >
                    <div style={{ ...s.toggleKnob, transform: form.notifications[item.key] ? 'translateX(20px)' : 'translateX(0)' }} />
                  </div>
                </div>
              ))}

              <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* ── PRIVACY ── */}
          {section === 'Privacy' && (
            <div>
              <h3 style={s.sectionTitle}>Privacy</h3>
              <p style={s.sectionSub}>Control who can see your profile</p>

              {[
                { key: 'publicProfile',       label: 'Public profile',         sub: 'Anyone can view your SimWork profile' },
                { key: 'showEducation',        label: 'Show education',         sub: 'Display your college and degree on profile' },
                { key: 'showOnLeaderboard',    label: 'Show on leaderboard',    sub: 'Appear in the public XP rankings' },
              ].map(item => (
                <div key={item.key} style={s.toggleRow}>
                  <div>
                    <p style={s.toggleLabel}>{item.label}</p>
                    <p style={s.toggleSub}>{item.sub}</p>
                  </div>
                  <div
                    style={{ ...s.toggle, background: form.privacy[item.key] ? '#7C6EFA' : 'var(--border2)' }}
                    onClick={() => setPri(item.key, !form.privacy[item.key])}
                  >
                    <div style={{ ...s.toggleKnob, transform: form.privacy[item.key] ? 'translateX(20px)' : 'translateX(0)' }} />
                  </div>
                </div>
              ))}

              <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Privacy'}
              </button>
            </div>
          )}

          {/* ── DANGER ZONE ── */}
          {section === 'Danger Zone' && (
            <div>
              <h3 style={{ ...s.sectionTitle, color: '#F87171' }}>Danger Zone</h3>
              <p style={s.sectionSub}>These actions are irreversible. Please be careful.</p>

              <div style={s.dangerCard}>
                <div>
                  <p style={s.toggleLabel}>Sign out of all devices</p>
                  <p style={s.toggleSub}>Invalidates your current session token</p>
                </div>
                <button style={s.dangerBtn} onClick={logout}>Sign Out</button>
              </div>

              <div style={{ ...s.dangerCard, marginTop: 12, borderColor: '#F87171' }}>
                <div>
                  <p style={{ ...s.toggleLabel, color: '#F87171' }}>Delete account</p>
                  <p style={s.toggleSub}>Permanently delete your account and all data. Cannot be undone.</p>
                </div>
                <button
                  style={{ ...s.dangerBtn, background: '#F87171' }}
                  onClick={() => {
                    if (window.confirm('Are you sure? This cannot be undone.')) {
                      API.delete('/api/users/me').then(() => logout());
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const s = {
  page:         { padding: '24px 28px', maxWidth: 900, margin: '0 auto' },
  pageTitle:    { fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 24 },
  layout:       { display: 'flex', gap: 24 },
  sidebar:      { width: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  navItem:      { padding: '10px 14px', borderRadius: 8, fontSize: 13, color: 'var(--muted2)', cursor: 'pointer', fontWeight: 500 },
  navActive:    { background: 'var(--s2)', color: 'var(--text)', fontWeight: 700 },
  panel:        { flex: 1, background: 'var(--s2)', borderRadius: 14, padding: 28, border: '1px solid var(--border2)' },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  sectionSub:   { fontSize: 13, color: 'var(--muted2)', marginBottom: 24 },
  avatarRow:    { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 },
  avatar:       { width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 },
  colorRow:     { display: 'flex', gap: 8, marginTop: 8 },
  colorDot:     { width: 26, height: 26, borderRadius: '50%', cursor: 'pointer', transition: 'outline .15s' },
  grid2:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  label:        { fontSize: 12, fontWeight: 600, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 },
  inp:          { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, boxSizing: 'border-box', outline: 'none' },
  sel:          { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, cursor: 'pointer' },
  saveBtn:      { marginTop: 24, padding: '11px 28px', background: '#7C6EFA', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  toggleRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' },
  toggleLabel:  { fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 },
  toggleSub:    { fontSize: 12, color: 'var(--muted2)' },
  toggle:       { width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 },
  toggleKnob:   { position: 'absolute', top: 3, left: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'transform .2s' },
  dangerCard:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--bg)' },
  dangerBtn:    { padding: '8px 18px', background: 'var(--s2)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: 13, flexShrink: 0 },
};