<?php

namespace App\Http\Controllers\Api\V1\Citizen;

use App\Enums\MissingPersonStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Citizen\MissingPerson\ListMissingPersonReportsRequest;
use App\Http\Requests\Citizen\MissingPerson\StoreMissingPersonReport;
use App\Http\Requests\Citizen\MissingPerson\UpdateMissingPersonReport;
use App\Http\Resources\MissingPersonReportResource;
use App\Models\MissingPersonReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MissingPersonReportController extends Controller
{
    public function index(ListMissingPersonReportsRequest $request): AnonymousResourceCollection
    {
        $validated = $request->validated();
        $query = MissingPersonReport::query()
            ->where('user_id', $request->user()->id)
            ->latest('created_at');

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($query) use ($search): void {
                $query->where('full_name', 'like', "%{$search}%")
                    ->orWhere('last_seen_location', 'like', "%{$search}%");
            });
        }

        return MissingPersonReportResource::collection(
            $query->paginate($validated['per_page'] ?? 10)->withQueryString(),
        );
    }

    public function store(StoreMissingPersonReport $request): JsonResponse
    {
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
        MissingPersonReport $missingPersonReport,
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

    private function ensureMutable(MissingPersonReport $report): void
    {
        abort_if(
            in_array($report->status, [
                MissingPersonStatus::Located,
                MissingPersonStatus::Closed,
                MissingPersonStatus::Rejected,
            ], true),
            409,
            'This missing-person report can no longer be changed.',
        );
    }
}
