# Fachreview #458, Runde 2: Entwurf zu den Persona-Befunden

Rolle: Rechtstexte (DSG, OR, UWG). Gegenstand: Entwurf `458-texts-draft-2.md` (Teile A–D). Massgeblicher Stand: Worktree `review-458-fach2`, `8807e6ae` (`messages/*.json`, `src/routes/privacy/+page.svelte`, `src/routes/terms/+page.svelte`). Vorbericht: `docs/reviews/458-fachreview-1.md`. Persona-Berichte: `docs/design/personas/helga-458.md` (P-1, P-2), `docs/design/personas/dr-weber-458.md` (P-2, P-3, P-5). Dr. Weber P-1 gehört zu #459 und ist hier nicht geprüft.

Gesetzestexte: DSG SR 235.1, Fassung 1.9.2023 (`eli/cc/2022/491/20230901`, Fedlex-Filestore, de/fr/it/en; dieselben Dateien wie in Runde 1).

`&nbsp;` steht in den fr-Texten für U+00A0.

## Status der offenen IDs aus Runde 1

| ID | Status |
|---|---|
| R-1, R-2, R-3 | Vom PO wie vorgeschlagen entschieden. Erledigt. |
| R-4 bis R-10, R-13 | Übernommen. Geprüft in `messages/{fr,it,en}.json`: fr ohne normale Leerzeichen an « » : ;, it `privacy_controller_1`, `terms_availability_1`, fr/en Art. 28, en Art. 32(1)/(2), `login_terms_before`, it «tale fornitore», `.env.example:80–81`. Erledigt. |
| R-11 | Keine Änderung nötig (wie in Runde 1). |
| R-12 | Bleibt offen bis zum Merge: Wird nach dem 19.10.2026 gemergt, das Datum in `legal_as_of`, `privacy.feature:111` und `terms.feature:32` nachführen. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-14 | Rechtstexte | Minor | B: «wenn Sie ihre Daten erfassen» nennt den falschen Zeitpunkt. Art. 19 Abs. 2 DSG verlangt die Information «bei der Beschaffung», also wenn der Vermieter die Daten erhält. «Erfassen» heisst in Dwello das Eintippen in die App, und das kann später sein. Ersatz: «wenn Sie ihre Daten erhalten» (Text unten). |
| R-15 | Rechtstexte | Minor | B: Der Fall, dass Daten nicht vom Mieter selbst kommen (Art. 19 Abs. 5 DSG: spätestens einen Monat danach), fehlt. Für private Vermieter ist das beim Kauf einer vermieteten Liegenschaft der Normalfall. Einen Satz ergänzen (Text unten). |
| R-16 | Rechtstexte (i18n) | Minor | B: en «tenancy agreement» → «rental contract», fr «conclusion du bail» → «conclusion du contrat de bail» (`i18n-begriffe.md:27`; en.json hat «rental contract» 206-mal, «tenancy agreement» nie). |
| R-17 | Rechtstexte | Minor | C: Der Satz gehört nicht in `privacy_controller_4`. Dieser Text ist entschieden (R-3), geht an die Mieter und bekäme damit genau die Art Satz «nur für den Vermieter», die P-2 bemängelt. Stattdessen ein neuer Absatz `terms_responsibility_5` auf /terms, der auch die Auskunft nennt (Art. 25 Abs. 2 und 7 DSG). Text unten. |
| R-18 | Rechtstexte | Minor | D: Der Satz gehört nicht in `privacy_controller_2` (an die Mieter), sondern auf /terms: neuer Absatz `terms_processor` direkt nach `terms_no_contract`. Dazu kommt die Genehmigung für Unterauftragsbearbeiter nach Art. 9 Abs. 3 DSG (Mailserver, KI), die Dr. Webers Frage zum Mailanbieter beantwortet. Text unten. |
| R-19 | Rechtstexte | Nit | B: «Mietern, deren Daten schon in Dwello sind» lässt die heutigen Mieter aus, die noch nicht erfasst sind, und schliesst ehemalige Mieter ein. Besser: «Ihren heutigen Mietern» (nicht «bisherigen Mietern», denn das heisst im Mietrecht «Vormieter»). Ist im Text unten schon eingebaut. |
| R-20 | Rechtstexte | Nit | P-2 Rest: `privacy_third_5` «Ausser den hier und unter «Anmeldung» genannten Diensten …» verweist im weitergegebenen Abschnitt weiter auf «Anmeldung». Der Satz bleibt trotzdem richtig, weil die Anmeldedienste keine Mieterdaten erhalten. Gab es schon vor dieser Änderung, keine Änderung nötig. |
| R-21 | Rechtstexte | Nit | D: Betreibt der Vermieter Dwello selbst, sind der Anbieter seines Servers und der Mailanbieter seine eigenen Auftragsbearbeiter. Der Satz in D deckt nur den Fall «Anbieter betreibt Dwello» ab. Optional einen zweiten Satz anfügen (Text unten). |

