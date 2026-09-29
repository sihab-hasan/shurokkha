<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the `fundraises` table for campaign-style donation goals. Each
 * campaign has a goal amount, a rolling raised amount, and a slug for
 * public URLs.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('fundraises')) {
            Schema::create('fundraises', function (Blueprint $table): void {
                $table->id('fundraise_id');
                $table->string('title', 255);
                $table->string('slug', 200)->unique();
                $table->string('summary', 500)->nullable();
                $table->text('description');
                $table->string('cover_image_path', 500)->nullable();
                $table->decimal('goal_amount', 12, 2)->default(0);
                $table->decimal('raised_amount', 12, 2)->default(0);
                $table->string('currency', 3)->default('BDT');
                $table->string('status', 32)->default('active')->index();
                $table->timestamp('starts_at')->nullable();
                $table->timestamp('ends_at')->nullable()->index();
                $table->foreignId('organizer_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('beneficiary_name', 200)->nullable();
                $table->timestamps();

                $table->index(['status', 'starts_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('fundraises');
    }
};
