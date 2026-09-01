<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Donation extends Model
{
    use HasFactory;

    protected $primaryKey = 'donation_id';

    protected $fillable = [
        'user_id',
        'donation_kind',
        'amount',
        'status',
    ];

    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function distributions(): BelongsToMany
    {
        return $this->belongsToMany(ReliefDistribution::class, 'donation_allocations', 'donation_id', 'distribution_id')
            ->withPivot('allocated_amount');
    }

    protected $casts = [
        'amount' => 'float',
    ];
}
