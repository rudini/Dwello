# Fachreview #448, Runde 1 (Szenarien vor der Umsetzung)

Gegenstand: `git diff 42231a00~1 42231a00 -- tests/e2e/features` (Worktree `review-448-fach`, Commit 42231a00), Anforderung: #448 «Decided (product owner)» und «Done means». Gesetzestexte aus dem Fedlex-Filestore, OR «Stand am 1. Oktober 2026» (`.../eli/cc/27/317_321_377/20261001/de/html/...`), VMWG Fassung 1.10.2025.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Rückerstattungen unter CHF 5 aus Abrechnungen nach #94 («Wir zahlen ihn nicht aus.») werden laut Plan nicht übertragen: der einseitig erklärte Verzicht hebt die Forderung des Mieters nicht auf (Art. 115 OR). Bestand schon vor der Änderung, braucht einen Produktentscheid. |
| V-1 | Verwalter | Major | «Bereits bezahlt» beim Berichtigen ist nur aus Sicht des Mieters formuliert. Bei einer Rückerstattung hat der Vermieter bezahlt (Glossar: «Bereits zurückerstattet»). Eine Regel und ein Szenario fehlen. |
| V-2 | Verwalter | Major | Wie sich Übertrag und berichtigte Abrechnung zueinander verhalten, ist nicht geregelt: eine «Erledigt»-Abrechnung lässt sich nicht berichtigen (`replaceStatement` nimmt nur sent/overdue/paid an), und ein schon übertragener Betrag würde doppelt gezählt oder ginge verloren. |
| V-3 | Verwalter | Major | Ab jetzt druckt das PDF jede Bemerkung, die Hilfe sagt das aber nur bei der berichtigten Abrechnung. Bisherige interne Bemerkungen (z.B. «Mieterin zieht Ende Jahr aus») gingen ungewollt an den Mieter. |
| V-4 | Verwalter | Major | Das Glossar widerspricht den Szenarien: «Auf der Schlussabrechnung gibt es keinen Übertrag.» gegen «rechnet den Übertrag der letzten Abrechnung ein»; «Abrechnungsdatum: Ein Zahlungsdatum davor nimmt Dwello nicht an.» gegen die neue Bestätigung. Formulierungen siehe unten. |
| M-2 | Mietrecht | Minor | Rechtlich ist der Übertrag einer Rückerstattung eine Stundung, keine Verrechnung nach Art. 120 OR (es fehlt eine fällige Gegenforderung). Zulässig, solange der Mieter die Auszahlung verlangen kann (Art. 75 OR). Der PDF-Text ist vertretbar. Vorschlag für einen Zusatzsatz siehe unten. |
| M-3 | Mietrecht | Minor | Ein Übertrag ohne nächste Abrechnung geht verloren: Wechsel auf eine Nebenkostenpauschale oder ein Akonto von 0, oder ein Vertragsende, das nachträglich in die schon übertragene Periode gelegt wird. Fix: ein offener Übertrag wird zur Aufgabe in der Übersicht, als Test auf der unteren Ebene. |
| V-5 | Verwalter | Minor | Im Glossar fehlt die Zeile «Schlussabrechnung», die Zeile «Saldo» nennt den Übertrag nicht. Formulierungen siehe unten. |
| V-6 | Verwalter | Minor | Das PDF unter CHF 5 lautet doppelt «Der Betrag ist kleiner als CHF 5.00. Der Betrag von CHF 3.00 wird …». Bei einer Nachzahlung fehlt «Sie müssen jetzt nichts bezahlen.» Vorschlag: «Der Betrag ist kleiner als CHF 5.00. Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung; Sie müssen jetzt nichts bezahlen.» |
| V-7 | Verwalter | Minor | Die PDF-Zeile «Übertrag aus Abrechnung NK-…: CHF 3.00» sagt ohne Vorzeichen nicht, ob sie den Saldo erhöht oder senkt (nur die Saldo-Tabelle zeigt «–»). Vorschlag: «Übertrag aus Abrechnung NK-… (Rückerstattung): CHF 3.00» bzw. «(Nachzahlung)». |
| V-8 | Verwalter | Minor | Der Kommentar «als Summe auf 5 Rappen gerundet» unterscheidet nichts: ein Übertrag ist schon ein Vielfaches von 0.05, also gilt runden(x + Ü) = runden(x) + Ü. Mit einem `pg`-Test festhalten, dass der gerundete Saldo übertragen wird (1203.02 ergibt 3.02, übertragen werden 3.00; 1197.02 ergibt –2.98, übertragen wird –3.00). |
| V-9 | Verwalter | Minor | Grenzen der Schlussabrechnung nur mit Vertragsende 31.12. getestet. Es fehlen 01.01.2025 (keine Schlussabrechnung, Übertrag nach 2025) und ein Ende mitten in der Periode, als `pg`-Test. Das Szenario «zahlt auch eine kleine Rückerstattung aus» prüft das PDF nicht: Es sollte «Rückerstattung bis …» und die Bitte um die IBAN zeigen, nicht «verrechnet». |
| V-10 | Verwalter | Minor | Texte und Dokumente nach #94 müssen nachziehen: `backend_reminder_below_minimum` («Er wird nicht eingefordert und nicht gemahnt.»), `statements_summary_waived_*`, `docs/nebenkostenabrechnung-anforderungen.md` Z. 46, 94, 152 («nichts wird auf die nächste Abrechnung übertragen»). |
| V-11 | Verwalter | Minor | Die übertragene Abrechnung nennt nicht, wohin der Betrag ging. Nachvollziehbarkeit: im Verlauf/Detail «Verrechnet mit Abrechnung NK-…», sobald die nächste besteht. |
| V-12 | Verwalter | Minor | Eingaben bei «Bereits bezahlt» werden nicht geprüft: leer, negativ, mehr als der Saldo. Fix: ein DOM- oder `pg`-Test mit codierter Ablehnung. |
| M-4 | Mietrecht | Nit | Nach Art. 265 OR darf der Mieter die 3.00 selbst mit dem Mietzins verrechnen; dann würde der Übertrag doppelt gutgeschrieben. Hinweis in der Hilfe des Übertrags erwägen. |
| V-13 | Verwalter | Nit | Minuszeichen in der App «−» (U+2212), im PDF «–» (Halbgeviertstrich). Einheitlich halten oder bewusst festlegen (Glossar «Rundung»: «+ oder –»). |

## Major-Befunde

### M-1 Kleine Rückerstattungen aus Abrechnungen nach #94 bleiben einbehalten

- Beleg: Plan im Auftrag, Punkt 5: «Ein Saldo unter CHF 5 einer früheren Abrechnung, die nach #94 erledigt wurde, wird nicht übertragen.» Issue #448: «statements sent under #94 stay as the tenant was told». `backend/src/services/pdf.service.ts:109` `waivedRefund: 'Der Betrag ist kleiner als CHF 5.00. Wir zahlen ihn nicht aus.'`
- Art. 115 OR: «Eine Forderung kann durch Übereinkunft ganz oder zum Teil auch dann formlos aufgehoben werden, wenn zur Eingehung der Verbindlichkeit eine Form erforderlich oder von den Vertragschliessenden gewählt war.»
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters […]».
- Warum falsch: Bei einer Rückerstattung ist der Vermieter Schuldner. Allein kann er die Forderung des Mieters nicht aufheben, das braucht eine Übereinkunft. Der Satz «Wir zahlen ihn nicht aus» ist keine solche, die Forderung besteht weiter (Verjährung nach Art. 128 Ziff. 1 OR: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen»; ob die Rückerstattung darunter fällt: **unsicher**). #403 selbst nennt den Verzicht unzulässig (M-1, #352). Bei einer Nachzahlung nach #94 ist es anders: dort hat der Vermieter als Gläubiger verzichtet, und das günstige Angebot gilt nach Art. 6 OR als angenommen («gilt der Vertrag als abgeschlossen, wenn der Antrag nicht binnen angemessener Frist abgelehnt wird»; dass das für einen Erlass gilt, ist **unsicher**). Dort bleibt es also zu Recht beim Verzicht.
- Fix (Produktentscheid): Auch eine Rückerstattung unter CHF 5 aus einer Abrechnung nach #94 in die nächste Abrechnung desselben Mietvertrags übertragen, als Zeile «Übertrag aus Abrechnung NK-…». Status und PDF der alten Abrechnung bleiben unverändert. Das ist für den Mieter nur günstiger und widerspricht dem Gesagten nicht nachteilig. Eine Nachzahlung nach #94 wird nicht übertragen. Fehlt der Entscheid: in «Blocked on me» aufnehmen (vorbestehend, #352).

### V-1 «Bereits bezahlt» bei einer Rückerstattung

- Beleg: `statement-detail.feature`, Szenario «Vor dem Berichtigen nach dem bereits Bezahlten fragen», Hilfe «Was der Mieter auf diese Abrechnung schon überwiesen hat, auch ein Teilbetrag.». Glossar Z. 176: «bei einer Rückerstattung «Bereits zurückerstattet», was der Vermieter schon erstattet hat. Wird vom Saldo abgezogen bzw. dazugezählt.»
- Warum falsch: Bei einer versendeten Rückerstattung überweist der Mieter nichts, eine Teilzahlung kommt vom Vermieter. Mit dieser Hilfe würde der Verwalter 0.00 eintragen, oder einen positiven Betrag, der dann mit dem falschen Vorzeichen angerechnet wird. Der berichtigte Saldo wäre falsch.
- Fix: Bei einem negativen Saldo der ersetzten Abrechnung heisst das Feld «Bereits zurückerstattet» mit der Hilfe «Was Sie dem Mieter auf diese Abrechnung schon überwiesen haben, auch ein Teilbetrag.» Gespeichert wird es mit dem Vorzeichen, das `prior_payments` erwartet. Dazu ein Szenario oder ein `pg`-Test mit einer Rückerstattung. Der Text weicht vom entschiedenen Text ab, deshalb Issue (`fachlich`, `entscheiden`).

### V-2 Übertrag und berichtigte Abrechnung

- Beleg: `backend/src/services/statement.service.ts:660` `if (!['sent', 'overdue', 'paid'].includes(existing.status))`. Glossar Z. 183: «Neue Nebenkostenabrechnung, die eine versendete oder bezahlte Abrechnung ersetzt». Kein Szenario im Diff verbindet Übertrag und Berichtigung.
- Warum falsch: Eine Abrechnung «Erledigt» braucht man in der Praxis genauso oft zu berichtigen, etwa nach einer nachträglichen Rechnung oder Gutschrift. Offen sind drei Fälle:
  - (a) Darf eine erledigte Abrechnung berichtigt werden? Mit «Bereits bezahlt» 0.00?
  - (b) Abrechnung A hat 3.00 nach B übertragen, dann wird A berichtigt. A' fordert den neuen Saldo vollständig, B zählt die 3.00 aber weiter. Der Betrag würde doppelt gezählt.
  - (c) Wird B selbst berichtigt, muss B' den Übertrag aus A wieder einrechnen, sonst geht er verloren.
- Fix: Die Regel ins Issue schreiben, als Vorschlag: «Eine Abrechnung «Erledigt» lässt sich berichtigen. Hat sie einen Saldo übertragen, rechnet die berichtigte Abrechnung den übertragenen Betrag als «Bereits verrechnet mit NK-…» an, sobald die nächste Abrechnung ihn enthält. Sonst entfällt der Übertrag, und die nächste Abrechnung nimmt den neuen Saldo. Eine berichtigte Abrechnung übernimmt den Übertrag der ersetzten.» Die Fälle (a) bis (c) mit `pg`-Tests abdecken. Weil das Mengen betrifft: Issue (`fachlich`, `entscheiden`).

### V-3 Die Bemerkung geht neu an den Mieter

- Beleg: Heute druckt das PDF die Bemerkung nicht. `pdf.service.ts:949-957` zeigt unter «Hinweise» nur Standardsätze. Die Hilfe `messages/de.json:1241` lautet `"statements_notes_help": "Zum Beispiel eine Absprache mit dem Mieter."`. Bestehendes Szenario `statement-minimum-balance.feature` mit der Bemerkung «Mieterin zieht Ende Jahr aus», ein typischer interner Vermerk. Neu nur die Hilfe für die berichtigte Abrechnung: «… Die Bemerkung steht im PDF.»
- Warum falsch: Mit #403 (6) druckt jedes neu erstellte PDF die Bemerkung. Ein Verwalter, der das Feld bisher als Notiz für sich genutzt hat, schickt sie ab jetzt ungewollt dem Mieter, auch bei bestehenden Abrechnungen, sobald deren PDF neu entsteht. Die Hilfe sagt das nur bei der berichtigten Abrechnung.
- Fix: Die Hilfe jeder Bemerkung sagt «Die Bemerkung steht im PDF für den Mieter.» (z.B. «Zum Beispiel eine Absprache mit dem Mieter. Die Bemerkung steht im PDF.»), die berichtigte Abrechnung zusätzlich den Satz zum Grund. Dazu ein Szenario für die Hilfe einer gewöhnlichen Abrechnung. Ob bestehende Bemerkungen gedruckt werden: Produktentscheid, im Issue festhalten.

### V-4 Das Glossar widerspricht den Szenarien

