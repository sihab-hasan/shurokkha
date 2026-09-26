<?php

namespace App\Models;

use App\Enums\DigestCadence;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'email_enabled',
        'sms_enabled',
        'push_enabled',
        'quiet_hours_start',
        'quiet_hours_end',
        'digest_cadence',
        'preferences_json',
    ];

    protected function casts(): array
    {
        return [
            'email_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
            'push_enabled' => 'boolean',
            'quiet_hours_start' => 'datetime:H:i',
            'quiet_hours_end' => 'datetime:H:i',
            'digest_cadence' => DigestCadence::class,
            'preferences_json' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
