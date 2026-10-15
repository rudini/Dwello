# Persona Dr. Weber – Dokumente zu Mietern, Runde 2 (upload174-2)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, 100 %, Maus.
App: http://localhost:3300 (Persona-Stack, frische Demodaten). Nur angesehen: nichts gespeichert, hochgeladen oder gelöscht; Löschdialoge nur geöffnet und mit «Abbrechen» bzw. Escape geschlossen. Den Knopf «Datei herunterladen» habe ich einmal angeklickt (lädt nur herunter, ändert nichts).
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ef0e447-cbd4-5868-810d-381376519773/scratchpad/weber-upload174-2/` (r1.mjs–r3.mjs, 01–06*.png).
Runde 1: `docs/design/personas/weber-upload174.md`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-8 | Nit | Mieter, Dialog «Marco Bernasconi löschen?» | «Ihre hochgeladenen Dokumente bleiben deshalb auch.» ist doppeldeutig: Am Satzanfang kann «Ihre» «Ihre (Sie, Vermieter)» oder «ihre (die des Mieters)» heissen. Gemeint ist wohl «die Dokumente dieses Mieters». Zudem ist «deshalb» etwas schief: Die Dokumente bleiben nicht wegen der Abrechnungen, sondern weil nur der Mieter gelöscht würde. Verständlich bleibt es trotzdem. |

### Stand der Befunde aus Runde 1

| ID | Runde 1 | Stand jetzt |
|---|---|---|
| P-1 (Major) | Mieterlöschdialog sagt nicht, dass hochgeladene Dateien bleiben und einzeln zu löschen sind | **Behoben.** Bei Marco Bernasconi (Mietvertrag, ein hochgeladenes Dokument) sagt der Dialog jetzt: «Mieter mit Mietverträgen bleiben erhalten, weil Abrechnungen und Dokumente auf sie verweisen. Ihre hochgeladenen Dokumente bleiben deshalb auch. Löschen Sie sie einzeln unter «Dokumente» auf dieser Seite, sobald Sie sie nicht mehr brauchen.» Genau das wollte ich wissen. Bei Sarah Meier (ehemalig, keine Dokumente) fehlt der Zusatz, was richtig ist, weil sie nichts Hochgeladenes hat. Nur Wortwahl: siehe P-8. |
| P-3 (Minor) | Leerer Zustand «Zu versenden» behauptete, hochgeladene Dokumente erschienen dort | **Behoben.** Jetzt: «Keine Briefe zu versenden – Briefe, die Sie ausdrucken und per Post schicken müssen, erscheinen hier.» Das stimmt mit dem, was ich sehe: Das Übergabeprotokoll steht nur unter «Alle», nicht unter «Zu versenden». Einleitung unter «Alle» unverändert. |
| P-6 (Minor) | Link hiess auf der Mieterseite «PDF», in der Liste «Datei herunterladen» | **Behoben.** Auf der Mieterseite heisst der Knopf jetzt «Datei herunterladen» (mit Dokumentsymbol, 48 px hoch, Screenreader: «Datei herunterladen: Übergabeprotokoll Wohnung B2»), gleich wie in der Liste. Klick lädt die Datei «Uebergabeprotokoll-B2.pdf» herunter, die Seite bleibt stehen. |
| P-7 (Nit) | Offen, was mit Dokumenten eines Mieters ohne Mietvertrag beim Löschen geschieht | **Besteht weiter, nicht prüfbar.** Der neue Satz betrifft nur Mieter mit Mietvertrag. In den Demodaten hat jeder Mieter einen Vertrag, daher konnte ich den Dialog eines löschbaren Mieters nicht sehen und weiss nicht, ob dort steht, dass seine Dokumente mitgelöscht werden. |

## Beobachtungen

- In der Adresse des Knopfs steht `/documents/…/pdf`, auch wenn eine Datei ein Bild sein könnte. Sieht ein Nutzer nur in der Statusleiste; der heruntergeladene Dateiname war korrekt.
- Der aktive Filter («Zu versenden») ist sichtbar nur durch eine leicht getönte Füllung von «Alle» unterscheidbar; für Screenreader ist er korrekt als aktuelle Seite markiert.
- Im leeren Zustand «Zu versenden» ist «Zu den Nebenkostenabrechnungen» die Hauptaktion; für Mahnungen nachvollziehbar, aber für jemanden, der Dokumente sucht, überraschend.
- Hilfetext beim Dateifeld unverändert: «… sobald Sie sie nicht mehr brauchen» (P-2 aus Runde 1, hier nicht Teil der Aufgabe).
- Hilfetext beim Titel lautet jetzt «Ohne Titel heisst das Dokument wie die Datei, ohne Endung.» – klarer als vorher.
- Das Dateifeld zeigt im Test-Browser englisch «Choose File / No file chosen» (Browser, nicht Dwello).

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 3 Durchgänge, rund 12 Schritte (Mieterseite Marco Bernasconi, Löschdialog öffnen/abbrechen, Download-Knopf, Sarah Meier mit Löschdialog, Dokumente «Alle» und «Zu versenden»).

## Ablauf

1. **Mieter → Marco Bernasconi.** Erwartet: Knopf zur Datei nicht mehr «PDF». Gesehen (01-tenant.png): Karte «Dokumente», Zeile «Übergabeprotokoll Wohnung B2 / Hochgeladen am 30.06.2023», umrandeter Knopf «Datei herunterladen» mit Symbol, daneben rotes «Löschen». Passt.
2. **Klick auf «Datei herunterladen».** Erwartet: Datei wird geladen, Seite bleibt. Gesehen: Download «Uebergabeprotokoll-B2.pdf», kein neuer Tab, Seite unverändert (05-after-download-click.png).
3. **Kopfknopf «Löschen» (Mieter).** Erwartet: Auskunft über seine hochgeladenen Dokumente. Gesehen (02-tenant-delete.png): Dialog mit dem neuen Zusatz, «Mieter löschen» gesperrt (blass rot), «Abbrechen». Inhalt richtig; Wortlaut «Ihre … deshalb» leicht schief (P-8). Mit «Abbrechen» geschlossen, Dialog weg.
4. **Sarah Meier (ehemalig), «Löschen».** Erwartet: ohne Dokumente kein Zusatz. Gesehen (06-sarah-delete.png): nur der erste Satz; ihre Karte «Dokumente» sagt «Noch keine Dokumente.» Stimmig. Mit Escape geschlossen.
5. **Dokumente → «Alle».** Erwartet: unveränderte Einleitung, Übergabeprotokoll gelistet. Gesehen: so (Einleitung «Mahnungen und andere Schreiben an Mieter sowie Dokumente, die Sie zu Mietern hochgeladen haben. …»).
6. **Dokumente → «Zu versenden».** Erwartet: leer, und nicht mehr die Behauptung, hochgeladene Dokumente erschienen hier. Gesehen (04-documents-to-send.png): Briefsymbol, «Keine Briefe zu versenden», «Briefe, die Sie ausdrucken und per Post schicken müssen, erscheinen hier.», Knopf «Zu den Nebenkostenabrechnungen». Korrekt.

## Verwirrung

- «Ihre hochgeladenen Dokumente»: meine oder seine? (P-8)
- Was passiert mit Dokumenten eines Mieters ohne Mietvertrag beim Löschen? (P-7, nicht sichtbar)

## Fehlerrisiken

- Gering. Wer «Ihre» als «meine» liest, versteht trotzdem, dass die Dateien bleiben und er sie selbst löschen muss.

## Vorschläge

- **P-8:** Mieter → Marco Bernasconi → «Löschen». Formulieren etwa: «Mieter mit Mietverträgen bleiben erhalten, weil Abrechnungen und Dokumente auf sie verweisen. Auch die Dokumente, die Sie zu diesem Mieter hochgeladen haben, bleiben gespeichert. Löschen Sie sie einzeln unter «Dokumente» auf dieser Seite, sobald Sie sie nicht mehr brauchen.»
- **P-7:** Mieter ohne Mietvertrag mit Dokument anlegen → «Löschen». Im Dialog sagen, dass seine hochgeladenen Dokumente mitgelöscht werden (falls so).

## Nicht geprüft

- Löschdialog eines Mieters ohne Mietvertrag (P-7): keiner in den Demodaten, Anlegen war nicht erlaubt.
- «Zu versenden» mit offenen Briefen: keine Briefe in den Demodaten.
- Download einer JPG/PNG-Datei: Hochladen nicht erlaubt.
