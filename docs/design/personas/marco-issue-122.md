# Marco – Issue #122 (Dwello-Icon im Browser-Tab)

Persona: Marco, 38, Handy (390 × 844, Touch). Nur angeschaut, nichts gespeichert.
Aufgabe: Übersicht hell und dunkel öffnen; prüfen, ob das Tab- und Home-Bildschirm-Icon als Dwello erkennbar ist und zum Logo im Kopf passt; `/favicon.svg` laden und in 16, 32 und 180 px (hell und dunkel) ansehen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Home-Bildschirm (iPhone/Android, "Zum Home-Bildschirm") | Nur ein SVG-Icon ist eingebunden; `/apple-touch-icon.png` und `/manifest.webmanifest` liefern 404. Lege ich Dwello auf den Home-Bildschirm, zeigt mindestens das iPhone nicht das Haus, sondern ein Bildschirmfoto oder einen Buchstaben. |
| P-2 | Nit | Browser-Tab, 16 px | Das Haus ist ein gewöhnliches "Startseite"-Symbol mit dünner Linie. Im Tab erkenne ich es als Haus, aber nicht sofort als *Dwello*: andere Apps verwenden dasselbe Symbol. Es passt aber genau zum Logo im Kopf. |

## Beobachtungen

- Fusszeile der Übersicht: "Version unbekannt": als Nutzer weiss ich nicht, was das bedeutet oder ob etwas nicht stimmt.
- Kachel "Gebäude und Wohnungen": "Wiedervermietet 0" und "Gesperrt 0": was "Gesperrt" bedeutet, wird nicht erklärt.
- Seitentitel heisst "Übersicht - Dwello" (Bindestrich statt Gedankenstrich), ist aber gut lesbar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 6 Schritte (Übersicht hell, Übersicht dunkel, Icon-Verweis im Seitenkopf, `/favicon.svg` laden, Darstellung in 3 Grössen hell und dunkel, Tab und Home-Bildschirm nachgestellt).

## Ablauf

1. **Übersicht hell, 390 px.** Erwartet: Seite lädt, Titel enthält Dwello. Gesehen: Status 200, Titel "Übersicht - Dwello"; der Seitenkopf verweist auf ein Icon (`rel="icon"`, `image/svg+xml`, `/favicon.svg`), kein weiteres Icon. Im Kopf: dunkelblaues Haus-Umrisssymbol vor "Dwello" in Fett (Screenshot 02-header-light).
2. **Übersicht dunkel.** Erwartet: dasselbe Icon, helleres Blau im Logo. Gesehen: Kopf dunkel, Haus im Logo hellblau (02-header-dark); ganze Übersicht dunkel gut lesbar (01-uebersicht-dark).
3. **`/favicon.svg` laden.** Erwartet: lädt als Bild. Gesehen: 200, `image/svg+xml`; Haus-Umriss in Dunkelblau, im dunklen Farbschema hellblau. Es ist dasselbe Haus wie im Kopf-Logo.
4. **Grössen 16 / 32 / 180 px, hell.** Erwartet: in allen Grössen erkennbar. Gesehen (03-icon-light): 180 px kräftig und klar; 32 px gut; 16 px als Haus erkennbar, aber zart, die Tür ist nur noch ein kleiner Bogen. Bei 3-facher Pixeldichte wie auf meinem Handy (07-tab-3x-light) ist es scharf und gut lesbar.
5. **Grössen 16 / 32 / 180 px, dunkel.** Erwartet: helles Blau auf dunklem Grund. Gesehen (03-icon-dark, 07-tab-3x-dark): hellblaues Haus, auf dunklem Grund gut sichtbar, gleiche Farbe wie das Logo im dunklen Kopf.
6. **Tab und Home-Bildschirm nachgestellt.** Erwartet: Tab mit Haus und "Übersicht - Dwello"; auf dem Home-Bildschirm ein Dwello-Icon. Gesehen: Tab passt hell und dunkel (05-tab-light, 05-tab-dark). Für den Home-Bildschirm gibt es kein eigenes Icon (Apple-Touch-Icon und Manifest: 404). Nachgestellt auf weisser und dunkler Kachel (06-homescreen-sim-dark): das transparente Haus ohne eigene Fläche wirkt dort dünn und verloren.

## Verwirrung

- Keine neuen Begriffe. Das Icon selbst hat keine Beschriftung; der Name "Dwello" steht nur im Tab-Titel daneben.

## Fehlerrisiken

- Mit vielen offenen Tabs auf dem Handy (nur Icons sichtbar) kann ich Dwello mit einem anderen Tab mit Haus-Symbol verwechseln (z.B. Immobilienportal, Bank-Startseite).
- Auf dem Home-Bildschirm finde ich Dwello nicht am Haus wieder (P-1).

## Vorschläge

- **P-1:** Übersicht am Handy öffnen, "Teilen" > "Zum Home-Bildschirm" (iPhone) bzw. "Zum Startbildschirm hinzufügen" (Android). Technisch nachvollziehbar: `GET /apple-touch-icon.png` und `GET /manifest.webmanifest` antworten 404. Hilfreich wäre ein 180-px-PNG des Hauses auf einer gefüllten Fläche (z.B. weiss mit blauem Haus oder blau mit weissem Haus) als Apple-Touch-Icon, damit das Haus auf dem Home-Bildschirm gross und kräftig wirkt.
- **P-2:** `/favicon.svg` in 16 px auf hellem Tab-Hintergrund ansehen (03-icon-light, linkes Bild). Hilfreich wäre für kleine Grössen eine etwas dickere Linie oder eine gefüllte Fläche hinter dem Haus; ob ein eigenes Markenzeichen statt eines Standard-Haussymbols gewünscht ist, ist eine Produktentscheidung.

## Nicht geprüft

- Ein echtes Handy und der echte Tab-Streifen bzw. Home-Bildschirm: Die Prüfung lief in einem Chromium ohne sichtbare Browser-Oberfläche. Tab und Home-Bildschirm habe ich mit dem gelieferten SVG nachgestellt (hell/dunkel über das Farbschema).
- Safari/iOS und Firefox: wie diese das SVG mit Dunkelmodus-Regel im Tab darstellen, konnte ich nicht ausprobieren. Ebenso den Fall "Browser hell, Betriebssystem dunkel": dann wäre das hellblaue Haus auf hellem Tab-Hintergrund möglich.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-122/`.
