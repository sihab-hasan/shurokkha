<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Citizen help-requests distinct from the existing `emergency_requests`.
 * Help-requests are longer-form, document the affected people count,
 * and admins can assign a rescue team to fulfill them.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('help_requests')) {
            Schema::create('help_requests', function (Blueprint $table): void {
                $table->id('help_request_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('disaster_id')->nullable()->constrained('disasters', 'disaster_id')->nullOnDelete();
                $table->string('request_type', 64)->default('general')->index();
                $table->string('priority', 32)->default('normal')->index();
                $table->text('description');
                $table->unsignedSmallInteger('affected_people_count')->default(1);
                $table->string('address', 500);
                $table->decimal('latitude', 10, 7)->nullable();
                $table->decimal('longitude', 10, 7)->nullable();
                $table->string('contact_phone', 32);
                $table->string('status', 32)->default('pending')->index();
                $table->foreignId('assigned_team_id')->nullable()->constrained('rescue_teams', 'team_id')->nullOnDelete();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
                $table->text('resolution_notes')->nullable();
                $table->timestamps();

                $table->index(['status', 'priority']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('help_requests');
    }
};
