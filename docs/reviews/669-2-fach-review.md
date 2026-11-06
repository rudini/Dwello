# Fach-Review #669, Runde 2 (Commit 5b569bc: C-2, Sven S-2 / Helga H-3, Helga H-1)

Vorbericht: `docs/reviews/669-1-fach-review.md`. Offen bleiben V-1 und V-3 aus Runde 1, sie gehen in den Fixes unten auf.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-5 | Verwalter | Major | Nach dem erneuten Laden bleibt in Schritt 2 eine Wohnung gewählt, die «nicht verfügbar» ist. Die Meldung sagt nur «… sind geladen.» |
| V-6 | Verwalter | Minor | `contracts_delete_draft_contracts_unknown` schickt den Vermieter zu «Erneut versuchen» «bei der Wohnung». Seit P-5 steht der Knopf oben im Formular. Fix: Text unten |
| V-7 | Verwalter | Minor | In Schritt 5 passt `contracts_apartment_contracts_overlap_step` nicht mehr, sobald dort der Kasten steht. Fix: Schritt 5 nimmt `contracts_apartment_contracts_overlap`; `…_overlap_step` gilt nur noch für Schritt 2 |

## V-5 (Major)

**Beleg:**
- «nicht verfügbar» ist `blocked`. Das sind Wohnungen, die laut `backend/src/services/apartment.service.ts:41-44` einen Mietvertrag mit `end_date is null` haben, also einen unbefristeten, nicht gekündigten Mietvertrag. So steht es auch in `contracts_availability_blocked` («Wohnung nicht verfügbar – unbefristeter Mietvertrag, nicht gekündigt»).
- `contracts_apartment_help` sagt: «Vermietete Wohnungen sind mit «nicht verfügbar» markiert und lassen sich nicht wählen.»
- `apartmentChoices` zeigt sie deaktiviert an (`src/lib/contract-wizard.ts:275-285`).

**Warum falsch:** Ein späterer Vertragsbeginn hilft nicht. Der andere Mietvertrag hat kein Vertragsende, und jeder neue Zeitraum überschneidet sich mit ihm. Eine gewählte Wohnung, die sich laut Hilfetext nicht wählen lässt, widerspricht dem Hilfetext. Sie führt höchstens zur Ablehnung beim Speichern in Schritt 5.

**Fix:**
- Die Auswahl aufheben (das Feld zeigt wieder «Wohnung wählen»). Die Meldung sagt, warum und was zu tun ist.
- Ein Weg ist zu nennen: Ist der andere Mietvertrag in Wirklichkeit gekündigt, trägt der Vermieter das Vertragsende dort ein. Dafür den Wortlaut aus `contracts_overlap_advice_end_other` übernehmen.
- In diesem Fall geht die Meldung allen anderen vor, auch `…_overlap_step`.
- Ein `@wip`-Szenario in `contract-new.feature` prüft die Meldung und ein leeres Feld «Wohnung».

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_delete_draft_contracts_unknown | Dwello hat den Entwurf nicht gelöscht: Ohne die Mietverträge dieser Wohnung lässt sich eine Überschneidung nicht ausschliessen. Wählen Sie oben auf der Seite «Erneut versuchen» und danach noch einmal «Entwurf löschen und Mietvertrag speichern». | Dwello n’a pas supprimé le brouillon : sans les contrats de bail de cet appartement, un chevauchement ne peut pas être exclu. Choisissez « Réessayer » en haut de la page, puis à nouveau « Supprimer le brouillon et enregistrer le contrat de bail ». | Dwello non ha eliminato la bozza: senza i contratti di locazione di questo appartamento non si può escludere una sovrapposizione. Scelga «Riprovare» in alto nella pagina e poi di nuovo «Eliminare la bozza e salvare il contratto di locazione». | Dwello did not delete the draft: without the rental contracts for this apartment an overlap cannot be ruled out. Choose «Try again» at the top of the page, then «Delete draft and save rental contract» again. |
| contracts_apartment_contracts_blocked | Die Mietverträge der Wohnung sind geladen. Die gewählte Wohnung ist nicht verfügbar: Sie hat einen unbefristeten Mietvertrag, der nicht gekündigt ist. Dwello hat die Auswahl darum aufgehoben. Ist dieser Mietvertrag gekündigt, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung. | Les contrats de bail de l’appartement sont chargés. L’appartement choisi n’est pas disponible : il a un contrat de bail de durée indéterminée, non résilié. Dwello a donc annulé la sélection. Si ce contrat de bail est résilié, saisissez d’abord la fin du contrat sur sa page avec « Saisir la date de fin ». Sinon, choisissez un autre appartement. | I contratti di locazione dell’appartamento sono caricati. L’appartamento scelto non è disponibile: ha un contratto di locazione a tempo indeterminato, non disdetto. Dwello ha quindi annullato la selezione. Se questo contratto di locazione è disdetto, inserisca prima la fine del contratto sulla sua pagina con «Registrare la data di fine». Altrimenti scelga un altro appartamento. | The apartment’s rental contracts are loaded. The chosen apartment is not available: it has an open-ended rental contract that has not been terminated. Dwello has therefore cleared the selection. If this rental contract has been terminated, first enter the contract end on its page with «Enter end date». Otherwise choose another apartment. |
| contracts_overlap_review_where | Den Vertragsbeginn und das Vertragsende ändern Sie im Schritt {period} «{periodStep}», die Wohnung im Schritt {apartment} «{apartmentStep}». | Vous modifiez le début et la fin du contrat à l’étape {period} « {periodStep} », l’appartement à l’étape {apartment} « {apartmentStep} ». | L’inizio e la fine del contratto si modificano nel passo {period} «{periodStep}», l’appartamento nel passo {apartment} «{apartmentStep}». | You change the contract start and contract end in step {period} «{periodStep}», the apartment in step {apartment} «{apartmentStep}». |

