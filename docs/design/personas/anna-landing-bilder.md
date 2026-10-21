# Anna – Landing Page: Wirkung, Bilder und Animationen

Persona: Anna, 29, vermietet zum ersten Mal und will schnell verstehen, wie ein Jahr mit Dwello aussieht. Seite: `http://localhost:3310/index.html` (Deutsch), Desktop 1440 × 900 ganz durchgescrollt (rund 15 000 px, 17 Bildschirme), dazu der erste Bildschirm auf dem Handy (390 × 844). Nichts gespeichert. Die Seite lädt nur von `localhost:3310` (keine externen Anfragen) und hat beim Laden keine einzige laufende Animation (`document.getAnimations()` = 0).

## Fragebogen

**20. Warm oder kühl? Note 2 von 5 (eher kühl).**
Der erste Bildschirm ist sauber, aber sehr nüchtern: grosse schwarze Schrift auf Grau, «Ihre Liegenschaft. Ihre Daten. Ihr Server.» und darunter ein Bildschirmfoto der Übersicht. Das Wort «Server» gleich in der Überschrift klingt für mich nach IT, nicht nach Wohnung und Mietern. Danach kommen fast nur Bildschirmfotos, Häkchen-Listen, ein Terminal mit `docker compose`, Zahlen wie «48 px» und «7 : 1» und eine Tabelle «Dwello / Typisches Abo». Warm wirken einzelne Sätze («Für Menschen, die das nur ein paar Mal im Jahr machen», «Marco Bernasconi in Luzern bekommt seine Abrechnung auf Italienisch», «Gerecht verteilt, auch im Winter»); sie gehen aber zwischen den technischen Abschnitten unter. Seriös: ja. Einladend: eher nicht.

**21. Fehlen Bilder? Teilweise.**
Die Bildschirmfotos helfen mir wirklich: ich sehe den Upload-Dialog mit dem gelben Hinweis «Bitte prüfen», die Abrechnung mit Kostenaufstellung, das PDF mit QR-Zahlteil. Das ist ehrlicher als jedes Stockfoto. Was fehlt, ist ein Bild vom *Jahr*: Der Abschnitt «Vier Schritte. Einmal im Jahr. Ohne Excel.» hat vier gleich aussehende Karten mit Etiketten «Einmalig / Laufend / Einmal im Jahr / Fertig», aber ich sehe nicht, *wann* im Jahr was passiert. Hilfreich wären: eine einfache Jahres-Zeitleiste (Strichzeichnung im Stil des Hauses mit Server im Datenschutz-Abschnitt), eine kleine Zeichnung «Rechnung → Wohnungen» für die Verteilung, und ein echtes Beispiel, wie der Brief bei der Mieterin ankommt (das PDF ist schon da, gut). Nicht helfen würden: lächelnde Stockfoto-Vermieterinnen, Schlüsselübergaben, Hausfassaden als Hintergrund – das wäre Deko und sagt nichts über die Arbeit. Ein einzelnes, gezeichnetes Haus beim ersten Bildschirm wäre okay, wenn es etwas zeigt (z. B. Haus mit Wohnungen, aus denen die Abrechnung entsteht).

