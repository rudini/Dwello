# Fach-Review #461, Runde 1 (vor der Umsetzung)

Gegenstand: Commit 84c3d81c (Worktree `scratchpad/review-461-fach`, detached), die zwei @wip-Szenarien und der geplante Umbau der Wörter laut Auftrag. Anforderung: #461 und die Entscheide in #405 (Text und Kommentar vom 2026-10-18).
Fedlex: OR de/fr/it (Stand 1.10.2026) und OBLF/OLAL fr/it (Stand 1.10.2025), HTML aus dem Fedlex-Filestore über den SPARQL-Endpunkt, im Scratchpad unter `fedlex461/`.

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Wenn man `PREDEFINED_DISTRIBUTION_KEYS` nur «angleicht», entstehen doppelte Schlüssel und Schlüssel, die nicht im Glossar stehen. Die Liste muss entfernt werden. |
| V-2 | Verwalter | Major | Nach 3a nennt en `categories_reason_elevator` eine Kategorie «Elevator», die es nicht mehr gibt (neu «Lift»). Der Plan erwähnt das nicht. |
| V-3 | Verwalter | Major | Das ❓ bei «Nebenkostenpauschale» widerspricht dem Done means von #461 («no ❓ left»). Es verweist auf das geschlossene #66, und kein offenes Issue trägt die Frage. |
| V-4 | Verwalter | Minor | Die Liste zu 1a ist unvollständig. fr.json:1432 «peut être imputé par les frais de gestion» meint «umlegen» und wird zu «répercuté … frais d’administration». Das Nomen «imputabilité» (fr.json:1410) und «caractère imputable» (1748, 1765) werden zu «caractère répercutable». «impute»/«imputée» für das Akonto (92, 758) bleiben. |
| V-5 | Verwalter | Minor | Der Hilfetext fürs Heizprofil verspricht zu viel. Das PDF nennt das Heizprofil nur bei Ein- oder Auszug in der Periode (`statement-pdf.service.ts:161`, `byDays`). Wortlaut unten. |
| V-6 | Mietrecht | Minor | `glossary_fee_text` spricht in allen vier Sprachen vom allgemeinen «Verwaltungsaufwand» bzw. «travail de gestion». Art. 4 Abs. 3 VMWG und UL:172 meinen nur den Aufwand für die Abrechnung. Wortlaut unten. |
| V-7 | Verwalter | Minor | Szenario 3b: «Par chambre» für `{rooms}` ist kein Schweizer Französisch für «Zimmer» (i18n-begriffe: «nombre de pièces»). Besser «Par pièce» oder ein anderer Schlüssel, z. B. «Nach Volumen» / «Selon le volume» (`{volume}`). |
| V-8 | Verwalter | Minor | Für die neuen Namensfelder im Heizprofil-Formular (3b) gibt es weder Szenario noch Test. Mindestens ein DOM- oder E2E-Test fehlt. |
| V-9 | Verwalter | Minor | Die Migration 3a darf weder `name` noch `name_de` der Kategorien ändern. Der KI-Prompt baut auf beiden auf (`backend/src/config/llm.ts:78–91`); sonst braucht es `llm:eval`. |
| V-10 | Verwalter | Minor | UL:132 schreibt «Heizung (Fläche 70 % / Einheit 30 %)», der Seed `name_de` «70%» ohne Leerschlag (`0002_stammdaten.sql:50`). In derselben Migration angleichen (de mit U+00A0 wie fr, it ebenso). |
| V-11 | Verwalter | Minor | UI-Texte nennen die umbenannte Kategorie in Kleinschreibung noch alt: fr «assurance bâtiment» und it «assicurazione edificio» (fr/it.json:868, 905, 1415, 1429). Neu «assurance du bâtiment» / «assicurazione dell’immobile». |
| V-12 | Verwalter | Nit | en «Garden Maintenance» bleibt, obwohl i18n-begriffe für en «maintenance» meidet (Verwechslung mit Unterhalt). Vorschlag «Garden Care», wie it «Cura del giardino». |
| V-13 | Verwalter | Nit | Das Label «Répercutable sur le locataire» mit dem Wert «Non répercutable» doppelt sich in `CategorizationPanel.svelte:61`. Der Wortlaut ist entschieden; nur zur Kenntnis für die Lesung (Punkt 5). |
| V-14 | Verwalter | Nit | i18n-begriffe.md:3 verweist für ❓ noch auf #342. Satz nachführen; Zeilen «Umlagefähigkeit» (fr «caractère répercutable», it «addebitabilità», en «allocability») und «Akonto verrechnen» (fr «imputer», nicht für «umlagefähig») ergänzen. |
| M-1 | Mietrecht | Minor | Schon vorhanden (Basis 84c3d81c), Wortlaut wird in it ohnehin angefasst: `glossary_notice_period_text` lässt den Vertrag früher nur enden, «wenn … ein Ersatzmieter ihn übernimmt». Nach Art. 264 Abs. 1 OR genügt es, dass der Mieter einen zumutbaren Ersatzmieter vorschlägt. Wortlaut unten. |

