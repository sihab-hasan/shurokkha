<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    /**
     * Fetch all donations via raw SQL SELECT.
     * (donations table has no user_id FK — donor info stored directly in donation_kind/amount)
     */
    public function index(): JsonResponse
    {
        $donations = DB::select(<<<'SQL'
            SELECT 
                d.donation_id,
                d.donation_kind,
                d.amount,
                d.status,
                d.created_at,
                d.updated_at
            FROM donations d
            ORDER BY d.created_at DESC
        SQL);

        return response()->json(['data' => $donations]);
    }

    /**
     * Store new donation via raw SQL INSERT.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'donation_kind' => 'required|string|max:50',
            'amount'        => 'required|numeric|min:0',
            'status'        => 'required|string|max:50',
        ]);

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO donations (donation_kind, amount, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        SQL, [
            $validated['donation_kind'],
            $validated['amount'],
            $validated['status'],
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $donation = DB::selectOne(<<<'SQL'
            SELECT * FROM donations WHERE donation_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $donation], 201);
    }

    /**
     * Delete donation via raw SQL DELETE.
     */
    public function destroy(int|string $donation): JsonResponse
    {
        $donationId = is_numeric($donation) ? (int) $donation : 0;

        DB::delete(<<<'SQL'
            DELETE FROM donations
            WHERE donation_id = ?
        SQL, [$donationId]);

        return response()->json(null, 204);
    }
}
