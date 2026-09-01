-- ============================================================================
-- SHUROKKHA - Master Seed Data (DML)
-- Data for tables 1 to 10 aligned with the ERD
-- ============================================================================

USE shurokkha_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Seed Roles
-- ----------------------------------------------------------------------------
TRUNCATE TABLE roles;
INSERT INTO roles (role_id, role_name, description) VALUES
(1, 'Admin', 'Platform administrator with system-wide coordination access'),
(2, 'Citizen', 'Disaster-affected individual or general citizen requesting emergency assistance'),
(3, 'Volunteer', 'Rescue operator or ground volunteer assigned to response missions'),
(4, 'Donor', 'Contributor funding relief packages and disaster campaigns');

-- ----------------------------------------------------------------------------
-- 2. Seed Users
-- ----------------------------------------------------------------------------
TRUNCATE TABLE users;
INSERT INTO users (id, user_id, name, full_name, email, password, role, role_id, phone, status) VALUES
(1, 1, 'System Administrator', 'System Administrator', 'admin@shurokkha.gov.bd', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'admin', 1, '01700000001', 'active'),
(2, 2, 'Rahim Uddin', 'Rahim Uddin', 'rahim@gmail.com', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'citizen', 2, '01711223344', 'active'),
(3, 3, 'Selina Akter', 'Selina Akter', 'selina@gmail.com', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'citizen', 2, '01933445566', 'active'),
(4, 4, 'Tariqul Islam', 'Tariqul Islam', 'tariqul.donor@gmail.com', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'donor', 4, '01811556677', 'active'),
(5, 5, 'Farhan Ahmed', 'Farhan Ahmed', 'farhan.volunteer@gmail.com', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'volunteer', 3, '01511223344', 'active');

-- ----------------------------------------------------------------------------
-- 3. Seed Disasters
-- ----------------------------------------------------------------------------
TRUNCATE TABLE disasters;
INSERT INTO disasters (disaster_id, disaster_name, severity, status, start_datetime) VALUES
(1, 'Sylhet Flash Flood 2026', 'Critical', 'active', '2026-06-15 08:30:00'),
(2, 'Bay of Bengal Super Cyclone', 'High', 'active', '2026-07-02 14:00:00'),
(3, 'Kurigram Riverbank Erosion', 'Medium', 'contained', '2026-05-20 10:15:00'),
(4, 'Chittagong Hill Tracts Landslide', 'Critical', 'resolved', '2026-04-10 06:45:00');

-- ----------------------------------------------------------------------------
-- 4. Seed Emergency Requests
-- ----------------------------------------------------------------------------
TRUNCATE TABLE emergency_requests;
INSERT INTO emergency_requests (request_id, user_id, area_id, priority, status, request_at) VALUES
(1, 2, 1, 'critical', 'in_progress', '2026-08-30 14:30:00'),
(2, 3, 3, 'critical', 'pending', '2026-08-30 16:15:00'),
(3, 2, 2, 'high', 'rescued', '2026-08-30 17:00:00'),
(4, 3, 4, 'normal', 'closed', '2026-08-29 11:20:00');

-- ----------------------------------------------------------------------------
-- 5. Seed Affected Areas
-- ----------------------------------------------------------------------------
TRUNCATE TABLE affected_areas;
INSERT INTO affected_areas (area_id, disaster_id, location_id, affected_population, severity) VALUES
(1, 1, 101, 25000, 'Critical'),
(2, 1, 102, 18000, 'High'),
(3, 2, 201, 50000, 'Critical'),
(4, 3, 301, 8000, 'Medium'),
(5, 1, 103, 32000, 'Critical'),
(6, 2, 202, 41000, 'High'),
(7, 4, 401, 6500, 'Medium'),
(8, 1, 104, 12000, 'High');

-- ----------------------------------------------------------------------------
-- 6. Seed Rescue Teams
-- ----------------------------------------------------------------------------
TRUNCATE TABLE rescue_teams;
INSERT INTO rescue_teams (team_id, team_name, team_type, availability) VALUES
(1, 'Dhaka Fire Service Alpha', 'Search and Rescue', 'busy'),
(2, 'Sylhet Volunteer Group One', 'Logistics & Relief', 'available'),
(3, 'Red Crescent Medical Team B', 'Medical Support', 'available'),
(4, 'Coast Guard Rescue Unit 5', 'Water Rescue', 'busy');

-- ----------------------------------------------------------------------------
-- 7. Seed Team Management (Rescue Assignments)
-- ----------------------------------------------------------------------------
TRUNCATE TABLE team_management;
INSERT INTO team_management (assignment_id, team_id, request_id, status, assignment_at) VALUES
(1, 1, 1, 'on_route', '2026-08-30 14:45:00'),
(2, 3, 2, 'assigned', '2026-08-30 16:30:00'),
(3, 4, 3, 'completed', '2026-08-30 17:15:00');

-- ----------------------------------------------------------------------------
-- 8. Seed Shelters
-- ----------------------------------------------------------------------------
TRUNCATE TABLE shelters;
INSERT INTO shelters (shelter_id, area_id, shelter_name, capacity, occupancy, status) VALUES
(1, 1, 'Sunamganj Government College Shelter', 1200, 980, 'open'),
(2, 1, 'Sadar Upazila Parishad Flood Shelter', 600, 600, 'full'),
(3, 3, 'Bhola Coastal Multipurpose Shelter Centre', 2500, 1850, 'open'),
(4, 3, 'Char Fasson Government High School Shelter', 900, 900, 'full'),
(5, 3, 'Lalmohan Cyclone Shelter Complex', 1500, 420, 'open'),
(6, 5, 'Companiganj Model School Flood Shelter', 800, 760, 'open'),
(7, 5, 'Bishwamvarpur Community Shelter Hall', 500, 150, 'open'),
(8, 6, 'Teknaf Relief Camp Shelter Block A', 700, 690, 'open'),
(9, 6, 'Teknaf Relief Camp Shelter Block B', 700, 0, 'closed'),
(10, 1, 'Jagannathpur Union Flood Centre', 350, 0, 'closed');

-- ----------------------------------------------------------------------------
-- 9. Seed Warehouses
-- ----------------------------------------------------------------------------
TRUNCATE TABLE warehouses;
INSERT INTO warehouses (warehouse_id, warehouse_name, location_id, manager_id) VALUES
(1, 'Sylhet Central Relief Warehouse', 101, 1),
(2, 'Sunamganj District Relief Godown', 102, 4),
(3, 'Bhola Coastal Supply Depot', 201, 5),
(4, 'Kurigram Emergency Storage', 301, 4),
(5, 'Dhaka Central Relief Depot', 103, 1);

-- ----------------------------------------------------------------------------
-- 10. Seed Donations
-- ----------------------------------------------------------------------------
TRUNCATE TABLE donations;
INSERT INTO donations (donation_id, donation_kind, amount, status) VALUES
(1, 'Rice (5kg pack)', 2500.00, 'stored'),
(2, 'Drinking Water (L)', 8000.00, 'distributed'),
(3, 'Tarpaulin Sheet', 1200.00, 'stored'),
(4, 'Medicine Kit', 650.00, 'received'),
(5, 'Dry Food Packet', 4500.00, 'distributed'),
(6, 'Blanket', 900.00, 'received'),
(7, 'Saline & ORS Box', 750.00, 'stored'),
(8, 'Cash Relief Fund (BDT)', 250000.00, 'received'),
(9, 'Baby Food & Milk', 320.00, 'stored'),
(10, 'Emergency Lantern & Torch', 200.00, 'distributed');

SET FOREIGN_KEY_CHECKS = 1;
