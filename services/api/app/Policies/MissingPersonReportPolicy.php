<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\MissingPersonReport;
use App\Models\User;

class MissingPersonReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permission::MissingPersonsAccess);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission(Permission::MissingPersonsAccess);
    }

    public function view(User $user, MissingPersonReport $missingPersonReport): bool
    {
        return $this->viewAny($user) && $missingPersonReport->user_id === $user->id;
    }

    public function update(User $user, MissingPersonReport $missingPersonReport): bool
    {
        return $this->viewAny($user) && $missingPersonReport->user_id === $user->id;
    }

    public function delete(User $user, MissingPersonReport $missingPersonReport): bool
    {
        return $this->viewAny($user) && $missingPersonReport->user_id === $user->id;
    }

    /**
     * Authorize a bulk-close attempt. The controller queries the rows
     * owned by this user; here we just gate the entry point. Per-row
     * ownership is re-checked inside the controller.
     *
     * @param  array<int,string>  $ids
     */
    public function bulkClose(User $user, MissingPersonReport $missingPersonReport, array $ids): bool
    {
        return $this->viewAny($user) && $ids !== [];
    }
}
