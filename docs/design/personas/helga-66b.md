# Helga, Runde 66b: Mietvertrag mit Nebenkostenpauschale, Hinweis «Kein Akonto»

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Hinweis zusätzlich bei 200 %), Maus.
App: http://localhost:3300 (Persona-Stack, Deutsch, frische Demodaten). Nichts gespeichert, «Alpenblick» nicht angefasst.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/persona-helga/helga-66b/`.

Mein Vertrag (gedacht): Pierre Dubois, Wohnung 3.02 im Musterhaus Zentrum, ab 01.04.2027, Nettomiete CHF 1200, dazu jeden Monat fest CHF 150 Nebenkosten. Eine Nebenkostenabrechnung bekommt er nie.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Mietvertrag, Schritt 4 «Miete», Hinweis «Kein Akonto» | Der Hinweis sagt, ohne Akonto zahle der Mieter «meist eine Nebenkostenpauschale», aber er sagt nicht, wo ich den Betrag dieser Pauschale (bei mir CHF 150) eintrage. Ein Feld dafür gibt es nicht. Ich habe nur geraten: ins Feld «Akonto» (falsch, dann wäre es ein Vorschuss mit Abrechnung) oder ins Feld «Zusatzmiete» (dort steht als Beispiel aber «Garage, Parkplatz oder Keller»). |
| P-2 | Major | Schritt 4, «Vereinbarte Nebenkosten», nachdem alle Häkchen weg sind | Nachdem ich, wie der Hinweis sagt, alle Häkchen entfernt habe, erscheint eine gelbe Warnung mit Dreieck: «Keine Nebenkosten vereinbart … Stehen im unterschriebenen Mietvertrag Nebenkosten, kreuzen Sie sie an.» In meinem Vertrag stehen ja Nebenkosten, nämlich als Pauschale. Die Warnung sagt mir also das Gegenteil vom Hinweis oben. Ich hätte die Häkchen wahrscheinlich wieder gesetzt, und dann bekäme mein Mieter eine Nebenkostenabrechnung, obwohl er schon pauschal bezahlt. |
| P-3 | Minor | Schritt 4, Hinweis «Kein Akonto» | Das Wort «Nebenkostenpauschale» wird nirgends erklärt (was das ist, wie es sich vom Akonto unterscheidet). Der letzte Satz, «Sind Nebenkosten ohne Akonto vereinbart, bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung», hat mich verwirrt: Bei mir sind Nebenkosten ohne Akonto vereinbart, soll er also doch eine Abrechnung bekommen? Die drei Fälle (Akonto, Pauschale, gar keine Nebenkosten) stehen ineinander verschachtelt in einem Absatz. |
| P-4 | Minor | Schritt 4, «Vereinbarte Nebenkosten» | Der Text über den Häkchen sagt «Entfernen Sie das Häkchen bei jeder, die im unterschriebenen Mietvertrag nicht steht». Bei einer Pauschale stehen in meinem Vertrag aber oft genau diese Posten (Heizung, Wasser …) als «in der Pauschale enthalten». Nach diesem Text müsste ich sie also angekreuzt lassen. Nur der Hinweis weiter oben sagt «alle Häkchen entfernen»; der Text bei den Häkchen selbst erwähnt die Pauschale nicht. |
| P-5 | Nit | Schritt 4 | Zwölf Häkchen musste ich einzeln wegklicken; einen Knopf «Alle Häkchen entfernen» gibt es nicht. Zwischen dem Hinweis und den Häkchen liegt der lange Abschnitt «Verwaltungspauschale», so habe ich den Bezug fast verloren. |

## Beobachtungen

