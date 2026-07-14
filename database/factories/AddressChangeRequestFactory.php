<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\AddressChangeStatus;
use App\Models\AddressChangeRequest;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<AddressChangeRequest> */
final class AddressChangeRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'original_address' => ['label' => 'Panská 12, 811 01 Bratislava'],
            'requested_address' => ['label' => 'Dlouhá 730/35, 110 00 Praha 1'],
            'status' => AddressChangeStatus::Pending,
            'submitted_at' => '2026-06-10 09:00:00',
        ];
    }
}
