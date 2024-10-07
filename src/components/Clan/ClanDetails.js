import React from 'react';

const ClanDetails = ({ clan }) => {
  if (!clan) {
    return <div>No clan information available.</div>;
  }

  return (
    <div className="clan-details">
      <h3>{clan.name}</h3>
      <p>Leader: {clan.leader}</p>
      <p>Members: {clan.members ? clan.members.length : 0}</p>
      {clan.members && clan.members.length > 0 ? (
        <ul>
          {clan.members.map((member, index) => (
            <li key={index}>{typeof member === 'object' ? member.username : member}</li>
          ))}
        </ul>
      ) : (
        <p>No members in this clan.</p>
      )}
    </div>
  );
};

export default ClanDetails;