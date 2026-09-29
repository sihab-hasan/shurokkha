<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Citizen complaints. Reviewed by admins; status transitions through
 * pending → under_review → resolved/rejected.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('complaints')) {
            Schema::create('complaints', function (Blueprint $table): void {
                $table->id('complaint_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('subject', 200);
                $table->text('description');
                $table->string('category', 64)->default('general')->index();
                $table->string('status', 32)->default('pending')->index();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
                $table->text('resolution_notes')->nullable();
                $table->timestamps();

                $table->index(['status', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
