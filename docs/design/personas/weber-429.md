# Persona-Review: Dr. Weber, Nebenkostenpauschale (#429)

Persona: Dr. Weber, 52, juristisch vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
App: Persona-Stack http://localhost:3300 (Demodaten). Gespeichert nur in «Seepark Residenz» (Mietvertrag Thomas Weber, Wohnung A1).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/weber-429/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten | Die Warnung «Pauschale und angekreuzte Nebenkosten» aus dem Assistenten fehlt hier. Ich habe CHF 50.00 Pauschale gespeichert, während alle 12 Nebenkosten angekreuzt blieben. Kein Hinweis, weder im Formular noch auf der Seite des Mietvertrags. Die nächste Abrechnung belastet damit dieselben Kosten doppelt: einmal über die Pauschale, einmal über die Abrechnung. |
| P-2 | Minor | Neuer Mietvertrag, Schritt «Miete», Hinweis «Kein Akonto» | «Sonst entfernen Sie unten … alle Häkchen» widerspricht dem nächsten Satz («Sind Nebenkosten ohne Akonto vereinbart, bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung») und auch der Pauschale-Warnung, nach der nur die Häkchen der von der Pauschale abgedeckten Nebenkosten wegfallen. Der Hinweis ändert sich nicht, wenn eine Pauschale schon eingetragen ist («tragen Sie zusätzlich … ein»). |
| P-3 | Minor | Hilfetext «Nebenkostenpauschale pro Monat» (Assistent und Bearbeiten) | Die Bemessungsregel aus VMWG Art. 4 Abs. 2 fehlt: Die Pauschale muss sich an den Durchschnittswerten dreier Jahre orientieren. Beim Bearbeiten eines laufenden Mietvertrags fehlt auch der Verweis auf das amtliche Formular (Art. 269d OR). Das Feld «Verwaltungspauschale» und der Text bei «Vereinbarte Nebenkosten» nennen das Formular, das Pauschale-Feld nicht. |
| P-4 | Nit | Neuer Mietvertrag, Warnung «Pauschale und angekreuzte Nebenkosten» | Die Warnung bleibt sichtbar, auch wenn ich die abgedeckten Nebenkosten (Hauswart, Kehricht) schon abgewählt habe. Das «trotzdem» klingt nach einem Fehler, obwohl die Eingabe korrekt ist. |

## Beobachtungen

- Die Seite des Mietvertrags zeigt nach dem Speichern: Nettomiete 1’200.00 + Akonto 200.00 + Nebenkostenpauschale 50.00 + Zusatzmiete 0.00 = Monatlich total CHF 1’450.00. Nachgerechnet, stimmt. Toast «Mietvertrag von Thomas Weber gespeichert».
- Die Seite der Wohnung A1 zeigt Nettomiete 1’200.00, Akonto 200.00, Nebenkostenpauschale 50.00, Monatlich total 1’450.00. Das stimmt auch. Die Zeile «Zusatzmiete» (0.00) fehlt dort, auf der Seite des Mietvertrags steht sie. Das ist uneinheitlich, aber nicht falsch.
- Abrechnung NK-22222222-2025-0001 (Entwurf), vorher und nachher gleich: Ihre Nebenkosten CHF 2’365.44, Geleistete Akontobeiträge − CHF 2’400.00 (12 × 200, stimmt), Saldo Rückerstattung CHF 34.60. Die Pauschale erscheint nirgends. Der PDF-Text ist vorher und nachher Zeichen für Zeichen gleich (pdftotext-Diff leer). Richtig so.
- Die Pauschale hat kein «gilt ab»: Nach dem Speichern gilt sie für den ganzen Mietvertrag seit 01.04.2022. Weil Dwello sie nicht abrechnet, ändert das keinen Betrag. «Monatlich total» stimmt für die Zeit vor der Vereinbarung aber nicht mehr. Der Kasten oben im Bearbeiten-Formular sagt dazu: «Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.» Das ist konsequent.
- Im Verlauf der Abrechnung wechselte «PDF erstellt» von 02:05 auf 02:07, nur weil ich das PDF heruntergeladen habe. Ein Download sieht so aus wie eine neue Erstellung.
- In der Schrittanzeige des Assistenten ist «Vertragsdauer» mitten im Wort umbrochen («Vertragsda / uer»), Screenshot 16.
- Rechtlich korrekt finde ich: «Dwello rechnet ihn nicht ab: keine Nachzahlung und keine Rückerstattung» (Pauschale, OR 257a/257b, VMWG Art. 4 Abs. 2). «Wird mit der Nebenkostenabrechnung verrechnet» (Akonto, VMWG Art. 4 Abs. 1). «Ein allgemeiner Satz wie «übrige Nebenkosten» genügt nicht» (OR 257a Abs. 2, besondere Vereinbarung). Der Hinweis «Keine Nebenkosten vereinbart» nach dem Abwählen aller Häkchen ist klar: «Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.»
- Im Schritt «Prüfen» stehen Akonto CHF 0.00, Nebenkostenpauschale CHF 150.00 und Monatlich total CHF 1’650.00 (1’500 + 150). Das stimmt.

