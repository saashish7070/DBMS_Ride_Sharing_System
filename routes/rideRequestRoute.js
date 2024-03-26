const express = require('express');
const router = express.Router();
const { pool } = require('../db');
// const { calculateDistance } = require('../distanceData'); // Import the distance data

// Route for submitting a ride request
router.post('/', async (req, res) => {
    // Assuming you have a request body with necessary details for the ride request
    const { userId, startLocation, endLocation, requestedSeats } = req.body;

    try {
        // Insert the ride request into the database with the current timestamp for booking_time
        const [result] = await pool.execute(
            'INSERT INTO Booking(passenger_id, start_location, end_location, requested_seats, booking_time) VALUES (?, ?, ?, ?, NOW())',
            [userId, startLocation, endLocation, requestedSeats]
        );

        const rideRequestId = result.insertId;

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
//Show Driver all the Request of Rides
router.get('/accepted-requests', async (req, res) => {
    try {
        // Retrieve all booking records with status 'pending'
        const [pendingRequests] = await pool.execute(
            'SELECT * FROM Booking WHERE status = ?',
            ['accepted']
        );

        res.status(200).json({ pendingRequests });
    } catch (error) {
        console.error('Error fetching pending ride requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const calculateDistance = (startLocation, endLocation) => {
    return 100; // Replace with your distance calculation logic
};

const calculateFare = (distance) => {
    return 20; // Replace with your fare calculation logic
};

const notifyUserAboutRideConfirmation = (bookingId, driverId, distance, fare) => {
    console.log(`Ride request ${bookingId} accepted. Distance: ${distance}, Fare: ${fare}`);
};

const notifyUserAboutRideRejection = (bookingId, driverId) => {
    console.log(`Ride request ${bookingId} rejected.`);
};

// router.post('/accept-reject', async (req, res) => {
//     const { bookingId, driverId, action } = req.body;

//     try {
//         let status = '';
//         if (action === 'accept') {
//             status = 'scheduled';

//             const [rideDetails] = await pool.execute(
//                 'SELECT * FROM Booking WHERE booking_id = ?',
//                 [bookingId]
//             );

//             const startLocation = rideDetails[0].start_location;
//             const endLocation = rideDetails[0].end_location;
//             const requestedSeats = rideDetails[0].requested_seats; // Assuming requested_seats column exists in Booking

//             const distance = calculateDistance(startLocation, endLocation);
//             const fare = calculateFare(distance);

//             // Update ride request with distance, fare, and requested seats information
//             await pool.execute(
//                 'INSERT INTO Ride(driver_id, booking_id, start_location, end_location, start_time, available_seats, fare, status) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)',
//                 [driverId, bookingId, startLocation, endLocation, requestedSeats, fare, status]
//             );
//             status = "accepted"
//             await pool.execute(
//                 'UPDATE Booking SET status = ? WHERE booking_id = ?',
//                 [status,bookingId]
//             );

//             // Notify the user about the ride confirmation
//             notifyUserAboutRideConfirmation(bookingId, driverId, distance, fare);
//         } else if (action === 'reject') {
//             status = 'rejected';

//             // Notify the user about the ride rejection
//             notifyUserAboutRideRejection(bookingId, driverId);
//         } else {
//             return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
//         }

//         res.status(200).json({ message: `Ride request ${action}ed successfully.` });
//     } catch (error) {
//         console.error('Error accepting/rejecting ride request:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// Add other routes and server setup code here
router.post('/accept-reject', async (req, res) => {
    const { bookingId, driverId, action } = req.body;

    try {
        let status = '';
        if (action === 'accept') {
            status = 'scheduled';

            // Check if the driver already has an accepted or scheduled ride during the requested time
            const [existingRide] = await pool.execute(
                'SELECT * FROM Ride WHERE driver_id = ? AND (status = "accepted" OR status = "scheduled") AND start_time > NOW()',
                [driverId]
            );

            if (existingRide.length > 0) {
                return res.status(400).json({ message: 'Driver already has an accepted or scheduled ride at the moment.' });
            }

            const [rideDetails] = await pool.execute(
                'SELECT * FROM Booking WHERE booking_id = ?',
                [bookingId]
            );

            const startLocation = rideDetails[0].start_location;
            const endLocation = rideDetails[0].end_location;
            const requestedSeats = rideDetails[0].requested_seats; // Assuming requested_seats column exists in Booking

            const distance = calculateDistance(startLocation, endLocation);
            const fare = calculateFare(distance);

            // Update ride request with distance, fare, and requested seats information
            await pool.execute(
                'INSERT INTO Ride(driver_id, booking_id, start_location, end_location, start_time, available_seats, fare, status) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)',
                [driverId, bookingId, startLocation, endLocation, requestedSeats, fare, status]
            );
            status = "accepted"
            await pool.execute(
                'UPDATE Booking SET status = ? WHERE booking_id = ?',
                [status,bookingId]
            );

            // Notify the user about the ride confirmation
            notifyUserAboutRideConfirmation(bookingId, driverId, distance, fare);
        } else if (action === 'reject') {
            status = 'rejected';

            // Notify the user about the ride rejection
            notifyUserAboutRideRejection(bookingId, driverId);
        } else {
            return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
        }

        res.status(200).json({ message: `Ride request ${action}ed successfully.` });
    } catch (error) {
        console.error('Error accepting/rejecting ride request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Ensure to handle response appropriately for other routes and server setup
// ...
router.post('/ride-completed', async (req, res) => {
    const { bookingId } = req.body;

    try {
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required in the request body.' });
        }

        // Check if the booking exists and has a status of 'scheduled'
        const [bookingDetails] = await pool.execute(
            'SELECT * FROM Ride WHERE booking_id = ? AND status = "scheduled"',
            [bookingId]
        );

        if (bookingDetails.length === 0) {
            return res.status(404).json({ message: 'Booking not found or not in a scheduled state.' });
        }

        // Update the booking status to 'completed' in both 'Ride' and 'Booking' tables
        await pool.execute(
            'UPDATE Ride SET status = "Completed" WHERE booking_id = ?',
            [bookingId]
        );

        res.status(200).json({ message: 'Ride marked as completed successfully.' });
    } catch (error) {
        console.error('Error marking ride as completed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
