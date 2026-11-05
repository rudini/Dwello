#!/usr/bin/env bash
# Starts the app for persona runs: fresh database dwello_persona (unless --keep-db) with demo data, backend :3301, frontend :3300 (built into /tmp/persona-app)
# --fresh: a fresh installation instead (#774): no demo data, no OAuth, Einrichtungscode PERS-FRSH, a KI stand-in that is
# still downloading the model and a folder for the Sicherung (#718: «Sicherung einrichten» after the account, emptied
# at each start); --second with it: a second one on :3310/:3311 and dwello_persona_2, beside the first
set -e
cd "$(dirname "$0")/../../.."
export JWT_SECRET=persona-secret-key-at-least-32-characters-long
case " $* " in *" --fresh "*) FRESH=1 ;; esac
case " $* " in *" --second "*) [ -n "$FRESH" ] || { echo "--second needs --fresh"; exit 1; }; SECOND=1 ;; esac
# the second shares the first's KI stand-in, which answers like an Ollama only when started with --fresh (code review 774 C-2)
[ -z "$SECOND" ] || curl -sf -o /dev/null http://127.0.0.1:2528/api/tags || { echo "--second needs a running --fresh instance"; exit 1; }
NAME=dwello_persona${SECOND:+_2}
APP=${SECOND:+3310}; APP=${APP:-3300}; API=$((APP + 1))
DB=postgresql://dwello:dwello@localhost:5432/$NAME
for p in $APP $API; do fuser -k $p/tcp 2>/dev/null || true; done
# --keep-db: the servers again on the existing dwello_persona (after a container restart), the records personas saved stay
case " $* " in *" --keep-db "*) KEEP_DB=1 ;; esac
[ -n "$KEEP_DB" ] || { su postgres -c "dropdb --if-exists $NAME" && su postgres -c "createdb -O dwello $NAME"; }
(cd backend && DATABASE_URL=$DB bun scripts/migrate.ts > /tmp/persona-migrate.log 2>&1)
[ -n "$KEEP_DB$FRESH" ] || (cd backend && DATABASE_URL=$DB bun scripts/demo-data.ts) > /tmp/persona-demo.log 2>&1
# its own build directories (svelte.config.js, BUILD_DIR), so an E2E build cannot change the pages under a running persona;
# the build gets package.json (ES modules) and a link to node_modules; --no-build serves the last one again
case " $* " in *" --no-build "* | *" --second "*) ;; *) BUILD_DIR=/tmp/persona-app bun run build > /tmp/persona-build.log 2>&1 ;; esac
[ -f /tmp/persona-app/index.js ] || { echo "no persona build in /tmp/persona-app: run without --no-build"; exit 1; }
cp package.json /tmp/persona-app/ && ln -sfn "$PWD/node_modules" /tmp/persona-app/node_modules
# the servers keep none of the script's output open, so a caller that pipes it gets its end when the script exits
# the KI stand-in of the acceptance tests: it answers the check of a new category and reads uploaded invoice files by
# their name (backend/scripts/llm-stub.ts); other invoices find no KI. Its own port, so an E2E run that started the one
# on 2527 cannot take it away when it ends
# --fresh: the stand-in also answers like an Ollama without the model, at 40 % (POST :2528/stub/pull {percent} changes it)
if [ -z "$SECOND" ]; then
fuser -k 2528/tcp 2>/dev/null || true
(cd backend && env LLM_STUB_PORT=2528 ${FRESH:+LLM_STUB_PULL=on} setsid nohup bun run llm-stub > /tmp/persona-llm.log 2>&1 &) < /dev/null > /dev/null 2>&1
fi
# e-mail goes to the mail catcher of the acceptance tests (shared with E2E, which reuses it): read on :2526/messages
fuser 2525/tcp > /dev/null 2>&1 || (cd backend && setsid nohup bun run mail-catcher > /tmp/persona-mail.log 2>&1 &) < /dev/null > /dev/null 2>&1
[ -z "$FRESH" ] || { rm -rf /tmp/persona-backups$SECOND; mkdir -p /tmp/persona-backups$SECOND; }
(cd backend && env PORT=$API DATABASE_URL=$DB ${FRESH:+SETUP_CODE=PERS-FRSH} ${FRESH:+BACKUP_DIR=/tmp/persona-backups$SECOND} LLM_LOCAL_URL=http://127.0.0.1:2528/v1 ENCRYPTION_KEY=persona-encryption-key MAIL_TRANSPORT=smtp MAIL_FROM=verwaltung@dwello.test SMTP_HOST=127.0.0.1 SMTP_PORT=2525 setsid nohup bun run src/index.ts > /tmp/persona-backend$SECOND.log 2>&1 &) < /dev/null > /dev/null 2>&1
# only the persona-kit's Liegenschaftsverwalter may sign in, as in production (#51); a fresh installation has no OAuth,
# so «Dwello einrichten» shows
# the address search asks the real Gebäuderegister (geo.admin.ch, #479): Node's fetch takes HTTPS_PROXY only with NODE_USE_ENV_PROXY
OAUTH="ALLOWED_EMAILS=verwalter@example.com OAUTH_GOOGLE_CLIENT_ID=x OAUTH_GOOGLE_CLIENT_SECRET=x OAUTH_GOOGLE_REDIRECT_URI=http://localhost:$APP/auth/callback"
[ -z "$FRESH" ] || OAUTH=
env NODE_USE_ENV_PROXY=1 $OAUTH PORT=$APP ORIGIN=http://localhost:$APP BODY_SIZE_LIMIT=11M BACKEND_URL=http://localhost:$API setsid nohup node /tmp/persona-app < /dev/null > /tmp/persona-frontend$SECOND.log 2>&1 &
for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:$APP/login && curl -s -o /dev/null http://localhost:$API/health && break; sleep 1; done
{ curl -s -o /dev/null http://localhost:$APP/login && curl -s -o /dev/null http://localhost:$API/health; } || { echo "not ready"; tail -n 5 /tmp/persona-backend$SECOND.log /tmp/persona-frontend$SECOND.log; exit 1; }
# the download at 40 %, as the README says (code review 774 C-1)
[ -z "$FRESH" ] || curl -s -o /dev/null -X POST http://127.0.0.1:2528/stub/pull -H 'content-type: application/json' -d '{"percent":40}'
echo ready
