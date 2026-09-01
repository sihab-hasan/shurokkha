<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    use HasFactory;

    protected $primaryKey = 'warehouse_id';

    protected $fillable = [
        'warehouse_name',
        'location_id',
        'manager_id',
    ];

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function resources(): BelongsToMany
    {
        return $this->belongsToMany(Resource::class, 'warehouse_resources', 'warehouse_id', 'resource_id')
            ->withPivot('quantity');
    }

    public function distributions(): HasMany
    {
        return $this->hasMany(ReliefDistribution::class, 'warehouse_id', 'warehouse_id');
    }
}
