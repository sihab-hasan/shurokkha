<?php

namespace App\Models;

use App\Enums\AssistanceRequestPriority;
use App\Enums\AssistanceRequestStatus;
use App\Enums\AssistanceRequestType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssistanceRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'emergency_requests';

    protected $primaryKey = 'request_id';

    protected $fillable = [
        'request_id',
        'user_id',
        'area_id',
        'type',
        'priority',
        'description',
        'affected_people_count',
        'contact_phone',
        'address',
        'status',
        'request_at',
        'submitted_at',
        'cancelled_at',
        'resolved_at',
    ];

    public function getIdAttribute(): string
    {
        return (string) $this->attributes['request_id'];
    }

    protected static function booted(): void
    {
        static::creating(function (AssistanceRequest $model): void {
            if (empty($model->request_at)) {
                $model->request_at = now();
            }
            if (empty($model->submitted_at)) {
                $model->submitted_at = now();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'type' => AssistanceRequestType::class,
            'priority' => AssistanceRequestPriority::class,
            'status' => AssistanceRequestStatus::class,
            'affected_people_count' => 'integer',
            'request_at' => 'datetime',
            'submitted_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function affectedArea(): BelongsTo
    {
        return $this->belongsTo(AffectedArea::class, 'area_id', 'area_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TeamManagement::class, 'request_id', 'request_id');
    }

    public function distributions(): BelongsToMany
    {
        return $this->belongsToMany(ReliefDistribution::class, 'distribution_requests', 'request_id', 'distribution_id');
    }
}
