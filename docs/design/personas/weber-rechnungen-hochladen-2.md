# Dr. Weber: Rechnungen hochladen, Runde 2 (Hinweise zu Akonto, Reparatur, Gutschrift, Beleg)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300 (Demodaten). Nur angesehen, nichts erstellt; den Dialog habe ich dreimal mit «Abbrechen» → «Abbrechen und verwerfen» verlassen. Die Rechnungsliste zeigte vorher und nachher «83 Rechnungen».

Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/weber-rechnungen-hochladen-2/` (s1.mjs, s2.mjs, s3.mjs; 01-liste.png bis 05-abbrechen.png).

Hinweis: Die KI-Antworten kommen im Persona-Stack von einem Platzhalter mit festen Antworten. Die vorgeschlagenen Werte (Betrag 1250.00 bei allen drei Dateien, R-1001, «Allgemeinstrom Q1») bewerte ich nicht, nur die Texte, mit denen Dwello sie vorlegt, und was der Dialog vorab anhakt.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Upload-Dialog, «Werke Schlussrechnung 2025.pdf» | Runde-1-Befund P-1 ist weitgehend beantwortet: «Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.» Jetzt weiss ich, dass 1250.00 das Total ist. Offen bleibt der häufige Fall, dass ich die Akontorechnungen im Lauf des Jahres **schon** in Dwello erfasst habe: Soll ich sie dann löschen, oder hier nur den Rest eintragen? Der Text spricht nur vom künftigen Erfassen. |
| P-2 | Minor | Upload-Dialog, «Lift Service und Reparatur.pdf» | Runde-1-Befund P-2 ist weitgehend beantwortet: «Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen.» Die Datei ist nicht mehr vorab angehakt, ich muss sie also bewusst öffnen. Offen: Ob ich bei der zweiten Rechnung «Umlagefähig» abwählen muss oder die Kategorie Reparaturen das erledigt, steht nicht da; und die zweite Rechnung hat dann keinen Beleg, obwohl es dieselbe Originalrechnung ist. |
| P-3 | Minor | Upload-Dialog, «Werke Gutschrift 2025.pdf» | Neuer Hinweis «Das ist eine Gutschrift. Ziehen Sie sie vom Betrag der Rechnung ab, zu der sie gehört.» Es fehlt: (a) dass ich für diese Datei **keine** Rechnung erstellen soll (die Checkbox ist zwar leer, aber der Text sagt es nicht; «Umlagefähig» ist im aufgeklappten Teil angehakt, Betrag 1250.00 positiv); (b) wie ich vorgehe, wenn die zugehörige Rechnung schon in Dwello steht (öffnen und Betrag ändern?) oder schon abgerechnet ist. Ich weiss also «abziehen», aber nicht wo und wie. |
| P-4 | Minor | Upload-Dialog, Einleitung | Runde-1-Befund P-4 ist beantwortet: «Dwello speichert jede Datei als Beleg zu ihrer Rechnung. Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Aber «jede Datei» stimmt nur für Dateien, aus denen ich eine Rechnung erstelle. Die Gutschrift (nicht erstellt) und die Reparatur-Restrechnung (über «Rechnung erfassen») haben danach keinen gespeicherten Beleg. Der Satz verspricht mehr, als in genau den heiklen Fällen passiert. |
| P-5 | Minor | Upload-Dialog, Vorauswahl | In der ersten Runde war nur «Werke Schlussrechnung 2025.pdf» angehakt («1 Rechnung erstellen»), obwohl auch sie «Bitte prüfen» zeigt, «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» verlangt und die Kategorie leer ist. Lift und Gutschrift sind nicht angehakt (das finde ich richtig), aber nirgends steht, warum. Ein Klick genügt also weiterhin, um eine ungeprüfte Akonto-Schlussrechnung zu übernehmen. |

## Beobachtungen

- Ab dem zweiten Durchgang stand bei der Werke-Datei zusätzlich «Diese Rechnung ist schon erfasst.» mit dem Link «Erfasste Rechnung ansehen», und sie war dann **nicht** mehr angehakt («0 Rechnungen erstellen»). Die erfasste Rechnung stammt nicht von mir (eine andere Persona im selben Datenbestand); ich werte sie nicht. Die Duplikat-Warnung selbst gefällt mir. Sie steht aber zwischen den Hinweisen, und der Link kommt erst nach «Prüfen Sie: …» (Screenshot 03-vorschlaege-viewport.png).
- Das Dateifeld zeigt weiterhin «Choose Files / No file chosen» auf Englisch (Headless-Chromium).
- Im Bedienungsbaum zeigt «Kategorie» nur «Kategorie auswählen», obwohl die Liste 21 Kategorien enthält (auch «Reparaturen»); wie in Runde 1.
- Die Vorschau («Vorschau von … .pdf») zeigt im Platzhalter nur das Wort «Rechnung»; das Bild ist klein, der Text der Rechnung wäre so nicht lesbar (Platzhalter-PDF, nicht bewertet).
- Hilfe zum Leistungszeitraum nennt 2024, Datumsbeispiele 31.12.2026; nach «Die KI ist unsicher …» und unter jedem Datum folgt ein leerer Absatz (wie Runde 1).
- Neu: «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.» Klar.
- Abbrechen-Rückfrage «Hochladen abbrechen? – Hochgeladene Dateien und Ihre Eingaben gehen verloren.» unverändert gut.

## Aufgabe geschafft

Ja.

## Aufwand

Etwa 10 Minuten, 3 Durchgänge à 6 Schritte (Liste, Dialog, Gebäude, drei Dateien, Angaben aufklappen, Abbrechen und verwerfen).

## Ablauf

1. **Rechnungsliste, «Rechnungen hochladen».** Erwartet: Dialog mit Hinweis auf Beleg. Gesehen: neuer Satz «Dwello speichert jede Datei als Beleg zu ihrer Rechnung.» Damit ist meine Frage aus Runde 1 beantwortet (Einschränkung P-4).
2. **«Seepark Residenz» wählen.** Gesehen: Dateifeld frei, «Ausgewählte Dateien liest die KI sofort aus.»
3. **Drei Dateien wählen.** Erwartet: pro Datei ein Hinweis, der sagt, was ich tun soll. Gesehen: «3 von 3 Dateien gelesen», alle drei «Bitte prüfen», je ein Kasten «Zu dieser Datei». Angehakt nur Werke, Knopf «1 Rechnung erstellen» (P-5).
4. **Werke lesen und aufklappen.** Erwartet: welcher Betrag. Gesehen: «Vorgeschlagen ist das Total der Leistungen vor dem Abzug», Feld Betrag 1250.00. Klar; offen nur der Fall bereits erfasster Akontorechnungen (P-1).
5. **Lift lesen und aufklappen.** Erwartet: was mit den Reparaturen geschieht. Gesehen: Anweisung «nur den umlagefähigen Betrag», Rest mit «Rechnung erfassen» in Kategorie Reparaturen; Checkbox leer; im aufgeklappten Teil Betrag 1250.00 (Gesamtbetrag), «Umlagefähig» angehakt. Ich weiss jetzt, was zu tun ist; Details offen (P-2). Screenshot 04-lift-offen.png. Beim Anhaken wechselte der Knopf auf «2 Rechnungen erstellen»; nicht geklickt.
6. **Gutschrift lesen und aufklappen.** Erwartet: ob und wie ich sie erfasse. Gesehen: «Ziehen Sie sie vom Betrag der Rechnung ab, zu der sie gehört.»; Checkbox leer; Betrag 1250.00 positiv, «Umlagefähig» angehakt. Ich ahne, dass ich sie nicht erstellen soll, gesagt wird es nicht (P-3).
7. **Abbrechen.** Gesehen: Rückfrage, «Abbrechen und verwerfen», Dialog zu, weiterhin 83 Rechnungen. Screenshot 05-abbrechen.png.

## Verwirrung

- «Erfassen Sie die Akontozahlungen nicht zusätzlich»: Und wenn ich sie schon erfasst habe?
- «in der Kategorie Reparaturen»: Ist diese Kategorie automatisch nicht umlagefähig, oder muss ich «Umlagefähig» abwählen?
- «Ziehen Sie sie vom Betrag der Rechnung ab»: In diesem Dialog, an einer schon erfassten Rechnung, und was, wenn diese schon abgerechnet ist?
- «jede Datei als Beleg»: auch die Gutschrift, die ich nicht erstelle?

## Fehlerrisiken

- Akontorechnungen schon erfasst, Schlussrechnung mit Total übernommen: Akonto doppelt in der Abrechnung (P-1).
- Reparatur-Rest über «Rechnung erfassen» erfasst, «Umlagefähig» bleibt an: Reparatur doch den Mietern belastet (P-2).
- Gutschrift wird nirgends abgezogen, weil unklar ist wo; Mieter zahlen zu viel. Der Gutschrift-Beleg ist nicht gespeichert, obwohl der Dialog «jede Datei» verspricht (P-3, P-4).

## Vorschläge

- **P-1:** Rechnungsliste → «Rechnungen hochladen» → Seepark Residenz → «Werke Schlussrechnung 2025.pdf». Hilfreich, ein Satz mehr: «Haben Sie die Akontorechnungen schon erfasst, tragen Sie hier nur den Rest nach Abzug ein.»
- **P-2:** Gleicher Weg, «Lift Service und Reparatur.pdf». Hilfreich: «… in der Kategorie Reparaturen und ohne Häkchen bei ‹Umlagefähig›.» und, ob der Beleg der zweiten Rechnung angefügt werden soll.
- **P-3:** Gleicher Weg, «Werke Gutschrift 2025.pdf». Hilfreich: «Erstellen Sie aus dieser Datei keine Rechnung. Öffnen Sie die zugehörige Rechnung und verringern Sie ihren Betrag um die Gutschrift.» Plus was gilt, wenn die Rechnung schon abgerechnet ist.
- **P-4:** Dialog öffnen, Einleitung lesen. Hilfreich: «Dwello speichert die Datei jeder erstellten Rechnung als Beleg.» und bei nicht erstellten Dateien sagen, dass sie nicht gespeichert werden.
- **P-5:** Gleicher Weg, ohne aufzuklappen: «1 Rechnung erstellen» ist aktiv. Hilfreich: Dateien mit «Bitte prüfen» nicht vorab anhaken, oder bei den nicht angehakten sagen «Nicht vorgewählt, weil …».

## Nicht geprüft

- Was «Rechnung erstellen» mit leerer Kategorie oder mit der Gutschrift tut (kein Speichern, Auftrag: nur ansehen).
- Ob die Kategorie Reparaturen beim Erfassen «Umlagefähig» selbst abwählt (dafür hätte ich «Rechnung erfassen» ausfüllen müssen; kein Speichern).
- Ob nicht erstellte Dateien auf dem Server bleiben: aus dem Browser nicht sichtbar.
