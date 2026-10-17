# Fachreview #57 (Runde 1, vor der Umsetzung)

Gegenstand: `@wip`-Szenarien und Steps in Commit 1eb3afd6 (Worktree `review-57-fach`), vorgeschlagene Texte in `scratchpad/57-proposed-texts.md`, abgeglichen mit `src/lib/wizard-draft.ts`, `src/lib/ui/{SaveStatus,DraftNotice,Header}.svelte` und beiden Assistenten.

Ergebnis: kein Blocker, kein Major. Der Entscheid (nur der Abrechnungsstatus heisst «Entwurf», die Eingaben heissen «Ihre Angaben», der Hinweis sagt «nur in diesem Browser, noch nicht gespeichert») ist in Szenarien und Texten richtig umgesetzt. Die Datenschutzerklärung beschreibt weiterhin richtig, was wo und wie lange liegt. Es bleiben Minors und Nits.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Neben «… noch nicht gespeichert» steht weiter das Erfolgs-Häkchen |
| V-2 | Verwalter | Minor | Nach dem Wiederöffnen sagt nichts, dass die Angaben noch nicht gespeichert sind |
| R-1 | Rechtstexte | Minor (unsicher) | Datenschutzhinweis nennt den Zweck der Aufbewahrung im Browser nicht ausdrücklich |
| R-2 | Rechtstexte | Minor | «bis Sie sie speichern» passt nicht zu «Abrechnungen erstellen» (dort gibt es kein Speichern) |
| R-3 | Rechtstexte | Minor | «Sie können Namen … enthalten»: die aufbewahrten Angaben enthalten keine Namen (übernommen aus dem alten Text) |
| V-3 | Verwalter | Nit | de `ui_draft_saved`: Wichtigstes zuerst; «sind … aufbewahrt» klingt holprig |
| V-4 | Verwalter | Nit | de `help_tenants_3`: «Ihre Angaben» zweimal im selben Satz |
| V-5 | Verwalter | Nit | `gallery_toast_info` «Angaben gespeichert.» widerspricht der neuen Trennung aufbewahrt/gespeichert |
| V-6 | Verwalter | Nit | fr: Guillemets ohne geschütztes Leerzeichen im Vorschlag |
| V-7 | Verwalter | Nit | fr «État :» / it «Stato:» lesen sich als Status, nicht als Zeitstand |
| V-8 | Verwalter | Nit | it: «suoi»/«Suo» gemischt; «finché li salva» ohne «non» (in der Hilfe mit «non») |

Mietrecht (M): Der Gegenstand berührt keine mietrechtliche Regel (keine Fristen, Beträge, Formvorschriften nach OR 253 ff. oder VMWG). Keine M-Befunde.

## Befunde

### V-1 (Minor): Erfolgs-Häkchen neben «noch nicht gespeichert»
- Beleg: `src/lib/ui/SaveStatus.svelte:12-14` zeigt `<Icon name="success" />` vor `m.ui_draft_saved(...)`. Neuer Text: «Ihre Angaben sind nur in diesem Browser aufbewahrt, noch nicht gespeichert. Stand: {time}».
- Warum falsch: #57 entstand, weil Personas «Entwurf gespeichert» als «Mietvertrag gespeichert» lasen. Ein grünes Erfolgs-Häkchen sagt weiter «erledigt», der Text sagt jetzt das Gegenteil. Das widerspricht sich und lässt die alte Verwechslung bestehen.
- Korrektur: neutrales Info-Symbol (z. B. `info`, falls es in `Icon.svelte` existiert) oder gar kein Symbol; eine DOM-Prüfung in `ui-feedback` / `SaveStatus`.

