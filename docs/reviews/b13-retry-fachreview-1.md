# Fachreview B-13 Retry (#151), Runde 1

Gegenstand: Szenario «Mietverträge der Wohnung erneut laden» (`tests/e2e/features/contract-edit.feature:62-71`) und die vorgeschlagenen UI-Texte für den Hinweis `contracts_apartment_contracts_unknown` mit der Schaltfläche «Erneut versuchen». Geprüft vor der Umsetzung gegen `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, den Code, der die Texte zeigt, und das Backend.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der Titel «ab wann die Wohnung frei ist» trifft auf der Bearbeitungsseite nicht zu. Dort fehlt die Prüfung auf Überschneidung, nicht das Datum, ab dem die Wohnung frei ist. «frei» ist zudem kein Glossarbegriff. |
| V-2 | Verwalter | Major | Derselbe Text erscheint auch als Ablehnung von «Entwurf löschen und Mietvertrag speichern». Dort widerspricht «Beim Speichern prüft Dwello trotzdem» dem Ergebnis: Dwello speichert nicht. |
| V-3 | Verwalter | Minor | «Versuchen Sie es erneut» direkt über «Erneut versuchen» doppelt sich und sagt nicht, was «es» ist. Dass die Eingaben erhalten bleiben (der Kern von #151, Helga H2), steht nicht im Text. |
| V-4 | Verwalter | Minor | Das Szenario prüft nur, ob der Hinweis bei der Wohnung verschwindet. Der gleiche Hinweis beim Vertragsbeginn wird nicht geprüft. |
| V-5 | Verwalter | Minor | Vier bestehende Szenarien zitieren noch den alten Text «Laden Sie die Seite neu …». |
| V-6 | Verwalter | Nit | Die Bearbeitungsseite zeigt den Hinweis zweimal (bei der Wohnung und beim Vertragsbeginn). Mit je einer Schaltfläche wären es zwei gleiche Schaltflächen auf einer Seite. |
| V-7 | Verwalter | Nit | Das neue Szenario sagt «Nettomiete», die übrigen Szenarien derselben Datei sagen «Mietzins». Beides ist laut Glossar zulässig. |

Für die Rolle Mietrecht gibt es keinen Befund: Die Texte machen keine rechtliche Aussage (siehe «Bestätigt» und «Nicht bestätigt»).

## Befunde

### V-1 (Major): Der Titel nennt die falsche Folge

**Beleg:**
- `src/lib/contract-form.ts:153-160` (`availableFrom`): Ohne Wechsel der Wohnung gibt die Funktion weder ein frühestes Datum noch einen Hinweis zurück: `if (!availability || !apartmentChanged) return { min: undefined, notice: null };`. In unserem Szenario bleibt Anna Keller in derselben Wohnung «2.01». «Ab wann die Wohnung frei ist» spielt dort also keine Rolle.
- Was ohne die Mietverträge tatsächlich fehlt, ist die Prüfung auf Überschneidung: `src/routes/contracts/ContractForm.svelte:89` (`overlapWarning(values, apartmentContracts, contract.id)`). Sie betrifft auch einen Vormieter, wenn der Vertragsbeginn vorverschoben wird, und einen künftigen Mietvertrag (Mietstatus «Wiedervermietet»), wenn das Vertragsende nach hinten verschoben wird. Beides hat mit «ab wann frei» nichts zu tun.
- Glossar `UBIQUITOUS_LANGUAGE.md:22` kennt für die Verfügbarkeit nur die Mietstatus «Leer», «Vermietet», «Wiedervermietet» und «Gesperrt», `:34` regelt die Überschneidung («Pro Wohnung darf sich kein Vertrag mit einem anderen überschneiden»). «frei» ist kein Glossarbegriff. Die UI sagt sonst «verfügbar ab» (`messages/de.json:560`, `:578`).

**Warum falsch:** Derselbe Schlüssel erscheint im Assistenten bei Wohnung, Zeitraum und Prüfung und auf der Bearbeitungsseite (`ApartmentStep.svelte:48`, `PeriodStep.svelte:85`, `ReviewStep.svelte:29`, `ContractForm.svelte:181`). Nur im Schritt «Zeitraum» des Assistenten stimmt «ab wann frei» ungefähr. Auf der Bearbeitungsseite liest der Vermieter eine Folge, die ihn nicht betrifft, und erfährt nicht, was wirklich ungeprüft ist.

**Korrektur:** Der Titel nennt die Prüfung, die fehlt, und lehnt sich an den bestehenden Titel `contracts_overlap_title` («Zeitraum überschneidet sich») an. Wortlaut siehe «Vorgeschlagene Texte» unten.

### V-2 (Major): Ein widersprüchlicher Text in der Ablehnung «Entwurf löschen und Mietvertrag speichern»

**Beleg:** `src/routes/contracts/ContractForm.svelte:178-188`:
```ts
const contractsMessage = (state: typeof contractsState) =>
	state === 'loading'
		? m.contracts_apartment_contracts_loading()
		: m.contracts_apartment_contracts_unknown();
