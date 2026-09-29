<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Appeal extends Model
{
    /** @use HasFactory<\Database\Factories\AppealFactory> */
    use HasFactory;

    protected $table = 'appeals';
    protected $primaryKey = 'appeal_id';

    protected $fillable = [
        'user_id',
        'subject_type',
        'subject_id',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
        'decision_notes',
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

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
