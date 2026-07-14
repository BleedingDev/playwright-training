<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\RuianAddressProvider;
use App\Data\AddressData;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\PendingRequest;
use RuntimeException;
use Throwable;

final readonly class HttpRuianAddressProvider implements RuianAddressProvider
{
    public function __construct(private Factory $http) {}

    public function search(string $query): array
    {
        $configuredEndpoint = config('ruian.endpoint');

        throw_if(! is_string($configuredEndpoint) || $configuredEndpoint === '', RuntimeException::class, 'RÚIAN endpoint is not configured.');

        $endpoint = mb_rtrim($configuredEndpoint, '/');

        try {
            $configuredTimeout = config('ruian.timeout', 3);
            $timeout = is_int($configuredTimeout) ? $configuredTimeout : 3;
            $request = $this->http->acceptJson()->timeout($timeout);
            $token = config('ruian.token');

            if (is_string($token) && $token !== '') {
                $request = $request->withToken($token);
            }

            $objectIds = $this->addressObjectIds($this->suggestions($request, $endpoint, $query));
            $broaderQuery = $this->broaderStreetQuery($query);

            if (count($objectIds) < 10 && $broaderQuery !== null) {
                $objectIds = array_slice(array_values(array_unique([
                    ...$objectIds,
                    ...$this->addressObjectIds($this->suggestions($request, $endpoint, $broaderQuery)),
                ])), 0, 10);
            }

            if ($objectIds === []) {
                return [];
            }

            $features = $request->get($endpoint.'/1/query', [
                'where' => 'objectid IN ('.implode(',', $objectIds).')',
                'outFields' => 'objectid,kod,cislodomovni,cisloorientacni,cisloorientacnipismeno,psc,adresa',
                'returnGeometry' => 'false',
                'f' => 'json',
            ])->throw()->json('features');
        } catch (Throwable $throwable) {
            throw new RuntimeException('RÚIAN provider is unavailable.', $throwable->getCode(), previous: $throwable);
        }

        throw_unless(is_array($features), RuntimeException::class, 'RÚIAN provider returned an invalid response.');

        $addressesByObjectId = [];

        foreach ($features as $feature) {
            throw_unless(is_array($feature) && is_array($feature['attributes'] ?? null), RuntimeException::class, 'RÚIAN provider returned an invalid response.');

            /** @var array<string, mixed> $attributes */
            $attributes = $feature['attributes'];
            $objectId = $attributes['objectid'] ?? null;

            if (is_int($objectId) || is_string($objectId)) {
                $addressesByObjectId[(string) $objectId] = $this->addressFromAttributes($attributes);
            }
        }

        return array_values(array_filter(array_map(
            static fn (string $objectId): ?AddressData => $addressesByObjectId[$objectId] ?? null,
            $objectIds,
        )));
    }

    /** @return array<mixed> */
    private function suggestions(PendingRequest $request, string $endpoint, string $query): array
    {
        $suggestions = $request->get($endpoint.'/exts/GeocodeSOE/tables/1/suggest', [
            'text' => $query,
            'maxSuggestions' => 10,
            'f' => 'json',
        ])->throw()->json('suggestions');

        throw_unless(is_array($suggestions), RuntimeException::class, 'RÚIAN provider returned an invalid response.');

        return $suggestions;
    }

    /**
     * @param  array<mixed>  $suggestions
     * @return list<string>
     */
    private function addressObjectIds(array $suggestions): array
    {
        $objectIds = [];

        foreach ($suggestions as $suggestion) {
            if (! is_array($suggestion)) {
                continue;
            }

            if (($suggestion['type'] ?? null) !== 'AdresniMisto') {
                continue;
            }

            if (($suggestion['isCollection'] ?? true) !== false) {
                continue;
            }

            $magicKey = $suggestion['magicKey'] ?? null;

            if ((is_int($magicKey) || is_string($magicKey)) && ctype_digit((string) $magicKey)) {
                $objectIds[] = (string) $magicKey;
            }
        }

        return array_slice(array_values(array_unique($objectIds)), 0, 10);
    }

    private function broaderStreetQuery(string $query): ?string
    {
        $trimmedQuery = mb_trim($query);
        $broaderQuery = preg_replace('/\s+\d[\p{L}\d\/-]*$/u', '', $trimmedQuery);

        return is_string($broaderQuery)
            && $broaderQuery !== $trimmedQuery
            && mb_strlen($broaderQuery) >= 3
                ? $broaderQuery
                : null;
    }

    /** @param array<string, mixed> $attributes */
    private function addressFromAttributes(array $attributes): AddressData
    {
        $code = $attributes['kod'] ?? null;
        $houseNumber = $attributes['cislodomovni'] ?? null;
        $label = $attributes['adresa'] ?? null;
        $postalCode = $attributes['psc'] ?? null;

        throw_unless(
            (is_int($code) || is_string($code))
            && (is_int($houseNumber) || is_string($houseNumber))
            && is_string($label)
            && (is_int($postalCode) || is_string($postalCode)),
            RuntimeException::class,
            'RÚIAN provider returned an invalid response.',
        );

        $orientationNumber = $attributes['cisloorientacni'] ?? null;
        $orientationLetter = $attributes['cisloorientacnipismeno'] ?? null;
        $formattedHouseNumber = (string) $houseNumber;

        if (is_int($orientationNumber) || is_string($orientationNumber)) {
            $formattedHouseNumber .= '/'.$orientationNumber;

            if (is_string($orientationLetter)) {
                $formattedHouseNumber .= $orientationLetter;
            }
        }

        $formattedPostalCode = $this->formatPostalCode((string) $postalCode);
        $labelParts = array_map(trim(...), explode(',', $label));
        $streetAndNumber = array_shift($labelParts);
        $lastPart = array_pop($labelParts) ?? '';
        $city = mb_trim((string) preg_replace('/^\d{3}\s?\d{2}\s+/u', '', $lastPart));
        $street = mb_trim((string) preg_replace('/\s+'.preg_quote($formattedHouseNumber, '/').'$/u', '', $streetAndNumber));
        $normalizedLastPart = mb_trim($formattedPostalCode.' '.$city);
        $normalizedLabelParts = array_filter([$streetAndNumber, ...$labelParts, $normalizedLastPart], static fn (string $part): bool => $part !== '');

        return new AddressData(
            id: 'ruian-'.$code,
            label: implode(', ', $normalizedLabelParts),
            street: $street,
            houseNumber: $formattedHouseNumber,
            city: $city,
            postalCode: $formattedPostalCode,
        );
    }

    private function formatPostalCode(string $postalCode): string
    {
        $digits = preg_replace('/\D/', '', $postalCode);

        return is_string($digits) && mb_strlen($digits) === 5
            ? mb_substr($digits, 0, 3).' '.mb_substr($digits, 3)
            : $postalCode;
    }
}
