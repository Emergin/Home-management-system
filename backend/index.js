// index.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Trubel',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
    
    db.query("CREATE DATABASE IF NOT EXISTS home_management", (err) => {
        if (err) throw err;
        console.log("Database created or already exists.");
    });

    db.query("USE home_management", (err) => {
        if (err) throw err;
        console.log("Using home_management database.");
    });

    // Create users table
    const createUserTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Create shopping_items table
    const createShoppingItemsTable = `
        CREATE TABLE IF NOT EXISTS shopping_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            item_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            purchase_date DATE NOT NULL,
            expiration_date DATE,
            reminder_days INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

    // Create daily_tasks table
    const createDailyTasksTable = `
        CREATE TABLE IF NOT EXISTS daily_tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            task_name VARCHAR(255) NOT NULL,
            time TIME NOT NULL,
            frequency VARCHAR(50) DEFAULT 'daily',
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

    // Create priority_tasks table
    const createPriorityTasksTable = `
        CREATE TABLE IF NOT EXISTS priority_tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            task_name VARCHAR(255) NOT NULL,
            priority VARCHAR(50) NOT NULL,
            deadline DATETIME NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

    // Create feedback table
    const createFeedbackTable = `
        CREATE TABLE IF NOT EXISTS feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            rating INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    const createToolsTable = `
    CREATE TABLE IF NOT EXISTS tools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        category ENUM('tools', 'office', 'seasonal', 'batteries') NOT NULL,
        quantity INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        \`condition\` ENUM('new', 'good', 'fair', 'poor') NOT NULL,
        lastChecked DATE,
        notes TEXT,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`;


    // Execute table creation queries
    db.query(createUserTable, (err) => {
        if (err) throw err;
        console.log("Users table created or already exists.");
    });

    db.query(createShoppingItemsTable, (err) => {
        if (err) throw err;
        console.log("Shopping items table created or already exists.");
    });

    db.query(createDailyTasksTable, (err) => {
        if (err) throw err;
        console.log("Daily tasks table created or already exists.");
    });

    db.query(createPriorityTasksTable, (err) => {
        if (err) throw err;
        console.log("Priority tasks table created or already exists.");
    });

    db.query(createFeedbackTable, (err) => {
        if (err) throw err;
        console.log("Feedback table created or already exists.");
    });
    db.query(createToolsTable, (err) => {
        if (err) throw err;
        console.log("Tools table created or already exists.");
    });
});

// Authentication Routes
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already registered' });
                }
                return res.status(500).json({ message: 'Error registering user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Error logging in' });
        if (results.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ 
            success: true, 
            message: 'Login successful',
            userId: user.id 
        });
    });
});

// In your backend API route handler
// Shopping items POST endpoint
app.post('/api/shopping-items', async (req, res) => {
    const {
        itemName,
        quantity,
        purchaseDate,
        expirationDate,
        reminderDays,
        userId
    } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const query = `
            INSERT INTO shopping_items 
            (user_id, item_name, quantity, purchase_date, expiration_date, reminder_days)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            userId,
            itemName,
            quantity,
            purchaseDate,
            expirationDate,
            reminderDays
        ];

        await db.query(query, values);
        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

app.get('/api/shopping-items/:userId', (req, res) => {
    const sql = "SELECT * FROM shopping_items WHERE user_id = ?";
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching items' });
        res.json(results);
    });
});
app.delete('/api/shopping-items/:id', (req, res) => {
    const sql = "DELETE FROM shopping_items WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting item' });
        res.json({ message: 'Item deleted successfully' });
    });
});

// Daily Tasks Routes
app.post('/api/daily-tasks', (req, res) => {
    const { userId, taskName, time, frequency } = req.body;
    const sql = "INSERT INTO daily_tasks (user_id, task_name, time, frequency, created_at) VALUES (?, ?, ?, ?, NOW())";
    
    db.query(sql, [userId, taskName, time, frequency], (err, result) => {
        if (err) {
            console.error('Error adding daily task:', err);
            return res.status(500).json({ message: 'Error adding task' });
        }
        res.status(201).json({ 
            message: 'Task added successfully',
            taskId: result.insertId 
        });
    });
});

app.get('/api/daily-tasks/:userId', (req, res) => {
    const sql = `
        SELECT 
            id as _id,
            task_name as taskName,
            time,
            frequency,
            created_at as createdAt,
            completed
        FROM daily_tasks 
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) {
            console.error('Error fetching daily tasks:', err);
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.json(results);
    });
});

