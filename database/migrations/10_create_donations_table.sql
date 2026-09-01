USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 10: DONATION (ERD: donation_id, donation_kind, amount, status)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
    donation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    donation_kind VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_donations_kind (donation_kind),
    INDEX idx_donations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
