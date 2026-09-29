<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComplaintApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'role_id' => 1]);
    }

    public function test_citizen_can_submit_and_view_own_complaint(): void
    {
        $citizen = User::factory()->create();

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/complaints', [
            'subject' => 'Relief delay in my area',
            'description' => 'No distribution for 5 days.',
            'category' => 'service',
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.status', 'pending');

        $complaintId = Complaint::query()->where('user_id', $citizen->id)->firstOrFail()->complaint_id;

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/complaints')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAs($citizen)->getJson("/api/v1/auth/me/complaints/{$complaintId}")
            ->assertOk()
            ->assertJsonPath('data.subject', 'Relief delay in my area');
    }

    public function test_admin_can_review_complaint(): void
    {
        $citizen = User::factory()->create();
        $admin = $this->admin();
        $complaint = Complaint::factory()->create(['user_id' => $citizen->id]);

        $this->actingAs($admin)->patchJson("/api/v1/admin/complaints/{$complaint->complaint_id}/review", [
            'status' => 'resolved',
            'resolution_notes' => 'Distributed on next cycle.',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'resolved')
            ->assertJsonPath('data.resolution_notes', 'Distributed on next cycle.');

        $this->assertDatabaseHas('complaints', [
            'complaint_id' => $complaint->complaint_id,
            'status' => 'resolved',
        ]);
    }

    public function test_citizen_only_sees_own_complaints(): void
    {
        $citizen = User::factory()->create();
        $other = User::factory()->create();
        Complaint::factory()->create(['user_id' => $citizen->id]);
        Complaint::factory()->create(['user_id' => $other->id]);

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/complaints')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }
}
