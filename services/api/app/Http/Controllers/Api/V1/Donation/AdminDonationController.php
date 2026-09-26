<?php

namespace App\Http\Controllers\Api\V1\Donation;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDonationController extends Controller
{
    public function index(): JsonResponse
    {
        $donations = Donation::latest()->get();

        return response()->json(['data' => $donations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'donation_kind' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'status' => 'sometimes|string|max:50',
        ]);

        $donation = Donation::create($validated);

        return response()->json(['data' => $donation], 201);
    }

    public function destroy(Donation $donation): JsonResponse
    {
        $donation->delete();

        return response()->json(null, 204);
    }
}
