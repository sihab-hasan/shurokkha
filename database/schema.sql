-- ============================================================================
-- SHUROKKHA - Disaster Relief & Resource Coordination Platform
-- Database Schema (DDL) aligned with Project ERD
-- Database: MySQL 8.0+ / MariaDB 10.5+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS shurokkha_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE shurokkha_db;

-- Temporarily disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Drop existing tables (in safe order with FK checks disabled)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS volunteer_assignments;
DROP TABLE IF EXISTS volunteer_profiles;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS missing_person_reports;
DROP TABLE IF EXISTS assistance_requests;
DROP TABLE IF EXISTS emergency_requests;
DROP TABLE IF EXISTS shelters;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS disaster_types;
DROP TABLE IF EXISTS api_tokens;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS relief_distribution;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS team_management;
DROP TABLE IF EXISTS rescue_teams;
DROP TABLE IF EXISTS affected_areas;
DROP TABLE IF EXISTS disasters;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- ----------------------------------------------------------------------------
-- 1. ROLE Table (Assigned: Team Member 1)
-- ERD Attributes: role_id (PK), role_name, description
-- ----------------------------------------------------------------------------
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. USER Table (Assigned: Team Member 1)
-- ERD Attributes: user_id (PK), full_name, email, phone, status
-- Relationships: HAS_ROLE with ROLE (role_id FK)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NULL,
    password VARCHAR(255) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role_id (role_id),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (role_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. DISASTER Table (Assigned: Team Member 1)
-- ERD Attributes: disaster_id (PK), disaster_name, severity, status, start_datetime
-- ----------------------------------------------------------------------------
CREATE TABLE disasters (
    disaster_id INT AUTO_INCREMENT PRIMARY KEY,
    disaster_name VARCHAR(150) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    start_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_disasters_status (status),
    INDEX idx_disasters_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. EMERGENCY_REQUEST Table (Assigned: Team Member 1)
-- ERD Attributes: request_id (PK), category_id, priority, status, request_at
-- Relationships:
--   - SUBMITS: user_id FK (references users.user_id)
--   - OCCURS_IN: area_id FK (references affected_areas.area_id when created by teammates)
-- ----------------------------------------------------------------------------
CREATE TABLE emergency_requests (
    request_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    area_id INT NULL COMMENT 'FK to affected_areas (implemented by teammates)',
    category_id INT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'normal',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    request_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_emergency_requests_user (user_id),
    INDEX idx_emergency_requests_status (status),
    INDEX idx_emergency_requests_priority (priority),
    CONSTRAINT fk_emergency_requests_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- IMPLEMENTED TABLES (5, 6, 7) & RESERVED FOR TEAMMATES (8-12)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5. AFFECTED_AREA Table (Assigned: Teammate)
-- ERD Attributes: area_id (PK), location_id, affected_population, severity
-- Relationships:
--   - AFFECTS: disaster_id FK (references disasters.disaster_id)
-- ----------------------------------------------------------------------------
CREATE TABLE affected_areas (
    area_id INT AUTO_INCREMENT PRIMARY KEY,
    disaster_id INT NOT NULL,
    location_id INT NULL,
    affected_population INT UNSIGNED NOT NULL DEFAULT 0,
    severity VARCHAR(50) NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_affected_areas_disaster (disaster_id),
    INDEX idx_affected_areas_severity (severity),
    CONSTRAINT fk_affected_areas_disaster FOREIGN KEY (disaster_id) REFERENCES disasters (disaster_id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraint to emergency_requests for area_id
ALTER TABLE emergency_requests
ADD CONSTRAINT fk_emergency_requests_area FOREIGN KEY (area_id) REFERENCES affected_areas (area_id) ON UPDATE CASCADE ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 6. RESCUE_TEAM Table (Assigned: Teammate)
-- ERD Attributes: team_id (PK), team_name, team_type, availability
-- ----------------------------------------------------------------------------
CREATE TABLE rescue_teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    team_type VARCHAR(50) NOT NULL,
    availability VARCHAR(50) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rescue_teams_availability (availability)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. TEAM MANAGEMENT Table (Assigned: Teammate)
-- ERD Attributes: assignment_id (PK), status, assignment_at
-- Relationships:
--   - ASSIGNED_TO: team_id FK (references rescue_teams.team_id)
--   - GENERATES: request_id FK (references emergency_requests.request_id)
-- ----------------------------------------------------------------------------
CREATE TABLE team_management (
    assignment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    request_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'assigned',
    assignment_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_team_management_team (team_id),
    INDEX idx_team_management_request (request_id),
    INDEX idx_team_management_status (status),
    CONSTRAINT fk_team_management_team FOREIGN KEY (team_id) REFERENCES rescue_teams (team_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_team_management_request FOREIGN KEY (request_id) REFERENCES emergency_requests (request_id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Remaining ERD Tables (Reserved for teammates)
-- ----------------------------------------------------------------------------
--
-- 8. SHELTER
--    Attributes: shelter_id (PK), area_id (FK), shelter_name, capacity, occupancy, status
--    Relationships: [HAS] with AFFECTED_AREA, [DELIVERED_TO] with RELIEF_DISTRIBUTION
--
-- 9. DONATION
--    Attributes: donation_id (PK), user_id (FK), donation_kind, amount, status
--    Relationships: [MAKES] with USER, [ALLOCATED_TO] with RELIEF_DISTRIBUTION
--
-- 10. RELIEF_DISTRIBUTION
--     Attributes: distribution_id (PK), area_id (FK), warehouse_id (FK), status, delivered_id
--     Relationships: [FULFILLS] with EMERGENCY_REQUEST, [ALLOCATED_TO] with DONATION, [DELIVERED_TO] with SHELTER, [INCLUDES] with RESOURCES
--
-- 11. RESOURCES
--     Attributes: resource_id (PK), resource_name, category_id, unit
--     Relationships: [INCLUDES] with RELIEF_DISTRIBUTION, [STORES] with WAREHOUSE
--
-- 12. WAREHOUSE
--     Attributes: warehouse_id (PK), warehouse_name, location_id, manager_id
--     Relationships: [STORES] with RESOURCES, RELIEF_DISTRIBUTION
-- ============================================================================

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
