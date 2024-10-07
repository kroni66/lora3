import React, { useState, useEffect } from 'react';
import LeaderBoardTable from './LeaderBoardTable';
import LeaderBoardFilters from './LeaderBoardFilters';
import { fetchLeaderBoard } from './LeaderBoardAPI';
import '../../styles/LeaderBoard.css';

const LeaderBoardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filters, setFilters] = useState({ timeFrame: 'all', category: 'experience' });

  useEffect(() => {
    const loadLeaderBoard = async () => {
      const data = await fetchLeaderBoard(filters);
      setLeaderboardData(data);
    };
    loadLeaderBoard();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-container">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <LeaderBoardFilters onFilterChange={handleFilterChange} currentFilters={filters} />
        <LeaderBoardTable data={leaderboardData} />
      </div>
    </div>
  );
};

export default LeaderBoardScreen;