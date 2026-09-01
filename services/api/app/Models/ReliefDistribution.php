<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ReliefDistribution extends Model
{
    use HasFactory;

    protected $primaryKey = 'distribution_id';

    protected $fillable = ['area_id', 'warehouse_id', 'shelter_id', 'status', 'delivered_at'];

    protected $casts = ['delivered_at' => 'datetime'];

    public function affectedArea(): BelongsTo
    {
        return $this->belongsTo(AffectedArea::class, 'area_id', 'area_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'warehouse_id');
    }

    public function shelter(): BelongsTo
    {
        return $this->belongsTo(Shelter::class, 'shelter_id', 'shelter_id');
    }

    public function requests(): BelongsToMany
    {
        return $this->belongsToMany(AssistanceRequest::class, 'distribution_requests', 'distribution_id', 'request_id');
    }

    public function resources(): BelongsToMany
    {
        return $this->belongsToMany(Resource::class, 'distribution_resources', 'distribution_id', 'resource_id')->withPivot('quantity');
    }

    public function donations(): BelongsToMany
    {
        return $this->belongsToMany(Donation::class, 'donation_allocations', 'distribution_id', 'donation_id')->withPivot('allocated_amount');
    }
}
