# Helga – Runde 669-2: Nachprüfung H-1, H-2, H-3

Persona: Helga, 68, wenig Computererfahrung, braucht grosse Schrift. Desktop 1440 × 900 bei 150 % Zoom (Seite 960 × 600) und bei normaler Grösse (100 %), Maus. Nur angeschaut, nichts gespeichert.
Fehler simuliert: `GET /api/contracts?apartmentId=…` antwortet mit 500, bis ich «Erneut versuchen» drücke; danach normal.
Verträge: Nina Brunner (Wohnung A2, Seepark Residenz, seit 01.07.2025, unbefristet), früher Sarah Meier (01.08.2021 – 30.06.2025). Im Assistenten: Mieterin Sarah Meier, Wohnung A2, Vertragsbeginn 01.12.2026.

## Stand der alten Befunde

- **H-1 (Major): behoben.** In «Prüfen» steht nach «Erneut versuchen» ein gelber Kasten mit Warnzeichen auf der Seite: «Zeitraum überschneidet sich», mit Nina Brunner (seit 01.07.2025, unbefristet), was zu tun ist, «Den Vertragsbeginn und das Vertragsende ändern Sie im Schritt 3 «Vertragsdauer», die Wohnung im Schritt 2 «Wohnung».» und dem Link «Zum Mietvertrag von Nina Brunner». Der Kasten bleibt stehen, nachdem die kurze Meldung nach etwa 7 Sekunden verschwunden ist (bei 150 % und 100 %). Er steht über der Zusammenfassung, ich sehe ihn sofort.
- **H-2 (Minor): teilweise behoben, bleibt Minor (siehe H-2 unten).** Die Meldung hat jetzt ein Warnzeichen und einen braunen Rand statt des grünen Häkchens; sie wirkt wie eine Warnung. Den Kasten, den sie nennt, sehe ich aber weiterhin nicht, ohne zu scrollen.
- **H-3 (Minor): behoben.** Nach «Erneut versuchen» in Schritt 2 hebt Dwello die Wahl auf («Wohnung wählen» steht wieder im Feld), A2 ist «(nicht verfügbar)» und nicht mehr wählbar, «Weiter» geht nicht mehr («Bitte wählen Sie eine …» erscheint am Feld). Die Meldung sagt klar, warum. Eine kleinere neue Sache dazu: H-6.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-2 | Minor | Mietvertrag bearbeiten; Neuer Mietvertrag Schritt 3 «Vertragsdauer» | Die Meldung sagt «Welcher es ist, steht im Hinweis «Zeitraum überschneidet sich».», aber der Kasten steht weiterhin unter der Auswahl Unbefristet/Befristet. Bei 150 % ist er beim Bearbeiten und in Schritt 3 unter dem Bildrand, bei 100 % beim Bearbeiten nur mit seinem obersten Rand sichtbar. Beim Bearbeiten sehe ich direkt unter dem Feld einen anderen gelben Kasten «Vertragsbeginn prüfen» (Datum in der Vergangenheit), den ich zuerst für den genannten hielt. Die Meldung sagt nicht, dass ich nach unten scrollen muss. |
| H-6 | Minor | Neuer Mietvertrag, Schritt 2 «Wohnung» | Die neue Meldung «Die gewählte Wohnung ist nicht verfügbar … Dwello hat die Auswahl darum aufgehoben …» ist lang (bei 150 % 13 Zeilen) und verschwindet nach etwa 8 Sekunden. Danach steht auf der Seite nur noch «Wohnung wählen», ohne Grund. Sie nennt die Wohnung nicht (A2), und «tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein» sagt nicht, welcher Mietvertrag das ist und wo ich seine Seite finde; einen Link wie in Schritt 3 gibt es nicht. |

## Beobachtungen

