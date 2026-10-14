# Code-Review b162 (#162 Demo-Hinweis, #165 Protokoll der Anmeldung), Runde 2

Commit-Bereich: `be0b235..14c9790` (ein Commit, `14c9790`), gelesen im Worktree `review-b162-code-reviewer-2`. Alle 23 geänderten Dateien im Delta gelesen; Persona-Berichte und Plan nur auf Triage geprüft.

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | behoben | `privacy_login_1` nennt «jede Anmeldung und jede Verlängerung der Sitzung» (alle vier Sprachen); trifft `auth/callback/+server.ts:48` und `auth/refresh/+server.ts:59-62`. Den Zweck nennt der Text weiterhin nicht (siehe C-10). |
| C-2 | behoben | «nur» entfällt in `privacy_login_1`, das Protokoll steht für jede Installation dort; `privacy_demo_2` ist gelöscht, kein Widerspruch mehr. Erfüllt «Done means» von #165 (Text plus Test `privacy-page.dom.test.ts:58-69`, Szenario `privacy.feature:27-28`). |
| C-3 | behoben | `demo_notice_text` sagt «keine echten Daten … auch keine E-Mail-Adressen oder Telefonnummern» und begründet es («deshalb»). |
| C-4 | behoben | `implementation_plan.md`: `Skills: tdd, ponytail, ponytail-review`. Siehe C-12. |
| C-5 | behoben | it: «registro del server». |
| C-6 | behoben | `sectionText` in `tests/e2e/questions/app-frame.ts:6`, aus `questions/demo.ts` entfernt. |
| C-7 | behoben | `tasks/demo.ts:6-8`: `openDemoSignIn`, `openDemoOverview`, `openDemoPrivacy`; `openDemoPage` nirgends mehr verwendet. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-8 | Minor | messages/de.json:146 (und fr/it/en:146), src/routes/privacy/+page.svelte:40-44 | Mit `privacy_demo_2` ist auch «Ältere Einträge werden laufend überschrieben» verschwunden. Für die Demo stimmte der Satz (Rotation 10 MB × 3 in `deploy/demo/docker-compose.yml`). Jetzt sagt die Datenschutzerklärung der Demo nicht mehr, wie lange das Protokoll die E-Mail-Adresse aufbewahrt. Vorschlag: den Satz an `privacy_demo_1` anhängen («Ältere Einträge im Protokoll des Servers werden laufend überschrieben.»). |
| C-9 | Nit | messages/fr.json:145 | «N’entrez donc pas de vraies données, ni adresses e-mail ni numéros de téléphone»: Nach der Verneinung braucht es den Partitiv, also «ni d’adresses e-mail ni de numéros de téléphone». |
| C-10 | Nit | messages/de.json:136 (und fr/it/en) | Der Satz zum Protokoll nennt keinen Zweck (Betrieb, Fehlersuche). Die Verwendung für die Sitzung und die Kopfzeile wird genannt, die für das Protokoll nicht. |
| C-11 | Nit | src/routes/+layout.svelte:79-80 | `aria-label` der Region und Titel des `Alert` sind derselbe Text. Ein Screenreader liest deshalb zweimal «Öffentliche Demo» nacheinander. Mit `aria-labelledby` auf den Titel wäre es nur einmal. Persona Sven hat den Bereich so verlangt; das ist kein Fehler. |
| C-12 | Nit | implementation_plan.md (Zeile «Skills») | Der Plan sagt, ponytail-review sei auf `be0b235` gelaufen. Ob es auch auf dem Fix-Commit `14c9790` lief, steht nirgends. |

Keine Blocker, keine Majors.

## Bestätigt (Code und Test)

- **Protokoll (#165):** Nur zwei Stellen schreiben die E-Mail-Adresse ins Protokoll:
  - `auth/callback/+server.ts:48`, bei der Anmeldung
  - `auth/refresh/+server.ts:59-62`, bei der Verlängerung der Sitzung

  Gesucht in `src/lib/server`, `src/routes` und `backend/src`; das Backend protokolliert keine E-Mail-Adresse. Der neue Text passt genau dazu. Der Unit-Test prüft den neuen Satz und dass «verwendet sie nur» fehlt. Der neue E2E-Step in `app-frame.steps.ts:74-81` ruft nur die Frage `sectionText` auf.
- **«Ihren Namen und Ihre E-Mail-Adresse sehen andere Besucher nicht»:** Das Backend speichert keine Benutzerdaten. `user.name` oder `user.email` kommen in Routen und Services nicht vor; `middleware/auth.ts` liest sie nur aus dem JWT. Im Frontend zeigt nur `Header.svelte:100` den eigenen Benutzer. Die Aussage stimmt.
- **Demo-Hinweis:** In `+layout.svelte:79` ist der Hinweis jetzt eine `<section>` mit `aria-label`, also ein Landmark «region». Sie steht in allen drei Zweigen innerhalb von `main`. `Alert` hat beim Ton caution weiterhin kein `role`. Die DOM-Tests prüfen den Namen der Region und den neuen Text. Die Tokens sind unverändert.
- **E2E:** `demo.feature` hat nur einen umformulierten `Dann`-Satz, ist so streng wie vorher und prüft jetzt den ganzen Satz statt nur «E-Mail-Adresse». Das neue Szenario in `privacy.feature` hat kein `@wip`; `Scenario red` steht im Plan für beide. Die Features beschreiben das Ziel, nicht die Bedienung. Die Steps rufen nur Tasks und Fragen auf.
- **Übersetzungen:** `privacy_login_1`, `demo_notice_text` und `privacy_demo_1` sind in allen vier Sprachen inhaltlich gleich.
  - Anrede formell: Sie, vous (Imperativ «entrez»), Lei («Suo», «Non inserisca»).
  - Kein Deutsch in fr/it/en.
  - Begriffe: fr «journal du serveur», «prolongation de la session»; it «registro del server», «prolungamento della sessione»; en «server log», «made-up sample data».
  - `privacy_demo_2` ist in allen vier Dateien entfernt und wird nirgends mehr verwendet.
  - Grammatik: siehe C-9.
- **Neue Zeile U-23 in `offene-punkte.md`:** Sie nimmt die offenen Persona-Befunde auf. Die Triage-Zeilen im Plan stimmen mit den Berichten überein.
- **Nichts Fremdes im Diff:** #165 gehört laut Auftrag zur Anforderung.

## Nicht bestätigt

- Selbst neu laufen lassen: `bunx vitest run src/__tests__/privacy-page.dom.test.ts src/__tests__/public-pages-layout.dom.test.ts`, 25 Tests bestanden.
- Vom Aufrufer gemeldet:
  - lint sauber
  - `deepcheck:audit` ohne Ausgabe
  - vitest komplett: 2295 bestanden
  - E2E chromium: 53 bestanden, darunter das neue Szenario «Anmeldungen im Protokoll des Servers» und die axe- und Sprachzeilen von login, dashboard und privacy
- Die Red-Läufe im Plan (4 failed, Szenarien rot) habe ich nicht nachgeprüft.
- Nicht gelaufen: `bun run check`, Coverage, Backend-Tests. Das Backend ist im Delta unverändert.
- Nicht geprüft: ob axe die zusätzliche Region in allen Viewports ohne Verstoss akzeptiert. Das zeigt nur der E2E-Lauf des Aufrufers.
