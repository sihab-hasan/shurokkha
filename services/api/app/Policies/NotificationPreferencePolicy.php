<?php

namespace App\Policies;

use App\Models\NotificationPreference;
use App\Models\User;

class NotificationPreferencePolicy
{
    public function view(User $actor, NotificationPreference $subject): bool
    {
        return $actor->id === $subject->user_id;
    }

    public function update(User $actor, NotificationPreference $subject): bool
    {
        return $this->view($actor, $subject);
    }
}