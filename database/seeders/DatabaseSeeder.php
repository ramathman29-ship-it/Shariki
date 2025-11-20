<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
public function run(): void
{
    $adminRole = Role::firstOrCreate(['name' => 'admin']);

    $admin = User::firstOrCreate(
        ['email' => 'admin@example.com'],
        [
            'name' => 'Admin',
            'password' => Hash::make('Admin1234'),
        ]
    );

    $admin->roles()->syncWithoutDetaching([$adminRole->id]);
}

}