Keine Blocker, keine Major.

---

## Empfehlung pro Teil

| Teil | Empfehlung |
|---|---|
| A (Links) | **Eindeutig empfohlen**, wie entworfen. |
| B (`terms_responsibility_4`) | **Empfohlen mit R-14, R-15, R-16, R-19**: genau der Text unten. |
| C (Export) | **Inhalt empfohlen, Ort nicht.** Kein Zusatz zu `privacy_controller_4`, stattdessen `terms_responsibility_5` auf /terms (R-17). |
| D (Art. 9) | **Inhalt empfohlen, Ort nicht.** Nicht in der Datenschutzerklärung, stattdessen `terms_processor` auf /terms nach `terms_no_contract` (R-18). |

### A. Links

Bestätigt. Art. 19 Abs. 1 DSG verlangt nur eine «angemessen[e]» Information, eine bestimmte Form schreibt er nicht vor. Sprungmarken auf die vier Abschnitte machen das Weitergeben leichter und ändern keinen entschiedenen Text. Die Abschnitts-IDs `controller`, `stored`, `retention`, `third` gibt es (`src/routes/privacy/+page.svelte:75,86,98,120`; `Panel` reicht `id` weiter, `src/lib/ui/Panel.svelte:10,16`). Die Linktexte kommen aus `privacy_*_title` und stimmen darum in allen vier Sprachen mit den Namen in `terms_responsibility_3` überein (in Runde 1 bestätigt). Helgas Wunsch nach einer Druckfassung nur dieser Abschnitte verlangt das Recht nicht. Das ist eine Produktfrage, kein Befund.

### B. Wie und wann: `terms_responsibility_4` (Antworten auf die Fragen 1–3)

**Frage 1 (Zeitpunkt, Art. 19 Abs. 1/2/5):** Art. 19 Abs. 2 DSG: «Er teilt der betroffenen Person bei der Beschaffung diejenigen Informationen mit, die erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist; …». Massgeblich ist die Beschaffung, nicht das Eintippen in Dwello. Daher R-14: «erhalten» statt «erfassen».
Art. 19 Abs. 5 DSG: «Werden die Daten nicht bei der betroffenen Person beschafft, so teilt er ihr die Informationen nach den Absätzen 2–4 spätestens einen Monat, nachdem er die Daten erhalten hat, mit. Gibt der Verantwortliche die Personendaten vor Ablauf dieser Frist bekannt, so informiert er die betroffene Person spätestens im Zeitpunkt der Bekanntgabe.» Ja, die Hilfe braucht diesen Fall (R-15). Wer eine vermietete Liegenschaft kauft, erhält die Mieterdaten vom Verkäufer, nicht vom Mieter. Den zweiten Satz von Abs. 5 lasse ich in der Hilfe weg, um sie kurz zu halten. Die Kategorien der Daten (Abs. 3) nennt «Welche Daten Dwello speichert» schon.

