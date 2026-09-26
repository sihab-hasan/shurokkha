<?php

namespace App\Policies;

use App\Models\User;

class SessionPolicy
{
    public function view(User $actor, User $subject): bool
    {
        return $actor->id === $subject->id;
    }
}