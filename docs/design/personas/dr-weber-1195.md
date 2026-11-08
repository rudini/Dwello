# Dr. Weber – #1195: Begründung «nicht umlagefähig» im Rechnungsformular

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Nur angesehen, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/d2a3de6b-6a5d-5371-9e61-3747fd59bed6/scratchpad/dr-weber-1195/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neue Rechnung / Rechnung bearbeiten, Bereich «Kategorie und Verteilung» | Das Häkchen «Umlagefähig» wird bei einer nicht umlagefähigen Kategorie grau und lässt sich nicht mehr setzen. Die neue Begründung darunter erklärt, warum die Kategorie nicht umlagefähig ist, sagt aber nicht, dass das Häkchen darum gesperrt ist und dass man es nur über eine andere Kategorie ändern kann. Erst als ich wieder «Heizung» gewählt habe, war mir klar, dass die Kategorie das Häkchen setzt. |
| P-2 | Minor | Neue Rechnung, Kategorie «Reparaturen» | Die Begründung stellt ohne Einschränkung fest: «Reparaturen sind in der Nettomiete schon enthalten, also nicht umlagefähig.» In derselben Liste steht bei «Hauswart», dass «kleine Instandhaltung» umlagefähig ist, und bei «Heizung», dass Wartung umlagefähig ist, Reparaturen aber nicht. Im Formular, wo ich mich für eine Reparaturrechnung gerade entscheiden muss, steht nichts dazu, wo die Grenze liegt (kleine Instandhaltung durch den Hauswart oder Wartung im Gegensatz zu einer Reparatur). Wenn eine Rechnung beides enthält, kann man sie leicht ganz falsch einordnen. |

## Beobachtungen

- **Übereinstimmung mit der Kategorienliste:** Für alle acht geprüften Kategorien steht im Formular (bei der neuen Rechnung, beim Bearbeiten und auf der Detailseite der Rechnung) wortgleich derselbe Text wie unter Einstellungen → Kategorien: Reparaturen, Gebäudeversicherung, Liegenschaftssteuer, Hypothekarzinsen, Renovation, Schädlingsbekämpfung, Verwaltung und Feuerlöscher-Wartung. Ich habe keine Abweichung gefunden.
- **Juristische Plausibilität:** Die Gesetzesstellen passen zur jeweiligen Aussage: Art. 256 Abs. 1 OR für die Pflicht, die Liegenschaft zu erhalten; Art. 256b OR für Lasten und Abgaben; Art. 5 Abs. 2 Bst. h VMWG für Versicherungsprämien, die nur die Heizungsanlage betreffen; Art. 4 Abs. 3 VMWG für die Verwaltungspauschale. Bei Schädlingsbekämpfung und Feuerlöscher-Wartung sagt der Text offen, dass die Frage umstritten ist und Dwello dem Merkblatt des Mieterverbands folgt. Das finde ich redlich.
- Die Überschrift «Nicht umlagefähige Kategorie» und der Text erscheinen erst, wenn man die Kategorie wählt. Wechselt man zurück zu einer umlagefähigen Kategorie oder zu «Kategorie auswählen», verschwinden sie wieder, und das Häkchen ist wieder gesetzt und lässt sich bedienen. Das ist folgerichtig.
- Beim Bearbeiten der bestehenden Rechnung «Sanitär Keller AG, Reparatur Boiler Wohnung 2.01» (nicht umlagefähig) steht beim Verteilschlüssel: «Dwello verteilt sie darum gleichmässig pro Wohnung … Prüfen Sie den Verteilschlüssel». Direkt darunter steht, die Rechnung fliesse nicht in die Nebenkostenabrechnung ein. Für eine nicht umlagefähige Rechnung ist der Hinweis zum Verteilschlüssel verwirrend: Was wird hier verteilt? Auch bei einer neuen Rechnung bleibt das Feld «Verteilschlüssel» sichtbar, wenn die Kategorie nicht umlagefähig ist.
- Bei Gebäudeversicherung steht, dass Prämien nur für die Heizungsanlage «zur Heizung gehören». Bei «Lift» sagt die Liste ausdrücklich «Erfassen Sie unter «Lift» nur diesen Anteil». Bei der Versicherung fehlt eine solche Handlungsanweisung (Anteil unter «Heizung» erfassen). Ich habe sie mir selbst hergeleitet.
- Der lange Hinweis zum Entkalken des Boilers beim Leistungszeitraum steht unabhängig von der Kategorie immer da, auch wenn «Reparaturen» gewählt ist. Bei einer Boiler-Reparatur könnte man meinen, sie sei doch umlagefähig.
- In der Kategorienliste sind alle «Löschen»-Knöpfe der Kategorien «Von Dwello» deaktiviert, und der Hinweis darüber erklärt das. Das passt.

