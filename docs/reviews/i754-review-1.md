# Review #754: Gebäudesuche als GET-Formular (0821feb2..1b995dc0), Runde 1, gleichzeitig Abschlussrunde

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde (Blocker, Major oder Minor). |

Geprüft: alle drei geänderten Dateien gelesen.
- Die URL `?search=x&city=` ohne `page` ändert nichts, was der Liegenschaftsverwalter sieht. Der Loader (`+page.server.ts`) liest einen leeren `city` als «kein Filter» und ein fehlendes `page` als 1. `filtered` und die Anzeige von «Filter zurücksetzen» prüfen auf truthy, sind bei `city=` also false. `listPageUrl` übernimmt `city=` beim Blättern, ohne dass es schadet. `pageSize` ging schon vorher verloren.
- Das Verhalten aus B-16 und O-41 bleibt: `searchTerm` und `cityFilter` werden weiter aus `$page.url.search` abgeleitet, mit `bind:value`. Die drei Fälle in `list-filters.dom.test.ts` laufen für `/buildings` weiter grün.
- Der Fokus nach der Suche bleibt, weil `isListSearch` bei `type === 'form'` true liefert. Neu bekommt auch eine wiederholte Suche nach demselben Begriff den Fokus; das ist harmlos.
- `TextInput` reicht `name` durch.
- `listSearchUrl` wird weiter genutzt (Wohnungen, Rechnungen), `goto` bleibt für `clearFilters` nötig. Es bleibt kein ungenutzter Code zurück.
- Beide neuen bzw. geänderten Tests wären vor der Änderung rot gewesen, weil die Felder kein `name` hatten: `FormData` wäre `{}` gewesen, und `action` hätte ohne Attribut auf die Dokument-URL gezeigt.
- Szenario, Step-Definitionen und E2E-Code sind unverändert. Das Szenario prüft also dasselbe wie vorher.
- Es gibt keine neuen Texte und keinen neuen Bildschirmzustand.
- Die beiden Testdateien habe ich neu laufen lassen: 48 bestanden.

## Nicht bestätigt

- **Ursache des Flakes:** Dass `data-hydrated` (onMount im Layout) vor dem Start des Routers gesetzt wird und `goto` in diesem Fenster nichts tut, konnte ich nicht prüfen. Der SvelteKit-Quelltext (`node_modules/@sveltejs/kit/src/runtime/client/client.js`) ist per Deny-Regel gesperrt. Falls die Ursache eine andere ist, etwa eine gleichzeitige Navigation oder Invalidierung, liefe auch die Formularnavigation des Routers über denselben Weg, und der Fix griffe nicht. Den Beweis liefern erst die nächsten Firefox-Läufe auf CI.
- **Wohnungen und Rechnungen:** `ApartmentFilters.svelte:26` und `InvoiceSearch.svelte:38` nutzen weiter `preventDefault` + `goto` und hätten nach dieser Lesart dasselbe Zeitfenster. Issue #754 nennt nur die Gebäudeliste, sie liegen also ausserhalb des Auftrags. Ein Folge-Issue wäre angebracht, falls die Ursache auf CI bestätigt wird. Das ist kein Befund dieses Diffs.
- **Bereits vorhanden, nicht Teil des Diffs:** `tests/e2e/tasks/buildings.ts:8,11` klickt «Suchen», ohne auf den erreichten Zustand zu warten.
- Vom Aufrufer gemeldet und von mir nicht wiederholt: lint, check, E2E chromium `buildings.feature` (9 bestanden, Suchszenarien 5× mit 20 bestanden). Firefox wurde nicht lokal getestet.
- Die Vitest-Läufe zu `list-filters` und `buildings-pages` habe ich wiederholt (48 bestanden). Sie stehen deshalb nicht in dieser Liste.
