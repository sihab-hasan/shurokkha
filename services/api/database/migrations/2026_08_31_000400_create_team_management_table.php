<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_management', function (Blueprint $table) {
            $table->id('assignment_id');
            $table->foreignId('team_id');
            $table->foreignId('request_id');
            $table->string('status', 50)->default('assigned');
            $table->dateTime('assignment_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_management');
    }
};
