<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table): void {
                $table->id('role_id');
                $table->string('role_name', 50)->unique();
                $table->string('description', 255)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('disasters')) {
            Schema::create('disasters', function (Blueprint $table): void {
                $table->id('disaster_id');
                $table->string('disaster_name', 150);
                $table->string('severity', 50)->index();
                $table->string('status', 50)->default('active')->index();
                $table->dateTime('start_datetime')->useCurrent();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('disasters');
        Schema::dropIfExists('roles');
    }
};
