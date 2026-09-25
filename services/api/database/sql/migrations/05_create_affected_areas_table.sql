USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 5: AFFECTED_AREA (ERD: area_id, location_id, affected_population, severity)
-- Relationships:
--   - disaster_id (FK to disasters.disaster_id)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS affected_areas (
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