**Frage 2 (einmal nachschicken):** Der Satz ist richtig und als Rat für die Zielgruppe nötig. Ob das Gesetz es bei bereits beschafften Daten verlangt, ist **unsicher**. Art. 19 knüpft an die Beschaffung an. Mit Dwello kommen aber neue Empfänger dazu (Betreiber als Auftragsbearbeiter, Mailanbieter, gegebenenfalls ein Land im Ausland), und darüber wurde der Mieter bei der Beschaffung nicht informiert. Art. 6 Abs. 2 DSG: «Die Bearbeitung muss nach Treu und Glauben erfolgen …». Art. 20 Abs. 1 Bst. a DSG befreit nur, wenn «die betroffene Person … bereits über die entsprechenden Informationen» verfügt, und das trifft hier nicht zu. Der Satz nennt bewusst keinen Artikel und verspricht keine Pflicht, so ist er vertretbar. R-19 betrifft nur die Wortwahl.

**Frage 3 (Sätze weglassen):** Das ist zulässig. Art. 19 Abs. 2–4 DSG verlangt mindestens Identität und Kontakt, Zweck, Empfänger und gegebenenfalls Staat und Garantien. Die genannten Beispiele (Anmeldung des Vermieters, Protokoll unter «Einstellungen», Entwürfe im Browser) betreffen keinen dieser Punkte. Sie nennen weder Empfänger noch ein Land, und ihr Weglassen nimmt dem Mieter keine Pflichtangabe. Die Abschnitte selbst müssen dafür nicht geändert werden. Ein eigener Text «Information für Mieter» (Dr. Webers Vorschlag P-2) wäre besser, ist aber eine Produktfrage. Falls gewünscht: ein `produkt`-Issue. Wichtig ist, dass die Beispiele eng bleiben, damit niemand die Absätze zu Mailserver und KI weglässt. So ist der Satz formuliert.

**Text (ersetzt den Entwurf B):**

| Sprache | `terms_responsibility_4` |
|---|---|
| de | Geben Sie diese Angaben Ihren Mietern, wenn Sie ihre Daten erhalten, meist beim Abschluss des Mietvertrags, auf Papier oder per E-Mail. Erhalten Sie die Daten nicht vom Mieter selbst, etwa beim Kauf einer vermieteten Liegenschaft, geben Sie ihm die Angaben spätestens einen Monat danach (Art. 19 Abs. 5 DSG). Ihren heutigen Mietern schicken Sie die Angaben einmal nach. Sätze, die nur Sie betreffen, etwa zur Anmeldung, zum Protokoll unter «Einstellungen» oder zu ungespeicherten Angaben im Browser, können Sie weglassen. |
| fr | Remettez ces informations à vos locataires lorsque vous recevez leurs données, en général à la conclusion du contrat de bail, sur papier ou par e-mail. Si vous ne recevez pas les données du locataire lui-même, par exemple lors de l’achat d’un immeuble loué, remettez-lui ces informations au plus tard un mois après (art. 19, al. 5, LPD). Envoyez-les une fois à vos locataires actuels. Vous pouvez omettre les phrases qui ne concernent que vous, par exemple sur la connexion, sur le journal sous «&nbsp;Paramètres&nbsp;» ou sur les saisies non enregistrées dans le navigateur. |
| it | Dia queste indicazioni ai Suoi inquilini quando ne riceve i dati, di solito alla conclusione del contratto di locazione, su carta o per e-mail. Se non riceve i dati dall’inquilino stesso, ad esempio con l’acquisto di un immobile locato, gli dia queste indicazioni al più tardi un mese dopo (art. 19 cpv. 5 LPD). Ai Suoi inquilini attuali le invii una volta. Può tralasciare le frasi che riguardano solo Lei, ad esempio sull’accesso, sul registro sotto «Impostazioni» o sui dati non salvati nel browser. |
| en | Give this information to your tenants when you receive their data, usually when the rental contract is concluded, on paper or by email. If you do not receive the data from the tenant themselves, for example when you buy a building that is already let, give them this information within one month at the latest (Art. 19(5) FADP). Send it once to your current tenants. You can leave out sentences that concern only you, for example about the sign-in, the log under «Settings» or unsaved entries in the browser. |

