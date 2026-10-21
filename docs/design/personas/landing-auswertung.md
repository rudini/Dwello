# Auswertung Fragebogen Landing Page

Fünf Personas haben die Landing Page (`marketing/index.html`, Stand `aa3c2da`) mit dem Fragebogen `landing-fragebogen.md` beurteilt, jede mit ihrem Viewport und ihrer Eingabeart. Einzelberichte: `helga-landing.md`, `marco-landing.md`, `weber-landing.md`, `sven-landing.md`, `anna-landing.md`. Die Demo (`demo.dwello.ch`), GitHub und die Installation selbst konnte keine Persona prüfen, weil sie aus der Sandbox nicht erreichbar waren.

## Noten (1 = trifft gar nicht zu, 5 = trifft voll zu)

| Frage | Helga | Marco | Dr. Weber | Sven | Anna | Ø |
|---|---|---|---|---|---|---|
| 2 Angesprochen | 3 | 4 | 4 | 4 | 3 | 3.6 |
| 4 Vertrauenswürdig | 4 | 4 | 3 | 4 | 4 | 3.8 |
| 5 Verständlich | 2 | 3 | 4 | 3 | 2 | 2.8 |
| 6 Verfügbar oder geplant | 4 | 4 | 3 | 4 | 5 | 4.0 |
| 7 Bilder zeigen die Arbeit | 4 | 2 | 4 | 4 | 4 | 3.6 |
| 11 Datenschutz und «gratis» glaubhaft | 4 | 4 | 3 | 4 | 4 | 3.8 |
| 12 Weiss, wie anfangen | 2 | 2 | 3 | 3 | 2 | **2.4** |
| 14 Gefunden, was gesucht | 3 | 2 | 4 | 4 | 4 | 3.4 |
| 15 Lesbar und bedienbar | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 17 Würde ausprobieren | 2 | 3 | 3 | 3 | 3 | 2.8 |
| 18 Würde empfehlen | 2 | 2 | 2 | 3 | 3 | **2.4** |

Am besten bewertet werden Lesbarkeit und Bedienung (4.0) und die Kennzeichnung «Verfügbar»/«Geplant» (4.0). Am schlechtesten der Weg zum Start (2.4) und die Empfehlung (2.4). Alle fünf nennen denselben Grund: Die Seite spricht Laien an, der einzige Weg zum Start ist aber eine technische Installation.

## Befunde über alle Personas

