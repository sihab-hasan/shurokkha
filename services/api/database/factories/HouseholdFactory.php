<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Household>
 */
class HouseholdFactory extends Factory
{
    protected $model = Household::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'head_full_name' => fake()->name(),
            'phone' => '+8801' . fake()->numerify('#########'),
            'address' => fake()->streetAddress() . ', ' . fake()->city(),
            'latitude' => fake()->latitude(20.5, 26.6),
            'longitude' => fake()->longitude(88.0, 92.7),
            'member_count' => fake()->numberBetween(2, 8),
            'notes' => null,
        ];
    }
}
