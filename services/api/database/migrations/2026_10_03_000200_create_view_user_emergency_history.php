<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * `view_user_emergency_history` powers the TVUP "view" demo route.
 * Each row summarizes a citizen's emergency footprint: how many
 * requests, how many resolved, their latest activity timestamp.
 *
 * Driver-aware: SQLite uses CREATE VIEW IF NOT EXISTS (no native
 * CREATE OR REPLACE); MySQL uses CREATE OR REPLACE VIEW.
 */
return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        $sql = match ($driver) {
            'mysql' => <<<'SQL'
                CREATE OR REPLACE VIEW view_user_emergency_history AS
                SELECT
                    u.id AS user_id,
                    u.full_name,
                    u.phone,
                    u.role,
                    COUNT(er.request_id) AS total_requests,
                    SUM(CASE WHEN er.status = 'rescued' THEN 1 ELSE 0 END) AS rescued_count,
                    SUM(CASE WHEN er.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
                    SUM(CASE WHEN er.status = 'closed'  THEN 1 ELSE 0 END) AS closed_count,
                    MAX(er.request_at) AS last_request_at
                FROM users u
                LEFT JOIN emergency_requests er ON er.user_id = u.id
                GROUP BY u.id, u.full_name, u.phone, u.role
            SQL,
            'sqlite' => <<<'SQL'
                DROP VIEW IF EXISTS view_user_emergency_history;
                CREATE VIEW view_user_emergency_history AS
                SELECT
                    u.id AS user_id,
                    u.full_name,
                    u.phone,
                    u.role,
                    COUNT(er.request_id) AS total_requests,
                    SUM(CASE WHEN er.status = 'rescued' THEN 1 ELSE 0 END) AS rescued_count,
                    SUM(CASE WHEN er.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
                    SUM(CASE WHEN er.status = 'closed'  THEN 1 ELSE 0 END) AS closed_count,
                    MAX(er.request_at) AS last_request_at
                FROM users u
                LEFT JOIN emergency_requests er ON er.user_id = u.id
                GROUP BY u.id, u.full_name, u.phone, u.role
            SQL,
            default => throw new \RuntimeException("Unsupported driver: {$driver}"),
        };

        DB::statement($sql);
    }

    public function down(): void
    {
        $driver = DB::connection()->getDriverName();
        $sql = match ($driver) {
            'mysql' => 'DROP VIEW IF EXISTS view_user_emergency_history',
            'sqlite' => 'DROP VIEW IF EXISTS view_user_emergency_history',
            default => throw new \RuntimeException("Unsupported driver: {$driver}"),
        };
        DB::statement($sql);
    }
};
