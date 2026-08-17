USE shurokkha_db;

CREATE TABLE emergency_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    shelter_id INT,
    disaster_type_id INT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES shelters(id) ON DELETE SET NULL,
    FOREIGN KEY (disaster_type_id) REFERENCES disaster_types(id) ON DELETE SET NULL
);

INSERT INTO emergency_requests (user_name, phone_number, shelter_id, disaster_type_id, status) VALUES 
('Rahim Uddin', '01711223344', 1, 1, 'Pending'),
('Karim Mia', '01822334455', 2, 2, 'Rescued'),
('Selina Akter', '01933445566', 3, 3, 'In Progress');
