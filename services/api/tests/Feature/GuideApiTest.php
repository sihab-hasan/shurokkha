<?php

namespace Tests\Feature;

use App\Models\Guide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuideApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'role_id' => 1,
        ]);
    }

    public function test_admin_can_crud_guide(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin)->post('/api/v1/admin/guides', [
            'title' => 'Before the flood: a checklist',
            'slug' => 'before-the-flood',
            'summary' => 'What to do before a flood.',
            'body' => 'Detailed checklist here.',
            'category' => 'preparedness',
            'status' => 'published',
            'reading_time_minutes' => 8,
        ]);
        $response->assertStatus(201);
        $guideId = $response->json('data.guide_id');

        $this->actingAs($admin)->patchJson("/api/v1/admin/guides/{$guideId}", [
            'reading_time_minutes' => 12,
        ])->assertOk()->assertJsonPath('data.reading_time_minutes', 12);

        $this->actingAs($admin)->deleteJson("/api/v1/admin/guides/{$guideId}")
            ->assertNoContent();
    }

    public function test_public_guides_filter_by_category(): void
    {
        $prep = Guide::factory()->published()->create(['category' => 'preparedness']);
        Guide::factory()->published()->create(['category' => 'legal']);

        $response = $this->getJson('/api/v1/public/guides?category=preparedness');
        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($prep->slug, $response->json('data.0.slug'));
    }
}
