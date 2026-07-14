<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\AddressChangeStatus;
use App\Models\AddressChangeRequest;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');
        AddressChangeRequest::query()->delete();
        Company::query()->delete();

        $customer = User::query()->updateOrCreate(['email' => 'customer@example.test'], [
            'name' => 'Marek Zákazník',
            'email_verified_at' => '2026-01-01 08:00:00',
            'password' => $password,
            'role' => 'customer',
        ]);

        $operator = User::query()->updateOrCreate(['email' => 'operator@example.test'], [
            'name' => 'Lucia Operátorka',
            'email_verified_at' => '2026-01-01 08:00:00',
            'password' => $password,
            'role' => 'operator',
        ]);

        User::query()->updateOrCreate(['email' => 'admin@example.test'], [
            'name' => 'Adam Administrátor',
            'email_verified_at' => '2026-01-01 08:00:00',
            'password' => $password,
            'role' => 'admin',
        ]);

        $company = Company::query()->create([
            'customer_id' => $customer->id,
            'name' => 'Dunajská dielňa, s. r. o.',
            'registration_number' => '55123456',
            'address' => [
                'id' => 'current-1',
                'label' => 'Panská 12, 811 01 Bratislava',
                'street' => 'Panská',
                'houseNumber' => '12',
                'city' => 'Bratislava',
                'postalCode' => '811 01',
            ],
        ]);

        AddressChangeRequest::query()->create([
            'company_id' => $company->id,
            'original_address' => $company->address,
            'requested_address' => [
                'id' => 'history-1',
                'label' => 'Křižíkova 44, 186 00 Praha 8',
                'street' => 'Křižíkova',
                'houseNumber' => '44',
                'city' => 'Praha 8',
                'postalCode' => '186 00',
            ],
            'status' => AddressChangeStatus::Rejected,
            'submitted_at' => '2026-05-05 10:30:00',
            'resolved_at' => '2026-05-06 14:00:00',
            'resolved_by' => $operator->id,
            'rejection_note' => 'Chýba súhlas vlastníka nehnuteľnosti.',
        ]);
    }
}
