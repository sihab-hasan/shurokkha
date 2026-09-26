<?php

namespace App\Policies;

use App\Models\User;

class ProfilePolicy
{
    public function view(User $actor, User $subject): bool
    {
        return $actor->id === $subject->id;
    }

    public function update(User $actor, User $subject): bool
    {
        return $actor->id === $subject->id;
    }
}