<!-- Persona run session 11 (steps A–D) on 7890141; screenshots stayed in the session's scratchpad, not in the repository -->

# Persona-Lauf Sven (45, Screenreader, nur Tastatur) – Session 11

Desktop 1440×900, `keyboardOnly: true`. Gesteuert nur mit Tab, Shift+Tab, Enter, Pfeiltasten, Escape. Die «Ansage» habe ich aus dem
Accessibility-Tree gelesen (Name, `aria-describedby`, `aria-invalid`) und aus den Live-Regionen mitgeschnitten (MutationObserver auf
`aria-live`/`role=status`/`role=alert`). Ein echter Screenreader (NVDA/JAWS) war nicht verfügbar; die Ansagen sind daraus abgeleitet.

Hinweis: Die App war zwischendurch wegen eines Neubaus kurz nicht erreichbar; die betroffenen Schritte habe ich wiederholt. Kein Finding der App.

## Ergebnis

**Aufgabe geschafft: ja.** Mieter «Sven Test» neu erfasst (aus dem Assistenten heraus), Wohnung OG2 Alpenblick, Beginn 01.11.2026,
unbefristet, Nettomiete 1480, Akonto 190. Mietvertrag gespeichert (`/contracts/09e8a074-…`). Keine fremden Daten geändert; «Als bezahlt
markieren» und Tankbestand nur geöffnet bzw. mit Fehleingaben geprüft, nichts gespeichert.

**Aufwand:** ca. 15 Minuten echte Nutzerzeit. Vom Dashboard 22× Tab bis «Mietvertrag erfassen» (Skip-Link hilft auf den Folgeseiten:
1× Tab + Enter, dann 1–5 Tabs pro Schritt). Neuer Mieter: 11 Felder, ein Fehlversuch. Assistent: 5 Schritte, je 2–6 Tasten.

## Lautes Denken, Schritt für Schritt

1. **Dashboard** (`01-dashboard.png`): Erster Tab «Zum Inhalt springen» – sehr gut. Danach 16 Navigationslinks, dann «Mietvertrag erfassen».
2. **Neuer Mietvertrag, Schritt 1** (`02-wizard-start.png`): Nach dem Seitenwechsel steht der Fokus auf `body`; angesagt wird der Seitentitel
   «Neuer Mietvertrag - Dwello» (assertive). Das reicht mir, ich springe mit dem Skip-Link in den Inhalt. Feld «Mieter, Auswahl, erforderlich,
   Die Person, die die Wohnung mietet …» – Name und Beschreibung da. Alle Mieter haben schon einen Vertrag, also «Neuen Mieter erfassen».
   - Stolperer: Beim Tabben kommt **«Abbrechen» vor «Weiter»**. Beim ersten Versuch habe ich auf Abbrechen Enter gedrückt und war auf der Liste,
     Eingaben (hier noch keine) weg, ohne Rückfrage.
   - «Weiter» ohne Mieter (`03-step1-empty.png`): Fokus springt auf das Feld, Ansage «Mieter, ungültig, … Bitte wählen Sie einen Mieter aus». Gut.
3. **Neuer Mieter** (`04-tenant-new.png`, `05-tenant-errors.png`): Jedes Feld hat Name und Beispiel als Beschreibung. Ich tippe nur «Sven» und
   drücke Enter im Feld Vorname: Fokus springt auf «Nachname, ungültig, … Nachname ist erforderlich». Gut. Aber: Es gibt **drei** Fehler
   (Nachname, Strasse, Ort); angesagt wird nur der erste. Wie viele Fehler es sind, erfahre ich erst beim Weitertabben.
   Nach dem Speichern (`06-back-in-wizard.png`) bin ich wieder im Assistenten, Fokus auf der Meldung «Mieter erfasst. Sven Test ist gespeichert
   und für diesen Mietvertrag gewählt.» – vorbildlich.
