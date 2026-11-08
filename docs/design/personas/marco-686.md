# Marco – #686 (Abrechnungs-Assistent, PDF beim ersten Tippen, Hinweis zur Zahlungsfrist)

Handy 390 × 844, Touch. Gebäude: «Seepark Residenz», Abrechnungsperiode 2025. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/marco-686/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| M-1 | Minor | Abrechnung bearbeiten (`/statements/<id>/edit`), Feld «Zahlungsfrist» | Der neue Hinweis «Die Frist läuft ab dem Versand …» steht nur auf der Seite des Entwurfs. Im Formular, in dem ich die Zahlungsfrist wirklich ändere, steht nur «Bis zu diesem Datum bezahlt der Mieter die Nachzahlung.» Wenn ich dort ein festes Datum eintrage und erst später versende, verschiebt Dwello die Frist, und das sehe ich beim Eintragen nicht. |

## Beobachtungen

- Die Zahlen stimmen überein: In Schritt 2 steht bei Seepark Residenz «15 Rechnungen in der Abrechnungsperiode», in Schritt 4 «15 Rechnungen vom 01.01.2025 bis 31.12.2025». Die Rechnungsliste mit dem Filter Seepark Residenz und 2025 zeigt ebenfalls «15 Rechnungen». Im Entwurf von Thomas Weber sind auch 15 Rechnungszeilen aufgeführt (1 Kabel, je 4 Hauswart, Fernwärme und Wasser, 2 Allgemeinstrom).
- Für Seepark Residenz 2025 konnte ich nichts Neues erstellen. Alle vier Mietverträge haben schon einen Entwurf (NK-22222222-2025-0001 bis -0004, «Erstellt 07.11.2026, 18:52», also nicht von mir). Schritt 2 sagt das zwar («Keine neue Abrechnung: Alle Mietverträge haben schon eine.»), trotzdem kann ich das Gebäude ankreuzen und mich durch Schritt 3 (lange Erklärung zum Heizprofil) bis Schritt 4 klicken. Erst dort steht «Anzahl Abrechnungen 0». Das kostet mich auf dem Handy drei Bildschirme für nichts. Immerhin führt der Link «Abrechnungen von Seepark Residenz ansehen» direkt zu den Entwürfen, das hilft.
- Die Übersicht erklärt es eigentlich schon: «Noch nicht abgerechnet: … Seepark Residenz (2023, 2022, 2021)». 2025 fehlt dort, das habe ich aber erst im Nachhinein verstanden.
- Auf dem Entwurf heisst der Knopf «PDF herunterladen», nicht «PDF erstellen». In keinem der vier Seepark-Entwürfe habe ich einen Knopf «PDF erstellen» gefunden.
- Den Hinweis zur Frist auf der Entwurfsseite verstehe ich: «Die Frist läuft ab dem Versand. Versenden Sie später, verschiebt Dwello sie auf 30 Tage nach dem Versand; eine längere Frist bleibt.» Bei einer Nachzahlung steht er unter «Zahlungsfrist», bei einer Rückerstattung unter «Rückerstattung bis».
- Auf 390 px bricht das Wort «TV/Kabelanschl-uss» in der Kostenkarte mitten im Wort um, ebenso die Abrechnungsnummer im Titel («NK-22222222-2025-» / «0002»). Lesbar bleibt es trotzdem.
- Die Entwurfsseite ist auf dem Handy sehr lang (Screenshot rund 5500 px hoch). Der PDF-Knopf steht zum Glück ganz oben.

## Aufgabe geschafft: teilweise

Die Zahlen in Schritt 2 und 4 habe ich verglichen, und das PDF lädt schon beim ersten Tippen herunter. Neue Abrechnungen für Seepark 2025 konnte ich nicht erstellen, weil schon Entwürfe da waren.

## Aufwand

Etwa 15 Minuten. Assistent: 4 Schritte bis «Anzahl Abrechnungen 0», dann 1 Tippen zur Liste, 1 zum Entwurf und 1 auf «PDF herunterladen».

## Ablauf

- Schritt 2, Seepark Residenz. Erwartet: ein Gebäude, das ich für 2025 abrechnen kann. Gesehen: «Keine neue Abrechnung: Alle Mietverträge haben schon eine.», das Gebäude liess sich trotzdem wählen.
- Schritt 4. Erwartet: eine Liste der Abrechnungen, die gleich erstellt werden. Gesehen: «Anzahl Abrechnungen 0» und «Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude.»
- Entwurf öffnen. Erwartet: einen Knopf «PDF erstellen». Gesehen: «PDF herunterladen» (ein Link).
- Früh tippen. Ich habe ein langsames Handynetz nachgestellt, die Skripte der App kamen 4 s verspätet. Erwartet: Das Tippen geht vielleicht ins Leere. Gesehen: Nach 0,5 s getippt, nach 0,7 s war die Datei NK-22222222-2025-0002.pdf da (gültiges PDF, 3 Seiten, Sarah Meier, Nachzahlung CHF 141.60). Bei normaler Ladezeit kam NK-22222222-2025-0001.pdf ebenfalls beim ersten Tippen. Das klappt also wie erhofft.
- «Frist und Bemerkungen bearbeiten». Erwartet: derselbe Hinweis zur Frist wie auf der Entwurfsseite. Gesehen: nur «Bis zu diesem Datum bezahlt der Mieter die Nachzahlung. Format TT.MM.JJJJ.» (M-1).

## Vorschläge

- M-1: Entwurf NK-22222222-2025-0002 öffnen, auf «Frist und Bemerkungen bearbeiten» tippen und den Text unter «Zahlungsfrist» lesen. Es fehlt der Satz, dass die Frist ab dem Versand läuft und beim späteren Versand verschoben wird. Hilfreich wäre derselbe Hinweis direkt beim Feld, denn dort entscheide ich über das Datum.

## Nicht geprüft

- Neue Abrechnungen für Seepark 2025 erstellen und speichern: Alle Mietverträge hatten schon Entwürfe, und fremde Entwürfe wollte ich nicht löschen.
- Einen Knopf «PDF erstellen»: Er war auf keinem der vier Entwürfe vorhanden. Geprüft habe ich deshalb «PDF herunterladen».
- «Früh tippen» bei echtem Mobilfunk: Nachgestellt habe ich es mit 4 s verzögerten App-Skripten. Wenn ich auch das CSS verzögerte, zeichnete der Browser die Seite gar nicht, dann gab es auch nichts zu tippen.
