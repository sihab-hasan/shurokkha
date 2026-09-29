<?php

namespace Database\Factories;

use App\Models\Appeal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appeal>
 */
class AppealFactory extends Factory
{
    protected $model = Appeal::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'subject_type' => 'assistance_request',
            'subject_id' => fake()->numberBetween(1, 100),
            'reason' => fake()->paragraph(),
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'decision_notes' => null,
        ];
    }
}
