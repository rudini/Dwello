# Persona-Lauf: Marco – Issue #125, Runde 2 (PDF einer gelöschten Abrechnung)

Marco, 38, Smartphone (390 × 844, Touch), wenig Zeit. Persona-App auf http://localhost:3300 (Datenbank `dwello_persona`, frisch mit Demodaten). Gelöscht nur im Gebäude «Musterhaus Zentrum».

Aufgabe: Den Entwurf 2025 von Anna Schmidt (Musterhaus Zentrum, Wohnung 1.02) in einem Tab öffnen, die Liste in einem anderen. In einem dritten Tab löschen, dann in der Detailseite «PDF herunterladen» und in der Liste «PDF» antippen. Auf Deutsch, dann auf Italienisch über das Sprachmenü, jeweils hell und dunkel. Bewertet werden nur die Seite danach und der Weg zurück.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-125-2/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Seite «Abrechnung nicht gefunden.» (nach «PDF herunterladen» in der Detailseite und nach «PDF» in der Liste) | Die Seite sieht nicht nach Dwello aus. Es gibt keine Kopfzeile, kein Logo und kein Menü. Der Link «Zu den Nebenkostenabrechnungen» ist schwarz bzw. weiss unterstrichen, wie der übrige Text, und nicht als Knopf erkennbar. Die normale Dwello-Seite für «Diese Seite gibt es nicht.» hat dagegen Kopfzeile, Bild, Erklärung und zwei Knöpfe. Ich weiss kurz nicht, ob ich noch in Dwello bin. |
| P-2 | Minor | dieselbe Seite | Der Satz sagt weiterhin nur «Abrechnung nicht gefunden.» und nicht, warum. Dass die Abrechnung wahrscheinlich gelöscht wurde, steht nirgends. Der Link zeigt mir jetzt, wohin ich gehen kann; das ist gut. Ein Satz wie «Sie wurde möglicherweise gelöscht.» fehlt aber. |
| P-3 | Nit | dieselbe Seite, Tab-Übersicht | Der Tab heisst jetzt «Nebenkostenabrechnungen - Dwello» (it: «Conteggi spese accessorie - Dwello»), also genau wie der Tab mit der Liste. In der Tab-Übersicht sehe ich zwei gleich benannte Tabs und weiss nicht, welcher die Fehlermeldung zeigt. Die normale Fehlerseite heisst «Fehler - Dwello». |

Behoben gegenüber Runde 1: Die Schrift ist jetzt gut lesbar (16 px, Seite 390 px breit, kein Zoomen, kein seitliches Scrollen). Es gibt einen Weg zurück, und der Tab hat einen Titel. Hell und dunkel funktionieren beide, Deutsch und Italienisch auch.

## Beobachtungen

- Nach dem Löschen landet Tab A wieder auf der **ungefilterten** Liste («16 Abrechnungen», zwei Seiten), obwohl ich vorher in der Entwurfsliste war. Die Meldung «Abrechnung NK-11111111-2025-0002 gelöscht» überdeckt teilweise das Feld «Gebäude (optional)» (Screenshot `04-A-after-delete.png`). Das war schon in Runde 1 so.
- Der Link auf der Fehlerseite führt ebenfalls zur ungefilterten Liste `/statements`, nicht zur Entwurfsliste, aus der ich kam.
- Die Detailseite der gelöschten Abrechnung zeigt jetzt die normale Dwello-Fehlerseite «Diese Seite gibt es nicht.» mit «Zurück» und «Zur Übersicht» (`11-detail-deleted.png`). Auch hier steht nicht, dass die Abrechnung gelöscht wurde. Die beiden Fehlerseiten sehen ganz verschieden aus.
- Die Zahl der Entwürfe sank von 7 auf 5. Vermutlich hat die andere Persona in «Seepark Residenz» gleichzeitig gelöscht; das ist kein Befund.
- Das PDF von Anna war schon erstellt («PDF erstellt 15.10.2026, 09:34»), ich musste es nicht erzeugen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 14 Schritte: Liste öffnen, Anna antippen, zweiten Tab öffnen, löschen und bestätigen, 2 PDF-Taps auf die gelöschte Abrechnung, 2 Taps auf den Link zurück, Zurück-Geste, dunkler Modus (2 Aufrufe), Sprachmenü → Italiano, 3 Aufrufe auf Italienisch, 1 Tap auf den Link zurück.

## Ablauf

1. **Liste der Entwürfe (Tab C), Anna Schmidt antippen (Tab A), Detailseite in Tab B.**
   - Erwartet: Detailseite mit Download-Knopf.
   - Gesehen: «Abrechnung NK-11111111-2025-0002», Anna Schmidt, Musterhaus Zentrum, Wohnung 1.02, Link «PDF herunterladen». Das PDF war bereits erstellt.
2. **Tab A: «Abrechnung löschen», Dialog bestätigen.**
   - Erwartet: Rückfrage mit Folgen.
   - Gesehen: «Die Abrechnung NK-11111111-2025-0002 von Anna Schmidt wird gelöscht. Das lässt sich nicht rückgängig machen.» Danach ungefilterte Liste mit Meldung (siehe Beobachtungen).
