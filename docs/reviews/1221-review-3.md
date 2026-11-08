# Code-Review #1221, Abschluss-Slice Runde 2 (Delta 4a1996c..358932d, nur C-4)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/held-invoices.ts:34, src/lib/server/statement-generation.ts:339-358 | Bleibt offen (siehe Runde 2): `distributionKeyName` kommt als `nameDE \|\| name` am `localCheck` vorbei |
| C-2 | Minor | backend/src/services/statement.service.ts:481 | Bleibt offen (siehe Runde 2): `refuseUncalculableKeys` läuft vor `CONTRACT_NOT_IN_PERIOD` bzw. `STATEMENT_NO_RENTAL_DAYS_*`, dazu fehlt ein Test |

Geschlossen: C-4

Neue Befunde: keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - Rotlauf: Mit den vier Fix-Dateien auf dem Stand 8bb1c26 scheitern beide Szenarien am neuen Schritt (chromium).
  - Grünlauf auf 358932d: 3 bestanden, das Navigationsszenario eingeschlossen.
  - eslint auf `common.steps.ts`: sauber.
- Den Rotlauf habe ich nur durch Lesen beurteilt. Auf der Basis landet der Fokus im Assistenten auf `confirm-missing-invoices`, und im Detail gibt `Dialog.svelte` ihn an «Neu berechnen» zurück. `toBe('form-error')` schlägt also in beiden Fällen fehl.
- `PreviewChecks.svelte:125-150` hat zwei `form-error` mit `tabindex="-1"`. Der Schritt prüft nur die `data-testid` und nicht, welche der beiden Meldungen den Fokus hat. In beiden Szenarien zeigt der Schritt davor genau eine Meldung mit ihrem Text, und die Fehlermeldung zu nicht kategorisierten Rechnungen ist dort nicht zu erwarten. Ich habe nicht geprüft, ob die Grundlage des Szenarios in `statement-generate.feature` sie ausschliesst.

Geprüft: Der Schritt nutzt nur die Question `focusedPlace` (`tests/e2e/questions/navigation.ts:9`), die Screenplay-Schichten sind eingehalten. Die Feature-Zeilen beschreiben, was der Verwalter will, nicht wie. Die Szenarien sind auf diesem Branch neu, ein ergänzter Schritt braucht also keine Spec-Freigabe. Neue Texte, Bildschirme oder `data-testid` gibt es nicht. Die Commit-Nachricht nennt den Rotlauf.
