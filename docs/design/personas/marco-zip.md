# Marco – Alle PDFs auf einmal (Slice «zip»)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Aufgabe: «Sie haben gerade die Nebenkostenabrechnungen erstellt und wollen alle PDFs auf einmal haben.» Assistent «Abrechnungen erstellen» für eine Periode ohne Abrechnungen bei einem Gebäude durchlaufen, auf dem Ergebnisbildschirm alle PDFs als eine Datei herunterladen, Knöpfe und Datei beurteilen.

Gespeichert: 3 Entwürfe für **Seepark Residenz**, Periode **01.01.2026 – 30.09.2026** (NK-22222222-2026-0001 bis -0003).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Assistent, Schritt 5, Ergebnis | Die drei Knöpfe untereinander sind unterschiedlich breit (ca. 220, 278 und 308 px) und mittig gesetzt; «Weitere Abrechnungen erstellen» bricht auf zwei Zeilen um und ist der breiteste und höchste Knopf. Wirkt unruhig, die Nebenaktion ist optisch grösser als die Hauptaktion. |
| P-2 | Minor | Heruntergeladene ZIP-Datei | Die PDFs in der ZIP heissen nur `NK-22222222-2026-0001.pdf` usw., ohne Mietername. Auf dem Handy in der Dateien-App weiss ich nicht, welches PDF zu wem gehört, ohne jedes zu öffnen. |
| P-3 | Nit | Assistent, Schritt 5, Ergebnis | «Alle als ZIP herunterladen»: Ich weiss, was ZIP ist, die meisten Vermieter in Dwellos Zielgruppe eher nicht. Der Knopf sagt nicht, dass es die PDFs sind und wie viele. |
| P-4 | Nit | Heruntergeladene ZIP-Datei | Dateiname `NK-2026-01-01-2026-09-30.zip` enthält kein Gebäude; lade ich später ein anderes Gebäude für dieselbe Periode, heissen beide ZIPs gleich. |

## Beobachtungen

- Die Hauptaktion ist klar: «Entwürfe ansehen» ist der einzige gefüllte Knopf. «Alle als ZIP herunterladen» und «Weitere Abrechnungen erstellen» sind umrandet, also Nebenaktionen. Das passt.
- Alle drei Knöpfe sind mindestens 48 px hoch, mit Symbol (Download-Pfeil auf Dokument, Plus). Kein seitliches Scrollen bei 390 px.
- Der Download ging sofort (ca. 0,2 s), Antwort `application/zip` mit `Content-Disposition: attachment`, also eine echte Datei und kein neuer Tab mit PDF-Salat.
- Inhalt der ZIP: genau 3 PDFs, je eine Seite, je ca. 3 KB, Titel «Nebenkostenabrechnung NK-…», Inhalt korrekt zur Periode (Rückerstattung des ganzen Akontos, da keine Rechnungen, so wie der Assistent gewarnt hat). Bei Rückerstattung kein QR-Einzahlungsschein, das ist logisch.
- Ein PDF (Marco Bernasconi) ist italienisch («Conteggio spese accessorie»), die anderen deutsch. Vermutlich die Sprache des Mieters; auf dem Ergebnisbildschirm steht davon nichts. Ich hätte mich kurz erschrocken, wenn ich es nicht erwartet hätte.
- Nach «Entwürfe ansehen» (Liste mit Filter Entwurf, Periode, Gebäude) gibt es keinen ZIP-Knopf mehr, nur einzelne «PDF herunterladen»-Links. Wer den Ergebnisbildschirm verlässt, bekommt «alle auf einmal» nicht mehr.
- Auf dem Ergebnisbildschirm ist der Seitentitel weggescrollt; die Karte heisst nur «Erstellen». Die Meldung «3 Nebenkostenabrechnungen sind als Entwurf erstellt.» ist aber gut sichtbar.
- Der Assistent speichert unterwegs einen Entwurf («Entwurf gespeichert, 01:16»). «Entwurf» heisst hier also zwei Dinge: der gespeicherte Assistent und die erstellten Abrechnungen.
- Während meines Laufs hat jemand anderes Alpenblick 2025 abgerechnet (zwei Entwürfe NK-33333333-2025-…, nicht von mir). Der Assistent hat mich in der Vorschau sauber aufgehalten («Alle Mietverträge haben in dieser Periode schon eine Abrechnung»), nicht erst beim Speichern.

## Aufgabe geschafft: ja

## Aufwand

Ca. 7 Minuten, davon gut 2 Minuten für die Suche nach einer freien Periode. Für den eigentlichen Weg: 5 Assistentenschritte, 1 Häkchen («Die Abrechnungen trotzdem erstellen»), «Entwürfe erstellen», dann 1 Tipp auf «Alle als ZIP herunterladen». Insgesamt etwa 9 Taps.

## Ablauf

