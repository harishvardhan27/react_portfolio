import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const projectsData = [
  {
    id: "fundflow",
    title: "FundFlow",
    subtitle: "Blockchain-Based Fund Allocation System",
    icon: "fas fa-link",
    color: "#C17A35",
    glow: "#C17A3520",
    status: "In Progress",
    statusPct: 85,
    team: "solo",
    description: "Built a smart-contract-driven system to ensure transparent fund distribution for government projects and private organizations. Features tender-based allocation and hierarchical fund circulation, preventing fraud and improving accountability.",
    technologies: ["Solidity", "Blockchain", "Web3"],
    highlights: ["Fraud prevention", "Hierarchical allocation", "Smart contracts", "Transparency"],
  },
  {
    id: "explicitdetect",
    title: "Explicit Content Detector",
    subtitle: "Real-Time Explicit Content Detection System",
    icon: "fas fa-shield-alt",
    color: "#FF375F",
    glow: "#FF375F20",
    status: "In Development",
    statusPct: 50,
    team: "solo",
    description: "Designed an AI system to detect explicit content in multimedia uploads while streaming. Uses CNNs for video frames, DistilBERT for text detection, and Floyd's Two-Pointer approach for efficient scanning. Supports region-specific moderation policies.",
    technologies: ["Python", "DistilBERT", "CNN", "Floyd's Two-Pointer"],
    highlights: ["Real-time scanning", "Multi-modal detection", "Region policies", "AI moderation"],
  },
  {
    id: "pdfreader",
    title: "PDF / Document Reader App",
    subtitle: "Study-Focused Document Companion",
    icon: "fas fa-file-pdf",
    color: "#3B9EE8",
    glow: "#3B9EE820",
    status: "Completed",
    statusPct: 100,
    team: "collab",
    contributors: ["Akiladithya R", "Farhan Abdul Hakkim", "Maushmi B"],
    description: "Developed a React Native app for reading and annotating PDFs/documents. Features text highlighting, annotation extraction, MCQ generation, and chatbot integration for study assistance.",
    technologies: ["React Native", "Flask Backend", "AI Integration"],
    highlights: ["MCQ generation", "Chatbot assistant", "Annotation extraction", "PDF rendering"],
  },
  {
    id: "intellisafe",
    title: "IntelliSafe",
    subtitle: "Stalker Detection & Surveillance System",
    icon: "fas fa-eye",
    color: "#FFA116",
    glow: "#FFA11620",
    status: "Completed",
    statusPct: 100,
    statusNote: "SOFTWARE PROJECT",
    team: "collab",
    contributors: ["Bala Murali S R"],
    description: "Built a surveillance system using YOLOv8, DeepSORT, RFID tracking, and Streamlit. Detects potential stalking behavior, analyzes proximity patterns, and provides panic/report functionality.",
    technologies: ["Python", "OpenCV", "Streamlit", "YOLOv8", "DeepSORT"],
    highlights: ["Real-time tracking", "Proximity analysis", "RFID integration", "Panic alerts"],
  },
  {
    id: "shield",
    title: "S.H.I.E.L.D",
    subtitle: "Cognitive Study Monitoring App",
    icon: "fas fa-brain",
    color: "#2DB526",
    glow: "#2DB52620",
    status: "Completed",
    statusPct: 100,
    team: "collab",
    contributors: ["Janani K", "Maushmi B"],
    description: "Built a cross-platform React Native app that monitors student focus during study sessions using real-time face analysis and AI-based emotion recognition. Implements EAR, MAR, face movement tracking, distraction detection, and FER13 emotion model (TFLite) for intelligent focus scoring. Includes session tracking, analytics, app usage monitoring, and gamified cognitive break activities.",
    technologies: ["React Native (Expo)", "TensorFlow.js", "TFLite (FER13)", "SQLite", "Facemesh", "AI/ML"],
    highlights: ["EAR / MAR tracking", "Emotion recognition", "Focus scoring", "Gamified breaks"],
  },
  {
    id: "safeher",
    title: "SafeHer Navigation",
    subtitle: "Safety-First Route Navigation System",
    icon: "fas fa-map-marked-alt",
    color: "#E63946",
    glow: "#E6394620",
    status: "Completed",
    statusPct: 100,
    team: "collab",
    contributors: ["Bala Murali S R", "Janani K", "Maushmi B"],
    description: "Built a production-ready React web application focused on women's safety, offering intelligent route navigation that prioritizes safety over distance and speed. The system analyzes multiple routes using a safety-first scoring algorithm, visualizes unsafe zones, and triggers emergency alerts when users are overdue.",
    technologies: ["React 18", "Leaflet", "Node.js", "Express", "OpenRouteService", "OpenStreetMap", "Twilio", "Tailwind CSS"],
    highlights: ["Safety-first route scoring", "Unsafe zone & buffer detection", "Real-time route visualization", "Emergency SMS alerts with GPS", "Admin dashboard for zone management"],
  },
  {
    id: "coding-mentor-bot",
    title: "ThunderCode",
    subtitle: "Agentic AI Coding Assistant",
    icon: "fas fa-robot",
    color: "#7B61FF",
    glow: "#7B61FF20",
    status: "Completed",
    statusPct: 100,
    team: "solo",
    description: "Built an intelligent coding mentor chatbot using Streamlit, FastAPI, and LangGraph to manage advanced conversation flows. The system intelligently routes user queries for explanations, code generation, debugging, code reviews, and learning paths.",
    technologies: ["Python", "Streamlit", "FastAPI", "LangGraph", "Google Gemini 2.0 Flash Lite", "Pydantic"],
    highlights: ["Intent-based conversation routing", "Agentic AI with LangGraph", "Code generation, debugging & reviews", "Adaptive learning assistance", "Session-based context tracking"],
  },
  {
    id: "php-parking",
    title: "Parkly",
    subtitle: "Role-Based Parking Booking Platform",
    icon: "fas fa-parking",
    color: "#0D6EFD",
    glow: "#0D6EFD20",
    status: "Completed",
    statusPct: 100,
    team: "solo",
    description: "Developed a full-stack Parking Management System using PHP and MySQL, migrated from an earlier Flask-based implementation. Supports role-based authentication, multi-car registration, real-time parking lot management, reservation tracking, and automated cost calculation.",
    technologies: ["PHP 7.4+", "MySQL", "PDO", "Bootstrap 5", "HTML5", "JavaScript"],
    highlights: ["Role-based admin and user access", "Multi-car registration per user", "Parking spot booking & cancellation", "Entry/exit tracking with cost calculation", "Flask-to-PHP system migration"],
  },
];

