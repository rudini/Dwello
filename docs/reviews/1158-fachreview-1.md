# Fach-Review #1158, Runde 1 (Schritt 1, Commit 83646c0)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| – | – | – | Keine Befunde. |

## Wortlaut

Der deutsche Vorschlag bleibt unverändert. Zwischen fr «disponible» und «;» steht ein geschütztes Leerzeichen (U+00A0), so wie bei den übrigen «;» in messages/fr.json.

| key | de | fr | it | en |
|-----|----|----|----|----|
| contracts_apartment_contracts_blocked | Die Mietverträge der Wohnung sind geladen. Die gewählte Wohnung ist nicht verfügbar; Dwello hat die Auswahl aufgehoben. | Les contrats de bail de l’appartement sont chargés. L’appartement choisi n’est pas disponible ; Dwello a annulé la sélection. | I contratti di locazione dell’appartamento sono caricati. L’appartamento scelto non è disponibile; Dwello ha annullato la selezione. | The apartment’s rental contracts are loaded. The chosen apartment is not available; Dwello has cleared the selection. |

## Nicht bestätigt

Nichts offen. Der Betreff enthält keine Rechtsaussage, deshalb habe ich kein Fedlex-Zitat gebraucht.

Geprüft: Der erste Satz stimmt in allen vier Sprachen wörtlich mit `contracts_apartment_contracts_loaded` überein. Die Begriffe «nicht verfügbar», «Auswahl aufgehoben», «annulé la sélection», «annullato la selezione» und «cleared the selection» stimmen mit `contracts_apartment_cleared_title` und `contracts_apartment_cleared_text` überein. Den Grund (unbefristet, nicht gekündigt) und das Vorgehen («Enddatum erfassen») nennt weiterhin der Hinweis im Schritt (contract-new.feature:170), so wie UBIQUITOUS_LANGUAGE.md «Vertragsende» und «Befristet / Unbefristet» sie beschreiben. Der Toast verliert also keine fachliche Aussage. Punkt 3 ist fachlich richtig: `contracts_open_contract_text` sagt «Mietet {name} beide Wohnungen, machen Sie hier weiter». Diese Aussage setzt eine gewählte zweite Wohnung voraus. Der Hinweis gehört deshalb erst nach der Wahl einer Wohnung in den Schritt. Die Szenarien bei feature:89–103 (jetzt mit der Wahl von «2.01») und das neue Szenario «Nach dem Aufheben der Wahl …» (Wahl aufgehoben, Anna Keller hat für «2.02» einen Mietvertrag ohne Vertragsende, kein Hinweis) bilden das ab. Die Zeilen 93 und 101 ändern Szenarien ohne `@wip` auf `main`. Die Pull-Request-Beschreibung braucht dafür «Spec change approved: #1158» (Punkt 3 der Entscheidung deckt das).
