    const express = require('express');
    const mysql = require('mysql2');
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    const app = express();
    const PORT = 5000;

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());

    // MySQL connection
    const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'achrafmas03', // Replace with your MySQL password
    database: 'secure_comments',
    });

    db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    });

    // Signup endpoint
    app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already in use' });
            }
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'Account created successfully' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
    });

    // Login endpoint
    app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
        return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Send user data (excluding sensitive information)
        res.status(200).json({
        message: 'Login successful',
        user: {
            email: user.email,
            // Add any other non-sensitive user data you want to include
        }
        });
    });
    });

    // Start server
    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    });