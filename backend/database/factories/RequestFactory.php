<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Poperity;

class RequestFactory extends Factory
{
    protected $model = \App\Models\Request::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'prp_id' => Poperity::factory(),
            'submission_date' => now(),
            'rate' => $this->faker->numberBetween(1, 100),
            'description' => $this->faker->sentence(),
            'status' => 'pending',
            'contract' => null,
            'is_rejected' => false,
            'payment_status' => 'pending',
        ];
    }
}
