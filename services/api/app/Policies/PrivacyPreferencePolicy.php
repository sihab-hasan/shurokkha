<?php

namespace App\Policies;

use App\Models\PrivacyPreference;
use App\Models\User;

class PrivacyPreferencePolicy
{
    public function view(User $actor, PrivacyPreference $subject): bool
    {
        return $actor->id === $subject->user_id;
    }

    public function update(User $actor, PrivacyPreference $subject): bool
    {
        return $this->view($actor, $subject);
    }
}