USE shurokkha_db;

-- ============================================================================
-- Migration 14: Create Database Views
-- Purpose: Create secure, read-only views for the admin dashboard that expose
-- only non-sensitive aggregated metrics and protect private citizen/donor records.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- View 1: view_shelter_public_summary
-- Purpose: Exposes non-sensitive shelter capacity statistics to public-facing
-- reporting consumers and front-end overview cards without leaking management details.
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS view_shelter_public_summary;

CREATE VIEW view_shelter_public_summary AS
SELECT
    s.shelter_id,
    s.shelter_name,
    s.capacity,
    s.occupancy,
    (s.capacity - s.occupancy) AS available_capacity,
    ROUND((s.occupancy / NULLIF(s.capacity, 0)) * 100, 2) AS occupancy_percentage,
    s.status AS shelter_status,
    aa.area_id,
    aa.severity AS area_severity,
    s.created_at
FROM shelters s
LEFT JOIN affected_areas aa ON s.area_id = aa.area_id;

-- ----------------------------------------------------------------------------
-- View 2: view_donation_summary
-- Purpose: Exposes aggregated donation figures stripped of private donor identities.
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS view_donation_summary;

CREATE VIEW view_donation_summary AS
SELECT
    d.donation_id,
    d.donation_kind,
    d.amount,
    d.currency,
    d.campaign_title,
    d.status AS donation_status,
    d.receipt_number,
    d.created_at
FROM donations d;
