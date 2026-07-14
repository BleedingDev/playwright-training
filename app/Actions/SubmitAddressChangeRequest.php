<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\AddressChangeStatus;
use App\Models\AddressChangeRequest;
use App\Models\Company;

final readonly class SubmitAddressChangeRequest
{
    /** @param array{id: string, label: string, street: string, houseNumber: string, city: string, postalCode: string} $address */
    public function handle(Company $company, array $address): AddressChangeRequest
    {
        return $company->addressChangeRequests()->create([
            'original_address' => $company->address,
            'requested_address' => $address,
            'status' => AddressChangeStatus::Pending,
            'submitted_at' => now(),
        ]);
    }
}
