USE shurokkha_db;

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    upazila VARCHAR(50) NOT NULL,
    risk_level VARCHAR(50) DEFAULT 'Low'
);

INSERT INTO locations (district, upazila, risk_level) VALUES 
('Sylhet', 'Gowainghat', 'High'),
('Sunamganj', 'Tahirpur', 'High'),
('Kurigram', 'Chilmari', 'Medium'),
('Satkhira', 'Shyamnagar', 'Critical');
