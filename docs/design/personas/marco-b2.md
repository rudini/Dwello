# Persona-Lauf: Marco, Slice b2 (Abrechnungen eines Mietvertrags)

Marco, 38, Smartphone (390 × 844, Touch), wenig Zeit. Auftrag: Thomas Weber (Seepark Residenz, A1) ruft wegen seiner Nebenkostenabrechnung an. Vom Mietvertrag zu seinen Abrechnungen, prüfen, dass nur seine Abrechnungen zu sehen sind und die Seite das sagt, Status «Entwurf» ein- und ausschalten, Suche im gefilterten Stand ausprobieren, zurück zu allen Abrechnungen. Nur ansehen, nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen, nach Mietvertrag gefiltert | Die Statuskacheln zeigen die Zahlen aller Abrechnungen (7 Entwurf, 1 Versendet, 9 Bezahlt), die Liste darunter aber nur Webers 2. Tippe ich auf «7 Entwurf», steht dort 1 Abrechnung. |
| P-2 | Major | Abrechnungen, nach Mietvertrag gefiltert | Der Hinweis «Sie sehen die Abrechnungen des Mietvertrags von Thomas Weber …» steht erst nach Kacheln und Suchformular, unterhalb des ersten Bildschirms (ca. 940 px). Oben sehe ich nur die allgemeine Seite. |
| P-3 | Minor | Abrechnungsdetail | Die Brotkrümelnavigation «Nebenkostenabrechnungen» führt zu allen Abrechnungen statt zurück zu Webers gefilterter Liste. |
| P-4 | Minor | Abrechnungen, gefiltert, leeres Ergebnis | «Filter zurücksetzen» im leeren Zustand (und oben) entfernt auch den Mietvertrag-Filter. Es gibt keinen Weg, nur die Suche zu leeren und bei Weber zu bleiben. Ausserdem gibt es zwei Links mit derselben Wirkung: «Filter zurücksetzen» und «Alle Abrechnungen anzeigen». |
| P-5 | Minor | Abrechnungen, gefiltert | Das Feld «Gebäude» bietet weiterhin alle Gebäude an. Wähle ich «Alpenblick», bekomme ich «Keine Abrechnungen gefunden», obwohl Weber in der Seepark Residenz wohnt. |
| P-6 | Nit | Abrechnungen | Der Titel wird auf 390 px ohne Trennstrich mitten im Wort umgebrochen: «Nebenkostenabrechnun / gen». |
| P-7 | Nit | Statuskacheln | Die gewählte Kachel ist nur farblich hervorgehoben. Ein erneutes Tippen hebt den Filter wieder auf, darauf weist aber nichts hin. |

**Aufgabe geschafft:** ja

**Aufwand:** etwa 4 Minuten, 7 Taps bis zu Webers Abrechnungen (Menü, Mietverträge, Suche «Weber», Suchen, Thomas Weber, nach unten scrollen, Nebenkostenabrechnungen), dazu je 1 Tap für Entwurf an/aus und 1 Tap für «Alle Abrechnungen anzeigen».

## Ablauf

1. **Übersicht → Menü → Mietverträge.** Erwartet: die Mietverträge im Menü. Gesehen: «Mietverträge» unter «Verwalten», klar. Die Liste hat 11 Einträge, oben steht ein Suchfeld.
2. **Suche «Weber» → Suchen.** Erwartet: nur Weber. Gesehen: «1 Mietvertrag», Thomas Weber, Wohnung A1 · Seepark Residenz. Gut.
3. **Mietvertrag öffnen.** Erwartet: ein Link zu seinen Abrechnungen. Gesehen: Titel «Mietvertrag von Thomas Weber». Ganz unten unter «Dazu gehört» stehen «Nebenkostenabrechnungen» und «Rechnungen des Gebäudes». Ich muss weit scrollen, finde es aber. Seine Telefonnummer ist als Link anklickbar, das ist praktisch, während er anruft.
4. **«Nebenkostenabrechnungen» antippen.** Erwartet: oben steht, dass das Webers Abrechnungen sind. Gesehen: Der erste Bildschirm sieht genau aus wie die normale Seite (Titel, «Abrechnungen erstellen», Kacheln 7/1/9/0, Suche, Gebäude). Erst nach dem Scrollen kommt der Satz «Sie sehen die Abrechnungen des Mietvertrags von Thomas Weber, Wohnung A1 (Seepark Residenz), Vertragsbeginn 01.04.2022.» Darunter «2 Abrechnungen»: NK-…-2025-0001 (Entwurf, Rückerstattung CHF 34.55) und NK-…-2024-0001 (Bezahlt, Rückerstattung CHF 70.25). Inhaltlich stimmt es, es sind nur seine (P-2). Die Kacheln sagen aber «7 Entwurf» und «9 Bezahlt», zuerst dachte ich, Weber habe 7 Entwürfe (P-1).
5. **Kachel «Entwurf» antippen.** Erwartet: nur Webers Entwurf. Gesehen: «1 Abrechnung» (2025-0001), die Kachel ist hellblau hervorgehoben, der Weber-Hinweis bleibt. Richtig, aber auf der Kachel steht weiterhin «7» (P-1).
6. **Zurück zu «alle Status».** Erwartet: irgendwo ein «Alle». Gesehen: Es gibt keine Kachel «Alle». Ich habe die Entwurf-Kachel noch einmal angetippt, dann waren wieder beide Abrechnungen von Weber da, mit dem Weber-Filter. Mit dem Zurück-Knopf des Browsers kommt wieder der Entwurf-Stand. Beides funktioniert, das erneute Tippen musste ich aber erraten (P-7).
7. **Suche im gefilterten Stand.** «2024» → 1 Abrechnung (2024-0001), der Weber-Filter bleibt. «2025» mit Enter statt Taste → ebenfalls 1 Treffer, die Enter-Taste funktioniert. «Müller» → «Keine Abrechnungen gefunden. Versuchen Sie, Ihre Filter anzupassen.» Das ist korrekt, weil nur in Webers Abrechnungen gesucht wird, und der Hinweis steht direkt darüber. Entwurf + «2024» → leer, ebenfalls korrekt. Der Knopf im leeren Zustand («Filter zurücksetzen») hätte mich aber ganz aus Webers Ansicht geworfen (P-4).
8. **Gebäude «Alpenblick» bei Weber-Filter.** Leeres Ergebnis. Den Fehler macht man nicht absichtlich, das Feld lädt aber dazu ein (P-5).
9. **«Alle Abrechnungen anzeigen».** Erwartet: alle Abrechnungen. Gesehen: «17 Abrechnungen», die Kacheln sind nicht mehr hervorgehoben, das Gebäude steht auf «Alle Gebäude», der Weber-Hinweis ist weg. Gut.
10. **Abrechnung 2024 von Weber öffnen** (zusätzlich, weil er anruft). Detailseite «Abrechnung NK-22222222-2024-0001», «Thomas Weber, Seepark Residenz, Wohnung A1», «Status: Bezahlt». Die Brotkrümelnavigation «Nebenkostenabrechnungen» führt zu allen 17, nicht zurück zu Webers 2 (P-3).

