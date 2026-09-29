<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin \App\Models\User
 *
 * Extends the public UserResource with admin-only fields like
 * `status`, `role_id`, and email verification timestamp.
 *
 * Tolerant of either an Eloquent model or a raw stdClass row from
 * `DB::select()` — controllers in this codebase mix both styles.
 */
class AdminUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $iso = static function ($value): ?string {
            if ($value === null || $value === '') {
                return null;
            }
            if ($value instanceof \DateTimeInterface) {
                return $value->format(\DateTimeInterface::ATOM);
            }

            return (string) $value;
        };

        $role = $this->role;
        $roleValue = is_object($role) && property_exists($role, 'value')
            ? $role->value
            : $role;

        // Derive avatar_url from avatar_path. On Eloquent models this
        // already exists as a $appends, but raw stdClass rows don't.
        $avatarPath = $this->avatar_path ?? null;
        $avatarUrl = $avatarPath
            ? Storage::disk('local')->url($avatarPath)
            : null;

        return [
            'id' => (int) $this->id,
            'user_id' => $this->user_id !== null ? (int) $this->user_id : null,
            'name' => $this->name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'email_verified_at' => $iso($this->email_verified_at ?? null),
            'phone' => $this->phone,
            'phone_verified_at' => $iso($this->phone_verified_at ?? null),
            'avatar_url' => $avatarUrl,
            'timezone' => $this->timezone,
            'status' => $this->status,
            'role' => $roleValue,
            'role_id' => $this->role_id !== null ? (int) $this->role_id : null,
            'two_factor_confirmed_at' => $iso($this->two_factor_confirmed_at ?? null),
        ];
    }
}