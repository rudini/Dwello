# Helga, Runde 66: Akonto im neuen Mietvertrag, Hinweis beim laufenden Mietvertrag

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Stichprobe 200 %), Maus. Persona-App http://localhost:3300, Deutsch. Nur angeschaut, nichts gespeichert (keine POST/PUT/DELETE-Anfragen im Netzwerkprotokoll). Skripte und Bilder: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/persona-helga/helga-66/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» | Der Hinweis sagt, Änderungen «gelten sofort» und eine Mietzinserhöhung erst «frühestens auf den nächsten Kündigungstermin». Er sagt mir aber nicht, was ich in Dwello tun soll: Die neue Miete jetzt eintragen oder erst an dem Tag, ab dem sie gilt? Ein Datum «gilt ab» gibt es im Formular nicht. |
| P-2 | Minor | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» | «Kündigungstermin», «Beginn der Kündigungsfrist» und «amtliches Formular» werden nicht erklärt; ich kann daraus kein Datum ausrechnen und weiss nicht, wo ich das Formular bekomme. |
| P-3 | Minor | Mietvertrag bearbeiten, Feld «Akonto pro Monat» | Der Hinweis oben spricht nur von der Mietzinserhöhung. Ob für ein höheres Akonto (oder für das Streichen des Akontos) dasselbe gilt, und ob «gilt sofort» die schon bezahlten Akontobeiträge dieses Jahres in der Abrechnung verändert, steht nirgends. Leere ich das Feld, erscheint nur derselbe blaue Kasten «Kein Akonto» wie beim neuen Vertrag. |
| P-4 | Minor | Neuer Mietvertrag, Schritt 4 «Miete», Feld «Akonto pro Monat» | Die Hilfe erklärt, was ein Akonto ist, aber nicht, welchen Betrag ich eintrage: dass er im unterschriebenen Mietvertrag steht (wie es bei der Verwaltungspauschale heisst), oder wie ich ihn bei einem neuen Vertrag festlege. |
| P-5 | Nit | Neuer Mietvertrag, Schritt 4 «Miete» | Mit eingetragenem Akonto verschwindet der Kasten «Kein Akonto» ersatzlos; es gibt keine Bestätigung, was der Betrag bedeutet (z. B. im Jahr CHF 2’160.00 Vorschuss). Auch CHF 900.00 Akonto bei CHF 1’200.00 Nettomiete nimmt das Feld ohne Rückfrage an. |

## Beobachtungen

- «Abbrechen» gibt es im Assistenten nur in Schritt 1. Ab Schritt 2 stehen unten nur «Zurück» und «Weiter» (bzw. «Mietvertrag speichern»). Ich habe über die Brotkrümel «Mietverträge» abgebrochen.
- Nach diesem Abbruch ist mein Entwurf nicht weg: Beim nächsten «Neuer Mietvertrag» stand «Entwurf wiederhergestellt – Ihre Angaben, zuletzt am 17.10.2026 um 10:10 bearbeitet, sind wieder da» mit «Entwurf verwerfen». Gut, dass es das gibt; ich hätte aber gedacht, ich hätte abgebrochen. Der Entwurf blieb im Browser, ans Backend ging nichts.
- Der Hinweis «Kein Akonto – Ohne Akonto bezahlt der Mieter alle Nebenkosten erst mit der Nebenkostenabrechnung» erscheint bei leerem Feld und bei «0». Das verstehe ich gut.
- «180,50» mit Komma wird angenommen; «Monatlich total» rechnet das Akonto sofort ein (CHF 1’380.50). Die Prüfseite zeigt «Akonto CHF 180.00» mit «Ändern».
- In Schritt 2 erschien bei Maria Rossi ein Hinweis, dass sie schon einen Mietvertrag ohne Vertragsende hat. Verständlich.
- Auf «Mietvertrag bearbeiten» stehen zwischen dem gelben Hinweis und den Feldern vier lange Absätze (Mieterwechsel, falsche Wahl, Tod des Mieters, Scheidung). Bei 150 % muss ich weit scrollen, bis ich bei der Miete bin; der gelbe Hinweis oben ist dann ausser Sicht, wenn ich die Nettomiete ändere.
- «Abbrechen» auf der Bearbeiten-Seite verlässt die Seite ohne Rückfrage, auch nachdem ich die Nettomiete geändert hatte; gespeichert war danach nichts (Seite zeigte weiter CHF 1’450.00 / CHF 240.00).
- Bei 200 % kein seitliches Scrollen auf der Bearbeiten-Seite; der gelbe Kasten mit Warndreieck ist gut zu sehen.

