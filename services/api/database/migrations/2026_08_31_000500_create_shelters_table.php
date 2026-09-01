<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('shelters')) {
            Schema::create('shelters', function (Blueprint $table): void {
                $table->id('shelter_id');
                $table->unsignedBigInteger('area_id')->nullable();
                $table->string('shelter_name', 150);
                $table->unsignedInteger('capacity')->default(0);
                $table->unsignedInteger('occupancy')->default(0);
                $table->string('status', 50)->default('open');
                $table->timestamps();

                $table->index('area_id');
                $table->index('status');
                $table->foreign('area_id')->references('area_id')->on('affected_areas')->onUpdate('cascade')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('shelters');
    }
};
