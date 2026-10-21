# Code-Review Runde 1, Slice «landing» (ea3ad3e..8d029a3)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major (Produktentscheid) | marketing/index.html:702, :895; docs/installation.md:20 | Das Repository ist weiterhin privat (`gh api repos/rudini/Dwello` → `"private": true`). Die neue Hauptaufgabe der Seite, «Anleitung zum Weitergeben», führt Besucher auf eine 404, und `git clone` in Abschnitt 2 der Anleitung scheitert. Fach-Review R-1 ist nicht behoben, obwohl der Aufrufer alle Befunde als behoben meldet. |
| C-2 | Major | marketing/index.html:398-404 | Das Handy-Menü (`<details>` im Sticky-Header) bleibt nach der Wahl eines Abschnitts offen und verdeckt dann den Abschnitt, zu dem gesprungen wurde. Kein Code schliesst es, auch nicht mit Escape. |
| C-3 | Minor | marketing/index.html:700, :422, :701, :860 | Der Titel lautet weiter «Einmal einrichten lassen, dann läuft es.», und Datensicherungen geschehen «ab und zu». Die Anleitung (docs/installation.md:62) verlangt aber «regularly». Damit ist V-1 aus dem Fach-Review nur halb umgesetzt: Die Seite verharmlost die laufende Datensicherung. |
| C-4 | Minor | docs/installation.md:39 | «of the other values, `docker-compose.prod.yml` uses only `PUBLIC_APP_URL`, `COOKIE_DOMAIN`, `CORS_ORIGIN` and `LLM_*`» stimmt nicht. Compose liest auch `OPERATOR_*`, `MAIL_PROVIDER_NAME`, `MAIL_PROVIDER_COUNTRY` und `APP_VERSION` (docker-compose.prod.yml:14, 22-27); `OPERATOR_*` nennt der übernächste Absatz selbst. |
| C-5 | Minor | docs/installation.md:62 | Die Anleitung beschreibt die Datensicherung, aber nicht die Wiederherstellung (`psql`/`pg_restore` in `dwello-postgres`). Auch das README beschreibt sie nicht. Für eine «complete guide to hand on», mit der eine Hilfsperson die Daten nach einem Defekt zurückholen soll, fehlt damit der entscheidende Schritt. |
| C-6 | Minor | marketing/index.html:93 | `.num { font-variant-numeric: tabular-nums; }` wird nicht mehr verwendet. Die einzige Nutzung (`<b class="num">609</b>`) hat der Diff entfernt. |
| C-7 | Minor | marketing/index.html:181 | `.flow li::before` verwendet `border-radius: 50%`. Das ist kein Token-Radius (token-referenz.md:55: nur `--radius-control`/`--radius-panel`). Der Rest der Seite hielt sich vor dem Diff daran (0 Treffer für `50%` in ea3ad3e). |

## C-1 Repository privat (Major, Produktentscheid)

Warum falsch: Die Anforderung verlangt, dass die Installation an eine Hilfsperson weitergegeben wird. Der einzige Weg dorthin ist der Link `https://github.com/rudini/Dwello/blob/main/docs/installation.md` (Button im Abschnitt «Installieren» und im Footer). Bei privatem Repository gibt GitHub Besuchern ohne Anmeldung HTTP 404. Abschnitt 2 der Anleitung (`git clone https://github.com/rudini/Dwello.git`) scheitert ebenso. «Der ganze Quellcode ist öffentlich» (Abschnitt «Open Source») ist heute unrichtig. Diese Aussage bestand schon vorher, der Diff macht sie aber zum Kern des Ablaufs.

`deploy-site.yml` lädt `marketing/**` bei jedem Push auf `main` hoch (`.github/workflows/deploy-site.yml:16-19`). Ein Merge veröffentlicht die Seite also sofort mit dem toten Link.

So zeigt man es: `gh api repos/rudini/Dwello --jq .private` liefert `true`. Danach den Link in einem privaten Browserfenster öffnen: 404.

Lösung (Entscheid des PO): Das Repository vor dem Merge öffentlich schalten oder den Deploy bis dahin zurückhalten. Gehört unter «Blocked on me».

