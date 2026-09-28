<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Creates the MySQL Stored Procedure used by AdminShelterController::updateOccupancy().
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_update_shelter_occupancy;');
        DB::unprepared(<<<'SQL'
            CREATE PROCEDURE sp_update_shelter_occupancy(
                IN  p_shelter_id INT,
                IN  p_occupancy  INT
            )
            BEGIN
                DECLARE v_capacity INT DEFAULT 0;
                DECLARE v_new_status VARCHAR(50) DEFAULT 'open';

                SELECT capacity INTO v_capacity
                FROM shelters
                WHERE shelter_id = p_shelter_id;

                IF v_capacity IS NULL OR v_capacity = 0 THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Shelter not found or has invalid capacity';
                END IF;

                IF p_occupancy < 0 THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Occupancy cannot be negative';
                END IF;

                IF p_occupancy >= v_capacity THEN
                    SET v_new_status = 'full';
                ELSE
                    SET v_new_status = 'open';
                END IF;

                UPDATE shelters
                SET
                    occupancy  = p_occupancy,
                    status     = v_new_status,
                    updated_at = NOW()
                WHERE shelter_id = p_shelter_id;
            END;
        SQL);
    }

    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_update_shelter_occupancy;');
    }
};
