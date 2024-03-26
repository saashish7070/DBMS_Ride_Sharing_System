CREATE TABLE IF NOT EXISTS Booking (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    passenger_id INT NOT NULL,
    booking_time DATETIME,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    requested_seats INT NOT NULL,
    status VARCHAR(255) DEFAULT 'pending',
    FOREIGN KEY (passenger_id) REFERENCES USER(user_id)
);


