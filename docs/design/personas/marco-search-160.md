# Marco: Suche auf «Wohnungen» und «Gebäude» (Runde search-160)

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: Persona-Stack http://localhost:3300 mit Demodaten. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/a7113b23-14e0-517f-acb3-ca1a5c362bff/scratchpad/marco-search-160/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Wohnungen, Hilfetext der Suche | Das Beispiel im Hilfetext, «Seepark 3.02», findet nichts: Wenn ich es abtippe, kommt «Keine Wohnungen gefunden». |
| P-2 | Minor | Gebäude, leere Trefferliste | Die Meldung sagt nur «Kein Gebäude passt zu Ihrer Suche.», ohne meinen Suchbegriff und ohne zu sagen, wo gesucht wird. Auf «Wohnungen» steht beides. |
| P-3 | Minor | Gebäude, Suchfelder | Auf «Gebäude» steht kein Hilfetext beim Feld, nur der Platzhalter «Name oder Adresse», und der verschwindet beim Tippen. Dass Name plus Ort im selben Feld geht, steht nirgends. Der Platzhalter «Zürich» im Feld «Ort» sieht aus wie ein schon gesetzter Filter. |
| P-4 | Nit | Wohnungen, leere Trefferliste | Der Text sagt «… oder zeigen Sie alle Wohnungen», der Knopf darunter heisst aber «Filter zurücksetzen». |

## Beobachtungen

- Die Wohnungskarte zeigt nur den Gebäudenamen, nicht die Strasse. Bei der Suche nach «Seeweg» kommen vier Wohnungen, aber auf keiner Karte sehe ich, warum sie passen.
- Ist zusätzlich das Gebäude «Alpenblick» gewählt und ich suche «A1», nennt die leere Meldung nur «A1», nicht den Gebäudefilter. «Wählen Sie andere Filter» hilft aber weiter.
- «Musterhaus Zurich» (ohne ü) findet nichts, «Musterhaus 101» (ohne Punkt) auch nicht. So tippe ich unterwegs schon mal. Die Meldung sagt dann richtig «Prüfen Sie die Schreibweise».
- Gross- und Kleinschreibung spielen keine Rolle («seepark a1» findet A1). Gut.
- Suchfeld und Knopf «Suchen» sind je 48 px hoch, die Seiten sind auch mit Suchtext und leerer Meldung 390 px breit (kein seitliches Scrollen). Die Enter-Taste der Tastatur startet die Suche auch.
- Die Suche bleibt in der Adresse (`?search=…`). Nach dem Suchen steht der Begriff noch im Feld.
- «13 Wohnungen» als Überschrift, auf Seite 1 stehen aber nur 12 Karten. Die 13. ist auf Seite 2 («Seite 1 von 2»). Das gab es schon vor dieser Änderung, mich hat es aber kurz irritiert.

## Aufgabe geschafft: ja

Jede Wohnung, die ich gesucht habe, kam mit einem Begriff, wie ich ihn tippe, als einziger Treffer. Auf «Gebäude» funktioniert Name plus Ort.

## Aufwand

Etwa 15 Minuten, rund 25 Suchen (17 auf «Wohnungen», 11 auf «Gebäude»), dazu zweimal «Filter zurücksetzen».

## Ablauf

1. **Übersicht → Menü → «Wohnungen».** Erwartet: Liste mit Suchfeld oben. Gesehen: Titel, Knopf «Wohnung erfassen», darunter ein Kasten mit «Suche (optional)» und dem Hilfetext «Suchen Sie nach Wohnungsnummer, Gebäudename, Strasse oder Ort. Mehrere Wörter grenzen die Suche ein, zum Beispiel «Seepark 3.02».», dann die Auswahlfelder «Gebäude» und «Mietstatus» und der Knopf «Suchen». Alles passt auf den ersten Bildschirm (Screenshot 03-wohnungen-viewport.png: Hilfetext in vier Zeilen, nichts abgeschnitten). Der Text sagt mir klar, was ich suchen kann.
2. **«Seepark A1» → Suchen.** Erwartet: Wohnung A1. Gesehen: «1 Wohnung», Karte «Wohnung A1 · Vermietet · Seepark Residenz». Die Seite springt so, dass Knopf und Treffer sichtbar sind (10-apartments-1.png).
3. **«Musterhaus 1.01».** Erwartet und gesehen: «1 Wohnung», Wohnung 1.01, Musterhaus Zentrum.
4. **«Wohnung A1» (wie auf der Karte).** Erwartet: findet trotz des Worts «Wohnung». Gesehen: «1 Wohnung», A1. Gut, das Wort stört nicht.
5. **«A1» allein:** 1 Treffer. **«Seepark Residenz B2»:** 1 Treffer, B2. **«seepark a1»:** 1 Treffer.
6. **Strasse: «Seeweg»:** 4 Wohnungen der Seepark Residenz. **«Bahnhofstrasse 42»:** die 6 Wohnungen des Musterhaus Zentrum. **«Bergstr» (abgekürzt):** die 3 Wohnungen von Alpenblick. **Ort «Luzern»:** 4 Wohnungen. Erwartet hatte ich das, aber die Karten zeigen die Strasse nicht (siehe Beobachtungen).
7. **Das Beispiel aus dem Hilfetext, «Seepark 3.02».** Erwartet: ein Treffer, weil die App es mir vorschlägt. Gesehen: Leerbild mit Lupe, «Keine Wohnungen gefunden», «Keine Wohnung passt zu «Seepark 3.02». Gesucht wird in Wohnungsnummer, Gebäudename, Strasse und Ort. Prüfen Sie die Schreibweise, wählen Sie andere Filter oder zeigen Sie alle Wohnungen.», Knopf «Filter zurücksetzen» (10-apartments-5-full.png). Die Wohnung 3.02 ist im Musterhaus, nicht im Seepark. → P-1.
8. **Begriff ohne Treffer: «Hauptstrasse 7», «Musterhaus 101».** Gesehen: dieselbe Meldung mit meinem Begriff in «…». Sie nennt meinen Begriff, wo gesucht wird und was ich tun kann. Gut. Der Knopf heisst anders als der Text (P-4).
9. **«Filter zurücksetzen» in der leeren Meldung** (mit Suche «A1» und Gebäude «Alpenblick»). Erwartet: alles leer, alle Wohnungen. Gesehen: Adresse `/apartments`, Feld leer, Gebäude «Alle Gebäude», «13 Wohnungen».
10. **Menü → «Gebäude».** Erwartet: dieselbe Hilfe wie bei den Wohnungen. Gesehen: «Suche (optional)» mit Platzhalter «Name oder Adresse», darunter ein zweites Feld «Ort (optional)» mit Platzhalter «Zürich», kein Hilfetext (41-geb-top.png). Ich dachte zuerst, «Zürich» sei schon eingetragen. → P-3.
11. **Name plus Ort im Suchfeld: «Seepark Luzern»:** 1 Gebäude, Seepark Residenz. **«Musterhaus Zürich»:** 1 Gebäude. **«Seeweg 15»:** 1 Gebäude. **«Interlaken»**, **«Luzern»:** je 1 Gebäude. Funktioniert, aber ich wusste es nur, weil ich es ausprobiert habe.
12. **Gebäude ohne Treffer: «Alpenblick Bern», «Musterhaus Zurich», «Seepark A1».** Erwartet: wie bei den Wohnungen mein Begriff in der Meldung. Gesehen: «Keine Gebäude gefunden. Kein Gebäude passt zu Ihrer Suche. Prüfen Sie die Schreibweise oder zeigen Sie alle Gebäude.» Mein Begriff steht nicht drin (40-geb-ort-2-full.png). → P-2.
13. **Gebäude mit beiden Feldern:** Suche «Seepark», Ort «Luzern»: 1 Treffer. Suche «Seepark», Ort «Zürich»: dieselbe Meldung ohne Begriffe. Ort «Luz» allein: Seepark Residenz.

