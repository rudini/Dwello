# Code-Review 790a, Runde 1 (ddce6ae..56635d3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | backend/src/app.ts:36 (`openapi(...)`) | `@elysiajs/openapi` ersetzt nicht nur `date`, sondern auch das globale `uuid`-Format durch ein strenges (Version 1–8, Variante 8/9/a/b). Alle 39 nicht RFC-konformen IDs der Demodaten (`11111111-1111-1111-1111-111111111111` Musterhaus, Seepark, Alpenblick, `a0000001-0001-…` Mieter, `b0000001-0001-…` Verträge usw.) werden in jedem Schema mit `format: 'uuid'` mit 422 abgewiesen. Demo-App und Persona-Stack verlieren damit Kernabläufe |
| C-2 | Minor | backend/src/routes/invoices.ts:198 | `isRealDate(query.periodStart) / isRealDate(query.periodEnd)` und der Text «must be existing dates» sind jetzt toter Code: das Schema weist einen Tag, den es nicht gibt, schon vorher mit 422 ab. Nur die Prüfung «Ende vor Beginn» kann noch greifen (gilt nur, solange C-1 die strengen Formate beibehält) |
| C-3 | Minor | backend/package.json:31 | Formatierungsänderung an `e2e-purge-statements`, die mit der Anforderung nichts zu tun hat (wahrscheinlich hat `bun add` die Datei neu geschrieben). Als Minor statt Major eingestuft, weil sie in einer ohnehin geänderten Datei liegt und vom Werkzeug stammt; Korrektur: diese eine Zeile zurücksetzen |

## C-1 (Blocker): Strenges UUID-Format bricht die Demodaten

**Warum falsch:** Die Anforderung verlangt, das Verhalten der App zu behalten. Elysia 1.4.30 registriert beim Import lockere Formate (`uuid` = beliebige Hex-Ziffern im 8-4-4-4-12-Muster, `date` = nur das Muster). Wird `@elysiajs/openapi` importiert, überschreibt das Plugin diese Formate in der globalen TypeBox-`FormatRegistry`. Geprüft mit `FormatRegistry.Get(...)` vor und nach dem Import, im Backend des Worktrees:

```
date 2025-02-30: true->false | 2025-02-29: true->false
uuid 550e8400-e29b-91d4-a716-446655440000: true->false | a1b2c3d4-0000-0000-0000-000000000001: true->false
```

Die Commit-Message erwähnt nur die Datumsprüfung. `backend/demo/demo-data.sql` enthält 121 feste IDs, davon sind 39 keine RFC-UUIDs (alle Liegenschaften, Mieter `a0000001-…`, Verträge `b000000x-…`, Wohnung `aaaa2222-…`). Diese Daten nutzen `bun run dev:demo` und `docs/design/tools/persona-stack.sh` (Zeile 20), also auch die Persona-Reviews aus Schritt 5. Betroffen sind 19 Schemafelder mit `format: 'uuid'`, z. B. `buildingId` in Rechnung, Wohnung und Abrechnungslauf, `apartmentId`/`tenantId` im Vertrag und `buildingId` der Vollständigkeitsprüfung. Produktive Daten (`defaultRandom()`, v4) und die Migrationen sind nicht betroffen (keine festen Nicht-RFC-IDs in `migrations/*.sql`). Die E2E-Tests nutzen keine Demodaten, deshalb fängt keine Suite den Fehler.

**Nachweis (auf 56635d3, mit `callApi`/`sendJson` aus `src/__tests__/helpers/auth.ts`, Musterhaus-ID):**

```
422 GET  /api/v1/statements/run?buildingId=11111111-…&periodStart=2025-01-01&periodEnd=2025-12-31  VALIDATION_ERROR
422 POST /api/v1/invoices   { buildingId: '11111111-…', … }                                          VALIDATION_ERROR
422 POST /api/v1/apartments { buildingId: '11111111-…', … }                                          VALIDATION_ERROR
422 GET  /api/v1/invoices/completeness/11111111-…?periodStart=2025-01-01&periodEnd=2025-12-31
```

Im Vergleich dazu: Dieselbe Abfrage der Vollständigkeitsprüfung mit einer v4-ID ergibt 401 (ohne Token), die Validierung lässt sie also durch. Auf ddce6ae nahm Elysias lockeres `uuid`-Format die Musterhaus-ID an (Probe mit `elysia@1.4.30` allein bzw. mit `@elysiajs/swagger@1.3.1`: `2025-02-30` → 200, nur das Muster wird geprüft). Für die Persona heisst das: Rechnung für das Musterhaus erfassen, Abrechnungslauf starten, Wohnung anlegen schlagen mit «Ungültige Anfrage» fehl.

