<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\ResolveAddressChangeRequest;
use App\Enums\AddressChangeStatus;
use App\Http\Requests\ResolveAddressChangeRequestRequest;
use App\Models\AddressChangeRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final readonly class OperatorAddressChangeRequestController
{
    public function index(): Response
    {
        return Inertia::render('operator/requests/index', [
            'requests' => AddressChangeRequest::query()
                ->with('company.customer')
                ->where('status', AddressChangeStatus::Pending)
                ->oldest('submitted_at')
                ->get(),
        ]);
    }

    public function show(AddressChangeRequest $addressChangeRequest): Response
    {
        return Inertia::render('operator/requests/show', [
            'request' => $addressChangeRequest->load('company.customer'),
        ]);
    }

    public function update(
        ResolveAddressChangeRequestRequest $request,
        AddressChangeRequest $addressChangeRequest,
        ResolveAddressChangeRequest $resolve,
    ): RedirectResponse {
        abort_unless($addressChangeRequest->status === AddressChangeStatus::Pending, 409);

        $operator = $request->user();
        assert($operator instanceof User);

        $resolve->handle(
            $addressChangeRequest,
            $operator,
            AddressChangeStatus::from($request->string('decision')->toString()),
            $request->string('rejection_note')->toString() ?: null,
        );

        return to_route('operator.requests.index')->with('success', 'Požiadavka bola spracovaná.');
    }
}
