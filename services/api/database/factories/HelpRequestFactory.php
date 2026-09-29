<?php

namespace Database\Factories;

use App\Models\HelpRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HelpRequest>
 */
class HelpRequestFactory extends Factory
{
    protected $model = HelpRequest::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'disaster_id' => null,
            'request_type' => fake()->randomElement(['rescue', 'medical', 'essentials', 'shelter', 'other']),
            'priority' => fake()->randomElement(['low', 'normal', 'high', 'critical']),
            'description' => fake()->paragraph(),
            'affected_people_count' => fake()->numberBetween(1, 200),
            'address' => fake()->streetAddress() . ', ' . fake()->city(),
            'latitude' => fake()->latitude(20.5, 26.6),
            'longitude' => fake()->longitude(88.0, 92.7),
            'contact_phone' => '+8801' . fake()->numerify('#########'),
            'status' => 'pending',
            'assigned_team_id' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
            'resolution_notes' => null,
        ];
    }
}
