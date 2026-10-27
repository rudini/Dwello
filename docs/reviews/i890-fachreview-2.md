# Fachreview #890, Runde 2: Hinweis auf verschiedene Verteilschlüssel der Lieferungen für den Tank

Gegenstand: Delta `git diff 4e6ffb2b 62dc942c` (ohne `docs/reviews`), Worktree bei 62dc942c. Vorbericht: `docs/reviews/i890-fachreview-1.md`.

Geschlossen: V-1, V-2, V-4

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-3 | Verwalter | Minor | Ist die Veränderung Tankbestand 0, erscheint der Hinweis trotzdem (`invoice-completeness.service.ts`, `keysFinding`, keine Prüfung von `amount`). Der Schlüssel ändert dann keinen Betrag. Bleibt so, weil es die entschiedene Regel einengen würde (Entscheid des Product Owners). |
| V-5 | Verwalter | Minor | Ist der Hinweis bei einem Gebäude mit Vorjahr der einzige Befund, heisst der Kasten «Kosten im Vergleich zum Vorjahr» und sagt «Dwello vergleicht jede Kategorie mit dem gleichen Zeitraum im Vorjahr … Vielleicht kommt die Rechnung später». Mit dem Vorjahr hat der Hinweis aber nichts zu tun (`src/routes/statements/generate/CategoryCheck.svelte:27-31`: `compared` schliesst nur `stock` und `consumption` aus). Fix: `keys` dort auch ausschliessen. Dann lautet der Titel «Tankbestände prüfen», ohne Text zum Vergleich. |

## Nicht bestätigt

- Fälle 1 und 2 aus V-1 (Lieferungen der Periode mit einem Schlüssel, die Veränderung nach einem anderen) habe ich nur im Code nachvollzogen: `keysFinding` nimmt den Schlüssel der Veränderung in die Menge auf. Ein Test deckt sie nicht ab. `fuel-stock.pg.test.ts` prüft nur zwei Lieferungen mit verschiedenen Schlüsseln und eine Lieferung allein. Laufen lassen habe ich die Tests nicht.
- Ob `keyFor` nach Lieferdatum statt nach Rechnungsdatum wählen sollte, ist weiter offen. Siehe Runde 1. Das gehört nicht zu diesem Auftrag.

Geprüft: Der Schlüssel im Befund kommt aus `fuelStockChange` (`distributionKeyId` aus `keyFor`). Die Menge sind die Rechnungen aus `getInvoicesForStatement` plus die Veränderung, `null` zählt als eigener Schlüssel. Nachgerechnet: Fälle 1–3 aus V-1 und das Szenario (Lieferungen «Pro Fläche (m²)» 15.06. und «Pro Einheit» 15.10.2024, `keyFor` ergibt «Pro Einheit») geben den Hinweis mit dem richtigen Schlüssel. Ohne Lieferung in der Periode oder mit einem einzigen Schlüssel kommt kein Hinweis. Ist der Schlüssel der Veränderung `null`, haben alle Lieferungen der Kategorie keinen Schlüssel (`keyFor` sucht ohne Datumsgrenze), also kein Hinweis zu Recht. Der Hinweis erscheint neben `stock` bzw. `consumption` und nur mit beiden Beständen. `needsConfirmation` bleibt unverändert. Im BFF steht der Schlüssel in der UI-Sprache (`namesById('distribution-keys')`). Der Text in allen vier Sprachen entspricht dem Wortlaut aus Runde 1, fr mit U+00A0 innerhalb der Guillemets. Die Seed-Namen «Pro Fläche (m²)» und «Pro Einheit» stimmen (`backend/migrations/0002_stammdaten.sql:47-48`). Das Szenario nennt beide Schlüssel und «verlangt die Vorschau keine Bestätigung».
