# Fach-Review #461, Runde 2: Fachbegriffe und Rechtstexte der muttersprachlichen Lesungen

Gegenstand: `git diff a4a7ebcf eb57b671 -- messages/` (Lesungen `docs/reviews/461-native-{fr,it,en}.md`), Worktree `review-461-fach2` auf 08211800 (detached), dazu auf Wunsch des Coordinators `contracts_notice_period_short` auf 98b8b9ac. Geprüft je Schlüssel gegen `messages/de.json`, `UBIQUITOUS_LANGUAGE.md` (UL), `docs/design/i18n-begriffe.md` (IB) und Fedlex (Fassungen OR 20261001 it/fr, OBLF 20251001 fr, über den Fedlex-Filestore geladen). Nicht im Umfang: W7/#447-Schlüssel; `contracts_notice_period_short` nur im eigenen Abschnitt unten.

Ich habe zusätzlich automatisch geprüft, ob ein geänderter Text einen IB-Begriff verliert (alle IB-Zellen fr/it/en gegen alt/neu). Dabei kamen V-1 und V-2 heraus. Die übrigen Treffer sind keine Befunde: fr «rappel» in `privacy_mail_*` (siehe FR-24 unten), fr «facture» in `statements_later_draft`, `statements_recalculated` und `categories_fuel_help` (dort stand die Dopplung «facturer les factures»), en «allocable» → «allocability» (IB:54) und en «draft» (die Dopplung ist weg).

## Befunde

| ID | Rolle | Schweregrad | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Minor | it `contracts_notice_period_short` (98b8b9ac, it.json:1650): «che Lei non **può** ragionevolmente rifiutare» (Indikativ). Das Glossar (it.json:122) und Art. 264 cpv. 1 CO sagen «non **possa**». Fix: «… un inquilino sostitutivo che Lei non possa ragionevolmente rifiutare, …». **Eindeutig: ja.** |
| V-1 | Verwalter | Minor | fr/it `contracts_none_yet_text` (fr.json:696, it.json:696): Statt des IB-Begriffs «Vertragsbeginn» (IB:28 «début du contrat» / «inizio del contratto») steht jetzt «une date de début» / «una data d’inizio». Fix: fr «… à partir du début du contrat et pour un loyer donné.», it «… dall’inizio del contratto e a una determinata pigione.» **Eindeutig: ja**, dass der Begriff bleiben muss; der Satzbau ist frei. |
| V-2 | Verwalter | Nit | it `contracts_delete_real_tenancy_ended` (it.json:1641): «termina il {date}» lässt den Feldnamen «fine del contratto» (IB:28) weg, de sagt «Sein Vertragsende». Fix: «… : la fine del contratto è il {date}, poi resta conservato nello storico dell’appartamento.» **Eindeutig: nein** (inhaltlich ist beides richtig). |
| V-3 | Verwalter | Minor | it «vordefiniert»: Nach IT-21 heisst es bei Verteilschlüsseln und Heizprofilen «preimpostato», `categories_description_predefined` (it.json:1430) sagt aber weiter «categorie predefinite». IB hat keine Zeile für «Vordefiniert» (nur IB:61 «Da Dwello» und IB:67 «predefinito» = Standard). Fix: «delle categorie preimpostate», dazu ein neuer Begriff (Vorschlag unten). **Eindeutig: ja** für Schlüssel und Profile; ob auch Kategorien «preimpostate» heissen sollen, ist **nicht eindeutig** (bei Kategorien gibt es kein «Standard», also auch keine Verwechslung). |
| R-1 | Rechtstexte | Nit | en `privacy_llm_external` (en.json:147): «for PDF files, only the first three pages». de sagt «höchstens», und der Code schickt `Math.min(MAX_PAGES, numPages)` (src/lib/file-pages.ts:24, `MAX_PAGES = 3` in src/lib/invoice-upload.ts:28). Fix: «at most the first three pages». An Empfängern, Daten und Zweck ändert sich nichts. **Eindeutig: nein** (beide Fassungen sind nicht falsch). |
| V-4 | Verwalter | Nit | it `glossary_reminder_text` (it.json:112): «che Lei invia per un conteggio inviato»: doppeltes «inviare», und UL:208 sagt «ausgelöste» Zahlungsaufforderung (vorher «che avvia»). Fix: «che Lei avvia per un conteggio inviato …». **Eindeutig: nein.** |
| M-2 | Mietrecht | Nit | fr `glossary_notice_period_text` und `contracts_notice_period_short`: «que vous ne pouvez raisonnablement refuser» (Indikativ). Art. 264 al. 1 CO sagt «que le bailleur ne puisse raisonnablement refuser». Beide Texte sind unter sich gleich, und der Indikativ ist im Französischen korrekt. **Keine Änderung nötig** (eindeutig). |

