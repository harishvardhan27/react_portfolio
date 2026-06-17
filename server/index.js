/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║     Coding Profiles Aggregator — Complete Backend (server.js)        ║
 * ║     Platforms: LeetCode · Codeforces · GFG · HackerRank · CodeStudio ║
 * ║     Stack: Node.js + Express + Axios + Cheerio + NodeCache            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * INSTALL:
 *   npm install express cors axios cheerio node-cache puppeteer
 *
 * RUN:
 *   node server.js   (or: PORT=4000 node server.js)
 *
 * ENDPOINTS:
 *   GET /api/leetcode/:username
 *   GET /api/codeforces/:handle
 *   GET /api/gfg/:username
 *   GET /api/hackerrank/:username
 *   GET /api/codestudio/:username
 *   GET /api/aggregate?leetcode=u&codeforces=h&gfg=u&hackerrank=u&codestudio=u
 *   GET /api/health
 */

"use strict";

const express   = require("express");
const cors      = require("cors");
const axios     = require("axios");
const cheerio   = require("cheerio");
const NodeCache = require("node-cache");

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// CACHE
// TTL: 6 hours (21 600 s) for most platforms, 12 hours for slow-changing data.
// → Swap NodeCache for Redis in production:
//     const redis = require("redis");
//     const client = redis.createClient({ url: process.env.REDIS_URL });
//     await client.connect();
//     Usage: await client.setEx(key, ttl, JSON.stringify(data));
// ─────────────────────────────────────────────────────────────────────────────
const cache = new NodeCache({ stdTTL: 21_600, checkperiod: 3_600 });

const PORT = process.env.PORT || 4000;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** Wraps any async fetch with cache-get / cache-set logic. */
async function withCache(key, ttl, fetchFn) {
  const cached = cache.get(key);
  if (cached) {
    console.log(`[CACHE HIT] ${key}`);
    return { ...cached, _cached: true };
  }
  console.log(`[CACHE MISS] ${key} — fetching live…`);
  const fresh = await fetchFn();
  cache.set(key, fresh, ttl);
  return { ...fresh, _cached: false };
}

/** Unified error shape — keeps UI from ever seeing an unhandled crash. */
function errShape(platform, username, err) {
  console.error(`[ERROR] ${platform}/${username}: ${err?.message}`);
  return {
    platform,
    username,
    error:       true,
    errorMsg:    err?.message || "Unknown error",
    solved:      { total: 0 },
    lastUpdated: null,
  };
}

/**
 * A realistic browser User-Agent + common headers to reduce bot detection.
 * Rotate these or use a proxy pool for high-traffic deployments.
 */
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/121.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9," +
    "image/avif,image/webp,*/*;q=0.8",
  "Accept-Language":  "en-US,en;q=0.5",
  "Accept-Encoding":  "gzip, deflate, br",
  "Connection":       "keep-alive",
  "Cache-Control":    "no-cache",
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. LEETCODE  — Public GraphQL API (no auth)
//    Endpoint: https://leetcode.com/graphql
//    Method  : POST with GraphQL body
//    Notes   : Requires Referer + Origin headers to bypass 403.
//              One query fetches: submission stats, profile ranking,
//              badges, contest ranking — all in one round-trip.
// ─────────────────────────────────────────────────────────────────────────────

/** Combined GraphQL query for all useful public fields. */
const LEETCODE_QUERY = `
  query getCombinedProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        reputation
        starRating
        realName
        aboutMe
        countryName
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      problemsSolvedBeatsStats {
        difficulty
        percentage
      }
      badges {
        id
        name
        shortName
        icon
      }
      activeBadge {
        id
        name
        icon
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
  }
`;

