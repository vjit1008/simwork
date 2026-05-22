import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from 'context/AuthContext';
import { showToast }   from 'components/Toast';
import API             from 'api/axios';
import ParticleField   from 'components/Effects/ParticleField';
import GlowButton      from 'components/Ui/GlowButton';
import NeuralInput     from 'components/Ui/NeuralInput';

const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

const DEMO = {
  name:'Demo', lname:'Account', email:'demo@simwork.in', city:'Pune',
  role:'Software Developer', college:'Pune University', degree:'B.Tech / B.E.',
  branch:'Computer Science', gradyear:'2025',
  skills:['JavaScript','React','Node.js','Python'],
  avatarColor:'#6c63ff', xp:0, certs:[],
  notifications:{email:true,browser:true,weekly:true},
  privacy:{publicProfile:true,showEducation:true,showOnLeaderboard:true},
};

const FEATURES = [
  { icon:'⟨⟩', text:'Real in-browser IDE tasks'      },
  { icon:'🏅', text:'AI-verified certificates'        },
  { icon:'◈',  text:'Global leaderboard & XP system'  },
  { icon:'⚡', text:'5 role simulations available'    },
];

export default function AuthPage() {
  const [tab, setTab]       = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [login,  setLogin]  = useState({ email:'', password:'' });
  const [signup, setSignup] = useState({ name:'', lname:'', email:'', password:'', role:'' });
  const [error,  setError]  = useState('');
  const [loading, setLoading] = useState(false);
  const { login: doLogin }  = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!login.email || !login.password) { setError('Please fill all fields.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/api/auth/login', login);
      doLogin(data.user, data.token);
      localStorage.setItem('token', data.token);
      navigate('/');
      showToast('Welcome back! 👋');
    } catch (err) { setError(err.response?.data?.message || 'Invalid email or password.'); }
    finally { setLoading(false); }
  };

  const handleSignup = async () => {
    if (!signup.name || !signup.email || !signup.password) { setError('Please fill required fields.'); return; }
    if (signup.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/api/auth/signup', {
        name: `${signup.name} ${signup.lname}`.trim(),
        email: signup.email, password: signup.password,
      });
      doLogin(data.user, data.token);
      localStorage.setItem('token', data.token);
      navigate('/');
      showToast('Welcome to SimWork! 🚀');
    } catch (err) { setError(err.response?.data?.message || 'Signup failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--void)', overflow:'hidden' }}>

      {/* ── Left panel ── */}
      <div style={{
        flex:'1 1 480px', position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'60px 40px',
        background:'linear-gradient(135deg, rgba(108,99,255,.08) 0%, rgba(0,212,170,.04) 100%)',
        borderRight:'1px solid rgba(255,255,255,.05)',
      }} className="auth-left">

        <ParticleField count={40} color="#6c63ff" speed={0.2} />

        {/* Ambient orb */}
        <div style={{
          position:'absolute', width:400, height:400, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(108,99,255,.12), transparent 70%)',
          top:'20%', left:'30%', transform:'translate(-50%,-50%)',
          pointerEvents:'none',
          animation:'float 7s ease-in-out infinite',
        }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:380 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:48 }}>
            <div style={{
              width:40, height:40, borderRadius:11,
              background:'linear-gradient(135deg,#7c74ff,#6c63ff)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, fontWeight:900, color:'#fff',
              boxShadow:'0 0 20px rgba(108,99,255,.5)',
            }}>S</div>
            <span style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, letterSpacing:'-0.02em' }}>
              Sim<span style={{ background:'linear-gradient(135deg,#a99fff,#6c63ff,#00d4aa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Work</span>
            </span>
          </div>

          <h2 style={{ fontSize:'clamp(28px,3vw,40px)', fontWeight:800, lineHeight:1.15, marginBottom:16, color:'var(--text-1)' }}>
            The future of<br/>
            <span style={{ background:'linear-gradient(135deg,#a99fff,#6c63ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>job readiness.</span>
          </h2>
          <p style={{ fontSize:15, color:'var(--text-2)', lineHeight:1.7, marginBottom:36 }}>
            Simulate real work. Earn AI-verified certificates. Get discovered by top companies.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:32, height:32, borderRadius:8, flexShrink:0,
                  background:'rgba(108,99,255,.12)', border:'1px solid rgba(108,99,255,.2)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:14,
                }}>{f.icon}</div>
                <span style={{ fontSize:14, color:'var(--text-2)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        flex:'0 0 460px', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'flex-start',
        padding:'40px 44px', overflowY:'auto', maxHeight:'100vh',
        background:'var(--void)',
      }} className="auth-right">
        <div style={{ width:'100%', maxWidth:360, paddingTop:20 }}>

          {/* Tabs */}
          <div style={{
            display:'flex', background:'rgba(10,15,30,.8)', border:'1px solid rgba(255,255,255,.06)',
            borderRadius:12, padding:4, marginBottom:32, gap:4,
          }}>
            {['login','signup'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex:1, padding:'9px', textAlign:'center', borderRadius:9,
                  fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
                  color: tab === t ? '#fff' : 'var(--text-2)',
                  background: tab === t ? 'linear-gradient(135deg,rgba(108,99,255,.8),rgba(108,99,255,.5))' : 'transparent',
                  boxShadow: tab === t ? '0 0 16px rgba(108,99,255,.3)' : 'none',
                  transition:'all 0.2s',
                }}>
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Welcome back 👋</h1>
                <p style={{ fontSize:13, color:'var(--text-3)', margin:0 }}>Sign in to continue your simulation journey.</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:20 }}>
                <NeuralInput label="Email Address" type="email" placeholder="you@example.com"
                  value={login.email} onChange={e => setLogin({...login, email:e.target.value})}
                  onKeyDown={e => e.key==='Enter' && handleLogin()} required />

                <NeuralInput label="Password" type={showPass ? 'text' : 'password'} placeholder="Your password"
                  value={login.password} onChange={e => setLogin({...login, password:e.target.value})}
                  onKeyDown={e => e.key==='Enter' && handleLogin()} required
                  rightElement={
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', padding:0 }}>
                      {showPass ? <EyeOff /> : <EyeOn />}
                    </button>
                  } />
              </div>

              <div style={{ textAlign:'right', marginBottom:20 }}>
                <span onClick={() => navigate('/forgot-password')}
                  style={{ fontSize:12, color:'var(--plasma)', cursor:'pointer', fontFamily:'var(--font-mono)' }}>
                  Forgot password?
                </span>
              </div>

              {error && (
                <div style={{ padding:'10px 14px', background:'rgba(255,107,107,.1)', border:'1px solid rgba(255,107,107,.25)', borderRadius:8, fontSize:13, color:'var(--flare)', marginBottom:16 }}>
                  ⚠ {error}
                </div>
              )}

              <GlowButton variant="plasma" style={{ width:'100%', marginBottom:10 }} onClick={handleLogin} loading={loading}>
                Sign In →
              </GlowButton>
              <GlowButton variant="ghost" style={{ width:'100%' }}
                onClick={() => { doLogin(DEMO); navigate('/'); showToast('Demo account loaded! 🚀'); }}>
                🚀 Try Demo Account
              </GlowButton>

              <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--text-3)' }}>
                No account?{' '}
                <span onClick={() => setTab('signup')} style={{ color:'var(--plasma)', cursor:'pointer', fontWeight:600 }}>
                  Create one →
                </span>
              </p>
            </>
          ) : (
            <>
              <div style={{ marginBottom:24 }}>
                <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Create account ✨</h1>
                <p style={{ fontSize:13, color:'var(--text-3)', margin:0 }}>Join thousands building job-ready skills.</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <NeuralInput label="First Name *" placeholder="First" value={signup.name}
                    onChange={e => setSignup({...signup, name:e.target.value})} />
                  <NeuralInput label="Last Name" placeholder="Last" value={signup.lname}
                    onChange={e => setSignup({...signup, lname:e.target.value})} />
                </div>
                <NeuralInput label="Email *" type="email" placeholder="you@example.com"
                  value={signup.email} onChange={e => setSignup({...signup, email:e.target.value})} required />
                <NeuralInput label="Password *" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={signup.password} onChange={e => setSignup({...signup, password:e.target.value})} required
                  rightElement={
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', padding:0 }}>
                      {showPass ? <EyeOff /> : <EyeOn />}
                    </button>
                  } />
                <div>
                  <div style={{ fontSize:10, fontFamily:'var(--font-mono)', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>
                    Target Role
                  </div>
                  <select value={signup.role} onChange={e => setSignup({...signup, role:e.target.value})}
                    style={{ width:'100%', padding:'12px 16px', background:'rgba(10,15,30,.8)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, color:'var(--text-1)', fontSize:14, outline:'none', fontFamily:'var(--font-body)', cursor:'pointer' }}>
                    <option value="">Select your role...</option>
                    {['Software Developer','Data Scientist','UI/UX Designer','DevOps Engineer','Product Manager','AI Engineer'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div style={{ padding:'10px 14px', background:'rgba(255,107,107,.1)', border:'1px solid rgba(255,107,107,.25)', borderRadius:8, fontSize:13, color:'var(--flare)', marginBottom:16 }}>
                  ⚠ {error}
                </div>
              )}

              <GlowButton variant="plasma" style={{ width:'100%' }} onClick={handleSignup} loading={loading}>
                Create Account →
              </GlowButton>

              <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--text-3)' }}>
                Already have an account?{' '}
                <span onClick={() => setTab('login')} style={{ color:'var(--plasma)', cursor:'pointer', fontWeight:600 }}>
                  Sign In →
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left  { display:none !important; }
          .auth-right { flex:1 1 100% !important; max-height:100vh !important; }
        }
      `}</style>
    </div>
  );
}
