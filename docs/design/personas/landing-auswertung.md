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
| L-7 | Minor | Rundung: Der Satz «Kleinstbeträge unter CHF 5 werden weder gefordert noch ausbezahlt» lässt weg, dass sie als Gutschrift oder Nachforderung auf die nächste Abrechnung übertragen und mit der Schlussabrechnung beim Auszug ausgeglichen werden. So liest Dr. Weber, Guthaben verfielen. Der Befund trifft nur den Text der Seite, nicht das Verhalten der App (Korrektur des Product Owners; Dr. Weber hatte Major). | Dr. Weber P-1 |
| L-8 | entschieden | Impressum und Datenschutzerklärung ohne Postadresse. Abgelehnt: Der Product Owner hat entschieden, dass «Roger Rudin, Schweiz» und die E-Mail-Adresse genügen (Commit `873e3a5`). | Dr. Weber P-4 |
| L-9 | Minor | «Rechnet so, wie es das Mietrecht verlangt» ohne Einschränkung; das FAQ «rechtlich geprüft?» weicht auf automatische Tests aus. | Dr. Weber P-5 |
| L-10 | Minor | Seite zu lang und mit Wiederholungen (29 bis 33 Bildschirme); die wichtigste Frage «Kann ich das überhaupt?» steht fast am Schluss. | Marco P-5, Helga P-5 |
| L-11 | Minor | Die Links in der Fusszeile unter «Wissen» springen alle zu `#funktionen`. | alle fünf |
| L-12 | Minor | Der MCP-Abschnitt (geplant) steht im Präsens, als h3 unter Datenschutz, und das erfundene Chat-Beispiel wird als echter Inhalt vorgelesen. | Dr. Weber P-7, Sven P-1, P-2, Helga Q6 |
| L-13 | Minor | Links nur als «#497» usw. benannt; Sprachlinks nur «DE/FR/IT/EN». | Sven P-4, P-6, Anna P-1 |
| L-14 | Minor | Screenshots auf dem Handy unlesbar und nicht vergrösserbar; ein Bild zeigt englisch «Choose Files». | Marco P-6, Helga P-7 |
| L-15 | Minor | Kleine Bedienelemente: «Kopieren» 36 px hoch, Links in der Fusszeile 19 px. | Marco P-7 |
| L-16 | Minor | Weitere Aussagen: «0 Verstösse WCAG» beruht nur auf axe, die Vergleichstabelle verallgemeinert über Mitbewerber, «für immer» gratis, «nach DSG gebaut» ohne Hinweis auf die Verantwortung des Vermieters. | Dr. Weber P-6, P-8, P-10, P-11 |
| L-17 | Minor | Kein Hilfe- oder Kontaktweg für alle, die nicht selbst installieren können; kein Ausweg bei weniger als 16 GB Arbeitsspeicher. | Anna P-4, P-5 |
| L-18 | Nit | Heizprofile: drei im Abschnitt, vier in der Kachel; Lizenz «AGPL-3.0» gegenüber «AGPL-3.0-or-later»; «+»/«–» werden im FAQ mitgelesen; Titel und Text in Aufzählungen ohne Pause. | Dr. Weber P-12, P-13, Sven P-5, P-9 |

## Prüfung gegen die App

Die Personas kennen nur den Text der Seite. Dr. Webers Aussagen über die App sind hier gegen den Code geprüft:

