# Code-Review b162 (#162 Demo-Hinweis), Runde 1

Commit-Bereich: `299cf69..be0b235` (ein Commit, `be0b235`), gelesen im Worktree `review-b162-code-reviewer`. Alle 23 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | messages/de.json:147 (und fr/it/en:147) | Die Datenschutzerklärung nennt nur das Protokoll der Anmeldung. `src/routes/auth/refresh/+server.ts:59-62` schreibt aber auch bei jeder Verlängerung der Sitzung (alle 50 Minuten, `+layout.svelte:29-49`) `email` auf Level info ins Protokoll. Damit zeigt das Protokoll, wann jemand die App nutzt, und das sagt der Text nicht. Vorschlag: «Jede Anmeldung und jede Verlängerung der Sitzung …», dazu der Zweck (z. B. Betrieb und Fehlersuche). |
| C-2 | Minor | src/routes/privacy/+page.svelte:20, messages/de.json:136 | Im Demo-Modus stehen auf derselben Seite zwei Aussagen, die sich widersprechen: `privacy_login_1` sagt, Dwello verwende die E-Mail-Adresse «nur, um die Sitzung zu führen und den Namen in der Kopfzeile anzuzeigen», und `privacy_demo_2` sagt, sie werde protokolliert. Genau diesen Widerspruch nennt #162 unter «Problem». Das Protokoll gibt es auch in eigenen Installationen (Callback, Refresh). Der Fehler in `privacy_login_1` bestand also schon vor der Änderung und gehört als offene Arbeit erfasst (Zeile in `offene-punkte.md` oder ein Issue). |
| C-3 | Minor | messages/de.json:144 (und fr/it/en:144) | Der Hinweis zählt nur «Namen, Adressen oder Beträge» auf. Das Issue verlangt: «keine echten Daten». E-Mail-Adressen, Telefonnummern und IBAN von Mietern fallen so aus der Aufzählung, obwohl die App sie erfasst. Vorschlag: «Geben Sie keine echten Daten ein (Namen, Adressen, E-Mail-Adressen, Beträge).» |
| C-4 | Minor | implementation_plan.md:50 | Die Plan-Zeile lautet `Skills: tdd, ponytail (ponytail-review before the review)` statt `Skills: tdd, ponytail, ponytail-review`. Dass ponytail-review gelaufen ist, steht nirgends. |
| C-5 | Nit | messages/it.json:147 | «nel protocollo del server»: «protocollo» bedeutet im Italienischen eher ein amtliches Register. Für ein Server-Log ist «registro del server» üblich. |
| C-6 | Nit | tests/e2e/questions/demo.ts:7 | `sectionText` ist eine allgemeine Frage zu einem Abschnitt (Target `pageSection` aus `app-frame`). Sie gehört neben `sectionShown` in `questions/app-frame.ts`, nicht in `demo.ts`. |
| C-7 | Nit | tests/e2e/steps/demo.steps.ts:483-491 | Die Steps geben URL-Pfade an den Task (`openDemoPage('/dashboard')`). Passender wären fachlich benannte Tasks (`openDemoDashboard` …), so wie bei `openSettings` oder `openNewBuilding`. |

Es gibt keine Blocker und keine Majors.

## Bestätigt (Code und Test)

- **`DEMO=on` gesetzt:** `+layout.server.ts:247` meldet dann `demo: true`. Ohne die Variable ist es `false`; das zeigt `layout-load.test.ts`. `process.env` wird hier wie in `privacy/+page.server.ts` gelesen, der Wert geht nur als Boolean an den Client. In `deploy/demo/docker-compose.yml:18-20` gibt die Variable dem Frontend mit. Compose führt die `environment`-Listen nach Name mit der Basis aus `docker-compose.prod.yml` zusammen.
- **Platzierung in allen drei Zweigen von `+layout.svelte`:**
  - App-Rahmen (Zeile 100): oben in `main`, vor dem Seiteninhalt.
  - Hilfe, Datenschutz und Nutzungsbedingungen ohne Anmeldung (Zeile 128).
  - Anmeldeseite, `/auth` und Fehlerseiten ohne Anmeldung (Zeile 134).
  - Hilfe und die Rechtsseiten nach der Anmeldung zeigen den App-Rahmen und damit den Hinweis.
  - Abstände nur über Tokens (`mb-8`, `px-4 pt-4`). Die Komponente ist `Alert` aus `src/lib/ui`. Ton `caution`, deshalb ohne `role="alert"`: Der Hinweis wird nicht bei jeder Navigation vorgelesen, er steht nach dem Skip-Link an erster Stelle in `main`.
  - Abgedeckt durch `public-pages-layout.dom.test.ts`: Anmeldung, App-Seite, `/help`, `/privacy`, `/terms` und kein Hinweis ohne Demo.
