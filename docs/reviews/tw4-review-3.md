# Review Runde 3 (Abschluss): Tailwind 3 -> 4, Delta 5a69e3e..3ec9c6ee

Offene IDs aus tw4-review-1.md und tw4-review-2.md: keine.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/styles/globals.css:12 | `::file-selector-button` in der Selektorliste der `border-color: var(--color-line)`-Regel ist jetzt wirkungslos: Die neue Regel (Z. 27–32, gleiche Ebene, gleiche Spezifität, spätere Position) setzt mit dem Kurzwert `border: revert` auch `border-color` auf den Browserwert zurück. Tailwind 3 hatte `::file-selector-button` dort auch nicht. Der Selektor kann weg, sonst behauptet die Liste eine Linienfarbe für den Dateiknopf, die nie gilt. |

Keine Blocker, keine Majors.

Geprüft: `revert` in `@layer base` geht auf den Browser-Ursprung zurück (nicht auf die vorherige Ebene), also das Verhalten von Tailwind 3. Utilities (`disabled:opacity-60`, `peer-disabled:opacity-60`) gewinnen weiterhin über base. Das Datei-Input in `FileInput.svelte` ist das versteckte Peer-Element; die Regel zeigt sich nur im sichtbaren Input von `TenantDocumentUpload.svelte`. Der neue Test in tokens.test.ts schlägt ohne die Regeln fehl (er prüft nur ihren Text) und ist grün (`bunx vitest run src/__tests__/tokens.test.ts`: 51 bestanden, selbst ausgeführt). Kein Szenario nötig: Die Änderung stellt nur das Aussehen von main wieder her, und der Screenshot-Job in CI deckt das ab. Im Delta steht nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Die gleichen berechneten Stile von Select, Input und `::file-selector-button` wie im v3-Build (Chromium-Vergleich des Aufrufers): nicht nachgerendert, weil Build und Browserlauf hier nicht erlaubt sind. Nur aus dem Preflight-Wissen plausibel gemacht. Ob `margin-inline-end` und `border-radius` des Dateiknopfs (beide setzt der v4-Preflight) dem v3-Stand entsprechen, bestätigt allein der Vergleich des Aufrufers bzw. der Screenshot-Job in CI.
- Die vier übrigen Screenshot-Unterschiede (Pixel an den Kartenecken) gelten als «keine Änderung»: vom Aufrufer gemeldet, Bilder nicht eingesehen.
- Lint, design-guard-Tests (485) und Build auf 3ec9c6ee: vom Aufrufer gemeldet. CI auf 5a69e3e grün: vom Aufrufer gemeldet.
