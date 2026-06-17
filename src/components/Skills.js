import { useState, useEffect, useRef } from "react";

const skillCategories = [
  {
    id: "langs",
    title: "Programming Languages",
    icon: "⌨️",
    color: "#3B9EE8",
    glow: "#3B9EE820",
    skills: [
      { name: "Python",  level: 90 },
      { name: "Java",    level: 85 },
      { name: "C",       level: 80 },
      { name: "JavaScript", level: 78 },
      { name: "SQL",     level: 75 },
    ],
  },
  {
    id: "web",
    title: "Web & App Development",
    icon: "🌐",
    color: "#FFA116",
    glow: "#FFA11620",
    skills: [
      { name: "React",        level: 85 },
      { name: "Flask",        level: 82 },
      { name: "React Native", level: 80 },
      { name: "REST APIs",    level: 80 },
      { name: "Streamlit",    level: 78 },
    ],
  },
  {
    id: "ai",
    title: "AI / Machine Learning",
    icon: "🧠",
    color: "#C17A35",
    glow: "#C17A3520",
    skills: [
      { name: "TensorFlow",    level: 85 },
      { name: "TFLite",        level: 80 },
      { name: "LLMs",          level: 80 },
      { name: "MediaPipe",     level: 75 },
      { name: "RAG",           level: 75 },
    ],
  },
  {
    id: "data",
    title: "Databases & Data Tools",
    icon: "🗄️",
    color: "#E63946",
    glow: "#E6394620",
    skills: [
      { name: "pandas",      level: 85 },
      { name: "NumPy",       level: 85 },
      { name: "MySQL",       level: 82 },
      { name: "PostgreSQL",  level: 80 },
      { name: "SQLite",      level: 75 },
    ],
  },
  {
    id: "tools",
    title: "Tools & DevOps",
    icon: "🔧",
    color: "#2DB526",
    glow: "#2DB52620",
    skills: [
      { name: "VS Code",         level: 95 },
      { name: "Git",             level: 90 },
      { name: "Google Colab",    level: 85 },
      { name: "Tesseract OCR",   level: 80 },
      { name: "Docker",          level: 70 },
    ],
  },
  {
    id: "core",
    title: "Core CS & DSA",
    icon: "⚡",
    color: "#7B61FF",
    glow: "#7B61FF20",
    skills: [
      { name: "DSA",                      level: 90 },
      { name: "OOP",                      level: 88 },
      { name: "DBMS",                     level: 85 },
      { name: "Asynchronous Prog.",       level: 82 },
      { name: "Operating Systems",        level: 80 },
    ],
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

function SkillRow({ skill, color, visible, delay }) {
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setBarVisible(true), parseFloat(delay) * 1000 + 200);
    return () => clearTimeout(t);
  }, [visible, delay]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{
          fontSize: 14, fontWeight: 700, color: "#e2e8f0",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.04em",
        }}>{skill.name}</span>
        <span style={{
          fontSize: 13, fontWeight: 800, color: `${color}cc`,
          fontFamily: "'Syne', sans-serif",
        }}>{skill.level}%</span>
      </div>
      <div style={{
        height: 4, background: "#0a0e1a", borderRadius: 3, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: barVisible ? `${skill.level}%` : "0%",
          background: `linear-gradient(90deg, ${color}55, ${color})`,
          transition: `width 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}`,
          boxShadow: barVisible ? `0 0 8px ${color}55` : "none",
        }} />
      </div>
    </div>
  );
}