## C-2 Menü bleibt nach der Wahl offen (Major)

Warum falsch: `.site-header` ist `position: sticky` (index.html:113). `.menu-panel` hängt mit `position: absolute` am Header (:102). Darin stehen sechs Abschnittslinks und vier Sprachlinks, je mindestens 48 px hoch, zusammen rund 520 px. Ein `<details>` schliesst sich beim Klick auf einen Anker in seinem Inhalt nicht von selbst. Das Skript (:907-941) behandelt nur Kopieren und Tabs.

Folge: Auf 390 px tippt die Vermieterin «Datenschutz» an, die Seite scrollt, und das Menü-Panel bleibt oben im Viewport stehen. Es verdeckt den Grossteil des angesprungenen Abschnitts, bis sie wieder «Menü» antippt. Gerade das Telefon-Menü ist eine Anforderung dieses Slices. Escape schliesst das Menü ebenfalls nicht, und Tastaturnutzer lassen es beim Wegtabben offen.

So zeigt man es: Chromium auf 390 px, «Menü», dann «Datenschutz». Das Panel bleibt über dem Abschnittstitel stehen.

Lösung: ein paar Zeilen im vorhandenen Skript, z. B. `document.querySelectorAll('.menu-panel a').forEach(a => a.addEventListener('click', () => a.closest('details').open = false))`, dazu Escape, das das Menü schliesst und den Fokus auf `summary` setzt.

## Nicht bestätigt

- `python3 marketing/i18n/build.py` ohne Fehler, kein Deutsch übrig, keine unbenutzten Schlüssel: vom Aufrufer gemeldet, nicht erneut ausgeführt (der Build schreibt Dateien). Die SAME-Liste in build.py habe ich gegen die Quellseiten geprüft: jeder Eintrag kommt noch vor.
- Chromium auf 390/960 px in de/fr/it/en ohne horizontales Scrollen, h1 passt; Screenshots hell/dunkel: vom Aufrufer gemeldet, nicht nachgeprüft (kein Browser gestartet). Die Breite von `.split-bar` (6 Spalten auf 390 px) und den Chevron-Versatz (−13 px bei 16 px Lücke) habe ich nur rechnerisch geprüft.
- `bunx vitest run src/__tests__/open-work.test.ts` grün (Zeile O-46): vom Aufrufer gemeldet.
- `CHF 215.80` (Nachzahlung Hans Müller 2025) habe ich nur über `tests/ui-screenshots/statement-pdf.ts:93` belegt, nicht über eine laufende Demo. Lift 1'690.00 / 6 = 281.67 stimmt mit `backend/demo/demo-data.sql:21-26,131` und `statement-pdf.ts:53` überein.
- Ob Google eine App im Status «In production» mit nur `openid email profile` ohne Verifizierung zulässt (installation.md, Abschnitt 3), habe ich nicht in der Google-Dokumentation nachgeprüft. Die Scopes selbst sind bestätigt (`src/lib/server/oauth.ts:46`).
- Ob sich der Satz zum Wiederherstellen im Fach-Review als offen erledigt hat, habe ich nicht weiter verfolgt (C-5 aus dem Code).

Geprüft: alle geänderten Dateien im Bereich (index.html, brand.html, build.py, i18n/*.json, die generierten fr/it/en-Seiten stichprobenweise, installation.md, offene-punkte.md). Installation.md stimmt in Containernamen, Ports, `ALLOWED_EMAILS` (Start verweigert, `src/hooks.server.ts:27`), `COOKIE_SECURE`-Default, `POSTGRES_PASSWORD` und Modellname mit `docker-compose.prod.yml` und `.env.example` überein. Ebenso bestätigt: vier Heizprofile (`backend/src/services/heating-profile.service.ts:5`), AGPL-3.0-or-later und MCP als «geplant». Tokens und 48 px stimmen bei Menü, `.flow` und `.split`. Die Sprachlinks im Menü der generierten Seiten zeigen auf die richtigen Pfade. Die Fach-Befunde R-2 bis R-7 sind umgesetzt. Kein E2E/a11y-Eintrag nötig (statische Website ausserhalb der App).
