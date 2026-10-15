# Code-Review #217, Slice 1 (Backend), Runde 2 (Delta)

Worktree: `review-backend-code2` (0ab1543), Delta `git diff f63afb6 0ab1543` (17 Dateien, alle gelesen; in `messages/*.json` de und fr ganz gelesen, en und it auf dieselben Schlüssel geprüft: je 1405 Schlüssel, `backend_extraction_unavailable` und `backend_beleg_not_found` in allen vier).
Geprüft wurde nur das Delta und ob es C-1 bis C-11 aus `docs/reviews/upload-backend-review-1.md` beantwortet.

## Stand der Befunde aus Runde 1

| ID | Stand | Beleg |
|----|-------|-------|
| C-1 (Major) | behoben | `isRealDate` (`backend/src/routes/real-date.ts:3`) lässt Monat 13 und Tag 32 schon im Muster scheitern und wirft nicht mehr. `date()` (`backend/src/config/llm.ts:320-323`) verwendet die Funktion. Test «lässt ein Datum mit unmöglichem Monat leer …» (`llm-extraction.test.ts:60`) prüft `2026-13-01` und `2026-01-32` und dazu, dass der übrige Vorschlag erhalten bleibt. |
| C-2 | behoben | `.env.example:65` |
| C-3 | behoben | Tests für `ANSWERED_AS` (`unsure` = amount, servicePeriodStart, servicePeriodEnd; ohne die Abbildung fehlen amount und servicePeriodEnd), für das Ende vor dem Beginn, für abgeschaltete KI (`server.prompts` leer), für PUT auf eine unbekannte Rechnung (404) und für GET ohne Beleg (404) |
| C-4 | behoben | eigener Code `EXTRACTION_UNAVAILABLE` mit der Meldung `backend_extraction_unavailable` = Text aus dem Issue, in allen vier Sprachen. `KI_UNAVAILABLE` gilt nur noch für `/recategorize`. |
| C-5 | behoben | `BELEG_NOT_FOUND` (`invoices.ts:205`). `setBeleg` prüft die Rechnung vor der Datei (`invoice.service.ts:278`). Getestet mit einer Word-Datei auf einer unbekannten Rechnung: 404 `INVOICE_NOT_FOUND`. |
| C-6 | behoben, ohne Test | `db.transaction` umfasst Rechnung und Beleg (`invoice.service.ts:248-259`). Dass kein Test fehlt, siehe «Nicht bestätigt». |
| C-7 | behoben | Plan-Zeile `Skills: tdd, ponytail, ponytail-review`. O-29 steht in `offene-punkte.md`. |
| C-8 | behoben | `docs/tech-stack.md:80` |
| C-9 | behoben | gemeinsames `isRealDate` |
| C-10 | behoben | `roundToRappen(value).toFixed(2)`, `Number(parsed.invoiceCount) \|\| 1` (Test mit `'2'`) |
| C-11 | behoben | `maxLength: 255` und `buildingExists` mit 404 `BUILDING_NOT_FOUND` (Test «kennt kein unbekanntes Gebäude») |

## Neue Befunde aus dem Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-12 | Minor | messages/de.json:133-136, 781-833 (ebenso fr/it/en) | Dieser Backend-Slice bringt 52 neue Meldungen, die nur der Dialog aus Slice 2 braucht, und ändert die Datenschutzerklärung (`privacy_llm_external`, `privacy_llm_local`, `privacy_stored_1`). Diese Texte sieht man ab diesem Commit auf der Datenschutzseite. Sie nennen aber «Rechnungen hochladen» und Belege, die es in der UI noch nicht gibt, und kein Test zeigt sie. Ausserhalb dieses Slices werden sie nicht verwendet. Sie gehören in den Frontend-Slice, mit einem Test, der zuerst rot ist. Andernfalls muss die Plan-Zeile von Slice 2 sie dort als ihre Texte führen. |
| C-13 | Nit | backend/src/__tests__/invoice-extraction.pg.test.ts:86-92 | Der Test «fragt eine abgeschaltete KI nicht» prüft nur 503 und keinen Prompt, nicht aber den Code `EXTRACTION_UNAVAILABLE`. |
| C-14 | Nit | backend/src/config/llm.ts:1-2 | `config/llm.ts` importiert jetzt aus `routes/` (`real-date`) und `services/` (`pdf-format`): Die Konfiguration hängt damit von höheren Schichten ab. `isRealDate` gehört an einen neutralen Ort, z. B. `backend/src/utils/`. |
| C-15 | Nit | backend/src/config/llm.ts:357 | `Number(parsed.invoiceCount) \|\| 1` nimmt auch `-2`, `1.5` oder `true` (→ 1) an. Ein Hinweis «mehrere Rechnungen», der auf `> 1` prüft, ist davon nicht betroffen. Sauberer wäre `Math.max(1, Math.trunc(…))`. |

Kein neuer Blocker oder Major.

## Blocker/Major

Keine offen. C-1 ist behoben (siehe oben).

## Nicht bestätigt

- Die drei geänderten Testdateien habe ich im Worktree erneut laufen lassen (`cd backend && bun test src/__tests__/llm-extraction.test.ts src/__tests__/invoice-extraction.pg.test.ts src/__tests__/invoice-beleg.pg.test.ts`): 18 bestanden, 0 fehlgeschlagen.
- Vom Aufrufer gemeldet, nicht von mir wiederholt: `bun run type-check`, `bun run lint`, `bun run deepcheck:audit`, die Vitest-Dateien `backend-codes`, `i18n`, `invoices-i18n` und `privacy-i18n.dom`, die ganze Backend-Suite vor dem Delta (627 bestanden, 1 Fehler, O-29). Die ganze Backend-Suite nach dem Delta und `api-contracts.pg.test.ts` sind nicht gemeldet. `isRealDate` wird auch in `/invoices/completeness` (`invoices.ts:180`) und bei den Zählerständen (`buildings.ts:141`) verwendet. Die Änderung macht nur strenger, was dort vorher geworfen hätte, aber ihre Tests liefen nach dem Delta nicht.
- C-6 ohne Test: Der Aufrufer begründet, dass sich ein Einfügen, das nach der Dateiprüfung scheitert, nicht erzeugen lässt. Ich habe nicht geprüft, ob eine Grenze der Spalten in `invoice_documents` (z. B. die Länge von `fileName`) das doch erlaubt. Nur der Code bestätigt die Transaktion.
- Rote Tests (C-1 und die neuen Tests aus C-3): Nur die Plan-Zeile belegt sie, ich habe sie nicht nachgestellt.
- Inhalt der geänderten Datenschutztexte (Rechtstext): gehört zu `fach-reviewer`, hier nicht beurteilt. Ob die Begriffe in fr/it/en `docs/design/i18n-begriffe.md` folgen, habe ich nur stichprobenweise geprüft (fr: «pièce justificative», Guillemets mit Leerzeichen).
