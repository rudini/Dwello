# Code-Review Slice `update`, Runde 1 (08bd58c..3db5c36)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Blocker | compose.yaml:146-156, backend/Dockerfile:25, backend/src/updater/updater.ts:810 | Der Update-Dienst hört auf Port 3001, Backend und Frontend rufen ihn auf 3002 auf: Kein Update startet je |
| C-2 | Major | src/lib/ui/UpdateProgress.svelte:415-457, src/lib/ui/UpdateNotice.svelte:261-286 | Die Update-Anzeige (`role="dialog"`, `aria-modal`) bekommt keinen Fokus. Der Fokus bleibt auf «Aktualisieren» hinter ihr, und die Seite dahinter bleibt per Tastatur erreichbar |
| C-3 | Minor | backend/src/updater/updater.ts:772-777 | Scheitert nach einem gelungenen Update das `DELETE` eines `-previous`-Containers, löscht das Zurückrollen die neuen, gesunden Container. Danach gibt es kein `dwello-backend` mehr (das Umbenennen von `dwello-backend-previous` scheitert, weil der Container schon gelöscht ist) |
| C-4 | Minor | backend/src/services/update.service.ts:607, :624-625 | `getConfig` steht ausserhalb von `try`. Antwortet die Datenbank bei der täglichen Abfrage nicht, entsteht über `void checkForUpdate()` eine unbehandelte Ablehnung (dieselbe Fehlerklasse wie backup.pg.test C-14) |
| C-5 | Minor | backend/src/routes/config.ts:524 | Jedes Speichern von «Einstellungen» schickt `update_check` mit und wartet auf GitHub, ohne Timeout. Antwortet GitHub nicht, hängt das Speichern. Zudem geht so bei jedem Speichern eine zusätzliche Anfrage an GitHub («einmal am Tag» in der Datenschutzerklärung) |
| C-6 | Minor | src/lib/ui/UpdateNotice.svelte:253, :261-270 | `slow` wird beim nächsten Start nicht zurückgesetzt. Ein zweiter Versuch nach einem Fehlschlag, der länger als 15 Minuten dauerte, zeigt den Geduld-Satz sofort |
| C-7 | Minor | compose.yaml:105, backend/src/services/update.service.ts:600 | Eine Installation mit fester `DWELLO_VERSION` und dem alten compose.yaml gibt die Variable nicht ans Backend weiter. Genau so aktualisiert sie die bisherige Anleitung, Abschnitt 5. Eine solche Installation fragt GitHub täglich und zeigt den Hinweis «manual». Das Issue entscheidet für eine feste Version anders: kein Hinweis (Fachreview R-3) |
| C-8 | Minor | src/lib/server/auth.ts:162, src/lib/server/update.ts:29, src/routes/config/+page.server.ts:647, tests/contracts/config.json | Zeilen ohne Test: Löschen von `dwello_update_later` beim Abmelden, kein Hinweis ohne `appVersion`, Feld «Updates» ausgeblendet ohne `checks`. Die Seite liest `update_check` aus `GET /config`, aber `config.json` enthält es nicht |
| C-9 | Minor | tests/e2e/targets/aktualisierung.ts:16 | CSS-Selektor `#backup-code-shown` statt `data-testid` |
| C-10 | Minor | tests/e2e/targets/aktualisierung.ts:17-18 | `settingsSave` und `settingsSaved` kopieren `saveSettingsButton` und `savedNotice` aus tests/e2e/targets/settings.ts:4-5 (ponytail `reuse`) |
| C-11 | Minor | .github/workflows/release.yml (`images` needs `release`) | `releases/latest` nennt die neue Version, bevor die Images unter `latest` liegen (Multi-Arch-Build). Prüft eine Installation in diesem Fenster, lädt das Update die alten Images oder nur einen Teil davon: Das Backend kann neu sein und das Frontend alt. Danach kommt der Hinweis wieder |

## C-1 (Blocker): Der Update-Dienst ist unter `UPDATER_URL` nicht erreichbar

Der Dienst `updater` läuft mit dem Backend-Image. Dessen Dockerfile setzt `ENV PORT=3001` (backend/Dockerfile:25). Der Dienst in compose.yaml setzt kein `environment`, darum gilt `Number(process.env.PORT ?? 3002)` (updater.ts:810) = 3001. Backend (compose.yaml:105) und Frontend (compose.yaml:56) rufen aber `UPDATER_URL=http://updater:3002` auf. Folgen:
- `startUpdate` (update.service.ts:644): `fetch` scheitert mit ECONNREFUSED, also wirft der Code einen Fehler ohne Code. `POST /api/v1/update` antwortet 500, der Hinweis zeigt `backend_unknown_error`, und es gibt kein Update.
- `GET /api/update` des BFF antwortet immer 503.
- Das HEALTHCHECK des Images (`localhost:3001/health`) läuft auch im `updater`: Heute antwortet er mit 404, nach der Korrektur ist die Verbindung abgelehnt. Der Container steht darum dauerhaft auf «unhealthy».