- N-1: Die kurze Meldung bleibt stehen, solange die Maus darauf liegt (ausprobiert in Schritt 2: nach 12 Sekunden mit der Maus darauf noch da, nach dem Wegziehen etwa 8 Sekunden später weg). Das wusste ich als Helga aber nicht; ich lese langsam.
- N-2: Bei 150 % liegt die kurze Meldung rechts über dem Kasten: in «Prüfen» über der rechten Hälfte von «Zeitraum überschneidet sich», beim Bearbeiten über «Vertragsbeginn prüfen», in Schritt 3 über dem Feld Vertragsbeginn und dem Kalenderknopf, in Schritt 2 über dem «Weiter»-Knopf. Nach einigen Sekunden ist alles wieder frei.
- N-3: Die Wörter in «Prüfen» sind verständlich. «Enddatum erfassen» ist in Anführungszeichen, so dass ich weiss, dass es ein Knopf ist. Ein Knopf «Vertragsbeginn ändern» direkt im Kasten fehlt; ich musste in der Liste darunter das «Ändern» beim Vertragsbeginn suchen, das ging aber.
- N-4: In Schritt 3 bei 100 % ist der Kasten «Zeitraum überschneidet sich» ohne Scrollen sichtbar.
- N-5: Nach «Erneut versuchen» springt der Assistent zur Schrittüberschrift, beim Bearbeiten zum Feld Vertragsbeginn (wie in der letzten Runde).
- N-6: Der Hilfetext über der Wohnungsauswahl erklärt «nicht verfügbar», aber nicht «(nicht geprüft)», das vor dem erneuten Versuch bei jeder Wohnung steht (alter H-5, nicht Teil dieser Nachprüfung).

## Aufgabe geschafft: ja

H-1, H-2 und H-3 bei 150 % und 100 % nachgeprüft.

## Aufwand

Etwa 15 Minuten, rund 35 Schritte (Assistent bis «Prüfen», Schritt 2, Schritt 3, Bearbeiten, je bei 150 % und 100 %).

## Ablauf

- Bearbeiten, 150 %, Vertragsbeginn 01.06.2025, «Erneut versuchen»: Ich erwartete den Kasten «Zeitraum überschneidet sich» beim Feld. Ich sah unter dem Feld den gelben Kasten «Vertragsbeginn prüfen» und rechts die Warnmeldung; den genannten Kasten erst nach Scrollen unter Unbefristet/Befristet (H-2).
- Schritt 3, 150 %, «Erneut versuchen»: Ich erwartete den Kasten im Bild. Ich sah Feld, Datum in Worten und Vertragsdauer; der Kasten lag unter dem Bildrand (H-2).
- Schritt 2, «Erneut versuchen», 8 Sekunden gewartet: Ich erwartete, dass auf der Seite steht, warum meine Wahl weg ist. Ich sah nur noch «Wohnung wählen» (H-6).

## Vorschläge

- **H-2** – Nachstellen: Mietvertrag von Nina Brunner «Bearbeiten» mit fehlschlagendem Request, Vertragsbeginn 01.06.2025, Request freigeben, «Erneut versuchen» (oder Assistent Schritt 3 mit Sarah Meier, A2, 01.12.2026), bei 150 %. Was helfen würde: den Kasten «Zeitraum überschneidet sich» direkt unter das Feld Vertragsbeginn setzen, oder nach dem Laden zu ihm springen, oder in der Meldung «weiter unten, unter «Vertragsdauer»» sagen.
- **H-6** – Nachstellen: Neuer Mietvertrag mit fehlschlagendem Request, Sarah Meier, Wohnung A2, Request freigeben, «Erneut versuchen» in Schritt 2, 10 Sekunden warten. Was helfen würde: einen Hinweis am Feld Wohnung, der stehen bleibt, mit Namen der Wohnung und Link zum Mietvertrag, zum Beispiel «Wohnung A2 ist vermietet (Mietvertrag von Nina Brunner, unbefristet). Wählen Sie eine andere Wohnung. Ist der Mietvertrag gekündigt, erfassen Sie zuerst sein Vertragsende: Zum Mietvertrag von Nina Brunner».

## Nicht geprüft

- Speichern: Auftrag war nur anschauen.
- 200 % Zoom: nicht verlangt.
- Ein zweiter fehlschlagender Versuch: in dieser Runde nicht verlangt, nicht wiederholt.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-669-2/` (z… = 150 %, n… = 100 %; h1 = «Prüfen», h2 = Bearbeiten, h2w = Schritt 3, h3 = Schritt 2).
