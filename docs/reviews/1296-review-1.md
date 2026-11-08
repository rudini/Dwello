# Code-Review #1296, Runde 1 (6568d76..a46af7f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Verschiebung von `OpenContracts` hinter `ApartmentStep` (ContractWizard.svelte:369-370). Die Reihenfolge im Schritt ist jetzt Auswahl, Hinweis «nicht geprüft», Hinweis zur aufgehobenen Wahl, «frei ab», eigener Mietvertrag. Der DOM-Test (contract-wizard.dom.test.ts:985-988) prüft per `compareDocumentPosition`, dass der Hinweis hinter `apartment-select` steht; auf 6568d76 stand er davor, der Test war dort also rot. Das neue Szenario (contract-new.feature:113-122) wartet zuerst auf den Hinweis und fragt dann mit `ShareInViewport` nach dem Anteil der Auswahl im Fenster. Die Frage liefert einen Wert, denselben wie bei `apartmentHintInWindow`. Der Step ruft nur eine Question auf. Das Feature beschreibt, was der Verwalter will. Kein Text, kein neuer Zustand, kein API-Vertrag ist betroffen. Das Szenario «Nach dem Aufheben der Wahl steht im Schritt nur der Hinweis …» (:242) prüft nur, ob der Hinweis fehlt; die Reihenfolge berührt es nicht. Der Diff ist minimal (ponytail-review: nichts Ungenutztes, kein kopierter Helfer).

## Nicht bestätigt

- 150 % Zoom hat kein eigenes Szenario. Nur 200 % ist abgedeckt (720×450, die Hälfte von 1440×900). 150 % gibt mehr Höhe, deshalb gilt die Anforderung dort nach der Überlegung mit. Gemessen habe ich das nicht.
- Dass das neue Szenario auf 6568d76 rot war, habe ich nur durch Lesen geprüft. Es ist plausibel: Der Hinweis wurde über der Auswahl eingefügt und schob sie bei 450 px Höhe nach unten. Gesehen habe ich es nicht.
- Vom Aufrufer gemeldet: lint, check, fitness, testcheck:audit und deepcheck:audit sauber; vitest --changed origin/main 811 bestanden; E2E chromium contract-new und contract-edit 141 bestanden; axe- und Sprachzeilen von contract-new 42 bestanden; neues Szenario und DOM-Test vor der Verschiebung rot.
