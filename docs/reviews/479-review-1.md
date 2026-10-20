# Code-Review #479, Runde 1 (c09ec4fd..26c7f2ce)

Worktree: `review-gwr-code` (26c7f2ce). Gelesen: alle 51 geänderten Dateien des Diffs, dazu `src/lib/backend-error.ts`, `src/lib/server/apartment-form.ts`, `backend/src/routes/apartments.ts`, `src/hooks.server.ts` (`/api/*` → 401 ohne Sitzung), `src/lib/ui/Field.svelte`, `tests/contracts/README.md`, `tests/e2e/CLAUDE.md` (Rules), `.claude/skills/ponytail-review/SKILL.md`.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | `tests/contracts/` (unverändert), `src/__tests__/building-actions.test.ts:70-126` | «Done means» von #479 verlangt einen API-Vertrag in `tests/contracts`; es gibt keinen. `POST /api/v1/buildings` hat eine neue Antwort (409 `APARTMENT_NUMBER_TAKEN` mit `params.number`), und kein BFF-Test zeigt, dass «Neues Gebäude» sie als `backend_apartment_number_taken` anzeigt. |
| C-2 | Minor | `backend/src/routes/buildings.ts:117-119`, `src/lib/server/building-form.ts:42-64` | Fläche oder Zimmeranzahl wie «64,5» (Dezimalkomma) oder «2½» besteht die BFF-Prüfung (es wird nur geprüft, ob ein Wert da ist). Die Datenbank lehnt den Wert ab, der Catch gibt `{ error: error.message }` zurück, und `backendMessage` zeigt diesen Rohtext (Drizzle «Failed query: insert into "apartments" …» mit den Parametern) als Formularfehler. Gleiches Muster wie in `apartments.ts:119-120` auf dem Basis-Commit, aber jetzt im neuen Ablauf, in dem der Verwalter fehlende Werte selbst eintippt. |
| C-3 | Minor | `src/routes/buildings/BuildingForm.svelte:121`, `:143-144` | Wählt der Verwalter nach einer ersten Adresse eine zweite, bleibt der Gebäudename der ersten Adresse stehen (`if (!name)`). Gebäudetyp und Baujahr der ersten Adresse bleiben ebenfalls, wenn das Register sie für die zweite nicht kennt. Der Vorschlag «Strasse und Hausnummer» nennt dann ein anderes Gebäude. |
| C-4 | Minor | `src/routes/buildings/BuildingForm.svelte:137-141` | Für den Fall, dass die Adresssuche antwortet, das Lesen des Gebäudes (`/api/addresses/<egid>`) aber scheitert (Hinweis «nicht erreichbar», keine Wohnungen, Formular bleibt nutzbar), gibt es keinen Test: weder DOM-Test noch Szenario. `registerUnreachable` lässt nur `/api/addresses` scheitern, also die Suche. |
| C-5 | Minor | `src/lib/server/building-register.ts:16-17`, `:52-53` | `AddressHit.latitude`/`longitude` werden berechnet, getestet und in `docs/api-specification.md` beschrieben, aber nirgends gelesen. `BuildingForm` übernimmt keine Koordinaten, und das PRD hat «Auto-populate GPS coordinates» gestrichen (ponytail `delete:`). |

## C-1 (Major): Kein API-Vertrag, Ablehnung im BFF ungetestet

**Warum falsch:** Die Zeile «Lower-layer tests: … API contract in `tests/contracts`» in «Done means» von #479 ist nicht erfüllt. `implementation_plan.md:11` begründet das mit «response unchanged, no contract change». Das stimmt nur für die 201-Antwort. Die Route liefert jetzt eine neue Antwort, 409 `{ code: 'APARTMENT_NUMBER_TAKEN', params: { number } }`, wenn eine Nummer im Body zweimal vorkommt. Laut CLAUDE.md, Gotchas «API contracts», braucht eine geänderte Antwort ihren Vertrag. Ein Frontend-Test, der eine Backend-Antwort liest, muss sie aus `tests/contracts` nehmen. Das ist der Ablauf, den der Verwalter bekommt, wenn er eine Nummer doppelt vergibt oder das Register an einem Eingang zweimal dieselbe `whgnr` führt (beide werden zu «155-101»). Dass die Seite dann den übersetzten Satz statt des deutschen Backendtexts zeigt, prüft kein Test.

**So zeigt man es:** `git diff --stat c09ec4fd 26c7f2ce -- tests/contracts` ist leer. `grep -n "NUMBER_TAKEN" src/__tests__/building-actions.test.ts` findet nichts. Der pg-Test (`building.routes.pg.test.ts`, «legt nichts an, wenn eine Wohnungsnummer zweimal vorkommt») prüft nur das Backend.

