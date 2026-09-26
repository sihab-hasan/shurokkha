<?php

namespace App\Http\Controllers\Api\V1\MissingPerson;

use App\Enums\MissingPersonStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\MissingPerson\BulkCloseMissingPersonReportsRequest;
use App\Http\Requests\MissingPerson\ListMissingPersonReportsRequest;
use App\Http\Requests\MissingPerson\StoreMissingPersonReport;
use App\Http\Requests\MissingPerson\UpdateMissingPersonReport;
use App\Http\Resources\MissingPersonReportResource;
use App\Models\MissingPersonReport;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MissingPersonReportController extends Controller
{
    public function index(ListMissingPersonReportsRequest $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', MissingPersonReport::class);

        $filters = $request->validatedFilters();
        $sort = $this->resolveSort($filters['sort']);
        $dir = $filters['dir'] ?? 'desc';

        $base = fn (): Builder => MissingPersonReport::query()
            ->where('user_id', $request->user()->id);

        $query = $base()
            ->when($filters['status'] !== [], fn (Builder $q) => $q->whereIn('status', $filters['status']))
            ->when($filters['search'] !== null, function (Builder $q) use ($filters): void {
                $needle = $filters['search'];
                $q->where(function (Builder $inner) use ($needle): void {
                    $inner->where('full_name', 'like', "%{$needle}%")
                        ->orWhere('last_seen_location', 'like', "%{$needle}%");
                });
            })
            ->orderBy($sort, $dir);

        $facets = $this->buildFacets($base, $filters);

        return MissingPersonReportResource::collection(
            $query->paginate($filters['per_page'] ?? 10)->withQueryString(),
        )->additional([
            'facets' => $facets,
        ]);
    }

    public function store(StoreMissingPersonReport $request): JsonResponse
    {
        Gate::authorize('create', MissingPersonReport::class);
        $validated = $request->validated();
        unset($validated['photo']);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('missing-persons', 'local');
        }

        $report = MissingPersonReport::query()->create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => MissingPersonStatus::Reported,
        ]);

        return (new MissingPersonReportResource($report))
            ->response()
            ->setStatusCode(201);
    }

    public function show(MissingPersonReport $missingPersonReport): MissingPersonReportResource
    {
        Gate::authorize('view', $missingPersonReport);

        return new MissingPersonReportResource($missingPersonReport);
    }


    public function photo(MissingPersonReport $missingPersonReport)
    {
        Gate::authorize('view', $missingPersonReport);

        abort_if(
            $missingPersonReport->photo_path === null
                || ! Storage::disk('local')->exists($missingPersonReport->photo_path),
            404,
            'Photo not found.',
        );

        return Storage::disk('local')->response(
            $missingPersonReport->photo_path,
            null,
            ['Cache-Control' => 'private, max-age=3600'],
        );
    }

    public function update(
        UpdateMissingPersonReport $request,
        MissingPersonReport $missingPersonReport
    ): MissingPersonReportResource {
        Gate::authorize('update', $missingPersonReport);
        $this->ensureMutable($missingPersonReport);

        $validated = $request->validated();
        $removePhoto = (bool) ($validated['remove_photo'] ?? false);
        unset($validated['photo'], $validated['remove_photo']);

        if ($request->hasFile('photo')) {
            if ($missingPersonReport->photo_path) {
                Storage::disk('local')->delete($missingPersonReport->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('missing-persons', 'local');
        } elseif ($removePhoto && $missingPersonReport->photo_path) {
            Storage::disk('local')->delete($missingPersonReport->photo_path);
            $validated['photo_path'] = null;
        }

        $missingPersonReport->update($validated);

        return new MissingPersonReportResource($missingPersonReport->refresh());
    }

    public function destroy(MissingPersonReport $missingPersonReport): JsonResponse
    {
        Gate::authorize('delete', $missingPersonReport);
        $missingPersonReport->delete();

        return response()->json(status: 204);
    }

    public function close(Request $request, MissingPersonReport $missingPersonReport): MissingPersonReportResource
    {
        Gate::authorize('update', $missingPersonReport);
        $this->ensureMutable($missingPersonReport);

        $validated = $request->validate([
            'located' => ['sometimes', 'boolean'],
        ]);
        $located = (bool) ($validated['located'] ?? false);

        $missingPersonReport->update([
            'status' => $located ? MissingPersonStatus::Located : MissingPersonStatus::Closed,
            'found_at' => $located ? now() : null,
            'closed_at' => now(),
        ]);

        return new MissingPersonReportResource($missingPersonReport->refresh());
    }

    /**
     * Bulk-close endpoint. Closes every report whose id appears in the
     * payload AND belongs to the calling user AND is still mutable. The
     * response carries three buckets so the UI can report partial success.
     */
    public function bulkClose(
        BulkCloseMissingPersonReportsRequest $request
    ): JsonResponse {
        Gate::authorize('bulkClose', [MissingPersonReport::class, $request->validated()['ids']]);

        $ids = $request->validated()['ids'];

        $reports = MissingPersonReport::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        $closed = [];
        $skipped = [];

        foreach ($ids as $id) {
            $row = $reports->get($id);
            if ($row === null) {
                continue;
            }
            if ($this->isTerminal($row)) {
                $skipped[] = $row->id;
                continue;
            }
            $row->update([
                'status' => MissingPersonStatus::Closed,
                'found_at' => null,
                'closed_at' => now(),
            ]);
            $closed[] = $row->id;
        }

        return response()->json([
            'data' => [
                'closed' => $closed,
                'skipped' => $skipped,
                'missing' => array_values(array_diff($ids, array_keys($reports->all()))),
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
        if ($sort !== null && in_array($sort, ListMissingPersonReportsRequest::SORTABLE_FIELDS, true)) {
            return $sort;
        }

        return 'created_at';
    }

    /**
     * Build status facet counts. Standard faceted-search semantics:
     * each dimension's counts are computed with every OTHER filter applied,
     * but the filter for the dimension being faceted is omitted.
     *
     * @param  callable(): Builder  $base
     * @param  array{
     *   search: ?string, status: array<int,string>, sort: ?string, dir: ?string,
     *   page: ?int, per_page: ?int,
     * } $filters
     * @return array{status: array<string,int>}
     */
    private function buildFacets(callable $base, array $filters): array
    {
        $enumValues = array_map(
            fn (MissingPersonStatus $c) => $c->value,
            MissingPersonStatus::cases(),
        );

        $clause = $base();

        if ($filters['search'] !== null) {
            $needle = $filters['search'];
            $clause->where(function (Builder $q) use ($needle): void {
                $q->where('full_name', 'like', "%{$needle}%")
                    ->orWhere('last_seen_location', 'like', "%{$needle}%");
            });
        }

        $rows = (clone $clause)
            ->whereIn('status', $enumValues)
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status')
            ->all();

        return [
            'status' => array_replace(array_fill_keys($enumValues, 0), $rows),
        ];
    }

    private function ensureMutable(MissingPersonReport $report): void
    {
        abort_if(
            $this->isTerminal($report),
            409,
            'This missing-person report can no longer be changed.',
        );
    }

    private function isTerminal(MissingPersonReport $report): bool
    {
        return in_array($report->status, [
            MissingPersonStatus::Located,
            MissingPersonStatus::Closed,
            MissingPersonStatus::Rejected,
        ], true);
    }
}
