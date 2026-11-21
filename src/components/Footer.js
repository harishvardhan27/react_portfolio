import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { scrollToId } from './ui';
import { projectsData } from './Projects';

// three.js only loads when the visitor approaches the footer
const Workshop = lazy(() => import('./Workshop'));

/* Telemetry for the workshop HUD, from the build-time stats snapshot */
function useTelemetry() {
  const [t, setT] = useState([
    { label: 'Problems solved', value: '1000+' },
    { label: 'Projects', value: String(projectsData.length) },
    { label: 'Internships', value: '6' },
  ]);
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL || ''}/coding-stats.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!s) return;
        const keys = ['leetcode', 'codeforces', 'codechef', 'gfg', 'codestudio', 'atcoder'];
        const solved = keys.reduce((sum, k) => sum + (s[k]?.solved?.total || 0), 0);
        const platforms = keys.filter((k) => s[k]).length + (s.hackerrank ? 1 : 0);
        const next = [];
        if (solved) next.push({ label: `Solved on ${platforms} platforms`, value: solved.toLocaleString() });
        if (s.leetcode?.contest?.rating) next.push({ label: `LeetCode ${s.leetcode.contest.badge || 'rating'}`, value: String(s.leetcode.contest.rating) });
        next.push({ label: 'Projects', value: String(projectsData.length) });
        setT(next);
      })
      .catch(() => {});
  }, []);
  return t;
}

function WorkshopSlot() {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const telemetry = useTelemetry();
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setNear(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const placeholder = <div className="workshop workshop--loading"><p className="hud__sys"><span className="hud__blink" aria-hidden="true" />Powering up the workshop</p></div>;
  return (
    <div ref={ref} className="workshop-slot">
      {near ? <Suspense fallback={placeholder}><Workshop telemetry={telemetry} /></Suspense> : placeholder}
    </div>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: 'fab fa-github', link: 'https://github.com/harishvardhan27', color: '#C17A35', label: 'GitHub' },
    { icon: 'fab fa-linkedin', link: 'https://linkedin.com/in/harishvardhan27', color: '#3B9EE8', label: 'LinkedIn' },
    { icon: 'fab fa-instagram', link: 'https://www.instagram.com/harish_vardhan27', color: '#E4405F', label: 'Instagram' },
    { icon: 'fas fa-envelope', link: 'mailto:harishvardhanwd@gmail.com', color: '#2DB526', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  const go = (e, id) => { e.preventDefault(); scrollToId(id); };

  return (
    <footer className="footer credits" data-surface="ink">
      <WorkshopSlot />

      <div className="container credits__body">
        <dl className="roll">
          <div className="roll__row">
            <dt>Starring</dt>
            <dd><strong>Harish Vardhan</strong><span>Full-stack developer & AI enthusiast building innovative solutions.</span></dd>
          </div>
          <div className="roll__row">
            <dt>Quick Links</dt>
            <dd>
              <ul className="roll__links">
                {quickLinks.map((link) => (
                  <li key={link.id}><a href={`#${link.id}`} onClick={(e) => go(e, link.id)}>{link.label}</a></li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="roll__row">
            <dt>Get In Touch</dt>
            <dd>
              <a href="mailto:harishvardhanwd@gmail.com">harishvardhanwd@gmail.com</a>
              <a href="tel:+919790016953">+91 97900 16953</a>
            </dd>
          </div>
          <div className="roll__row">
            <dt>Find him on</dt>
            <dd>
              <ul className="socials">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a href={social.link} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <i className={social.icon} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="roll__row">
            <dt>Built with</dt>
            <dd>React and three.js</dd>
          </div>
        </dl>

        <div className="footer__bar">
          <p>© {currentYear} Harish Vardhan. Built with React.</p>
          <p className="footer__avail"><span className="live-dot" aria-hidden="true" />Available</p>
          <button type="button" className="footer__top" onClick={() => scrollToId('home')}>Back to top</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
