<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Documents uploaded by citizens (NID, photos, evidence for appeals).
 * Files are stored under `storage/app/documents/{user_id}/{document_id}.{ext}`.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('documents')) {
            Schema::create('documents', function (Blueprint $table): void {
                $table->id('document_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('document_type', 64)->default('other')->index();
                $table->string('title', 200);
                $table->text('description')->nullable();
                $table->string('file_path', 500);
                $table->string('file_name', 255);
                $table->string('mime_type', 100);
                $table->unsignedBigInteger('size_bytes')->default(0);
                $table->string('status', 32)->default('uploaded')->index();
                $table->timestamps();

                $table->index('user_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
