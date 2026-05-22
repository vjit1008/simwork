/**
 * SimWork — Simulate Before You Apply
 * Copyright (c) 2025 Vishvajit Gadakari. All rights reserved.
 */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import API from '../api/axios';

const EyeOn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// Spinner icon
const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
      style={{ animation: 'spin .8s linear infinite', transformOrigin: 'center' }} />
  </svg>
);

export default function Auth() {
  const [tab,           setTab]          = useState('login');
  const [login,         setLogin]        = useState({ email:'', password:'' });
  const [signup,        setSignup]       = useState({ name:'', lname:'', email:'', password:'', city:'', role:'', college:'', degree:'', branch:'', gradyear:'', skills:'' });
  const [showLoginPass, setShowLoginPass]  = useState(false);
  const [showSignupPass,setShowSignupPass] = useState(false);
  const [error,         setError]        = useState('');
  const [loadingLogin,  setLoadingLogin]  = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [loadingDemo,   setLoadingDemo]   = useState(false);
  // progress bar ref
  const barRef = useRef(null);

  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const DEMO = {
    name:'Demo', lname:'Account', email:'demo@simwork.in',
    city:'Pune', role:'Software Developer', college:'Pune University',
    degree:'B.Tech / B.E.', branch:'Computer Science', gradyear:'2025',
    skills:['JavaScript','React','Node.js','Python'],
    avatarColor:'#7C6EFA', xp:0, certs:[],
    notifications:{email:true,browser:true,weekly:true},
    privacy:{publicProfile:true,showEducation:true,showOnLeaderboard:true},
  };

  /* ── Progress bar helpers ── */
  const startProgress = () => {
    if (!barRef.current) return;
    barRef.current.style.transition = 'none';
    barRef.current.style.width = '0%';
    barRef.current.style.opacity = '1';
    // small delay so transition resets, then animate to 80%
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        barRef.current.style.transition = 'width 1.8s cubic-bezier(0.1,0.6,0.4,1)';
        barRef.current.style.width = '80%';
      });
    });
  };
  const finishProgress = (success) => {
    if (!barRef.current) return;
    barRef.current.style.transition = 'width 0.25s ease, opacity 0.4s ease 0.3s';
    barRef.current.style.width = '100%';
    barRef.current.style.background = success
      ? 'linear-gradient(90deg, #34D399, #6EE7B7)'
      : 'linear-gradient(90deg, #F87171, #FCA5A5)';
    setTimeout(() => {
      if (barRef.current) barRef.current.style.opacity = '0';
    }, 600);
  };

  /* ── Login ── */
  const handleLogin = async () => {
    if (!login.email || !login.password) { setError('Please fill all fields'); return; }
    setError(''); setLoadingLogin(true); startProgress();
    try {
      const { data } = await API.post('/api/auth/login', { email: login.email, password: login.password });
      finishProgress(true);
      doLogin(data.user, data.token);
      localStorage.setItem('token', data.token);
      setTimeout(() => { navigate('/'); showToast('Welcome back! 👋'); }, 300);
    } catch (err) {
      finishProgress(false);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoadingLogin(false);
    }
  };

  /* ── Signup ── */
  const handleSignup = async () => {
    if (!signup.name||!signup.email||!signup.password) { setError('Please fill all required fields'); return; }
    if (signup.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoadingSignup(true); startProgress();
    try {
      const { data } = await API.post('/api/auth/signup', {
        name: `${signup.name} ${signup.lname}`.trim(),
        email: signup.email,
        password: signup.password,
      });
      finishProgress(true);
      doLogin(data.user, data.token);
      localStorage.setItem('token', data.token);
      setTimeout(() => { navigate('/'); showToast('Welcome to SimWork! 🚀'); }, 300);
    } catch (err) {
      finishProgress(false);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoadingSignup(false);
    }
  };

  /* ── Demo ── */
  const handleDemo = () => {
    setLoadingDemo(true); startProgress();
    setTimeout(() => {
      finishProgress(true);
      doLogin(DEMO);
      setTimeout(() => { navigate('/'); showToast('Demo account loaded! 🚀'); }, 300);
    }, 900);
  };

  const s = {
    page:    { minHeight:'100vh', width:'100%', background:'var(--bg)', display:'flex', overflow:'auto', position:'relative' },
    left:    { flex:'1 1 400px', minWidth:0, background:'linear-gradient(135deg,rgba(124,110,250,.15),rgba(52,211,153,.08))', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 40px', borderRight:'1px solid var(--border)', position:'relative', overflow:'hidden' },
    right:   { flex:'0 0 440px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', padding:'40px 44px', overflowY:'auto', maxHeight:'100vh', position:'relative' },
    panel:   { width:'100%', maxWidth:360 },
    tabs:    { display:'flex', background:'var(--s2)', borderRadius:10, padding:4, marginBottom:28 },
    tab:     (a) => ({ flex:1, padding:9, textAlign:'center', borderRadius:7, fontSize:13, fontWeight:600, cursor:'pointer', color: a?'#fff':'var(--muted2)', background: a?'var(--accent)':'transparent', transition:'all .2s' }),
    inp:     { width:'100%', background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:10, padding:'12px 14px', color:'var(--text)', fontSize:14, outline:'none', boxSizing:'border-box', marginTop:6 },
    sel:     { width:'100%', background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:10, padding:'12px 14px', color:'var(--text)', fontSize:14, outline:'none', marginTop:6, cursor:'pointer' },
    label:   { display:'block', fontSize:12, fontWeight:600, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'.05em', marginTop:14 },
    btn:     (loading) => ({ width:'100%', padding:14, background: loading ? 'rgba(124,110,250,.6)' : 'var(--accent)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'background .2s, transform .1s', transform: loading ? 'scale(.99)' : 'scale(1)' }),
    ghost:   (loading) => ({ width:'100%', padding:14, background:'var(--s2)', color:'var(--muted2)', border:'1px solid var(--border2)', borderRadius:10, fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', marginTop:8, display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity: loading ? 0.6 : 1 }),
    err:     { background:'rgba(248,113,113,.1)', color:'var(--rose)', padding:'10px 14px', borderRadius:8, fontSize:13, marginTop:12 },
    brand:   { display:'flex', alignItems:'center', gap:12, marginBottom:40 },
    bsq:     { width:44, height:44, background:'var(--accent)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#fff' },
    tag:     { fontSize:26, fontWeight:800, lineHeight:1.2, letterSpacing:'-.03em', maxWidth:340, marginBottom:28 },
    feat:    { display:'flex', flexDirection:'column', gap:14 },
    fi:      { display:'flex', alignItems:'center', gap:12, fontSize:14, color:'var(--muted2)' },
    ficon:   { width:32, height:32, borderRadius:8, background:'rgba(124,110,250,.12)', border:'1px solid rgba(124,110,250,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 },
    row:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
    sec:     { fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, padding:'16px 0 8px', borderBottom:'1px solid var(--border)', marginBottom:4 },
    eyeWrap: { position:'relative' },
    eye:     { position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted2)', padding:0, display:'flex', alignItems:'center', marginTop:3 },
  };

  const isLoading = loadingLogin || loadingSignup || loadingDemo;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer-bar {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes pulse-glow {
          0%,100% { opacity: .7; }
          50%      { opacity: 1; }
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (max-width: 768px) {
          .auth-left  { display: none !important; }
          .auth-right { flex: 1 1 100% !important; width: 100% !important; max-height: 100vh !important; padding: 32px 24px !important; }
          .auth-page  { flex-direction: column !important; }
        }
      `}</style>

      <div style={s.page} className="auth-page">

        {/* ── TOP PROGRESS BAR ── */}
        <div style={{
          position:'fixed', top:0, left:0, right:0, zIndex:9999,
          height:3, background:'transparent', pointerEvents:'none',
        }}>
          {/* track */}
          <div style={{ position:'absolute', inset:0, background:'rgba(124,110,250,.1)' }} />
          {/* fill bar */}
          <div ref={barRef} style={{
            position:'absolute', top:0, left:0,
            height:'100%', width:'0%', opacity:0,
            background:'linear-gradient(90deg, #7C6EFA, #A78BFA, #34D399)',
            backgroundSize:'400px 100%',
            boxShadow:'0 0 10px rgba(124,110,250,.8), 0 0 20px rgba(124,110,250,.4)',
            borderRadius:'0 2px 2px 0',
          }} />
          {/* shimmer on top */}
          {isLoading && (
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.3) 50%, transparent 100%)',
              backgroundSize:'400px 100%',
              animation:'shimmer-bar 1.2s linear infinite',
            }} />
          )}
        </div>

        {/* ── PAGE OVERLAY when loading ── */}
        {isLoading && (
          <div style={{
            position:'fixed', inset:0, zIndex:200,
            background:'rgba(8,10,20,.4)',
            backdropFilter:'blur(2px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation:'overlay-in .2s ease',
            pointerEvents:'all',
          }}>
            {/* Floating status card */}
            <div style={{
              background:'var(--s1)',
              border:'1px solid rgba(124,110,250,.3)',
              borderRadius:16, padding:'24px 32px',
              display:'flex', alignItems:'center', gap:16,
              boxShadow:'0 20px 60px rgba(0,0,0,.5), 0 0 40px rgba(124,110,250,.15)',
            }}>
              {/* Animated ring */}
              <div style={{ position:'relative', width:40, height:40, flexShrink:0 }}>
                <svg width={40} height={40} viewBox="0 0 40 40" style={{ position:'absolute', inset:0 }}>
                  <circle cx={20} cy={20} r={16} fill="none" stroke="rgba(124,110,250,.15)" strokeWidth={2.5} />
                  <circle cx={20} cy={20} r={16} fill="none" stroke="#7C6EFA" strokeWidth={2.5}
                    strokeLinecap="round" strokeDasharray="25 75"
                    style={{ transformOrigin:'20px 20px', animation:'spin .9s linear infinite' }} />
                </svg>
                {/* Inner dot */}
                <div style={{
                  position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#7C6EFA', animation:'pulse-glow 1.2s ease infinite' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>
                  {loadingDemo ? 'Loading demo account…'
                  : loadingLogin ? 'Signing you in…'
                  : 'Creating your account…'}
                </div>
                <div style={{ fontSize:12, color:'var(--muted2)' }}>
                  {loadingDemo ? 'Preparing your workspace'
                  : loadingLogin ? 'Verifying credentials'
                  : 'Setting up your profile'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LEFT PANEL ── */}
        <div style={s.left} className="auth-left">
          {/* Subtle animated bg dots */}
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden',
          }}>
            {[{x:'20%',y:'20%',s:200,d:0},{x:'70%',y:'60%',s:280,d:2},{x:'40%',y:'80%',s:160,d:4}].map((o,i)=>(
              <div key={i} style={{
                position:'absolute', borderRadius:'50%',
                width:o.s, height:o.s,
                left:o.x, top:o.y, transform:'translate(-50%,-50%)',
                background:'radial-gradient(circle, rgba(124,110,250,.08), transparent 70%)',
                animation:`pulse-glow ${3+i}s ease-in-out infinite`,
                animationDelay:`${o.d}s`,
              }} />
            ))}
          </div>

          <div style={s.brand}>
            <div style={s.bsq}>S</div>
            <div style={{fontSize:26,fontWeight:800,letterSpacing:'-.03em'}}>SimWork</div>
          </div>
          <div style={s.tag}>
            Simulate before<br/>
            you <em style={{color:'var(--accent)'}}>apply.</em>
          </div>
          <div style={s.feat}>
            {[['💻','Real job simulations in an in-browser IDE'],['🏅','Verified certificates recruiters trust'],['📊','Public portfolio to showcase your work'],['🎯','Get discovered by top companies']].map(([icon,txt],i)=>(
              <div key={i} style={s.fi}><div style={s.ficon}>{icon}</div>{txt}</div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={s.right} className="auth-right">
          <div style={s.panel}>
            <div style={s.tabs}>
              <div style={s.tab(tab==='login')}  onClick={()=>{setTab('login');setError('');}}>Sign In</div>
              <div style={s.tab(tab==='signup')} onClick={()=>{setTab('signup');setError('');}}>Sign Up</div>
            </div>

            {tab === 'login' ? (
              <>
                <div style={{fontSize:24,fontWeight:800,marginBottom:4}}>Welcome back 👋</div>
                <div style={{fontSize:14,color:'var(--muted2)',marginBottom:24}}>Sign in to continue your simulation journey</div>

                <label style={s.label}>Email Address</label>
                <input style={s.inp} type="email" placeholder="you@example.com"
                  value={login.email} onChange={e=>setLogin({...login,email:e.target.value})}
                  onKeyDown={e=>e.key==='Enter'&&!isLoading&&handleLogin()} disabled={isLoading} />

                <label style={s.label}>Password</label>
                <div style={s.eyeWrap}>
                  <input
                    style={{...s.inp, paddingRight:44}}
                    type={showLoginPass?'text':'password'}
                    placeholder="Your password"
                    value={login.password}
                    onChange={e=>setLogin({...login,password:e.target.value})}
                    onKeyDown={e=>e.key==='Enter'&&!isLoading&&handleLogin()}
                    disabled={isLoading}
                  />
                  <button type="button" style={s.eye} onClick={()=>setShowLoginPass(p=>!p)}>
                    {showLoginPass ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>

                <div style={{textAlign:'right',marginTop:6,marginBottom:2}}>
                  <span style={{fontSize:12,color:'var(--accent)',cursor:'pointer',fontWeight:600}}
                    onClick={()=>!isLoading&&navigate('/forgot-password')}>
                    Forgot password?
                  </span>
                </div>

                {error && <div style={s.err}>{error}</div>}

                <button style={s.btn(loadingLogin)} onClick={!isLoading?handleLogin:undefined} disabled={isLoading}>
                  {loadingLogin
                    ? <><Spinner /> Signing in…</>
                    : 'Sign In →'
                  }
                </button>

                <button style={s.ghost(loadingDemo)} onClick={!isLoading?handleDemo:undefined} disabled={isLoading}>
                  {loadingDemo
                    ? <><Spinner /> Loading demo…</>
                    : '🚀 Try Demo Account'
                  }
                </button>

                <div style={{textAlign:'center',marginTop:20,fontSize:13,color:'var(--muted2)'}}>
                  Don't have an account?{' '}
                  <span style={{color:'var(--accent)',cursor:'pointer',fontWeight:600}} onClick={()=>!isLoading&&setTab('signup')}>
                    Sign Up
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={{fontSize:24,fontWeight:800,marginBottom:4}}>Create account ✨</div>
                <div style={{fontSize:14,color:'var(--muted2)',marginBottom:16}}>Join thousands of freshers building job-ready skills</div>
                <div style={s.sec}>Personal Info</div>
                <div style={s.row}>
                  <div><label style={s.label}>First Name *</label><input style={s.inp} placeholder="First" value={signup.name} onChange={e=>setSignup({...signup,name:e.target.value})} disabled={isLoading}/></div>
                  <div><label style={s.label}>Last Name</label><input style={s.inp} placeholder="Last" value={signup.lname} onChange={e=>setSignup({...signup,lname:e.target.value})} disabled={isLoading}/></div>
                </div>
                <label style={s.label}>Email *</label>
                <input style={s.inp} type="email" placeholder="you@example.com" value={signup.email} onChange={e=>setSignup({...signup,email:e.target.value})} disabled={isLoading}/>

                <label style={s.label}>Password *</label>
                <div style={s.eyeWrap}>
                  <input
                    style={{...s.inp, paddingRight:44}}
                    type={showSignupPass?'text':'password'}
                    placeholder="Min. 6 characters"
                    value={signup.password}
                    onChange={e=>setSignup({...signup,password:e.target.value})}
                    disabled={isLoading}
                  />
                  <button type="button" style={s.eye} onClick={()=>setShowSignupPass(p=>!p)}>
                    {showSignupPass ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>

                <div style={s.row}>
                  <div><label style={s.label}>City</label><input style={s.inp} placeholder="Pune" value={signup.city} onChange={e=>setSignup({...signup,city:e.target.value})} disabled={isLoading}/></div>
                  <div><label style={s.label}>Target Role</label>
                    <select style={s.sel} value={signup.role} onChange={e=>setSignup({...signup,role:e.target.value})} disabled={isLoading}>
                      <option value="">Select...</option>
                      {['Software Developer','Data Scientist','Finance Analyst','UI/UX Designer','DevOps Engineer','Product Manager','AI Engineer'].map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div style={s.sec}>Education</div>
                <label style={s.label}>College / University</label>
                <input style={s.inp} placeholder="e.g. Pune University" value={signup.college} onChange={e=>setSignup({...signup,college:e.target.value})} disabled={isLoading}/>
                <div style={s.row}>
                  <div><label style={s.label}>Degree</label>
                    <select style={s.sel} value={signup.degree} onChange={e=>setSignup({...signup,degree:e.target.value})} disabled={isLoading}>
                      <option value="">Select...</option>
                      {['B.Tech / B.E.','B.Sc','BCA','MCA','M.Tech','MBA','B.Com','Other'].map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div><label style={s.label}>Grad Year</label>
                    <input type="number" min="1990" max="2035" placeholder="e.g. 2025" style={s.inp} value={signup.gradyear} onChange={e=>setSignup({...signup,gradyear:e.target.value})} disabled={isLoading}/>
                  </div>
                </div>

                <label style={s.label}>Skills (comma separated)</label>
                <input style={s.inp} placeholder="JavaScript, Python, SQL" value={signup.skills} onChange={e=>setSignup({...signup,skills:e.target.value})} disabled={isLoading}/>

                {error && <div style={s.err}>{error}</div>}

                <button style={s.btn(loadingSignup)} onClick={!isLoading?handleSignup:undefined} disabled={isLoading}>
                  {loadingSignup
                    ? <><Spinner /> Creating account…</>
                    : 'Create Account →'
                  }
                </button>

                <div style={{textAlign:'center',marginTop:16,fontSize:13,color:'var(--muted2)'}}>
                  Already have an account?{' '}
                  <span style={{color:'var(--accent)',cursor:'pointer',fontWeight:600}} onClick={()=>!isLoading&&setTab('login')}>
                    Sign In
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}