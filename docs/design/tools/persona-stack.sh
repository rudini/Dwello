#!/usr/bin/env bash
# Starts the app for persona runs: fresh database dwello_persona with demo data, backend :3301, frontend :3300 (from a copy of build/ in /tmp/persona-app)
set -e
cd /home/user/Dwello
export JWT_SECRET=persona-secret-key-at-least-32-characters-long
DB=postgresql://dwello:dwello@localhost:5432/dwello_persona
for p in 3300 3301; do fuser -k $p/tcp 2>/dev/null || true; done
su postgres -c "dropdb --if-exists dwello_persona" && su postgres -c "createdb -O dwello dwello_persona"
(cd backend && DATABASE_URL=$DB bun scripts/migrate.ts > /tmp/persona-migrate.log 2>&1)
(cd backend && DATABASE_URL=$DB bun scripts/demo-data.ts) > /tmp/persona-demo.log 2>&1
[ "$1" = "--no-build" ] || bun run build > /tmp/persona-build.log 2>&1
# serve a copy, so a later build (E2E, another stack) cannot change the pages under a running persona; the copy gets
# package.json (ES modules) and a link to node_modules
rm -rf /tmp/persona-app && cp -r build /tmp/persona-app && cp package.json /tmp/persona-app/ && ln -s "$PWD/node_modules" /tmp/persona-app/node_modules
# the servers keep none of the script's output open, so a caller that pipes it gets its end when the script exits
(cd backend && PORT=3301 DATABASE_URL=$DB LLM_BASE_URL=http://127.0.0.1:9/v1 MAIL_TRANSPORT=smtp SMTP_HOST=127.0.0.1 SMTP_PORT=2525 nohup bun run src/index.ts > /tmp/persona-backend.log 2>&1 &) < /dev/null > /dev/null 2>&1
PORT=3300 ORIGIN=http://localhost:3300 BACKEND_URL=http://localhost:3301 OAUTH_GOOGLE_CLIENT_ID=x OAUTH_GOOGLE_CLIENT_SECRET=x OAUTH_GOOGLE_REDIRECT_URI=http://localhost:3300/auth/callback nohup node /tmp/persona-app < /dev/null > /tmp/persona-frontend.log 2>&1 &
for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:3300/login && curl -s -o /dev/null http://localhost:3301/health && echo ready && exit 0; sleep 1; done
echo "not ready"; tail -5 /tmp/persona-backend.log /tmp/persona-frontend.log
