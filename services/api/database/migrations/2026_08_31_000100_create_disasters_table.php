<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('disasters')) {
            Schema::create('disasters', function (Blueprint $table) {
                $table->id('disaster_id');
                $table->string('disaster_name', 150);
                $table->string('severity', 50);
                $table->string('status', 50)->default('active');
                $table->dateTime('start_datetime')->useCurrent();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('disasters');
    }
};
