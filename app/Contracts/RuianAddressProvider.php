<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Data\AddressData;

interface RuianAddressProvider
{
    /** @return list<AddressData> */
    public function search(string $query): array;
}
