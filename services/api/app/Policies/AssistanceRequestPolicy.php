<?php

namespace App\Policies;

use App\Models\AssistanceRequest;
use App\Models\User;

class AssistanceRequestPolicy
{
    public function view(User $user, AssistanceRequest $assistanceRequest): bool
    {
        return $assistanceRequest->user_id === $user->id;
    }

    public function update(User $user, AssistanceRequest $assistanceRequest): bool
    {
        return $assistanceRequest->user_id === $user->id;
    }

    public function delete(User $user, AssistanceRequest $assistanceRequest): bool
    {
        return $assistanceRequest->user_id === $user->id;
    }
}
