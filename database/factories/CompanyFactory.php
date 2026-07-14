<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Company> */
final class CompanyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'name' => 'Dunajská dielňa, s. r. o.',
            'registration_number' => '55123456',
            'address' => [
                'id' => 'current-1',
                'label' => 'Panská 12, 811 01 Bratislava',
                'street' => 'Panská',
                'houseNumber' => '12',
                'city' => 'Bratislava',
                'postalCode' => '811 01',
            ],
        ];
    }
}
