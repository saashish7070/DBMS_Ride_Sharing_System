CREATE TABLE IF NOT EXISTS USER_RIDE (
    user_ride_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    ride_id INT,
    FOREIGN KEY (user_id) REFERENCES USER(user_id),
    FOREIGN KEY (ride_id) REFERENCES RIDE(ride_id)
);