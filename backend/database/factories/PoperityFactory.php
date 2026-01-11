<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\TypeRequest;

class PoperityFactory extends Factory
{
    protected $model = \App\Models\Poperity::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // ينشئ مستخدم جديد تلقائي
            'RT_id' => TypeRequest::factory(), // اختياري إذا عندك نوع طلب
            'address' => $this->faker->address(),
            'location' => $this->faker->city(),
            'description' => $this->faker->text(200),
            'project' => $this->faker->word(),
            'type' => $this->faker->word(),
            'available_percentage' => 100,
            'condition' => 'new',
            'video' => null,
            'area' => $this->faker->numberBetween(50, 500),
            'status' => 'pending',
            'price' => $this->faker->numberBetween(50000, 500000),
            'is_approved' => false,
        ];
    }
}
