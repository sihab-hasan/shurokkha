<?php

namespace App\Http\Controllers\Api\V1\Citizen;

use App\Enums\AssistanceRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Citizen\AssistanceRequest\ListAssistanceRequestsRequest;
use App\Http\Requests\Citizen\AssistanceRequest\StoreAssistanceRequest;
use App\Http\Requests\Citizen\AssistanceRequest\UpdateAssistanceRequest;
use App\Http\Resources\AssistanceRequestResource;
use App\Models\AssistanceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class AssistanceRequestController extends Controller
{
    public function index(ListAssistanceRequestsRequest $request): AnonymousResourceCollection
    {
        $validated = $request->validated();
        $query = AssistanceRequest::query()
            ->where('user_id', $request->user()->id)
            ->latest('created_at');

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($query) use ($search): void {
                $query->where('description', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        return AssistanceRequestResource::collection(
            $query->paginate($validated['per_page'] ?? 10)->withQueryString(),
        );
    }

    public function store(StoreAssistanceRequest $request): JsonResponse
    {
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
        AssistanceRequest $assistanceRequest,
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

    private function ensureMutable(AssistanceRequest $assistanceRequest): void
    {
        abort_if(
            in_array($assistanceRequest->status, [
                AssistanceRequestStatus::Resolved,
                AssistanceRequestStatus::Rejected,
                AssistanceRequestStatus::Cancelled,
            ], true),
            409,
            'This request can no longer be changed.',
        );
    }
}