Keine Blocker, keine Major.

## Bestätigt (je Punkt des Auftrags)

**en**
- **EN-11** `privacy_llm_external`: Empfänger ({provider}, {country}), Daten (Datei mit Dateinamen, Rechnungssteller, Beschreibung, Betrag, Kategorien) und Zweck sind gleich wie in de. «immediately» = «sofort». Ausser R-1 bestätigt.
- **EN-13** `privacy_login_1`: «receives only the name, email address and identifier» gibt «übernimmt nur» genau wieder. An den Datenkategorien ändert sich nichts.
- **EN-14** `audit_privacy`, `audit_empty_text`: «allocability» (IB:54) und «management fee» (IB:77). Die Liste der protokollierten Daten ist unverändert.
- **EN-18** `contracts_parties_fixed_transfer`, `statements_reminder_257d`: «rental contract» ist der IB-Begriff (IB:27), «lease» kommt nicht mehr vor. Frist von mindestens 30 Tagen mit Kündigungsandrohung wie im de-Text. Rechtsaussage unverändert.
- **EN-19** `statements_correct_limit`, `invoices_missed_text`, `statements_later_sent`: «limitation period» für die Verjährungsfrist, «there is no consistent view» für «nicht einheitlich geklärt», Art. 128 No. 1 CO unverändert. «takes into account what has already been paid» für «rechnet an» steht gleich in allen fünf Schlüsseln mit «anrechnen» (auch `invoices_edit_billed_text`, `invoices_delete_billed_text`, EN-20). Bestätigt.
- **EN-51** `privacy_cookies_3`: «forged responses». Cookies, Zweck und Dauer (10 Minuten) unverändert.
- **EN-55** `categories_reason_pest_control`: «utility costs that may not be charged» = «unzulässige Nebenkosten», Art. 257a para. 1 CO unverändert, Ergebnis «not allocable» bleibt.
- **EN-32** Stockwerke: `apartments_floor_first` «1st floor», `apartments_floor_help`, `apartments_floor_upper` «{floor} floor» mit Ordinalzahl aus dem Code (src/lib/apartment.ts:11–24, nur bei `getLocale() === 'en'`). Das PDF hat dieselbe Regel (backend/src/services/pdf.service.ts:558–563). Nachgerechnet mit `Intl.PluralRules('en', {type:'ordinal'})`: 1st 2nd 3rd 4th 11th 12th 13th 21st 22nd 23rd 101st 111th, richtig auch für 11–13. Nach britischer Zählung entspricht «1st floor» dem «1. OG» (das Erdgeschoss ist «ground floor»). fr und it sind unverändert.

