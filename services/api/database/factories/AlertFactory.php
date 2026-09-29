<?php

namespace Database\Factories;

use App\Models\Alert;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Alert>
 */
class AlertFactory extends Factory
{
    protected $model = Alert::class;

    public function definition(): array
    {
        return [
            'disaster_id' => null,
            'title' => fake()->randomElement([
                'Flash flood warning',
                'Cyclone advisory',
                'Heatwave alert',
                'Landslide risk',
                'Evacuation order',
            ]),
            'message' => fake()->paragraph(2),
            'severity' => fake()->randomElement(['info', 'warning', 'critical']),
            'status' => fake()->randomElement(['active', 'expired', 'cancelled']),
            'area_description' => fake()->city() . ' district',
            'latitude' => fake()->latitude(20.5, 26.6), // Bangladesh bounds
            'longitude' => fake()->longitude(88.0, 92.7),
            'issued_by' => null,
            'issued_at' => now(),
            'expires_at' => now()->addHours(24),
        ];
    }

    public function critical(): static
    {
        return $this->state(fn () => [
            'severity' => 'critical',
            'status' => 'active',
        ]);
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status' => 'active',
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'status' => 'expired',
            'expires_at' => now()->subDay(),
        ]);
    }
}
