# Helga – Teilzahlung erfassen (#959)

Persona: Helga, 68, Desktop 1440 × 900, Zoom 150 % (Dialog auch bei 200 %), Maus.
Aufgabe: Hans Müller (Musterhaus Zentrum) hat für NK-11111111-2025-0001 heute CHF 50.00 bezahlt. Zahlung erfassen, danach prüfen, ob Dwello Bezahltes und Offenes zeigt (Abrechnung und Liste) und ob ich für den Rest noch mahnen kann.
Skripte und Bildschirmfotos: `/tmp/helga-959/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-11111111-2025-0001, «Mahnung senden» (Dialog) | Nach meiner Teilzahlung sagt der Mahnungs-Dialog «Hans Müller schuldet noch CHF 215.80.» Er schuldet aber nur noch CHF 165.80 (so steht es im Kasten «Zahlung», in der Liste und auf der Übersicht). Ich würde ihn um den vollen Betrag mahnen und ihm damit Unrecht tun. |
| P-2 | Major | Abrechnung, Meldung nach «Teilzahlung festhalten» | Nach dem Speichern von CHF 50.00 erscheint die Meldung «Abrechnung als bezahlt markiert». Das stimmt nicht: Die Abrechnung bleibt «Überfällig» mit CHF 165.80 offen. Ich hätte fast geglaubt, ich hätte die ganze Abrechnung erledigt. |
| P-3 | Minor | Dialog «Abrechnung als bezahlt markieren» | Titel und Satz «Danach können Sie keine Mahnung mehr senden.» stehen auch dann über dem Dialog, wenn ich nur einen Teil eintragen will. Erst nach dem Eintippen von 50 verschwindet der Satz und der Knopf heisst «Teilzahlung festhalten»; der Titel bleibt «als bezahlt markieren». Beim ersten Blick dachte ich, das sei der falsche Knopf für meine Aufgabe, und wäre beinahe nicht weitergegangen. |
| P-4 | Minor | Dialog bei 150 % und 200 % Zoom | Der Dialog öffnet sich schon nach unten gescrollt. Bei 150 % fehlt der Titel (73 px weggescrollt), bei 200 % sehe ich weder Titel noch Warnsatz noch das Datumsfeld «Bezahlt am», nur das Datum darunter und den Betrag. Das Datum kontrolliere ich so leicht nicht. |
| P-5 | Minor | Dialog «Abrechnung als bezahlt markieren», zweites Öffnen nach der Teilzahlung | Im grauen Kasten steht jetzt «Hans Müller: Nachzahlung CHF 165.80». Die Nachzahlung war aber CHF 215.80; 165.80 ist der Rest. Dass schon CHF 50.00 eingegangen sind, steht im Dialog nirgends. |
| P-6 | Minor | Dialog, nach Eintippen eines kleineren Betrags | Der Dialog zeigt nicht, was danach offen bleibt (hier CHF 165.80). Der Hilfetext sagt nur «Die Abrechnung bleibt dann mit dem Rest offen.» Ich musste selber rechnen, ob ich mich nicht vertippt habe. |

## Beobachtungen

- Der Hilfetext beim Betrag ist gut verständlich: «Hat der Mieter erst einen Teil überwiesen, geben Sie diesen Betrag ein. Die Abrechnung bleibt dann mit dem Rest offen.» Genau das wollte ich wissen.
- Dass der Knopf zu «Teilzahlung festhalten» wechselt, sobald der Betrag kleiner ist, hat mich beruhigt. Das Wort «Teilzahlung» verstehe ich.
- «Bezahlt am» mit Hilfetext, Format und Wochentag («Samstag, 31. Oktober 2026») darunter: klar.
- Nach dem Speichern zeigt die Abrechnung im Kasten «Zahlung»: «Bezahlt: CHF 50.00, offen: CHF 165.80». Das steht aber weit unten auf der Seite, unter der langen Kostenaufstellung; oben beim Status «Überfällig» steht nichts davon.
- Liste der Nebenkostenabrechnungen und Filter «Überfällig»: Zeile Hans Müller zeigt «Nachzahlung CHF 215.80  Bezahlt: CHF 50.00, offen: CHF 165.80». Gut.
- Übersicht: «Überfällige Beträge CHF 165.80» (vorher 215.80). Stimmt.
- Im «Verlauf» der Abrechnung erscheint meine Zahlung vom 31.10.2026 nicht (nur Erstellt, PDF erstellt, Versendet). Wann was bezahlt wurde, finde ich später nicht wieder.
- In der Liste heisst der Knopf in der Zeile weiterhin «Als bezahlt markieren», ein Knopf «Zahlung erfassen» gibt es nicht. Für eine Teilzahlung hätte ich das Wort «Zahlung erfassen» gesucht.
- Bei 150 % ist die Tabelle «Kostenaufstellung» rechts abgeschnitten: Die Spalte «Betrag» ist nur durch seitliches Scrollen zu sehen (nicht Teil der Änderung).
- Die Meldung unten rechts steht über der Tabelle und verdeckt einen Teil davon, bis ich sie schliesse.

## Aufgabe geschafft: ja

Die Zahlung ist gespeichert, Dwello kennt den Rest von CHF 165.80. Die Mahnung für den Rest habe ich nicht abgeschickt, weil der Dialog den falschen Betrag nennt (P-1).

## Aufwand

Etwa 10 Minuten, 6 Schritte (Übersicht, Liste, Abrechnung öffnen, Dialog öffnen, Betrag ändern und speichern, Liste/Mahnung prüfen).

## Ablauf

1. Abrechnung geöffnet. Erwartet: ein Knopf «Zahlung erfassen». Gesehen: nur «Als bezahlt markieren»; ich zögerte, weil Hans ja nicht alles bezahlt hat.
2. Dialog geöffnet. Erwartet: Titel und Erklärung oben. Gesehen: Dialog beginnt mit «Danach können Sie keine Mahnung mehr senden.», Titel weggescrollt (Bild `05-dialog-view.png`). Der Satz hat mich erschreckt, weil ich ja noch mahnen will.
3. Betrag 215.80 durch 50 ersetzt. Erwartet: Anzeige, was offen bleibt. Gesehen: Knopf wird zu «Teilzahlung festhalten», Warnsatz verschwindet, Rest wird nicht genannt (`06-dialog-50.png`).
4. «Teilzahlung festhalten» geklickt. Erwartet: Meldung wie «Teilzahlung von CHF 50.00 festgehalten, offen CHF 165.80». Gesehen: «Abrechnung als bezahlt markiert», Status bleibt «Überfällig» (`08-after-save-view.png`).
5. «Mahnung senden» geöffnet. Erwartet: «schuldet noch CHF 165.80». Gesehen: «Hans Müller schuldet noch CHF 215.80.» (`11-mahnung.png`). Abgebrochen.
6. «Als bezahlt markieren» nochmals geöffnet. Erwartet: Hinweis auf die schon bezahlten CHF 50.00. Gesehen: «Hans Müller: Nachzahlung CHF 165.80», Betrag 165.80 vorausgefüllt, kein Hinweis auf die frühere Zahlung (`12-pay-again.png`). Abgebrochen.

## Vorschläge

- **P-1:** Abrechnung NK-11111111-2025-0001 öffnen, «Als bezahlt markieren», Betrag 50 eintragen, «Teilzahlung festhalten», dann «Mahnung senden». Der Dialog nennt CHF 215.80. Hilfreich: den offenen Rest nennen («Hans Müller schuldet noch CHF 165.80.») und, falls die Mahnung (PDF) den Betrag druckt, dort ebenfalls den Rest.
- **P-2:** Gleiche Schritte bis «Teilzahlung festhalten». Hilfreich: eigene Meldung für die Teilzahlung, z. B. «Teilzahlung von CHF 50.00 festgehalten. Offen: CHF 165.80.»
- **P-3:** Dialog öffnen. Hilfreich: neutraler Titel («Zahlung erfassen») und den Satz «Danach können Sie keine Mahnung mehr senden.» nur zeigen, wenn der volle Betrag eingetragen ist (so wie es nach dem Eintippen schon passiert, aber auch der Titel).
- **P-4:** Bei Zoom 150 % bzw. 200 % den Dialog öffnen. Hilfreich: Dialog oben beginnen lassen (Fokus aufs erste Feld oder Titel, ohne nach unten zu scrollen).
- **P-5:** Nach einer Teilzahlung den Dialog erneut öffnen. Hilfreich: «Nachzahlung CHF 215.80, bereits bezahlt CHF 50.00, offen CHF 165.80» statt «Nachzahlung CHF 165.80».
- **P-6:** Im Dialog 50 eintragen. Hilfreich: unter dem Betrag live «Danach noch offen: CHF 165.80».

## Nicht geprüft

- Die Mahnung selbst habe ich nicht verschickt: Meine Aufgabe erlaubte nur das Speichern der Zahlung, und der Dialog nannte schon den falschen Betrag. Ob das PDF der Zahlungserinnerung CHF 215.80 oder CHF 165.80 druckt, weiss ich daher nicht.
- Eine zweite Teilzahlung oder das Begleichen des Rests habe ich nicht gespeichert (Dialog nur geöffnet und abgebrochen), damit der Stand für andere Prüfungen bleibt.
- Mobile Ansicht und andere Sprachen nicht geprüft (nicht meine Persona).
