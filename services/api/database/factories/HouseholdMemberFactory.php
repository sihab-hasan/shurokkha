<?php

namespace Database\Factories;

use App\Models\HouseholdMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HouseholdMember>
 */
class HouseholdMemberFactory extends Factory
{
    protected $model = HouseholdMember::class;

    public function definition(): array
    {
        return [
            'household_id' => null,
            'full_name' => fake()->name(),
            'relationship' => fake()->randomElement([
                'spouse',
                'child',
                'parent',
                'sibling',
                'grandparent',
                'other',
            ]),
            'age' => fake()->numberBetween(1, 80),
            'gender' => fake()->randomElement(['female', 'male', 'other']),
            'phone' => null,
            'notes' => null,
        ];
    }
}
