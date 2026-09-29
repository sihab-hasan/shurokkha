<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guide extends Model
{
    /** @use HasFactory<\Database\Factories\GuideFactory> */
    use HasFactory;

    protected $table = 'guides';
    protected $primaryKey = 'guide_id';

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'body',
        'category',
        'cover_image_path',
        'status',
        'reading_time_minutes',
        'author_id',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'reading_time_minutes' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
