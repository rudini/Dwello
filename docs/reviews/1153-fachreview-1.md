# Fach-Review #1153, Runde 1 (Workflow Schritt 1)

Gegenstand: `tests/e2e/features/contract-new.feature:156-183` (zwei @wip-Szenarien), Schritte `tests/e2e/steps/contracts-retry.steps.ts`, Commit 4976c1d5f, geplanter Hinweis (`Alert`) im Schritt «Wohnung».

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Die Erklärung kennt nur «gekündigt»; ein vereinbartes Vertragsende (Aufhebung im Einvernehmen, Ersatzmieter) führt zu «Sonst wählen Sie eine andere Wohnung». |
| V-2 | Verwalter | Minor | «Sie hat einen unbefristeten Mietvertrag» am Satzanfang liest sich als Anrede an den Vermieter («Sie haben …»); im Toast klärt der Doppelpunkt davor den Bezug, im Kasten fehlt er. Fix: Wortlaut unten («Für diese Wohnung ist … erfasst»), `feature:169` anpassen. |
| V-3 | Verwalter | Minor | Kein Szenario zeigt, dass der Link auf den sperrenden Mietvertrag führt, wenn die Wohnung auch einen beendeten Vormieter-Vertrag hat. Mit nur einem Vertrag (`feature:175`) besteht auch eine Umsetzung den Test, die den neuesten oder den ersten Vertrag verlinkt. Fix: im zweiten Szenario einen gekündigten Vormieter-Vertrag auf 2.01 anlegen (z.B. «Carla Frei» bis 2024-03-31). |
| V-4 | Verwalter | Minor | Kein Szenario zeigt, dass der Kasten nach der Wahl einer anderen Wohnung verschwindet (geplantes «bleibt, bis eine Wohnung gewählt ist»). Fix: Schritt «Und der Liegenschaftsverwalter in der Auswahl die Wohnung "…" wählt / Dann steht im Schritt «Wohnung» kein Hinweis …». |
| M-1 | Mietrecht | Minor | `contracts_overlap_link_anonymised` ist hier nicht erreichbar: Ein unbefristeter, ungekündigter Mietvertrag hat `end_date` null, sein Mieter ist also aktuell und lässt sich nicht anonymisieren (`backend/src/services/tenant-anonymise.service.ts:23,26`; UL «Anonymisierter Mieter» = ehemaliger Mieter). Fix: Variante weglassen, keine Zeile in `screens.json` dafür. |

## V-1 (Major)

**Beleg:** Der Entwurf und `feature:169` sagen: «Ist er gekündigt, tragen Sie das Vertragsende zuerst … ein. Sonst wählen Sie eine andere Wohnung.» Für denselben Fall nennen `contracts_overlap_advice_end_other` und `contracts_overlap_advice_end_other_edit` (`messages/de.json:843-844`) bereits beide Wege: «… weil er gekündigt oder ein Vertragsende vereinbart ist, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein.» Laut UL «Vertragsende» (`UBIQUITOUS_LANGUAGE.md:40`) kann ein unbefristeter Vertrag auch an einem «mit dem Mieter vereinbarte[n] Tag (z.B. Ende im Einvernehmen, Ersatzmieter nach Art. 264 OR)» enden.

OR, Stand 1. Oktober 2026:
- Art. 255 Abs. 2 und 3: «Befristet ist das Mietverhältnis, wenn es ohne Kündigung mit Ablauf der vereinbarten Dauer endigen soll. Die übrigen Mietverhältnisse gelten als unbefristet.»
- Art. 264 Abs. 1: «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; …»

Ein unbefristetes Mietverhältnis kann also enden, ohne dass jemand kündigt. Dass der Vertrag dann rechtlich durch Aufhebungsvereinbarung endet, ist Lehre und Praxis und steht so nicht im Gesetzeswortlaut (der Art. 115 OR betrifft die Aufhebung einer Forderung): **unsicher** in der Begründung, sicher in der Praxis.

**Warum falsch:** Ein Vermieter mit einer Aufhebungsvereinbarung liest «nicht gekündigt» und dann «Sonst wählen Sie eine andere Wohnung». Er gibt die Wohnung auf, obwohl er nur das Vertragsende nachtragen müsste. Damit sagt der Kasten weniger als der Kasten zur Überschneidung im selben Assistenten.

