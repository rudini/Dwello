# Marco – Verteilschlüssel lässt sich nicht berechnen (Runde 1221)

Persona: Marco, 38, auf dem Smartphone (390 × 844, Touch). App: Persona-Stack http://localhost:3300. Gespeichert habe ich nur in «Seepark Residenz» (der Versuch «Neu berechnen» bei Sarah Meier, von Dwello abgelehnt; der Entwurf blieb unverändert). «Alpenblick» und «Einstellungen» habe ich nicht angefasst.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/e5c67ce1-956a-5751-8d41-9544648598b2/scratchpad/marco-1221/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 4 «Vorschau», nach «Weiter» | Ich tippe «Weiter» ganz unten, und auf dem Handy passiert nichts Sichtbares. Die Fehlermeldung «Der Verteilschlüssel einiger Rechnungen lässt sich nicht berechnen …» erscheint rund 2000 px weiter oben (unter dem roten Kasten), die Seite scrollt nicht hin. Ich hätte nochmals getippt und dann gedacht, die App hängt. |
| P-2 | Major | Abrechnung NK-22222222-2025-0002 (Sarah Meier), nach dem Bestätigen von «Neu berechnen» | Gleiches Muster: Nach dem Bestätigen schliesst der Dialog, ich stehe unten bei «Weitere Aktionen» und sehe nichts. Die Meldung «Das hat nicht geklappt» steht rund 5000 px weiter oben, ganz am Anfang der Seite. Ohne Hochscrollen hätte ich angenommen, die Neuberechnung hat geklappt. |
| P-3 | Minor | Vorschau, roter Kasten «Verteilschlüssel lässt sich nicht berechnen» | Der wichtigste Hinweis (er blockiert das Weitergehen) steht erst bei etwa 3300 px von 7000 px, nach der ganzen Kostenabstimmung. Beim Ankommen in der Vorschau sehe ich nur die Schrittliste und «Vorschau». Am Anfang der Vorschau steht kein Wort davon, dass es so nicht weitergeht. |
| P-4 | Minor | Rechnung bearbeiten (aus dem Link im Hinweis) | Die Seite sagt nichts zum Problem, wegen dem ich hier bin. Oben stehen zwei lange Kästen («Abrechnungen nicht aktuell», «Rechnung schon abgerechnet»), das Feld «Verteilschlüssel» kommt erst bei etwa 3700 px von 4200 px. Dort steht «Wohnungsgrösse», ohne Hinweis, dass genau dieser Schlüssel nicht geht. Ich musste mich an den Text in der Vorschau erinnern. |
| P-5 | Minor | Abrechnungen erstellen, Rückkehr mit «Abbrechen» von der Rechnung | Der Link führt zurück auf Schritt 3 (Heizprofil), nicht auf die Vorschau, von der ich kam. Der blaue Kasten sagt «Mit «Weiter» berechnet Dwello die Vorschau mit der neuen Rechnung.», obwohl ich nichts geändert habe. Das hat mich kurz verunsichert, ob ich doch etwas gespeichert hatte. |
| P-6 | Minor | Abrechnung Sarah Meier, Fehlermeldung nach «Neu berechnen» | Die Meldung nennt die Rechnung nur als Text («Facility Service AG, 31.03.2025, CHF 765.00»), ohne Link. In der Vorschau war sie verlinkt. Weiter unten in der Kostenaufstellung heisst die gleiche Rechnung «Hauswartung Q1 2025». Ich musste erst zusammenreimen, dass es dieselbe ist. |
| P-7 | Minor | Abrechnung Sarah Meier | Direkt über der roten Meldung steht weiter der gelbe Kasten «Wählen Sie «Neu berechnen», dann rechnet er …». Das widerspricht der roten Meldung darunter, die sagt, dass genau das nicht geht. Auch der Bestätigungsdialog «Entwurf neu berechnen» warnt nur vor «Verschiedene Verteilschlüssel in einer Kategorie», nicht davor, dass die Neuberechnung scheitern wird. |
| P-8 | Minor | Vorschau und Abrechnung, Lösungsweg | Beide Meldungen schicken mich zuerst nach «Einstellungen» › «Verteilschlüssel», um «die Formel» zu korrigieren. Ich weiss nicht, was an der Formel falsch ist, und das wäre eine Änderung für alle Gebäude. Ob ich lieber bei der Rechnung einen anderen Schlüssel wähle (und welchen, «wie mit den Mietern vereinbart»), müsste ich nachschlagen. Den Satz «Formel testen rechnet nur mit vier Beispielwohnungen» verstehe ich ohne die Einstellungsseite nicht. |

