# Abschliessendes Code-Review #1028, Runde 1 (Delta 60f4a28bc..b8eff6d1c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geschlossen: C-1, C-2 (aus docs/reviews/1028-review-1.md).

Geprüft: Die Änderungen in `messages/{de,it,en}.json` ändern nur Leerzeichen (Vergleich mit normalisiertem U+00A0, gleiche Schlüssel in gleicher Reihenfolge). Geändert sind nur Schlüssel im Geltungsbereich: `categories_contract_note`, `invoices_legal_text`, `categories_allocable_rules` und 14 `categories_reason_*` ausser den sechs aus #687. `fr.json` ist unverändert. Die neue Alternative `\d[a-z]? (?=(Absatz|…|lett\.))` in `src/__tests__/i18n.test.ts:82` findet in den Endständen aller vier Sprachen nichts mehr (je 26 geprüfte Schlüssel). Ohne die Message-Änderung schlägt sie bei de/it/en an, die alte Regex dagegen nicht. Der Test ist also ohne die Änderung rot. Die DOM-Pins in `categories-page.dom.test.ts` und `invoice-pages.dom.test.ts` ändern nur die betroffenen U+00A0. Die Schrittzeile in `categories.feature:78` gibt es auf origin/main 75b78a9 noch nicht (neues Szenario, also frei), und der Step-Ausdruck in `categories.steps.ts:342` stimmt mit ihr überein.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet; ich habe sie nicht selbst ausgeführt:
  - i18n-Test rot vor der Message-Änderung;
  - `bunx vitest run` (4362 bestanden);
  - `bun run lint`;
  - `bun run check`;
  - E2E chromium `categories.feature` + `invoice-detail.feature` (76 bestanden);
  - Prettier auf den hinzugefügten Dateien;
  - fitness, Backend type-check und axe-/Sprachzeilen, alle auf 60f4a28bc.
- Ausserhalb des Geltungsbereichs von #1028 stehen weiterhin trennbare Paare «Zahl + Absatz/al./para.», zum Beispiel `glossary_fee_text`, `invoices_service_period_boiler`, `config_help_management_fee`, die sechs #687-Gründe sowie in it/en Rechts- und Datenschutztexte. Laut Anforderung ist das kein Befund; ich erwähne es nur, damit es nachvollziehbar ist.
