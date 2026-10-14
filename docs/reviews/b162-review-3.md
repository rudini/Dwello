# Code-Review b162 (#162 Demo-Hinweis, #165 Protokoll der Anmeldung), Runde 3

Geprüft im Worktree `review-b162-code-reviewer-3`:

- das Delta `14c9790..69e999a` (Korrekturen aus Runde 2)
- der Merge-Commit `a6652c3`: origin/main `fe34de6` mit #164 und #167, gemergt in den Branch

Alle Dateien im Delta habe ich gelesen. Beim Merge habe ich die Konfliktdateien gegen beide Eltern verglichen (`git diff 69e999a a6652c3` und `git diff fe34de6 a6652c3`):

- `messages/*.json`
- `privacy-page.dom.test.ts`
- `privacy.feature`
- `offene-punkte.md`
- `implementation_plan.md`

## Status der Befunde aus Runde 2

| ID | Status | Beleg |
|----|--------|-------|
| C-8 | offen, im Plan auf #82 verschoben | Die Dauer der Aufbewahrung steht weiterhin nicht in der Datenschutzerklärung. #82 hat einen Kommentar zum Protokoll der Anmeldung vom 14.10.2026, 10:11 (Weber P-2: Zweck, Aufbewahrung, wer liest). Ob dort auch C-8 namentlich steht, habe ich nur am Anfang des Kommentars gesehen. |
| C-9 | behoben | fr `demo_notice_text`: «N’entrez donc que des données inventées, y compris pour …». Die Konstruktion mit Partitiv nach der Verneinung ist weg. |
| C-10 | offen, verschoben auf #82 | wie C-8 |
| C-11 | in U-25 aufgenommen | `docs/design/offene-punkte.md:31`: «Region name and alert title are the same text …» |
| C-12 | behoben | `implementation_plan.md:71`: «ponytail-review on 14c9790 and this delta: nothing to cut» |

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-13 | Minor | messages/fr.json:151 (`privacy_demo_1`, «(voir « Connexion »)») | Main hat mit #81 (f19a C-2, Test `privacy-i18n.dom.test.ts:18`) französische Guillemets mit geschütztem Leerzeichen eingeführt; `privacy_third_5` (fr.json:142) auf derselben Seite schreibt «sous « Connexion »». Der neue Satz in `privacy_demo_1` setzt normale Leerzeichen (`od -c`: `302 253 040`). Dadurch kann der Zeilenumbruch « von «Connexion» trennen, und die Regel der Seite wird uneinheitlich. Korrektur: `« Connexion »`. |
| C-14 | Nit | implementation_plan.md:64 | Der erledigte Punkt «Texts in …» nennt noch `privacy_demo_2`. Den Schlüssel gibt es seit Runde 1 nicht mehr. Der Text ist zwar Geschichte, aber die Liste «Files» und die Texte gelten für den Stand des Abschlusses. |
| C-15 | Nit | messages/de.json:136 (und fr/it/en) | «etwa alle 50 Minuten, solange Dwello offen ist» stimmt für einen einzelnen Tab (`+layout.svelte:28-49`, nur mit `data.user` und ausserhalb von `/login` und `/auth`). Jeder weitere offene Tab verlängert die Sitzung zusätzlich. Für die Aussage «wird protokolliert» spielt das keine Rolle, ich nenne es nur der Vollständigkeit halber. |

Keine Blocker, keine Majors.

## Bestätigt (Code und Test)

### Merge, Verhalten von main erhalten

- **`privacy_login_1`:** Der Text beginnt in allen vier Sprachen mit `{providers}`. Der Test «nennt nur die eingerichteten Anmeldeanbieter» in `privacy-page.dom.test.ts` ist erhalten. Main hatte «nur», «ne … que», «solo» und «only». Der Branch hat das in allen vier Sprachen entfernt und den Satz zum Protokoll eingefügt. Gegenüber main ändert der Merge pro Sprache genau 5 Zeilen: `privacy_login_1`, `demo_notice_title`, `demo_notice_text`, `privacy_demo_1`, minus `}`/Zeilenformat.
- **`privacy_third_2` bis `_5` und `privacy_cookies_1` bis `_4`:** Sie sind identisch mit main, das heisst:
  - CARTO, OpenPLZ und Google Maps sind genannt
  - Google Fonts ist entfernt
  - alle fünf Cookies sind genannt