**Behebung:** Einen Vertrag `tests/contracts/building-apartment-number-taken.json` für `POST /api/v1/buildings` mit doppelter Nummer anlegen, mit Zeile im README und Fall in `api-contracts.pg.test.ts`. Dazu einen Fall in `building-actions.test.ts`, der mit diesem Vertrag antwortet und den übersetzten Formularfehler erwartet. Alternativ, falls bewusst kein Vertrag gewollt ist: die Abweichung von «Done means» im Pull Request begründen und mit dem Product Owner klären.

## Bestätigt

- Adresssuche über das BFF (`/api/addresses`, `/api/addresses/[egid]`) hinter der Sitzungsprüfung in `hooks.server.ts`. EGID nur aus Ziffern (Test). 502 bei nicht erreichbarem Register (Test).
- Zuordnung: `wstwk` (3100/31xx/34xx, unbekannt → leer), `gkat` 1040 vor `gklas`, 1130 und andere Klassen → leer, `wstat` 3003/3004, `null`-Werte, Nummernvorschlag aus Stockwerk und `wbez`, Hausnummer vor doppelten Nummern über Eingänge: alles in `building-register.test.ts`.
- Transaktion: Gebäude und Wohnungen gemeinsam oder gar nicht. In `building.routes.pg.test.ts` würde der Fall mit `floor: 1.5` ohne `db.transaction` rot, weil das Gebäude dann angelegt bliebe. Bei doppelter Nummer wird nichts angelegt (Test).
- Weggelassene Zeilen sind deaktiviert und werden nicht gesendet. Pflichtfelder pro Zeile werden mit Fehlern geprüft (`building-actions.test.ts`, Szenario «Angaben ergänzen …»).
- Entschiedene Texte stehen wörtlich in `messages/de.json`, alle 15 neuen Schlüssel in allen vier Sprachen. Die Hilfe nennt «eidgenössischen Gebäude- und Wohnungsregister (GWR)». Der Knopf heisst «Gebäude und Wohnungen erstellen».
- Szenarien in `building-new.feature` decken alle Punkte aus «Done means» ab (Import, fehlende Werte, ohne Wohnungen, nicht erreichbar, kein Treffer, bestehende Adresse). Keines trägt `@wip`. Der E2E-Stack nutzt den Stand-in `gwr-stub.ts`. Alle neuen Szenarien scheitern auf der Basis (Suche, Testids und Hinweise fehlen dort).
- Neue Zustände stehen in `screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`.
- Datenschutzerklärung: swisstopo statt OpenPLZ, Suchbegriff, EGID und Server-IP (nicht Browser-IP) in allen vier Sprachen. DOM-Test und `privacy.feature` sind angepasst. Weitere Anfragen an fremde Server kommen im Diff nicht dazu.
- Screenplay: Die Schritte rufen nur Tasks, Questions und den `seed`-Fixture auf. Die Questions liefern Werte (Nummernliste, Zimmeranzahl, Namen der fehlenden Felder). `chooseRegisterAddress` wartet auf den Registerhinweis. Der Fehlerzustand läuft über `FailRequests`. Die Features beschreiben kein UI-Vorgehen.
- Docs: `tech-stack.md`, `PRD-Dwello.md`, `api-specification.md` und U-23 (P-7, P-8) in `offene-punkte.md` sind nachgeführt. `openplz.ts` und sein Test sind entfernt. Der Archiveintrag «Session C1» verschiebt die abgeschlossene frühere Session (Workflow Schritt 8) und ist keine fremde Änderung.
- Ponytail: ausser C-5 nichts zu streichen.

## Nicht bestätigt

- Alle Prüfläufe des Aufrufers (lint, check, type-check, vitest gesamt und Einzeldateien, Backend-Tests, E2E building-new/privacy/building-edit/buildings, axe- und Sprachzeilen): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Ob `https://www.swisstopo.admin.ch/en/legal-framework` die passende Datenschutz- bzw. Nutzungsseite ist und ob die Nutzungsbedingungen von geo.admin «fair use» erlauben (Abschnitt «Stop and ask» des Issues): ohne Netzprüfung nicht bestätigt. Rechtstext laut `docs/reviews/479-fachreview-2.md` fachlich geprüft.
- Die Zuordnung `toAddressHits` (Format von Label und `detail`) gegen die echte API: nur gegen die Fixture im Test geprüft, die nach Angabe vom 2026-10-19 stammt.
