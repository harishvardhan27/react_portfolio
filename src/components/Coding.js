import { useState, useEffect, useRef } from "react";

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
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function CountUp({ to, duration = 1400 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to) return;
    let start = 0;
    const step = to / (duration / 16);
    const t = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(Math.floor(start));
      if (start >= to) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

function StarRating({ count, max = 7, color }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < count ? color : "none"} stroke={color} strokeWidth="1.5"
          style={{ opacity: i < count ? 1 : 0.22 }}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ current, highest, max = 3000, color }) {
  const pct  = Math.min((current / max) * 100, 100);
  const hpct = Math.min((highest / max) * 100, 100);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.1em" }}>PROGRESS /{max}</span>
        <span style={{ fontSize: 14, color }}>Peak: {highest}</span>
      </div>
      <div style={{ position: "relative", height: 5, background: "#0a0e18", borderRadius: 3 }}>
        <div style={{ position: "absolute", left: `${hpct}%`, top: -4, width: 2, height: 13, background: `${color}55`, borderRadius: 1 }} />
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${color}44,${color})`, borderRadius: 3, transition: "width 1.8s ease" }} />
      </div>
    </div>
  );
}

// Slim horizontal bar used for difficulty / beats breakdown
function SegmentBar({ segments }) {
  // segments: [{ pct, color, label }]
  return (
    <div style={{ display: "flex", height: 5, borderRadius: 4, overflow: "hidden", gap: 1 }}>
      {segments.map((s, i) => (
        <div key={i} style={{ flex: s.pct, background: s.color, transition: "flex 1.5s ease", borderRadius: 2 }} />
      ))}
    </div>
  );
}

function LiveBadge({ color = "#2DB526" }) {
  return (
    <div style={{
      position: "absolute", top: 14, right: 14,
      background: `${color}12`, border: `1px solid ${color}40`,
      borderRadius: 20, padding: "3px 9px",
      display: "flex", alignItems: "center", gap: 5,
    }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, animation: "livePulse 1.5s infinite" }} />
      <span style={{ fontSize: 14, color, letterSpacing: "0.15em" }}>LIVE</span>
    </div>
  );
}

function StatBox({ label, value, sub, color, large = false }) {
  return (
    <div style={{
      background: `${color}08`, border: `1px solid ${color}22`,
      borderRadius: 10, padding: large ? "14px 10px" : "10px 8px", textAlign: "center",
    }}>
      <div style={{ fontSize: large ? 24 : 18, fontWeight: 800, color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
        {value ?? "—"}
      </div>
      <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.12em", marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 14, color: "#cbd5e1", marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function PlatformIcon({ text, color, bg }) {
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 13, flexShrink: 0,
      background: `linear-gradient(135deg,${bg},${color}22)`,
      border: `1px solid ${color}45`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, fontWeight: 800, color, fontFamily: "'JetBrains Mono',monospace",
    }}>{text}</div>
  );
}

function CardHeader({ platform, username, profileUrl, meta, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
      <PlatformIcon text={meta.text} color={meta.color} bg={meta.bg} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#f0e8d8", fontFamily: "'Syne',sans-serif" }}>
            {platform}
          </span>
          {children}
        </div>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
          style={{ color: `${meta.color}bb`, fontSize: 16, fontFamily: "'JetBrains Mono',monospace", textDecoration: "none", letterSpacing: "0.05em" }}>
          @{username} ↗
        </a>
      </div>
    </div>
  );
}

function TopAccent({ color }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: "12%", right: "12%", height: 2,
      background: `linear-gradient(90deg,transparent,${color},transparent)`,
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODECHEF CARD
// ─────────────────────────────────────────────────────────────────────────────
function CodeChefCard({ data, meta }) {
  return (
    <div style={{
      background: `linear-gradient(140deg,#0e0a02 0%,#1a1208 60%,#120e04 100%)`,
      border: `1px solid ${meta.color}28`, borderRadius: 20, padding: 26,
      position: "relative", overflow: "hidden",
      boxShadow: `0 4px 48px ${meta.glow}`,
    }}>
      <TopAccent color={meta.color} />
      <LiveBadge color="#2DB526" />
      <CardHeader platform="CodeChef" username={data.username} profileUrl={data.profileUrl} meta={meta}>
        <StarRating count={data.stars} max={7} color={meta.color} />
      </CardHeader>

      {/* Solved hero */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.15em", marginBottom: 4 }}>PROBLEMS SOLVED</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: meta.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
            {data.solved.total}
          </div>
          <div style={{ fontSize: 14, color: "#cbd5e1", marginTop: 3 }}>{data.division}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.15em", marginBottom: 4 }}>CURRENT RATING</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: "#f0ddb0", fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
            {data.rating}
          </div>
          <div style={{ fontSize: 14, color: "#fcd34d", marginTop: 3 }}>Peak {data.highestRating}</div>
        </div>
      </div>

      <RatingBar current={data.rating} highest={data.highestRating} max={3000} color={meta.color} />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 14 }}>
        <StatBox label="CONTESTS" value={data.contests} sub="participated" color={meta.color} />
        <StatBox label="GLOBAL RANK" value={`#${data.globalRank.toLocaleString()}`} color={meta.color} />
        <StatBox label="INDIA RANK" value={`#${data.countryRank.toLocaleString()}`} color={meta.color} />
      </div>

      {/* Badges */}
      <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {data.badges.map((b, i) => (
          <span key={i} style={{
            background: `${meta.color}10`, border: `1px solid ${meta.color}28`,
            color: `${meta.color}bb`, borderRadius: 5, padding: "3px 9px",
            fontSize: 14, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace",
          }}>🏅 {b}</span>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 14, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace" }}>
        DATA FETCHED · {data.lastUpdated}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEETCODE CARD  — mirrors CodeChef quality with LC-specific data
// ─────────────────────────────────────────────────────────────────────────────
function LeetCodeCard({ data, meta }) {
  const { solved, beats, contest } = data;
  const total  = solved?.total  || 0;
  const easy   = solved?.easy   || 0;
  const medium = solved?.medium || 0;
  const hard   = solved?.hard   || 0;

  // Difficulty bar segments proportional to count
  const diffSegs = [
    { pct: easy   || 1, color: "#00B8A3", label: "Easy"   },
    { pct: medium || 1, color: "#FFC01E", label: "Medium" },
    { pct: hard   || 1, color: "#FF375F", label: "Hard"   },
  ];

  // Contest rating progress (max 3500 for LC)
  const contestRating = contest?.rating || 0;

  return (
    <div style={{
      background: `linear-gradient(140deg,#0e0a00 0%,#1a1100 60%,#130f02 100%)`,
      border: `1px solid ${meta.color}28`, borderRadius: 20, padding: 26,
      position: "relative", overflow: "hidden",
      boxShadow: `0 4px 48px ${meta.glow}`,
      flex: 1, display: "flex", flexDirection: "column",
    }}>
      <TopAccent color={meta.color} />
      <LiveBadge color={meta.color} />

      <CardHeader platform="LeetCode" username={data.username} profileUrl={data.profileUrl} meta={meta} />

      {/* Hero row — total solved + contest rating */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.15em", marginBottom: 4 }}>PROBLEMS SOLVED</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: meta.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
            {total}
          </div>
          <div style={{ fontSize: 14, color: "#fcd34d", marginTop: 3 }}>
            Rank #{(data.globalRanking || 0).toLocaleString()}
          </div>
        </div>
        {contest && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.15em", marginBottom: 4 }}>CONTEST RATING</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "#f0ddb0", fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
              {contest.rating}
            </div>
            <div style={{ fontSize: 14, color: "#fcd34d", marginTop: 3 }}>
              Top {contest.topPercentage}%
            </div>
          </div>
        )}
      </div>

      {/* Difficulty breakdown bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.12em", marginBottom: 7 }}>DIFFICULTY SPLIT</div>
        <SegmentBar segments={diffSegs} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
          {[
            { label: "Easy",   count: easy,   color: "#00B8A3" },
            { label: "Medium", count: medium, color: "#FFC01E" },
            { label: "Hard",   count: hard,   color: "#FF375F" },
          ].map((d) => (
            <div key={d.label} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: d.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
                {d.count}
              </div>
              <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.1em", marginTop: 2 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Beats percentile row */}
      {beats && (beats.easy || beats.medium || beats.hard) && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.12em", marginBottom: 8 }}>BEATS % (users outperformed)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[
              { label: "EASY",   val: beats.easy,   color: "#00B8A3" },
              { label: "MEDIUM", val: beats.medium, color: "#FFC01E" },
              { label: "HARD",   val: beats.hard,   color: "#FF375F" },
            ].map((b) => b.val && (
              <div key={b.label} style={{
                background: `${b.color}10`, border: `1px solid ${b.color}25`,
                borderRadius: 8, padding: "8px 6px", textAlign: "center",
              }}>
                {/* Mini arc showing beat percentage */}
                <div style={{ position: "relative", height: 28, marginBottom: 4 }}>
                  <svg width="48" height="28" viewBox="0 0 48 28" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    {/* Track */}
                    <path d="M4 24 A20 20 0 0 1 44 24" fill="none" stroke={`${b.color}20`} strokeWidth="3" strokeLinecap="round" />
                    {/* Fill */}
                    <path
                      d="M4 24 A20 20 0 0 1 44 24"
                      fill="none" stroke={b.color} strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${(parseFloat(b.val) / 100) * 62.8} 62.8`}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                    fontSize: 14, fontWeight: 800, color: b.color, fontFamily: "'Syne',sans-serif",
                  }}>{b.val}%</div>
                </div>
                <div style={{ fontSize: 14, color: "#cbd5e1", letterSpacing: "0.1em" }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contest stats */}
      {contest && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          <StatBox label="CONTESTS" value={contest.attended} sub="attended" color={meta.color} />
          <StatBox label="GLOBAL RANK" value={`#${(contest.globalRank || 0).toLocaleString()}`} color={meta.color} />
          <StatBox label="TOP %" value={`${contest.topPercentage}%`} color={meta.color} />
        </div>
      )}

      {/* Contest rating progress bar */}
      {contestRating > 0 && (
        <RatingBar current={contestRating} highest={contestRating} max={3500} color={meta.color} />
      )}

      <div style={{ marginTop: 12, fontSize: 14, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>DATA FETCHED · {data._mock ? "DEMO DATA" : new Date(data.lastUpdated).toLocaleTimeString()}</span>
        {data._mock && (
          <span style={{ color: "#FFA11640", fontSize: 14, background: "#FFA11610", border: "1px solid #FFA11625", borderRadius: 4, padding: "2px 6px" }}>
            MOCK — start backend to get live data
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODEFORCES CARD
// ─────────────────────────────────────────────────────────────────────────────
const CF_RANK_BG = {
  "newbie":                    "#80808018",
  "pupil":                     "#00800018",
  "specialist":                "#03A89E18",
  "expert":                    "#0000FF18",
  "candidate master":          "#AA00AA18",
  "master":                    "#FF8C0018",
  "international master":      "#FF8C0018",
  "grandmaster":               "#FF000018",
  "international grandmaster": "#FF000018",
  "legendary grandmaster":     "#FF000018",
};

function CodeforcesCard({ data, meta }) {
  const rankColor  = data.rankColour || meta.color;
  const rankKey    = (data.rank || "").toLowerCase();
  const rankBg     = CF_RANK_BG[rankKey] || `${meta.color}10`;
  const byIndex    = data.solved?.byIndex || {};
  const indexKeys  = ["A", "B", "C", "D", "E+"];
  const maxIdx     = Math.max(...indexKeys.map(k => byIndex[k] || 0), 1);

  return (
    <div style={{
      background: `linear-gradient(140deg,#020a12 0%,#08121a 60%,#040e18 100%)`,
      border: `1px solid ${meta.color}28`, borderRadius: 20, padding: 26,
      position: "relative", overflow: "hidden",
      boxShadow: `0 4px 48px ${meta.glow}`,
      flex: 1, display: "flex", flexDirection: "column",
    }}>
      <TopAccent color={meta.color} />
      <LiveBadge color={meta.color} />

      <CardHeader platform="Codeforces" username={data.username} profileUrl={data.profileUrl} meta={meta}>
        {/* Rank badge inline */}
        <span style={{
          background: rankBg, border: `1px solid ${rankColor}40`,
          color: rankColor, fontSize: 14, borderRadius: 5, padding: "2px 8px",
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.06em", fontWeight: 700,
        }}>{data.rank || "unranked"}</span>
      </CardHeader>

      {/* Hero: solved + current rating */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.15em", marginBottom: 4 }}>PROBLEMS SOLVED</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: meta.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
            {data.solved?.total || 0}
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 3 }}>
            Max rank <span style={{ color: rankColor }}>{data.maxRank}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.15em", marginBottom: 4 }}>CURRENT RATING</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: rankColor, fontFamily: "'Syne',sans-serif", lineHeight: 1,
            textShadow: `0 0 24px ${rankColor}44` }}>
            {data.rating || 0}
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 3 }}>Peak {data.maxRating || 0}</div>
        </div>
      </div>

      <RatingBar current={data.rating || 0} highest={data.maxRating || 0} max={3500} color={rankColor} />

      {/* Contest stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginTop: 14 }}>
        <StatBox label="CONTESTS"   value={data.contests?.count    || 0}  color={meta.color} />
        <StatBox label="BEST RANK"  value={data.contests?.bestRank  ? `#${data.contests.bestRank.toLocaleString()}` : "—"} color={meta.color} />
        <StatBox label="MAX GAIN"   value={data.contests?.maxRatingGain > 0 ? `+${data.contests.maxRatingGain}` : "—"} color="#2DB526" />
        <StatBox label="MAX DROP"   value={data.contests?.maxRatingDrop < 0 ? `${data.contests.maxRatingDrop}` : "—"} color="#FF375F" />
      </div>

      {/* Problem index breakdown — A/B/C/D/E+ bars */}
      {Object.keys(byIndex).length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.12em", marginBottom: 9 }}>PROBLEMS BY INDEX</div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 44 }}>
            {indexKeys.map((k) => {
              const val = byIndex[k] || 0;
              const pct = (val / maxIdx) * 100;
              // colour gets brighter for harder problems
              const barColors = { A: "#3B9EE8", B: "#5bb0f0", C: "#FFC01E", D: "#FF8C00", "E+": "#FF375F" };
              return (
                <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ fontSize: 14, color: barColors[k], fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{val}</div>
                  <div style={{
                    width: "100%", height: `${Math.max(pct * 0.28, 3)}px`,
                    background: `linear-gradient(180deg,${barColors[k]},${barColors[k]}88)`,
                    borderRadius: "3px 3px 0 0", transition: "height 1.4s ease",
                    minHeight: 3,
                  }} />
                  <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.05em" }}>{k}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, fontSize: 14, color: "#64748b", fontFamily: "'JetBrains Mono',monospace", display: "flex", justifyContent: "space-between" }}>
        <span>DATA FETCHED · {data._mock ? "DEMO DATA" : new Date(data.lastUpdated).toLocaleTimeString()}</span>
        {data._mock && <span style={{ color: "#3B9EE830", fontSize: 14, background: "#3B9EE810", border: "1px solid #3B9EE820", borderRadius: 4, padding: "2px 6px" }}>MOCK</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HACKERRANK CARD
// ─────────────────────────────────────────────────────────────────────────────

// Star level colour mapping
const HR_LEVEL_COLORS = { 1: "#CD7F32", 2: "#CD7F32", 3: "#C0C0C0", 4: "#C0C0C0", 5: "#FFD700" };

function HRBadge({ badge, accentColor }) {
  const stars    = badge.stars || 0;
  const maxStars = 5;
  const levelColor = stars >= 5 ? "#FFD700" : stars >= 3 ? "#C0C0C0" : "#CD7F32";

  return (
    <div style={{
      background: `${levelColor}0c`, border: `1px solid ${levelColor}30`,
      borderRadius: 10, padding: "10px 10px", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 5, minWidth: 0,
    }}>
      {/* Star row */}
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: maxStars }).map((_, i) => (
          <svg key={i} width="9" height="9" viewBox="0 0 24 24"
            fill={i < stars ? levelColor : "none"} stroke={levelColor} strokeWidth="2"
            style={{ opacity: i < stars ? 1 : 0.2 }}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </div>
      {/* Badge name */}
      <div style={{ fontSize: 14, color: levelColor, fontFamily: "'JetBrains Mono',monospace",
        letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.3, fontWeight: 600 }}>
        {badge.name}
      </div>
      {/* Level label */}
      {badge.level && (
        <div style={{ fontSize: 14, color: `${levelColor}80`, letterSpacing: "0.08em" }}>
          {badge.level}
        </div>
      )}
    </div>
  );
}

function HackerRankCard({ data, meta }) {
  const badges     = data.badges     || [];
  const totalStars = data.totalStars || badges.reduce((s, b) => s + (b.stars || 0), 0);
  const totalBadges= data.totalBadges || badges.length;

  // HackerRank tracks progress by badges & stars, not a raw "problems solved" count.
  // Their profile page is JS-rendered so that number can't be scraped server-side.
  // We surface badges as the primary metric — this is what HR actually highlights.
  const hasSolvedCount = (data.solved?.total || 0) > 0;

  // Sort badges: most stars first
  const sortedBadges = [...badges].sort((a, b) => (b.stars || 0) - (a.stars || 0));

  // Gold badges (5★), Silver (3-4★), Bronze (1-2★)
  const gold   = badges.filter(b => (b.stars || 0) >= 5).length;
  const silver = badges.filter(b => (b.stars || 0) >= 3 && (b.stars || 0) < 5).length;
  const bronze = badges.filter(b => (b.stars || 0) > 0 && (b.stars || 0) < 3).length;

  return (
    <div style={{
      background: `linear-gradient(140deg,#000f08 0%,#001a0d 60%,#001208 100%)`,
      border: `1px solid ${meta.color}28`, borderRadius: 20, padding: 26,
      position: "relative", overflow: "hidden",
      boxShadow: `0 4px 48px ${meta.glow}`,
    }}>
      <TopAccent color={meta.color} />
      <LiveBadge color={meta.color} />

      <CardHeader platform="HackerRank" username={data.username} profileUrl={data.profileUrl} meta={meta}>
        {data.name && (
          <span style={{ fontSize: 14, color: `${meta.color}70`, fontFamily: "'JetBrains Mono',monospace" }}>
            {data.name}
          </span>
        )}
      </CardHeader>

      {/* ── HERO: Badges + Stars (primary HR metrics) ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        {/* Left: total badges big number */}
        <div>
          <div style={{ fontSize: 14, color: "#86efac", letterSpacing: "0.15em", marginBottom: 4 }}>TOTAL BADGES</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: meta.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
            {totalBadges}
          </div>
          {data.school && (
            <div style={{ fontSize: 14, color: "#86efac", marginTop: 4, maxWidth: 160, lineHeight: 1.4 }}>{data.school}</div>
          )}
        </div>

        {/* Right: stars + tier breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, color: "#86efac", letterSpacing: "0.12em", marginBottom: 3 }}>TOTAL STARS</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#FFD700", fontFamily: "'Syne',sans-serif", lineHeight: 1,
              textShadow: "0 0 20px #FFD70044" }}>
              ★ {totalStars}
            </div>
          </div>
          {/* Tier pills */}
          <div style={{ display: "flex", gap: 5 }}>
            {[
              { label: "GOLD",   count: gold,   color: "#FFD700" },
              { label: "SILV",   count: silver, color: "#C0C0C0" },
              { label: "BRNZ",   count: bronze, color: "#CD7F32" },
            ].map(t => t.count > 0 && (
              <div key={t.label} style={{
                background: `${t.color}12`, border: `1px solid ${t.color}35`,
                borderRadius: 5, padding: "3px 7px", textAlign: "center",
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: t.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{t.count}</div>
                <div style={{ fontSize: 14, color: `${t.color}70`, letterSpacing: "0.08em" }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Solved count row (only if available) ── */}
      {hasSolvedCount ? (
        <div style={{
          background: `${meta.color}08`, border: `1px solid ${meta.color}20`,
          borderRadius: 9, padding: "10px 14px", marginBottom: 14,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 14, color: "#86efac", letterSpacing: "0.12em" }}>PROBLEMS SOLVED</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: meta.color, fontFamily: "'Syne',sans-serif" }}>
            {data.solved.total}
          </span>
        </div>
      ) : (
        /* Friendly note explaining why solved count is missing */
        <div style={{
          background: "#001a0d", border: "1px dashed #2DB52625",
          borderRadius: 9, padding: "9px 12px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>ℹ️</span>
          <span style={{ fontSize: 14, color: "#86efac", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6 }}>
            HackerRank tracks progress via <span style={{ color: meta.color }}>badges & stars</span>, not a raw solved count.
            Their profile page is client-side rendered — the metrics above are the real primary data.
          </span>
        </div>
      )}

      {/* ── Star distribution bars ── */}
      {totalStars > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: "#86efac", letterSpacing: "0.12em", marginBottom: 8 }}>STAR DISTRIBUTION</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[5, 4, 3, 2, 1].map(n => {
              const count = badges.filter(b => (b.stars || 0) === n).length;
              const pct   = badges.length > 0 ? (count / badges.length) * 100 : 0;
              const sc    = n >= 5 ? "#FFD700" : n >= 3 ? "#C0C0C0" : "#CD7F32";
              if (count === 0) return null;
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 14, color: sc, width: 18, textAlign: "right", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{n}★</span>
                  <div style={{ flex: 1, height: 5, background: "#001508", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${sc}55,${sc})`, borderRadius: 3, transition: "width 1.5s ease" }} />
                  </div>
                  <span style={{ fontSize: 14, color: sc, width: 14, textAlign: "right", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Badge grid ── */}
      {sortedBadges.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: "#86efac", letterSpacing: "0.12em", marginBottom: 8 }}>EARNED BADGES</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(78px,1fr))", gap: 7 }}>
            {sortedBadges.slice(0, 8).map((b, i) => (
              <HRBadge key={i} badge={b} accentColor={meta.color} />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 14, color: "#64748b", fontFamily: "'JetBrains Mono',monospace", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>DATA FETCHED · {data._mock ? "DEMO DATA" : new Date(data.lastUpdated).toLocaleTimeString()}</span>
        {data._mock && <span style={{ color: "#00EA6430", fontSize: 14, background: "#00EA6410", border: "1px solid #00EA6420", borderRadius: 4, padding: "2px 6px" }}>MOCK</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC LIVE CARD  (GFG, CodeStudio)
// ─────────────────────────────────────────────────────────────────────────────
function GenericLiveCard({ data, pkey, meta }) {
  const cc = data?.solved?.total || 0;
  const extras = [];

  if (pkey === "gfg") {
    if (data.codingScore)  extras.push({ label: "SCORE",      value: data.codingScore });
    if (data.streak?.max)  extras.push({ label: "MAX STREAK", value: data.streak.max });
    if (data.solved?.hard) extras.push({ label: "HARD",       value: data.solved.hard });
  }
  if (pkey === "codestudio") {
    if (data.rating)     extras.push({ label: "SCORE", value: data.rating });
    if (data.globalRank) extras.push({ label: "RANK",  value: data.globalRank });
  }

  return (
    <div style={{
      background: `linear-gradient(140deg,${meta.bg} 0%,#0f1118 100%)`,
      border: `1px solid ${meta.color}35`, borderRadius: 20, padding: 24,
      position: "relative", overflow: "hidden",
      boxShadow: `0 2px 32px ${meta.glow}`,
    }}>
      <TopAccent color={meta.color} />
      <LiveBadge color={meta.color} />

      <CardHeader platform={data.platform} username={data.username} profileUrl={data.profileUrl} meta={meta} />

      {/* Solved hero */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.15em", marginBottom: 3 }}>PROBLEMS SOLVED</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: meta.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
          {cc}
        </div>
      </div>

      {/* Extra stats */}
      {extras.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(extras.length, 3)},1fr)`, gap: 8, marginBottom: 12 }}>
          {extras.map((e, i) => (
            <StatBox key={i} label={e.label} value={e.value} color={meta.color} />
          ))}
        </div>
      )}

      {/* GFG difficulty breakdown */}
      {pkey === "gfg" && data.solved?.easy !== undefined && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 14, color: "#86efac", letterSpacing: "0.12em", marginBottom: 6 }}>DIFFICULTY SPLIT</div>
          <SegmentBar segments={[
            { pct: data.solved.school || 1, color: "#888888" },
            { pct: data.solved.basic  || 1, color: "#4a90e2" },
            { pct: data.solved.easy   || 1, color: "#00B8A3" },
            { pct: data.solved.medium || 1, color: "#FFC01E" },
            { pct: data.solved.hard   || 1, color: "#FF375F" },
          ]} />
          <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            {[
              { l: "S", v: data.solved.school, c: "#888888" },
              { l: "B", v: data.solved.basic,  c: "#4a90e2" },
              { l: "E", v: data.solved.easy,   c: "#00B8A3" },
              { l: "M", v: data.solved.medium, c: "#FFC01E" },
              { l: "H", v: data.solved.hard,   c: "#FF375F" },
            ].map(d => (
              <span key={d.l} style={{ fontSize: 14, color: d.c, fontFamily: "'JetBrains Mono',monospace" }}>
                {d.l}:{d.v || 0}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 14, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace" }}>
        UPDATED · {new Date(data.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON / PENDING CARD
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonLine({ w = "100%", h = 14, r = 5, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: "linear-gradient(90deg,#141820 25%,#1c2230 50%,#141820 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.8s infinite",
    }} />
  );
}

function PendingCard({ platform, pkey, meta }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0a0c12", borderRadius: 20, padding: 24,
        border: `1px solid ${hovered ? meta.color + "35" : "#141a28"}`,
        transition: "border-color 0.3s", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
        background: `linear-gradient(90deg,transparent,${meta.color}35,transparent)`,
        opacity: hovered ? 1 : 0.25, transition: "opacity 0.3s",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <PlatformIcon text={meta.text} color={meta.color} bg={meta.bg} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#c0c8e0", fontFamily: "'Syne',sans-serif", marginBottom: 3 }}>
            {platform.platform}
          </div>
          <a href={platform.profileUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: `${meta.color}80`, fontSize: 14, fontFamily: "'JetBrains Mono',monospace", textDecoration: "none" }}>
            @{platform.username} ↗
          </a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {["SOLVED", "RATING", "RANK", "CONTESTS"].map((lbl) => (
          <div key={lbl} style={{ background: "#0d1020", border: "1px solid #141a28", borderRadius: 8, padding: "10px 10px" }}>
            <SkeletonLine w="70%" h={16} r={4} mb={5} />
            <div style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.12em" }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: `${meta.color}07`, border: `1px dashed ${meta.color}28`,
        borderRadius: 9, padding: "10px 14px", textAlign: "center",
      }}>
        <div style={{ fontSize: 14, color: `${meta.color}70`, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.8 }}>
          Start backend to stream live data<br />
          <span style={{ color: "#64748b", fontSize: 14 }}>GET /api/{pkey}/{platform.username}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY BANNER
// ─────────────────────────────────────────────────────────────────────────────
function SummaryBanner({ platformData, loading, mounted }) {
  const liveTotal = Object.values(platformData).reduce((s, p) => s + (p?.solved?.total || 0), 0);
  const total = HARISH_DATA.codechef.solved.total + liveTotal;
  const loaded = Object.keys(platformData).length + 1; // +1 for codechef

  return (
    <div style={{
      background: "linear-gradient(135deg,#08090f 0%,#0d1020 100%)",
      border: "1px solid #151e30", borderRadius: 20,
      padding: "26px 30px", marginBottom: 32,
      opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)",
      transition: "all 0.8s ease 0.15s",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid bg texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(#ffffff03 1px,transparent 1px),linear-gradient(90deg,#ffffff03 1px,transparent 1px)",
        backgroundSize: "44px 44px",
      }} />
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.2em", marginBottom: 5 }}>TOTAL PROBLEMS SOLVED</div>
          <div style={{
            fontSize: "clamp(42px,6vw,60px)", fontWeight: 900, color: "#f0ece4",
            fontFamily: "'Syne',sans-serif", lineHeight: 1, textShadow: "0 0 50px #C17A3520",
          }}>
            <CountUp to={total} />
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 5, letterSpacing: "0.05em" }}>
            {loading ? "⟳ Fetching from all platforms..." : `Aggregated across ${loaded} platforms`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "PLATFORMS", val: `${loaded}/6` },
            { label: "CC RATING", val: "1462" },
            { label: "CC PEAK",   val: "1651" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#c8d0e8", fontFamily: "'Syne',sans-serif" }}>{s.val}</div>
              <div style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.14em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution bars */}
      {Object.keys(platformData).length > 0 && (
        <div style={{ position: "relative", marginTop: 22 }}>
          <div style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.15em", marginBottom: 10 }}>PLATFORM CONTRIBUTION</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { key: "codechef",   label: "CodeChef",   n: HARISH_DATA.codechef.solved.total },
              ...Object.entries(platformData).map(([k, v]) => ({
                key: k, label: v.platform, n: v.solved?.total || 0,
              })),
            ].map(({ key, label, n }) => {
              const pct = total > 0 ? (n / total * 100).toFixed(1) : 0;
              const m   = PLATFORM_META[key] || PLATFORM_META.codechef;
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 74, fontSize: 14, color: m.color, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>
                    {label}
                  </div>
                  <div style={{ flex: 1, height: 5, background: "#0e1420", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${m.color}66,${m.color})`, borderRadius: 3, transition: "width 1.2s ease" }} />
                  </div>
                  <div style={{ width: 36, fontSize: 14, color: "#94a3b8", textAlign: "right", fontFamily: "'JetBrains Mono',monospace" }}>{pct}%</div>
                  <div style={{ width: 28, fontSize: 14, color: m.color, textAlign: "right", fontFamily: "'JetBrains Mono',monospace" }}>{n}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:4000/api";

export default function Coding() {
  const [mounted,      setMounted]      = useState(false);
  const [platformData, setPlatformData] = useState({});
  const [loading,      setLoading]      = useState(true);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  useEffect(() => {
    const fetchAll = async () => {
      // ── Tier 1: Direct platform APIs (LeetCode, Codeforces) ─────────────────
      const directCalls = [
        ["leetcode",   `${API_BASE}/leetcode/HarishVardhan27`],
        ["codeforces", `${API_BASE}/codeforces/HarishVardhan27`],
      ];

      // ── Tier 2: Codolio aggregator (GFG + HackerRank + CodeStudio) ──────────
      // One Puppeteer call to Codolio returns all three in a single response.
      const codolioCall = fetch(`${API_BASE}/codolio/Yugen27`, {
        signal: AbortSignal.timeout(45_000),
      }).then(r => r.ok ? r.json() : null);

      const [directResults, codolioResult] = await Promise.all([
        Promise.allSettled(
          directCalls.map(([, url]) =>
            fetch(url, { signal: AbortSignal.timeout(15_000) }).then(r => r.ok ? r.json() : null)
          )
        ),
        codolioCall.catch(() => null),
      ]);

      const newData = {};

      // Process direct results
      directCalls.forEach(([key], i) => {
        const r = directResults[i];
        if (r.status === "fulfilled" && r.value && !r.value.error) {
          newData[key] = r.value;
        }
      });

      // ── Process Codolio response ─────────────────────────────────────────────
      // Codolio returns: { platforms: { gfg: {...}, hackerrank: {...}, codestudio: {...} } }
      if (codolioResult && !codolioResult._unavailable && codolioResult.platforms) {
        const cp = codolioResult.platforms;

        if (cp.gfg) {
          newData.gfg = {
            platform: "GeeksforGeeks",
            username: "harishvawvad",
            profileUrl: "https://www.geeksforgeeks.org/profile/harishvawvad",
            solved: { total: cp.gfg.total || 0, easy: cp.gfg.easy || 0, medium: cp.gfg.medium || 0, hard: cp.gfg.hard || 0 },
            codingScore:   cp.gfg.score    || 0,
            currentStreak: cp.gfg.streak   || 0,
            maxStreak:     cp.gfg.maxStreak || 0,
            _source: "codolio",
          };
        }

        if (cp.hackerrank) {
          newData.hackerrank = {
            platform: "HackerRank",
            username: "harishvardhanwd",
            profileUrl: "https://www.hackerrank.com/profile/harishvardhanwd",
            solved: { total: cp.hackerrank.total || 0 },
            totalBadges: cp.hackerrank.badges || 0,
            totalStars:  cp.hackerrank.stars  || 0,
            _source: "codolio",
          };
        }

        const csRaw = cp.codestudio || cp["code-studio"] || cp["code360"];
        if (csRaw) {
          newData.codestudio = {
            platform: "CodeStudio",
            username: "harishVardhan",
            profileUrl: "https://www.naukri.com/code360/profile/harishVardhan",
            solved: { total: csRaw.total || 0 },
            rating:     csRaw.score  || csRaw.rating || 0,
            globalRank: csRaw.rank   || null,
            _source: "codolio",
          };
        }
      }

      // ── Fallbacks so featured cards always render ────────────────────────────
      if (!newData.leetcode)   newData.leetcode   = MOCK_LEETCODE;
      if (!newData.codeforces) newData.codeforces = MOCK_CODEFORCES;
      if (!newData.hackerrank) newData.hackerrank = MOCK_HACKERRANK;

      setPlatformData(newData);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const otherPlatforms = ["gfg", "codestudio"];
  const featuredPlatforms = ["codechef", "leetcode", "codeforces", "gfg", "hackerrank", "codestudio"];

  return (
    <div
      id="coding"
      style={{
        minHeight: "100vh",
      background: "#060810",
      backgroundImage:
        "radial-gradient(ellipse at 15% 15%,#120800 0%,transparent 50%)," +
        "radial-gradient(ellipse at 85% 85%,#001208 0%,transparent 50%)",
      padding: "0 0 80px",
      fontFamily: "'JetBrains Mono','Fira Code',monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes livePulse{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;margin:0;padding:0;}
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: "center", padding: "64px 24px 48px",
        opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)",
        transition: "all 0.8s ease",
      }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 22 }}>
          <div style={{
            width: 84, height: 84, borderRadius: "50%",
            background: "linear-gradient(135deg,#C17A3530,#FFA11625,#2DB52620)",
            border: "2px solid #C17A3545",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, fontFamily: "'Syne',sans-serif", color: "#f0ddb0",
          }}>HV</div>
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 18, height: 18, background: "#2DB526", borderRadius: "50%", border: "3px solid #060810" }} />
        </div>
        <h1 style={{
          fontSize: "clamp(26px,5vw,52px)", fontWeight: 900,
          fontFamily: "'Syne',sans-serif", color: "#f0ece4",
          letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 9,
        }}>Harish Vardhan D</h1>
        <p style={{ color: "#94a3b8", fontSize: 14, letterSpacing: "0.2em", marginBottom: 5 }}>
          COIMBATORE INSTITUTE OF TECHNOLOGY
        </p>
        <p style={{ color: "#94a3b8", fontSize: 16, letterSpacing: "0.14em" }}>
          COIMBATORE, INDIA · COMPETITIVE PROGRAMMER
        </p>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 18px" }}>

        {/* ── SUMMARY (commented out) ───────────────────────────────────────
        <SummaryBanner platformData={platformData} loading={loading} mounted={mounted} />
        ── END SUMMARY ──────────────────────────────────────────────────────── */}

        {/* ── FEATURED CARDS: LeetCode + Codeforces only ─ */}
        <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "'JetBrains Mono',monospace" }}>
          ▸ FEATURED · DETAILED LIVE CARDS
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16, marginBottom: 28,
          alignItems: "stretch",
        }}>
          {/* LeetCode */}
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(22px)", transition: "all 0.7s ease 0.2s", display: "flex", flexDirection: "column" }}>
            {loading
              ? <PendingCard platform={HARISH_DATA.leetcode} pkey="leetcode" meta={PLATFORM_META.leetcode} />
              : <LeetCodeCard data={platformData.leetcode || MOCK_LEETCODE} meta={PLATFORM_META.leetcode} />
            }
          </div>

          {/* Codeforces */}
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(22px)", transition: "all 0.7s ease 0.3s", display: "flex", flexDirection: "column" }}>
            {loading
              ? <PendingCard platform={HARISH_DATA.codeforces} pkey="codeforces" meta={PLATFORM_META.codeforces} />
              : <CodeforcesCard data={platformData.codeforces || MOCK_CODEFORCES} meta={PLATFORM_META.codeforces} />
            }
          </div>

          {/* CodeChef — commented out
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(22px)", transition: "all 0.7s ease 0.4s" }}>
            <CodeChefCard data={HARISH_DATA.codechef} meta={PLATFORM_META.codechef} />
          </div>
          */}

          {/* GeeksforGeeks — commented out
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(22px)", transition: "all 0.7s ease 0.5s" }}>
            {platformData.gfg
              ? <GenericLiveCard data={platformData.gfg} pkey="gfg" meta={PLATFORM_META.gfg} />
              : <PendingCard platform={HARISH_DATA.gfg} pkey="gfg" meta={PLATFORM_META.gfg} />
            }
          </div>
          */}

          {/* HackerRank — commented out
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(22px)", transition: "all 0.7s ease 0.6s" }}>
            {loading
              ? <PendingCard platform={HARISH_DATA.hackerrank} pkey="hackerrank" meta={PLATFORM_META.hackerrank} />
              : <HackerRankCard data={platformData.hackerrank || MOCK_HACKERRANK} meta={PLATFORM_META.hackerrank} />
            }
          </div>
          */}

          {/* CodeStudio — commented out
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(22px)", transition: "all 0.7s ease 0.7s" }}>
            {platformData.codestudio
              ? <GenericLiveCard data={platformData.codestudio} pkey="codestudio" meta={PLATFORM_META.codestudio} />
              : <PendingCard platform={HARISH_DATA.codestudio} pkey="codestudio" meta={PLATFORM_META.codestudio} />
            }
          </div>
          */}
        </div>

        {/* ── OTHER PLATFORM LINKS ─────────────────────────────────────────── */}
        <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: "0.2em", marginBottom: 14, fontFamily: "'JetBrains Mono',monospace" }}>
          ▸ OTHER PROFILES
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          {[
            { key: "codechef",   label: "CodeChef",      url: HARISH_DATA.codechef.profileUrl   },
            { key: "gfg",        label: "GeeksforGeeks", url: HARISH_DATA.gfg.profileUrl        },
            { key: "hackerrank", label: "HackerRank",    url: HARISH_DATA.hackerrank.profileUrl },
            { key: "codestudio", label: "CodeStudio",    url: HARISH_DATA.codestudio.profileUrl },
          ].map(({ key, label, url }) => {
            const m = PLATFORM_META[key];
            return (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `${m.color}0e`, border: `1px solid ${m.color}30`,
                color: m.color, borderRadius: 10, padding: "10px 18px",
                textDecoration: "none", fontSize: 14,
                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${m.color}18`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${m.color}0e`; e.currentTarget.style.transform = "none"; }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: `${m.color}22`, border: `1px solid ${m.color}40`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                }}>{m.text}</span>
                {label} ↗
              </a>
            );
          })}
        </div>

        {/* ── FOOTER DISCLAIMER ────────────────────────────────────────────── */}
        {/*
        <div style={{
          marginTop: 40, padding: "16px 20px", borderRadius: 12,
          background: "#08090f", border: "1px solid #0f1520",
          textAlign: "center", fontSize: 14, color: "#64748b",
          fontFamily: "'JetBrains Mono',monospace", lineHeight: 2, letterSpacing: "0.08em",
        }}>
          Statistics are fetched from publicly available profile data and cached periodically.<br />
          LeetCode & Codeforces: direct APIs · GFG, HackerRank, CodeStudio: via Codolio (Yugen27)<br />
          Backend: <span style={{ color: "#94a3b8" }}>npm start  →  :4000</span> ·
          Codolio / CodeStudio requires <span style={{ color: "#94a3b8" }}>USE_PUPPETEER=true</span>
        </div>
        */}
      </div>
    </div>
  );
}