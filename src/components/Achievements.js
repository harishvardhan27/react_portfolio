import { useState, useEffect, useRef } from "react";

const achievementsData = [
  { id: "hackfest",  title: "Hackfest '24 Third Place",       organization: "CIT",                                     icon: "fas fa-award",     year: "2024", color: "#CD7F32", glow: "#CD7F3220" },
  { id: "sih2024",   title: "SIH 2024 Internal Winner",       organization: "Smart India Hackathon · Dept. Level",     icon: "fas fa-trophy",   year: "2024", color: "#C17A35", glow: "#C17A3520" },
  { id: "eureka",    title: "Eureka! 2024 Zonalist",          organization: "IIT Bombay",                             icon: "fas fa-star",     year: "2024", color: "#FFA116", glow: "#FFA11620" },
  { id: "pragyan",   title: "Pragyan '25 Runner-Up",          organization: "NIT Trichy",                             icon: "fas fa-medal",    year: "2025", color: "#94a3b8", glow: "#94a3b820" },
  { id: "codeveda",  title: "CodeVeda '25 Finalist",          organization: "IITM & Manipal University",              icon: "fas fa-bullseye", year: "2025", color: "#3B9EE8", glow: "#3B9EE820" },
  { id: "sih2025",   title: "SIH 2025 Internal Winner",       organization: "Smart India Hackathon · Dept. Level",     icon: "fas fa-trophy",   year: "2025", color: "#FFA116", glow: "#FFA11620" },
  { id: "hackblitz", title: "HackBlitz Finalist",             organization: "Inter-College Hackathon",                icon: "fas fa-bolt",     year: "2024", color: "#2DB526", glow: "#2DB52620" },
  { id: "innov",     title: "Innovation 2026 Winner",         organization: "CIT Innovation Challenge",               icon: "fas fa-lightbulb",year: "2026", color: "#7B61FF", glow: "#7B61FF20" },
  { id: "cp",        title: "1000+ DSA & CP Problems Solved", organization: "LeetCode · CodeChef · Codeforces & more", icon: "fas fa-code",    year: "2025", color: "#FF375F", glow: "#FF375F20" },
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

function AchievementCard({ achievement, index, visible }) {
  const [hovered, setHovered] = useState(false);
  const delay = `${0.08 + index * 0.1}s`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
        height: "100%",
      }}
    >
      <div style={{
        background: hovered
          ? `linear-gradient(140deg, ${achievement.glow} 0%, #0e1120 100%)`
          : "linear-gradient(140deg, #090b14 0%, #0c0f1c 100%)",
        border: `1px solid ${hovered ? achievement.color + "45" : "#141e32"}`,
        borderRadius: 18, padding: "24px 22px 20px",
        transition: "all 0.35s ease",
        boxShadow: hovered ? `0 8px 40px ${achievement.glow}, 0 0 0 1px ${achievement.color}12` : "none",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", gap: 14,
        height: "100%",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
          background: `linear-gradient(90deg, transparent, ${achievement.color}, transparent)`,
          opacity: hovered ? 0.7 : 0.18, transition: "opacity 0.3s",
        }} />

        <div style={{
          position: "absolute", top: 16, right: 16,
          background: `${achievement.color}12`, border: `1px solid ${achievement.color}30`,
          borderRadius: 8, padding: "4px 10px",
          fontSize: 14, fontWeight: 800, color: achievement.color,
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em",
        }}>{achievement.year}</div>

        <div style={{
          width: 52, height: 52, borderRadius: 13, flexShrink: 0,
          background: `${achievement.color}12`, border: `1px solid ${achievement.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.3s",
          transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1)",
        }}>
          <i className={achievement.icon} style={{ fontSize: 22, color: achievement.color }} />
        </div>

        <div>
          <h3 style={{
            fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 900,
            color: "#f0ece4", fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: 6,
          }}>{achievement.title}</h3>
          <p style={{
            fontSize: 14, color: `${achievement.color}99`,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.03em", lineHeight: 1.5,
          }}>{achievement.organization}</p>
        </div>
      </div>
    </div>
  );
}

const Achievements = () => {
  const [sectionRef, sectionVisible] = useVisible(0.08);

  return (
    <section
      id="achievements"
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

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 20px" }}>

        <div style={{
          marginBottom: 40,
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? "none" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ height: 1, width: 32, background: "linear-gradient(90deg, transparent, #FFA116)" }} />
            <span style={{ fontSize: 14, color: "#fcd34d", letterSpacing: "0.25em" }}>RECOGNITION</span>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900,
            color: "#f0ece4", fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
          }}>
            Achievements<span style={{ color: "#FFA116" }}>.</span>
          </h2>
          <p style={{
            marginTop: 12, fontSize: 14, color: "#94a3b8",
            letterSpacing: "0.08em", lineHeight: 1.6,
          }}>
            {achievementsData.length} recognitions · hackathons, competitions & milestones
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}>
          {achievementsData.map((achievement, i) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={i}
              visible={sectionVisible}
            />
          ))}
        </div>

        <div style={{
          marginTop: 40, display: "flex", alignItems: "center", gap: 12,
          opacity: sectionVisible ? 1 : 0, transition: "opacity 0.8s ease 0.6s",
        }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1a2235, transparent)" }} />
          <span style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.2em" }}>
            COMPETING · BUILDING · WINNING
          </span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #1a2235)" }} />
        </div>
      </div>
    </section>
  );
};

export default Achievements;
