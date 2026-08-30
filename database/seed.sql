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
(1, 2, NULL, 1, 'critical', 'in_progress', '2026-08-30 14:30:00'),
(2, 3, NULL, 2, 'critical', 'pending', '2026-08-30 16:15:00'),
(3, 2, NULL, 3, 'high', 'rescued', '2026-08-30 17:00:00'),
(4, 3, NULL, 1, 'normal', 'closed', '2026-08-29 11:20:00');

SET FOREIGN_KEY_CHECKS = 1;
