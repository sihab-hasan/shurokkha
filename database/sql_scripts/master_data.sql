CREATE DATABASE IF NOT EXISTS shurokkha_db;
USE shurokkha_db;

CREATE TABLE disaster_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    severity_level VARCHAR(50)
);

INSERT INTO disaster_types (name, severity_level) VALUES 
('Flood', 'High'),
('Cyclone', 'Critical'),
('Earthquake', 'Critical'),
('Fire', 'Medium'),
('Landslide', 'High');