Die Gesetzesangaben folgen der Schreibweise der bestehenden Texte: de «Art. 19 Abs. 2 DSG», fr «art. 19, al. 2, LPD», it «art. 19 cpv. 2 LPD», en «Art. 19(2) FADP». Die Verweise «Einstellungen»/«Paramètres»/«Impostazioni»/«Settings» und Anmeldung/connexion/accesso/sign-in stimmen mit `nav_settings`, `audit_privacy` und `privacy_login_title` überein. Für das Szenario: Ein Schritt in `terms.feature` («… wann und wie er die Angaben weitergibt») kann den ersten Satz mit `toContain` prüfen.

### C. Export (Dr. Weber P-3): `terms_responsibility_5` statt Zusatz zu `privacy_controller_4` (R-17)

**Beleg:** Entwurf C. `privacy_controller_4` (de.json:172) ist ein entschiedener Text (R-3) im Abschnitt «Verantwortlich», den der Vermieter an die Mieter weitergibt (`terms_responsibility_3`). Der Satz «Die Daten eines Mieters laden Sie auf seiner Seite … herunter» richtet sich nur an den Vermieter. Am Ende von Teil B müsste der Vermieter genau diesen Satz wieder weglassen.

**Brauchen?** Rechtlich verlangt ihn das Gesetz nicht. Als Hilfe ist er aber nötig: Art. 25 Abs. 2 DSG verlangt «In jedem Fall … b. die bearbeiteten Personendaten als solche», und Abs. 7: «Die Auskunft wird in der Regel innerhalb von 30 Tagen erteilt.» Die Datei aus «Daten exportieren» liefert Bst. b. Die vier Abschnitte und Name und Kontakt (Teil B) liefern Bst. a, c, d und g. Darum nennt der Satz beides und deckt Auskunft (Art. 25) und Herausgabe (Art. 28) zusammen ab. Den Knopf gibt es auf jeder Mieterseite (`src/routes/tenants/[id]/TenantExportCard.svelte:22`). Die Frist von 30 Tagen steht schon in `tenants_export_help`, darum hier nicht noch einmal.

| Sprache | `terms_responsibility_5` (nach `terms_responsibility_4`) |
|---|---|
| de | Verlangt ein Mieter Auskunft über seine Daten oder ihre Herausgabe, laden Sie sie auf seiner Seite mit «Daten exportieren» herunter und geben Sie ihm die Datei zusammen mit diesen Angaben (Art. 25 und 28 DSG). |
| fr | Si un locataire demande quelles données le concernent ou qu’elles lui soient remises, téléchargez-les sur sa page avec «&nbsp;Exporter les données&nbsp;» et remettez-lui le fichier avec ces informations (art. 25 et 28 LPD). |
| it | Se un inquilino chiede informazioni sui suoi dati o la loro consegna, li scarichi sulla sua pagina con «Esportare i dati» e gli consegni il file insieme a queste indicazioni (art. 25 e 28 LPD). |
| en | If a tenant asks what data you hold about them or for a copy of it, download it on their page with «Export data» and give them the file together with this information (Art. 25 and 28 FADP). |

Für Rechnungssteller (Dr. Weber) gibt es keinen Export. Ihre Daten stehen bei den Rechnungen. Einen Satz dazu verlangt das Recht nicht, darum kein Befund.

### D. Auftragsbearbeitung (Dr. Weber P-5): `terms_processor` statt Zusatz zu `privacy_controller_2` (R-18)