## Aufgabe geschafft: ja

Pauschale eingetragen und gespeichert. Alle Prüfungen gemacht, der neue Mietvertrag wurde nicht gespeichert.

## Aufwand

Etwa 15 Minuten, 16 Skriptläufe. Für das eigentliche Eintragen 4 Schritte: Mietvertrag öffnen, «Bearbeiten», Betrag eintragen, «Änderungen speichern».

## Ablauf

1. **Mietvertrag öffnen.** Erwartet: Mietzins aufgeschlüsselt. Gesehen: Karte «Miete pro Monat» mit Nettomiete 1’200, Akonto 200, Nebenkostenpauschale 0.00, Zusatzmiete 0.00, total 1’400. Gut.
2. **Abrechnung 2025 als Ausgangswert notieren.** Saldo Rückerstattung CHF 34.60, Akonto 2’400.00. PDF gesichert.
3. **«Bearbeiten».** Erwartet: ein Feld für die Pauschale mit Erklärung. Gesehen: «Nebenkostenpauschale pro Monat (optional)» mit Hilfetext. Er verlangt, die abgedeckten Nebenkosten abzuwählen. Mein Auftrag nennt nicht, welche Nebenkosten die Pauschale abdeckt, deshalb habe ich keine abgewählt.
4. **50.00 eintragen.** Erwartet: «Monatlich total» geht auf 1’450, und eine Warnung, weil alle Häkchen gesetzt bleiben. Gesehen: Das Total ging auf 1’450.00, eine Warnung kam nicht (P-1).
5. **«Änderungen speichern».** Erwartet: Bestätigung. Gesehen: zurück auf der Seite des Mietvertrags, Toast «gespeichert», Werte wie oben.
6. **Wohnung A1.** Das Total stimmt, Beobachtungen oben.
7. **Abrechnung 2025.** Sie ist unverändert, auch das PDF. Erwartet und bestätigt.
8. **Gegenprobe Bearbeiten-Formular,** erneut geöffnet und Pauschale neu getippt: weiterhin keine Pauschale-Warnung. Leere ich das Akonto, erscheint «Kein Akonto». Danach abgebrochen, die gespeicherten Werte blieben.
9. **«Neuer Mietvertrag»:** Rosa Gerber, Wohnung B1 (Seepark Residenz, leer), Beginn 01.12.2026, unbefristet. Im Schritt «Miete» Nettomiete 1’500.00, kein Akonto. Der Hinweis «Kein Akonto» steht schon da, bevor ich etwas eintrage (Screenshot 16). Pauschale 150.00 eingetragen: Die Warnung «Pauschale und angekreuzte Nebenkosten» erscheint (Screenshot 18). Hauswart und Kehricht abgewählt: Die Warnung bleibt (P-4). Alle abgewählt: Die Warnung verschwindet, dafür erscheint «Keine Nebenkosten vereinbart». Heizung wieder angekreuzt, Verwaltungspauschale «Nein», «Weiter» zum Schritt «Prüfen»: Werte korrekt. Nicht gespeichert.

## Verwirrung

- Beim Bearbeiten fragte ich mich: Muss ich jetzt etwas abwählen, und was passiert, wenn nicht? Der Hilfetext sagt «Entfernen Sie …», aber nicht, was sonst passiert. Das sagt nur die Warnung im Assistenten («Dwello rechnet ihm trotzdem alle angekreuzten Nebenkosten ab»), und die fehlt beim Bearbeiten.
- «Kein Akonto»: Nach «Sonst entfernen Sie alle Häkchen» las ich zuerst, dass ohne Akonto grundsätzlich alle Häkchen weg müssen. Erst der übernächste Satz relativiert das. Mit eingetragener Pauschale lese ich zwei Anweisungen untereinander, «alle Häkchen» und «die Häkchen der abgedeckten Nebenkosten». Welche gilt?
- «Monatlich total» sagt nicht, ab wann der Betrag gilt (siehe «gilt ab» oben).

