import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── DNA Strip ───────────────────────────────────────────────────────────────
function DNAStrip() {
  const colors = ['#6c63ff','#00d4aa','#ffa726','#ff6b9d','#29b6f6'];
  const heights = [32,48,56,40,64,44,52,36,60,28,48,52,40,56,44,60,36,52];
  const widths  = [12,10,14,8,16,12,10,14,8,12,10,16,12,14,10,12,14,8];
  return (
    <div style={{display:'flex',gap:4,alignItems:'center',flexWrap:'wrap',margin:'1.5rem 0'}}>
      {heights.map((h,i) => {
        const score = Math.floor(60 + Math.random()*40);
        return (
          <div key={i} title={`Task ${i+1} · Score ${score}`} style={{
            width: widths[i%widths.length],
            height: h,
            background: colors[i%colors.length],
            opacity: 0.5 + score/200,
            borderRadius: i%3===0 ? '50%' : 3,
            transition: 'transform .3s',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onMouseEnter={e=>e.target.style.transform='scaleY(1.3)'}
          onMouseLeave={e=>e.target.style.transform='scaleY(1)'}
          />
        );
      })}
    </div>
  );
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const w=300, h=60, pad=4;
  const max=Math.max(...data), min=Math.min(...data);
  const pts = data.map((v,i)=>{
    const x = pad + (i/(data.length-1))*(w-2*pad);
    const y = pad + (1-(v-min)/(max-min||1))*(h-2*pad);
    return `${x},${y}`;
  }).join(' ');
  const area = `M${pts.split(' ').join('L')} L${w-pad},${h} L${pad},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:60}}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:'var(--s1)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',marginBottom:8}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'1.25rem 1.5rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',fontWeight:500,fontSize:'0.95rem',userSelect:'none'}}>
        {q}
        <span style={{fontSize:'1.2rem',color:'var(--muted2)',transition:'transform .3s',transform:open?'rotate(45deg)':'none'}}>+</span>
      </div>
      {open && <div style={{padding:'0 1.5rem 1.25rem',color:'var(--muted2)',fontSize:'0.9rem',lineHeight:1.7,fontWeight:300}}>{a}</div>}
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const s = {
    page: { fontFamily:"'DM Sans', sans-serif", background:'#050810', color:'#f0f2ff', overflowX:'hidden' },
    nav: { position:'fixed', top:0, left:0, right:0, zIndex:900, background:'rgba(5,8,16,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 2rem', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' },
    logo: { fontFamily:"'Syne', sans-serif", fontSize:'1.4rem', fontWeight:800, letterSpacing:-0.5, color:'#f0f2ff', textDecoration:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 },
    navLink: { color:'#8891b0', textDecoration:'none', fontSize:'0.875rem', padding:'6px 12px', borderRadius:8, transition:'all .2s', cursor:'pointer' },
    section: { padding:'100px 2rem', maxWidth:1200, margin:'0 auto' },
    label: { fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:2, color:'#6c63ff', marginBottom:'1rem', fontWeight:500, display:'block' },
    h2: { fontFamily:"'Syne', sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, letterSpacing:-1, lineHeight:1.1, marginBottom:'1rem' },
    sub: { color:'#8891b0', fontSize:'1.05rem', maxWidth:560, fontWeight:300, lineHeight:1.8 },
    card: { background:'#0d1120', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'2rem', transition:'all .3s' },
    btn: { background:'#6c63ff', color:'#fff', border:'none', padding:'14px 28px', borderRadius:10, fontFamily:"'DM Sans', sans-serif", fontSize:'0.95rem', fontWeight:500, cursor:'pointer', textDecoration:'none', display:'inlineflex', alignItems:'center', gap:8, transition:'all .2s' },
    btnGhost: { background:'transparent', color:'#f0f2ff', border:'1px solid rgba(255,255,255,0.15)', padding:'14px 28px', borderRadius:10, fontSize:'0.95rem', cursor:'pointer', transition:'all .2s' },
    divider: { border:'none', borderTop:'1px solid rgba(255,255,255,0.08)', margin:0 },
  };

  const features = [
    ['🧬','rgba(108,99,255,0.15)','Verified Skill DNA','A visual genome of how a candidate codes — speed, accuracy, problem-solving style, code quality — all in a scannable badge.'],
    ['🏟️','rgba(0,212,170,0.15)','Live Coding Arenas','Head-to-head timed challenges with recruiter spectator mode, live keystroke metrics, and full session replays.'],
    ['📋','rgba(255,107,157,0.15)','Recruiter Verdict Cards','Structured micro-reviews with tagged verdicts like "Ships Fast" — not meaningless star ratings.'],
    ['📈','rgba(255,167,38,0.15)','Growth Velocity Score','30-day momentum graphs showing who\'s accelerating. Filter by velocity, not just total XP.'],
    ['🔗','rgba(41,182,246,0.15)','Verified Portfolio Export','Cryptographically signed PDF portfolios with QR codes linking to live simulation replays.'],
    ['💬','rgba(0,212,170,0.15)','Communication Hub','Real-time messaging, feedback loops, and interview scheduling — all in one place.'],
    ['🚀','rgba(255,107,157,0.15)','Career Pathway Engine','AI-powered career road maps based on real simulation data.'],
    ['🌐','rgba(108,99,255,0.15)','Social Career Profile','Public profiles showcasing verified achievements — shareable on LinkedIn with one click.'],
    ['🏆','rgba(255,167,38,0.15)','Global Leaderboard','Real-time rankings filterable by skill, velocity, domain, and location.'],
  ];

  const verdictTags = [
    {label:'Ships Fast',cls:'green'},{label:'Clean Architecture',cls:'blue'},{label:'Reads Docs',cls:'purple'},
    {label:'Self-Directed',cls:'green'},{label:'Debugs Methodically',cls:'blue'},{label:'Needs Mentoring',cls:'orange'},
    {label:'Strong Communication',cls:'purple'},{label:'Test-Driven',cls:'green'},
  ];

  const tagColors = {
    green:'rgba(0,212,170,0.1)',blue:'rgba(41,182,246,0.1)',purple:'rgba(108,99,255,0.1)',
    orange:'rgba(255,167,38,0.1)',pink:'rgba(255,107,157,0.1)',
  };
  const tagText = {
    green:'#00d4aa',blue:'#29b6f6',purple:'#a5a0ff',orange:'#ffa726',pink:'#ff6b9d',
  };

  const sparkData1 = [400,420,380,500,620,700,850,920,1100,1350,1600,1900,2100,2400];
  const sparkData2 = [1200,1180,1220,1190,1230,1210,1250,1230,1270,1240,1260,1280,1270,1300];

  const faqs = [
    ['How are simulations different from LeetCode?','SimWork simulations are built on real work scenarios — not algorithmic puzzles. You\'ll implement actual features, debug production code, and architect systems under realistic time pressure.'],
    ['How is the Skill DNA generated?','Every simulation captures dozens of signals: time-to-first-solution, test pass rate, refactoring frequency, documentation habits, error patterns — distilled into 4 core dimensions.'],
    ['Can candidates game the system?','Simulations are unique and randomly parameterized. Live keystroke analysis, copy-paste detection, and behavioral fingerprinting make cheating obvious in replays.'],
    ['How does portfolio verification work?','SimWork signs each PDF with a SHA-256 hash anchored to session IDs. Any recruiter can scan the QR code at simwork.io/verify to confirm authenticity.'],
    ['What ATS tools do you integrate with?','Greenhouse, Lever, Workday, and Ashby natively. Plus Zapier, a public REST API, and a Slack app for arena alerts.'],
    ['Is my code private?','Yes. Code is encrypted at rest. Public profiles show scores and verdicts — never raw code — unless you choose to publish a replay.'],
  ];

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        .fade-in { opacity:0; transform:translateY(20px); transition:opacity .6s ease,transform .6s ease; }
        .fade-in.visible { opacity:1; transform:translateY(0); }
        .mkt-card:hover { border-color:rgba(255,255,255,0.15)!important; transform:translateY(-4px); }
        .mkt-nav-link:hover { color:#f0f2ff!important; background:rgba(255,255,255,0.05)!important; }
        .mkt-btn:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(108,99,255,0.4); }
        .mkt-btn-ghost:hover { border-color:#6c63ff!important; color:#6c63ff!important; transform:translateY(-2px); }
        .dna-node-hover:hover { transform:scaleY(1.3); }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .hero-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .gradient-text { background:linear-gradient(135deg,#6c63ff,#00d4aa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        @media(max-width:768px){
          .mkt-nav-links{display:none!important}
          .mkt-pricing-grid{grid-template-columns:1fr!important}
          .mkt-comm-grid{grid-template-columns:1fr!important}
          .mkt-vel-grid{grid-template-columns:1fr!important}
          .mkt-arena-split{grid-template-columns:1fr!important}
          .mkt-footer-grid{grid-template-columns:1fr 1fr!important}
          .mkt-features-grid{grid-template-columns:1fr!important}
          .mkt-hero-stats{gap:1.5rem!important}
          .mkt-section{padding:60px 1rem!important}
          .mkt-dna-grid{grid-template-columns:1fr!important}
          .mkt-portfolio-row{flex-direction:column!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.logo} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
          Sim<span style={{color:'#6c63ff'}}>Work</span>
        </div>
        <div className="mkt-nav-links" style={{display:'flex',alignItems:'center',gap:4}}>
          {[['#features','Features'],['#dna','Skill DNA'],['#arena','Arenas'],['#verdicts','Verdicts'],['#portfolio','Portfolio'],['#career','Career'],['#leaderboard','Leaderboard'],['#pricing','Pricing']].map(([href,label])=>(
            <a key={href} href={href} className="mkt-nav-link" style={s.navLink}>{label}</a>
          ))}
          <button onClick={()=>navigate('/auth')} className="mkt-btn" style={{...s.btn,padding:'7px 16px',fontSize:'0.875rem',marginLeft:8}}>Get Started</button>
        </div>
        <button onClick={()=>navigate('/auth')} className="mkt-btn" style={{...s.btn,padding:'7px 16px',fontSize:'0.875rem',display:'none'}} id="mkt-mob-cta">Get Started</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',paddingTop:120,position:'relative',padding:'120px 2rem 100px'}}>
        <div className="hero-orb" style={{width:500,height:500,background:'rgba(108,99,255,0.2)',top:'10%',left:'10%'}}/>
        <div className="hero-orb" style={{width:400,height:400,background:'rgba(0,212,170,0.15)',top:'30%',right:'5%'}}/>
        <div className="hero-orb" style={{width:300,height:300,background:'rgba(255,107,157,0.1)',bottom:'20%',left:'30%'}}/>

        <div style={{display:'inlineflex',alignItems:'center',gap:8,background:'rgba(108,99,255,0.15)',border:'1px solid rgba(108,99,255,0.3)',borderRadius:100,padding:'6px 16px',fontSize:'0.8rem',color:'#a5a0ff',marginBottom:'2rem',animation:'fadeUp .8s ease both',letterSpacing:.5}}>
          <span style={{width:6,height:6,background:'#6c63ff',borderRadius:'50%',display:'inlineblock',animation:'pulse 2s infinite'}}/>
          Now in Open Beta · 12,400 candidates hired
        </div>

        <h1 style={{fontFamily:"'Syne', sans-serif",fontSize:'clamp(2.8rem,7vw,6rem)',fontWeight:800,lineHeight:1.05,letterSpacing:-2,marginBottom:'1.5rem',animation:'fadeUp .8s .1s ease both'}}>
          Hire for how people<br/><span className="gradient-text">actually work.</span>
        </h1>
        <p style={{fontSize:'1.15rem',color:'#8891b0',maxWidth:620,margin:'0 auto 2.5rem',animation:'fadeUp .8s .2s ease both',fontWeight:300,lineHeight:1.8}}>
          SimWork replaces résumés with real simulations. Candidates prove their skills. Recruiters see verified data. No more guessing.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',animation:'fadeUp .8s .3s ease both',marginBottom:'4rem'}}>
          <button onClick={()=>navigate('/auth')} className="mkt-btn" style={s.btn}>▶ Try a Simulation</button>
          <a href="#features" className="mkt-btn-ghost" style={s.btnGhost}>Explore Features →</a>
        </div>

        <div className="mkt-hero-stats" style={{display:'flex',gap:'3rem',justifyContent:'center',flexWrap:'wrap',animation:'fadeUp .8s .4s ease both'}}>
          {[['94%','Hire accuracy rate'],['3.2×','Faster screening'],['840K+','Simulations run'],['98%','Candidate satisfaction']].map(([num,label])=>(
            <div key={label} style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Syne', sans-serif",fontSize:'2.2rem',fontWeight:800}}>{num}</div>
              <div style={{fontSize:'0.8rem',color:'#8891b0',textTransform:'uppercase',letterSpacing:1,marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── FEATURES ── */}
      <section id="features" className="mkt-section" style={s.section}>
        <span style={s.label}>Everything you need</span>
        <h2 style={s.h2}>Built for the way <span className="gradient-text">great hiring works</span></h2>
        <p style={s.sub}>From skill verification to career tracking — SimWork is the complete platform for evidence-based hiring.</p>
        <div className="mkt-features-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginTop:'3rem'}}>
          {features.map(([icon,bg,title,desc])=>(
            <div key={title} className="mkt-card fade-in" style={{...s.card,cursor:'default'}}>
              <div style={{width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',marginBottom:'1.2rem',background:bg}}>{icon}</div>
              <h3 style={{fontFamily:"'Syne', sans-serif",fontSize:'1.15rem',fontWeight:700,marginBottom:'0.75rem',letterSpacing:-0.3}}>{title}</h3>
              <p style={{color:'#8891b0',fontSize:'0.9rem',lineHeight:1.7,fontWeight:300}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── SKILL DNA ── */}
      <section id="dna" className="mkt-section" style={s.section}>
        <span style={s.label}>Feature 01 — Skill DNA</span>
        <h2 style={s.h2}>Your coding genome, <span className="gradient-text">visualized</span></h2>
        <p style={s.sub}>Every simulation generates a unique node in your skill genome strip. Color encodes score. Shape encodes speed.</p>
        <div className="mkt-dna-grid" style={{marginTop:'3rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',alignItems:'start'}}>
          <div className="fade-in" style={{background:'#0d1120',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'2rem',maxWidth:700}}>
            <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#6c63ff,#00d4aa)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontFamily:"'Syne',sans-serif",fontSize:'1.1rem'}}>AK</div>
              <div>
                <div style={{fontWeight:600,fontSize:'0.95rem'}}>Arjun Kumar</div>
                <div style={{fontSize:'0.78rem',color:'#8891b0'}}>Full Stack · 14 simulations</div>
              </div>
              <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,background:'rgba(0,212,170,0.1)',border:'1px solid rgba(0,212,170,0.2)',borderRadius:100,padding:'4px 12px',fontSize:'0.75rem',color:'#00d4aa'}}>
                <span style={{width:6,height:6,background:'#00d4aa',borderRadius:'50%',animation:'pulse 2s infinite',display:'inlineblock'}}/>
                Verified
              </div>
            </div>
            <DNAStrip/>
            <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap',marginTop:'1rem'}}>
              {[['#6c63ff','Problem Solving'],['#00d4aa','Code Quality'],['#ffa726','Speed'],['#ff6b9d','Accuracy']].map(([c,l])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.8rem',color:'#8891b0'}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                  {l}
                </div>
              ))}
            </div>
            <div style={{marginTop:'1.5rem',display:'flex',gap:12}}>
              <button className="mkt-btn" style={{...s.btn,padding:'10px 20px',fontSize:'0.875rem'}}>Export as Badge</button>
              <button className="mkt-btn-ghost" style={{...s.btnGhost,padding:'10px 20px',fontSize:'0.875rem'}}>Share Profile</button>
            </div>
          </div>
          <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
            {[
              {label:'Problem Solving',val:88,color:'#6c63ff'},
              {label:'Code Quality',val:92,color:'#00d4aa'},
              {label:'Speed',val:74,color:'#ffa726'},
              {label:'Accuracy',val:96,color:'#ff6b9d'},
            ].map(({label,val,color})=>(
              <div key={label}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem',marginBottom:6}}>
                  <span style={{color:'#8891b0'}}>{label}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",color}}>{val}/100</span>
                </div>
                <div style={{height:6,background:'#141826',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${val}%`,background:color,borderRadius:3,transition:'width 1s ease'}}/>
                </div>
              </div>
            ))}
            <div style={{background:'#0d1120',border:'1px solid rgba(108,99,255,0.2)',borderRadius:12,padding:'1rem',marginTop:'0.5rem'}}>
              <div style={{fontSize:'0.75rem',color:'#6c63ff',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Verification Hash</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.7rem',color:'#8891b0',wordBreak:'break-all'}}>sha256:a3f9c2e1b4d8f0...7c3a9e2b1d5f8</div>
            </div>
          </div>
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── LIVE ARENAS ── */}
      <section id="arena" className="mkt-section" style={s.section}>
        <span style={s.label}>Feature 02 — Live Arenas</span>
        <h2 style={s.h2}>Head-to-head. <span className="gradient-text">Live. Verified.</span></h2>
        <p style={s.sub}>Recruiters post a challenge. Candidates compete in real-time. Spectator mode. Full replays. No scripts, no prep.</p>
        <div className="fade-in" style={{background:'#0d1120',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,overflow:'hidden',marginTop:'3rem'}}>
          <div style={{background:'#141826',borderBottom:'1px solid rgba(255,255,255,0.08)',padding:'1rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.85rem',color:'#00d4aa'}}>arena/challenge-042 · REST API Sprint</span>
            <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,107,107,0.15)',border:'1px solid rgba(255,107,107,0.3)',borderRadius:100,padding:'3px 10px',fontSize:'0.75rem',color:'#ff6b6b'}}>
              <span style={{width:6,height:6,background:'#ff6b6b',borderRadius:'50%',animation:'pulse 1s infinite',display:'inlineblock'}}/>LIVE
            </div>
          </div>
          <div className="mkt-arena-split" style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
            {[
              {name:'Priya S.', color:'#6c63ff', initials:'PS', kpm:68, tests:'4/5', code:`<span style="color:#c792ea">const</span> <span style="color:#82aaff">createUser</span> = <span style="color:#c792ea">async</span> (data) => {\n  <span style="color:#c792ea">const</span> user = <span style="color:#c792ea">await</span> User.<span style="color:#82aaff">create</span>({\n    ...data,\n    id: <span style="color:#82aaff">uuid</span>(),\n    createdAt: <span style="color:#c792ea">new</span> <span style="color:#82aaff">Date</span>()\n  });\n  <span style="color:#c792ea">return</span> { status: <span style="color:#c3e88d">200</span>, user };\n};`},
              {name:'Rahul M.', color:'#00d4aa', initials:'RM', kpm:55, tests:'3/5', code:`<span style="color:#c792ea">async function</span> <span style="color:#82aaff">createUser</span>(data) {\n  <span style="color:#546e7a">// TODO: add validation</span>\n  <span style="color:#c792ea">const</span> result = <span style="color:#c792ea">await</span> db\n    .<span style="color:#82aaff">collection</span>(<span style="color:#c3e88d">'users'</span>)\n    .<span style="color:#82aaff">insertOne</span>(data);\n  <span style="color:#c792ea">return</span> result;\n}`},
            ].map((p,i)=>(
              <div key={p.name} style={{padding:'1.5rem',borderRight:i===0?'1px solid rgba(255,255,255,0.08)':'none'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:p.color+'33',color:p.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:600}}>{p.initials}</div>
                  <div style={{fontWeight:500,fontSize:'0.9rem'}}>{p.name}</div>
                  <div style={{marginLeft:'auto',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem',color:p.color}}>{p.tests} tests</div>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.72rem',color:'#8891b0',lineHeight:1.8,background:'#050810',borderRadius:8,padding:'1rem'}} dangerouslySetInnerHTML={{__html:p.code}}/>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'1rem',padding:'1rem 1.5rem',background:'#141826',borderTop:'1px solid rgba(255,255,255,0.08)',flexWrap:'wrap'}}>
            {[['⏱','Time Left','18:42'],['⌨️','Priya KPM','68'],['⌨️','Rahul KPM','55'],['✅','Tests Passing','7/10'],['👁','Spectators','3 recruiters']].map(([ico,label,val])=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.8rem',color:'#8891b0'}}>
                {ico} {label}: <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.85rem',color:'#00d4aa'}}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── VERDICT CARDS ── */}
      <section id="verdicts" className="mkt-section" style={s.section}>
        <span style={s.label}>Feature 03 — Verdict Cards</span>
        <h2 style={s.h2}>Structured feedback. <span className="gradient-text">Not star ratings.</span></h2>
        <p style={s.sub}>Recruiters leave tagged verdicts grounded in real simulation data — visible on the candidate's public profile.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',marginTop:'3rem'}}>
          {[
            {initials:'SR',name:'Sneha Rastogi',company:'Flipkart Engineering',color:'#00d4aa',sim:'Software Dev · Beginner',tags:['Ships Fast','Clean Architecture','Test-Driven']},
            {initials:'AM',name:'Arjun Mehta',company:'Razorpay Platform',color:'#6c63ff',sim:'Data Science · Intermediate',tags:['Strong Communication','Reads Docs','Self-Directed']},
            {initials:'NK',name:'Neha Kulkarni',company:'Zepto Backend',color:'#ff6b9d',sim:'AI Engineer · Beginner',tags:['Debugs Methodically','Ships Fast','Needs Mentoring']},
          ].map(v=>(
            <div key={v.name} className="mkt-card fade-in" style={s.card}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:v.color+'22',color:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.85rem'}}>{v.initials}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:'0.9rem'}}>{v.name}</div>
                  <div style={{fontSize:'0.78rem',color:'#8891b0'}}>{v.company}</div>
                </div>
              </div>
              <div style={{flexWrap:'wrap',gap:6,display:'flex',marginTop:'1rem'}}>
                {v.tags.map(t=>{
                  const colors=['green','blue','purple','orange','pink'];
                  const cls=colors[v.tags.indexOf(t)%colors.length];
                  return <span key={t} style={{padding:'5px 12px',borderRadius:100,fontSize:'0.78rem',fontWeight:500,background:tagColors[cls],color:tagText[cls],border:`1px solid ${tagText[cls]}33`}}>{t}</span>;
                })}
              </div>
              <div style={{marginTop:'0.75rem',fontSize:'0.78rem',color:'#8891b0',fontFamily:"'JetBrains Mono',monospace"}}>via {v.sim}</div>
            </div>
          ))}
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── GROWTH VELOCITY ── */}
      <section id="velocity" className="mkt-section" style={s.section}>
        <span style={s.label}>Feature 04 — Growth Velocity</span>
        <h2 style={s.h2}>30-day momentum, <span className="gradient-text">at a glance</span></h2>
        <p style={s.sub}>A candidate who went from 400 → 2400 XP in 3 weeks is more interesting than one sitting at 2500 with no recent activity.</p>
        <div className="fade-in" style={{background:'#0d1120',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'2rem',maxWidth:800,marginTop:'3rem'}}>
          <div className="mkt-vel-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
            {[
              {name:'Priya S.',xp:'2,400',label:'🚀 Accelerating',cls:'accel',data:sparkData1,color:'#00d4aa'},
              {name:'Rohit K.',xp:'1,270',label:'→ Steady',cls:'steady',data:sparkData2,color:'#29b6f6'},
              {name:'Aman T.',xp:'890',label:'⚠️ Stalled',cls:'stalled',data:[800,810,805,820,815,818,825,820,830,825,835,830,840,835],color:'#ffa726'},
            ].map(p=>(
              <div key={p.name} style={{background:'#141826',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'1.25rem'}}>
                <div style={{fontSize:'0.85rem',fontWeight:500,marginBottom:4}}>{p.name}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.4rem',fontWeight:800,color:p.color,marginBottom:8}}>{p.xp} XP</div>
                <Sparkline data={p.data} color={p.color}/>
                <div style={{marginTop:8,display:'inlineflex',alignItems:'center',gap:6,padding:'4px 12px',borderRadius:100,fontSize:'0.78rem',fontWeight:500,background:p.color+'22',color:p.color,border:`1px solid ${p.color}33`}}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── PORTFOLIO EXPORT ── */}
      <section id="portfolio" className="mkt-section" style={s.section}>
        <span style={s.label}>Feature 05 — Verified Portfolio</span>
        <h2 style={s.h2}>Cryptographically signed. <span className="gradient-text">Instantly verifiable.</span></h2>
        <p style={s.sub}>One click generates a signed PDF with QR codes linking to live replays. Recruiters verify authenticity without an account.</p>
        <div className="mkt-portfolio-row fade-in" style={{display:'flex',gap:'3rem',alignItems:'flex-start',marginTop:'3rem',flexWrap:'wrap'}}>
          <div style={{background:'#fff',color:'#1a1a2e',borderRadius:16,padding:'2rem',maxWidth:440,position:'relative',overflow:'hidden',flexShrink:0}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'linear-gradient(90deg,#6c63ff,#00d4aa,#ff6b9d)'}}/>
            <div style={{position:'absolute',bottom:-20,right:-20,fontFamily:"'Syne',sans-serif",fontSize:'8rem',fontWeight:800,color:'rgba(108,99,255,0.05)',pointerEvents:'none'}}>SW</div>
            <div style={{display:'flex',gap:'1.5rem',alignItems:'flexStart',marginBottom:'1.5rem'}}>
              <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#6c63ff,#00d4aa)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontSize:'1.5rem',fontWeight:800,color:'#fff',flexShrink:0}}>VG</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.2rem',fontWeight:800,color:'#1a1a2e'}}>Vishvajit Gadakari</div>
                <div style={{fontSize:'0.85rem',color:'#6b7280',marginTop:2}}>Software Developer · Pune</div>
                <div style={{marginTop:8,display:'inlineflex',alignItems:'center',gap:6,background:'#f0fdf4',border:'1px solid #86efac',borderRadius:6,padding:'3px 10px',fontSize:'0.72rem',color:'#16a34a',fontWeight:600}}>✓ SimWork Verified</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:'1.5rem'}}>
              {[['92','Avg Score'],['1,800','Total XP'],['3','Certs']].map(([n,l])=>(
                <div key={l} style={{background:'#f8fafc',borderRadius:10,padding:12,textAlign:'center',border:'1px solid #e2e8f0'}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.5rem',fontWeight:800,color:'#1a1a2e'}}>{n}</div>
                  <div style={{fontSize:'0.7rem',color:'#6b7280',textTransform:'uppercase',letterSpacing:.5,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.72rem',color:'#9ca3af',fontFamily:"'JetBrains Mono',monospace",wordBreak:'break-all'}}>sha256:a3f9c2e1b4d8...7c3a9e2b1</div>
              </div>
              <div style={{width:80,height:80,background:'#1a1a2e',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg viewBox="0 0 40 40" width={60} height={60}>
                  {Array.from({length:16}).map((_,i)=>(
                    <rect key={i} x={(i%4)*10+1} y={Math.floor(i/4)*10+1} width={8} height={8} fill={Math.random()>.5?'#fff':'none'} rx={1}/>
                  ))}
                </svg>
              </div>
            </div>
          </div>
          <div style={{flex:1,minWidth:260}}>
            {[['🔐','Cryptographic signing','Each PDF is signed with a SHA-256 hash anchored to the simulation session IDs.'],['📱','QR verification','Any recruiter scans the QR to verify authenticity on simwork.io/verify — no account needed.'],['🎬','Live replay links','Top 3 simulation attempts are linked directly from the portfolio for live review.'],['📊','Full skill breakdown','Scores, time-taken, validation pass rate, and code quality metrics — all included.']].map(([ico,title,desc])=>(
              <div key={title} style={{display:'flex',gap:'1rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:'1.5rem',flexShrink:0}}>{ico}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:'0.95rem',marginBottom:4}}>{title}</div>
                  <div style={{fontSize:'0.875rem',color:'#8891b0',lineHeight:1.6}}>{desc}</div>
                </div>
              </div>
            ))}
            <button className="mkt-btn" style={{...s.btn,marginTop:'0.5rem'}}>Generate Your Portfolio →</button>
          </div>
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── COMMUNICATION ── */}
      <section id="communication" className="mkt-section" style={s.section}>
        <span style={s.label}>Communication Hub</span>
        <h2 style={s.h2}>Recruiter ↔ Candidate. <span className="gradient-text">In context.</span></h2>
        <p style={s.sub}>Real-time messaging tied to simulation sessions. Schedule interviews, leave comments on replays, send structured feedback.</p>
        <div className="mkt-comm-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginTop:'3rem'}}>
          <div className="fade-in" style={{background:'#0d1120',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden'}}>
            <div style={{background:'#141826',padding:'1rem 1.5rem',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:10,fontSize:'0.9rem',fontWeight:500}}>
              <span style={{width:8,height:8,background:'#00d4aa',borderRadius:'50%',flexShrink:0}}/>Priya Sharma · Flipkart HR
            </div>
            <div style={{padding:'1rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {[
                {own:false,msg:"Hi Vishvajit! I reviewed your REST API simulation — impressive CRUD implementation. Are you open to a conversation this week?"},
                {own:true,msg:"Hi Priya! Absolutely, thank you for reviewing. Happy to connect anytime Thursday or Friday."},
                {own:false,msg:"Perfect! I'll send a calendar invite for Friday 3pm. Can you also share your portfolio PDF?"},
              ].map((m,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-end',flexDirection:m.own?'row-reverse':'row'}}>
                  <div style={{maxWidth:'80%',padding:'10px 14px',borderRadius:12,fontSize:'0.85rem',lineHeight:1.5,background:m.own?'#6c63ff':'#141826',borderBottomRightRadius:m.own?4:12,borderBottomLeftRadius:m.own?12:4}}>{m.msg}</div>
                </div>
              ))}
            </div>
            <div style={{padding:'0.75rem 1rem',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',gap:8}}>
              <input placeholder="Type a message..." style={{flex:1,background:'#050810',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 12px',color:'#f0f2ff',fontFamily:"'DM Sans',sans-serif",fontSize:'0.85rem',outline:'none'}}/>
              <button style={{background:'#6c63ff',border:'none',borderRadius:8,width:36,height:36,cursor:'pointer',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>→</button>
            </div>
          </div>
          <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={{background:'#0d1120',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'1.5rem'}}>
              <div style={{fontWeight:600,marginBottom:'1rem',fontSize:'0.9rem'}}>🔔 Recent Notifications</div>
              {[
                {icon:'💬',title:'New message from Flipkart HR',body:'Hi Vishvajit! I reviewed your REST API...'},
                {icon:'🏆',title:'Verdict posted on your profile',body:'Ships Fast · Clean Architecture via Software Dev Sim'},
                {icon:'📄',title:'Portfolio verified by 2 recruiters',body:'sha256:a3f9c2... · Zepto, Razorpay'},
                {icon:'🎯',title:'New arena challenge available',body:'Backend Sprint · ₹5,000 prize · 2hr window'},
              ].map((n,i)=>(
                <div key={i} style={{display:'flex',gap:12,padding:'0.75rem 0',borderBottom:i<3?'1px solid rgba(255,255,255,0.08)':'none',alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.1rem',flexShrink:0}}>{n.icon}</span>
                  <div>
                    <div style={{fontSize:'0.85rem',fontWeight:500}}>{n.title}</div>
                    <div style={{fontSize:'0.78rem',color:'#8891b0',marginTop:2}}>{n.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:'#0d1120',border:'1px solid rgba(108,99,255,0.2)',borderRadius:16,padding:'1.5rem'}}>
              <div style={{fontWeight:600,marginBottom:'0.75rem',fontSize:'0.9rem'}}>📅 Upcoming Interview</div>
              <div style={{fontSize:'0.85rem',color:'#8891b0',marginBottom:'0.5rem'}}>Friday, 3:00 PM IST</div>
              <div style={{fontSize:'0.875rem',fontWeight:500,marginBottom:'1rem'}}>Flipkart · Technical Round 1</div>
              <div style={{display:'flex',gap:8}}>
                <button className="mkt-btn" style={{...s.btn,padding:'8px 16px',fontSize:'0.8rem'}}>Join Call</button>
                <button className="mkt-btn-ghost" style={{...s.btnGhost,padding:'8px 16px',fontSize:'0.8rem'}}>Reschedule</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── CAREER & SOCIAL ── */}
      <section id="career" className="mkt-section" style={s.section}>
        <span style={s.label}>Career Pathway Engine</span>
        <h2 style={s.h2}>Know your next move <span className="gradient-text">before your next interview.</span></h2>
        <p style={s.sub}>AI-powered career pathways, skill gap analysis, and social proof — all generated from real simulation performance.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'1.5rem',marginTop:'3rem'}}>
          {[
            {emoji:'🧭',title:'Skill Gap Analysis',color:'#6c63ff',items:['REST APIs ✓ Mastered','JWT Auth → Next up','Microservices → 2 levels away','System Design → Advanced path']},
            {emoji:'🎓',title:'Learning Milestones',color:'#00d4aa',items:['Beginner Badge ✓','Intermediate unlocked 🔓','Hard mode: 4 tasks left','Expert track: on track']},
            {emoji:'🌐',title:'Social Career Profile',color:'#ff6b9d',items:['LinkedIn export ready','GitHub metrics linked','1-click portfolio share','Recruiter-visible by default']},
            {emoji:'🏢',title:'Company Matches',color:'#ffa726',items:['Flipkart — 94% match','Razorpay — 88% match','Zepto — 85% match','PhonePe — 82% match']},
          ].map(p=>(
            <div key={p.title} className="mkt-card fade-in" style={{...s.card,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:p.color}}/>
              <div style={{fontSize:'1.5rem',marginBottom:'0.75rem'}}>{p.emoji}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'1rem'}}>{p.title}</div>
              {p.items.map(item=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:8,padding:'0.5rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.85rem',color:'#8891b0'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:p.color,flexShrink:0}}/>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── LEADERBOARD ── */}
      <section id="leaderboard" className="mkt-section" style={s.section}>
        <span style={s.label}>Global Leaderboard</span>
        <h2 style={s.h2}>The world's most <span className="gradient-text">honest ranking.</span></h2>
        <p style={s.sub}>Filter by velocity, domain, skill level, and location. Celebrate merit. Discover talent recruiters would otherwise miss.</p>
        <div className="fade-in" style={{background:'#0d1120',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden',marginTop:'3rem',maxWidth:700}}>
          {[
            {rank:'#1',gold:true,initials:'PS',color:'#6c63ff',name:'Priya Sharma',meta:'Full Stack · Pune',xp:'2,840',vel:'🚀'},
            {rank:'#2',silver:true,initials:'AM',color:'#00d4aa',name:'Arjun Mehta',meta:'Data Science · Bangalore',xp:'2,710',vel:'🚀'},
            {rank:'#3',bronze:true,initials:'NV',color:'#ffa726',name:'Neha Verma',meta:'AI Engineer · Mumbai',xp:'2,590',vel:'→'},
            {rank:'#4',initials:'RK',color:'#f87171',name:'Rohit Kumar',meta:'Finance · Delhi',xp:'2,450',vel:'→'},
            {rank:'#5',highlight:true,initials:'VG',color:'#6c63ff',name:'Vishvajit Gadakari (you)',meta:'Software Dev · Pune',xp:'1,800',vel:'🚀'},
          ].map((r,i)=>(
            <div key={r.name} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.5rem',borderBottom:i<4?'1px solid rgba(255,255,255,0.08)':'none',background:r.highlight?'rgba(108,99,255,0.06)':'transparent',transition:'background .2s'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.2rem',fontWeight:800,minWidth:36,color:r.gold?'#ffa726':r.silver?'#b0bec5':r.bronze?'#8d6e63':'#8891b0'}}>{r.rank}</div>
              <div style={{width:36,height:36,borderRadius:'50%',background:r.color+'22',color:r.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,flexShrink:0}}>{r.initials}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:'0.95rem'}}>{r.name}</div>
                <div style={{fontSize:'0.78rem',color:'#8891b0',marginTop:1}}>{r.meta}</div>
              </div>
              <div style={{fontSize:'1rem',marginRight:8}}>{r.vel}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.1rem',fontWeight:700,color:'#6c63ff'}}>{r.xp} XP</div>
            </div>
          ))}
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── PRICING ── */}
      <section id="pricing" className="mkt-section" style={s.section}>
        <span style={s.label}>Pricing</span>
        <h2 style={s.h2}>Simple, <span className="gradient-text">transparent pricing.</span></h2>
        <p style={s.sub}>Free for candidates. Recruiters get a 14-day trial — no credit card required.</p>
        <div className="mkt-pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginTop:'3rem'}}>
          {[
            {tier:'Candidate',price:'Free',period:'forever · no credit card',accent:'#8891b0',features:['Unlimited simulations','Skill DNA profile','Growth velocity tracking','Basic portfolio export','Global leaderboard access'],cta:'Create Free Profile',ctaStyle:'ghost'},
            {tier:'Recruiter Pro',price:'$49',period:'per month · per seat',accent:'#6c63ff',featured:true,features:['Unlimited candidate screening','Live arena spectator access','Verdict card authoring','Velocity filter & leaderboard','Portfolio verification API','Slack & ATS integrations'],cta:'Start Free Trial',ctaStyle:'primary'},
            {tier:'Enterprise',price:'Custom',period:'volume pricing · SLA included',accent:'#8891b0',features:['Everything in Recruiter Pro','Private arena hosting','Custom simulation builder','SSO & SAML','Dedicated CS manager','White-label option'],cta:'Contact Sales →',ctaStyle:'ghost'},
          ].map(p=>(
            <div key={p.tier} style={{...s.card,position:'relative',background:p.featured?'linear-gradient(135deg,rgba(108,99,255,0.1),#0d1120)':'#0d1120',border:p.featured?'1px solid #6c63ff':'1px solid rgba(255,255,255,0.08)'}}>
              {p.featured && <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#6c63ff',color:'#fff',fontSize:'0.75rem',fontWeight:600,padding:'4px 14px',borderRadius:100,whiteSpace:'nowrap'}}>Most Popular</div>}
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1rem',fontWeight:700,color:p.accent}}>{p.tier}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'3rem',fontWeight:800,letterSpacing:-2,lineHeight:1,margin:'1rem 0 0.25rem'}}>{p.price}</div>
              <div style={{fontSize:'0.85rem',color:'#8891b0',marginBottom:'1.5rem'}}>{p.period}</div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'0.75rem',marginBottom:'2rem'}}>
                {p.features.map(f=>(
                  <li key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.9rem',color:'#8891b0'}}>
                    <span style={{width:18,height:18,borderRadius:'50%',background:'rgba(0,212,170,0.15)',border:'1px solid rgba(0,212,170,0.3)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.6rem',color:'#00d4aa'}}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {p.ctaStyle==='primary'
                ? <button onClick={()=>navigate('/auth')} className="mkt-btn" style={{...s.btn,width:'100%',justifyContent:'center'}}>{p.cta}</button>
                : <button className="mkt-btn-ghost" style={{...s.btnGhost,width:'100%',justifyContent:'center',display:'flex'}}>{p.cta}</button>
              }
            </div>
          ))}
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── FAQ ── */}
      <section id="faq" className="mkt-section" style={s.section}>
        <span style={s.label}>FAQ</span>
        <h2 style={s.h2}>Common <span className="gradient-text">questions</span></h2>
        <div style={{maxWidth:700,marginTop:'3rem'}}>
          {faqs.map(([q,a])=><FAQItem key={q} q={q} a={a}/>)}
        </div>
      </section>

      <hr style={s.divider}/>

      {/* ── CTA ── */}
      <section style={{textAlign:'center',maxWidth:700,margin:'0 auto',padding:'100px 2rem',position:'relative'}}>
        <div className="hero-orb" style={{width:400,height:400,background:'rgba(108,99,255,0.15)',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
        <span style={s.label}>Ready?</span>
        <h2 style={{...s.h2,fontSize:'clamp(2rem,4vw,3.5rem)'}}>Stop guessing. Start <span className="gradient-text">knowing.</span></h2>
        <p style={{...s.sub,margin:'1rem auto 2.5rem'}}>Join 12,400 engineers who got hired on merit — and the recruiters who found them.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>navigate('/auth')} className="mkt-btn" style={{...s.btn,fontSize:'1rem',padding:'16px 32px'}}>Create Free Profile</button>
          <button className="mkt-btn-ghost" style={{...s.btnGhost,fontSize:'1rem',padding:'16px 32px'}}>Post a Challenge →</button>
        </div>
        <div style={{marginTop:'2rem',fontSize:'0.82rem',color:'#8891b0'}}>No credit card · No résumé required · Cancel anytime</div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.08)',padding:'4rem 2rem 2rem',maxWidth:1200,margin:'0 auto'}}>
        <div className="mkt-footer-grid" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'3rem'}}>
          <div>
            <div style={{...s.logo,marginBottom:'0.5rem',display:'flex'}}>Sim<span style={{color:'#6c63ff'}}>Work</span></div>
            <p style={{color:'#8891b0',fontSize:'0.875rem',lineHeight:1.7,fontWeight:300,margin:'1rem 0',maxWidth:280}}>The hiring platform that replaces résumés with real simulations. Verified skills. Honest data. Better hires.</p>
            <div style={{display:'flex',gap:12}}>
              {[['𝕏','https://twitter.com'],['in','https://linkedin.com'],['GH','https://github.com'],['D','https://discord.gg'],['▶','https://youtube.com']].map(([icon,href])=>(
                <a key={icon} href={href} target="_blank" rel="noreferrer" style={{width:36,height:36,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',textDecoration:'none',color:'#8891b0',transition:'all .2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#6c63ff';e.currentTarget.style.color='#6c63ff';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='#8891b0';}}
                >{icon}</a>
              ))}
            </div>
          </div>
          {[
            ['Product',[['#dna','Skill DNA'],['#arena','Live Arenas'],['#verdicts','Verdict Cards'],['#velocity','Velocity Score'],['#portfolio','Portfolio Export'],['#leaderboard','Leaderboard']]],
            ['Platform',[['#communication','Communication'],['#career','Career Paths'],['#','Integrations'],['#','API Docs'],['#','Verify Portfolio']]],
            ['Company',[['#','About Us'],['#','Blog'],['#','Careers'],['#','Press Kit'],['#','Status']]],
            ['Support',[['#faq','FAQ'],['#','Help Center'],['#','Community'],['#','Contact Us'],['#','Privacy Policy'],['#','Terms']]],
          ].map(([heading,links])=>(
            <div key={heading}>
              <h4 style={{fontFamily:"'Syne',sans-serif",fontSize:'0.85rem',fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:'1rem',color:'#f0f2ff'}}>{heading}</h4>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                {links.map(([href,label])=>(
                  <li key={label}><a href={href} style={{color:'#8891b0',textDecoration:'none',fontSize:'0.875rem',transition:'color .2s'}}
                    onMouseEnter={e=>e.target.style.color='#f0f2ff'}
                    onMouseLeave={e=>e.target.style.color='#8891b0'}
                  >{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'2rem',borderTop:'1px solid rgba(255,255,255,0.08)',fontSize:'0.8rem',color:'#8891b0',flexWrap:'wrap',gap:12}}>
          <span>© 2026 SimWork Inc. All rights reserved.</span>
          <span>Built for engineers who prove it.</span>
        </div>
      </footer>
    </div>
  );
}