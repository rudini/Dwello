# Code-Review #1298, Runde 1 (5cc6bc1..6972cc1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: die neuen Texte in `messages/{de,fr,it,en}.json:1674, 1692` stimmen Wort für Wort mit der Tabelle in `docs/reviews/1298-fachreview-1.md` überein (das bestehende U+00A0 im Französischen bleibt, die neuen Sätze brauchen keins); `src/routes/config/+page.svelte:232, 322` zeigen beide Schlüssel, sonst nutzt sie kein Code und kein Test mit dem alten Wortlaut; die zwei Szenarien (`tests/e2e/features/settings.feature:253-266`) beschreiben, was der Liegenschaftsverwalter sieht, ohne `@wip`, das zweite schreibt die Einstellungen und trägt deshalb `@einstellungen-global` wie die anderen Szenarien, die das ganze Formular speichern; die Grundlage öffnet die Einstellungen, also prüft das Hilfe-Szenario die Beschreibung am Kontrollkästchen (`setting-accountHolderIsSender`, `Accessible.descriptionOf`), ohne etwas zu speichern; der neue Schritt ruft nur eine Frage auf (`Text.of(savedNotice)`), die den Text selbst zurückgibt; der FIELDS-Eintrag wird nur vom Hilfe-Schritt gelesen; beide Szenarien und der Pin-Test in `src/__tests__/i18n.test.ts:208-219` schlagen gegen die alten Texte fehl (alte Hilfe endet auf «…des Kontoinhabers.», alte Bestätigung ohne «Konto mit Kontoinhaber»); `config-pages.test.ts:156` geht mit dem Text mit; kein neuer Bildschirmzustand, also keine Einträge in `screens.json`; kein bestehendes Szenario und kein bestehender Schritt geändert; ponytail-review: kein ungenutzter Code, keine Kopie eines Helfers, nichts ausserhalb der Anforderung.

## Nicht bestätigt

- Rote Läufe der zwei Szenarien als `@wip` (alte Hilfe bzw. alte Bestätigung empfangen): vom Aufrufer gemeldet; durch Lesen bestätigt, dass beide gegen die Texte von 5cc6bc1 fehlschlagen.
- Pin-Test in `i18n.test.ts` vor den Texten rot (4 failed): vom Aufrufer gemeldet.
- `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/config-pages.test.ts` (95 passed): vom Aufrufer gemeldet.
- `bun run test:e2e -- --project=chromium tests/e2e/features/settings.feature` (33 passed): vom Aufrufer gemeldet.
- axe- und Sprach-Zeilen des Bildschirms `config` (12 passed): vom Aufrufer gemeldet.
- `bun run lint` und `bun run check` sauber: vom Aufrufer gemeldet.
- Die Herkunft «Personas Marco und Helga in #1202» in den Szenario-Kommentaren: nicht nachgelesen (kein Issue-Zugriff im Review-Worktree).
