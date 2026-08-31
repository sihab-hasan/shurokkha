<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_requests', function (Blueprint $table): void {
            $table->bigIncrements('request_id');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type', 40)->default('essentials')->index();
            $table->string('priority', 20)->default('normal')->index();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('affected_people_count')->default(1);
            $table->string('contact_phone', 32)->nullable();
            $table->string('address', 500)->nullable();
            $table->string('status', 40)->default('pending')->index();
            $table->timestamp('request_at')->useCurrent();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_requests');
    }
};
