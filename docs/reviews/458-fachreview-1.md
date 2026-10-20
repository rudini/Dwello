# Fachreview #458, Runde 1: @wip-Szenarien und Entwurf der Rechtstexte

Rolle: Rechtstexte (DSG, OR, UWG). Gegenstand: Worktree `review-458-fach`, Commit `9251867b` (Basis `c09ec4fd`), dazu der Entwurf `458-texts-draft.md` (Zeilennummern unten beziehen sich auf diese Datei). Anforderung: #458 («Decided (product owner)», «Done means») und der Kommentar #411-6249574737.

Gesetzestexte direkt aus dem Fedlex-Filestore geladen: DSG SR 235.1, Fassung 1.9.2023, in de/fr/it/en (`eli/cc/2022/491/20230901`), sowie UWG SR 241, Fassung 1.1.2025 (`eli/cc/1988/223_223_223/20250101`, de).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte | Major | `privacy_stored_country` de «Der Server steht in {country}.» ergibt «in Schweiz», «in USA», «in Niederlande». Neuer Wortlaut nötig, den der PO entscheidet (Frage 3). |
| R-2 | Rechtstexte | Major | Die Hilfe `terms_responsibility_3` legt nahe, dass die vier Abschnitte zum Informieren genügen. Sie nennen aber weder Name noch Kontakt des Vermieters (Art. 19 Abs. 2 Bst. a DSG) und sprechen den Vermieter mit «Sie» an. Ein Satz muss ergänzt werden (PO, entschiedener Text). |
| R-3 | Rechtstexte | Minor | `privacy_controller_3`/`_4` nennen nur die Mieter. Früher stand dort «Jede Person …», und Art. 25 DSG gilt für «Jede Person», etwa einen Rechnungssteller als Einzelperson. Vorschlag unten (PO). |
| R-4 | Rechtstexte (i18n) | Minor | fr: Nach « und vor » fehlt das geschützte Leerzeichen (U+00A0), ebenso vor « : » und « ; ». Der Entwurf hat normale Leerzeichen, `messages/fr.json` hat bei Guillemets 182 von 182 U+00A0 (`i18n-begriffe.md:5`). |
| R-5 | Rechtstexte (i18n) | Minor | it `privacy_controller_1`/`_none`, erster Satz: «Dei dati … è titolare del trattamento Lei in quanto locatore» ist schwer lesbar. Ersatz unten. |
| R-6 | Rechtstexte | Minor | `terms_availability_1` «Ein Anspruch auf ununterbrochene Verfügbarkeit besteht nicht.» widerspricht dem neuen `terms_no_contract` («gelten die Vereinbarungen mit ihm»): Hinweise, die keinen Vertrag ersetzen, können keinen Anspruch ausschliessen. Ersatz unten. |
| R-7 | Rechtstexte (i18n) | Nit | fr `privacy_controller_4` «format électronique courant» → «format électronique couramment utilisé» (Wortlaut Art. 28 al. 1 LPD); en «commonly used» → «conventional» (Fedlex-Übersetzung Art. 28 FADP). |
| R-8 | Rechtstexte (i18n) | Nit | en zitiert «Art. 32 para. 1 FADP», `privacy_mail_resend` en dagegen «Art. 16(2)(d) FADP». Einheitlich «Art. 32(1) FADP», «Art. 32(2) FADP». |
| R-9 | Rechtstexte (i18n) | Nit | `login_terms_before`: fr «figure» → «figurent», en «is set out» → «are set out» (zwei Satzglieder als Subjekt); it klarer mit «Lei»: «Che cosa offre Dwello e di che cosa Lei è responsabile è spiegato nelle». |
| R-10 | Rechtstexte (i18n) | Nit | it `terms_no_contract` «gli accordi presi con lui» (lui für eine Firma) → «gli accordi presi con tale fornitore». |
| R-11 | Rechtstexte | Nit | Demo: Der Abschnitt «Verantwortlich» sagt weiterhin «… sind Sie als Vermieter verantwortlich», das Demo-Panel oben «In der Demo ist der Betreiber für alle Daten verantwortlich.» Das ist vertretbar, weil das Panel ausdrücklich für die Demo gilt. Keine Änderung nötig. |
| R-12 | Rechtstexte | Nit | «Stand: 19. Oktober 2026» muss das Datum sein, ab dem die Texte gelten. Wird nach dem 19.10.2026 gemergt, das Datum in `legal_as_of` und in `privacy.feature:117` und `terms.feature:34` nachführen. |
| R-13 | Rechtstexte | Nit | `.env.example`: Der entschiedene Kommentar ist deutsch, die übrigen Kommentare sind englisch (CLAUDE.md, «Conventions»). Zudem fehlt der Hinweis, dass der Wert unübersetzt in allen vier Sprachen erscheint (wie `LLM_PROVIDER_COUNTRY`). Vorschlag unten; ob deutsch bleibt, entscheidet der Aufrufer bzw. der PO. |

