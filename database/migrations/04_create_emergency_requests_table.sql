USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 4: EMERGENCY_REQUEST (ERD: request_id, category_id, priority, status, request_at)
-- Relationships:
--   - user_id (FK to users.user_id)
--   - area_id (FK placeholder for affected_areas to be added by teammates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_requests (
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
