USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 8: SHELTER (ERD: shelter_id, shelter_name, capacity, occupancy, status)
-- Relationships:
--   - area_id (FK to affected_areas.area_id)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shelters (
    shelter_id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NULL COMMENT 'FK to affected_areas (declared by admin)',
    shelter_name VARCHAR(150) NOT NULL,
    capacity INT UNSIGNED NOT NULL DEFAULT 0,
    occupancy INT UNSIGNED NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_shelters_area (area_id),
    INDEX idx_shelters_status (status),
    CONSTRAINT fk_shelters_area FOREIGN KEY (area_id) REFERENCES affected_areas (area_id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
