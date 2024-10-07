const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Include util.js
const util = require('./util');

// Function to output JSON and exit
function jsonOutput(res, data) {
    res.json(data);
}

// Database connection
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [rows] = await db.execute("SELECT id, password FROM users WHERE username = ?", [username]);
        const user = rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            jsonOutput(res, { success: true, message: 'Login successful' });
        } else {
            jsonOutput(res, { success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        jsonOutput(res, { success: false, message: 'An error occurred' });
    }
});

app.get('/progress', async (req, res) => {
    const { username } = req.query;
    
    if (!username) {
        return jsonOutput(res, { success: false, message: 'Username is required' });
    }
    
    try {
        const [rows] = await db.execute("SELECT experience, level, desire_for_adventure, class, strength, defense, intelligence, dexterity, gold, avatar FROM users WHERE username = ?", [username]);
        const progress = rows[0];
        
        if (progress) {
            jsonOutput(res, {
                success: true,
                experience: parseInt(progress.experience),
                level: parseInt(progress.level),
                desireForAdventure: parseInt(progress.desire_for_adventure),
                class: progress.class,
                strength: parseInt(progress.strength),
                defense: parseInt(progress.defense),
                intelligence: parseInt(progress.intelligence),
                dexterity: parseInt(progress.dexterity),
                gold: parseInt(progress.gold),
                avatar: progress.avatar
            });
        } else {
            jsonOutput(res, { success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        jsonOutput(res, { success: false, message: 'An error occurred' });
    }
});

app.post('/progress', async (req, res) => {
    const { username, experience, level, desireForAdventure, strength, defense, intelligence, dexterity, gold } = req.body;
    
    if (!username) {
        return jsonOutput(res, { success: false, message: 'Username is required' });
    }
    
    try {
        const [result] = await db.execute("UPDATE users SET experience = ?, level = ?, desire_for_adventure = ?, strength = ?, defense = ?, intelligence = ?, dexterity = ?, gold = ? WHERE username = ?",
            [experience, level, desireForAdventure, strength, defense, intelligence, dexterity, gold, username]);
        
        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Progress updated successfully' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to update progress' });
        }
    } catch (err) {
        console.error(err);
        jsonOutput(res, { success: false, message: 'An error occurred' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, class: userClass, avatar } = req.body;
    
    if (!username || !password || !userClass || !avatar) {
        return jsonOutput(res, { success: false, message: 'All fields are required' });
    }

    try {
        // Check if username already exists
        const [existingUsers] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUsers.length > 0) {
            return jsonOutput(res, { success: false, message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Start transaction
        await db.beginTransaction();

        // Insert new user
        const [userResult] = await db.execute("INSERT INTO users (username, password, class, avatar) VALUES (?, ?, ?, ?)", [username, hashedPassword, userClass, avatar]);

        if (userResult.affectedRows > 0) {
            // Initialize resources for the new user
            const [resourceResult] = await db.execute("INSERT INTO resources (username, wood, stone, iron, gold) VALUES (?, 0, 0, 0, 0)", [username]);

            if (resourceResult.affectedRows > 0) {
                await db.commit();
                jsonOutput(res, { success: true, message: 'Registration successful' });
            } else {
                await db.rollback();
                jsonOutput(res, { success: false, message: 'Failed to initialize resources' });
            }
        } else {
            await db.rollback();
            jsonOutput(res, { success: false, message: 'Registration failed' });
        }
    } catch (err) {
        await db.rollback();
        console.error("Registration error:", err);
        jsonOutput(res, { success: false, message: 'An unexpected error occurred: ' + err.message });
    }
});

app.get('/buildings', async (req, res) => {
    const { username } = req.query;
    
    try {
        const [buildings] = await db.execute("SELECT * FROM buildings WHERE username = ?", [username]);
        jsonOutput(res, { success: true, buildings });
    } catch (err) {
        console.error("Error in buildings endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/buildings', async (req, res) => {
    const { username, building } = req.body;
    
    try {
        const [result] = await db.execute("INSERT INTO buildings (username, type, x, y, start_time, level) VALUES (?, ?, ?, ?, ?, 1)",
            [username, building.type, building.x, building.y, building.start_time]);
        
        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Building added successfully', buildingId: result.insertId });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to add building' });
        }
    } catch (err) {
        console.error("Database error:", err);
        jsonOutput(res, { success: false, message: 'Failed to add building: ' + err.message });
    }
});

app.delete('/buildings', async (req, res) => {
    const { username, buildingId } = req.body;
    
    try {
        const [result] = await db.execute("DELETE FROM buildings WHERE id = ? AND username = ?", [buildingId, username]);
        
        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Building removed' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to remove building' });
        }
    } catch (err) {
        console.error("Error in buildings DELETE endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.put('/buildings', async (req, res) => {
    const { username, buildingId } = req.body;
    
    try {
        // Fetch current building level
        const [rows] = await db.execute("SELECT level FROM buildings WHERE id = ? AND username = ?", [buildingId, username]);
        const currentLevel = rows[0]?.level;
        
        if (currentLevel !== undefined) {
            const newLevel = currentLevel + 1;
            
            // Update building level
            const [result] = await db.execute("UPDATE buildings SET level = ? WHERE id = ? AND username = ?", [newLevel, buildingId, username]);
            
            if (result.affectedRows > 0) {
                jsonOutput(res, { success: true, message: 'Building upgraded', newLevel });
            } else {
                jsonOutput(res, { success: false, message: 'Failed to upgrade building' });
            }
        } else {
            jsonOutput(res, { success: false, message: 'Building not found' });
        }
    } catch (err) {
        console.error("Error in buildings PUT endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/resources', async (req, res) => {
    const { username } = req.query;
    
    try {
        const [rows] = await db.execute("SELECT * FROM resources WHERE username = ?", [username]);
        const resources = rows[0];
        if (resources) {
            jsonOutput(res, { success: true, resources });
        } else {
            jsonOutput(res, { success: false, message: 'Resources not found' });
        }
    } catch (err) {
        console.error("Error in resources GET endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/resources', async (req, res) => {
    const { username, resources } = req.body;
    
    try {
        const [result] = await db.execute("UPDATE resources SET wood = ?, stone = ?, iron = ?, gold = ? WHERE username = ?",
            [resources.wood, resources.stone, resources.iron, resources.gold, username]);
        
        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Resources updated' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to update resources' });
        }
    } catch (err) {
        console.error("Database error:", err);
        jsonOutput(res, { success: false, message: 'Failed to update resources: ' + err.message });
    }
});

app.get('/leaderboard', async (req, res) => {
    const { timeFrame = 'all', category = 'experience' } = req.query;
    
    let query = "SELECT username, level, experience, strength, defense, intelligence, dexterity FROM users";
    
    if (timeFrame !== 'all') {
        const timeLimit = timeFrame === 'weekly' ? '1 WEEK' : '1 MONTH';
        query += ` WHERE last_active >= DATE_SUB(NOW(), INTERVAL ${timeLimit})`;
    }
    
    query += ` ORDER BY ${category} DESC LIMIT 100`;
    
    try {
        const [leaderboard] = await db.execute(query);
        jsonOutput(res, { success: true, leaderboard });
    } catch (err) {
        console.error("Error in leaderboard endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/messages', async (req, res) => {
    const { username } = req.query;
    
    if (!username) {
        return jsonOutput(res, { success: false, message: 'Username is required' });
    }
    
    try {
        const [messages] = await db.execute("SELECT * FROM messages WHERE recipient = ? ORDER BY timestamp DESC", [username]);
        jsonOutput(res, { success: true, messages });
    } catch (err) {
        console.error("Error in messages GET endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/messages', async (req, res) => {
    const { sender, recipient, subject, content } = req.body;
    
    if (!sender || !recipient || !subject || !content) {
        return jsonOutput(res, { success: false, message: 'All fields are required' });
    }
    
    try {
        const [result] = await db.execute("INSERT INTO messages (sender, recipient, subject, content) VALUES (?, ?, ?, ?)",
            [sender, recipient, subject, content]);
        
        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Message sent successfully' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to send message' });
        }
    } catch (err) {
        console.error("Error in messages POST endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.delete('/messages/:messageId', async (req, res) => {
    const { messageId } = req.params;
    
    if (!messageId) {
        return jsonOutput(res, { success: false, message: 'Message ID is required' });
    }
    
    try {
        const [result] = await db.execute("DELETE FROM messages WHERE id = ?", [messageId]);
        
        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Message deleted successfully' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to delete message' });
        }
    } catch (err) {
        console.error("Error in messages DELETE endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/messages/unread', async (req, res) => {
    const { username } = req.query;
    
    if (!username) {
        return jsonOutput(res, { success: false, message: 'Username is required' });
    }
    
    try {
        const [rows] = await db.execute("SELECT COUNT(*) as unreadCount FROM messages WHERE recipient = ? AND is_read = 0", [username]);
        const unreadCount = rows[0].unreadCount;
        jsonOutput(res, { success: true, unreadCount });
    } catch (err) {
        console.error("Error in messages/unread endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/messages/read', async (req, res) => {
    const { messageId } = req.body;
    
    if (!messageId) {
        return jsonOutput(res, { success: false, message: 'Message ID is required' });
    }
    
    try {
        const [result] = await db.execute("UPDATE messages SET is_read = 1 WHERE id = ?", [messageId]);
        
        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Message marked as read' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to mark message as read' });
        }
    } catch (err) {
        console.error("Error in messages/read endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/clan', async (req, res) => {
    const { username } = req.query;
    
    if (!username) {
        return jsonOutput(res, { success: false, message: 'Username is required' });
    }

    try {
        const [rows] = await db.execute("SELECT c.* FROM clans c JOIN clan_members cm ON c.id = cm.clan_id WHERE cm.username = ?", [username]);
        const clan = rows[0];

        if (clan) {
            const [members] = await db.execute("SELECT username FROM clan_members WHERE clan_id = ?", [clan.id]);
            clan.members = members.map(member => member.username);

            jsonOutput(res, { success: true, clan });
        } else {
            jsonOutput(res, { success: false, message: 'Player is not in a clan' });
        }
    } catch (err) {
        console.error("Error in clan GET endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/clan', async (req, res) => {
    const { username, clanName } = req.body;

    if (!username || !clanName) {
        return jsonOutput(res, { success: false, message: 'Username and clan name are required' });
    }

    try {
        await db.beginTransaction();

        // Check if the user has enough gold
        const [userRows] = await db.execute("SELECT gold FROM users WHERE username = ?", [username]);
        const userGold = userRows[0]?.gold;

        if (!userGold || userGold < 500) {
            await db.rollback();
            return jsonOutput(res, { success: false, message: 'Not enough gold to create a clan' });
        }

        // Create the clan
        const [clanResult] = await db.execute("INSERT INTO clans (name, leader) VALUES (?, ?)", [clanName, username]);
        const clanId = clanResult.insertId;

        // Add the user to the clan
        await db.execute("INSERT INTO clan_members (clan_id, username) VALUES (?, ?)", [clanId, username]);

        // Deduct gold from the user
        await db.execute("UPDATE users SET gold = gold - 500 WHERE username = ?", [username]);

        await db.commit();

        // Fetch the created clan
        const [clanRows] = await db.execute("SELECT * FROM clans WHERE id = ?", [clanId]);
        const clan = clanRows[0];

        jsonOutput(res, { success: true, clan });
    } catch (err) {
        await db.rollback();
        console.error("Error in clan POST endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/clans', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT c.id, c.name, COUNT(cm.username) as memberCount 
            FROM clans c 
            LEFT JOIN clan_members cm ON c.id = cm.clan_id 
            GROUP BY c.id
        `);
        jsonOutput(res, { success: true, clans: rows });
    } catch (err) {
        console.error("Error in clans GET endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/quests', async (req, res) => {
    try {
        const [quests] = await db.execute("SELECT id, title, description, reward, position_x, position_y, completed FROM quests ORDER BY id");
        
        // Find the first uncompleted quest
        let activeQuest = null;
        let allCompleted = true;
        for (const quest of quests) {
            if (quest.completed == 0) {
                activeQuest = quest;
                allCompleted = false;
                break;
            }
        }
        
        // If all quests are completed, reset them
        if (allCompleted) {
            await db.execute("UPDATE quests SET completed = 0");
            activeQuest = quests[0];
        }
        
        jsonOutput(res, { success: true, quests, activeQuest });
    } catch (err) {
        console.error("Error in quests GET endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/quests/complete', async (req, res) => {
    const { questId } = req.body;
    
    try {
        const [result] = await db.execute("UPDATE quests SET completed = 1 WHERE id = ?", [questId]);
        
        if (result.affectedRows > 0) {
            // Find the next uncompleted quest
            const [rows] = await db.execute("SELECT id, title, description, reward, position_x, position_y FROM quests WHERE completed = 0 ORDER BY id LIMIT 1");
            let nextQuest = rows[0];
            
            // If no uncompleted quests, reset all quests
            if (!nextQuest) {
                await db.execute("UPDATE quests SET completed = 0");
                [rows] = await db.execute("SELECT id, title, description, reward, position_x, position_y FROM quests ORDER BY id LIMIT 1");
                nextQuest = rows[0];
            }
            
            jsonOutput(res, { success: true, message: 'Quest completed successfully', nextQuest });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to complete quest' });
        }
    } catch (err) {
        console.error("Error in quests/complete endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/mob', async (req, res) => {
    try {
        console.log("Received request for /mob endpoint");
        const mob = await util.getMob();
        if (mob) {
            console.log("Returning mob data:", mob);
            jsonOutput(res, { success: true, mob });
        } else {
            console.log("Failed to fetch mob: getMob() returned null");
            jsonOutput(res, { success: false, message: 'Failed to fetch mob' });
        }
    } catch (err) {
        console.error("Exception in /mob endpoint:", err);
        console.error("Stack trace:", err.stack);
        jsonOutput(res, { success: false, message: 'An error occurred while fetching mob: ' + err.message });
    }
});

app.post('/fight', async (req, res) => {
    const { playerId, mobId } = req.body;
    
    try {
        const result = await util.startFight(playerId, mobId);
        if (result.fightId) {
            jsonOutput(res, { success: true, fightId: result.fightId });
        } else if (result.error) {
            console.error(`Failed to start fight: ${result.error}`, result);
            jsonOutput(res, { success: false, message: result.error, details: result });
        } else {
            jsonOutput(res, { success: false, message: 'Unknown error occurred' });
        }
    } catch (err) {
        console.error("Error in fight POST endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/fight', async (req, res) => {
    const { fightId } = req.query;
    
    try {
        const fightStatus = await util.getFightStatus(fightId);
        jsonOutput(res, { success: true, fightStatus });
    } catch (err) {
        console.error("Error in fight GET endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.put('/fight/:id', async (req, res) => {
    try {
        const fightId = req.params.id;
        const { playerHealth, mobHealth, isPlayerTurn } = req.body;

        console.log('Received update:', { fightId, playerHealth, mobHealth, isPlayerTurn });

        // Validate parameters
        if (fightId === undefined || playerHealth === undefined || mobHealth === undefined || isPlayerTurn === undefined) {
            throw new Error('Missing required parameters');
        }

        const parsedFightId = parseInt(fightId, 10);
        const parsedPlayerHealth = parseInt(playerHealth, 10);
        const parsedMobHealth = parseInt(mobHealth, 10);
        const parsedIsPlayerTurn = isPlayerTurn === true;

        // Validate parsed values
        if (isNaN(parsedFightId) || isNaN(parsedPlayerHealth) || isNaN(parsedMobHealth)) {
            throw new Error('Invalid parameter types');
        }

        await util.updateFightStatus(parsedFightId, parsedPlayerHealth, parsedMobHealth, parsedIsPlayerTurn);
        
        res.json({ success: true, message: 'Fight status updated successfully' });
    } catch (error) {
        console.error('Error in fight PUT endpoint:', error.message);
        res.status(400).json({ success: false, error: error.message || 'Invalid fight update parameters' });
    }
});

app.delete('/fight', async (req, res) => {
    const { fightId } = req.query;
    
    try {
        await util.endFight(fightId);
        jsonOutput(res, { success: true });
    } catch (err) {
        console.error("Error in fight DELETE endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/change-username', async (req, res) => {
    const { username, newUsername } = req.body;

    if (!username || !newUsername) {
        return jsonOutput(res, { success: false, message: 'Username and new username are required' });
    }

    try {
        // Check if the new username already exists
        const [existingUsers] = await db.execute("SELECT * FROM users WHERE username = ?", [newUsername]);
        if (existingUsers.length > 0) {
            return jsonOutput(res, { success: false, message: 'New username already exists' });
        }

        // Update the username
        const [result] = await db.execute("UPDATE users SET username = ? WHERE username = ?", [newUsername, username]);

        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Username changed successfully' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to change username' });
        }
    } catch (err) {
        console.error("Error in change-username endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/change-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
        return jsonOutput(res, { success: false, message: 'Username, current password, and new password are required' });
    }

    try {
        // Verify current password
        const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        const user = users[0];

        if (!user || !await bcrypt.compare(currentPassword, user.password)) {
            return jsonOutput(res, { success: false, message: 'Invalid current password' });
        }

        // Update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.execute("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, username]);

        if (result.affectedRows > 0) {
            jsonOutput(res, { success: true, message: 'Password changed successfully' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to change password' });
        }
    } catch (err) {
        console.error("Error in change-password endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});