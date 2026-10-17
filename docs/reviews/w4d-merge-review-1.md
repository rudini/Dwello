# Merge-Review aae1fc1 (origin/main in claude/w4d-i18n-83-84, PR #355, #83/#84)

Eltern: `^1` = 1be33f6 (Branch), `^2` = f900e5b (main), Merge-Base aaa415f. Geprüft im Worktree `review-merge` (detached auf aae1fc1).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. Die Auflösung übernimmt beide Seiten vollständig und ohne Fremdänderung. |

Kein Blocker, kein Major.

## Belege

- **Branch-Änderungen vollständig erhalten:** Die Plus/Minus-Zeilen von `git diff aae1fc1^2 aae1fc1` sind für `messages/`, `backend`, `src`, `tests`, `docs/design` und `docs/archive` identisch mit `git diff aaa415f aae1fc1^1` (Vergleich per `diff`, rc=0). Damit ist der Fedlex-Tausch der Branch-Seite (fr «délai de congé», «terme de congé», «réception du congé»; it «termine di preavviso», «la prossima scadenza di disdetta», «ricevimento della disdetta»; en/fr `statements_balance_settled`) unverändert im Merge.
- **main-Änderungen vollständig erhalten:** Die Zeilen von `git diff aae1fc1^1 aae1fc1` sind für dieselben Pfade identisch mit `git diff aaa415f aae1fc1^2` (rc=0): Korrespondenzadresse/Land (W3c, `tenants_correspondence_address*`, `tenants_country`), Tod/Übertragung (`contracts_parties_fixed_by_law`, `contracts_end_death` mit «Adresse de correspondance» / «Indirizzo di corrispondenza»), `settings_error_iban` mit Liechtenstein, `statements_old_address`, nächste Schritte (`contracts_next_steps_text`, `_successor`, `_address`).
- **Konfliktschlüssel:** `git show --cc` zeigt für `contracts_parties_fixed_by_law` und `contracts_end_death` die main-Fassung, für `contracts_parties_fixed_transfer` (main unverändert) die Branch-Fassung mit «sans délai de congé» / «senza termine di preavviso». Korrekt.
- **Keine alten Begriffe:** `grep -iE "délai de résiliation|terme de résiliation|termine di disdetta|ricezione|réception de la résiliation"` in `messages/fr.json`, `messages/it.json`, `backend/src/services/*.ts`: kein Treffer. `grep "Settled|Soldé|by heating profile"` in en/fr: kein Treffer.
- **PDF- und Brieftexte:** `git diff aae1fc1^1 aae1fc1 -- backend/src/services/{pdf.service,reminder-pdf,reminder-letter}.ts` enthält nur main's Adresslogik (`countryLine`, `qrTown`, Feld `country`), keine Textänderung; `reminder-letter.ts` unverändert gegenüber `^1`.
- **Neue main-Texte in fr/it/en mit den Branch-Wörtern:** Die neuen Texte nutzen die Glossarwörter (`docs/design/i18n-begriffe.md`): «décompte des charges» / «conteggio spese accessorie» / «utility cost statement», «rappels» / «solleciti» / «reminders», «adresse de correspondance» / «indirizzo di corrispondenza» / «correspondence address», «résilié» / «disdetto» / «terminated». Keiner nennt Kündigungsfrist, Kündigungstermin oder den Zugang der Kündigung, also gibt es in ihnen nichts zu tauschen.
- **Glossar:** Beide Zeilen sind erhalten, main's Zeile «Korrespondenzadresse» und die Branch-Zeilen (Kündigungsfrist, Ausgeglichen, ❓-Änderungen); das ergibt der `docs/design`-Vergleich oben.
- **Archiv:** Beide Sessions sind vollständig erhalten (Vergleich beider Richtungen rc=0; nur eine Leerzeile zwischen den Sessions kommt neu dazu).
- **Selbst nachgeprüft:** `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/statements-i18n.test.ts` auf aae1fc1: 30 Tests bestanden. Damit gelten die Begriffs-Pins (`/(délai|terme)s? de résiliation/` in fr, `/termin[ei] di disdetta|\bricezione\b/` in it) über die ganzen gemergten Dateien.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, check, backend type-check, `bunx vitest run` (2808), Backend-Tests für PDF, Brief und Mahnung (139). Nicht erneut ausgeführt, ausser den zwei oben genannten Vitest-Dateien; Backend-Tests auf Anweisung nicht gestartet.
- E2E (`sprachen-bildschirme.feature`, `accessibility.feature`) für die zusammengeführten Bildschirme ist nicht gelaufen (verboten); für den Merge ohne neue Konfliktlogik nicht nötig.
- Die Wortwahl der main-Texte in fr/it über die Glossarbegriffe hinaus (z. B. «dans la fiche du locataire») wurde nicht sprachlich geprüft; sie ist unverändert von main übernommen.
