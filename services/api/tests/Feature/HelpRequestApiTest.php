<?php

namespace Tests\Feature;

use App\Models\HelpRequest;
use App\Models\RescueTeam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HelpRequestApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'role_id' => 1]);
    }

    public function test_citizen_can_submit_help_request(): void
    {
        $citizen = User::factory()->create();

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/help-requests', [
            'request_type' => 'rescue',
            'priority' => 'critical',
            'description' => 'Family trapped on rooftop.',
            'affected_people_count' => 4,
            'address' => 'Mohammadpur, Dhaka',
            'contact_phone' => '+8801711111111',
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.priority', 'critical')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('help_requests', [
            'user_id' => $citizen->id,
            'priority' => 'critical',
        ]);
    }

    public function test_admin_can_assign_team(): void
    {
        $citizen = User::factory()->create();
        $admin = $this->admin();
        $team = RescueTeam::factory()->create();
        $hr = HelpRequest::factory()->create(['user_id' => $citizen->id]);

        $this->actingAs($admin)->patchJson("/api/v1/admin/help-requests/{$hr->help_request_id}/assign", [
            'assigned_team_id' => $team->team_id,
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'assigned')
            ->assertJsonPath('data.assigned_team_id', $team->team_id);
    }

    public function test_admin_index_sorts_by_priority(): void
    {
        $admin = $this->admin();
        HelpRequest::factory()->create(['priority' => 'low']);
        HelpRequest::factory()->create(['priority' => 'critical']);
        HelpRequest::factory()->create(['priority' => 'high']);

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/help-requests')
            ->assertOk();

        $priorities = collect($response->json('data'))->pluck('priority')->all();
        $this->assertSame(['critical', 'high', 'low'], $priorities);
    }

    public function test_citizen_only_sees_own_requests(): void
    {
        $citizen = User::factory()->create();
        $other = User::factory()->create();
        HelpRequest::factory()->create(['user_id' => $citizen->id]);
        HelpRequest::factory()->create(['user_id' => $other->id]);

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/help-requests')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }
}
