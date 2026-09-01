<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('warehouses')) {
            Schema::create('warehouses', function (Blueprint $table): void {
                $table->id('warehouse_id');
                $table->string('warehouse_name', 150);
                $table->integer('location_id')->nullable();
                $table->unsignedBigInteger('manager_id')->nullable();
                $table->timestamps();

                $table->index('manager_id');
                $table->foreign('manager_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouses');
    }
};
