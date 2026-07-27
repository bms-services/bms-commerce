#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${1:-${HOME}/htdocs/store.bmsservices.id}"
PORT="${PORT:-3000}"
PID_FILE="${DEPLOY_PATH}/.deploy/storefront.pid"
LOG_DIR="${HOME}/logs"
LOG_FILE="${LOG_DIR}/store-app.log"

cd "${DEPLOY_PATH}"

mkdir -p "${DEPLOY_PATH}/.deploy" "${LOG_DIR}"

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found in ${DEPLOY_PATH}"
  echo "Create production .env on the server before the first deploy."
  exit 1
fi

export PATH="/usr/local/bin:/usr/bin:${PATH}"
export PORT

npm ci
npm run build

stop_app() {
  if [[ -f "${PID_FILE}" ]]; then
    local pid
    pid="$(cat "${PID_FILE}")"
    if kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
      sleep 2
    fi
    rm -f "${PID_FILE}"
  fi

  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${PORT}/tcp" 2>/dev/null || true
    sleep 1
  fi
}

stop_app

nohup npm start >> "${LOG_FILE}" 2>&1 &
echo "$!" > "${PID_FILE}"

for _ in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:${PORT}" >/dev/null 2>&1; then
    echo "Storefront deploy finished (pid $(cat "${PID_FILE}"))."
    exit 0
  fi
  sleep 2
done

echo "ERROR: storefront did not become healthy on port ${PORT}"
tail -30 "${LOG_FILE}" || true
exit 1
