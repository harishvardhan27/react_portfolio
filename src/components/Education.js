import { SectionHead, Note, Scribble } from "./ui";

const schooling = [
  { level: "HSC", school: "Sathya Saai Matriculation Higher Secondary School", period: "2020 – 2022", grade: "90.6%" },
  { level: "SSLC", school: "Sacred Heart Matriculation Higher Secondary School", period: "Until 2020", grade: "99.0%" },
];

const educationData = [
  {
    id: "cit",
    degree: "Bachelor of Engineering",
    branch: "Computer Science & Engineering",
    institution: "Coimbatore Institute of Technology",
    shortName: "CIT",
    period: "2023 – 2027",
    status: "Ongoing",
    gpa: "8.10",
    color: "#3B9EE8",
    glow: "#3B9EE820",
    tag: "B.E.",
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
    period: "2024 – Present",
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

/* Timeline geometry derived from each programme's own period string */
const AXIS = [2023, 2024, 2025, 2026, 2027];
const LO = AXIS[0], HI = AXIS[AXIS.length - 1] + 1;
const toPct = (yr) => Math.max(0, Math.min(100, ((yr - LO) / (HI - LO)) * 100));
const nowYear = () => { const d = new Date(); return d.getFullYear() + d.getMonth() / 12; };
const span = (period) => {
  const [a, b] = period.split("–").map(s => s.trim());
  const start = parseInt(a, 10);
  const end = /^\d{4}$/.test(b) ? parseInt(b, 10) : null; // "Present" runs to today, then trails off
  const left = toPct(start);
  const right = end ? toPct(end) : Math.min(100, toPct(nowYear()) + 7);
  return { left: `${left}%`, width: `${right - left}%` };
};

const Education = () => {
  return (
    <section id="education" className="section section--paper education" aria-labelledby="education-title">
      <div className="container">
        <SectionHead id="education-title" title="Education" note="Academic background" meta="2 concurrent programs, pursuing since 2023" />

        <div className="span-chart" aria-hidden="true">
          <div className="span-chart__axis">{AXIS.map(y => <span key={y}>{y}</span>)}</div>
          <div className="span-chart__rows">
            <div className="span-chart__grid">{AXIS.map(y => <span key={y} />)}</div>
            <div className="span-chart__now" style={{ left: `${toPct(nowYear())}%` }}><span className="note">now</span></div>
            {educationData.map((edu, i) => (
              <div className="span-row" key={edu.id}>
                <div className={`span-bar span-bar--${i === 0 ? "a" : "b"}`} style={span(edu.period)}>
                  <strong>{edu.shortName}</strong>&nbsp; {edu.period}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="programs">
          {educationData.map((edu, i) => (
            <article className={`program program--${i === 0 ? "a" : "b"}`} key={edu.id}>
              <p className="program__tag"><span className="live-dot" aria-hidden="true" />{edu.tag}, {edu.status.toLowerCase()}</p>
              <p className="display program__short" aria-hidden="true">{edu.shortName}</p>
              <h3 className="program__degree">{edu.degree}</h3>
              <p className="program__branch">{edu.branch}</p>
              <p className="program__inst"><strong>{edu.institution}</strong><span>{edu.period}{edu.gpa && <>, CGPA <b>{edu.gpa}</b></>}</span></p>
              <p className="program__desc">{edu.description}</p>
              <ul className="tags">
                {edu.highlights.map((h) => <li key={h} className="tag">{h}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="schooling">
          <h3 className="note">Schooling</h3>
          <ul>
            {schooling.map((s) => (
              <li key={s.level}>
                <span className="display schooling__grade">{s.grade}</span>
                <span><strong>{s.level}</strong>, {s.school}<br /><span className="schooling__period">{s.period}</span></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sec-close">
          <Note>Pursuing dual degree simultaneously</Note>
          <Scribble />
        </div>
      </div>
    </section>
  );
};

export default Education;