## Beobachtungen

- Die Texte selbst lesen sich auf dem Handy sauber umbrochen, nirgends musste ich seitwärts scrollen (Seitenbreite immer 390 px). Aber sie sind lang: Der rote Kasten in der Vorschau ist etwa 700 px hoch (fast ein ganzer Bildschirm, 24 Zeilen), die Meldung auf der Abrechnung etwa 500 px (rund 18 Zeilen). Die kurze Meldung nach «Weiter» hat 6 Zeilen und ist fett rot, ohne Kasten.
- In der Vorschau zeigt die Kostenabstimmung die Position «Hauswart (Wohnungsgrösse)» mit Zahlen (davon Mieter CHF 191.25, davon tragen Sie CHF 573.75), obwohl der Hinweis weiter unten sagt, dass sich dieser Schlüssel nicht berechnen lässt. Woher kommen dann diese Zahlen? Das würde Dr. Weber fragen.
- Auf der Rechnungsseite liefert der Bildschirmleser für das Feld «Kategorie» nur «Kategorie auswählen», sichtbar steht aber «Hauswart». Das hat mich nicht behindert.
- In der Kostenaufstellung bricht «TV/Kabelanschluss» mitten im Wort um («TV/Kabelanschl / uss»).
- Gartenpflege zeigt bei Sarah Meier einen Zeitanteil von «181/181 Tage», alle anderen Positionen «181/365 Tage». Ich verstehe nicht warum, habe es aber nicht weiter verfolgt.
- Auf der Startseite steht «Seepark Residenz (2025)» unter «Noch nicht abgerechnet», obwohl es schon 3 Entwürfe gibt. Im Wizard sehe ich dann, dass noch Thomas Weber fehlt. Das war verständlich.
- Gut: Der Link im roten Kasten bringt mich direkt zur richtigen Rechnung, und mit «Abbrechen» sind meine Angaben im Wizard wieder da («Angaben wiederhergestellt»).
- Ein zweites Tippen auf «Weiter» bleibt ebenso stumm, man bleibt auf Schritt 4.

## Aufgabe geschafft: teilweise

Ich bin bis zur Vorschau gekommen, habe die Rechnung geöffnet und bin zurückgekehrt, «Weiter» wurde wie vorgesehen abgelehnt, und ich habe die Neuberechnung bestätigt. Ich wusste am Schluss ungefähr, was das Problem ist (der Verteilschlüssel «Wohnungsgrösse» bei der Hauswart-Rechnung Q1), aber nicht sicher, was ich tun soll: Formel in den Einstellungen oder anderen Schlüssel bei der Rechnung, und welchen. Die Ablehnung nach «Weiter» und nach «Neu berechnen» habe ich auf dem Handy erst gesehen, als ich gezielt hochgescrollt habe.

## Aufwand

Etwa 25 Minuten, rund 20 Tipps, dazu viel Scrollen: Vorschau etwa 7000 px, Rechnungsseite 4200 px, Abrechnung etwa 6000 px.

## Ablauf

