<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Volunteer extends Model
{
    /** @use HasFactory<\Database\Factories\VolunteerFactory> */
    use HasFactory;

    protected $table = 'volunteers';
    protected $primaryKey = 'volunteer_id';

    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'email',
        'address',
        'skills',
        'availability',
        'motivation',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
