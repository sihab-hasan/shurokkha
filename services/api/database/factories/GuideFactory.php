<?php

namespace Database\Factories;

use App\Models\Guide;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Guide>
 */
class GuideFactory extends Factory
{
    protected $model = Guide::class;

    public function definition(): array
    {
        $title = fake()->sentence(5);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'summary' => fake()->sentence(12),
            'body' => fake()->paragraphs(5, true),
            'category' => fake()->randomElement(['preparedness', 'during', 'after', 'legal']),
            'cover_image_path' => null,
            'status' => fake()->randomElement(['draft', 'published']),
            'reading_time_minutes' => fake()->numberBetween(3, 20),
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
}
