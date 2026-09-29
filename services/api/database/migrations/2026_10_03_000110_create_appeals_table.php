<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Citizen appeals against decisions on assistance-requests / missing-persons.
 * Polymorphic on `subject_type` + `subject_id` so the same table can hold
 * appeals against different parent entities.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('appeals')) {
            Schema::create('appeals', function (Blueprint $table): void {
                $table->id('appeal_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('subject_type', 100);
                $table->unsignedBigInteger('subject_id');
                $table->text('reason');
                $table->string('status', 32)->default('pending')->index();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
                $table->text('decision_notes')->nullable();
                $table->timestamps();

                $table->index(['subject_type', 'subject_id']);
                $table->index(['status', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('appeals');
    }
};
