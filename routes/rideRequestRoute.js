const express = require('express');
const router = express.Router();
const { pool } = require('../db');
// const { calculateDistance } = require('../distanceData'); // Import the distance data

// Route for submitting a ride request
router.post('/', async (req, res) => {
    // Assuming you have a request body with necessary details for the ride request
    const { userId, startLocation, endLocation, requestedSeats } = req.body;

    try {
        // Insert the ride request into the database
        const [result] = await pool.execute(
            'INSERT INTO Booking(user_id, start_location, end_location, requested_seats) VALUES (?, ?, ?, ?)',
            [userId, startLocation, endLocation, requestedSeats]
        );

        const rideRequestId = result.booking_id;

        res.status(201).json({ rideRequestId, message: 'Ride request submitted successfully.' });
    } catch (error) {
        console.error('Error submitting ride request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Show Driver all the Request of Rides
router.get('/pending-requests', async (req, res) => {
    try {
        // Retrieve all booking records with status 'pending'
        const [pendingRequests] = await pool.execute(
            'SELECT * FROM Booking WHERE status = ?',
            ['pending']
        );

        res.status(200).json({ pendingRequests });
    } catch (error) {
        console.error('Error fetching pending ride requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for the driver to accept or reject ride requests
// router.post('/accept-reject', async (req, res) => {
//     // Assuming you have a request body with necessary details for accepting/rejecting a ride request
//     const { rideRequestId, driverId, action } = req.body;

//     try {
//         // Update the status of the ride request based on the driver's action
//         let status = '';
//         if (action === 'accept') {
//             status = 'accepted';

//             // Get ride details including start and end locations
//             const [rideDetails] = await pool.execute(
//                 'SELECT r.start_location, r.end_location FROM ride_requests rr JOIN RIDE r ON rr.ride_id = r.ride_id WHERE rr.ride_request_id = ?',
//                 [rideRequestId]
//             );

//             const startLocation = rideDetails[0].start_location;
//             const endLocation = rideDetails[0].end_location;

//             // Calculate distance using the distanceData.js file
//             const distance = calculateDistance(startLocation, endLocation);

//             // Implement your fare calculation logic based on distance
//             const fare = calculateFare(distance);

//             // Update ride request with distance and fare information
//             await pool.execute(
//                 'UPDATE ride_requests SET status = ?, driver_id = ?, distance = ?, fare = ? WHERE ride_request_id = ?',
//                 [status, driverId, distance, fare, rideRequestId]
//             );

//             // Notify the user about the ride confirmation
//             notifyUserAboutRideConfirmation(rideRequestId, driverId, distance, fare);
//         } else if (action === 'reject') {
//             status = 'rejected';

//             // Notify the user about the ride rejection
//             notifyUserAboutRideRejection(rideRequestId, driverId);
//         } else {
//             return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
//         }

//         res.status(200).json({ message: `Ride request ${action}ed successfully.` });
//     } catch (error) {
//         console.error('Error accepting/rejecting ride request:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// const calculateFare = (distance) => {
//     // Implement your fare calculation logic based on distance
//     // This function should return the calculated fare
//     return 20; // Replace with the actual calculation
// };

// const notifyUserAboutRideConfirmation = (rideRequestId, userId, driverId, distance, fare) => {
//     // Implement your notification logic to inform the user about ride confirmation
//     console.log(`Ride request ${rideRequestId} accepted. Distance: ${distance}, Fare: ${fare}`);
// };

// const notifyUserAboutRideRejection = (rideRequestId, userId) => {
//     // Implement your notification logic to inform the user about ride rejection
//     console.log(`Ride request ${rideRequestId} rejected.`);
// };

module.exports = router;
