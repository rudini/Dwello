# Helga – Nachprüfung #673 (Entwürfe ansehen, Rückweg zum Mietvertrag, Fortschritt im Assistenten)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (960 × 600 CSS-Pixel) und bei normaler Grösse, Maus. App: Persona-Stack auf :3300 (Build von w-673, Demo-Daten). Nur angeschaut, nichts gespeichert, keine Abrechnung erstellt. Skripte und Bilder: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-673/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-1 | Minor | Nebenkostenabrechnungen (mit Abrechnungsperiode und Gebäude), 150 % | Nach einem Klick auf die Kachel «Entwurf» springt die Seite nach unten zur Überschrift «4 Abrechnungen». Der neue Satz «Sie sehen die Abrechnungen der Abrechnungsperiode … im Gebäude … Es werden nur Abrechnungen mit dem Status «Entwurf» gezeigt.» ist dann oben aus dem Bild. Ich sehe ihn nur, wenn ich selbst wieder nach oben scrolle. Bei normaler Grösse bleibt er sichtbar. |
| H-2 | Minor | Assistent «Abrechnungen erstellen», Schritt 4 «Vorschau» → Liste | Im Assistenten finde ich kein «Entwürfe ansehen». Dort steht nur «Abrechnungen von Seepark Residenz ansehen». Dieser Link öffnet die Liste des Gebäudes ohne Abrechnungsperiode: 7 Abrechnungen, darunter drei «Bezahlt» von 2024, und kein Satz darüber. Den Satz mit Periode und Gebäude bekomme ich auf diesem Weg also nicht zu sehen. |

## Frühere Befunde aus #673

| Früher | Stand | Was ich gesehen habe |
|---|---|---|
| P-2 (Satz nennt weder «Entwurf» noch Gebäude) | **behoben**, sobald eine Abrechnungsperiode gewählt ist | Mit Periode und Gebäude in der Adresse und der Kachel «Entwurf» lautet der Satz: «Sie sehen die Abrechnungen der Abrechnungsperiode 01.01.2025 – 31.12.2025 im Gebäude Seepark Residenz. Es werden nur Abrechnungen mit dem Status «Entwurf» gezeigt.» Gebäude, Periode und «nur Entwürfe» stehen also drin. Wähle ich ein anderes Gebäude (Alpenblick), wechselt der Satz mit. Der Satz erscheint aber nur, wenn eine Abrechnungsperiode oder ein Mietvertrag gewählt ist. Über «Entwürfe ansehen» auf der Übersicht (`/statements?status=draft`) oder mit dem Feld «Gebäude» kommt keiner. Siehe H-1 und H-2. |
| P-3 (kein Weg zurück zum Mietvertrag) | **behoben** | Mietvertrag Thomas Weber → «Dazu gehört» → «Nebenkostenabrechnungen». Im Satz oben steht jetzt «Sie sehen die Abrechnungen des Mietvertrags von Thomas Weber, Wohnung A1 (Seepark Residenz), Vertragsbeginn 01.04.2022.», dazu der Link «Zum Mietvertrag». Mit der Kachel «Entwurf» kommt der Satz «Es werden nur Abrechnungen mit dem Status «Entwurf» gezeigt.» dazu. |
| P-5 (Brotkrümel führt zur ungefilterten Liste) | **behoben** | Von der gefilterten Liste (Mietvertrag + Entwurf) in die Abrechnung NK-22222222-2025-0001 und zurück über «Nebenkostenabrechnungen» im Brotkrümel: Ich bin wieder in derselben gefilterten Liste, der Satz steht wieder da. |
| P-6 (keine Schrittnamen bei 150 %) | **behoben** | Bei 150 % steht neben der Nummer des aktuellen Schritts sein Name («1 Abrechnungsperiode», «2 Gebäude», «4 Vorschau»). Die übrigen Schritte zeigen nur die Nummer, erledigte Schritte einen Haken und meine Wahl («01.01.2025 – 31.12.2025», «Seepark Residenz»). Darüber steht immer noch «Schritt 3 von 5: …». Lange Namen werden mit Trennstrich umgebrochen, siehe N-1. |
| P-7 (neuer Entwurf ohne PDF, kein Hinweis) | **nicht geprüft** | Alle 7 Entwürfe der Demo-Daten haben schon einen «PDF»-Link. Einen neuen Entwurf hätte ich nur durch Erstellen bekommen, und speichern durfte ich nicht. Siehe «Nicht geprüft». |

## Beobachtungen

