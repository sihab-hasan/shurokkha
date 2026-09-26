<?php

namespace App\Http\Controllers\Api\V1\Donation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\IndexDonationsRequest;
use App\Http\Requests\Donation\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Http\Resources\DonationStatsResource;
use App\Models\Donation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;

/**
 * Citizen-facing donation endpoints.
 *
 * Mirrors the structure of {@see AssistanceRequestController}:
 *  - `index()`          list with filters, sort, paginate
 *  - `stats()`          per-user aggregate counts
 *  - `store()`          create a donation (auto-stamps `user_id`,
 *                       `status=pending`, `receipt_number`)
 *  - `show()`           detail (Policy-gated to owner)
 *  - `cancel()`         transition `pending` → `cancelled`
 */
class DonationController extends Controller
{
    public function index(IndexDonationsRequest $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Donation::class);

        $filters = $request->validatedFilters();
        $sort = $this->resolveSort($filters['sort']);
        $dir = $filters['dir'] ?? 'desc';

        $base = fn (): Builder => Donation::query()
            ->where('user_id', $request->user()->id);

        $query = $base()
            ->when($filters['status'] !== [], fn (Builder $q) => $q->whereIn('status', $filters['status']))
            ->when($filters['type'] !== [], fn (Builder $q) => $q->whereIn('donation_kind', $filters['type']))
            ->when($filters['payment_method'] !== [], fn (Builder $q) => $q->whereIn('payment_method', $filters['payment_method']))
            ->when($filters['search'] !== null, function (Builder $q) use ($filters): void {
                $needle = $filters['search'];
                $q->where(function (Builder $inner) use ($needle): void {
                    $inner->where('campaign_title', 'like', "%{$needle}%")
                        ->orWhere('receipt_number', 'like', "%{$needle}%")
                        ->orWhere('donation_kind', 'like', "%{$needle}%");
                });
            })
            ->orderBy($sort, $dir);

        return DonationResource::collection(
            $query->paginate($filters['per_page'] ?? 10)->withQueryString(),
        );
    }

    public function stats(Request $request): DonationStatsResource
    {
        Gate::authorize('viewAny', Donation::class);

        $base = fn (): Builder => Donation::query()
            ->where('user_id', $request->user()->id);

        $payload = [
            'total' => (clone $base())->count(),
            'lifetime_sum' => (clone $base())->sum('amount'),
            'recurring' => (clone $base())->where('donation_kind', 'recurring')->count(),
            'one_time' => (clone $base())->where('donation_kind', 'one_time')->count(),
            'pending' => (clone $base())->where('status', 'pending')->count(),
            'completed' => (clone $base())->where('status', 'completed')->count(),
        ];

        return new DonationStatsResource($payload);
    }

    public function store(StoreDonationRequest $request): JsonResponse
    {
        Gate::authorize('create', Donation::class);

        $donation = DB::transaction(function () use ($request): Donation {
            // Auto-stamp receipt number if the client didn't supply one.
            $receipt = $request->input('receipt_number');
            if (! is_string($receipt) || $receipt === '') {
                // Compute next id inside the transaction so the receipt
                // matches the row that ends up holding it.
                $nextId = (int) (DB::table('donations')->max('donation_id') ?? 0) + 1;
                $receipt = 'DON-' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
            }

            return Donation::query()->create([
                ...$request->validated(),
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'currency' => $request->input('currency', 'BDT'),
                'receipt_number' => $receipt,
            ]);
        });

        return (new DonationResource($donation))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Donation $donation): DonationResource
    {
        Gate::authorize('view', $donation);

        return new DonationResource($donation);
    }

    public function cancel(Donation $donation): DonationResource
    {
        Gate::authorize('cancel', $donation);

        abort_if(
            $donation->status !== 'pending',
            409,
            'Only pending donations can be cancelled.',
        );

        $donation->update(['status' => 'cancelled']);

        return new DonationResource($donation->refresh());
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
