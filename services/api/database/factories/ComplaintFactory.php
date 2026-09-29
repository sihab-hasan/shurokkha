<?php

namespace Database\Factories;

use App\Models\Complaint;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Complaint>
 */
class ComplaintFactory extends Factory
{
    protected $model = Complaint::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'subject' => fake()->randomElement([
                'Delayed response',
                'Wrongful denial of aid',
                'Rude staff behavior',
                'Missing supplies',
                'Other',
            ]),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['general', 'service', 'logistics', 'staff']),
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'resolution_notes' => null,
        ];
    }

    public function resolved(): static
    {
        return $this->state(fn () => [
            'status' => 'resolved',
            'reviewed_at' => now()->subDay(),
            'resolution_notes' => 'Investigated and resolved.',
        ]);
    }
}
