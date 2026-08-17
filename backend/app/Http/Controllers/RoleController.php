<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // সমস্ত Roles দেখতে
    public function index()
    {
        return response()->json(Role::all(), 200);
    }

    // ফ্রন্টএন্ড থেকে নতুন Role ডাটাবেসে সেভ করতে
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $role = Role::create($validated);

        return response()->json([
            'message' => 'Role created successfully!',
            'data' => $role
        ], 201);
    }
}