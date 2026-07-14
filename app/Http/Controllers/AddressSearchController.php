<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\AddressData;
use App\Http\Requests\SearchAddressRequest;
use App\Services\AddressSearchService;
use Illuminate\Http\JsonResponse;
use Throwable;

final readonly class AddressSearchController
{
    public function __construct(private AddressSearchService $addressSearch) {}

    public function __invoke(SearchAddressRequest $request): JsonResponse
    {
        try {
            $items = array_map(
                fn (AddressData $address): array => $address->toArray(),
                $this->addressSearch->search($request->string('query')->toString()),
            );

            return response()->json(['items' => $items]);
        } catch (Throwable $throwable) {
            report($throwable);

            return response()->json([
                'message' => 'Vyhľadávanie adries je dočasne nedostupné. Skúste to znova.',
            ], 503);
        }
    }
}