**fr**
- **FR-24** `privacy_mail_smtp`, `privacy_mail_resend` (fr.json:178–179): Die Aufzählung lautet jetzt «Les décomptes des charges et les rappels». Das ist keine Verengung: Nach UL:208–209 ist «Mahnung» (fr «rappel», IB:91) der Oberbegriff, die Zahlungserinnerung ist ihre 1. Mahnstufe. Das fr-Glossar sagt dasselbe («d’abord un rappel de paiement, puis … un 2e et un 3e rappel»), und der Folgesatz «pour un rappel» galt schon vorher für alle Stufen. Empfänger (Resend, Inc., États-Unis, bzw. der Mailserver des Betreibers), Datenkategorien, Land und Rechtsgrundlage (art. 16, al. 2, let. d, LPD) sind unverändert.
- **FR-29** `privacy_stored_1`: «la consultation des pièces justificatives par les locataires» folgt Art. 257b al. 2 CO: «Le bailleur doit, à la demande du locataire, lui permettre de consulter les pièces justificatives.» Gespeicherte Daten und Speicherdauer unverändert.
- **FR-10** `invoices_allocability`: «Caractère répercutable» = IB:54.
- **FR-25** `categories_reason_administration`: «peut être facturé au moyen des frais d’administration» (IB:77) deckt Art. 4 al. 3 OBLF: «Les frais d’administration découlant de l’établissement du décompte peuvent être calculés en fonction des dépenses effectives ou portés en compte jusqu’à concurrence des taux usuels.» «répercutable» bleibt im Schlusssatz, Art. 257a al. 2 CO und Art. 5 al. 2 let. i OBLF sind unverändert.
- **FR-30** `glossary_notice_period_text`: «résiliation» (IB:33), «terme de congé» (IB:33), «locataire de remplacement» (IB:32). Geändert ist nur der erste Satz, die Rechtsaussage bleibt gleich.

**it**
- **IT-14** `privacy_llm_external`: «il nome e la descrizione della categoria» = de «Name und Beschreibung der Kategorie». Die Korrektur beseitigt die Lesart «Ihr Name wird übermittelt». Empfänger und Daten gleich wie in de.
- **IT-8** `glossary_notice_period_text` (it.json:122): Der Worker hat richtig entschieden. Art. 264 cpv. 1 CO (Fedlex, Fassung 20261001): «Il conduttore che restituisce la cosa senza osservare i termini di preavviso o le scadenze è liberato dai suoi obblighi verso il locatore soltanto se gli propone un nuovo conduttore solvibile che non possa essere ragionevolmente rifiutato dal locatore; il nuovo conduttore deve essere disposto a riprendere il contratto alle medesime condizioni.» «che Lei non possa ragionevolmente rifiutare» ist dieselbe Aussage im Aktiv. Der Vorschlag des Lesers «possa ragionevolmente accettare» steht so nicht im Gesetz (seine Angabe ist falsch) und würde die Beweislast verschieben. Mit «l’inquilino» ist das Subjekt jetzt klar, «le» klein nach IT-20, «inquilino sostitutivo» = IB:32.
- **IT-21**: «preimpostato» für «vordefiniert» in den sieben Schlüsseln, passend zu den Badges `keys_predefined` «Preimpostata» und `profiles_predefined` «Preimpostato». «predefinito» bleibt für «Standard» (`settings_default_*`, `backend_*_is_default`, IB:67). Ausser V-3 bestätigt. «preimpostato l’addebitabilità» in `categories_predefined_hint` («voreingestellt») ist ein Verb und kein Konflikt.
- **IT-9/IT-10** `contracts_withdraw_notice_help`, `contracts_notice_withdrawn_toast`: «a tempo indeterminato» = «unbefristet» (IB:30). Das passt zum Code: Wer die Kündigung aufhebt, entfernt das Vertragsende, und der Vertrag ist wieder unbefristet (backend/src/services/contract.service.ts:404, 412–418). «annullata» = «annullare la disdetta» (IB:33).
- **IT-20**: Im ganzen it.json gibt es keine gross geschriebenen Höflichkeitsformen mitten im Satz mehr (Suo/Sua/Le/La/Lo/Gli, auch nicht angehängt) und kein klein geschriebenes «lei» (automatisch geprüft). Fachbegriffe und Rechtsaussagen sind davon nicht betroffen.

**Allgemein:** Ausser V-1 und V-2 ersetzt kein geänderter Text einen IB-Begriff, und keiner verschiebt eine Rechtsaussage.

## Zusatz: `contracts_notice_period_short` auf 98b8b9ac

