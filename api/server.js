const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Include util.js
const { query } = require('./util');

// Function to output JSON and exit
function jsonOutput(res, data) {
    res.json(data);
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const { rows } = await query("SELECT id, password FROM users WHERE username = $1", [username]);
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
        const { rows } = await query("SELECT experience, level, desire_for_adventure, class, strength, defense, intelligence, dexterity, gold, avatar FROM users WHERE username = $1", [username]);
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
        const result = await query("UPDATE users SET experience = $1, level = $2, desire_for_adventure = $3, strength = $4, defense = $5, intelligence = $6, dexterity = $7, gold = $8 WHERE username = $9",
            [experience, level, desireForAdventure, strength, defense, intelligence, dexterity, gold, username]);
        
        if (result.rowCount > 0) {
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
        const { rows: existingUsers } = await query("SELECT * FROM users WHERE username = $1", [username]);
        if (existingUsers.length > 0) {
            return jsonOutput(res, { success: false, message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const { rowCount: userRowCount } = await query("INSERT INTO users (username, password, class, avatar) VALUES ($1, $2, $3, $4)", [username, hashedPassword, userClass, avatar]);

        if (userRowCount > 0) {
            // Initialize resources for the new user
            const { rowCount: resourceRowCount } = await query("INSERT INTO resources (username, wood, stone, iron, gold) VALUES ($1, 0, 0, 0, 0)", [username]);

            if (resourceRowCount > 0) {
                jsonOutput(res, { success: true, message: 'Registration successful' });
            } else {
                jsonOutput(res, { success: false, message: 'Failed to initialize resources' });
            }
        } else {
            jsonOutput(res, { success: false, message: 'Registration failed' });
        }
    } catch (err) {
        console.error("Registration error:", err);
        jsonOutput(res, { success: false, message: 'An unexpected error occurred: ' + err.message });
    }
});

app.get('/buildings', async (req, res) => {
    const { username } = req.query;
    
    try {
        const { rows: buildings } = await query("SELECT * FROM buildings WHERE username = $1", [username]);
        jsonOutput(res, { success: true, buildings });
    } catch (err) {
        console.error("Error in buildings endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.post('/buildings', async (req, res) => {
    const { username, building } = req.body;
    
    try {
        const { rows } = await query("INSERT INTO buildings (username, type, x, y, start_time, level) VALUES ($1, $2, $3, $4, $5, 1) RETURNING id",
            [username, building.type, building.x, building.y, building.start_time]);
        
        if (rows.length > 0) {
            jsonOutput(res, { success: true, message: 'Building added successfully', buildingId: rows[0].id });
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
        const { rowCount } = await query("DELETE FROM buildings WHERE id = $1 AND username = $2", [buildingId, username]);
        
        if (rowCount > 0) {
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
        const { rows } = await query("SELECT level FROM buildings WHERE id = $1 AND username = $2", [buildingId, username]);
        const currentLevel = rows[0]?.level;
        
        if (currentLevel !== undefined) {
            const newLevel = currentLevel + 1;
            
            // Update building level
            const result = await query("UPDATE buildings SET level = $1 WHERE id = $2 AND username = $3", [newLevel, buildingId, username]);
            
            if (result.rowCount > 0) {
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
        const { rows } = await query("SELECT * FROM resources WHERE username = $1", [username]);
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
        const result = await query("UPDATE resources SET wood = $1, stone = $2, iron = $3, gold = $4 WHERE username = $5",
            [resources.wood, resources.stone, resources.iron, resources.gold, username]);
        
        if (result.rowCount > 0) {
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
    
    let queryText = "SELECT username, level, experience, strength, defense, intelligence, dexterity FROM users";
    const queryParams = [];
    
    if (timeFrame !== 'all') {
        const timeLimit = timeFrame === 'weekly' ? '1 WEEK' : '1 MONTH';
        queryText += " WHERE last_active >= NOW() - INTERVAL $1";
        queryParams.push(timeLimit);
    }
    
    queryText += ` ORDER BY ${category} DESC LIMIT 100`;
    
    try {
        const { rows: leaderboard } = await query(queryText, queryParams);
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
        const { rows: messages } = await query("SELECT * FROM messages WHERE recipient = $1 ORDER BY timestamp DESC", [username]);
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
        const result = await query("INSERT INTO messages (sender, recipient, subject, content) VALUES ($1, $2, $3, $4)",
            [sender, recipient, subject, content]);
        
        if (result.rowCount > 0) {
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
        const result = await query("DELETE FROM messages WHERE id = $1", [messageId]);
        
        if (result.rowCount > 0) {
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
        const { rows } = await query("SELECT COUNT(*) as unreadCount FROM messages WHERE recipient = $1 AND is_read = false", [username]);
        const unreadCount = rows[0].unreadcount;
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
        const result = await query("UPDATE messages SET is_read = true WHERE id = $1", [messageId]);
        
        if (result.rowCount > 0) {
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
        const { rows: clanRows } = await query("SELECT c.* FROM clans c JOIN clan_members cm ON c.id = cm.clan_id WHERE cm.username = $1", [username]);
        const clan = clanRows[0];

        if (clan) {
            const { rows: memberRows } = await query("SELECT username FROM clan_members WHERE clan_id = $1", [clan.id]);
            clan.members = memberRows.map(member => member.username);

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
        // Check if the user has enough gold
        const { rows: userRows } = await query("SELECT gold FROM users WHERE username = $1", [username]);
        const userGold = userRows[0]?.gold;

        if (!userGold || userGold < 500) {
            return jsonOutput(res, { success: false, message: 'Not enough gold to create a clan' });
        }

        // Create the clan
        const { rows: clanRows } = await query("INSERT INTO clans (name, leader) VALUES ($1, $2) RETURNING id", [clanName, username]);
        const clanId = clanRows[0].id;

        // Add the user to the clan
        await query("INSERT INTO clan_members (clan_id, username) VALUES ($1, $2)", [clanId, username]);

        // Deduct gold from the user
        await query("UPDATE users SET gold = gold - 500 WHERE username = $1", [username]);

        // Fetch the created clan
        const { rows: createdClanRows } = await query("SELECT * FROM clans WHERE id = $1", [clanId]);
        const clan = createdClanRows[0];

        jsonOutput(res, { success: true, clan });
    } catch (err) {
        console.error("Error in clan POST endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/clans', async (req, res) => {
    try {
        const { rows } = await query(`
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
        const { rows: quests } = await query("SELECT id, title, description, reward, position_x, position_y, completed FROM quests ORDER BY id");
        
        // Find the first uncompleted quest
        let activeQuest = null;
        let allCompleted = true;
        for (const quest of quests) {
            if (quest.completed == false) {
                activeQuest = quest;
                allCompleted = false;
                break;
            }
        }
        
        // If all quests are completed, reset them
        if (allCompleted) {
            await query("UPDATE quests SET completed = false");
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
        const result = await query("UPDATE quests SET completed = true WHERE id = $1", [questId]);
        
        if (result.rowCount > 0) {
            // Find the next uncompleted quest
            const { rows } = await query("SELECT id, title, description, reward, position_x, position_y FROM quests WHERE completed = false ORDER BY id LIMIT 1");
            let nextQuest = rows[0];
            
            // If no uncompleted quests, reset all quests
            if (!nextQuest) {
                await query("UPDATE quests SET completed = false");
                const { rows: resetRows } = await query("SELECT id, title, description, reward, position_x, position_y FROM quests ORDER BY id LIMIT 1");
                nextQuest = resetRows[0];
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
        const { rows: existingUsers } = await query("SELECT * FROM users WHERE username = $1", [newUsername]);
        if (existingUsers.length > 0) {
            return jsonOutput(res, { success: false, message: 'New username already exists' });
        }

        // Update the username
        const result = await query("UPDATE users SET username = $1 WHERE username = $2", [newUsername, username]);

        if (result.rowCount > 0) {
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
        const { rows: users } = await query("SELECT * FROM users WHERE username = $1", [username]);
        const user = users[0];

        if (!user || !await bcrypt.compare(currentPassword, user.password)) {
            return jsonOutput(res, { success: false, message: 'Invalid current password' });
        }

        // Update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await query("UPDATE users SET password = $1 WHERE username = $2", [hashedPassword, username]);

        if (result.rowCount > 0) {
            jsonOutput(res, { success: true, message: 'Password changed successfully' });
        } else {
            jsonOutput(res, { success: false, message: 'Failed to change password' });
        }
    } catch (err) {
        console.error("Error in change-password endpoint:", err);
        jsonOutput(res, { success: false, message: 'An error occurred: ' + err.message });
    }
});

app.get('/test-db', async (req, res) => {
    try {
        const { rows } = await query('SELECT NOW()');
        res.json({ success: true, currentTime: rows[0].now });
    } catch (err) {
        console.error('Database test failed:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});