import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: 'fab fa-github', link: 'https://github.com/harishvardhan27', color: '#C17A35' },
    { icon: 'fab fa-linkedin', link: 'https://linkedin.com/in/harishvardhan27', color: '#3B9EE8' },
    { icon: 'fab fa-instagram', link: 'https://www.instagram.com/harish_vardhan27', color: '#E4405F' },
    { icon: 'fas fa-envelope', link: 'mailto:harishvardhanwd@gmail.com', color: '#2DB526' },
  ];

  const quickLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer style={{
      background: '#060810',
      borderTop: '1px solid #141e32',
      padding: '48px 0 24px',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontSize: 24,
              color: '#f0ece4',
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}>
              Harish<span style={{ color: '#3B9EE8' }}>.</span>
            </h3>
            <p style={{
              fontSize: 14,
              color: '#cbd5e1',
              lineHeight: 1.75,
              letterSpacing: '0.02em',
              marginBottom: 16,
            }}>
              Full-stack developer & AI enthusiast building innovative solutions.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${social.color}12`,
                    border: `1px solid ${social.color}28`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${social.color}22`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${social.color}12`;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <i className={social.icon} style={{ fontSize: 14, color: social.color }} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              color: '#f0ece4',
              marginBottom: 16,
              letterSpacing: '0.02em',
            }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickLinks.map((link, i) => (
                <a
                  key={i}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  style={{
                    fontSize: 14,
                    color: '#e2e8f0',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3B9EE8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#e2e8f0'}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              color: '#f0ece4',
              marginBottom: 16,
              letterSpacing: '0.02em',
            }}>Get In Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href="mailto:harishvardhanwd@gmail.com"
                style={{
                  fontSize: 14,
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                harishvardhanwd@gmail.com
              </a>
              <a
                href="tel:+919790016953"
                style={{
                  fontSize: 14,
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                +91 97900 16953
              </a>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: 24,
          borderTop: '1px solid #141e32',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{
            fontSize: 14,
            color: '#cbd5e1',
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            © {currentYear} Harish Vardhan. Built with React.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#2DB52612',
            border: '1px solid #2DB52630',
            borderRadius: 16,
            padding: '4px 12px',
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#2DB526',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontSize: 14,
              color: '#2DB526cc',
              letterSpacing: '0.12em',
            }}>AVAILABLE</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </footer>
  );
};

export default Footer;