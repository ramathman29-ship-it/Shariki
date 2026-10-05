<?php

namespace Database\Seeders;

use App\Models\Image;
use App\Models\Poperity;
use App\Models\Request as RequestModel;
use App\Models\TypeRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Demo data: owners + approved properties with photos and features.
 * Same data as front/src/data/demoProperties.json (used as the offline fallback).
 *
 * php artisan db:seed --class=DemoDataSeeder
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $owners = collect([
            ['name' => 'Rama Othman',   'email' => 'rama@shariki.test'],
            ['name' => 'Ghina Mogahed', 'email' => 'ghina@shariki.test'],
            ['name' => 'Rewa Shalian',  'email' => 'rewa@shariki.test'],
        ])->map(fn ($u) => User::firstOrCreate(
            ['email' => $u['email']],
            [
                'name' => $u['name'],
                'password' => Hash::make(env('DEMO_USER_PASSWORD') ?: Str::random(16)),
                'nationality' => 'Syrian',
                'residency' => 'Damascus',
            ]
        ));

        $types = collect(['fullSell', 'partialSell', 'Rent'])
            ->mapWithKeys(fn ($name) => [$name => TypeRequest::firstOrCreate(['name' => $name])->id]);

        $items = json_decode(file_get_contents(__DIR__ . '/data/demo_properties.json'), true);

        $properties = [];
        foreach ($items as $i => $item) {
            // Re-running the seeder updates the same rows instead of duplicating them
            $property = Poperity::updateOrCreate(
                ['address' => $item['address']],
                [
                    'location' => $item['location'],
                    'project' => $item['project'],
                    'type' => $item['type'],
                    'description' => $item['description'],
                    'area' => $item['area'],
                    'price' => $item['price'],
                    'condition' => $item['condition'],
                    'available_percentage' => $item['available_percentage'],
                    'status' => 'view',
                    'is_approved' => true,
                    'user_id' => $owners[$i % $owners->count()]->id,
                    'RT_id' => $types[$item['type_request']],
                ]
            );

            $property->photos()->delete();
            foreach ($item['photos'] as $n => $url) {
                Image::create([
                    'poperity_id' => $property->id,
                    'title' => $item['project'] . ' ' . ($n + 1),
                    'image_path' => $url,
                ]);
            }

            $property->suffixes()->delete();
            foreach ($item['suffixes'] as $suffix) {
                $property->suffixes()->create($suffix);
            }

            $properties[$i] = $property;
        }

        $this->seedUserActivity($owners, $properties, $types);
    }

    /**
     * Requests + shares so "My requests" and "My houses" are not empty.
     * Log in as rama@shariki.test with DEMO_USER_PASSWORD from .env to see everything.
     * Owners rotate: Rama owns listings 0,3,6,9,12,15 — Ghina 1,4,7,10,13 — Rewa 2,5,8,11,14.
     */
    private function seedUserActivity($owners, array $p, $types): void
    {
        [$rama, $ghina, $rewa] = $owners->all();

        // a listing still waiting for admin approval
        Poperity::updateOrCreate(
            ['address' => 'Al-Malki, Ibn Al-Rumi Street 3'],
            [
                'location' => 'Damascus',
                'project' => 'Malki Court',
                'type' => 'Apartment',
                'description' => 'Classic Malki apartment with high ceilings, waiting for review.',
                'area' => 210,
                'price' => 390000,
                'condition' => 'green',
                'available_percentage' => 100,
                'status' => 'pending',
                'is_approved' => false,
                'user_id' => $rama->id,
                'RT_id' => $types['fullSell'],
            ]
        );

        // start clean on every run
        RequestModel::whereIn('user_id', $owners->pluck('id'))->delete();

        $make = fn ($user, $property, array $extra) => RequestModel::create(array_merge([
            'user_id' => $user->id,
            'prp_id' => $property->id,
            'submission_date' => now()->subDays(rand(1, 20))->toDateString(),
            'rate' => 100,
            'status' => 'pending',
            'payment_status' => 'pending',
        ], $extra));

        // ---- sent by Rama ----
        $make($rama, $p[1], ['rate' => 10, 'status' => 'accepted', 'description' => 'I would like a 10% share in Yaafour Gardens.']);
        $make($rama, $p[5], ['rate' => 20, 'status' => 'accepted', 'payment_status' => 'held', 'description' => 'Requesting 20% of Furqan Park apartment.']);
        $make($rama, $p[2], ['description' => 'Is the apartment available from next month? I would rent for a year.']);
        $make($rama, $p[8], ['status' => 'rejected', 'description' => 'Interested in buying the villa, can we arrange a visit?']);

        // ---- received on Rama's listings ----
        $make($ghina, $p[0], ['description' => 'I want to buy the apartment. Can I visit on Saturday?']);
        $make($rewa, $p[9], ['rate' => 15, 'description' => 'Requesting a 15% share in Marina Residence.']);
        $make($ghina, $p[15], ['description' => 'Looking to rent for 12 months starting next month.']);

        // ---- completed investments (shares) ----
        $make($rama, $p[14], ['rate' => 20, 'status' => 'investment', 'payment_status' => 'captured', 'description' => 'Share in Slunfeh Pines.']);
        $make($rama, $p[1], ['rate' => 15, 'status' => 'investment', 'payment_status' => 'captured', 'description' => 'Share in Yaafour Gardens.']);
        $make($rewa, $p[1], ['rate' => 25, 'status' => 'investment', 'payment_status' => 'captured', 'description' => 'Share in Yaafour Gardens.']);
    }
}
