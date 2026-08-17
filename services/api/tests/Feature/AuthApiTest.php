<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_citizen_can_register_and_receive_a_session(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Citizen One',
            'email' => 'citizen@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.email', 'citizen@example.com')
            ->assertJsonPath('user.role', 'citizen')
            ->assertJsonMissingPath('token');

        $user = User::query()->where('email', 'citizen@example.com')->firstOrFail();

        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseHas('users', ['email' => 'citizen@example.com']);
    }

    public function test_a_citizen_can_login_read_me_and_logout_with_session_cookie_auth(): void
    {
        $user = User::factory()->create([
            'email' => 'citizen@example.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'citizen@example.com',
            'password' => 'password123',
            'remember' => true,
        ])
            ->assertOk()
            ->assertJsonMissingPath('token');

        $this->assertAuthenticatedAs($user);

        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.role', 'citizen');

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
