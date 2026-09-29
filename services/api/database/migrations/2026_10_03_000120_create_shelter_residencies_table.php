<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tracks who is checked into a shelter. Citizens self-register at
 * `/v1/auth/me/shelter-residency`; admins can register others via the
 * admin CRUD.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('shelter_residencies')) {
            Schema::create('shelter_residencies', function (Blueprint $table): void {
                $table->id('residency_id');
                $table->foreignId('shelter_id')->constrained('shelters', 'shelter_id')->cascadeOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('household_id')->nullable()->constrained('households', 'household_id')->nullOnDelete();
                $table->string('full_name', 160);
                $table->string('phone', 32)->nullable();
                $table->unsignedSmallInteger('age')->nullable();
                $table->string('gender', 32)->nullable();
                $table->text('notes')->nullable();
                $table->string('status', 32)->default('checked_in')->index();
                $table->timestamp('checked_in_at')->useCurrent();
                $table->timestamp('checked_out_at')->nullable();
                $table->timestamps();

                $table->index(['shelter_id', 'status']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('shelter_residencies');
    }
};
