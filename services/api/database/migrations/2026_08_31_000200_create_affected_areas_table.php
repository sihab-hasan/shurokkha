<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affected_areas', function (Blueprint $table) {
            $table->id('area_id');
            $table->foreignId('disaster_id')->constrained('disasters', 'disaster_id')->cascadeOnDelete();
            $table->integer('location_id')->nullable();
            $table->integer('affected_population')->default(0);
            $table->string('severity', 50)->default('Medium')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affected_areas');
    }
};