## Zu H-1 (Kasten in Schritt 5)

**Kasten unverändert übernehmen.** Titel, Text und Rat bleiben gleich (`contracts_overlap_with`, `contracts_overlap_advice_*`), ebenso der Link.

Begründung: Nach einer Ablehnung beim Speichern stehen dieselben Worte schon heute in Schritt 5 (`ContractWizard.svelte:404-407`, «worded as the refusal», b667 V-1). Der Rat ist auch in Schritt 5 richtig, inklusive «Sonst wählen Sie eine andere Wohnung»: Eine andere Wohnung ist die zweite mögliche Lösung.

Was in Schritt 5 fehlt, ist der Ort der Felder: «Befristet», Vertragsbeginn, Vertragsende und Wohnung stehen in anderen Schritten. Darum im Kasten von Schritt 5 als letzten Satz `contracts_overlap_review_where` anhängen, mit `{period}` = 3 / `m.contracts_period()` und `{apartment}` = 2 / `m.tenants_apartment()`.

Wenn es «Ändern»-Links (`onedit`) zu den Feldern gibt, können sie diesen Satz ersetzen.

## Zuordnung der Erfolgsmeldungen im Assistenten

| Wo | Ohne Vertragsbeginn | Ohne Überschneidung | Mit Überschneidung |
|---|---|---|---|
| Schritt 2 «Wohnung», Wohnung nicht verfügbar | `…_blocked` | `…_blocked` | `…_blocked` |
| Schritt 2 «Wohnung», sonst | `…_loaded` | `…_checked` | `…_overlap_step` |
| Schritt 3 «Vertragsdauer» | – | `…_checked` | `…_overlap` |
| Schritt 5 «Prüfen» (Kasten neu) | – | `…_checked` | `…_overlap` |

`contracts_apartment_contracts_overlap` aus Runde 1 nennt den Kasten mit seinem Titel. Das passt in Schritt 5, sobald der Kasten dort steht.

## Nicht bestätigt

- **Gekündigter, nicht erfasster Mietvertrag:** Ob ein gekündigter Mietvertrag ohne erfasstes Vertragsende im Assistenten ebenfalls «nicht verfügbar» ist, folgt aus `end_date is null`, im Browser nicht geprüft. Der Hinweis auf «Enddatum erfassen» setzt das voraus.
- **Szenario zu C-2:** Keine `.feature`-Datei prüft den Text von `contracts_delete_draft_contracts_unknown` (gegrept nach «Wählen Sie bei der Wohnung»). Für die Änderung braucht es also keine Spec-Freigabe.

Geprüft: «Enddatum erfassen» (`contracts_end_action`, `contract-detail.feature:444`), `contracts_delete_draft_contracts_unknown` nur in `ContractForm.svelte:239`, Bedeutung von «nicht verfügbar» und «(nicht geprüft)» in Schritt 2 (Backend `blocked`, `availableFrom`; `contract-availability.ts`), Begriffe aus dem Glossar (unbefristet, gekündigt, Vertragsende), bestehende Übersetzungen als Vorlage, U+00A0 im Französischen.
