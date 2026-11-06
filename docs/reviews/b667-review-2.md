# Code-Review b667, Runde 2 (8beb200..00709bc, #667)

Geschlossen: C-1, C-2, C-3 (über Fach-Review V-2), C-4, C-5.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Minor | src/lib/utils/contract-availability.ts:108-147; messages/*.json (`contracts_overlap`, `contracts_overlap_open_ended`) | Mit `overlapWarning` ist der letzte Aufrufer von `checkDateRangeOverlap(...).message` und `.hasOverlap` im App-Code weg. Nur `contract-form.ts:363` ruft die Funktion noch auf, und es liest nur `.contract`. Damit sind `message`, `hasOverlap`, `formatDateDE` an dieser Stelle und die beiden Texte `contracts_overlap` und `contracts_overlap_open_ended` in allen vier Sprachen ungenutzt. Gelesen werden sie nur noch von `contract-availability.test.ts` und `tenants-i18n.test.ts`. Das Fach-Review, Antwort 4, ging davon aus, dass mit dem Kasten auch das falsche Wort «Vertrag» und der Bindestrich wegfallen. Sie bleiben aber als toter Text stehen. |
| C-7 | Minor | src/__tests__/contract-edit.dom.test.ts:122-126 | Der neue Test baut die Antwort von `/contracts?apartmentId=…` von Hand. Er nimmt `tenantName` und `status` dazu, und `status` liest das Frontend neu (`contract_status`, Ä4). Laut CLAUDE.md, Gotchas, «API contracts», muss er die Antwort aus `tests/contracts/contracts.json` nehmen. Sonst fällt eine Änderung des Felds `status` nur im pg-Vertragstest auf, nicht in diesem Test. Ältere Tests derselben Datei bauen die Antwort ebenfalls von Hand, nur ohne die neuen Felder. |

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht ausgeführt:
  - auf 9f8ea1b: vitest 4206 bestanden; lint, check und backend type-check sauber; Backend 115 in den pg-Dateien und 2033 in der ganzen Suite, diese vor den C-2-Tests; E2E 90 bestanden; axe 72 bestanden; fitness und p2 OK
  - auf 00709bc: check und lint sauber; drei Vertrags-Testdateien mit 165 bestanden; fallow sauber
- Ob die ganze Backend-Suite mit den beiden neuen C-2-Tests grün ist, hat niemand gemeldet. Ob diese Tests ohne `orderBy` und ohne `terminated` rot waren, kann ich nur lesend beurteilen: Der erste legt den späteren Mietvertrag zuerst an, deshalb ist er ohne `orderBy` wahrscheinlich rot.
- Dass der Link im Assistenten den Entwurf behält, habe ich nur im Code gelesen:
  - Gelesen: `ContractWizard.svelte:195-198`. Der Entwurf wird bei jeder Änderung geschrieben, sobald `touched` gilt. Gelöscht wird er nur beim Speichern und beim Verwerfen (Z. 261-290). Beim Laden stellt `restoreDraft` ihn wieder her.
  - Kein Test folgt dem Link und kehrt zurück. Der DOM-Test prüft nur `href` und dass kein `target` gesetzt ist.
  - Beim Zurückkehren beginnt der Assistent wieder bei Schritt 1, mit dem Hinweis «Entwurf wiederhergestellt». Das habe ich nicht im Browser gesehen.
- Das neue `Wait.forCount(contractsUnknownHints, 0)` in `overlap-refused` habe ich nicht ausgeführt. Lesend gilt es, weil sowohl im Assistenten als auch im Bearbeitungsformular nach einem allgemeinen Speicherfehler `*-contracts-unknown` stehen bleibt (`reviewUnknown`, `shownUnknown`). Der Zustand ist deshalb ohne die Ablehnung rot.
- Das Layout des Steppers mit `flex-auto` bzw. `flex-1` habe ich nicht gesehen. Der Abrechnungsassistent übergibt `values` und behält deshalb `flex-1` wie auf main. Der Mietvertragsassistent übergibt keine `values`.

Geprüft:
- Wortlaut: Ein Skript vergleicht alle 9 Zeilen der Tabelle in b667-fachreview-2.md mit `messages/{de,fr,it,en}.json`, und alle sind Wort für Wort gleich. In fr steht U+00A0 an « » und vor : ? !, ein normales Leerzeichen kommt dort nicht vor. `contracts_overlap_text` und `contracts_overlap_wizard` sind überall entfernt.
- Die vier Szenariozeilen zu #667 sind Wort für Wort gleich wie die Ersatzzeilen des Berichts.
- Die Regel für den Rat (`adviceOf`) stimmt mit den Fällen 1–4 des Berichts überein, auch an den Grenzen: gleicher Tag ohne Vertragsende ergibt `same_start`, gleicher Tag mit Vertragsende ergibt `start_after`, nur ein späterer Beginn ergibt `end_before`/`end_earlier`.
- V-3: Das Feld ist `endDate` nur bei Fall 1 mit «Befristet».
- Auf main ist kein Szenario ohne @wip und keine bestehende Step-Definition geändert (Diff gegen den Merge-Base fb4c0e3: nur Zusätze).
- C-1: Im Assistenten scheitert jetzt nur `?apartmentId=<limitedApartment>`.
- C-4: Der Schritt liest den Text mit `Text.of(formErrors)`.
- C-5: Der DOM-Test ist ohne die Änderung rot.
- Backend `status` mit pg-Tests, API-Vertrag contract-overlap.json und api-specification.md.
- OverlapLink: 48 px, Tokens, «(öffnet in neuem Tab)» mit `rel`.
- V-5: Der Kasten wird im Bearbeitungsformular und im Assistenten ausgeblendet, sobald der Fehler dasselbe sagt.
- Screenplay-Schichten.
