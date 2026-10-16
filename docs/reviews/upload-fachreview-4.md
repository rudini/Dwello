# Fachreview #217 «Rechnungen aus hochgeladenen Belegen» – Runde 4 (Delta)

Gegenstand: Worktree `review-upload-fach4`, Commit 3b17d9fe, Diff `be436c1d..3b17d9fe`, beschränkt auf `messages/{de,fr,it,en}.json` (`invoices_delete_billed_text`), `src/lib/invoice-upload.ts` (Kategorie in «Prüfen Sie: …», V-15), `src/routes/invoices/[id]/DeleteConsequences.svelte` (im Diff unverändert, im Zusammenhang mit M-5 gelesen), Szenariotitel in `tests/e2e/features/invoices.feature`, Kommentare auf #222 (T-2) und #233. Grundlage: Runde 3 (`docs/reviews/upload-fachreview-3.md`), Triage `implementation_plan.md:42`.

Rechtsgrundlage: Fedlex-Wortlaute aus Runde 2/3 (Abruf 2026-10-15), hier verwendet:
- OR Art. 257b Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»; Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- VMWG Art. 8 Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen …»

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-5 | Mietrecht | (Minor) | behoben |
| V-15 | Verwalter | (Minor) | behoben |
| V-16 | Verwalter | (Nit) | behoben |
| T-1 | Begriffe | (Nit) | behoben |
| T-2 | Begriffe | (Minor) | offen, wartet auf Product Owner in #222 (Kommentar vorhanden, Labels `fachlich`, `entscheiden`) |
| M-6 | Mietrecht | Nit | neu: Löschdialog mit Beleg sagt «Mieter können den Beleg verlangen», ohne zu sagen, dass der Beleg mit dem Löschen weg ist und vorher heruntergeladen werden kann |

Keine neuen Blocker oder Major.

## Status der Befunde aus Runde 3

### M-5 – behoben
- Beleg: `messages/de.json` `invoices_delete_billed_text` endet jetzt «Bewahren Sie die Originalrechnung auf: Der Mieter kann Einsicht verlangen.»; fr «Conservez la facture originale : le locataire peut demander à la consulter.» (U+00A0 vor dem Doppelpunkt geprüft), it «Conservi la fattura originale: l’inquilino può chiedere di consultarla.», en «Keep the original invoice: the tenant may ask to inspect it.» Gleiche Wörter wie `invoices_upload_keep_original` in allen vier Sprachen. DOM-Test `invoice-pages.dom.test.ts:248` prüft den ganzen neuen Satz.
- Fachlich: Der Widerspruch «Beleg wird gelöscht» / «Bewahren Sie den Beleg auf» ist weg. Der Satz stimmt mit Glossar `UBIQUITOUS_LANGUAGE.md:64` («die Originalrechnung bewahrt der Liegenschaftsverwalter auf») und mit Art. 257b Abs. 2 OR / Art. 8 Abs. 2 VMWG (Einsicht in die Originalunterlagen). Er gilt auch für eine Rechnung ohne Beleg (dort war «den Beleg» vorher schief).
- Rest siehe M-6 (Nit, nicht Teil von M-5 im engeren Sinn).

### V-15 – behoben
- Beleg: `src/lib/invoice-upload.ts:148-151` `valuesOf`: `chosen` aus der KI-Kategorie, dann `typed`; neu `if (row.values.categoryId) typed.isValidUtilityCost = row.values.isValidUtilityCost;`. Unit-Test `invoice-upload.test.ts` «behält mit der gewählten Kategorie auch, ob die Kosten umlagefähig sind» (gewählt c7/true, KI «Repairs»/false → c7/true).
- Nachrechnung:
  1. Fall aus Runde 3: Verwalter wählt «Allgemeinstrom» (umlagefähig, `true`), KI «Reparaturen» 0.9 → Ergebnis Allgemeinstrom, `isValidUtilityCost` true. Rechnung CHF 1'200, zwei Wohnungen zu gleichen Teilen → je 600 (vorher je 0). Richtig.
  2. Umgekehrt: Verwalter «Reparaturen» (`false`), KI «Allgemeinstrom» → Reparaturen/false, je 0. Richtig.
  3. Randfall: keine Kategorie gewählt, KI unsicher (< 0.7) → `categoryId` '', `isValidUtilityCost` true, Kategorie in «Prüfen Sie» genannt (siehe unten); Erstellen erst nach Wahl. Richtig.
  4. Randfall: keine Kategorie gewählt, aber «Umlagefähig» selbst abgewählt, KI wählt umlagefähige Kategorie → Kategorie der KI mit `false`. Die ausdrückliche Wahl des Verwalters bleibt und ist sichtbar; vertretbar, unverändert gegenüber Runde 3.
- Code nicht ausgeführt (siehe «Nicht bestätigt»).

### V-16 – behoben
- `invoices.feature:103` «Szenario: Eine Gutschrift ist nicht zum Erstellen ausgewählt» – entspricht genau dem, was die Schritte prüfen (Hinweis, nicht ausgewählt).

### T-1 – behoben
- fr «justificatif» ersetzt durch «facture originale» (mit M-5). Im selben Dialog bleibt «pièce justificative» für den Beleg (`invoices_delete_beleg`, `invoices_beleg_billed`), wie `docs/design/i18n-begriffe.md`.

