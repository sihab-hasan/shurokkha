<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upload_document(): void
    {
        Storage::fake('local');
        $citizen = User::factory()->create();
        $file = UploadedFile::fake()->create('nid.pdf', 100, 'application/pdf');

        $this->actingAs($citizen)->postJson('/api/v1/auth/me/documents', [
            'document_type' => 'nid',
            'title' => 'National ID',
            'description' => 'Front and back',
            'file' => $file,
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.title', 'National ID')
            ->assertJsonPath('data.document_type', 'nid');

        $doc = Document::query()->where('user_id', $citizen->id)->firstOrFail();
        Storage::disk('local')->assertExists($doc->file_path);
    }

    public function test_user_only_sees_own_documents(): void
    {
        $citizen = User::factory()->create();
        $other = User::factory()->create();
        Document::factory()->create(['user_id' => $citizen->id]);
        Document::factory()->create(['user_id' => $other->id]);

        $this->actingAs($citizen)->getJson('/api/v1/auth/me/documents')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_user_cannot_access_other_users_document(): void
    {
        $citizen = User::factory()->create();
        $other = User::factory()->create();
        $doc = Document::factory()->create(['user_id' => $citizen->id]);

        $this->actingAs($other)->getJson("/api/v1/auth/me/documents/{$doc->document_id}")
            ->assertForbidden();
    }

    public function test_user_can_delete_own_document(): void
    {
        Storage::fake('local');
        $citizen = User::factory()->create();
        $doc = Document::factory()->create(['user_id' => $citizen->id]);

        $this->actingAs($citizen)->deleteJson("/api/v1/auth/me/documents/{$doc->document_id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('documents', ['document_id' => $doc->document_id]);
    }
}