# Fach-Review #668 (Personas B-15), Schritt 1, Runde 1

Gegenstand: neue @wip-Szenarien in `tests/e2e/features/contract-edit.feature:310-325` und `tests/e2e/features/contract-new.feature:132-142` (Worktree `review-668-fach`, 84e7003), dazu die Texte S-4, H15-3 und H15-9.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Der Link `contracts_notice_hint_link` heisst «Kündigung mit «Enddatum erfassen» eintragen». Er passt nicht mehr, sobald der Titel auch einen Wechsel im Einvernehmen meint, denn dafür gibt es keine Kündigung. Behebung: «Vertragsende mit «Enddatum erfassen» eintragen», siehe Wortlaut. |
| V-2 | Verwalter | Minor | Dem Hinweis fehlt der zweite Schritt bei einem Wechsel im Haus: Für die andere Wohnung braucht es einen neuen Mietvertrag (Art. 253 OR, Mietsache). Behebung: dritter Satz in `contracts_notice_hint_text`, siehe Wortlaut. |
| M-1 | Mietrecht | Minor | Schon vor dieser Änderung vorhanden. «Enddatum erfassen» setzt immer `terminated: true` (`src/routes/contracts/[id]/+page.server.ts:232`). Ein im Einvernehmen beendeter Mietvertrag, etwa beim Wechsel in eine andere Wohnung, steht danach als «Unbefristet, gekündigt auf den …» da (`contracts_end_terminated`). Der neue Hinweis schickt genau diesen Fall dorthin, also wird der Fehler sichtbarer. Die Frage steht offen in `docs/anforderungen-vertragsende.md:75-77` (A-1, «Aufhebungsvereinbarungen als eigene Art», «Nicht dazu»). Vorschlag: Issue (`domain`, `needs-decision`), Text unten. Die Merge-Freigabe hängt nicht daran. |

Geprüft: S-4 «Mietvertrag von {name} bearbeiten», passend zu `apartments_contract_of` und zu `tenants_edit_page_title`. H15-3: Der Platzhalter «Zieht der Mieter aus oder in eine andere Wohnung?» trifft beide Fälle, Auszug und Wechsel. Den Wortlaut von Helga brauchen wir nicht, ihr Vorschlag ist für einen Alert-Titel zu lang. Der Hinweis rät richtig von «Befristet» ab: Ein unbefristeter Vertrag endet durch Kündigung (Art. 255 Abs. 3 und 266a Abs. 1 OR) oder durch Vereinbarung. «Befristet» bedeutet nach Art. 255 Abs. 2 OR ein Ende, das von Anfang an vereinbart ist. Dwello würde den Vertrag zudem nach Ablauf als möglicherweise stillschweigend fortgesetzt melden (A-6, Art. 266 Abs. 2 OR). H15-9: «·» steht im Code (`src/lib/contract-form.ts:246`) und nicht in `messages/*.json`. Das Zeichen ist sprachneutral und gleich wie in `contracts/[id]/edit/+page.server.ts:35`, `contracts/[id]/+page.svelte:122` und `ContractRow.svelte:27`. In de, fr, it und en lesen es alle als Trennzeichen. Im Französischen ist es mit Leerzeichen davor und danach nicht mit dem Point médian zu verwechseln. Kein Szenario auf main zitiert den Bindestrich; nur Unit-Tests tun es (`src/__tests__/contract-form.test.ts:459-478` und `contract-wizard.test.ts:87,212,239-241`). Diese passt der Implementierer an.

## Fedlex (OR, Stand 1. Oktober 2026)

- Art. 253 OR: «Durch den Mietvertrag verpflichtet sich der Vermieter, dem Mieter eine Sache zum Gebrauch zu überlassen, und der Mieter, dem Vermieter dafür einen Mietzins zu leisten.»
- Art. 255 Abs. 2 und 3 OR: «Befristet ist das Mietverhältnis, wenn es ohne Kündigung mit Ablauf der vereinbarten Dauer endigen soll.» / «Die übrigen Mietverhältnisse gelten als unbefristet.»
- Art. 266 Abs. 2 OR: «Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»
- Art. 266a Abs. 1 OR: «Die Parteien können das unbefristete Mietverhältnis unter Einhaltung der gesetzlichen Fristen und Termine kündigen, sofern sie keine längere Frist oder keinen anderen Termin vereinbart haben.»
- Art. 266l Abs. 1 OR: «Vermieter und Mieter von Wohn- und Geschäftsräumen müssen schriftlich kündigen.»

## Wortlaut

