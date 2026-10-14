# Fachreview B-15 (#152), Runde 2

Gegenstand: Delta von Runde 1 in Commit 8545bed (Bereich 8e229d4..8545bed) und die offenen Befunde aus `docs/reviews/b15-fachreview-1.md`. Geprüft: `messages/{de,fr,it,en}.json` (`contracts_parties_fixed_help` Zeile 606, `backend_contract_parties_fixed` Zeile 1250), `tests/e2e/features/contract-edit.feature:71-75`, `tests/e2e/steps/contract-form.steps.ts:225-244`, `src/routes/contracts/ContractForm.svelte` (Panel «Mieter und Wohnung»), Löschweg (`src/routes/contracts/[id]/+page.svelte:122-127`, `+page.server.ts:232-244`), Backend-Regel (`backend/src/services/contract.service.ts:353-355`), Issues #116, #140, #148, #152, #155.

Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md`, `docs/design/i18n-begriffe.md`. Neue Rechtsaussagen gibt es in dieser Runde nicht; die Fedlex-Zitate zu M-1 stehen wörtlich in Runde 1 und sind unverändert in #155 übernommen.

## Ergebnis

Kein Blocker, kein Major offen. Alle Befunde aus Runde 1 sind behoben oder als offene Arbeit in einem Issue. Neu: ein Minor (V-6) zur deutschen Formulierung des Fehlerfalls.

| ID | Rolle | Schwere | Befund | Status |
|---|---|---|---|---|
| V-1 | Verwalter | Major | Kein Weg für einen Erfassungsfehler | behoben (Rest in #116) |
| V-2 | Verwalter | Minor | «beenden» ohne Schaltfläche «Beenden» | behoben |
| V-3 | Verwalter | Minor | Szenario prüft die Hilfe nicht | behoben |
| V-4 | Verwalter | Nit | en «create» statt «add» | behoben |
| V-5 | Verwalter | Nit | Entscheid-Issue #148 offen | behoben |
| M-1 | Mietrecht | Minor | Fälle, in denen der Mietvertrag rechtlich weiterläuft | offene Arbeit (#155) |
| V-6 | Verwalter | Minor | de «Mieter … falsch erfasst» lässt sich als Tippfehler im Namen lesen und führt dann zum Löschen statt zu «Mieter bearbeiten» | neu, offen |

## Befunde aus Runde 1

### V-1 (Major): behoben, Rest in #116

**Beleg.** `messages/de.json:606`: «… Haben Sie Mieter oder Wohnung falsch erfasst und hat der Mietvertrag noch nicht begonnen, löschen Sie ihn und erfassen ihn neu.» Der Weg gibt es wirklich: «Löschen» steht auf der Detailseite immer (`src/routes/contracts/[id]/+page.svelte:122-127`). Der Server löscht nur einen Vertrag, der noch nicht begonnen hat (`+page.server.ts:232-240`, sonst `contracts_started_not_deletable`), und das Backend lehnt nur Verträge mit Nebenkostenabrechnung ab (`contract.service.ts:381-393`). Ein künftiger Vertrag hat noch keine Abrechnung. Die Hilfe sagt also nur, was die App auch zulässt.

Für einen begonnenen Vertrag empfiehlt die Hilfe nicht mehr «beenden», sondern schweigt. Das ist die Variante, die Runde 1 als zulässig vorschlug («#152 verweist bis dahin auf #116»). Der Kommentar in #116 sagt, dass die Hilfe nach A-7 auf begonnene Verträge erweitert wird. Damit ist der Fall verfolgt.

**Restrisiko (kein eigener Befund).** Wer einen begonnenen Vertrag falsch erfasst hat, findet weiterhin keinen sauberen Weg und greift vielleicht zum Vertragsende. Das ist der Gegenstand von #116, nicht von B-15.

### V-2 (Minor): behoben

`messages/de.json:606`: «… geben Sie diesem Mietvertrag ein Vertragsende und erfassen einen neuen.» Das passt zu allen Status. Einem Vertrag ohne Vertragsende gibt man eines mit «Beenden», einem befristeten Vertrag im Formular selbst. Den Begriff «Vertragsende» gibt es im Glossar (`UBIQUITOUS_LANGUAGE.md:36`). fr «fin du contrat», it «fine del contratto», en «contract end» entsprechen `i18n-begriffe.md:26`. Den Backend-Text mit «Beenden Sie» (`de.json:1250`) habe ich in Runde 1 akzeptiert, weil er nur bei veralteter Seite oder einem API-Aufruf erscheint. Er bleibt unverändert.

### V-3 (Minor): behoben

`contract-edit.feature:75`: «Und erfährt der Liegenschaftsverwalter, dass er bei einem Mieterwechsel einen neuen Mietvertrag erfasst». Der Schritt (`contract-form.steps.ts:239-244`) prüft, dass `contract-parties-help` «Bei einem Mieterwechsel» enthält. Der Schritt läuft nach der Prüfung der Namen, also auf dem Formular und nicht auf einer Fehlerseite. Den Fehlerfall (Löschen) prüft das Szenario nicht. Für B-15 genügt das, weil die Regel «Mieterwechsel = neuer Mietvertrag» lautet.

### V-4 (Nit): behoben

`messages/en.json:606`: «… and add a new one. … delete it and add it again.» `en.json:1250`: «End the rental contract and add a new one.» Das stimmt mit `i18n-begriffe.md:80, 83` überein («add», «delete»). fr «supprimez-le et saisissez-le à nouveau» und it «lo elimini e lo registri di nuovo» stimmen ebenfalls (`i18n-begriffe.md:80, 83`).

### V-5 (Nit): behoben

`gh api repos/rudini/Dwello/issues/148`: state `closed` («B-15: Editing a contract silently drops a changed tenant or apartment»), als Duplikat von #152.

### M-1 (Minor): offene Arbeit, #155

#155 («F-23: Contracts that continue by law (death, Art. 263 OR, Art. 121 ZGB)») hat die Labels `fachlich` und `entscheiden`. Die Zitate von Art. 266i OR und Art. 263 Abs. 3 OR stimmen wörtlich mit den Fedlex-Zitaten aus Runde 1 überein. Das Issue nennt Optionen und «Done means» und verweist auf die offene Frage «Aufhebungsvereinbarung» (`anforderungen-vertragsende.md:66`). Der fehlende Begriff «Mieterwechsel» steht als Kommentar in #140, mit Wortlautvorschlag. Für B-15 ist nichts mehr zu tun.

## Neuer Befund

### V-6 (Minor): «Mieter … falsch erfasst» ist mehrdeutig

**Beleg.** `messages/de.json:606`: «Haben Sie Mieter oder Wohnung falsch erfasst und hat der Mietvertrag noch nicht begonnen, löschen Sie ihn und erfassen ihn neu.» Runde 1 schlug vor: «Haben Sie den falschen Mieter oder die falsche Wohnung gewählt …».

**Warum falsch.** «Mieter falsch erfasst» liest ein unerfahrener Vermieter auch als «den Mieter mit falschem Namen, falscher Adresse oder falscher IBAN erfasst». Dann ist der richtige Weg «Mieter bearbeiten»: Der Mieter-Datensatz wird korrigiert, und der Mietvertrag bleibt. Löschen und neu erfassen ändert daran nichts, weil der neue Vertrag wieder auf denselben falsch erfassten Mieter zeigt. Bei einer Wohnung gilt dasselbe: Eine falsche Fläche oder Wertquote korrigiert man an der Wohnung, nicht am Vertrag. Die anderen Sprachen sind eindeutig: fr «le mauvais locataire ou le mauvais appartement», it «l’inquilino o l’appartamento sbagliato», en «the wrong tenant or apartment».

**Korrektur.** de: «Haben Sie den falschen Mieter oder die falsche Wohnung gewählt und hat der Mietvertrag noch nicht begonnen, löschen Sie ihn und erfassen ihn neu.» fr, it und en bleiben. Kein Szenario betroffen, weil Zeile 75 nur «Bei einem Mieterwechsel» prüft.

## Bestätigt (Delta)

- **Backend-Regel:** `contract.service.ts:353-355` lehnt nur einen *anderen* Mieter oder eine *andere* Wohnung ab (`CONTRACT_PARTIES_FIXED`). Dieselben Werte gehen durch. Das stimmt mit der Regel aus Runde 1 überein (Art. 253 OR, Zitat in Runde 1) und mit `docs/api-specification.md` (PUT `/:id`).
- **Formular:** Mieter und Wohnung werden als Text angezeigt, ohne Auswahl, und die Hilfe steht sichtbar beim Feld (`ContractForm.svelte`, Panel «Mieter und Wohnung»). Das entspricht den Design-Regeln («visible help text at the field»).
- **Begriffe:** «Mieterwechsel», «Wohnung», «Mietvertrag», «Vertragsende», «erfassen», «löschen» sind im Glossar oder werden dort verwendet (`UBIQUITOUS_LANGUAGE.md:36, 72, 115, 127`). «Mieterwechsel» als eigener Eintrag ist in #140 beantragt.
- **fr/it sprachlich:** fr «saisissez une fin du contrat pour ce contrat de bail et saisissez-en un nouveau» wiederholt «saisissez» und «contrat», ist aber korrekt und folgt `i18n-begriffe.md`. Darum kein Befund.
- **Keine Formel betroffen:** Das Delta berechnet keine Beträge.

## Fehlende Begriffe

Keine neuen. «Mieterwechsel» steht in #140 (Kommentar).

## Nicht bestätigt

- **Ob der Löschweg für einen künftigen Vertrag im Browser durchläuft:** Die Bedingung habe ich im Code geprüft (`+page.server.ts:232-244`, `contract.service.ts:375-396`), aber keinen E2E-Lauf und keine laufende App gesehen.
- **Runde-1-Punkte unter «Nicht bestätigt»** (Praxis bei Art. 263 OR/Art. 121 ZGB, Formularpflicht nach Art. 270 Abs. 2 OR, Mitmieter, Umbenennen eines Mieters als Umweg) bleiben unverändert offen und liegen ausserhalb von B-15. Der Umweg über die Umbenennung ist mit V-6 verwandt, hier aber nicht geprüft.