## Fehlerrisiken

- **Doppelbelastung (P-1):** Ein Verwalter trägt bei einem bestehenden Mietvertrag eine Pauschale ein, lässt die Häkchen stehen, und die nächste Abrechnung verrechnet die abgedeckten Kosten noch einmal. Der Mieter kann zu viel Bezahltes zurückfordern, das Vertrauen leidet.
- **Zu hohe Pauschale (P-3):** Ohne den Hinweis auf den Dreijahresdurchschnitt kann eine Pauschale angefochten werden.
- **Pauschale ohne Formular (P-3):** Wer eine Pauschale während der Mietdauer einseitig einführt, ohne amtliches Formular, macht sie nichtig (Art. 269d Abs. 2 und 3 OR). Der allgemeine Kasten oben im Formular spricht von «Mietzinserhöhung». Dass eine neue Pauschale eine ist, steht nicht beim Feld.

## Vorschläge

- **P-1:** Mietvertrag Thomas Weber > «Bearbeiten» > «Nebenkostenpauschale pro Monat» 50.00 eintragen, alle Nebenkosten angekreuzt lassen > «Änderungen speichern». Es kommt keine Warnung. Hilfreich wäre dieselbe Warnung wie im Assistenten, direkt unter dem Feld. Dazu ein Hinweis auf der Seite des Mietvertrags, wenn Pauschale und angekreuzte Nebenkosten zusammen bestehen, oder eine Rückfrage beim Speichern.
- **P-2:** Assistent > Schritt «Miete» > Akonto leer lassen, Pauschale 150.00 eintragen. Hilfreich wäre eine Reihenfolge nach Fällen: «Steht ein Akonto im Mietvertrag: eintragen. Deckt eine Pauschale alle Nebenkosten: Pauschale eintragen, alle Häkchen entfernen. Deckt sie nur einen Teil: nur diese Häkchen entfernen. Sind gar keine Nebenkosten vereinbart: alle Häkchen entfernen.» Mit eingetragener Pauschale sollte der Satz «Eine Nebenkostenpauschale tragen Sie zusätzlich … ein» wegfallen.
- **P-3:** Hilfetext des Feldes (beide Formulare) ergänzen: «Die Pauschale muss den Durchschnittskosten dreier Jahre entsprechen (Art. 4 Abs. 2 VMWG).» Beim Bearbeiten eines laufenden Mietvertrags zusätzlich: «Eine neue oder höhere Pauschale teilen Sie dem Mieter mit dem amtlichen Formular mit, frühestens auf den nächsten Kündigungstermin (Art. 269d OR).» Das wäre gleich formuliert wie bei der Verwaltungspauschale.
- **P-4:** Assistent > Pauschale 150.00 > Hauswart und Kehricht abwählen. Die Warnung bleibt. Hilfreich wäre eine neutrale Formulierung ohne «trotzdem», etwa: «Dwello rechnet die angekreuzten Nebenkosten ab, die Pauschale nicht. Prüfen Sie, dass keine angekreuzte Nebenkosten von der Pauschale gedeckt ist.»

## Nicht geprüft

- Eine neue Nebenkostenabrechnung nach der Änderung zu erstellen hätte gezeigt, ob alle 12 Nebenkosten mit der Pauschale gleichzeitig abgerechnet werden. Dafür hätte ich den Entwurf 2025 löschen oder einen neuen Abrechnungslauf in Seepark Residenz starten müssen, und das gehört nicht zum Auftrag. Belegt ist nur, dass der bestehende Entwurf unverändert bleibt.
- Wie die Pauschale im Mieter-PDF einer neuen Abrechnung oder auf einem QR-Einzahlungsschein erscheint: aus demselben Grund nicht geprüft.
- Andere Sprachen als Deutsch, mobile Ansicht und Tastaturbedienung gehören nicht zur Persona.
- Den neuen Mietvertrag (Rosa Gerber, B1) habe ich nicht gespeichert, wie beauftragt.
