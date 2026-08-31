<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Disaster;
use Illuminate\Http\JsonResponse;

class DisasterController extends Controller
{
    public function index(): JsonResponse
    {
        $disasters = Disaster::all();
        return response()->json(['data' => $disasters]);
    }
}
