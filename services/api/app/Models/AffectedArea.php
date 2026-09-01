<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AffectedArea extends Model
{
    use HasFactory;

    protected $primaryKey = 'area_id';

    protected $fillable = [
        'disaster_id',
        'location_id',
        'affected_population',
        'severity',
    ];

    public function disaster(): BelongsTo
    {
        return $this->belongsTo(Disaster::class, 'disaster_id', 'disaster_id');
    }

    public function emergencyRequests(): HasMany
    {
        return $this->hasMany(AssistanceRequest::class, 'area_id', 'area_id');
    }

    public function shelters(): HasMany
    {
        return $this->hasMany(Shelter::class, 'area_id', 'area_id');
    }

    public function distributions(): HasMany
    {
        return $this->hasMany(ReliefDistribution::class, 'area_id', 'area_id');
    }
}
