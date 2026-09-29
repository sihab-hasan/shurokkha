<?php

namespace Tests\Feature;

use App\Models\Fundraise;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FundraiseApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'role_id' => 1,
        ]);
    }

    public function test_admin_can_crud_fundraise(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin)->post('/api/v1/admin/fundraises', [
            'title' => 'Help rebuild Sylhet',
            'slug' => 'help-rebuild-sylhet',
            'summary' => 'Funds for rebuilding flood-damaged homes.',
            'description' => 'Long-form description here.',
            'goal_amount' => 500000,
            'currency' => 'BDT',
            'status' => 'active',
            'beneficiary_name' => 'Sylhet flood victims',
        ]);
        $response->assertStatus(201);
        $fundraiseId = $response->json('data.fundraise_id');

        $this->actingAs($admin)->patchJson("/api/v1/admin/fundraises/{$fundraiseId}", [
            'status' => 'paused',
        ])->assertOk()->assertJsonPath('data.status', 'paused');

        $this->actingAs($admin)->deleteJson("/api/v1/admin/fundraises/{$fundraiseId}")
            ->assertNoContent();
    }

    public function test_public_fundraise_show_by_slug(): void
    {
        $campaign = Fundraise::factory()->active()->create();

        $this->getJson("/api/v1/public/fundraises/{$campaign->slug}")
            ->assertOk()
            ->assertJsonPath('data.fundraise_id', $campaign->fundraise_id);
    }
}
