# Persona-Lauf Helga – Slice b15, Runde 2 (Mietvertrag bearbeiten: Mieter und Wohnung fest, #152)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Stichprobe 200 %), Maus. App: http://localhost:3300 mit frischen Demodaten (`dwello_persona`), Lauf am 13.10.2026. Geprüft wurden nur das Delta seit Runde 1 (Commit 5f97d8b) und die offenen Punkte H15-1, H15-2 und H15-6 aus `helga-b15.md`.

Aufgabe: «Frau Keller zieht im gleichen Haus von EG nach OG2. Bilden Sie das ab.» Danach: die Bearbeiten-Seite des Mietvertrags von Sarah Meier ansehen und beurteilen, ob die Hilfe klar ist.

Benutzte Mietverträge: Laura Keller, Wohnung EG (`b0000003-0003-0003-0003-000000000001`), und Sarah Meier, Wohnung A2 (`b0000002-0002-0002-0002-000000000002`).

## Aufgabe geschafft: ja

Den Mietvertrag von Frau Keller für Wohnung EG habe ich auf den 31.12.2026 beendet. Danach habe ich für Frau Keller einen neuen Mietvertrag für Wohnung OG2 ab 01.01.2027 gespeichert (unbefristet, Nettomiete CHF 1’550.00, Akonto CHF 200.00). In der Liste stehen jetzt beide: «Laura Keller – Wohnung OG2 · Alpenblick – Künftig – ab 01.01.2027, unbefristet» und «Laura Keller – Wohnung EG · Alpenblick – Laufend – 01.11.2022 – 31.12.2026, gekündigt».

Zustand der Datenbank nach meinem Lauf: Der Mietvertrag Keller EG ist auf den 31.12.2026 gekündigt. Es gibt einen neuen Mietvertrag Keller OG2 ab 01.01.2027. Am Mietvertrag von Sarah Meier habe ich nichts gespeichert.

## Aufwand

- Etwa 6 Minuten für den Umzug, 2 Minuten für die Seite von Sarah Meier.
- 13 Schritte für den Umzug: Bearbeiten, Hilfe lesen, «Zur Seite des Mietvertrags», «Beenden», Datum, «Mietvertrag beenden», Mietverträge, «Mietvertrag erfassen», Mieter, Wohnung, Vertragsbeginn, Miete, «Mietvertrag speichern».
- Diesmal kein Umweg über «Befristet» (Runde 1: 14 Schritte mit Umweg, ohne Speichern).

## Ablauf: erwartet und gesehen

