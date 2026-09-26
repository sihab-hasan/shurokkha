-- ============================================================================
-- SHUROKKHA - Relief Operations Seed Data (DML)
-- Realistic Bangladesh flood scenario data for the disaster-relief tables:
--   - extra affected_areas (areas 5-8; keeps seed.sql areas 1-4 untouched)
--   - shelters, warehouses, donations
-- Requires migrations 01 to 10 and the base seed.sql (roles/users/disasters).
--
-- Demo design notes:
--   * Shelters are placed in Critical areas (1, 3, 5) so the admin subquery
--     (shelters WHERE area_id IN (... severity = 'Critical')) returns rows.
--   * Areas 2, 4, 7 and 8 intentionally have ZERO shelters so the
--     LEFT JOIN capacity report shows 0 totals via COALESCE.
-- ============================================================================

USE shurokkha_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Extend Affected Areas (adds areas 5-8 for the Sylhet flood and others)
-- ----------------------------------------------------------------------------
DELETE FROM affected_areas WHERE area_id BETWEEN 5 AND 8;
INSERT INTO affected_areas (area_id, disaster_id, location_id, affected_population, severity) VALUES
(5, 1, 103, 32000, 'Critical'),
(6, 2, 202, 41000, 'High'),
(7, 4, 401, 6500, 'Medium'),
(8, 1, 104, 12000, 'High');

-- ----------------------------------------------------------------------------
-- 2. Seed Shelters (flood/cyclone shelters mapped to affected areas)
-- ----------------------------------------------------------------------------
TRUNCATE TABLE shelters;
INSERT INTO shelters (shelter_id, area_id, shelter_name, capacity, occupancy, status) VALUES
(1, 1, 'Sunamganj Government College Shelter', 1200, 980, 'open'),
(2, 1, 'Sadar Upazila Parishad Flood Shelter', 600, 600, 'full'),
(3, 3, 'Bhola Coastal Multipurpose Shelter Centre', 2500, 1850, 'open'),
(4, 3, 'Char Fasson Government High School Shelter', 900, 900, 'full'),
(5, 3, 'Lalmohan Cyclone Shelter Complex', 1500, 420, 'open'),
(6, 5, 'Companiganj Model School Flood Shelter', 800, 760, 'open'),
(7, 5, 'Bishwamvarpur Community Shelter Hall', 500, 150, 'open'),
(8, 6, 'Teknaf Relief Camp Shelter Block A', 700, 690, 'open'),
(9, 6, 'Teknaf Relief Camp Shelter Block B', 700, 0, 'closed'),
(10, 1, 'Jagannathpur Union Flood Centre', 350, 0, 'closed');

-- ----------------------------------------------------------------------------
-- 3. Seed Warehouses (relief goods storage hubs)
-- ----------------------------------------------------------------------------
TRUNCATE TABLE warehouses;
INSERT INTO warehouses (warehouse_id, warehouse_name, location_id, manager_id) VALUES
(1, 'Sylhet Central Relief Warehouse', 101, 1),
(2, 'Sunamganj District Relief Godown', 102, 4),
(3, 'Bhola Coastal Supply Depot', 201, 5),
(4, 'Kurigram Emergency Storage', 301, 4),
(5, 'Dhaka Central Relief Depot', 103, 1);

-- ----------------------------------------------------------------------------
-- 4. Seed Donations (relief goods and cash received for the flood response)
-- ----------------------------------------------------------------------------
TRUNCATE TABLE donations;
INSERT INTO donations (donation_id, user_id, donation_kind, amount, status) VALUES
(1, 4, 'Rice (5kg pack)', 2500.00, 'stored'),
(2, 4, 'Drinking Water (L)', 8000.00, 'distributed'),
(3, 4, 'Tarpaulin Sheet', 1200.00, 'stored'),
(4, 4, 'Medicine Kit', 650.00, 'received'),
(5, 4, 'Dry Food Packet', 4500.00, 'distributed'),
(6, 4, 'Blanket', 900.00, 'received'),
(7, 4, 'Saline & ORS Box', 750.00, 'stored'),
(8, 4, 'Cash Relief Fund (BDT)', 250000.00, 'received'),
(9, 4, 'Baby Food & Milk', 320.00, 'stored'),
(10, 4, 'Emergency Lantern & Torch', 200.00, 'distributed');

TRUNCATE TABLE resources;
INSERT INTO resources (resource_id, resource_name, category_id, unit) VALUES
(1, 'Rice', 1, 'kg'),
(2, 'Drinking Water', 1, 'litre'),
(3, 'Medicine Kit', 2, 'kit'),
(4, 'Blanket', 3, 'piece');

TRUNCATE TABLE warehouse_resources;
INSERT INTO warehouse_resources (warehouse_id, resource_id, quantity) VALUES
(1, 1, 5000), (1, 2, 12000), (1, 3, 400),
(2, 1, 3000), (2, 4, 900), (3, 2, 7000);

TRUNCATE TABLE relief_distributions;
INSERT INTO relief_distributions
    (distribution_id, area_id, warehouse_id, shelter_id, status, delivered_at)
VALUES
(1, 1, 1, 1, 'delivered', '2026-08-30 18:00:00'),
(2, 3, 3, 3, 'in_transit', NULL),
(3, 5, 2, 6, 'planned', NULL);

TRUNCATE TABLE distribution_requests;
INSERT INTO distribution_requests (distribution_id, request_id) VALUES
(1, 1), (2, 2), (3, 3);

TRUNCATE TABLE donation_allocations;
INSERT INTO donation_allocations (donation_id, distribution_id, allocated_amount) VALUES
(1, 1, 1000), (2, 1, 3000), (4, 2, 250), (5, 3, 1500);

TRUNCATE TABLE distribution_resources;
INSERT INTO distribution_resources (distribution_id, resource_id, quantity) VALUES
(1, 1, 1000), (1, 2, 3000), (2, 3, 250), (3, 1, 1500);

SET FOREIGN_KEY_CHECKS = 1;