const STATUS_META = {
  "Completed":        { color: "#2DB526", label: "COMPLETED",       dot: false },
  "In Progress":      { color: "#FFA116", label: "IN PROGRESS",     dot: true  },
  "In Development":   { color: "#3B9EE8", label: "IN DEVELOPMENT",  dot: true  },
  "Production Ready": { color: "#2DB526", label: "PROD READY",      dot: false },
};

function useVisible(threshold = 0.08) {
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

function ProgressBar({ pct, color }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "#0a0e1a", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: filled ? `${pct}%` : "0%",
          background: `linear-gradient(90deg, ${color}55, ${color})`,
          transition: "width 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
          boxShadow: `0 0 8px ${color}44`,
        }} />
      </div>
      <span style={{
        fontSize: 14, fontWeight: 800, color,
        fontFamily: "'Syne', sans-serif", width: 34, textAlign: "right",
      }}>{pct}%</span>
    </div>
  );
}

function TechTag({ name, color }) {
  return (
    <span style={{
      background: `${color}0d`, border: `1px solid ${color}28`,
      color: `${color}cc`, borderRadius: 6,
      padding: "3px 9px", fontSize: 14,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>{name}</span>
  );
}

function ContributorTag({ name, color }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 800, color,
        fontFamily: "'JetBrains Mono', monospace",
      }}>{initials}</div>
      <span style={{ fontSize: 14, color: "#cbd5e1", fontFamily: "'JetBrains Mono', monospace" }}>
        {name}
      </span>
    </div>
  );
}

