<?php

namespace Tests\Feature;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeedbackApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'role_id' => 1]);
    }

    public function test_citizen_can_submit_feedback_and_list_own(): void
    {
        $citizen = User::factory()->create();

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/feedback', [
            'subject' => 'Great volunteer team',
            'message' => 'They were very helpful during the flood.',
            'rating' => 5,
            'category' => 'service',
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.rating', 5);

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/feedback')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_respond_to_feedback(): void
    {
        $citizen = User::factory()->create();
        $admin = $this->admin();
        $feedback = Feedback::factory()->create(['user_id' => $citizen->id]);

        $this->actingAs($admin)->patchJson("/api/v1/admin/feedback/{$feedback->feedback_id}/respond", [
            'response' => 'Thank you for the kind words.',
            'status' => 'reviewed',
        ])
            ->assertOk()
            ->assertJsonPath('data.response', 'Thank you for the kind words.')
            ->assertJsonPath('data.status', 'reviewed');
    }

    public function test_citizen_cannot_see_other_feedback(): void
    {
        $citizen = User::factory()->create();
        $other = User::factory()->create();
        Feedback::factory()->create(['user_id' => $other->id]);

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/feedback')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
