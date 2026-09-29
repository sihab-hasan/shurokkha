<?php

namespace Tests\Feature;

use App\Models\LoginAudit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminLoginAuditApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'role_id' => 1]);
    }

    public function test_admin_can_list_login_audits(): void
    {
        LoginAudit::factory()->count(3)->create();
        $admin = $this->admin();

        $this->actingAs($admin)->getJson('/api/v1/admin/login-audits')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_filter_by_user_id(): void
    {
        $user = User::factory()->create();
        LoginAudit::factory()->create(['user_id' => $user->id]);
        LoginAudit::factory()->create();

        $admin = $this->admin();
        $this->actingAs($admin)->getJson("/api/v1/admin/login-audits?user_id={$user->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_filter_by_success(): void
    {
        LoginAudit::factory()->create(['successful' => true]);
        LoginAudit::factory()->create(['successful' => false]);

        $admin = $this->admin();
        $this->actingAs($admin)->getJson('/api/v1/admin/login-audits?successful=false')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_show_single_audit(): void
    {
        $admin = $this->admin();
        $audit = LoginAudit::factory()->create();

        $this->actingAs($admin)->getJson("/api/v1/admin/login-audits/{$audit->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $audit->id);
    }

    public function test_returns_404_for_missing_audit(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->getJson('/api/v1/admin/login-audits/999999')
            ->assertNotFound();
    }
}