# Slice-Review landing-kompakt, Runde 2 (Re-Review)

Bereich: `git diff eac0035 67e33ff`, Worktree `review-landing-kompakt-code2` (67e33ff). Vorbericht: `docs/reviews/landing-kompakt-review-1.md`.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Major | erledigt | Die Punkte «Vier Sprachen», «Übersicht mit nächstem Schritt» und «Versand per E-Mail oder Brief» sind aus dem Index entfernt (marketing/index.html:504-508), dazu die Symbole `i-lang`, `i-grid` und `i-mail` und die sechs Schlüssel in fr/it/en.json. Es gibt keinen Verweis mehr auf die Symbole (grep in allen vier Seiten). Geblieben sind die vier Punkte, die die Persona (P-2) als neu nennt. |
| C-2 | Major | erledigt | Der Abschnitt `#datenschutz` ist in allen vier Sprachen Byte für Byte gleich wie auf 41d253d (md5 des Abschnitts, de/fr/it/en). Die Regel `.illu` ist wieder da, der Schlüssel «Ein Haus mit einem Server darin» steht in en/fr/it.json, und der Kommentar beim Vermieterjahr verweist wieder auf die Zeichnung. |
| C-3 | Minor | abgelehnt, Begründung trägt | Der Block fasst zwei frühere Blöcke zusammen, und der QR-Zahlteil ist ein eigener Inhalt, kein doppeltes Bild. Keine weitere Runde. |
| C-4 | Minor | erledigt | `.badge.ok` und `.feature.wide` sind entfernt. Die übrigen `class="ok"` (Terminal-Ausgabe :539, :561, :581) hängen nicht an `.badge.ok`. |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Axe WCAG 2.2 AA (vier Sprachen, hell und dunkel, 1440/768/390, 0 Verstösse) und kein seitliches Scrollen: vom Aufrufer gemeldet, nicht wiederholt, weil ein Browserlauf nicht vorgesehen ist.
- `python3 marketing/i18n/build.py`: Den Build habe ich ohne Schreiben nachgerechnet (`write_text` umgeleitet, Skript `/tmp/claude-0/-home-user-Dwello/1fcd03a4-dbbc-58c9-880c-20c065d35c71/scratchpad/lk-verify.py`). Ergebnis: Alle generierten Seiten stimmen mit dem Build überein, kein unbenutzter Schlüssel, kein deutscher Rest. Der Worktree ist danach sauber.
- Dass Option A des Product Owners auch die Vergleichstabelle bei Open Source, die Legende im Index und den Satz zu den automatischen Tests streicht: Das meldet der Aufrufer, und es kommt in den Pull Request. Die Entscheidung selbst habe ich nicht gesehen.

Geprüft: alle Dateien im Delta, auch der Persona-Bericht `docs/design/personas/helga-landing-kompakt.md` und der Vorbericht.