### V-2 (Minor): Nach dem Wiederöffnen fehlt der Hinweis «noch nicht gespeichert»
- Beleg: `savedAt` wird nur gesetzt, wenn `touched` (`ContractWizard.svelte:163-166`, `StatementWizard.svelte:115-118`). Nach dem Neuladen ist `SaveStatus` also leer, bis der Liegenschaftsverwalter etwas ändert. Sichtbar ist nur `DraftNotice` mit «Angaben wiederhergestellt» und `ui_draft_back` «Ihre Angaben, zuletzt am {date} um {time} bearbeitet, sind wieder da.»
- Warum: Genau beim Fortsetzen (Szenarien «… später fortsetzen») liegt die Lesart «wiederhergestellt = gespeichert» am nächsten. Der Entscheid verlangt, dass der Hinweis «nur in diesem Browser, noch nicht gespeichert» sagt. Das ist nur während der Eingabe erfüllt, nicht beim Wiederöffnen.
- Korrektur (im Rahmen von `ui_draft_*`, die das Issue unter «Where» nennt): `ui_draft_back` ergänzen, z. B. de «Ihre Angaben, zuletzt am {date} um {time} bearbeitet, sind wieder da. Sie sind nur in diesem Browser aufbewahrt und noch nicht gespeichert.», fr «… ont été restaurées. Elles sont conservées uniquement dans ce navigateur et pas encore enregistrées.», it «… sono di nuovo disponibili. Sono conservati solo in questo browser e non ancora salvati.», en «… are back. They are kept only in this browser and not saved yet.». Die Szenarien «… später fortsetzen» können das mit dem Step «erfährt …, dass seine Angaben nur in diesem Browser aufbewahrt und noch nicht gespeichert sind» prüfen, dann aber gegen `draft-restored`. Alternativ zeigt `SaveStatus` nach dem Wiederherstellen `restoredAt`.

### R-1 (Minor, unsicher): Zweck der Aufbewahrung nicht ausdrücklich genannt
- Beleg: vorgeschlagener `privacy_draft_notice` (de) sagt, was, wo und wie lange aufbewahrt wird und dass man es im Browser ablehnen kann, aber nicht wozu. Den Zweck (später weitermachen) muss man aus «bis Sie sie speichern» erschliessen. Der alte Text hatte dieselbe Lücke.
- Rechtsgrundlage: Art. 45c FMG. Fedlex-Suchtreffer (fedlex.admin.ch, SR 784.10): «Das Bearbeiten von Daten auf fremden Geräten durch fernmeldetechnische Übertragung ist nur erlaubt: a. für die Fernmeldedienste …». Den Wortlaut von lit. b konnte ich auf Fedlex nicht abrufen (die Seite braucht JavaScript). Laut Sekundärquellen (justement.ch, hueberli.com, nur als Suchschnipsel): «b. wenn die Benutzerinnen und Benutzer über die Bearbeitung und ihren Zweck informiert [sowie/und] darauf hingewiesen werden, dass sie die Bearbeitung ablehnen können.» Deshalb **unsicher**. Ebenfalls unsicher ist, ob localStorage, das das eigene Skript der Seite schreibt, überhaupt unter «durch fernmeldetechnische Übertragung» fällt.
- Korrektur (risikoarm, ein Halbsatz): de «… bewahrt Dwello nur in diesem Browser auf, damit Sie später weitermachen können, bis Sie …»; fr «… afin que vous puissiez reprendre plus tard, jusqu’à ce que …»; it «… per permetterle di riprendere più tardi, finché non …»; en «… so that you can continue later, until …». Wird der Text geändert, muss der Privacy-Step (`app-frame.steps.ts:109-115`, Teilstring) noch passen.

### R-2 (Minor): «bis Sie sie speichern» passt nur zum Mietvertrag
- Beleg: Im Assistenten «Abrechnungen erstellen» gibt es kein Speichern. Die Angaben werden beim Erstellen gelöscht (`StatementWizard.svelte:193-195`, `created()` → `clearDraft`), und die Schaltfläche heisst «Entwürfe erstellen» (`statements_create_drafts`). Im Mietvertrag geschieht das beim Speichern (`ContractWizard.svelte:241-242`).
- Warum: Die Datenschutzerklärung soll die Dauer der Aufbewahrung richtig nennen. Für die Abrechnungen stimmt «bis Sie sie speichern» nur sinngemäss. Dasselbe gilt für «noch nicht gespeichert» im Statusvermerk des Abrechnungs-Assistenten: Ein Laie sucht dort einen Speichern-Knopf, den es nicht gibt (verträglich, da der Assistent endet und nichts verloren geht).
- Korrektur `privacy_draft_notice`: de «… bis Sie den Mietvertrag speichern oder die Abrechnungen erstellen, Ihre Angaben verwerfen oder sich mit «Abmelden» abmelden.» (fr «… jusqu’à ce que vous enregistriez le contrat de bail ou établissiez les décomptes, supprimiez vos saisies ou vous déconnectiez avec « Se déconnecter ». », it/en sinngemäss). Der Teilstring im Privacy-Step muss angepasst werden. Den Statusvermerk kann man so lassen.

