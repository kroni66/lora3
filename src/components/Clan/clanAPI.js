const API_URL = 'http://localhost/api/index.php';

export const fetchPlayerClan = async (username) => {
  try {
    const response = await fetch(`${API_URL}/clan?username=${username}`);
    const data = await response.json();
    if (data.success) {
      return data.clan;
    } else if (data.message === 'Player is not in a clan') {
      return null; // Return null instead of throwing an error
    } else {
      throw new Error(data.message || 'Failed to fetch player clan');
    }
  } catch (error) {
    console.error('Error fetching player clan:', error);
    throw error;
  }
};

export const fetchAllClans = async () => {
  try {
    const response = await fetch(`${API_URL}/clans`);
    const data = await response.json();
    if (data.success) {
      return data.clans;
    } else {
      throw new Error(data.message || 'Failed to fetch all clans');
    }
  } catch (error) {
    console.error('Error fetching all clans:', error);
    throw error;
  }
};

export const createClan = async (username, clanName) => {
  try {
    const response = await fetch(`${API_URL}/clan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, clanName }),
    });
    const data = await response.json();
    if (data.success) {
      return data.clan;
    } else {
      throw new Error(data.message || 'Failed to create clan');
    }
  } catch (error) {
    console.error('Error creating clan:', error);
    throw error;
  }
};

export const sendClanInvite = async (senderUsername, inviteeUsername) => {
  try {
    const response = await fetch(`${API_URL}/clan/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderUsername, inviteeUsername }),
    });
    const data = await response.json();
    if (data.success) {
      return true;
    } else {
      throw new Error(data.message || 'Failed to send clan invite');
    }
  } catch (error) {
    console.error('Error sending clan invite:', error);
    throw error;
  }
};