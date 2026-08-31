<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RescueTeam extends Model
{
    use HasFactory;

    protected $primaryKey = 'team_id';

    protected $fillable = [
        'team_name',
        'team_type',
        'availability',
    ];

    public function assignments(): HasMany
    {
        return $this->hasMany(TeamManagement::class, 'team_id', 'team_id');
    }
}
