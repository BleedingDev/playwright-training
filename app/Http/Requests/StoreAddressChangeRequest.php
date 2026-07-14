<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

final class StoreAddressChangeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Customer;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'address.id' => ['required', 'string', 'max:100'],
            'address.label' => ['required', 'string', 'max:255'],
            'address.street' => ['required', 'string', 'max:120'],
            'address.houseNumber' => ['required', 'string', 'max:30'],
            'address.city' => ['required', 'string', 'max:120'],
            'address.postalCode' => ['required', 'string', 'max:20'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return ['address.required' => 'Najprv vyberte adresu z návrhov.'];
    }
}
