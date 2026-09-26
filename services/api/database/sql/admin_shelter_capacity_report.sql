-- ============================================================================
-- SHUROKKHA - Admin Dashboard: Shelter Capacity Report
-- Joins affected_areas with shelters and uses COUNT() and SUM() with GROUP BY
-- to report the total number of shelters and total available capacity
-- (capacity - occupancy) for EACH affected area.
-- Requires migrations 01 to 08.
-- ============================================================================

USE shurokkha_db;

-- ----------------------------------------------------------------------------
-- Per-area shelter summary for the Admin Dashboard
-- LEFT JOIN keeps areas that have ZERO shelters (their totals show as 0).
-- ----------------------------------------------------------------------------
SELECT
    aa.area_id,
    aa.severity AS area_severity,
    aa.affected_population,
    COUNT(s.shelter_id)                        AS total_shelters,
    COALESCE(SUM(s.capacity), 0)               AS total_capacity,
    COALESCE(SUM(s.capacity - s.occupancy), 0) AS total_capacity_available
FROM affected_areas aa
LEFT JOIN shelters s ON s.area_id = aa.area_id
GROUP BY aa.area_id, aa.severity, aa.affected_population
ORDER BY total_capacity_available DESC;

-- ----------------------------------------------------------------------------
-- Subquery demonstration: shelters located in 'Critical' severity areas
-- The inner query (SELECT ... FROM affected_areas) runs FIRST and returns a
-- list of area_ids. The outer query then keeps only the shelters whose
-- area_id appears in that list.
-- ----------------------------------------------------------------------------
SELECT
    shelter_name,
    capacity
FROM shelters
WHERE area_id IN (
    SELECT area_id
    FROM affected_areas
    WHERE severity = 'Critical'
)
ORDER BY capacity DESC;

-- Same result WITHOUT a subquery (JOIN version) - useful to explain that
-- both approaches produce identical output:
-- SELECT s.shelter_name, s.capacity
-- FROM shelters s
-- INNER JOIN affected_areas aa ON s.area_id = aa.area_id
-- WHERE aa.severity = 'Critical';
