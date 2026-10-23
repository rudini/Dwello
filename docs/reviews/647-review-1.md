# Code-Review #647, Runde 1 (29accf3d6..eeaa1c10d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `runHeatingHints` (backend/src/services/statement-run.service.ts:260) nimmt jetzt die Mietverträge, die `planRun` abrechnet. Dort zählt nur eine ersetzte Abrechnung genau dieser Periode nicht (`replacedHere`, :51), eine ersetzte Abrechnung einer anderen, überlappenden Periode rechnet den Mietvertrag weiter ab (:53, F-1). Der Kommentar in :262 stimmt weiterhin, weil eine versendete Abrechnung nie ersetzt ist. Die Unit-Tests in statement-run.test.ts:456-476 decken #339 und #335 bei einer ersetzten Abrechnung dieser Periode ab. Ohne die Änderung schlagen sie fehl: das alte `within` zählte auch eine ersetzte Abrechnung. Den Test zur überlappenden Periode zeigt schon der Basis-Commit (Pinning, im Commit genannt). Er schlägt auch fehl, wenn eine Umsetzung jede ersetzte Abrechnung ausnimmt. Im Szenario (statement-generate.feature:789-801) zieht Eva Frei am 31.03.2024 aus. Ihre Abrechnung ist ersetzt, Marc Huber hat eine Abrechnung. Ohne die Änderung rechnet der Lauf damit keinen Mietvertrag ab, und der Hinweis fehlt, also ist das Szenario ohne Änderung rot. Die Schritte gibt es schon (statement-detail.steps.ts:451). Die Änderung bringt keine neuen Texte, Bildschirme oder API-Felder. Ponytail: Die Änderung nutzt `planRun` wieder, statt eine Regel zu kopieren. Ein unbenutzter Rest bleibt nicht. Im Diff ist nichts, das nicht zur Anforderung gehört.

## Nicht bestätigt

- Ausgeführt habe ich nur `bun test src/__tests__/statement-run.test.ts` (backend, 45 bestanden). Vom Aufrufer gemeldet und nicht erneut ausgeführt: lint, check, type-check im Backend, invoice-completeness.pg.test.ts, api-contracts.pg.test.ts, open-work.test.ts, statement-generation.test.ts, E2E statement-generate.feature (chromium, api) und fallow audit.
- Wie die Änderung bei einer ersetzten Abrechnung dieser Periode auf den Hinweis #335 (versendete Abrechnung nach der alten Regel) wirkt, zeigt nur der Unit-Test, kein E2E-Szenario. Beide Hinweise hängen an derselben Liste `billed`. Ich melde das deshalb nicht als Befund.
