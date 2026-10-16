# Dr. Weber – Issue 229: Heizkostenanteil bei einer Abrechnungsperiode kürzer als ein Jahr

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Persona-Stack, Demodaten). Gebäude zum Speichern: «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/weber-issue-229/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine Bewertung möglich: Die Abrechnungen für 01.01.2025 – 30.09.2025 liessen sich nicht erstellen (siehe «Aufgabe geschafft»). Das PDF mit der geänderten Erklärung habe ich nie gesehen. |

## Beobachtungen

- In den Demodaten hat «Seepark Residenz» schon vier Entwürfe für 01.01.2025 – 31.12.2025 (NK-22222222-2025-0001 bis -0004, darunter Sarah Meier, NK-22222222-2025-0002). Der Assistent zeigt deshalb in Schritt 4 «Anzahl Abrechnungen 0» und schreibt: «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut.» Diesen Hinweis finde ich klar. Die Periode 01.01. – 30.09. überschneidet sich mit den Jahresentwürfen, und Dwello lehnt sie zu Recht ab.
- Schritt 3 schlägt das Heizprofil «Heizung + Warmwasser (100%)» vor. Die Monatsanteile werden als Liste gezeigt (Januar 13.6 % … Dezember 13 %). Daraus habe ich selbst gerechnet: Januar–September = 66.8 %, Januar–Juni (Sarah Meiers Mietzeit) = 55.8 %. Ihr Anteil an den Heizkosten der Periode müsste also 55.8 / 66.8 = 83.5 % sein. Im PDF konnte ich das nicht nachprüfen.
- Auf der Detailseite des bestehenden Jahresentwurfs von Sarah Meier (01.01.2025 – 31.12.2025, 181 Mietstage) steht «Heizprofil: Heizung + Warmwasser»; dort zeigt die Heizungszeile 14.3 % Anteil, die anderen Flächen-Positionen 12.71 %.
- Der Hilfetext zum Heizprofil in Schritt 3 ist sehr lang: ein Absatz mit fünf Anweisungen (Zählerstände, Entwürfe löschen, Verbrauchsabrechnung). Für mich lesbar, aber schwer zu überblicken.

## Aufgabe geschafft: nein

Blockiert bei Schritt «Abrechnungen erstellen, Schritt 4 Vorschau»: Für die Periode 01.01.2025 – 30.09.2025 entsteht keine Abrechnung, weil schon Jahresentwürfe für 2025 vorliegen. Als Nutzer hätte ich diese vier Entwürfe gelöscht, wie die App es vorschlägt. In dieser Sitzung wurde das Löschen aber durch die Berechtigungsprüfung der Umgebung verweigert (unumkehrbares Löschen). Auch das Herunterladen des bestehenden PDFs wurde verweigert. Ich habe das nicht umgangen.

## Aufwand

Etwa 10 Minuten, 9 Skriptläufe: Übersicht, Mietverträge, Assistent Schritt 1 bis 4, Abrechnungsliste, Detailseite. Danach die zwei verweigerten Versuche (Löschen, PDF).

## Ablauf

1. Übersicht. Erwartet: ein Einstieg zu den Abrechnungen. Gesehen: «Abrechnungen erstellen» unter «Als Nächstes zu tun». Passt.
2. Mietverträge. Erwartet: Sarah Meier hat am 30.06.2025 gekündigt. Gesehen: «Wohnung A2 · Seepark Residenz, Beendet 01.08.2021 – 30.06.2025, gekündigt». Passt.
3. Assistent Schritt 1. Ende auf 30.09.2025 geändert. Gesehen: Beginn 01.01.2025, Ende 30.09.2025, darunter die Wochentage als Kontrolle. Gut.
4. Schritt 2. Erwartet: «Seepark Residenz» wählbar. Gesehen: «12 Rechnungen in der Abrechnungsperiode, 4 Wohnungen». Gewählt.
5. Schritt 3. Erwartet: ein vorgeschlagenes Heizprofil. Gesehen: «Heizung + Warmwasser (100%)», vorgewählt, mit Monatsanteilen. Verwaltungspauschale 3 % unverändert gelassen.
6. Schritt 4 Vorschau. Erwartet: vier Abrechnungen, für Sarah Meier Januar bis Juni. Gesehen: «Anzahl Abrechnungen 0», «Kosten aller Abrechnungen CHF 0.00», Hinweis auf bestehende Abrechnungen mit Link zur Liste.
7. Liste «Seepark Residenz». Gesehen: vier Entwürfe 01.01.2025 – 31.12.2025 und drei bezahlte Abrechnungen 2024.
8. Detailseite NK-22222222-2025-0002 (Sarah Meier). Gesehen: «Heizprofil: Heizung + Warmwasser», 181 Mietstage, Saldo Nachzahlung CHF 138.00, Knopf «Abrechnung löschen».
9. Löschen der vier Jahresentwürfe: von der Umgebung verweigert. PDF des bestehenden Entwurfs herunterladen: ebenfalls verweigert. Hier abgebrochen.

## Verwirrung

- Keine im geprüften Teil. Die Ablehnung in Schritt 4 sagt, was los ist und was zu tun ist.

## Fehlerrisiken

- Nicht beurteilbar für die PDF-Erklärung. Hinweis: Wer eine kürzere Periode abrechnen will, muss zuerst die Jahresentwürfe löschen. Das verlangt Sorgfalt, ist aber bei Entwürfen vertretbar.

## Vorschläge

- Keine (keine Befunde zur Änderung).
- Für einen neuen Lauf: Entweder die Persona darf die vier Entwürfe 2025 in «Seepark Residenz» löschen (Erlaubnis in der Umgebung), oder der Aufrufer löscht sie vor dem Start per SQL in `dwello_persona`. Ausserdem muss das Herunterladen des PDFs über die Seite erlaubt sein.

## Nicht geprüft

- Erstellen der Entwürfe 01.01.2025 – 30.09.2025, das PDF von Sarah Meier für diese Periode, der Abschnitt «Heiz- und Warmwasserkosten» mit Monaten und Erklärungssatz, die Kostenübersicht und das Heizprofil auf der Detailseite des neuen Entwurfs. Grund: Das Löschen der Jahresentwürfe und das Herunterladen des PDFs wurden von der Berechtigungsprüfung der Umgebung verweigert.
