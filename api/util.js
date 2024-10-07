const mysql = require('mysql2/promise');

const dbConfig = {
    host: "localhost",
    database: "mmorpg_game",
    user: "root",
    password: "Mi17sa95++"
};

let db;

async function connectToDatabase() {
    try {
        db = await mysql.createConnection(dbConfig);
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
        const [rows] = await db.execute("SELECT * FROM mobs ORDER BY RAND() LIMIT 1");
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
    const [playerRows] = await db.execute("SELECT * FROM users WHERE id = ?", [playerId]);
    const player = playerRows[0];
    
    const [mobRows] = await db.execute("SELECT * FROM mobs WHERE id = ?", [mobId]);
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
        // Fetch player data
        const [playerRows] = await db.execute("SELECT * FROM users WHERE id = ?", [playerId]);
        const player = playerRows[0];

        if (!player) {
            console.error(`Player not found for id: ${playerId}`);
            return { error: 'Player not found', playerId };
        }

        // Fetch mob data
        const [mobRows] = await db.execute("SELECT * FROM mobs WHERE id = ?", [mobId]);
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
        const [result] = await db.execute(
            "INSERT INTO fights (player_id, mob_id, player_health, mob_health) VALUES (?, ?, ?, ?)",
            [playerId, mobId, player.health, mob.max_health]
        );

        return { fightId: result.insertId };
    } catch (error) {
        console.error("Error in startFight:", error);
        return { error: 'Database error', details: error.message };
    }
}

async function getFightStatus(fightId) {
    const [rows] = await db.execute("SELECT * FROM fights WHERE id = ?", [fightId]);
    return rows[0];
}

async function updateFightStatus(fightId, playerHealth, mobHealth, isPlayerTurn) {
    try {
        await db.execute(
            "UPDATE fights SET player_health = ?, mob_health = ?, is_player_turn = ? WHERE id = ?",
            [playerHealth, mobHealth, isPlayerTurn, fightId]
        );
    } catch (error) {
        console.error("Error updating fight status:", error);
        throw error;
    }
}

async function endFight(fightId) {
    await db.execute("DELETE FROM fights WHERE id = ?", [fightId]);
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