<?php

namespace App\Policies;

use App\Models\Donation;
use App\Models\User;

/**
 * Authorization for `/v1/donations/*`.
 *
 * No dedicated permission bit is required — any authenticated citizen
 * can view their own donation history, create new ones, and cancel
 * pending ones. Cross-user access is blocked by ownership checks.
 */
class DonationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user !== null;
    }

    public function view(User $user, Donation $donation): bool
    {
        return $donation->user_id !== null && $donation->user_id === $user->id;
    }

    public function update(User $user, Donation $donation): bool
    {
        return $this->view($user, $donation);
    }

    public function cancel(User $user, Donation $donation): bool
    {
        return $this->view($user, $donation) && $donation->status === 'pending';
    }
}
