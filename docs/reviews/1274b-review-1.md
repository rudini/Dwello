# Review i1274b, Runde 1 (aff89c4b..d5f83a2f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .github/workflows/pr-comments.yml:159-160 | Die Schleife endet jetzt, kürzt aber nie auf 0 Screenshots: bei `count = 1` setzt sie `listed` auf einen Screenshot, danach bricht `count > 0` ab. Die Titel aus `shots.txt` (Zeile 146) sind nicht begrenzt; ein einzelner Titel über ~58 000 Zeichen ergibt also weiterhin einen Kommentar über 65 536 Zeichen, und `createComment`/`updateComment` scheitert mit 422. Der Job schlägt dann fehl statt zu hängen, und nur der Pull Request des Forks selbst ist betroffen. Der Kommentar in Zeile 154 («the shortening below always ends») stimmt; die Grenze stimmt aber nur für die «look the same»-Liste. |

Geprüft: Die Schleife endet bei jeder Eingabe (`count` sinkt bis 0). `same` ist auf 2000 Zeichen plus Präfix begrenzt. Das Ersetzen von `@` geschieht in beiden Kommentaren; der Bericht wird vor der Prüfung `startsWith(marker)` ersetzt, die Screenshots ersetzen den ganzen Text samt Marker, und keiner der beiden Marker enthält `@`, sie stehen also weiterhin am Anfang. Der Diff enthält nichts, was nicht zur Anforderung gehört. Die beiden Pins in tools/ci/pr-comments.test.ts:61-71 würden auf aff89c4b fehlschlagen, weil die Strings dort fehlen. Kein Szenario nötig, weil es nur um einen CI-Workflow geht und die App sich nicht ändert.

## Nicht bestätigt

- bunx vitest run tools/ci (70 bestanden), eslint, YAML-Parse, `node --check` beider github-script-Körper: vom Aufrufer gemeldet.
- Ob GitHub `@​<name>` wirklich nicht als Erwähnung auswertet: ist nur aus dem Code gelesen, nicht live geprüft (der Workflow läuft nur von main).