- **`privacy-page.dom.test.ts`:** Gegenüber main ist nur ein Block hinzugekommen (39 Zeilen), eine Zeile ist entfallen (Kontext). Beide Blöcke des Branches sind vorhanden: «Datenschutzerklärung der öffentlichen Demo» und «… zur Anmeldung». Ebenso alle Blöcke von main: «Anmeldung, Dritten und Cookies» und «Grenzen der genannten Dienste».
  - Die Tests des Branches übergeben jetzt `providers: ['Google']`.
  - Die Prüfung der Anmeldung passt dazu, weil sie erst nach `{providers}` ansetzt.
- **`privacy.feature`:** Alle Szenarien von main sind erhalten: Anbieter, Dienste Dritter, Cookies. Dazu kommt das Szenario «Anmeldungen im Protokoll des Servers» des Branches, ohne `@wip`.
- **`src/routes/privacy/+page.svelte`:** Gegenüber main kommt nur der Abschnitt `{#if data.demo}` hinzu.

### Nummern der offenen Punkte

- **Main:** U-23 (Weber f19a), U-24 (Helga p9b) und O-11 (Contract für Kategorien) sind unverändert.
- **Branch:** Der Demo-Hinweis ist jetzt U-25 (`offene-punkte.md:31`), das Docker-Image O-12 (`:74`). Es gibt keine doppelte Nummer.
- **Plan:** Die Zeilen der Triage zu b162 (`implementation_plan.md:78-84`) verweisen auf U-25. Die Verweise auf U-23 in den Zeilen 33 und 36 gehören zu #81 und sind richtig.
- **Archiv:** `implementation-plan-verlauf.md:5575` erwähnt die Umnummerierung O-11 → O-12.
- **Alte Nummer:** Ausserhalb des Berichts aus Runde 2, der Geschichte ist, verweist keine Datei mehr auf die alte Nummer U-23 oder O-11 des Branches. Gesucht in `docs`, `deploy`, `src` und `tests`.

### Delta aus Runde 2

- **«etwa alle 50 Minuten»:** Das entspricht `50 * 60 * 1000` in `src/routes/+layout.svelte:48`. Die einzigen Stellen, die die E-Mail-Adresse protokollieren, sind weiterhin `auth/callback` und `auth/refresh`.
- **Kein «nur» im Sinn von «verwendet sie nur»:** `privacy-page.dom.test.ts` prüft es mit `not.toContain('verwendet sie nur')`. Das neue «nur erfundene Daten» und «nur der Betreiber» haben einen anderen Sinn und widersprechen dem nicht.
- **DOM-Tests und E2E-Steps:** Sie folgen den neuen Texten mit gleicher oder grösserer Strenge. Betroffen sind `public-pages-layout.dom.test.ts:101-107`, `app-frame.steps.ts:78` und `demo.steps.ts:43`.
  - Die Steps rufen nur die Frage `sectionText` auf.
- **Übersetzungen:** Die Inhalte sind in allen vier Sprachen gleich. Die Anrede ist formell: «N’entrez», «Inserisca», «Suo». Ich habe kein Deutsch in fr/it/en gefunden. Ausnahme: C-13.

## Nicht bestätigt

- **Selbst neu gelaufen** auf `a6652c3`: `bunx vitest run src/__tests__/privacy-page.dom.test.ts src/__tests__/public-pages-layout.dom.test.ts src/__tests__/privacy-i18n.dom.test.ts src/__tests__/privacy.test.ts`, 36 bestanden.
- **Vom Aufrufer gemeldet:** vitest privacy-page, public-pages-layout, i18n und open-work, 46 bestanden.
- **Nicht gesehen**, weil sie zum Zeitpunkt dieses Berichts noch laufen:
  - `test:coverage`
  - lint
  - check
  - Backend-Tests und type-check
  - `deepcheck:audit`
  - E2E, darunter die Zeilen axe und Sprache für privacy und demo nach dem Merge
- **Die Red-Läufe** der 3 DOM-Tests aus dem Plan (Zeile 71) habe ich nicht nachgeprüft.
- **#82:** Ob C-8 und C-10 dort namentlich aufgenommen sind, ist nicht sicher. Ich habe nur den Anfang des Kommentars vom 14.10.2026, 10:11 gelesen (`gh api …/issues/82/comments`).