app.get("/api/leetcode/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const data = await withCache(`lc:${username}`, 21_600, async () => {

      const response = await axios.post(
        "https://leetcode.com/graphql",
        { query: LEETCODE_QUERY, variables: { username } },
        {
          headers: {
            "Content-Type": "application/json",
            "Referer":      "https://leetcode.com",
            "Origin":       "https://leetcode.com",
            // LeetCode's GraphQL endpoint does NOT require auth for public stats,
            // but it does check Referer + Origin to block direct API access.
            ...BROWSER_HEADERS,
          },
          timeout: 12_000,
        }
      );

      const user    = response.data?.data?.matchedUser;
      const contest = response.data?.data?.userContestRanking;

      if (!user) throw new Error(`LeetCode user "${username}" not found.`);

      // Flatten difficulty array → { all, easy, medium, hard }
      const solvedMap = {};
      (user.submitStatsGlobal?.acSubmissionNum || []).forEach(({ difficulty, count }) => {
        solvedMap[difficulty.toLowerCase()] = count;
      });

      // Flatten "beats" percentage array
      const beatsMap = {};
      (user.problemsSolvedBeatsStats || []).forEach(({ difficulty, percentage }) => {
        if (percentage !== null) beatsMap[difficulty.toLowerCase()] = percentage.toFixed(1);
      });

      return {
        platform:    "LeetCode",
        username:    user.username,
        profileUrl:  `https://leetcode.com/u/${user.username}/`,

        // Submission stats
        solved: {
          total:  solvedMap.all    || 0,
          easy:   solvedMap.easy   || 0,
          medium: solvedMap.medium || 0,
          hard:   solvedMap.hard   || 0,
        },

        // Beats percentile (how many users you outperformed)
        beats: {
          easy:   beatsMap.easy   || null,
          medium: beatsMap.medium || null,
          hard:   beatsMap.hard   || null,
        },

        // Profile
        globalRanking: user.profile?.ranking      || null,
        reputation:    user.profile?.reputation   || 0,
        country:       user.profile?.countryName  || null,

        // Contest
        contest: contest ? {
          attended:         contest.attendedContestsCount,
          rating:           Math.round(contest.rating || 0),
          globalRank:       contest.globalRanking,
          topPercentage:    contest.topPercentage?.toFixed(2),
          badge:            contest.badge?.name || null,
        } : null,

        // Badges
        badges:      (user.badges || []).map(b => b.name),
        activeBadge: user.activeBadge?.name || null,

        lastUpdated: new Date().toISOString(),
      };
    });

    res.json(data);
  } catch (err) {
    // On error, attempt to return whatever stale cache we have
    const stale = cache.get(`lc:${username}`);
    if (stale) return res.json({ ...stale, _stale: true });
    res.status(502).json(errShape("LeetCode", username, err));
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// 2. CODEFORCES  — Official Public REST API (no auth)
//    Endpoints used:
//      • https://codeforces.com/api/user.info?handles={handle}
//      • https://codeforces.com/api/user.status?handle={handle}&count=10000
//      • https://codeforces.com/api/user.rating?handle={handle}
//    Notes   : Fetches all three in parallel (Promise.all).
//              Deduplicates accepted submissions by (contestId, problemIndex).
//              Rating history gives contest count & peak performance delta.
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/codeforces/:handle", async (req, res) => {
  const { handle } = req.params;

  try {
    const data = await withCache(`cf:${handle}`, 21_600, async () => {

      // Fire all three API calls simultaneously — avg ~2s total vs ~6s sequential
      const [infoRes, subsRes, ratingRes] = await Promise.all([
        axios.get(
          `https://codeforces.com/api/user.info?handles=${handle}`,
          { timeout: 10_000 }
        ),
        axios.get(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`,
          { timeout: 20_000 }
        ),
        axios.get(
          `https://codeforces.com/api/user.rating?handle=${handle}`,
          { timeout: 10_000 }
        ),
      ]);

      if (infoRes.data.status !== "OK") throw new Error(`CF handle "${handle}" not found.`);
      const user = infoRes.data.result[0];

      // ── Deduplicate accepted submissions ──────────────────────────────────
      // CF can return multiple AC verdicts for the same problem (different attempts).
      // We only want to count each unique problem ONCE.
      const acceptedSet = new Set();
      const diffCount   = { A: 0, B: 0, C: 0, D: 0, "E+": 0 }; // by index letter

      (subsRes.data.result || []).forEach(sub => {
        if (sub.verdict !== "OK") return;
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        if (acceptedSet.has(key)) return;
        acceptedSet.add(key);
        const letter = sub.problem.index[0].toUpperCase();
        if      (letter === "A") diffCount.A++;
        else if (letter === "B") diffCount.B++;
        else if (letter === "C") diffCount.C++;
        else if (letter === "D") diffCount.D++;
        else                     diffCount["E+"]++;
      });

      // ── Rating history analysis ───────────────────────────────────────────
      const ratingHistory = ratingRes.data.result || [];
      let bestRank  = Infinity;
      let worstRank = 0;
      let maxUp     = 0;
      let maxDown   = 0;

      ratingHistory.forEach(entry => {
        if (entry.rank < bestRank)  bestRank  = entry.rank;
        if (entry.rank > worstRank) worstRank = entry.rank;
        const delta = entry.newRating - entry.oldRating;
        if (delta > maxUp)    maxUp   = delta;
        if (delta < maxDown)  maxDown = delta;
      });

      // CF rank → display colour mapping (for frontend use)
      const RANK_COLOURS = {
        "newbie":                    "#808080",
        "pupil":                     "#008000",
        "specialist":                "#03A89E",
        "expert":                    "#0000FF",
        "candidate master":          "#AA00AA",
        "master":                    "#FF8C00",
        "international master":      "#FF8C00",
        "grandmaster":               "#FF0000",
        "international grandmaster": "#FF0000",
        "legendary grandmaster":     "#FF0000",
      };

      return {
        platform:   "Codeforces",
        username:   user.handle,
        profileUrl: `https://codeforces.com/profile/${user.handle}`,
        avatar:     user.avatar || null,
        country:    user.country || null,

        solved: {
          total: acceptedSet.size,
          byIndex: diffCount, // A/B/C/D/E+ breakdown
        },

        rating:      user.rating    || 0,
        maxRating:   user.maxRating || 0,
        rank:        user.rank      || "unranked",
        maxRank:     user.maxRank   || "unranked",
        rankColour:  RANK_COLOURS[(user.rank || "").toLowerCase()] || "#808080",

        contests: {
          count:     ratingHistory.length,
          bestRank:  bestRank  === Infinity ? null : bestRank,
          worstRank: worstRank === 0        ? null : worstRank,
          maxRatingGain: maxUp,
          maxRatingDrop: maxDown,
        },

        lastUpdated: new Date().toISOString(),
      };
    });

    res.json(data);
  } catch (err) {
    const stale = cache.get(`cf:${handle}`);
    if (stale) return res.json({ ...stale, _stale: true });
    res.status(502).json(errShape("Codeforces", handle, err));
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// 3. GEEKSFORGEEKS  — Community JSON API (primary) + HTML scrape (fallback)
//
//    PRIMARY  : https://geeks-for-geeks-api.vercel.app/{username}
//               Open-source community API (github.com/arnoob16/GeeksForGeeksAPI)
//               Returns clean JSON: info{codingScore, totalProblemsSolved,
//               instituteRank, currentStreak, maxStreak, institution} +
//               solvedStats{school, basic, easy, medium, hard}
//
//    FALLBACK : Direct HTML scrape of geeksforgeeks.org/profile/{username}
//               GFG is Next.js SSR — we parse the __NEXT_DATA__ JSON blob.
//               This blob has moved between page versions, so we try several paths.
//
//    WHY primary is the community API:
//      The GFG profile page now redirects unauthenticated requests and returns
//      a 404/empty __NEXT_DATA__ blob in some regions. The community API is
//      more consistently accessible and returns a stable JSON shape.
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/gfg/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const data = await withCache(`gfg:${username}`, 21_600, async () => {

      // ── Strategy 1: Community API (geeks-for-geeks-api.vercel.app) ─────────
      // Response shape:
      //   { info: { userName, codingScore, totalProblemsSolved, instituteRank,
      //             currentStreak, maxStreak, institution, languagesUsed },
      //     solvedStats: { school: {count}, basic: {count},
      //                    easy: {count}, medium: {count}, hard: {count} } }
      try {
        const apiRes = await axios.get(
          `https://geeks-for-geeks-api.vercel.app/${username}`,
          {
            headers: { "Accept": "application/json", ...BROWSER_HEADERS },
            timeout: 15_000,
          }
        );

        // API returns { error: "Profile Not Found" } for invalid usernames
        if (apiRes.data?.error) {
          throw new Error(`GFG user "${username}" not found: ${apiRes.data.error}`);
        }

        const info  = apiRes.data?.info        || {};
        const stats = apiRes.data?.solvedStats || {};

        const school = parseInt(stats.school?.count) || 0;
        const basic  = parseInt(stats.basic?.count)  || 0;
        const easy   = parseInt(stats.easy?.count)   || 0;
        const medium = parseInt(stats.medium?.count) || 0;
        const hard   = parseInt(stats.hard?.count)   || 0;
        const total  = parseInt(info.totalProblemsSolved) ||
                       (school + basic + easy + medium + hard);

        return {
          platform:     "GeeksforGeeks",
          username:     info.userName || username,
          profileUrl:   `https://www.geeksforgeeks.org/profile/${username}`,
          institution:  info.institution || null,
          languages:    info.languagesUsed || null,

          solved: { total, school, basic, easy, medium, hard },

          codingScore:   parseInt(info.codingScore)       || 0,
          monthlyScore:  parseInt(info.monthlyCodingScore) || 0,
          instituteRank: info.instituteRank || null,
          streak: {
            current: parseInt(info.currentStreak) || 0,
            max:     parseInt(info.maxStreak)     || 0,
          },
          _source:     "community-api",
          lastUpdated: new Date().toISOString(),
        };

      } catch (apiErr) {
        console.warn(`[GFG] Community API failed (${apiErr.message}). Trying direct HTML scrape…`);
      }

      // ── Strategy 2: Direct HTML scrape — parse Next.js __NEXT_DATA__ blob ──
      // GFG is SSR via Next.js. All profile data is embedded in a JSON blob
      // inside <script id="__NEXT_DATA__"> — this is far more reliable than
      // brittle CSS class selectors which change with every GFG redesign.
      const { data: html } = await axios.get(
        `https://www.geeksforgeeks.org/profile/${username}`,
        { headers: BROWSER_HEADERS, timeout: 15_000 }
      );
      const $ = cheerio.load(html);

      // Try to parse __NEXT_DATA__ embedded JSON
      const nextDataRaw = $("#__NEXT_DATA__").html();
      if (nextDataRaw) {
        const pageData = JSON.parse(nextDataRaw);
        const props    = pageData?.props?.pageProps || {};

        // GFG has moved this data between versions — try all known paths
        const info = props?.userInfo || props?.profileInfo || props?.data?.userInfo || {};
        const prac = props?.practiceStats || props?.userStats || props?.data?.practiceStats || {};
        const diff = prac?.problemsSolvedByDifficulty || {};

        const school = diff.school || 0;
        const basic  = diff.basic  || 0;
        const easy   = diff.easy   || 0;
        const medium = diff.medium || 0;
        const hard   = diff.hard   || 0;
        const total  = parseInt(info.totalProblems || prac.totalProblemsSolved || 0) ||
                       (school + basic + easy + medium + hard);

        return {
          platform:     "GeeksforGeeks",
          username,
          profileUrl:   `https://www.geeksforgeeks.org/profile/${username}`,
          solved:       { total, school, basic, easy, medium, hard },
          codingScore:  parseInt(info.score || prac.codingScore) || 0,
          instituteRank: String(info.instituteRank || prac.instituteRank || ""),
          streak: {
            current: parseInt(prac.currentStreak || info.currentStreak) || 0,
            max:     parseInt(prac.maxStreak     || info.maxStreak)     || 0,
          },
          _source:     "html-nextdata",
          lastUpdated: new Date().toISOString(),
        };
      }

      // ── Strategy 3: Raw DOM selectors (last resort) ───────────────────────
      let codingScore = 0, problemsSolved = 0;
      $("[class*='scoreCard'], [class*='score_card']").each((_, el) => {
        const n = parseInt($(el).text().replace(/[^0-9]/g, ""));
        if (!isNaN(n) && n > codingScore) codingScore = n;
      });
      $("[class*='solvedProblem'], [class*='problemsSolved'], [class*='solved_problem']").each((_, el) => {
        const n = parseInt($(el).text().trim());
        if (!isNaN(n)) problemsSolved = Math.max(problemsSolved, n);
      });

      return {
        platform:     "GeeksforGeeks",
        username,
        profileUrl:   `https://www.geeksforgeeks.org/profile/${username}`,
        solved:       { total: problemsSolved },
        codingScore,
        _source:      "html-dom",
        lastUpdated:  new Date().toISOString(),
      };
    });

    res.json(data);
  } catch (err) {
    const stale = cache.get(`gfg:${username}`);
    if (stale) return res.json({ ...stale, _stale: true });
    res.status(502).json(errShape("GeeksforGeeks", username, err));
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// 4. HACKERRANK  — Semi-public JSON REST API + HTML badge scraping
//    Primary  : https://www.hackerrank.com/rest/contests/master/hackers/{username}/profile
//    Badges   : https://www.hackerrank.com/rest/hackers/{username}/badges
//    Notes   : HackerRank doesn't officially document these endpoints but they
//              return clean JSON and work without authentication.
//              The robots.txt disallow applies to crawlers, not programmatic API calls.
//              Server-side requests from a backend bypass the browser robots.txt check.
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/hackerrank/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const data = await withCache(`hr:${username}`, 21_600, async () => {

      // ── Primary: Master contest profile (clean JSON) ──────────────────────
      // Returns: name, country, skills, level, avatar, school, short_bio
      const [profileRes, badgesRes] = await Promise.allSettled([
        axios.get(
          `https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`,
          { headers: { ...BROWSER_HEADERS, "X-Requested-With": "XMLHttpRequest" }, timeout: 12_000 }
        ),
        // Returns array of badge objects: { name, stars, current_points, level }
        axios.get(
          `https://www.hackerrank.com/rest/hackers/${username}/badges`,
          { headers: { ...BROWSER_HEADERS, "X-Requested-With": "XMLHttpRequest" }, timeout: 12_000 }
        ),
      ]);

      // Extract profile data
      let profile    = {};
      let totalStars = 0;
      let badges     = [];

      if (profileRes.status === "fulfilled") {
        const p = profileRes.value.data?.model || {};
        profile = {
          name:    p.name      || username,
          country: p.country   || null,
          school:  p.school    || null,
          bio:     p.short_bio || null,
          avatar:  p.avatar    || null,
          level:   p.level     || null,
        };
      }

      if (badgesRes.status === "fulfilled") {
        const rawBadges = badgesRes.value.data?.models || [];
        badges = rawBadges.map(b => ({
          name:  b.name,
          stars: b.stars         || 0,
          level: b.current_level || null,
        }));
        totalStars = rawBadges.reduce((sum, b) => sum + (b.stars || 0), 0);
      }

      // ── Fallback: Scrape the HTML profile page for solved count ───────────
      // HackerRank doesn't expose "problems solved" count in its JSON API —
      // it only shows score per track. We scrape the HTML for the total.
      let totalSolved = 0;
      try {
        const { data: html } = await axios.get(
          `https://www.hackerrank.com/profile/${username}`,
          { headers: BROWSER_HEADERS, timeout: 12_000 }
        );
        const $ = cheerio.load(html);

        // HackerRank shows per-track solve counts in `.submissions_count` spans
        $(".submissions_count, [data-analytics='ProblemCount']").each((_, el) => {
          const n = parseInt($(el).text().trim().replace(/[^0-9]/g, ""));
          if (!isNaN(n)) totalSolved += n;
        });

        // Also look for Next.js __NEXT_DATA__ blob
        const nextBlob = $("#__NEXT_DATA__").html();
        if (nextBlob && totalSolved === 0) {
          try {
            const nd = JSON.parse(nextBlob);
            const solved =
              nd?.props?.pageProps?.profileStats?.totalSolved ||
              nd?.props?.pageProps?.userProfile?.totalSolved  || 0;
            if (solved) totalSolved = solved;
          } catch (_) {}
        }
      } catch (htmlErr) {
        console.warn(`[HackerRank] HTML scrape failed: ${htmlErr.message}`);
      }

      return {
        platform:   "HackerRank",
        username,
        profileUrl: `https://www.hackerrank.com/profile/${username}`,

        ...profile,

        solved: { total: totalSolved },

        badges,               // [{ name, stars, level }, ...]
        totalBadges: badges.length,
        totalStars,           // sum of all badge stars (e.g. 5★ Problem Solving)

        lastUpdated: new Date().toISOString(),
      };
    });

    res.json(data);
  } catch (err) {
    const stale = cache.get(`hr:${username}`);
    if (stale) return res.json({ ...stale, _stale: true });
    res.status(502).json(errShape("HackerRank", username, err));
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// 5. CODESTUDIO (Coding Ninjas / Code360 by Naukri)
//
//    Code360 is a 100% client-side React SPA — plain Axios only returns the
//    loading spinner HTML ("Almost there..."), so we MUST use Puppeteer.
//
//    APPROACH: Network Response Interception (most robust technique)
//    ───────────────────────────────────────────────────────────────
//    Instead of relying on fragile CSS class selectors that break on every
//    redesign, we launch headless Chrome, navigate to the profile, and
//    intercept every XHR/fetch response the page makes.  When a response
//    contains profile-shaped data (problemsSolved, codingScore, etc.),
//    we capture it and close the browser immediately — no DOM parsing needed.
//
//    This technique is future-proof: even if Code360 changes their API
//    endpoint or class names, we still capture the data they request.
//
//    PREREQUISITE:
//      npm install puppeteer
//      (downloads ~170 MB Chromium binary on first run)
//      Then set USE_PUPPETEER=true in your .env file.
//
//    NO-PUPPETEER FALLBACK:
//      If Puppeteer is not installed / not enabled, returns a structured
//      "unavailable" response with the profile URL so the UI can show a
//      "Visit profile" link gracefully.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Launch headless Chrome, intercept all API responses made by the Code360
 * profile page, and return the first response that contains profile data.
 *
 * Strategy: page.on('response') fires for every network response.
 * We parse JSON responses and look for keys like problemsSolved, codingScore,
 * globalRank.  This works even if the API endpoint URL changes.
 */
async function scrapeCodeStudioWithPuppeteer(username) {
  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch({
    headless: "new",                  // new headless mode (Puppeteer ≥ 21)
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",      // prevents OOM crash in Docker / CI
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-networking",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(BROWSER_HEADERS["User-Agent"]);
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    });

    // ── Intercept API responses via network listener ──────────────────────
    // We use a Promise race: either we find profile data in a network response,
    // or we fall back to DOM extraction after the page fully loads.
    let capturedProfileData = null;

    page.on("response", async (response) => {
      if (capturedProfileData) return;           // already found, ignore rest
      const url = response.url();
      const ct  = response.headers()["content-type"] || "";

      // Only bother parsing JSON API responses (skip images, CSS, JS bundles)
      if (!ct.includes("application/json")) return;
      if (!url.includes("codingninjas") && !url.includes("naukri")) return;

      try {
        const json = await response.json();
        // Walk the JSON to find profile-shaped data.
        // Code360 nests data differently across versions, so we search recursively.
        const found = findProfileData(json);
        if (found) {
          console.log(`[CodeStudio] Captured profile data from: ${url}`);
          capturedProfileData = found;
        }
      } catch (_) {
        // Response wasn't parseable JSON — skip silently
      }
    });

    // Navigate and wait for the React app to boot and fire its API calls
    await page.goto(
      `https://www.naukri.com/code360/profile/${username}`,
      { waitUntil: "networkidle0", timeout: 35_000 }
    );

    // If network interception caught the data, use it
    if (capturedProfileData) {
      return capturedProfileData;
    }

    // ── Fallback: DOM extraction after page render ────────────────────────
    // Wait for any stat element to appear (generous selector)
    await page.waitForSelector(
      "h4, [class*='stat'], [class*='score'], [class*='solved'], [class*='problem']",
      { timeout: 10_000 }
    ).catch(() => {});  // timeout is OK — we'll still try to extract

    const domResult = await page.evaluate(() => {
      // Scan all visible numbers on the page — the largest cluster likely
      // represents problems solved. Use heuristics to identify each stat.
      const allText = document.body.innerText;
      const numbers = [...allText.matchAll(/\b(\d{1,6})\b/g)].map(m => parseInt(m[1]));

      // Try specific text patterns first (most reliable)
      const extractNear = (labelRegex) => {
        const match = allText.match(new RegExp(labelRegex + "[^\\d]*(\\d+)", "i"));
        return match ? parseInt(match[1]) : 0;
      };

      const solved = extractNear("problems?\\s*solved")  ||
                     extractNear("total\\s*solved")       ||
                     extractNear("questions?\\s*solved")  || 0;

      const score  = extractNear("coding\\s*score")  ||
                     extractNear("score")             || 0;

      const rank   = extractNear("global\\s*rank")   ||
                     extractNear("rank")              || 0;

      return { solved, score, rank: rank ? String(rank) : "" };
    });

    return {
      problemsSolved: domResult.solved,
      codingScore:    domResult.score,
      globalRank:     domResult.rank,
      _extractedBy:   "dom-heuristic",
    };

  } finally {
    await browser.close();
  }
}

/**
 * Recursively walks a JSON object looking for a "profile data" shape.
 * Returns a normalized object if found, null otherwise.
 * This makes us resilient to Code360's API path/nesting changes.
 */
function findProfileData(obj, depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 6) return null;

  // Direct hit — object has at least one of the expected profile keys
  const hasProfileKeys = (
    ("problemsSolved" in obj || "problems_solved" in obj || "totalSolved" in obj) ||
    ("codingScore"    in obj || "coding_score"    in obj) ||
    ("globalRank"     in obj || "global_rank"     in obj)
  );

  if (hasProfileKeys) {
    return {
      problemsSolved: obj.problemsSolved || obj.problems_solved || obj.totalSolved || 0,
      codingScore:    obj.codingScore    || obj.coding_score    || obj.score       || 0,
      globalRank:     String(obj.globalRank || obj.global_rank  || obj.rank || ""),
      name:           obj.name || obj.username || obj.userName  || null,
      _extractedBy:   "network-interception",
    };
  }

  // Recurse into arrays and objects
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findProfileData(item, depth + 1);
      if (found) return found;
    }
  } else {
    for (const key of Object.keys(obj)) {
      const found = findProfileData(obj[key], depth + 1);
      if (found) return found;
    }
  }

  return null;
}

