# Review Tailwind-4-Migration (Runde 1)

Bereich: `git diff 79657e8 675be71` (afceb9e, 675be71), Worktree `review-tw4-code`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/__tests__/tokens.test.ts:90-95 (src/styles/globals.css:9-15) | Der Test «färben Platzhalter und Rahmen ohne Farbangabe mit Tokens» prüft nur noch `extend.borderColor.DEFAULT` in der Konfiguration. Diesen Wert wertet Tailwind 4 nicht mehr aus. Die neue Base-Regel, die die Rahmenfarbe jetzt setzt, prüft kein Test. |
| C-2 | Minor | tailwind.config.js:37-38 | `extend.borderColor: { DEFAULT: 'var(--color-line)' }` ist unter Tailwind 4 toter Code. Auch der Kommentar «Bare `border`/`divide-y` … get the line token» stimmt nicht mehr, denn die Farbe kommt jetzt aus `globals.css`. |
| C-3 | Minor | docs/design/design-decisions.md:11 | Laut D1 wird Inter in `globals.css` eingebunden. Seit 675be71 geschieht das in `src/routes/+layout.svelte`. |

## C-1 (Major): der Token-Rahmen ist nicht mehr durch einen Test geschützt

Laut Anforderung soll `tokens.test.ts` das Token-Thema weiter durchsetzen. Unter Tailwind 3 erzeugte `borderColor.DEFAULT` die Linienfarbe für ein blankes `border` oder `divide-y`, und der Test prüfte genau diese Konfiguration. Unter Tailwind 4 setzt `.border` keine Farbe mehr. Ich habe das mit 4.3.3 aus dem Bun-Cache und der geprüften `tailwind.config.js` im Speicher kompiliert:

```
.border { border-style: var(--tw-border-style); border-width: 1px; }
:where(.divide-y > :not(:last-child)) { … nur style/width … }
```

Die Linienfarbe kommt jetzt allein aus der neuen Regel `*, ::after, … { border-color: var(--color-line) }` in `@layer base` (globals.css:9-15).

So lässt sich zeigen, dass der Test nichts mehr schützt:
1. Die Zeilen 9-15 aus `globals.css` löschen.
2. `bunx vitest run src/__tests__/tokens.test.ts` bleibt grün, denn der Test liest nur `config.theme.extend`.
3. Im Build zeigt danach jeder blanke `border`, `border-2` und `divide-y` die Textfarbe (`currentcolor` aus `border: 0 solid` in der Preflight), nicht die Farbe `line`.

Die Platzhalter-Hälfte desselben Tests prüft dagegen weiterhin die Regel, die wirkt.

Behebung: Der Test prüft die Base-Regel in `globals.css`, also `border-color: var(--color-line)` im Block `@layer base`. Das tote `extend.borderColor` wird entfernt (C-2).

## Nicht bestätigt

- Die Prüfungen `bun run build`, `bun run lint`, `bun run check` und `bunx vitest run` (170 Dateien, 3461 Tests) auf afceb9e meldet der Aufrufer; ich habe sie nicht wiederholt. Auf 675be71 meldet er build, lint und `tokens.test.ts`. Die axe-Suite und E2E sind laut Aufrufer offen; ich habe sie nicht gestartet.
- Dass das erzeugte CSS «Regel für Regel» gleich ist, konnte ich nicht nachvollziehen, weil ich keinen Build starte (`node_modules` im Worktree zeigt auf den Arbeitsbaum des Aufrufers und ist gesperrt). Mit Proben aus dem Cache sehe ich mindestens einen Unterschied, den der Autor nicht aufführt: Tailwind 4 setzt alle `hover:`-Varianten (44 Dateien unter `src/`) in `@media (hover: hover)`. Auf Touch-Geräten bleibt der Hover-Zustand nach einem Tippen also nicht mehr stehen. Am Desktop ändert sich nichts. Ein Fehler ist das nicht, aber die behauptete Gleichheit gilt hier nicht ganz.
- Ob `source('..')` alle Klassen findet, auch `class:hidden` in StatementWizard.svelte:231, habe ich nur über den Aufbau geprüft (der Pfad ergibt `src/`, wie zuvor `content`). Den Abgleich der erzeugten Klassen konnte ich nicht wiederholen.
- Dass die Schriftdateien nach 675be71 ausgeliefert werden (gehashte woff2-Datei, keine Warnungen), beruht nur auf der Meldung des Aufrufers.

Geprüft: postcss/package/bun.lock (autoprefixer entfernt, `@tailwindcss/postcss` 4.3.3), der `@config`- und `source`-Pfad, die Reihenfolge im Base-Layer gegenüber Preflight und Utilities (das Outline von `FileInput` mit 2 px gewinnt), die Wiederherstellung des Button-Cursors gegenüber v3, die Preflight-Unterschiede v3/v4 (kein `<dialog>`/`popover`/`hidden=` betroffen), keine in v4 umbenannten oder entfernten Utilities in `src/` (`outline-none`, bare `ring`, `space-*`, `flex-grow/shrink`, `*-opacity`, `@apply`), das Ersetzen der Farben, Radien und Schatten unter v4 (`bg-red-500`, `shadow-lg`, `rounded-lg` werden nicht erzeugt), die von v4 neu erzeugten Klassen `text-shadow-*`/`inset-shadow-*` (fängt `design-guard.test.ts`), der neue Test in 675be71 (rot auf afceb9e, da `globals.css` dort `@fontsource` enthält), keine weiteren Importe von `globals.css`.
