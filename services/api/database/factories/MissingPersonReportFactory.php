<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Enums\MissingPersonStatus;
use App\Models\MissingPersonReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<MissingPersonReport> */
class MissingPersonReportFactory extends Factory
{
    protected $model = MissingPersonReport::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'full_name' => fake()->name(),
            'age' => fake()->numberBetween(5, 85),
            'gender' => fake()->randomElement(Gender::cases()),
            'physical_description' => fake()->sentence(12),
            'distinguishing_features' => fake()->sentence(8),
            'last_seen_at' => now()->subHours(fake()->numberBetween(1, 72)),
            'last_seen_location' => fake()->address(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'contact_phone' => fake()->phoneNumber(),
            'status' => MissingPersonStatus::Reported,
        ];
    }
}
