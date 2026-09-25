USE shurokkha_db;

CREATE TABLE IF NOT EXISTS distribution_requests (
    distribution_id BIGINT UNSIGNED NOT NULL,
    request_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (distribution_id, request_id),
    FOREIGN KEY (distribution_id) REFERENCES relief_distributions (distribution_id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES emergency_requests (request_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS donation_allocations (
    donation_id BIGINT UNSIGNED NOT NULL,
    distribution_id BIGINT UNSIGNED NOT NULL,
    allocated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (donation_id, distribution_id),
    FOREIGN KEY (donation_id) REFERENCES donations (donation_id) ON DELETE CASCADE,
    FOREIGN KEY (distribution_id) REFERENCES relief_distributions (distribution_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS distribution_resources (
    distribution_id BIGINT UNSIGNED NOT NULL,
    resource_id INT NOT NULL,
    quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (distribution_id, resource_id),
    FOREIGN KEY (distribution_id) REFERENCES relief_distributions (distribution_id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources (resource_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS warehouse_resources (
    warehouse_id INT NOT NULL,
    resource_id INT NOT NULL,
    quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (warehouse_id, resource_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses (warehouse_id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources (resource_id) ON DELETE CASCADE
) ENGINE=InnoDB;
