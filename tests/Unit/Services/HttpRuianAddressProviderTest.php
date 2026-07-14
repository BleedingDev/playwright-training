<?php

declare(strict_types=1);

use App\Data\AddressData;
use App\Services\HttpRuianAddressProvider;
use Illuminate\Support\Facades\Http;

it('maps official RÚIAN suggestions to the internal address contract', function (): void {
    $endpoint = 'https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/Vyhledavaci_sluzba_nad_daty_RUIAN/MapServer';

    config(['ruian.endpoint' => $endpoint]);

    Http::fake([
        $endpoint.'/exts/GeocodeSOE/tables/1/suggest*' => Http::response([
            'suggestions' => [[
                'text' => 'K louži 1258/12, Vršovice, 10100 Praha 10',
                'magicKey' => '1203603',
                'isCollection' => false,
                'type' => 'AdresniMisto',
            ]],
        ]),
        $endpoint.'/1/query*' => Http::response([
            'features' => [[
                'attributes' => [
                    'objectid' => 1203603,
                    'kod' => 22669868,
                    'cislodomovni' => 1258,
                    'cisloorientacni' => 12,
                    'cisloorientacnipismeno' => null,
                    'psc' => 10100,
                    'adresa' => 'K louži 1258/12, Vršovice, 10100 Praha 10',
                ],
            ]],
        ]),
    ]);

    $addresses = resolve(HttpRuianAddressProvider::class)->search('K Louži 12');

    expect($addresses)->toHaveCount(1)
        ->and($addresses[0]->toArray())->toBe([
            'id' => 'ruian-22669868',
            'label' => 'K louži 1258/12, Vršovice, 101 00 Praha 10',
            'street' => 'K louži',
            'houseNumber' => '1258/12',
            'city' => 'Praha 10',
            'postalCode' => '101 00',
        ]);

    Http::assertSentCount(3);
});

it('broadens a partial house number and returns up to ten address suggestions', function (): void {
    $endpoint = 'https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/Vyhledavaci_sluzba_nad_daty_RUIAN/MapServer';

    config(['ruian.endpoint' => $endpoint]);

    Http::fake([
        $endpoint.'/exts/GeocodeSOE/tables/1/suggest*' => Http::sequence()
            ->push(['suggestions' => [[
                'text' => 'K louži 1312/1, Vršovice, 10100 Praha 10',
                'magicKey' => '1203027',
                'isCollection' => false,
                'type' => 'AdresniMisto',
            ]]])
            ->push(['suggestions' => [
                [
                    'text' => 'K louži 1312/1, Vršovice, 10100 Praha 10',
                    'magicKey' => '1203027',
                    'isCollection' => false,
                    'type' => 'AdresniMisto',
                ],
                [
                    'text' => 'K louži 1258/12, Vršovice, 10100 Praha 10',
                    'magicKey' => '1203603',
                    'isCollection' => false,
                    'type' => 'AdresniMisto',
                ],
            ]]),
        $endpoint.'/1/query*' => Http::response(['features' => [
            ['attributes' => [
                'objectid' => 1203027,
                'kod' => 22670505,
                'cislodomovni' => 1312,
                'cisloorientacni' => 1,
                'cisloorientacnipismeno' => null,
                'psc' => 10100,
                'adresa' => 'K louži 1312/1, Vršovice, 10100 Praha 10',
            ]],
            ['attributes' => [
                'objectid' => 1203603,
                'kod' => 22669868,
                'cislodomovni' => 1258,
                'cisloorientacni' => 12,
                'cisloorientacnipismeno' => null,
                'psc' => 10100,
                'adresa' => 'K louži 1258/12, Vršovice, 10100 Praha 10',
            ]],
        ]]),
    ]);

    $addresses = resolve(HttpRuianAddressProvider::class)->search('K Louži 1');

    expect(array_map(
        static fn (AddressData $address): string => $address->label,
        $addresses,
    ))->toBe([
        'K louži 1312/1, Vršovice, 101 00 Praha 10',
        'K louži 1258/12, Vršovice, 101 00 Praha 10',
    ]);

    Http::assertSent(fn ($request): bool => str_contains((string) $request->url(), '/suggest')
        && $request['maxSuggestions'] === 10);
    Http::assertSentCount(3);
});
