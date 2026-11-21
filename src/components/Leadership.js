import { SectionHead } from './ui';

// Sources: LinkedIn experience + GitHub profile README
const leadershipData = [
  {
    id: 'cryptera-web',
    role: 'Lead Web Developer',
    org: 'Cryptera 2K26, National Level Symposium',
    period: 'Dec 2025 - Jan 2026',
    detail: 'Led the web development team for the symposium site, built with React.js.',
  },
  {
    id: 'cryptera-event',
    role: 'Event Coordinator',
    org: 'Cryptera 2K26',
    period: null,
    detail: null,
  },
  {
    id: 'placement',
    role: 'Placement Coordinator',
    org: 'Coimbatore Institute of Technology',
    period: null,
    detail: null,
  },
  {
    id: 'mandram',
    role: 'Joint Secretary',
    org: 'Muthamizh Mandram, CIT',
    period: null,
    detail: 'Leading cultural and tech initiatives on the CIT campus.',
  },
];

const certifications = [
  { id: 'ml-spec', name: 'Machine Learning Specialization', issuer: 'Coursera (Andrew Ng)', date: null, icon: 'fas fa-brain' },
  { id: 'hr-python', name: 'Python (Basic)', issuer: 'HackerRank', date: 'Mar 2024', icon: 'fab fa-python' },
  { id: 'hr-ps', name: 'Problem Solving (Basic)', issuer: 'HackerRank', date: 'Mar 2024', icon: 'fas fa-puzzle-piece' },
  { id: 'scaler-cpp', name: 'C++: Learning the Essentials', issuer: 'Scaler', date: 'Feb 2024', icon: 'fas fa-code' },
  { id: 'nec', name: "NEC '24 Advanced Track", issuer: 'E-Cell, IIT Bombay', date: null, icon: 'fas fa-rocket' },
];

const Leadership = () => {
  return (
    <section id="leadership" className="section section--paper leadership" aria-labelledby="leadership-title">
      <div className="container">
        <SectionHead id="leadership-title" title="Leadership" note="Beyond the code" meta={`${leadershipData.length} roles on campus and ${certifications.length} certifications`} />

        <div className="lead-grid">
          <ul className="roles">
            {leadershipData.map((r) => (
              <li key={r.id} className="role">
                <h3 className="display role__title">{r.role}</h3>
                <p className="role__org">{r.org}{r.period && <span className="role__period">{r.period}</span>}</p>
                {r.detail && <p className="role__detail">{r.detail}</p>}
              </li>
            ))}
          </ul>

          <div className="certs">
            <h3 className="note certs__title">Certifications</h3>
            <ul>
              {certifications.map((c) => (
                <li key={c.id} className="cert">
                  <span className="cert__icon"><i className={c.icon} aria-hidden="true" /></span>
                  <div>
                    <p className="cert__name">{c.name}</p>
                    <p className="cert__issuer">{c.issuer}{c.date && `, ${c.date}`}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
