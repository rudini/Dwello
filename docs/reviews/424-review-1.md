# Code-Review #424, Runde 1 (ecbb9e3d gegen 743c6647)

Geprüft im Worktree `review-424-code` (detached an ecbb9e3d). Alle 9 geänderten Dateien des Diffs gelesen (ohne `implementation_plan.md`), dazu das Umfeld: `src/lib/ui/{Select,EarlySelect,Field,Header,Dialog,MobileNav}.svelte`, `src/lib/ui/field.ts`, alle `<select>` in `src/routes`, `src/routes/documents/[id]/pdf/+server.ts`, `src/lib/server/file-proxy.ts`, `backend/src/routes/file-response.ts`, `src/routes/login/+page.server.ts`, `src/routes/auth/logout/+server.ts`, `tests/e2e/steps/authentication.steps.ts`, `tests/e2e/targets/authentication.ts`, `tests/e2e/fixtures/backend.ts` (Aufräumen per Token), `tests/e2e/features/{sprachen,authentication,apartments}.feature`, `.github/workflows/ci.yml` (BROWSERS).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/fixtures/backend.ts:18; src/lib/ui/RadioGroup.svelte:35 | Die Testdaten-Änderung ist als Messfehler begründet, verdeckt aber eine Lücke, die schon auf der Basis besteht: ein langes Wort ohne Umbruchstelle (eine lange E-Mail-Adresse oder ein langes zusammengesetztes Wort im Namen) macht die Labels in Fieldsets (`min-width: min-content`) breiter als 390 px; anderswo nutzt die App dafür `break-words`. Weil das schon vor der Änderung so war, sperrt es den Merge nicht. Vorschlag: eine Zeile in `docs/design/offene-punkte.md` (Usability) |
| C-2 | Minor | src/routes/documents/DocumentItem.svelte:65; src/routes/tenants/[id]/TenantDocumentRow.svelte:41 | Dass die beiden Dokument-Links `download` tragen, prüft nur das WebKit-E2E, und WebKit läuft nur auf `main` (ci.yml:158, in Pull Requests nur Chromium). Wird `download` in einer der Zeilen entfernt, fällt das erst auf `main` auf. Abhilfe: je eine Zeile `hasAttribute('download')` in den bestehenden Tests `src/__tests__/documents.dom.test.ts:85` und `tenant-detail-page.dom.test.ts:271` |
| C-3 | Nit | tests/e2e/features/apartments.feature:45 | Der Kommentar «sonst passen sie in die UUID der Testnamen» ist veraltet, weil die Namen jetzt auf 12 Hex-Ziffern enden. Der Grund gilt aber weiter |
| C-4 | Nit | src/styles/globals.css:30 | Der Kommentar sagt «in Safari». Beobachtet wurde das Verhalten aber nur im WebKit von Playwright unter Linux; ob Safari auf macOS oder iOS `<option>` genauso auslegt, ist nicht belegt |
| C-5 | Nit | src/__tests__/ui-button.dom.test.ts:25 | Der Testname verspricht «auch ein Bild»; der Test prüft aber nur, ob das Attribut da ist |
| C-6 | Nit | Commit ecbb9e3d | Der Typ `fix(tests)` umfasst auch zwei App-Korrekturen (`styles`, `components`); dadurch fehlen sie im Changelog als App-Fix |
| C-7 | Nit (ponytail) | tests/e2e/fixtures/backend.ts:18 | `shrink:` `randomUUID().replaceAll('-', '').slice(0, 12)` → `randomBytes(6).toString('hex')`. Gleich lang und ebenfalls 48 Bit; optional |

Ponytail-Review: Der Diff ist schlank. Die neue Prop `download` hat zwei Aufrufer, und eine CSS-Regel ersetzt eine Workaround-Kette. Weitere Kürzung ist nicht möglich (`net: -0 lines possible`). Lean already. Ship.

Keine Blocker, keine Majors.

## Geprüfte Punkte (ohne Befund)

- **`contain: paint` auf jedem select:**
  - Die Paint-Containment schneidet nur den *Inhalt* (die Options) an der Padding-Box ab. Rahmen, Hintergrund, der native Pfeil und der Fokus-Ring (`:focus-visible` als Outline mit Offset, globals.css:20) gehören zum Element selbst und werden wie bei `overflow: hidden` nicht abgeschnitten.
  - Alle selects (`Select`, `EarlySelect`, 6 rohe in `src/routes`) sind native Controls mit `controlClass` (field.ts:2). Keines hat ein absolut positioniertes Pfeil-Icon als Geschwister, das jetzt verdeckt würde.
  - Die geöffnete Liste ist in allen drei Engines ein natives Popup, `appearance: base-select` wird nicht verwendet. CSS-Clipping betrifft sie also nicht.
  - Stacking-Context: Ein select malt jetzt in der Ebene z-index 0. Header (`sticky z-30`), Dialog (`fixed z-50`), MobileNav (`z-40/50`), Toasts (`z-50`) und die Klickfänger (`z-10`, im Stacking-Context des Headers) liegen alle darüber. `Navigation.svelte` (sticky ohne z) überlappt keine Formulare. Ein select in einem Dialog liegt im Stacking-Context des Dialogs.