- N-1: Bei 150 % wird der Name des aktuellen Schritts in eine schmale Spalte gequetscht: «Abrech-/nungsperi-/ode» auf drei Zeilen, «Heizprofil/und/Verwal-/tungspau-/schale» auf fünf Zeilen. Rechts daneben bleiben die Spalten von Schritt 4 und 5 fast leer. Lesen kann ich es, aber es stockt. Die Zeile «Schritt 3 von 5: Heizprofil und Verwaltungspauschale» darüber hilft mir mehr. Bei normaler Grösse gleich: «Abrech-nungsperi-ode» und «Verwal-tungspau-schale».
- N-2: In Schritt 3 war die Seite schon so weit gescrollt, dass die Zeile «Schritt 3 von 5: …» oben fehlte. Vom Fortschritt waren nur noch die Kästchen mit Haken und Nummern zu sehen.
- N-3: In der Liste kann ich selbst keine Abrechnungsperiode wählen. Es gibt nur «Suche» und «Gebäude». «Die Entwürfe von diesem Jahr» finde ich nur, weil zufällig alle Entwürfe von 2025 sind.
- N-4: Die Überschrift über der Liste heisst einfach «4 Abrechnungen», auch wenn nur Entwürfe gezeigt werden. Die Kachel «Entwurf» mit Haken und «Filter aufheben» zeigt die Wahl aber deutlich, und nicht nur über die Farbe.
- N-5: Ist ein Filter gewählt und die Liste leer, gibt es zwei Links «Filter zurücksetzen» (oben bei der Suche und im Hinweis bei der leeren Liste). Beide führen gleich weiter und behalten die Abrechnungsperiode.
- N-6: Bei einer Abrechnungsperiode 01.07.2024 – 30.06.2025 sind in Schritt 2 alle Gebäude gesperrt. Gut ist, dass bei jedem steht, warum («… rechnet im Kalenderjahr ab … wählen Sie im ersten Schritt eine Abrechnungsperiode von Januar bis Dezember»).

## Aufgabe geschafft: teilweise

Die Entwürfe von Seepark Residenz für 2025 und den Satz darüber habe ich gefunden. Mit der Maus bin ich aber nicht dorthin gekommen: Ich musste die Adresse mit der Abrechnungsperiode von Hand öffnen (siehe Ablauf). Der Rückweg zum Mietvertrag und die Schrittnamen funktionieren. P-7 konnte ich nicht prüfen.

## Aufwand

Etwa 25 Minuten, 19 Durchgänge (Skripte), rund 40 Klicks oder Eingaben.

## Ablauf

1. Übersicht → «Entwürfe ansehen». Erwartet: eine Liste mit einem Satz «nur Entwürfe». Gesehen: Liste mit 7 Entwürfen aller Gebäude, die Kachel «Entwurf» mit Haken und «Filter aufheben», aber kein Satz darüber. Auch nach der Wahl von «Seepark Residenz» bei «Gebäude» und «Suchen» kommt kein Satz.
2. Auf «Nebenkostenabrechnungen» gesucht. Erwartet: «Entwürfe ansehen». Gesehen: nur die Kacheln. Kein Link mit diesem Namen.
3. «Abrechnungen erstellen», Abrechnungsperiode 2025, Seepark Residenz, bis Schritt 4. Erwartet: ein Link zu den Entwürfen dieses Jahres. Gesehen: «Alle Mietverträge haben in dieser Periode schon eine Abrechnung …» und der Link «Abrechnungen von Seepark Residenz ansehen». Er führt zu 7 Abrechnungen aus 2024 und 2025, ohne Satz darüber (H-2).
4. Weil kein Weg in der App eine Abrechnungsperiode mitgibt, habe ich die Adresse `/statements?building=…&periodStart=2025-01-01&periodEnd=2025-12-31` selbst geöffnet. So würde sie ein Link nach dem Erstellen öffnen. Dann die Kachel «Entwurf». Erwartet: Satz oben, Liste darunter. Gesehen bei 150 %: Die Seite springt zu «4 Abrechnungen», der Satz ist oben aus dem Bild (H-1). Nach oben gescrollt stimmt der Satz.
5. Wizard bei 150 %, Schritt 1. Erwartet: der Name des Schritts beim Fortschritt. Gesehen: ja, aber «Abrech-nungsperi-ode» auf drei Zeilen (N-1).

## Vorschläge

- **H-1:** Mit 150 % Zoom die Liste mit Abrechnungsperiode und Gebäude öffnen, dann die Kachel «Entwurf» anklicken: Die Seite scrollt um etwa 360 px, der Satz ist weg. Mir würde helfen: nach dem Filtern oben bleiben, oder den Fokus auf den Satz statt auf die Listenüberschrift setzen. Ginge auch: «4 Entwürfe» als Überschrift statt «4 Abrechnungen».
- **H-2:** Assistent, Abrechnungsperiode 2025, Seepark Residenz wählen, bis Schritt 4 «Vorschau» gehen, dann «Abrechnungen von Seepark Residenz ansehen». Mir würde helfen, wenn der Link die gewählte Abrechnungsperiode mitgibt. Dann steht oben der neue Satz, und ich sehe nur die Abrechnungen dieses Jahres. Noch besser wäre ein Link «Entwürfe ansehen», der nur die Entwürfe zeigt.

## Nicht geprüft

- **P-7 (neuer Entwurf ohne PDF):** Dafür braucht es einen frisch erstellten Entwurf. Ich durfte nicht speichern. Alle Entwürfe der Demo-Daten haben einen «PDF»-Link, und auch die Seite eines Entwurfs (NK-22222222-2025-0001) zeigt «PDF herunterladen». Den Zustand ohne PDF habe ich nirgends gefunden.
- **Der Link nach dem Erstellen (Schritt 5) zur Liste mit Periode:** Er wäre nur durch Erstellen erreichbar. Den Satz habe ich deshalb über die von Hand geöffnete Adresse geprüft (Ablauf 4).
- **200 % Zoom:** nicht verlangt, nicht angeschaut.
