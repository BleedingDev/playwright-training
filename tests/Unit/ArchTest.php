<?php

declare(strict_types=1);

arch()->preset()->php();
arch()->preset()->strict();
arch()->preset()->laravel();
arch()->preset()->security()->ignoring([
    'assert',
]);

arch('actions')
    ->expect('App\\Actions')
    ->toBeReadonly()
    ->toHaveMethod('handle');

arch('form requests')
    ->expect('App\\Http\\Requests')
    ->toExtend(Illuminate\Foundation\Http\FormRequest::class);

arch('debug helpers')
    ->expect('App')
    ->not->toUse([
        'dd',
        'dump',
        'ray',
        'print_r',
    ]);

arch('actions should not touch http')
    ->expect('App\\Actions')
    ->not->toUse('Illuminate\\Http')
    ->not->toUse([
        'request',
        'auth',
        'session',
        'redirect',
        'back',
        'response',
    ]);

arch('actions size')
    ->expect('App\\Actions')
    ->toHaveLineCountLessThan(200);

arch('controllers size')
    ->expect('App\\Http\\Controllers')
    ->toHaveLineCountLessThan(200);

arch('models usage')
    ->expect('App\\Models')
    ->toOnlyBeUsedIn([
        'App\\Actions',
        'App\\Http',
        'App\\Models',
        'Database',
        'Tests',
    ]);

arch('suspicious characters')
    ->expect('App')
    ->not->toHaveSuspiciousCharacters();

arch('dynamic invocation helpers')
    ->expect('App')
    ->not->toUse([
        'call_user_func',
        'call_user_func_array',
        'forward_static_call',
        'forward_static_call_array',
        'create_function',
    ]);

//