- **Datenschutz:** Den Abschnitt «Öffentliche Demo» gibt es nur im Demo-Modus (`privacy/+page.svelte:40-45`); das zeigt `privacy-page.dom.test.ts`. Inhaltlich stimmt der Text mit dem Code überein:
  - Gemeinsame Daten: `deploy/demo/README.md`.
  - Nächtliches Zurücksetzen: `reset-demo.sh` legt die Datenbank neu an und lädt die Demodaten.
  - Protokoll der Anmeldung mit E-Mail-Adresse: `auth/callback/+server.ts:48`, Level info.
  - «Ältere Einträge werden laufend überschrieben»: Rotation json-file mit 10 MB × 3 (`deploy/demo/docker-compose.yml:7-11`).
  - Einschränkung siehe C-1.
- **Texte:** Alle vier `messages/*.json` haben dieselben vier Schlüssel. Anrede formell (Sie, vous, Lei), Schweizer «ss», Fachbegriffe passen. Abweichung beim Inhalt siehe C-3.
- **Szenarien:** `demo.feature` deckt alle vier Punkte aus «Done means» ab, ohne `@wip`; `Scenario red` steht im Plan. Die Fragen geben Texte zurück. Die Negativprüfung hat einen positiven Anker («auf der Seite "Anmelden"»). Die Steps rufen nur Tasks und Fragen auf.
- **a11y:** Der Zustand `demo` ist eingetragen bei login, dashboard und privacy, sowohl in `screens.json` (mit `stateMeaning`) als auch in `accessibility.feature` und `sprachen-bildschirme.feature`. `tasks/accessibility.ts` leitet `demo` auf die Instanz 3104 um und wartet auf den Hinweis.
- **Nichts Fremdes im Diff:** Der Umbau von `onEmptyInstance` zu `instanceOf` ist nötig, weil ein dritter Zielserver dazukommt.

## Nicht bestätigt

- Die drei geänderten Unit-Testdateien habe ich selbst neu laufen lassen (`bunx vitest run src/__tests__/layout-load.test.ts src/__tests__/privacy-page.dom.test.ts src/__tests__/public-pages-layout.dom.test.ts`): 24 Tests bestanden.
- Vom Aufrufer gemeldet, nicht selbst geprüft:
  - `bun run lint` sauber
  - `bun run deepcheck:audit` ohne Ausgabe
  - `bunx vitest run` komplett: 144 Dateien, 2292 Tests
  - `bun run check` ohne Fehler
  - Prettier
  - E2E chromium: 61 bestanden, darunter `demo.feature`, die axe-Zeilen für den Zustand demo (hell und dunkel, alle Viewports) und die Sprachzeilen
- Die Red-Läufe stehen in `implementation_plan.md:41-44`. Nachgeprüft habe ich sie nicht.
- Nicht geprüft: ob die Sitzungs-Cookies in der CI wirklich für Port 3104 gelten (`tasks/demo.ts:3` sagt es; die E2E-Läufe des Aufrufers sprechen dafür) und ob Compose auf der Demo-VM die `environment`-Listen tatsächlich zusammenführt (nur nach der Compose-Spezifikation beurteilt).
- Coverage, `bun run check` des Backends und das Deployment selbst: nicht gelaufen. Das Backend ist unverändert.
