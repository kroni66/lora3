import React from 'react';

const LeaderBoardTable = ({ data }) => {
  return (
    <table className="leaderboard-table">
      <thead className="leaderboard-table-header">
        <tr>
          <th className="leaderboard-table-cell">Rank</th>
          <th className="leaderboard-table-cell">Player</th>
          <th className="leaderboard-table-cell">Level</th>
          <th className="leaderboard-table-cell">Experience</th>
        </tr>
      </thead>
      <tbody>
        {data.map((player, index) => (
          <tr key={player.id} className="leaderboard-table-row">
            <td className="leaderboard-table-cell">{index + 1}</td>
            <td className="leaderboard-table-cell">{player.username}</td>
            <td className="leaderboard-table-cell">{player.level}</td>
            <td className="leaderboard-table-cell">{player.experience}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderBoardTable;