# Fachreview #455, Runde 1 (Szenarien 6f16ab0f, geplante Texte 455-texts.md, Prompt)

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-455-fach` (detached, 6f16ab0f). Quellen: #455 «Decided (product owner)» und «Done means», #222 (beschlossene Hinweistexte), `UBIQUITOUS_LANGUAGE.md` (Zeilen 79, 81), `docs/design/i18n-begriffe.md`, Fedlex OR (Fassung 1.1.2026, Filestore-HTML).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major (Produktentscheid) | Rechnungsseite: «Ergibt das 0, erfassen Sie die Schlussrechnung nicht …» gilt für eine Schlussrechnung, die schon erfasst ist. Richtig wäre: löschen. |
| V-2 | Verwalter / Mietrecht | Major (Produktentscheid) | Die kurze Zeile auf der Rechnungsseite «Der Betrag ist das Total vor dem Abzug.» stimmt nicht, wenn eine Akontorechnung schon abgerechnet ist. Sie lädt dazu ein, den Betrag zu «korrigieren», und dann zählt die Akontorechnung doppelt. |
| V-3 | Verwalter | Minor | «Verringern Sie den Betrag **einer** abgerechneten Akontorechnung um den Unterschied» geht nicht, wenn der Unterschied grösser ist als jede einzelne Akontorechnung (Schlussrechnung 200, zwei abgerechnete à 500: −800). Vorschlag: «der abgerechneten Akontorechnungen». Der Text ist beschlossen und steht auch im Glossar: Issue nötig. |
| V-4 | Verwalter | Minor | Prompt: «Teilzahlung» ist zu weit. Eine Rechnung in Raten über einen festen Betrag (ohne Schlussrechnung) würde als `advance_invoice` erkannt, wäre nicht vorausgewählt und ginge vergessen. Besser die Glossarwörter «Teilrechnung über einen Vorschuss» verwenden, ein Gegenbeispiel nennen und einen Fall in `llm:eval` aufnehmen. |
| V-5 | Verwalter | Minor | `{total}` in `invoices_upload_deducted` fehlt, wenn die KI einen Abzug liest, aber `totalAmount` null ist (Prompt, llm.ts:272). Die Zeile endet dann mit «vorgeschlagen: ». Es braucht eine Variante ohne Total, z.B. «… Tragen Sie als Betrag das Total vor dem Abzug ein.» |
| V-6 | Verwalter | Minor | Der Akonto-Hinweis sagt «können Sie die Akontorechnung auswählen». Das Bedienelement heisst aber «Diese Rechnung erstellen» (messages/de.json:959), und «auswählen» bedeutet im selben Dialog jetzt auch «Dateien auswählen». Vorschlag: «… setzen Sie das Häkchen bei «Diese Rechnung erstellen»». Der Text ist beschlossen: Issue. |
| V-7 | Verwalter | Minor | Szenarien: Keines prüft, dass der Hinweis nicht mehr in der Beleg-Karte steht (Punkt 6.2). Abhilfe: In «Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung» einen Schritt «Und erinnert der Beleg nicht an abgezogene Akontorechnungen» ergänzen, oder einen DOM-Test schreiben. |
| V-8 | Verwalter | Minor | Fehlender Begriff «Schlussrechnung»: Er erscheint neu in der Oberfläche, hat aber keine eigene Glossarzeile und keine Zeile in `i18n-begriffe.md` (geplant: facture finale / fattura finale / final invoice). Vorschlag siehe unten. Issue mit `fachlich`, `entscheiden`. |
| V-9 | Verwalter | Nit | en `invoices_upload_advance_invoice`: «an advance payment» ist laut i18n-begriffe.md:37 das englische Wort für das Akonto des Mieters. Besser «a prepayment». |
| V-10 | Verwalter | Nit | «In Abrechnungen enthalten», Eintrag «{number}, {status}»: Bei mehreren Mietverträgen sagt die Nummer allein nicht, wessen Abrechnung es ist. «{number}, {Mieter}, {status}» wäre klarer. Beschlossen ist «number and status», deshalb nur als Nit. |
| V-11 | Verwalter | Nit | Punkt 2: «der letzten Rechnung» kann man als die neue Rechnung lesen, «der früheren Rechnung» wäre eindeutig. en: «comes back earlier» / «comes later» → «comes back later». Der Text ist beschlossen. |

## Blocker / Major

### V-1: Satz aus Punkt 3 auf der Rechnungsseite
- **Evidenz:** `455-texts.md`, `invoices_beleg_deducted_rule` (de): «Ergibt das 0, erfassen Sie die Schlussrechnung nicht. Ergibt es weniger als 0, erfassen Sie sie auch nicht: …». Szenarien `invoice-detail.feature` «Abgezogene Akontorechnungen beim Betrag» und `invoice-edit.feature` «Hinweis auf abgezogene Akontorechnungen beim Bearbeiten» (je die Zeile «Und erklärt der Hinweis …»). In #455, Punkt 6.1, lautet die Regel für beide Orte gleich.
- **Warum falsch:** Der Hinweis steht nur bei einer Rechnung, die schon erfasst ist. Auf ihrer Seite ist «erfassen Sie sie nicht» keine Handlung mehr: Der Liegenschaftsverwalter weiss nicht, was er tun soll, und die doppelte Zählung bleibt. Zwei Rechenbeispiele:
  - Total 1250, abgerechnete Akontorechnungen 1250, also 1250 − 1250 = 0. Ist die Schlussrechnung mit 1250 erfasst, zählen 2500 statt 1250.
  - Total 1250, abgerechnet 1500, also −250. Die Schlussrechnung muss weg, und die Akontorechnung wird auf 1250 verringert.

  In beiden Fällen zählt danach genau das Total. Mehr erlaubt Art. 257b Abs. 1 OR nicht: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …».

  Ausserdem fehlt hier eine Anweisung, auf die sich «das» beziehen kann: Der Satz davor beschreibt nur einen Zustand («ihr Betrag ist vom Total abgezogen»).
- **Abhilfe (Produktentscheid, Text aus #409 beschlossen):** Auf der Rechnungsseite und in «Rechnung bearbeiten» etwa so:

  «Ergibt das Total weniger diese Akontorechnungen 0, löschen Sie diese Rechnung mit «Rechnung löschen». Ergibt es weniger als 0, löschen Sie sie auch: Verringern Sie den Betrag der abgerechneten Akontorechnungen um den Unterschied, und berichtigen Sie die Abrechnungen mit ihnen.»

  Ist die Schlussrechnung selbst schon abgerechnet, führt die bestehende Löschbestätigung (`invoices_delete_billed_text`) zur Berichtigung. fr/it/en entsprechend. Die Upload-Regel bleibt, wie sie ist: Dort ist «erfassen Sie nicht» richtig.

### V-2: Kurze Zeile «Der Betrag ist das Total vor dem Abzug.»
- **Evidenz:** `455-texts.md`, `invoices_beleg_deducted`. Die Regel darunter sagt das Gegenteil: «Ist eine davon schon abgerechnet, bleibt sie erfasst, ihr Betrag ist vom Total abgezogen …». Glossar Z. 81 sagt nur «die Akontorechnungen nicht zusätzlich». In #222 war der Satz noch eine Prüfbedingung («Prüfen Sie, dass …: Der Betrag ist das Total vor dem Abzug»). Jetzt steht er als feste Aussage allein in der hervorgehobenen Zeile.
- **Warum falsch:** Beispiel: Total 1250, abgezogen 1000, davon 500 schon abgerechnet. Richtig erfasst ist dann 750. Die Zeile behauptet aber, der Betrag sei 1250. Ein unerfahrener Liegenschaftsverwalter «korrigiert» auf 1250, und 500 zählen doppelt. Das widerspricht Art. 257b Abs. 1 OR (Wortlaut oben). Die Änderung macht den Widerspruch sichtbarer als bisher.
- **Abhilfe (Produktentscheid, Text in #409 Punkt 6.1 beschlossen):** «Auf dem Beleg sind Akontorechnungen von {amount} abgezogen. Der Betrag ist das Total vor dem Abzug, weniger die Akontorechnungen, die schon abgerechnet sind.»

  Alternativ: «Der Betrag ist in der Regel das Total vor dem Abzug.» Dann fängt die Regel darunter die Ausnahme auf. fr/it/en entsprechend.

## Bestätigt
- **Upload-Regel:** `invoices_upload_deducted_rule` ist wörtlich der Rest von #222 (ab «Haben Sie die Akontorechnungen schon erfasst …», alle vier Sprachen) plus der Satz aus Punkt 3. Die kurze Zeile entspricht wörtlich #455 Punkt 6.1. Durch die Zeile ist «Akontorechnungen» als Bezug für «sie» jetzt klarer als bisher.
- **Regel der Rechnungsseite:** Gegenüber #222 fehlt nur der Teilsatz «Der Betrag ist das Total vor dem Abzug, und» (wie verlangt), ergänzt um Punkt 3. fr «qu’elles» und it «contino» sind korrekt an den neuen Bezug (factures d’acompte) angepasst.
- **Rechnung Punkt 3 (Upload):** Total − abgerechnete Akontorechnungen:
  - 1250 − 500 = 750 erfassen; 500 + 750 = 1250 ✓
  - = 0: nicht erfassen ✓. 0 lässt sich ohnehin nicht speichern (`src/lib/invoice.ts:50`, Betrag > 0).
  - < 0 (800 − 1000): Akontorechnung um 200 verringern, Abrechnungen berichtigen; 800 ✓
- **Punkt 2:** Neu gerechnet. 500 über 01.04.2026–31.03.2031 (1826 Tage). Bis Ende 2028 sind 1006 Tage, also 275.47, abgerechnet. Gekürzt auf 31.03.2029 (1096 Tage) kommen für 2029 noch 90 Tage dazu, also 41.06. Zusammen 316.53, es fehlen 183.47 ✓ (wie im Issue). Der Text entspricht wörtlich dem beschlossenen. fr/it/en sind sinngleich.
- **Akonto-Hinweis (Punkt 4):** de wörtlich wie beschlossen. fr/it/en verwenden facture d’acompte / fattura d’acconto / advance invoice und émetteur de la facture / emittente della fattura / invoice issuer (i18n-begriffe.md:44, :48).
- **Nicht vorausgewählt (Punkt 4):** Begründung «keine Doppelzählung» passt zu Art. 257b Abs. 1 OR (Fedlex, Wortlaut oben).
- **Häkchen und To-dos:** Unangehakt ohne «Wählen Sie eine Kategorie.», angehakt mit den üblichen To-dos. Die beiden Szenarien sagen das widerspruchsfrei. Hinweis für die Umsetzung: `toDoOf` (src/lib/invoice-upload.ts:143) gibt heute für jeden documentType ausser `invoice` nichts zurück. Für `advance_invoice` muss es von `selected` abhängen, `preselected` (:209) bleibt.
- **abgerechnet = décomptée / conteggiata / in a statement:** In allen geplanten Texten so umgesetzt, ebenso `invoices_billed_title` und `invoices_beleg_billed` en wie beschlossen. «Abgerechnet bis» (billed until) ist ein anderer Begriff und bleibt.
- **«In Abrechnungen enthalten»:** passt zur Glossarzeile 79 (jeder Status, auch Ersetzt). «Keine» / «Aucun» / «Nessuno» / «None» stimmt im Genus (Abrechnungen f. Pl., décompte m., conteggio m.). Die Status kommen aus den bestehenden `statements_status_*`. Das Backend führt die abgerechneten Rechnungen je Abrechnung (`calculation.service.ts:47`, `statement-invoices.service.ts:71`).
- **Dateiauswahl:** «Dateien auswählen» / «Datei auswählen» / «Keine Datei ausgewählt» folgen der Regel «Datei» vor dem Speichern, «Beleg» danach (#222). it im Infinitiv wie die übrigen Knöpfe.
- **Rechtsquelle Art. 257b OR** (Fedlex, Fassung 1.1.2026): Abs. 1 wie oben zitiert. Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»

## Fehlende Begriffe (Issue, Labels `fachlich`, `entscheiden`)
- **Schlussrechnung (eines Rechnungsstellers):** «Rechnung eines Rechnungsstellers über das Total seiner Leistungen, die seine Akontorechnungen abzieht. Dwello erfasst sie mit dem Total vor dem Abzug, ohne Akontorechnungen, die schon abgerechnet sind.» Für `i18n-begriffe.md`: facture finale / fattura finale / final invoice (fr/it unsicher, siehe unten).

## Nicht bestätigt
- **fr «facture finale» / it «fattura finale»** als übliche Wörter der Werke in der Romandie und im Tessin: nicht auf Fedlex. In i18n-begriffe.md und messages/*.json gibt es keine Fundstelle. Vorschlag: Muttersprachler prüfen lassen (wie #342).
- **Option B von Punkt 2** (beide Rechnungen zählen bis zum Ende des alten Leistungszeitraums): Dass mehrjährige Kosten über ihre Jahre verteilt werden dürfen, steht nicht im Wortlaut von Art. 257b OR oder VMWG Art. 4–8. Es gilt als Praxis (#254). **unsicher**
- **Prompt-Verhalten:** Erst `bun run llm:eval` vor und nach der Änderung zeigt, ob Schlussrechnungen, die Akontorechnungen abziehen, weiter als `invoice` erkannt werden. Nicht ausgeführt (Review nur lesend).
- **Ratenrechnungen** über feste Beträge (z.B. Grundgebühren der Gemeinde) und ihre Abgrenzung zur Akontorechnung (V-4): Praxis nur aus Erfahrung, keine Quelle gesucht.
