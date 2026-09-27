<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Idempotent safety-net for `donations` columns.
 *
 * The earlier `2026_09_26_000200_extend_donations_table` migration
 * declares `payment_method`, `campaign_title`, `receipt_number`, and
 * `currency`. In some environments that migration is recorded as
 * "Ran" in `migrations` but the columns never landed (typically a
 * restored DB snapshot that lost the table-level schema while keeping
 * the row in `migrations`). The live error surfaced as:
 *
 *   SQLSTATE[42S22]: Column not found: 1054 Unknown column
 *   'payment_method' in 'field list'
 *
 * This migration runs every column add / index add / unique add as
 * a guarded `hasColumn()` / `hasIndex()` check, so it's safe to run
 * multiple times. It also replays the receipt_number backfill so
 * legacy rows gain a receipt.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('donations')) {
            // The original create migration was never run on this DB.
            // Bootstrap the table minimally so we don't crash.
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

        Schema::table('donations', function (Blueprint $table): void {
            if (!Schema::hasColumn('donations', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('donation_id');
            }
            if (!Schema::hasColumn('donations', 'payment_method')) {
                $table->string('payment_method', 32)->nullable()->after('amount');
            }
            if (!Schema::hasColumn('donations', 'campaign_title')) {
                $table->string('campaign_title')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('donations', 'receipt_number')) {
                $table->string('receipt_number', 64)->nullable()->after('campaign_title');
            }
            if (!Schema::hasColumn('donations', 'currency')) {
                $table->string('currency', 3)->default('BDT')->after('receipt_number');
            }
        });

        // Indexes (cheap to guard against double-add). Laravel 10+
        // exposes Schema::hasIndex().
        $this->addIndexIfMissing('donations', 'donations_user_id_index', 'user_id');
        $this->addIndexIfMissing('donations', 'donations_payment_method_index', 'payment_method');

        if (!$this->indexExists('donations', ['receipt_number'], unique: true)) {
            Schema::table('donations', function (Blueprint $table): void {
                $table->unique('receipt_number');
            });
        }

        // Backfill receipt_number for any rows still missing one. Same
        // collision-resolution strategy as the original extend migration.
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
        // We deliberately don't drop the columns on rollback — they're
        // required for the citizen flow and the original migration
        // owns their lifecycle.
    }

    /**
     * Add a single-column index by name only if it doesn't already exist.
     */
    private function addIndexIfMissing(string $table, string $indexName, string $column): void
    {
        if (Schema::hasIndex($table, $indexName)) {
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($column): void {
            $blueprint->index($column);
        });
    }

    /**
     * Detect whether an index covering the given columns (in order)
     * already exists on the table. Laravel doesn't expose this directly,
     * so we read the connection's index metadata.
     */
    private function indexExists(string $table, array $columns, bool $unique = false): bool
    {
        $database = DB::connection()->getDatabaseName();

        $rows = DB::select(
            'SHOW INDEX FROM ' . $table . ' FROM `' . $database . '`'
        );

        $byName = [];
        foreach ($rows as $row) {
            $key = (array) $row;
            $byName[$key['Key_name']][$key['Seq_in_index']] = $key['Column_name'];
        }

        foreach ($byName as $name => $seq) {
            ksort($seq);
            $cols = array_values($seq);

            // MySQL's unique index shows up as `Key_name = <name>` with
            // `Non_unique = 0`. Plain indexes have Non_unique = 1.
            $isUnique = $this->isUniqueIndex($rows, $name);

            if ($cols === $columns && $isUnique === $unique) {
                return true;
            }
        }

        return false;
    }

    private function isUniqueIndex(array $rows, string $name): bool
    {
        foreach ($rows as $row) {
            $key = (array) $row;
            if ($key['Key_name'] === $name) {
                return ((int) $key['Non_unique']) === 0;
            }
        }
        return false;
    }
};