app.get("/api/codestudio/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const data = await withCache(`cs:${username}`, 21_600, async () => {

      if (process.env.USE_PUPPETEER !== "true") {
        // Puppeteer not enabled — return a graceful "unavailable" response.
        // The frontend will render a "Visit Profile" fallback card.
        console.warn(`[CodeStudio] Puppeteer disabled. Set USE_PUPPETEER=true in .env`);
        return {
          platform:       "CodeStudio",
          username,
          profileUrl:     `https://www.naukri.com/code360/profile/${username}`,
          solved:         { total: 0 },
          _unavailable:   true,
          _reason:        "Code360 is a client-side React SPA — set USE_PUPPETEER=true in .env to enable data fetching",
          lastUpdated:    new Date().toISOString(),
        };
      }

      // ── Puppeteer with network interception ───────────────────────────────
      const raw = await scrapeCodeStudioWithPuppeteer(username);

      return {
        platform:   "CodeStudio",
        username,
        profileUrl: `https://www.naukri.com/code360/profile/${username}`,
        solved:     { total: raw.problemsSolved || 0 },
        rating:     raw.codingScore || 0,
        globalRank: raw.globalRank  || null,
        name:       raw.name        || null,
        _source:    raw._extractedBy || "puppeteer",
        lastUpdated: new Date().toISOString(),
      };
    });

    res.json(data);
  } catch (err) {
    const stale = cache.get(`cs:${username}`);
    if (stale) return res.json({ ...stale, _stale: true });
    res.status(502).json(errShape("CodeStudio", username, err));
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// CODOLIO — Public profile scraper (Puppeteer + network interception)
//
// Codolio is a client-side React SPA. The public profile page at
//   https://codolio.com/profile/<username>
// fires one or more XHR calls to api.codolio.com to load the user's linked
// platform stats (GFG, HackerRank, CodeStudio, etc.).
// We intercept those responses and parse out the platform-specific data.
//
// Requires: USE_PUPPETEER=true  in .env
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recursively walks a Codolio JSON response to find platformProfiles array.
 * Returns the array if found, null otherwise.
 */
function findCodolioPlatforms(obj, depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 8) return null;

  // Direct hit — object has platformProfiles array
  if (Array.isArray(obj.platformProfiles)) return obj.platformProfiles;
  if (Array.isArray(obj.platform_profiles)) return obj.platform_profiles;

  // Sometimes nested under data.platformProfiles.platformProfiles
  for (const key of Object.keys(obj)) {
    const found = findCodolioPlatforms(obj[key], depth + 1);
    if (found) return found;
  }
  return null;
}

