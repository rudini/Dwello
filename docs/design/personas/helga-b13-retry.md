# Persona-Lauf: Helga, Runde b13-retry (Mietverträge einer Wohnung lassen sich zuerst nicht laden)

- Persona: Helga, 68, hat eine Wohnung geerbt, wenig Computererfahrung, braucht grosse Schrift, ist bei Fachbegriffen unsicher.
- Gerät: Desktop 1440 × 900, Zoom 150 %, Maus.
- Simulierter Fehler: Die Browser-Anfrage `GET /api/contracts?apartmentId=aaaa3333-3333-3333-3333-333333333333` (Wohnung OG2 - Alpenblick) wurde mit Status 500 beantwortet. Bei «jetzt geht es wieder» habe ich die Umleitung mit `page.unrouteAll()` aufgehoben. Keine erfundenen Daten.
- Nachprüfung der Befunde H2 und H3 aus `helga-b13.md`.
- Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/cddd988c-70a6-5729-8466-f788682cbf73/scratchpad/` (nicht im Repository).

## Aufgabe geschafft: ja (mit einer neuen, unabhängigen Panne beim Bearbeiten)

Beide Mietverträge habe ich gespeichert. Der neue gelbe Hinweis hat mir gesagt, was fehlt und was ich tun soll, und es gab einen Knopf dafür. Meine Eingaben blieben beim Erneut-Versuchen erhalten. Beim Bearbeiten hat Dwello aber die neue Wohnung nicht übernommen, nur die neue Miete, und trotzdem «gespeichert» gemeldet (siehe H9). Das hat mit dem Ladefehler nichts zu tun, es passiert auch ohne ihn.

## Ergebnis H2 und H3

- **H2 (Major, Eingaben gehen beim empfohlenen Neuladen verloren): behoben.** Die Meldung verlangt kein Neuladen der Seite mehr, sondern bietet den Knopf «Erneut versuchen». Danach standen Wohnung OG2 und Nettomiete 1700.00 noch da.
- **H3 (Major, Meldung unverständlich, kein Knopf): behoben.** Die Überschrift «Überschneidung noch nicht geprüft» und der Text sagen, was fehlt, dass meine Eingaben bleiben und dass Dwello beim Speichern trotzdem prüft. Der Knopf «Erneut versuchen» ist gross und gut zu treffen. Kleine Reste siehe H10 bis H12 (Minor/Nit).
- Nebenbei: H1 (kein Hinweis auf «Prüfen») ist ebenfalls behoben, die Meldung steht jetzt auch auf Schritt 5. H5 (doppelte Meldung beim Bearbeiten) ist entschärft: Unter «Vertragsbeginn» steht nur noch ein kurzer Verweis «siehe oben bei der Wohnung». H4 (OG2 erscheint in der Liste als frei) besteht weiter, war hier nicht Gegenstand.

## Aufwand

- Aufgabe 1 (Bearbeiten): 6 Klicks/Eingaben (Mietvertrag, Bearbeiten, Wohnung, Nettomiete, Erneut versuchen, Speichern), etwa 3 Minuten mit Lesen.
- Aufgabe 2 (Neuer Mietvertrag): 10 Klicks/Eingaben (Mietvertrag erfassen, Mieter, Weiter, Wohnung, Weiter, Datum, Weiter, Miete, Weiter, Erneut versuchen, Speichern), etwa 4 Minuten.

## Ablauf

### Aufgabe 1: Mietvertrag bearbeiten

| Schritt | Erwartet | Gesehen |
|---|---|---|
| 1. `/contracts` → «Pierre Dubois» | Der Mietvertrag. | «Mietvertrag von Pierre Dubois», «Wohnung 2.01 · Musterhaus Zentrum», Nettomiete CHF 1’650.00, Knopf «Bearbeiten». |
| 2. «Bearbeiten» | Formular mit den heutigen Angaben. | «Mietvertrag bearbeiten», gelber Hinweis «Laufender Mietvertrag», kurz «Es wird geprüft, welche Wohnungen frei sind …», dann alle Felder. |
| 3. Wohnung auf «Wohnung OG2 - Alpenblick» | Wohnung ist gewählt. | Direkt unter der Wohnung ein gelber Kasten mit Warndreieck: Überschrift **«Überschneidung noch nicht geprüft»**, Text «Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet.» Darunter ein umrandeter Knopf «Erneut versuchen» mit Kreispfeil. Unter «Vertragsbeginn» ein zweiter, kurzer Kasten: «Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.» (`10-edit-og2.png`, `11-edit-rent.png`) |
| 4. Nettomiete auf 1700.00 | Total ändert sich. | «Monatlich total CHF 1’970.00». Hinweise bleiben stehen. |
| Verstehe ich den Hinweis? | | Ja, grösstenteils: Etwas wurde nicht nachgeschaut, ich soll auf «Erneut versuchen» drücken, meine Eingaben gehen nicht verloren. Beruhigend ist der Satz, dass beim Speichern sowieso geprüft wird. Das Wort «Überschneidung» in der Überschrift allein hätte ich nicht verstanden, erst der letzte Satz erklärt es. |
| 5. Jetzt geht es wieder: «Erneut versuchen» | Der Kasten verschwindet, meine Angaben bleiben. | Der Kasten (beide) ist weg. Wohnung OG2 und 1700.00 stehen noch da (`12-after-retry.png`). Ein Satz wie «Geprüft, keine Überschneidung» kam nicht; der Kasten verschwand einfach. |
| 6. «Änderungen speichern» | Mietvertrag nun in OG2, Miete 1700. | Meldung «Mietvertrag von Pierre Dubois gespeichert». Nettomiete CHF 1’700.00, **aber Wohnung weiterhin «Wohnung 2.01 · Musterhaus Zentrum»**. Auch nach Neuladen der Detailseite: 2.01. Die Seite der Wohnung OG2 zeigt «Noch keine Mietverträge» (`13-after-save.png`). → H9. |
| 6b. Gegenprobe ohne Ladefehler (Anna Schmidt, Wohnung 1.02 → OG2, speichern) | Wohnung OG2. | Wieder «gespeichert», Wohnung bleibt 1.02. Im Netzwerk schickte der Browser `apartmentId: aaaa3333-…-333333333333`, die Antwort (200) enthielt `apartmentId: aaaa1111-…-222222222222`. Der Wechsel der Wohnung wird also allgemein still verworfen (`14-control-ok.png`). |
| 6c. «Erneut versuchen», solange es noch nicht geht | Irgendein Zeichen, dass es versucht wurde. | Nichts ändert sich sichtbar: gleicher Kasten, gleicher Text, keine Lade-Anzeige. Ich wüsste nicht, ob mein Klick angekommen ist. → H10. |

### Aufgabe 2: Neuer Mietvertrag

| Schritt | Erwartet | Gesehen |
|---|---|---|
| 1. «Mietvertrag erfassen» | Formular. | «Neuer Mietvertrag», «Schritt 1 von 5: Mieter». |
| 2. Mieter «Marco Bernasconi, Luzern», «Weiter» | Schritt 2. | «Schritt 2 von 5: Wohnung». OG2 steht zuoberst, ohne Vermerk, also «frei» (wie H4). |
| 3. «Wohnung OG2 - Alpenblick» | | Derselbe gelbe Kasten «Überschneidung noch nicht geprüft» mit Knopf «Erneut versuchen» unter der Wohnung. «Weiter» bleibt aktiv. Sinnvoll: Ich weiss, dass ich weitermachen darf, weil später ohnehin geprüft wird. |
| 4. «Weiter» → Schritt 3 | | Unter Vertragsbeginn steht der **ganze** Kasten noch einmal, mit Knopf. Gut, denn hier geht es um das Datum. |
| 5. Vertragsbeginn 01.12.2026 | | «Dienstag, 1. Dezember 2026», Kasten bleibt (`24-step3-date-full.png`). |
| 6. «Weiter» → Schritt 4 Miete, 1500 | | Hier kein Kasten. Für mich in Ordnung, die Miete hat mit der Wohnung nichts zu tun. |
| 7. «Weiter» → Schritt 5 «Prüfen» | Ein Hinweis, dass etwas nicht geprüft ist. | Der Kasten steht oben auf «Prüfen», über der Zusammenfassung, mit Knopf (`26-step5-full.png`). Genau das hatte ich letztes Mal vermisst. |
| 8. Jetzt geht es wieder: «Erneut versuchen» | Kasten weg, Angaben bleiben, ich bleibe auf Schritt 5. | Kasten verschwindet, alle Angaben (Mieter, OG2, 1. Dezember 2026, CHF 1’500.00) unverändert, ich bleibe auf «Prüfen» (`27-step5-retry.png`). Keine positive Bestätigung. |
| 9. «Mietvertrag speichern» | Neuer Mietvertrag in der Liste. | Weiter zu «Mietverträge», jetzt «12 Mietverträge», zuoberst «Marco Bernasconi, Wohnung OG2 · Alpenblick, Künftig ab 01.12.2026, unbefristet, CHF 1’500.00» (`28-saved.png`). |

## Verwirrung (auch Begriffe)

- «Überschneidung» als Überschrift ist für mich ein Fremdwort im Mietzusammenhang. Erst der Schlusssatz («ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet») erklärt es. Wenn ich nur die fette Zeile lese, weiss ich nicht, was gemeint ist.
- «Wählen Sie «Erneut versuchen»»: Bei einem Knopf würde ich «Klicken Sie auf» erwarten. Ich habe es trotzdem verstanden.
- Nach «Erneut versuchen» verschwindet der Kasten einfach. Ich musste mir selbst zusammenreimen, dass es jetzt geklappt hat.
- Beim Bearbeiten darf ich die Wohnung wechseln, und es heisst «gespeichert», aber die Wohnung bleibt die alte. Das ist das Verwirrendste dieses Laufs.

## Fehlerrisiken

1. **Wohnungswechsel beim Bearbeiten geht still verloren (H9):** Ich glaube, Pierre Dubois wohnt jetzt in OG2, weil Dwello «gespeichert» sagt. In Wahrheit steht er weiter in 2.01. Wer auf die Erfolgsmeldung vertraut, merkt das nicht.
2. **Doppelklick auf «Erneut versuchen» (H10):** Weil nichts sichtbar passiert, wenn es noch nicht geht, drücke ich mehrmals oder denke, der Knopf sei kaputt.
3. **Falsches «frei» in der Liste (H4, unverändert):** OG2 steht ohne Vermerk zuoberst, auch wenn ihre Mietverträge nicht geladen wurden.

## Vorschläge

| ID | Schwere | Bildschirm | Vorschlag | Reproduktion / Beleg |
|---|---|---|---|---|
| H2 | – | Mietvertrag bearbeiten | **Behoben.** Kein Rat zum Neuladen mehr; «Erneut versuchen» behält Wohnung und Miete. | Aufgabe 1, Schritte 3 bis 5 (`11-edit-rent.png`, `12-after-retry.png`). |
| H3 | – | Beide, Meldung unter «Wohnung» | **Behoben.** Klare Überschrift, Erklärung, Knopf «Erneut versuchen». | Aufgabe 1 Schritt 3, Aufgabe 2 Schritte 3, 4, 7. |
| H9 | Major | Mietvertrag bearbeiten | Ein Wechsel der Wohnung muss gespeichert werden, oder das Feld darf beim Bearbeiten nicht änderbar sein (mit Erklärung, wie man umzieht: Mietvertrag beenden, neuen erfassen). Auf keinen Fall «gespeichert» melden, wenn die Wohnung nicht übernommen wurde. Unabhängig vom Ladefehler. | Ohne Fehlersimulation: `/contracts/b0000001-0001-0001-0001-000000000002/edit` (Anna Schmidt, Wohnung 1.02) → Wohnung «Wohnung OG2 - Alpenblick» → «Änderungen speichern» → Meldung «Mietvertrag von Anna Schmidt gespeichert», Detailseite zeigt «Wohnung 1.02». Browser sendet `PUT /api/contracts/b0000001-…-0002` mit `"apartmentId":"aaaa3333-3333-3333-3333-333333333333"`, Antwort 200 mit `"apartmentId":"aaaa1111-1111-1111-1111-222222222222"`. Gleich bei Pierre Dubois (2.01 → OG2, `13-after-save.png`). |
| H10 | Minor | Beide, Knopf «Erneut versuchen» | Beim Klick sichtbar zeigen, dass geladen wird (z. B. «Wird erneut versucht …», Knopf kurz gesperrt), und wenn es wieder scheitert, sagen «Hat wieder nicht geklappt, versuchen Sie es später noch einmal.» | Fehler bleibt aktiv → Bearbeiten → OG2 → «Erneut versuchen»: nach 50 ms, 300 ms und 1,5 s derselbe Kasten, unveränderter Text, keine Lade-Anzeige. |
| H11 | Minor | Beide, nach erfolgreichem «Erneut versuchen» | Kurz bestätigen, z. B. «Geprüft: Die Wohnung ist ab diesem Datum frei.», statt den Kasten nur verschwinden zu lassen. | Aufgabe 1 Schritt 5, Aufgabe 2 Schritt 8: Kasten verschwindet, die Statuszeile bleibt leer. |
| H12 | Nit | Beide, Überschrift des Kastens | Überschrift in Alltagssprache, z. B. «Noch nicht geprüft, ob die Wohnung frei ist», und «Klicken Sie auf «Erneut versuchen»» statt «Wählen Sie». | Aufgabe 1 Schritt 3 (`11-edit-rent.png`). |
| H4 | Minor (offen aus b13) | Wohnungsliste (beide) | Unverändert: OG2 steht ohne Vermerk als frei da, obwohl ihre Mietverträge nicht geladen werden konnten. | Aufgabe 2 Schritt 2: Liste zeigt «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m²» ohne Zusatz. |

## Nicht geprüft

- Was beim Speichern passiert, wenn die Mietverträge immer noch nicht geladen sind und der Zeitraum sich tatsächlich überschneidet (Ablehnung durch den Server und deren Meldung). OG2 hat in den Demo-Daten keine Mietverträge, also gab es keine Überschneidung zu provozieren, ohne zusätzliche Daten anzulegen.
- Speichern, während der Fehler noch aktiv ist (ohne «Erneut versuchen»): nicht verlangt, nicht gemacht.
- Zoom 200 % und dunkle Darstellung.
- Hinweis: In den ganzseitigen Screenshots überdeckt die fixierte Kopfzeile ein Stück Inhalt (z. B. «Neuer Mietvertrag»). Das kommt vom ganzseitigen Screenshot und ist kein Befund.
