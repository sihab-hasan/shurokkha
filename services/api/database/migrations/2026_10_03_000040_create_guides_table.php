<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the `guides` table for knowledge-base articles (preparedness,
 * during, after, legal). Slugs are unique and used as public identifiers.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('guides')) {
            Schema::create('guides', function (Blueprint $table): void {
                $table->id('guide_id');
                $table->string('title', 255);
                $table->string('slug', 200)->unique();
                $table->string('summary', 500)->nullable();
                $table->text('body');
                $table->string('category', 64)->default('preparedness')->index();
                $table->string('cover_image_path', 500)->nullable();
                $table->string('status', 32)->default('draft')->index();
                $table->unsignedSmallInteger('reading_time_minutes')->default(5);
                $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('published_at')->nullable()->index();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('guides');
    }
};