| Befund | Ergebnis | Beleg |
|---|---|---|
| P-1 Rundung (L-7) | Trifft nur den Text: Ein Saldo unter CHF 5 wird übertragen und spätestens mit der Schlussabrechnung ausgeglichen; die Rundung auf 5 Rappen fällt immer zugunsten der Mieter aus. | `statement.service.ts:397`, `pdf-format.ts:20` |
| P-2 Daten verlassen den Server (L-6) | Stimmt: Die Anmeldung läuft über Google, die Adresssuche fragt `api3.geo.admin.ch` (swisstopo), E-Mails gehen über den eigenen SMTP-Server oder Resend, die KI wahlweise an einen externen Anbieter. «100 % Ihrer Daten bleiben auf Ihrem Server» und «nichts geht an uns» müssen das nennen; «nichts geht an uns» selbst stimmt. | `oauth.ts`, `building-register.ts`, `backend/src/mail/`, `.env.example` |
| P-3 Google-Konto Pflicht (L-6) | Stimmt: Im Code ist neben Google auch Microsoft eingebaut, aber produktiv muss `ALLOWED_EMAILS` gesetzt sein, und dann lehnt Dwello Microsoft-Konten ab; `docker-compose.prod.yml` reicht Microsoft gar nicht weiter. Ein Google-Konto ist also nötig, und die Seite nennt es zu spät. | `README.md` («Who may sign in»), `.env.example`, `deploy/demo/README.md` |
| P-5 Mietrecht (L-9) | Teilweise: Das FAQ sagt «Eine Rechtsberatung ersetzt das nicht» und nennt Hauseigentümerverband und Schlichtungsbehörde; ohne Einschränkung steht nur der Satz «Dwello rechnet so, wie es das Mietrecht verlangt». Deshalb Minor. | `marketing/index.html:481`, `:817` |
| P-6 WCAG (L-16) | Stimmt: Geprüft wird mit axe (`tests/a11y`); «0 Verstösse gegen WCAG 2.2 AA» behauptet mehr, als axe findet. | `marketing/index.html:425` |
| P-12 Heizprofile (L-18) | Stimmt: Es gibt vier Profile (mit «Heizung + Warmwasser»); der Abschnitt nennt drei. | `heating-profile.service.ts:5`, `marketing/index.html:499` |
| P-13 Lizenz (L-18) | Stimmt: Die Lizenz ist AGPL-3.0-or-later; die Landing Page schreibt «AGPL-3.0». | `package.json`, `marketing/index.html:780` |

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
4. Die Aussagen zu Datenschutz und Mietrecht richtigstellen, den Übertrag der Kleinstbeträge nennen (L-6, L-7, L-9); das sollte `fach-reviewer` vor der Änderung prüfen.

Zielgruppe (Product Owner): A. Laien bleiben die Zielgruppe; die Installation wird ehrlich als Aufgabe für eine Helferin beschrieben, mit vollständiger Anleitung zum Weitergeben, und die Demo wird die Hauptaktion im ersten Bildschirm.

## Wirkung, Bilder und Animationen (Fragen 20–24)

Auf die Rückmeldung eines Kollegen («kommt etwas kühl rüber») haben die fünf Personas den überarbeiteten Stand (`8d6d26c`) mit den Zusatzfragen beurteilt. Einzelberichte: `<persona>-landing-bilder.md`.

| Frage | Helga | Marco | Dr. Weber | Sven | Anna | Ø |
|---|---|---|---|---|---|---|
| 20 Wirkung (1 = kühl, 5 = warm) | 2 | 2 | 2 | 3 | 2 | **2.2** |

**Warum kühl:** nicht wegen fehlender Fotos, sondern wegen der Technik zwischen den warmen Sätzen: «Ihr Server.» als hervorgehobenes Schlusswort der Überschrift, Zahlen wie «48 px» und «7 : 1», die Formel `{area} / {area_total}`, das Terminal, viele gleich aussehende Karten und Tabellen-Bildschirmfotos, die auf dem Handy und bei 150 % kaum lesbar sind. Die warmen Sätze («Ihr Vermieterjahr», «Für Menschen, die das nur ein paar Mal im Jahr machen», «Im Frühling ist die Abrechnung schnell gemacht») gehen dazwischen unter. Dr. Weber liest die Sachlichkeit als Plus für die Glaubwürdigkeit.

**Bilder:** Alle fünf lehnen Stockfotos, erfundene Kundenstimmen, Bilder von Rechenzentren und Roboter für die KI ab. Die App-Bilder bleiben, sollen aber lesbar sein (auf dem Handy die Handy-Fotos, Ausschnitte vergrössert und beschriftet). Gewünscht: Strichzeichnungen im Stil der vorhandenen Zeichnung «Haus mit Server» (ein Schweizer Mehrfamilienhaus, der Brief mit QR-Zahlteil, den die Mieterin bekommt).

**Ideen, nach Zahl der Nennungen:**

