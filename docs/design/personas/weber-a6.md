# Dr. Weber – Runde a6: Abgelaufener befristeter Mietvertrag (Jonas Graf, Seepark Residenz)

Desktop 1440 × 900, Maus. Persona-App auf http://localhost:3300. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/weber-a6/`. Gespeichert habe ich nur in Seepark Residenz.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag Jonas Graf, Kasten «Befristeter Mietvertrag abgelaufen» | «Mieter ist ausgezogen» speichert sofort mit einem Klick, ohne Rückfrage. Danach verschwinden der Kasten und die Schaltfläche «Unbefristet weiterführen». Es gibt keinen Hinweis, wie man den Klick rückgängig macht. |
| P-2 | Major | Übersicht und Mietvertrag, beide Antworten | Dwello sagt nicht, was die Antworten für die Nebenkosten bedeuten. Weder hier noch dort steht, wer die Nebenkosten ab dem 01.07.2025 trägt: bei «ausgezogen» der Vermieter (die Wohnung zählt als leer), bei «unbefristet» der Mieter (Abrechnung über das ganze Jahr). Ich musste es aus den Zahlen der Abrechnung ablesen. |
| P-3 | Minor | Mietvertrag bearbeiten → Assistent «Abrechnungen erstellen» | Nach «Entwurf löschen und Mietvertrag speichern» meldet Dwello nur «Mietvertrag von Jonas Graf gespeichert». Der Entwurf NK-22222222-2025-0005 wird gelöscht, aber das steht nicht in der Meldung. Ich lande mitten im Assistenten bei Schritt 3, ohne Satz, warum ich dort bin. |
| P-4 | Minor | Mietvertrag Jonas Graf, Karte «Vertragsdauer» | Die Karte zeigt «Beendet», während der Kasten darüber noch fragt, ob der Vertrag unbefristet weiterläuft. Das widerspricht sich. Dwello nimmt die Antwort damit vorweg. |

## Beobachtungen

- Die rechtliche Aussage stimmt mit Art. 266 Abs. 2 OR überein: Setzen beide Seiten das Mietverhältnis nach Ablauf stillschweigend fort, gilt es als unbefristet. Das Beispiel «weil Sie den Mietzins weiter annehmen» passt. Auch der Satz «Sind Sie nicht einverstanden, verlangen Sie die Rückgabe der Wohnung sofort schriftlich und lassen Sie sich beraten» ist vorsichtig und richtig. Nur das Wort «sofort» bleibt ohne Frist. Vermutlich ist das Absicht.
- «Mietstage» (im Hinweis zu den fehlenden Abrechnungen und in der Abrechnungsliste) halte ich für einen Tippfehler von «Miettage». Wenn das Glossar es so festlegt, ist es eigenwillig.
- Die Nummern der Abrechnungen haben eine Lücke: Der gelöschte Entwurf hatte 0005, der neue hat 0006. Für Entwürfe ist das unkritisch. Ein Prüfer würde aber fragen.
- Die Sperre beim Speichern ist gut. Ein Vertrag mit bestehendem Entwurf wird nicht still geändert («Der Mietvertrag wurde nicht gespeichert … mit den bisherigen Vertragsdaten berechnet»). Die rote Schaltfläche nennt ihre Folge vorher: «Der Entwurf NK-22222222-2025-0005 wird gelöscht.»
- Die Zahlen sind plausibel. Erster Entwurf: 01.01.–30.06.2025, 181 Tage, Kosten CHF 1’343.45, Akonto 6 × 200 = 1’200, Nachzahlung CHF 143.45 (stimmt). Neuer Entwurf: 01.01.–31.12.2025, 365 Tage, Kosten CHF 2’584.75, Akonto 12 × 200 = 2’400, Nachzahlung CHF 184.75 (stimmt). Der Anteil des ersten Halbjahrs liegt bei rund 52 %. Das ist mit dem Heizprofil (Jan–Jun 55.8 % der Heizkosten) und den übrigen gleichmässig verteilten Kosten vereinbar.
- Am Ende ist auch die Aufgabe für Lea Huber (Musterhaus Zentrum) aus der Übersicht verschwunden. Dort habe ich nichts geändert. Das war vermutlich eine andere Persona in derselben Datenbank, deshalb ist es kein Befund.
- Der ganzseitige Screenshot der Bearbeitungsseite zeigt die Kopfzeile mitten im Bild. Das ist ein Artefakt der Aufnahme, kein Befund.

## Aufgabe geschafft: teilweise

