# Fachreview #245, Runde 1 (vor der Umsetzung)

Gegenstand: `245-texts.md` (Plan und Texte in vier Sprachen) und die @wip-Szenarien von eae980e6 (`invoices.feature`, `invoice-edit.feature`), Worktree `w9-review-245-fach` (detached, eae980e6, enthält #455 / a828b368).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Statuszeile widerspricht sich: «Gelesen» zählt weiter gescheiterte Dateien und Dateien ohne KI («Gelesen: 1 von 1. Nicht gelesen: 1.»; ohne KI «Gelesen: 1 von 1» neben «Die KI hat diese Datei nicht gelesen») |
| V-2 | Verwalter | Minor | Lift-Hinweis: «fügen Sie diese Datei auf ihrer Seite … an» lässt offen, welche Seite gemeint ist; die Lift-Rechnung hat die Datei schon als Beleg. Fix: Text unten |
| V-3 | Verwalter | Minor | Hilfe zur nicht angekreuzten Lift-Zeile («weil Sie zuerst den Betrag aufteilen») bleibt nach der Wahl «Reparaturen», obwohl der Mischkosten-Hinweis dann geht. Fix: gleiche Bedingung wie `mixed` in `toDoOf` (`invoice-upload.ts:162`), plus Schritt im Lift-Szenario |
| V-4 | Verwalter | Minor | Zwei Bedeutungen von «ausgewählt» nebeneinander: «wenn ihre Datei hier ausgewählt ist» (in der Liste, Wortlaut wie #222) und «Nicht zum Erstellen ausgewählt» (Häkchen). Dazu fehlt in de «müssen», en «does not give an invoice» ist unidiomatisch. Fix: die beiden neuen Hilfen mit «Häkchen», Text unten |
| V-5 | Verwalter | Minor | «Noch offen: {name}: {reason}» mit «erster Hinweis oder To-do» kann einen Hinweis zeigen statt des Grunds, der das Erstellen verhindert (z. B. Akontorechnung angekreuzt: langer Akonto-Hinweis statt «Wählen Sie eine Kategorie.»). Fix: der Grund ist die erste Meldung derselben Prüfung, die die Zeile als unvollständig zählt (`checkRow`, `InvoiceUploadDialog.svelte:110`) |
| V-6 | Verwalter | Minor | Betrag der Gutschrift ist `totalAmount`, laut Prompt «vor dem Abzug bereits bezahlter Beträge» (`llm.ts:272`). Liest die KI eine Schlussrechnung mit Guthaben als Gutschrift, nennt der Text das Kosten-Total als Gutschrift; das widerspricht #455 (Schlussrechnung mit Total erfassen). Fix: Betrag nur zeigen, wenn `deductedAmount` leer ist, sonst die Variante ohne Betrag |
| V-7 | Verwalter | Minor | P-5 gilt laut Plan für Bearbeiten **und** Löschen, das @wip-Szenario prüft nur Bearbeiten. Fix: in `invoice-detail.feature`, «Abgerechnete Rechnung mit Beleg löschen», Schritt «Und nennt die Bestätigung die Abrechnung des laufenden Jahres von "Anna Keller" im Status "Entwurf"» |
| V-8 | Verwalter | Nit | Weber P-5 bat auch darum, nur den zutreffenden Teil der Anleitung zu zeigen (Entwürfe oder versendete). Die Liste mit Status reicht aus; das ist optional |
| V-9 | Verwalter | Nit | In `245-texts.md` stehen bei fr noch normale Leerzeichen in « … » und vor «:»/«;» (geprüft per Byte-Suche, 0× U+00A0). Beim Übertrag U+00A0 setzen, wie die Datei es selbst verlangt |
| V-10 | Verwalter | Nit | Begründung «Kategorie bleibt eigener Satz, zuerst» ist haltbar, sollte aber den fachlichen Grund nennen (`docs/reviews/233-fachreview-1.md:167`: «die Kategorie bestimmt die Umlagefähigkeit»). Im Formular steht die Kategorie zuletzt (`UploadRowFields.svelte:94`), «in der Reihenfolge des Formulars» gilt also nur für «Füllen Sie aus» |
| V-11 | Verwalter | Nit | Szenario «Die Kategorie ist beim Bearbeiten Pflicht» prüft nicht, dass «(optional)» beim Feld verschwindet (Helga P-5). Fix: Schritt dazu |
| V-12 | Verwalter | Nit | Hilfe bei Gutschrift it «non nasce una fattura» → «non si crea una fattura»; fr «ne donne pas de facture» → «on ne crée pas de facture à partir d’une note de crédit» (in V-4 enthalten) |

Kein Befund ändert eine Fachregel. Für keinen braucht es den Product Owner, alle Empfehlungen sind eindeutig: V-1 nennt eine Variante, die zweite nur als Alternative.

## Blocker/Major

### V-1 (Major): Statuszeile «Gelesen» widerspricht «Nicht gelesen»

- **Beleg:** `src/routes/invoices/InvoiceUploadDialog.svelte:87`: `done = rows.filter((row) => row.status !== 'reading').length`. Darin zählen `failed` und die Zeilen ohne KI (`withoutKi`, Status `check`) mit. Der Plan nimmt nur die abgelehnte Datei aus der Zählung («A refused file is not counted as read»), führt aber für `failed` die Zusammenfassung «Nicht gelesen» ein.
- **Nachgerechnet:**
  - (a) Zwei Dateien, davon eine abgelehnt (das Szenario): count 1, done 1, also «Gelesen: 1 von 1. Bitte prüfen: 1. Nicht möglich: 1.». Das stimmt.
  - (b) Eine Datei, das Auslesen scheitert: count 1, done 1, also «Gelesen: 1 von 1. Nicht gelesen: 1.». Das widerspricht sich.
  - (c) Eine Datei ohne KI: «Gelesen: 1 von 1. Bitte prüfen: 1.», die Zeile sagt aber «Die KI hat diese Datei nicht gelesen.».
- **Warum falsch:** V-10 aus 233-2 sollte gerade die Zählung berichtigen. Mit dem Plan sagt die Zeile in (b) und (c) «gelesen» über eine Datei, die nicht gelesen wurde. Die Zeile ist auch das, was ein Screenreader hört (Kommentar auf Zeile 88).
- **Behebung (eindeutig):** Das Wort der Fortschrittszeile beschreibt, was fertig ist, nicht was gelesen ist:
  - de «Fertig: {done} von {count}»
  - fr «Fichiers traités : {done} sur {count}»
  - it «Elaborati: {done} su {count}»
  - en «Done: {done} of {count}»

  Abgelehnte Dateien zählen weiter nicht, das Label «Nicht gelesen» bleibt.
  - Szenario «Dwello sagt, was nach dem Lesen zu tun ist» wird zu «Fertig: 1 von 1. Bitte prüfen: 1. Nicht möglich: 1.».
  - Neuer Schritt in «Das Auslesen einer Datei scheitert»: «Und meldet Dwello "Fertig: 1 von 1. Nicht gelesen: 1."».

  Alternative: «Gelesen» behalten und nur Zeilen zählen, die die KI gelesen hat (Status `check` und nicht `byHand`). Dann geht «{done} von {count}» während des Lesens nicht auf.

  Ändert keine Fachregel.

## Vorgeschlagene Texte zu V-2 und V-4

**V-2 `invoices_upload_mixed`:**
- de: «Die Rechnung enthält Kosten, die nicht umlagefähig sind (z. B. Reparaturen). Tragen Sie hier nur den umlagefähigen Betrag ein. Erfassen Sie den Rest danach mit «Rechnung erfassen» als zweite Rechnung in der Kategorie Reparaturen und fügen Sie dort diese Datei mit «Beleg hinzufügen» an.»
- fr: «La facture contient des frais qui ne sont pas répercutables (p. ex. réparations). Saisissez ici seulement le montant répercutable. Saisissez ensuite le reste avec « Saisir une facture » comme deuxième facture dans la catégorie Réparations et ajoutez-y ce fichier avec « Ajouter la pièce justificative ».»
- it: «La fattura contiene costi non addebitabili (p. es. riparazioni). Inserisca qui solo l’importo addebitabile. Registri poi il resto con «Registrare una fattura» come seconda fattura nella categoria Riparazioni e vi aggiunga questo file con «Aggiungere il giustificativo».»
- en: «The invoice contains costs that are not allocable (e.g. repairs). Enter only the allocable amount here. Then enter the rest with «Add invoice» as a second invoice in the category Repairs and attach this file to it with «Add the supporting document».»

Die Szenariozeile des Lift-Szenarios folgt diesem Text.

**V-4 `invoices_upload_unticked_mixed` / `invoices_upload_unticked_credit`:**
- de: «Das Häkchen bei «Diese Rechnung erstellen» fehlt, weil Sie zuerst den Betrag aufteilen müssen. Setzen Sie es danach.»
  / «Das Häkchen bei «Diese Rechnung erstellen» fehlt, weil aus einer Gutschrift keine Rechnung entsteht. Ist die Datei doch eine Rechnung, setzen Sie es.»
- fr: «La case « Créer cette facture » n’est pas cochée, car vous devez d’abord répartir le montant. Cochez-la ensuite.»
  / «La case « Créer cette facture » n’est pas cochée, car on ne crée pas de facture à partir d’une note de crédit. Si le fichier est quand même une facture, cochez-la.»
- it: «La casella «Creare questa fattura» non è spuntata perché deve prima ripartire l’importo. La spunti poi.»
  / «La casella «Creare questa fattura» non è spuntata perché da una nota di credito non si crea una fattura. Se il file è comunque una fattura, la spunti.»
- en: ««Create this invoice» is not ticked because you must split the amount first. Tick it afterwards.»
  / ««Create this invoice» is not ticked because no invoice is created from a credit note. If the file is an invoice after all, tick it.»

Der Gutschrift-Hinweis behält «wenn ihre Datei hier ausgewählt ist», gleich wie `invoices_upload_deducted_rule` aus #222 (vom PO entschieden). Die beiden Szenariozeilen «erklärt die Auswahl …» folgen diesen Texten.

## Bestätigt (mit Quelle)

- **Gutschrift: Betrag der zugehörigen Rechnung mindern, keine eigene Rechnung, Gutschrift aufbewahren.**
  - Quellen: `UBIQUITOUS_LANGUAGE.md:81` und Art. 257b Abs. 1 OR, Fedlex-Wortlaut in `docs/nebenkostenabrechnung-anforderungen.md:29`: «die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen …» (Fedlex geprüft, Fassung 1.10.2026).
  - Ist die Rechnung schon abgerechnet, braucht es laut Glossar eine berichtigte Abrechnung. Das deckt der Weg «Rechnung bearbeiten» ab, mit der Warnung `invoices_edit_billed_text`.
  - Nachgerechnet: Rechnung 5’000.00 minus Gutschrift 1’250.00 ergibt 3’750.00.
  - Betrag im Text: KI 1250 → «über CHF 1’250.00»; KI −1250 oder 0 → `francs` gibt null (`llm.ts:325`) → Text ohne Betrag. Das stimmt.
  - Die Checkbox bleibt ankreuzbar (PO), die neue Hilfe begründet das mit einem Satz. Das entspricht der PO-Entscheidung.
- **Lift (Vollservicevertrag):** Umlagefähig ist nur die Wartung, den Rest erfasst man in «Reparaturen».
  - Quellen: `UBIQUITOUS_LANGUAGE.md:100` und Art. 256 Abs. 1 OR, wörtlich in `backend/src/config/llm.ts:52`: «Der Vermieter ist verpflichtet, die Sache … in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.»
  - Dieselbe Datei als Beleg der zweiten Rechnung: Das Glossar erlaubt höchstens einen Beleg **pro Rechnung** (`:85`), zwei Rechnungen mit derselben Datei widersprechen dem nicht. Die Belegeinsicht wird so erleichtert (Art. 257b Abs. 2 OR, Wortlaut im Anforderungsdokument `:77`).
  - Die Zeile bleibt nicht angekreuzt, mit einem Satz dazu: entspricht der PO-Entscheidung.
- **Weber P-6 «already fixed»: hält.**
  - `invoices_edit_billed_text` und `invoices_delete_billed_text` (`messages/de.json:940`, `:956`) sagen «die berichtigte Abrechnung rechnet an, was schon bezahlt ist». Das ist neutral und deckt Rückerstattung und Nachforderung ab.
  - Glossar «Berichtigte Abrechnung» (`:185`): «Was Mieter oder Vermieter … schon bezahlt haben, wird angerechnet.» Die berichtigte Abrechnung ist selbst die begründete Mitteilung der Nachforderung, die Weber wünscht.
- **Decided against «Datei und Felder vergleichen»: hält.**
  - Auf Desktop steht die Vorschau schon neben den Feldern (Helga 233-2, Z. 34).
  - Bei 390 px und 200 % verbietet die Design-Regel seitliches Scrollen.
  - Der neue Tab mit Zoom ist fachlich der bessere Vergleich, z. B. für Kleingedrucktes auf einer Lift-Rechnung.
- **Decided against «Kategorie in Füllen Sie aus aufnehmen»: hält,** fachlicher Grund siehe V-10.
- **Kategorie Pflicht in «Rechnung bearbeiten» (PO):**
  - Der Fehlertext «Wählen Sie eine Kategorie.» ist derselbe wie beim Hochladen (`invoices_upload_category_missing`).
  - «Neue Rechnung» bleibt optional (`new/+page.svelte:168`, ohne `categoryRequired`). Den fachlichen Rest (eine Rechnung ohne Kategorie wird ohne Vereinbarungsprüfung abgerechnet, `statement-invoices.service.ts:30`, Art. 257a Abs. 2 OR laut Anforderungen `:27`: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.») deckt das offene #452 Punkt 4 ab. Kein neuer Befund und kein neues Issue.
- **#455-Verträglichkeit:**
  - Kein Text von #245 widerspricht der Option C (Schlussrechnung mit Total, Akontorechnungen löschen; Glossar `:82–83`).
  - Die Gutschrift mindert das Total der Schlussrechnung. Das passt, mit der Ausnahme in V-6.
  - P-5 übernimmt die Einträge «In Abrechnungen enthalten» (`invoices_billed_in_entry` «{number}, {status}»).
  - Lift-Hinweis und Akonto-Hinweis auf derselben Schlussrechnung ergeben «umlagefähiger Anteil am Total vor dem Abzug». Das ist schlüssig.
- **Begriffe:**
  - Gutschrift, Rechnung, Beleg, Rechnungssteller, Kategorie, Umlagefähig, KI, Entwurf: im Glossar, richtig verwendet.
  - fr/it/en gemäss `docs/design/i18n-begriffe.md`: note de crédit / nota di credito / credit note (`:45`); pièce justificative / giustificativo / supporting document (`:44`); répercutable / addebitabile / allocable (`:56`); facture / fattura / invoice (`:43`).
  - Knopfnamen wie in `messages/*.json`: «Saisir une facture», «Registrare una fattura», «Add invoice», «Modifier la facture» usw., ebenso «Créer cette facture» / «Creare questa fattura» / «Create this invoice».
  - en mit «», fr mit Leerzeichen innen (V-9: U+00A0), it und de ohne.
- **«z. B.»:** Noch 2 Stellen mit «z.B.» (`invoices_upload_mixed`, `invoices_beleg_mixed`), 9 mit «z. B.». Der Plan ist richtig.
- **Ohne KI / Auslesen gescheitert / Duplikat / Reihenfolge / Übrige Dateien verwerfen:**
  - Die Texte stimmen fachlich: «Die KI hat diese Datei nicht gelesen.» ist wahr für `EXTRACTION_UNAVAILABLE`.
  - REQUIRED in Formularreihenfolge: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung (`UploadRowFields.svelte:77–82`).
  - «Übrige Dateien verwerfen» passt zu `invoices_upload_discard_text_created` in allen vier Sprachen.
  - Die Szenarien prüfen das Gewünschte.
- **Nicht angekreuzte Gutschrift erscheint nicht unter «Noch offen»:** `stillOpen` umfasst nur angekreuzte Zeilen (`InvoiceUploadDialog.svelte:78,81`). Das ist richtig.

## Nicht bestätigt

- **Fedlex direkt:**
  - WebFetch auf `fedlex.admin.ch/eli/cc/27/317_321_377/de#art_257_b` lieferte nur den JavaScript-Hinweis.
  - `mmx search` fand nur Sekundärquellen (gerichte-zh.ch).
  - Die Zitate oben stammen aus den im Repo als «Fedlex geprüft» geführten Wortlauten (`docs/nebenkostenabrechnung-anforderungen.md`, `backend/src/config/llm.ts` LEGAL_BASIS), nicht aus einem neuen Abruf.
- **Nachforderung nach einer schon versendeten Abrechnung:** Ob eine berichtigte Abrechnung zulasten des Mieters nach anerkanntem Saldo noch durchsetzbar ist (Weber P-6), steht nicht im Normtext. Gesucht in den Anforderungen und im Glossar `:185`, nur Verjährung, Art. 128 Ziff. 1 OR: **unsicher**. Der Text verspricht das nicht, kein Befund.
- **KI-Verhalten bei Schlussrechnung mit Guthaben (V-6):** Ob die KI sie als `credit_note` liest, ist nicht geprüft. Kein Fall in `llm:eval` gesucht, Stand-in `llm-stub.ts` liefert für alle Dateien 1250.
- **Abbruch nach dem Erstellen, wenn keine Datei mehr übrig ist:** Ob die Rückfrage dann erscheint, ist nicht geprüft. Nicht im Gegenstand.
- **«KI note style» und «Umlagefähig deaktiviert»:** Reine Darstellung, keine Textänderung, kein Szenario. Fachlich nichts zu prüfen.
