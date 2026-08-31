USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 9: WAREHOUSE (ERD: warehouse_id, warehouse_name, location_id, manager_id)
-- Relationships:
--   - manager_id (FK to users.user_id)
--   - location_id (FK placeholder for future locations table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_name VARCHAR(150) NOT NULL,
    location_id INT NULL COMMENT 'FK to future locations table (implemented by teammates)',
    manager_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_warehouses_manager (manager_id),
    CONSTRAINT fk_warehouses_manager FOREIGN KEY (manager_id) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