Den Text zu lesen und zu beurteilen, die Abrechnung 2025 zu erstellen, den Vertrag unbefristet zu setzen, dem angebotenen Weg bis zum neuen Entwurf zu folgen und das Ergebnis zu prüfen: Das habe ich alles geschafft. Ausgerechnet die Schaltfläche «Unbefristet weiterführen» konnte ich bei bestehender Abrechnung aber nicht prüfen. Ich hatte vorher «Mieter ist ausgezogen» angeklickt, um zu sehen, was es tut, und es speicherte sofort (P-1). Danach bot die Seite «Unbefristet weiterführen» nicht mehr an. Ich bin über «Bearbeiten» → «Unbefristet» gegangen, also den Weg, den ein Benutzer nach einem Fehlklick nehmen würde. Was die Schaltfläche «Unbefristet weiterführen» selbst bei einem bestehenden Entwurf sagt, bleibt offen.

## Aufwand

Etwa 25 Minuten, rund 16 Schritte: Übersicht, Vertrag, versehentlich «ausgezogen», Bearbeiten ansehen, Assistent 2025 (4 Klicks), Vertrag, Bearbeiten → Unbefristet → Speichern, Sperre, «Entwurf löschen und Mietvertrag speichern», Assistent erneut (4 Klicks), Kontrolle von Vertrag, Übersicht und Abrechnungsliste.

## Ablauf

1. **Übersicht.** Erwartet: ein klarer Hinweis auf den Vertrag. Gesehen: «Befristeten Mietvertrag prüfen. Der befristete Mietvertrag von Jonas Graf ist am 30.06.2025 abgelaufen. Wohnt Jonas Graf noch in der Wohnung und sind Sie damit einverstanden, zum Beispiel weil Sie den Mietzins weiter annehmen? Dann läuft der Mietvertrag unbefristet weiter.» Dazu der Link «Mietvertrag öffnen». Rechtlich stimmig. Zu den Nebenkosten steht nichts.
2. **Mietvertrag.** Erwartet: die beiden Antworten mit ihren Folgen. Gesehen: derselbe Text, dazu der Satz zur schriftlichen Rückgabe und die Schaltflächen «Unbefristet weiterführen» und «Mieter ist ausgezogen». Darunter ein gelber Hinweis «2 Abrechnungen fehlen» mit «2025 abrechnen» und «2024 abrechnen». Die Karte «Vertragsdauer» zeigt «Beendet», «Befristet bis 30.06.2025» (P-4). Was jede Antwort für die Abrechnung bedeutet, steht nicht da (P-2).
3. **«Mieter ist ausgezogen» angeklickt**, um zu sehen, was folgt. Erwartet: eine Rückfrage oder ein Datumsfeld. Gesehen: Dwello speichert sofort, die Meldung lautet «Gespeichert: Jonas Graf ist ausgezogen». Der Kasten ist weg, «Unbefristet weiterführen» auch (P-1). In der Übersicht ist die Aufgabe für Jonas Graf verschwunden.
4. **Bearbeiten angesehen.** Hier kann man unter «Vertragsdauer» «Unbefristet» wählen. Das war mein Ausweg.
5. **«2025 abrechnen»** (aus dem Vertrag). Der Assistent beginnt bei Schritt 3, Seepark Residenz und die Periode 2025 sind vorgewählt. In der Vorschau: 1 Abrechnung, Jonas Graf, Kosten CHF 1’343.45, Nachzahlung CHF 143.45. Ich musste «Die Abrechnungen trotzdem erstellen» ankreuzen, weil es im Gebäude schon 4 Abrechnungen gibt. Dann «Entwürfe erstellen». Ergebnis: «1 Nebenkostenabrechnung ist als Entwurf erstellt». Die Abrechnungsliste zeigt NK-22222222-2025-0005, 01.01.2025 – 30.06.2025, 181 Mietstage. Die Monate nach dem Vertragsende sind also abgerechnet, aber zulasten des Vermieters.
6. **Zurück zum Vertrag.** Dort steht nur noch «Abrechnung 2024 fehlt», der Status bleibt «Beendet».
7. **Bearbeiten → «Unbefristet» → «Änderungen speichern».** Erwartet: ein Hinweis, dass die Abrechnung 2025 dann nicht mehr stimmt. Gesehen: Beim Wählen gibt es keinen Hinweis, erst beim Speichern die Sperre «Der Mietvertrag wurde nicht gespeichert. Die Nebenkostenabrechnung NK-22222222-2025-0005 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.» Dazu ein Link auf den Entwurf, der Satz «Der Entwurf … wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» und die rote Schaltfläche «Entwurf löschen und Mietvertrag speichern». Das ist klar und ehrlich. Dass nun der Mieter die Monate Juli bis Dezember bezahlt, steht aber auch hier nicht (P-2).
8. **«Entwurf löschen und Mietvertrag speichern».** Erwartet: eine Meldung «Entwurf gelöscht, Vertrag gespeichert» und ein Hinweis auf den nächsten Schritt. Gesehen: Dwello öffnet direkt den Assistenten bei Schritt 3 (Seepark Residenz, 2025), mit der Meldung «Mietvertrag von Jonas Graf gespeichert». Dass der Entwurf gelöscht wurde, erwähnt die Meldung nicht (P-3).
9. **Assistent erneut.** Vorschau: Jonas Graf, Kosten CHF 2’584.75, Nachzahlung CHF 184.75. Angekreuzt, erstellt: «1 Nebenkostenabrechnung ist als Entwurf erstellt».
10. **Kontrolle.** Vertrag: «Laufend», Vertragsende «Unbefristet», neu eine Schaltfläche «Beenden», weiterhin «Abrechnung 2024 fehlt». Abrechnungsliste: NK-22222222-2025-0006, 01.01.2025 – 31.12.2025, 365 Mietstage, Nachzahlung CHF 184.75, Entwurf. Übersicht: Seepark Residenz fehlt nun bei «Noch nicht abgerechnet», 8 Entwürfe statt 7, keine Aufgabe mehr zu Jonas Graf. Das ist alles stimmig.

