# ADR 0005: Die API-Typen stehen in einem eigenen Backend-Modul

- **Status:** angenommen (Product Owner, 26.10.2026, #837)
- **Szenario:** Ä1 «Neues Feld an einer Entität» (`docs/architecture/utility-tree.md`), Prinzip AP1 «Eine Form hat eine Quelle»
- **Ändert:** Schritt 2 von ADR 0003 (Antworttyp als `ReturnType` der Service-Funktion)

## Kontext

ADR 0003 leitete den Mietertyp des Frontends aus `TenantResponse` ab, einem `ReturnType` von `getTenant` in `tenant.service.ts`. Für die Abrechnungen ging das nicht. Ein verworfener Spike am 26.10.2026 (Kommentar in #837) zeigte:

- **Bun-Code im Typcheck:** `import type` aus `statement.service.ts` lässt `svelte-check` alles prüfen, was dieser Service importiert. Das reicht bis `ki-model.service.ts`, das Bun-eigene APIs nutzt: den globalen `Bun`, `fetch(…, { timeout: false })` und asynchrone Iteration über einen `ReadableStream`. Die TypeScript-Konfiguration des Frontends kennt keine Bun-Typen und meldet Fehler im Backend-Code.
- **Bun-Typen im Frontend:** Damit verschwänden diese Fehler, aber dann bemerkt der Typcheck nicht mehr, wenn Browser-Code Bun-Funktionen nutzt.

## Entscheidung

Der Antworttyp einer Entität steht in einem eigenen Modul unter `backend/src/api/`, das nur Typen aus `backend/src/db/schema.ts` importiert.

1. Die Services nehmen ihn als Rückgabetyp. Der Entscheid in #837 nennt `satisfies`; der Rückgabetyp prüft die Rückgabe gleich und stand bei `getStatement` schon da. Fehlt ein Feld, das der Typ verlangt, oder passt sein Typ nicht, lehnt der Compiler die Rückgabe ab. Ein zusätzliches Feld bemerkt er nur, wenn es ausdrücklich im Objektliteral steht, nicht aus einem Spread oder einer Abfrage.
2. Der Mapper des BFF nimmt ihn als Eingabe (`Json<…>`).
3. Die Frontend-Typen in `src/lib/types.ts`:
   - Felder, die der Mapper unverändert weitergibt, kommen per `Pick` aus dem Antworttyp.
   - Beträge, die als Text kommen und als Zahl weitergehen, kommen per `Amounts<Pick<…>>`.
   - Von Hand deklariert bleibt nur, was der Mapper umbenennt, zusammensetzt oder mit einem Ersatzwert füllt.
4. Wertelisten stehen typisiert im Schema, wie in Schritt 1 von ADR 0003: `StoredStatementStatus` für die Spalte `status`. Der Status der API ergänzt `overdue`, das berechnet und nie gespeichert wird.

Das Frontend importiert nur das Modul unter `backend/src/api/`, nie einen Service.

## Zyklus 1a: die Abrechnung

Der Plan von #837 nennt für Zyklus 1 auch `StatementLineItem`, `StatementLineInvoice` und `StatementDocument`. Sie folgen als Zyklus 1b in einem eigenen Pull Request (Review i837c1, C-2): Die Positionen und ihre Rechnungen formt der Mapper um, und die Dokumente kommen aus einem anderen Service.

| Schritt | Commit | Absicherung |
|---|---|---|
| 0 Spike, Messung vorher | – | Spike verworfen; `fitness` 5 / 13 / 37, Entity-Spiegel 54; `svelte-check` 4289 Dateien, 42 s |
| 1 `backend/src/api/statement.ts`, Status typisiert | 508c311a | Backend-Typprüfung; 654 Backend-Tests (Abrechnungen, Mahnungen, «Abgerechnet bis», API-Verträge) |
| 2/3 Mapper und Frontend-Typen aus dem Backend-Typ | cf7664d4 | `svelte-check` 0 Fehler; 439 Unit-Tests der geänderten Dateien; Lint; fallow |
| 4 Messung nachher, `fitness --update` | dieser Commit | – |

Der typisierte Mapper zeigte Abweichungen, die das Frontend bisher verdeckte. Behoben sind sie in den Typen, ohne dass sich ein angezeigter Wert ändert:

- Leere Werte: Zahlungsfrist, Bezahldatum, Datum der letzten Mahnung und Zeitpunkt des PDFs kommen als `null`, nicht als fehlendes Feld. Die Bearbeitungsseite gibt eine leere Zahlungsfrist als leere Zeichenkette ans Datumsfeld, das vorher `null` erhielt. Ein erster Entwurf mit `undefined` liess Svelte mit `props_invalid_value` abbrechen (Review i837c1, C-1; Test «zeigt eine fehlende Frist als leeres Feld»).
- Das Stockwerk der Wohnung ist eine Zahl, nicht Text.
- Mieter, Wohnung und Gebäude sind `null`, wenn ihr Datensatz fehlt.
- `updateStatementStatus` nimmt kein `overdue` mehr an. Die erlaubten Übergänge lehnten es schon vorher ab.

## Messergebnis

Gemessen mit `bun run fitness` und `tools/arch-baseline/05-knowledge.ts`, vorher auf `origin/main` nach #843, nachher auf diesem Zweig:

| Messwert | Vorher | Nachher |
|---|---|---|
| Feldstreuung Median / P90 / Max | 5 / 13 / 37 | 5 / 13 / **36** |
| Entity-Spiegel | 54 | **52** |
| Felder, die `src/lib/types.ts` deklariert | 63 | **51** |
| `svelte-check` | 4289 Dateien, 42 s | 4290 Dateien, 36 s |

Median und P90 bewegen sich nicht. Die meisten Abrechnungsfelder stehen in mehr Dateien als `types.ts`, vor allem in Backend-Services (`periodEnd` in 36 Dateien).

## Zyklus 1b: Positionen und Dokumente

| Schritt | Commit | Absicherung |
|---|---|---|
| 1 `StatementLineItem` und `StatementLineInvoice` aus den Positionen von `backend/src/api/statement.ts` | 8aeaa9f5 | `svelte-check` 0 Fehler; 209 Tests der Abrechnungsseiten und des Mappers; Lint |
| 2 `backend/src/api/document.ts`, Wertelisten der Dokumente typisiert, `StatementDocument` daraus | 8fa3a5fd | Backend-Typprüfung; 173 Backend-Tests (Dokumente, Mahnungen, Datenexport, API-Verträge); 101 Frontend-Tests zu Dokumenten |
| 3 `DocumentStatus` einmal im Schema, `fitness --update` | 6a46352a | `fitness` ohne Fehler (vorher: Werteliste `sent\|to_send` in 3 Dateien) |

- **Namen, die nie ankamen:** Der Mapper der Positionen las `categoryName` und `distributionKeyName`, die das Backend nie sendet (`tests/contracts/statement.json`). Er nimmt jetzt direkt die Beschreibung und einen leeren Schlüsselnamen, wie es der Rückfall vorher ergab; `loadStatement` benennt beide wie bisher in der Sprache der Oberfläche.
- **Typisierte Wertelisten der Dokumente** im Schema: `DocumentType`, `DocumentMimeType`, `DocumentStatus`; der Kanal nimmt `CorrespondenceChannel`.

| Messwert | Nach 1a | Nach 1b |
|---|---|---|
| Feldstreuung Median / P90 / Max | 5 / 13 / 36 | **4** / 13 / 36 |
| Entity-Spiegel | 52 | **50** |
| Wertelisten über Schichten | 14 | **13** |
| Felder, die `src/lib/types.ts` deklariert | 51 | **40** |
| `svelte-check` | 4290 Dateien, 36 s | 4291 Dateien, 35 s |

Der Median erreicht damit das Ziel von Ä1 (≤ 4); P90 liegt mit 13 weiter über 8.

## Zyklus 2: Mietverträge

| Schritt | Commit | Absicherung |
|---|---|---|
| 0 Messung vorher | – | `fitness` 4 / 13 / 36, Entity-Spiegel 50, Wertelisten 13 |
| 1–3 `backend/src/api/contract.ts` und `api/apartment.ts`, Services und Route dagegen typisiert; Mapper mit `Json<…>`; `RentalContract`, `ContractHistory`, `ContractWithDetails` und `ApartmentStatus` aus dem Backend-Typ; `fitness --update` | 15ce21e2 | Backend-Typprüfung; 382 Backend-Tests (Mietverträge, Wohnungen, Mieter, Anteile, Abrechnungslauf, API-Verträge); `svelte-check` 0 Fehler; 584 Frontend-Tests; Lint; fallow |

- **Ohne Umwandlung:** `listContracts`, `getContract`, `getActiveContract` und `getContractsByPeriod` geben ihr Ergebnis ohne `as` zurück. Mieter, Wohnung und Gebäude sind dafür mit `innerJoin` verbunden: Ihre Fremdschlüssel sind `NOT NULL`, es fällt also kein Vertrag weg. Die Route prüft ihre Antwort mit `satisfies ContractResponse`.
- **`status` fehlte im Typ:** Die Abfrage lieferte den Vertragsstatus, der alte `ContractWithDetails` nannte ihn nicht.
- **Felder, die nie ankamen:** `tenantFirstName` und `tenantLastName` der Liste waren immer leer, `advancePayment` sendet das Backend nicht. Alle drei sind weg.
- **`ApartmentStatus`** steht einmal in `backend/src/api/apartment.ts`; Backend und Frontend nehmen ihn von dort.

| Messwert | Nach 1b | Nach 2 |
|---|---|---|
| Feldstreuung Median / P90 / Max | 4 / 13 / 36 | 4 / 13 / 36 |
| Entity-Spiegel | 50 | **49** |
| Wertelisten über Schichten | 13 | **12** |
| Felder, die `src/lib/types.ts` deklariert | 40 | **30** |
| `svelte-check` | 4291 Dateien | 4293 Dateien |

P90 bewegt sich nicht: Die Vertragsfelder stehen vor allem in Backend-Services und Svelte-Komponenten (`startDate` in 26 Dateien), nicht in den Typen.

## Tradeoffs und verbleibende Risiken

- **Zwei Stellen im Backend:** Die Form steht im Typmodul und in der Abfrage des Service. Der Rückgabetyp verbindet beide nur zum Teil: Ein Feld, das die Abfrage zusätzlich liefert, bleibt dem Typ unbekannt, bis jemand es dort ergänzt (so fehlten bisher `tenant.correspondenceChannel` und `tenant.country`).
- **Umwandeln bleibt Handarbeit:** Was der Mapper umbenennt (`reminderSentDate` → `lastReminderDate`) oder aus mehreren Feldern zusammensetzt (`tenantName`), steht weiter im Frontend-Typ.
- **Testdaten:** `statement-mapping.test.ts` baut absichtlich unvollständige Antworten. Ein Helfer im Test reicht sie als Antworttyp durch.
- **Komplexität:** fallow warnt bei `placeOf` (zyklomatisch 11). Die Warnung blockiert nicht.

## Nächste Zyklen

Rechnungen, dann der Rest (#837, «Plan»). Jeder Zyklus folgt dieser Entscheidung, bekommt eine Zeile in einer Tabelle wie oben und misst vorher und nachher.
