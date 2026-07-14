#!/usr/bin/env bash
set -uo pipefail

failures=0

pass() {
  echo "PASS $1"
}

fail() {
  echo "FAIL $1"
  echo "     Fix: $2"
  failures=$((failures + 1))
}

check() {
  local label="$1"
  local fix_command="$2"
  shift 2

  if "$@" >/dev/null 2>&1; then
    pass "$label"
  else
    fail "$label" "$fix_command"
  fi
}

check "Docker daemon" "Start Docker Desktop" docker info
check "Docker Compose" "Update Docker Desktop" docker compose version
check "Node $(node --version 2>/dev/null || echo missing)" "mise install" node --version
check "pnpm $(pnpm --version 2>/dev/null || echo missing)" "mise install" pnpm --version

package_version="$(node -p "require('./node_modules/@playwright/test/package.json').version" 2>/dev/null || true)"
image_version="$(sed -n 's/.*mcr.microsoft.com\/playwright:v\([^ -]*\)-.*/\1/p' compose.yaml | head -n 1)"

if [[ -n "$package_version" ]]; then
  pass "@playwright/test $package_version"
else
  fail "@playwright/test is installed" "pnpm install"
fi

if [[ "$package_version" == "$image_version" ]]; then
  pass "Playwright package and Docker image match ($package_version)"
else
  fail "Playwright package/image mismatch ($package_version vs $image_version)" "Pin the same version in package.json and compose.yaml"
fi

check "application container is running" "mise run app:up" docker compose exec -T app true
check "GET /health" "mise run app:up" curl --fail --silent "${PLAYWRIGHT_BASE_URL:-http://127.0.0.1:8080}/health"
check "database migrations" "mise run app:reset" docker compose exec -T app php artisan migrate:status
check "three deterministic demo accounts" "mise run app:reset" docker compose exec -T -e HOME=/tmp app php artisan tinker --execute="throw_unless(App\\Models\\User::query()->whereIn('email', ['customer@example.test', 'operator@example.test', 'admin@example.test'])->count() === 3);"
check "Chromium launch and browser smoke" "pnpm exec playwright install chromium" node scripts/browser-smoke.mjs

if (( failures > 0 )); then
  echo
  echo "$failures check(s) failed."
  exit 1
fi

echo
echo "All workshop checks passed."
