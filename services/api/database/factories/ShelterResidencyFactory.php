<?php

namespace Database\Factories;

use App\Models\ShelterResidency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShelterResidency>
 */
class ShelterResidencyFactory extends Factory
{
    protected $model = ShelterResidency::class;

    public function definition(): array
    {
        return [
            'shelter_id' => null,
            'user_id' => null,
            'household_id' => null,
            'full_name' => fake()->name(),
            'phone' => '+8801' . fake()->numerify('#########'),
            'age' => fake()->numberBetween(5, 80),
            'gender' => fake()->randomElement(['female', 'male', 'other']),
            'notes' => null,
            'status' => 'checked_in',
            'checked_in_at' => now()->subHours(2),
            'checked_out_at' => null,
        ];
    }

    public function checkedOut(): static
    {
        return $this->state(fn () => [
            'status' => 'checked_out',
            'checked_out_at' => now()->subHour(),
        ]);
    }
}