...
if (overlap || contractsState !== 'loaded') {
	errors = { form: overlap ? m.backend_contract_overlap() : contractsMessage(contractsState) };
```
Der Text erscheint in der roten Meldung «Der Mietvertrag wurde nicht gespeichert» (`ContractForm.svelte:269`, `messages/de.json:609`).

**Warum falsch:** Im neuen Text steht «Beim Speichern prüft Dwello trotzdem, ob sich der Zeitraum … überschneidet». Genau dieser Weg speichert aber nicht, weil die Mietverträge fehlen: Der Entwurf würde sonst für nichts gelöscht (Kommentar Z. 184-186). Der Vermieter liest, dass Dwello beim Speichern prüft, und sieht gleichzeitig, dass nicht gespeichert wurde. Ausserdem steht in dieser Meldung keine Schaltfläche «Erneut versuchen», auf die der Text verweist.

**Korrektur:** Für diese Ablehnung einen eigenen Schlüssel verwenden, z.B. `contracts_delete_draft_contracts_unknown`:

| | Text |
|---|---|
| de | Dwello hat den Entwurf nicht gelöscht: Ohne die Mietverträge dieser Wohnung lässt sich eine Überschneidung nicht ausschliessen. Wählen Sie bei der Wohnung «Erneut versuchen» und danach noch einmal «Entwurf löschen und Mietvertrag speichern». |
| fr | Dwello n’a pas supprimé le brouillon : sans les contrats de bail de cet appartement, un chevauchement ne peut pas être exclu. Choisissez « Réessayer » à l’appartement, puis à nouveau « Supprimer le brouillon et enregistrer le contrat de bail ». |
| it | Dwello non ha eliminato la bozza: senza i contratti di locazione di questo appartamento non si può escludere una sovrapposizione. Scelga «Riprovare» presso l’appartamento e poi di nuovo «Eliminare la bozza e salvare il contratto di locazione». |
| en | Dwello did not delete the draft: without the rental contracts for this apartment an overlap cannot be ruled out. Choose «Try again» at the apartment, then «Delete draft and save rental contract» again. |

Die zitierten Beschriftungen sind die bestehenden Werte von `contracts_delete_draft_and_save` (`messages/*.json:1262`).

### V-3 (Minor): Die Handlung wird doppelt genannt, die zugesicherte Folge fehlt

**Beleg:** Der vorgeschlagene Text beginnt mit «Versuchen Sie es erneut.» und steht direkt über der Schaltfläche «Erneut versuchen». Issue #151, «Problem»: Helga fürchtet, ihre geänderten Werte zu verlieren (H2). «Done means»: «keeps the input of form and wizard».

**Warum:** Die Aufforderung wiederholt nur die Beschriftung der Schaltfläche. «es» bleibt unklar. Die eine Zusicherung, die Helga zum Weitermachen braucht, nämlich dass ihre Eingaben bleiben, fehlt.

**Korrektur:** Text siehe «Vorgeschlagene Texte». Er nennt zuerst den Grund (Mietverträge nicht geladen), dann die Handlung mit der wörtlichen Beschriftung der Schaltfläche, dann die Zusicherung und zuletzt die Prüfung beim Speichern.

### V-4 (Minor): Das Szenario prüft nur einen der beiden Hinweise

**Beleg:** `contract-edit.feature:59-60` zeigt, dass die Bearbeitungsseite den Hinweis bei der Wohnung **und** beim Vertragsbeginn zeigt. Das neue Szenario (Z. 71) prüft nur «bei der Wohnung keinen Hinweis mehr».

**Korrektur:** Einen Schritt ergänzen:
```gherkin
    Und sieht der Liegenschaftsverwalter beim Vertragsbeginn keinen Hinweis mehr
```

### V-5 (Minor): Alte Texte in bestehenden Szenarien

**Beleg:** Den alten Wortlaut «Die Mietverträge der Wohnung konnten nicht geladen werden. Laden Sie die Seite neu und versuchen Sie es erneut.» zitieren `tests/e2e/features/contract-edit.feature:59`, `:60` und `tests/e2e/features/contract-new.feature:60`, `:66`.

**Korrektur:** Im selben Change auf den neuen Text umstellen. Prüft der Schritt `toContain`, genügt der neue Titel.

### V-6 (Nit): Zwei gleiche Schaltflächen auf der Bearbeitungsseite

**Beleg:** `contract-edit.feature:59-60`, `ContractForm.svelte:236` und `:249` (`{unknown}` an zwei Stellen).

**Warum:** Beide Schaltflächen laden dieselben Mietverträge. Für Ungeübte sieht das nach zwei verschiedenen Aktionen aus. Dies ist eine UI-Frage und keine fachliche; sie gehört zum `code-reviewer` bzw. zur Persona.

**Vorschlag:** Die Schaltfläche nur beim Hinweis zur Wohnung zeigen. Beim Vertragsbeginn genügt ein kurzer Verweis, z.B. de «Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.», fr «Les contrats de bail de cet appartement manquent encore, voir plus haut à l’appartement.», it «Mancano ancora i contratti di locazione di questo appartamento, vedere sopra presso l’appartamento.», en «The rental contracts for this apartment are still missing, see the apartment above.».

### V-7 (Nit): «Nettomiete» und «Mietzins» in derselben Datei

**Beleg:** `UBIQUITOUS_LANGUAGE.md:42`: «**Nettomiete** | Monatliche Grundmiete in CHF (ohne Nebenkosten). Auch: Mietzins.» Die Datei verwendet sonst «den Mietzins … ändert» (Z. 15, 21, 25), das neue Szenario dagegen «die Nettomiete "980" einträgt».

**Bewertung:** Beides ist zulässig, eine Änderung ist nicht nötig. «Nettomiete» ist sogar genauer, weil das Feld so beschriftet ist.

## Vorgeschlagene Texte (ersetzen den Vorschlag des Aufrufers)

Der Schlüssel `contracts_apartment_contracts_unknown` wird zu Titel und Text. Die Schaltfläche bekommt einen eigenen Schlüssel.

| Schlüssel (Vorschlag) | de | fr | it | en |
|---|---|---|---|---|
| `contracts_apartment_contracts_unknown` (Titel) | Überschneidung noch nicht geprüft | Chevauchement pas encore vérifié | Sovrapposizione non ancora verificata | Overlap not checked yet |
| `contracts_apartment_contracts_unknown_text` | Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet. | Dwello n’a pas pu charger les contrats de bail de cet appartement. Choisissez « Réessayer » ; vos saisies sont conservées. Lors de l’enregistrement, Dwello vérifie dans tous les cas si la période chevauche un autre contrat de bail de cet appartement. | Dwello non ha potuto caricare i contratti di locazione di questo appartamento. Scelga «Riprovare»; i dati inseriti restano invariati. Al salvataggio Dwello verifica in ogni caso se il periodo si sovrappone a un altro contratto di locazione di questo appartamento. | Dwello could not load the rental contracts for this apartment. Choose «Try again»; your entries are kept. When you save, Dwello always checks whether the period overlaps with another rental contract for this apartment. |
| `contracts_apartment_contracts_retry` (Schaltfläche) | Erneut versuchen | Réessayer | Riprovare | Try again |

Begründung:
- Begriffe: Mietvertrag / contrat de bail / contratto di locazione / rental contract, Wohnung / appartement / appartamento / apartment, Zeitraum und «überschneidet sich» wie in `backend_contract_overlap` (`messages/*.json:420`). Damit nennt die spätere Ablehnung beim Speichern dieselben Wörter.
- Der Titel ist parallel zu `contracts_overlap_title` («Zeitraum überschneidet sich»). Er trifft im Assistenten und auf der Bearbeitungsseite zu.
- «in jedem Fall» statt «trotzdem»: «trotzdem» lässt offen, trotz was. Belegt durch das Backend: `backend/src/services/contract.service.ts:282` (Erfassen) und `:335` (Bearbeiten) rufen `checkContractOverlap` auf und lehnen mit `CONTRACT_OVERLAP` ab.
- Schaltflächen nach `i18n-begriffe.md`, «Style»: Verb, im Französischen und Italienischen im Infinitiv. Für it deshalb «Riprovare» und nicht «Riprovi», das im Fliesstext für die Höflichkeitsform steht. fr mit « » und geschütztem Leerzeichen, it, de und en mit «» ohne Leerzeichen, wie in `contracts_overlap_wizard`.
- Fallen die Schlüssel `_text` oder `_retry` anders aus, bleibt der Wortlaut gleich.
- Im Schritt «Zeitraum» des Assistenten fehlt zusätzlich der Vorschlag für den frühesten Vertragsbeginn (`ContractWizard.svelte:79`). Die neue Formulierung schliesst das ein und behauptet nichts Falsches. Ein eigener Satz dazu ist nicht nötig.

## Bestätigt

- **Szenario, Begriffe:** «Mietverträge», «Wohnung», «Liegenschaftsverwalter», «Nettomiete», «Mietvertrag» stehen im Glossar (`UBIQUITOUS_LANGUAGE.md:17, 26, 34, 42`). Die Schritte sind in `tests/e2e/steps/contract-form.steps.ts:228-270` vorhanden, mit den Zielen in `tests/e2e/tasks/contract-form.ts:37-38`.
- **Szenario, Ablauf:** Es deckt «Done means» von #151 für die Bearbeitungsseite ab: Die erste Anfrage scheitert, die zweite nicht, und die Eingabe bleibt erhalten. Den Assistenten deckt #151 mit DOM-Tests ab (`contract-wizard.dom.test.ts`), so steht es im Issue.
- **Fakt zur Folge:** Das Backend lehnt beim Erfassen und Bearbeiten einen Zeitraum ab, der sich mit einem anderen Mietvertrag derselben Wohnung überschneidet (`backend/src/services/contract.service.ts:282-290`, `:335`). Der eigene Mietvertrag wird beim Bearbeiten ausgenommen (`current.id`). Die Aussage «Beim Speichern prüft Dwello …» stimmt also, ausser auf dem Weg aus V-2.
- **«Mietvertrag speichern»** ist in beiden Abläufen die Beschriftung der Schaltfläche zum Speichern (`messages/de.json:640`, `ContractWizard.svelte:282`). «Beim Speichern» bezieht sich darauf.
- **Glossarregel:** «Pro Wohnung darf sich kein Vertrag mit einem anderen überschneiden» (`UBIQUITOUS_LANGUAGE.md:34`) deckt die Aussage des Textes.

## Neue Begriffe

Keine. Alle vorgeschlagenen Wörter stehen im Glossar oder in `i18n-begriffe.md`. «Überschneidung» und «überschneidet sich» stehen im Glossar (Z. 34) und in den bestehenden Texten. Ein Issue ist nicht nötig.

## Nicht bestätigt

- **Mietrechtlicher Hintergrund:** Das Verbot sich überschneidender Mietverträge ist eine Regel von Dwello (Glossar Z. 34), keine Vorschrift des OR. Zwei Mietverträge über dieselbe Wohnung wären zivilrechtlich wohl beide gültig. Der Vermieter haftete dann gegenüber dem Mieter, dem er die Wohnung nicht übergeben kann, nach Art. 256 Abs. 1 OR («Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben …»). Den Wortlaut habe ich nur über `mmx search` aus Sekundärquellen gefunden (gesetzestexte.help.ch, schweizerischer-mieterschutz.ch), nicht auf Fedlex. Er ist daher **unsicher**. Für dieses Review ist er nicht tragend: Die Texte machen keine rechtliche Aussage und sollen auch keine machen.
- **Wortlaut in fr, it und en:** Ich habe ihn gegen `i18n-begriffe.md` und die bestehenden Texte geprüft, nicht mit Muttersprachlern. Die Persona-Prüfung im Schritt 5 sollte die Sprachen abdecken (`sprachen-bildschirme.feature`).
