<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * `sp_escalate_disaster_and_requests(disaster_id, new_severity)` —
 * escalates a disaster's severity in one transaction and bumps all
 * related pending emergency_requests to the new priority tier.
 *
 * SQLite does not support stored procedures, so this migration is a
 * no-op on SQLite. Production uses MySQL.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        // Drop first to make this migration idempotent (re-runnable in tests).
        DB::statement('DROP PROCEDURE IF EXISTS sp_escalate_disaster_and_requests');

        DB::statement(<<<'SQL'
            CREATE PROCEDURE sp_escalate_disaster_and_requests(
                IN p_disaster_id INT,
                IN p_new_severity VARCHAR(32)
            )
            BEGIN
                -- Bump the disaster severity itself.
                UPDATE disasters
                SET severity = p_new_severity,
                    updated_at = NOW()
                WHERE disaster_id = p_disaster_id;

                -- Bump any pending/in-progress emergency requests linked to this disaster.
                UPDATE emergency_requests er
                JOIN affected_areas aa ON er.area_id = aa.area_id
                SET er.priority = p_new_severity,
                    er.updated_at = NOW()
                WHERE aa.disaster_id = p_disaster_id
                  AND er.status IN ('pending', 'in_progress');
            END
        SQL);
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('DROP PROCEDURE IF EXISTS sp_escalate_disaster_and_requests');
    }
};
