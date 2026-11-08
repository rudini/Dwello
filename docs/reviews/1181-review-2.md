# Review 2 zu #1181 (Delta 8ab223a..4353783, Schlussrunde)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta |

Geschlossen: C-2(a). C-1 vom Aufrufer abgelehnt (Entscheid in #1181 nennt nur den Toast nach dem Löschen); C-2(b) bleibt laut Aufrufer im Bericht 1 offen und wurde hier nicht erneut geprüft.

Geprüft: `TenantDocumentsCard.svelte:140-144` gibt `numberedUploads(documents)` weiter. Die Funktion nummeriert nach `createdAt` aufsteigend und ändert nur `title`, deshalb bleiben `fileName` und `createdAt` für den Abgleich in `TenantDocumentUpload.svelte` (`earlier`, das neueste nach `createdAt`) erhalten. Der Hinweis nennt jetzt dieselbe Nummer wie die Zeile. Der neue DOM-Test (`tenant-detail-page.dom.test.ts:441-454`) lädt zwei Dokumente mit derselben Datei. Das Vertragsdokument aus `tests/contracts/documents.json` stammt vom Oktober 2025, `u1` vom 05.01.2026. Erwartet wird «Ausweiskopie (2 von 2)». Ohne die Änderung schlägt der Test fehl, weil der Hinweis dann «Ausweiskopie» ohne Nummer zeigt. Er schlägt auch fehl, wenn der Hinweis das ältere Dokument nennt, also «(1 von 2)». Keine neuen Texte und keine neuen Zustände, das Delta enthält nichts Fremdes.

## Nicht bestätigt

- DOM-Test vor dem Fix rot und danach grün, `tenant-detail-page.dom.test.ts` mit 43 bestandenen Tests, `bun run lint`, Prettier auf den eigenen Zeilen: vom Aufrufer gemeldet, nicht selbst ausgeführt.
