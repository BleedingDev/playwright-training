<?php

declare(strict_types=1);

namespace App\Data;

final readonly class AddressData
{
    public function __construct(
        public string $id,
        public string $label,
        public string $street,
        public string $houseNumber,
        public string $city,
        public string $postalCode,
    ) {}

    /** @return array{id: string, label: string, street: string, houseNumber: string, city: string, postalCode: string} */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'street' => $this->street,
            'houseNumber' => $this->houseNumber,
            'city' => $this->city,
            'postalCode' => $this->postalCode,
        ];
    }
}