| # | Schwere (höchste) | Befund | Genannt von |
|---|---|---|---|
| L-1 | Major | Zielgruppe und Einstieg passen nicht zusammen: «ohne Vorkenntnisse», aber im ersten Bildschirm ein `docker compose`-Befehl. Dass Laien eine Helferin brauchen oder nur die Demo haben, steht nur im FAQ ganz unten. | Helga P-1, Marco P-2, Anna P-3 |
| L-2 | Major | Die Installation ist unvollständig erklärt: `.env` und der Google-OAuth-Schlüssel werden weder erklärt noch verlinkt; «rund 15 Minuten» und «ein Docker-Befehl» unterschätzen die Arbeit. | Anna P-1, Helga P-2, Marco P-4, Dr. Weber P-9 |
| L-3 | Major | «Kopieren» im ersten Bildschirm kopiert nur Schritt 3 von 4, und der Befehl scheitert allein. | Anna P-2, Marco P-3, Dr. Weber P-9 |
| L-4 | Major | Auf dem Handy und bei 150 %/200 % Zoom verschwinden Navigation und Sprachwechsel, ohne Menü-Knopf; FAQ, Impressum und Sprache sind erst in der Fusszeile, rund 29 bis 33 Bildschirme tiefer. | Marco P-1, Helga P-4, Anna P-6 |
| L-5 | Major | Fachjargon ohne Erklärung (Docker, OAuth, Ollama, MCP, WCAG, axe, AGPL, NAS, SSH …), ausgerechnet auch im Abschnitt «Klare Wörter statt Fachjargon». | Helga P-3, Marco P-8 |
| L-6 | Major | «100 % Ihrer Daten bleiben auf Ihrem Server» widerspricht Google-Login, Adresssuche, E-Mail-Versand und externer KI; dass ein Google-Konto nötig ist, steht nur in einem Reiter. | Dr. Weber P-2, P-3 |
| L-7 | Major | Rundung: «zugunsten der Mieter», aber Guthaben unter CHF 5 werden nicht ausbezahlt. | Dr. Weber P-1 |
| L-8 | Major | Impressum und Datenschutzerklärung ohne Postadresse. | Dr. Weber P-4 |
| L-9 | Major | «Rechnet so, wie es das Mietrecht verlangt» ohne Einschränkung; das FAQ «rechtlich geprüft?» weicht auf automatische Tests aus. | Dr. Weber P-5 |
| L-10 | Minor | Seite zu lang und mit Wiederholungen (29 bis 33 Bildschirme); die wichtigste Frage «Kann ich das überhaupt?» steht fast am Schluss. | Marco P-5, Helga P-5 |
| L-11 | Minor | Die Links in der Fusszeile unter «Wissen» springen alle zu `#funktionen`. | alle fünf |
| L-12 | Minor | Der MCP-Abschnitt (geplant) steht im Präsens, als h3 unter Datenschutz, und das erfundene Chat-Beispiel wird als echter Inhalt vorgelesen. | Dr. Weber P-7, Sven P-1, P-2, Helga Q6 |
| L-13 | Minor | Links nur als «#497» usw. benannt; Sprachlinks nur «DE/FR/IT/EN». | Sven P-4, P-6, Anna P-1 |
| L-14 | Minor | Screenshots auf dem Handy unlesbar und nicht vergrösserbar; ein Bild zeigt englisch «Choose Files». | Marco P-6, Helga P-7 |
| L-15 | Minor | Kleine Bedienelemente: «Kopieren» 36 px hoch, Links in der Fusszeile 19 px. | Marco P-7 |
| L-16 | Minor | Weitere Aussagen: «0 Verstösse WCAG» beruht nur auf axe, die Vergleichstabelle verallgemeinert über Mitbewerber, «für immer» gratis, «nach DSG gebaut» ohne Hinweis auf die Verantwortung des Vermieters. | Dr. Weber P-6, P-8, P-10, P-11 |
| L-17 | Minor | Kein Hilfe- oder Kontaktweg für alle, die nicht selbst installieren können; kein Ausweg bei weniger als 16 GB Arbeitsspeicher. | Anna P-4, P-5 |
| L-18 | Nit | Heizprofile: drei im Abschnitt, vier in der Kachel; Lizenz «AGPL-3.0» gegenüber «AGPL-3.0-or-later»; «+»/«–» werden im FAQ mitgelesen; Titel und Text in Aufzählungen ohne Pause. | Dr. Weber P-12, P-13, Sven P-5, P-9 |

## Was gut ankam

- Ruhig, seriös, grosse Schrift; kein seitliches Scrollen bei 390 px und 200 %.
- Keine externen Anfragen, keine Cookies (Dr. Weber, Marco, Anna haben die Netzwerkanfragen geprüft).
- Die vier Schritte «Ihr Vermieterjahr», die Kennzeichnung «Verfügbar»/«Geplant» und ein ehrliches FAQ.
- Tastatur und Screenreader: Skip-Link, Landmarks, sichtbarer Fokus auch im Dunkelmodus, Reiter mit Pfeiltasten, native FAQ-Disclosures, konkrete Alt-Texte (Sven: kein Blocker, kein Major).
- Die rechtlichen Verweise stimmen (Art. 257a OR, Art. 28 DSG, EDÖB).

## Empfehlung: zuerst ändern

1. Den ersten Bildschirm für Laien bauen: «Demo ansehen» als Hauptaktion, die Installation als zweiten Weg mit dem Hinweis «Für die Einrichtung brauchen Sie jemanden, der sich mit Computern auskennt» (L-1, L-3).
2. Eine vollständige, verlinkte Installationsanleitung inklusive `.env` und Google-Anmeldung, zum Weitergeben an eine Helferin (L-2).
3. Ein Menü für Handy und Zoom (L-4).
4. Die Aussagen zu Datenschutz, Rundung und Mietrecht richtigstellen und eine Postadresse ins Impressum (L-6 bis L-9); das sollte `fach-reviewer` vor der Änderung prüfen.
