<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
