USE shurokkha_db;

CREATE TABLE IF NOT EXISTS relief_distributions (
    distribution_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    warehouse_id INT NULL,
    shelter_id INT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'planned',
    delivered_at DATETIME NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_distributions_area FOREIGN KEY (area_id) REFERENCES affected_areas (area_id) ON DELETE CASCADE,
    CONSTRAINT fk_distributions_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses (warehouse_id) ON DELETE SET NULL,
    CONSTRAINT fk_distributions_shelter FOREIGN KEY (shelter_id) REFERENCES shelters (shelter_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
