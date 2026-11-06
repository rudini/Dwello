# Marco – Wohnungsliste: Überschrift mit Seite, Gebäude-Filter (Build w-670)

Persona: Marco, 38, meist auf dem Smartphone, wenig Zeit. Geprüft auf dem Handy (390 × 844, Touch) und auf dem Desktop (1440 × 900, Maus), nur angeschaut, nichts gespeichert. App: http://localhost:3300 (Persona-Stack, Demodaten). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/marco-670/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| M-1 | Minor | Wohnungen, Handy | Die neue Überschrift «Wohnungen 1–12 von 13, Seite 1 von 2» steht auf dem Handy beim Öffnen unterhalb des sichtbaren Bereichs (oberer Rand bei 841 px, der Bildschirm ist 844 px hoch). Ich sehe vor dem Scrollen nur Titel, Knopf und Filterkasten, aber nicht, welche Wohnungen und welche Seite. Nach «Nächste Seite» oder «Vorherige Seite» springt die Seite so, dass die Überschrift ganz unten am Rand klebt (beim Zurückblättern sogar umbrochen, «Seite 1 von» / «2»), die Hauptüberschrift oben halb abgeschnitten ist und keine einzige Wohnung zu sehen ist. |
| M-2 | Minor | Wohnungen, Seite ausserhalb des Bereichs | `/apartments?page=5` (z. B. ein altes Lesezeichen) zeigt «Noch keine Wohnungen – Erfassen Sie die Wohnungen Ihrer Gebäude …» mit Knopf «Wohnung erfassen», obwohl 13 Wohnungen da sind. Keine Seitenangabe, kein Weg zurück zur Seite 1. Ich würde denken, meine Wohnungen sind weg. Mit Filter (`?page=2&building=<Seepark>`) kommt «Keine Wohnungen gefunden», obwohl Seepark 4 Wohnungen hat. Ob das schon vor dieser Änderung so war, konnte ich nicht prüfen. |

## Frühere Befunde

- **P-5 (Anzahl über einer Teilseite, Seite nur unten): behoben im Inhalt.** Die Überschrift sagt jetzt «Wohnungen 1–12 von 13, Seite 1 von 2» bzw. «Wohnung 13 von 13, Seite 2 von 2» und folgt beim Blättern (Links und Browser zurück/vor). Auf dem Desktop sehe ich sie ohne Scrollen (oberer Rand bei 557 px von 900). Auf dem Handy liegt sie aber knapp unter dem sichtbaren Bereich, siehe M-1.
- **P-6 (Reihenfolge im Gebäude-Filter): behoben.** Der Filter zeigt Alle Gebäude, Alpenblick, Musterhaus Zentrum, Seepark Residenz, also die gleiche Reihenfolge wie die Wohnungsliste.

## Beobachtungen

- N-1: Mit Filter oder Suche, wenn alles auf eine Seite passt, heisst die Überschrift kurz «4 Wohnungen» (Seepark Residenz), «6 Wohnungen» (Musterhaus Zentrum), «2 Wohnungen» («Seepark B»), «9 Wohnungen» (Suche «2», Mietstatus Vermietet), «1 Wohnung» (Suche «B2»). Das stimmt jedes Mal mit der Liste überein, ohne Seitenangabe ist das in Ordnung. Ohne Treffer kommt «Keine Wohnungen gefunden» mit dem Suchtext und «Filter zurücksetzen», das ist gut.
- N-2: Nach dem Filtern scrollt das Handy die Liste ins Bild (Überschrift bei 408 px, die ersten Wohnungen sichtbar). Das ist besser als beim Blättern (M-1).
- N-3: Die Seite «Gebäude» zeigt die Gebäude in einer anderen Reihenfolge (Alpenblick, Seepark Residenz, Musterhaus Zentrum) als der Filter und die Wohnungsliste (alphabetisch). Hat mich nicht behindert, fällt aber auf.
- N-4: Im Vorlesebaum haben die einzelnen Wohnungen («Wohnung EG», Ebene 2) die gleiche Überschriftenebene wie die Listenüberschrift «Wohnungen 1–12 von 13 …» (auch Ebene 2), statt darunter zu stehen.
- N-5: Wird der Gebäude-Filter nur ausgewählt, ändert sich nichts. Die Liste filtert erst nach «Suchen». Das ist klar, weil der Knopf direkt darunter steht.
- N-6: Unten steht weiterhin zusätzlich «Seite 1 von 2» neben «Nächste Seite». Doppelt, aber nicht störend.
- N-7: Kein seitliches Scrollen bei 390 px (Seitenbreite 390).

