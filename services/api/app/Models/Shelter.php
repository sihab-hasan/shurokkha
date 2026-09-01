<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shelter extends Model
{
    use HasFactory;

    protected $primaryKey = 'shelter_id';

    protected $fillable = [
        'area_id',
        'shelter_name',
        'capacity',
        'occupancy',
        'status',
    ];

    public function affectedArea(): BelongsTo
    {
        return $this->belongsTo(AffectedArea::class, 'area_id', 'area_id');
    }

    public function distributions(): HasMany
    {
        return $this->hasMany(ReliefDistribution::class, 'shelter_id', 'shelter_id');
    }
}
