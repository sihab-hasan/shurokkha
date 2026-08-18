<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missing_person_reports', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('full_name', 160);
            $table->unsignedTinyInteger('age')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('photo_path')->nullable();
            $table->text('physical_description')->nullable();
            $table->text('distinguishing_features')->nullable();
            $table->timestamp('last_seen_at');
            $table->string('last_seen_location', 500);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('contact_phone', 32);
            $table->string('status', 40)->index();
            $table->timestamp('found_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status', 'created_at']);
            $table->index(['full_name', 'last_seen_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missing_person_reports');
    }
};
