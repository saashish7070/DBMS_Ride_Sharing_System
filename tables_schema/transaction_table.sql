CREATE TABLE IF NOT EXISTS PAYMENT (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    ride_id INT NOT NULL,
    payer_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_time DATETIME NOT NULL,
    payment_status ENUM('pending', 'completed') DEFAULT 'pending',
    FOREIGN KEY (ride_id) REFERENCES RIDE(ride_id),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (payer_id) REFERENCES USER(user_id)
);
