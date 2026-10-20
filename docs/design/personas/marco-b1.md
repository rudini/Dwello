# Marco, Runde b1: Abrechnungsdetail am Handy und kaputte Links

Marco, 38, am Smartphone (390 × 844, Touch), nur angeschaut, nichts gespeichert. Persona-App auf http://localhost:3300 mit Demodaten. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/4dd0156e-1aed-5051-adcf-2875bdf30b99/scratchpad/marco-b1/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Fehlerseite «Diese Seite gibt es nicht.» (`/buildings/abc`, `/invoices/upload`) | «Zurück» führt bei einem Link, der frisch im Tab geöffnet wurde (Link vom Kollegen), aus Dwello hinaus auf eine leere Seite (`about:blank`); in einem echten Tab ohne Verlauf passiert gar nichts. |
| P-2 | Nit | Fehlerseite, `/buildings/abc` | Die Seite kennt den Bereich nicht: Kein Weg direkt zu «Gebäude», nur «Zur Übersicht». Ich brauche zwei Tipper mehr (Übersicht, dann «3 Gebäude» suchen, oder Menü, dann «Gebäude»). |

## Beobachtungen

- Abrechnungsdetail: Hans Müller und Nina Brunner sind gleich aufgebaut, ohne Lücken. Brotkrümel, Titel, Untertitel (Mieter, Gebäude, Wohnung, Periode), «PDF herunterladen», Hauptaktion, «Status: …» und dann die Karte «Kostenaufstellung» folgen in gleichmässigen Abständen (je 32 px zwischen Kopf, Status und Kostenaufstellung, gemessen bei beiden: Kopf endet bei 488 px, Status 520–550 px, Kostenaufstellung ab 582 px). Kein seitliches Scrollen (Seitenbreite 390 px).
- Hans Müller ist in den Demodaten nicht im Entwurf, sondern «Versendet» (Hauptaktion «Als bezahlt markieren»); Nina Brunner ist «Entwurf» (Hauptaktion «Per E-Mail senden»). Der Aufbau ist trotzdem derselbe.
- Der Status steht unter den Knöpfen. Ich lese zuerst «Als bezahlt markieren» und erst danach, dass die Abrechnung versendet ist. Hat mich nicht gestört, wäre oben neben dem Titel aber schneller erfasst.
- Die Abrechnungsnummer steht zweimal direkt untereinander (Brotkrümel und Titel). Am Handy kostet das eine Zeile.
- Bei Nina bricht die Kategorie «TV/Kabelanschluss» mitten im Wort um («TV/Kabelanschl» / «uss»).
- Bei Nina, Kategorie Heizung, steht «Zeitanteil 63.32 %», bei allen anderen Positionen «184/365 Tage». Das gleiche Wort zeigt einmal Tage, einmal Prozent.
- Bei Hans, letzter Rechnungslink «Kaminfegerarbeiten Heizanlage 2025»: Der Link bricht auf zwei Zeilen um, und der Betrag klebt enger darunter als bei den anderen Rechnungen.
- Im Screenreader-Baum stehen nach dem Status zwei leere «status»-Bereiche. Sichtbar ist dort nichts, und sie nehmen keinen Platz ein.
- Fehlerseite: Für beide kaputten Links kommt dieselbe saubere Seite (HTTP 404): Haus-mit-Warndreieck-Grafik, «Diese Seite gibt es nicht.», «Prüfen Sie die Adresse oder gehen Sie zur Übersicht.», «Zurück» und «Zur Übersicht» (Hauptaktion). Kopfzeile mit Menü bleibt da, Sprache Deutsch, kein seitliches Scrollen. Im Browser-Tab steht nur «Fehler - Dwello».
- Die Zahlen auf der Übersicht änderten sich während meines Laufs (Entwürfe 7, dann 6, dann 5). Das waren andere Personas, keine Feststellung von mir.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 15 Schritte: Übersicht, Menü, Nebenkostenabrechnungen, Hans Müller, scrollen, zurück, Nina Brunner, scrollen. Dann zwei kaputte Links, «Zurück» probieren, Menü → Gebäude (unter 0,5 s), Fehlerseite → «Zur Übersicht» → «3 Gebäude».

## Ablauf