4. **Schritt 2 Wohnung** (`07-step2.png`): Fokus auf Überschrift «Schritt 2 von 5: Wohnung» – genau richtig. Die Auswahl sagt «nicht verfügbar»
   bei vermieteten Wohnungen, die sind deaktiviert; freie zuoberst. Mit Pfeil runter gewählt. Danach Ansage «Entwurf gespeichert, 00:47»
   (role=status) – beruhigend, kommt aber bei jeder Änderung.
   Im Fortschritt sind erledigte Schritte Knöpfe «Mieter (erledigt)» – gut verständlich. Ab Schritt 2 gibt es kein «Abbrechen» mehr.
5. **Schritt 3 Vertragsdauer** (`08-step3.png`):
   - «Weiter» bei leerem Beginn (`11-beginn-leer.png`): Fokus aufs Feld, «Vertragsbeginn ist erforderlich». Gut.
   - **30.02.2026 + Enter, ohne das Feld zu verlassen** (`09-datum-unmoeglich.png`): Fokus bleibt im Feld, assertive Ansage «Dieses Datum gibt es
     nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel 31.12.2025.» Gut angesagt. Im Accessibility-Tree steht der Fehlertext aber
     **zweimal** hintereinander (sichtbar nur einmal) – im Lesemodus höre ich ihn doppelt. Der Satz unterstellt ein Formatproblem, obwohl das
     Format stimmt.
   - **Datum in Worten** (`10-datum-in-worten.png`): Nach «01.11.2026» polite-Ansage «Sonntag, 1. November 2026», und der Text hängt per
     `aria-describedby` am Feld. Beim Tippen keine Zwischenansagen (kein «1. November 2020» bei halber Eingabe). Sehr hilfreich.
   - Kalender-Knopf «Kalender für Vertragsbeginn öffnen»: öffnet den Browser-Kalender, Pfeil rechts + Enter übernimmt das Datum, Ansage
     «Montag, 2. November 2026». Bedienbar, aber nicht nötig.
   - Radiogruppe «Vertragsdauer»: Pfeiltasten funktionieren, «Befristet» blendet «Vertragsende» ein. Der Radio-Name enthält schon den
     Hilfetext und dieselbe Beschreibung ist nochmals per describedby verbunden – **doppelte Ansage** «Befristet Der Mietvertrag endet … Der
     Mietvertrag endet …».
   - **Ende 31.10.2026 vor Beginn 01.11.2026 + Enter** (`12-ende-vor-beginn.png`): Die Prüfung läuft im Browser, kein Fokuswechsel, **keine
     Live-Ansage**. Ich höre nur «Samstag, 31. Oktober 2026» (die Worte-Ansage) und dann nichts. Die Meldung «Vertragsende muss nach
     Vertragsbeginn liegen» hängt zwar an der Beschreibung, wird aber nicht gelesen, weil der Fokus das Feld nie verlässt. Ich hätte geglaubt,
     Enter habe nicht funktioniert.
   - Enter im gültigen Datumsfeld schickt den Schritt ab → Fokus auf «Schritt 4 von 5: Miete». Gut.
6. **Schritt 4 Miete** (`14-step4.png`, `15-miete-fehler.png`): Leere Nettomiete + Enter → Fokus bleibt, «Nettomiete ist erforderlich» per
   describedby; «15oo» → «Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 1450.00 oder 1'450.» Beide Male **keine Live-Ansage**
   (Fokus bleibt im selben Feld) – gleiches Problem wie oben. Der Hinweis «Kein Akonto – Ohne Akonto bezahlt der Mieter alle Nebenkosten erst
   mit der Nebenkostenabrechnung» ist nicht mit dem Akonto-Feld verbunden; beim Tabben höre ich ihn nicht. «Monatlich total CHF 1’670.00»
   ändert sich still (keine Live-Region); bei «15oo» stand dort «CHF 15.00».
7. **Schritt 5 Prüfen** (`16-step5.png`): Fokus auf Überschrift, Definitionsliste mit Knöpfen «Mieter ändern», «Vertragsbeginn ändern» …
   eindeutig benannt. «Vertragsbeginn ändern» setzt den Fokus direkt ins Feld – sehr gut. Danach führt «Weiter» aber zu Schritt 4 statt
   zurück zur Prüfung; ich muss nochmals durch.
