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

const contactMethods = [
  { icon: "fas fa-envelope", label: "Email", value: "harishvardhanwd@gmail.com", link: "mailto:harishvardhanwd@gmail.com", color: "#3B9EE8" },
  { icon: "fab fa-linkedin", label: "LinkedIn", value: "harishvardhan", link: "https://linkedin.com/in/harishvardhan27", color: "#0077B5" },
  { icon: "fab fa-github", label: "GitHub", value: "harishvardhan27", link: "https://github.com/harishvardhan27", color: "#C17A35" },
  { icon: "fas fa-user-circle", label: "Codolio", value: "Yugen27", link: "https://codolio.com/profile/Yugen27", color: "#2DB526" },
  { icon: "fab fa-instagram", label: "Instagram", value: "harish_vardhan27", link: "https://www.instagram.com/harish_vardhan27?igsh=MWNnaTF6Zzk2YjFsdQ==", color: "#E4405F" },
  { icon: "fas fa-phone", label: "Phone", value: "+91 97900 16953", link: "tel:+919790016953", color: "#FFA116" },
];

const interests = [
  "Machine Learning", "Blockchain", "Web Development", "Data Science", "Mobile Apps", "Cloud Computing"
];

function ContactCard({ method, index, sectionVisible }) {
  const [hovered, setHovered] = useState(false);
  const delay = `${0.1 + index * 0.08}s`;

  return (
    <a
      href={method.link}
      target={method.link.startsWith('http') ? '_blank' : undefined}
      rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: hovered ? `linear-gradient(135deg, #0e1120, #111828)` : `linear-gradient(135deg, #090b14, #0d1020)`,
        border: `1px solid ${hovered ? method.color + '38' : '#141e32'}`,
        borderRadius: 14, padding: '18px 20px',
        textDecoration: 'none',
        transition: 'all 0.35s ease',
        boxShadow: hovered ? `0 8px 32px ${method.color}20` : 'none',
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible ? 'none' : 'translateY(20px)',
        transitionDelay: delay,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: hovered ? `${method.color}18` : `${method.color}0e`,
        border: `1px solid ${method.color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }}>
        <i className={method.icon} style={{ fontSize: 16, color: method.color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, color: '#cbd5e1',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.12em', marginBottom: 3,
        }}>{method.label.toUpperCase()}</div>
        <div style={{
          fontSize: 16, color: '#c8d0e4',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{method.value}</div>
      </div>
      <i className="fas fa-arrow-right" style={{
        fontSize: 14, color: method.color,
        opacity: hovered ? 1 : 0.3,
        transform: hovered ? 'translateX(4px)' : 'none',
        transition: 'all 0.3s ease',
      }} />
    </a>
  );
}

const Contact = () => {
  const [sectionRef, sectionVisible] = useVisible(0.1);

  return (
    <section
      id="contact"
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
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          marginBottom: 52,
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
          }}>
            <div style={{ height: 1, width: 32, background: 'linear-gradient(90deg, transparent, #3B9EE8)' }} />
            <span style={{ fontSize: 14, color: '#94a3b8', letterSpacing: '0.25em', fontFamily: "'JetBrains Mono', monospace" }}>
              LET'S CONNECT
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900, color: '#f0ece4',
            fontFamily: "'Syne', sans-serif",
            letterSpacing: '-0.03em', lineHeight: 1,
            margin: 0,
          }}>
            Get In Touch
            <span style={{ color: '#3B9EE8', marginLeft: 4 }}>.</span>
          </h2>

          <p style={{
            marginTop: 16, fontSize: 16, color: '#cbd5e1',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.02em', lineHeight: 1.75,
            maxWidth: 680,
          }}>
            I'm always excited to discuss new opportunities, collaborate on innovative projects, or simply chat about technology. 
            Open for internships, freelance projects, and full-time positions in software development and AI.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
          <div style={{
            background: 'linear-gradient(135deg, #090b14, #0d1020)',
            border: '1px solid #141e32',
            borderRadius: 18, padding: '28px 24px',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'none' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.2s',
          }}>
            <h3 style={{
              fontSize: 18, fontWeight: 900, color: '#f0ece4',
              fontFamily: "'Syne', sans-serif",
              letterSpacing: '-0.02em', marginBottom: 12,
            }}>Areas of Interest</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {interests.map((interest) => (
                <span key={interest} style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: '#3B9EE80e', border: '1px solid #3B9EE828',
                  color: '#3B9EE8cc', borderRadius: 6,
                  padding: '6px 12px', fontSize: 16,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.04em',
                }}>{interest}</span>
              ))}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #090b14, #0d1020)',
            border: '1px solid #141e32',
            borderRadius: 18, padding: '28px 24px',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'none' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.3s',
          }}>
            <h3 style={{
              fontSize: 18, fontWeight: 900, color: '#f0ece4',
              fontFamily: "'Syne', sans-serif",
              letterSpacing: '-0.02em', marginBottom: 12,
            }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="mailto:harishvardhanwd@gmail.com" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #3B9EE8, #2a8fd0)',
                color: '#fff', borderRadius: 10, padding: '12px 20px',
                textDecoration: 'none', fontSize: 14,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                transition: 'all 0.3s ease',
              }}>
                <i className="fas fa-paper-plane" style={{ fontSize: 14 }} />
                Send Message
              </a>
              <a href="/resume.pdf" download="Harish_Vardhan_Resume.pdf" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#0a0e1a', border: '1px solid #1a2238',
                color: '#c8d0e4', borderRadius: 10, padding: '12px 20px',
                textDecoration: 'none', fontSize: 14,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                transition: 'all 0.3s ease',
              }}>
                <i className="fas fa-download" style={{ fontSize: 14 }} />
                Download Resume
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {contactMethods.map((method, i) => (
            <ContactCard key={method.label} method={method} index={i} sectionVisible={sectionVisible} />
          ))}
        </div>

        <div style={{
          marginTop: 48, textAlign: 'center',
          opacity: sectionVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#2DB52612', border: '1px solid #2DB52630',
            borderRadius: 20, padding: '8px 16px',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#2DB526',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: 16, color: '#2DB526cc', letterSpacing: '0.12em', fontFamily: "'JetBrains Mono', monospace" }}>
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </section>
  );
};

export default Contact;