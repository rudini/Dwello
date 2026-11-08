# Fachreview #1255, Runde 1 (Commit feb8f58)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die Ablehnung im Szenario (Platzhalter, distribution-keys.feature:131) sagt nicht, was der Liegenschaftsverwalter tun kann. Der Text unter «Wortlaut» ersetzt ihn. |
| V-2 | Verwalter | Major | Reihenfolge: Die neue Prüfung muss nach `DISTRIBUTION_KEY_IS_DEFAULT` laufen, nicht nur nach `DISTRIBUTION_KEY_IN_USE(_ONE)`. Sonst ist «Danach lässt sich der Verteilschlüssel löschen» für den Standard-Verteilschlüssel falsch. |

## V-1 (Major): Ablehnung ohne nächsten Schritt

- Beleg: distribution-keys.feature:131 «Der Verteilschlüssel steht in einer Abrechnung und kann nicht gelöscht werden.»; CLAUDE.md, Design-Regeln: «errors say what happened and what to do».
- Was die App erlaubt (geprüft):
  - Ein Entwurf lässt sich neu berechnen (`statement.service.ts:596-603`). Die Neuberechnung setzt die Abrechnungspositionen aus der heutigen Berechnung neu (`calculatedRows`, `statement.service.ts:480-523`). Der Verteilschlüssel einer Position kommt dabei aus zwei Quellen: aus den Rechnungen (`calculation.service.ts:112, 394-402`) und für die Position «Veränderung Tankbestand» aus der letzten Rechnung der Kategorie, sonst aus dem Standard in den Einstellungen (`fuel-stock.service.ts:61-83`, `keyFor`). Zur neuen Ablehnung kommt es nur, wenn keine Rechnung mehr den Verteilschlüssel trägt (`invoiceCount` zählt alle Rechnungen, `distribution-key.service.ts:108, 222`). Nach der Neuberechnung ist er also aus dem Entwurf verschwunden, sofern er nicht der Standard ist (siehe V-2).
  - Ein Entwurf lässt sich auch löschen. Das geht nur bei Entwürfen (`statement.service.ts:989`, `STATEMENT_NOT_DRAFT`).
  - Versendete, bezahlte und ersetzte Abrechnungen lassen sich weder neu berechnen (`STATEMENT_NOT_RECALCULABLE`, Z. 599) noch löschen. Für sie gibt es keinen Weg, und der Text muss das sagen. Hier gilt dasselbe wie bei #1160.
- Lösung: den Text der Tabelle «Wortlaut» in alle vier Dateien und in Z. 131 übernehmen. Kein Zählparameter, wie bei #1160.

## V-2 (Major): Prüfreihenfolge zum Standard-Verteilschlüssel

- Beleg: `fuel-stock.service.ts:80` `const id = bill?.id ?? (await getTypedConfig('default_distribution_key_id'));`. Die Position «Veränderung Tankbestand» erhält den Standard-Verteilschlüssel, wenn keine Rechnung der Kategorie einen Verteilschlüssel trägt. `DISTRIBUTION_KEY_IS_DEFAULT` prüft heute nach `IN_USE` (`distribution-key.service.ts:235-241`).
- Warum falsch: Läuft die neue Prüfung vor `IS_DEFAULT`, bekommt ein eigener Verteilschlüssel, der als Standard hinterlegt ist und nur über den Tankbestand in einem Entwurf steht, die neue Meldung. Diese verlangt «Neu berechnen». Die Neuberechnung setzt aber denselben Standard wieder ein. Der Liegenschaftsverwalter bleibt in einer Schleife, und der letzte Satz der Meldung stimmt nicht.
- Lösung: Reihenfolge `PREDEFINED` → `IN_USE(_ONE)` → `IS_DEFAULT` → `IN_STATEMENT`, die neue Prüfung also unmittelbar vor `db.delete`. Zwei Tests halten das fest: Verteilschlüssel mit Rechnung und Abrechnungsposition ergibt `DISTRIBUTION_KEY_IN_USE_ONE`; Standard-Verteilschlüssel mit Abrechnungsposition, aber ohne Rechnung ergibt `DISTRIBUTION_KEY_IS_DEFAULT`.

