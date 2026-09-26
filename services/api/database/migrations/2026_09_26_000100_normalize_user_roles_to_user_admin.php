<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Normalize the legacy role values (citizen, donor, volunteer) onto the new
 * two-role model (user, admin). Admin accounts are preserved; every other
 * legacy role becomes `user` so the frontend's `UserRole = "user" | "admin"`
 * union matches the database.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement("UPDATE users SET role = 'user' WHERE role IN ('citizen', 'donor', 'volunteer')");
    }

    public function down(): void
    {
        // No reversible mapping — the original role distinctions are lost
        // once this migration runs. Leave rows as `user` on rollback.
    }
};
