import { useState, useEffect, useRef } from 'react';

function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const achievements = [
  { icon: 'fas fa-trophy', label: 'Eureka\'24', sub: 'IIT Bombay', color: '#FFA116' },
  { icon: 'fas fa-medal', label: 'Pragyan\'25', sub: 'NIT Trichy', color: '#3B9EE8' },
  { icon: 'fas fa-bullseye', label: 'CodeVeda\'25', sub: 'Top Performer', color: '#2DB526' },
  { icon: 'fas fa-rocket', label: 'Hackfest\'24', sub: 'Finalist', color: '#C17A35' },
];

const stats = [
  { label: 'Problems Solved', value: '1000+', color: '#FFA116' },
  { label: 'Projects Built', value: '20+', color: '#3B9EE8' },
  { label: 'Certifications', value: '8+', color: '#2DB526' },
  { label: 'Hackathons', value: '10+', color: '#C17A35' },
];

function AchievementCard({ item, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(135deg, #0e1120, #111828)` : `linear-gradient(135deg, #090b14, #0d1020)`,
        border: `1px solid ${hovered ? item.color + '38' : '#141e32'}`,
        borderRadius: 14, padding: '16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        transition: 'all 0.35s ease',
        boxShadow: hovered ? `0 8px 32px ${item.color}20` : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transitionDelay: `${0.1 + index * 0.08}s`,
        cursor: 'default',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${item.color}15`, border: `1px solid ${item.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={item.icon} style={{ fontSize: 16, color: item.color }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#f0ece4', fontFamily: "'Syne', sans-serif", textAlign: 'center' }}>{item.label}</div>
      <div style={{ fontSize: 14, color: item.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>{item.sub}</div>
    </div>
  );
}

const About = () => {
  const [sectionRef, sectionVisible] = useVisible(0.1);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: '80px 0',
        background: '#060810',
        backgroundImage:
          'radial-gradient(ellipse at 10% 10%, #100a0020 0%, transparent 55%), ' +
          'radial-gradient(ellipse at 90% 90%, #00100520 0%, transparent 55%)',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{
          marginBottom: 52,
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ height: 1, width: 32, background: 'linear-gradient(90deg, transparent, #3B9EE8)' }} />
            <span style={{ fontSize: 14, color: '#94a3b8', letterSpacing: '0.25em' }}>WHO I AM</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900, color: '#f0ece4',
            fontFamily: "'Syne', sans-serif",
            letterSpacing: '-0.03em', lineHeight: 1, margin: 0,
          }}>
            About<span style={{ color: '#3B9EE8', marginLeft: 4 }}>.</span>
          </h2>
        </div>

        {/* Bio + Achievements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, marginBottom: 40 }}>

          {/* Bio card */}
          <div style={{
            background: 'linear-gradient(135deg, #090b14, #0d1020)',
            border: '1px solid #141e32',
            borderRadius: 18, padding: '28px 24px',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'none' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.1s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B9EE8', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 14, color: '#3B9EE8', letterSpacing: '0.15em' }}>BIO</span>
            </div>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.85, letterSpacing: '0.02em', marginBottom: 16 }}>
              I'm a B.Tech CSE student at Coimbatore Institute of Technology, simultaneously pursuing a BS in Data Science from IIT Madras. Passionate about building intelligent systems, full-stack applications, and solving real-world problems through code.
            </p>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.85, letterSpacing: '0.02em' }}>
              I thrive at the intersection of software engineering and AI — from competitive programming to deploying production-level ML models.
            </p>
          </div>

          {/* Achievements grid */}
          <div style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'none' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.2s',
          }}>
            <div style={{ fontSize: 14, color: '#94a3b8', letterSpacing: '0.2em', marginBottom: 14 }}>HIGHLIGHTS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {achievements.map((item, i) => (
                <AchievementCard key={i} item={item} index={i} visible={sectionVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 14,
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.35s',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: `${s.color}08`,
              border: `1px solid ${s.color}22`,
              borderRadius: 14, padding: '20px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif", lineHeight: 1, marginBottom: 6 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 14, color: '#cbd5e1', letterSpacing: '0.12em' }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
