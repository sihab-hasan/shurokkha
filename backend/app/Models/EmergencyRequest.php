<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmergencyRequest extends Model
{
    use HasFactory;

    protected $table = 'emergency_requests';

    public $timestamps = false;

    protected $fillable = [
        'user_name',
        'phone_number',
        'shelter_id',
        'disaster_type_id',
        'status',
    ];
}
