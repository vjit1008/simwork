/**
 * SimWork — Simulate Before You Apply
 * Copyright (c) 2025 Vishvajit Gadakari. All rights reserved.
 */
import { useState } from 'react';
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

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [login, setLogin]   = useState({ email:'', password:'' });
  const [signup, setSignup] = useState({
    name:'', lname:'', email:'', password:'', city:'', role:'',
    college:'', degree:'', branch:'', gradyear:'', skills:'',
  });
  const [showLoginPass,  setShowLoginPass]  = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [error, setError] = useState('');
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const DEMO = { name:'Demo', lname:'Account', email:'demo@simwork.in',
    city:'Pune', role:'Software Developer', college:'Pune University',
    degree:'B.Tech / B.E.', branch:'Computer Science', gradyear:'2025',
    skills:['JavaScript','React','Node.js','Python'],
    avatarColor:'#7C6EFA', xp:0, certs:[], password:'demo123',
    notifications:{email:true,browser:true,weekly:true},
    privacy:{publicProfile:true,showEducation:true,showOnLeaderboard:true} };

  const handleLogin = async () => {
    if (!login.email || !login.password) { setError('Please fill all fields'); return; }
    try {
      const { data } = await API.post('/api/auth/login', { email: login.email, password: login.password });
      doLogin(data.user, data.token);
      localStorage.setItem('token', data.token);
      navigate('/');
      showToast('Welcome back! 👋');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleSignup = async () => {
    if (!signup.name||!signup.email||!signup.password) { setError('Please fill all required fields'); return; }
    if (signup.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      const { data } = await API.post('/api/auth/signup', {
        name: `${signup.name} ${signup.lname}`.trim(),
        email: signup.email,
        password: signup.password,
      });
      doLogin(data.user, data.token);
      localStorage.setItem('token', data.token);
      navigate('/');
      showToast('Welcome to SimWork! 🚀');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const s = {
    page:  { minHeight:'100vh', width:'100%', background:'var(--bg)', display:'flex', overflow:'auto' },
    left:  { flex:'1 1 400px', minWidth:0, background:'linear-gradient(135deg,rgba(124,110,250,.15),rgba(52,211,153,.08))', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 40px', borderRight:'1px solid var(--border)', position:'relative', overflow:'hidden' },
    right: { flex:'0 0 440px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', padding:'40px 44px', overflowY:'auto', maxHeight:'100vh' },
    panel: { width:'100%', maxWidth:360 },
    tabs:  { display:'flex', background:'var(--s2)', borderRadius:10, padding:4, marginBottom:28 },
    tab:   (a) => ({ flex:1, padding:9, textAlign:'center', borderRadius:7, fontSize:13, fontWeight:600, cursor:'pointer', color: a ? '#fff' : 'var(--muted2)', background: a ? 'var(--accent)' : 'transparent', transition:'all .2s' }),
    inp:   { width:'100%', background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:10, padding:'12px 14px', color:'var(--text)', fontSize:14, outline:'none', boxSizing:'border-box', marginTop:6 },
    sel:   { width:'100%', background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:10, padding:'12px 14px', color:'var(--text)', fontSize:14, outline:'none', marginTop:6, cursor:'pointer' },
    label: { display:'block', fontSize:12, fontWeight:600, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'.05em', marginTop:14 },
    btn:   { width:'100%', padding:14, background:'var(--accent)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', marginTop:16 },
    ghost: { width:'100%', padding:14, background:'var(--s2)', color:'var(--muted2)', border:'1px solid var(--border2)', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', marginTop:8 },
    err:   { background:'rgba(248,113,113,.1)', color:'var(--rose)', padding:'10px 14px', borderRadius:8, fontSize:13, marginTop:12 },
    brand: { display:'flex', alignItems:'center', gap:12, marginBottom:40 },
    bsq:   { width:44, height:44, background:'var(--accent)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#fff' },
    tag:   { fontSize:26, fontWeight:800, lineHeight:1.2, letterSpacing:'-.03em', maxWidth:340, marginBottom:28 },
    feat:  { display:'flex', flexDirection:'column', gap:14 },
    fi:    { display:'flex', alignItems:'center', gap:12, fontSize:14, color:'var(--muted2)' },
    ficon: { width:32, height:32, borderRadius:8, background:'rgba(124,110,250,.12)', border:'1px solid rgba(124,110,250,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 },
    row:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
    sec:   { fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, padding:'16px 0 8px', borderBottom:'1px solid var(--border)', marginBottom:4 },
    eyeWrap: { position:'relative' },
    eye:   { position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted2,#64748b)', padding:0, display:'flex', alignItems:'center', marginTop:3 },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .auth-left  { display: none !important; }
          .auth-right { flex: 1 1 100% !important; width: 100% !important; max-height: 100vh !important; padding: 32px 24px !important; }
          .auth-page  { flex-direction: column !important; }
        }
      `}</style>
      <div style={s.page} className="auth-page">

        {/* LEFT */}
        <div style={s.left} className="auth-left">
          <div style={s.brand}>
            <div style={s.bsq}>S</div>
            <div style={{fontSize:26,fontWeight:800,letterSpacing:'-.03em'}}>SimWork</div>
          </div>
          <div style={s.tag}>Simulate before<br/>you <em style={{color:'var(--accent)'}}>apply.</em></div>
          <div style={s.feat}>
            {[['💻','Real job simulations in an in-browser IDE'],['🏅','Verified certificates recruiters trust'],['📊','Public portfolio to showcase your work'],['🎯','Get discovered by top companies']].map(([icon,txt],i)=>(
              <div key={i} style={s.fi}><div style={s.ficon}>{icon}</div>{txt}</div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
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
                  onKeyDown={e=>e.key==='Enter'&&handleLogin()} />

                <label style={s.label}>Password</label>
                {/* ── Password with show/hide toggle ── */}
                <div style={s.eyeWrap}>
                  <input
                    style={{ ...s.inp, paddingRight:44 }}
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder="Your password"
                    value={login.password}
                    onChange={e=>setLogin({...login,password:e.target.value})}
                    onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                  />
                  <button type="button" style={s.eye} onClick={()=>setShowLoginPass(p=>!p)} title={showLoginPass?'Hide password':'Show password'}>
                    {showLoginPass ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>

                <div style={{textAlign:'right',marginTop:6,marginBottom:2}}>
                  <span style={{fontSize:12,color:'var(--accent)',cursor:'pointer',fontWeight:600}} onClick={()=>navigate('/forgot-password')}>
                    Forgot password?
                  </span>
                </div>

                {error && <div style={s.err}>{error}</div>}
                <button style={s.btn} onClick={handleLogin}>Sign In →</button>
                <button style={s.ghost} onClick={()=>{doLogin(DEMO);navigate('/');showToast('Demo account loaded! 🚀');}}>🚀 Try Demo Account</button>
                <div style={{textAlign:'center',marginTop:20,fontSize:13,color:'var(--muted2)'}}>
                  Don't have an account? <span style={{color:'var(--accent)',cursor:'pointer',fontWeight:600}} onClick={()=>setTab('signup')}>Sign Up</span>
                </div>
              </>
            ) : (
              <>
                <div style={{fontSize:24,fontWeight:800,marginBottom:4}}>Create account ✨</div>
                <div style={{fontSize:14,color:'var(--muted2)',marginBottom:16}}>Join thousands of freshers building job-ready skills</div>
                <div style={s.sec}>Personal Info</div>
                <div style={s.row}>
                  <div><label style={s.label}>First Name *</label><input style={s.inp} placeholder="First" value={signup.name} onChange={e=>setSignup({...signup,name:e.target.value})}/></div>
                  <div><label style={s.label}>Last Name *</label><input style={s.inp} placeholder="Last" value={signup.lname} onChange={e=>setSignup({...signup,lname:e.target.value})}/></div>
                </div>
                <label style={s.label}>Email *</label>
                <input style={s.inp} type="email" placeholder="you@example.com" value={signup.email} onChange={e=>setSignup({...signup,email:e.target.value})}/>

                <label style={s.label}>Password *</label>
                {/* ── Signup password with show/hide toggle ── */}
                <div style={s.eyeWrap}>
                  <input
                    style={{ ...s.inp, paddingRight:44 }}
                    type={showSignupPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={signup.password}
                    onChange={e=>setSignup({...signup,password:e.target.value})}
                  />
                  <button type="button" style={s.eye} onClick={()=>setShowSignupPass(p=>!p)} title={showSignupPass?'Hide password':'Show password'}>
                    {showSignupPass ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>

                <div style={s.row}>
                  <div><label style={s.label}>City</label><input style={s.inp} placeholder="Pune" value={signup.city} onChange={e=>setSignup({...signup,city:e.target.value})}/></div>
                  <div><label style={s.label}>Target Role</label>
                    <select style={s.sel} value={signup.role} onChange={e=>setSignup({...signup,role:e.target.value})}>
                      <option value="">Select...</option>
                      {['Software Developer','Data Scientist','Finance Analyst','UI/UX Designer','DevOps Engineer','Product Manager','AI Engineer'].map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div style={s.sec}>Education</div>
                <label style={s.label}>College / University</label>
                <input style={s.inp} placeholder="e.g. Pune University" value={signup.college} onChange={e=>setSignup({...signup,college:e.target.value})}/>
                <div style={s.row}>
                  <div><label style={s.label}>Degree</label>
                    <select style={s.sel} value={signup.degree} onChange={e=>setSignup({...signup,degree:e.target.value})}>
                      <option value="">Select...</option>
                      {['B.Tech / B.E.','B.Sc','BCA','MCA','M.Tech','MBA','B.Com','Other'].map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div><label style={s.label}>Grad Year</label>
                    <input type="number" min="1990" max="2035" placeholder="e.g. 2025" style={s.inp} value={signup.gradyear} onChange={e=>setSignup({...signup,gradyear:e.target.value})}/>
                  </div>
                </div>
                <label style={s.label}>Skills (comma separated)</label>
                <input style={s.inp} placeholder="JavaScript, Python, SQL" value={signup.skills} onChange={e=>setSignup({...signup,skills:e.target.value})}/>
                {error && <div style={s.err}>{error}</div>}
                <button style={s.btn} onClick={handleSignup}>Create Account →</button>
                <div style={{textAlign:'center',marginTop:16,fontSize:13,color:'var(--muted2)'}}>
                  Already have an account? <span style={{color:'var(--accent)',cursor:'pointer',fontWeight:600}} onClick={()=>setTab('login')}>Sign In</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}