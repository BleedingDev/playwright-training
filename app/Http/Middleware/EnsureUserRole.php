<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureUserRole
{
    /** @param Closure(Request): Response $next */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $role = $request->user()?->role;
        $allowed = array_map(
            UserRole::from(...),
            $roles,
        );

        abort_unless($role instanceof UserRole && in_array($role, $allowed, true), 403);

        return $next($request);
    }
}