- Beleg: `UBIQUITOUS_LANGUAGE.md:178` «Auf der Schlussabrechnung gibt es keinen Übertrag.» gegen das Szenario «Die Schlussabrechnung rechnet den Übertrag der letzten Abrechnung ein». `UBIQUITOUS_LANGUAGE.md:163` «Ein Zahlungsdatum davor nimmt Dwello nicht an.» gegen «Zahlungseingang vor dem Abrechnungsdatum bestätigen».
- Warum falsch: Das Glossar ist die verbindliche Quelle der Begriffe, aus ihm folgen `glossary_balance_text` und `glossary_status_text`. Wörtlich gelesen verbietet es, was die Szenarien verlangen.
- Fix (der Product Owner trägt es ein; Issue mit den Labels `fachlich`, `entscheiden`):
  - Übertrag: «… in der nächsten Abrechnung desselben Mietvertrags verrechnet. Die Schlussabrechnung überträgt nichts weiter; einen Übertrag der vorherigen Abrechnung rechnet sie ein.»
  - Abrechnungsdatum: «… Ab ihm läuft die Zahlungsfrist. Ein Zahlungsdatum davor nimmt Dwello nach einer Bestätigung an, eines vor dem Ende der Abrechnungsperiode nicht.»

## Vorgeschlagene Begriffe (Issue: `fachlich`, `entscheiden`)

- **Schlussabrechnung** (fehlt; wird in `anforderungen-vertragsende.md` A-5 und in der Glossarzeile Mindestbetrag schon gebraucht): «Nebenkostenabrechnung der Abrechnungsperiode, in der der Mietvertrag endet (Vertragsende zwischen Beginn und Ende der Periode, beide eingeschlossen). Ohne Mindestbetrag: jeder Saldo wird eingefordert oder zurückerstattet; einen Übertrag der vorherigen Abrechnung rechnet sie ein.»
- **Saldo** (ergänzen): «Kostenanteil inklusive Verwaltungspauschale minus geleistete Akontobeiträge, plus eine übertragene Nachzahlung bzw. minus eine übertragene Rückerstattung der vorherigen Abrechnung; …»
- Übertrag, Abrechnungsdatum: siehe V-4. «Bereits zurückerstattet» als Feldname: siehe V-1.

## Prüfpunkt 1: Übertrag einer Rückerstattung (Zusammenfassung)

- Mit Art. 257b Abs. 1 OR vereinbar: Der Mieter erhält den Betrag, nichts wird einbehalten. **Bestätigt.**
- Art. 115 OR: Der Übertrag ist kein Erlass, also braucht es keine Übereinkunft. **Bestätigt.**
- Art. 120 Abs. 1 OR: «… so kann jede ihre Schuld, insofern beide Forderungen fällig sind, mit ihrer Forderung verrechnen.» Art. 124 Abs. 1 OR: «Eine Verrechnung tritt nur insofern ein, als der Schuldner dem Gläubiger zu erkennen gibt, dass er von seinem Rechte der Verrechnung Gebrauch machen wolle.» Wenn die kleine Rückerstattung fällig wird, hat der Vermieter keine fällige Gegenforderung. Folgt wieder eine Rückerstattung, fehlt sie ganz. Juristisch ist das deshalb eine Stundung mit späterer Anrechnung, keine Verrechnung. Das Wort «verrechnet» ist umgangssprachlich üblich (so auch das Glossar beim Akonto) und für den Mieter verständlich.
- Art. 75 OR: «Ist die Zeit der Erfüllung weder durch Vertrag noch durch die Natur des Rechtsverhältnisses bestimmt, so kann die Erfüllung sogleich geleistet und gefordert werden.» Der Mieter kann deshalb die Auszahlung verlangen. Dass die Rückerstattung mit der Abrechnung fällig wird, steht so nicht im Gesetz: **unsicher**. Dwello setzt bei einer Rückerstattung sonst selbst eine Frist («Rückerstattung bis»). Der Text verschweigt das nicht, behauptet aber auch nichts Gegenteiliges. Darum nur Minor (M-2). Optionaler Zusatz bei einer Rückerstattung: «Möchten Sie ihn schon jetzt erhalten, teilen Sie uns Ihre IBAN mit.» Das ist ein Angebot und keine Bitte um die IBAN. Produktentscheid.
- Art. 265 OR: «Der Vermieter und der Mieter können nicht im Voraus auf das Recht verzichten, Forderungen und Schulden aus dem Mietverhältnis zu verrechnen.» Die Regel schliesst kein Verrechnungsrecht aus. Siehe M-4.
- VMWG Art. 4 Abs. 1: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Der Übertrag in die nächste Jahresabrechnung hält das ein. **Bestätigt.**

## Bestätigt