1. **Übersicht → Menü → «Nebenkostenabrechnungen».** Erwartet: Liste mit Hans Müller. Gesehen: Liste mit 17 Abrechnungen, Hans Müller «NK-11111111-2025-0001», Musterhaus Zentrum, Wohnung 1.01, Nachzahlung CHF 215.80, Status «Versendet». Screenshot `03-statements-list.png`.
2. **Hans Müller antippen.** Erwartet: Titel, Status und direkt danach die Kostenaufstellung, ohne Loch. Gesehen: Genau so (`04-hans-viewport.png`). Die Karte «Kostenaufstellung» beginnt schon im ersten Bildschirm, darunter Position für Position bis «Saldo: Nachzahlung CHF 215.80», dann die Karten «Zahlung», «Mieter und Wohnung», «Weitere Aktionen» und «Verlauf» (`05-hans-overview.png`, die Seite in vier Streifen nebeneinander). Keine leeren Flächen.
3. **Nina Brunner (Entwurf) zum Vergleich.** Erwartet: gleicher Aufbau. Gesehen: identische Abstände; die Hauptaktion heisst «Per E-Mail senden», unter «Weitere Aktionen» stehen zusätzlich «Neu berechnen» und «Abrechnung löschen» (`04-nina-viewport.png`, `05-nina-overview.png`).
4. **`/invoices/upload` öffnen.** Erwartet: entweder die Upload-Funktion oder ein klarer Hinweis. Gesehen: Fehlerseite «Diese Seite gibt es nicht.» mit «Zurück» und «Zur Übersicht» (`06-upload.png`). Kein Hinweis, dass «Rechnungen hochladen» auf der Übersicht zu finden ist, aber die Übersicht ist ja das Angebot.
5. **`/buildings/abc` öffnen.** Erwartet: «Dieses Gebäude gibt es nicht» o. ä. mit Weg zu den Gebäuden. Gesehen: dieselbe allgemeine Fehlerseite (`06-abc.png`).
6. **«Zurück» antippen, Link frisch geöffnet.** Erwartet: irgendwohin in Dwello. Gesehen: leere Seite `about:blank`, also raus aus Dwello (`07-zurueck-fresh.png`). Mit Verlauf (vorher die Abrechnungsliste offen) führt «Zurück» korrekt dorthin.
7. **Zurück zu meinen Gebäuden.** Über das Menü (☰ → «Gebäude») sofort auf `/buildings`. Über «Zur Übersicht» muss ich bis «Gebäude auf einen Blick» scrollen und «3 Gebäude» antippen (`09-dashboard-gebaeude-kachel.png`). Beides klappt.

## Verwirrung

- «Zeitanteil» in Tagen und einmal in Prozent (Heizung bei Nina).
- «Status» unter den Aktionsknöpfen: Ich sehe zuerst, was ich tun kann, und erst danach, wo die Abrechnung steht.
- Fehlerseite: «Prüfen Sie die Adresse». Am Handy aus einem Chat heraus kann ich die Adresse nicht sinnvoll prüfen. Es ist auch nicht klar, ob das Gebäude gelöscht wurde oder der Link einfach falsch ist.

## Fehlerrisiken

- P-1: Wer einen Link aus einer Nachricht öffnet und «Zurück» tippt, landet ausserhalb von Dwello oder es passiert nichts. Er denkt dann, die App hängt.
- Gering: Wer die Abrechnung schnell überfliegt, könnte «Als bezahlt markieren» antippen, bevor er den Status gelesen hat (die Knöpfe kommen vor dem Status). Ich habe es nicht ausgelöst.

## Vorschläge

- **P-1:** Reproduktion: neues Browserfenster, direkt `http://localhost:3300/buildings/abc` öffnen, «Zurück» antippen → `about:blank`. Hilfreich wäre: «Zurück» nur zeigen, wenn es eine vorherige Dwello-Seite gibt; sonst nur «Zur Übersicht».
- **P-2:** Reproduktion: `/buildings/abc` öffnen. Hilfreich wäre: Auf einer Fehlerseite unter `/buildings/…` zusätzlich «Zu den Gebäuden» anbieten (analog «Zu den Rechnungen» unter `/invoices/…`), oder ein Satz wie «Das Gebäude wurde nicht gefunden.»

## Nicht geprüft

- Speichern, E-Mail senden, «Als bezahlt markieren», «Neu berechnen»: Laut Auftrag sollte ich nur schauen.
- PDF-Inhalt: nicht Teil des Auftrags.
- Dunkelmodus und andere Sprachen: nicht verlangt, die Sprache hängt am Konto und wird mit anderen Personas geteilt.
- Ein echter Tab ohne Verlauf in einem Handy-Browser oder In-App-Browser eines Messengers: Headless-Chromium startet mit `about:blank` im Verlauf. Das genaue Verhalten auf dem echten Gerät (nichts passiert oder Tab schliesst) konnte ich nicht sehen.