Die E2E-Szenarien zeigen den Fehler nicht, weil der Stand-in beides auf 2530 bedient (playwright.config.ts). compose-images.test.ts prüft zwar `UPDATER_URL=http://updater:3002`, aber nicht, auf welchem Port der Dienst hört.

So zeigt es sich: Statisch genügt backend/Dockerfile:25 zusammen mit compose.yaml:146-156 (kein `PORT`). Live: `docker compose up -d`, dann `docker exec dwello-backend bun -e "fetch('http://updater:3002/status').then(r=>console.log(r.status))"` endet mit ECONNREFUSED.

Korrektur: `environment: [PORT=3002]` im `updater` (oder eine eigene Variable statt `PORT`), dazu ein eigenes oder abgeschaltetes `healthcheck`. In compose-images.test.ts eine Prüfung ergänzen, dass der Port des Dienstes dem Port in `UPDATER_URL` entspricht.

## C-2 (Major): Fokus und Tastatur während des Updates

Nach «Jetzt aktualisieren» schliesst `Dialog` und gibt den Fokus an den Auslöser zurück (Dialog.svelte:71 `opener?.focus()`). Der Auslöser ist `update-notice-update`, und der liegt hinter der neuen Fläche `update-overlay` (`fixed inset-0`). Die Fläche selbst nimmt keinen Fokus und macht den Hintergrund nicht `inert`. Folgen:
- Tab führt unsichtbar durch Kopf, Navigation und Seite.
- Enter auf dem fokussierten «Aktualisieren» öffnet die Bestätigung erneut und schickt ein zweites `POST`. Die Ablehnung `UPDATE_RUNNING` erscheint dann im Hinweis hinter der Fläche.
- Im Zustand «failed» bekommt «Schliessen» keinen Fokus. Ein Screenreader liest zwar den `role="alert"` vor, aber die Tastatur erreicht den Knopf erst nach der ganzen Seite.

Damit ist die Fokus-Regel aus CLAUDE.md, «Design-Regeln» verletzt, und `aria-modal="true"` behauptet eine Modalität, die es nicht gibt. axe sieht das nicht.

So zeigt es sich: Ein DOM-Test, wie update-notice.dom.test.ts mit Bestätigen, prüft, ob `document.activeElement` danach in `update-overlay` liegt. Heute liegt es auf `update-notice-update`.

Korrektur: Beim Einblenden den Titel oder die Statuszeile fokussieren (`tabindex="-1"`) und den Rest der App `inert` machen, oder ein natives `<dialog>` mit `showModal()` verwenden. Bei «failed» «Schliessen» fokussieren.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (1087 Tests), die Backend-Tests update.pg, updater, compose-images und api-contracts, die 12 Szenarien von aktualisierung.feature und das Privacy-Szenario grün (vor der letzten Umstrukturierung) sowie die Rot-Läufe per Mutation. Der Lauf auf 3db5c36 war noch nicht fertig.
- Die neuen axe- und Sprachzeilen (`update-*`) liefen nicht. Offen bleiben damit der Kontrast von `text-accent` auf `bg-accent-soft` im Hinweis, die axe-Regel `region` (der Hinweis steht wie die Demo-Zeile ausserhalb eines Landmarks) und ob fr/it/en Deutsch zeigen. Von den Übersetzungen habe ich nur geprüft, dass in allen vier Dateien dieselben Schlüssel stehen.
- `src/__tests__/design-guard.test.ts` und `tokens.test.ts` lesen die Svelte-Dateien als Text, deshalb erfasst `--changed` sie nicht. Ihr Lauf ist nicht gemeldet. Die verwendeten Klassen kommen aber schon in src/lib/ui/Button.svelte vor.
- Den Update-Dienst gegen ein echtes Docker konnte ich nicht prüfen, auch nicht Docker Desktop unter macOS und Windows («Stop and ask» des Issues). Die Docker-API-Aufrufe in updater.ts habe ich nur gelesen.
- Ob `docker compose up -d` nach einem Update die von `updater` angelegten Container wegen des übernommenen Labels `com.docker.compose.image` unnötig neu erstellt, habe ich nicht geprüft.
- Nicht prüfbar, weil es um den PR-Text geht: `Spec change approved: #1453` für den «Stand» in privacy.feature, die Namen der Zustände ohne Szenario (Variante «manual», feste Version) und `open-work` für den Marker `#1454`.

Geprüft: Die bekannten Lücken (Variante ohne Update-Dienst, feste Version, 15-Minuten-Satz) decken update-notice.test.ts, update.pg.test.ts und update-notice.dom.test.ts auf der tieferen Schicht ab. Die Variante «manual» kann der eine Stack mit `UPDATER_URL` nicht erzeugen, «No scenario» ist hier vertretbar. Ebenfalls geprüft: Auth und XSRF der BFF-Routen (hooks.server.ts, `validateXsrfForMutation`), die Codes der Ablehnungen mit `backend_*` in allen vier Sprachen, die Screenplay-Schichten und die Isolation über den Lock `installation`, die Rot-Begründungen der neuen Szenarien und Tests, die Texte nach Fachreview (Abweichungen wie gemeldet) sowie Docs, Installer und Marketing passend zum Issue.
