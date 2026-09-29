<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Household extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdFactory> */
    use HasFactory;

    protected $table = 'households';
    protected $primaryKey = 'household_id';

    protected $fillable = [
        'user_id',
        'head_full_name',
        'phone',
        'address',
        'latitude',
        'longitude',
        'member_count',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'member_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(HouseholdMember::class, 'household_id', 'household_id');
    }
}
