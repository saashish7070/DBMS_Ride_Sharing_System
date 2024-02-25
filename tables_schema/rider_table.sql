CREATE TABLE rides (
    ride_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    available_seats INT NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    status ENUM('scheduled', 'ongoing', 'completed') DEFAULT 'scheduled',
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
);