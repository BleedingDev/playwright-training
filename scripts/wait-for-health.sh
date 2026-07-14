#!/usr/bin/env bash
set -euo pipefail

url="${1:-http://127.0.0.1:8080/health}"

for attempt in {1..60}; do
  if curl --fail --silent --show-error "$url" >/dev/null; then
    echo "PASS application health: $url"
    exit 0
  fi

  sleep 1
done

echo "FAIL application health: $url"
echo "Try: docker compose logs app"
exit 1

