<?php

namespace App\Http\Controllers\Api\V1\AssistanceRequest;

use App\Enums\AssistanceRequestPriority;
use App\Enums\AssistanceRequestStatus;
use App\Enums\AssistanceRequestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssistanceRequest\BulkCancelAssistanceRequestsRequest;
use App\Http\Requests\AssistanceRequest\ListAssistanceRequestsRequest;
use App\Http\Requests\AssistanceRequest\StoreAssistanceRequest;
use App\Http\Requests\AssistanceRequest\UpdateAssistanceRequest;
use App\Http\Resources\AssistanceRequestResource;
use App\Http\Resources\AssistanceRequestStatsResource;
use App\Models\AssistanceRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class AssistanceRequestController extends Controller
{
    public function index(ListAssistanceRequestsRequest $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', AssistanceRequest::class);

        $filters = $request->validatedFilters();
        $sort = $this->resolveSort($filters['sort']);
        $dir = $filters['dir'] ?? 'desc';

        // Base scope: a single row per user, never cross-user. Every clone
        // below re-applies this so facet counts cannot leak across users.
        $base = fn (): Builder => AssistanceRequest::query()
            ->where('user_id', $request->user()->id);

        $query = $base()
            ->when($filters['status'] !== [], fn (Builder $q) => $q->whereIn('status', $filters['status']))
            ->when($filters['type'] !== [], fn (Builder $q) => $q->whereIn('type', $filters['type']))
            ->when($filters['priority'] !== [], fn (Builder $q) => $q->whereIn('priority', $filters['priority']))
            ->when($filters['search'] !== null, function (Builder $q) use ($filters): void {
                $needle = $filters['search'];
                $q->where(function (Builder $inner) use ($needle): void {
                    $inner->where('description', 'like', "%{$needle}%")
                        ->orWhere('address', 'like', "%{$needle}%");
                });
            })
            ->orderBy($sort, $dir);

        $facets = $this->buildFacets($base, $filters);

        return AssistanceRequestResource::collection(
            $query->paginate($filters['per_page'] ?? 10)->withQueryString(),
        )->additional([
            'facets' => $facets,
        ]);
    }

    public function stats(Request $request): AssistanceRequestStatsResource
    {
        Gate::authorize('viewAny', AssistanceRequest::class);

        $rows = AssistanceRequest::query()
            ->where('user_id', $request->user()->id)
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status')
            ->all();

        /** @var array<string,int> $rows */
        return new AssistanceRequestStatsResource($rows);
    }

    public function store(StoreAssistanceRequest $request): JsonResponse
    {
        Gate::authorize('create', AssistanceRequest::class);
        $assistanceRequest = AssistanceRequest::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'status' => AssistanceRequestStatus::Submitted,
            'submitted_at' => now(),
        ]);

        return (new AssistanceRequestResource($assistanceRequest))
            ->response()
            ->setStatusCode(201);
    }

    public function show(AssistanceRequest $assistanceRequest): AssistanceRequestResource
    {
        Gate::authorize('view', $assistanceRequest);

        return new AssistanceRequestResource($assistanceRequest);
    }

    public function update(
        UpdateAssistanceRequest $request,
        AssistanceRequest $assistanceRequest
    ): AssistanceRequestResource {
        Gate::authorize('update', $assistanceRequest);
        $this->ensureMutable($assistanceRequest);

        $assistanceRequest->update($request->validated());

        return new AssistanceRequestResource($assistanceRequest->refresh());
    }

    public function destroy(AssistanceRequest $assistanceRequest): JsonResponse
    {
        Gate::authorize('delete', $assistanceRequest);
        $assistanceRequest->delete();

        return response()->json(status: 204);
    }

    public function cancel(AssistanceRequest $assistanceRequest): AssistanceRequestResource
    {
        Gate::authorize('update', $assistanceRequest);
        $this->ensureMutable($assistanceRequest);

        $assistanceRequest->update([
            'status' => AssistanceRequestStatus::Cancelled,
            'cancelled_at' => now(),
        ]);

        return new AssistanceRequestResource($assistanceRequest->refresh());
    }

    /**
     * Bulk-cancel endpoint. Cancels every request whose id appears in the
     * payload AND belongs to the calling user AND is still mutable. The
     * response carries three buckets so the UI can report partial success
     * accurately: cancelled (already done), skipped (already terminal),
     * missing (not found / not owned).
     */
    public function bulkCancel(
        BulkCancelAssistanceRequestsRequest $request
    ): JsonResponse {
        Gate::authorize('bulkCancel', [AssistanceRequest::class, $request->validated()['ids']]);

        $ids = $request->validated()['ids'];

        $requests = AssistanceRequest::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        $cancelled = [];
        $skipped = [];

        foreach ($ids as $id) {
            $row = $requests->get($id);
            if ($row === null) {
                continue;
            }
            if ($this->isTerminal($row)) {
                $skipped[] = $row->id;
                continue;
            }
            $row->update([
                'status' => AssistanceRequestStatus::Cancelled,
                'cancelled_at' => now(),
            ]);
            $cancelled[] = $row->id;
        }

        return response()->json([
            'data' => [
                'cancelled' => $cancelled,
                'skipped' => $skipped,
                'missing' => array_values(array_diff($ids, array_keys($requests->all()))),
            ],
        ]);
    }

    /**
     * Belt-and-braces sort whitelist. The FormRequest already enforces
     * `in:...`, but we re-check here in case the FormRequest is bypassed
     * (e.g. internal callers) or the whitelist drifts.
     */
    private function resolveSort(?string $sort): string
    {
        if ($sort !== null && in_array($sort, ListAssistanceRequestsRequest::SORTABLE_FIELDS, true)) {
            return $sort;
        }

        return 'created_at';
    }

    /**
     * Build per-dimension facet counts. Standard faceted-search semantics:
     * each dimension's counts are computed with every OTHER filter applied,
     * but the filter for the dimension being faceted is omitted. This makes
     * the "Open (5)" chip reflect what would happen if the user added ONLY
     * the `status=open` filter on top of their current selection.
     *
     * @param  callable(): Builder  $base
     * @param  array{
     *   search: ?string, status: array<int,string>, type: array<int,string>,
     *   priority: array<int,string>, sort: ?string, dir: ?string,
     *   page: ?int, per_page: ?int,
     * } $filters
     * @return array{status: array<string,int>, type: array<string,int>, priority: array<string,int>}
     */
    private function buildFacets(callable $base, array $filters): array
    {
        $enumValues = [
            'status' => array_map(fn (AssistanceRequestStatus $c) => $c->value, AssistanceRequestStatus::cases()),
            'type' => array_map(fn (AssistanceRequestType $c) => $c->value, AssistanceRequestType::cases()),
            'priority' => array_map(fn (AssistanceRequestPriority $c) => $c->value, AssistanceRequestPriority::cases()),
        ];

        $dimensions = [
            'status' => $filters['status'],
            'type' => $filters['type'],
            'priority' => $filters['priority'],
        ];

        $facets = [];
        foreach ($dimensions as $dim => $currentSelection) {
            // Clone base and apply every other filter EXCEPT this dimension.
            $otherFilters = array_filter(
                $dimensions,
                fn (string $key): bool => $key !== $dim,
                ARRAY_FILTER_USE_KEY,
            );

            $clause = $base();
            foreach ($otherFilters as $key => $values) {
                if ($values !== []) {
                    $clause->whereIn($key, $values);
                }
            }

            if ($filters['search'] !== null) {
                $needle = $filters['search'];
                $clause->where(function (Builder $q) use ($needle): void {
                    $q->where('description', 'like', "%{$needle}%")
                        ->orWhere('address', 'like', "%{$needle}%");
                });
            }

            $rows = (clone $clause)
                ->whereIn($dim, $enumValues[$dim])
                ->selectRaw("{$dim}, COUNT(*) as aggregate")
                ->groupBy($dim)
                ->pluck('aggregate', $dim)
                ->all();

            // Zero-fill missing enum values so the UI never sees undefined keys.
            $facets[$dim] = array_replace(array_fill_keys($enumValues[$dim], 0), $rows);
        }

        return $facets;
    }

    private function ensureMutable(AssistanceRequest $assistanceRequest): void
    {
        abort_if(
            $this->isTerminal($assistanceRequest),
            409,
            'This request can no longer be changed.',
        );
    }

    private function isTerminal(AssistanceRequest $assistanceRequest): bool
    {
        return in_array($assistanceRequest->status, [
            AssistanceRequestStatus::Resolved,
            AssistanceRequestStatus::Rejected,
            AssistanceRequestStatus::Cancelled,
        ], true);
    }
}
