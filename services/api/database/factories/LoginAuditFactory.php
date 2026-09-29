<?php

namespace Database\Factories;

use App\Models\LoginAudit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoginAudit>
 */
class LoginAuditFactory extends Factory
{
    protected $model = LoginAudit::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'session_token_hash' => hash('sha256', fake()->uuid()),
            'successful' => true,
            'failure_reason' => null,
            'signed_in_at' => now()->subMinutes(fake()->numberBetween(1, 60)),
            'signed_out_at' => null,
        ];
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'successful' => false,
            'failure_reason' => 'invalid_credentials',
        ]);
    }
}