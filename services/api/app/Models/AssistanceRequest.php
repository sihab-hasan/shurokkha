<?php

namespace App\Models;

use App\Enums\AssistanceRequestPriority;
use App\Enums\AssistanceRequestStatus;
use App\Enums\AssistanceRequestType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssistanceRequest extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'priority',
        'description',
        'affected_people_count',
        'contact_phone',
        'address',
        'latitude',
        'longitude',
        'status',
        'submitted_at',
        'cancelled_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => AssistanceRequestType::class,
            'priority' => AssistanceRequestPriority::class,
            'status' => AssistanceRequestStatus::class,
            'affected_people_count' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'submitted_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
