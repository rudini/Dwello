# Anna, 29: Abrechnung 2025 einer ausgezogenen Mieterin richtig zustellen (Runde w3c)

Persona: Anna, Desktop 1440 × 900, Maus; einen Bildschirm (Mietvertrag) zusätzlich auf dem Handy 390 × 844 angesehen.
App: Persona-Stack auf http://localhost:3300. Gespeichert nur in der Seepark Residenz.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/anna-w3c/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Abrechnung NK-22222222-2025-0002, PDF (auch «PDF ansehen» im Versand-Dialog) | Nachdem ich die neue Adresse eingetragen hatte (Bergstrasse 8, 8032 Zürich), steht im PDF weiterhin «Sarah Meier, Hirschmattstrasse 21, 6003 Luzern», im Adressfeld und auf dem Zahlteil unter «Zahlbar durch». Der Versand-Dialog zeigt aber «Per Brief, Bergstrasse 8, 8032 Zürich». Auch nach «Als versendet markieren» ist das PDF unverändert. Die Abrechnung kommt so nicht bei ihr an. |
| P-2 | Major | Abrechnung NK-22222222-2025-0002 (Entwurf) | Auf der Abrechnung selbst steht kein Hinweis, dass die Mieterin ausgezogen ist und ihre Adresse noch fehlt. Die Hauptschaltfläche ist «Als versendet markieren». Unter «Mieter und Wohnung» steht nur die E-Mail und darunter «Seeweg 15» (Adresse der Wohnung), nicht die Korrespondenzadresse. Wer direkt über «Entwürfe ansehen» hierher kommt, versendet an die falsche Adresse. |
| P-3 | Minor | Mieter Sarah Meier nach «Änderungen speichern» | Es kommt nur «Sarah Meier gespeichert». Es gibt keinen Weg zurück zur Abrechnung 2025 im Entwurf und keinen Hinweis, ob die Abrechnung die neue Adresse jetzt übernommen hat. |
| P-4 | Minor | Mietvertrag von Sarah Meier | Ein gelber Warnkasten «3 Abrechnungen fehlen» bietet «2023 / 2022 / 2021 abrechnen» an. Ich wollte nur 2025 erledigen und habe mich gefragt, ob ich vorher drei alte Jahre nachholen muss. Er steht prominenter als der eigentliche nächste Schritt. Nachdem ich die Adresse gespeichert hatte, ist er der einzige Kasten oben. |
| P-5 | Nit | Mietvertrag, Vertragsdauer | «Unbefristet, gekündigt auf den 30.06.2025» neben dem Badge «Beendet»: «Unbefristet» und «Beendet» zusammen haben mich kurz verwirrt. |

## Beobachtungen

- Die Übersicht hat mir sehr geholfen: Die Karte «Neue Adresse eintragen – Sarah Meier ist ausgezogen. Die Adresse ist noch die der Wohnung» führt direkt ins Formular. Nach dem Speichern ist die Karte weg.
- Der Mietvertrag hat oben «Nächste Schritte: Bitten Sie Sarah Meier um die neue Adresse … Dorthin geht die Nebenkostenabrechnung». Das ist genau die Erklärung, die ich brauchte. Nach dem Speichern verschwindet sie.
- Im Formular «Mieter bearbeiten» erklärt der Hilfetext bei «Korrespondenzadresse», wozu sie dient («nach dem Auszug die neue Adresse eintragen»). Das ist gut. Dass dort vor meiner Änderung «Seeweg 15, 6003 Luzern» stand, also die Adresse der Wohnung, war richtig erkannt.
- Das PDF zeigte schon **vor** meiner Änderung eine dritte Adresse (Hirschmattstrasse 21, 6003 Luzern). Die stand nirgends in der App, weder beim Mieter (Seeweg 15) noch im Vertrag. Woher sie kommt, kann ich nicht sagen.
- Der Versand-Dialog ist gut gemacht: Er nennt Empfänger und Kanal und sagt, dass Dwello die Abrechnung auf den Versandtag datiert. Gerade deshalb glaube ich ihm, und das PDF widerspricht ihm (P-1).
- Die Mietstage (181, 01.01.–30.06.2025) und die Akontobeiträge (6 × CHF 220 = CHF 1’320) passen zum Vertrag.
- Der Mietvertrag ist auf 390 px ohne seitliches Scrollen lesbar.
- Der Verlauf zeigt «Erstellt 17.10.2026, 00:58 / PDF erstellt 17.10.2026, 00:58 / Versendet 17.10.2026». Dass das PDF nach der Adressänderung nicht neu erstellt wurde, sieht man nur an dieser Uhrzeit.

