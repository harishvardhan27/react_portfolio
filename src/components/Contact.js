import { useState, useRef } from 'react';
import NeuralField from './NeuralField';
import { skillCategories } from './Skills';
import { Note } from './ui';

const contactMethods = [
  { icon: "fas fa-envelope", label: "Email", value: "harishvardhanwd@gmail.com", link: "mailto:harishvardhanwd@gmail.com", color: "#3B9EE8" },
  { icon: "fab fa-linkedin", label: "LinkedIn", value: "harishvardhan", link: "https://linkedin.com/in/harishvardhan27", color: "#0077B5" },
  { icon: "fab fa-github", label: "GitHub", value: "harishvardhan27", link: "https://github.com/harishvardhan27", color: "#C17A35" },
  { icon: "fas fa-user-circle", label: "Codolio", value: "Yugen27", link: "https://codolio.com/profile/Yugen27", color: "#2DB526" },
  { icon: "fab fa-instagram", label: "Instagram", value: "harish_vardhan27", link: "https://www.instagram.com/harish_vardhan27?igsh=MWNnaTF6Zzk2YjFsdQ==", color: "#E4405F" },
  { icon: "fas fa-phone", label: "Phone", value: "+91 97900 16953", link: "tel:+919790016953", color: "#FFA116" },
];

const interests = [
  "Machine Learning", "Blockchain", "Web Development", "Data Science", "Mobile Apps", "Cloud Computing"
];

const EMAIL = "harishvardhanwd@gmail.com";
const FIELD_CENTER = [0.8, 0.24];

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const sectionRef = useRef(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="section section--lilac contact" data-surface="lilac" aria-labelledby="contact-title">
      <NeuralField clusters={skillCategories} filler={30} center={FIELD_CENTER} scale={0.24} interactionRef={sectionRef} showLabels={false} quiet seed={9} className="contact__field" />

      <div className="container contact__inner">
        <Note arrow className="contact__kicker">Let's connect</Note>
        <h2 className="display contact__title" id="contact-title">Get In Touch.</h2>

        <div className="contact__intro">
          <p className="contact__p">
            I'm always excited to discuss new opportunities, collaborate on innovative projects, or simply chat about technology.
            Open for internships, freelance projects, and full-time positions in software development and AI.
          </p>
          <p className="note contact__avail"><span className="live-dot" aria-hidden="true" />Available for opportunities</p>
        </div>

        <div className="contact__mail">
          <a className="contact__email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <button type="button" className={`copy-btn ${copied ? 'is-done' : ''}`} onClick={copyEmail}>
            <i className={copied ? 'fas fa-check' : 'far fa-copy'} aria-hidden="true" />
            <span aria-live="polite">{copied ? 'Copied to clipboard' : 'Copy email'}</span>
          </button>
        </div>

        <div className="contact__grid">
          <div className="contact__col">
            <h3 className="contact__h">Quick Actions</h3>
            <div className="actions">
              <a href={`mailto:${EMAIL}`} className="btn btn--ink">Send Message</a>
              <a href="/resume.pdf" download="Harish_Vardhan_Resume.pdf" className="btn btn--outline">Download Resume</a>
            </div>

            <h3 className="contact__h">Areas of Interest</h3>
            <ul className="tags tags--lg">
              {interests.map((interest) => <li key={interest} className="tag">{interest}</li>)}
            </ul>
          </div>

          <ul className="channels">
            {contactMethods.map((method) => {
              const external = method.link.startsWith('http');
              return (
                <li key={method.label}>
                  <a className="channel" href={method.link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
                    <i className={method.icon} aria-hidden="true" />
                    <span className="channel__label">{method.label}</span>
                    <span className="channel__value">{method.value}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contact;