function ProjectCard({ project, index, visible, onClick }) {
  const [hovered, setHovered] = useState(false);
  const delay = `${0.06 + index * 0.09}s`;
  const sm = STATUS_META[project.status] || STATUS_META["In Development"];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(project)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `opacity 0.65s ease ${delay}, transform 0.65s ease ${delay}`,
        height: "100%",
      }}
    >
      <div style={{
        background: hovered
          ? `linear-gradient(140deg, ${project.glow} 0%, #0e1120 100%)`
          : "linear-gradient(140deg, #090b14 0%, #0c0f1c 100%)",
        border: `1px solid ${hovered ? project.color + "45" : "#141e32"}`,
        borderRadius: 18, padding: "22px 22px 20px",
        transition: "all 0.35s ease",
        boxShadow: hovered ? `0 8px 44px ${project.glow}, 0 0 0 1px ${project.color}10` : "none",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", gap: 16,
        cursor: "pointer",
        height: "100%",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "8%", right: "8%", height: 2,
          background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
          opacity: hovered ? 0.65 : 0.18, transition: "opacity 0.3s",
        }} />

        {/* Icon + Title + Status */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: `${project.color}10`, border: `1px solid ${project.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.3s",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}>
            <i className={project.icon} style={{ fontSize: 18, color: project.color }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 900,
              color: "#f0ece4", fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 3,
            }}>{project.title}</h3>
            <div style={{
              fontSize: 11, color: `${project.color}aa`,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.03em", lineHeight: 1.3,
            }}>{project.subtitle}</div>
          </div>

          <div style={{
            background: `${sm.color}10`, border: `1px solid ${sm.color}30`,
            borderRadius: 20, padding: "3px 10px",
            display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
          }}>
            {sm.dot && (
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: sm.color, animation: "pulse 2s infinite" }} />
            )}
            <span style={{ fontSize: 9, color: sm.color, letterSpacing: "0.12em", fontFamily: "'JetBrains Mono', monospace" }}>
              {sm.label}
            </span>
          </div>
        </div>

        {/* Description clamped to 3 lines */}
        <p style={{
          fontSize: 11, color: "#64748b",
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.8, letterSpacing: "0.02em",
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          flex: 1,
        }}>{project.description}</p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.technologies.slice(0, 4).map(t => (
            <TechTag key={t} name={t} color={project.color} />
          ))}
          {project.technologies.length > 4 && (
            <span style={{
              background: `${project.color}0d`, border: `1px solid ${project.color}28`,
              color: `${project.color}80`, borderRadius: 6,
              padding: "3px 9px", fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
            }}>+{project.technologies.length - 4} more</span>
          )}
        </div>

        {/* Click hint */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5,
          fontSize: 9, color: `${project.color}55`,
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em",
          opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
        }}>
          <span>VIEW DETAILS</span>
          <i className="fas fa-arrow-right" style={{ fontSize: 9 }} />
        </div>
      </div>
    </div>
  );
}

function Modal({ project, onClose }) {
  const sm = STATUS_META[project.status] || STATUS_META["In Development"];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9998,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      {/* ── Overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(4, 6, 14, 0.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* ── Modal ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 9999,
          width: "calc(100vw - 32px)",
          maxWidth: 600,
          maxHeight: "82vh",
          overflowY: "auto",
          overflowX: "hidden",
          background: "linear-gradient(140deg, #0d1021 0%, #0a0d1a 100%)",
          border: `1px solid ${project.color}40`,
          borderRadius: 22,
          boxShadow: `0 24px 80px ${project.glow}, 0 0 0 1px ${project.color}20`,
          animation: "modalPop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          scrollbarWidth: "thin",
          scrollbarColor: `${project.color}40 transparent`,
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "sticky", top: 0, height: 2, zIndex: 5,
          background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
        }} />

        {/* Close button — fixed inside modal top-right */}
        <button
          onClick={onClose}
          style={{
            position: "sticky",
            top: 10,
            float: "right",
            marginRight: 14,
            marginTop: 10,
            width: 38, height: 38, borderRadius: "50%",
            background: "#1a1f35",
            border: `2px solid ${project.color}70`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 20,
            transition: "all 0.2s ease",
            boxShadow: `0 0 14px ${project.color}40`,
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${project.color}35`;
            e.currentTarget.style.transform = "scale(1.12)";
            e.currentTarget.style.borderColor = project.color;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#1a1f35";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = `${project.color}70`;
          }}
        >
          <i className="fas fa-times" style={{ fontSize: 15, color: "#f0ece4" }} />
        </button>

        <div style={{ padding: "14px 24px 26px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20, paddingRight: 52 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: `${project.color}15`, border: `1px solid ${project.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className={project.icon} style={{ fontSize: 22, color: project.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                <h2 style={{
                  fontSize: "clamp(17px, 3vw, 22px)", fontWeight: 900,
                  color: "#f0ece4", fontFamily: "'Syne', sans-serif",
                  letterSpacing: "-0.02em", lineHeight: 1, margin: 0,
                }}>{project.title}</h2>
                <div style={{
                  background: `${sm.color}12`, border: `1px solid ${sm.color}30`,
                  borderRadius: 20, padding: "2px 10px",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  {sm.dot && <div style={{ width: 5, height: 5, borderRadius: "50%", background: sm.color, animation: "pulse 2s infinite" }} />}
                  <span style={{ fontSize: 9, color: sm.color, letterSpacing: "0.12em", fontFamily: "'JetBrains Mono', monospace" }}>{sm.label}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: `${project.color}99`, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
                {project.subtitle}
              </div>
            </div>
          </div>

          {/* Progress */}
          {project.statusPct < 100 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.14em", marginBottom: 6 }}>COMPLETION</div>
              <ProgressBar pct={project.statusPct} color={project.color} />
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.14em", marginBottom: 8 }}>ABOUT</div>
            <p style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.85, letterSpacing: "0.02em", margin: 0 }}>
              {project.description}
            </p>
          </div>

          {/* Highlights */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.14em", marginBottom: 8 }}>KEY FEATURES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {project.highlights.map(h => (
                <span key={h} style={{
                  background: `${project.color}0c`, border: `1px solid ${project.color}20`,
                  color: `${project.color}99`, borderRadius: 6,
                  padding: "4px 10px", fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}>
                  <i className="fas fa-check" style={{ fontSize: 8, color: project.color }} />
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.14em", marginBottom: 8 }}>TECH STACK</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {project.technologies.map(t => <TechTag key={t} name={t} color={project.color} />)}
            </div>
          </div>

          {/* Team */}
          <div style={{ borderTop: "1px solid #141e32", paddingTop: 16, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.14em", marginBottom: 8 }}>
                {project.team === "solo" ? "DEVELOPMENT" : "TEAM"}
              </div>
              {project.team === "solo" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${project.color}18`, border: `1px solid ${project.color}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fas fa-bolt" style={{ fontSize: 10, color: project.color }} />
                  </div>
                  <span style={{ fontSize: 11, color: `${project.color}cc`, fontFamily: "'JetBrains Mono', monospace" }}>Solo project</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {project.contributors.map(c => <ContributorTag key={c} name={c} color={project.color} />)}
                </div>
              )}
            </div>
            <div style={{ background: `${project.color}10`, border: `1px solid ${project.color}30`, borderRadius: 10, padding: "10px 18px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: project.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                {project.team === "solo" ? "1" : project.contributors.length + 1}
              </div>
              <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.14em", marginTop: 3 }}>
                {project.team === "solo" ? "AUTHOR" : "MEMBERS"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const Projects = () => {
  const [sectionRef, sectionVisible] = useVisible(0.06);
  const [activeProject, setActiveProject] = useState(null);

  const soloCount = projectsData.filter(p => p.team === "solo").length;
  const doneCount = projectsData.filter(p => p.statusPct === 100).length;

  return (
    <section
      id="projects"
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
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes modalPop { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
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
            <div style={{ height: 1, width: 32, background: "linear-gradient(90deg, transparent, #3B9EE8)" }} />
            <span style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.25em" }}>FEATURED WORK</span>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900,
            color: "#f0ece4", fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
          }}>
            Projects<span style={{ color: "#3B9EE8" }}>.</span>
          </h2>
          <p style={{
            marginTop: 12, fontSize: 14, color: "#94a3b8",
            letterSpacing: "0.08em", lineHeight: 1.6,
          }}>
            {projectsData.length} projects · {soloCount} solo · {doneCount} shipped
          </p>
        </div>

        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28,
          opacity: sectionVisible ? 1 : 0, transition: "opacity 0.6s ease 0.1s",
        }}>
          {[
            { label: "TOTAL PROJECTS", value: projectsData.length, color: "#3B9EE8" },
            { label: "SOLO BUILT",     value: soloCount,            color: "#FFA116" },
            { label: "SHIPPED",        value: doneCount,            color: "#2DB526" },
            { label: "IN PROGRESS",    value: projectsData.length - doneCount, color: "#C17A35" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#090b14", border: "1px solid #141e32",
              borderRadius: 10, padding: "10px 18px",
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.16em", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}>
          {projectsData.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} visible={sectionVisible} onClick={setActiveProject} />
          ))}
        </div>

        <div style={{
          marginTop: 40, display: "flex", alignItems: "center", gap: 12,
          opacity: sectionVisible ? 1 : 0, transition: "opacity 0.8s ease 0.6s",
        }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1a2235, transparent)" }} />
          <span style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.2em" }}>MORE PROJECTS ON GITHUB</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #1a2235)" }} />
        </div>
      </div>

      {activeProject && <Modal project={activeProject} onClose={() => setActiveProject(null)} />}
    </section>
  );
};

export default Projects;
