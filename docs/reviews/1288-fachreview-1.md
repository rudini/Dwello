# Fach-Review #1288 / #1289, Schritt 1, Runde 1 (Commit a1f73ce)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Option A (Link «Zum Mietvertrag von {name}») nimmt Hinweis (2) das einzige Merkmal, das den Mietvertrag unterscheidet: die Wohnung. Bei zwei Mietverträgen ohne Vertragsende stehen zwei gleiche Links, die zu verschiedenen Mietverträgen führen. Empfehlung: Variante A' (nur Hinweis 2: «Zum Mietvertrag von {name} für {apartment}»), nicht B. |
| V-2 | Verwalter | Major | Ohne Meldung nach «Erneut versuchen» schlagen zwei Szenarien ohne `@wip` fehl, die die Freigabe von #1289 nicht abdeckt: «Nach dem Aufheben der Wahl nennt der Schritt die Wohnung und ihren Mietvertrag» (Z. 204 «die Warnung schliesst») und «Nach «Meldung schliessen» steht der Fokus wieder auf dem Schritt «Wohnung»» (Z. 210–220). |
| M-1 | Mietrecht | Minor | `contracts_open_contract_text` sagt «Zieht {name} in eine andere Wohnung um, beenden Sie diesen Mietvertrag … mit «Enddatum erfassen»». Ein Umzug beendet den Mietvertrag nicht; er endet erst mit einer Kündigung oder einer Aufhebungsvereinbarung (Art. 266a Abs. 1 OR, Glossar «Aufhebungsvereinbarung»). Korrektur steht in der Textvorlage unten, in der Form von `contracts_apartment_cleared_text`. Gleiche Formulierung in `contracts_parties_fixed_open`, ausserhalb dieses Auftrags. |

## V-1: Option A gegen B: Empfehlung A'

**Belege:** `src/routes/contracts/new/OpenContracts.svelte:15-35` zeigt pro Mietvertrag ohne Vertragsende ein eigenes `Alert`, und alle haben denselben Titel `contracts_open_contract_title` «{name} hat einen Mietvertrag ohne Vertragsende». Der Text lässt ausdrücklich zu, dass ein Mieter zwei Wohnungen mietet («Mietet {name} beide Wohnungen, machen Sie hier weiter»). Wählt der Liegenschaftsverwalter für so einen Mieter eine dritte Wohnung, erscheinen zwei Hinweise.

**Warum A falsch ist:** Mit Option A heissen beide Links «Zum Mietvertrag von Anna Keller». Den Mieter nennt der Titel schon. Unterscheiden lassen sich die beiden Mietverträge nur an der Wohnung. Die Linkliste eines Screenreaders zeigt zwei gleiche Links mit verschiedenen Zielen. Den Link umgibt kein Satz, der ihn erklärt (er steht neben dem `<p>`), und die Titel davor sind gleich. Damit ist der Zweck des Links auch aus dem Kontext nicht zu erkennen (WCAG 2.4.4). Das Issue selbst verlangt «tenant and apartment where it helps». In Hinweis (2) hilft also die Wohnung, in Hinweis (1) der Mieter (die Wohnung steht dort im Titel, und es gibt genau einen sperrenden Mietvertrag).

**Warum nicht B:** `OverlapLink.svelte` (`contracts_overlap_link`) brauchen auch `PeriodStep`, `ReviewStep`, `ContractWizard` und `ContractForm` (Hinweise zum Zeitraum, der sich überschneidet). B würde diese Links mitändern, und auch `contracts_overlap_link_anonymised` bräuchte dann eine Wohnung. B ändert ausserdem das Szenario ohne `@wip` mit «Zum Mietvertrag von Bruno Meier». In Hinweis (1) bringt die Wohnung im Link nichts, weil der Titel sie schon nennt.

