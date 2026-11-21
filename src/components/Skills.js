import { SectionHead, Note, Scribble } from "./ui";

export const skillCategories = [
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

const Skills = () => {
  const totalSkills = skillCategories.reduce((s, c) => s + c.skills.length, 0);

  const summary = [
    { label: "Total skills", value: totalSkills },
    { label: "Domains",      value: skillCategories.length },
    { label: "Projects",     value: "8+" },
    { label: "Internships",  value: "6" },
  ];

  return (
    <section id="skills" className="section section--paper skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead id="skills-title" title="Skills" note="Technical stack" meta={`${totalSkills} technologies across ${skillCategories.length} domains`}>
          <dl className="tally">
            {summary.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd className="display">{s.value}</dd>
              </div>
            ))}
          </dl>
        </SectionHead>

        <div className="skillsets">
          {skillCategories.map((cat) => (
            <section key={cat.id} className="skillset" aria-label={cat.title}>
              <h3 className="skillset__title">
                {cat.title}
                <span className="skillset__count">{cat.skills.length}</span>
              </h3>
              <ul className="skillset__list">
                {cat.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </section>
          ))}
        </div>

        <div className="skills__close">
          <Note>Always learning, always building</Note>
          <Scribble />
        </div>
      </div>
    </section>
  );
};

export default Skills;