/**
 * Parse a single platform entry from Codolio's platformProfiles array.
 * Returns a normalized object or null.
 */
function parseCodolioPlatform(entry) {
  if (!entry || !entry.platform) return null;

  const platform = (entry.platform || "").toLowerCase();
  const qs = entry.totalQuestionStats || entry.questionStats || entry.stats || {};

  const total = qs.totalQuestionCounts || qs.total || qs.totalSolved || 0;
  const easy  = (qs.easyQuestionCounts  || qs.easy  || 0)
              + (qs.basicQuestionCounts  || 0)
              + (qs.schoolQuestionCounts || 0);  // GFG uses "basic"/"school" as easy
  const medium = qs.mediumQuestionCounts || qs.medium || 0;
  const hard   = qs.hardQuestionCounts   || qs.hard   || 0;

  // Additional platform-specific fields
  const score  = entry.codingScore  || entry.score  || qs.score  || 0;
  const rank   = entry.globalRank   || entry.rank   || "";
  const rating = entry.rating       || entry.currentRating || 0;
  const badges = entry.badges       || entry.totalBadges   || 0;
  const stars  = entry.stars        || entry.totalStars    || 0;

  // Streak & contest info
  const streak    = entry.currentStreak || entry.streak || 0;
  const maxStreak = entry.maxStreak || 0;
  const contests  = entry.totalContests || entry.contests || 0;

  return {
    platform,
    total, easy, medium, hard,
    score, rank, rating, badges, stars,
    streak, maxStreak, contests,
    _raw: entry,  // keep raw for debugging
  };
}

