# Helga – Umlagefähigkeit einer Kategorie «Von Dwello» verstehen (#683)

Desktop 1440 × 900, Zoom 150 %, Maus. Demo-Daten auf http://localhost:3300. Nur angeschaut, nichts gespeichert.
Skripte und Bildschirmfotos: `/tmp/claude/helga-683/`.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Kategorie bearbeiten («Feuerlöscher-Wartung», «Lift») | Die «Begründung» verschwindet, sobald ich die andere Wahl anklicke. Gerade wenn ich überlege, ob ich von Dwellos Vorgabe abweichen soll, ist Dwellos Grund weg; ich kann Grund und neue Wahl nicht nebeneinander lesen. Erst als ich zurückklicke, ist der Text wieder da. |
| P-2 | Minor | Kategorie bearbeiten | Die «Begründung» steht direkt unter dem Kästchen «Nicht umlagefähig», mit wenig Abstand. Sie sieht aus, als gehöre sie zu dieser Wahl. Beim «Lift» steht so unter «Nicht umlagefähig» ein Text, der erklärt, warum der Lift umlagefähig ist. Das Wort «Begründung» allein sagt nicht, wessen Begründung (Dwellos Voreinstellung) und wofür. |
| P-3 | Minor | Kategorie bearbeiten («Feuerlöscher-Wartung») | Was bei einem Wechsel passiert («Wählen Sie «Umlagefähig», schuldet der Mieter … trotzdem nicht»; «schon erfasste bleiben nicht umlagefähig») steht nur im blauen Kasten oben, weit weg von der Wahl; bei der Wahl selbst ändert sich nichts. Nach dem Umschalten erscheint kein Hinweis bei den Kästchen. Ich hatte den Kasten oben beim ersten Lesen als «allgemeine Info» übersprungen. |

## Beobachtungen

- Die Kategorienliste zeigt die Begründung schon unter jedem Namen. So wusste ich vor dem Öffnen, warum die Feuerlöscher-Wartung nicht umlagefähig ist: umstritten, Dwello folgt dem Merkblatt des Mieterverbands, Brandschutz ist auch bei leerem Haus nötig. Das hat mir geholfen.
- Der Text bei «Umlagefähige Nebenkosten» ist lang (sieben Zeilen bei 150 %) und voller Gesetzesartikel. Lift und Heizung kommen darin vor, Feuerlöscher nicht. Für meine Frage hilft er wenig; die Begründung darunter hilft mehr.
- Die beiden Kästchen sind gross und gut zu treffen; «Die Kosten fliessen in die Nebenkostenabrechnung» und «Die Kosten trägt der Vermieter» verstehe ich.
- Der blaue Kasten oben hat je nach Kategorie einen anderen Text: bei der Feuerlöscher-Wartung die Warnung, dass der Mieter gesetzlich trotzdem nichts schuldet; beim Lift, dass erfasste Rechnungen nicht mehr in neue Abrechnungen fliessen und man sie beim Zurückstellen einzeln wieder umstellen muss. Gut, aber erst nach dem zweiten Lesen verstanden.
- «Wählen Sie «Umlagefähig», schuldet der Mieter Kosten, die das Gesetz dem Vermieter zuweist, trotzdem nicht.» Diesen Satz musste ich dreimal lesen. Ich verstehe daraus: Ich darf umstellen, aber der Mieter muss es vielleicht gar nicht zahlen. Ob ich es also tun soll, sagt mir die Seite nicht klar.
- «Abbrechen» führt ohne Rückfrage zur Liste zurück, obwohl ich die Wahl verstellt hatte. Gespeichert wurde nichts: Kein Aufruf ausser GET im Netzwerk, und die Liste zeigt danach weiter Feuerlöscher-Wartung «Nicht umlagefähig» und Lift «Umlagefähig».
- Bei 150 % ist die Hauptnavigation hinter «Menü öffnen» versteckt; zu «Einstellungen» kam ich über das Menü.
- Die Beschreibung der Feuerlöscher-Wartung endet mit «(trägt der Vermieter)». Würde ich umstellen, stünde das weiter in der Beschreibung, und es würde nicht mehr stimmen.

