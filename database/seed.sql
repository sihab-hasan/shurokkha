-- ============================================================================
-- SHUROKKHA - Master Seed Data (DML)
-- Data for the first 4 tables aligned with the ERD
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
INSERT INTO users (user_id, role_id, full_name, email, phone, password, status) VALUES
(1, 1, 'System Administrator', 'admin@shurokkha.gov.bd', '01700000001', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'active'),
(2, 2, 'Rahim Uddin', 'rahim@gmail.com', '01711223344', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'active'),
(3, 2, 'Selina Akter', 'selina@gmail.com', '01933445566', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'active'),
(4, 4, 'Tariqul Islam', 'tariqul.donor@gmail.com', '01811556677', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'active'),
(5, 3, 'Farhan Ahmed', 'farhan.volunteer@gmail.com', '01511223344', '$2y$12$eGj7W2g1rWf1jA6kFqPZseO4t7X1q2m3v5b8z9l0k1j2h3g4f5e6a', 'active');

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
INSERT INTO emergency_requests (request_id, user_id, area_id, category_id, priority, status, request_at) VALUES
(1, 2, 1, 1, 'critical', 'in_progress', '2026-08-30 14:30:00'),
(2, 3, 2, 2, 'critical', 'pending', '2026-08-30 16:15:00'),
(3, 2, 3, 3, 'high', 'rescued', '2026-08-30 17:00:00'),
(4, 3, 4, 1, 'normal', 'closed', '2026-08-29 11:20:00');

-- ----------------------------------------------------------------------------
-- 5. Seed Affected Areas
-- ----------------------------------------------------------------------------
TRUNCATE TABLE affected_areas;
INSERT INTO affected_areas (area_id, disaster_id, location_id, affected_population, severity) VALUES
(1, 1, 101, 25000, 'Critical'),
(2, 1, 102, 18000, 'High'),
(3, 2, 201, 50000, 'Critical'),
(4, 3, 301, 8000, 'Medium');

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

SET FOREIGN_KEY_CHECKS = 1;
