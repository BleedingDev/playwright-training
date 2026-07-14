<?php

declare(strict_types=1);

it('redirects guests to login', function (): void {
    $page = visit('/');

    $page
        ->assertPathIs('/login')
        ->assertSee('Prihlásiť sa');
});