## Aufgabe geschafft: teilweise

Die neue Adresse ist eingetragen, und die Abrechnung ist als versendet markiert. Die Abrechnung, die ich ausdrucken würde, trägt aber eine falsche Adresse (P-1). «Richtig bei ihr ankommen» habe ich mit Dwello nicht geschafft.

## Aufwand

Etwa 15 Minuten, rund 14 Schritte: Übersicht, Mieter bearbeiten (angesehen), Mieter-Detail, Mietvertrag, Abrechnungen des Vertrags, Abrechnung 2025, PDF, Adresse speichern, Mietvertrag/Übersicht/Abrechnung/PDF erneut prüfen, «Frist und Bemerkungen» speichern, PDF erneut, Versand-Dialog mit PDF, als versendet markieren, PDF erneut.

## Ablauf

1. **Übersicht.** Erwartet: irgendwo steht, was zu tun ist. Gesehen: «Als Nächstes zu tun» mit drei Karten, darunter «Neue Adresse eintragen – Sarah Meier ist ausgezogen …». Sehr hilfreich.
2. **Karte «Neue Adresse eintragen».** Erwartet: ein Formular. Gesehen: «Mieter bearbeiten» mit «Korrespondenzadresse», darin Seeweg 15, 6003 Luzern. Ich habe noch nicht gespeichert, weil ich mir zuerst den Vertrag ansehen wollte.
3. **Mieter-Detail.** Gesehen: Korrespondenzadresse Seeweg 15, Vertrag «Wohnung A2, Beendet, 01.08.2021 – 30.06.2025, gekündigt». Einen Hinweis, dass die Adresse veraltet ist, gibt es hier nicht.
4. **Mietvertrag.** Erwartet: Auszugsdatum. Gesehen: «Nächste Schritte: Bitten Sie Sarah Meier um die neue Adresse …» und den gelben Kasten «3 Abrechnungen fehlen» für 2021–2023 (P-4). Vertragsende «Unbefristet, gekündigt auf den 30.06.2025» (P-5). Die Korrespondenzadresse zeigt der Vertrag nicht.
5. **Dazu gehört → Nebenkostenabrechnungen.** Gesehen: zwei Abrechnungen, 2025 Entwurf (CHF 138.00 Nachzahlung, 181 Mietstage) und 2024 bezahlt.
6. **Abrechnung 2025.** Erwartet: einen Hinweis auf die fehlende Adresse. Gesehen: kein Hinweis, die Hauptaktion ist «Als versendet markieren» (P-2).
7. **PDF vorher.** Gesehen: Empfänger «Hirschmattstrasse 21, 6003 Luzern», also weder Wohnungs- noch neue Adresse.
8. **Adresse speichern** (über «Neue Adresse eintragen» im Vertrag): Bergstrasse 8, 8032 Zürich. Gesehen: Mieter-Detail mit neuer Adresse, Meldung «Sarah Meier gespeichert». Ein Weg zur Abrechnung fehlt (P-3). Übersicht und Vertrag zeigen den Adress-Hinweis nicht mehr.
9. **PDF nachher** (über «PDF herunterladen» und die API-Adresse). Erwartet: Bergstrasse 8. Gesehen: weiterhin Hirschmattstrasse 21 (P-1).
10. **Versuch 2: «Frist und Bemerkungen bearbeiten» → «Änderungen speichern»**, in der Hoffnung, dass das PDF neu erstellt wird. Gesehen: Der Verlauf bleibt bei «PDF erstellt 00:58», das PDF ist unverändert.
11. **Versuch 3: Entwurf löschen und neu erstellen**, so wie es der Hinweis auf der Bearbeiten-Seite für Korrekturen vorschlägt. Der Bestätigungsdialog («… wird gelöscht. Das lässt sich nicht rückgängig machen.») erschien. Das Löschen selbst wurde mir in dieser Umgebung nicht erlaubt (siehe «Nicht geprüft»).
12. **Als versendet markieren.** Gesehen: Der Dialog nennt «Per Brief, Bergstrasse 8, 8032 Zürich». «PDF ansehen» liefert aber wieder Hirschmattstrasse 21. Nach dem Bestätigen: Status «Versendet», Meldung «Abrechnung als versendet markiert», Verlauf «Versendet 17.10.2026». Das PDF ist weiterhin mit der alten Adresse, auch auf dem QR-Zahlteil.

