# Code-Review 1290-close, Runde 1 (b609280, Bereich 761d9b3..b609280)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `TenantDocumentUpload.svelte` (die `describedby`-Prop von `Button` landet in beiden Zweigen auf `aria-describedby`, Button.svelte:99/118; gesetzt nur während `uploading`, die id passt zum `<p role="status">`, das zuvor schon da ist); Frage `uploadButtonDescription` (`Accessible.descriptionOf`, bereits importiert, liest den Text über `aria-describedby`) und Schritt in `tenant-documents.steps.ts:379`. Der Schritt steht nicht auf `origin/main` (er kam mit diesem Pull Request), die Prüfung darf also ohne Spec-Freigabe dazukommen. Rot nach Lesen: ohne die Änderung hat der Button kein `aria-describedby`, die Frage gibt "" zurück und der Schritt schlägt fehl (deckt sich mit dem gemeldeten Received ""). Keine neuen oder geänderten Texte, kein neuer Bildschirmzustand, kein API-Vertrag betroffen; ponytail-review: kein ungenutzter Code und keine Kopie eines Helfers.

## Nicht bestätigt

- bun run lint, bun run check, vitest design-guard + tenant-documents, E2E tenant-documents.feature chromium (27 passed, die axe- und Sprach-Zeilen davor auf 761d9b3): vom Aufrufer gemeldet.
- Roter Lauf des Szenarios vor der Änderung an der Komponente: vom Aufrufer gemeldet, nur durch Lesen nachvollzogen (siehe oben).
- Ob ein Screenreader die Beschreibung beim erneuten Fokus wirklich vorliest: kommt auf den Screenreader an, im E2E nur über das Attribut zu prüfen.
