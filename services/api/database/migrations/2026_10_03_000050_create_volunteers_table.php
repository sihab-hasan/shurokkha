<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the `volunteers` table for volunteer applications. A user_id
 * links the application to the auth record; full_name/phone/email are
 * denormalized for fast admin review and to preserve data when a user
 * is later deleted.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('volunteers')) {
            Schema::create('volunteers', function (Blueprint $table): void {
                $table->id('volunteer_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('full_name', 160);
                $table->string('phone', 32);
                $table->string('email', 200)->nullable();
                $table->string('address', 500)->nullable();
                $table->text('skills')->nullable();
                $table->string('availability', 100)->nullable();
                $table->text('motivation')->nullable();
                $table->string('status', 32)->default('pending')->index();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
                $table->text('review_notes')->nullable();
                $table->timestamps();

                $table->index(['status', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteers');
    }
};
