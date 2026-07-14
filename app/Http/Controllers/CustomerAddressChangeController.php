<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\SubmitAddressChangeRequest;
use App\Http\Requests\StoreAddressChangeRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final readonly class CustomerAddressChangeController
{
    public function create(Request $request): Response
    {
        $user = $request->user();
        assert($user instanceof User);

        return Inertia::render('address-change/create', [
            'company' => $user->company()->firstOrFail(),
        ]);
    }

    public function store(StoreAddressChangeRequest $request, SubmitAddressChangeRequest $submit): RedirectResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        /** @var array{id: string, label: string, street: string, houseNumber: string, city: string, postalCode: string} $address */
        $address = $request->validated('address');
        $submit->handle($user->company()->firstOrFail(), $address);

        return to_route('dashboard')->with('success', 'Požiadavka bola odoslaná a čaká na schválenie.');
    }
}
