#!/bin/bash
# Push server/.env values to Vercel (car-rental-app-server project).
# Usage: from server/ folder run: ./scripts/sync-vercel-env.sh

set -e
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing server/.env"
  exit 1
fi

set -a
source .env
set +a

add_env() {
  local name=$1
  local value=$2
  if [ -z "$value" ] || [[ "$value" == *"YOUR_ATLAS_PASSWORD"* ]] || [[ "$value" == *"<db_password>"* ]]; then
    echo "Skip $name (not set or still a placeholder)"
    return
  fi
  printf '%s' "$value" | npx vercel env add "$name" production --force
  echo "Set $name"
}

add_env MONGODB_URI "$MONGODB_URI"
add_env JWT_SECRET "$JWT_SECRET"
add_env MONGODB_DB_NAME "${MONGODB_DB_NAME:-car-rental}"
add_env IMAGEKIT_PUBLIC_KEY "$IMAGEKIT_PUBLIC_KEY"
add_env IMAGEKIT_PRIVATE_KEY "$IMAGEKIT_PRIVATE_KEY"
add_env IMAGEKIT_URL_ENDPOINT "$IMAGEKIT_URL_ENDPOINT"

echo "Done. Redeploy with: npx vercel deploy --prod"
