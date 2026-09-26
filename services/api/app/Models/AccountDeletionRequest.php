<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountDeletionRequest extends Model
{
    protected $table = 'account_deletion_requests';

    public const STATUS_PENDING = 'pending';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    /** Default grace period before a deletion actually goes through. */
    public const GRACE_DAYS = 14;

    protected $fillable = [
        'user_id',
        'status',
        'scheduled_for',
        'reason',
        'cancelled_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_for' => 'datetime',
            'cancelled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function defaultSchedule(): CarbonImmutable
    {
        return CarbonImmutable::now()->addDays(self::GRACE_DAYS);
    }
}