Geprüft wurde 98b8b9ac («fix(contracts): proposed Ersatzmieter in hint»), messages/*.json:1650, gegen Art. 264 Abs. 1 OR, `glossary_notice_period_text` und die Entscheidung in #501.

- **de:** «Ausnahme: Der Mieter schlägt Ihnen einen zumutbaren Ersatzmieter vor, oder Sie haben das Ende mit dem Mieter vereinbart.» Das ist wörtlich die Entscheidung aus #501. Es passt zu Art. 264 Abs. 1 OR («… nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen», Wortlaut aus `docs/reviews/405-fachreview-1.md`:13), zum Glossar («… wenn er Ihnen einen zumutbaren Ersatzmieter vorschlägt») und zu UL:45 «Ersatzmieter» (zumutbar, zahlungsfähig, bereit). Bestätigt. Gegenüber HEAD («Ein Ersatzmieter übernimmt den Mietvertrag») ist das die genauere Rechtsaussage: Der Mieter wird schon frei, wenn er einen zumutbaren Ersatzmieter vorschlägt, auch wenn der Vermieter ihn ablehnt.
- **fr:** «le locataire vous présente un locataire de remplacement que vous ne pouvez raisonnablement refuser». Gleich wie im Glossar und wie Art. 264 al. 1 CO («s’il lui présente un nouveau locataire … que le bailleur ne puisse raisonnablement refuser»). Bestätigt, Modus siehe M-2 (keine Änderung).
- **it:** «l’inquilino le propone un inquilino sostitutivo che Lei non può ragionevolmente rifiutare». Inhaltlich richtig, aber im Indikativ, während Glossar und Gesetz «possa» sagen. Der Relativsatz nennt eine Bedingung, die der Ersatzmieter erfüllen muss, nicht eine Tatsache, deshalb ist der Congiuntivo richtig. Befund **M-1** (Minor, eindeutig): «che Lei non possa ragionevolmente rifiutare». Dass «Eccezione:» einen Hauptsatz einleitet, ändert daran nichts. «le» klein und «Lei» gross nach IT-20, «inquilino sostitutivo» = IB:32.
- **en:** «the tenant proposes a replacement tenant you cannot reasonably refuse». Gleich wie im Glossar, «replacement tenant» = IB:32. Bestätigt.
- Inhaltliche Grenze, die schon in de besteht und entschieden ist (kein Befund): Zahlungsfähigkeit und Übernahme zu gleichen Bedingungen stecken nur im Wort «zumutbar» bzw. «ne pouvez raisonnablement refuser», wie im Glossar.

## Fehlender Begriff (Issue, Labels `fachlich`, `entscheiden`)

- **Vordefiniert** (Verteilschlüssel, Heizprofil, Kategorie), Vorschlag für eine Zeile in `docs/design/i18n-begriffe.md`: «Vordefiniert (Verteilschlüssel, Heizprofil; nicht «Standard») | prédéfini | preimpostato (nicht «predefinito»: das ist «Standard») | predefined». Zu entscheiden ist, ob auch «vordefinierte Kategorie» in Fliesstexten it «preimpostata» heisst (V-3); in der Oberfläche heisst sie «Da Dwello» (IB:61).

## Nicht bestätigt

- **Art. 257d OR, Art. 128 Ziff. 1 OR und Art. 266a/266c OR** auf Fedlex habe ich nicht neu nachgeschlagen. Die Lesungen haben die Verweise und Fristen dort nicht geändert (verglichen mit de.json), also war das für diese Runde nicht nötig. Der Wortlaut bleibt im Sinne dieses Berichts **unsicher**.
- **Art. 264 Abs. 1 OR auf Deutsch:** übernommen aus `docs/reviews/405-fachreview-1.md`:13. Ich habe ihn nicht selbst auf Fedlex abgeglichen; it und fr habe ich abgeglichen.
- **Englische Fedlex-Fassung des OR:** Sie ist keine Amtssprache und nicht verbindlich. Die en-Begriffe habe ich deshalb nur gegen IB und de geprüft, nicht gegen Fedlex.
- **Ob Resend und der Mailserver wirklich Zahlungserinnerungen und Mahnungen versenden:** angenommen nach backend/src/services/reminder-letter.ts:2 («shared by the PDF and the e-mail»). Den Versandweg habe ich nicht weiter verfolgt, weil FR-24 die Aussage darüber nicht ändert.