## Wortlaut

| key | de | fr | it | en |
|-----|----|----|----|----|
| backend_distribution_key_in_statement | Der Verteilschlüssel steht in einer Abrechnung und kann nicht gelöscht werden. Eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat, mit ihren Verteilschlüsseln. Steht der Verteilschlüssel nur in Entwürfen, berechnen Sie diese mit «Neu berechnen» auf ihrer Seite neu oder löschen Sie sie. Danach lässt sich der Verteilschlüssel löschen. | La clé de répartition figure dans un décompte et ne peut pas être supprimée. Un décompte envoyé reste tel que le locataire l’a reçu, avec ses clés de répartition. Si la clé de répartition ne figure que dans des brouillons, recalculez-les avec « Recalculer » sur leur page ou supprimez-les. La clé de répartition pourra ensuite être supprimée. | La chiave di riparto figura in un conteggio e non può essere eliminata. Un conteggio inviato resta come l’ha ricevuto l’inquilino, con le sue chiavi di riparto. Se la chiave di riparto figura solo in bozze, le ricalcoli con «Ricalcolare» sulla loro pagina o le elimini. Dopo si potrà eliminare la chiave di riparto. | The distribution key is in a statement and cannot be deleted. A sent statement stays as the tenant received it, with its distribution keys. If the distribution key is only in drafts, recalculate them with «Recalculate» on their page or delete them. Then the distribution key can be deleted. |

(fr: zwischen den Guillemets und «Recalculer» steht je ein geschütztes Leerzeichen U+00A0, wie in `backend_category_in_statement`. fr/it: «clé de répartition» und «chiave di riparto» sind weiblich, deshalb «supprimée» und «eliminata».)

Geprüft: Begriffe im Szenario und im Kommentar (Verteilschlüssel, Abrechnung, versendete Abrechnung, Abrechnungsposition, Mieter, Liegenschaftsverwalter, Seite «Verteilschlüssel») stimmen mit UBIQUITOUS_LANGUAGE.md überein (Z. 134, 180). Zur Vorbedingung: Der Verteilschlüssel «Fläche und Zimmer» kommt aus der Grundlage (Z. 9). Die Rechnung vom 2025-03-31 fällt in die erzeugte Abrechnung 2025 (`backend.ts:252-256`), und weil sie danach gelöscht wird, greift `IN_USE` nicht. Das ist der Fall, den das Szenario braucht. Die Aufräumarbeit `purgeStatements` läuft vor `extras` (`backend.ts:742-744`), der Verteilschlüssel lässt sich danach also löschen. Die Begründung im Kommentar (Z. 120) stimmt mit `statement-pdf.service.ts:107-108` überein: ohne Verteilschlüssel kein Name und ein Anteil aus den Beträgen. fr/it/en folgen `docs/design/i18n-begriffe.md` Z. 76 und 118 sowie `backend_category_in_statement`. `keys_delete_text` und `keys_note` bleiben richtig, weil keiner der beiden behauptet, dass sich ein Verteilschlüssel ohne Rechnungen immer löschen lässt. Die Begründung stützt sich auf die Praxis der Verwaltung und nicht auf einen Gesetzesartikel, und der Text nennt keinen. Fedlex war deshalb nicht nötig.

## Nicht bestätigt

- Ob «Neu berechnen» eines Entwurfs scheitern kann (z. B. wegen fehlender Werte) und der Verteilschlüssel dann im Entwurf bleibt: Ich habe nur `recalculateStatement` und `calculatedRows` gelesen, nicht `calculateStatement` als Ganzes. In diesem Fall bliebe dem Liegenschaftsverwalter der zweite Weg, das Löschen des Entwurfs, und der Text nennt ihn.