## Aufgabe geschafft: teilweise

Was ich beim Akonto eintrage, verstehe ich ungefähr (den monatlichen Vorschuss für Nebenkosten). Was ich vor einer Mieterhöhung in Dwello tun soll, verstehe ich nicht (P-1).

## Aufwand

Etwa 20 Minuten, 12 Skriptläufe. Assistent bis Schritt 4: 3 × «Weiter» plus Mieter, Wohnung, Datum. Bearbeiten: Liste → Hans Müller → «Bearbeiten».

## Ablauf

1. **Übersicht → «Mietvertrag erfassen».** Erwartet: ein Assistent. Gesehen: «Neuer Mietvertrag», Schritt 1 von 5 «Mieter», Hilfe unter dem Feld. Gut.
2. **Mieter Maria Rossi, Weiter.** Erwartet: Wohnungswahl. Gesehen: Schritt 2 mit Hinweis zum bestehenden Vertrag von Maria Rossi; Wohnung 2.02 (Musterhaus Zentrum) gewählt. Unten «Entwurf gespeichert, 10:08».
3. **Vertragsbeginn 01.04.2027, unbefristet, Weiter.** Erwartet: Miete. Gesehen: Schritt 4 «Miete».
4. **Hilfe bei «Akonto pro Monat (optional)» gelesen.** Text: «Monatlicher Vorschuss des Mieters für die im Mietvertrag vereinbarten Nebenkosten (zum Beispiel Heizung, Wasser). Wird mit der Nebenkostenabrechnung verrechnet. Beispiel: 180.00». Erwartet: auch, woher ich die Zahl nehme. Gesehen: nur was es ist (P-4). «Vorschuss» und «verrechnet» verstehe ich.
5. **Akonto leer gelassen.** Gesehen (Bild `06-step4-leer.png`): blauer Kasten mit i-Symbol «Kein Akonto – Ohne Akonto bezahlt der Mieter alle Nebenkosten erst mit der Nebenkostenabrechnung.» «Monatlich total CHF 0.00». Verständlich.
6. **Nettomiete 1200, Akonto 180.** Erwartet: eine Bestätigung. Gesehen (`07-step4-akonto180.png`): Kasten verschwindet, «Monatlich total CHF 1’380.00». Sonst nichts (P-5). Mit 0 kommt der Kasten wieder; mit 900 keine Rückfrage.
7. **Weiter zu Schritt 5 «Prüfen».** Akonto CHF 180.00 aufgeführt. Abbrechen gesucht: keiner da. Über «Mietverträge» oben verlassen. Nichts gespeichert. Später neu geöffnet: «Entwurf wiederhergestellt».
8. **Mietverträge → Hans Müller (Wohnung 1.01, Musterhaus Zentrum).** Seite mit Nettomiete CHF 1’450.00, Akonto CHF 240.00, Zusatzmiete CHF 100.00, «Bearbeiten», «Beenden», «Löschen», ausserdem «3 Abrechnungen fehlen».
9. **«Bearbeiten».** Gesehen (`13-edit-top.png`): gelber Kasten mit Warndreieck «Laufender Mietvertrag – Änderungen an einem laufenden Mietvertrag gelten sofort. Eine Mietzinserhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig.» Erwartet: was ich jetzt in Dwello tun soll. Gesehen: die Rechtslage, aber kein Schritt für Dwello (P-1, P-2).
10. **Nettomiete auf 1550 getippt (nicht gespeichert).** Erwartet: ein Hinweis beim Feld oder eine Frage «ab wann?». Gesehen: nur «Monatlich total CHF 1’890.00».
11. **Akonto geleert.** Gesehen: Kasten «Kein Akonto» wie beim neuen Vertrag, kein Hinweis zum laufenden Vertrag (P-3). «Abbrechen» → zurück, Werte unverändert.