- Der Hinweis «Kein Akonto» steht sofort da, wenn das Feld leer ist, nicht erst nach dem Verlassen des Feldes. Mit einem Betrag im Akonto-Feld verschwindet er. Bei 200 % Zoom war er gut lesbar, mit Infozeichen und blauem Rand.
- Den Hinweis habe ich nicht als Fehler, sondern als Erklärung empfunden (blau, «i»), das ist gut. Die Warnung unten (gelb, Dreieck) wirkt dagegen so, als hätte ich etwas falsch gemacht.
- «Monatlich total» zählt nur Nettomiete, Akonto und Zusatzmiete. Hätte ich die CHF 150 weggelassen, stünde dort CHF 1’200.00, nicht der Betrag aus meinem Vertrag (CHF 1’350.00).
- In der Prüfseite (Schritt 5) steht «Akonto CHF 0.00», «Zusatzmiete CHF 150.00», «Vereinbarte Nebenkosten: Keine». Das Wort «Pauschale» kommt dort nicht vor; ich könnte später nicht mehr erkennen, dass die 150 meine Nebenkostenpauschale sind.
- Ab Schritt 2 gibt es keinen Knopf «Abbrechen» mehr, nur «Zurück», «Weiter» und den Brotkrümel «Mietverträge». Ich habe über den Brotkrümel abgebrochen. Als ich wieder «Neuer Mietvertrag» öffnete, kam «Angaben wiederhergestellt» mit «Angaben verwerfen»; das war verständlich.
- Pierre Dubois hat schon einen Mietvertrag; Schritt 2 hat mich darauf hingewiesen, verständlich formuliert.
- Der Abschnitt «Verwaltungspauschale» ist sehr lang und juristisch (Art. 269d OR). Zusammen mit «Nebenkostenpauschale» im Hinweis darüber sind das zwei «Pauschalen», die nichts miteinander zu tun haben; das habe ich erst beim zweiten Lesen verstanden.
- Gespeichert wurde nichts: Während des ganzen Ablaufs gab es keine Anfrage ausser GET.

## Aufgabe geschafft: teilweise

Bis zum Schritt «Miete» gekommen, Hinweis gelesen und ohne Speichern abgebrochen: ja. Gewusst, wie ich meinen Vertrag richtig erfasse: nein, nur geraten (Häkchen alle weg, CHF 150 in «Zusatzmiete»), und die Warnung danach hat mich wieder unsicher gemacht.

## Aufwand

Etwa 15 Minuten, rund 14 Schritte (Mieter, Wohnung, Datum, Nettomiete, Akonto ausprobieren und leeren, Zusatzmiete, Verwaltungspauschale, 12 Häkchen, Prüfen, Abbrechen über den Brotkrümel, Entwurf ansehen).

## Ablauf

1. Übersicht, «Mietvertrag erfassen». Erwartet: ein Formular. Gesehen: Assistent mit 5 Schritten, Schritt 1 «Mieter». Klar.
2. Mieter «Pierre Dubois, Zürich», Weiter. Erwartet: Wohnung wählen. Gesehen: Hinweis, dass er schon die Wohnung 2.01 mietet, verständlich. Wohnung 3.02 (Musterhaus Zentrum) gewählt.
3. Vertragsbeginn 01.04.2027 eingetippt, «Unbefristet» blieb gewählt. Klar.
4. Schritt 4 «Miete». Erwartet: Felder für Miete und Nebenkosten. Gesehen: Nettomiete, Akonto (optional), sofort der blaue Kasten «Kein Akonto», Zusatzmiete, Verwaltungspauschale, zwölf angekreuzte Häkchen «Vereinbarte Nebenkosten», «Monatlich total CHF 0.00» (Bild `05-miete-leer.png`).
5. Hinweis gelesen. Erwartet: «So tragen Sie eine Pauschale ein». Gesehen: die Pauschale wird erwähnt, aber wohin der Betrag gehört, steht nicht da. Verstanden habe ich nur «alle Häkchen entfernen».
6. Ausprobiert: CHF 150 ins Akonto. Der Hinweis verschwand, das Total war CHF 1’350.00. Erwartet: Dwello sagt mir, dass das bei einer Pauschale falsch ist. Gesehen: nichts. Wieder geleert, der Hinweis kam zurück.
7. CHF 150 in «Zusatzmiete» (aus Not), Verwaltungspauschale «Nein», alle zwölf Häkchen einzeln entfernt. Erwartet: Bestätigung, dass es jetzt stimmt. Gesehen: gelbe Warnung «Keine Nebenkosten vereinbart … Stehen im unterschriebenen Mietvertrag Nebenkosten, kreuzen Sie sie an.» (Bild `07-alle-haekchen-weg.png`). Da bin ich unsicher geworden.
8. Weiter zu «Prüfen». Gesehen: Akonto CHF 0.00, Zusatzmiete CHF 150.00, Vereinbarte Nebenkosten «Keine», Monatlich total CHF 1’350.00. Nicht gespeichert.
9. Abbrechen: kein «Abbrechen»-Knopf mehr, also Brotkrümel «Mietverträge». Danach wieder «Neuer Mietvertrag»: «Angaben wiederhergestellt» mit «Angaben verwerfen».