1. **Mietvertrag Laura Keller → «Bearbeiten».** Ich erwartete wie letztes Mal eine Möglichkeit, die Wohnung zu ändern. Ich sah unter dem Titel: «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» Damit wusste ich gleich: Die Wohnung ändere ich hier nicht. Der Widerspruch aus Runde 1 ist weg.
2. **Kasten «Mieter und Wohnung».** «Mieter: Laura Keller», «Wohnung: Wohnung EG · Alpenblick». Darunter: «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden» und erfassen danach einen neuen.» Das ist genau mein Fall («Wechsel der Wohnung»). Ich wusste jetzt, was zu tun ist, und wo: «auf seiner Seite mit «Beenden»». Der zweite Absatz über falsch gewählte Mieter oder Wohnungen und «löschen» betrifft mich nicht; er ist als eigener Absatz gut abgesetzt. Darunter steht der Link «Zur Seite des Mietvertrags».
3. **Link «Zur Seite des Mietvertrags».** Ich kam auf die Seite des Mietvertrags. Oben sind «Bearbeiten», «Beenden», «Löschen». Weil der Hilfetext «Beenden» genannt hatte, fand ich den Knopf sofort. Das Feld «Befristet» auf der Bearbeiten-Seite habe ich diesmal gar nicht angefasst.
4. **«Beenden».** Der Dialog «Mietvertrag von Laura Keller, Wohnung EG, beenden?» mit dem Feld «Vertragsende» und dem Satz «Ein neuer Mietvertrag kann am Tag danach beginnen.» Ich trug 31.12.2026 ein und klickte «Mietvertrag beenden».
5. **Nach dem Beenden.** Bei Vertragsende steht «Unbefristet, gekündigt auf den 31.12.2026». Dazu der Kasten «Nächste Schritte» mit «Nachmieter erfassen» und «Neue Adresse eintragen» (wie in Runde 1, siehe H15-4, nicht Teil dieser Runde). Die Miete blieb diesmal bei CHF 1’350.00 / CHF 1’590.00 (in Runde 1 hatte sie nach dem Beenden geändert, H15-5; diesmal nicht wiederholt).
6. **Neuen Mietvertrag erfassen.** Der Hilfetext sagte «erfassen danach einen neuen». Einen Link «Neuen Mietvertrag für Laura Keller erfassen» gab es auf der Seite nicht. «Nachmieter erfassen» nahm ich bewusst nicht, weil Frau Keller nicht ihre eigene Nachmieterin ist. Ich ging über «Mietverträge» → «Mietvertrag erfassen». Das fand ich ohne Hilfe, es ist der grosse Knopf oben rechts.
7. **Schritt 1, Mieter.** «Laura Keller, Interlaken» gewählt.
8. **Schritt 2, Wohnung.** Hilfetext «Freie Wohnungen stehen zuoberst …». Ganz oben «Wohnung EG - Alpenblick, 3 Zimmer, 72 m² (verfügbar ab 01.01.2027)», darunter «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m²». OG2 gewählt. Hier steht wieder der Bindestrich statt des Punkts (siehe H15-9).
9. **Schritt 3, Vertragsdauer.** 01.01.2027 eingetragen, darunter erschien «Freitag, 1. Januar 2027». «Unbefristet» war schon gewählt.
10. **Schritt 4, Miete.** Nettomiete 1550.00 und Akonto 200.00 eingetragen; «Monatlich total» rechnete mit.
11. **Schritt 5, Prüfen.** Eine klare Übersicht: Mieter Laura Keller, Wohnung OG2 - Alpenblick, Vertragsbeginn Freitag, 1. Januar 2027, Vertragsende Unbefristet, Nettomiete CHF 1’550.00, Akonto CHF 200.00, Zusatzmiete CHF 0.00, Monatlich total CHF 1’750.00. Bei jeder Zeile ein «Ändern». Das gab mir Sicherheit.
12. **«Mietvertrag speichern».** Ich erwartete eine Bestätigung. Ich kam auf die Liste «Mietverträge»; rechts erschien eine grüne Meldung «Mietvertrag von Laura Keller gespeichert». Ganz oben in der Liste steht der neue Mietvertrag mit «Künftig», weiter unten der alte mit «gekündigt». Die Meldung lag bei 150 % Zoom über dem rechten Teil des Felds «Vertragsstatus» (siehe H15-10).
13. **Kontrolle: Bearbeiten-Seite von Frau Kellers altem Mietvertrag.** Weil er jetzt ein Vertragsende hat, steht im Kasten nun der zweite Text: «… erfassen Sie ab dem Tag nach dem Vertragsende einen neuen Mietvertrag.» Das passt zu dem, was ich gerade getan habe.

### Sarah Meier, Bearbeiten-Seite (Vertragsende 30.06.2025)

