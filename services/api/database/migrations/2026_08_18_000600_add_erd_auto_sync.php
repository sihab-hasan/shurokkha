<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            if (!Schema::hasColumn('users', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->index()->after('id');
            }
            if (!Schema::hasColumn('users', 'full_name')) {
                $table->string('full_name', 150)->nullable()->after('name');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 30)->nullable()->default('01700000000')->after('email');
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status', 50)->default('active')->after('password');
            }
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->integer('role_id')->default(2)->after('role');
            }
        });

        // Backfill existing rows: user_id = id, full_name = name
        DB::statement('UPDATE users SET user_id = id, full_name = name WHERE user_id IS NULL OR full_name IS NULL');

        // Drop legacy trigger if it exists (new registrations handled by Laravel model booted())
        if (DB::getDriverName() === 'mysql') {
            DB::unprepared('DROP TRIGGER IF EXISTS trg_sync_user_to_erd');
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::unprepared('DROP TRIGGER IF EXISTS trg_sync_user_to_erd');
        }
    }
};
