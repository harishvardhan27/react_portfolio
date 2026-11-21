import React, { useState, useEffect, useRef } from 'react';
import { scrollToId } from './ui';

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'coding', label: 'Coding' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education', label: 'Education' },
  { id: 'internships', label: 'Internships' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [onDark, setOnDark] = useState(false);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = null;
    const update = () => {
      raf = null;
      const y = window.scrollY;
      setIsScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setIsHidden(y > lastY && y > window.innerHeight * 0.9);
        lastY = y;
      }
      // which surface sits under the bar?
      const probe = document.elementsFromPoint(window.innerWidth / 2, 36).find((el) => el.closest && el.closest('[data-surface]'));
      const surface = probe && probe.closest('[data-surface]');
      setOnDark(!!surface && surface.getAttribute('data-surface') === 'ink');
    };
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -54% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    const btn = menuBtnRef.current;
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      btn && btn.focus();
    };
  }, [isMobileMenuOpen]);

  const go = (e, id) => {
    e.preventDefault();
    const wasOpen = isMobileMenuOpen;
    setIsMobileMenuOpen(false);
    setTimeout(() => scrollToId(id), wasOpen ? 120 : 0);
  };

  const cls = [
    'nav',
    isScrolled ? 'is-scrolled' : '',
    isHidden && !isMobileMenuOpen ? 'is-hidden' : '',
    onDark && !isMobileMenuOpen ? 'is-dark' : '',
    isMobileMenuOpen ? 'is-open' : '',
  ].join(' ');

  return (
    <>
      <header className={cls}>
        <nav className="container nav__inner" aria-label="Primary">
          <a href="#home" className="brand" onClick={(e) => go(e, 'home')}>
            Harish<span aria-hidden="true">.</span>
          </a>

          <ul className="nav__links">
            {links.slice(1).map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={`nav__link ${active === l.id ? 'is-active' : ''}`}
                  aria-current={active === l.id ? 'true' : undefined}
                  onClick={(e) => go(e, l.id)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__right">
            <a href="/resume.pdf" download="Harish_Vardhan_Resume.pdf" className="btn btn--outline btn--sm nav__resume">
              Resume
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              className="menu-btn"
              aria-expanded={isMobileMenuOpen}
              aria-controls="site-menu"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
            >
              <span className="menu-btn__bars" aria-hidden="true" />
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </nav>
      </header>

      <div id="site-menu" className={`menu ${isMobileMenuOpen ? 'is-open' : ''}`} aria-hidden={!isMobileMenuOpen}>
        <ul className="menu__list">
          {links.map((l, i) => (
            <li key={l.id} style={{ '--i': i }}>
              <a
                href={`#${l.id}`}
                tabIndex={isMobileMenuOpen ? 0 : -1}
                className={`menu__link display ${active === l.id ? 'is-active' : ''}`}
                onClick={(e) => go(e, l.id)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <a href="mailto:harishvardhanwd@gmail.com" tabIndex={isMobileMenuOpen ? 0 : -1}>harishvardhanwd@gmail.com</a>
          <a href="/resume.pdf" download="Harish_Vardhan_Resume.pdf" tabIndex={isMobileMenuOpen ? 0 : -1}>Download resume</a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
