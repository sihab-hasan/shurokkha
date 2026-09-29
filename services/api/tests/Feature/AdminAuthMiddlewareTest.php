<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_caller_is_rejected(): void
    {
        // No actingAs — no auth. Both GET and POST should return 401
        // because the `auth` middleware runs before the FormRequest.
        $this->getJson('/api/v1/admin/users')->assertUnauthorized();
        $this->postJson('/api/v1/admin/users', [])->assertUnauthorized();
    }

    public function test_citizen_is_forbidden(): void
    {
        $citizen = User::factory()->create();

        $this->actingAs($citizen)->getJson('/api/v1/admin/users')
            ->assertForbidden()
            ->assertJsonPath('message', 'This action requires the admin role.');
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'role_id' => 1]);

        $this->actingAs($admin)->getJson('/api/v1/admin/users')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_access_other_admin_endpoints(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'role_id' => 1]);

        $this->actingAs($admin)->getJson('/api/v1/admin/login-audits')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_citizen_cannot_access_login_audits(): void
    {
        $citizen = User::factory()->create();

        $this->actingAs($citizen)->getJson('/api/v1/admin/login-audits')
            ->assertForbidden();
    }
}