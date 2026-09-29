<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    /** @use HasFactory<\Database\Factories\AlertFactory> */
    use HasFactory;

    protected $table = 'alerts';
    protected $primaryKey = 'alert_id';

    protected $fillable = [
        'disaster_id',
        'title',
        'message',
        'severity',
        'status',
        'area_description',
        'latitude',
        'longitude',
        'issued_by',
        'issued_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'issued_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function disaster(): BelongsTo
    {
        return $this->belongsTo(Disaster::class, 'disaster_id', 'disaster_id');
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }
}
