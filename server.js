const express = require('express');
const cors = require('cors');
const { pool, createTables } = require('./db');
const rideDetailRoute = require('./routes/rideDetailRoute');
const rideRequestRoute = require('./routes/rideRequestRoute');
const createUserRoute = require('./routes/userDetailRoute');

const app = express();
const port = 9000;
app.use(express.json());
app.use(cors());

// Ensure the tables are created when the server starts
createTables();

// Use the rideDetailRoute and rideRequestRoute as middleware
app.use('/create-user', createUserRoute);
app.use('/ride-detail', rideDetailRoute);
app.use('/ride-request', rideRequestRoute);

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});

module.exports = {
    pool: pool
};
