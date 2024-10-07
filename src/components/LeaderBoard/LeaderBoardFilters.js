import React from 'react';

const LeaderBoardFilters = ({ onFilterChange, currentFilters }) => {
  return (
    <div className="filter-container">
      <select
        className="filter-select"
        value={currentFilters.timeFrame}
        onChange={(e) => onFilterChange({ timeFrame: e.target.value })}
      >
        <option value="all">All Time</option>
        <option value="weekly">This Week</option>
        <option value="monthly">This Month</option>
      </select>
      <select
        className="filter-select"
        value={currentFilters.category}
        onChange={(e) => onFilterChange({ category: e.target.value })}
      >
        <option value="experience">Experience</option>
        <option value="level">Level</option>
        <option value="strength">Strength</option>
        <option value="defense">Defense</option>
        <option value="intelligence">Intelligence</option>
        <option value="dexterity">Dexterity</option>
      </select>
    </div>
  );
};

export default LeaderBoardFilters;