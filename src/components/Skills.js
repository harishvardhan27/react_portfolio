import React from 'react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: "fas fa-code",
      skills: ["Java", "Python", "C"]
    },
    {
      title: "Web & App Development",
      icon: "fas fa-laptop-code",
      skills: ["HTML", "CSS", "JavaScript", "React", "React Native", "Node.js"]
    },
    {
      title: "AI & ML",
      icon: "fas fa-brain",
      skills: ["TensorFlow", "CNNs", "DistilBERT"]
    },
    {
      title: "Other Tools",
      icon: "fas fa-tools",
      skills: ["MySQL,PostgreSQL", "Git", "Flask", "Streamlit", "Blockchain (Intermediate)"]
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <h3><i className={category.icon}></i> {category.title}</h3>
              <div className="skill-tags">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;