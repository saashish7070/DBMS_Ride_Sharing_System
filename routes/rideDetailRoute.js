const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/:id', async (req, res) => {
    const rideId = parseInt(req.params.id);

    try {
        const [rows, fields] = await pool.execute('SELECT * FROM rides WHERE ride_id = ?', [rideId]);

        if (rows.length > 0) {
            res.json(rows[0]); // Assuming there is only one ride with the specified ID
        } else {
            res.status(404).json({ message: 'Ride not found for the given ride_id.' });
        }
    } catch (error) {
        console.error('Error fetching ride details from the database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
