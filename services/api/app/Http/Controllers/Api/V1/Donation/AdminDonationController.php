<?php

namespace App\Http\Controllers\Api\V1\Donation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\IndexDonationsRequest;
use App\Http\Requests\Donation\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Admin-only donation endpoints.
 *
 * Note: this controller used raw `DB::insert` to satisfy an early
 * "no FK" requirement. The donations table has since grown all the
 * columns the citizen-facing `DonationResource` exposes
 * (`payment_method`, `campaign_title`, `currency`, `receipt_number`,
 * `user_id`), so we now go through Eloquent + `DonationResource`
 * instead. The frontend `api-client.admin.donations.create()`
 * already sends a full `DonationInput` — we're now matching it.
 */
class AdminDonationController extends Controller
{
    public function index(): JsonResponse
    {
        $donations = Donation::query()
            ->orderByDesc('created_at')
            ->get();

        return DonationResource::collection($donations)->response();
    }

    public function store(Request $request): JsonResponse
    {
        // Accept the same shape as the citizen endpoint, plus a
        // settable `user_id` (admin overriding the donor on behalf
        // of the platform) and a server-controlled `status` since
        // admin-entered donations can land in any state.
        $validated = $request->validate([
            ...(new StoreDonationRequest())->rules(),
            'user_id' => ['sometimes', 'nullable', 'integer', Rule::exists((new User())->getTable(), 'id')],
            'status' => ['sometimes', 'string', Rule::in(IndexDonationsRequest::STATUSES)],
            'receipt_number' => ['sometimes', 'nullable', 'string', 'max:64'],
        ]);

        // Auto-stamp a receipt number if the caller didn't supply one,
        // mirroring the citizen controller.
        $receipt = $validated['receipt_number'] ?? null;
        if (! is_string($receipt) || $receipt === '') {
            $nextId = (int) (Donation::query()->max('donation_id') ?? 0) + 1;
            $receipt = 'DON-' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
        }

        $donation = Donation::query()->create([
            'donation_kind' => $validated['donation_kind'],
            'amount' => $validated['amount'],
            'currency' => $validated['currency'] ?? 'BDT',
            'campaign_title' => $validated['campaign_title'] ?? null,
            'payment_method' => $validated['payment_method'] ?? null,
            'receipt_number' => $receipt,
            'user_id' => $validated['user_id'] ?? null,
            'status' => $validated['status'] ?? 'pending',
        ]);

        return (new DonationResource($donation))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(int|string $donation): JsonResponse
    {
        $donationId = is_numeric($donation) ? (int) $donation : 0;
        $deleted = Donation::query()->where('donation_id', $donationId)->delete();

        return response()->json(null, $deleted > 0 ? 204 : 404);
    }
}
