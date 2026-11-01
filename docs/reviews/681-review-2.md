# Code-Review #681, Runde 2 (Delta 3f2581493..ea86443b3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-1

C-1 ist behoben: Das Szenario prüft jetzt den Text der fokussierten Überschrift. Vor dem Zurückgehen steht der Fokus auf der Überschrift von `ResultList` («n Wohnungen»), danach soll er auf der Überschrift von `EmptyState` stehen («Keine Wohnungen gefunden», `apartments_none_found`). Da `EmptyState` an die Stelle von `ResultList` tritt, ersetzt das Neuzeichnen das Element. Ohne die Popstate-Behandlung findet `expect.poll` darum zuerst «n Wohnungen» und danach den Text des Body, nie aber den erwarteten Text. Die Prüfung kann also nicht mehr zu früh grün werden. Der Kommentar zu `Browser.back` stimmt jetzt: Das Warten übernimmt die nächste Frage, die bis zum erwarteten Wert pollt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: der Rotlauf mit `type !== 'popstate'` in `isListNavigation` (Text des Body erhalten), E2E `apartments.feature` und `invoices.feature` in Chromium (51 grün), `bun run lint`.

Geprüft: `FocusedText` (normalisiert Leerraum wie `Text.of`, beantwortet den Wert selbst), die neue Frage und den neuen Schritt in den Screenplay-Schichten (der Schritt ruft nur die Frage auf), dass der alte Schritt «… dem Ergebnis der Liste» noch von zwei Szenarien gebraucht wird (`apartments.feature:90`, `invoices.feature:299`), dass `h2[data-testid=list-results]` in `EmptyState` nur den Titel enthält, und dass das Szenario neu in diesem Pull Request ist (keine Änderung der Spezifikation).