app.put('/api/daily-tasks/:taskId', (req, res) => {
    const { taskName, time, frequency } = req.body;
    const sql = "UPDATE daily_tasks SET task_name = ?, time = ?, frequency = ? WHERE id = ? AND user_id = ?";
    
    db.query(sql, [taskName, time, frequency, req.params.taskId, req.body.userId], (err, result) => {
        if (err) {
            console.error('Error updating daily task:', err);
            return res.status(500).json({ message: 'Error updating task' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

app.delete('/api/daily-tasks/:taskId', (req, res) => {
    const sql = "DELETE FROM daily_tasks WHERE id = ?";
    
    db.query(sql, [req.params.taskId], (err, result) => {
        if (err) {
            console.error('Error deleting daily task:', err);
            return res.status(500).json({ message: 'Error deleting task' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Priority Tasks Routes
app.post('/api/priority-tasks', (req, res) => {
    const { userId, taskName, priority, deadline } = req.body;
    const sql = "INSERT INTO priority_tasks (user_id, task_name, priority, deadline, created_at) VALUES (?, ?, ?, ?, NOW())";
    
    db.query(sql, [userId, taskName, priority, deadline], (err, result) => {
        if (err) {
            console.error('Error adding priority task:', err);
            return res.status(500).json({ message: 'Error adding task' });
        }
        res.status(201).json({ 
            message: 'Task added successfully',
            taskId: result.insertId 
        });
    });
});

app.get('/api/priority-tasks/:userId', (req, res) => {
    const sql = `
        SELECT 
            id as _id,
            task_name as taskName,
            priority,
            deadline,
            created_at as createdAt,
            completed
        FROM priority_tasks 
        WHERE user_id = ?
        ORDER BY deadline ASC, priority DESC
    `;
    
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) {
            console.error('Error fetching priority tasks:', err);
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.json(results);
    });
});

app.put('/api/priority-tasks/:taskId', (req, res) => {
    const { taskName, priority, deadline } = req.body;
    const sql = "UPDATE priority_tasks SET task_name = ?, priority = ?, deadline = ? WHERE id = ? AND user_id = ?";
    
    db.query(sql, [taskName, priority, deadline, req.params.taskId, req.body.userId], (err, result) => {
        if (err) {
            console.error('Error updating priority task:', err);
            return res.status(500).json({ message: 'Error updating task' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

app.delete('/api/priority-tasks/:taskId', (req, res) => {
    const sql = "DELETE FROM priority_tasks WHERE id = ?";
    
    db.query(sql, [req.params.taskId], (err, result) => {
        if (err) {
            console.error('Error deleting priority task:', err);
            return res.status(500).json({ message: 'Error deleting task' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Fetch all tools for a user
app.get('/api/tools/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query('SELECT * FROM tools WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Failed to fetch tools:', err);
            res.status(500).send('Error fetching tools');
        } else {
            res.json(results);
        }
    });
});

// Add a new tool
app.post('/api/tools', (req, res) => {
    const { userId, name, category, quantity, location, condition, lastChecked, notes } = req.body;
    const query = `INSERT INTO tools (user_id, name, category, quantity, location, \`condition\`, lastChecked, notes)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [userId, name, category, quantity, location, condition, lastChecked, notes], (err, result) => {
        if (err) {
            console.error('Failed to add tool:', err);
            res.status(500).send('Error adding tool');
        } else {
            res.status(201).json({ id: result.insertId });
        }
    });
});

// Update an existing tool
app.put('/api/tools/:id', (req, res) => {
    const { name, category, quantity, location, condition, lastChecked, notes, userId } = req.body;
    const toolId = req.params.id;

    // Convert lastChecked to the correct format
    const formattedLastChecked = new Date(lastChecked).toISOString().slice(0, 19).replace('T', ' '); // Format to 'YYYY-MM-DD HH:MM:SS'

    const query = `UPDATE tools SET name = ?, category = ?, quantity = ?, location = ?, 
                   \`condition\` = ?, lastChecked = ?, notes = ? WHERE id = ? AND user_id = ?`;
    
    db.query(query, [name, category, quantity, location, condition, formattedLastChecked, notes, toolId, userId], (err, result) => {
        if (err) {
            console.error('Failed to update tool:', err);
            res.status(500).send('Error updating tool');
        } else {
            res.sendStatus(200);
        }
    });
});


// Delete a tool
app.delete('/api/tools/:id', (req, res) => {
    const toolId = req.params.id;
    db.query('DELETE FROM tools WHERE id = ?', [toolId], (err, result) => {
        if (err) {
            console.error('Failed to delete tool:', err);
            res.status(500).send('Error deleting tool');
        } else {
            res.sendStatus(200);
        }
    });
});


// Feedback Routes
app.post('/api/feedback', (req, res) => {
    const { userId, title, message, rating } = req.body;
    const sql = "INSERT INTO feedback (user_id, title, message, rating) VALUES (?, ?, ?, ?)";
    db.query(sql, [userId, title, message, rating], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error submitting feedback' });
        res.status(201).json({ message: 'Feedback submitted successfully' });
    });
});

// Check for Reminders (run periodically)
const checkReminders = () => {
    const sql = `
        SELECT * FROM shopping_items 
        WHERE expiration_date IS NOT NULL 
        AND DATE_SUB(expiration_date, INTERVAL reminder_days DAY) = CURDATE()
    `;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log("Items expiring soon:", results);
    });
};

setInterval(checkReminders, 24 * 60 * 60 * 1000); // Run once a day

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