Keine Blocker.

---

## R-1 (Major): «Der Server steht in {country}.» (Frage 3)

**Beleg:** Entwurf Z. 61 (de, entschieden in #458 Punkt 4 und im Kommentar #411: «Der Server steht in {country}.»), Szenario `tests/e2e/features/privacy.feature:82`. Das Beispiel in `.env.example` selbst (Entwurf Z. 95) ist `OPERATOR_SERVER_COUNTRY=Schweiz`. Damit zeigt gerade die naheliegendste Einstellung den Satz «Der Server steht in Schweiz.» Ebenso falsch sind «in USA» und «in Niederlande», denn Ländernamen mit Artikel brauchen «in der/den». Das E2E-Szenario mit «Deutschland» deckt den Fehler nicht auf. Das Englische hat dasselbe Problem («in United States», «in Netherlands»). fr und it umgehen es schon mit einem Doppelpunkt.

**Warum falsch:** Rechtlich verlangt Art. 19 Abs. 4 DSG nur, dass der Staat genannt wird: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.» Die Form ist frei. Ein grammatisch falscher Satz auf der Rechtsseite wirkt aber unseriös, und er trifft die häufigste Konfiguration. Weil sich der Variablenwert nicht deklinieren lässt, hilft nur ein Wortlaut ohne Präposition vor dem Wert. Der Inhalt bleibt gleich. Trotzdem ändert das einen entschiedenen Text, also entscheidet der PO («Coding guidelines»).

**Empfehlung (an den PO):** Die vorgeschlagene Form mit Doppelpunkt, parallel zu fr/it:

| Sprache | `privacy_stored_country` |
|---|---|
| de | Der Server steht in folgendem Land: {country}. |
| fr | Le serveur se trouve dans le pays suivant&nbsp;: {country}. (bleibt; vor «:» U+00A0, siehe R-4) |
| it | Il server si trova nel seguente Paese: {country}. (bleibt) |
| en | The server is located in the following country: {country}. |

Die beiden Vorschläge aus dem Entwurf («Land des Servers: {country}.» oder «Der Server steht in diesem Land: {country}.») sind rechtlich ebenso in Ordnung. Ich empfehle «in folgendem Land», weil es fr/it am nächsten ist und ein ganzer Satz bleibt.

Danach muss `privacy.feature:82` lauten: «… Dwello-Installation. Der Server steht in folgendem Land: Deutschland.» Ausserdem braucht es einen DOM-Test mit `Schweiz`.

## R-2 (Major): Hilfe zum Informieren der Mieter genügt Art. 19 Abs. 2 DSG nicht

**Beleg:** Entwurf Z. 81–84 (`terms_responsibility_3`, entschieden). Der Abschnitt «Verantwortlich» (Entwurf Z. 19, 31, 37) sagt «… sind Sie als Vermieter verantwortlich. Dwello wird von {operator} betrieben.» Er nennt also den Betreiber, aber nicht den Vermieter. Die anderen drei Abschnitte sprechen den Vermieter ebenfalls mit «Sie» an («Dokumente, die Sie zu Mietern hochladen», `privacy_stored_1`). Szenario: `terms.feature:29`.

Art. 19 Abs. 2 DSG: «… er teilt ihr mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.»

**Warum falsch:** Die Bst. b und c decken die Abschnitte ab (Zweck in `privacy_stored_1`, Empfänger unter «Weitergabe an Dritte», dort auch der KI-Empfänger). Bst. a deckt aber keiner ab: Der Mieter liest «Sie als Vermieter» und erfährt nicht, wer sein Vermieter ist und wie er ihn erreicht. Leitet ein unerfahrener Vermieter die Abschnitte wörtlich weiter, liest der Mieter sogar, *er* sei als Vermieter verantwortlich und *seine* Mieter könnten bei *ihm* Auskunft verlangen. Die Hilfe richtet sich an die Zielgruppe, die genau so vorgeht («Design-Regeln»), und gibt als vollständig aus, was unvollständig ist. In der Praxis kommt der Name oft mit dem Begleitschreiben. Die Hilfe sagt das aber nicht.

**Empfehlung (an den PO, entschiedener Text):** Einen Satz anhängen.

| Sprache | `terms_responsibility_3` |
|---|---|
| de | Sie können Ihren Mietern dazu die Abschnitte «Verantwortlich», «Welche Daten Dwello speichert», «Aufbewahrung» und «Weitergabe an Dritte» der Datenschutzerklärung weitergeben. Nennen Sie dabei Ihren Namen und wie Ihre Mieter Sie erreichen, und sagen Sie dazu, dass mit «Sie» dort der Vermieter gemeint ist (Art. 19 Abs. 2 DSG). |
| fr | Pour cela, vous pouvez transmettre à vos locataires les sections «&nbsp;Responsable&nbsp;», «&nbsp;Quelles données Dwello enregistre&nbsp;», «&nbsp;Conservation&nbsp;» et «&nbsp;Transmission à des tiers&nbsp;» de la déclaration de protection des données. Indiquez-leur votre nom et comment vous joindre, et précisez que «&nbsp;vous&nbsp;» y désigne le bailleur (art. 19, al. 2, LPD). |
| it | A tal fine può trasmettere ai Suoi inquilini le sezioni «Titolare del trattamento», «Quali dati salva Dwello», «Conservazione» e «Trasmissione a terzi» dell’informativa sulla protezione dei dati. Indichi loro il Suo nome e come raggiungerLa e precisi che «Lei» vi designa il locatore (art. 19 cpv. 2 LPD). |
| en | For this you can pass on to your tenants the sections «Controller», «What data Dwello stores», «Retention» and «Sharing with third parties» of the privacy notice. Tell them your name and how to reach you, and explain that «you» there means the landlord (Art. 19(2) FADP). |

(`&nbsp;` steht für U+00A0.) Das Szenario `terms.feature:29` prüft mit `toContain` den ersten Satz und bleibt grün. Für den zweiten Satz einen Schritt ergänzen («… dass er dabei seinen Namen und seine Kontaktdaten nennt»).

Die Titel der Abschnitte stimmen in allen vier Sprachen mit `privacy_controller_title`, `privacy_stored_title`, `privacy_retention_title` und `privacy_third_title` überein (bestätigt in `messages/*.json`).

## Ersatztexte zu den Minor/Nit (pro Sprache)

**R-3** (PO, entschiedener Text). Art. 25 Abs. 1 DSG: «Jede Person kann vom Verantwortlichen Auskunft darüber verlangen, ob Personendaten über sie bearbeitet werden.» Rechnungssteller als Einzelpersonen werden erfasst (`privacy_llm_external`).
- de `_3`: Ihre Mieter und andere Personen, deren Daten Sie erfassen, etwa Rechnungssteller, können bei Ihnen kostenlos Auskunft darüber verlangen, ob und welche Daten über sie bearbeitet werden, Sie selbst beim Betreiber (Art. 25 DSG). `_4` beginnt dann: «Ebenso können diese Personen bei Ihnen und Sie beim Betreiber verlangen, …»
- fr `_3`: Vos locataires et les autres personnes dont vous saisissez les données, par exemple des émetteurs de factures, peuvent vous demander gratuitement si des données les concernant sont traitées et lesquelles&nbsp;; vous-même pouvez le demander à l’exploitant (art. 25 LPD). `_4`: «De même, ces personnes peuvent vous demander, …»
- it `_3`: I Suoi inquilini e le altre persone di cui inserisce i dati, ad esempio gli emittenti di fatture, possono chiederLe gratuitamente se e quali dati che li riguardano sono trattati; Lei stesso può chiederlo al gestore (art. 25 LPD). `_4`: «Allo stesso modo queste persone possono chiederLe, …»
- en `_3`: Your tenants and other people whose data you enter, such as invoice issuers, can ask you free of charge whether and which data about them is processed, and you can ask the operator (Art. 25 FADP). `_4`: «Likewise, these people can ask you, …»
- Szenario `privacy.feature:71`: Der Schritt prüft «Ihre Mieter können bei Ihnen kostenlos Auskunft». Er müsste auf «Ihre Mieter und andere Personen» angepasst werden.

**R-4** fr: in `terms_responsibility_3`, `privacy_controller_none`, `_2`, `_3`, `_4`, `privacy_stored_country` und `privacy_mail_smtp_provider` (Entwurf Z. 26, 32, 38, 44, 62, 70, 82) U+00A0 nach « und vor », :, ; setzen.

**R-5** it:
- `privacy_controller_1`: In quanto locatore, Lei è titolare del trattamento dei dati che inserisce in Dwello, anche di quelli dei Suoi inquilini. Dwello è gestito da {operator}.
- `privacy_controller_none`, erster Satz gleich: «In quanto locatore, Lei è titolare del trattamento dei dati che inserisce in Dwello, anche di quelli dei Suoi inquilini.» Der Rest bleibt.

**R-6** `terms_availability_1` (kein entschiedener Text, aber der neue Satz macht den Widerspruch sichtbar):
- de: Betrieb, Datensicherung und Verfügbarkeit liegen beim Betreiber dieser Dwello-Installation. Ob er eine bestimmte Verfügbarkeit zusagt, regelt die Vereinbarung mit ihm.
- fr: L’exploitation, la sauvegarde des données et la disponibilité incombent à l’exploitant de cette installation Dwello. L’accord conclu avec lui précise s’il garantit une certaine disponibilité.
- it: L’esercizio, il backup dei dati e la disponibilità spettano al gestore di questa installazione di Dwello. Se garantisce una determinata disponibilità lo stabilisce l’accordo con il gestore.
- en: Operation, data backup and availability are the responsibility of the operator of this Dwello installation. Whether the operator commits to a certain availability is set out in your agreement with them.

**R-7** fr: «… leur soient remises dans un format électronique couramment utilisé (art. 28 LPD)». en: «… in a conventional electronic format (Art. 28 FADP)».

**R-8** en `privacy_controller_4`: «(Art. 32(1) FADP)», «(Art. 32(2) FADP)».

**R-9** fr: «Ce que Dwello fournit et ce dont vous êtes responsable figurent dans les». en: «What Dwello does and what you are responsible for are set out in the». it: «Che cosa offre Dwello e di che cosa Lei è responsabile è spiegato nelle».

**R-10** it: «Queste indicazioni non sostituiscono un contratto. Se un fornitore gestisce Dwello per Lei, valgono gli accordi presi con tale fornitore.»

**R-13** `.env.example` (englisch, gleicher Inhalt):
```
# Required when the server or the mail server is outside Switzerland: the privacy statement names the country
# (Art. 19 para. 4 FADP). Choose a provider in a country with adequate data protection (Annex 1 DPO), otherwise the
# privacy statement is incomplete. The values are shown as entered, in all four languages.
```

---

## Bestätigt (mit Quelle)

- **De-Texte des Entwurfs = entschiedene Texte:** `login_terms_before`, `privacy_controller_1`/`_none`/`_2`/`_3`/`_4`, der Demo-Satz, `privacy_stored_2` (ohne «PostgreSQL-»), `privacy_stored_country`, `privacy_mail_smtp_provider` (Anfang laut Kommentar, Rest wörtlich wie `privacy_mail_smtp`), `terms_no_contract`, `terms_responsibility_3` und der `.env.example`-Kommentar stimmen wörtlich mit #411-6249574737 und #458 überein.
- **Art. 5 Bst. j/k DSG** (Verantwortlicher/Auftragsbearbeiter): «Verantwortlicher: private Person oder Bundesorgan, die oder das allein oder zusammen mit anderen über den Zweck und die Mittel der Bearbeitung entscheidet; k. Auftragsbearbeiter: private Person oder Bundesorgan, die oder das im Auftrag des Verantwortlichen Personendaten bearbeitet.» fr «responsable du traitement» / «sous-traitant», it «titolare del trattamento» / «responsabile del trattamento», en «controller» / «processor»: wörtlich in Art. 5 LPD/FADP. Der Entwurf verwendet sie richtig, auch in `privacy_controller_2` fr/it/en. Dass fr/it/en dort den Fachbegriff zusätzlich nennen, de aber nicht, entspricht #458 Punkt 1 und dem Glossar («UI-Text umschreibt»).
- **Art. 25 DSG:** Abs. 4 «Lässt der Verantwortliche Personendaten von einem Auftragsbearbeiter bearbeiten, so bleibt er auskunftspflichtig.» Abs. 6 «Der Verantwortliche muss kostenlos Auskunft erteilen. Der Bundesrat kann Ausnahmen vorsehen …». «kostenlos» ist also richtig, und die Mieter beim Vermieter (Szenario `privacy.feature:71`) ebenfalls.
- **Art. 28 Abs. 1 DSG:** «… die Herausgabe ihrer Personendaten, die sie ihm bekanntgegeben hat, in einem gängigen elektronischen Format verlangen, wenn: a. der Verantwortliche die Daten automatisiert bearbeitet; und b. die Daten … in unmittelbarem Zusammenhang mit dem Abschluss oder der Abwicklung eines Vertrags … bearbeitet werden.» Für Mieterdaten aus dem Mietvertrag sind die Voraussetzungen erfüllt; «Daten, die sie selbst angegeben haben» gibt «die sie ihm bekanntgegeben hat» wieder. it «formato elettronico usuale» = LPD wörtlich.
- **Art. 32 DSG:** Abs. 1 «… verlangen, dass unrichtige Personendaten berichtigt werden, es sei denn: a. eine gesetzliche Vorschrift verbietet die Änderung …». Abs. 2 «Klagen zum Schutz der Persönlichkeit … Die klagende Partei kann insbesondere verlangen, dass: a. eine bestimmte Datenbearbeitung verboten wird; … c. Personendaten gelöscht oder vernichtet werden.» «notfalls vor Gericht» und «was aufbewahrt werden muss, bleibt» passen dazu. fr «rectifiées», «inexactes», it «rettificati», «inesatti», en «correct», «incorrect/inaccurate» passen.
- **Art. 49 Abs. 1 DSG:** «Der EDÖB eröffnet von Amtes wegen oder auf Anzeige hin eine Untersuchung …». Also «anzeigen»; fr «Le PFPDT ouvre d’office ou sur dénonciation» → «dénoncer»; it «L’IFPDT apre, d’ufficio o su denuncia» → «denunciarla»; en «in response to a report» → «report it». Die Behördennamen in allen vier Sprachen entsprechen Art. 4 DSG/LPD/FADP («Federal Data Protection and Information Commissioner (FDPIC)»).
- **Art. 19 Abs. 4 DSG und Art. 16 Abs. 2 Bst. d DSG** (Wortlaut oben bzw. «Standarddatenschutzklauseln, die der EDÖB vorgängig genehmigt, ausgestellt oder anerkannt hat»): Der Mail-Text «{provider} ({country})» und der Resend-Text, der unverändert bleibt, erfüllen die Pflicht, den Staat zu nennen. Bei einem Land mit Angemessenheitsentscheid (Art. 16 Abs. 1) braucht es keine Garantie.
- **Art. 8 UWG:** «Unlauter handelt insbesondere, wer allgemeine Geschäftsbedingungen verwendet, die in Treu und Glauben verletzender Weise zum Nachteil der Konsumentinnen und Konsumenten ein erhebliches und ungerechtfertigtes Missverhältnis …» Mit Option B gibt es keine AGB-Klauseln (Haftung, Recht, Gerichtsstand). «akzeptieren» fällt weg, und `terms_no_contract` stellt klar, dass kein Vertrag zustande kommt. Ob der Vermieter Konsument ist, spielt darum keine Rolle mehr. Einziger Rest ist R-6.
- **Szenarien:** Die @wip-Szenarien decken alle Punkte von «Done means» ab, die E2E prüfen kann: geteilte Verantwortung, Auskunft beim Vermieter, Rechte, Server- und Mail-Land, Demo, «akzeptieren» entfernt, kein Vertrag, Hilfe, Stand. Die Schritte prüfen die entschiedenen de-Wortlaute. Der Text ohne die neuen Variablen ist laut Kommentar Sache des DOM-Tests (`privacy.feature:98`); das passt.
- **Datumsformate** de «19. Oktober 2026», fr «19 octobre 2026», it «19 ottobre 2026», en «19 October 2026»; `legal_as_of` fr «Version du», it «Stato:», en «Last updated:» sind übliche Formen.
- **Glossar:** «Vermieter», «Betreiber», «Verantwortlicher (DSG)», «Auftragsbearbeiter (DSG)», «Protokoll des Servers» (`UBIQUITOUS_LANGUAGE.md:26, 238–241`) und bailleur/locatore/landlord, exploitant/gestore/operator (`i18n-begriffe.md:25, 104`) werden im Entwurf richtig verwendet. Es fehlen keine Begriffe, ein Glossar-Issue ist nicht nötig.

## Nicht bestätigt

- **Konsumentenbegriff in Art. 8 UWG** für private Vermieter: **unsicher**. Das UWG definiert ihn nicht (Fedlex, SR 241). Laut einem Suchtreffer (Stöckli, «Der neue Art. 8 UWG», unifr.ch) können sich «private Bauherren» auf Art. 8 UWG berufen; das spricht eher dafür, dass ein privater Vermieter Konsument ist. Nicht weiter geprüft, und wegen Option B ohne Folgen.
- **Hosting im Ausland als «Bekanntgabe ins Ausland»** (Art. 19 Abs. 4, Art. 16 DSG), wenn ein Schweizer Betreiber einen Server in Deutschland nutzt: herrschende Auffassung, auf Fedlex nicht ausdrücklich geregelt; die EDÖB-Seite habe ich nicht geöffnet.
- **Anhang 1 DSV** (Länderliste) und **Art. 19 DSV** (Ausnahmen von der Kostenlosigkeit der Auskunft): nicht geladen.
- **Resend DPA Ziff. 6.5 / Swiss-U.S. DPF:** wie in #458 nicht bestätigt (resend.com über den Proxy gesperrt). Der Text bleibt unverändert, darum habe ich das nicht erneut geprüft.
- **Art. 9 DSG** (Auftragsbearbeitung): Abs. 3 «Der Auftragsbearbeiter darf die Bearbeitung nur mit vorgängiger Genehmigung des Verantwortlichen einem Dritten übertragen.» Betreibt ein Anbieter Dwello mit externer KI oder externem Mailserver, braucht er dafür die Genehmigung des Vermieters. Das gehört in die «Vereinbarungen mit ihm» bzw. in eine spätere Option A (eigene Bedingungen des Betreibers) und ist kein Befund zu diesen Texten. Ein Hinweis für das Issue, sobald ein gehostetes Angebot geplant ist.
- **Darstellung des Anmeldehinweises:** Ob `Text.of(loginLegalNote)` «… steht in den Nutzungsbedingungen.» ohne Zeilenumbruch zwischen Text und Link liefert, und dass `data-testid="login-legal"` erst mit der Umsetzung entsteht (`src/routes/login/+page.svelte:49–60` hat es noch nicht), ist Sache des `code-reviewer`. Hier nicht geprüft.
- **fr/it-Formulierungen** habe ich gegen den LPD-Wortlaut und die bestehenden `messages/*.json` geprüft, nicht mit einer muttersprachlichen Fachperson.
