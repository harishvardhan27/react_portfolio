import React from 'react';
import "./LeetCodeCard.css";

const LeetCodeCard = ({ data }) => {
  const cardData = {
    username: "HarishVardhan27",
    profileUrl: data?.link || "https://leetcode.com/u/HarishVardhan27/",
    totalSolved: data?.problems || 580,
    easy: data?.details?.easy || 235,
    medium: data?.details?.medium || 301,
    hard: data?.details?.hard || 44,
    contestRating: data?.rating || 1818,
    activeDays: data?.details?.activeDays || 286,
    contests: data?.details?.contests || 56,


    globalRank: data?.details?.globalRank || 126943,
    topLanguage: data?.details?.topLanguage || 'Java',
    badges: data?.details?.badges || 7,
  };

  return (
    <div className="card">
      <div className="header">
        <h2>{cardData.username}</h2>
        <a href={cardData.profileUrl} target="_blank" rel="noreferrer">
          View Profile
        </a>
      </div>

      <div className="total">
        <h1>{cardData.totalSolved}</h1>
        <p>Total Problems Solved</p>
      </div>

      <div className="difficulty">
        <div className="box easy">
          <h3>{cardData.easy}</h3>
          <p>EASY</p>
        </div>
        <div className="box medium">
          <h3>{cardData.medium}</h3>
          <p>MEDIUM</p>
        </div>
        <div className="box hard">
          <h3>{cardData.hard}</h3>
          <p>HARD</p>
        </div>
      </div>

      <div className="rating">
        <h2>{cardData.contestRating}</h2>
        <p>Contest Rating</p>
      </div>

      <div className="stats">
        <div>
          <h3>{cardData.contests}</h3>
          <p>Contests</p>
        </div>
        <div>
          <h3>{cardData.activeDays}</h3>
          <p>Active Days</p>
        </div>
      </div>

      <div className="extra-stats">
        <div className="stat-row">
          <span>Global Rank: #{cardData.globalRank?.toLocaleString()}</span>
          <span>Badges: {cardData.badges}</span>
        </div>
        <div className="stat-row">
          <span>Top Language: {cardData.topLanguage}</span>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeCard;