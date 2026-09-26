<?php

namespace Tests\Feature;

use App\Models\AssistanceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssistanceRequestApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_assistance_request_crud_cancel_and_ownership_are_enforced(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/v1/assistance-requests', [
            'type' => 'medical',
            'priority' => 'critical',
            'description' => 'A family member needs urgent medical transport.',
            'affected_people_count' => 2,
            'contact_phone' => '+8801700000000',
            'address' => 'Ward 5, Shurokkha Test Area',
            'latitude' => 23.8103,
            'longitude' => 90.4125,
        ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'submitted');

        $id = $created->json('data.id');

        $this->actingAs($user)->getJson('/api/v1/assistance-requests?type=medical&search=medical')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAs($user)->getJson("/api/v1/assistance-requests/{$id}")
            ->assertOk()
            ->assertJsonPath('data.id', $id);

        $this->actingAs($user)->patchJson("/api/v1/assistance-requests/{$id}", [
            'affected_people_count' => 3,
            'description' => 'Three people now need urgent medical transport.',
        ])
            ->assertOk()
            ->assertJsonPath('data.affected_people_count', 3);

        $this->actingAs($otherUser)->getJson("/api/v1/assistance-requests/{$id}")
            ->assertForbidden();

        $this->actingAs($user)->postJson("/api/v1/assistance-requests/{$id}/cancel")
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');

        $this->actingAs($user)->patchJson("/api/v1/assistance-requests/{$id}", [
            'description' => 'This should not be accepted after cancellation.',
        ])->assertConflict();

        $this->actingAs($user)->deleteJson("/api/v1/assistance-requests/{$id}")->assertNoContent();
        $this->assertSoftDeleted('emergency_requests', ['request_id' => $id]);
    }

    public function test_user_can_use_routes_granted_by_permissions(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/assistance-requests')
            ->assertOk();
    }

    public function test_assistance_routes_require_authentication(): void
    {
        $request = AssistanceRequest::factory()->create();

        $this->getJson("/api/v1/assistance-requests/{$request->id}")->assertUnauthorized();
    }
}
