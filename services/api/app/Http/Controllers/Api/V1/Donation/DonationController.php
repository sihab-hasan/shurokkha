<?php

namespace App\Http\Controllers\Api\V1\Donation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\IndexDonationsRequest;
use App\Http\Requests\Donation\StoreDonationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Citizen-facing donation endpoints.
 *
 * All database operations use raw SQL to maintain the project's query
 * structure convention. Manual pagination replicates Laravel's
 * LengthAwarePaginator response shape so the frontend is unaffected.
 */
class DonationController extends Controller
{
    public function index(IndexDonationsRequest $request): JsonResponse
    {
        $userId = $request->user()->id;
        $filters = $request->validatedFilters();
        $sort = $this->resolveSort($filters['sort']);
        $dir = strtolower($filters['dir'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page = (int) ($request->query('page', 1));
        $offset = ($page - 1) * $perPage;

        // Build dynamic WHERE clause
        $where = ['d.user_id = ?'];
        $params = [$userId];

        if ($filters['status'] !== []) {
            $placeholders = implode(',', array_fill(0, count($filters['status']), '?'));
            $where[] = "d.status IN ({$placeholders})";
            $params = array_merge($params, $filters['status']);
        }

        if ($filters['type'] !== []) {
            $placeholders = implode(',', array_fill(0, count($filters['type']), '?'));
            $where[] = "d.donation_kind IN ({$placeholders})";
            $params = array_merge($params, $filters['type']);
        }

        if ($filters['payment_method'] !== []) {
            $placeholders = implode(',', array_fill(0, count($filters['payment_method']), '?'));
            $where[] = "d.payment_method IN ({$placeholders})";
            $params = array_merge($params, $filters['payment_method']);
        }

        if ($filters['search'] !== null) {
            $needle = '%' . $filters['search'] . '%';
            $where[] = '(d.campaign_title LIKE ? OR d.receipt_number LIKE ? OR d.donation_kind LIKE ?)';
            $params = array_merge($params, [$needle, $needle, $needle]);
        }

        $whereClause = implode(' AND ', $where);

        // Count total
        $countRow = DB::selectOne(
            "SELECT COUNT(*) AS total FROM donations d WHERE {$whereClause}",
            $params
        );
        $total = (int) $countRow->total;

        // Fetch page
        $dataParams = array_merge($params, [$perPage, $offset]);
        $rows = DB::select(
            "SELECT
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
            WHERE {$whereClause}
            ORDER BY d.{$sort} {$dir}
            LIMIT ? OFFSET ?",
            $dataParams
        );

        $lastPage = max(1, (int) ceil($total / $perPage));

        return response()->json([
            'data' => $rows,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => $lastPage,
            ],
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $stats = DB::selectOne(<<<'SQL'
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(amount), 0) AS lifetime_sum,
                SUM(CASE WHEN donation_kind = 'recurring' THEN 1 ELSE 0 END) AS recurring,
                SUM(CASE WHEN donation_kind = 'one_time' THEN 1 ELSE 0 END) AS one_time,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
            FROM donations
            WHERE user_id = ?
        SQL, [$userId]);

        return response()->json(['data' => $stats]);
    }

    public function store(StoreDonationRequest $request): JsonResponse
    {
        $userId = $request->user()->id;
        $validated = $request->validated();
        $now = now();

        // Auto-stamp receipt number
        $receipt = $validated['receipt_number'] ?? null;
        if (! is_string($receipt) || $receipt === '') {
            $maxId = DB::selectOne(<<<'SQL'
                SELECT COALESCE(MAX(donation_id), 0) AS max_id FROM donations
            SQL);
            $nextId = (int) $maxId->max_id + 1;
            $receipt = 'DON-' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
        }

        DB::insert(<<<'SQL'
            INSERT INTO donations
                (donation_kind, amount, currency, campaign_title, payment_method,
                 receipt_number, user_id, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
        SQL, [
            $validated['donation_kind'],
            $validated['amount'],
            $validated['currency'] ?? 'BDT',
            $validated['campaign_title'] ?? null,
            $validated['payment_method'] ?? null,
            $receipt,
            $userId,
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $donation = DB::selectOne(<<<'SQL'
            SELECT * FROM donations WHERE donation_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $donation], 201);
    }

    public function show(int|string $donation): JsonResponse
    {
        $donationId = is_numeric($donation) ? (int) $donation : 0;

        $row = DB::selectOne(<<<'SQL'
            SELECT * FROM donations WHERE donation_id = ?
        SQL, [$donationId]);

        if ($row === null) {
            return response()->json(['message' => 'Donation not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    /**
     * Resolve a donation by its user-visible receipt number (e.g.
     * "DON-000481"). Scoped to the caller so a wrong receipt id leaks
     * no information: missing-and-not-yours both surface as 404.
     */
    public function showByReceipt(Request $request, string $receiptNumber): JsonResponse
    {
        $userId = $request->user()->id;

        $donation = DB::selectOne(<<<'SQL'
            SELECT * FROM donations
            WHERE user_id = ? AND receipt_number = ?
        SQL, [$userId, $receiptNumber]);

        if ($donation === null) {
            return response()->json(['message' => 'Donation not found.'], 404);
        }

        return response()->json(['data' => $donation]);
    }

    public function cancel(int|string $donation, Request $request): JsonResponse
    {
        $donationId = is_numeric($donation) ? (int) $donation : 0;

        $row = DB::selectOne(<<<'SQL'
            SELECT donation_id, status FROM donations WHERE donation_id = ?
        SQL, [$donationId]);

        abort_if($row === null, 404, 'Donation not found.');
        abort_if($row->status !== 'pending', 409, 'Only pending donations can be cancelled.');

        $now = now();

        DB::update(<<<'SQL'
            UPDATE donations SET status = 'cancelled', updated_at = ? WHERE donation_id = ?
        SQL, [$now, $donationId]);

        $updated = DB::selectOne(<<<'SQL'
            SELECT * FROM donations WHERE donation_id = ?
        SQL, [$donationId]);

        return response()->json(['data' => $updated]);
    }

    /**
     * Belt-and-braces sort whitelist. The FormRequest already enforces
     * `in:...`, but we re-check here in case the FormRequest is bypassed
     * (e.g. internal callers) or the whitelist drifts.
     */
    private function resolveSort(?string $sort): string
    {
        if ($sort !== null && in_array($sort, IndexDonationsRequest::SORTABLE_FIELDS, true)) {
            return $sort;
        }

        return 'created_at';
    }
}
