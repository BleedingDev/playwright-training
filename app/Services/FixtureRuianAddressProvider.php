<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\RuianAddressProvider;
use App\Data\AddressData;

final readonly class FixtureRuianAddressProvider implements RuianAddressProvider
{
    /** @var list<AddressData> */
    private array $addresses;

    public function __construct()
    {
        $this->addresses = [
            new AddressData('ruian-217310', 'Václavské náměstí 837/11, 110 00 Praha 1', 'Václavské náměstí', '837/11', 'Praha 1', '110 00'),
            new AddressData('ruian-250734', 'Dlouhá 730/35, 110 00 Praha 1', 'Dlouhá', '730/35', 'Praha 1', '110 00'),
            new AddressData('ruian-22670505', 'K Louži 1312/1, 101 00 Praha 10', 'K Louži', '1312/1', 'Praha 10', '101 00'),
            new AddressData('ruian-22669868', 'K Louži 1258/12, 101 00 Praha 10', 'K Louži', '1258/12', 'Praha 10', '101 00'),
            new AddressData('ruian-191842', 'Česká 166/11, 602 00 Brno', 'Česká', '166/11', 'Brno', '602 00'),
            new AddressData('ruian-534201', 'Nádražní 120, 702 00 Ostrava', 'Nádražní', '120', 'Ostrava', '702 00'),
        ];
    }

    public function search(string $query): array
    {
        $needle = mb_strtolower(mb_trim($query));

        return array_values(array_filter(
            $this->addresses,
            fn (AddressData $address): bool => str_contains(mb_strtolower($address->label), $needle),
        ));
    }
}
