import { useState, useEffect, useRef } from "react";
import { SectionHead, HandArrow, prefersReducedMotion } from "./ui";

// ── CONFIRMED REAL DATA ───────────────────────────────────────────────────────
const HARISH_DATA = {
  name: "Harish Vardhan D",
  college: "Coimbatore Institute of Technology",
  location: "Coimbatore, India",

  codechef: {
    platform: "CodeChef", username: "harish_vardhan",
    profileUrl: "https://www.codechef.com/users/harish_vardhan",
    solved: { total: 56 },
    rating: 1462, highestRating: 1651,
    stars: 2, division: "Div 3",
    globalRank: 32253, countryRank: 29815,
    contests: 14,
    badges: ["Contest Contender · Bronze", "Problem Solver · Bronze"],
    lastUpdated: "Feb 28, 2026",
  },

  // Populated at runtime by the backend — shape mirrors server response
  leetcode:   { platform: "LeetCode",      username: "HarishVardhan27",   profileUrl: "https://leetcode.com/u/HarishVardhan27/" },
  codeforces: { platform: "Codeforces",    username: "HarishVardhan27",   profileUrl: "https://codeforces.com/profile/HarishVardhan27" },
  gfg:        { platform: "GeeksforGeeks", username: "harishvawvad",      profileUrl: "https://www.geeksforgeeks.org/profile/harishvawvad" },
  hackerrank: { platform: "HackerRank",    username: "harishvardhanwd",   profileUrl: "https://www.hackerrank.com/profile/harishvardhanwd" },
  codestudio: { platform: "CodeStudio",    username: "harishVardhan",     profileUrl: "https://www.naukri.com/code360/profile/harishVardhan" },
};

const PLATFORM_META = {
  codechef:   { color: "#C17A35", glow: "#C17A3540", text: "CC", bg: "#1a1208" },
  leetcode:   { color: "#FFA116", glow: "#FFA11640", text: "LC", bg: "#1a1100" },
  codeforces: { color: "#3B9EE8", glow: "#3B9EE840", text: "CF", bg: "#08121a" },
  gfg:        { color: "#2DB526", glow: "#2DB52640", text: "GG", bg: "#081a08" },
  hackerrank: { color: "#00EA64", glow: "#00EA6440", text: "HR", bg: "#001a0d" },
  codestudio: { color: "#F1641E", glow: "#F1641E40", text: "CS", bg: "#1a0a04" },
};

// ── MOCK DATA (shown when backend is offline) ────────────────────────────────
const MOCK_CODEFORCES = {
  platform: "Codeforces", username: "HarishVardhan27",
  profileUrl: "https://codeforces.com/profile/HarishVardhan27",
  solved: { total: 124, byIndex: { A: 58, B: 38, C: 19, D: 7, "E+": 2 } },
  rating: 1277, maxRating: 1277,
  rank: "Pupil", maxRank: "Pupil",
  rankColour: "#008000",
  contests: { count: 17, bestRank: 2841, worstRank: 8204, maxRatingGain: 87, maxRatingDrop: -62 },
  lastUpdated: new Date().toISOString(),
  _mock: true,
};

const MOCK_HACKERRANK = {
  platform: "HackerRank", username: "harishvardhanwd",
  profileUrl: "https://www.hackerrank.com/profile/harishvardhanwd",
  solved: { total: 47 },
  badges: [
    { name: "Problem Solving", stars: 3, level: "Gold"   },
    { name: "Python",          stars: 3, level: "Gold"   },
    { name: "SQL",             stars: 2, level: "Silver" },
    { name: "Java",            stars: 1, level: "Bronze" },
  ],
  totalBadges: 4, totalStars: 9,
  name: "Harish Vardhan D",
  school: "Coimbatore Institute of Technology",
  lastUpdated: new Date().toISOString(),
  _mock: true,
};

