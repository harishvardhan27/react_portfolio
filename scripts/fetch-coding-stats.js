/* eslint-disable no-console */
/**
 * Build-time snapshot of public coding-profile stats → public/coding-stats.json
 *
 * Why: LeetCode's GraphQL API blocks browser (CORS) requests, so the site can't
 * fetch it live without a server. Instead this runs on every `npm run build`
 * (Netlify/Vercel) and `npm start`, and the site reads the static JSON instantly.
 * Codeforces allows CORS, so the site also refreshes it live in the browser.
 *
 * Never fails the build: on any error the previous snapshot is kept.
 * Usage: node scripts/fetch-coding-stats.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'coding-stats.json');
const LEETCODE_USER = 'HarishVardhan27';
const CODEFORCES_HANDLE = 'HarishVardhan27';
const TIMEOUT_MS = 15000;

const withTimeout = (p, ms = TIMEOUT_MS) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`timed out after ${ms}ms`)), ms))]);

const LEETCODE_QUERY = `
  query getCombinedProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking reputation countryName }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      problemsSolvedBeatsStats { difficulty percentage }
      badges { name }
      activeBadge { name }
    }
    userContestRanking(username: $username) {
      attendedContestsCount rating globalRanking totalParticipants topPercentage badge { name }
    }
  }
`;

async function fetchLeetCode(username) {
  const res = await withTimeout(fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
      Origin: 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (portfolio stats snapshot)',
    },
    body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username } }),
  }));
  if (!res.ok) throw new Error(`LeetCode HTTP ${res.status}`);
  const json = await res.json();
  const user = json?.data?.matchedUser;
  const contest = json?.data?.userContestRanking;
  if (!user) throw new Error(`LeetCode user "${username}" not found`);

  const solved = {};
  (user.submitStatsGlobal?.acSubmissionNum || []).forEach(({ difficulty, count }) => { solved[difficulty.toLowerCase()] = count; });
  const beats = {};
  (user.problemsSolvedBeatsStats || []).forEach(({ difficulty, percentage }) => {
    if (percentage !== null) beats[difficulty.toLowerCase()] = percentage.toFixed(1);
  });

  return {
    platform: 'LeetCode',
    username: user.username,
    profileUrl: `https://leetcode.com/u/${user.username}/`,
    solved: { total: solved.all || 0, easy: solved.easy || 0, medium: solved.medium || 0, hard: solved.hard || 0 },
    beats: { easy: beats.easy || null, medium: beats.medium || null, hard: beats.hard || null },
    globalRanking: user.profile?.ranking || null,
    reputation: user.profile?.reputation || 0,
    country: user.profile?.countryName || null,
    contest: contest ? {
      attended: contest.attendedContestsCount,
      rating: Math.round(contest.rating || 0),
      globalRank: contest.globalRanking,
      topPercentage: contest.topPercentage?.toFixed(2),
      badge: contest.badge?.name || null,
    } : null,
    badges: (user.badges || []).map((b) => b.name),
    activeBadge: user.activeBadge?.name || null,
    lastUpdated: new Date().toISOString(),
  };
}

async function cfGet(method, params) {
  const res = await withTimeout(fetch(`https://codeforces.com/api/${method}?${new URLSearchParams(params)}`), 20000);
  const json = await res.json();
  if (json.status !== 'OK') throw new Error(`Codeforces ${method}: ${json.comment || 'failed'}`);
  return json.result;
}

// Same shaping as src/components/Coding.js → shapeCodeforces (kept in sync)
function shapeCodeforces(user, subs, history) {
  const accepted = new Set();
  const byIndex = { A: 0, B: 0, C: 0, D: 0, 'E+': 0 };
  subs.forEach((s) => {
    if (s.verdict !== 'OK') return;
    const key = `${s.problem.contestId}-${s.problem.index}`;
    if (accepted.has(key)) return;
    accepted.add(key);
    const l = s.problem.index[0].toUpperCase();
    byIndex[['A', 'B', 'C', 'D'].includes(l) ? l : 'E+'] += 1;
  });
  let bestRank = Infinity, worstRank = 0, maxUp = 0, maxDown = 0;
  history.forEach((e) => {
    bestRank = Math.min(bestRank, e.rank);
    worstRank = Math.max(worstRank, e.rank);
    const d = e.newRating - e.oldRating;
    maxUp = Math.max(maxUp, d);
    maxDown = Math.min(maxDown, d);
  });
  return {
    platform: 'Codeforces',
    username: user.handle,
    profileUrl: `https://codeforces.com/profile/${user.handle}`,
    solved: { total: accepted.size, byIndex },
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || 'unranked',
    maxRank: user.maxRank || 'unranked',
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

async function fetchCodeforces(handle) {
  const [[user], subs, history] = await Promise.all([
    cfGet('user.info', { handles: handle }),
    cfGet('user.status', { handle, from: 1, count: 10000 }),
    cfGet('user.rating', { handle }),
  ]);
  return shapeCodeforces(user, subs, history);
}

// ── CodeChef — public profile page (no API); parse the server-rendered HTML ──
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const num = (s) => (s == null ? null : parseInt(String(s).replace(/[^\d]/g, ''), 10));

async function fetchCodeChef(username) {
  const res = await withTimeout(fetch(`https://www.codechef.com/users/${username}`, { headers: { 'User-Agent': UA } }));
  if (!res.ok) throw new Error(`CodeChef HTTP ${res.status}`);
  const html = await res.text();
  // the main ("all") rating block only — the page also has a DSA rating block
  const block = (html.split('id="rating-block-all"')[1] || '').split('id="rating-block-')[0];
  if (!block) throw new Error('CodeChef rating block not found');
  const rating = num((block.match(/class="rating-number">\s*(\d+)/) || [])[1]);
  if (!rating) throw new Error('CodeChef rating not found');
  return {
    platform: 'CodeChef',
    username,
    profileUrl: `https://www.codechef.com/users/${username}`,
    rating,
    highestRating: num((block.match(/Highest Rating (\d+)/) || [])[1]),
    stars: (block.split('class="rating-star"')[1] || '').split('</div>')[0].split('&#9733;').length - 1,
    division: (block.match(/\((Div \d)\)/) || [])[1] || null,
    globalRank: num((block.match(/<strong>\s*(\d+)\s*<\/strong>\s*<\/a>\s*Global Rank/) || [])[1]),
    countryRank: num((block.match(/<strong>\s*(\d+)\s*<\/strong>\s*<\/a>\s*Country Rank/) || [])[1]),
    contests: num((html.match(/No\. of Contests Participated:\s*<b>\s*(\d+)/) || [])[1]),
    solved: { total: num((html.match(/Total Problems Solved:\s*(\d+)/) || [])[1]) || 0 },
    lastUpdated: new Date().toISOString(),
  };
}

// ── GeeksforGeeks — public profile + practice submissions APIs ──────────────
async function fetchGfg(handle) {
  const [profRes, subRes] = await Promise.all([
    withTimeout(fetch(`https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${handle}&article_count=false&redirect=true`, { headers: { 'User-Agent': UA } })),
    withTimeout(fetch('https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/', {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, requestType: '', year: '', month: '' }),
    })),
  ]);
  const prof = (await profRes.json())?.data;
  if (!prof) throw new Error('GFG profile not found');
  const subs = await subRes.json().catch(() => ({}));
  const split = {};
  Object.entries(subs?.result || {}).forEach(([level, problems]) => { split[level.toLowerCase()] = Object.keys(problems || {}).length; });
  return {
    platform: 'GeeksforGeeks',
    username: handle,
    profileUrl: `https://www.geeksforgeeks.org/profile/${handle}`,
    solved: { total: prof.total_problems_solved || 0, ...split },
    codingScore: prof.score || 0,
    instituteRank: prof.institute_rank || null,
    maxStreak: prof.pod_solved_longest_streak || 0,
    lastUpdated: new Date().toISOString(),
  };
}

// ── HackerRank — public REST endpoints ──────────────────────────────────────
async function fetchHackerRank(username) {
  const [profRes, badgeRes] = await Promise.all([
    withTimeout(fetch(`https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`, { headers: { 'User-Agent': UA } })),
    withTimeout(fetch(`https://www.hackerrank.com/rest/hackers/${username}/badges`, { headers: { 'User-Agent': UA } })),
  ]);
  const prof = (await profRes.json())?.model || {};
  const models = (await badgeRes.json())?.models;
  if (!Array.isArray(models)) throw new Error('HackerRank badges unavailable');
  const badges = models
    .filter((b) => (b.stars || 0) > 0)
    .map((b) => ({ name: b.badge_name, stars: b.stars, solved: b.solved || 0 }))
    .sort((a, b) => b.stars - a.stars);
  return {
    platform: 'HackerRank',
    username,
    profileUrl: `https://www.hackerrank.com/profile/${username}`,
    name: prof.name || null,
    level: prof.level || null,
    badges,
    totalBadges: badges.length,
    totalStars: badges.reduce((s, b) => s + b.stars, 0),
    solved: { total: badges.reduce((s, b) => s + b.solved, 0) },
    lastUpdated: new Date().toISOString(),
  };
}

// ── CodeStudio (Code360 by Coding Ninjas) — public profile API ──────────────
async function fetchCodeStudio(username) {
  const res = await withTimeout(fetch(
    `https://www.naukri.com/code360/api/v3/public_section/profile/user_details?uuid=${username}&request_differentiator=1&app_context=publicsection&naukri_request=true`,
    { headers: { 'User-Agent': UA } }
  ));
  const d = (await res.json())?.data;
  if (!d) throw new Error('CodeStudio profile not found');
  const dsa = d.dsa_domain_data?.problem_count_data || {};
  const split = {};
  (dsa.difficulty_data || []).forEach(({ level, count }) => { split[level.toLowerCase()] = count; });
  const badges = [];
  Object.entries(d.dsa_domain_data?.badges_hash || {}).forEach(([tier, groups]) => {
    Object.values(groups || {}).flat().forEach((topic) => badges.push(`${topic} ${tier}`));
  });
  return {
    platform: 'CodeStudio',
    username,
    profileUrl: `https://www.naukri.com/code360/profile/${username}`,
    solved: { total: dsa.total_count || 0, ...split },
    level: d.user_level_name || null,
    exp: d.user_exp || 0,
    badges,
    lastUpdated: new Date().toISOString(),
  };
}

// ── AtCoder — profile page + contest history JSON + AtCoder Problems (community) ──
async function fetchAtCoder(username) {
  const [profRes, histRes, acRes] = await Promise.all([
    withTimeout(fetch(`https://atcoder.jp/users/${username}`, { headers: { 'User-Agent': UA } })),
    withTimeout(fetch(`https://atcoder.jp/users/${username}/history/json`, { headers: { 'User-Agent': UA } })),
    withTimeout(fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${username}`, { headers: { 'User-Agent': UA } })).catch(() => null),
  ]);
  if (!profRes.ok) throw new Error(`AtCoder HTTP ${profRes.status}`);
  const html = await profRes.text();
  const field = (label) => {
    const m = html.match(new RegExp(`<th class="no-break">${label}</th>\\s*<td[^>]*>([\\s\\S]*?)</td>`));
    return m ? m[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : null;
  };
  const history = (await histRes.json().catch(() => [])) || [];
  const rated = history.filter((h) => h.IsRated);
  const ac = acRes && acRes.ok ? await acRes.json().catch(() => null) : null;
  const rankText = field('Rank') || '';
  return {
    platform: 'AtCoder',
    username,
    profileUrl: `https://atcoder.jp/users/${username}`,
    rating: num(field('Rating')) || 0,
    highestRating: num((field('Highest Rating') || '').split(' ')[0]) || 0,
    rank: num(rankText.split(' ')[0]),
    topPercent: (rankText.match(/Top ([\d.]+)%/) || [])[1] || null,
    ratedContests: rated.length,
    bestPerformance: rated.length ? Math.max(...rated.map((h) => h.Performance || 0)) : null,
    lastCompeted: field('Last Competed'),
    solved: { total: ac?.count ?? 0 },
    lastUpdated: new Date().toISOString(),
  };
}

const SOURCES = [
  ['leetcode', 'LeetCode', () => fetchLeetCode(LEETCODE_USER), (v) => `${v.solved.total} solved, rating ${v.contest?.rating}`],
  ['codeforces', 'Codeforces', () => fetchCodeforces(CODEFORCES_HANDLE), (v) => `${v.solved.total} solved, rating ${v.rating}`],
  ['codechef', 'CodeChef', () => fetchCodeChef('harish_vardhan'), (v) => `${v.solved.total} solved, rating ${v.rating}`],
  ['gfg', 'GeeksforGeeks', () => fetchGfg('harishvawvad'), (v) => `${v.solved.total} solved, score ${v.codingScore}`],
  ['hackerrank', 'HackerRank', () => fetchHackerRank('harishvardhanwd'), (v) => `${v.totalBadges} badges, ${v.totalStars} stars`],
  ['codestudio', 'CodeStudio', () => fetchCodeStudio('harishVardhan'), (v) => `${v.solved.total} solved, ${v.level}`],
  ['atcoder', 'AtCoder', () => fetchAtCoder('HarishVardhan27'), (v) => `${v.solved.total} solved, rating ${v.rating}`],
];

// Compare snapshots ignoring timestamps, so unchanged stats don't cause a commit/deploy
const strip = (v) => JSON.stringify(v, (k, val) => (k === 'generatedAt' || k === 'lastUpdated' ? undefined : val));

(async () => {
  let previous = {};
  try { previous = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) { /* first run */ }

  const results = await Promise.allSettled(SOURCES.map(([, , run]) => run()));
  const next = { generatedAt: new Date().toISOString() };
  SOURCES.forEach(([key, label, , summary], i) => {
    const r = results[i];
    next[key] = r.status === 'fulfilled' ? r.value : previous[key] || null;
    console.log(`[coding-stats] ${label.padEnd(13)} ${r.status === 'fulfilled' ? `ok (${summary(r.value)})` : `FAILED (${r.reason.message}) — kept previous`}`);
  });

  if (SOURCES.every(([key]) => !next[key])) {
    console.log('[coding-stats] nothing to write; the site will use its built-in fallback data');
    return;
  }
  if (strip(next) === strip(previous)) {
    console.log('[coding-stats] no stat changed since the last snapshot; file left as is');
    return;
  }
  fs.writeFileSync(OUT, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`[coding-stats] wrote ${path.relative(process.cwd(), OUT)}`);
})().catch((e) => {
  console.log(`[coding-stats] skipped: ${e.message}`);
});
