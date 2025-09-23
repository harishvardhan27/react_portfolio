import React from 'react';

const Education = () => {
  const educationData = [
    {
      degree: "Bachelor of Technology (B.Tech)",
      institution: "Coimbatore Institute of Technology (CIT)",
      period: "2023-2027",
      description: "Specializing in software development, AI, and data structures."
    },
    {
      degree: "BS in Data Science and Applications",
      institution: "IIT MADRAS (Dual Degree Program)",
      period: "2023 - present",
      description: "Advanced coursework in data science, machine learning, and statistical analysis."
    }
  ];

  return (
    <section id="education" className="education">
      <div className="container">
        <h2 className="section-title">Education</h2>
        <div className="timeline">
          {educationData.map((edu, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>{edu.degree}</h3>
                <div className="timeline-company">{edu.institution}</div>
                <div className="timeline-date">{edu.period}</div>
                <p>{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;