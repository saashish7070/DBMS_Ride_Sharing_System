const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.post('/', async (req, res) => {
    // Assuming you have a request body with necessary details for user creation
    const { username, email, password, role } = req.body;

    try {
        // Insert the user into the database
        const [result] = await pool.execute(
            'INSERT INTO USER(username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role]
        );

        const userId = result.insertId;

        res.status(201).json({ userId, message: 'User created successfully.' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