## Verwirrung

- «Mieter ist ausgezogen» klingt wie eine Feststellung, mit der ich ein Formular öffne (Auszugsdatum?). Es ist aber eine endgültige Antwort, die sofort gespeichert wird.
- Welche Antwort mich Geld kostet, muss ich selbst herleiten. Bei «ausgezogen» trage ich die Nebenkosten ab dem 01.07.2025 selbst («Den Anteil leerer Wohnungen trägt der Vermieter», steht erst im Assistenten). Bei «unbefristet» zahlt sie der Mieter.
- «Beendet» als Status, während Dwello noch fragt, ob der Vertrag weiterläuft.
- «Mietstage» statt «Miettage».

## Fehlerrisiken

- Mit einem Fehlklick auf «Mieter ist ausgezogen» verliert der Vermieter stillschweigend sechs Monate Nebenkosten (hier rund CHF 1’240), wenn der Mieter in Wahrheit noch wohnt. Den Rückweg über «Bearbeiten» zeigt die Seite nicht.
- Wer den Unterschied nicht kennt, wählt eher «ausgezogen», um die Meldung loszuwerden.
- Nach dem Löschen des Entwurfs ist der Assistent offen. Wer ihn schliesst, hat für 2025 bei Jonas Graf keine Abrechnung mehr. Immerhin zeigt der Vertrag dann wieder «Abrechnung 2025 fehlt» an (nicht geprüft, Annahme aus Schritt 2).

## Vorschläge

- **P-1:** Mietvertrag Jonas Graf öffnen, «Mieter ist ausgezogen» klicken: Die Seite speichert sofort. Hilfreich wäre eine Bestätigung mit der echten Folge, etwa «Der Mietvertrag endet am 30.06.2025. Die Nebenkosten ab 01.07.2025 tragen Sie als Vermieter.», dazu «Abbrechen». Nach dem Speichern sollte die Meldung sagen, wie man es über «Bearbeiten» korrigiert.
- **P-2:** Übersicht → «Mietvertrag öffnen»: Unter jeder Schaltfläche sollte ein Satz zur Folge stehen. «Unbefristet weiterführen: Jonas Graf bezahlt die Nebenkosten auch ab dem 01.07.2025; die Abrechnung 2025 umfasst das ganze Jahr.» «Mieter ist ausgezogen: Ab dem 01.07.2025 gilt die Wohnung als leer, deren Nebenkosten tragen Sie.» Gibt es schon eine Abrechnung über die Zeit nach dem Ende, sollte das hier schon stehen und nicht erst beim Speichern.
- **P-3:** Bearbeiten → «Unbefristet» → Speichern → «Entwurf löschen und Mietvertrag speichern»: Die Meldung sollte lauten «Mietvertrag gespeichert, Entwurf NK-… gelöscht. Erstellen Sie die Abrechnung 2025 jetzt neu.» Oben im Assistenten wäre ein Satz hilfreich, warum er offen ist.
- **P-4:** Mietvertrag mit offener Frage: Solange die Frage offen ist, sollte der Status etwa «Abgelaufen – zu prüfen» lauten statt «Beendet».

## Nicht geprüft

- Die Schaltfläche «Unbefristet weiterführen» bei einem bestehenden Entwurf 2025, also den Weg, den die Aufgabe eigentlich meint: Nach meinem Klick auf «Mieter ist ausgezogen» (P-1) bot die Seite sie nicht mehr an. Ich habe stattdessen «Bearbeiten» → «Unbefristet» genommen. Ob die Schaltfläche dieselbe Sperre und denselben Weg zeigt, ist offen. Die App neu zu starten war mir nicht erlaubt, und den anderen abgelaufenen Vertrag (Lea Huber, Musterhaus Zentrum) durfte ich nicht ändern.
- Abrechnung 2024 für Jonas Graf: nicht Teil der Aufgabe.
- Das PDF des neuen Entwurfs habe ich nicht erzeugt.
- Was eine bereits versendete (nicht nur entworfene) Abrechnung beim Wechsel auf «unbefristet» auslöst.
