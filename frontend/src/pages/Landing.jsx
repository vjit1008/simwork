import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleField from '../components/Effects/ParticleField';
import GlowButton    from '../components/Ui/GlowButton';

const TYPEWRITER_WORDS = [
  'Software Developer',
  'Data Scientist',
  'UI/UX Designer',
  'DevOps Engineer',
  'Product Manager',
  'AI Engineer',
];

const STATS = [
  { value: '12,400+', label: 'Simulations Run'  },
  { value: '3,200+',  label: 'Certifications'   },
  { value: '98%',     label: 'Hiring Rate'       },
  { value: '4.9★',    label: 'User Rating'       },
];

const FEATURES = [
  {
    icon: '⟨⟩',
    title: 'In-Browser IDE',
    desc:  'Real job tasks executed in a fully functional code editor. No setup, no friction.',
    accent: '#6c63ff',
  },
  {
    icon: '🏅',
    title: 'AI-Verified Certs',
    desc:  'Certificates scored by AI, trusted by 500+ companies. Shareable to LinkedIn.',
    accent: '#00d4aa',
  },
  {
    icon: '◈',
    title: 'Role Simulations',
    desc:  'Live multi-stage simulations for every tech role. BA, PM, Dev, QA — all included.',
    accent: '#ffb700',
  },
  {
    icon: '⬡',
    title: 'Live Leaderboard',
    desc:  'Compete globally, track your XP, get discovered by top companies actively hiring.',
    accent: '#ff6b6b',
  },
];

export default function LandingPage() {
  const navigate  = useNavigate();
  const heroRef   = useRef(null);
  const [wordIdx, setWordIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [displayed, setDisplayed] = useState('');

  /* typewriter */
  useEffect(() => {
    const word    = TYPEWRITER_WORDS[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) {
          setTimeout(() => setDeleting(true), 1800);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplayed(word.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(i => (i + 1) % TYPEWRITER_WORDS.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? 45 : 85);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx]);

  /* parallax hero */
  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroRef.current.style.setProperty('--px', x + 'px');
      heroRef.current.style.setProperty('--py', y + 'px');
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(2,3,8,.8)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg,#7c74ff,#6c63ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: '#fff', fontSize: 15,
            boxShadow: '0 0 16px rgba(108,99,255,.5)',
          }}>S</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Sim<span style={{ background: 'linear-gradient(135deg,#a99fff,#6c63ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Work</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GlowButton variant="ghost" size="sm" onClick={() => navigate('/auth')}>Sign In</GlowButton>
          <GlowButton variant="plasma" size="sm" onClick={() => navigate('/auth')}>Get Started →</GlowButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', paddingTop: 64,
        '--px': '0px', '--py': '0px',
      }}>
        {/* Particle field */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <ParticleField count={60} color="#6c63ff" speed={0.25} />
        </div>

        {/* Ambient orbs */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,.12) 0%, transparent 70%)',
          top: '10%', left: '20%',
          transform: 'translate(calc(var(--px)*0.5), calc(var(--py)*0.5))',
          transition: 'transform 0.1s',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,.08) 0%, transparent 70%)',
          bottom: '15%', right: '15%',
          transform: 'translate(calc(var(--px)*-0.3), calc(var(--py)*-0.3))',
          transition: 'transform 0.1s',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '2s',
          pointerEvents: 'none',
        }} />

        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(108,99,255,.3), transparent)',
          animation: 'scan 8s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 860, margin: '0 auto' }}>

          {/* Badge */}
          <div className="anim-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(108,99,255,.1)', border: '1px solid rgba(108,99,255,.25)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', display: 'inline-block', animation: 'pulseGlow 2s infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--text-accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              AI-POWERED JOB SIMULATION PLATFORM
            </span>
          </div>

          {/* Headline */}
          <h1 className="anim-fade-up d2" style={{ fontSize: 'clamp(38px,6vw,72px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 16 }}>
            <span style={{ color: 'var(--text-1)' }}>Simulate before</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a99fff 0%, #6c63ff 40%, #00d4aa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>you apply.</span>
          </h1>

          {/* Typewriter */}
          <div className="anim-fade-up d3" style={{ fontSize: 'clamp(16px,2vw,22px)', marginBottom: 32, height: 36 }}>
            <span style={{ color: 'var(--text-2)' }}>Practice real tasks for </span>
            <span style={{ color: '#a99fff', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {displayed}
              <span style={{ animation: 'blink 1s infinite', marginLeft: 2, color: '#6c63ff' }}>|</span>
            </span>
          </div>

          {/* CTAs */}
          <div className="anim-fade-up d4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <GlowButton variant="plasma" size="lg" onClick={() => navigate('/auth')}>
              Start Simulating →
            </GlowButton>
            <GlowButton variant="ghost" size="lg" onClick={() => navigate('/auth')}>
              🚀 Try Demo
            </GlowButton>
          </div>

          {/* Stats row */}
          <div className="anim-fade-up d5" style={{
            display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap',
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text-1)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glow line at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(108,99,255,.4), rgba(0,212,170,.3), transparent)',
        }} />
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            PLATFORM CAPABILITIES
          </div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 16 }}>
            Everything you need to
            <span style={{ background: 'linear-gradient(135deg,#a99fff,#00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> get hired.</span>
          </h2>
          <p style={{ fontSize: 16, maxWidth: 520, margin: '0 auto', color: 'var(--text-2)' }}>
            SimWork replicates the full job-readiness journey — from raw skill to verified professional.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`anim-fade-up d${i + 2}`}
              style={{
                padding: '28px 24px',
                background: 'rgba(10,15,30,.8)',
                border: '1px solid rgba(255,255,255,.06)',
                borderRadius: 16, overflow: 'hidden', position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,.4), 0 0 32px ${f.accent}20`;
                e.currentTarget.style.borderColor = `${f.accent}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)';
              }}>
              {/* Top accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${f.accent},transparent)`, opacity: 0.7 }} />

              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${f.accent}18`, border: `1px solid ${f.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        margin: '0 40px 100px', borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(108,99,255,.15) 0%, rgba(0,212,170,.08) 100%)',
        border: '1px solid rgba(108,99,255,.2)',
        padding: '64px 40px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <ParticleField count={30} color="#6c63ff" speed={0.2} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, marginBottom: 16, color: 'var(--text-1)' }}>
            Ready to simulate your future?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Join thousands of job-seekers who landed their dream roles after SimWork.
          </p>
          <GlowButton variant="plasma" size="lg" onClick={() => navigate('/auth')}>
            Launch SimWork →
          </GlowButton>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>S</div>
          <span style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            © 2025 SimWork · simworkapp.com
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
          Built for the next generation of professionals.
        </div>
      </footer>
    </div>
  );
}