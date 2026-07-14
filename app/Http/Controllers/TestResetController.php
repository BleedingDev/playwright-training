<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

final class TestResetController
{
    public function __invoke(): JsonResponse
    {
        abort_unless(app()->environment(['local', 'testing']), 404);

        Artisan::call('db:seed', ['--class' => \Database\Seeders\DatabaseSeeder::class, '--force' => true]);

        return response()->json(['status' => 'reset']);
    }
}