## Verwirrung

- «gelten sofort»: Ab heute? Auch rückwirkend für die Abrechnung des laufenden Jahres? Wenn ich die Miete heute eintrage, rechnet Dwello dann schon ab heute mit der neuen Miete, obwohl sie erst später gilt?
- «Kündigungstermin» und «Beginn der Kündigungsfrist»: Wann ist das bei Hans Müller? Dwello kennt doch den Vertragsbeginn, sagt es mir aber nicht.
- «amtliches Formular»: Welches, und wo bekomme ich es?
- «nichtig»: Ich verstehe «ungültig», aber was heisst das für mich, wenn ich die Zahl schon eingetragen habe?
- Akonto: Ist ein höheres Akonto auch eine «Mietzinserhöhung»?
- «Akonto» selbst ist mit der Hilfe klar; das Wort hätte ich ohne Hilfe nicht gekannt.

## Fehlerrisiken

- Ich trage die neue Miete gleich nach dem Brief an den Mieter ein. Weil sie «sofort gilt», rechnet Dwello dann womöglich Monate zu früh mit der höheren Miete (P-1).
- Ich ändere das Akonto mitten im Jahr und weiss nicht, ob die schon bezahlten Monate in der Nebenkostenabrechnung dann mit dem neuen Betrag gerechnet werden; der Mieter bekäme eine falsche Abrechnung (P-3).
- Ich denke, ich hätte den neuen Vertrag abgebrochen, und finde beim nächsten Mal einen alten Entwurf mit fremden Zahlen vor (Beobachtung).
- Ich nehme beim neuen Vertrag irgendeinen Betrag als Akonto, weil nicht dasteht, dass er im Vertrag stehen muss (P-4).

## Vorschläge

- **P-1:** Reproduktion: Mietverträge → Hans Müller → Bearbeiten, Hinweis oben lesen, Nettomiete ändern. Hilfreich: ein Satz, was ich in Dwello tun soll, z. B. «Tragen Sie die neue Miete erst an dem Tag ein, ab dem sie gilt» oder ein Feld «gilt ab». Und klar sagen, ob «sofort» auch frühere Monate betrifft.
- **P-2:** Gleiche Seite. Hilfreich: kurz erklären oder ausrechnen, wann der nächste Kündigungstermin dieses Vertrags ist, und sagen, wo es das amtliche Formular gibt (Kanton bzw. Schlichtungsbehörde).
- **P-3:** Gleiche Seite, Feld «Akonto pro Monat» ändern oder leeren. Hilfreich: beim Akonto-Feld eines laufenden Vertrags sagen, ob die Regel für die Mietzinserhöhung auch hier gilt und was mit den schon bezahlten Akontobeiträgen in der Abrechnung passiert.
- **P-4:** Neuer Mietvertrag → Schritt 4, Hilfe bei «Akonto pro Monat». Hilfreich: «Tragen Sie den Betrag ein, der im unterschriebenen Mietvertrag steht.» Für einen neuen Vertrag ein Tipp, wie man ihn schätzt (z. B. Nebenkosten des letzten Jahres geteilt durch 12).
- **P-5:** Schritt 4, Akonto 180 eintragen. Hilfreich: an Stelle des verschwundenen Kastens eine kurze Zeile wie «Der Mieter zahlt im Jahr CHF 2’160.00 im Voraus; Dwello verrechnet sie in der Nebenkostenabrechnung.»

## Nicht geprüft

- Speichern (Auftrag: nur anschauen). Daher weiss ich nicht, was Dwello nach dem Speichern einer höheren Miete oder eines anderen Akontos sagt und wie sich eine spätere Nebenkostenabrechnung ändert.
- Andere Sprachen als Deutsch, Mobilansicht.
- Den «Abbrechen»-Fall mit einem Klick auf «Entwurf verwerfen» habe ich nur gesehen, nicht ausgelöst.
