require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { query } = require('./util');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function jsonOutput(res, data) {
    res.json(data);
}

app.get('/test-db', async (req, res) => {
    try {
        const result = await query('SELECT NOW()');
        res.json({ message: 'Database connection successful', timestamp: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});