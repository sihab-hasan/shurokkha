<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Citizen feedback with optional 1–5 rating and admin response.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('feedback')) {
            Schema::create('feedback', function (Blueprint $table): void {
                $table->id('feedback_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('subject', 200);
                $table->text('message');
                $table->unsignedTinyInteger('rating')->nullable();
                $table->string('category', 64)->default('general')->index();
                $table->string('status', 32)->default('pending')->index();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
                $table->text('response')->nullable();
                $table->timestamps();

                $table->index(['status', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
