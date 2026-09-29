<?php

namespace Database\Factories;

use App\Models\Feedback;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Feedback>
 */
class FeedbackFactory extends Factory
{
    protected $model = Feedback::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'subject' => fake()->randomElement([
                'App is great',
                'Feature request',
                'Bug report',
                'Suggestion',
                'Compliment',
            ]),
            'message' => fake()->paragraph(),
            'rating' => fake()->numberBetween(1, 5),
            'category' => fake()->randomElement(['general', 'app', 'service', 'other']),
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'response' => null,
        ];
    }
}