### R-3 (Minor): «Namen» stimmt nicht mit den aufbewahrten Daten überein
- Beleg: Aufbewahrt werden `ContractFormValues` (`src/lib/contract-form.ts:11-26`: `tenantId`, `apartmentId`, Daten, Beträge, Verwaltungspauschale, Kategorie-IDs) und im Abrechnungs-Assistenten die Auswahl (Periode, Gebäude-IDs, Heizprofil, Pauschale, Schritt). Kein Name, keine Adresse. Vorschlag: «Sie können Namen und Beträge enthalten».
- Warum: Das ist übernommen aus dem alten Text («Ein Entwurf kann Namen und Beträge enthalten»), also kein neuer Fehler. Die Erklärung soll aber sagen, was die App wirklich tut. Mehr anzugeben ist rechtlich unschädlich, aber ungenau.
- Korrektur: de «Sie können Beträge, Daten und die Auswahl von Mieter und Wohnung enthalten und bleiben auf dem Gerät, auf dem Sie arbeiten.» (fr «Elles peuvent contenir des montants, des dates ainsi que le locataire et l’appartement choisis …», it «Possono contenere importi, date e l’inquilino e l’appartamento scelti …», en «They may contain amounts, dates and the chosen tenant and apartment …»). Kann zusammen mit R-1/R-2 geändert werden, sonst so lassen (bestand schon vorher).

### V-3 (Nit): de `ui_draft_saved`
- Vorschlag: «Ihre Angaben sind nur in diesem Browser aufbewahrt, noch nicht gespeichert. Stand: {time}». «sind … aufbewahrt» (Zustandspassiv) liest sich holprig, und der wichtigste Teil («noch nicht gespeichert») steht am Schluss.
- Besser: «Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf. Stand: {time}». Der Step-Text in `contract-form.steps.ts` und die Präfixe in `tasks/contract-form.ts`, `tasks/statement-generate.ts`, `tasks/accessibility.ts` müssen dann folgen (`inPageLanguage` sucht per Präfix, `tests/e2e/questions/language.ts:16-24`).

### V-4 (Nit): de `help_tenants_3` wiederholt «Ihre Angaben»
- «Bis Sie speichern, Ihre Angaben verwerfen oder sich abmelden, bewahrt Dwello Ihre Angaben nur in diesem Browser auf.» Besser: «… bewahrt Dwello sie nur in diesem Browser auf.» Das Hilfe-Szenario (`help.feature`, vollständiger Text) muss mitgehen. fr/it/en entsprechend («Dwello les conserve …», «Dwello li conserva …», «Dwello keeps them …»).

### V-5 (Nit): `gallery_toast_info`
- «Angaben gespeichert.» / «Saisies enregistrées.» / «Dati salvati.» / «Entries saved.». Nach #57 heisst «gespeichert» «auf dem Server». Das Beispiel in der Gestaltungsgalerie zeigt für «Angaben» wieder die alte Lesart. Besser ein neutrales Beispiel, z. B. «Mietvertrag gespeichert.» / «Contrat de bail enregistré.» / «Contratto di locazione salvato.» / «Rental contract saved.»

### V-6 (Nit): fr Typografie
- Beleg: `docs/design/i18n-begriffe.md:5` verlangt französische Guillemets mit geschütztem Leerzeichen. `messages/fr.json:70` nutzt U+00A0 (`« Enregistrer …`). In `57-proposed-texts.md:15-16` stehen normale Leerzeichen (od-Ausgabe: `302 253 040`). Beim Übernehmen U+00A0 innen bei « » setzen, ebenso vor «:» in «État :», falls fr.json das so hält.

### V-7 (Nit): fr «État :», it «Stato:»
- «État» und «Stato» lesen sich als Status, nicht als Zeitpunkt. Vorschlag: fr «… pas encore enregistrées. Dernière modification à {time}», it «… non ancora salvati. Ultima modifica alle {time}». en «As of {time}» passt.

### V-8 (Nit): it Einheitlichkeit
- In `help_tenants_3` steht «i suoi dati» klein, in `privacy_draft_notice` «il Suo browser» gross. it.json mischt das, überwiegend klein: einheitlich klein schreiben.
- `privacy_draft_notice` it: «finché li salva, li scarta o si disconnette» ohne «non», die Hilfe hat «finché non salva, non scarta …». Für «bis» besser: «finché non li salva, non li scarta o non si disconnette». Das war schon vorher so.

## Bestätigt

