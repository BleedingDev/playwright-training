<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows only admins to open the admin route', function (UserRole $role, int $expectedStatus): void {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)->get('/admin')->assertStatus($expectedStatus);
})->with([
    'customer' => [UserRole::Customer, 403],
    'operator' => [UserRole::Operator, 403],
    'admin' => [UserRole::Admin, 200],
]);
