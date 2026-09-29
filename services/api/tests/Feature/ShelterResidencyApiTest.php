<?php

namespace Tests\Feature;

use App\Models\Shelter;
use App\Models\ShelterResidency;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShelterResidencyApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'role_id' => 1]);
    }

    public function test_citizen_can_check_in_and_out(): void
    {
        $citizen = User::factory()->create();
        $shelter = Shelter::factory()->create();

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/shelter-residency', [
            'shelter_id' => $shelter->shelter_id,
            'full_name' => 'Refugee Name',
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.status', 'checked_in');

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/shelter-residency')
            ->assertOk()
            ->assertJsonPath('data.status', 'checked_in');

        $this->actingAs($citizen)->patchJson('/api/v1/auth/me/shelter-residency/checkout')
            ->assertOk()
            ->assertJsonPath('data.status', 'checked_out');
    }

    public function test_citizen_cannot_double_check_in(): void
    {
        $citizen = User::factory()->create();
        $shelter = Shelter::factory()->create();

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/shelter-residency', [
            'shelter_id' => $shelter->shelter_id,
            'full_name' => 'Refugee Name',
        ])->assertStatus(201);

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/shelter-residency', [
            'shelter_id' => $shelter->shelter_id,
            'full_name' => 'Refugee Name',
        ])->assertStatus(409);
    }

    public function test_admin_can_view_and_checkout_others(): void
    {
        $citizen = User::factory()->create();
        $admin = $this->admin();
        $shelter = Shelter::factory()->create();
        $residency = ShelterResidency::factory()->create([
            'user_id' => $citizen->id,
            'shelter_id' => $shelter->shelter_id,
        ]);

        $this->actingAs($admin)->getJson("/api/v1/admin/shelter-residencies/{$residency->residency_id}")
            ->assertOk();

        $this->actingAs($admin)->patchJson("/api/v1/admin/shelter-residencies/{$residency->residency_id}/checkout")
            ->assertOk()
            ->assertJsonPath('data.status', 'checked_out');
    }
}