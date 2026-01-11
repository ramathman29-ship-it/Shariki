<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payment;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        return [
            'request_id' => null, // سيتم تعيينه في التيست
            'amount_usd' => $this->faker->numberBetween(100, 1000),
            'platform_fee_usd' => $this->faker->numberBetween(1, 50),
            'stripe_intent_id' => $this->faker->uuid,
            'status' => 'authorized',
            'payment_status' => 'pending',
            'balance' => $this->faker->numberBetween(100, 1000),
        ];
    }
}
