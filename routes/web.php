<?php

declare(strict_types=1);

use App\Http\Controllers\AddressSearchController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerAddressChangeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OperatorAddressChangeRequestController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TestResetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserEmailResetNotificationController;
use App\Http\Controllers\UserEmailVerificationController;
use App\Http\Controllers\UserEmailVerificationNotificationController;
use App\Http\Controllers\UserPasswordController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UserTwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => auth()->check() ? to_route('dashboard') : to_route('login'))->name('home');
Route::get('/health', fn () => response()->json(['status' => 'ok']))->name('health');
Route::post('/_test/reset', TestResetController::class)->name('test.reset');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('api/addresses', AddressSearchController::class)->name('addresses.search');

    Route::middleware('role:customer')->group(function (): void {
        Route::get('address-change', [CustomerAddressChangeController::class, 'create'])->name('address-change.create');
        Route::post('address-change', [CustomerAddressChangeController::class, 'store'])->name('address-change.store');
    });

    Route::prefix('operator')->name('operator.')->middleware('role:operator,admin')->group(function (): void {
        Route::get('requests', [OperatorAddressChangeRequestController::class, 'index'])->name('requests.index');
        Route::get('requests/{addressChangeRequest}', [OperatorAddressChangeRequestController::class, 'show'])->name('requests.show');
        Route::patch('requests/{addressChangeRequest}', [OperatorAddressChangeRequestController::class, 'update'])->name('requests.update');
    });

    Route::get('admin', AdminController::class)->middleware('role:admin')->name('admin.index');
});

Route::middleware('auth')->group(function (): void {
    // User...
    Route::delete('user', [UserController::class, 'destroy'])->name('user.destroy');

    // User Profile...
    Route::redirect('settings', '/settings/profile');
    Route::get('settings/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::patch('settings/profile', [UserProfileController::class, 'update'])->name('user-profile.update');

    // User Password...
    Route::get('settings/password', [UserPasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [UserPasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    // Appearance...
    Route::get('settings/appearance', fn () => Inertia::render('appearance/update'))->name('appearance.edit');

    // User Two-Factor Authentication...
    Route::get('settings/two-factor', [UserTwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

Route::middleware('guest')->group(function (): void {
    // User...
    Route::get('register', [UserController::class, 'create'])
        ->name('register');
    Route::post('register', [UserController::class, 'store'])
        ->name('register.store');

    // User Password...
    Route::get('reset-password/{token}', [UserPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [UserPasswordController::class, 'store'])
        ->name('password.store');

    // User Email Reset Notification...
    Route::get('forgot-password', [UserEmailResetNotificationController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [UserEmailResetNotificationController::class, 'store'])
        ->name('password.email');

    // Session...
    Route::get('login', [SessionController::class, 'create'])
        ->name('login');
    Route::post('login', [SessionController::class, 'store'])
        ->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    // User Email Verification...
    Route::get('verify-email', [UserEmailVerificationNotificationController::class, 'create'])
        ->name('verification.notice');
    Route::post('email/verification-notification', [UserEmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // User Email Verification...
    Route::get('verify-email/{id}/{hash}', [UserEmailVerificationController::class, 'update'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Session...
    Route::post('logout', [SessionController::class, 'destroy'])
        ->name('logout');
});
