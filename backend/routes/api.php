<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController; // RoleController ইমপোর্ট করা হয়েছে
use App\Http\Controllers\EmergencyRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Backend API is running and connected!'
    ]);
});

// Authentication endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Role API endpoints (ধাপ ২.২)
Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);

// Emergency Requests API endpoints
Route::get('/emergency-requests', [EmergencyRequestController::class, 'index']);
Route::post('/emergency-requests', [EmergencyRequestController::class, 'store']);