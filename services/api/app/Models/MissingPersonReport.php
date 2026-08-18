<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\MissingPersonStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MissingPersonReport extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'full_name',
        'age',
        'gender',
        'photo_path',
        'physical_description',
        'distinguishing_features',
        'last_seen_at',
        'last_seen_location',
        'latitude',
        'longitude',
        'contact_phone',
        'status',
        'found_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'gender' => Gender::class,
            'status' => MissingPersonStatus::class,
            'last_seen_at' => 'datetime',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'found_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
