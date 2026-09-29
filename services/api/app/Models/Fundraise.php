<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fundraise extends Model
{
    /** @use HasFactory<\Database\Factories\FundraiseFactory> */
    use HasFactory;

    protected $table = 'fundraises';
    protected $primaryKey = 'fundraise_id';

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'cover_image_path',
        'goal_amount',
        'raised_amount',
        'currency',
        'status',
        'starts_at',
        'ends_at',
        'organizer_id',
        'beneficiary_name',
    ];

    protected function casts(): array
    {
        return [
            'goal_amount' => 'decimal:2',
            'raised_amount' => 'decimal:2',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }
}
