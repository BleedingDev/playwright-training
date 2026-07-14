<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AddressChangeStatus;
use Database\Factories\AddressChangeRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

final class AddressChangeRequest extends Model
{
    /** @use HasFactory<AddressChangeRequestFactory> */
    use HasFactory;

    /** @var array<string, string> */
    #[Override]
    protected $casts = [
        'original_address' => 'array',
        'requested_address' => 'array',
        'status' => AddressChangeStatus::class,
        'submitted_at' => 'immutable_datetime',
        'resolved_at' => 'immutable_datetime',
    ];

    /** @return BelongsTo<Company, $this> */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /** @return BelongsTo<User, $this> */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
