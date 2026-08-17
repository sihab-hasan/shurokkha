<?php

namespace Database\Factories;

use App\Enums\AssistanceRequestPriority;
use App\Enums\AssistanceRequestStatus;
use App\Enums\AssistanceRequestType;
use App\Models\AssistanceRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<AssistanceRequest> */
class AssistanceRequestFactory extends Factory
{
    protected $model = AssistanceRequest::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(AssistanceRequestType::cases()),
            'priority' => fake()->randomElement(AssistanceRequestPriority::cases()),
            'description' => fake()->sentence(14),
            'affected_people_count' => fake()->numberBetween(1, 12),
            'contact_phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'status' => AssistanceRequestStatus::Submitted,
            'submitted_at' => now(),
        ];
    }
}