14. **`/contracts/b0000002-…-0002/edit`.** Oben: «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» Im Kasten: «Mieter: Sarah Meier», «Wohnung: Wohnung A2 · Seepark Residenz», dann «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung erfassen Sie ab dem Tag nach dem Vertragsende einen neuen Mietvertrag.» Der zweite Absatz zum Löschen ist gleich wie bei Frau Keller, dann der Link «Zur Seite des Mietvertrags».
15. **Meine Beurteilung.** Der Text ist richtig und kurz. Er schickt mich nicht mehr zu «Beenden», das stimmt, denn der Mietvertrag ist schon beendet (auf der Seite des Mietvertrags gibt es auch keinen Knopf «Beenden» mehr). Zwei Dinge musste ich aber selbst zusammensuchen:
    - **Welcher Tag?** «ab dem Tag nach dem Vertragsende»: Das Vertragsende (30.06.2025) steht erst weiter unten im Kasten «Vertragsdauer». Ich musste rechnen: also 01.07.2025. Der Tag selbst steht nicht im Text.
    - **Wo erfasse ich den neuen?** Der einzige Link heisst «Zur Seite des Mietvertrags». Dort gibt es «Bearbeiten» und «Löschen», aber nichts zum Erfassen eines neuen Mietvertrags. Ich musste wieder über «Mietverträge» → «Mietvertrag erfassen» gehen.
    - Bei Wohnung A2 wohnt übrigens schon seit 01.07.2025 Nina Brunner. Die Hilfe sagt mir das nicht; ich hätte im Zweifel nachgeschaut, ob ich den neuen Mietvertrag schon erfasst habe. Das ist aber eher ein Wunsch als ein Fehler.
16. **200 % Zoom.** Der Kasten «Mieter und Wohnung» ist gut lesbar, nichts wird abgeschnitten, kein seitliches Scrollen.

## Verwirrung, auch unklare Begriffe

- Keine Verwirrung mehr auf der Bearbeiten-Seite von Frau Keller. Die Einleitung und der Hilfetext sagen jetzt dasselbe.
- «erfassen danach einen neuen» / «erfassen Sie … einen neuen Mietvertrag»: Ich wusste, *was* zu tun ist, aber nicht, *wo* der Knopf dafür ist. Der Link führt zur Seite des Mietvertrags, und dort gibt es das nicht. Ich habe es über das Menü gefunden; jemand Unsichereres sucht vielleicht länger.
- «ab dem Tag nach dem Vertragsende»: verständlich, aber ich musste das Datum selbst ausrechnen.
- Auf der Seite des alten Mietvertrags heisst der Link «Nachmieter erfassen». Für einen Umzug im Haus fühlte sich das falsch an (H15-4, offen aus Runde 1).

## Fehlerrisiken

- **Weg über «Nachmieter erfassen».** Nach dem Beenden ist das der einzige Link zum Erfassen. Er füllt die Wohnung EG vor. Wer ihm folgt und den Mieter nicht ändert, legt Frau Keller erneut in der EG an statt in OG2. Der Hilfetext auf der Bearbeiten-Seite verhindert das nicht, weil er keinen eigenen Weg zum Erfassen anbietet (H15-4 / H15-7).
- **Falsches Datum für den neuen Mietvertrag.** Ohne das konkrete Datum im Hilfetext kann man aus Versehen den Tag des Vertragsendes selbst nehmen (30.06. statt 01.07.). Ob Dwello die Überschneidung dann abweist, habe ich nicht ausprobiert.
- Das Risiko aus Runde 1, über «Befristet» ein Vertragsende zu setzen, ist für mich weg: Der Hilfetext schickt einen vorher zu «Beenden».

## Befunde aus Runde 1

| ID | Schwere (R1) | Status | Beleg |
|---|---|---|---|
| H15-1 | Major | **behoben** | Bearbeiten Laura Keller und Sarah Meier: Einleitung «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» Kein Widerspruch mehr zum Kasten «Mieter und Wohnung». |
| H15-2 | Major | **behoben** | Bearbeiten Laura Keller (ohne Vertragsende): «… beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden» und erfassen danach einen neuen.» plus Link «Zur Seite des Mietvertrags». Ich bin ohne Umweg über «Befristet» zu «Beenden» gekommen. Der Teil «danach einen neuen erfassen» hat keinen eigenen Link mehr, siehe neues H15-7 (Minor). |
| H15-6 | Nit | **behoben** auf der Bearbeiten-Seite | Bearbeiten: «Wohnung EG · Alpenblick» und «Wohnung A2 · Seepark Residenz», gleich wie Detailseite und Liste. Im Assistenten steht weiter der Bindestrich, siehe H15-9. |
| H15-3, H15-4, H15-5 | Minor | nicht Teil dieser Runde | H15-4 unverändert gesehen (Schritt 5). H15-5 diesmal nicht aufgetreten: Miete blieb nach dem Beenden CHF 1’350.00. |

