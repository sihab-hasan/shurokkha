<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
