<?php

declare(strict_types=1);

use App\Actions\ResolveAddressChangeRequest;
use App\Enums\AddressChangeStatus;
use App\Enums\UserRole;
use App\Models\AddressChangeRequest;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates the company address when an operator approves a request', function (): void {
    $operator = User::factory()->create(['role' => UserRole::Operator]);
    $company = Company::factory()->create();
    $request = AddressChangeRequest::factory()->create([
        'company_id' => $company->id,
        'requested_address' => ['label' => 'Dlouhá 730/35, 110 00 Praha 1'],
    ]);

    resolve(ResolveAddressChangeRequest::class)->handle(
        $request,
        $operator,
        AddressChangeStatus::Approved,
    );

    expect($request->refresh()->status)->toBe(AddressChangeStatus::Approved)
        ->and($company->refresh()->address['label'])->toBe('Dlouhá 730/35, 110 00 Praha 1');
});
