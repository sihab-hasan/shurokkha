USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 7: TEAM_MANAGEMENT (ERD: assignment_id, status, assignment_at)
-- Relationships:
--   - team_id (FK to rescue_teams.team_id)
--   - request_id (FK to emergency_requests.request_id)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_management (
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
