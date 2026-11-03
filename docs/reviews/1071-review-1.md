# Review #1071, Runde 1 (zugleich Schlussrunde), Commit e6f60ce00

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/screenplay/questions.ts:89 | `ReachingOut` misst nur Element-Rechtecke (`querySelectorAll('*')`), keine Textzeilen: Text, der über die Karte hinausläuft, während sein Element in der Karte bleibt, ergibt 0. Die alte Messung fing das (scrollWidth des Elements). |

## C-1: Text, der über die Karte hinausläuft, bleibt unbemerkt

**Warum falsch:** Der Entscheid in #1071 verlangt zu prüfen, ob «a part of the building card reaches beyond the card's box». Ein Element bekommt sein Rechteck aus dem Layout, nicht aus dem Text darin. Ein Block-Span, der auf die Breite seines Containers gestreckt wird, behält diese Breite auch dann, wenn sein Text sichtbar darüber hinausläuft (overflow: visible). Text-Nodes erfasst `querySelectorAll('*')` nicht. Die Frage prüft also weniger als «die Karte zeigt das Gebäude ganz» und weniger als den Wortlaut des Entscheids. Mit dem heutigen Markup erzwingt die Min-Content-Breite des `flex-1`-Spans, dass ein zu breites Wort auch das Element vergrössert. Bei der üblichen Kürzungs-Korrektur (`min-w-0`) fällt dieser Schutz aber weg, und gerade gegen solche Rückfälle steht das Szenario da.

**Wie man zeigt, dass es fehlschlägt:** In `src/routes/statements/generate/BuildingChoice.svelte` beim Span `flex flex-1 flex-col gap-1` die Klasse `min-w-0` ergänzen, beim Adress-Span `whitespace-nowrap`. Bei 390 px läuft die Adresse von «Lindenhof» sichtbar über den rechten Kartenrand hinaus. Der Adress-Span ist im Spalten-Flex auf die Spaltenbreite gestreckt, also bleiben sein Rechteck und das aller anderen Elemente in der Karte. `ReachingOut` meldet 0, das Szenario bleibt grün. Die alte Frage `HiddenSideways` hätte für den Adress-Span `scrollWidth - clientWidth > 0` gemeldet.

**Korrektur:** Die Textzeilen mitmessen, z. B. über einen Range: `const range = document.createRange(); range.selectNodeContents(box);` und `[...range.getClientRects()]` zusätzlich zu den Element-Rechtecken mit `overhang` gegen `outer` prüfen. Das bleibt eine Messung über Rechtecke, so wie es der Entscheid verlangt.

Hinweis (kein eigener Befund, durch den Entscheid gedeckt): Inhalt, den ein Element mit `overflow: hidden` oder `truncate` innerhalb der Karte abschneidet, ragt nicht über die Karte hinaus und wird deshalb nicht mehr erkannt. Die alte Messung erkannte ihn. Diese Lockerung folgt aus dem Wortlaut von #1071 («reaches beyond the card's box»). Ob «ganz» auch innen abgeschnittenen Text ausschliessen soll, entscheidet der Product Owner.

## Nicht bestätigt

- `bun run lint` und `bun run check` sauber: vom Aufrufer gemeldet.
- Szenario grün in Chromium, rot in Chromium mit einem 600 px breiten Adress-Span (310 gemeldet): vom Aufrufer gemeldet. Beim Lesen stimmig: Die Min-Content-Breite des `flex-1`-Spans wächst mit und ragt über die Karte hinaus.
- Grün in Firefox und WebKit: nicht geprüft, lokal nicht installiert, erst CI zeigt es. Damit ist auch die Aussage im Doc-Kommentar «reads alike in every browser» unbestätigt. Welches Element in Firefox die 10 px meldete, steht weder im Commit noch in #1071 (Issue über REST gelesen).

Geprüft: Entscheid #1071 (REST) und `Spec change approved: #1071` im Commit; Szenariotext unverändert; Schichtregeln (Step ruft nur Task und Question); `HiddenSideways` bleibt in statement-edit genutzt, nichts ungenutzt zurückgelassen; Randfälle `hidden` (Breite 0, übersprungen), Teile mit Breite 0, Rundung (`Math.round`, Toleranz < 0,5 px, bei Kartenpadding 16 px unkritisch), Karte breiter als das Fenster (rechts gegen `clientWidth`, links gegen 0), `overflow: hidden` auf der Karte selbst (Rechtecke der Kinder werden trotzdem gemessen, also erkannt).
