<?php

namespace Database\Factories;

use App\Models\Fundraise;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Fundraise>
 */
class FundraiseFactory extends Factory
{
    protected $model = Fundraise::class;

    public function definition(): array
    {
        $title = fake()->sentence(5);
        $goal = fake()->randomFloat(2, 10000, 5000000);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'summary' => fake()->sentence(12),
            'description' => fake()->paragraphs(3, true),
            'cover_image_path' => null,
            'goal_amount' => $goal,
            'raised_amount' => fake()->randomFloat(2, 0, $goal),
            'currency' => 'BDT',
            'status' => fake()->randomElement(['active', 'paused', 'completed']),
            'starts_at' => now()->subDays(7),
            'ends_at' => now()->addDays(60),
            'organizer_id' => null,
            'beneficiary_name' => fake()->company(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status' => 'active',
            'starts_at' => now()->subDays(7),
            'ends_at' => now()->addDays(60),
        ]);
    }
}