## Blocker/Major im Einzelnen

### V-1: `PREDEFINED_DISTRIBUTION_KEYS` entfernen statt angleichen
- Beleg: `backend/src/services/distribution-key.service.ts:32–89` (5 Einträge, darunter «Heizkosten (nach Fläche)», «Warmwasser (pro Einheit)», «Nach Zimmerzahl»). `initializePredefinedKeys` (:440–454) vergleicht über `name`. Der Seed `0002_stammdaten.sql:47–50` hat `name` «Per Area (m²)», die Liste «Per Area». Ein Aufruf von `POST /distribution-keys/initialize` (`routes/distribution-keys.ts:51`) legt deshalb heute zusätzliche vordefinierte Schlüssel neben den Seed-Schlüsseln an. Vordefinierte Schlüssel lassen sich nicht löschen.
- Warum falsch: UL:129–132 nennt genau vier vordefinierte Schlüssel. Zwei der fünf Listeneinträge gibt es dort nicht, und «Nach Fläche» und «Nach Zimmerzahl» weichen von den UL-Wörtern «Pro Fläche (m²)» und «Pro Zimmer» ab. Eine «angeglichene» Liste müsste die vier Seed-Zeilen samt `name` exakt wiederholen. Das wäre eine zweite Quelle, die bei jeder Namensänderung wieder auseinanderläuft; genau das hat #345 ausgelöst.
- Fix: Liste, `initializePredefinedKeys` und die Route entfernen. Die Migration ist die einzige Quelle. Das Frontend ruft die Route nicht auf (kein Treffer für «initialize» in `src/`).

