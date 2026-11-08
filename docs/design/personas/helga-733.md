# Helga – Slice 733: Bestätigung nach dem Löschen eines Entwurfs, danach neu nach Gebäude filtern

Profil: Helga, 68, Maus. Desktop 1440 × 900, einmal mit 140 % Zoom (1029 × 643 CSS-Pixel), einmal mit 150 % (960 × 600). Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/04a2037b-5aaf-5898-9174-6567fbe60dbc/scratchpad/helga-733/`.

Gelöschte Entwürfe (alle aus den Demodaten, Löschen war meine Aufgabe): NK-22222222-2025-0004 (Marco Bernasconi), NK-11111111-2025-0002 (Anna Schmidt), NK-22222222-2025-0003 (Nina Brunner), NK-11111111-2025-0003 (Pierre Dubois), NK-11111111-2025-0004 (Maria Rossi), NK-22222222-2025-0002 (Sarah Meier). Mehr als zwei, weil mein erster Durchgang bei 140 % zu schnell war (die Meldung kam erst nach meinem Filtern) und ich bei 150 % nachprüfen wollte, was ich gesehen hatte.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Nebenkostenabrechnungen, Liste, 150 % | Die Bestätigung «Abrechnung NK-… gelöscht» liegt unten rechts genau über dem Knopf «Suchen». Ich wähle im Feld «Gebäude» das andere Gebäude und klicke auf «Suchen»: der Klick landet in der Meldung, es passiert nichts, und das Gebäude-Feld verliert sogar den Fokus. Solange meine Maus dort liegen bleibt, geht die Meldung nicht weg (über 15 Sekunden gewartet). Erst als ich die Maus wegbewegte, verschwand sie nach etwa 8 Sekunden; dann ging «Suchen». |
| P-2 | Minor | Nebenkostenabrechnungen, Liste, 140 % | Die Bestätigung springt: zuerst steht sie unten rechts und deckt das Ende von «Gebäude», den unteren Rand von «Suchen» und «Filter zurücksetzen» ganz zu; sobald ich ins Gebäude-Feld klicke, springt sie nach oben rechts über den Kopf der Seite. Das Feld selbst bleibt frei, aber ich habe kurz gestutzt, weil sich neben meiner Hand etwas bewegt hat. |

## Beobachtungen

- **Gebäude-Feld bei 140 % zusammengequetscht:** Das Auswahlfeld «Gebäude» ist nur etwa 70 Pixel breit und zeigt vom gewählten Gebäude nur «Se» oder «M». Ich konnte nicht lesen, welches Gebäude gerade gewählt ist; ich habe es nur am Ergebnis der Liste erraten. Bei 150 % ist das Feld breit und lesbar (die Seite hat dort ein anderes Layout mit Menü-Knopf oben links).
- **«Filter aufheben» ragt aus der Kachel:** Bei 140 % steht im Kästchen «Entwurf» der Text «Filter aufheben», und das «n» von «aufheben» ragt über den Rand hinaus.
- **Gebäude wählen allein filtert nicht:** Nach der Auswahl im Feld «Gebäude» bleibt die Liste gleich (7 Abrechnungen), erst «Suchen» filtert. Ich hätte erwartet, dass die Auswahl gleich wirkt; mit dem Knopf daneben ging es aber.
- **Die Bestätigung kommt etwas verzögert:** Nach dem Löschen bin ich zurück auf der gefilterten Liste, und die Meldung erscheint erst etwa eine halbe Sekunde später. Im ersten, sehr schnellen Durchgang bei 140 % hatte ich schon neu gefiltert, bevor sie kam; sie erschien dann auf der neuen Liste.
- **Die Bestätigung nennt nur die Nummer:** «Abrechnung NK-22222222-2025-0003 gelöscht». Die Rückfrage vorher nannte auch den Mieter («… von Nina Brunner»); in der Meldung hätte mir der Name mehr gesagt als die lange Nummer.
- **Was die Entscheidung erfüllt:** Die Meldung hat ein deutliches Kreuz zum Schliessen, geht von selbst weg (wenn die Maus nicht darauf liegt) und deckt das Feld, das gerade den Fokus hat, nie zu: bei 140 % weicht sie nach oben aus, bei 150 % liegt das Gebäude-Feld links daneben frei. Nach dem Zurückkommen steht der Fokus auf der Überschrift «Nebenkostenabrechnungen», die nicht verdeckt ist.
- Die Rückfrage «Abrechnung löschen» ist klar: «Die Abrechnung NK-… von … wird gelöscht. Das lässt sich nicht rückgängig machen.» Nach dem Löschen bleibe ich in der gefilterten Liste (Entwurf + Gebäude), die Zahl bei «Entwurf» sinkt um eins. Das fand ich gut.
- Bei 150 % mit leerer Liste (alle Entwürfe des Gebäudes gelöscht) ist das Formular breiter, «Suchen» rückt nach rechts, und die Meldung springt beim Klick ins Gebäude-Feld nach oben; dort hat sie nichts verdeckt.

## Aufgabe geschafft: ja

Beide Durchgänge kamen ans Ziel; bei 150 % aber erst, nachdem ich die Maus von der Meldung weggenommen und gewartet hatte (P-1).

## Aufwand

Etwa 25 Minuten, 6 Löschvorgänge in 6 Durchgängen (je etwa 8 Schritte: Liste, «Entwurf», Gebäude wählen, «Suchen», Entwurf öffnen, «Abrechnung löschen», bestätigen, anderes Gebäude wählen und «Suchen»). Bei 150 % kostete das Neufiltern etwa 20 Sekunden statt 2.

## Ablauf

- 140 %, Gebäude gewählt (Liste ungefiltert): erwartet, dass die Liste sich gleich auf Seepark Residenz beschränkt; gesehen: 7 Abrechnungen bleiben, erst «Suchen» filtert.
- 140 %, Gebäude-Feld: erwartet, den Namen des gewählten Gebäudes zu lesen; gesehen: nur «Se» bzw. «M».
- 140 %, nach dem Löschen (erster, schneller Durchgang): erwartet, die Bestätigung sofort zu sehen; gesehen: noch keine Meldung, sie erschien erst nach meinem Neufiltern auf der neuen Liste.
- 140 %, zweiter Durchgang, Bestätigung da: erwartet, dass sie in einer Ecke liegt, wo nichts ist; gesehen: unten rechts über «Filter zurücksetzen» und dem unteren Rand von «Suchen» (Bild `s140-a-bestaetigung.png`). Beim Klick ins Gebäude-Feld sprang sie nach oben rechts (`s140-b-auswahl.png`); «Suchen» ging dann, und nach dem Filtern lag sie wieder unten rechts über einem Teil der ersten Zeile (`s140-c-nach-klick.png`).
- 150 %, Bestätigung da, Musterhaus Zentrum gewählt, Klick auf «Suchen»: erwartet, dass die Liste auf Seepark Residenz wechselt; gesehen: nichts passiert, die Meldung liegt über dem Knopf, nur ein schmaler linker Rand von «Suchen» schaut hervor (`s150-c-nach-klick.png`, `u150-c2-maus-bleibt.png`). Der Fokus war danach nicht mehr im Gebäude-Feld.
- 150 %, Maus bleibt auf der Stelle: erwartet, dass die Meldung nach einigen Sekunden von selbst geht; gesehen: nach 10 und auch nach 15 Sekunden noch da. Erst nach dem Wegbewegen der Maus verschwand sie nach etwa 8 Sekunden, danach klappte «Suchen».

## Vorschläge

- **P-1:** Zoom 150 % (960 × 600), «Nebenkostenabrechnungen» → «Entwurf» → Gebäude «Seepark Residenz» → «Suchen» → einen Entwurf öffnen → «Abrechnung löschen» → bestätigen. Zurück auf der Liste (es bleibt noch mindestens ein Entwurf stehen) im Feld «Gebäude» «Musterhaus Zentrum» wählen und mitten auf «Suchen» klicken. Die Meldung liegt über «Suchen» und schluckt den Klick; solange die Maus darauf ruht, bleibt sie. Hilfreich wäre: die Meldung nicht über den Knopf legen, der zum gerade bedienten Feld gehört (oder überhaupt nicht über die Bedienelemente des Suchformulars), etwa oben rechts wie bei 140 %, oder unterhalb des Formulars. Wenn sie dort liegen bleiben muss: ein Klick in die Meldung sollte sie schliessen, statt sie festzuhalten.
- **P-2:** Zoom 140 % (1029 × 643), gleiche Schritte, nach dem Löschen ins Feld «Gebäude» klicken: die Meldung springt von unten nach oben. Ruhiger wäre ein fester Platz, der das Suchformular nie berührt (z. B. gleich von Anfang an oben rechts).

## Nicht geprüft

- Tastaturbedienung und Bildschirmleser: nicht Helgas Art zu arbeiten; ich habe nur geprüft, wohin der Fokus nach dem Löschen geht (Überschrift) und nach dem Klick in die Meldung (aus dem Feld heraus auf die Seite).
- Dunkler Modus und andere Sprachen: nicht Teil der Aufgabe.
- Die Meldung bei einem fehlgeschlagenen Löschen: keine Anfrage zum Fehlschlagen genannt.
- Ob die Meldung beim Darüberfahren absichtlich stehen bleibt: das kann ich als Nutzerin nicht sehen; ich beschreibe nur, dass sie bei ruhender Maus nicht verschwand und nach dem Wegbewegen nach etwa 8 Sekunden ging.
