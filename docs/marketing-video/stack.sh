#!/usr/bin/env bash
# The app for the marketing videos (#1445), on :3300 (docs/design/tools/persona-stack.sh), its backend restarted:
#   stack.sh           fresh demo data and a real KI that reads images (any OpenAI-compatible API), so the upload
#                      scene shows what a model really reads: MV_LLM_URL (default OpenRouter), MV_LLM_MODEL (default
#                      qwen/qwen3-vl-30b-a3b-instruct), MV_LLM_KEY. Run it before each recording of the app scenes:
#                      they need Alpenblick's 2025 statements not made yet.
#   stack.sh --fresh   a fresh installation whose Einrichtungscode is the terminal scene's K7QM-3XRP (scene setup)
set -e
cd "$(dirname "$0")/../.."
docs/design/tools/persona-stack.sh "$@" > /dev/null
if [ "$1" = --fresh ]; then
  KI=(SETUP_CODE=K7QM-3XRP BACKUP_DIR=/tmp/persona-backups LLM_LOCAL_URL=http://127.0.0.1:2528/v1)
else
  KI=(LLM_BASE_URL="${MV_LLM_URL:-https://openrouter.ai/api/v1}" LLM_MODEL="${MV_LLM_MODEL:-qwen/qwen3-vl-30b-a3b-instruct}"
    LLM_API_KEY="${MV_LLM_KEY:-dummy}" LLM_PROVIDER=OpenRouter LLM_PROVIDER_COUNTRY=USA)
fi
cd backend
fuser -k 3301/tcp > /dev/null 2>&1 || true
sleep 1
env JWT_SECRET=persona-secret-key-at-least-32-characters-long PORT=3301 \
  DATABASE_URL=postgresql://dwello:dwello@localhost:5432/dwello_persona "${KI[@]}" \
  ENCRYPTION_KEY=persona-encryption-key-of-the-persona-stack \
  MAIL_TRANSPORT=smtp MAIL_FROM=verwaltung@dwello.test SMTP_HOST=127.0.0.1 SMTP_PORT=2525 \
  setsid nohup bun run src/index.ts < /dev/null > /tmp/marketing-video-backend.log 2>&1 &
for _ in $(seq 30); do curl -sf -o /dev/null http://localhost:3301/health && break; sleep 1; done
curl -sf -o /dev/null http://localhost:3301/health || { echo "not ready: /tmp/marketing-video-backend.log"; exit 1; }
echo ready
