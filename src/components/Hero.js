import React from 'react';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
         <h1>Hi, I'm <span className="highlight">Harish Vardhan</span></h1>
          <h2>Software Developer & AI Specialist</h2>
          <p>Passionate technology enthusiast specializing in software development, AI, and data-driven solutions. I thrive on solving real-world problems and building innovative solutions.</p>
          <div className="hero-buttons">
            <a href="#projects" className="btn-primary" onClick={() => scrollToSection('projects')}>View My Work</a>
            <a href="#contact" className="btn-secondary" onClick={() => scrollToSection('contact')}>Get In Touch</a>
            <a href="/resume.pdf" className="btn-secondary" download="Harish_Vardhan_Resume.pdf">
              <i className="fas fa-download"></i> Download Resume
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="profile-card">
            <div className="profile-img">
              <img src="/profile.jpg" alt="Harish Vardhan" />
            </div>
            <div className="floating-icons">
              <i className="fab fa-python"></i>
              <i className="fab fa-java"></i>
              <i className="fab fa-react"></i>
              <i className="fas fa-brain"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;