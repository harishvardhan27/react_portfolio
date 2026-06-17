import { useState, useEffect, useRef } from "react";

const educationData = [
  {
    id: "cit",
    degree: "Bachelor of Technology",
    branch: "Computer Science & Engineering",
    institution: "Coimbatore Institute of Technology",
    shortName: "CIT",
    period: "2023 – 2027",
    status: "Ongoing",
    gpa: null,
    color: "#3B9EE8",
    glow: "#3B9EE820",
    tag: "B.Tech",
    highlights: [
      "Data Structures & Algorithms",
      "Software Engineering",
      "Artificial Intelligence",
      "Database Systems",
      "Computer Networks",
    ],
    description:
      "Specializing in software development, AI, and data structures with a focus on building scalable systems.",
  },
  {
    id: "iitm",
    degree: "BS in Data Science & Applications",
    branch: "Data Science & Programming",
    institution: "Indian Institute of Technology Madras",
    shortName: "IIT-M",
    period: "2023 – Present",
    status: "Ongoing",
    gpa: null,
    color: "#C17A35",
    glow: "#C17A3520",
    tag: "BS Dual",
    highlights: [
      "Machine Learning",
      "Statistical Analysis",
      "Python & R Programming",
      "Business Data Management",
      "Deep Learning",
    ],
    description:
      "Advanced coursework in data science, machine learning, and statistical analysis through IIT Madras's online BS program.",
  },
];

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

function HighlightTag({ label, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${color}0e`, border: `1px solid ${color}28`,
      color: `${color}cc`, borderRadius: 6,
      padding: "4px 10px", fontSize: 16,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, opacity: 0.7, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function EduCard({ edu, index, sectionVisible }) {
  const [hovered, setHovered] = useState(false);
  const delay = `${0.1 + index * 0.18}s`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible ? "none" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
      }}
    >
      {index < educationData.length - 1 && (
        <div style={{
          position: "absolute",
          left: 27,
          top: "calc(100% + 0px)",
          width: 2,
          height: 28,
          background: `linear-gradient(180deg, ${edu.color}40, transparent)`,
          zIndex: 0,
        }} />
      )}

      <div style={{
        display: "flex",
        gap: 20,
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: hovered
              ? `linear-gradient(135deg, ${edu.color}22, ${edu.color}10)`
              : `linear-gradient(135deg, #0d1020, #111828)`,
            border: `2px solid ${hovered ? edu.color + "60" : edu.color + "28"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.35s ease",
            boxShadow: hovered ? `0 0 24px ${edu.color}25` : "none",
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 14, fontWeight: 800,
              color: hovered ? edu.color : `${edu.color}88`,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.02em",
              transition: "color 0.3s",
            }}>{edu.shortName}</span>
          </div>
        </div>

        <div style={{
          flex: 1,
          background: hovered
            ? `linear-gradient(135deg, #0e1120 0%, #111828 100%)`
            : `linear-gradient(135deg, #090b14 0%, #0d1020 100%)`,
          border: `1px solid ${hovered ? edu.color + "38" : "#141e32"}`,
          borderRadius: 18,
          padding: "22px 24px",
          transition: "all 0.35s ease",
          boxShadow: hovered ? `0 8px 40px ${edu.glow}, 0 0 0 1px ${edu.color}15` : "none",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
            background: `linear-gradient(90deg, transparent, ${edu.color}${hovered ? "70" : "30"}, transparent)`,
            transition: "opacity 0.3s",
          }} />

          <div style={{
            display: "flex", flexWrap: "wrap",
            justifyContent: "space-between", alignItems: "flex-start",
            gap: 10, marginBottom: 14,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: `${edu.color}12`, border: `1px solid ${edu.color}30`,
                borderRadius: 20, padding: "2px 10px", marginBottom: 8,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: edu.color,
                  animation: "pulse 2s infinite",
                }} />
                <span style={{ fontSize: 14, color: edu.color, letterSpacing: "0.14em", fontFamily: "'JetBrains Mono', monospace" }}>
                  {edu.tag} · {edu.status}
                </span>
              </div>

              <h3 style={{
                fontSize: "clamp(16px, 2.5vw, 20px)",
                fontWeight: 900, color: "#f0ece4",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.02em", lineHeight: 1.15,
                marginBottom: 4,
              }}>{edu.degree}</h3>

              <div style={{
                fontSize: 14, color: `${edu.color}bb`,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em", marginBottom: 6,
              }}>{edu.branch}</div>

              <div style={{
                fontSize: 14, color: "#e2e8f0",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, letterSpacing: "0.01em",
              }}>{edu.institution}</div>
            </div>

            <div style={{
              background: "#0a0e1a", border: `1px solid #1a2238`,
              borderRadius: 10, padding: "8px 14px",
              textAlign: "center", flexShrink: 0,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 800, color: "#c8d0e4",
                fontFamily: "'Syne', sans-serif", lineHeight: 1, marginBottom: 3,
              }}>{edu.period}</div>
              <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.15em" }}>DURATION</div>
            </div>
          </div>

          <p style={{
            fontSize: 14, color: "#cbd5e1",
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.75, marginBottom: 16,
            letterSpacing: "0.02em",
          }}>{edu.description}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {edu.highlights.map((h) => (
              <HighlightTag key={h} label={h} color={edu.color} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Education = () => {
  const [sectionRef, sectionVisible] = useVisible(0.1);

  return (
    <section
      id="education"
      ref={sectionRef}
      style={{
        padding: "80px 0",
        background: "#060810",
        backgroundImage:
          "radial-gradient(ellipse at 10% 10%, #100a0020 0%, transparent 55%), " +
          "radial-gradient(ellipse at 90% 90%, #00100520 0%, transparent 55%)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}>

        <div style={{
          marginBottom: 52,
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? "none" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
          }}>
            <div style={{ height: 1, width: 32, background: "linear-gradient(90deg, transparent, #3B9EE8)" }} />
            <span style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.25em", fontFamily: "'JetBrains Mono', monospace" }}>
              ACADEMIC BACKGROUND
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 900, color: "#f0ece4",
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.03em", lineHeight: 1,
            margin: 0,
          }}>
            Education
            <span style={{ color: "#3B9EE8", marginLeft: 4 }}>.</span>
          </h2>

          <p style={{
            marginTop: 12, fontSize: 14, color: "#94a3b8",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em", lineHeight: 1.6,
          }}>
            2 concurrent programs · Pursuing since 2023
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {educationData.map((edu, i) => (
            <EduCard key={edu.id} edu={edu} index={i} sectionVisible={sectionVisible} />
          ))}
        </div>

        <div style={{
          marginTop: 40,
          opacity: sectionVisible ? 1 : 0,
          transition: "opacity 0.8s ease 0.5s",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1a2235, transparent)" }} />
          <span style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace" }}>
            PURSUING DUAL DEGREE SIMULTANEOUSLY
          </span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #1a2235)" }} />
        </div>
      </div>
    </section>
  );
};

export default Education;
