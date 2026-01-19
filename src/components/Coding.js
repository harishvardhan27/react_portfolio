import React, { useState, useEffect } from 'react';
import LeetCodeCard from './LeetCodeCard';

const Coding = () => {
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeetCodeData();
  }, []);

  const fetchLeetCodeData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/coding-platforms');
      const data = await response.json();
      
      if (data.platforms && data.platforms.length > 0) {
        const newData = data.platforms[0];
        setLeetcodeData(newData);
        // Store in localStorage for offline use
        localStorage.setItem('leetcodeData', JSON.stringify(newData));
      }
    } catch (err) {
      setError('Failed to fetch coding data');
      // Try to get last fetched data from localStorage
      const cachedData = localStorage.getItem('leetcodeData');
      if (cachedData) {
        setLeetcodeData(JSON.parse(cachedData));
      } else {
        // Set fallback data only if no cached data exists
        setLeetcodeData({
          name: 'LeetCode',
          icon: 'fas fa-code',
          problems: '150',
          rating: '1450',
          status: 'Daily Practice',
          link: 'https://leetcode.com/u/HarishVardhan27/',
          details: {
            easy: 80,
            medium: 60,
            hard: 10
          },
          contestsAttended: 5
        });
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <section id="coding" className="coding-activity">
        <div className="container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading coding statistics...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="coding" className="coding-activity">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="coding" className="coding-activity">
      <div className="container">
        <div className="section-header">
          <div className="section-icon">
            <i className="fas fa-code"></i>
          </div>
          <h2 className="section-title">Coding Profile</h2>
          <p className="section-subtitle">LeetCode journey and problem-solving statistics</p>
        </div>

        <div className="leetcode-profile">
          <LeetCodeCard data={leetcodeData} />
        </div>
      </div>
    </section>
  );
};

export default Coding;