import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .modern-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(6, 8, 16, 0.7);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }
        .modern-navbar.scrolled {
          background: rgba(6, 8, 16, 0.95);
          border-bottom: 1px solid #141e32;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 20px;
          color: #f0ece4;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .nav-logo h2 span {
          color: #3B9EE8;
        }
        .nav-menu {
          display: flex;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-menu li a {
          display: block;
          padding: 8px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #e2e8f0;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
        }
        .nav-menu li a:hover {
          color: #3B9EE8;
          background: #3B9EE812;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
        }
        .hamburger span {
          width: 24px;
          height: 2px;
          background: #f0ece4;
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .nav-menu {
            position: fixed;
            top: 60px;
            right: -100%;
            flex-direction: column;
            background: rgba(6, 8, 16, 0.98);
            width: 100%;
            padding: 24px;
            transition: right 0.3s ease;
            border-top: 1px solid #141e32;
          }
          .nav-menu.active { right: 0; }
        }
      `}</style>
      <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <h2>Harish<span>.</span></h2>
          </div>
          <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
            <li><a href="#about" onClick={() => scrollToSection('about')}>About</a></li>
            <li><a href="#skills" onClick={() => scrollToSection('skills')}>Skills</a></li>
            <li><a href="#projects" onClick={() => scrollToSection('projects')}>Projects</a></li>
            <li><a href="#coding" onClick={() => scrollToSection('coding')}>Coding</a></li>
            <li><a href="#achievements" onClick={() => scrollToSection('achievements')}>Achievements</a></li>
            <li><a href="#education" onClick={() => scrollToSection('education')}>Education</a></li>
            <li><a href="#internships" onClick={() => scrollToSection('internships')}>Internships</a></li>
            <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a></li>
          </ul>
          <div 
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;