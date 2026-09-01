<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('emergency_requests', function (Blueprint $table): void {
            $table->foreignId('area_id')->nullable()->after('user_id')
                ->constrained('affected_areas', 'area_id')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('emergency_requests', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('area_id');
        });
    }
};