8. **Speichern** (`17-gespeichert.png`): Fokus auf «Mietverträge» (h1), Ansage «Mietvertrag von Sven Test gespeichert» (role=status).
   Mein Vertrag steht in der Liste als «Künftig ab 01.11.2026». Sehr gut.
9. **«Bezahlt am»** (`19-bezahlt-dialog.png`, `21-detail-bezahlt.png`): Ein Datumsfeld «Bezahlt am» gibt es nicht. «Als bezahlt markieren»
   öffnet einen Dialog («Das heutige Datum wird als Zahlungsdatum eingetragen»), Fokus auf «Abbrechen», Fokus bleibt im Dialog,
   Escape schliesst und gibt den Fokus an den auslösenden Knopf zurück. Vorbildlich. Ich habe abgebrochen.
   Auf der Abrechnungsliste und -seite steht der Fokus nach dem Seitenwechsel auf `body` (nur Titelansage).
10. **Tankbestand** (Seepark Residenz, `22-tank-datum-unmoeglich.png`, `23-tank-leer.png`, `24-tank-wert-ungueltig.png`): Felder Stichtag,
    Wert in Franken, Kategorie – alle benannt mit Beschreibung. 30.02.2026 + Enter: Fokus ins Feld, assertive Fehleransage, **gleich danach
    assertive Titelansage «Seepark Residenz - Dwello»**, die die Fehlermeldung bei NVDA abschneiden kann (der Fokus liest sie aber nochmals
    vor). Datum in Worten «Mittwoch, 31. Dezember 2025» ist ans Feld gebunden. Wert «12oo» → Meldung «Bitte geben Sie den Wert in Franken ein»,
    obwohl ich einen Wert eingegeben habe. Nichts gespeichert. Die lange Erklärung zum Tankbestand ist nicht mit dem Feld «Stichtag»
    verbunden; die Feldbeschreibung nennt nur das Format.

## Was half

- Skip-Link als erster Tabstopp, saubere Landmarks und Überschriften.
- Fokus auf die Schritt-Überschrift nach jedem «Weiter» im Assistenten; Fortschritt «Schritt 3 von 5» als Text und Progressbar.
- Jedes Feld hat Namen und Beschreibung (Beispiel, Format TT.MM.JJJJ); Pflicht-/optional im Namen.
- Datum in Worten, per describedby ans Feld gebunden und polite angesagt – ohne Zwischenansagen beim Tippen.
- Fehler bei Serverprüfung: Fokus auf das erste fehlerhafte Feld, Meldung in der Beschreibung.
- Mieter aus dem Assistenten heraus anlegen und mit Fokus auf der Erfolgsmeldung zurückkehren.
- Prüfseite mit eindeutig benannten «… ändern»-Knöpfen, Fokus direkt ins Feld.
- Bestätigungsdialog «Als bezahlt markieren»: Fokus auf sicherer Aktion, Fokusfalle, Escape, Fokus-Rückgabe.
- Speichermeldung als role=status nach dem Speichern.

## Findings

