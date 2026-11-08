# Abschlussreview 689-close, Runde 1 (2b08b94f, Bereich 6a2d80e3..2b08b94f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Verschiebung von `TranslationMarker.svelte` nach `src/lib` ohne Änderung des Markups. Alle vier Aufrufer (`CategoryRow.svelte:35`, `DistributionKeyRow.svelte:31`, `heating-profiles/+page.svelte:66`, `heating-profiles/[id]/+page.svelte:65`) und der DOM-Test importieren den neuen Pfad. Sonst verweist nichts auf den alten Pfad. Der Prop-Typ `Parameters<typeof translatedLanguages>[0]` (`Named`, `src/lib/names.ts:3`) verlangt jetzt `name`. Alle Aufrufer übergeben ganze Datensätze mit `name`. `translatedLanguages` liest nur `nameFR/IT/EN`, deshalb verhält sich der Hinweis ohne den früheren Default `name: ''` gleich. Die Fixture im Test ergänzt `name` nur wegen des Typs, die Erwartungen bleiben unverändert. Die Verschiebung braucht kein neues Szenario und keine neuen Texte, Bildschirmzeilen oder Verträge.

## Nicht bestätigt

- `bun run fitness`, `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/translation-marker.dom.test.ts src/__tests__/names.test.ts` auf 2b08b94f: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Merge von origin/main (aa200efc) ohne Konflikt: vom Aufrufer gemeldet, liegt ausserhalb des geprüften Bereichs.
