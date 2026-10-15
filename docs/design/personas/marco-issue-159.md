# Marco – Issue 159: Suchfelder und Filter passen zur Liste (Wohnungen, Rechnungen)

Persona: Marco, 38, auf dem Handy (390 × 844, Touch). Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/marco-issue-159/`.

Bewertet wird nur, ob Suchfeld und Filter nach Filtern, Zurücksetzen, Suchen, Seitenwechsel und der Zurück-/Vor-Geste dasselbe zeigen wie die Liste darunter.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Wohnungen, Rechnungen | Habe ich eine gefilterte Liste direkt geöffnet (Lesezeichen, Adressleiste, Link von ausserhalb), etwas ins Suchfeld getippt, aber nicht auf «Suchen» getippt, und gehe zurück und wieder vor, dann steht mein ungesendeter Text im Suchfeld. Die Liste ist aber ohne diesen Text gefiltert (z. B. Suche «xyz», darunter «42 Rechnungen» aus 2024). |

## Beobachtungen

- Auf «Mietstatus» gibt es keine Option «Reserviert». Ich habe «Wiedervermietet» genommen, weil das laut Erklärung unten auf der Seite einem «reservierten» Zustand am nächsten kommt (künftiger Vertrag abgeschlossen). Ergebnis: keine Wohnung, genau wie erwartet.
- Wohnungen: Bei leerem Ergebnis gibt es zweimal «Filter zurücksetzen», einmal als Textknopf im Filterkasten und einmal als grossen Knopf in der Meldung «Keine Wohnungen gefunden». Rechnungen: Die Meldung «Keine Rechnungen gefunden – Versuchen Sie es mit anderen Filtern.» hat keinen eigenen Knopf, es gibt nur den Textknopf im Filterkasten. Die beiden Listen verhalten sich also unterschiedlich.
- Rechnungen: Die Filter stehen nicht in einem umrahmten Kasten wie bei den Wohnungen, und im Bedienungsbaum fehlt der Bereich «Suche» (search), den die Wohnungen haben.
- Wohnungen: Die Überschrift sagt «13 Wohnungen», auf Seite 1 stehen aber 12, die 13. (B2) ist auf Seite 2. Bei 13 Wohnungen auf zwei Seiten blättern ist auf dem Handy umständlich.
- Rechnungen, Suche «ewl»: genau 20 Treffer und keine Seitennavigation. Ruft man `page=2` von Hand auf, erscheint «Keine Rechnungen gefunden». Das ist stimmig, die Zahl 20 entspricht genau einer Seite.
- Das Suchfeld bei «Wohnungen» hat nur einen Platzhalter («Wohnungsnummer oder Gebäude»). Bei «Rechnungen» steht die Hilfe sichtbar über dem Feld («Rechnungssteller oder Beschreibung»).
- In den ganzseitigen Screenshots liegt die feste Kopfleiste mitten über dem Formular. Das kommt vom Screenshot, beim echten Scrollen klebt sie oben.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 10 Durchläufe. Wohnungen: rund 30 Schritte (Filter, beide Wege zum Zurücksetzen, zwei Suchen, je dreimal zurück und vor, Seite 2, Gebäudefilter, Neuladen, Detail und zurück). Rechnungen: rund 25 Schritte (Umlagefähigkeit, Seite 2, Suche, Kategorie und Jahr, eine leere Kombination, je fünfmal zurück und vor, Zurücksetzen und zurück).

## Ablauf

### Wohnungen

| Schritt | Erwartet | Gesehen |
|---|---|---|
| «Wohnungen» öffnen | Alle Wohnungen, Filter leer | «13 Wohnungen», Seite 1 von 2, Suche leer, «Alle Gebäude», «Alle» |
| Mietstatus «Wiedervermietet» (statt «Reserviert», das es nicht gibt), «Suchen» | Keine Wohnung, Filter zeigt Wiedervermietet | «Keine Wohnungen gefunden», Mietstatus «Wiedervermietet», «Filter zurücksetzen» erscheint zweimal |
| Grossen Knopf «Filter zurücksetzen» antippen (zweiter Durchlauf: den kleinen im Filterkasten) | Alle Wohnungen, alle Felder leer | Beide Wege führen zu «13 Wohnungen», Suche leer, «Alle Gebäude», «Alle». Der kleine Zurücksetzen-Knopf verschwindet. Passt. |
| Suche «1.01», «Suchen» | Nur 1.01 | «1 Wohnung», Wohnung 1.01, Suchfeld «1.01» |
| Suche «A1» (einmal mit «Suchen», einmal mit Enter) | Nur A1 | «1 Wohnung», Wohnung A1, Suchfeld «A1» |
| Zurück | 1.01 | Liste 1.01, Suchfeld «1.01» |
| Zurück | Alle | 13 Wohnungen, Felder leer |
| Zurück | Wiedervermietet, leer | «Keine Wohnungen gefunden», Mietstatus «Wiedervermietet» |
| Vor, vor, vor | Alle, dann 1.01, dann A1 | Genau so. Felder jedes Mal passend. |
| «Nächste Seite», dann Gebäude «Musterhaus Zentrum» und «Suchen» | Musterhaus, wieder Seite 1 | «6 Wohnungen», Gebäude «Musterhaus Zentrum», Seite 1 |
| «3.02» und «Leer» eingeben, ohne «Suchen» zurück, dann vor | Ungesendetes ist weg | Zurück: Seite 2, alles leer. Vor: Musterhaus, Suche leer, Status «Alle». Passt. |
| Gefilterte Liste neu laden, Felder ändern, Wohnung A1 öffnen, zurück | Liste A1, Feld «A1» | Passt |
| Gefilterte Liste direkt per Adresse öffnen, «A1» tippen ohne «Suchen», zurück, vor | Suchfeld leer wie die Liste | **Suchfeld zeigt «A1», Liste zeigt «4 Wohnungen» (Leer) ohne Suche** (P-1) |

### Rechnungen

| Schritt | Erwartet | Gesehen |
|---|---|---|
| «Rechnungen» öffnen | Alle | «83 Rechnungen», Seite 1 von 5 |
| Umlagefähigkeit «Umlagefähig», «Suchen» | Gefiltert | «82 Rechnungen», Feld «Umlagefähig» |
| «Nächste Seite» | Seite 2, Filter bleibt | Seite 2 von 5, «Umlagefähig» bleibt |
| Suche «ewl», «Suchen» | ewl, Seite 1 | «20 Rechnungen», Suche «ewl», Umlagefähig bleibt |
| Kategorie «Heizung», Jahr «2025», «Suchen» | Weniger | «4 Rechnungen», alle Felder passend |
| Suche «Brunner», Kategorie «Lift», «Suchen» | Leer | «Keine Rechnungen gefunden», Felder Brunner / Lift / Umlagefähig / 2025 |
| Fünfmal zurück | Jeder Schritt rückwärts | Jedes Mal passen die Felder genau zur Liste, auch Seite 2 mit «Umlagefähig», bis zum Anfang |
| Fünfmal vor | Jeder Schritt vorwärts | Ebenso passend |
| «Filter zurücksetzen» (nur im Filterkasten), dann zurück | Alle, dann wieder Brunner/Lift | Passt |
| Jahr 2024 über «Suchen», «xyz» tippen ohne «Suchen», zurück, vor | Suchfeld leer | Leer. Passt. |
| Gefilterte Liste direkt per Adresse öffnen (Jahr 2024), «xyz» tippen ohne «Suchen», zurück, vor | Suchfeld leer | **Suchfeld «xyz», darunter «42 Rechnungen» aus 2024 ohne xyz** (P-1, Screenshot `x-invoices-dashboard.png`) |

## Verwirrung

- «Reserviert» gibt es in Dwello nicht. Ich musste raten, dass «Wiedervermietet» gemeint sein könnte. Die Erklärung unten auf der Seite hilft dabei, steht aber erst nach der ganzen Liste.
- Bei den Wohnungen gibt es zwei verschiedene Knöpfe mit demselben Namen «Filter zurücksetzen». Beide tun dasselbe, das ist nicht schlimm, nur doppelt.

## Fehlerrisiken

- P-1: Wenn ich später zurückkomme, glaube ich, dass die Liste nach meinem Text gefiltert ist. Tatsächlich zeigt sie mehr. Bei Rechnungen könnte ich dann eine falsche Summe im Kopf haben oder eine Rechnung zum falschen Rechnungssteller öffnen. Das passiert aber nur mit Text, den ich selbst nicht abgeschickt habe, und nur nach einem Einstieg von ausserhalb der App.

## Vorschläge

- **P-1** Reproduktion: Handy 390 × 844. Zuerst `/dashboard` öffnen. Dann in der Adressleiste `/invoices?year=2024&page=1` aufrufen (oder `/apartments?status=vacant&page=1`). Ins Suchfeld «xyz» tippen, nicht auf «Suchen». Zurück-Geste, dann Vor-Geste. Das Suchfeld zeigt «xyz», die Liste «42 Rechnungen» ohne diese Suche. Wird die gefilterte Liste dagegen in der App über «Suchen» erreicht, tritt der Fehler nicht auf. Vermutlich stellt der Browser beim Zurückholen der ganzen Seite den getippten Feldinhalt wieder her. Hilfreich wäre: beim Wiederanzeigen der Seite die Felder aus der Adresse der Liste neu setzen (oder das Formular vom automatischen Wiederherstellen ausnehmen), damit die Felder immer die Filter der sichtbaren Liste zeigen.

## Nicht geprüft

- Echte Wisch-Geste auf einem echten Telefon (iOS Safari, Android Chrome). Ich habe die Zurück- und Vor-Funktion des Browsers in Chromium benutzt. Safari stellt Formulare anders wieder her, dort kann P-1 öfter oder seltener auftreten.
- Dunkler Modus und andere Sprachen: nicht Teil der Aufgabe.
- Filter Gebäude bei Rechnungen und Mietstatus «Gesperrt»: nur stichprobenartig andere Filter benutzt.
