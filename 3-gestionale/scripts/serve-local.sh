#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8027}"
HOST="${HOST:-127.0.0.1}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/../src" && pwd)"
LOG_FILE="${TMPDIR:-/tmp}/blading-manager-${PORT}.log"

if curl -fsS "http://${HOST}:${PORT}/" >/dev/null 2>&1; then
  echo "Blading Manager gia attivo: http://localhost:${PORT}/"
  exit 0
fi

cd "$APP_DIR"
nohup python3 -m http.server "$PORT" --bind "$HOST" >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

for _ in {1..20}; do
  if curl -fsS "http://${HOST}:${PORT}/" >/dev/null 2>&1; then
    echo "Blading Manager avviato: http://localhost:${PORT}/"
    echo "PID: ${SERVER_PID}"
    echo "Log: ${LOG_FILE}"
    exit 0
  fi
  sleep 0.2
done

echo "Server avviato ma non risponde ancora su http://localhost:${PORT}/" >&2
echo "PID: ${SERVER_PID}" >&2
echo "Log: ${LOG_FILE}" >&2
exit 1
