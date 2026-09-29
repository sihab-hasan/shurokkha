<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpRequest extends Model
{
    /** @use HasFactory<\Database\Factories\HelpRequestFactory> */
    use HasFactory;

    protected $table = 'help_requests';
    protected $primaryKey = 'help_request_id';

    protected $fillable = [
        'user_id',
        'disaster_id',
        'request_type',
        'priority',
        'description',
        'affected_people_count',
        'address',
        'latitude',
        'longitude',
        'contact_phone',
        'status',
        'assigned_team_id',
        'reviewed_by',
        'reviewed_at',
        'resolution_notes',
    ];

    protected function casts(): array
    {
        return [
            'affected_people_count' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function disaster(): BelongsTo
    {
        return $this->belongsTo(Disaster::class, 'disaster_id', 'disaster_id');
    }

    public function assignedTeam(): BelongsTo
    {
        return $this->belongsTo(RescueTeam::class, 'assigned_team_id', 'team_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
