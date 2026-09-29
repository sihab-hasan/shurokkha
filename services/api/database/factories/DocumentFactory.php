<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'document_type' => fake()->randomElement(['nid', 'photo', 'evidence', 'other']),
            'title' => fake()->sentence(4),
            'description' => fake()->sentence(),
            'file_path' => 'documents/test/' . fake()->uuid() . '.pdf',
            'file_name' => fake()->word() . '.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => fake()->numberBetween(50000, 5000000),
            'status' => 'uploaded',
        ];
    }
}
