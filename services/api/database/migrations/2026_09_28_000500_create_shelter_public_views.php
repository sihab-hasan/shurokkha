<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Creates read-only database VIEWs used by the admin dashboard
 * and public-facing reporting endpoints.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('DROP VIEW IF EXISTS view_shelter_public_summary;');
        DB::unprepared(<<<'SQL'
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
        SQL);

        DB::unprepared('DROP VIEW IF EXISTS view_donation_summary;');
        DB::unprepared(<<<'SQL'
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
        SQL);
    }

    public function down(): void
    {
        DB::unprepared('DROP VIEW IF EXISTS view_donation_summary;');
        DB::unprepared('DROP VIEW IF EXISTS view_shelter_public_summary;');
    }
};