1. Vorschau geöffnet. Erwartet: oben ein Hinweis, falls etwas nicht stimmt. Gesehen: oben nur Schrittliste und Eckdaten, der rote Kasten kommt erst nach der Kostenabstimmung (Screenshot `06-arrive-viewport.png` oben, `07-alert.png` Kasten).
2. Link «Facility Service AG: Hauswartung Q1 2025 …» geöffnet. Erwartet: die Seite zeigt, was ich ändern soll. Gesehen: zwei lange Hinweise zu bestehenden Abrechnungen, das Feld Verteilschlüssel ganz unten, ohne Markierung (`08-invoice-top.png`, `09-invoice-key.png`).
3. «Abbrechen». Erwartet: zurück in der Vorschau. Gesehen: Schritt 3 mit «Angaben wiederhergestellt» und «… mit der neuen Rechnung» (`10-back-viewport.png`).
4. «Weiter» auf der Vorschau. Erwartet: eine sichtbare Meldung beim Knopf. Gesehen: Bildschirm unverändert (`11-after-weiter.png`), die Meldung steht weit oben (`13-second-alert.png`).
5. «Neu berechnen» bestätigt. Erwartet: Bestätigung oder sichtbarer Fehler. Gesehen: unten bei «Weitere Aktionen», keine Veränderung (`17-after-recalc.png`). Die Meldung «Das hat nicht geklappt» steht am Seitenanfang (`19-error-top.png`). Nach einem Neuladen ist sie verschwunden.

## Vorschläge

- **P-1:** Abrechnungen erstellen → Periode 01.01.2025–31.12.2025 → Seepark Residenz → Weiter → Weiter → in der Vorschau ganz nach unten → «Weiter». Hilfreich: die Meldung beim Knopf zeigen oder zur Meldung bzw. zum roten Kasten scrollen und den Fokus dorthin setzen.
- **P-2:** Abrechnung NK-22222222-2025-0002 öffnen → nach unten → «Neu berechnen» → im Dialog «Neu berechnen». Hilfreich: nach der Ablehnung zur Meldung scrollen oder sie bei «Weitere Aktionen» zeigen.
- **P-3:** wie P-1 bis zur Vorschau. Hilfreich: den Kasten, der das Weitergehen blockiert, an den Anfang der Vorschau stellen oder dort einen Verweis darauf setzen.
- **P-4:** Link im roten Kasten öffnen. Hilfreich: beim Feld «Verteilschlüssel» sagen, dass sich «Wohnungsgrösse» für dieses Gebäude nicht berechnen lässt, oder den Link direkt zum Feld springen lassen.
- **P-5:** von der Rechnung «Abbrechen». Hilfreich: zurück auf die Vorschau, und «neue Rechnung» nur sagen, wenn tatsächlich gespeichert wurde.
- **P-6:** wie P-2. Hilfreich: die Rechnung verlinken und mit derselben Bezeichnung nennen wie in der Kostenaufstellung.
- **P-7:** wie P-2. Hilfreich: den gelben Kasten anpassen oder ausblenden, solange die Neuberechnung nicht geht, und den Fall schon im Bestätigungsdialog nennen.
- **P-8:** Meldungstext. Hilfreich: zuerst den Weg nennen, den ein Laie gehen kann (bei der Rechnung den Schlüssel wählen, mit dem die anderen Hauswart-Rechnungen verteilt werden, hier «Pro Fläche (m²)»), und kurz sagen, was an der Formel falsch ist (welche Wohnung welchen Wert ergibt).

## Nicht geprüft

- Ob die Formel unter «Einstellungen» › «Verteilschlüssel» sich korrigieren lässt: Das war nicht erlaubt (globale Einstellung).
- Ob es nach einer Änderung des Verteilschlüssels bei der Rechnung weitergeht: Die Aufgabe verlangte, ohne Speichern zurückzukehren.
- Was ein Bildschirmleser bei den beiden Meldungen ansagt: Sie haben die Rolle «alert», gehört habe ich sie nicht (ich bin Touch-Nutzer).
