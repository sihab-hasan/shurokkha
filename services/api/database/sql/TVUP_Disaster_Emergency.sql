-- ============================================================================
-- SHUROKKHA - Core Database Features Demonstration
-- Author: Mashruba
-- Focus Tables: Users, Roles, Emergency Requests, Disasters
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. VIEW: Comprehensive User Emergency History
-- Purpose: Creates a virtual table that joins Users, Roles, Emergency Requests,
-- and Disasters to provide a complete overview of who requested what and 
-- for which disaster.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_user_emergency_history AS
SELECT 
    u.user_id,
    u.full_name AS citizen_name,
    r.role_name AS citizen_role,
    er.request_id,
    er.type AS emergency_type,
    er.priority,
    er.status AS request_status,
    d.disaster_name,
    d.severity AS disaster_severity
FROM users u
INNER JOIN roles r ON u.role_id = r.role_id
INNER JOIN emergency_requests er ON u.user_id = er.user_id
LEFT JOIN affected_areas aa ON er.area_id = aa.area_id
LEFT JOIN disasters d ON aa.disaster_id = d.disaster_id;


-- ----------------------------------------------------------------------------
-- 2. UNION: Unified Critical Alerts Feed
-- Purpose: Combines critical Emergency Requests and severe Disasters into 
-- a single chronological alert feed for the admin dashboard.
-- ----------------------------------------------------------------------------
SELECT 
    CONCAT('REQ-', request_id) AS alert_id,
    'Citizen Emergency' AS alert_type,
    priority AS alert_severity,
    request_at AS alert_time,
    status AS current_status
FROM emergency_requests
WHERE priority = 'critical'

UNION ALL

SELECT 
    CONCAT('DIS-', disaster_id) AS alert_id,
    'National Disaster' AS alert_type,
    severity AS alert_severity,
    start_datetime AS alert_time,
    status AS current_status
FROM disasters
WHERE severity IN ('severe', 'critical', 'high')

ORDER BY alert_time DESC;


-- ----------------------------------------------------------------------------
-- 3. STORED PROCEDURE: sp_escalate_disaster_and_requests
-- Purpose: When a disaster worsens, this procedure updates the disaster's severity
-- and automatically elevates all pending emergency requests in its area to 'critical'.
-- ----------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE sp_escalate_disaster_and_requests(
    IN p_disaster_id BIGINT,
    IN p_new_severity VARCHAR(50)
)
BEGIN
    -- Update the disaster's severity
    UPDATE disasters 
    SET severity = p_new_severity, updated_at = NOW()
    WHERE disaster_id = p_disaster_id;

    -- Escalate all pending emergency requests linked to this disaster
    UPDATE emergency_requests er
    INNER JOIN affected_areas aa ON er.area_id = aa.area_id
    SET er.priority = 'critical', er.updated_at = NOW()
    WHERE aa.disaster_id = p_disaster_id
      AND er.status = 'pending';
      
END //

DELIMITER ;


-- ----------------------------------------------------------------------------
-- 4. TRANSACTION: Atomic Disaster & Emergency Reporting
-- Purpose: Ensures that if a user reports a completely new disaster and asks 
-- for help at the same time, all records are created safely. If any insert 
-- fails, nothing is saved (Rollback) to prevent orphaned data.
-- ----------------------------------------------------------------------------
START TRANSACTION;

-- Step 1: Create the new Disaster record
INSERT INTO disasters (disaster_name, severity, status, start_datetime, created_at, updated_at)
VALUES ('Sudden Flash Flood Sylhet', 'high', 'active', NOW(), NOW(), NOW());

-- Get the ID of the disaster we just inserted
SET @new_disaster_id = LAST_INSERT_ID();

-- Step 2: Create the Affected Area for this disaster
INSERT INTO affected_areas (disaster_id, location_id, affected_population, severity, created_at, updated_at)
VALUES (@new_disaster_id, NULL, 5000, 'high', NOW(), NOW());

-- Get the ID of the area we just inserted
SET @new_area_id = LAST_INSERT_ID();

-- Step 3: Create the Emergency Request for the user reporting it
-- (Assuming user_id = 1 is the citizen reporting it)
INSERT INTO emergency_requests (user_id, area_id, type, priority, status, request_at, created_at, updated_at)
VALUES (1, @new_area_id, 'rescue', 'high', 'pending', NOW(), NOW(), NOW());

-- If everything above succeeds without errors:
COMMIT;

-- If an error happened anywhere above, we would run:
-- ROLLBACK;
