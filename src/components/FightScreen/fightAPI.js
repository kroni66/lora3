const API_URL = 'http://localhost/api/index.php';

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    throw new Error("Oops! We haven't received a valid JSON response from the server.");
  }
}

export const startFight = async (playerId, mobId) => {
  try {
    const response = await fetch(`${API_URL}/fight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, mobId }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error starting fight:', error);
    throw error;
  }
};

export const getFightStatus = async (fightId) => {
  try {
    const response = await fetch(`${API_URL}/fight?fightId=${fightId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting fight status:', error);
    throw error;
  }
};

export const updateFightStatus = async (fightId, playerHealth, mobHealth, isPlayerTurn) => {
  try {
    const response = await fetch(`${API_URL}/fight`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fightId, playerHealth, mobHealth, isPlayerTurn }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating fight status:', error);
    throw error;
  }
};

export const endFight = async (fightId) => {
  try {
    const response = await fetch(`${API_URL}/fight?fightId=${fightId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error ending fight:', error);
    throw error;
  }
};

export const fetchMob = async () => {
  try {
    console.log('Attempting to fetch mob...');
    const response = await fetch(`${API_URL}/mob`);
    console.log('Full response:', response);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!responseText) {
      console.error('Empty response from server');
      throw new Error('Empty response from server');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.error('Raw response:', responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    console.log('Parsed data:', data);
    if (data.success && data.mob) {
      return data.mob;
    } else {
      throw new Error(data.message || 'Failed to fetch mob');
    }
  } catch (error) {
    console.error('Error fetching mob:', error);
    throw error;
  }
};

export const performTurn = async (fightId, isPlayerTurn, player, mob) => {
  const fightStatus = await getFightStatus(fightId);
  const result = calculateDamage(isPlayerTurn, player, mob);
  
  let newPlayerHealth = fightStatus.player_health;
  let newMobHealth = fightStatus.mob_health;

  if (isPlayerTurn) {
    newMobHealth -= result.damage;
  } else {
    newPlayerHealth -= result.damage;
  }
  
  await updateFightStatus(fightId, newPlayerHealth, newMobHealth, !isPlayerTurn);
  
  return {
    damage: result.damage,
    message: result.message,
    playerHealth: newPlayerHealth,
    mobHealth: newMobHealth,
  };
};

function calculateDamage(isPlayerTurn, player, mob) {
  const attacker = isPlayerTurn ? player : mob;
  const defender = isPlayerTurn ? mob : player;
  
  const baseDamage = Math.max(1, attacker.strength - defender.defense);
  const isCritical = Math.random() < attacker.dexterity / 100;
  const damage = isCritical ? baseDamage * 2 : baseDamage;
  
  const message = isCritical
    ? `${isPlayerTurn ? 'Player' : 'Mob'} lands a critical hit for ${damage} damage!`
    : `${isPlayerTurn ? 'Player' : 'Mob'} attacks for ${damage} damage.`;
  
  return { damage, message };
}