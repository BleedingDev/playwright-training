#!/usr/bin/env bash
set -euo pipefail

npm install --global pnpm@11.13.0 --silent
pnpm config set store-dir /pnpm/store
pnpm install --frozen-lockfile

exec "$@"
