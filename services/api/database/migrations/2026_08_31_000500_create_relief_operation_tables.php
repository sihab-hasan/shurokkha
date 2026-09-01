<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shelters', function (Blueprint $table): void {
            $table->id('shelter_id');
            $table->foreignId('area_id')->nullable()->constrained('affected_areas', 'area_id')->nullOnDelete();
            $table->string('shelter_name', 150);
            $table->unsignedInteger('capacity')->default(0);
            $table->unsignedInteger('occupancy')->default(0);
            $table->string('status', 50)->default('open')->index();
            $table->timestamps();
        });

        Schema::create('warehouses', function (Blueprint $table): void {
            $table->id('warehouse_id');
            $table->string('warehouse_name', 150);
            $table->unsignedBigInteger('location_id')->nullable();
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('donations', function (Blueprint $table): void {
            $table->id('donation_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('donation_kind', 50)->index();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('status', 50)->default('received')->index();
            $table->timestamps();
        });

        Schema::create('resources', function (Blueprint $table): void {
            $table->id('resource_id');
            $table->string('resource_name', 150);
            $table->unsignedBigInteger('category_id')->nullable()->index();
            $table->string('unit', 30);
            $table->timestamps();
        });

        Schema::create('relief_distributions', function (Blueprint $table): void {
            $table->id('distribution_id');
            $table->foreignId('area_id')->constrained('affected_areas', 'area_id')->cascadeOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses', 'warehouse_id')->nullOnDelete();
            $table->foreignId('shelter_id')->nullable()->constrained('shelters', 'shelter_id')->nullOnDelete();
            $table->string('status', 50)->default('planned')->index();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });

        Schema::create('distribution_requests', function (Blueprint $table): void {
            $table->foreignId('distribution_id')->constrained('relief_distributions', 'distribution_id')->cascadeOnDelete();
            $table->foreignId('request_id')->constrained('emergency_requests', 'request_id')->cascadeOnDelete();
            $table->primary(['distribution_id', 'request_id']);
        });

        Schema::create('donation_allocations', function (Blueprint $table): void {
            $table->foreignId('donation_id')->constrained('donations', 'donation_id')->cascadeOnDelete();
            $table->foreignId('distribution_id')->constrained('relief_distributions', 'distribution_id')->cascadeOnDelete();
            $table->decimal('allocated_amount', 12, 2)->default(0);
            $table->primary(['donation_id', 'distribution_id']);
        });

        Schema::create('distribution_resources', function (Blueprint $table): void {
            $table->foreignId('distribution_id')->constrained('relief_distributions', 'distribution_id')->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained('resources', 'resource_id')->cascadeOnDelete();
            $table->decimal('quantity', 12, 2)->default(0);
            $table->primary(['distribution_id', 'resource_id']);
        });

        Schema::create('warehouse_resources', function (Blueprint $table): void {
            $table->foreignId('warehouse_id')->constrained('warehouses', 'warehouse_id')->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained('resources', 'resource_id')->cascadeOnDelete();
            $table->decimal('quantity', 12, 2)->default(0);
            $table->primary(['warehouse_id', 'resource_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_resources');
        Schema::dropIfExists('distribution_resources');
        Schema::dropIfExists('donation_allocations');
        Schema::dropIfExists('distribution_requests');
        Schema::dropIfExists('relief_distributions');
        Schema::dropIfExists('resources');
        Schema::dropIfExists('donations');
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('shelters');
    }
};