**Korrektur (A'):** Hinweis (1) bleibt unverändert. In Hinweis (2) wird die Wohnung als `apartmentName(unit, building)` in **einem** Platzhalter `{apartment}` geschrieben, und der Link folgt demselben Muster «Mietvertrag von {Mieter}», ergänzt um die Wohnung: `contracts_open_contract_link` = «Zum Mietvertrag von {name} für {apartment}». Ein neuer Schlüssel ist nicht nötig, `contracts_overlap_link` wird nicht wiederverwendet. Im `@wip`-Szenario «Der Hinweis auf den eigenen Mietvertrag …» ändert sich nur die letzte Zeile, was frei ist: `Und bietet der Hinweis auf den Mietvertrag von "Anna Keller" den Link "Zum Mietvertrag von Anna Keller für Wohnung 2.02 · Ahornhof"`. «Mieter hat noch einen Mietvertrag ohne Vertragsende» prüft `toContain("Wohnung 2.02")` (`contract-form.steps.ts:451`) und gilt mit dem neuen Text weiter. «Vom Hinweis zum laufenden Mietvertrag» sucht den Link über seine Rolle und bleibt deshalb unberührt. Die Frage A gegen A' entscheidet der Product Owner in #1288.

## V-2: Freigabe von #1289 reicht nicht für alle betroffenen Szenarien

**Belege:** Der Abschnitt «Decided» von #1289 gibt nur «Nach dem Laden hebt Dwello die Wahl einer nicht verfügbaren Wohnung auf» frei. Ohne `@wip` und auf die Warnung angewiesen sind aber auch:
- `contract-new.feature:204` `Und der Liegenschaftsverwalter die Warnung schliesst` in «Nach dem Aufheben der Wahl nennt der Schritt die Wohnung und ihren Mietvertrag»;
- `contract-new.feature:209-220` «Nach «Meldung schliessen» steht der Fokus wieder auf dem Schritt «Wohnung»» (#1158). Ohne Meldung gibt es diesen Fall nicht mehr.

**Warum falsch:** Entfällt die Meldung, scheitern diese Schritte. Um sie zu streichen oder umzuschreiben, braucht es eine Entscheidung (CLAUDE.md, Workflow 1). Dass der Fokus nach dem Laden auf `next` geht (`ContractsUnknown.svelte:34`), regeln die Szenarien danach nicht mehr. Die Regel aus #1158 (der Fokus geht nicht verloren, wenn «Erneut versuchen» verschwindet) bräuchte einen Ersatz.

**Korrektur:** #1289 um eine Entscheidung ergänzen: In Z. 204 die Zeile streichen, und das Fokus-Szenario ersetzen, z.B. durch «Nach dem Laden steht der Fokus auf dem Schritt «Wohnung»» ohne den Schritt mit der Meldung. Bis dahin unter «Blocked on me».

## Textvorlage (Option A', Hinweis 2)

Platzhalter: `{name}` = Mieter, `{apartment}` = `apartmentName(unit, building)`, z.B. «Wohnung 2.02 · Ahornhof» / «Appartement 2.02 · Ahornhof» / «Appartamento 2.02 · Ahornhof» / «Apartment 2.02 · Ahornhof». Im Französischen steht U+00A0 nach « und vor ».

| key | de | fr | it | en |
|-----|----|----|----|----|
| contracts_open_contract_text | Für {name} ist ein Mietvertrag für {apartment} ohne Vertragsende erfasst. Zieht {name} um, endet dieser Mietvertrag nicht von selbst. Ist er gekündigt oder ein Vertragsende vereinbart, tragen Sie das Vertragsende auf seiner Seite mit «Enddatum erfassen» ein. Mietet {name} beide Wohnungen, machen Sie hier weiter. | Pour {name}, un contrat de bail sans fin du contrat est saisi pour {apartment}. Si {name} déménage, ce contrat de bail ne prend pas fin de lui-même. S’il est résilié ou qu’une fin du contrat a été convenue, saisissez la fin du contrat sur sa page avec « Saisir la date de fin ». Si {name} loue les deux appartements, continuez ici. | Per {name} è registrato un contratto di locazione senza fine del contratto per {apartment}. Se {name} trasloca, questo contratto di locazione non termina da sé. Se è disdetto o è stata pattuita una fine del contratto, inserisca la fine del contratto sulla sua pagina con «Registrare la data di fine». Se {name} prende in locazione entrambi gli appartamenti, continui qui. | A rental contract for {apartment} without a contract end is recorded for {name}. If {name} moves, this rental contract does not end by itself. If it was terminated by notice or a contract end was agreed, enter the contract end on its page with «Enter end date». If {name} rents both apartments, continue here. |
| contracts_open_contract_link | Zum Mietvertrag von {name} für {apartment} | Vers le contrat de bail de {name} pour {apartment} | Al contratto di locazione di {name} per {apartment} | Go to the rental contract of {name} for {apartment} |

Gilt der Entscheid für Option A (Link nur mit dem Mieter): `contracts_open_contract_text` wie oben, als Link `contracts_overlap_link` («Zum Mietvertrag von {tenant}», unverändert). V-1 bleibt dann offen.

## #1289: sagt der Hinweis alles, was die Meldung sagte?

Die Meldung sagte drei Dinge. «Wohnung ist nicht verfügbar» steht jetzt im Titel `contracts_apartment_cleared_title`, und zwar mit der Wohnung. «Dwello hat die Auswahl aufgehoben» steht im Text («Dwello hat die Auswahl darum aufgehoben»). «Mietverträge sind geladen» sagt der Hinweis nicht ausdrücklich. Das ist keine Lücke: Der Hinweis «… liessen sich nicht laden» mit «Erneut versuchen» verschwindet, und an seiner Stelle nennt der Schritt den sperrenden Mietvertrag mit seinem Link. Das gelingt nur mit geladenen Mietverträgen. Die drei `@wip`-Szenarien geben die Regel aus «Decided» richtig wieder: Sie nennen die aufgehobene Wohnung, prüfen die Ansage über `role="status"`, prüfen, dass keine Meldung erscheint und keine Wohnung gewählt ist, und dass der Hinweis mit einer anderen Wohnung verschwindet. Zu beachten sind nur die Folgeszenarien aus V-2.

Geprüft: «Wohnung {number} · {building}» (`apartmentName`, `buildings_apartment_number`) in allen vier Sprachen als einheitliche Schreibweise; Begriffe Mietvertrag, Vertragsende, gekündigt, Aufhebungsvereinbarung nach UBIQUITOUS_LANGUAGE.md und i18n-begriffe.md; Art. 266a Abs. 1 OR (Fedlex, Stand 1. Oktober 2026): «Die Parteien können das unbefristete Mietverhältnis unter Einhaltung der gesetzlichen Fristen und Termine kündigen, sofern sie keine längere Frist oder keinen anderen Termin vereinbart haben.»

## Nicht bestätigt

- Ob die Ansage über `role="status"` **genau einmal** erfolgt (der Bereich muss schon bestehen, bevor der Hinweis erscheint): Das Szenario prüft nur, dass der Hinweis im Statusbereich steht. Die Prüfung gehört zu Code-Review und Persona (Sven).
- Ob es fachlich üblich ist, im Französischen den Artikel vor «Appartement 2.02 · …» wegzulassen («pour Appartement 2.02 · Ahornhof»): Die Form folgt dem bestehenden Titel `contracts_apartment_cleared_title`. Eine Quelle für den Gebrauch in Romandie-Verwaltungen habe ich nicht gesucht.
