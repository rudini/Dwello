# Helga – Slice 506: offenen Übertrag ausgleichen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Gebäude: Musterhaus Zentrum, nur die Abrechnung NK-11111111-2024-0003 von Pierre Dubois gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung NK-11111111-2024-0003, Karte «Zahlung» | Die Karte sagt nur «Der Übertrag ist noch offen. Keine Abrechnung verrechnet ihn mehr.» Sie nennt weder Betrag noch Richtung (Pierre schuldet mir CHF 3.00). Was «der Übertrag» ist, muss ich mir aus der Übersicht merken oder aus der Zeile «Saldo: Nachzahlung CHF 3.00» darüber erraten; das Wort wird nirgends erklärt. |
| P-2 | Minor | Übersicht, Aufgabe «Übertrag ausgleichen», und Karte «Zahlung» | «Keine Abrechnung verrechnet ihn mehr.» verstehe ich nicht. Warum nicht? Dass es daran liegt, dass der Mietvertrag von Pierre am 31.12.2024 geendet hat, steht nirgends. «verrechnen» ist für mich ein Buchhalterwort. |
| P-3 | Minor | Abrechnung, Karte «Zahlung» nach dem Speichern | Danach steht nur «Übertrag von Hand ausgeglichen am 28.10.2026.» Ob ich die CHF 3.00 bekommen oder darauf verzichtet habe, hält Dwello nicht fest, obwohl die Bestätigung genau das gefragt hat. In einem Jahr weiss ich nicht mehr, ob Pierre bezahlt hat. Im «Verlauf» unten auf der Seite erscheint auch kein Eintrag. |

## Beobachtungen

- Die Aufgabe auf der Übersicht ist leicht zu finden: eigene Karte mit dem Titel «Übertrag ausgleichen» und einem klaren Knopf «Abrechnung öffnen». Der Text sagt, was ich im echten Leben tun soll: «Fordern Sie den Betrag beim Mieter ein oder verzichten Sie darauf». Das habe ich verstanden.
- «ausgleichen» / «ausgeglichen» verstehe ich im Zusammenhang («die Sache ist erledigt, es ist nichts mehr offen»). «verzichten» ist klar.
- Die Bestätigung ist gut: Die Frage «Haben Sie die Nachzahlung erhalten, oder verzichten Sie darauf?» passt genau zu meinem Fall (bar bekommen), und «Das lässt sich nicht rückgängig machen.» macht mich vorsichtig, aber nicht ängstlich. Grosse Knöpfe, «Abbrechen» links, die Hauptaktion rechts und dunkel.
- Nach dem Speichern: grüne Meldung «Der Übertrag ist als ausgeglichen markiert.» unten rechts, der Knopf ist weg, auf der Übersicht ist die Aufgabe verschwunden. Ich weiss, dass es geklappt hat.
- Der Status oben heisst schon vorher «Erledigt», obwohl noch CHF 3.00 offen sind. Das hat mich kurz verwirrt: Was ist erledigt, wenn ich noch etwas tun muss?
- Die Kostenaufstellung rechnet CHF 3’226.50 − CHF 3’240.00, das wäre ein Guthaben von CHF 13.50, darunter steht aber «Saldo: Nachzahlung CHF 3.00». Das kommt vom vorbereiteten Testzustand (SQL des Aufrufers) und ist kein Befund dieser Änderung; eine echte Helga würde hier aber stutzen.
- Wegen desselben SQL steht auf der Übersicht auch «Befristeten Mietvertrag prüfen» für Pierre Dubois; die Karte steht direkt über «Übertrag ausgleichen» und lenkt etwas ab, gehört aber nicht zur Änderung.
- Die Karte «Zahlung» liegt mitten auf einer langen Seite (nach der grossen Kostentabelle); ich musste weit scrollen, um den Knopf zu finden. Der Link aus der Übersicht springt nicht dorthin.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 5 Schritte: Übersicht lesen → «Abrechnung öffnen» → zur Karte «Zahlung» scrollen → «Als ausgeglichen markieren» → in der Bestätigung «Als ausgeglichen markieren» → zurück zur Übersicht.

## Ablauf

- Abrechnung geöffnet. Erwartet: oben ein Hinweis «Hier fehlen noch CHF 3.00 von Pierre» mit dem Knopf. Gesehen: die Seite beginnt mit der langen Kostenaufstellung, der Knopf kommt erst nach einigem Scrollen in der Karte «Zahlung», ohne Betrag (Screenshot 05: «Zahlung», Satz «Der Übertrag ist noch offen. Keine Abrechnung verrechnet ihn mehr.», umrandeter Knopf mit Haken «Als ausgeglichen markieren»).
- Nach dem Speichern. Erwartet: «Nachzahlung CHF 3.00 erhalten am 28.10.2026» oder Ähnliches. Gesehen: «Übertrag von Hand ausgeglichen am 28.10.2026.» (Screenshot 07); «von Hand» sagt mir nicht, ob ich Geld bekommen habe.

## Vorschläge

- **P-1:** Übersicht → «Abrechnung öffnen» → zur Karte «Zahlung» scrollen. Hilfreich wäre ein Satz mit Betrag und Richtung, z. B. «Pierre Dubois schuldet Ihnen noch CHF 3.00 (Nachzahlung).», und eine kurze sichtbare Erklärung, was ein Übertrag ist (ein offener Betrag, der sonst mit der nächsten Abrechnung verrechnet würde).
- **P-2:** Übersicht, Karte «Übertrag ausgleichen» lesen; ebenso die Karte «Zahlung». Den Grund nennen statt «Keine Abrechnung verrechnet ihn mehr.», z. B. «Der Mietvertrag ist beendet, darum kommt keine weitere Abrechnung, die den Betrag aufnimmt.»
- **P-3:** In der Bestätigung «Als ausgeglichen markieren» wählen, dann Karte «Zahlung» und «Verlauf» ansehen. Hilfreich wäre, dass ich in der Bestätigung «Betrag erhalten» oder «Darauf verzichten» wähle und Dwello das danach so anzeigt, z. B. «Nachzahlung CHF 3.00 am 28.10.2026 erhalten.», und dass der Schritt im «Verlauf» erscheint.

## Nicht geprüft

- 200 % Zoom: Die Aufgabe liess sich nur einmal speichern; danach gibt es die Karte auf der Übersicht und die Bestätigung nicht mehr. Geprüft habe ich nur 150 %.
- Den Fall Guthaben (ich schulde dem Mieter etwas) und den Weg «verzichten»: Im Testzustand gab es nur die Nachzahlung von Pierre Dubois, und gespeichert habe ich wie vorgegeben als «bar erhalten».
- Ob das PDF der Abrechnung danach etwas anderes zeigt: nicht angesehen, gehört nicht zur Aufgabe.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-506/` (01 Übersicht vorher, 04 Bestätigung, 05 Karte «Zahlung» vorher, 06 Meldung nach dem Speichern, 07 Karte «Zahlung» danach, 08 Übersicht danach).