Kein seitliches Scrollen auf 390 px (Seitenbreite 390).

## Verwirrung

- Die Kacheln «7 Entwurf» / «9 Bezahlt» neben «2 Abrechnungen»: Welche Zahl gilt jetzt für Weber?
- Ganz oben gibt es keinen Hinweis, dass die Liste gefiltert ist. Ich habe zuerst gedacht, der Link habe mich einfach auf die allgemeine Seite gebracht.
- Für die Aufgabe war von «Entwürfe» die Rede, auf der Kachel steht «Entwurf». Gefunden habe ich sie trotzdem.
- «Filter zurücksetzen» und «Alle Abrechnungen anzeigen» stehen untereinander. Ist das dasselbe? (Ja.)

## Fehlerrisiken

- Am Telefon sage ich Weber womöglich «Sie haben 7 offene Entwürfe», weil die Kachel das zeigt (P-1).
- Wer den Weber-Hinweis nicht sieht (unter dem Bildschirmrand), hält die 2 Abrechnungen für alle Abrechnungen des Gebäudes oder sucht nochmals (P-2).
- Ein Tap auf «Filter zurücksetzen» im leeren Zustand nach einer Tippfehler-Suche, und Webers Ansicht ist weg. Ich muss den ganzen Weg über den Mietvertrag nochmals gehen (P-4).

## Vorschläge

- **P-1** Reproduktion: Mietverträge → Thomas Weber → «Nebenkostenabrechnungen» → Kacheln zeigen 7/1/9/0, die Liste 2. Hilfreich: Mit Mietvertrag-Filter zeigen die Kacheln Webers Zahlen (1 Entwurf, 0 Versendet, 1 Bezahlt, 0 Überfällig).
- **P-2** Reproduktion: wie P-1, ohne zu scrollen. Hilfreich: Der Hinweis «Sie sehen die Abrechnungen von Thomas Weber …» mit «Alle Abrechnungen anzeigen» direkt unter den Titel, vor die Kacheln; oder der Name in der Unterzeile des Titels.
- **P-3** Reproduktion: Webers gefilterte Liste → Abrechnung 2024 → Brotkrümel «Nebenkostenabrechnungen» → 17 Abrechnungen. Hilfreich: Der Brotkrümel behält den Filter, oder auf der Detailseite steht ein Link «Zum Mietvertrag von Thomas Weber».
- **P-4** Reproduktion: gefilterte Liste → Suche «Müller» → «Filter zurücksetzen» → alle 17. Hilfreich: Im leeren Zustand bei aktivem Mietvertrag-Filter «Suche löschen» (Weber bleibt), dazu nur ein Link «Alle Abrechnungen anzeigen» statt zweier gleichwirkender.
- **P-5** Reproduktion: gefilterte Liste → Gebäude «Alpenblick» → Suchen → leer. Hilfreich: Bei Mietvertrag-Filter das Gebäude-Feld ausblenden oder auf Webers Gebäude festlegen.
- **P-6** Reproduktion: /statements auf 390 px. Hilfreich: Silbentrennung (`hyphens`, `lang="de"`) oder ein Titel, der passt.
- **P-7** Reproduktion: Kachel «Entwurf» antippen, dann eine Möglichkeit suchen, den Filter aufzuheben. Hilfreich: ein sichtbarer Text «Filter Entwurf entfernen» oder eine Kachel «Alle».

## Nicht geprüft

- Ob die gewählte Kachel für Screenreader als «aktuell» angesagt wird: Der Zugänglichkeitsbaum zeigte bei der hervorgehobenen Kachel kein Merkmal, ich bin aber kein Screenreader-Nutzer (Sven).
- PDF-Download nicht geöffnet (nur ansehen, Thema einer anderen Persona).
- Querformat und andere Sprachen nicht geprüft.
- Nichts gespeichert, wie verlangt.
