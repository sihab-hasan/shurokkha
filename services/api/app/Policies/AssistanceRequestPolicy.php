<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\AssistanceRequest;
use App\Models\User;

class AssistanceRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permission::AssistanceAccess);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission(Permission::AssistanceAccess);
    }

    public function view(User $user, AssistanceRequest $assistanceRequest): bool
    {
        return $this->viewAny($user) && $assistanceRequest->user_id === $user->id;
    }

    public function update(User $user, AssistanceRequest $assistanceRequest): bool
    {
        return $this->viewAny($user) && $assistanceRequest->user_id === $user->id;
    }

    public function delete(User $user, AssistanceRequest $assistanceRequest): bool
    {
        return $this->viewAny($user) && $assistanceRequest->user_id === $user->id;
    }

    /**
     * Authorize a bulk-cancel attempt. The controller queries the rows
     * owned by this user; here we just gate the entry point. Per-row
     * ownership is re-checked inside the controller.
     *
     * @param  array<int,string>  $ids
     */
    public function bulkCancel(User $user, AssistanceRequest $assistanceRequest, array $ids): bool
    {
        return $this->viewAny($user) && $ids !== [];
    }
}