**Beleg:** Entwurf D. `privacy_controller_2` (de.json:170) steht im Abschnitt «Verantwortlich», der an die Mieter geht. Eine Anweisung an den Vermieter, einen Vertrag abzuschliessen, ist für den Mieter ohne Belang (P-2). Die Seite /terms richtet sich nur an den Vermieter, und `terms_no_contract` (de.json:197) spricht dort schon von den «Vereinbarungen mit ihm». Der neue Satz gehört direkt dahinter, als eigener Schlüssel, damit der entschiedene Text unverändert bleibt.

**Rechtlich:** Art. 9 Abs. 1 DSG: «Die Bearbeitung von Personendaten kann vertraglich oder durch die Gesetzgebung einem Auftragsbearbeiter übertragen werden, wenn: a. die Daten so bearbeitet werden, wie der Verantwortliche selbst es tun dürfte; und b. keine gesetzliche oder vertragliche Geheimhaltungspflicht die Übertragung verbietet.» Abs. 2: «Der Verantwortliche muss sich insbesondere vergewissern, dass der Auftragsbearbeiter in der Lage ist, die Datensicherheit zu gewährleisten.» Abs. 3: «Der Auftragsbearbeiter darf die Bearbeitung nur mit vorgängiger Genehmigung des Verantwortlichen einem Dritten übertragen.» Für einen privaten Anbieter braucht es also einen Vertrag. Der Rat im Entwurf ist richtig. Die DSG schreibt für diesen Vertrag keine Form vor, darum «Vereinbarung» und nicht «schriftlicher Vertrag».

**Dr. Webers Frage (Mailanbieter):** Den Mailserver richtet der Betreiber ein (`privacy_mail_smtp`). Betreibt ein Anbieter Dwello für den Vermieter, bearbeitet der Mailanbieter die Mieterdaten in den Nachrichten im Auftrag dieses Anbieters. Er ist damit ein Unterauftragsbearbeiter, und dafür braucht der Anbieter nach Art. 9 Abs. 3 die vorgängige Genehmigung des Vermieters. Für eine externe KI (`privacy_llm_external`) gilt dasselbe. Betreibt der Vermieter Dwello selbst, ist der Mailanbieter direkt sein Auftragsbearbeiter (R-21). Gegenüber den Mietern verlangt Art. 19 Abs. 2 Bst. c DSG nur, die Empfänger zu nennen, nicht ihre Rolle. Das tut `privacy_mail_smtp_provider`. Die Datenschutzerklärung braucht dazu also nichts. Die Genehmigung gehört in den Satz an den Vermieter.

| Sprache | `terms_processor` (nach `terms_no_contract`) |
|---|---|
| de | Schliessen Sie mit einem solchen Anbieter eine Vereinbarung über die Auftragsbearbeitung ab: Er bearbeitet die Daten nur so, wie Sie es selbst dürften, schützt sie und zieht weitere Dienste, etwa für den Mailversand oder die KI, nur mit Ihrer vorgängigen Zustimmung bei (Art. 9 DSG). |
| fr | Concluez avec un tel prestataire un contrat de sous-traitance&nbsp;: il ne traite les données que comme vous seriez en droit de le faire vous-même, en garantit la sécurité et ne fait appel à d’autres services, par exemple pour l’envoi des e-mails ou l’IA, qu’avec votre autorisation préalable (art. 9 LPD). |
| it | Concluda con un tale fornitore un contratto sul trattamento dei dati per Suo conto: tratta i dati solo come Lei stesso avrebbe il diritto di fare, ne garantisce la sicurezza e ricorre ad altri servizi, ad esempio per l’invio delle e-mail o per l’IA, solo previa Sua autorizzazione (art. 9 LPD). |
| en | Conclude a data processing agreement with such a provider: it processes the data only in the way you yourself may, keeps it secure and uses other services, for example for sending email or for the AI, only with your prior approval (Art. 9 FADP). |