async function scrapeCodolioWithPuppeteer(username) {
  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // Intercept responses from api.codolio.com
    let capturedPlatforms = null;
    let capturedRaw       = null;

    page.on("response", async (response) => {
      if (capturedPlatforms) return;

      const url = response.url();
      const ct  = response.headers()["content-type"] || "";

      if (!ct.includes("application/json")) return;
      if (!url.includes("codolio.com"))      return;

      try {
        const json = await response.json();
        console.log(`[Codolio] Intercepted: ${url}`);
        const platforms = findCodolioPlatforms(json);
        if (platforms && platforms.length > 0) {
          console.log(`[Codolio] Found ${platforms.length} platform profiles`);
          capturedPlatforms = platforms;
          capturedRaw       = json;
        }
      } catch (_) {
        // Non-JSON or empty — skip
      }
    });

    // Load the public profile page (no login required)
    await page.goto(
      `https://codolio.com/profile/${username}`,
      { waitUntil: "networkidle0", timeout: 40_000 }
    );

    // Give any deferred requests a moment to settle
    if (!capturedPlatforms) {
      await new Promise(r => setTimeout(r, 3000));
    }

    if (capturedPlatforms) {
      return { platforms: capturedPlatforms, _source: "network-interception" };
    }

    // ── DOM fallback: try to extract visible numbers ─────────────────────────
    console.warn("[Codolio] Network interception missed — trying DOM fallback");

    const domResult = await page.evaluate(() => {
      const text = document.body.innerText;
      const extract = (regex) => {
        const m = text.match(regex);
        return m ? parseInt(m[1]) : 0;
      };

      return {
        gfgSolved:  extract(/geeks.for.geeks[^\d]*(\d+)/i) ||
                    extract(/gfg[^\d]*(\d+)/i),
        hrBadges:   extract(/badge[s]?[^\d]*(\d+)/i),
        csSolved:   extract(/code\s*studio[^\d]*(\d+)/i) ||
                    extract(/coding\s*ninjas[^\d]*(\d+)/i),
      };
    });

    return { platforms: null, domFallback: domResult, _source: "dom-heuristic" };

  } finally {
    await browser.close();
  }
}