| # | Schwere | Ort | Beschreibung | Bild |
|---|---|---|---|---|
| 1 | **hoch** | Assistent Schritt 3 (Vertragsende vor Beginn), Schritt 4 (Nettomiete leer / ungültig) | Prüfung im Browser bei Enter ohne Fokuswechsel und ohne Live-Region: Fehlermeldung wird nicht angesagt. Nutzer glaubt, Enter sei wirkungslos. Inkonsistent zu «30.02.2026», das assertive angesagt wird. | `12-ende-vor-beginn.png`, `15-miete-fehler.png` |
| 2 | mittel | Neuer Mieter (und jedes Formular mit mehreren Fehlern) | Nur der erste Fehler wird angesagt; keine Zusammenfassung «3 Angaben fehlen». | `05-tenant-errors.png` |
| 3 | mittel | Assistent Schritt 1 | «Abbrechen» steht in der Tab-Reihenfolge vor «Weiter» und verlässt den Assistenten ohne Rückfrage. Ab Schritt 2 fehlt «Abbrechen» ganz. | `02-wizard-start.png`, `07-step2.png` |
| 4 | mittel | Schritt 4 Miete | Hinweis «Kein Akonto … erst mit der Nebenkostenabrechnung» nicht mit dem Akonto-Feld verbunden; «Monatlich total» ändert sich still. | `14-step4.png` |
| 5 | niedrig | Prüfen → «… ändern» → «Weiter» | Führt zum nächsten Schritt statt zurück zur Prüfung; zusätzliche Schritte. | `16-step5.png` |
| 6 | niedrig | Datumsfelder (Assistent) | Fehlertext «Dieses Datum gibt es nicht» steht doppelt im Accessibility-Tree (Lesemodus liest ihn zweimal); Text verweist auf das Format, obwohl das Format stimmt. | `09-datum-unmoeglich.png` |
| 7 | niedrig | Radiogruppe Vertragsdauer | Hilfetext ist Teil des Namens und zusätzlich Beschreibung → doppelte Ansage. | `08-step3.png` |
| 8 | niedrig | Tankbestand, alle Formulare mit Server-Rundreise | Nach der Fehleransage (assertive) folgt sofort die assertive Titelansage der Seite und kann sie überschreiben. | `22-tank-datum-unmoeglich.png` |
| 9 | niedrig | Tankbestand «Wert in Franken» | Ungültiger Wert «12oo» meldet «Bitte geben Sie den Wert … ein», als wäre das Feld leer. Stichtag-Feld ohne Bezug zur langen Erklärung. | `24-tank-wert-ungueltig.png` |
| 10 | niedrig | Seitenwechsel allgemein (Dashboard → Assistent, Liste → Abrechnung) | Fokus bleibt auf `body`, nur der Titel wird angesagt; Fokus auf h1 wie nach dem Speichern wäre konsistenter. | `02-wizard-start.png`, `20-abrechnung-detail.png` |
| 11 | niedrig | Entwurfsstatus | «Entwurf gespeichert, HH:MM» (role=status) bei jeder Änderung – auf Dauer gesprächig. | `09-datum-unmoeglich.png` |

Nicht erreichbar: ein Datumsfeld «Bezahlt am» – «Als bezahlt markieren» setzt immer das heutige Datum (kein Finding, nur Hinweis).

## Verbesserungsvorschläge

1. Browserseitige Prüfungen (Ende vor Beginn, Betrag) wie das unmögliche Datum über die vorhandene assertive Live-Region ansagen, oder
   bei Enter den Fokus kurz neu setzen; gleiche Ansage für alle Fehlerarten.
2. Bei mehreren Fehlern eine kurze Zusammenfassung (role=alert) «3 Angaben fehlen: Nachname, Strasse, Ort» mit Links zu den Feldern.
3. «Weiter» vor «Abbrechen» in der DOM-Reihenfolge; «Abbrechen» in allen Schritten anbieten und bei vorhandenen Eingaben nachfragen.
4. Akonto-Hinweis per `aria-describedby` ans Feld; «Monatlich total» als polite Live-Region (oder erst beim Verlassen des Feldes).
5. Aus «… ändern» heraus «Zurück zur Prüfung» anbieten.
6. Doppelte Fehlermeldung im Datumsfeld entfernen; Text für gültiges Format, aber unmögliches Datum: «Den 30. Februar gibt es nicht.
   Bitte prüfen Sie Tag und Monat.»
7. Radio-Name nur «Befristet»/«Unbefristet», Erklärung nur als Beschreibung.
8. Titelansage nach Formular-Rundreise unterdrücken, wenn eine Fehlermeldung angesagt wird.
9. Fehlertext bei ungültigem Betrag: «Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 2650.00.»
