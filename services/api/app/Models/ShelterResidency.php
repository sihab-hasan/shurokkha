<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShelterResidency extends Model
{
    /** @use HasFactory<\Database\Factories\ShelterResidencyFactory> */
    use HasFactory;

    protected $table = 'shelter_residencies';
    protected $primaryKey = 'residency_id';

    protected $fillable = [
        'shelter_id',
        'user_id',
        'household_id',
        'full_name',
        'phone',
        'age',
        'gender',
        'notes',
        'status',
        'checked_in_at',
        'checked_out_at',
    ];

    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'checked_in_at' => 'datetime',
            'checked_out_at' => 'datetime',
        ];
    }

    public function shelter(): BelongsTo
    {
        return $this->belongsTo(Shelter::class, 'shelter_id', 'shelter_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class, 'household_id', 'household_id');
    }
}
