<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'full_name',
        'email',
        'password',
        'phone',
        'status',
        'role',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $attributes = [
        'role' => 'citizen',
    ];

    protected static function booted(): void
    {
        static::created(function (User $user): void {
            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'user_id' => $user->id,
                    'full_name' => $user->full_name ?? $user->name,
                    'phone' => $user->phone ?? '01700000000',
                    'status' => $user->status ?? 'active',
                    'role_id' => $user->role_id ?? ($user->role?->value === 'admin' ? 1 : ($user->role?->value === 'volunteer' ? 3 : ($user->role?->value === 'donor' ? 4 : 2))),
                ]);
        });
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    public function apiTokens(): HasMany
    {
        return $this->hasMany(ApiToken::class);
    }

    public function assistanceRequests(): HasMany
    {
        return $this->hasMany(AssistanceRequest::class);
    }

    public function missingPersonReports(): HasMany
    {
        return $this->hasMany(MissingPersonReport::class);
    }
}
