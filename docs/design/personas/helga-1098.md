# Helga – #1098: Tankbestand bei Abrechnungsperiode «Juli – Juni»

Desktop 1440 × 900, Zoom 150 % (Gebäudeseite zusätzlich 200 %), Maus. Persona-App auf :3300 mit Demodaten. Gespeichert habe ich nur im neuen Gebäude «Lindenblick» (Lindenstrasse 7, 8400 Winterthur, ZH, Einfamilienhaus, Abrechnungsperiode «Juli – Juni»). Andere Gebäude habe ich nicht verändert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Gebäudeseite «Lindenblick», Abschnitt «Tankbestand» | Hilfetext und Feldbeispiel nennen denselben Tag (30.06.), aber verschiedene Jahre: Der Hilfetext rechnet mit «30.06.2025» und den Perioden 2024/25 und 2025/26, das Beispiel beim «Stichtag» zeigt «30.06.2027». Ich habe das Haus jetzt (November 2026) gekauft und wusste einen Moment lang nicht, ob ich 2025, 2026 oder 2027 eintragen soll. Keines der beiden Jahre passt zu meiner laufenden Periode 01.07.2026 – 30.06.2027 mit dem Anfangsbestand vom 30.06.2026. Wer das Beispiel abschreibt, erfasst 30.06.2027, einen Tag, der noch nicht gekommen ist, und Dwello speichert das ohne Hinweis (siehe Beobachtungen). |

## Beobachtungen

- **Antwort auf die Aufgabe:** Der Hilfetext sagt es deutlich: «am letzten Tag jeder Abrechnungsperiode, bei diesem Gebäude am 30.06.». Der Satz «Der Wert vom 30.06.2025 ist der Endbestand der Abrechnungsperiode 01.07.2024 – 30.06.2025 und der Anfangsbestand der Abrechnungsperiode 01.07.2025 – 30.06.2026» erklärt mir, wofür ein Wert zählt. Das Beispiel im Feld (30.06.2027) nennt denselben Tag. Hilfe und Beispiel stimmen also beim Tag überein, nur die Jahre sind verschieden (P-1). Gut finde ich auch den Satz «Lesen Sie erst Anfang Juli ab, erfassen Sie den Wert trotzdem per 30.06.»: Genau so würde ich es machen, nämlich erst Anfang Juli in den Keller gehen. Ja, ich würde den richtigen Tag erfassen, und zwar 30.06.2026.
- Das Gebäude speichert ohne Probleme. Die Rückmeldung lautet «Gebäude «Lindenblick» gespeichert», und auf der Gebäudeseite steht «Abrechnungsperiode: Juli – Juni». Die Hilfe beim Feld im Formular («Wählen Sie den, der in den Mietverträgen steht … Ab der ersten Abrechnung des Gebäudes bleibt er fest») war für mich verständlich.
- Der Hilfetext zum Tankbestand ist ein einziger langer Absatz von acht Zeilen. Bei 150 % musste ich ihn zweimal lesen. Die Berechnung des Werts (Menge mal Preis der letzten Lieferung) und die Regel zum Stichtag würde ich lieber getrennt sehen.
- Was tue ich als Käuferin mitten in der Periode? Ich habe das Haus erst nach dem 30.06.2026 übernommen. Den Bestand vom 30.06.2026 kenne ich nur, wenn die Hausverwaltung ihn mir gibt. Dazu sagt die Hilfe nichts.
- Ein falscher Tag wird nicht abgelehnt. Mein erster Versuch mit 01.07.2026 (so hätte ich es gemacht, wenn ich die Hilfe überlesen hätte) wurde mit «Bestand gespeichert.» angenommen, ohne Hinweis, dass der Tag nicht das Ende der Periode ist. Ebenso wurde 30.06.2027, ein Tag in der Zukunft, angenommen. Beide Einträge habe ich wieder gelöscht. Der Bestätigungsdialog beim Löschen erklärt die Folgen gut («… rechnen dann den Einkauf ab, nicht den Verbrauch …»).
- In der Liste steht nach dem Speichern nur «30.06.2026 Heizung CHF 2’650.00». Dass dieser Wert der Endbestand von 2025/26 und der Anfangsbestand von 2026/27 ist, muss ich mir selbst merken. Ein Zusatz in der Zeile würde mir die Kontrolle erleichtern.
- Bei 200 % Zoom bleibt alles lesbar. Das Beispiel beim Stichtag bricht auf zwei Zeilen um, und es gibt kein seitliches Scrollen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten und 7 Durchgänge (Gebäudeliste, Formular, Speichern, Gebäudeseite lesen, falscher Tag, Löschen und richtiger Tag, Gegenprobe mit dem Beispieldatum).

## Ablauf

- Klick auf das Kalendersymbol neben «Stichtag». Erwartet: ein Kalender, der beim Juni aufgeht. Gesehen: im Bildschirmfoto kein sichtbarer Kalender, das Feld blieb leer.
- Stichtag 01.07.2026 gespeichert. Erwartet: ein Hinweis, dass der Bestand am 30.06. erfasst wird. Gesehen: «Bestand gespeichert.» ohne Hinweis.
- Stichtag 30.06.2027 aus dem Beispiel gespeichert. Erwartet: ein Hinweis, dass der Tag noch nicht erreicht ist. Gesehen: gespeichert ohne Hinweis.
- Der erste Klick auf «Löschen» direkt nach dem Laden der Seite öffnete keinen Dialog. Nach dem vollständigen Laden ging es.

## Vorschläge

- **P-1:** So stellen Sie es nach: Gebäude mit «Juli – Juni» erfassen, die Gebäudeseite öffnen, den Hilfetext unter «Tankbestand» mit dem Beispiel beim «Stichtag» vergleichen. Hilfetext: 30.06.2025 und die Perioden 2024/25 und 2025/26. Feld: 30.06.2027. Mir würde helfen, wenn beide dasselbe Jahr nennen, am besten das Ende der zuletzt abgelaufenen Periode (heute 30.06.2026), oder wenn der Hilfetext sagt: «Für die laufende Periode 01.07.2026 – 30.06.2027 brauchen Sie den Wert vom 30.06.2026.»

## Nicht geprüft

- Den Kalender des Datumsfelds: Er öffnete sich im kopflosen Browser nicht sichtbar. Ich habe das Datum von Hand eingetippt.
- Wie der erfasste Bestand in einer Nebenkostenabrechnung wirkt: Das Gebäude hat keine Wohnungen und keine Rechnungen, und das gehörte nicht zur Aufgabe.
- Andere Abrechnungsperioden («November – Oktober», Kalenderjahr): nicht verlangt.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-1098/`