function CategoryCard({ cat, cardIndex, visible }) {
  const [hovered, setHovered] = useState(false);
  const cardDelay = `${0.08 + cardIndex * 0.12}s`;

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
        borderRadius: 18, padding: "22px 22px 20px",
        transition: "all 0.35s ease",
        boxShadow: hovered ? `0 8px 40px ${cat.glow}, 0 0 0 1px ${cat.color}12` : "none",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", gap: 18,
      }}>
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
          background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
          opacity: hovered ? 0.7 : 0.18, transition: "opacity 0.3s",
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: `${cat.color}10`, border: `1px solid ${cat.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, transition: "transform 0.3s",
            transform: hovered ? "scale(1.12)" : "scale(1)",
          }}>{cat.icon}</div>

          <div>
            <div style={{
              fontSize: 14, color: `${cat.color}80`,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.16em", marginBottom: 4,
            }}>
              {cat.skills.length} SKILLS
            </div>
            <h3 style={{
              fontSize: "clamp(15px, 2vw, 17px)", fontWeight: 900,
              color: "#f0ece4", fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.01em", lineHeight: 1, margin: 0,
            }}>{cat.title}</h3>
          </div>
        </div>

        {/* Skills List - Flex 1 pushes footer to the bottom */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
          {cat.skills.map((skill, si) => (
            <SkillRow
              key={skill.name}
              skill={skill}
              color={cat.color}
              visible={visible}
              delay={`${0.15 + cardIndex * 0.1 + si * 0.08}s`}
            />
          ))}
        </div>

        {/* Top Technologies Tags Footer */}
        <div style={{ 
          display: "flex", flexWrap: "wrap", gap: 8, 
          marginTop: 28, paddingTop: 20, borderTop: `1px solid ${cat.color}20` 
        }}>
          {cat.skills
            .filter(s => s.level >= 82)
            .map(s => (
              <span key={s.name} style={{
                background: `${cat.color}10`, border: `1px solid ${cat.color}30`,
                color: `${cat.color}cc`, borderRadius: 6,
                padding: "4px 10px", fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em",
              }}>★ {s.name}</span>
            ))}
        </div>
      </div>
    </div>
  );
}

const Skills = () => {
  const [sectionRef, sectionVisible] = useVisible(0.08);

  const totalSkills  = skillCategories.reduce((s, c) => s + c.skills.length, 0);
  const avgLevel     = Math.round(
    skillCategories.flatMap(c => c.skills).reduce((s, sk) => s + sk.level, 0) / totalSkills
  );
  const expertCount  = skillCategories.flatMap(c => c.skills).filter(s => s.level >= 85).length;

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
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
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
            <span style={{ fontSize: 14, color: "#86efac", letterSpacing: "0.25em" }}>TECHNICAL STACK</span>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900,
            color: "#f0ece4", fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
          }}>
            Skills<span style={{ color: "#2DB526" }}>.</span>
          </h2>
          <p style={{
            marginTop: 12, fontSize: 14, color: "#94a3b8",
            letterSpacing: "0.08em", lineHeight: 1.6,
          }}>
            {totalSkills} technologies across {skillCategories.length} domains
          </p>
        </div>

        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28,
          opacity: sectionVisible ? 1 : 0,
          transition: "opacity 0.6s ease 0.1s",
        }}>
          {[
            { label: "TOTAL SKILLS",     value: totalSkills,           color: "#3B9EE8" },
            { label: "AVG PROFICIENCY",  value: `${avgLevel}%`,        color: "#FFA116" },
            { label: "EXPERT LEVEL",     value: expertCount,           color: "#2DB526" },
            { label: "DOMAINS",          value: skillCategories.length, color: "#C17A35" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#090b14", border: "1px solid #141e32",
              borderRadius: 10, padding: "10px 18px",
              display: "flex", flexDirection: "column", gap: 3,
            }}>
              <div style={{
                fontSize: 20, fontWeight: 900, color: s.color,
                fontFamily: "'Syne', sans-serif", lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontSize: 14, color: "#64748b",
                letterSpacing: "0.16em",
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 24,
          alignItems: "stretch",
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
          <span style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.2em" }}>
            ALWAYS LEARNING · ALWAYS BUILDING
          </span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #1a2235)" }} />
        </div>
      </div>
    </section>
  );
};

export default Skills;
