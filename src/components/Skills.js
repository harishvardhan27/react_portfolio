import { useState, useEffect, useRef } from "react";

const skillCategories = [
  {
    id: "langs",
    title: "Programming Languages",
    icon: "⌨️",
    color: "#3B9EE8",
    glow: "#3B9EE820",
    skills: ["Python", "Java", "C", "JavaScript", "SQL", "Solidity"],
  },
  {
    id: "web",
    title: "Web & App Development",
    icon: "🌐",
    color: "#FFA116",
    glow: "#FFA11620",
    skills: ["React", "React Native", "Flask", "FastAPI", "Node.js", "Express", "REST APIs", "Streamlit", "PHP", "Bootstrap"],
  },
  {
    id: "ai",
    title: "AI / Machine Learning",
    icon: "🧠",
    color: "#C17A35",
    glow: "#C17A3520",
    skills: ["TensorFlow", "TFLite", "LangGraph", "LLMs", "RAG", "MediaPipe", "YOLOv8", "DeepSORT", "DistilBERT", "CNN"],
  },
  {
    id: "data",
    title: "Databases & Data Tools",
    icon: "🗄️",
    color: "#E63946",
    glow: "#E6394620",
    skills: ["MySQL", "PostgreSQL", "SQLite", "MongoDB", "pandas", "NumPy"],
  },
  {
    id: "tools",
    title: "Tools & DevOps",
    icon: "🔧",
    color: "#2DB526",
    glow: "#2DB52620",
    skills: ["Git", "GitHub", "Docker", "VS Code", "Google Colab", "Tesseract OCR", "Expo"],
  },
  {
    id: "core",
    title: "Core CS & DSA",
    icon: "⚡",
    color: "#7B61FF",
    glow: "#7B61FF20",
    skills: ["Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Async Programming", "Blockchain"],
  },
];

function useVisible(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function CategoryCard({ cat, cardIndex, visible }) {
  const [hovered, setHovered] = useState(false);
  const cardDelay = `${0.08 + cardIndex * 0.1}s`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: `opacity 0.6s ease ${cardDelay}, transform 0.6s ease ${cardDelay}`,
      }}
    >
      <div style={{
        background: hovered
          ? `linear-gradient(140deg, ${cat.glow} 0%, #0e1120 100%)`
          : "linear-gradient(140deg, #090b14 0%, #0c0f1c 100%)",
        border: `1px solid ${hovered ? cat.color + "45" : "#141e32"}`,
        borderRadius: 18, padding: "22px",
        transition: "all 0.35s ease",
        boxShadow: hovered ? `0 8px 40px ${cat.glow}, 0 0 0 1px ${cat.color}12` : "none",
        position: "relative", overflow: "hidden",
        height: "100%",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
          background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
          opacity: hovered ? 0.7 : 0.18, transition: "opacity 0.3s",
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: `${cat.color}10`, border: `1px solid ${cat.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, transition: "transform 0.3s",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}>{cat.icon}</div>

          <div>
            <div style={{
              fontSize: 11, color: `${cat.color}80`,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.16em", marginBottom: 3,
            }}>
              {cat.skills.length} SKILLS
            </div>
            <h3 style={{
              fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 900,
              color: "#f0ece4", fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.01em", lineHeight: 1, margin: 0,
            }}>{cat.title}</h3>
          </div>
        </div>

        {/* Skill chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {cat.skills.map((skill) => (
            <span key={skill} style={{
              background: `${cat.color}0e`, border: `1px solid ${cat.color}28`,
              color: `${cat.color}cc`, borderRadius: 8,
              padding: "5px 12px", fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
              transition: "all 0.2s ease",
            }}>{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const Skills = () => {
  const [sectionRef, sectionVisible] = useVisible(0.08);
  const totalSkills = skillCategories.reduce((s, c) => s + c.skills.length, 0);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        padding: "80px 0",
        fontFamily: "'JetBrains Mono', monospace",
        background: "#060810",
        backgroundImage:
          "radial-gradient(ellipse at 10% 10%, #100a0020 0%, transparent 55%), " +
          "radial-gradient(ellipse at 90% 90%, #00100520 0%, transparent 55%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 20px" }}>

        <div style={{
          marginBottom: 40,
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? "none" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ height: 1, width: 32, background: "linear-gradient(90deg, transparent, #2DB526)" }} />
            <span style={{ fontSize: 12, color: "#86efac", letterSpacing: "0.25em" }}>TECHNICAL STACK</span>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900,
            color: "#f0ece4", fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
          }}>
            Skills<span style={{ color: "#2DB526" }}>.</span>
          </h2>
          <p style={{
            marginTop: 12, fontSize: 13, color: "#94a3b8",
            letterSpacing: "0.08em", lineHeight: 1.6,
          }}>
            {totalSkills} technologies across {skillCategories.length} domains
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32,
          opacity: sectionVisible ? 1 : 0,
          transition: "opacity 0.6s ease 0.1s",
        }}>
          {[
            { label: "TOTAL SKILLS", value: totalSkills,              color: "#3B9EE8" },
            { label: "DOMAINS",      value: skillCategories.length,   color: "#FFA116" },
            { label: "PROJECTS",     value: "8+",                     color: "#2DB526" },
            { label: "INTERNSHIPS",  value: "3",                      color: "#C17A35" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#090b14", border: "1px solid #141e32",
              borderRadius: 10, padding: "10px 18px",
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.16em", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          alignItems: "start",
        }}>
          {skillCategories.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} cardIndex={i} visible={sectionVisible} />
          ))}
        </div>

        <div style={{
          marginTop: 40, display: "flex", alignItems: "center", gap: 12,
          opacity: sectionVisible ? 1 : 0, transition: "opacity 0.8s ease 0.6s",
        }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1a2235, transparent)" }} />
          <span style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.2em" }}>
            ALWAYS LEARNING · ALWAYS BUILDING
          </span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #1a2235)" }} />
        </div>
      </div>
    </section>
  );
};

export default Skills;
