<?php

declare(strict_types=1);

use App\Contracts\RuianAddressProvider;
use App\Data\AddressData;
use App\Enums\UserRole;
use App\Models\User;
use App\Services\FixtureRuianAddressProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns the stable internal address contract', function (): void {
    $this->app->bind(RuianAddressProvider::class, fn (): RuianAddressProvider => new class implements RuianAddressProvider
    {
        public function search(string $query): array
        {
            return [new AddressData('one', 'Česká 1, Brno', 'Česká', '1', 'Brno', '602 00')];
        }
    });

    $user = User::factory()->create(['role' => UserRole::Customer]);

    $this->actingAs($user)
        ->getJson('/api/addresses?query=Česká')
        ->assertSuccessful()
        ->assertExactJson([
            'items' => [[
                'id' => 'one',
                'label' => 'Česká 1, Brno',
                'street' => 'Česká',
                'houseNumber' => '1',
                'city' => 'Brno',
                'postalCode' => '602 00',
            ]],
        ]);
});

it('finds a known offline address from a partial street and house number', function (): void {
    $this->app->bind(RuianAddressProvider::class, fn (): RuianAddressProvider => resolve(FixtureRuianAddressProvider::class));

    $user = User::factory()->create(['role' => UserRole::Customer]);

    $this->actingAs($user)
        ->getJson('/api/addresses?'.http_build_query(['query' => 'K Louži 1']))
        ->assertSuccessful()
        ->assertExactJson([
            'items' => [
                [
                    'id' => 'ruian-22670505',
                    'label' => 'K Louži 1312/1, 101 00 Praha 10',
                    'street' => 'K Louži',
                    'houseNumber' => '1312/1',
                    'city' => 'Praha 10',
                    'postalCode' => '101 00',
                ],
                [
                    'id' => 'ruian-22669868',
                    'label' => 'K Louži 1258/12, 101 00 Praha 10',
                    'street' => 'K Louži',
                    'houseNumber' => '1258/12',
                    'city' => 'Praha 10',
                    'postalCode' => '101 00',
                ],
            ],
        ]);
});

it('maps provider failures to a recoverable response', function (): void {
    $this->app->bind(RuianAddressProvider::class, fn (): RuianAddressProvider => new class implements RuianAddressProvider
    {
        public function search(string $query): array
        {
            throw new RuntimeException('provider failed');
        }
    });

    $user = User::factory()->create(['role' => UserRole::Customer]);

    $this->actingAs($user)
        ->getJson('/api/addresses?query=Praha')
        ->assertServiceUnavailable()
        ->assertJson(['message' => 'Vyhľadávanie adries je dočasne nedostupné. Skúste to znova.']);
});