const MOCK_LEETCODE = {
  platform: "LeetCode", username: "HarishVardhan27",
  profileUrl: "https://leetcode.com/u/HarishVardhan27/",
  solved: { total: 183, easy: 72, medium: 94, hard: 17 },
  beats: { easy: "68.4", medium: "52.1", hard: "31.7" },
  globalRanking: 412847,
  reputation: 0,
  contest: { attended: 8, rating: 2061, globalRank: 28541, topPercentage: "22.14", badge: null },
  badges: ["50 Days Badge 2024"],
  activeBadge: "50 Days Badge 2024",
  lastUpdated: new Date().toISOString(),
  _mock: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTEBOOK PRIMITIVES — stats drawn in ink on graph paper
// ─────────────────────────────────────────────────────────────────────────────
// Profiles added after the original data block
const EXTRA_PROFILES = {
  atcoder: { platform: "AtCoder", username: "HarishVardhan27", profileUrl: "https://atcoder.jp/users/HarishVardhan27", text: "AC" },
};

const fmtTime = (d) => new Date(d).toLocaleTimeString();
const pct = (v, max) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;

// Official Codeforces rating ladder
const CF_LADDER = [
  { name: "newbie", from: 0, to: 1200 },
  { name: "pupil", from: 1200, to: 1400 },
  { name: "specialist", from: 1400, to: 1600 },
  { name: "expert", from: 1600, to: 1900 },
  { name: "candidate master", from: 1900, to: 2100 },
  { name: "master", from: 2100, to: 2300 },
  { name: "international master", from: 2300, to: 2400 },
  { name: "grandmaster", from: 2400, to: 2600 },
  { name: "international grandmaster", from: 2600, to: 3000 },
  { name: "legendary grandmaster", from: 3000, to: 3500 },
];

/* Hand-drawn ink loop around a number */
function Circled({ children }) {
  return (
    <span className="circled">
      {children}
      <svg className="circled__ink" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M104 7C52 3 9 22 7 50c-2 30 46 45 102 43 52-2 86-19 84-45C191 22 152 6 98 10" />
      </svg>
    </span>
  );
}

function Ann({ children, className = "" }) {
  return (
    <p className={`note nb__ann ${className}`}>
      <HandArrow />
      <span>{children}</span>
    </p>
  );
}

/* A ruler on graph paper: ticks, optional rank bands, peak + current marks */
function Ruler({ value, peak, max, step, bands, current, label, suffix = "" }) {
  const ticks = [];
  for (let t = 0; t <= max; t += step) ticks.push(t);
  return (
    <div className="ruler">
      {label && <div className="ruler__label"><span>{label}</span>{peak !== undefined && <span>Peak: <b className="ruler__num">{peak}</b></span>}</div>}
      <div className={`ruler__body ${bands ? "ruler__body--bands" : ""}`}>
        <div className="ruler__line">
          {ticks.map((t, i) => (
            <span key={t} className={`ruler__tick ${i === 0 ? "is-first" : ""} ${i === ticks.length - 1 ? "is-last" : ""}`} style={{ left: pct(t, max) }}><i>{t}</i></span>
          ))}
          {peak !== undefined && peak !== value && (
            <span className="ruler__peak" style={{ left: pct(peak, max) }} aria-hidden="true" />
          )}
          <span className="ruler__mark" style={{ "--to": pct(value, max) }}>
            <b>{value}{suffix}</b>
          </span>
        </div>
        {bands && (
          <div className="ruler__bands" aria-hidden="true">
            {bands.map((b, i) => (
              <span key={b.name} className={`ruler__band ${b.name === current ? "is-current" : ""} ${i % 2 ? "is-alt" : ""}`}
                style={{ left: pct(b.from, max), width: pct(b.to - b.from, max) }}>
                {b.name === current && <em>{b.name}</em>}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatLine({ items }) {
  return (
    <p className="nb__line">
      {items.map((it, i) => (
        <span key={it.label}>
          <b className="display">{it.value ?? "—"}</b> {it.label.toLowerCase()}{i < items.length - 1 ? ", " : "."}
        </span>
      ))}
    </p>
  );
}

const freshness = (d) => (d?._mock
  ? "Demo data"
  : d?._snapshot
    ? `Updated ${new Date(d.lastUpdated).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`
    : "Live");

function NbHead({ platform, username, profileUrl, mock, data, live = true, children }) {
  const label = data ? freshness(data) : mock ? "Demo data" : "Live";
  const isLive = label === "Live";
  return (
    <header className="nb__head">
      <h3 className="display nb__name">{platform}</h3>
      {children}
      <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="nb__user">@{username}</a>
      {live && (
        <span className={`note nb__status ${isLive ? "" : "is-mock"}`}>
          <span className={isLive ? "live-dot" : "nb__dot"} aria-hidden="true" />{label}
        </span>
      )}
    </header>
  );
}

function NbFoot({ data, short }) {
  return (
    <p className="nb__foot">
      <span>Data fetched {data._mock ? "(demo data)" : data._snapshot ? `${new Date(data.lastUpdated).toLocaleDateString()} (build snapshot)` : `${fmtTime(data.lastUpdated)} (live)`}</span>
      {data._mock && <span className="note">{short ? "Mock" : "Mock — run npm run stats to fetch real data"}</span>}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODECHEF (not rendered — kept for future use)
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function CodeChefCard({ data }) {
  return (
    <article className="nb">
      <NbHead platform="CodeChef" username={data.username} profileUrl={data.profileUrl} mock={false}>
        <span className="nb__chip">{data.stars}★ · {data.division}</span>
      </NbHead>
      <div className="nb__hero">
        <div><Circled><strong className="display nb__big">{data.solved.total}</strong></Circled><Ann>problems solved</Ann></div>
        <div className="r"><strong className="display nb__mid">{data.rating}</strong><p className="nb__sub">Current rating, peak {data.highestRating}</p></div>
      </div>
      <Ruler value={data.rating} peak={data.highestRating} max={3000} step={500} label="Progress /3000" />
      <StatLine items={[
        { label: "Contests participated", value: data.contests },
        { label: "Global rank", value: `#${data.globalRank.toLocaleString()}` },
        { label: "India rank", value: `#${data.countryRank.toLocaleString()}` },
      ]} />
      <ul className="tags">{data.badges.map((b, i) => <li key={i} className="tag">{b}</li>)}</ul>
      <p className="nb__foot"><span>Data fetched {data.lastUpdated}</span></p>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEETCODE
// ─────────────────────────────────────────────────────────────────────────────
function LeetCodeCard({ data }) {
  const { solved, beats, contest } = data;
  const total  = solved?.total  || 0;
  const easy   = solved?.easy   || 0;
  const medium = solved?.medium || 0;
  const hard   = solved?.hard   || 0;
  const contestRating = contest?.rating || 0;
  const split = [
    { label: "Easy", count: easy, cls: "is-easy" },
    { label: "Medium", count: medium, cls: "is-medium" },
    { label: "Hard", count: hard, cls: "is-hard" },
  ];

  return (
    <article className="nb">
      <NbHead platform="LeetCode" username={data.username} profileUrl={data.profileUrl} data={data}>
        {contest?.badge && <span className="nb__chip">{contest.badge}</span>}
      </NbHead>

      <div className="nb__hero">
        <div>
          <Circled><strong className="display nb__big">{total}</strong></Circled>
          <Ann>problems solved</Ann>
          <p className="nb__sub">Rank #{(data.globalRanking || 0).toLocaleString()}</p>
        </div>
        {contest && (
          <div className="r">
            <strong className="display nb__mid nb__hl">{contest.rating}</strong>
            <p className="note">contest rating</p>
            <p className="nb__sub">Top {contest.topPercentage}%</p>
          </div>
        )}
      </div>

      <div className="nb__block">
        <h4 className="nb__label">Difficulty split</h4>
        <div className="split">
          {split.map((d) => (
            <div key={d.label} className={`split__seg ${d.cls}`} style={{ flexGrow: d.count || 1 }}>
              <span className="split__bar" />
              <span className="split__lbl"><b className="display">{d.count}</b> {d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {beats && (beats.easy || beats.medium || beats.hard) && (
        <div className="nb__block">
          <h4 className="nb__label">Beats % (users outperformed)</h4>
          <div className="beats">
            {[
              { label: "Easy", val: beats.easy },
              { label: "Medium", val: beats.medium },
              { label: "Hard", val: beats.hard },
            ].map((b) => b.val && (
              <div key={b.label} className="beats__row">
                <span className="beats__k">{b.label}</span>
                <Ruler value={parseFloat(b.val)} max={100} step={25} suffix="%" />
              </div>
            ))}
          </div>
        </div>
      )}

      {contest && (
        <StatLine items={[
          { label: "Contests attended", value: contest.attended },
          { label: "Global rank", value: `#${(contest.globalRank || 0).toLocaleString()}` },
          { label: "Top %", value: `${contest.topPercentage}%` },
        ]} />
      )}

      {contestRating > 0 && (
        <Ruler value={contestRating} peak={contestRating} max={3500} step={500} label="Progress /3500" />
      )}

      <NbFoot data={data} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODEFORCES
// ─────────────────────────────────────────────────────────────────────────────
function CodeforcesCard({ data }) {
  const byIndex   = data.solved?.byIndex || {};
  const indexKeys = ["A", "B", "C", "D", "E+"];
  const maxIdx    = Math.max(...indexKeys.map(k => byIndex[k] || 0), 1);
  const rank      = (data.rank || "unranked").toLowerCase();

  return (
    <article className="nb">
      <NbHead platform="Codeforces" username={data.username} profileUrl={data.profileUrl} data={data}>
        <span className="nb__chip">{data.rank || "unranked"}</span>
      </NbHead>

      <div className="nb__hero">
        <div>
          <Circled><strong className="display nb__big">{data.solved?.total || 0}</strong></Circled>
          <Ann>problems solved</Ann>
          <p className="nb__sub">Max rank {data.maxRank}</p>
        </div>
        <div className="r">
          <strong className="display nb__mid nb__hl">{data.rating || 0}</strong>
          <p className="note">current rating</p>
          <p className="nb__sub">Peak {data.maxRating || 0}</p>
        </div>
      </div>

      <div className="nb__block">
        <Ruler value={data.rating || 0} peak={data.maxRating || 0} max={3500} step={500}
          bands={CF_LADDER} current={rank} label="Progress /3500 on the rating ladder" />
      </div>

      <StatLine items={[
        { label: "Contests", value: data.contests?.count || 0 },
        { label: "Best rank", value: data.contests?.bestRank ? `#${data.contests.bestRank.toLocaleString()}` : "—" },
        { label: "Max gain", value: data.contests?.maxRatingGain > 0 ? `+${data.contests.maxRatingGain}` : "—" },
        { label: "Max drop", value: data.contests?.maxRatingDrop < 0 ? `${data.contests.maxRatingDrop}` : "—" },
      ]} />

      {Object.keys(byIndex).length > 0 && (
        <div className="nb__block">
          <h4 className="nb__label">Problems by index</h4>
          <div className="plot">
            {indexKeys.map((k, i) => {
              const val = byIndex[k] || 0;
              return (
                <div key={k} className="plot__col" style={{ "--i": i }}>
                  <span className="display plot__n">{val}</span>
                  <span className="plot__bar" style={{ height: `${Math.max((val / maxIdx) * 100, 3)}%` }} />
                  <span className="plot__k">{k}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <NbFoot data={data} short />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HACKERRANK (not rendered — kept for future use)
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function HackerRankCard({ data }) {
  const badges      = data.badges || [];
  const totalStars  = data.totalStars || badges.reduce((s, b) => s + (b.stars || 0), 0);
  const totalBadges = data.totalBadges || badges.length;
  const sorted      = [...badges].sort((a, b) => (b.stars || 0) - (a.stars || 0));
  return (
    <article className="nb">
      <NbHead platform="HackerRank" username={data.username} profileUrl={data.profileUrl} mock={data._mock} />
      <div className="nb__hero">
        <div><Circled><strong className="display nb__big">{totalBadges}</strong></Circled><Ann>total badges</Ann>{data.school && <p className="nb__sub">{data.school}</p>}</div>
        <div className="r"><strong className="display nb__mid nb__hl">★ {totalStars}</strong><p className="note">total stars</p></div>
      </div>
      {(data.solved?.total || 0) > 0
        ? <StatLine items={[{ label: "Problems solved", value: data.solved.total }]} />
        : <p className="nb__sub">HackerRank tracks progress via badges &amp; stars, not a raw solved count. Their profile page is client-side rendered — the metrics above are the real primary data.</p>}
      {sorted.length > 0 && (
        <ul className="tags">{sorted.slice(0, 8).map((b, i) => <li key={i} className="tag">{b.name} {"★".repeat(b.stars || 0)}{b.level ? ` · ${b.level}` : ""}</li>)}</ul>
      )}
      <NbFoot data={data} short />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC (GFG, CodeStudio — not rendered)
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function GenericLiveCard({ data, pkey }) {
  const extras = [];
  if (pkey === "gfg") {
    if (data.codingScore)  extras.push({ label: "Score",      value: data.codingScore });
    if (data.streak?.max)  extras.push({ label: "Max streak", value: data.streak.max });
    if (data.solved?.hard) extras.push({ label: "Hard",       value: data.solved.hard });
  }
  if (pkey === "codestudio") {
    if (data.rating)     extras.push({ label: "Score", value: data.rating });
    if (data.globalRank) extras.push({ label: "Rank",  value: data.globalRank });
  }
  return (
    <article className="nb">
      <NbHead platform={data.platform} username={data.username} profileUrl={data.profileUrl} mock={data._mock} />
      <div className="nb__hero"><div><Circled><strong className="display nb__big">{data?.solved?.total || 0}</strong></Circled><Ann>problems solved</Ann></div></div>
      {extras.length > 0 && <StatLine items={extras} />}
      <p className="nb__foot"><span>Updated {fmtTime(data.lastUpdated)}</span></p>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING — pencil sketch of the card
// ─────────────────────────────────────────────────────────────────────────────
function PendingCard({ platform, pkey }) {
  return (
    <article className="nb nb--pending" aria-busy="true">
      <NbHead platform={platform.platform} username={platform.username} profileUrl={platform.profileUrl} live={false} />
      <div className="sketch">
        {["Solved", "Rating", "Rank", "Contests"].map((lbl) => (
          <div key={lbl}><span className="sketch__box" /><span className="note">{lbl}</span></div>
        ))}
      </div>
      <p className="nb__sub">Loading {pkey === "codeforces" ? "live data from the Codeforces API" : "the latest stats snapshot"}…</p>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY (not rendered — kept for future use)
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function SummaryBanner({ platformData, loading }) {
  const liveTotal = Object.values(platformData).reduce((s, p) => s + (p?.solved?.total || 0), 0);
  const total = HARISH_DATA.codechef.solved.total + liveTotal;
  const loaded = Object.keys(platformData).length + 1;
  return (
    <article className="nb">
      <div className="nb__hero"><div><Circled><strong className="display nb__big">{total}</strong></Circled><Ann>total problems solved</Ann>
        <p className="nb__sub">{loading ? "⟳ Fetching from all platforms..." : `Aggregated across ${loaded} platforms`}</p></div></div>
      <StatLine items={[{ label: "Platforms", value: `${loaded}/6` }, { label: "CC rating", value: "1462" }, { label: "CC peak", value: "1651" }]} />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPACT CARDS — CodeChef, GeeksforGeeks, HackerRank, CodeStudio
// ─────────────────────────────────────────────────────────────────────────────
const SPLIT_CLASS = { school: "is-basic", basic: "is-basic", easy: "is-easy", medium: "is-medium", moderate: "is-medium", hard: "is-hard", ninja: "is-ninja" };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function Split({ parts }) {
  const shown = parts.filter((p) => p.count > 0);
  if (!shown.length) return null;
  return (
    <div className="split split--mini">
      {shown.map((p) => (
        <div key={p.label} className={`split__seg ${SPLIT_CLASS[p.label] || "is-basic"}`} style={{ flexGrow: p.count }}>
          <span className="split__bar" />
          <span className="split__lbl"><b className="display">{p.count}</b> {cap(p.label)}</span>
        </div>
      ))}
    </div>
  );
}

const splitOf = (solved, order) => order.filter((k) => solved?.[k] !== undefined).map((k) => ({ label: k, count: solved[k] || 0 }));
const rank = (n) => (n ? `#${Number(n).toLocaleString()}` : "—");

const MINI = {
  codechef: (d) => ({
    big: d.solved?.total ?? "—", bigLabel: "problems solved",
    metric: d.rating, metricLabel: "rating",
    metricSub: `${"★".repeat(d.stars || 0)} ${d.division || ""}, peak ${d.highestRating}`.trim(),
    facts: [
      { label: "Contests", value: d.contests },
      { label: "Global rank", value: rank(d.globalRank) },
      { label: "India rank", value: rank(d.countryRank) },
    ],
  }),
  gfg: (d) => ({
    big: d.solved?.total ?? 0, bigLabel: "problems solved",
    metric: d.codingScore, metricLabel: "coding score",
    split: splitOf(d.solved, ["school", "basic", "easy", "medium", "hard"]),
    facts: [
      { label: "Institute rank", value: rank(d.instituteRank) },
      ...(d.maxStreak ? [{ label: "Day longest streak", value: d.maxStreak }] : []),
    ],
  }),
  hackerrank: (d) => ({
    big: d.totalBadges ?? (d.badges || []).length, bigLabel: "badges earned",
    metric: `★ ${d.totalStars ?? 0}`, metricLabel: "total stars",
    facts: d.solved?.total ? [{ label: "Challenges solved across badges", value: d.solved.total }] : null,
    tags: (d.badges || []).map((b) => `${b.name} ${"★".repeat(b.stars || 0)}`),
  }),
  atcoder: (d) => ({
    big: d.solved?.total ?? 0, bigLabel: "problems solved",
    metric: d.rating, metricLabel: "rating",
    metricSub: `peak ${d.highestRating}, ${d.ratedContests} rated contest${d.ratedContests === 1 ? "" : "s"}`,
    facts: [
      { label: "Rank", value: d.rank ? `#${Number(d.rank).toLocaleString()}` : "—" },
      ...(d.topPercent ? [{ label: "Top percentile", value: `${d.topPercent}%` }] : []),
      ...(d.bestPerformance ? [{ label: "Best performance", value: d.bestPerformance }] : []),
    ],
    note: d.lastCompeted ? `Last competed ${d.lastCompeted}` : null,
  }),
  codestudio: (d) => ({
    big: d.solved?.total ?? 0, bigLabel: "problems solved",
    metric: d.level || "—", metricLabel: "level",
    metricSub: d.exp ? `${Number(d.exp).toLocaleString()} XP` : null,
    split: splitOf(d.solved, ["easy", "moderate", "hard", "ninja"]),
    tags: d.badges || [],
  }),
};

function MiniCard({ pkey, info, data }) {
  const meta = PLATFORM_META[pkey] || EXTRA_PROFILES[pkey];
  const m = data ? MINI[pkey](data) : null;
  return (
    <article className="mini">
      <header className="mini__head">
        <span className="other__mark" aria-hidden="true">{meta.text}</span>
        <h3 className="display mini__name">{info.platform}</h3>
        <a href={info.profileUrl} target="_blank" rel="noopener noreferrer" className="nb__user">@{info.username}</a>
        {data && (
          <span className={`note nb__status ${freshness(data) === "Live" ? "" : "is-mock"}`}>
            <span className={freshness(data) === "Live" ? "live-dot" : "nb__dot"} aria-hidden="true" />{freshness(data)}
          </span>
        )}
      </header>

      {m ? (
        <>
          <div className="nb__hero mini__hero">
            <div>
              <Circled><strong className="display mini__big">{m.big}</strong></Circled>
              <p className="note mini__ann">{m.bigLabel}</p>
            </div>
            <div className="r">
              <strong className="display mini__mid nb__hl">{m.metric}</strong>
              <p className="note">{m.metricLabel}</p>
              {m.metricSub && <p className="nb__sub">{m.metricSub}</p>}
            </div>
          </div>
          {m.split && <Split parts={m.split} />}
          {m.facts && <StatLine items={m.facts} />}
          {m.tags && m.tags.length > 0 && <ul className="tags">{m.tags.map((t) => <li key={t} className="tag">{t}</li>)}</ul>}
          {m.note && <p className="nb__sub">{m.note}</p>}
        </>
      ) : (
        <p className="nb__sub mini__empty">
          Stats aren't available right now. <a className="nb__user" href={info.profileUrl} target="_blank" rel="noopener noreferrer">Open the {info.platform} profile</a>
        </p>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
// Same shaping as scripts/fetch-coding-stats.js (kept in sync)
function shapeCodeforces(user, subs, history) {
  const accepted = new Set();
  const byIndex = { A: 0, B: 0, C: 0, D: 0, "E+": 0 };
  subs.forEach((sub) => {
    if (sub.verdict !== "OK") return;
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (accepted.has(key)) return;
    accepted.add(key);
    const l = sub.problem.index[0].toUpperCase();
    byIndex[["A", "B", "C", "D"].includes(l) ? l : "E+"] += 1;
  });
  let bestRank = Infinity, worstRank = 0, maxUp = 0, maxDown = 0;
  history.forEach((entry) => {
    bestRank = Math.min(bestRank, entry.rank);
    worstRank = Math.max(worstRank, entry.rank);
    const d = entry.newRating - entry.oldRating;
    maxUp = Math.max(maxUp, d);
    maxDown = Math.min(maxDown, d);
  });
  return {
    platform: "Codeforces",
    username: user.handle,
    profileUrl: `https://codeforces.com/profile/${user.handle}`,
    solved: { total: accepted.size, byIndex },
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || "unranked",
    maxRank: user.maxRank || "unranked",
    contests: {
      count: history.length,
      bestRank: bestRank === Infinity ? null : bestRank,
      worstRank: worstRank || null,
      maxRatingGain: maxUp,
      maxRatingDrop: maxDown,
    },
    lastUpdated: new Date().toISOString(),
  };
}

async function fetchCodeforcesLive(handle) {
  const get = async (method, params) => {
    const r = await fetch(`https://codeforces.com/api/${method}?${new URLSearchParams(params)}`, { signal: AbortSignal.timeout(15_000) });
    const json = await r.json();
    if (json.status !== "OK") throw new Error(json.comment || method);
    return json.result;
  };
  const [[user], subs, history] = await Promise.all([
    get("user.info", { handles: handle }),
    get("user.status", { handle, from: 1, count: 10000 }),
    get("user.rating", { handle }),
  ]);
  return shapeCodeforces(user, subs, history);
}

function useDrawn() {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") { setDrawn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, drawn];
}

export default function Coding() {
  const [platformData, setPlatformData] = useState({});
  const [loading,      setLoading]      = useState(true);
  const [bookRef, drawn] = useDrawn();
  const [miniRef, miniDrawn] = useDrawn();

  useEffect(() => {
    let cancelled = false;
    const apply = (patch) => { if (!cancelled) setPlatformData((prev) => ({ ...prev, ...patch })); };

    // 1) Build-time snapshot (public/coding-stats.json): same origin, instant, no server
    const snapshot = fetch(`${process.env.PUBLIC_URL || ""}/coding-stats.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((snap) => ({
        leetcode:   snap?.leetcode   ? { ...snap.leetcode,   _snapshot: true } : MOCK_LEETCODE,
        codeforces: snap?.codeforces ? { ...snap.codeforces, _snapshot: true } : MOCK_CODEFORCES,
        codechef:   snap?.codechef   ? { ...snap.codechef,   _snapshot: true }
                                     : { ...HARISH_DATA.codechef, _snapshot: true },
        gfg:        snap?.gfg        ? { ...snap.gfg,        _snapshot: true } : null,
        hackerrank: snap?.hackerrank ? { ...snap.hackerrank, _snapshot: true } : MOCK_HACKERRANK,
        codestudio: snap?.codestudio ? { ...snap.codestudio, _snapshot: true } : null,
        atcoder:    snap?.atcoder    ? { ...snap.atcoder,    _snapshot: true } : null,
      }));

    // 2) Codeforces live, straight from the browser (its official API allows CORS)
    const live = fetchCodeforcesLive(HARISH_DATA.codeforces.username).catch(() => null);

    snapshot.then((patch) => { apply(patch); if (!cancelled) setLoading(false); });
    Promise.all([snapshot, live]).then(([, cf]) => { if (cf) apply({ codeforces: cf }); });

    return () => { cancelled = true; };
  }, []);

  const otherProfiles = [
    { key: "codechef",   label: "CodeChef",      url: HARISH_DATA.codechef.profileUrl   },
    { key: "gfg",        label: "GeeksforGeeks", url: HARISH_DATA.gfg.profileUrl        },
    { key: "hackerrank", label: "HackerRank",    url: HARISH_DATA.hackerrank.profileUrl },
    { key: "codestudio", label: "CodeStudio",    url: HARISH_DATA.codestudio.profileUrl },
    { key: "atcoder",    label: "AtCoder",       url: EXTRA_PROFILES.atcoder.profileUrl },
  ];

  return (
    <section id="coding" className="section section--grid coding" aria-labelledby="coding-title">
      <div className="container">
        <SectionHead
          id="coding-title"
          title="Coding"
          note="Competitive programmer"
          meta={`${HARISH_DATA.name}, ${HARISH_DATA.college}, ${HARISH_DATA.location}`}
        />

        <p className="note coding__note">Featured, detailed live cards</p>
        <div ref={bookRef} className={`notebook ${drawn ? "is-drawn" : ""}`}>
          {loading
            ? <PendingCard platform={HARISH_DATA.leetcode} pkey="leetcode" />
            : <LeetCodeCard data={platformData.leetcode || MOCK_LEETCODE} />}
          {loading
            ? <PendingCard platform={HARISH_DATA.codeforces} pkey="codeforces" />
            : <CodeforcesCard data={platformData.codeforces || MOCK_CODEFORCES} />}
        </div>

        <p className="note coding__note coding__note--more">Other profiles</p>
        <div ref={miniRef} className={`minis ${miniDrawn ? "is-drawn" : ""}`}>
          {otherProfiles.map(({ key, label, url }) => (
            <MiniCard
              key={key}
              pkey={key}
              info={{ platform: label, profileUrl: url, username: (HARISH_DATA[key] || EXTRA_PROFILES[key]).username }}
              data={platformData[key]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
