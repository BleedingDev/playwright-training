<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        return match ($user->role) {
            UserRole::Customer => $this->customerDashboard($user),
            UserRole::Operator => to_route('operator.requests.index'),
            UserRole::Admin => to_route('admin.index'),
        };
    }

    private function customerDashboard(User $user): Response
    {
        $company = $user->company()->with([
            'addressChangeRequests' => fn (Relation $relation): Builder => $relation->getQuery()->latest('submitted_at'),
        ])->firstOrFail();

        return Inertia::render('dashboard', [
            'company' => $company,
            'requests' => $company->addressChangeRequests,
        ]);
    }
}