Die fr-Werte sind als JSON geschrieben. ` ` steht dort, wo die bestehenden Keys ein geschütztes Leerzeichen haben: vor «?» und innerhalb von « ».

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_edit_title | Mietvertrag von {name} bearbeiten | "Modifier le contrat de bail de {name}" | Modificare il contratto di locazione di {name} | Edit rental contract of {name} |
| contracts_notice_hint_title | Zieht der Mieter aus oder in eine andere Wohnung? | "Le locataire déménage-t-il ou change-t-il d’appartement ?" | L’inquilino trasloca o cambia appartamento? | Is the tenant moving out or to another apartment? |
| contracts_notice_hint_text | Dann tragen Sie das Vertragsende auf der Seite des Mietvertrags mit «Enddatum erfassen» ein. So bleibt er unbefristet, und Dwello nennt die nächsten Schritte. Zieht der Mieter in eine andere Ihrer Wohnungen, erfassen Sie danach für diese Wohnung einen neuen Mietvertrag. | "Saisissez alors la fin du contrat sur la page du contrat de bail avec « Saisir la date de fin ». Il reste ainsi de durée indéterminée et Dwello indique les prochaines étapes. Si le locataire passe dans un autre de vos appartements, saisissez ensuite un nouveau contrat de bail pour celui-ci." | Allora inserisca la fine del contratto nella pagina del contratto di locazione con «Registrare la data di fine». Così resta a tempo indeterminato e Dwello indica i prossimi passi. Se l’inquilino passa a un altro dei Suoi appartamenti, registri poi un nuovo contratto di locazione per quell’appartamento. | Then enter the contract end on the rental contract page with «Enter end date». The contract stays open-ended, and Dwello shows the next steps. If the tenant moves to another of your apartments, then add a new rental contract for that apartment. |
| contracts_notice_hint_link | Vertragsende mit «Enddatum erfassen» eintragen | "Saisir la fin du contrat avec « Saisir la date de fin »" | Registrare la fine del contratto con «Registrare la data di fine» | Record the contract end with «Enter end date» |

Der Seitentitel ist `{m.contracts_edit_title({ name })} - Dwello`. Er braucht keinen eigenen Key. Wie auf der Bearbeitungsseite des Mieters gilt `name` = Vorname und Nachname.

## Szenariozeilen

| Datei:Zeile (main oder @wip) | bisher | neu |
|---|---|---|
| contract-detail.feature:138 (main, ohne @wip) | `Dann ist der Liegenschaftsverwalter auf der Seite "Mietvertrag bearbeiten"` | `Dann heisst die Bearbeitungsseite "Mietvertrag von Anna Keller bearbeiten"` |
| contracts.feature:61 (main, ohne @wip) | `Dann ist der Liegenschaftsverwalter auf der Seite "Mietvertrag bearbeiten"` | `Dann heisst die Bearbeitungsseite "Mietvertrag von Anna Keller bearbeiten"` |
| contract-edit.feature:313 (@wip) | `Dann heisst die Bearbeitungsseite "Mietvertrag von Anna Keller bearbeiten"` | unverändert |
| contract-edit.feature:325 (@wip) | `Dann fragt der Hinweis zum Vertragsende "Zieht der Mieter aus oder in eine andere Wohnung?"` | unverändert (Wortlaut bestätigt) |
| contract-new.feature:136 und 142 (@wip) | `… "Wohnung 2.01 · Ahornhof"` | unverändert |

Zu den beiden Zeilen ohne @wip:

- Den Schritt `ist der Liegenschaftsverwalter auf der Seite {string}` (`tests/e2e/steps/common.steps.ts:21-24`) behalte ich nicht. Er vergleicht den Titel roh, ohne `seed.withNames`. Der Mieter heisst im Seed aber «Anna Keller <token>» (`tests/e2e/fixtures/backend.ts:170`), also schlüge «Mietvertrag von Anna Keller bearbeiten» dort fehl.
- Der neue Schritt löst die Namen auf und prüft dazu die Überschrift.
- Beide Zeilen sind eine Spec-Änderung: Sie brauchen `Spec change approved: #<n>`.
- Ohne Freigabe bleiben nur die Zeilen auf main gleich. Die Seite zeigt dann zwar den neuen Titel, die Zeilen schlagen aber fehl. #668 muss die Freigabe deshalb vor dem Grünwerden festhalten.
- «Funktionalität: Mietvertrag bearbeiten» (contract-edit.feature:3) und der Schritt «den Mietvertrag bearbeiten will» zitieren keinen UI-Text und bleiben, wie sie sind.

## Fehlender Begriff (Issue-Vorschlag zu M-1)

Titel: «Vertragsende im Einvernehmen von einer Kündigung unterscheiden». Vorschlag fürs Glossar: **Aufhebungsvereinbarung**: «Mieter und Vermieter beenden einen unbefristeten Mietvertrag im Einvernehmen auf einen vereinbarten Tag, ohne Kündigung und ohne Kündigungsfrist, z.B. beim Wechsel in eine andere Wohnung desselben Vermieters.» Anzeige statt «gekündigt auf den»: «Unbefristet, beendet auf den {date}». Labels: `domain`, `needs-decision`. Ein offenes Issue dazu habe ich nicht gefunden (REST-Suche nach «Einvernehmen», «Aufhebungsvereinbarung», «gekündigt auf», «Vertragsende»).

## Nicht bestätigt

- Für den Wechsel in eine andere Wohnung desselben Vermieters, beendet durch eine Aufhebungsvereinbarung, gibt es keine Fedlex-Norm, die das ausdrücklich regelt (**unsicher**). Art. 115 OR betrifft nur das formlose Aufheben einer Forderung. Dass die Parteien den Vertrag im Einvernehmen aufheben dürfen, folgt aus der Vertragsfreiheit (Art. 19 OR, nicht abgerufen). Die Texte setzen das nicht voraus: Sie verlangen nur ein Vertragsende und einen neuen Mietvertrag.
- Die Wortwahl it «trasloca o cambia appartamento» und fr «change d’appartement» habe ich an `contracts_parties_fixed_open` und `contracts_open_contract_text` geprüft. `docs/design/i18n-begriffe.md` hat dafür keine Zeile.
