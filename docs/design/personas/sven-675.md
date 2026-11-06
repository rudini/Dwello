# Sven – öffentliche Demo mit Tastatur und Screenreader (#675)

Persona: Sven, 45, blind, nur Tastatur und Screenreader, Desktop 1440 × 900, beurteilt über den Accessibility-Baum (`readOut`) und den Tastaturfokus. App: http://localhost:3300 als öffentliche Demo (DEMO=on, Betreiber betrieb@muster-hosting.ch). Nur angesehen, nichts gespeichert.

Geprüft: Anmeldeseite, /help, /privacy, /terms ohne Anmeldung; nach Anmeldung «Übersicht», «Gebäude», Gebäude «Alpenblick», /help. Auf jeder Seite: erste Durchsage, Ziel des Skip-Links, wie oft «Öffentliche Demo» vorkommt, «Mehr zur Demo» und sein Ziel.

## Befunde

| ID | Schwere | Bildschirm | Befund |
| -- | ------- | ---------- | ------ |
| – | – | – | Keinen Blocker, Major oder Minor gefunden. |

Frühere Befunde:

- **P-1 (#675), Skip-Link landet auf dem Hinweis:** behoben. «Zum Inhalt springen» setzt den Fokus auf allen 8 Seiten auf `main` (`#main-content`, tabindex=-1). Ich höre zuerst die Überschrift h1 der Seite («Übersicht», «Gebäude», «Brotkrümelnavigation» und dann «Alpenblick», «Hilfe», «Datenschutz», «Nutzungsbedingungen», auf der Anmeldeseite «Dwello» und dann «Anmelden»). Der nächste Tab geht zum ersten Bedienelement im Inhalt.
- **P-1, Hinweis vor dem h1 gehört:** teilweise. Der Hinweis steht nicht mehr in `main`, sondern ganz oben vor dem Banner. Lese ich von oben, höre ich weiterhin «Zum Inhalt springen», den Hinweistext und «Mehr zur Demo», erst dann Banner, Navigation und h1. Mit dem Skip-Link überspringe ich das jetzt. Für einen Hinweis, der für die ganze Website gilt, finde ich diese Reihenfolge in Ordnung. Das Problem lag am Skip-Link, und der ist behoben (siehe N-1).
- **C-11, Name zweimal gelesen:** behoben. Der Hinweis ist jetzt ein einfacher Absatz ohne eigenen Namen und ohne benannte Region: «Öffentliche Demo: Alle Besucher sehen …». Auf «Übersicht», «Gebäude», «Alpenblick», /privacy und /terms kommt «Öffentliche Demo» im Baum nur im Hinweis vor, auf /privacy und /terms dazu als h2 des eigenen Abschnitts. Auf /help kommt es dreimal vor: im Hinweis, als Link im Inhaltsverzeichnis und als h2. Das sind drei verschiedene Stellen, keine doppelte Durchsage.

## Beobachtungen

- **N-1:** Der Hinweis ist ein `<p>` ausserhalb jeder Landmark. Springe ich mit dem Screenreader von Landmark zu Landmark, finde ich ihn nicht. Linear gelesen und mit Tab (2. Tab-Stopp «Mehr zur Demo») finde ich ihn sofort. Gestört hat mich das nicht.
- **N-2:** Auf jeder Seite ist «Mehr zur Demo» der zweite Tab-Stopp, nach dem Skip-Link und vor «Dwello» bzw. «Anmelden». Das ist ein Tab mehr pro Seite. Wenn ich den Skip-Link nutze, fällt er weg.
- **N-3:** Ich gehe per Tastatur über die Hauptnavigation von «Übersicht» zu «Gebäude». Danach steht der Fokus auf `body`, und die Live-Region sagt «Gebäude - Dwello» an. Der nächste Tab ist «Zum Inhalt springen». Wie es sein soll.
- **N-4:** «Mehr zur Demo» öffnet von «Alpenblick» und von «Übersicht» aus /help#demo. Die Seite scrollt zum Abschnitt h2 «Öffentliche Demo», die Live-Region sagt «Hilfe - Dwello» an, der Fokus steht auf `body`. Ab dort geht Tab weiter: Der nächste Tab ist «Datenschutz» im Fusszeilenbereich, weil der Hilfetext danach keine Links mehr hat. Auf /help selbst springt derselbe Link im Dokument zu #demo. Der Abschnitt hat kein tabindex. Ob ein echter Screenreader (NVDA, JAWS) mit dem Lesecursor wirklich bei «Öffentliche Demo» weiterliest, kann ich nur aus dem Startpunkt der Tab-Reihenfolge schliessen, nicht mit einem echten Screenreader hören.
- **N-5:** Der Abschnitt #demo in der Hilfe enthält dasselbe wie der Block auf der Anmeldeseite: Daten aller Besucher, nächtliches Zurücksetzen, nur erfundene Daten, kein eigener API-Schlüssel, eigene Installation über betrieb@muster-hosting.ch. Das Ziel ist also das richtige.
- **N-6:** Auf der Anmeldeseite steht kein kurzer Hinweis oben, sondern der volle Demo-Block in `main` nach h1 «Anmelden» und dem Einleitungssatz. «Öffentliche Demo» ist dort nur ein Absatz, keine Überschrift. Mit der Überschriften-Navigation (H) komme ich also nicht hin. Bis zu «Mit Google anmelden» höre ich vier Absätze. Mit Tab komme ich direkt zum Knopf (4. Tab-Stopp).
- **N-7:** Auf der Anmeldeseite höre ich in `main` vor dem h1 den Absatz «Dwello».
- **N-8:** Abgemeldet steht die Sprachwahl in einer Navigation «Sprachwahl». Angemeldet ist «Sprache: Deutsch» ein einfacher Knopf im Banner. Das ist uneinheitlich, stört aber nicht.
- **N-9:** Abgemeldet zeigt /help im Banner nur «Anmelden» und keinen Link «Hilfe», /privacy und /terms zeigen beides. Auf der Hilfeseite selbst ist das logisch.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 4 Skripte. 8 Seiten mit je 5 Tab-Stopps und einem Skip-Link-Test, dazu Wechsel über die Navigation, «Mehr zur Demo» von zwei Seiten aus und auf /help selbst.

## Ablauf

- Mit «Mehr zur Demo» auf /help#demo angekommen. Erwartet: der Fokus oder wenigstens der Startpunkt der Tab-Reihenfolge steht beim Abschnitt «Öffentliche Demo». Gesehen: Der Fokus steht auf `body`, der nächste Tab geht zu «Datenschutz» im Fusszeilenbereich. Der Grund: Nach #demo gibt es auf der Hilfeseite keine Links mehr. Kein Fehler (N-4).
- Anmeldeseite: Erwartet war der kurze Hinweis oben wie auf den anderen Seiten. Gesehen: der volle Block in `main` nach dem h1 (N-6). Für die Anmeldeseite passt das.

## Vorschläge

Keine, weil es keine Befunde mit Schwere gibt. Wer will, kann für N-6 «Öffentliche Demo» auf der Anmeldeseite als Überschrift (h2) auszeichnen. Für N-4 könnte der Abschnitt #demo `tabindex="-1"` bekommen und beim Ankommen den Fokus erhalten. Dann hört man den Abschnitt sicher zuerst.

## Nicht geprüft

- Kein echter Screenreader (NVDA, JAWS, VoiceOver): beurteilt habe ich den Accessibility-Baum, den Tastaturfokus und die Live-Region.
- Die echte Google-Anmeldung: Ich bin mit der Sitzung des Persona-Kits angemeldet. «Mit Google anmelden» habe ich nur als Tab-Stopp erreicht, nicht ausgelöst.
- Mobile und Zoom: Sven nutzt Desktop 1440 × 900.
- Andere Sprachen als Deutsch: Die Sprache wird am Konto gespeichert, andere Personas laufen gleichzeitig.
