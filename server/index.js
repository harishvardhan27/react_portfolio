const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const axios = require('axios');

const app = express();
const cache = new NodeCache({ stdTTL: 21600 }); // 6 hours cache

app.use(cors());
app.use(express.json());

// LeetCode API endpoint
app.get('/api/leetcode-stats', async (req, res) => {
  try {
    const cacheKey = 'leetcode-stats';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const username = 'HarishVardhan27';
    
    // Fetch LeetCode data using GraphQL API
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            userAvatar
            realName
            aboutMe
            school
            websites
            countryName
            company
            jobTitle
            skillTags
            postViewCount
            postViewCountDiff
            reputation
            reputationDiff
            solutionCount
            solutionCountDiff
            categoryDiscussCount
            categoryDiscussCountDiff
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    });

    const data = response.data.data;
    const user = data.matchedUser;
    const contest = data.userContestRanking;
    
    let totalSolved = 0;
    let easyCount = 0, mediumCount = 0, hardCount = 0;
    
    if (user && user.submitStats) {
      user.submitStats.acSubmissionNum.forEach(item => {
        if (item.difficulty === 'All') {
          totalSolved = item.count;
        } else if (item.difficulty === 'Easy') {
          easyCount = item.count;
        } else if (item.difficulty === 'Medium') {
          mediumCount = item.count;
        } else if (item.difficulty === 'Hard') {
          hardCount = item.count;
        }
      });
    }

    const leetcodeData = {
      username: user?.username || username,
      totalSolved,
      easyCount,
      mediumCount,
      hardCount,
      rating: contest?.rating ? Math.round(contest.rating) : null,
      ranking: contest?.globalRanking || null,
      contestsAttended: contest?.attendedContestsCount || 0
    };

    cache.set(cacheKey, leetcodeData);
    res.json(leetcodeData);
    
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    // Fallback data
    const fallbackData = {
      username: 'HarishVardhan27',
      totalSolved: 150,
      easyCount: 80,
      mediumCount: 60,
      hardCount: 10,
      rating: 1450,
      ranking: null,
      contestsAttended: 5
    };
    res.json(fallbackData);
  }
});

// GitHub API endpoint
app.get('/api/github-stats', async (req, res) => {
  try {
    const cacheKey = 'github-stats';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // Replace 'your-github-username' with actual username
    const username = 'your-github-username';
    
    // Fetch GitHub data (you'll need to implement actual GitHub API calls)
    const githubData = {
      totalRepos: 15,
      recentCommits: 42,
      lastCommit: new Date().toISOString(),
      pinnedRepos: [
        {
          name: 'FundFlow-Blockchain',
          description: 'Blockchain-based fund allocation system',
          stars: 8,
          forks: 3
        },
        {
          name: 'Cognitive-Study-Monitor',
          description: 'AI-powered study focus monitoring app',
          stars: 12,
          forks: 5
        },
        {
          name: 'Content-Detection-System',
          description: 'Real-time explicit content detection',
          stars: 6,
          forks: 2
        },
        {
          name: 'IntelliSafe-Stalker-Detection',
          description: 'AI surveillance system for stalker detection',
          stars: 10,
          forks: 4
        }
      ]
    };

    cache.set(cacheKey, githubData);
    res.json(githubData);
    
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub stats' });
  }
});

// Coding platforms API endpoint
app.get('/api/coding-platforms', async (req, res) => {
  try {
    const cacheKey = 'coding-platforms';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const username = 'HarishVardhan27';
    
    // Fetch multiple endpoints for accurate data
    const [profileResponse, contestResponse, userResponse] = await Promise.all([
      axios.get(`https://alfa-leetcode-api.onrender.com/${username}/profile`),
      axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`),
      axios.get(`https://alfa-leetcode-api.onrender.com/${username}`)
    ]);

    const profileData = profileResponse.data;
    const contestData = contestResponse.data;
    const userData = userResponse.data;

    const platformsData = {
      platforms: [
        {
          name: 'LeetCode',
          icon: 'fas fa-code',
          problems: profileData.totalSolved.toString(),
          rating: contestData.contestRating ? Math.round(contestData.contestRating) : 'Unrated',
          status: 'Daily Practice',
          link: profileData.profileUrl,
          details: {
            easy: profileData.easy,
            medium: profileData.medium,
            hard: profileData.hard,
            contests: contestData.contestAttend,
            activeDays: profileData.activeDays,
            currentStreak: profileData.currentStreak,
            maxStreak: profileData.maxStreak,
            globalRank: userData.ranking,
            topLanguage: profileData.topLanguage,
            badges: profileData.badges
          }
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, platformsData);
    res.json(platformsData);
    
  } catch (error) {
    console.error('Error fetching coding platforms data:', error);
    // Fallback data
    const fallbackData = {
      platforms: [
        {
          name: 'LeetCode',
          icon: 'fas fa-code',
          problems: '580',
          rating: '1818',
          status: 'Daily Practice',
          link: 'https://leetcode.com/u/HarishVardhan27/',
          details: {
            easy: 235,
            medium: 301,
            hard: 44,
            contests: 10,
            activeDays: 286,
            currentStreak: 42,
            maxStreak: 103,
            globalRank: 126943,
            topLanguage: 'Java',
            badges: 7
          }
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    res.json(fallbackData);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;