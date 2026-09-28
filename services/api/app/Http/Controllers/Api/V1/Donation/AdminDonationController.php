<?php

namespace App\Http\Controllers\Api\V1\Donation;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin-only donation endpoints.
 *
 * All database operations use raw SQL to maintain the project's query
 * structure convention.
 */
class AdminDonationController extends Controller
{
    public function index(): JsonResponse
    {
        $donations = DB::select(<<<'SQL'
            SELECT
                d.donation_id,
                d.user_id,
                d.donation_kind,
                d.amount,
                d.payment_method,
                d.campaign_title,
                d.receipt_number,
                d.currency,
                d.status,
                d.created_at,
                d.updated_at,
                u.full_name AS donor_name,
                u.email AS donor_email
            FROM donations d
            LEFT JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
        SQL);

        return response()->json(['data' => $donations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'donation_kind' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0.01',
            'currency' => ['sometimes', 'nullable', 'string', 'max:3'],
            'campaign_title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'payment_method' => ['sometimes', 'nullable', 'string', 'max:32'],
            'receipt_number' => ['sometimes', 'nullable', 'string', 'max:64'],
            'user_id' => ['sometimes', 'nullable', 'integer'],
            'status' => ['sometimes', 'string'],
        ]);

        // Auto-stamp a receipt number if the caller didn't supply one.
        $receipt = $validated['receipt_number'] ?? null;
        if (! is_string($receipt) || $receipt === '') {
            $maxId = DB::selectOne(<<<'SQL'
                SELECT COALESCE(MAX(donation_id), 0) AS max_id FROM donations
            SQL);
            $nextId = (int) $maxId->max_id + 1;
            $receipt = 'DON-' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
        }

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO donations
                (donation_kind, amount, currency, campaign_title, payment_method,
                 receipt_number, user_id, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $validated['donation_kind'],
            $validated['amount'],
            $validated['currency'] ?? 'BDT',
            $validated['campaign_title'] ?? null,
            $validated['payment_method'] ?? null,
            $receipt,
            $validated['user_id'] ?? null,
            $validated['status'] ?? 'pending',
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $donation = DB::selectOne(<<<'SQL'
            SELECT
                d.donation_id,
                d.user_id,
                d.donation_kind,
                d.amount,
                d.payment_method,
                d.campaign_title,
                d.receipt_number,
                d.currency,
                d.status,
                d.created_at,
                d.updated_at
            FROM donations d
            WHERE d.donation_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $donation], 201);
    }

    public function destroy(int|string $donation): JsonResponse
    {
        $donationId = is_numeric($donation) ? (int) $donation : 0;

        DB::delete(<<<'SQL'
            DELETE FROM donations WHERE donation_id = ?
        SQL, [$donationId]);

        return response()->json(null, 204);
    }
}