1. **Übersicht** – Erwartet: Hinweis auf die fällige Abrechnung. Gesehen: «Nächster Schritt: Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick» mit Knopf «Abrechnungen erstellen». Gut.
2. **Schritt 1 Abrechnungsperiode** – Erwartet: Vorjahr vorgeschlagen. Gesehen: 01.01.2025 – 31.12.2025 vorausgefüllt, Wochentag darunter. Gut.
3. **Schritt 2 Gebäude** – Alpenblick steht im Assistenten zuoberst, sollte ich aber nicht nehmen. Alle anderen Gebäude sind für 2024 und 2025 schon abgerechnet; 2023 hat nirgends Rechnungen. Kurz darauf war auch Alpenblick 2025 von jemand anderem abgerechnet (Vorschau meldete 0 Abrechnungen, Weiter blieb mit Hinweis stehen). Ich habe dann 01.01.2026 – 30.09.2026 und **Seepark Residenz** gewählt.
4. **Schritt 3 Heizprofil und Verwaltungspauschale** – Standardwerte übernommen. Langer Hilfetext, auf dem Handy viel Scrollen, aber nicht Teil dieser Prüfung.
5. **Schritt 4 Vorschau** – 3 Abrechnungen, CHF 0.00 Kosten, Warnung «Rechnungen fehlen» mit Häkchen «Die Abrechnungen trotzdem erstellen». Erwartet so, Häkchen gesetzt.
6. **Schritt 5 Erstellen** – «Es werden 3 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt.» Knopf «Entwürfe erstellen». Klar.
7. **Ergebnis** (Screenshot `22-result-viewport.png`) – Erwartet: Bestätigung und ein Weg zu den PDFs. Gesehen: Häkchen-Dokument-Grafik, «3 Nebenkostenabrechnungen sind als Entwurf erstellt.», «Prüfen Sie die Entwürfe und versenden Sie sie dann.», darunter drei Knöpfe untereinander: «Entwürfe ansehen» (gefüllt, ca. 220 px breit), «Alle als ZIP herunterladen» (umrandet, ca. 278 px), «Weitere Abrechnungen erstellen» (umrandet, ca. 308 px, zweizeilig). Den ZIP-Knopf habe ich sofort gefunden.
8. **Download** – Erwartet: eine Datei mit allen PDFs. Gesehen: `NK-2026-01-01-2026-09-30.zip`, 9 KB, drei PDFs `NK-22222222-2026-0001.pdf` bis `-0003.pdf`. Inhalt passt (Nina Brunner, Marco Bernasconi auf Italienisch, Thomas Weber). Welches PDF wem gehört, sehe ich nur durch Öffnen.

## Verwirrung

- «ZIP» als Wort auf dem Knopf: für mich ok, für weniger technische Vermieter ein Fremdwort.
- «Entwurf» doppelt belegt: «Entwurf gespeichert» (Assistent) und «als Entwurf erstellt» (Abrechnungen).
- Die Karte auf dem Ergebnis heisst «Erstellen», obwohl schon erstellt ist.
- Gemischte Sprachen in der ZIP ohne Hinweis.

## Fehlerrisiken

- Ich verschicke ein PDF an den falschen Mieter, weil die Dateinamen nur Nummern enthalten (P-2).
- Ich lade zwei Gebäude derselben Periode herunter und das zweite ZIP überschreibt das erste oder heisst «(1)» (P-4).
- Ich verlasse den Ergebnisbildschirm und finde den Sammeldownload nicht wieder.
- Ich tippe auf dem Handy aus Versehen den breiten, auffälligen «Weitere Abrechnungen erstellen» statt ZIP (P-1); harmlos, aber der Ergebnisbildschirm ist dann weg.

## Vorschläge

- **P-1:** Assistent bis Schritt 5 durchlaufen, «Entwürfe erstellen» tippen, bei 390 px Breite ansehen. Hilfreich: alle drei Knöpfe gleich breit (volle Kartenbreite) und linksbündig untereinander, oder die Nebenaktionen kürzer beschriften, damit nichts umbricht.
- **P-2:** ZIP vom Ergebnisbildschirm herunterladen und entpacken. Hilfreich: Mietername (und Wohnung) im Dateinamen, z. B. `NK-22222222-2026-0001 Nina Brunner A2.pdf`.
- **P-3:** Ergebnisbildschirm ansehen. Hilfreich: «Alle 3 PDFs herunterladen» mit kurzem Hinweis darunter «als eine ZIP-Datei».
- **P-4:** ZIP herunterladen und Dateinamen ansehen. Hilfreich: Gebäudename im ZIP-Namen, z. B. `NK Seepark Residenz 01.01.2026-30.09.2026.zip`.

## Nicht geprüft

- Den ZIP-Link habe ich nicht im selben Browser-Fenster wie den Ergebnisbildschirm angetippt: Mein Skript endete nach dem Erstellen, und ein zweites Erstellen wäre abgelehnt worden. Ich habe die Adresse des Links («/statements/zip?ids=…») in einem neuen, angemeldeten Fenster geöffnet; das entspricht dem Tippen auf den Link, aber das Verhalten direkt nach dem Tippen (bleibt die Seite stehen, Rückmeldung) habe ich nicht gesehen.
- Wie iOS oder Android die ZIP-Datei öffnen (Dateien-App, Teilen) – im Testbrowser nicht möglich.
- ZIP bei mehreren Gebäuden auf einmal und mit QR-Einzahlungsschein (nur Rückerstattungen in meinem Lauf).
- Fehlerfall beim Herunterladen (keine Anfrage zum Fehlschlagen vorgegeben).
- Beträge im PDF fachlich nachgerechnet: nicht meine Aufgabe.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94414f17-b1bd-53cb-a045-3212fe00129f/scratchpad/marco-zip/`.
