# Workflow notes: #947 and #956 (refused backup code, end of «Neuer Wiederherstellungscode»)

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/personas/README.md`, «A fresh installation» | `persona-stack.sh --fresh --second` started in one call before the first instance was up stopped with «--second needs a running --fresh instance»; the two instances need two calls one after the other (the second with `--no-build`). A waiting loop on both ports ran 10 minutes for nothing. | Say in the README: first `--fresh`, then `--fresh --second --no-build` once the first reports «ready». |
| `tests/e2e/CLAUDE.md`, «Run» | `bun run test:e2e -- <feature>` ran Firefox and WebKit too, which are not installed in a cloud session: 50 of 75 failed at the browser launch. Only `--project=chromium` gave a result. | Name `--project=chromium` for a local run of one feature in a cloud session, as pull requests run only Chromium. |
