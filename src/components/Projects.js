import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { SectionHead, CloseIcon, Chevron } from "./ui";

export const projectsData = [
  {
    id: "fundflow",
    links: [{ label: "Code", href: "https://github.com/harishvardhan27/fundflow" }],
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
    links: [{ label: "Code", href: "https://github.com/harishvardhan27/Pdf" }],
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
    links: [{ label: "Code", href: "https://github.com/harishvardhan27/IntelliSafe" }, { label: "Demo video", href: "https://drive.google.com/file/d/1gtr3NkLJ3RYGVcfHeC25SI3CYkBZKmyV/view?usp=drive_link" }],
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
    links: [{ label: "Code", href: "https://github.com/harishvardhan27/S.H.I.E.L.D" }],
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
    links: [{ label: "Code", href: "https://github.com/harishvardhan27/safeher2" }],
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
    id: "",
    title: "Immersive-Virtual-Reality-Platform-for-Visualizing-Complex-System-Behavior",
    links: [{ label: "Live demo", href: "https://immersive-virtual-reality-platform.vercel.app" }, { label: "Code", href: "https://github.com/harishvardhan27/Immersive-Virtual-Reality-Platform-for-Visualizing-Complex-System-Behavior" }],
    subtitle: "Immersive VR Platform",
    icon: "fas fa-vr-cardboard",
    color: "#0D6EFD",
    glow: "#0D6EFD20",
    status: "Completed",
    statusPct: 100,
    team: "collab",
    contributors: ["Akiladithya R", "Bala Murali S R","Maushmi B"],
    description: "An interactive 3D neural network visualization that shows how signals propagate through neurons in real-time. You can control it manually with sliders OR connect an Arduino with a sound sensor to make neurons fire based on real-world sound!",
    technologies: ["React", "Three.js", "Node.js", "Express", "VR Development", "3D Modeling", "Interactive UI"],
    highlights: ["3D system visualization", "Real-time data rendering", "Immersive VR experience", "Intuitive navigation controls"],
  },
  {
    id: "coding-mentor-bot",
    links: [{ label: "Code", href: "https://github.com/harishvardhan27/ThunderCode" }],
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
    links: [{ label: "Code", href: "https://github.com/harishvardhan27/PARKING_XML" }],
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
  "Completed":        { color: "#2DB526", label: "Completed",      live: false },
  "In Progress":      { color: "#FFA116", label: "In progress",    live: true  },
  "In Development":   { color: "#3B9EE8", label: "In development", live: true  },
  "Production Ready": { color: "#2DB526", label: "Prod ready",     live: false },
};

const isLong = (t) => t.length > 34;
const keyOf = (p, i) => p.id || `project-${i}`;
const teamSize = (p) => (p.team === "solo" ? 1 : p.contributors.length + 1);

const FILTERS = [
  { id: "all",      label: "Total projects", test: () => true },
  { id: "solo",     label: "Solo built",     test: (p) => p.team === "solo" },
  { id: "shipped",  label: "Shipped",        test: (p) => p.statusPct === 100 },
  { id: "progress", label: "In progress",    test: (p) => p.statusPct < 100 },
];

function StatusLabel({ project, className = "" }) {
  const sm = STATUS_META[project.status] || STATUS_META["In Development"];
  return (
    <span className={`status ${sm.live ? "status--live" : ""} ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      {sm.label}
    </span>
  );
}

/* ── Stack diagram: a small network drawn from each project's real stack ──
   hub = the project, ring = its technologies, satellites = key features   */
function seededRand(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x6d2b79f5) >>> 0; return (h % 10000) / 10000; };
}
const short = (s) => (s.length > 17 ? `${s.slice(0, 16)}…` : s);

function StackDiagram({ project, large = false }) {
  const rand = seededRand(project.title);
  const W = 360, H = 220, cx = W / 2, cy = H / 2 + 4;
  const techs = project.technologies;
  const n = techs.length;
  const off = rand() * Math.PI * 2;
  const pts = techs.map((t, i) => {
    const a = off + (i / n) * Math.PI * 2;
    const rx = 100 + rand() * 12, ry = 62 + rand() * 12;
    return { t, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  });
  const sats = project.highlights.map((_, i) => {
    const a = off + 0.5 + (i / project.highlights.length) * Math.PI * 2;
    return { x: cx + Math.cos(a) * 46, y: cy + Math.sin(a) * 30 };
  });
  const ring = pts.filter((_, i) => rand() > 0.45).map((p, i, arr) => [p, arr[(i + 1) % arr.length]]).filter(([a, b]) => a !== b);

  return (
    <div className={`diagram ${large ? "diagram--lg" : ""}`}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${project.title} stack: ${techs.join(", ")}`}>
        {ring.map(([a, b], i) => (
          <path key={`r${i}`} className="diagram__edge diagram__edge--ring" d={`M${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} />
        ))}
        {pts.map((p, i) => (
          <line key={`e${i}`} className="diagram__edge" x1={cx} y1={cy} x2={p.x} y2={p.y} style={{ "--i": i }} />
        ))}
        {sats.map((s, i) => (
          <g key={`s${i}`}>
            <line className="diagram__edge diagram__edge--sat" x1={cx} y1={cy} x2={s.x} y2={s.y} />
            <circle className="diagram__sat" cx={s.x} cy={s.y} r="3" />
          </g>
        ))}
        {pts.map((p, i) => (
          <g key={`n${i}`} className="diagram__node" style={{ "--i": i }}>
            <circle cx={p.x} cy={p.y} r="5.5" />
            <text x={p.x} y={p.y < cy ? p.y - 12 : p.y + 20} textAnchor="middle">{large ? p.t : short(p.t)}</text>
          </g>
        ))}
        <circle className="diagram__hub" cx={cx} cy={cy} r="24" />
      </svg>
      <i className={`${project.icon} diagram__icon`} aria-hidden="true" />
    </div>
  );
}

function ContributorTag({ name }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <li className="person">
      <span className="avatar">{initials}</span>
      <span>{name}</span>
    </li>
  );
}

function ProjectSheet({ project, index, onOpen }) {
  return (
    <article className="sheet">
      <StackDiagram project={project} />
      <div className="sheet__body">
        <StatusLabel project={project} />
        <h3 className={`display sheet__title ${isLong(project.title) ? "sheet__title--long" : ""}`}>{project.title}</h3>
        <p className="sheet__sub">{project.subtitle}</p>
        <p className="sheet__desc">{project.description}</p>
        <div className="sheet__foot">
          <span className="sheet__team">{project.team === "solo" ? "Solo project" : `Team of ${teamSize(project)}`}</span>
          {project.links && project.links.map((l) => (
            <a key={l.href} className="sheet__link" href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.label}: ${project.title}`} title={l.label}>
              <i className={l.label === "Code" ? "fab fa-github" : l.label === "Live demo" ? "fas fa-globe" : "fas fa-play"} aria-hidden="true" />
            </a>
          ))}
          <button type="button" className="btn btn--outline btn--sm" onClick={() => onOpen(index)} aria-haspopup="dialog">
            Open project<span className="sr-only">: {project.title}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function Drawer({ index, onClose, onNavigate }) {
  const project = projectsData[index];
  const [closing, setClosing] = useState(false);
  const [barIn, setBarIn] = useState(false);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);

  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
      if (e.key === "ArrowRight" && index < projectsData.length - 1) onNavigate(index + 1);
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onNavigate, requestClose]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus && prevFocus.focus && prevFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    setBarIn(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const t = setTimeout(() => setBarIn(true), 80);
    return () => clearTimeout(t);
  }, [index]);

  const onTrap = (e) => {
    if (e.key !== "Tab") return;
    const nodes = e.currentTarget.querySelectorAll("button:not([disabled]), a[href]");
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return createPortal(
    <div className={`drawer ${closing ? "is-closing" : ""}`}>
      <div className="drawer__scrim" onClick={requestClose} />
      <div className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onKeyDown={onTrap}>
        <div className="drawer__bar">
          <span>Project {index + 1} of {projectsData.length}</span>
          <div className="drawer__nav">
            <button type="button" className="icon-btn" aria-label="Previous project" disabled={index === 0} onClick={() => onNavigate(index - 1)}>
              <Chevron dir="left" />
            </button>
            <button type="button" className="icon-btn" aria-label="Next project" disabled={index === projectsData.length - 1} onClick={() => onNavigate(index + 1)}>
              <Chevron />
            </button>
            <button type="button" ref={closeRef} className="icon-btn icon-btn--ink" aria-label="Close" onClick={requestClose}>
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="drawer__scroll" ref={scrollRef}>
          <div className="drawer__cover" key={`c${index}`}>
            <StackDiagram project={project} large />
          </div>

          <div className="drawer__body" key={index}>
            <StatusLabel project={project} />
            <h2 id="drawer-title" className={`display drawer__title ${isLong(project.title) ? "drawer__title--long" : ""}`}>{project.title}</h2>
            <p className="drawer__sub">{project.subtitle}</p>

            {project.statusPct < 100 && (
              <div className="dblock">
                <h3 className="dblock__label">Completion</h3>
                <div className="completion">
                  <div className="completion__track">
                    <div className={`completion__fill ${barIn ? "is-in" : ""}`} style={{ "--pct": project.statusPct / 100 }} />
                  </div>
                  <span className="display completion__num">{project.statusPct}%</span>
                </div>
              </div>
            )}

            <div className="dblock">
              <h3 className="dblock__label">About</h3>
              <p>{project.description}</p>
            </div>

            <div className="dblock">
              <h3 className="dblock__label">Key features</h3>
              <ul className="features">
                {project.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
            </div>

            {project.links && (
              <div className="dblock">
                <h3 className="dblock__label">Links</h3>
                <div className="actions">
                  {project.links.map((l) => (
                    <a key={l.href} className={`btn btn--sm ${l.label === "Live demo" ? "btn--ink" : "btn--outline"}`} href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label === "Code" ? "View code on GitHub" : l.label === "Live demo" ? "Open live demo" : "Watch demo video"}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="dblock">
              <h3 className="dblock__label">Tech stack</h3>
              <ul className="tags">
                {project.technologies.map(t => <li key={t} className="tag">{t}</li>)}
              </ul>
            </div>

            <div className="dblock team">
              <div>
                <h3 className="dblock__label">{project.team === "solo" ? "Development" : "Team"}</h3>
                {project.team === "solo" ? (
                  <p className="person"><span className="avatar avatar--spark"><i className="fas fa-bolt" aria-hidden="true" /></span>Solo project</p>
                ) : (
                  <ul className="team__people">
                    {project.contributors.map(c => <ContributorTag key={c} name={c} />)}
                  </ul>
                )}
              </div>
              <p className="team__count">
                <strong className="display">{teamSize(project)}</strong>
                <span>{project.team === "solo" ? "Author" : "Members"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pinned, setPinned] = useState(false);
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const [outerH, setOuterH] = useState(0);

  const soloCount = projectsData.filter(p => p.team === "solo").length;
  const doneCount = projectsData.filter(p => p.statusPct === 100).length;
  const counts = { all: projectsData.length, solo: soloCount, shipped: doneCount, progress: projectsData.length - doneCount };

  const activeFilter = FILTERS.find(f => f.id === filter);
  const visible = projectsData.map((p, i) => ({ p, i })).filter(({ p }) => activeFilter.test(p));

  /* pinned horizontal scroll on wide screens; native swipe elsewhere */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener ? mq.addEventListener("change", apply) : mq.addListener(apply);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", apply) : mq.removeListener(apply));
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !pinned) { setOuterH(0); return; }
    const distance = Math.max(0, track.scrollWidth - window.innerWidth);
    setOuterH(window.innerHeight + distance);
  }, [pinned]);

  useLayoutEffect(() => { measure(); }, [measure, filter]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    trackRef.current && ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) { if (track) track.style.transform = ""; return undefined; }
    let raf = null;
    const update = () => {
      raf = null;
      const outer = outerRef.current;
      if (!outer) return;
      const r = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${-p * distance}px,0,0)`;
      outer.style.setProperty("--progress", p.toFixed(4));
    };
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [pinned, outerH]);

  /* when the filter changes while pinned, return to the start of the strip */
  const changeFilter = (id) => {
    setFilter(id);
    if (pinned && outerRef.current) {
      const top = outerRef.current.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "auto" });
    }
  };

  const closeDrawer = useCallback(() => setActiveIndex(null), []);

  // the footer workshop opens projects through this event
  useEffect(() => {
    const onOpen = (e) => { if (Number.isInteger(e.detail) && projectsData[e.detail]) setActiveIndex(e.detail); };
    window.addEventListener('open-project', onOpen);
    return () => window.removeEventListener('open-project', onOpen);
  }, []);

  return (
    <section id="projects" className="section section--lilac projects" data-surface="lilac" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead
          id="projects-title"
          title="Projects"
          note="Featured work"
          meta={`${projectsData.length} projects, ${soloCount} solo, ${doneCount} shipped`}
        />
        <div className="filters" role="group" aria-label="Filter projects">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              className={`filter ${filter === f.id ? "is-active" : ""}`}
              onClick={() => changeFilter(f.id)}
            >
              {f.label} <b>{counts[f.id]}</b>
            </button>
          ))}
        </div>
      </div>

      <div ref={outerRef} className={`hscroll ${pinned ? "is-pinned" : "is-native"}`} style={pinned && outerH ? { height: outerH } : undefined}>
        <div className="hscroll__sticky">
          <div className="hscroll__track" ref={trackRef}>
            {visible.map(({ p, i }, order) => (
              <div className="hscroll__item" key={keyOf(p, i)} style={{ "--i": order }}>
                <ProjectSheet project={p} index={i} onOpen={setActiveIndex} />
              </div>
            ))}
            <div className="hscroll__item hscroll__end">
              <a className="end-card" href="https://github.com/harishvardhan27" target="_blank" rel="noopener noreferrer">
                <span className="display">More projects on GitHub</span>
                <i className="fab fa-github" aria-hidden="true" />
              </a>
            </div>
          </div>
          {pinned && <div className="hscroll__progress" aria-hidden="true"><span /></div>}
        </div>
      </div>

      {activeIndex !== null && (
        <Drawer index={activeIndex} onClose={closeDrawer} onNavigate={setActiveIndex} />
      )}
    </section>
  );
};

export default Projects;
