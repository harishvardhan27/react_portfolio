export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};

/* Hand-drawn arrow, same monoline weight as the illustration */
export function HandArrow({ className = '' }) {
  return (
    <svg className={`hand-arrow ${className}`} viewBox="0 0 64 48" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6c14-3 30 2 40 14 5 6 7 13 8 20" />
      <path d="M44 33l8 8 5-11" />
    </svg>
  );
}

/* Handwritten margin note. `arrow` points from the note toward its subject. */
export function Note({ children, arrow = false, className = '', as: Tag = 'p' }) {
  return (
    <Tag className={`note ${className}`}>
      <span>{children}</span>
      {arrow && <HandArrow />}
    </Tag>
  );
}

/* Rough ink underline drawn under a word or line */
export function Scribble({ className = '' }) {
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 200 14" preserveAspectRatio="none" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M2 9c30-5 62-6 96-4 32 2 64 1 100-3" />
      <path d="M14 12c40-3 92-4 150-2" opacity=".55" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function Chevron({ dir = 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function SectionHead({ title, note, meta, children, id }) {
  return (
    <header className="sec-head">
      <div className="sec-head__row">
        <h2 className="display sec-title" id={id}>{title}.</h2>
        {note && <Note arrow className="sec-head__note">{note}</Note>}
      </div>
      {meta && <p className="sec-meta">{meta}</p>}
      {children}
    </header>
  );
}
