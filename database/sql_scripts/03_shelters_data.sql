USE shurokkha_db;

CREATE TABLE shelters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location_id INT,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

INSERT INTO shelters (name, location_id, capacity, current_occupancy) VALUES 
('Gowainghat Primary School Shelter', 1, 500, 150),
('Tahirpur Upazila Complex', 2, 800, 400),
('Chilmari Flood Shelter', 3, 300, 50),
('Shyamnagar Cyclone Center', 4, 1000, 0);
