USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Table 10: DONATION (ERD: donation_id, donation_kind, amount, status)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
    donation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    donation_kind VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_donations_kind (donation_kind),
    INDEX idx_donations_status (status),
    INDEX idx_donations_user (user_id),
    CONSTRAINT fk_donations_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