## Verwirrung

- «Nebenkostenpauschale»: Ich ahne, dass es «fester Betrag ohne Abrechnung» heisst, aber erklärt wird es nicht. Und wo trage ich den Betrag ein?
- «Sind Nebenkosten ohne Akonto vereinbart, bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung»: Bei einer Pauschale sind doch auch Nebenkosten ohne Akonto vereinbart?
- Die gelbe Warnung nach dem Entfernen der Häkchen: Habe ich jetzt etwas falsch gemacht?
- «Zusatzmiete» oder «Akonto» für die Pauschale? Keines passt laut seiner Erklärung.
- «Verwaltungspauschale» gleich daneben: noch eine Pauschale, die etwas ganz anderes meint.

## Fehlerrisiken

- Pauschale ins Feld «Akonto» und Häkchen lassen: Der Mieter bekommt eine Nebenkostenabrechnung mit Nachzahlung, obwohl sein Vertrag eine Pauschale hat.
- Häkchen entfernt, wegen der gelben Warnung aber wieder gesetzt: Dann bezahlt der Mieter die ganzen Nebenkosten mit der Abrechnung, zusätzlich zu seiner Pauschale.
- Pauschale gar nicht eingetragen: «Monatlich total» ist um CHF 150 zu tief, und nirgends steht, dass der Mieter Nebenkosten pauschal zahlt.
- Pauschale in «Zusatzmiete»: Später sieht niemand mehr, dass die 150 Nebenkosten sind und nicht eine Garage.

## Vorschläge

- **P-1** Reproduktion: Neuer Mietvertrag, beliebiger Mieter, Wohnung 3.02 (Musterhaus Zentrum), Beginn 01.04.2027, Weiter bis «Miete», Akonto leer lassen, Hinweis lesen. Hilfreich: im Hinweis ein Satz, wohin der Betrag der Pauschale gehört (oder ein eigenes Feld «Nebenkostenpauschale pro Monat», das ins Total zählt und auf der Prüfseite so heisst).
- **P-2** Reproduktion: wie P-1, dann alle zwölf Häkchen unter «Vereinbarte Nebenkosten» entfernen. Hilfreich: Die Meldung nennt den Fall Pauschale als richtigen Grund, etwa «Richtig, wenn der Mieter eine Nebenkostenpauschale bezahlt oder keine Nebenkosten vereinbart sind. Ist im Mietvertrag ein Akonto vereinbart, kreuzen Sie die Nebenkosten an.» und ist dann eine Information, keine Warnung.
- **P-3** Reproduktion: wie P-1. Hilfreich: «Nebenkostenpauschale» in einem Satz erklären («fester Betrag pro Monat, ohne Nebenkostenabrechnung») und die drei Fälle als kurze Liste statt in einem Absatz: Akonto: eintragen, Häkchen lassen. Pauschale: Häkchen entfernen. Nebenkosten ohne Akonto und ohne Pauschale: Häkchen lassen, alles kommt mit der Abrechnung.
- **P-4** Reproduktion: wie P-1, den Text über den Häkchen lesen. Hilfreich: dort ein Satz «Bezahlt der Mieter eine Nebenkostenpauschale, entfernen Sie alle Häkchen, auch wenn der Mietvertrag die Posten aufzählt.»
- **P-5** Reproduktion: wie P-2. Hilfreich: ein Knopf «Alle Häkchen entfernen», oder den Hinweis näher an die Häkchen rücken.

## Nicht geprüft

- Speichern und die spätere Nebenkostenabrechnung für einen solchen Vertrag (Auftrag: nur ansehen); ob Dwello die CHF 150 in «Zusatzmiete» irgendwo falsch verrechnet, weiss ich deshalb nicht.
- Andere Sprachen und das Handy (nicht meine Aufgabe, nicht mein Gerät).
- Ein Mieter ohne bestehenden Mietvertrag (ich habe Pierre Dubois genommen; der Hinweis in Schritt 2 war nicht Teil der Aufgabe).