| # | Abschnitt | Idee | Erklärt | Genannt von |
|---|---|---|---|---|
| W-1 | Vier Schritte | Das Vermieterjahr als Zeitleiste Januar bis Dezember: wann was zu tun ist | den Ablauf übers Jahr | Anna, Dr. Weber, Helga, Marco, Sven |
| W-2 | Verteilschlüssel und Heizprofile | Eine Rechnung, die sich auf die Wohnungen verteilt, mit Demo-Zahlen statt der Formel (z. B. Lift CHF 1'690.00, 1/6 = CHF 281.67) | den Verteilschlüssel | alle fünf |
| W-3 | Rechnungen und KI | Upload als Abfolge in drei Bildern: Datei ziehen, KI füllt aus, «Bitte prüfen», bestätigen | was «Drag & Drop» und die KI tun | alle fünf |
| W-4 | ganze Seite | Ein durchgehendes Beispiel mit Namen: Musterhaus Zentrum, Hans Müller zahlt CHF 215.80 nach, Marco Bernasconi bekommt seine Abrechnung auf Italienisch | macht die Seite persönlich | Anna, Dr. Weber, Marco, Sven |
| W-5 | Erster Bildschirm | Überschrift auf den Nutzen statt auf den Server, dazu eine Strichzeichnung «Haus → Abrechnung → Mieterin» | wofür Dwello da ist | Anna, Helga, Marco |
| W-6 | Datenschutz | Ruhige Zeichnung: was auf Ihrem Server bleibt und was nach aussen geht | die Datenflüsse | Dr. Weber |
| W-7 | Swiss QR-Rechnung | Eine Zeile wechselt von offen auf bezahlt | den Zahlungseingang | Anna, Marco, Sven |
| W-8 | Bildschirmfotos | Alt-Texte, die die Bedeutung sagen statt den Bildschirm aufzuzählen; Links nach ihrem Ziel benennen statt «#497» | Screenreader-Nutzern dasselbe wie das Bild | Sven |

**Bedingungen für jede Bewegung** (alle fünf, Sven ausführlich): startet nur auf Klick oder einmal beim Hineinscrollen, keine Schleife, kein Autoplay; über 5 s mit Pause-Knopf, per Tastatur bedienbar (WCAG 2.2.2); `prefers-reduced-motion` hält alles an (2.3.3); kein Blinken; der Inhalt steht auch als Text auf der Seite; nichts von fremden Servern; leicht (Marco: die Seite wiegt heute rund 890 KB).

**Was stören würde:** Bewegung im ersten Bildschirm, hochzählende Zahlen, einfliegende Texte beim Scrollen, Karussells, ein tippendes Terminal oder Chat, Parallax, Videos (auch eingebettet von YouTube), Siegel wie «rechtssicher», Sternbewertungen.

**Nebenbei beobachtet:** Das erste App-Bild zeigt «Noch nicht abgerechnet … 2018–2023» und wirkt auf Helga bedrohlich; das Bild des Upload-Dialogs ist unten abgeschnitten; das Handy lädt beim Öffnen rund 200 KB Bilder, die es (noch) nicht zeigt (dunkle Varianten, Handy-Foto); das Heiz-Beispiel vergleicht im Text Januar mit Juli, in der Bildunterschrift mit August.

## Abstimmung über den Claim

Der Product Owner hat entschieden, den Claim «Ihre Liegenschaft. Ihre Daten. Ihr Server.» zu ersetzen (W-5), und die Personas über drei Varianten abstimmen lassen; jede sah nur den ersten Bildschirm, in eigener Reihenfolge. Einzelberichte: `<persona>-landing-claim.md`. Punkte: 1. Rang 3, 2. Rang 2, 3. Rang 1.

| Variante | Helga | Marco | Dr. Weber | Sven | Anna | Punkte |
|---|---|---|---|---|---|---|
| A «Ihre Nebenkostenabrechnung, einfach gemacht.» | 1. | 3. | 2. | 2. | 1. | 11 |
| B «Ihre Nebenkostenabrechnung, ohne Excel und ohne Abo.» | 2. | 2. | 1. | 1. | 2. | **12** |
| C «Ihre Liegenschaft. Ihre Abrechnung. Ganz einfach.» | 3. | 1. | 3. | 3. | 3. | 7 |

- **B** nennt zwei prüfbare Erleichterungen (Dr. Weber, Sven: einziger Claim mit einem konkreten Grund weiterzulesen). Aber «ohne Excel» spricht Erfahrene an, nicht Anfängerinnen (Helga, Anna), «ohne Abo» steht im ersten Bildschirm zweimal mehr und ist nur halb wahr, wenn eine bezahlte externe KI läuft (Dr. Weber: «ohne Abo-Gebühr für Dwello»), «ohne Excel» wiederholt die erste h2.
- **A** beruhigt Anfängerinnen am meisten (Helga, Anna); «einfach» verspricht neben dem Hinweis zur Einrichtung etwas viel (Helga: «einfacher gemacht»), für Sven eine Floskel.
- **C** wirkt am wärmsten, sagt aber nicht, welche Abrechnung, und «Liegenschaft» passt nicht zu einer einzelnen Wohnung; Marco wählte es nur, weil A und B auf dem Handy abgeschnitten waren.
- **Fehler, unabhängig vom Ergebnis:** Bei 390 px ist «Nebenkostenabrechnung» in 40 px Schrift breiter als der Bildschirm und wird abgeschnitten (Marco); nötig ist eine Trennstelle.
