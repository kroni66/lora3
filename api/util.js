const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}

async function connectToDatabase() {
    try {
        await pool.connect();
        console.log('Connected to database');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

connectToDatabase();

async function getMob() {
    try {
        console.log("Attempting to fetch a random mob from the database.");
        const { rows } = await query("SELECT * FROM mobs ORDER BY RANDOM() LIMIT 1");
        if (rows.length === 0) {
            console.log("No mobs found in the database.");
            return null;
        }
        console.log("Successfully fetched a mob:", JSON.stringify(rows[0]));
        return rows[0];
    } catch (err) {
        console.error("Database error in getMob:", err);
        throw err;
    }
}

function calculateDamage(attacker, defender) {
    const baseDamage = attacker.strength - defender.defense;
    const criticalChance = attacker.dexterity / 100;
    const isCritical = Math.random() < criticalChance;
    
    let damage = Math.max(1, baseDamage);
    if (isCritical) {
        damage *= 2;
    }
    
    return {
        damage: Math.round(damage),
        isCritical: isCritical
    };
}

async function performFightTurn(playerId, mobId, isPlayerTurn) {
    const { rows: playerRows } = await query("SELECT * FROM users WHERE id = $1", [playerId]);
    const player = playerRows[0];
    
    const { rows: mobRows } = await query("SELECT * FROM mobs WHERE id = $1", [mobId]);
    const mob = mobRows[0];
    
    let result, message;
    if (isPlayerTurn) {
        result = calculateDamage(player, mob);
        message = result.isCritical 
            ? `Player lands a critical hit for ${result.damage} damage!`
            : `Player attacks for ${result.damage} damage.`;
    } else {
        result = calculateDamage(mob, player);
        message = result.isCritical 
            ? `Mob lands a critical hit for ${result.damage} damage!`
            : `Mob attacks for ${result.damage} damage.`;
    }
    
    return {
        damage: result.damage,
        message: message
    };
}

async function startFight(playerId, mobId) {
    try {
        console.log(`Starting fight for player: ${playerId}, mob: ${mobId}`);
        
        // Try to fetch player data by ID first
        let { rows: playerRows } = await query("SELECT * FROM users WHERE id = $1", [playerId]);
        
        // If no player found by ID, try to fetch by username
        if (playerRows.length === 0) {
            console.log(`No player found with ID: ${playerId}. Trying to fetch by username.`);
            ({ rows: playerRows } = await query("SELECT * FROM users WHERE username = $1", [playerId]));
        }
        
        const player = playerRows[0];

        if (!player) {
            console.error(`Player not found for id/username: ${playerId}`);
            return { error: 'Player not found', playerId };
        }
        
        console.log(`Player found:`, player);

        // Fetch mob data
        const { rows: mobRows } = await query("SELECT * FROM mobs WHERE id = $1", [mobId]);
        const mob = mobRows[0];

        if (!mob) {
            console.error(`Mob not found for id: ${mobId}`);
            return { error: 'Mob not found', mobId };
        }

        // Ensure mob has max_health property
        if (mob.max_health === undefined) {
            console.error(`Mob max_health not defined for id: ${mobId}`);
            return { error: 'Mob max_health not defined', mobId };
        }

        // Create a new fight entry
        const { rows } = await query(
            "INSERT INTO fights (player_id, mob_id, player_health, mob_health) VALUES ($1, $2, $3, $4) RETURNING id",
            [playerId, mobId, player.health, mob.max_health]
        );

        return { fightId: rows[0].id };
    } catch (error) {
        console.error("Error in startFight:", error);
        return { error: 'Database error', details: error.message };
    }
}

async function getFightStatus(fightId) {
    const { rows } = await query("SELECT * FROM fights WHERE id = $1", [fightId]);
    return rows[0];
}

async function updateFightStatus(fightId, playerHealth, mobHealth, isPlayerTurn) {
    try {
        await query(
            "UPDATE fights SET player_health = $1, mob_health = $2, is_player_turn = $3 WHERE id = $4",
            [playerHealth, mobHealth, isPlayerTurn, fightId]
        );
    } catch (error) {
        console.error("Error updating fight status:", error);
        throw error;
    }
}

async function endFight(fightId) {
    await query("DELETE FROM fights WHERE id = $1", [fightId]);
}

module.exports = {
    getMob,
    calculateDamage,
    performFightTurn,
    startFight,
    getFightStatus,
    updateFightStatus,
    endFight
};