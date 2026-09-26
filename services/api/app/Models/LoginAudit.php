<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginAudit extends Model
{
    protected $table = 'login_audits';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'session_token_hash',
        'successful',
        'failure_reason',
        'signed_in_at',
        'signed_out_at',
    ];

    protected function casts(): array
    {
        return [
            'successful' => 'boolean',
            'signed_in_at' => 'datetime',
            'signed_out_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}