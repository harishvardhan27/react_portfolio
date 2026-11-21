import { SectionHead, Note } from './ui';

const achievements = [
  { icon: 'fas fa-trophy', label: 'Eureka\'24', sub: 'IIT Bombay', color: '#FFA116' },
  { icon: 'fas fa-medal', label: 'Pragyan\'25', sub: 'NIT Trichy', color: '#3B9EE8' },
  { icon: 'fas fa-bullseye', label: 'CodeVeda\'25', sub: 'Top 15 Finalist', color: '#2DB526' },
  { icon: 'fas fa-rocket', label: 'Hackfest\'24', sub: 'Top 3', color: '#C17A35' },
];

const stats = [
  { label: 'Problems Solved', value: '1000+', color: '#FFA116' },
  { label: 'Projects Built', value: '20+', color: '#3B9EE8' },
  { label: 'Certifications', value: '8+', color: '#2DB526' },
  { label: 'Hackathons', value: '10+', color: '#C17A35' },
];

const TILT = [-7, 5, -3, 8];

const About = () => {
  return (
    <section id="about" className="section section--paper about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead id="about-title" title="About" note="Who I am" />

        <div className="about__grid">
          <p className="about__lead">
            I'm a B.E. CSE student at Coimbatore Institute of Technology, simultaneously pursuing a BS in Data Science from IIT Madras. Passionate about building intelligent systems, full-stack applications, and solving real-world problems through code.
          </p>
          <p className="about__body">
            I thrive at the intersection of software engineering and AI — from competitive programming to deploying production-level ML models.
          </p>
        </div>

        <p className="about__stats">
          {stats.map((s, i) => (
            <span key={s.label} className="about__stat">
              <b className="display">{s.value}</b>
              <span>{s.label.toLowerCase()}{i < stats.length - 1 ? ',' : '.'}</span>
            </span>
          ))}
        </p>

        <div className="about__wins">
          <Note arrow className="about__wins-note">Highlights</Note>
          <ul className="stamps">
            {achievements.map((item, i) => (
              <li key={item.label} className="stamp" style={{ '--tilt': `${TILT[i]}deg` }}>
                <i className={item.icon} aria-hidden="true" />
                <strong className="display">{item.label}</strong>
                <span>{item.sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
