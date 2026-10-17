# Code-Review W6b (#63, #105, #106), Runde 1

Gegenstand: `git diff 76424e0 758b220` (Worktree `review-w6b-code`, detached auf 758b220), alle 48 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `README.md:24` | Sagt noch «Romansh can be chosen, the PDF is then in German». Seit #63 ist das falsch. Die anderen Dokumente hat der Diff angepasst, das README nicht |
| C-2 | Minor | `backend/src/services/reminder.service.ts:141-148` (`markDocumentPosted`) | Ein Brief, der noch zu versenden ist, wird beim Versand in der *aktuellen* Sprache des Mieters neu gemacht. Titel und Dateiname des Dokuments bleiben in der Sprache vom Tag der Erstellung. Ändert der Verwalter dazwischen die Sprache, stimmen Dateiname/Titel nicht mehr mit dem PDF überein (z. B. «Rappel de paiement NK-….pdf» mit italienischem Brief). Die Oberfläche merkt nichts davon, weil `localTitle` nach Stufe benennt. Ein Randfall, ohne Test |
| C-3 | Nit | `backend/src/routes/statements.ts:303` | Der Kommentar sagt «de, fr, it, en», der Body nimmt aber jeden String an. `language: 'rm'` führt jetzt zu `FLOORS['rm']` = undefined, also zu 500 `PDF_FAILED`, früher gab es ein deutsches PDF. Die BFF schickt `{}`, also nur über die API erreichbar. Für unbekannte Codes bestand das schon vorher. `t.Union` der vier Literale wie in `tenants.ts:31` würde es abweisen |
| C-4 | Nit | `src/routes/statements/[id]/PdfAction.svelte:44` | ponytail `delete:` `?? pdfIn.de` fängt nichts ab: `language` ist typisiert und hat den Standardwert `'de'` (undefined greift dort). Ersatz: `pdfIn[language]()` |
| C-5 | Nit | `backend/src/services/reminder-letter.ts:18,87` | ponytail `yagni:` `language?` ist optional mit `?? 'de'`, und der einzige Aufrufer (`reminder.service.ts:90`) gibt die Sprache immer mit. Optional bleibt es nur wegen der alten Unit-Tests ohne Sprache. Vertretbar, aber dann ist es tote Flexibilität |
| C-6 | Nit | `tests/e2e/targets/tenant-form.ts:10` | `.locator('option')` ist ein CSS-Tag-Selektor. `getByRole('option')` innerhalb des Selects kommt ohne CSS aus (CLAUDE.md, «Selectors») |
| C-7 | Nit | `tests/e2e/steps/statement-detail.steps.ts:248` | Der Schritt `nennt die Abrechnung {string}` ist sehr allgemein formuliert, prüft aber nur den Sprachhinweis des PDFs (`languageOfPdf`). Ein späterer Schritt «nennt die Abrechnung …» mit anderem Ziel würde mit ihm kollidieren. Vorschlag: «nennt die Abrechnung die Sprache des PDFs {string}» |
| C-8 | Nit | `backend/src/__tests__/migrations.pg.test.ts:72` | Das `mkdtemp`-Verzeichnis mit den kopierten Migrationen wird nicht aufgeräumt |
| C-9 | Nit | `tests/e2e/features/tenant-edit.feature:26` | «bietet das Formular … an» nennt ein UI-Element. Die Regel verbietet ausdrücklich nur «Feld»/«Button». Fachlicher wäre etwa «stehen für "Anna Keller" die Sprachen … zur Wahl» |

Keine Blocker, keine Majors.

## Bestätigt (Anforderung → Code und Test)

