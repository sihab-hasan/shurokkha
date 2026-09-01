<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function csrf(): JsonResponse
    {
        // The `web` middleware adds Laravel's XSRF-TOKEN cookie to this
        // response. The authentication/session cookie itself remains HttpOnly.
        return response()->json(['csrf' => 'ready']);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create($request->validated());

        \Illuminate\Support\Facades\DB::table('users')
            ->where('id', $user->id)
            ->update([
                'user_id' => $user->id,
                'full_name' => $user->name,
                'phone' => '01700000000',
                'status' => 'active',
                'role_id' => 2,
            ]);

        $user->refresh();

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'status' => 'success',
            'message' => 'Account created successfully.',
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->safe()->only(['email', 'password']);
        $remember = (bool) $request->validated('remember', false);

        if (! Auth::guard('web')->attempt($credentials, $remember)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 422);
        }

        $request->session()->regenerate();

        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'message' => 'Signed in successfully.',
            'user' => new UserResource($user),
        ]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(status: 204);
    }
}
