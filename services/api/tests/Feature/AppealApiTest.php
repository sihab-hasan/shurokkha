<?php

namespace Tests\Feature;

use App\Models\Appeal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppealApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'role_id' => 1]);
    }

    public function test_citizen_can_submit_appeal(): void
    {
        $citizen = User::factory()->create();

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/appeals', [
            'subject_type' => 'assistance_request',
            'subject_id' => 42,
            'reason' => 'Request was wrongly denied.',
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('appeals', [
            'user_id' => $citizen->id,
            'subject_type' => 'assistance_request',
            'subject_id' => 42,
        ]);
    }

    public function test_admin_can_review_appeal(): void
    {
        $citizen = User::factory()->create();
        $admin = $this->admin();
        $appeal = Appeal::factory()->create(['user_id' => $citizen->id]);

        $this->actingAs($admin)->patchJson("/api/v1/admin/appeals/{$appeal->appeal_id}/review", [
            'status' => 'upheld',
            'decision_notes' => 'Reinstated after manual review.',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'upheld')
            ->assertJsonPath('data.decision_notes', 'Reinstated after manual review.');

        $this->assertNotNull($appeal->fresh()->reviewed_at);
    }

    public function test_citizen_only_sees_own_appeals(): void
    {
        $citizen = User::factory()->create();
        $other = User::factory()->create();
        Appeal::factory()->create(['user_id' => $citizen->id]);
        Appeal::factory()->create(['user_id' => $other->id]);

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/appeals')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }
}
