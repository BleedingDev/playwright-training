<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\RuianAddressProvider;
use App\Data\AddressData;

final readonly class AddressSearchService
{
    public function __construct(private RuianAddressProvider $provider) {}

    /** @return list<AddressData> */
    public function search(string $query): array
    {
        if (mb_strlen(mb_trim($query)) < 3) {
            return [];
        }

        return $this->provider->search($query);
    }
}
