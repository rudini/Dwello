# Slice-Review landing-kompakt, Runde 1

Bereich: `git diff 41d253d eac0035` (eac0035, ein Commit), Worktree `review-landing-kompakt-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | marketing/index.html:508, 510, 512 | Der Funktionsindex behält drei Punkte, die andere Abschnitte schon nennen: «Vier Sprachen» (Faktenleiste :398, Schritt 4 :434, Abrechnung :472), «Übersicht mit nächstem Schritt» (Einleitung Vermieterjahr :411, Regel «Eine Hauptaktion pro Seite» :633), «Versand per E-Mail oder Brief» (Schritt 4 :434). Die Anforderung verlangt, dass der Index nur Punkte behält, die kein anderer Abschnitt nennt. |
| C-2 | Major | marketing/index.html:603-622 (Basis :686) | Die Illustration im Datenschutz-Band («Ein Haus mit einem Server darin», `svg.illu`, CSS `.illu`) ist entfernt. Laut Anforderung bleibt der Datenschutz-Abschnitt unverändert. |
| C-3 | Minor | marketing/index.html:479-482 | Der zusammengelegte Block Abrechnung + QR-Rechnung zeigt zwei Bilder (PDF-Seite 1 und QR-Zahlteil, `.pdfs`). Verlangt ist ein Bild pro Block; auf dem Handy liegen die zwei Bilder untereinander und machen die Seite länger. |
| C-4 | Minor | marketing/index.html:105, 179 | Toter CSS-Code bleibt stehen: `.badge.ok` (nur Index und Legende brauchten ihn, beide entfernt) und `.feature.wide` (nur der frühere Block «Verteilschlüssel» war `wide`). In fr/it/en derselbe Stand, weil generiert. |

## C-1 Funktionsindex wiederholt andere Abschnitte

Warum falsch: Die Anforderung ist klar formuliert: Der Index behält nur Punkte, die kein anderer Abschnitt nennt. Drei der sieben Punkte, die geblieben sind, kommen anderswo auf der Seite schon vor, teils fast wörtlich:
- «Per E-Mail oder als Brief» steht im Schritt «Prüfen und versenden» (:434).
- «Die Übersicht sagt Ihnen, was als Nächstes zu tun ist» (:411) und «Die Übersicht zeigt immer den nächsten Schritt» (:633) stehen in anderen Abschnitten.
- «4 Sprachen: Deutsch, Français, Italiano, English» steht in der Faktenleiste (:398), «in der Sprache der Mieterin oder des Mieters» im Abrechnungsblock (:472).

Genau diese Wiederholung sollte die Kürzung entfernen.

Nachweis: Die Texte des Index (:508-514) mit dem Rest der Seite vergleichen (`grep -n "E-Mail oder\|nächste\|Sprache" marketing/index.html`).

Lösung: Die drei Punkte streichen, samt ihren Schlüsseln in `marketing/i18n/*.json` und den dann unbenutzten Symbolen (`i-lang`, `i-grid`, `i-mail`). Oder den Product Owner fragen, ob die Faktenleiste und die Schritte als «Abschnitt» zählen.

## C-2 Datenschutz-Abschnitt geändert

Warum falsch: Laut Anforderung bleiben Hero, die vier Schritte, der Datenschutz, die FAQ und die Rechtsseiten unverändert. Der Commit entfernt trotzdem die Illustration im Datenschutz-Band (Commit-Text: «privacy without its illustration»). Mit ihr fallen die CSS-Regel `.illu`, der Verweis im Kommentar beim Vermieterjahr (:409) und der Übersetzungsschlüssel «Ein Haus mit einem Server darin» weg.

Nachweis: `git diff 41d253d eac0035 -- marketing/index.html`, Hunk `@@ -650,89` (entfernte `<svg class="illu" …>`) und Hunk `@@ -821,28` (neu eingefügtes Band ohne SVG).

Lösung: Die Illustration wiederherstellen, mit `.illu` und den Übersetzungsschlüsseln. Oder belegen, dass die Option A des Product Owners sie streicht. Dann gehört das in die Anforderung und in die Beschreibung des Pull Requests.

## Nicht bestätigt

- Ob die Option A des Product Owners die Vergleichstabelle im Abschnitt Open Source (Basis :863, `.compare`, `.table-wrap`) streicht. Die Anforderung des Aufrufers nennt sie nicht, sie fällt nur unter das allgemeine Ziel «Wiederholungen entfernen» (Preis, Datenort, KI und Lizenz stehen auch in Faktenleiste, Datenschutz und Open-Source-Text). Gelesen habe ich nur die Anforderung und den Commit-Text. Gleiches gilt für den entfernten Satz «Jede Funktion ist mit automatischen Tests abgesichert …» und die Legende im Index.
- Axe-Lauf (0 Verstösse, hell/dunkel, 1440/768/390, vier Sprachen), kein seitliches Scrollen bei 390 px, Seitenhöhen 18.3 -> 13.2 und 31.3 -> 20.8: vom Aufrufer gemeldet, nicht wiederholt (ein Browserlauf war nicht vorgesehen).
- `python3 marketing/i18n/build.py`: vom Aufrufer gemeldet. Ich habe den Build ohne Schreiben in den Worktree nachgerechnet (`write_text` umgeleitet, Skript `/tmp/claude-0/-home-user-Dwello/1fcd03a4-dbbc-58c9-880c-20c065d35c71/scratchpad/lk-verify.py`). Ergebnis: Alle Seiten in fr/it/en stimmen Byte für Byte mit dem Build überein, kein unbenutzter Schlüssel, kein deutscher Rest.
- Wie das Layout aussieht (Index als einfache Liste unter 640 px, Barrierefreiheit zweispaltig ab 980 px): nur das CSS gelesen, nicht gerendert.

Geprüft: alle Anker und Fusszeilen-Links (`#mcp` und «KI und MCP» entfernt, kein toter Anker in de/fr), Nav- und Menüreihenfolge passend zur neuen Abschnittsfolge, keine Verweise mehr auf gelöschte Screenshots (auch nicht in `deploy-site.yml` und `brand.html`), entferntes JS und Symbole ohne verbliebene Nutzung, Roadmap mit MCP (#495) und Export (#496), JSON-Diffs nur mit Löschungen, Hero, Schritte und FAQ unverändert.