### T-2 – offen beim Product Owner
- #222, Kommentar 2026-10-16T08:40:53Z: nennt den Konflikt mit Glossar «Akonto» und schlägt «Akontorechnung (eines Rechnungsstellers): Teilrechnung eines Rechnungsstellers über einen Vorschuss auf seine Leistungen; die Schlussrechnung zieht sie ab.» vor, inkl. Folgeänderung an `invoices_upload_deducted`. Sinngleich mit meinem Vorschlag aus Runde 3; der Zusatz «Nicht zu verwechseln mit dem Akonto des Mieters» fehlt, wäre aber für die Abgrenzung nützlich (Anregung, kein Befund). Issue offen, Labels `fachlich`, `entscheiden`: korrekt.

### #233 (V-13, V-14)
- Issue-Text nennt V-13 («Whole repair invoice») und V-14 («KI answers nothing readable») unter Problem; Labels `entscheiden`, `produkt`; Kommentar vom 2026-10-16T08:41:03Z ergänzt Persona-Punkte. In Ordnung.

## Neues im Delta

### Kategorie in «Prüfen Sie: …» – bestätigt
- Beleg: `invoice-upload.ts` `FIELD_LABELS` neu `['category', m.buildings_category]` («Kategorie / Catégorie / Categoria / Category», Glossar `UBIQUITOUS_LANGUAGE.md:72`); `check = [...proposal.unsure, ...missing, ...(values.categoryId ? [] : ['category'])]`. Tests: «nennt eine fehlende Kategorie bei dem, was zu prüfen ist» → «Prüfen Sie: Rechnungsdatum, Kategorie.»
- Fachlich richtig: Die Kategorie bestimmt die Umlagefähigkeit (Glossar «Kategorie»: «Bestimmt, ob Kosten auf Mieter umgelegt werden dürfen.»); eine nicht übernommene Kategorie (Konfidenz < 0.7, wie auf «Neue Rechnung») muss der Verwalter wählen. Eine vorher selbst gewählte Kategorie wird nicht genannt (`values.categoryId` gesetzt). Kategorie steht zuletzt, wie im Dialog nach den Feldern.

### Selbst ausgefülltes Feld nicht mehr «nicht gefunden» – bestätigt
- `missingIn` filtert Felder, die der Verwalter vor dem erneuten Lesen ausgefüllt hat; Test «nennt ein selbst ausgefülltes Feld nach erneutem Lesen nicht mehr als nicht gefunden». Richtig: Der Hinweis «Die KI hat diesen Wert nicht gefunden» wäre bei einem eigenen Wert irreführend.

### Vorauswahl unverändert – bestätigt
- `preselected` ist dieselbe Bedingung wie in Runde 3 (nur ausgelagert): eine Rechnung, kein Duplikat, `documentType === 'invoice'`, keine gemischten Kosten.

## Befund

### M-6 (Mietrecht, Nit) – Löschdialog: Beleg verlangen, aber Beleg wird gelöscht
- Beleg: `src/routes/invoices/[id]/DeleteConsequences.svelte:12-19` zeigt bei abgerechneter Rechnung mit Beleg: «Der Beleg wird ebenfalls gelöscht.» … «Bewahren Sie die Originalrechnung auf: Der Mieter kann Einsicht verlangen.» und danach `invoices_beleg_billed` «Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen.»
- Warum: Nach Glossar `:64` ist «Beleg» die Datei in Dwello; nach dem Löschen kann der Vermieter sie nicht mehr zeigen. Die Pflicht nach Art. 257b Abs. 2 OR deckt jetzt der Satz zur Originalrechnung, daher kein Rechtsfehler mehr, nur ein schiefer letzter Satz. Der M-3-Wortlaut ist vom Product Owner entschieden; er passt auf den Beleg-Bereich der Rechnungsseite, im Löschdialog fehlt die Handlungsanweisung.
- Behebung (Vorschlag, braucht wegen des entschiedenen M-3-Texts den Product Owner): im Löschdialog statt `invoices_beleg_billed` «Laden Sie den Beleg vorher herunter, wenn Sie ihn für die Belegeinsicht brauchen.» (fr «Téléchargez d’abord la pièce justificative si vous en avez besoin pour la consultation par le locataire.», it «Scarichi prima il giustificativo se Le serve per la consultazione da parte dell’inquilino.», en «Download the supporting document first if you need it for the tenant’s inspection.»). Als offene Arbeit zu #233 oder #222 nehmen; hält #217 nicht auf.

## Fehlende Begriffe
- Keine neuen. «Originalrechnung» steht im Glossar (Eintrag «Beleg»), «Akontorechnung» ist in #222 vorgeschlagen.

## Nicht bestätigt
- Unit-Tests nicht ausgeführt: `node_modules` des Worktrees verweist auf den Arbeitsbaum des Aufrufers, Zugriff gesperrt. V-15 und «Kategorie in Prüfen Sie» nur aus Code (`invoice-upload.ts:140-189`) und Testtext abgeleitet.
- Fedlex nicht neu abgerufen; das Delta berührt keine neue Norm (Wortlaute aus Runde 2, 2026-10-15).
- Übersetzungen fr/it/en im M-6-Vorschlag nicht gegen `i18n-begriffe.md` für «Belegeinsicht» geprüft, **unsicher**.
