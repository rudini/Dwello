# Code-Review 1158, Runde 4 (Abschlussrunde nach Fallback-Review, f59c116)

Bereich: `git diff 6548806 f59c116` (src/lib/ui/ToastRegion.svelte, src/__tests__/contract-wizard.dom.test.ts)

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | keine Befunde |

Geprüft: `expire()` löscht den Eintrag in `before` nur beim Schliessen, angehaltene Toasts behalten ihn, bis `resume()` sie über `expire()` schliesst oder `close()` sie schliesst (ToastRegion.svelte:26-34, 69-74); `before` wird erst nach dem Mounten gelesen, die Deklaration nach `expire` ist darum unschädlich; andere Wege zum Schliessen gibt es nicht (`dismissToast` in stores.ts hat keinen Timer). Die Änderung ändert kein sichtbares Verhalten (Speicher), darum ohne eigenen Test. Mit der gewählten Wohnung a1 prüfen die beiden «schweigt»-Tests wieder den Filter von `openContractsOf` (contract-wizard.ts:301-305): ohne `!c.end_date` schlägt «schweigt bei einem Mietvertrag mit Vertragsende» fehl, ohne `c.tenant_id === tenantId` schlägt «… eines anderen Mieters» fehl. Die Commit-Nachricht nennt sie als Tests für beibehaltenes Verhalten (kein Bugfix, die Basis zeigt das Verhalten), ein Rotlauf ist also nicht nötig. Keine Texte, kein E2E, keine Verträge (Contracts) berührt.

## Nicht bestätigt

- lint, check, fitness, testcheck:audit, vitest contract-wizard.dom + ui-layout-parts.dom (90): vom Aufrufer gemeldet, nicht selbst ausgeführt.
