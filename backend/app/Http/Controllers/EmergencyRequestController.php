<?php

namespace App\Http\Controllers;

use App\Models\EmergencyRequest;
use Illuminate\Http\Request;

class EmergencyRequestController extends Controller
{
    // সমস্ত Emergency Requests তালিকা দেখতে
    public function index()
    {
        $requests = EmergencyRequest::orderBy('id', 'desc')->get();
        return response()->json($requests, 200);
    }

    // ফ্রন্টএন্ড থেকে নতুন Emergency Request সংরক্ষণ করতে
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:100',
            'phone_number' => 'required|string|max:20',
            'shelter_id' => 'nullable|integer',
            'disaster_type_id' => 'nullable|integer',
            'status' => 'nullable|string|max:50',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'Pending';
        }

        $emergencyRequest = EmergencyRequest::create($validated);

        return response()->json([
            'message' => 'Emergency request submitted successfully!',
            'data' => $emergencyRequest
        ], 201);
    }
}
