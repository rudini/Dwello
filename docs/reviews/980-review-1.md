# Slice-Review #980, Runde 1 (870692c, Basis 8cfd9a5)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/statement-invoices.service.ts:221-223, docs/api-specification.md:140 | Docstring von `invoiceStatements` und API-Spezifikation beschreiben `missedIn` weiterhin als «alle Perioden mit Abrechnungen, die die Rechnung so, wie sie jetzt ist, nicht abrechnen». Seit dem Fix zählen ersetzte Abrechnungen nicht mehr mit. Beide Texte sagen also etwas Falsches. Ein Halbsatz «(replaced statements excluded, #980)» an beiden Stellen genügt. |

Keine Blocker oder Major.

Geprüft: Fix in `invoiceStatements`. Nur `missedIn` überspringt `isReplaced`; `billedIn` und `statements` behalten die ersetzte Abrechnung (Glossar «Ersetzt», «Abgerechnet (Rechnung)»). Die Regel kommt aus `counting-statements.ts`, sie ist nicht kopiert. Alle Verbraucher von `missedIn` (Detailseite, Bearbeiten, Weiterleitung in `invoices/new`) folgen dem Fix einheitlich. Der pg-Test ist ohne Fix rot: Die ersetzte Abrechnung hat noch den alten Betrag und liefert `missedIn: [year]`. Das Aufräumen funktioniert (Berichtigung zuerst löschen, dann ersetzte Abrechnung auf `draft` setzen). Das Szenario ist ohne Fix rot: Die Warnung erscheint. Es ist fachlich formuliert und hat nach Regel «Negative checks» einen positiven Anker (Betrag). Es hat kein `@wip`. Die neuen Steps rufen nur `seed` und Questions auf. Sie spiegeln die vorhandenen `{int}`-Steps für das laufende Jahr. Keine UI-Texte, keine Vertragsform und keine Bildschirme wurden geändert. Nichts im Diff gehört nicht zur Anforderung. Ponytail: schon schlank.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun run fitness`, `bun test src/__tests__/statement-invoices.pg.test.ts` (44 pass, neuer Test vor dem Fix rot), E2E `invoice-detail.feature` chromium (22 passed, neues Szenario als @wip ohne Fix rot).
- Ob das Senden einer Abrechnung des laufenden Jahres (Periode noch nicht zu Ende) im Seed immer erlaubt ist: nur über den gemeldeten grünen E2E-Lauf belegt, `statements/:id/status` im Backend nicht nachgelesen.