- Glossar: `UBIQUITOUS_LANGUAGE.md:169` «**Entwurf** | Abrechnung erstellt, noch nicht versendet. (`draft`)». Die Szenarien verwenden «Entwurf» nur noch so (`statement-generate.feature`, «… als Entwurf entstehen …»). «Angaben» ist ein gewöhnliches Wort, kein neuer Begriff, wie entschieden. `UBIQUITOUS_LANGUAGE.md` bleibt unverändert.
- i18n: `docs/design/i18n-begriffe.md:75` brouillon/bozza/draft gelten nur für den Status. Die Vorschläge verwenden für die Eingaben fr «saisies», it «dati», en «entries`, gleich wie `ui_draft_back`/`ui_draft_discard*` auf main (`messages/*.json:39-42`). Die Assistenten-Namen stimmen mit `dashboard_add_contract` / `dashboard_create_statements` überein, «Abmelden» mit `header_logout`, «Mietvertrag speichern» mit `contracts_save`, jeweils in allen vier Sprachen.
- «nur in diesem Browser»: `wizard-draft.ts:7-13,28-35` schreibt nur in `localStorage`. Die Vorschau im Abrechnungs-Assistenten schickt die Auswahl zwar an den Server, speichert sie dort aber nicht (`backend/src/routes/statements.ts:105-117`, nur `calculateStatement`).
- «bis Sie speichern / verwerfen / abmelden»: `clearDraft` beim Speichern (`ContractWizard.svelte:242`), beim Erstellen (`StatementWizard.svelte:195`) und beim Verwerfen (`ContractWizard.svelte:217`, `StatementWizard.svelte:147`). `clearAllDrafts` nur bei «Abmelden» (`Header.svelte:24`, einziger Logout-Pfad im Client).
- «Läuft die Anmeldung nur ab, bleiben die Angaben erhalten»: Beim Ablauf der Sitzung löscht kein Code die Angaben.
- «Lässt Ihr Browser keine Websitedaten zu, bewahrt Dwello … nicht auf»: `browserStorage()` gibt `undefined` zurück, `writeDraft` gibt `null` zurück, `SaveStatus` zeigt dann nichts (`SaveStatus.svelte:12`). Damit behauptet der neue Statusvermerk nie etwas Falsches.
- «noch nicht gespeichert» (Mietvertrag): erst `save()` → `POST /contracts` legt ihn an (`ContractWizard.svelte:227-245`).
- Die Szenarien passen zu den vorgeschlagenen Texten: Privacy-Teilstring (`app-frame.steps.ts`), Hilfe-Volltext (`help.feature`), Statusvermerk (`contract-form.steps.ts`), «Angaben wiederhergestellt» (`ui_draft_restored`). Der Statusvermerk-Step gilt für beide Assistenten (globale Steps).
- Die Bestätigungsfrage «Angaben verwerfen?» / «Ihre Angaben werden gelöscht.» nennt die tatsächliche Folge (`DraftNotice.svelte:65-74`).

## Fehlende Begriffe

Keine. Der Entscheid sieht ausdrücklich keinen neuen Glossarbegriff vor.

## Nicht bestätigt

- Wortlaut von Art. 45c lit. b FMG und Art. 19 DSG auf Fedlex: `fedlex.admin.ch/eli/cc/1997/2187_2187_2187/de` liefert per WebFetch nur den JavaScript-Hinweis. justement.ch, rechtundgesetz.ch und droit-bilingue.ch sind aus dieser Umgebung nicht erreichbar (ENOTFOUND). Gefunden über `mmx search`, nur als Schnipsel. Deshalb ist R-1 «unsicher», ebenso die Frage, ob first-party localStorage unter Art. 45c FMG fällt.
- Ob die Angaben pro Konto getrennt sind: Der Schlüssel `dwello.draft.v1.<name>` (`wizard-draft.ts:3-4`) enthält kein Konto. Meldet sich auf demselben Browser ein anderes Konto an, ohne dass das erste «Abmelden» gewählt hat, sieht es diese Angaben. Bei der Einzelnutzer-MVP ist das nachrangig, und der Text («bleiben auf dem Gerät») ist nicht falsch. Ich habe nicht geprüft, ob dazu schon ein Issue oder eine Zeile in `offene-punkte.md` existiert.
- Ob `Icon.svelte` ein neutrales Info-Symbol hat (für V-1): nicht nachgesehen.
- Die bloss mit «Entwurf» beschrifteten Schaltflächen in der Mietvertrags-Bearbeitung (`contracts_delete_draft_and_save` u. a., `ContractForm.svelte:324`) meinen richtig den Abrechnungsstatus. Sie liegen nicht im Assistenten und nicht im Umfang von #57.
