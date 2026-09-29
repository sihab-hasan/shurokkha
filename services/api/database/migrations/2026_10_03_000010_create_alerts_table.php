<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the `alerts` table for time-bound emergency notifications tied
 * to an optional disaster. The web public surface and the admin surface
 * both read this table; only admins write to it.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('alerts')) {
            Schema::create('alerts', function (Blueprint $table): void {
                $table->id('alert_id');
                $table->foreignId('disaster_id')->nullable()->constrained('disasters', 'disaster_id')->nullOnDelete();
                $table->string('title', 200);
                $table->text('message');
                $table->string('severity', 32)->default('info')->index();
                $table->string('status', 32)->default('active')->index();
                $table->string('area_description', 500)->nullable();
                $table->decimal('latitude', 10, 7)->nullable();
                $table->decimal('longitude', 10, 7)->nullable();
                $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('issued_at')->useCurrent();
                $table->timestamp('expires_at')->nullable()->index();
                $table->timestamps();

                $table->index(['status', 'issued_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