## Aufgabe geschafft: ja

Die Begründung bei der neuen Rechnung, beim Bearbeiten und in der Kategorienliste habe ich verglichen. Eine eigene nicht umlagefähige Kategorie konnte ich nicht prüfen (siehe «Nicht geprüft»).

## Aufwand

Etwa 20 Minuten und 9 Durchläufe. Geprüft habe ich die Kategorienliste, die neue Rechnung mit 8 Kategorien sowie das Bearbeiten zweier bestehender Rechnungen (Fernwärme, umlagefähig, und die Boiler-Reparatur, nicht umlagefähig) und die Detailseite der Reparatur.

## Ablauf

- Neue Rechnung, «Gebäudeversicherung» gewählt. Erwartet: Das Häkchen «Umlagefähig» wird entfernt, mit Begründung. Gesehen: Das Häkchen ist grau und gesperrt, darunter stehen «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.», «Nicht umlagefähige Kategorie» und der Text aus der Liste (Screenshot `05-neu-Gebäudeversicherung.png`). Dass das Häkchen gesperrt ist, sagt kein Text (P-1).
- Bearbeiten der umlagefähigen Rechnung «ewl Fernwärme Q4 2025», auf «Reparaturen» umgestellt. Erwartet: ein Hinweis, dass sich die Abrechnung damit ändert. Gesehen: dieselbe Begründung und der Status «Ungespeicherte Änderungen», aber kein Hinweis auf Abrechnungen, in denen die Rechnung schon enthalten ist (Screenshot `20-edit-Reparaturen.png`). Ich habe nicht gespeichert, deshalb weiss ich nicht, ob beim Speichern noch ein Hinweis käme.
- Bearbeiten der Boiler-Reparatur. Erwartet: nur die Begründung. Gesehen: zusätzlich der Hinweis zum Verteilschlüssel «Dwello verteilt sie … pro Wohnung», der zu «fliesst nicht ein» im Widerspruch zu stehen scheint (Screenshot `23-edit-bestehende-Reparatur.png`).

## Vorschläge

- **P-1:** Rechnung erfassen → Gebäude wählen → Kategorie «Reparaturen». Hilfreich wäre ein Satz direkt beim Häkchen, etwa: «Die Kategorie bestimmt, ob die Rechnung umlagefähig ist. Ist sie es nicht, wählen Sie eine andere Kategorie.» Er sollte dem Häkchen auch für Screenreader zugeordnet sein.
- **P-2:** Rechnung erfassen → Kategorie «Reparaturen». Hilfreich wäre ein Satz zur Abgrenzung, etwa: «Wartung und kleine Instandhaltung durch den Hauswart erfassen Sie unter der passenden umlagefähigen Kategorie. Enthält eine Rechnung beides, erfassen Sie die Anteile getrennt.» Weil die Begründung aus der Kategorienliste kommt, wäre der Satz dann auch dort sichtbar.

## Nicht geprüft

- **Eigene nicht umlagefähige Kategorie:** In den Demodaten gibt es keine. Alle 21 Kategorien tragen «Von Dwello», und der Filter «Nicht umlagefähig (9)» zeigt nur mitgelieferte. Um eine anzulegen, hätte ich unter «Kategorie erfassen» speichern müssen, und das verbietet mir die Aufgabe. Was das Formular bei einer eigenen Kategorie ohne Begründungstext zeigt, bleibt daher offen.
- Rechnungen hochladen (KI-Kategorisierung, z. B. eine Datei «… Reparatur»): Das war nicht Teil der Aufgabe und hätte gespeichert werden müssen.
- Speichern einer Umstellung auf eine nicht umlagefähige Kategorie und die Wirkung auf bestehende Abrechnungen: Ich habe nur angesehen.
- Andere Sprachen als Deutsch.
