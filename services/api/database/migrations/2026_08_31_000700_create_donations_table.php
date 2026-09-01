<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('donations')) {
            Schema::create('donations', function (Blueprint $table): void {
                $table->bigIncrements('donation_id');
                $table->string('donation_kind', 50);
                $table->decimal('amount', 12, 2)->default(0.00);
                $table->string('status', 50)->default('received');
                $table->timestamps();

                $table->index('donation_kind');
                $table->index('status');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
