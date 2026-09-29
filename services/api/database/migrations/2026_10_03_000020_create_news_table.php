<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the `news` table for editorial content surfaced on the public
 * site. Slugs are unique and used as the public identifier.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('news')) {
            Schema::create('news', function (Blueprint $table): void {
                $table->id('news_id');
                $table->string('title', 255);
                $table->string('slug', 200)->unique();
                $table->string('excerpt', 500)->nullable();
                $table->text('body');
                $table->string('cover_image_path', 500)->nullable();
                $table->string('category', 64)->default('general')->index();
                $table->string('status', 32)->default('draft')->index();
                $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('published_at')->nullable()->index();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
