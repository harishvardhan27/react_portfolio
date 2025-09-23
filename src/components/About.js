import React from 'react';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>I am Harish Vardhan, a passionate technology enthusiast specializing in software development, AI, and data-driven solutions. I thrive on solving real-world problems and building innovative solutions.</p>
            <p>I have been recognized as a Eureka IIT Bombay 2024 Zonalist, Runner-Up at Pragyan 2025 (NIT Trichy), and a finalist at CodeVeda 25. I also earned Runner-Up and Third Place at Hackfest 2024.</p>
            <p>I enjoy exploring cutting-edge technologies like machine learning, blockchain and data science. I am highly proficient in problem-solving, designing efficient algorithms, and implementing practical solutions. I am open to collaborations, internships, and opportunities where I can make an impact.</p>
            <div className="about-highlights">
              <div className="highlight-item">
                <i className="fas fa-trophy"></i>
                <span>Eureka'24 (IIT Bombay) Zonalist</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-medal"></i>
                <span>Pragyan'25 (NIT Trichy) Runner-Up</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-award"></i>
                <span>CodeVeda'25 (IITM & MANIPAL UNIVERSITY) Finalist</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-star"></i>
                <span>Hackfest'24 (CIT) Third Place</span>
              </div>
            </div>
          </div>
          <div className="about-stats">
            <div className="stat-item">
              <h3>5+</h3>
              <p>Major Projects</p>
            </div>
            <div className="stat-item">
              <h3>10+</h3>
              <p>Technologies</p>
            </div>
            <div className="stat-item">
              <h3>4+</h3>
              <p>Awards Won</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;