<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rescue_teams', function (Blueprint $table) {
            $table->id('team_id');
            $table->string('team_name', 100);
            $table->string('team_type', 50);
            $table->string('availability', 50)->default('available')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rescue_teams');
    }
};
