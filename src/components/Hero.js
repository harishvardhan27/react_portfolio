import { useState, useEffect } from "react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "120px 0 80px",
        fontFamily: "'JetBrains Mono', monospace",
        background: "#060810",
        backgroundImage:
          "radial-gradient(ellipse at 10% 10%, #100a0020 0%, transparent 55%), " +
          "radial-gradient(ellipse at 90% 90%, #00100520 0%, transparent 55%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.95)} }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", width: "100%" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 48,
          alignItems: "center",
        }}>

          {/* Left: Text Content */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateX(-30px)",
            transition: "all 0.8s ease",
          }}>
            <div style={{
              fontSize: 16, color: "#3B9EE8", letterSpacing: "0.2em",
              fontFamily: "'JetBrains Mono', monospace", marginBottom: 16,
            }}>
              ▸ WELCOME TO MY PORTFOLIO
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900,
              color: "#f0ece4", fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 16px 0",
            }}>
              Hi, I'm <span style={{ color: "#FFA116" }}>Harish Vardhan</span>
            </h1>

            <h2 style={{
              fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 700,
              color: "#cbd5e1", fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.01em", margin: "0 0 20px 0",
            }}>
              Software Developer & AI Specialist
            </h2>

            <p style={{
              fontSize: 16, color: "#e2e8f0", lineHeight: 1.8,
              letterSpacing: "0.02em", marginBottom: 32, maxWidth: 540,
            }}>
              Passionate technology enthusiast specializing in software development, AI, and data-driven solutions. I thrive on solving real-world problems and building innovative solutions.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                onClick={() => scrollToSection('projects')}
                style={{
                  background: "linear-gradient(135deg, #3B9EE8, #2a7ec0)",
                  border: "none", borderRadius: 10, padding: "14px 28px",
                  fontSize: 14, fontWeight: 700, color: "#fff",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.08em", cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px #3B9EE840",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 30px #3B9EE860";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 20px #3B9EE840";
                }}
              >
                VIEW MY WORK
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                style={{
                  background: "transparent",
                  border: "1px solid #3B9EE850", borderRadius: 10, padding: "14px 28px",
                  fontSize: 14, fontWeight: 700, color: "#3B9EE8",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.08em", cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#3B9EE815";
                  e.target.style.borderColor = "#3B9EE8";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "#3B9EE850";
                }}
              >
                GET IN TOUCH
              </button>

              <a
                href="/resume.pdf"
                download="Harish_Vardhan_Resume.pdf"
                style={{
                  background: "transparent",
                  border: "1px solid #FFA11650", borderRadius: 10, padding: "14px 28px",
                  fontSize: 14, fontWeight: 700, color: "#FFA116",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.08em", cursor: "pointer",
                  transition: "all 0.3s ease", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#FFA11615";
                  e.target.style.borderColor = "#FFA116";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "#FFA11650";
                }}
              >
                📥 DOWNLOAD RESUME
              </a>
            </div>
          </div>

          {/* Right: Profile Card */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateX(30px)",
            transition: "all 0.8s ease 0.2s",
            display: "flex", justifyContent: "center",
          }}>
            <div style={{
              position: "relative",
              width: "min(100%, 380px)",
            }}>
              {/* Main profile card */}
              <div style={{
                background: "linear-gradient(140deg, #090b14 0%, #0c0f1c 100%)",
                border: "1px solid #141e32",
                borderRadius: 24, padding: 24,
                boxShadow: "0 12px 60px #00000040",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
                  background: "linear-gradient(90deg, transparent, #3B9EE8, transparent)",
                  opacity: 0.4,
                }} />

                <div style={{
                  width: "100%", aspectRatio: "1",
                  borderRadius: 18, overflow: "hidden",
                  border: "2px solid #3B9EE830",
                  marginBottom: 20,
                }}>
                  <img
                    src="/profile.jpg"
                    alt="Harish Vardhan"
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{
                  display: "flex", justifyContent: "center", gap: 16,
                }}>
                  {[
                    { icon: "🐍", label: "Python", color: "#FFA116" },
                    { icon: "☕", label: "Java", color: "#C17A35" },
                    { icon: "⚛️", label: "React", color: "#3B9EE8" },
                    { icon: "🧠", label: "AI/ML", color: "#2DB526" },
                  ].map((tech, i) => (
                    <div
                      key={tech.label}
                      style={{
                        width: 52, height: 52, borderRadius: 12,
                        background: `${tech.color}12`, border: `1px solid ${tech.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, animation: `float 3s ease-in-out ${i * 0.2}s infinite`,
                      }}
                      title={tech.label}
                    >
                      {tech.icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div style={{
                position: "absolute", top: -12, right: -12,
                background: "linear-gradient(135deg, #2DB526, #1a8018)",
                border: "2px solid #060810",
                borderRadius: 12, padding: "8px 14px",
                boxShadow: "0 6px 24px #2DB52640",
                animation: "pulse 2s ease-in-out infinite",
              }}>
                <div style={{
                  fontSize: 16, fontWeight: 800, color: "#fff",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.1em",
                }}>
                  ✓ AVAILABLE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