**22. Wo würde eine Animation etwas erklären?**
- «Vier Schritte. Einmal im Jahr.»: die vier Schritte nacheinander auf einer Jahreslinie aufleuchten lassen (Gebäude einmal, Rechnungen übers Jahr, Abrechnung im Frühling, Versand), damit ich den Rhythmus verstehe.
- «Rechnungen per Drag & Drop»: eine kurze Sequenz (3–4 Bilder) PDF hineinziehen → «1 von 1 Dateien gelesen» → Hinweis «Bitte prüfen» → «Rechnung erstellen». Das Standbild zeigt nur den Zwischenstand; ich verstehe nicht sofort, dass *ich* am Ende bestätige.
- «Gerecht verteilt, auch im Winter»: eine Rechnung (z. B. Lift CHF 1'690) teilt sich sichtbar auf die Wohnungen auf, daneben der Mieterwechsel mit Tagen. Die Formel `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` als Bildunterschrift schreckt mich eher ab; eine Bewegung, die dieselbe Aufteilung zeigt, würde ich verstehen.
- «Ihre Mieter zahlen mit dem Handy»: Handy scannt QR-Zahlteil → Abrechnung springt auf «bezahlt». Erklärt, was «Sie sehen, wer noch offen ist» heisst.

**23. Wo würde Bewegung stören?**
Im ersten Bildschirm (Überschrift und Knöpfe müssen sofort stehen), in der langen Funktionsliste «Was in Dwello steckt» (15 Karten – wenn die einzeln hereinfliegen, dauert das Scrollen ewig), im Datenschutz-Abschnitt (der soll ruhig und vertrauenswürdig wirken), beim Terminal im Abschnitt «Einmal einrichten lassen» (tippende Animation würde es noch technischer machen) und bei den Zahlen («CHF 0.–», «50», «0») – hochzählende Zahlen wirken wie Werbung. Automatisch laufende Videos oder Endlosschleifen würden mich beim Lesen stören und auf dem Handy Daten und Akku kosten. Jede Animation sollte erst auf Klick oder einmal beim Hineinscrollen laufen und bei «Bewegung reduzieren» still stehen.

**24. Meine drei besten Ideen**
1. **Ein Vermieterjahr als Zeitleiste** im Abschnitt «Vier Schritte»: Januar bis Dezember als Linie, die vier Schritte darauf eingezeichnet, mit dem Satz «Ein paar Stunden im Jahr». Das beantwortet genau meine Frage, wie Arbeiten mit Dwello übers Jahr aussieht, und macht die Seite menschlicher als jede Liste.
2. **Ein Beispiel mit Namen durchziehen**: Die Seite hat schon Hans Müller (Wohnung 1.01, Nachzahlung CHF 215.80) und Marco Bernasconi. Wenn ich eine Vermieterin mit ihrem Haus von der Rechnung bis zum bezahlten QR-Zahlteil begleite (kurze Bildunterschriften wie «Frau Keller lädt im Februar die Heizölrechnung hoch»), wird es eine Geschichte statt einer Funktionsliste.
3. **Den ersten Satz vom Server auf die Person drehen**: Statt «Ihr Server.» als blaues Schlusswort zuerst den Nutzen zeigen (Nebenkostenabrechnung ohne Excel), den Server als Beruhigung dahinter. Dazu neben dem Bildschirmfoto eine kleine Strichzeichnung «Haus → Abrechnung → Mieterin», im selben Stil wie das Haus im Datenschutz-Abschnitt.

## Ideen

| Abschnitt der Seite | Idee (Bild oder Animation) | Was sie erklärt | Priorität |
|---|---|---|---|
| «Vier Schritte. Einmal im Jahr. Ohne Excel.» | Bild: Jahres-Zeitleiste Jan–Dez mit den vier Schritten, optional einmalig beim Hineinscrollen der Reihe nach hervorgehoben | Wann im Jahr was zu tun ist und wie wenig Aufwand es ist | hoch |
| «Rechnungen per Drag & Drop» | Animation: 3–4 Standbilder als Abfolge (Datei ziehen → gelesen → «Bitte prüfen» → erstellt), Start per Klick, mit Pause/Weiter | Dass die KI vorschlägt und ich bestätige | hoch |
| «Gerecht verteilt, auch im Winter» | Bild oder kurze Animation: eine Rechnung teilt sich auf 3–4 Wohnungen auf (Fläche, Einheiten), statt nur Formel als Bildunterschrift | Was ein Verteilschlüssel ist, ohne Formel lesen zu müssen | hoch |
| Erster Bildschirm (Hero) | Bild: Strichzeichnung «Haus mit Wohnungen → Abrechnung → Mieterin» neben dem Bildschirmfoto, im Stil des Hauses im Datenschutz-Abschnitt | Wofür Dwello da ist, bevor «Server» auftaucht | mittel |
| «Ihre Mieter zahlen mit dem Handy» | Animation: Handy scannt QR-Zahlteil, Status wechselt auf «bezahlt» | Den Weg vom Brief bis zum Zahlungseingang | mittel |
| «Eine Abrechnung, die jede Zahl erklärt» | Bild: Hervorhebung einer Zeile (Lift) mit Pfeil zur gleichen Zeile im PDF der Mieterin | Dass Mieter dieselbe Aufstellung sehen | mittel |
| «Einmal einrichten lassen, dann läuft es.» | Bild: zwei Figuren (Strichzeichnung) «Bekannte richtet ein» → «Sie arbeiten im Browser», statt nur Terminal | Dass ich das Terminal nie sehen muss | mittel |
| «Für Menschen, die das nur ein paar Mal im Jahr machen.» | Bild: die Zahlen «48 px», «7 : 1», «390 px» durch kleine Vorher/Nachher-Beispiele ersetzen oder ergänzen | Was diese Werte für mich bedeuten | tief |
| «Was in Dwello steckt» (15 Karten) | keine Bewegung; höchstens Gruppierung nach «Jahr» / «Mieter» / «Sicherheit» | Ordnung statt langer Liste | tief |

Alle Ideen als eigene Strichzeichnungen oder Bildschirmfotos lokal ausgeliefert, ohne Verläufe, Glow, Emoji oder externe Dateien; Bewegung nur auf Klick oder einmal beim Hineinscrollen, mit «Bewegung reduzieren» abgeschaltet.

## Was stören würde

- Stockfotos von Menschen oder Häusern ohne Bezug zur Arbeit (Deko ohne Funktion).
- Automatisch laufende oder endlose Animationen, Videos mit Ton, Karten, die beim Scrollen einzeln hereinfliegen.
- Hochzählende Zahlen bei «CHF 0.–», «4», «50», «0».
- Eine tippende Terminal-Animation im Abschnitt «Einmal einrichten lassen».
- Grosse Bilddateien, die den ersten Bildschirm auf dem Handy langsamer machen (heute erscheint dort der Text sofort; das soll so bleiben).
- Animationen, die wichtige Aussagen (Datenschutz, «Dwello ersetzt keine Rechtsberatung») verzögern oder überdecken.

## Beobachtungen

- Handy, erster Bildschirm: nur Text und Knöpfe, das Bildschirmfoto beginnt erst ganz unten am Rand. Klar, aber noch kühler als auf dem Desktop; ein kleines Bild über dem Falz würde helfen.
- Das Haus mit Server im Datenschutz-Abschnitt ist die einzige Zeichnung der Seite und gefällt mir; sie zeigt einen Stil, in dem weitere Bilder entstehen könnten.
- Beim Durchscrollen mit Bildschirmfotos nach einem Vollseiten-Screenshot lag ein grauer Streifen über der fixen Kopfzeile; eine Gegenprobe ohne Vollseiten-Screenshot zeigte die Kopfzeile korrekt oben (`top: 0`). Das war ein Artefakt meines Werkzeugs, kein Befund.

## Nicht geprüft

- Dunkelmodus der Seite und die Bildschirmfotos im Dunkelmodus (nur hell angesehen).
- Die Sprachversionen FR/IT/EN.
- Ganze Seite auf dem Handy (nur der erste Bildschirm, wie vereinbart).
- Ladezeit bei langsamer Verbindung; gemessen habe ich nur, dass alle Anfragen an `localhost:3310` gehen.
- Ob «Bewegung reduzieren» beachtet würde: es gibt heute keine Animation, die ich hätte prüfen können.

Bildschirmfotos und Skripte: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-landing-bilder/`.
