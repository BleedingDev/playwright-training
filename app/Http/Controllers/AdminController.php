<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\AddressChangeRequest;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

final class AdminController
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/index', [
            'users' => User::query()->orderBy('id')->get(['id', 'name', 'email', 'role']),
            'requests' => AddressChangeRequest::query()->with('company')->latest('submitted_at')->get(),
        ]);
    }
}
