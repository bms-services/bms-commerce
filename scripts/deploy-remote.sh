#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${1:-${HOME}/htdocs/store.bmsservices.id}"
APP_NAME="bms-storefront"

cd "${DEPLOY_PATH}"

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found in ${DEPLOY_PATH}"
  echo "Create production .env on the server before the first deploy."
  exit 1
fi

export PATH="/usr/local/bin:/usr/bin:${PATH}"

npm ci
npm run build

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

if pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
  pm2 reload "${APP_NAME}" --update-env
else
  pm2 start npm --name "${APP_NAME}" -- start
  pm2 save
fi

echo "Storefront deploy finished."