**Zum Zeigen als Test:** ein `*.pg.test.ts` (z. B. in `demo-data.pg.test.ts` oder `api-docs.test.ts`), der eine Route mit `format: 'uuid'` mit einer Demo-ID aufruft und nicht 422 erwartet. Er ist auf 56635d3 rot. Mögliche Abhilfen: Elysias Formate nach dem Plugin wiederherstellen oder die Demo-IDs auf RFC-UUIDs umstellen (zusammen mit `demo-data.ts`, `demo-data.pg.test.ts` und dem Vertrag `tests/contracts/invoice-completeness.json`). Bei der zweiten Variante ist die Datumsverschärfung (422 statt 400) zu belassen und bewusst festzuhalten. Sie ist für die Oberfläche unsichtbar, weil `parseSwissDate` (`src/lib/swiss-date.ts`) einen Tag, den es nicht gibt, schon im Browser abweist und kein anderer Datumspfad der Oberfläche einen solchen Tag schickt. Zur Frage des Aufrufers: 422 mit `VALIDATION_ERROR` ist eine codierte Ablehnung (`app.ts` onError) und verletzt die Regeln von CLAUDE.md nicht. `docs/api-specification.md:135` bleibt korrekt.

## Nicht bestätigt

- Ob alle 5 offenen Dependabot-Alerts abgedeckt sind: `gh api repos/rudini/Dwello/dependabot/alerts` liefert 403, und GraphQL ist gesperrt. Abgeglichen habe ich nur `bun audit` auf dem Basis-Lockfile (in eine Scratchpad-Kopie extrahiert): cookie (low), fallow (2× low), postcss-selector-parser (moderate), vite (1 high, 3 moderate, 1 low) und im Backend zod/addressparser. Auf 56635d3 ist das Backend sauber. Im Root bleiben die zwei SvelteKit-Advisories (<3.0.0, low) offen. Laut «Decided» in #790 muss jeder Alert behoben oder dort mit Begründung abgewiesen werden. Ein Kommentar oder Issue dazu fehlt in #790 bisher (es gibt nur einen Kommentar vom 24.10.).
- `postcss-selector-parser` ^7 wird per Override in `eslint-plugin-svelte@2.46.1` gezwungen, das `^6.1.0` deklariert. Ob alle Regeln, die den Parser nutzen, damit korrekt laufen, habe ich nicht geprüft. Lint ist grün laut Aufrufer.
- `cookie` 0.7.2 unter SvelteKit 2.70.3 (`^0.6.0`): Mit 0.7.2 habe ich `serialize` mit den dokumentierten `COOKIE_DOMAIN`-Werten (`localhost`, `dwello.example.ch`, `homeserver.local`, IP, ohne Domain) und `parse` geprüft, alle ohne Fehler. Einen echten Login-Ablauf habe ich nicht gesehen (E2E nicht gelaufen).
- zod 4 `z.string().email()` (`auth.ts:18`, `local-account.service.ts:23`): 24 Beispieladressen (Umlaute, IDN, Apostroph, Plus, ohne TLD, IP-Literal, Leerzeichen usw.) geben mit zod 3.25.76 und 4.6.7 identische Ergebnisse. Eine erschöpfende Prüfung ist das nicht.
- fallow 3.35 mit `.claude/hooks/fallow-gate.sh` (liest `.verdict` und `.error` aus dem JSON): nicht selbst ausgeführt, weil `fallow audit` einen Cache schreiben kann.
- `api-docs.test.ts` als Pin von beibehaltenem Verhalten: Nur durch Lesen geprüft. Dass er auf ddce6ae grün ist, habe ich nicht nachgefahren.
- Vom Aufrufer gemeldet: backend `bun run type-check`, `bun run test` (1564, 96,4 %), `bun audit`; root `eslint`, `bun run check`, `bunx vitest run` (3638), `bun run build`, `bunx fallow audit`. Selbst ausgeführt habe ich nur `bun audit` (root und backend, Ergebnis wie gemeldet). E2E nicht gelaufen.

Geprüft: Diff vollständig gelesen (Lockfile-Änderungen, `app.ts`, beide Tests, `tech-stack.md`); zod-Nutzung im Backend; Datumsformat in allen Routen (für die Oberfläche unsichtbar, siehe oben); keine Texte, Bildschirme oder Szenarien betroffen.
