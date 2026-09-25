-- ============================================================================
-- SHUROKKHA - Joins and Aggregation Queries
-- Demonstration of Joins (INNER, LEFT, RIGHT, FULL OUTER) and Aggregations (COUNT, SUM, AVG, GROUP BY, HAVING)
-- Focused on Tables: affected_areas, rescue_teams, team_management, and emergency_requests
-- ============================================================================

USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- 1. INNER JOIN
-- Retrieve assignments details by joining team_management, rescue_teams, and emergency_requests.
-- This shows only the active matches where a team is successfully assigned to a request.
-- ----------------------------------------------------------------------------
SELECT 
    tm.assignment_id,
    rt.team_name,
    rt.team_type,
    er.request_id,
    er.priority AS request_priority,
    er.status AS request_status,
    tm.status AS assignment_status,
    tm.assignment_at
FROM team_management tm
INNER JOIN rescue_teams rt ON tm.team_id = rt.team_id
INNER JOIN emergency_requests er ON tm.request_id = er.request_id;


-- ----------------------------------------------------------------------------
-- 2. LEFT JOIN
-- Retrieve all rescue teams and their assignments.
-- This includes teams that have NOT been assigned to any emergency requests yet (will show NULL values).
-- ----------------------------------------------------------------------------
SELECT 
    rt.team_id,
    rt.team_name,
    rt.team_type,
    rt.availability,
    tm.assignment_id,
    tm.status AS assignment_status
FROM rescue_teams rt
LEFT JOIN team_management tm ON rt.team_id = tm.team_id;


-- ----------------------------------------------------------------------------
-- 3. RIGHT JOIN
-- Retrieve all affected areas and any corresponding emergency requests that occurred in them.
-- This includes affected areas that do NOT have any emergency requests yet.
-- ----------------------------------------------------------------------------
SELECT 
    er.request_id,
    er.priority AS request_priority,
    er.status AS request_status,
    aa.area_id,
    aa.severity AS area_severity,
    aa.affected_population
FROM emergency_requests er
RIGHT JOIN affected_areas aa ON er.area_id = aa.area_id;


-- ----------------------------------------------------------------------------
-- 4. FULL OUTER JOIN (Simulated in MySQL using UNION of LEFT and RIGHT JOIN)
-- MySQL does not natively support FULL OUTER JOIN. We simulate it here to show all
-- rescue teams and all assignments, matching them where possible.
-- ----------------------------------------------------------------------------
SELECT 
    rt.team_id,
    rt.team_name,
    tm.assignment_id,
    tm.status AS assignment_status
FROM rescue_teams rt
LEFT JOIN team_management tm ON rt.team_id = tm.team_id

UNION

SELECT 
    rt.team_id,
    rt.team_name,
    tm.assignment_id,
    tm.status AS assignment_status
FROM rescue_teams rt
RIGHT JOIN team_management tm ON rt.team_id = tm.team_id;


-- ----------------------------------------------------------------------------
-- 5. AGGREGATION & GROUP BY (COUNT, SUM, AVG)
-- Grouping affected areas by severity to count the number of areas, sum the total
-- affected population, and find the average population affected per severity group.
-- ----------------------------------------------------------------------------
SELECT 
    severity,
    COUNT(area_id) AS total_affected_areas,
    SUM(affected_population) AS total_population_affected,
    AVG(affected_population) AS average_population_affected
FROM affected_areas
GROUP BY severity;


-- ----------------------------------------------------------------------------
-- 6. AGGREGATION, GROUP BY, and HAVING
-- Retrieve rescue teams and count their total assignments, but only display
-- teams that have at least 1 assignment (filtering using HAVING).
-- ----------------------------------------------------------------------------
SELECT 
    rt.team_id,
    rt.team_name,
    COUNT(tm.assignment_id) AS total_assignments
FROM rescue_teams rt
LEFT JOIN team_management tm ON rt.team_id = tm.team_id
GROUP BY rt.team_id, rt.team_name
HAVING total_assignments >= 1;
