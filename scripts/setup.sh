#!/usr/bin/env bash
set -euo pipefail

pnpm install --frozen-lockfile
pnpm exec playwright install chromium
docker compose build app
docker compose up --detach app
docker compose exec -T app php artisan migrate:fresh --seed --force
bash scripts/wait-for-health.sh "${PLAYWRIGHT_BASE_URL:-http://127.0.0.1:8080}/health"

echo
echo "SídloFlow: ${PLAYWRIGHT_BASE_URL:-http://127.0.0.1:8080}"
echo "Demo accounts: customer@example.test, operator@example.test, admin@example.test"
echo "Demo password: password"
