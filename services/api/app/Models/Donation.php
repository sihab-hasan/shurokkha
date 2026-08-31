<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $primaryKey = 'donation_id';

    protected $fillable = [
        'donation_kind',
        'amount',
        'status',
    ];

    protected $casts = [
        'amount' => 'float',
    ];
}