- Schlussabrechnung = Vertragsende zwischen Periodenbeginn und Periodenende, das Periodenende eingeschlossen: aus Verwaltersicht richtig, denn danach folgt keine Abrechnung mehr, die einen Übertrag aufnehmen könnte. Dass sie auch CHF 4.00 einfordert und den Übertrag der Vorperiode einrechnet: richtig, sonst ginge der Betrag verloren (Art. 257b Abs. 1 OR für die Rückerstattung).
- Status «Erledigt» für Saldo 0.00 oder einen übertragenen Saldo: keine Mahnung, kein «Zahlung zurücksetzen». Passt zu Glossar Z. 195 und zur Praxis.
- Zahlungsdatum vor dem Abrechnungsdatum mit Bestätigung, Ablehnung vor dem Ende der Abrechnungsperiode: praxisgerecht. Ein Mieter kann auf eine vorab gemailte Abrechnung zahlen. Vor dem Periodenende stehen die Kosten noch nicht fest. Kein Gesetzestext dazu, Verwalterpraxis.
- UI-Texte aus Punkt 4: verständlich, Sie-Form, «ss». Einschränkungen nur wie in V-1 und V-3 genannt.
- Nachgerechnet (Anna Keller, 12 × 100.00 Akonto, ein Mieter im Gebäude, also 100 % der Heizkosten):
  - 1203 − 1200 = +3.00 (Übertrag); 1197 − 1200 = −3.00 (Übertrag); 1200 − 1200 = 0.00 («Es ist nichts zu bezahlen.»).
  - Grenzen: 1204.95 → 4.95 Erledigt; 1205 → 5.00 Versendet; 1205.02 → 5.02, abgerundet 5.00, Versendet; 1195.05 → −4.95 Erledigt; 1195 → −5.00 Versendet; 1195.02 → −4.98, zugunsten des Mieters aufgerundet −5.00, Versendet. Alle stimmen.
  - Übertrag Rückerstattung: 1250 − 1200 − 3.00 = 47.00. Stimmt.
  - Übertrag Nachzahlung: 1250.02 − 1200 + 3.00 = 53.02, abgerundet 53.00. Stimmt (zur Rundungsreihenfolge siehe V-8).
  - Schlussabrechnung: 1201 − 1200 + 3.00 = 4.00, ohne Mindestbetrag eingefordert. Stimmt.
  - Teilzahlung Eva Frei: 732 × 91/366 = 182.00; (430.00 + 182.00) × 1.03 = 630.36; 630.36 − 200.00 = 430.36, abgerundet 430.35. Stimmt. Das alte Beispiel 630.36 − 442.90 = 187.46 → 187.45 ist damit konsistent.
  - Filter «Erledigt» (Nina Brunner, Akonto 0, keine Kosten): Saldo 0.00 → Erledigt. Stimmt.

## Nicht bestätigt

- Ob die Rückerstattung der Nebenkosten mit der Abrechnung fällig wird (Art. 75 OR gegen eine «Natur des Rechtsverhältnisses»): kein Gesetzestext, keine Rechtsprechung gesucht. Gelesen: OR Art. 75, 102, 120, 124 (Fedlex, Stand 1.10.2026).
- Ob Art. 128 Ziff. 1 OR («andere periodische Leistungen») für die Rückerstattung aus einer Nebenkostenabrechnung gilt (M-1): nur der Wortlaut auf Fedlex, keine Rechtsprechung. Das Glossar (Z. 183) sagt selbst «in der Regel».
- Ob ein Schweigen auf «Wir verzichten darauf» nach Art. 6 OR als angenommener Erlass gilt (M-1, Nachzahlungen nach #94): nur der Wortlaut von Art. 6 OR auf Fedlex.
- Wie die Umsetzung ablaufen soll (`carry_over_from_id`, wann der Übertrag bestimmt wird: beim Entwurf oder beim Versand; Reihenfolge, wenn die frühere Abrechnung erst nach der Erstellung der späteren versendet wird; ein zweiter Übertrag hintereinander, z.B. 3.00 + 1.00 = 4.00, wieder übertragen): noch nicht im Code, deshalb mit `pg`-Tests abdecken. Gesucht in `statement.service.ts`, kein Treffer.
- Die Regel, dass für die Schlussabrechnung das Vertragsende in der Periode zählt und nicht der Stand beim Versand: Endet der Vertrag nach dem Periodenende, aber vor dem Versand, wird ein kleiner Saldo erst mit der Schlussabrechnung ein Jahr später verrechnet. Rechtlich unbedenklich, nur Verwalterpraxis. Kein Beleg in `docs/anforderungen-vertragsende.md`.
