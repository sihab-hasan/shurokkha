<?php

namespace App\Policies;

use App\Models\MissingPersonReport;
use App\Models\User;

class MissingPersonReportPolicy
{
    public function view(User $user, MissingPersonReport $missingPersonReport): bool
    {
        return $missingPersonReport->user_id === $user->id;
    }

    public function update(User $user, MissingPersonReport $missingPersonReport): bool
    {
        return $missingPersonReport->user_id === $user->id;
    }

    public function delete(User $user, MissingPersonReport $missingPersonReport): bool
    {
        return $missingPersonReport->user_id === $user->id;
    }
}
