import { SectionHead, Note, Scribble } from "./ui";

const achievementsData = [
  { id: "hackfest",  title: "Hackfest '24 Third Place",       organization: "CIT",                                     icon: "fas fa-award",     year: "2024", color: "#CD7F32", glow: "#CD7F3220" },
  { id: "sih2024",   title: "SIH 2024 Internal Winner",       organization: "Smart India Hackathon · Dept. Level",     icon: "fas fa-trophy",   year: "2024", color: "#C17A35", glow: "#C17A3520", detail: "Selected to represent CIT with a socially impactful project" },
  { id: "eureka",    title: "Eureka! 2024 Zonalist",          organization: "IIT Bombay",                             icon: "fas fa-star",     year: "2024", color: "#FFA116", glow: "#FFA11620", detail: "Ranked among the top 600 teams in India's leading startup challenge" },
  { id: "pragyan",   title: "Pragyan '25 Runner-Up",          organization: "NIT Trichy",                             icon: "fas fa-medal",    year: "2025", color: "#94a3b8", glow: "#94a3b820", detail: "Built a worker safety tech solution at NIT Trichy's national hackathon" },
  { id: "codeveda",  title: "CodeVeda '25 Finalist",          organization: "IITM & Manipal University",              icon: "fas fa-bullseye", year: "2025", color: "#3B9EE8", glow: "#3B9EE820", detail: "Top 15 of 150+ teams in a 72-hour national hackathon with IntelliSafe, an AI campus surveillance system" },
  { id: "sih2025",   title: "SIH 2025 Internal Winner",       organization: "Smart India Hackathon · Dept. Level",     icon: "fas fa-trophy",   year: "2025", color: "#FFA116", glow: "#FFA11620" },
  { id: "hackblitz", title: "HackBlitz Finalist",             organization: "Inter-College Hackathon",                icon: "fas fa-bolt",     year: "2024", color: "#2DB526", glow: "#2DB52620" },
  { id: "lcknight",  title: "LeetCode Knight",                organization: "LeetCode",                               icon: "fas fa-chess-knight", year: "2026", color: "#FFA116", glow: "#FFA11620", detail: "600+ problems solved and an 1850+ contest rating; best weekly contest rank 393" },
  { id: "innov",     title: "Innovation 2026 Winner",         organization: "CIT Innovation Challenge",               icon: "fas fa-lightbulb",year: "2026", color: "#7B61FF", glow: "#7B61FF20" },
  { id: "cp",        title: "1000+ DSA & CP Problems Solved", organization: "LeetCode · CodeChef · Codeforces & more", icon: "fas fa-code",    year: "2025", color: "#FF375F", glow: "#FF375F20" },
];

const Achievements = () => {
  const years = [...new Set(achievementsData.map(a => a.year))].sort((a, b) => b - a);
  const groups = years.map(y => ({ year: y, items: achievementsData.filter(a => a.year === y) }));

  return (
    <section id="achievements" className="section section--paper achievements" aria-labelledby="achievements-title">
      <div className="container">
        <SectionHead
          id="achievements-title"
          title="Achievements"
          note="Recognition"
          meta={`${achievementsData.length} recognitions: hackathons, competitions & milestones`}
        />

        <ol className="years">
          {groups.map((g) => (
            <li className="year" key={g.year}>
              <h3 className="display year__num">{g.year}</h3>
              <ul className="year__items">
                {g.items.map((a) => (
                  <li className="win" key={a.id}>
                    <span className="win__icon"><i className={a.icon} aria-hidden="true" /></span>
                    <div>
                      <p className="win__title">{a.title}</p>
                      <p className="win__org">{a.organization}</p>
                      {a.detail && <p className="win__detail">{a.detail}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="sec-close">
          <Note>Competing, building, winning</Note>
          <Scribble />
        </div>
      </div>
    </section>
  );
};

export default Achievements;
