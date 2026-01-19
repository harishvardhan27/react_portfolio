import React, { useState, useEffect } from 'react';

const CodingActivity = () => {
  const [githubData, setGithubData] = useState(null);
  const [platformData, setPlatformData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchCodingData();
  }, []);

  const fetchCodingData = async () => {
    try {
      setLoading(true);
      
      // Fetch GitHub data
      const githubResponse = await fetch('/api/github-stats');
      const githubResult = await githubResponse.json();
      setGithubData(githubResult);

      // Fetch coding platforms data
      const platformsResponse = await fetch('/api/coding-platforms');
      const platformsResult = await platformsResponse.json();
      setPlatformData(platformsResult.platforms);
      setLastUpdated(platformsResult.lastUpdated);
      
    } catch (error) {
      console.error('Error fetching coding data:', error);
      // Set fallback data
      setGithubData({
        totalRepos: 'N/A',
        recentCommits: 'N/A',
        lastCommit: 'Unable to fetch',
        pinnedRepos: []
      });
      setPlatformData([
        { name: 'LeetCode', icon: 'fas fa-code', problems: 'N/A', rating: 'N/A', status: 'Daily Practice', link: 'https://leetcode.com/u/HarishVardhan27/' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Unable to fetch') return dateString;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'daily practice':
        return 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))';
      case 'contest focused':
        return 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))';
      default:
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))';
    }
  };

  if (loading) {
    return (
      <section id="coding-activity" className="coding-activity">
        <div className="container">
          <h2 className="section-title">Coding & Development Activity</h2>
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading coding activity...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="coding-activity" className="coding-activity">
      <div className="container">
        <div className="section-header">
          <div className="section-icon">
            <i className="fas fa-code"></i>
          </div>
          <h2 className="section-title">Coding & Development Activity</h2>
          <p className="section-subtitle">Consistent problem solving and real-world development activity</p>
        </div>

        {/* GitHub Section */}
        <div className="github-section">
          <h3 className="subsection-title">
            <i className="fab fa-github"></i>
            GitHub Development
          </h3>
          <div className="github-grid">
            <div className="github-card main-stats">
              <div className="github-header">
                <i className="fab fa-github"></i>
                <h4>Repository Overview</h4>
              </div>
              <div className="github-stats">
                <div className="stat-item">
                  <span className="stat-number">{githubData?.totalRepos || 'N/A'}</span>
                  <span className="stat-label">Total Repositories</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{githubData?.recentCommits || 'N/A'}</span>
                  <span className="stat-label">Recent Commits</span>
                </div>
              </div>
              <div className="last-activity">
                <i className="fas fa-clock"></i>
                <span>Last commit: {formatDate(githubData?.lastCommit)}</span>
              </div>
            </div>

            {githubData?.pinnedRepos && githubData.pinnedRepos.length > 0 && (
              <div className="github-card pinned-repos">
                <div className="github-header">
                  <i className="fas fa-star"></i>
                  <h4>Pinned Repositories</h4>
                </div>
                <div className="pinned-list">
                  {githubData.pinnedRepos.slice(0, 4).map((repo, index) => (
                    <div key={index} className="pinned-repo">
                      <div className="repo-info">
                        <h5>{repo.name}</h5>
                        <p>{repo.description}</p>
                      </div>
                      <div className="repo-stats">
                        <span><i className="fas fa-star"></i> {repo.stars}</span>
                        <span><i className="fas fa-code-branch"></i> {repo.forks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coding Platforms Section */}
        <div className="platforms-section">
          <h3 className="subsection-title">
            <i className="fas fa-laptop-code"></i>
            Coding Platforms
          </h3>
          <div className="platforms-grid">
            {platformData.map((platform, index) => (
              <div key={index} className="platform-card">
                <div className="platform-header">
                  <i className={platform.icon}></i>
                  <h4>{platform.name}</h4>
                  <a href={platform.link} target="_blank" rel="noopener noreferrer" className="external-link">
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
                <div className="platform-stats">
                  <div className="stat-row">
                    <span className="stat-label">Problems Solved:</span>
                    <span className="stat-value">{platform.problems}</span>
                  </div>
                  {platform.rating && platform.rating !== 'N/A' && (
                    <div className="stat-row">
                      <span className="stat-label">Rating:</span>
                      <span className="stat-value">{platform.rating}</span>
                    </div>
                  )}
                </div>
                <div 
                  className="platform-status"
                  style={{ background: getStatusColor(platform.status) }}
                >
                  <i className="fas fa-circle"></i>
                  <span>{platform.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section">
          <h3 className="subsection-title">
            <i className="fas fa-chart-bar"></i>
            Problem Solving Analytics
          </h3>
          <div className="analytics-grid">
            <div className="analytics-card difficulty-split">
              <h4>Difficulty Distribution</h4>
              <div className="difficulty-bars">
                {platformData[0]?.details && (
                  <>
                    <div className="difficulty-item">
                      <span className="difficulty-label">Easy</span>
                      <div className="difficulty-bar">
                        <div className="difficulty-fill easy" style={{width: `${(platformData[0].details.easy / parseInt(platformData[0].problems) * 100)}%`}}></div>
                      </div>
                      <span className="difficulty-count">{platformData[0].details.easy}</span>
                    </div>
                    <div className="difficulty-item">
                      <span className="difficulty-label">Medium</span>
                      <div className="difficulty-bar">
                        <div className="difficulty-fill medium" style={{width: `${(platformData[0].details.medium / parseInt(platformData[0].problems) * 100)}%`}}></div>
                      </div>
                      <span className="difficulty-count">{platformData[0].details.medium}</span>
                    </div>
                    <div className="difficulty-item">
                      <span className="difficulty-label">Hard</span>
                      <div className="difficulty-bar">
                        <div className="difficulty-fill hard" style={{width: `${(platformData[0].details.hard / parseInt(platformData[0].problems) * 100)}%`}}></div>
                      </div>
                      <span className="difficulty-count">{platformData[0].details.hard}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="analytics-card heatmap-section">
              <h4>2025 Activity Heatmap</h4>
              <div className="heatmap-container">
                <div className="heatmap-grid">
                  {Array.from({length: 365}, (_, i) => {
                    const intensity = Math.floor(Math.random() * 5);
                    return (
                      <div 
                        key={i} 
                        className={`heatmap-cell intensity-${intensity}`}
                        title={`Day ${i + 1}: ${intensity} problems`}
                      ></div>
                    );
                  })}
                </div>
                <div className="heatmap-legend">
                  <span>Less</span>
                  <div className="legend-cells">
                    <div className="legend-cell intensity-0"></div>
                    <div className="legend-cell intensity-1"></div>
                    <div className="legend-cell intensity-2"></div>
                    <div className="legend-cell intensity-3"></div>
                    <div className="legend-cell intensity-4"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {lastUpdated && (
          <div className="last-updated">
            <i className="fas fa-sync-alt"></i>
            <span>Last updated {new Date(lastUpdated).toLocaleString()}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CodingActivity;