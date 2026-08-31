<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disaster extends Model
{
    use HasFactory;

    protected $primaryKey = 'disaster_id';

    protected $fillable = [
        'disaster_name',
        'severity',
        'status',
        'start_datetime',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
    ];

    public function affectedAreas(): HasMany
    {
        return $this->hasMany(AffectedArea::class, 'disaster_id', 'disaster_id');
    }
}
