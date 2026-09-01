<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Resource extends Model
{
    use HasFactory;

    protected $primaryKey = 'resource_id';

    protected $fillable = ['resource_name', 'category_id', 'unit'];

    public function warehouses(): BelongsToMany
    {
        return $this->belongsToMany(Warehouse::class, 'warehouse_resources', 'resource_id', 'warehouse_id')->withPivot('quantity');
    }

    public function distributions(): BelongsToMany
    {
        return $this->belongsToMany(ReliefDistribution::class, 'distribution_resources', 'resource_id', 'distribution_id')->withPivot('quantity');
    }
}