## Verwirrung

- Das Beispiel «Seepark 3.02» passt nicht zu meinen Daten. Ich habe zuerst gedacht, die Suche mit zwei Wörtern sei kaputt.
- Auf «Gebäude» gibt es zwei Felder: «Suche» und «Ort». Ort geht aber auch im Suchfeld. Wozu dann das zweite Feld? Und ist «Zürich» schon gesetzt oder nur ein Beispiel?
- Die beiden Seiten verhalten sich in der leeren Meldung verschieden (mit / ohne Suchbegriff).
- Wörter: «Filter zurücksetzen» klingt technisch, «Alle Wohnungen zeigen» wäre für mich klarer. Ansonsten waren alle Wörter verständlich.

## Fehlerrisiken

- Wer das Beispiel abtippt, bekommt nichts und denkt vielleicht, die Wohnung fehle.
- Auf «Gebäude» weiss man bei leerem Ergebnis nicht mehr sicher, was man eingegeben hat, wenn das Handy das Feld wegscrollt (im Screenshot deckt die Kopfzeile das Ort-Feld halb zu).
- Wer «Zürich» im Ort-Feld für einen gesetzten Filter hält, sucht vielleicht gar nicht nach anderen Orten.

## Vorschläge

- **P-1:** /apartments öffnen, «Seepark 3.02» eingeben, «Suchen» antippen → «Keine Wohnungen gefunden». Hilft: ein Beispiel, das in den Demodaten etwas findet («Seepark A1» oder «Musterhaus 3.02»), oder ein neutrales wie «zum Beispiel Gebäudename und Wohnungsnummer».
- **P-2:** /buildings öffnen, «Alpenblick Bern» eingeben, «Suchen» → Meldung ohne Begriff. Hilft: dieselbe Art Text wie bei den Wohnungen, z. B. «Kein Gebäude passt zu «Alpenblick Bern». Gesucht wird in Name, Strasse und Ort. …».
- **P-3:** /buildings öffnen → nur Platzhalter, kein Hilfetext, «Zürich» im Feld «Ort». Hilft: ein sichtbarer Hilfetext unter «Suche» wie auf «Wohnungen» («Suchen Sie nach Gebäudename, Strasse oder Ort. Mehrere Wörter grenzen die Suche ein.»). Den Platzhalter «Zürich» weglassen oder als Hilfetext «zum Beispiel Zürich» schreiben. Oder das Feld «Ort» weglassen, weil die Suche den Ort schon findet.
- **P-4:** /apartments?search=Hauptstrasse+7 → Text «zeigen Sie alle Wohnungen», Knopf «Filter zurücksetzen». Hilft: Knopf und Text gleich benennen, z. B. Knopf «Alle Wohnungen zeigen».

## Nicht geprüft

- Speichern oder Bearbeiten: Auftrag war nur Anschauen.
- Andere Sprachen (fr/it/en): die Sprache hängt am Konto, das hätte andere Personas gestört.
- Eine echte Handy-Tastatur (Taste «Suchen» statt Enter): headless Chromium zeigt keine Bildschirmtastatur. Das Feld hat keinen Hinweis für die Enter-Taste gesetzt. Enter hat aber gesucht.
- Dunkelmodus und 200 % Zoom: nicht Teil von Marcos Profil.
- Suche über mehrere Seiten (mehr als 12 Treffer): die Demodaten haben nur 13 Wohnungen, kein Suchbegriff ergab mehr als 6.