## Aufgabe geschafft: ja

Ich weiss jetzt, warum Dwello die Feuerlöscher-Wartung als nicht umlagefähig einstellt, und dass ich sie besser so lasse. Das habe ich aber vor allem aus der Liste und aus der Begründung, bevor ich umgeschaltet habe.

## Aufwand

Etwa 12 Minuten, rund 14 Schritte (Übersicht → Menü → Einstellungen → Kategorien → Feuerlöscher-Wartung → umschalten → zurückschalten → Abbrechen → Lift → umschalten → zurückschalten → Abbrechen).

## Ablauf

- **Feuerlöscher-Wartung, auf «Umlagefähig» umgeschaltet.** Erwartet: Unter der Wahl steht ein Hinweis, was das jetzt bedeutet, oder wenigstens bleibt Dwellos Begründung stehen, damit ich vergleichen kann. Gesehen: Der Abschnitt «Begründung» ist ganz verschwunden; unter den Kästchen folgt gleich «Heizkosten nach dem Heizprofil verteilen». Sonst ändert sich nur der Punkt im Kästchen (Bildschirmfoto `feuer-b-umlagefaehig.png`).
- **Lift, Begründung gelesen.** Erwartet: Die Begründung für «Umlagefähig» steht bei «Umlagefähig». Gesehen: Sie steht unter dem Kästchen «Nicht umlagefähig» (`lift-a-crop.png`). Ich habe kurz gedacht, sie erkläre «Nicht umlagefähig».
- **Lift: Der Lift ist schon «Umlagefähig».** Darum konnte ich nicht auf «Umlagefähig» umschalten; ich habe stattdessen auf «Nicht umlagefähig» geklickt. Erwartet: Ein Hinweis, dass die 2 erfassten Lift-Rechnungen dann nicht mehr in die Abrechnung kommen. Gesehen: Wieder verschwindet nur die Begründung; der Hinweis steht allein oben im blauen Kasten (`lift-b-nicht.png`).
- **Abbrechen nach dem Umschalten.** Erwartet: Eine Rückfrage «Änderungen verwerfen?». Gesehen: Sofort zurück in der Liste, nichts gespeichert.

## Vorschläge

- **P-1:** Einstellungen → Kategorien → «Feuerlöscher-Wartung» → «Umlagefähig» anklicken: Die «Begründung» verschwindet. Dasselbe beim «Lift» mit «Nicht umlagefähig». Hilfe: Die Begründung immer stehen lassen, auch bei der anderen Wahl, etwa mit «Dwello hat «Nicht umlagefähig» voreingestellt, weil …».
- **P-2:** Einstellungen → Kategorien → «Lift»: Die Begründung für «Umlagefähig» steht direkt unter dem Kästchen «Nicht umlagefähig». Hilfe: Den Text als Erklärung der Voreinstellung benennen («Warum Dwello das so voreinstellt») und ihn sichtbar von der zweiten Wahl absetzen, zum Beispiel über die beiden Kästchen oder mit mehr Abstand, damit er nicht zu einer Wahl gehört.
- **P-3:** Einstellungen → Kategorien → «Feuerlöscher-Wartung» → «Umlagefähig» anklicken: Bei den Kästchen erscheint kein Hinweis auf die Folgen; der steht nur oben im blauen Kasten. Hilfe: Den Hinweis zu den Folgen bei der Wahl zeigen, sobald sie von Dwellos Vorgabe abweicht («Der Mieter muss diese Kosten trotzdem nicht bezahlen. Schon erfasste Rechnungen bleiben nicht umlagefähig.»).

## Nicht geprüft

- Das Speichern einer geänderten Wahl und was danach mit Rechnungen oder Abrechnungen passiert: Die Aufgabe hat Speichern ausgeschlossen.
- Zoom 200 %: nicht ausprobiert, nur 150 %.
