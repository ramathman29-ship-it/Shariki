<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TypeRequest;

class TypeRequestFactory extends Factory
{
    protected $model = TypeRequest::class;

    public function definition(): array
    {
        return [
            'name' => fake()->word(),
        ];
    }
}
