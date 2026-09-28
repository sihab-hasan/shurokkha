USE shurokkha_db;

-- ============================================================================
-- Migration 15: Create Stored Procedures
-- Purpose: Encapsulate shelter occupancy business logic within the database
-- layer, automating boundary validation and status transitions.
-- ============================================================================

DROP PROCEDURE IF EXISTS sp_update_shelter_occupancy;

DELIMITER //

CREATE PROCEDURE sp_update_shelter_occupancy(
    IN  p_shelter_id INT,
    IN  p_occupancy  INT
)
BEGIN
    DECLARE v_capacity INT DEFAULT 0;
    DECLARE v_new_status VARCHAR(50) DEFAULT 'open';

    -- 1. Fetch shelter capacity
    SELECT capacity INTO v_capacity
    FROM shelters
    WHERE shelter_id = p_shelter_id;

    -- 2. Validate existence
    IF v_capacity IS NULL OR v_capacity = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Shelter not found or has invalid capacity';
    END IF;

    -- 3. Prevent negative occupancy
    IF p_occupancy < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Occupancy cannot be negative';
    END IF;

    -- 4. Determine shelter status
    IF p_occupancy >= v_capacity THEN
        SET v_new_status = 'full';
    ELSE
        SET v_new_status = 'open';
    END IF;

    -- 5. Atomically update occupancy and status
    UPDATE shelters
    SET
        occupancy  = p_occupancy,
        status     = v_new_status,
        updated_at = NOW()
    WHERE shelter_id = p_shelter_id;
END //

DELIMITER ;
