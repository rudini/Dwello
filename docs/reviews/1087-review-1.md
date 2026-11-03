# Code-Review #1087, Runde 1 (zugleich Schlussrunde vor dem Push)

Bereich: `git diff 31e9c45e3~1 31e9c45e3` (`src/routes/documents/DeliveryFailure.svelte`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Die Wahl von `wrap-anywhere` ist richtig. `overflow-wrap: anywhere` senkt die min-content-Breite des Satzes. Das umgebende `div.flex.flex-col` ist in TenantDocumentRow (`li.flex.flex-wrap`) und in DocumentItem ein Flex-Item ohne `min-w-0`, darum hätte `break-words` dort nicht gereicht. Die Klasse gibt es ab Tailwind 4.1, der Lockfile hat 4.3.3. Sie ist eine Layout-Klasse wie das schon benutzte `break-words` und `break-all`, keine Farbe, kein Radius, kein Schatten und kein beliebiger Wert, also kein Verstoss gegen `design-guard.test.ts` oder `token-referenz.md`. Die Klasse wirkt in allen drei Verwendern (TenantDocumentRow, ReminderFeedback, DocumentItem). Andere Texte ohne Umbruchstelle gibt es im Zustand nicht: Auf der Mieterseite fehlt der Mieter-Link (`tenantLink={false}`). Titel «Mahnung», Nummer und «E-Mail-Adresse von {name} prüfen» haben Leerzeichen, der Name ist «Hugo». Die Kontaktadresse in TenantContactCard bricht laut Aufrufer schon mit `break-words`. Die Breite passt zur Ursache: Die Adresse ist `<UUID>@abgewiesen.dwello.test` (`tests/e2e/fixtures/backend.ts:252`, `screens.ts:203`), rund 59 Zeichen, also etwa 560 px. Die Commit-Message trägt `No scenario:`. Die rote Sprachzeile bleibt unverändert der Test, eine tiefere Ebene kann das Layout nicht zeigen (jsdom). Keine Texte geändert, nichts Fremdes im Diff.

## Nicht bestätigt

- Firefox grün auf der Zeile «Bildschirm ohne deutschen Text › tenant-detail-undelivered default @i18n». Firefox ist lokal nicht installiert, das bestätigt erst ein CI-Lauf mit allen Browsern nach dem Push. Ohne Firefox lässt sich auch nicht sicher ausschliessen, dass ein weiteres Element zu den 560 px beiträgt. Angesehen habe ich TenantDocumentRow, DeliveryFailure, die Seed-Daten und den Breiten-Check in `tests/e2e/screenplay/questions.ts:235`.
- Vom Aufrufer gemeldet: `bun run lint` und `bun run check` sauber, Prettier angewendet, vitest (design-guard, tokens, documents.dom, tenant-detail-page.dom, statement-pages.dom) 813 grün, E2E Chromium `-g "undelivered|zugestellt"` 10 grün.
