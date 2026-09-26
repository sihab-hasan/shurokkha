<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_register_and_receive_a_session(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'User One',
            'email' => 'user@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.email', 'user@example.com')
            ->assertJsonPath('user.role', 'user')
            ->assertJsonMissingPath('token');

        $user = User::query()->where('email', 'user@example.com')->firstOrFail();

        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseHas('users', ['email' => 'user@example.com']);
    }

    public function test_a_user_can_login_read_me_and_logout_with_session_cookie_auth(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'user@example.com',
            'password' => 'password123',
            'remember' => true,
        ])
            ->assertOk()
            ->assertJsonMissingPath('token');

        $this->assertAuthenticatedAs($user);

        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.role', 'user');

        $this->postJson('/api/v1/auth/logout')->assertNoContent();
        $this->assertGuest();
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_csrf_bootstrap_route_is_available(): void
    {
        $this->getJson('/api/v1/auth/csrf')
            ->assertOk()
            ->assertJsonPath('csrf', 'ready');
    }
}
