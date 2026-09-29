<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'role_id' => 1,
        ]);
    }

    public function test_admin_can_crud_news(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin)->post('/api/v1/admin/news', [
            'title' => 'Cyclone Biparjoy approaches the coast',
            'slug' => 'cyclone-biparjoy-approaches',
            'excerpt' => 'A short summary.',
            'body' => 'The cyclone is expected to make landfall in 48 hours.',
            'category' => 'announcement',
            'status' => 'published',
        ]);
        $response->assertStatus(201);
        $newsId = $response->json('data.news_id');

        $this->actingAs($admin)->patchJson("/api/v1/admin/news/{$newsId}", [
            'status' => 'archived',
        ])->assertOk()->assertJsonPath('data.status', 'archived');

        $this->actingAs($admin)->deleteJson("/api/v1/admin/news/{$newsId}")
            ->assertNoContent();
    }

    public function test_public_news_only_returns_published(): void
    {
        $published = News::factory()->published()->create();
        News::factory()->draft()->create();

        $response = $this->getJson('/api/v1/public/news');
        $response->assertOk();
        $slugs = collect($response->json('data'))->pluck('slug');
        $this->assertContains($published->slug, $slugs);
        $this->assertCount(1, $slugs);
    }

    public function test_public_news_show_404s_on_draft(): void
    {
        $draft = News::factory()->draft()->create();
        $this->getJson("/api/v1/public/news/{$draft->slug}")->assertNotFound();
    }
}
