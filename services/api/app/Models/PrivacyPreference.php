<?php

namespace App\Models;

use App\Enums\LocationSharing;
use App\Enums\ProfileVisibility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrivacyPreference extends Model
{
    protected $fillable = [
        'user_id',
        'location_sharing',
        'profile_visibility',
        'anonymous_donations',
        'data_export_requested_at',
        'account_deletion_requested_at',
    ];

    protected function casts(): array
    {
        return [
            'anonymous_donations' => 'boolean',
            'location_sharing' => LocationSharing::class,
            'profile_visibility' => ProfileVisibility::class,
            'data_export_requested_at' => 'datetime',
            'account_deletion_requested_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