app.get("/api/codolio/:username", async (req, res) => {
  const { username } = req.params;
  const { platform } = req.query;   // optional: ?platform=gfg|hackerrank|codestudio

  try {
    const data = await withCache(`codolio:${username}`, 21_600, async () => {

      if (process.env.USE_PUPPETEER !== "true") {
        console.warn("[Codolio] Puppeteer disabled. Set USE_PUPPETEER=true in .env");
        return {
          platform:     "Codolio",
          username,
          profileUrl:   `https://codolio.com/profile/${username}`,
          platforms:    [],
          _unavailable: true,
          _reason:      "Codolio is a client-side SPA — set USE_PUPPETEER=true in .env to enable",
          lastUpdated:  new Date().toISOString(),
        };
      }

      const raw = await scrapeCodolioWithPuppeteer(username);

      // Parse all platforms from the array
      const parsed = {};
      if (raw.platforms) {
        for (const entry of raw.platforms) {
          const p = parseCodolioPlatform(entry);
          if (p) parsed[p.platform] = p;
        }
      }

      return {
        platform:    "Codolio",
        username,
        profileUrl:  `https://codolio.com/profile/${username}`,
        platforms:   parsed,          // keyed by platform name: { gfg: {...}, hackerrank: {...} }
        _source:     raw._source,
        lastUpdated: new Date().toISOString(),
      };
    });

    // If a specific platform was requested via ?platform=gfg, return just that slice
    if (platform && data.platforms && data.platforms[platform.toLowerCase()]) {
      return res.json({
        ...data.platforms[platform.toLowerCase()],
        username,
        profileUrl: data.profileUrl,
        _source:    data._source,
        lastUpdated: data.lastUpdated,
      });
    }

    res.json(data);
  } catch (err) {
    const stale = cache.get(`codolio:${username}`);
    if (stale) return res.json({ ...stale, _stale: true });
    res.status(502).json(errShape("Codolio", username, err));
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATE ENDPOINT
// GET /api/aggregate?leetcode=HarishVardhan27&codeforces=HarishVardhan27
//                   &gfg=harishvawvad&hackerrank=harishvardhanwd
//                   &codestudio=harishVardhan
//
// Fires all platform requests in parallel and returns a unified summary.
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/aggregate", async (req, res) => {
  const { leetcode, codeforces, gfg, hackerrank, codestudio, codolio } = req.query;

  // Build list of [platform, username] pairs for requested platforms only
  const requested = [
    leetcode   && ["leetcode",   leetcode,   `http://localhost:${PORT}/api/leetcode/${leetcode}`],
    codeforces && ["codeforces", codeforces, `http://localhost:${PORT}/api/codeforces/${codeforces}`],
    gfg        && ["gfg",        gfg,        `http://localhost:${PORT}/api/gfg/${gfg}`],
    hackerrank && ["hackerrank", hackerrank, `http://localhost:${PORT}/api/hackerrank/${hackerrank}`],
    codestudio && ["codestudio", codestudio, `http://localhost:${PORT}/api/codestudio/${codestudio}`],
    codolio    && ["codolio",    codolio,    `http://localhost:${PORT}/api/codolio/${codolio}`],
  ].filter(Boolean);

  if (requested.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Provide at least one platform username query param.",
      example: "/api/aggregate?leetcode=HarishVardhan27&codeforces=HarishVardhan27",
    });
  }

  // Fire all requests in parallel — never let one failure block the others
  const settled = await Promise.allSettled(
    requested.map(([, , url]) => axios.get(url).then(r => r.data))
  );

  const profiles = settled.map((result, i) => {
    const [platformKey, username] = requested[i];
    if (result.status === "fulfilled") return result.value;
    return errShape(platformKey, username, result.reason);
  });

  const validProfiles  = profiles.filter(p => !p.error);
  const totalSolved    = validProfiles.reduce((s, p) => s + (p.solved?.total || 0), 0);
  const topPlatform    = validProfiles.reduce(
    (best, p) => (p.solved?.total || 0) > (best?.solved?.total || 0) ? p : best, null
  );

  // Per-platform contribution percentage
  const contributions = validProfiles.map(p => ({
    platform:    p.platform,
    username:    p.username,
    solved:      p.solved?.total || 0,
    percentage:  totalSolved > 0
                   ? ((p.solved.total / totalSolved) * 100).toFixed(1)
                   : "0.0",
  }));

  res.json({
    profiles,
    summary: {
      totalSolved,
      platformsRequested:  requested.length,
      platformsSucceeded:  validProfiles.length,
      platformsFailed:     profiles.filter(p => p.error).length,
      topPlatform:         topPlatform?.platform || null,
      topPlatformUsername: topPlatform?.username || null,
      contributions,
      lastUpdated:         new Date().toISOString(),
    },
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK
// GET /api/health  — returns cache stats and server uptime
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  const stats = cache.getStats();
  res.json({
    status:      "ok",
    uptimeSeconds: process.uptime().toFixed(0),
    cache: {
      keys:     stats.keys,
      hits:     stats.hits,
      misses:   stats.misses,
      hitRate:  stats.hits + stats.misses > 0
                  ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) + "%"
                  : "N/A",
    },
    endpoints: [
      "GET /api/leetcode/:username",
      "GET /api/codeforces/:handle",
      "GET /api/gfg/:username",
      "GET /api/hackerrank/:username",
      "GET /api/codestudio/:username",
      "GET /api/codolio/:username            ← GFG + HackerRank + CodeStudio via Codolio",
      "GET /api/codolio/:username?platform=gfg|hackerrank|codestudio",
      "GET /api/aggregate?leetcode=&codeforces=&gfg=&hackerrank=&codestudio=&codolio=",
      "GET /api/health",
    ],
    env: {
      USE_PUPPETEER: process.env.USE_PUPPETEER || "false",
      PORT,
    },
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  const puppet = process.env.USE_PUPPETEER === "true" ? "✅ ON" : "❌ OFF (set USE_PUPPETEER=true)";
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   Coding Profiles Aggregator API  —  Running on :${PORT}       ║
╠════════════════════════════════════════════════════════════╣
║  LeetCode   : GET /api/leetcode/HarishVardhan27            ║
║  Codeforces : GET /api/codeforces/HarishVardhan27          ║
║  GFG        : GET /api/gfg/harishvawvad                    ║
║  HackerRank : GET /api/hackerrank/harishvardhanwd           ║
║  CodeStudio : GET /api/codestudio/harishVardhan             ║
║  ──────────────────────────────────────────────────────    ║
║  Codolio    : GET /api/codolio/Yugen27                     ║
║               ?platform=gfg|hackerrank|codestudio          ║
║               (fetches GFG + HR + CodeStudio in one call)  ║
║  ──────────────────────────────────────────────────────    ║
║  Aggregate  : GET /api/aggregate?leetcode=...&codolio=...  ║
║  Health     : GET /api/health                              ║
╠════════════════════════════════════════════════════════════╣
║  Puppeteer (CodeStudio + Codolio): ${puppet.padEnd(25)}║
╚════════════════════════════════════════════════════════════╝
  `);
});
