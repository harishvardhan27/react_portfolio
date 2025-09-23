import React from 'react';

const Achievements = () => {
  const achievements = [
    {
      title: "Eureka'24 Zonalist",
      organization: "IIT Bombay",
      icon: "fas fa-trophy",
      year: "2024"
    },
    {
      title: "Pragyan'25 Runner-Up",
      organization: "NIT Trichy",
      icon: "fas fa-medal",
      year: "2025"
    },
    {
      title: "CodeVeda'25 Finalist",
      organization: "IITM & Manipal University",
      icon: "fas fa-award",
      year: "2025"
    },
    {
      title: "Hackfest'24 Third Place",
      organization: "CIT",
      icon: "fas fa-star",
      year: "2024"
    },
    {
      title: "Competitive Programming",
      organization: "(Codechef-1530, Codeforces-1205)",
      icon: "fas fa-code",
      year: "2025"
    }
  ];

  return (
    <section id="achievements" className="achievements">
      <div className="container">
        <h2 className="section-title">Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <div className="achievement-year">{achievement.year}</div>
              <div className="achievement-icon">
                <i className={achievement.icon}></i>
              </div>
              <h3>{achievement.title}</h3>
              <p>{achievement.organization}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;