<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\LoginAudit;
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

        $this->recordLoginAudit($request, $user);

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
            LoginAudit::query()->create([
                'user_id' => null,
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 512),
                'successful' => false,
                'failure_reason' => 'invalid_credentials',
                'signed_in_at' => now(),
            ]);

            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 422);
        }

        $request->session()->regenerate();

        /** @var User $user */
        $user = $request->user();

        $this->recordLoginAudit($request, $user);

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
        $this->recordLogout($request);

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(status: 204);
    }

    private function recordLoginAudit(Request $request, User $user): void
    {
        LoginAudit::query()->create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 512),
            'session_token_hash' => $request->session()->getId()
                ? hash('sha256', $request->session()->getId())
                : null,
            'successful' => true,
            'signed_in_at' => now(),
        ]);
    }

    private function recordLogout(Request $request): void
    {
        if (! $request->user()) {
            return;
        }

        $sessionId = $request->session()->getId();
        if (! $sessionId) {
            return;
        }

        LoginAudit::query()
            ->where('user_id', $request->user()->id)
            ->where('session_token_hash', hash('sha256', $sessionId))
            ->whereNull('signed_out_at')
            ->update(['signed_out_at' => now()]);
    }
}