3. **Tab B (alter Stand): «PDF herunterladen» antippen.**
   - Erwartet: lesbarer Hinweis und ein Weg zurück.
   - Gesehen: weisse Seite, oben links «Abrechnung nicht gefunden.» in normaler Grösse und darunter der unterstrichene Link «Zu den Nebenkostenabrechnungen» (`05-B-gone-de-light.png`). Gut lesbar ohne Zoomen. Der Link ist 48 px hoch und 267 px breit, also gut zu treffen, wirkt aber wie normaler Text. Kein Dwello-Kopf.
4. **Tab C (alter Stand): «PDF» bei Anna Schmidt antippen.**
   - Erwartet: dasselbe.
   - Gesehen: identische Seite im gleichen Tab (`06-C-gone-de-light.png`).
5. **Link «Zu den Nebenkostenabrechnungen» in Tab C und B antippen.**
   - Erwartet: zurück in der Liste, aktueller Stand.
   - Gesehen: Liste `/statements` mit aktuellem Stand; Anna ist weg (`07-C-after-link.png`, `08-B-after-link.png`). Ungefiltert, nicht «Entwurf».
6. **Zurück-Geste in Tab B nach dem Link.**
   - Erwartet: wieder die Fehlerseite.
   - Gesehen: wie erwartet, dieselbe Seite (`09-B-back-gesture.png`).
7. **Dunkler Modus, Deutsch: beide PDF-Adressen erneut.**
   - Erwartet: dunkle Seite, gut lesbar.
   - Gesehen: fast schwarzer Hintergrund, weisse Schrift, Link weiss unterstrichen (`12-B-gone-de-dark.png`, `13-C-gone-de-dark.png`). Gut lesbar, kein greller weisser Kasten.
8. **Link antippen, dann Sprachmenü «Sprache: Deutsch» → «Italiano».**
   - Gesehen: Menü mit Deutsch, Français, Italiano, English (`15-lang-menu.png`). Danach heisst die Liste «Conteggi spese accessorie».
9. **Italienisch, dunkel und hell: beide PDF-Adressen der gelöschten Abrechnung.**
   - Weil Anna nicht mehr in der Liste steht, habe ich die Adressen aus den alten Tabs erneut aufgerufen.
   - Gesehen: «Conteggio non trovato.» und der Link «Ai conteggi spese accessorie», Tab-Titel «Conteggi spese accessorie - Dwello», Sprache der Seite Italienisch (`16-B-gone-it-dark.png`, `17-C-gone-it-light.png`, `18-B-gone-it-light.png`). Kein Deutsch.
10. **Link «Ai conteggi spese accessorie» antippen.**
    - Gesehen: italienische Liste (`19-list-it.png`).

## Verwirrung

- «Abrechnung nicht gefunden.» klingt weiterhin nach Tippfehler oder Störung. Ich habe selbst gelöscht und wusste es; wer den alten Tab später findet, nicht.
- Die schlichte Seite ohne Dwello-Kopf wirkt wie eine Systemmeldung. Die andere Fehlerseite von Dwello sieht ganz anders aus.
- Zwei Tabs heissen «Nebenkostenabrechnungen - Dwello»: welcher ist die Liste?

## Fehlerrisiken

- Weil der Link wie Text aussieht, tippe ich vielleicht nicht darauf und nehme die Zurück-Geste. Dann sehe ich in Tab B wieder den alten Stand der gelöschten Abrechnung (Runde 1).
- In der Tab-Übersicht wechsle ich wegen des gleichen Titels in den falschen Tab.

## Vorschläge

- **P-1:** Mobil einen Entwurf in zwei Tabs öffnen, in einem löschen, im anderen «PDF herunterladen» antippen. Hilfreich wäre dieselbe Darstellung wie die Dwello-Seite «Diese Seite gibt es nicht.»: Kopfzeile oder wenigstens das Dwello-Logo, und der Link als Knopf gestaltet.
- **P-2:** Gleiche Schritte. Hilfreich wäre ein zweiter Satz: «Sie wurde möglicherweise gelöscht. Öffnen Sie die Liste der Nebenkostenabrechnungen.» (in allen Sprachen).
- **P-3:** Gleiche Schritte, dann die Tab-Übersicht öffnen. Hilfreich wäre ein Titel wie «Abrechnung nicht gefunden - Dwello».

## Nicht geprüft

- Ein echtes Handy mit PDF-Anzeige: Die Test-Chromium zeigt PDFs nicht an.
- Auf Italienisch habe ich die gelöschte Abrechnung nicht über einen angetippten Knopf erreicht, sondern über die Adressen aus den alten Tabs. Nach dem Löschen steht Anna in keiner Liste mehr, und löschen konnte ich nur einmal.
- Die zweite Zurück-Geste in Tab B (zurück auf die alte Detailseite): Das Skript brach dort ab, und ich konnte die Abrechnung nicht ein zweites Mal löschen, um es zu wiederholen.
- Französisch und Englisch. Andere Fehler als «gelöscht»: Der Auftrag nannte keine Anfrage, die fehlschlagen sollte.
