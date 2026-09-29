<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'excerpt' => fake()->sentence(15),
            'body' => fake()->paragraphs(4, true),
            'cover_image_path' => null,
            'category' => fake()->randomElement(['general', 'response', 'recovery', 'announcement']),
            'status' => fake()->randomElement(['draft', 'published']),
            'author_id' => null,
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}