## Aufgabe geschafft: ja

Ich habe die Wohnungen gefunden, geblättert und gefiltert. Die Überschrift stimmt überall, wo es Wohnungen gibt. Auf dem Handy musste ich für die Überschrift aber scrollen.

## Aufwand

Etwa 15 Minuten, 6 Durchgänge (Handy und Desktop): Wohnungen über das Menü öffnen, Nächste/Vorherige Seite, Browser zurück/vor, Filter Seepark/Musterhaus, Suche «Seepark B», «2», «B2», «Xyz», Mietstatus Vermietet/Gesperrt, zwei Adressen von Hand.

## Ablauf

- Handy, Wohnungen geöffnet. Erwartet: Ich sehe sofort, welche Wohnungen und welche Seite. Gesehen: Titel, «Wohnung erfassen» und der Filterkasten füllen den ganzen Bildschirm, die Listenüberschrift beginnt bei 841 von 844 px (Screenshot m-01-start.png).
- Handy, «Nächste Seite» angetippt. Erwartet: Seite 2 beginnt oben mit Überschrift und B2. Gesehen: Leicht gescrollt (25 px), die Überschrift «Wohnung 13 von 13, Seite 2 von 2» ganz unten am Rand, B2 nicht im Bild (m-06-after-next.png). Beim Zurückblättern dasselbe, «Wohnungen» oben angeschnitten und die Überschrift auf zwei Zeilen am unteren Rand (m-07-after-prev.png).
- Handy, `/apartments?page=5`. Erwartet: Hinweis, dass die Seite nicht existiert, oder Seite 2. Gesehen: Leerzustand «Noch keine Wohnungen» mit Türbild und «Wohnung erfassen» (m-g-page5.png).
- Gebäude-Seite. Erwartet: gleiche Reihenfolge wie im Filter. Gesehen: Seepark Residenz vor Musterhaus Zentrum (N-3).

## Vorschläge

- **M-1:** Auf dem Handy `/apartments` öffnen, nichts scrollen: Die Listenüberschrift ist nicht zu sehen. Dann ganz nach unten scrollen und «Nächste Seite» antippen: Die Überschrift klebt am unteren Rand, keine Wohnung ist sichtbar. Hilfreich wäre, nach dem Blättern so zu scrollen, dass die Listenüberschrift oben steht (wie nach dem Filtern), und beim ersten Öffnen den Filterkasten auf dem Handy kompakter zu machen (z. B. den langen Hilfetext der Suche kürzen oder Filter einklappbar), damit die Überschrift und die erste Wohnung ohne Scrollen sichtbar sind.
- **M-2:** `/apartments?page=5` öffnen (es gibt nur 2 Seiten): «Noch keine Wohnungen». Hilfreich wäre, auf die letzte vorhandene Seite umzuleiten oder einen Hinweis wie «Diese Seite gibt es nicht. Es gibt 13 Wohnungen auf 2 Seiten.» mit einem Link zu Seite 1 anzuzeigen, statt des Leerzustands für Neueinsteiger.

## Nicht geprüft

- Eine Teilseite mit Filter (mehr als 12 Treffer mit Filter): Die Demodaten haben nur 13 Wohnungen, kein Filter ergibt mehr als 9. Versucht habe ich Gebäude, Suche «2» und Mietstatus Vermietet.
- Ob M-2 schon auf dem Basis-Commit so war: Ich habe nur diesen Build.
- Ein echtes Handy mit Browser-Leiste: Der Headless-Browser hat keine Adressleiste, auf einem echten Gerät wäre der sichtbare Bereich noch kleiner.
