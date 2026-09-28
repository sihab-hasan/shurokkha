-- ============================================================================
-- SHUROKKHA - Triggers, Stored Procedures (with Transactions), and Views
-- Database Lab Project Demonstration
-- Focused on Tables: affected_areas, rescue_teams, team_management, and emergency_requests
-- Database: shurokkha_db
-- ============================================================================

USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- 1. TRIGGERS
-- ----------------------------------------------------------------------------
-- Scenario: When a rescue team is assigned to an emergency request, their
-- availability should automatically update to 'busy'. When the assignment is
-- marked as 'completed', the availability should automatically reset to 'available'.
-- ----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_after_team_assigned;
DROP TRIGGER IF EXISTS trg_after_assignment_completed;

DELIMITER //

-- Trigger 1: AFTER INSERT ON team_management
-- Sets the team's availability to 'busy' once an assignment record is inserted
CREATE TRIGGER trg_after_team_assigned
AFTER INSERT ON team_management
FOR EACH ROW
BEGIN
    UPDATE rescue_teams
    SET availability = 'busy',
        updated_at = NOW()
    WHERE team_id = NEW.team_id;
END //

-- Trigger 2: AFTER UPDATE ON team_management
-- Sets the team's availability back to 'available' when status is changed to 'completed'
CREATE TRIGGER trg_after_assignment_completed
AFTER UPDATE ON team_management
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE rescue_teams
        SET availability = 'available',
            updated_at = NOW()
        WHERE team_id = NEW.team_id;
    END IF;
END //

DELIMITER ;


-- ----------------------------------------------------------------------------
-- 2. STORED PROCEDURE WITH TRANSACTION
-- ----------------------------------------------------------------------------
-- Scenario: Assigning a rescue team atomically.
-- - Starts a transaction.
-- - Checks if the team is available.
-- - If available, inserts the assignment and updates the team status, then COMMIT.
-- - If NOT available, it cancels the operation with ROLLBACK.
-- ----------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS sp_assign_rescue_team;

DELIMITER //

CREATE PROCEDURE sp_assign_rescue_team(
    IN p_team_id INT,
    IN p_request_id INT
)
BEGIN
    DECLARE v_team_avail VARCHAR(50);
    DECLARE v_team_name VARCHAR(100);
    DECLARE v_has_error BOOLEAN DEFAULT FALSE;

    -- Error handler to rollback on SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET v_has_error = TRUE;
    END;

    -- 1. Start Transaction
    START TRANSACTION;

    -- 2. Lock and check team availability
    SELECT availability, team_name 
    INTO v_team_avail, v_team_name
    FROM rescue_teams 
    WHERE team_id = p_team_id 
    FOR UPDATE;

    -- 3. Validation Logic
    IF v_team_avail IS NULL THEN
        ROLLBACK;
        SELECT CONCAT('FAILED: Team ID ', p_team_id, ' does not exist.') AS message, 'ERROR' AS status;
    ELSEIF v_team_avail = 'available' THEN
        -- Insert new assignment record
        INSERT INTO team_management (
            team_id, 
            request_id, 
            status, 
            assignment_at, 
            created_at, 
            updated_at
        ) VALUES (
            p_team_id, 
            p_request_id, 
            'assigned', 
            NOW(), 
            NOW(), 
            NOW()
        );

        -- Update team status directly
        UPDATE rescue_teams 
        SET availability = 'busy', 
            updated_at = NOW() 
        WHERE team_id = p_team_id;

        -- Check if any SQL error occurred during execution
        IF v_has_error THEN
            ROLLBACK;
            SELECT 'FAILED: Internal SQL error occurred during assignment.' AS message, 'ERROR' AS status;
        ELSE
            COMMIT;
            SELECT CONCAT('SUCCESS: Team "', v_team_name, '" (ID: ', p_team_id, ') assigned to Request #', p_request_id, '.') AS message, 'SUCCESS' AS status;
        END IF;
    ELSE
        -- Rollback if team is already busy or unavailable
        ROLLBACK;
        SELECT CONCAT('FAILED: Team "', v_team_name, '" is currently ', UPPER(v_team_avail), ' and cannot be assigned.') AS message, 'REJECTED' AS status;
    END IF;
END //

DELIMITER ;


-- ----------------------------------------------------------------------------
-- 3. VIEW (Virtual Table for Response Operations)
-- ----------------------------------------------------------------------------
-- Scenario: Combines rescue teams, assignments, emergency requests, and
-- affected areas into a single clean view for reporting and analytics.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE VIEW vw_active_rescue_missions AS
SELECT 
    tm.assignment_id,
    rt.team_id,
    rt.team_name,
    rt.team_type,
    rt.availability AS current_team_availability,
    tm.status AS mission_status,
    tm.assignment_at,
    er.request_id,
    er.priority AS request_priority,
    er.status AS emergency_request_status,
    aa.area_id,
    aa.severity AS area_severity,
    aa.affected_population
FROM team_management tm
INNER JOIN rescue_teams rt ON tm.team_id = rt.team_id
INNER JOIN emergency_requests er ON tm.request_id = er.request_id
LEFT JOIN affected_areas aa ON er.area_id = aa.area_id;


-- ============================================================================
-- 4. VERIFICATION / TESTING QUERIES
-- Run these queries in DBeaver or MySQL Workbench to test the implementation.
-- ============================================================================

-- Test 1: Check the View
-- SELECT * FROM vw_active_rescue_missions;

-- Test 2: Call the Stored Procedure (with Transaction)
-- CALL sp_assign_rescue_team(1, 101);

-- Test 3: Verify the Triggers
-- Step A: Insert an assignment and check if rescue_teams.availability changes to 'busy'
-- INSERT INTO team_management (team_id, request_id, status, assignment_at, created_at, updated_at) 
-- VALUES (2, 102, 'assigned', NOW(), NOW(), NOW());
-- SELECT team_id, team_name, availability FROM rescue_teams WHERE team_id = 2;

-- Step B: Update assignment to 'completed' and check if availability resets to 'available'
-- UPDATE team_management SET status = 'completed', updated_at = NOW() WHERE team_id = 2;
-- SELECT team_id, team_name, availability FROM rescue_teams WHERE team_id = 2;
