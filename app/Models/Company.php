<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\CompanyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

final class Company extends Model
{
    /** @use HasFactory<CompanyFactory> */
    use HasFactory;

    /** @var array<string, string> */
    #[Override]
    protected $casts = ['address' => 'array'];

    /** @return BelongsTo<User, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /** @return HasMany<AddressChangeRequest, $this> */
    public function addressChangeRequests(): HasMany
    {
        return $this->hasMany(AddressChangeRequest::class);
    }
}
