<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'role_id' => 1]);
    }

    public function test_admin_can_list_users(): void
    {
        User::factory()->count(3)->create();
        $admin = $this->admin();

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/users')
            ->assertOk();

        $this->assertGreaterThanOrEqual(4, count($response->json('data')));
    }

    public function test_admin_can_filter_users_by_role(): void
    {
        $this->admin();
        User::factory()->count(2)->create(['role' => 'user', 'role_id' => 2]);

        $admin = $this->admin();
        $this->actingAs($admin)->getJson('/api/v1/admin/users?role=user')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_user(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->postJson('/api/v1/admin/users', [
            'name' => 'New Citizen',
            'email' => 'new@example.com',
            'password' => 'password123',
            'role' => 'user',
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.email', 'new@example.com')
            ->assertJsonPath('data.role', 'user')
            ->assertJsonPath('data.status', 'active');

        $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
    }

    public function test_admin_can_update_user(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create();

        $this->actingAs($admin)->patchJson("/api/v1/admin/users/{$user->id}", [
            'full_name' => 'Updated Name',
            'status' => 'suspended',
        ])
            ->assertOk()
            ->assertJsonPath('data.full_name', 'Updated Name')
            ->assertJsonPath('data.status', 'suspended');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'status' => 'suspended',
        ]);
    }

    public function test_admin_can_soft_delete_user(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create();

        $this->actingAs($admin)->deleteJson("/api/v1/admin/users/{$user->id}")
            ->assertNoContent();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'status' => 'deleted',
        ]);
    }

    public function test_admin_can_restore_user(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create(['status' => 'deleted']);

        $this->actingAs($admin)->postJson("/api/v1/admin/users/{$user->id}/restore")
            ->assertOk()
            ->assertJsonPath('data.status', 'active');
    }

    public function test_admin_can_assign_role(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create(['role' => 'user', 'role_id' => 2]);

        $this->actingAs($admin)->postJson("/api/v1/admin/users/{$user->id}/assign-role", [
            'role' => 'admin',
            'role_id' => 1,
        ])
            ->assertOk()
            ->assertJsonPath('data.role', 'admin')
            ->assertJsonPath('data.role_id', 1);
    }
}