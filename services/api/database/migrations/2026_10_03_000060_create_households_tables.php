<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates `households` and `household_members`. A household is a
 * record of a family unit; members are individually tracked for
 * targeted relief distribution.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('households')) {
            Schema::create('households', function (Blueprint $table): void {
                $table->id('household_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('head_full_name', 160);
                $table->string('phone', 32);
                $table->string('address', 500);
                $table->decimal('latitude', 10, 7)->nullable();
                $table->decimal('longitude', 10, 7)->nullable();
                $table->unsignedSmallInteger('member_count')->default(1);
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->index('user_id');
            });
        }

        if (! Schema::hasTable('household_members')) {
            Schema::create('household_members', function (Blueprint $table): void {
                $table->id('member_id');
                $table->foreignId('household_id')->constrained('households', 'household_id')->cascadeOnDelete();
                $table->string('full_name', 160);
                $table->string('relationship', 64)->nullable();
                $table->unsignedSmallInteger('age')->nullable();
                $table->string('gender', 32)->nullable();
                $table->string('phone', 32)->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->index('household_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('household_members');
        Schema::dropIfExists('households');
    }
};
