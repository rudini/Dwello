# Sven – App-Version in der Fusszeile

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt am Accessibility-Tree (`readOut`) und an der Tab-Reihenfolge. Nur geschaut, nichts gespeichert.

Aufgabe: Die Fusszeile zeigt neben «© 2026 Dwello» jetzt die App-Version, auf jeder Seite inklusive Anmeldung (in diesem Build «Version unbekannt»). Prüfen, wie sich die Fusszeile per Tastatur und Screenreader liest: Accessibility-Tree, Lesereihenfolge, Trennzeichen «·», Sprache des Textes in fr/it/en.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit | Fusszeile (alle Seiten) | Das Trennzeichen «·» steht als Text mitten im Absatz. Je nach Satzzeichen-Stufe des Screenreaders wird es als «Mittelpunkt» / «middle dot» mitgelesen; bei Standardeinstellungen vermutlich stumm. Nicht mit echtem Screenreader überprüft. |

## Beobachtungen

- Die Fusszeile ist auf allen geprüften Seiten ein `contentinfo`-Bereich am Ende der Seite, mit einem Absatz und danach der Navigation «Rechtliches». Das ist sauber und leicht per Landmarke anzuspringen.
- Auf der Anmeldeseite gibt es eine eigene Navigation «Sprachwahl», im angemeldeten Bereich steckt der Sprachknopf im `banner` ohne eigene Landmarke. Unterschiedlich, aber beide gut erreichbar. Hat mit der Versionsanzeige nichts zu tun.
- Nach dem letzten Fusszeilen-Link geht der Fokus auf `BODY` (Browser-Ende der Seite). Das ist normal.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 5 Durchläufe: Übersicht lesen und durchtabben, Sprache viermal per Tastatur wechseln, vier weitere Seiten (Datenschutz, Gebäude, Mietvertrag erfassen, unbekannte Adresse/404), Anmeldeseite ohne Sitzung auf Deutsch und Französisch, dazu Bildschirmfotos auf Desktop und Mobil.

## Ablauf

1. **Übersicht (/dashboard), Accessibility-Tree.**
   Erwartet: Version als Text in der Fusszeile, nicht als eigener Link oder Knopf.
   Gesehen: `contentinfo` → `paragraph: © 2026 Dwello · Version unbekannt`, danach `navigation "Rechtliches"` mit «Datenschutz» und «Nutzungsbedingungen». Ein einziger Absatz, liest sich in einem Zug: «Copyright 2026 Dwello, Version unbekannt». Passt.
2. **Übersicht, Tab-Reihenfolge.**
   Erwartet: Version ist nicht fokussierbar (reiner Text), keine zusätzlichen Tab-Stopps.
   Gesehen: 39 Tab-Stopps im Inhalt, danach direkt «Datenschutz» (in der Fusszeile), dann «Nutzungsbedingungen». Die Version kostet keinen Tab-Stopp. Gut so.
3. **Sprache per Tastatur wechseln** (Tab zu «Sprache: Deutsch», Enter, Tab zur Sprache, Enter).
   Erwartet: Versionstext übersetzt, `lang` der Seite wechselt mit, keine deutschen Reste.
   Gesehen:
   - fr: `lang=fr`, «© 2026 Dwello · Version inconnue», Navigation «Informations légales».
   - it: `lang=it`, «© 2026 Dwello · Versione sconosciuta», «Note legali».
   - en: `lang=en`, «© 2026 Dwello · Version unknown», «Legal».
   - zurück auf de: `lang=de`, «Version unbekannt».
   Keine eigenen `lang`-Attribute in der Fusszeile nötig, weil der ganze Text in der Seitensprache ist. Der Screenreader liest also mit der richtigen Stimme. «inconnue» ist korrekt weiblich zu «version».
4. **Weitere Seiten** (/privacy, /buildings, /contracts/new, /gibtsnicht).
   Erwartet: dieselbe Fusszeile überall.
   Gesehen: auf allen vier identisch, auch auf der Fehlerseite.
5. **Anmeldeseite ohne Sitzung** (/login).
   Erwartet: Version auch hier, gleiche Struktur.
   Gesehen: `contentinfo` mit «© 2026 Dwello · Version unbekannt» nach `main`; Tab-Reihenfolge: Zum Inhalt springen, Hilfe, Sprache, Mit Google anmelden, Nutzungsbedingungen (im Text), dann Datenschutz und Nutzungsbedingungen in der Fusszeile. Nach Sprachwechsel auf Französisch per Tastatur: `lang=fr`, «Version inconnue». Passt.
6. **Bildschirmfotos** (für sehende Kollegen beschrieben).
   Desktop (`04-footer-login.png`): links «© 2026 Dwello · Version unbekannt» in grauer Schrift, rechts die zwei unterstrichenen Links. Mobil 390 px (`05-footer-mobile.png`): Text oben, Links darunter, kein seitliches Scrollen (Seitenbreite 390).

## Verwirrung

- «Version unbekannt»: Ich verstehe, dass das ein Entwicklungs-Build ist. Für mich als Nutzer heisst das nur «keine Angabe»; stört nicht, ich würde sie höchstens beim Support nennen.
- Sonst keine unklaren Begriffe.

## Fehlerrisiken

- Kaum welche: Die Angabe ist reiner Text, nicht bedienbar, verlängert die Tab-Reihenfolge nicht.
- Eine Entwicklungsversion wie «Version 0.4.0+3-gabc1234» würde ein Screenreader Zeichen für Zeichen oder als «plus drei Strich g a b c …» vorlesen. Für den Support ist das genau richtig, für mich nur etwas länger. Konnte ich nicht hören, weil dieser Build keine Version hat.

## Vorschläge

- **P-1 (Nit):** Reproduktion: beliebige Seite, Screenreader mit Satzzeichen-Stufe «alle» (NVDA/JAWS) bis zur Fusszeile lesen lassen; dort könnte «Copyright 2026 Dwello Mittelpunkt Version unbekannt» kommen. Hilfreich wäre, das «·» für Screenreader auszublenden (`aria-hidden`) und die Teile so zu setzen, dass trotzdem eine Pause entsteht, oder es so zu lassen, wenn das Team die Ansage mit echtem Screenreader geprüft hat. Kein Handlungsdruck.

## Nicht geprüft

- Ansage mit echtem Screenreader (NVDA, JAWS, VoiceOver): Ich kann nur den Accessibility-Tree lesen, nicht hören, wie «·» und «©» gesprochen werden.
- Eine echte Versionsnummer («Version 0.4.0» oder «0.4.0+3-gabc1234»): dieser Build hat keinen Versions-Tag, es erscheint nur «Version unbekannt».
- Sprachwechsel auf der Anmeldeseite nur nach Französisch; it und en dort nicht einzeln, im angemeldeten Bereich alle vier.