**Fix:** Wortlaut unten («Ist dieser Mietvertrag gekündigt oder ein Vertragsende vereinbart, …»); `feature:169` entsprechend. Der Toast `contracts_apartment_contracts_blocked` bleibt unverändert, wie vorgegeben. Sein Szenario steht auf `main`, und der Kasten trägt die vollständige Anleitung.

## Wortlaut

Die Leerzeichen innerhalb von « » im Französischen sind U+00A0, wie in `contracts_overlap_advice_end_other`.

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_apartment_cleared_title | {apartment} ist nicht verfügbar | {apartment} n’est pas disponible | {apartment} non è disponibile | {apartment} is not available |
| contracts_apartment_cleared_text | Für diese Wohnung ist ein unbefristeter Mietvertrag erfasst, der nicht gekündigt ist. Dwello hat die Auswahl darum aufgehoben. Ist dieser Mietvertrag gekündigt oder ein Vertragsende vereinbart, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung. | Un contrat de bail de durée indéterminée, non résilié, est saisi pour cet appartement. Dwello a donc annulé la sélection. Si ce contrat de bail est résilié ou qu’une fin du contrat a été convenue, saisissez d’abord la fin du contrat sur sa page avec « Saisir la date de fin ». Sinon, choisissez un autre appartement. | Per questo appartamento è registrato un contratto di locazione a tempo indeterminato, non disdetto. Dwello ha quindi annullato la selezione. Se questo contratto di locazione è disdetto o è stata pattuita una fine del contratto, inserisca prima la fine del contratto sulla sua pagina con «Registrare la data di fine». Altrimenti scelga un altro appartamento. | An open-ended rental contract that has not been terminated is recorded for this apartment. Dwello has therefore cleared the selection. If this rental contract was terminated by notice or a contract end was agreed, first enter the contract end on its page with «Enter end date». Otherwise choose another apartment. |

- `{apartment}` = `apartmentName(unit, building)` ohne Fläche (die Option in `src/lib/contract-form.ts:248` hängt `, {size}` an, der Titel nicht).
- Die Erklärung nennt die Wohnung als «diese Wohnung» und nicht mit einem Pronomen. So stellt sich die Frage nach dem Geschlecht nicht (de «Wohnung» ist weiblich, fr «appartement» und it «appartamento» sind männlich).

**Link:** `contracts_overlap_link` passt in allen vier Sprachen, so wie er ist: «Zum Mietvertrag von {tenant}» / «Vers le contrat de bail de {tenant}» / «Al contratto di locazione di {tenant}» / «Go to the rental contract of {tenant}». Die Variante `contracts_overlap_link_anonymised` entfällt hier (M-1).

## Nicht bestätigt

- Bestehendes Verhalten, nicht Gegenstand dieser Änderung: Dwello sperrt eine Wohnung bei jedem unbefristeten, ungekündigten Mietvertrag ganz (`src/lib/utils/contract-availability.ts:60-73`, #815), auch wenn er erst künftig beginnt. Ein befristeter Mietvertrag, der davor endet, wäre mietrechtlich möglich. Darum ist «Sonst wählen Sie eine andere Wohnung» in diesem Fall unvollständig. Gesucht habe ich in `docs/anforderungen-vertragsende.md` und im PRD und keinen Entscheid dazu gefunden.
- Die rechtliche Grundlage der Aufhebungsvereinbarung (siehe V-1) ist nicht wörtlich belegt: Das OR hat keinen eigenen Artikel dazu, und Art. 115 OR betrifft Forderungen.

Geprüft: Sperrregel gegen Art. 255 und Art. 266a Abs. 1 OR (Stand 1. Oktober 2026: «Die Parteien können das unbefristete Mietverhältnis unter Einhaltung der gesetzlichen Fristen und Termine kündigen …»); Begriffe Mietvertrag, Wohnung, unbefristet, gekündigt, Vertragsende, «Enddatum erfassen» gegen UL und `i18n-begriffe.md`; Titel im Format von `buildings_apartment_number` + « · » + Gebäude; Szenario 1 mit «die Warnung schliesst» belegt, dass der Kasten auch ohne Toast bleibt; Link-Ziel per Detailseite (`feature:183`).
