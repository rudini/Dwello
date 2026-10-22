#!/usr/bin/env bash
# Starts the app for persona runs: fresh database dwello_persona (unless --keep-db) with demo data, backend :3301, frontend :3300 (built into /tmp/persona-app)
set -e
cd "$(dirname "$0")/../../.."
export JWT_SECRET=persona-secret-key-at-least-32-characters-long
DB=postgresql://dwello:dwello@localhost:5432/dwello_persona
for p in 3300 3301; do fuser -k $p/tcp 2>/dev/null || true; done
# --keep-db: the servers again on the existing dwello_persona (after a container restart), the records personas saved stay
case " $* " in *" --keep-db "*) KEEP_DB=1 ;; esac
[ -n "$KEEP_DB" ] || { su postgres -c "dropdb --if-exists dwello_persona" && su postgres -c "createdb -O dwello dwello_persona"; }
(cd backend && DATABASE_URL=$DB bun scripts/migrate.ts > /tmp/persona-migrate.log 2>&1)
[ -n "$KEEP_DB" ] || (cd backend && DATABASE_URL=$DB bun scripts/demo-data.ts) > /tmp/persona-demo.log 2>&1
# its own build directories (svelte.config.js, BUILD_DIR), so an E2E build cannot change the pages under a running persona;
# the build gets package.json (ES modules) and a link to node_modules; --no-build serves the last one again
case " $* " in *" --no-build "*) ;; *) BUILD_DIR=/tmp/persona-app bun run build > /tmp/persona-build.log 2>&1 ;; esac
[ -f /tmp/persona-app/index.js ] || { echo "no persona build in /tmp/persona-app: run without --no-build"; exit 1; }
cp package.json /tmp/persona-app/ && ln -sfn "$PWD/node_modules" /tmp/persona-app/node_modules
# the servers keep none of the script's output open, so a caller that pipes it gets its end when the script exits
# the KI stand-in of the acceptance tests: it answers the check of a new category and reads uploaded invoice files by
# their name (backend/scripts/llm-stub.ts); other invoices find no KI. Its own port, so an E2E run that started the one
# on 2527 cannot take it away when it ends
fuser -k 2528/tcp 2>/dev/null || true
(cd backend && LLM_STUB_PORT=2528 nohup bun run llm-stub > /tmp/persona-llm.log 2>&1 &) < /dev/null > /dev/null 2>&1
# e-mail goes to the mail catcher of the acceptance tests (shared with E2E, which reuses it): read on :2526/messages
fuser 2525/tcp > /dev/null 2>&1 || (cd backend && nohup bun run mail-catcher > /tmp/persona-mail.log 2>&1 &) < /dev/null > /dev/null 2>&1
(cd backend && PORT=3301 DATABASE_URL=$DB LLM_LOCAL_URL=http://127.0.0.1:2528/v1 ENCRYPTION_KEY=persona-encryption-key MAIL_TRANSPORT=smtp MAIL_FROM=verwaltung@dwello.test SMTP_HOST=127.0.0.1 SMTP_PORT=2525 nohup bun run src/index.ts > /tmp/persona-backend.log 2>&1 &) < /dev/null > /dev/null 2>&1
# only the persona-kit's Liegenschaftsverwalter may sign in, as in production (#51)
# the address search asks the real Gebäuderegister (geo.admin.ch, #479): Node's fetch takes HTTPS_PROXY only with NODE_USE_ENV_PROXY
NODE_USE_ENV_PROXY=1 ALLOWED_EMAILS=verwalter@example.com PORT=3300 ORIGIN=http://localhost:3300 BODY_SIZE_LIMIT=11M BACKEND_URL=http://localhost:3301 OAUTH_GOOGLE_CLIENT_ID=x OAUTH_GOOGLE_CLIENT_SECRET=x OAUTH_GOOGLE_REDIRECT_URI=http://localhost:3300/auth/callback nohup node /tmp/persona-app < /dev/null > /tmp/persona-frontend.log 2>&1 &
for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:3300/login && curl -s -o /dev/null http://localhost:3301/health && echo ready && exit 0; sleep 1; done
echo "not ready"; tail -5 /tmp/persona-backend.log /tmp/persona-frontend.log
