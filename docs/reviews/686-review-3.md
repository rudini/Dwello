# Code-Review #686, Runde 3 (Abschlussrunde, 4152a94..86c9066)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/statement-edit.feature (kein Szenario) | Die sichtbare Verhaltensänderung auf «Abrechnung bearbeiten» (Entwurfshinweis an der Zahlungsfrist) hat kein Szenario ohne `@wip` und kein `No scenario: <Grund>` |
| C-2 | Minor | src/__tests__/statement-pages.dom.test.ts:2811 | Die Gegenprobe `edit({ status: 'sent' })` übergibt kein `paymentDeadlineDays`; sie bliebe grün ohne die Bedingung `draft &&` in `+page.svelte:28`, «nur bei Entwürfen» ist also durch keinen Test belegt |

## C-1 (Major): kein Akzeptanzszenario für die Bearbeitungsseite

Der Fix ändert, was der Liegenschaftsverwalter auf `/statements/<id>/edit` sieht: Bei einem Entwurf steht jetzt unter der Zahlungsfrist «Die Frist läuft ab dem Versand. …». Laut `CLAUDE.md` (Workflow 1, «Done means») braucht jede Verhaltensänderung ein Szenario in `tests/e2e/features`, auch ein Bugfix, den der Benutzer sieht, oder einen Vermerk `No scenario: <Grund>`. Im Diff ist keine Feature-Datei geändert. Das Szenario «Ein Entwurf erklärt, ab wann seine Zahlungsfrist gilt» in `statement-detail.feature` prüft nur die Detailseite. Die 6 Szenarien von `statement-edit.feature` (Z. 16–46) gab es schon vorher, und keines prüft den Hilfetext. Weder die Commit-Nachricht noch `implementation_plan.md` nennt ein `No scenario`.
Nachweis: `sending` in `edit/+page.svelte` auf `''` setzen: Alle E2E-Szenarien bleiben grün, nur die Unit- bzw. DOM-Tests werden rot.
Fix: ein Szenario in `statement-edit.feature`, z. B. «Ein Entwurf erklärt beim Bearbeiten, ab wann seine Zahlungsfrist gilt». Es nutzt dieselbe Grundlage wie das O-6-Szenario (`@einstellungen-global`, 30 Tage) und eine Frage nach dem Text von `payment-deadline-input-help` (Screenplay: Target, Question, Step). Die rote Probe dafür entfällt, weil der DOM-Test rot gesehen wurde (Workflow 2).

Geschlossen: keine offenen IDs aus Runde 2 im Delta.

Geprüft: `paymentDeadlineDays` liegt nur noch in `src/lib/server/settings.ts` und nutzt dieselbe URL `API`; Detail- und Bearbeitungsseite verwenden die Funktion gemeinsam, eine Kopie gibt es nicht mehr. Lädt die Konfiguration nicht, liefert sie `undefined`, und die Seite lädt trotzdem. Kein neuer Text: der Schlüssel steht in allen vier `messages/*.json`. Kein neuer Bildschirmzustand mit eigenen Bedienelementen, deshalb sind keine Zeilen in a11y oder Sprachen nötig. Der `display`-Eintrag in `tools/fitness/ratchet.json` folgt demselben Muster wie der Eintrag aus Runde 1 für `PaymentPanel.svelte`: Er verzweigt nur auf den Statuswert und zeigt einen Text an, die Fristregel selbst entscheidet das Backend. Das ist zulässig. Der Load-Test nutzt die Verträge `statement.json` und `config.json`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: vitest (989), `statement-edit.feature` (6), a11y-/Sprachen-Zeilen (4), lint, check, type-check, fitness, fallow, Prettier.
- Die roten Läufe der beiden neuen Tests nennt nur die Commit-Nachricht von 86c9066. Aus dem Code gelesen: Ohne die Änderung fehlen der Hinweis und `paymentDeadlineDays`, beide Tests wären also rot.
