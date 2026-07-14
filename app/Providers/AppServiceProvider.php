<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\RuianAddressProvider;
use App\Services\FixtureRuianAddressProvider;
use App\Services\HttpRuianAddressProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(RuianAddressProvider::class, fn (): RuianAddressProvider => match (config('ruian.driver')) {
            'http' => resolve(HttpRuianAddressProvider::class),
            default => resolve(FixtureRuianAddressProvider::class),
        });
    }

    public function boot(): void
    {
        $this->bootModelsDefaults();
        $this->bootPasswordDefaults();
    }

    private function bootModelsDefaults(): void
    {
        Model::unguard();
    }

    private function bootPasswordDefaults(): void
    {
        Password::defaults(fn () => app()->isLocal() || app()->runningUnitTests() ? Password::min(12)->max(255) : Password::min(12)->max(255)->uncompromised());
    }
}
