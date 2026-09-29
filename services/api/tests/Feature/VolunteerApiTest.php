<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VolunteerApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'role_id' => 1,
        ]);
    }

    private function citizen(): User
    {
        return User::factory()->create([
            'role' => 'user',
            'role_id' => 2,
        ]);
    }

    public function test_citizen_can_submit_volunteer_application(): void
    {
        $user = $this->citizen();

        $response = $this->actingAs($user)->postJson('/api/v1/auth/me/volunteer', [
            'full_name' => 'Test Citizen',
            'phone' => '+8801712345678',
            'skills' => 'first-aid,search-and-rescue',
            'availability' => 'weekends',
        ]);
        $response->assertStatus(201);
        $this->assertEquals('pending', $response->json('data.status'));
    }

    public function test_cannot_submit_duplicate_active_application(): void
    {
        $user = $this->citizen();
        Volunteer::factory()->create(['user_id' => $user->id, 'status' => 'pending']);

        $this->actingAs($user)->postJson('/api/v1/auth/me/volunteer', [
            'full_name' => 'Duplicate',
            'phone' => '+8801712345678',
        ])->assertStatus(409);
    }

    public function test_admin_can_review_volunteer_application(): void
    {
        $admin = $this->admin();
        $volunteer = Volunteer::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($admin)->patchJson(
            "/api/v1/admin/volunteers/{$volunteer->volunteer_id}/review",
            ['status' => 'approved', 'review_notes' => 'Welcome aboard!']
        );

        $response->assertOk()
            ->assertJsonPath('data.status', 'approved')
            ->assertJsonPath('data.review_notes', 'Welcome aboard!');
        $this->assertNotNull($response->json('data.reviewed_at'));
    }
}
