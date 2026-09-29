<?php

namespace Database\Factories;

use App\Models\Volunteer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Volunteer>
 */
class VolunteerFactory extends Factory
{
    protected $model = Volunteer::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'full_name' => fake()->name(),
            'phone' => '+8801' . fake()->numerify('#########'),
            'email' => fake()->safeEmail(),
            'address' => fake()->streetAddress() . ', ' . fake()->city(),
            'skills' => implode(', ', fake()->randomElements([
                'first-aid',
                'search-and-rescue',
                'logistics',
                'translation',
                'crowd-management',
                'mental-health',
            ], 3)),
            'availability' => fake()->randomElement([
                'weekdays',
                'weekends',
                'evenings',
                'on-call',
                'full-time',
            ]),
            'motivation' => fake()->paragraph(),
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'review_notes' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status' => 'approved',
            'reviewed_at' => now()->subDay(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn () => [
            'status' => 'rejected',
            'reviewed_at' => now()->subDay(),
            'review_notes' => 'Insufficient availability.',
        ]);
    }
}