## Verwirrung

- Drei Adressen für eine Person: Seeweg 15 (Mieter vorher), Hirschmattstrasse 21 (PDF), Bergstrasse 8 (meine Eingabe, Versand-Dialog). Welche gilt?
- «Mieter und Wohnung» auf der Abrechnung zeigt «Seeweg 15» unter der Wohnung. Ich habe kurz geglaubt, das sei die Adresse, an die die Abrechnung geht.
- «3 Abrechnungen fehlen» (2021–2023): Muss ich die zuerst machen? Kann ich 2025 trotzdem versenden?
- «Unbefristet, gekündigt auf den …» zusammen mit «Beendet».
- «Verwaltungspauschale: Vereinbart, Satz des Abrechnungslaufs»: Was ist ein «Abrechnungslauf»?

## Fehlerrisiken

- Ein Brief mit alter Adresse und falscher «Zahlbar durch»-Adresse auf dem QR-Zahlteil geht hinaus, obwohl Dwello im Dialog die richtige Adresse bestätigt (P-1).
- Wer die Abrechnung direkt aus der Entwurfsliste öffnet, sieht nichts vom Auszug und markiert sie sofort als versendet (P-2).
- Die Zahlungsfrist läuft ab dem Versandtag. Wenn der Brief nicht ankommt, verstreicht sie, ohne dass die Mieterin davon weiss.

## Vorschläge

- **P-1:** Mieter Sarah Meier → Bearbeiten → neue Korrespondenzadresse speichern → Abrechnung NK-22222222-2025-0002 → «PDF herunterladen»: Das PDF zeigt die alte Adresse, der Dialog «Als versendet markieren» die neue. Hilfreich wäre, wenn ein Entwurf die aktuelle Korrespondenzadresse übernimmt oder das PDF neu erstellt wird, oder zumindest ein Hinweis «Die Adresse hat sich geändert, PDF neu erstellen». Dialog und PDF müssen dieselbe Adresse zeigen.
- **P-2:** Übersicht → «Entwürfe ansehen» → Abrechnung von Sarah Meier (vor dem Eintragen der Adresse): Hilfreich wäre derselbe Hinweis wie auf dem Mietvertrag («Sarah Meier ist ausgezogen … Neue Adresse eintragen») direkt auf der Abrechnung und im Versand-Dialog, sowie die Korrespondenzadresse unter «Mieter und Wohnung».
- **P-3:** Mietvertrag → «Neue Adresse eintragen» → speichern: Die Bestätigung könnte sagen «Die Abrechnung 2025 geht jetzt an diese Adresse» und auf den Entwurf verlinken.
- **P-4:** Mietvertrag von Sarah Meier: Der Kasten «3 Abrechnungen fehlen» sollte sagen, ob diese Jahre die Abrechnung 2025 betreffen. Wäre er nur ein Hinweis statt einer Warnung, würde er weniger ablenken.
- **P-5:** Mietvertrag, Vertragsdauer: zum Beispiel «Gekündigt auf den 30.06.2025 (war unbefristet)».

## Nicht geprüft

- Entwurf löschen und die Abrechnungen der Seepark Residenz 2025 neu erstellen, um zu sehen, ob das neue PDF die neue Adresse trägt. Das Löschen wurde in dieser Umgebung durch die Berechtigungsprüfung abgelehnt. Ich habe es nicht auf anderem Weg versucht.
- Ob Dwello das PDF beim Versand per E-Mail anders erzeugt: Sarah Meier ist auf «Per Brief» eingestellt, und ich habe den Kanal nicht geändert.
- Andere Sprachen und der Dunkelmodus.
- Die Abrechnung und das Formular auf dem Handy; auf dem Handy nur den Mietvertrag geprüft.
