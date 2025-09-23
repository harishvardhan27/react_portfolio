import React from 'react';

const Internships = () => {
  const internshipData = [
    {
      position: "Backend Developer",
      company: "Agx Solutions",
      period: "Summer 2025",
      description: "worked as a backend developer, contributing to full-stack development project."
    },
     {
      position: "AI Intern (Backend)",
      company: "iEDEO Technologies",
      period: "Summer 2025",
      description: "Worked as AI intern focusing on backend development. Integrated several modules in their exam prep app for UPSC preparation."
    },
    {
      position: "ML Developer - Winter Intern",
      company: "TNAU (Tamil Nadu Agricultural University), Coimbatore via PDC(CIT)",
      period: "End 2024 - Begin 2025",
      description: "Developed ML models to identify occurrence of several rice diseases. Created an app for TNAU, Coimbatore to help farmers detect rice diseases early."
    }
  ];

  return (
    <section id="internships" className="internships">
      <div className="container">
        <h2 className="section-title">Internships</h2>
        <div className="timeline">
          {internshipData.map((internship, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>{internship.position}</h3>
                <div className="timeline-company">{internship.company}</div>
                <div className="timeline-date">{internship.period}</div>
                <p>{internship.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Internships;