## Vorschläge (neue Befunde)

| ID | Schwere | Bildschirm | Vorschlag | Reproduktion / Beleg |
|---|---|---|---|---|
| H15-7 | Minor | Mietvertrag bearbeiten, Kasten «Mieter und Wohnung» (beide Varianten) | Für den Schritt «einen neuen Mietvertrag erfassen» einen eigenen Link anbieten, etwa «Neuen Mietvertrag erfassen» (Mieter vorausgefüllt, Wohnung offen, Vertragsbeginn am Tag nach dem Vertragsende). Der vorhandene Link «Zur Seite des Mietvertrags» führt auf eine Seite ohne Erfassen-Knopf; dort steht nur «Nachmieter erfassen» mit der alten Wohnung. | Sarah Meier → «Bearbeiten» → «Zur Seite des Mietvertrags»: Knöpfe nur «Bearbeiten», «Löschen», kein Erfassen. Laura Keller nach «Beenden»: einziger Erfassen-Link «Nachmieter erfassen» (`/contracts/new?apartment=<EG>`). Ich musste über «Mietverträge» → «Mietvertrag erfassen» gehen. |
| H15-8 | Minor | Mietvertrag bearbeiten mit Vertragsende (Sarah Meier) | Den Tag im Text nennen, etwa «… erfassen Sie einen neuen Mietvertrag ab dem 01.07.2025 (Tag nach dem Vertragsende).» So muss niemand rechnen, und man nimmt nicht aus Versehen den 30.06. | `/contracts/b0000002-0002-0002-0002-000000000002/edit`: Text «… ab dem Tag nach dem Vertragsende …»; das Vertragsende 30.06.2025 steht erst weiter unten unter «Vertragsdauer». |
| H15-9 | Nit | Assistent «Neuer Mietvertrag», Schritt 2 und Schritt 5 | Wohnungsnamen wie auf Bearbeiten-, Detailseite und Liste schreiben («Wohnung OG2 · Alpenblick»). | Schritt 2: «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m²»; Schritt 5 «Prüfen»: «Wohnung OG2 - Alpenblick»; Liste danach: «Wohnung OG2 · Alpenblick». Nicht im Delta dieser Runde, aber der Rest von H15-6. |
| H15-10 | Nit | Mietverträge-Liste nach «Mietvertrag speichern» | Die Erfolgsmeldung so platzieren, dass sie kein Feld verdeckt. | Desktop 150 %: nach dem Speichern liegt «Mietvertrag von Laura Keller gespeichert» über der rechten Hälfte des Felds «Vertragsstatus». Sie lässt sich mit «×» schliessen. Wahrscheinlich nicht neu in diesem Slice. |

Keine Blocker, keine Major.

## Nicht geprüft

- Ob Dwello einen neuen Mietvertrag abweist, der sich mit dem alten überschneidet (z. B. Beginn 31.12.2026 in der EG): nicht versucht, um die Daten für Sven nicht zu stören.
- Für Sarah Meier einen neuen Mietvertrag erfassen: nicht gemacht, Wohnung A2 ist schon an Nina Brunner vermietet, und Sven arbeitet mit diesem Mietvertrag.
- Der Fall «falsch erfasst und noch nicht begonnen → löschen»: Den künftigen Mietvertrag Keller OG2 habe ich nicht gelöscht; ob die Bearbeiten-Seite eines künftigen Mietvertrags einen anderen Text zeigt, habe ich nicht angesehen.
- H15-3 und H15-4 im Detail (nicht Teil dieser Runde).
- 200 % Zoom nur auf der Bearbeiten-Seite von Sarah Meier, nicht im Assistenten.
