import React, { useState, useEffect } from 'react';
import CreateClanForm from './CreateClanForm';
import ClanInvite from './ClanInvite';
import ClanList from './ClanList';
import ClanDetails from './ClanDetails';
import { fetchPlayerClan, fetchAllClans, createClan, sendClanInvite } from './clanAPI';
import clanBackgroundImage from '../../assets/clan/clan_bg.png';
import './ClanScreen.css';

const ClanScreen = ({ player, onSendInvite }) => {
  const [playerClan, setPlayerClan] = useState(null);
  const [allClans, setAllClans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clan = await fetchPlayerClan(player.username);
        setPlayerClan(clan);
        const clans = await fetchAllClans();
        setAllClans(clans);
      } catch (error) {
        console.error('Error fetching clan data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [player.username]);

  const handleCreateClan = async (clanName) => {
    try {
      const newClan = await createClan(player.username, clanName);
      setPlayerClan(newClan);
      // Refresh the list of all clans
      const clans = await fetchAllClans();
      setAllClans(clans);
    } catch (error) {
      console.error('Error creating clan:', error);
      alert('Failed to create clan. Please try again.');
    }
  };

  const handleSendInvite = async (inviteeUsername) => {
    try {
      await sendClanInvite(player.username, inviteeUsername);
      alert('Clan invite sent successfully!');
    } catch (error) {
      console.error('Error sending clan invite:', error);
      alert('Failed to send clan invite. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading clan information...</div>;
  }

  return (
    <div className="clan-screen">
      <div className="clan-content">
        <h2 className="clan-title">Clan Hall</h2>
        {!playerClan && player.level >= 50 && player.gold >= 500 && (
          <div className="create-clan-section">
            <h3>Create Your Own Clan</h3>
            <CreateClanForm player={player} onClanCreated={handleCreateClan} />
          </div>
        )}
        {!playerClan && (player.level < 50 || player.gold < 500) && (
          <div className="clan-requirements">
            <h3>Clan Creation Requirements</h3>
            <p>
              You need to be at least level 50 and have 500 gold to create a clan.
              {player.level < 50 && <span className="requirement">Your current level: {player.level}</span>}
              {player.gold < 500 && <span className="requirement">Your current gold: {player.gold}</span>}
            </p>
          </div>
        )}
        {playerClan && (
          <div className="player-clan-section">
            <ClanDetails clan={playerClan} />
            <ClanInvite onSendInvite={handleSendInvite} />
          </div>
        )}
        <ClanList clans={allClans} />
      </div>
    </div>
  );
};

export default ClanScreen;