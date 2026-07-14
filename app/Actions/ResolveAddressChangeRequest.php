<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\AddressChangeStatus;
use App\Models\AddressChangeRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final readonly class ResolveAddressChangeRequest
{
    public function handle(
        AddressChangeRequest $addressChangeRequest,
        User $operator,
        AddressChangeStatus $status,
        ?string $rejectionNote = null,
    ): void {
        DB::transaction(function () use ($addressChangeRequest, $operator, $status, $rejectionNote): void {
            $addressChangeRequest->update([
                'status' => $status,
                'resolved_at' => now(),
                'resolved_by' => $operator->id,
                'rejection_note' => $status === AddressChangeStatus::Rejected ? $rejectionNote : null,
            ]);

            if ($status === AddressChangeStatus::Approved) {
                $addressChangeRequest->company()->update([
                    'address' => $addressChangeRequest->requested_address,
                ]);
            }
        });
    }
}
