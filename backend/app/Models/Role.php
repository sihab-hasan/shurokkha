<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    // প্রাইমারি কী role_id নির্ধারণ
    protected $primaryKey = 'role_id';

    // ফ্রন্টএন্ড থেকে এই ফিল্ডগুলো ইনপুট নেওয়া যাবে
    protected $fillable = [
        'role_name',
        'description'
    ];
}