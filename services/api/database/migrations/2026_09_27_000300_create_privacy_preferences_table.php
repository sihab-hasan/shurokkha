<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('privacy_preferences', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('location_sharing', 16)->default('while_using');
            $table->string('profile_visibility', 16)->default('helpers');
            $table->boolean('anonymous_donations')->default(false);
            $table->timestamp('data_export_requested_at')->nullable();
            $table->timestamp('account_deletion_requested_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('privacy_preferences');
    }
};
