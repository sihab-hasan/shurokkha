<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\Permission;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
        'phone_verified_at',
        'avatar_path',
        'timezone',
        'status',
        'role',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected $attributes = [
        'role' => 'user',
        'timezone' => 'Asia/Dhaka',
    ];

    protected static function booted(): void
    {
        static::created(function (User $user): void {
            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'user_id' => $user->user_id ?? $user->id,
                    'full_name' => $user->full_name ?? $user->name,
                    'phone' => $user->phone ?? '01700000000',
                    'status' => $user->status ?? 'active',
                    'role_id' => $user->role_id ?? ($user->role?->value === 'admin' ? 1 : 2),
                ]);

            // Auto-create preference rows so settings GET endpoints always have data.
            NotificationPreference::firstOrCreate(['user_id' => $user->id]);
            PrivacyPreference::firstOrCreate(['user_id' => $user->id]);
        });
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'two_factor_secret' => 'encrypted',
        ];
    }

    /**
     * Compute the public URL for the user's avatar.
     * Returns null when no avatar has been uploaded.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (empty($this->avatar_path)) {
            return null;
        }

        return Storage::disk('local')->url($this->avatar_path);
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

    public function hasPermission(Permission $permission): bool
    {
        return $this->role instanceof UserRole
            && $this->role->hasPermission($permission);
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function managedWarehouses(): HasMany
    {
        return $this->hasMany(Warehouse::class, 'manager_id');
    }

    public function notificationPreference(): HasOne
    {
        return $this->hasOne(NotificationPreference::class);
    }

    public function privacyPreference(): HasOne
    {
        return $this->hasOne(PrivacyPreference::class);
    }

    public function loginAudits(): HasMany
    {
        return $this->hasMany(LoginAudit::class);
    }

    public function successfulLoginAudits(): HasMany
    {
        return $this->loginAudits()->where('successful', true);
    }

    public function dataExportRequests(): HasMany
    {
        return $this->hasMany(DataExportRequest::class);
    }

    public function accountDeletionRequest(): HasOne
    {
        return $this->hasOne(AccountDeletionRequest::class)->latestOfMany('id');
    }
}