«Ein solcher Anbieter» schliesst an `terms_no_contract` an («Betreibt ein Anbieter Dwello für Sie …» / «Si un prestataire exploite Dwello pour vous …» / «Se un fornitore gestisce Dwello per Lei …» / «If a provider runs Dwello for you …»). Steht der Satz an einer anderen Stelle, braucht er den Bedingungssatz aus dem Entwurf D. Die Wörter sous-traitant/responsabile del trattamento/processor aus Art. 9 LPD/FADP stimmen mit `i18n-begriffe.md:104` überein.

**R-21 (optional), zweiter Satz:**
- de: Betreiben Sie Dwello selbst, gilt das für die Anbieter Ihres Servers und Ihres Mailservers.
- fr: Si vous exploitez Dwello vous-même, cela vaut pour les prestataires de votre serveur et de votre serveur de messagerie.
- it: Se gestisce Dwello Lei stesso, ciò vale per i fornitori del Suo server e del Suo server di posta.
- en: If you run Dwello yourself, this applies to the providers of your server and your mail server.

---

## Begriffe

Es fehlen keine Glossarbegriffe. «Vermieter», «Mieter», «Mietvertrag», «Liegenschaft», «Betreiber», «Auftragsbearbeiter (DSG)» stehen in `UBIQUITOUS_LANGUAGE.md:14,23,26,35,238,240`. «Vereinbarung über die Auftragsbearbeitung» setzt sich aus dem Glossarbegriff zusammen und wird im Satz selbst erklärt. Ein Issue ist nicht nötig. Will der PO die Vereinbarung als eigenen Begriff führen, lautet mein Vorschlag: **Vereinbarung über die Auftragsbearbeitung**: «Vertrag zwischen Vermieter und Anbieter, nach dem der Anbieter die Daten nur im Auftrag des Vermieters bearbeitet (Art. 9 DSG)».

## Nicht bestätigt

- **Pflicht, heutige Mieter nachträglich zu informieren** (Frage 2): **unsicher**. Art. 19 DSG regelt die Information bei der Beschaffung, Art. 6 Abs. 2 und Art. 20 Abs. 1 Bst. a DSG (Fedlex) stützen den Rat nur mittelbar. Kommentare und EDÖB-Hinweise zur Information bei einer Änderung der Bearbeitung habe ich nicht geöffnet.
- **Ehemalige Mieter**, deren Daten noch aufbewahrt werden: Ob sie nachträglich informiert werden müssen, habe ich nicht geprüft. Der Text in B spricht bewusst nur die heutigen Mieter an.
- **Ob ein Auftragsbearbeiter «Empfänger» im Sinn von Art. 19 Abs. 2 Bst. c DSG ist:** Art. 5 Bst. e DSG («Bekanntgeben: das Übermitteln oder Zugänglichmachen von Personendaten») spricht dafür. Ausdrücklich geregelt ist es auf Fedlex nicht. Für die Texte hat das keine Folgen, weil der Betreiber genannt wird.
- **Inhalt der Datei aus «Daten exportieren»:** Ob sie wirklich alles enthält, was Art. 25 Abs. 2 Bst. b DSG verlangt (etwa Einträge im Protokoll unter «Einstellungen», Rechnungen mit dem Namen des Mieters), habe ich nicht geprüft. Ich habe mich auf `tenants_export_help` verlassen.
- **Frist für die Herausgabe nach Art. 28 DSG** (30 Tage in `tenants_export_help`): Sie steht in der DSV, die ich nicht geladen habe. Für Art. 25 ist sie in Abs. 7 DSG bestätigt.
- **Aktualität der DSG-Fassung:** Ich habe die Fassung vom 1.9.2023 aus Runde 1 verwendet und nicht geprüft, ob es bis 19.10.2026 eine neuere konsolidierte Fassung der Art. 6, 9, 19, 20, 25 gibt.
- **fr/it/en-Formulierungen:** geprüft gegen den Wortlaut von LPD/FADP und `i18n-begriffe.md`, nicht mit einer muttersprachlichen Fachperson.
