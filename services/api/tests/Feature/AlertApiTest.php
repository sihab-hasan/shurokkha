<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AlertApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'role_id' => 1,
        ]);
    }

    public function test_admin_can_crud_alert(): void
    {
        $admin = $this->admin();

        // Create
        $response = $this->actingAs($admin)->post('/api/v1/admin/alerts', [
            'title' => 'Flash flood warning',
            'message' => 'Heavy rainfall expected. Move to higher ground.',
            'severity' => 'critical',
            'status' => 'active',
        ]);
        $response->assertStatus(201);
        $response->assertJsonPath('data.title', 'Flash flood warning');
        $alertId = $response->json('data.alert_id');

        // Read
        $this->actingAs($admin)->getJson("/api/v1/admin/alerts/{$alertId}")
            ->assertOk()
            ->assertJsonPath('data.alert_id', $alertId);

        // Update
        $this->actingAs($admin)->patchJson("/api/v1/admin/alerts/{$alertId}", [
            'status' => 'expired',
        ])->assertOk()->assertJsonPath('data.status', 'expired');

        // Delete
        $this->actingAs($admin)->deleteJson("/api/v1/admin/alerts/{$alertId}")
            ->assertNoContent();
        $this->assertDatabaseMissing('alerts', ['alert_id' => $alertId]);
    }

    public function test_public_alerts_endpoint_filters_expired(): void
    {
        $active = Alert::factory()->active()->create();
        Alert::factory()->expired()->create();

        $response = $this->getJson('/api/v1/public/alerts');
        $response->assertOk();
        $ids = collect($response->json('data'))->pluck('alert_id');
        $this->assertContains($active->alert_id, $ids);
        $this->assertCount(1, $ids);

        // include_expired surfaces both
        $response = $this->getJson('/api/v1/public/alerts?include_expired=1');
        $this->assertCount(2, $response->json('data'));
    }
}
