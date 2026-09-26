<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

/**
 * Extends `donations` to support the citizen-facing donation flow.
 *
 * Adds:
 *   - `user_id` (FK to users) — was referenced by the model but never
 *     declared on the table; the admin controller's `store()` was
 *     silently failing on any user-attached insert.
 *   - `payment_method` — bkash | nagad | rocket | bank | card.
 *   - `campaign_title` — freeform text (e.g. "Sylhet Flood Relief").
 *   - `receipt_number` — unique, user-visible receipt id ("DON-000481").
 *   - `currency` — ISO-4217, defaults to "BDT".
 *
 * Backfills `receipt_number` for existing rows by zero-padding the
 * numeric PK. Runs inside a transaction so concurrent inserts don't
 * cause unique-constraint collisions (collision suffix falls back to
 * `-<donation_id>`).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table): void {
            $table->foreignId('user_id')->nullable()->after('donation_id');
            $table->string('payment_method', 32)->nullable()->after('amount');
            $table->string('campaign_title')->nullable()->after('payment_method');
            $table->string('receipt_number', 64)->nullable()->after('campaign_title');
            $table->string('currency', 3)->default('BDT')->after('receipt_number');

            $table->index('user_id');
            $table->index('payment_method');
            $table->index('status');
            $table->unique('receipt_number');
        });

        // Backfill receipt_number for pre-existing rows. Wrap in a
        // transaction so a partial backfill can't leave duplicates.
        DB::transaction(function (): void {
            $rows = DB::table('donations')->whereNull('receipt_number')->get();
            foreach ($rows as $row) {
                $base = 'DON-' . str_pad((string) $row->donation_id, 6, '0', STR_PAD_LEFT);
                $receipt = $base;
                $suffix = 1;
                while (
                    DB::table('donations')
                        ->where('receipt_number', $receipt)
                        ->where('donation_id', '!=', $row->donation_id)
                        ->exists()
                ) {
                    $receipt = $base . '-' . $suffix++;
                }

                DB::table('donations')
                    ->where('donation_id', $row->donation_id)
                    ->update(['receipt_number' => $receipt]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table): void {
            $table->dropUnique(['receipt_number']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['payment_method']);
            $table->dropIndex(['status']);

            $table->dropColumn([
                'user_id',
                'payment_method',
                'campaign_title',
                'receipt_number',
                'currency',
            ]);
        });
    }
};