- **#63 Auswahl de/fr/it/en:** `tenants.ts:31` (Union), `config.service.ts:86`, `pdf.service.ts` `Language`, `types.ts:65`, `tenant.ts` (Label `rm` weg), `messages/*` `tenants_language_rm` in allen vier Dateien entfernt. Test: `tenant-form-fields.dom.test.ts` (Optionen, Label, Hilfetext, kein «Rätoromanisch»). Szenario `tenant-edit.feature` «Sprache für Abrechnung und Mahnungen». Ohne die Änderung rot (Option «Rätoromanisch», Label «Sprache»).
- **#63 Migration rm → de:** `0008_tenant_language_without_rm.sql` setzt Mieter und `default_language` um und ersetzt den CHECK. Test: `migrations.pg.test.ts` wendet erst 0001–0007 an, fügt `rm` ein, wendet dann alle an und prüft `de`, unverändertes `it`, Config `de` und die Ablehnung von `rm` durch den CHECK. Ohne 0008 rot. Eine Migration, die schon angewendet wurde, ist nicht geändert. `grep` findet ausserhalb von Archiv, Reviews und `0001` kein `rm` mehr in Code/Seeds (Ausnahme: README, C-1).
- **#63 Hilfetext ohne Romanisch-Satz:** alle vier `tenants_language_help`.
- **#106 Mahnung in der Sprache des Mieters:** `reminder-letter.ts` (WORDING je Sprache), `reminder.service.ts:90` übergibt `tenant.language`. Abgedeckt sind Titel, Betreff, Text, E-Mail und PDF (gleiches `letter`) sowie der Neu-Druck beim Versand (`markDocumentPosted` → `reminderOn`). Tests: `reminder-letter.test.ts` (Titel und Betreff aller drei Stufen in de/fr/it/en, Brieftext fr/it/en, Referenz, it «non tenga conto», V-1); `reminders.pg.test.ts` (E-Mail-Betreff/Text/PDF it, Dateiname «2° sollecito», Neu-Druck fr). Szenario `statement-reminder.feature` «Zahlungserinnerung in der Sprache des Mieters» mit E-Mail-Titel «Rappel de paiement». Die Oberfläche bleibt deutsch (V-6). Ohne die Änderung rot.
- **#106 Titel wie `i18n-begriffe.md:67`:** stimmt mit `documents_reminder_1..3` in fr/it/en überein.
- **#106 `statements_reminder_letter`/`_emailed` mit «Das Dokument «{title}»»:** alle vier Sprachen, fr mit U+00A0 in den Guillemets (per `cat -A` geprüft). DOM-Test und die Szenarien «Mahnung per E-Mail/Brief» sind angepasst. V-9 (de «unter «Dokumente»», it «in «Documenti»») ist umgesetzt.
- **#106 Hilfetext nennt Mahnungen:** alle vier Sprachen.
- **#105 Label:** `tenants_language` in vier Sprachen (gilt auch für `TenantContactCard.svelte:40`, wie im Fachreview akzeptiert).
- **#105 «PDF auf {Sprache}» nur vor dem Erstellen:** `PdfAction.svelte` (`{:else}`-Zweig, `aria-describedby` am Button), `statement.ts:69` mappt `tenant.language`, Backend liefert `language` (`statement.service.ts:230`), Vertrag `tests/contracts/statement.json` ergänzt. Tests: `statement-pages.dom.test.ts` (fr zeigt «PDF auf Französisch», bei erstelltem PDF kein Hinweis), `statement-mapping.test.ts`. Szenario `statement-detail.feature` «Abrechnung nennt die Sprache ihres PDFs». Die BFF schickt `{}`, also erstellt das Backend das PDF in der Sprache des Mieters (`statement-pdf.service.ts:257`). Hinweis und PDF stimmen überein.
- **Fachreview V-1..V-4, V-6..V-9:** V-1 (it «non tenga conto»), V-2 («Gentile»), V-3 («provvedimenti»), V-4 (Dateiname mit «°»; `file-response.ts` schreibt Nicht-ASCII-Zeichen als `filename*`), V-6 (zwei Schritte im Szenario, Kommentare in `documents.ts`/`statement-actions.ts`), V-7 (fr/it Stufe 1, en «quote»), V-8 (fr «au plus tard le», U+00A0 vor «:»), V-9 sind im Diff umgesetzt.
- **Bildschirme:** kein neuer Bildschirm und kein neuer Zustand. Der Hinweis erscheint im bestehenden Zustand `statement-detail/default` (Entwurf ohne PDF), den `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` schon führen.
- **Screenplay:** Die Schritte rufen nur Questions auf (`languageOfPdf`, `languageLabel`, `offeredLanguages`, `mailsTo`). Die Questions geben den Wert selbst zurück (Text, Liste, Name). Die Targets nutzen `data-testid`.
- **Sicherheit:** keine neuen Endpunkte. Die Sprache kommt aus der DB mit CHECK, das Backend validiert sie bei Mieter und Config.
- **Unverwandtes:** keines. Die Doku-Änderungen (PRD, API, Datenmodell, Tech-Stack, Anforderungen) gehören zu #63/#106.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2651), `cd backend && bun run test` (715, Coverage 94.1 %), E2E chromium (statement-reminder, tenant-edit, statement-detail, tenant*; 71) und axe/Sprachen-Zeilen (24): **vom Aufrufer gemeldet**. Nicht neu ausgeführt: Der Zugriff auf `node_modules` des Worktrees führte in den Arbeitsbaum des Aufrufers (`/home/user/Dwello/node_modules`) und war gesperrt.
- Ob das Fixture `{statement}` in `screens.json` ein Entwurf ohne PDF ist, der Hinweis im axe-Lauf also wirklich erscheint: aus dem Namen und dem Zustand `send-dialog` geschlossen, nicht in den Seed-Helfern nachgelesen.
- Ob pdfkit/Helvetica «°», «’», U+00A0 im Mahn-PDF richtig darstellt: nicht gerendert. Die pg-Tests lesen nur «Cordiali saluti»/«Meilleures salutations». Das gehört zum Feature-Review (`daten-pruefer`).
- Ob das Issue für V-5 (Sprache im Mahn-Dialog) eröffnet ist: Der Plan sagt «V-5 → new issue» ohne Nummer. Auf GitHub nicht geprüft.
