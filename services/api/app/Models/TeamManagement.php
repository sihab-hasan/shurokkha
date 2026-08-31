<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamManagement extends Model
{
    use HasFactory;

    protected $table = 'team_management';
    protected $primaryKey = 'assignment_id';

    protected $fillable = [
        'team_id',
        'request_id',
        'status',
        'assignment_at',
    ];

    protected $casts = [
        'assignment_at' => 'datetime',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(RescueTeam::class, 'team_id', 'team_id');
    }
}
