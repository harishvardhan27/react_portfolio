import React from 'react';

const Contact = () => {
  const interests = [
    { name: "Machine Learning", icon: "fas fa-brain" },
    { name: "Blockchain", icon: "fas fa-link" },
    { name: "Web Development", icon: "fas fa-code" },
    { name: "Data Science", icon: "fas fa-chart-bar" },
    { name: "Mobile Apps", icon: "fas fa-mobile-alt" }
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-text">
            <h3>Let's Connect!</h3>
            <p>I'm always excited to discuss new opportunities, collaborate on innovative projects, or simply chat about technology. If you're looking for someone to build modern, responsive websites or full-stack applications, and ML solutions, I'd love to help bring your ideas to life.</p>
            
            <div className="interests">
              <h4>Areas of Interest</h4>
              <div className="interest-tags">
                {interests.map((interest, index) => (
                  <span key={index}>
                    <i className={interest.icon}></i>
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="contact-info">
            <div className="contact-methods">
              <a href="mailto:harishvardhanwd@gmail.com" className="contact-method">
                <i className="fas fa-envelope"></i>
                <span>harishvardhanwd@gmail.com</span>
              </a>
              <a href="https://linkedin.com/in/harishvardhan" className="contact-method" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
                <span>LinkedIn Profile</span>
              </a>
              <a href="https://github.com/harishvardhan27" className="contact-method" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
                <span>GitHub Profile</span>
              </a>
              <a href="https://codolio.com/profile/Yugen27" className="contact-method" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-user-circle"></i>
                <span>Codolio Profile</span>
              </a>
              <a href="https://www.instagram.com/harish_vardhan27?igsh=MWNnaTF6Zzk2YjFsdQ==" className="contact-method" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
                <span>Instagram Profile</span>
              </a>
              <a href="tel:+91 97900 16953" className="contact-method">
                <i className="fas fa-phone"></i>
                <span>+91 97900 16953</span>
              </a>
            </div>
            
            <div className="cta-section">
              <h4>Ready to Collaborate?</h4>
              <p>I'm currently open for freelancing! Available for internship opportunities, freelance projects, and full-time positions in software development and AI.</p>
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                <a href="mailto:harishvardhanwd@gmail.com" className="btn-primary">Send Message</a>
                <a href="/resume.pdf" className="btn-secondary" download="Harish_Vardhan_Resume.pdf">
                  <i className="fas fa-download"></i> Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;