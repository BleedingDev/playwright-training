<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class SearchAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return ['query' => ['required', 'string', 'min:3', 'max:120']];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return ['query.min' => 'Zadajte aspoň tri znaky adresy.'];
    }
}
