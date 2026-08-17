<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MissingPersonReportApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_missing_person_report_crud_close_and_ownership_are_enforced(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $created = $this->actingAs($user)->post('/api/v1/citizen/missing-persons', [
            'full_name' => 'Missing Citizen',
            'age' => 27,
            'gender' => 'female',
            'photo' => UploadedFile::fake()->create('person.jpg', 100, 'image/jpeg'),
            'physical_description' => 'Wearing a blue shirt and dark trousers.',
            'distinguishing_features' => 'Small scar above the left eyebrow.',
            'last_seen_at' => now()->subHour()->toIso8601String(),
            'last_seen_location' => 'Central Market, Test City',
            'contact_phone' => '+8801700000000',
        ]);

        $created
            ->assertCreated()
            ->assertJsonPath('data.status', 'reported')
            ->assertJsonPath('data.has_photo', true);

        $id = $created->json('data.id');

        $this->actingAs($user)->getJson('/api/v1/citizen/missing-persons?search=Missing')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAs($user)->getJson("/api/v1/citizen/missing-persons/{$id}")
            ->assertOk()
            ->assertJsonPath('data.full_name', 'Missing Citizen');

        $this->actingAs($user)->get("/api/v1/citizen/missing-persons/{$id}/photo")
            ->assertOk();

        $this->actingAs($otherUser)->get("/api/v1/citizen/missing-persons/{$id}/photo")
            ->assertForbidden();

        $this->actingAs($user)->patchJson("/api/v1/citizen/missing-persons/{$id}", [
            'last_seen_location' => 'Updated Test Location',
        ])
            ->assertOk()
            ->assertJsonPath('data.last_seen_location', 'Updated Test Location');

        $this->actingAs($otherUser)->getJson("/api/v1/citizen/missing-persons/{$id}")
            ->assertForbidden();

        $this->actingAs($user)->post("/api/v1/citizen/missing-persons/{$id}", [
            '_method' => 'PATCH',
            'full_name' => 'Missing Citizen',
            'age' => '',
            'gender' => '',
            'physical_description' => '',
            'distinguishing_features' => '',
            'last_seen_at' => now()->subMinutes(30)->toIso8601String(),
            'last_seen_location' => 'Updated Test Location',
            'latitude' => '',
            'longitude' => '',
            'contact_phone' => '+8801700000000',
            'remove_photo' => '1',
        ])
            ->assertOk()
            ->assertJsonPath('data.has_photo', false)
            ->assertJsonPath('data.age', null);

        $this->actingAs($user)->get("/api/v1/citizen/missing-persons/{$id}/photo")
            ->assertNotFound();

        $this->actingAs($user)->postJson("/api/v1/citizen/missing-persons/{$id}/close", ['located' => true])
            ->assertOk()
            ->assertJsonPath('data.status', 'located');

        $this->actingAs($user)->deleteJson("/api/v1/citizen/missing-persons/{$id}")->assertNoContent();
        $this->assertSoftDeleted('missing_person_reports', ['id' => $id]);
    }
}
