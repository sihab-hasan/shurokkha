<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseholdMember extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdMemberFactory> */
    use HasFactory;

    protected $table = 'household_members';
    protected $primaryKey = 'member_id';

    protected $fillable = [
        'household_id',
        'full_name',
        'relationship',
        'age',
        'gender',
        'phone',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'age' => 'integer',
        ];
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class, 'household_id', 'household_id');
    }
}