### V-2: en-Hilfetext nennt nach 3a eine nicht vorhandene Kategorie
- Beleg: `messages/en.json:1421` «… add only that share under «Elevator».» 3a benennt `name_en` «Elevator» in «Lift» um (#405, Punkt 3a, en).
- Warum falsch: Der Hilfetext schickt den Vermieter zu einer Kategorie, die er in der Liste nicht findet (CLAUDE.md: Texte sagen, was zu tun ist). Andere Sprachen sind nicht betroffen: de «Lift», fr «Ascenseur» bleiben (gesucht mit `«[^»]*(Name)[^»]*»` über alle `messages/*.json`).
- Fix: «under «Lift»» im selben Commit wie die Migration, mit Test, dass jeder in «…» genannte Kategorie-Name einer vordefinierten Kategorie entspricht (oder wenigstens dieser eine).

### V-3: Nebenkostenpauschale ❓ und Done means von #461
- Beleg: `docs/design/i18n-begriffe.md:77` «forfait de frais accessoires ❓ | forfait per le spese accessorie ❓», Verweis auf #66; #66 ist geschlossen (`gh api repos/rudini/Dwello/issues/66`: closed). #461, Done means: «`docs/design/i18n-begriffe.md` has no ❓ left». In den offenen Issues erwähnt keines «Nebenkostenpauschale» oder «forfait» (Titel und Text der offenen Issues durchsucht).
- Warum falsch: Entweder bleibt das ❓ stehen und #461 ist nicht fertig, oder es verschwindet ohne Entscheid. Der Auftrag sagt «beim Product Owner», aber es gibt kein Issue, das die Frage trägt.
- Fix: ein Issue mit den Labels `fachlich`, `entscheiden`. Vorschlag: die heutigen Wörter behalten und das ❓ entfernen. Fedlex hat kein Nomen, nur die Wendung: Art. 4 Abs. 2 OBLF «S’il les perçoit de manière forfaitaire, il doit se fonder sur la moyenne calculée sur une période de trois ans.», cpv. 2 OLAL «In caso di computo forfettario, deve fondarsi sui valori medi calcolati su un periodo di tre anni.» In der Tessiner Praxis kommen «forfait per le spese accessorie» und «importo forfettario» vor (Websuche: omnilex, Urteil TI; mobiliare.ch; ti.ch, Vernehmlassung zu Art. 16a P-OPC «Forfait per le spese accessorie»). fr «forfait de frais accessoires» ist üblich. Bis zum Entscheid gehört in die PR von #461 die Abweichung vom Done means, unter «Blocked on me».

## Vorgeschlagene Wortlaute

**3b, Verteilschlüssel** (der Vorschlag des Auftrags ist bestätigt; der Schlüssel erscheint auf jeder Abrechnungsposition: `statement-pdf.service.ts:91`):
- de: «Der Name des Verteilschlüssels auf Französisch, Italienisch und Englisch. Ihn zeigt die Nebenkostenabrechnung eines Mieters mit dieser Sprache, ebenso Dwello in dieser Sprache. Fehlt er, steht der deutsche Name.»
- fr: «Le nom de la clé de répartition en français, en italien et en anglais. Il figure sur le décompte des charges d’un locataire de cette langue, ainsi que dans Dwello dans cette langue. S’il manque, le nom allemand s’affiche.»
- it: «Il nome della chiave di riparto in francese, italiano e inglese. Figura sul conteggio spese accessorie di un inquilino di questa lingua e in Dwello in questa lingua. Se manca, appare il nome tedesco.»
- en: «The distribution key’s name in French, Italian and English. The utility cost statement of a tenant with that language shows it, and so does Dwello in that language. Without it, the German name appears.»

**3b, Heizprofil** (V-5):
- de: «Der Name des Heizprofils auf Französisch, Italienisch und Englisch. Ihn zeigt Dwello in dieser Sprache, ebenso die Nebenkostenabrechnung eines Mieters mit dieser Sprache, wenn er während der Abrechnungsperiode ein- oder auszieht. Fehlt er, steht der deutsche Name.»
- fr: «Le nom du profil de chauffage en français, en italien et en anglais. Il s’affiche dans Dwello dans cette langue, ainsi que sur le décompte des charges d’un locataire de cette langue qui emménage ou déménage pendant la période de décompte. S’il manque, le nom allemand s’affiche.»
- it: «Il nome del profilo di riscaldamento in francese, italiano e inglese. Appare in Dwello in questa lingua e sul conteggio spese accessorie di un inquilino di questa lingua che entra o lascia l’appartamento durante il periodo di conteggio. Se manca, appare il nome tedesco.»
- en: «The heating profile’s name in French, Italian and English. Dwello shows it in that language, and so does the utility cost statement of a tenant with that language who moves in or out during the billing period. Without it, the German name appears.»

**V-6, `glossary_fee_text`, erster Satz** (Rest unverändert):
- de: «Die Abgeltung Ihres Aufwands für die Nebenkostenabrechnung: ein Prozentsatz der eigenen Nebenkosten jedes Mieters.»
- fr: «La rémunération de votre travail pour l’établissement du décompte des charges : un pourcentage des frais accessoires propres à chaque locataire.» (Fedlex: «Les frais d’administration découlant de l’établissement du décompte»)
- it: «Il compenso per il suo lavoro di stesura del conteggio spese accessorie: una percentuale delle spese accessorie proprie di ogni inquilino.» (Fedlex: «Le spese amministrative per la stesura del conteggio»)
- en: «The compensation for your work on the utility cost statement: a percentage of each tenant’s own utility costs.»
Grund: Mit «frais d’administration» wird die Abgrenzung zur nicht umlagefähigen Kategorie «Administration» / «Amministrazione» (`0002_stammdaten.sql:34`, UL:106) noch wichtiger. Ebenso in `categories_reason_administration` (fr/it.json:1432): «… Le travail du décompte des charges peut être répercuté par les frais d’administration (art. 4, al. 3, OBLF) …».

**M-1, Ende von `glossary_notice_period_text`:**
- de: «Früher endet der Mietvertrag nur, wenn Sie das Ende mit dem Mieter vereinbaren oder wenn er Ihnen einen zumutbaren Ersatzmieter vorschlägt.»
- fr: «… ou s’il vous présente un locataire de remplacement que vous ne pouvez raisonnablement refuser.»
- it: «… o se Le propone un inquilino sostitutivo che Lei non può ragionevolmente rifiutare.»
- en: «… or if the tenant proposes a replacement tenant you cannot reasonably refuse.»
Beleg: Art. 264 Abs. 1 OR (Wortlaut unten): Befreit ist der Mieter, «wenn er … vorschlägt», nicht erst, wenn der Ersatzmieter übernimmt. Nur Minor, weil der Befund schon auf dem Basis-Commit besteht; ohne Fix gehört er in ein Issue.

## Szenarien

**Wohnungssuche (apartments.feature):** stimmt mit dem Entscheid 4 und dem Done means («appartement 2.01» findet «2.01») überein. Die Begriffe «Wohnung», «Gebäude», «Liegenschaftsverwalter» stehen im Glossar; «Wohnungsliste» und «Wohnungssuche» sind die schon verwendeten Wörter der Feature-Datei. Der Kommentar trifft zu: `messages/fr.json:356` «Appartement {number}». Durchgerechnet mit `apartment.service.ts:113–118` und `word-search.ts:4–6`:
- «appartement 2.01» → Wort «2.01» → 1 Treffer (heute: kein Treffer, weil «appartement» weder Nummer, Gebäudename noch Adresse ist; das Szenario scheitert also am fehlenden Verhalten).
- «Wohnung» allein → leerer Suchbegriff → keine Bedingung → alle Wohnungen (heutiges Verhalten, bleibt).
- «Appartements 2.01» (Plural) → «appartements» bleibt stehen → kein Treffer. Der Entscheid nennt nur die vier Wörter in der Einzahl; die Karte zeigt die Einzahl. Kein Befund.

**Eigener Verteilschlüssel (distribution-keys.feature):** bildet 3b für den Verteilschlüssel ab (UI in fr zeigt den fr-Namen; `src/lib/names.ts:16–19`). Begriffe nach UL:128, 133. Befunde: V-7, V-8. Dass das PDF den Namen trägt, braucht keinen E2E: `statement-pdf.service.ts:53–54` nimmt für Schlüssel und Heizprofil schon `nameFR` mit Rückfall auf Deutsch.

## Bestätigt mit Quelle

- **1a** «répercutable»: Die Gefahr bei «imputable» ist belegt. Art. 259a al. 1 CO: «Lorsque apparaissent des défauts de la chose qui ne sont pas imputables au locataire …». Fedlex hat kein Adjektiv, nur das Verb (Art. 6c al. 3 OBLF «Le bailleur peut facturer au titre de frais accessoires les coûts …»). Die Wortwahl hat der PO entschieden. In `pdf.service.ts`, `reminder-letter.ts` und `statement-pdf.service.ts` kommt «imput» nicht vor; zu ändern sind nur `messages/fr.json` (60 Treffer, davon 3 Akonto-«imputer», die bleiben) und die Tests `src/__tests__/privacy-i18n.dom.test.ts:46` und `categories.test.ts:263`. Datenschutzerklärung: `privacy_llm_external` und `privacy_llm_local` (fr.json:147–148) und `audit_privacy` (1765) ändern nur das Wort. Empfänger, Länder und Zweck bleiben, also keine inhaltliche Änderung nach Art. 19 DSG.
- **1d**: je eine Stelle, `invoices_ki_confidence` (fr/it.json:874). UL:116 «Wie sicher die KI bei einem Vorschlag ist». Kein Rechtsbegriff.
- **1e**: Im OR-it bedeutet «revocare» die einseitige Rücknahme: Art. 34 cpv. 1 CO «La facoltà conferita per negozio giuridico può sempre essere limitata o revocata dal mandante …». Betroffen sind nur `contracts_withdraw_notice` und `contracts_notice_withdrawn_toast` (it.json:1631, 1633). Der Hilfetext (1632) verwendet «ritirare» und passt. «annullare» ist im OR-it kein Fachwort für die Kündigung (Art. 271 cpv. 1 CO «La disdetta può essere contestata …», Art. 266o «… è nulla»), steht also neutral wie verlangt. Die Option «Annullare la disdetta» in `PeriodStep.svelte:56` kollidiert mit keinem Dialog-Button «Annullare» (`ui_cancel`).
- **2b**: Art. 4 al. 3 OBLF «Les frais d’administration découlant de l’établissement du décompte peuvent être calculés en fonction des dépenses effectives ou portés en compte jusqu’à concurrence des taux usuels.» Art. 4 cpv. 3 OLAL «Le spese amministrative per la stesura del conteggio possono essere computate secondo il dispendio effettivo o nell’ambito delle aliquote usuali.» Je 29 Stellen in fr/it.json, dazu `pdf.service.ts:141, :236` und `statements-i18n.test.ts:54`. Genus und Numerus bleiben gleich (m. Pl. / f. Pl.), die Sätze müssen grammatisch nicht umgebaut werden. Nicht ersetzen: «gestion des immeubles» / «gestione degli immobili» in `privacy_stored_1` (fr/it.json:151), das meint die Liegenschaftsverwaltung.
- **Ersatzmieter it**: siehe nächster Abschnitt. Nur zwei Stellen meinen den Ersatzmieter (de.json:122, 1623). Alle übrigen «nuovo inquilino» (it.json:639, 799, 807, 1637, 1638, 1644, 1645, 1674) meinen den Nachmieter oder einen neu erfassten Mieter und bleiben.
- **3a**: Wartung fr «maintenance», it «manutenzione», en «servicing» (i18n-begriffe.md:55); Art. 5 al. 2 lit. g OBLF «la maintenance». «Investissements créant des plus-values» nach Art. 14 al. 1 OBLF (Wortlaut aus #405 übernommen, nicht neu abgerufen). «Par logement» passt zum PDF-Wort «logements». Eingefrorene Heizprofil-Namen bereits erstellter Abrechnungen (`heatingShare.names`, `statement-pdf.pg.test.ts:106`) ändert die Migration nicht, und das ist richtig: Ein erstelltes Dokument behält seine Namen.
- **3b, Kategorie-Muster**: `CategoryForm.svelte:32–36, 171–178`, `categories_translations_help` in allen vier Sprachen (messages/*.json:1445). Die API nimmt die Felder für Schlüssel und Heizprofil schon an (`routes/distribution-keys.ts:130, 150`).
- **4**: wie oben unter «Szenarien».

## Domain-Review: italienisches Wort für «Ersatzmieter» (für `docs/reviews/405-fachreview-1.md`)

**Frage** (#405, Kommentar vom 2026-10-18; g3-glossary-review-2, C-4): Im Italienischen heisst «Ersatzmieter» (Art. 264 Abs. 1 OR) heute «nuovo inquilino» (`contracts_notice_period_short`, `glossary_notice_period_text`), also gleich wie «Nachmieter». fr «locataire de remplacement» und en «replacement tenant» unterscheiden die beiden. Gesucht ist ein it-Wort, nach dem Wunsch des PO das Fedlex-Wort, wenn es eindeutig ist.

**Begriffe** (UBIQUITOUS_LANGUAGE.md):
- UL:44 **Nachmieter**: «Mieter, dessen Mietvertrag für dieselbe Wohnung nach dem Vertragsende eines gekündigten oder befristeten Mietvertrags beginnt.»
- UL:45 **Ersatzmieter**: «Zumutbarer, zahlungsfähiger neuer Mieter, den der Mieter bei vorzeitiger Rückgabe vorschlägt und der bereit ist, den Mietvertrag zu den gleichen Bedingungen zu übernehmen (Art. 264 Abs. 1 OR).»
Der Unterschied ist rechtlich erheblich. Der Ersatzmieter befreit den bisherigen Mieter vor dem Kündigungstermin; der Nachmieter folgt erst nach dem Vertragsende.

**Fedlex** (OR, Stand 1.10.2026):
- Art. 264 Abs. 1 OR (de): «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen.»
- Art. 264 cpv. 1 CO (it): «Il conduttore che restituisce la cosa senza osservare i termini di preavviso o le scadenze è liberato dai suoi obblighi verso il locatore soltanto se gli propone un nuovo conduttore solvibile che non possa essere ragionevolmente rifiutato dal locatore; il nuovo conduttore deve essere disposto a riprendere il contratto alle medesime condizioni.»
- Art. 264 al. 1 CO (fr): «… il n’est libéré de ses obligations envers le bailleur que s’il lui présente un nouveau locataire qui soit solvable et que le bailleur ne puisse raisonnablement refuser; le nouveau locataire doit en outre être disposé à reprendre le bail aux mêmes conditions.»
- Art. 256a cpv. 1 CO (it), für den gewöhnlichen neuen Mieter: «Se alla fine della locazione precedente è stato steso un processo verbale sullo stato della cosa, il locatore deve darne visione al nuovo conduttore, a sua domanda, al momento della consegna della cosa.» (de: «dem neuen Mieter», fr: «au nouveau locataire».)

**Ergebnis aus Fedlex:** Das Gesetz hat in keiner Sprache ein eigenes Wort für den Ersatzmieter. Es sagt «neuer Mieter» / «nouveau locataire» / «nuovo conduttore», in Art. 264 genauso wie in Art. 256a für den gewöhnlichen neuen Mieter. Auch «Ersatzmieter» selbst ist ein Wort der Praxis und der Rechtsprechung. Mit dem Fedlex-Wort lassen sich die beiden Begriffe also nicht trennen; im Italienischen wäre «nuovo conduttore» sogar dasselbe wie heute, nur mit «conduttore» statt «inquilino».

**Rechtsprechung:** Das Regesto italiano von BGE 117 II 156 lautet: «Il locatore può rifiutare un conduttore sostitutivo che sia disposto a pagare solo una pigione considerevolmente inferiore a quella attuale.» (Quelle: bger.ch, Dokument `atf://117-II-156:it:regeste`, gefunden über `mmx search`, zwei Treffer mit demselben Wortlaut. Den direkten Abruf von bger.ch hat der Proxy hier gesperrt: **unsicher**, bis jemand den Wortlaut auf bger.ch abgleicht.) Das Bundesgericht verwendet also für den Ersatzmieter von Art. 264 ein eigenes Wort, «conduttore sostitutivo».

**Praxis Tessin** (Websuche, nicht amtlich): newhome.ch (it) schreibt «se viene proposto un inquilino sostitutivo» zu Art. 264 CO. Daneben ist «subentrante» / «subentro» verbreitet (mobiliare.ch «Fornire un subentrante in caso di disdetta anticipata», tisubentro.ch). «Subentrare» sagt die App aber schon für den Vertragseintritt (`contracts_parties_fixed_transfer`, it.json:708), und im Alltag heisst so auch der gewöhnliche Nachmieter. Es trennt die Begriffe deshalb nicht sicher.

**Empfehlung:** «inquilino sostitutivo». Begründung:
1. Es trennt den Ersatzmieter vom Nachmieter («nuovo inquilino», gestützt auf Art. 256a «nuovo conduttore»), wie fr und en.
2. Es ist das Wort des Bundesgerichts (BGE 117 II 156, «conduttore sostitutivo»), mit «inquilino» statt «conduttore» nach dem Entscheid 2a (#343: «inquilino» bleibt überall).
3. In der Tessiner Praxis kommt es vor, und es ist nicht doppeldeutig wie «subentrante».
Eindeutig: ja. Diese Empfehlung hat der PO am 2026-10-19 übernommen (#405).

**Texte** (`messages/it.json`):
- `contracts_notice_period_short`: «… Eccezione: un inquilino sostitutivo riprende il contratto di locazione, oppure Lei ha concordato la fine con l’inquilino.»
- `glossary_notice_period_text`, letzter Satz: «Il contratto di locazione termina prima solo se Lei concorda la fine con l’inquilino o se un inquilino sostitutivo lo riprende.» (Zum Inhalt siehe M-1: «se Le propone un inquilino sostitutivo che Lei non può ragionevolmente rifiutare» gibt Art. 264 cpv. 1 genauer wieder.)
- `docs/design/i18n-begriffe.md:32`: «Ersatzmieter | locataire de remplacement | inquilino sostitutivo | replacement tenant», ohne ❓.
- Nicht ändern: «nuovo inquilino» in it.json:639, 799, 807, 1637, 1638, 1644, 1645, 1674 (Nachmieter oder neu erfasster Mieter).

## Fehlende Begriffe (Issue durch den Aufrufer, Labels `fachlich`, `entscheiden`)

- **Nebenkostenpauschale fr/it** (V-3): Vorschlag fr «forfait de frais accessoires», it «forfait per le spese accessorie», beide wie heute, ❓ entfernen. Belege oben.
- Kein neuer Begriff für UBIQUITOUS_LANGUAGE.md nötig. Die Zeilen aus V-14 gehören nur in `i18n-begriffe.md`.

## Nicht bestätigt

- BGE 117 II 156, Regesto it: Wortlaut nur aus Suchtreffern (bger.ch, `mmx search`). search.bger.ch, entscheide.weblaw.ch und servat.unibe.ch sperrte der Proxy (403); relevancy.bger.ch war nicht auflösbar.
- «inquilino sostitutivo», «subentrante» in der Tessiner Praxis: nur Websuche (newhome.ch, mobiliare.ch, tisubentro.ch), keine amtliche Quelle.
- «Forfait per le spese accessorie» in Art. 16a P-OPC: nur aus einer Tessiner Vernehmlassung (ti.ch), nicht auf Fedlex geprüft.
- Ob «Téléréseau», «Custode», «Snow Clearing», «Heating Swiss Plateau», it «Riscaldamento Altipiano» regional üblich sind: nicht unabhängig geprüft (wie in #405).
- Ob die Route `POST /distribution-keys/initialize` ausserhalb von `src/` aufgerufen wird (Skripte, Betrieb): `backend/scripts`, `backend/demo` und `tests` ohne Treffer; externe Aufrufer nicht prüfbar.
- Ob ein zwischengespeichertes Abrechnungs-PDF (`pdf_blob`) nach der Migration neu erzeugt wird und dann die neuen Kategorie- und Schlüsselnamen trägt: `statement.service.ts:480, 549, 612, 647` leeren den Blob nur bei Änderungen an der Abrechnung; versendete Briefe liegen getrennt (`tenant-export.service.ts:96`). Verhalten nach der Migration nicht geprüft.
- Ob `src/__tests__/i18n.test.ts` die Regeln aus i18n-begriffe für die neuen Wörter prüft: nicht gelesen.