- **12-Hex-Suffix:**
  - Kollisionen sind vernachlässigbar (48 Bit; selbst bei 10⁴ Namen pro Lauf liegt die Wahrscheinlichkeit unter 10⁻⁶).
  - Das Aufräumen sucht per Token (`fixtures/backend.ts:531`); ein fremder Datensatz trifft nur bei identischen 12 Ziffern.
  - Wohnungsnummern mit Buchstaben ausserhalb a–f (apartments.feature:45) bleiben weiterhin eindeutig.
  - Andere Regexe auf das UUID-Format: `fuel-stock-…{36}` matcht IDs, keine Namen; `allocable-categories.pg.test.ts:57` liest die Backend-Testdatenbank, nicht E2E-Namen.
  - Die Maske in `language.ts:51` per `node` geprüft: «Lindenhof 3f2a9c01b7e4» und «Elektro Blitz <UUID>.pdf» werden maskiert. Lange Ziffernfolgen werden ohne vorangehende Wörter nur am Ende maskiert, deutsche Wörter verschluckt die Maske dabei nicht.
- **`signOut` wartet auf `login-google`:** Die E2E-Konfiguration setzt `OAUTH_GOOGLE_CLIENT_ID` (playwright.config.ts:32), also zeigt die Anmeldeseite immer Google. Alle drei Szenarien mit «sich abmeldet» (authentication.feature:42, sprachen.feature:50, :103) erwarten danach die Anmeldeseite oder vertragen sie. Die Testid hängt nicht von der Sprache ab (`login-{provider.id}`), funktioniert also auch auf Italienisch. Die Task wartet damit auf den Zustand, zu dem sie führt (`tests/e2e/CLAUDE.md`).
- **`download` bei PDFs:**
  - `proxyFile` sendet ohnehin `content-disposition: attachment` mit Dateinamen (file-response.ts:10). Der Dateiname aus dem Header hat Vorrang vor dem leeren `download`-Attribut; PDFs wurden schon vorher gespeichert, am Verhalten ändert sich nichts.
  - SvelteKit fängt Links mit `download` nicht ab. Ein Client-Routing ist ausgeschlossen, und der Link ist gleicher Herkunft.
- **DOM-Test** `ui-button.dom.test.ts`: Ohne die Prop würde Svelte `download: true` ignorieren, das Attribut fehlte und der Test wäre rot. Nachgelaufen: 7/7 grün.
- **Pflichtpunkte:**
  - Die sichtbaren Änderungen (kein Seitwärts-Scrollen in WebKit, Foto-Download in WebKit) decken bestehende Szenarien ohne `@wip` ab (sprachen-bildschirme, «Ein Foto als Dokument hochladen»).
  - Keine neuen Bildschirme oder Texte, also nichts für `screens.json` oder `messages/*.json`.
  - E2E-Schichten eingehalten: `signOut` nutzt nur Interactions und Targets.
  - Nichts Fachfremdes im Diff.
  - `tests/e2e/CLAUDE.md` passt zur neuen Namensform.
- **Kein Test für einen Browser ausgeschlossen oder übersprungen:** Der Diff enthält kein `skip` und keinen `test.fixme`.

## Nicht bestätigt

- Ob Firefox und WebKit eine UUID tatsächlich nicht umbrechen und ob die Messwerte vorher und nachher stimmen (Breiten 416–583 px, die 5 WebKit-Checks rot und dann grün, Firefox 0 Fehler): Das ist nur per E2E zu zeigen, und E2E durfte ich nicht starten. Spec-Lesung: UAX #14 LB25 erlaubt keinen Umbruch zwischen Bindestrich und Ziffer, das macht die Angabe plausibel.
- Gruppe 2 (Assistent in Firefox) grün durch #427 (gemergt in 743c6647 über 26a0c4ed): Nur «vom Aufrufer gemeldet» (194 Tests).
- Dass Playwright-WebKit ein `image/jpeg` mit `attachment` anzeigt: «vom Aufrufer gemeldet».
- Vom Aufrufer gemeldete Checks, nicht wiederholt:
  - `bun run lint`, `bun run check`
  - vitest `open-work`, `design-guard`, `e2e-screenplay-lint`, `tenant-documents`
  - E2E in Chromium, Firefox und WebKit (tenant-documents, documents, sprachen, authentication, die 35 sprachen-bildschirme-Zeilen, contract-new allein)
- Selbst wiederholt: `bunx vitest run src/__tests__/ui-button.dom.test.ts` (7 grün).
- Done means des Issues: Ein vollständiger E2E-Lauf mit allen Browsern und grünes CI auf `main` sind offen (die Shard-Läufe des Autors laufen noch). Ebenso offen ist das Problem mit über 1000 Wohnungen in contract-new bei einem lokalen Gesamtlauf; laut Aufrufer gehört es nicht zu diesem Slice.
- `contain: paint` in Safari auf macOS und iOS sowie das Abschneiden des eigenen Outlines: Ich habe keinen Browser gestartet; beides beruht auf der Spec-Lesung (CSS Containment 1, §3.3).
