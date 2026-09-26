USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 6: RESCUE_TEAM (ERD: team_id, team_name, team_type, availability)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rescue_teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    team_type VARCHAR(50) NOT NULL,
    availability VARCHAR(50) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rescue_teams_availability (availability)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
