# Fachreview Hilfetexte (#109, #67, #69), Runde 1

Gegenstand: Worktree `review-help-fach`, Commit 4234f26 (`@wip`-Szenarien in `tests/e2e/features/help.feature`, rote Tests in `src/__tests__/help-page.dom.test.ts` und `distribution-keys-pages.dom.test.ts`), vorgeschlagene Texte (`proposed-texts.md`), aktuelle Texte (`messages/{de,fr,it,en}.json`).
Gesetzestexte: Fedlex-Filestore, OR (SR 220) in der Fassung vom 01.10.2026, VMWG (SR 221.213.11) in der Fassung vom 01.10.2025, gefunden über den Fedlex-SPARQL-Endpunkt (die Fedlex-Seite selbst braucht JavaScript).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | `glossary_allocable_text`: Es fehlt, dass der Mieter nur vertraglich vereinbarte Nebenkosten bezahlt (Art. 257a Abs. 2 OR); «lässt sich pro Rechnung anpassen» stimmt nur in eine Richtung |
| M-2 | Mietrecht | Minor | `glossary_reminder_text`: Die 3. Mahnung ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR; ein unerfahrener Vermieter kann das annehmen |
| M-3 | Mietrecht | Minor | Neu «Befristet / Unbefristet»: «mit Ihrem Wissen» ist enger bzw. anders als «stillschweigend fortsetzen» (Art. 266 Abs. 2 OR); betrifft auch die Glossarzeile (Product Owner) |
| M-4 | Mietrecht | Minor | Neu «Kündigungstermin»: Einzahl/Mehrzahl passen nicht («Der Tag … : die … Termine»); der Termin im Mietvertrag geht dem ortsüblichen vor (Art. 266a Abs. 1 OR) |
| V-1 | Verwalter | Minor | `glossary_profile_text`: «Wechselt der Mieter» trifft den Einzug in eine leere Wohnung nicht; Regel gilt bei jedem Ein- oder Auszug |
| V-2 | Verwalter | Minor | `glossary_days_text`: «bezahlt nur den Anteil seiner Mietstage» widerspricht dem Heizprofil bei Heizkosten; «während des Jahres» statt Abrechnungsperiode; «Leerstand» ist kein Glossarbegriff |
| V-3 | Verwalter | Minor | `glossary_reminder_text`: Gemahnt wird nur eine Nachzahlung, nie eine Rückerstattung |
| V-4 | Verwalter | Minor | `glossary_deadline_text`: Der Teil zur Rückerstattung aus dem Glossar («Rückerstattung bis») fehlt |
| V-5 | Verwalter | Minor | `glossary_fee_text`, `config_help_management_fee`: «bis 3 %» statt «etwa 3 %» (Glossar); in `glossary_fee_text` fehlt «ein höherer Satz muss dem Aufwand entsprechen» |
| V-6 | Verwalter | Minor | `glossary_balance_text` (it): «la differenza le viene rimborsata» heisst «wird Ihnen (dem Vermieter) zurückerstattet» |
| V-7 | Verwalter | Minor | Neues `config_help_distribution_key` + `settings_key_suggested` in den Einstellungen: «Dieser» / «Elle» / «Viene proposta» bezieht sich dann auf die Rechnung statt auf den Verteilschlüssel |
| V-8 | Verwalter | Minor | `categories_translations`: ohne Hilfetext; der Vermieter erfährt nicht, dass die Übersetzung auf der Abrechnung des Mieters steht |
| V-9 | Verwalter | Minor | Neu «Manuell überschrieben»: «Manuell» erscheint auch bei Rechnungen, für die die KI nie eine Kategorie vorgeschlagen hat |
| V-10 | Verwalter | Nit | `settings_iban_help` (Vorschlag): ohne Frist für die Rückerstattung |
| V-11 | Verwalter | Nit | `categories_sort_order_help`: Die Zahl ordnet auch die Liste unter «Kategorien»; bei gleicher Zahl entscheidet der Name |
| V-12 | Verwalter | Nit | `config_help_accounting_period`: Abkürzung «z. B.» statt «zum Beispiel» (Design-Regeln, einfache Wörter) |
| V-13 | Verwalter | Nit | Neu «Kündigungsfrist»: Die Ausnahmen, die die App selbst nennt (Ersatzmieter, vereinbartes Ende), fehlen |

Fehlende Begriffe (für den Product Owner): «Leerstand» (Glossar), «Kündigungsfrist» (`docs/design/i18n-begriffe.md`), Glossarzeile «Befristet / Unbefristet» (M-3). Siehe Abschnitt «Fehlende Begriffe».

---

## Befunde

### M-1 (Major): `glossary_allocable_text` ohne Bedingung des Mietvertrags

**Belege**
- `messages/de.json:102`: «Eine umlagefähige Rechnung fliesst in die Nebenkostenabrechnung ein, zum Beispiel Heizung, Wasser, Hauswart oder Kehricht. Ob eine Rechnung umlagefähig ist, folgt ihrer Kategorie und lässt sich pro Rechnung anpassen.»
- Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- `UBIQUITOUS_LANGUAGE.md:86` (Umlagefähigkeit): «bezahlen muss der Mieter sie nur, wenn der Mietvertrag sie vorsieht (Art. 257a Abs. 2 OR)»; `:208` (Umlagefähige Nebenkosten): «abschliessende Liste im Mietvertrag».
- `backend/src/services/invoice.service.ts:231`: `if (!category.isAllowedUtilityCost) data.isValidUtilityCost = false;` Eine Rechnung einer nicht umlagefähigen Kategorie kann nicht umlagefähig gemacht werden; man kann nur eine Rechnung einer umlagefähigen Kategorie ausnehmen.

**Warum falsch.** Die Hilfe ist der Ort, wo ein unerfahrener Vermieter «umlagefähig» nachliest. Der Text sagt: umlagefähig heisst, die Rechnung kommt in die Abrechnung. Dass der Mieter nur Nebenkosten bezahlt, die sein Mietvertrag nennt, fehlt. Wer danach abrechnet, belastet nicht vereinbarte Kosten. Dieser Teil der Abrechnung ist nicht geschuldet, und der Mieter kann ihn zurückfordern. `categories_allocable_help` nennt die Bedingung, die Hilfeseite aber nicht. «Lässt sich pro Rechnung anpassen» verspricht zudem beide Richtungen, der Code erlaubt nur das Ausnehmen.

**Ersatz**
- de: «Eine umlagefähige Rechnung fliesst in die Nebenkostenabrechnung ein, zum Beispiel Heizung, Wasser, Hauswart oder Kehricht. Ob eine Rechnung umlagefähig ist, folgt ihrer Kategorie; eine einzelne Rechnung einer umlagefähigen Kategorie können Sie davon ausnehmen. Bezahlen muss der Mieter diese Kosten nur, wenn der Mietvertrag sie als Nebenkosten nennt.»
- fr: «Une facture imputable entre dans le décompte des charges, par exemple le chauffage, l’eau, le concierge ou les ordures. Le fait qu’une facture soit imputable découle de sa catégorie ; vous pouvez en exclure une facture isolée d’une catégorie imputable. Le locataire ne doit payer ces frais que si le contrat de bail les mentionne comme frais accessoires.»
- it: «Una fattura addebitabile confluisce nel conteggio spese accessorie, per esempio riscaldamento, acqua, custode o rifiuti. Se una fattura è addebitabile dipende dalla sua categoria; può escludere una singola fattura di una categoria addebitabile. L’inquilino deve pagare questi costi solo se il contratto di locazione li indica come spese accessorie.»
- en: «An allocable invoice goes into the utility cost statement, for example heating, water, caretaker or refuse. Whether an invoice is allocable follows from its category; you can exclude a single invoice of an allocable category. The tenant only has to pay these costs if the rental contract lists them as utility costs.»

### M-2 (Minor): Mahnung ist keine Zahlungsfrist nach Art. 257d OR

**Belege**
- `messages/de.json:108`: «… zuerst eine Zahlungserinnerung, danach höchstens eine 2. und eine 3. Mahnung.»
- Art. 257d Abs. 1 OR: «Ist der Mieter nach der Übernahme der Sache mit der Zahlung fälliger Mietzinse oder Nebenkosten im Rückstand, so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde. Diese Frist beträgt mindestens zehn Tage, bei Wohn- und Geschäftsräumen mindestens 30 Tage.»
- `backend/src/services/reminder-letter.ts:34` (3. Mahnung): «… andernfalls müssen wir weitere Schritte einleiten.» Keine Kündigungsandrohung, Frist nach `payment_deadline` statt mindestens 30 Tagen.

**Warum.** Art. 257d OR gilt ausdrücklich auch für Nebenkosten, also für eine Nachzahlung aus der Abrechnung. Ein unerfahrener Vermieter liest «3. Mahnung» als letzte Stufe vor der Kündigung. Kündigt er danach ohne eigene Fristansetzung mit Androhung, ist die Kündigung anfechtbar bzw. unwirksam (Rechtsfolge im Einzelnen nicht auf Fedlex belegt: **unsicher**). Der Text ist nicht falsch, ihm fehlt aber diese Grenze. Ersatz zusammen mit V-3 unten.

### M-3 (Minor): «Befristet / Unbefristet»: «mit Ihrem Wissen»

**Belege**
- Vorschlag: «Bleibt der Mieter danach mit Ihrem Wissen in der Wohnung, gilt der Vertrag als unbefristet.»
- Art. 266 Abs. 1 OR: «Haben die Parteien eine bestimmte Dauer ausdrücklich oder stillschweigend vereinbart, so endet das Mietverhältnis ohne Kündigung mit Ablauf dieser Dauer.» Abs. 2: «Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»
- `UBIQUITOUS_LANGUAGE.md:38`: «bleibt der Mieter danach mit Wissen des Vermieters, gilt er als unbefristet (Art. 266 OR)».
- `docs/anforderungen-vertragsende.md:199` (A-6): schon im früheren Fachreview als unsicher markiert.

**Warum.** Das Gesetz verlangt, dass *beide Parteien* das Mietverhältnis stillschweigend fortsetzen. Weiss der Vermieter vom Verbleib, verlangt aber sofort die Räumung, setzt er nichts fort. Dann bleibt der Vertrag beendet. Der Satz «mit Ihrem Wissen» kann einen Vermieter glauben lassen, der Vertrag sei schon unbefristet, sobald er davon weiss, und ihn davon abhalten, rechtzeitig zu widersprechen. Wie lange der Vermieter mit dem Widerspruch warten darf, regelt die Rechtsprechung; dazu habe ich nichts auf Fedlex gefunden (**unsicher**). Der Vorschlag gibt die Glossarzeile wörtlich wieder, deshalb nur Minor. Die Glossarzeile selbst geht an den Product Owner (siehe «Fehlende Begriffe»).

**Ersatz (de, neuer Text):** «Ein befristeter Mietvertrag endet ohne Kündigung am vereinbarten Vertragsende. Bleibt der Mieter danach in der Wohnung und Sie lassen ihn bleiben, ohne zu widersprechen, gilt der Vertrag als unbefristet. Ein unbefristeter Mietvertrag läuft, bis er gekündigt wird.»
Das Szenario (`help.feature:33`, «endet ohne Kündigung am vereinbarten Vertragsende») trifft weiterhin zu. Beim Übersetzen: fr «durée déterminée / durée indéterminée», it «a tempo determinato / a tempo indeterminato», en «fixed-term / open-ended» (`i18n-begriffe.md:28`); Fedlex fr Art. 266 Abs. 2: «Si le bail est reconduit tacitement, il devient un contrat de durée indéterminée.», it: «In caso di riconduzione tacita, la locazione è considerata a tempo indeterminato.»

### M-4 (Minor): «Kündigungstermin»: Satzbau und Rangfolge

**Belege**
- Vorschlag: «Der Tag, auf den ein unbefristeter Mietvertrag gekündigt werden kann: die ortsüblichen Termine oder die Termine im Mietvertrag.»
- Art. 266a Abs. 1 OR: «Die Parteien können das unbefristete Mietverhältnis unter Einhaltung der gesetzlichen Fristen und Termine kündigen, sofern sie keine längere Frist oder keinen anderen Termin vereinbart haben.»
- Art. 266c OR: «Bei der Miete von Wohnungen können die Parteien mit einer Frist von drei Monaten auf einen ortsüblichen Termin oder, wenn es keinen Ortsgebrauch gibt, auf Ende einer dreimonatigen Mietdauer kündigen.»
- `UBIQUITOUS_LANGUAGE.md:39`.

**Warum.** «Der Tag … : die … Termine» passt in der Zahl nicht zusammen und liest sich holprig. Inhaltlich geht ein im Mietvertrag vereinbarter Termin dem ortsüblichen vor. «Oder» lässt offen, welcher gilt. Das Glossar ist nicht falsch, der Hilfetext kann es aber eindeutig sagen.

**Ersatz (de, neuer Text):** «Ein Tag, auf den ein unbefristeter Mietvertrag gekündigt werden kann: ein Termin aus dem Mietvertrag oder, wenn er keinen nennt, ein ortsüblicher Termin. Nach einer Kündigung ist es der Tag, auf den gekündigt wurde. Bis dahin läuft der Vertrag weiter und heisst gekündigt.»
Das Szenario (`help.feature:34`, «Tag, auf den ein unbefristeter Mietvertrag gekündigt werden kann») trifft weiterhin zu.

### V-1 (Minor): `glossary_profile_text`: «Wechselt der Mieter»

**Belege**
- `messages/de.json:96`: «… Wechselt der Mieter während der Abrechnungsperiode, teilt Dwello die Heizkosten so nach Monaten statt nach Tagen auf.»
- `docs/nebenkostenabrechnung-anforderungen.md:145` (Regel 5): «Kosten einer Heizkosten-Kategorie werden für einen Mietvertrag, der nur einen Teil der Periode läuft (Ein- oder Auszug), nach dem Heizprofil … verteilt»; `UBIQUITOUS_LANGUAGE.md:160` (Zeitanteil): «im Abrechnungslauf bei Ein- oder Auszug»; `:149` (Abrechnungslauf «mit Heizprofil»).
- `config_help_heating_profile` (`messages/de.json:1168`) sagt es richtig: «Zieht ein Mieter … ein oder aus».

**Warum.** Ein Einzug in eine leere Wohnung oder ein Auszug ohne Nachmieter ist kein Mieterwechsel, wird aber genauso nach dem Heizprofil gerechnet. Die zwei Hilfetexte zum selben Begriff sagen also Verschiedenes. Nachgerechnet mit «Heizung Mittelland» (`backend/migrations/0002_stammdaten.sql:75`), Periode Kalenderjahr: Einzug 01.07. → 0 + 0 + 1 + 10 + 13.5 + 17 = 41.5 % statt 184/365 = 50.4 % nach Tagen. Einzug 16.03. → 13.5 × 16/31 + 54.5 = 61.47 % statt 291/365 = 79.7 %. Bei Leerstand bis 30.06. und ohne Mieterwechsel gilt also ebenfalls das Heizprofil.

**Ersatz**
- de: «Verteilt die Heizkosten in Prozent auf die 12 Monate, denn im Winter wird mehr geheizt als im Sommer. Zieht ein Mieter während der Abrechnungsperiode ein oder aus, teilt Dwello seine Heizkosten so nach Monaten statt nach Tagen auf. Das Heizprofil wählen Sie beim Erstellen der Abrechnungen.»
- fr: «Répartit les frais de chauffage en pour cent sur les 12 mois, car on chauffe davantage en hiver qu’en été. Si un locataire emménage ou déménage pendant la période de décompte, Dwello répartit ainsi ses frais de chauffage par mois plutôt que par jours. Vous choisissez le profil de chauffage lors de l’établissement des décomptes.»
- it: «Ripartisce le spese di riscaldamento in percentuale sui 12 mesi, perché d’inverno si riscalda più che d’estate. Se un inquilino entra o lascia l’appartamento durante il periodo di conteggio, Dwello ripartisce così le sue spese di riscaldamento per mesi anziché per giorni. Sceglie il profilo di riscaldamento quando allestisce i conteggi.»
- en: «Spreads the heating costs over the 12 months in percent, because more heating is used in winter than in summer. If a tenant moves in or out during the billing period, Dwello splits their heating costs by month instead of by day. You choose the heating profile when you create the statements.»

### V-2 (Minor): `glossary_days_text`

**Belege**
- `messages/de.json:100`: «… Zieht ein Mieter während des Jahres ein oder aus, bezahlt er nur den Anteil seiner Mietstage; Leerstand trägt der Vermieter.»
- `UBIQUITOUS_LANGUAGE.md:160` (Zeitanteil: Heizkosten mit Heizprofil nach dem Anteil nach Heizprofil); `:162` (Mietstage «in der Abrechnungsperiode»); `docs/nebenkostenabrechnung-anforderungen.md:144` (Regel 4: «Den Anteil leerer Wohnungen und leerer Tage trägt immer der Vermieter»).
- Art. 7 Abs. 1 VMWG: «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.»
- «Leerstand» kommt in `UBIQUITOUS_LANGUAGE.md` nicht vor (nur in `i18n-begriffe.md:64` und den Anforderungen).

**Warum.** Bei Heizkosten mit Heizprofil bezahlt der Mieter eben nicht den Anteil seiner Mietstage (V-1: 41.5 % statt 50.4 %). Der Satz widerspricht also dem Eintrag direkt darüber. «Während des Jahres» passt nicht zu einer Periode Juli–Juni. Nachgerechnet nach Tagen: Wohnungsanteil CHF 1'000.00, Periode 01.01.–31.12.2025 (365 Tage); Vormieter bis 15.03. → 74 Tage = 202.74; Nachmieter ab 16.03. → 291 Tage = 797.26; Summe 1'000.00. Mit Nachmieter erst ab 01.04. → 275 Tage = 753.42, die 16 leeren Tage (43.84) trägt der Vermieter. Grenzfall: Mietvertrag endet vor der Periode → 0 Mietstage → 0.00. Bestätigt.

**Ersatz**
- de: «Die Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft. Zieht ein Mieter während der Abrechnungsperiode ein oder aus, bezahlt er nur den Anteil seiner Mietstage, bei Heizkosten mit Heizprofil den Anteil seiner Monate. Die Kosten der Tage, an denen eine Wohnung leer steht, trägt der Vermieter.»
- fr: «Le nombre de jours pendant lesquels un contrat de bail court dans la période de décompte. Si un locataire emménage ou déménage pendant la période de décompte, il ne paie que la part de ses jours de location et, pour les frais de chauffage avec un profil de chauffage, la part de ses mois. Les coûts des jours où un appartement est vacant sont à la charge du bailleur.»
- it: «Il numero di giorni in cui un contratto di locazione è in corso nel periodo di conteggio. Se un inquilino entra o esce durante il periodo di conteggio, paga solo la quota dei suoi giorni di locazione e, per le spese di riscaldamento con un profilo di riscaldamento, la quota dei suoi mesi. I costi dei giorni in cui un appartamento è sfitto sono a carico del locatore.»
- en: «The number of days a rental contract runs in the billing period. If a tenant moves in or out during the billing period, they pay only the share of their days rented and, for heating costs with a heating profile, the share of their months. The landlord bears the costs of the days an apartment stands vacant.»

### V-3 (Minor) und M-2: `glossary_reminder_text`

**Belege**
- `backend/src/services/reminder.service.ts:60`: `if (!(Number(statement.balance) > 0)) throw new ReminderError('REMINDER_REFUND', 'Eine Rückerstattung wird nicht gemahnt: …')`.
- `UBIQUITOUS_LANGUAGE.md:182–183` (Mahnung, Mahnstufe); Art. 257d Abs. 1 OR (siehe M-2).

**Warum.** «Zu einer versendeten Abrechnung» umfasst auch Rückerstattungen. Eine Rückerstattung kann aber nicht gemahnt werden. Zur Grenze nach Art. 257d siehe M-2.

**Ersatz (V-3 und M-2 zusammen)**
- de: «Eine Zahlungsaufforderung, die Sie zu einer versendeten Abrechnung mit Nachzahlung auslösen: zuerst eine Zahlungserinnerung, danach höchstens eine 2. und eine 3. Mahnung. Kündigen dürfen Sie wegen eines Zahlungsrückstands erst nach einer eigenen schriftlichen Zahlungsfrist von mindestens 30 Tagen, in der Sie die Kündigung androhen; die Mahnungen sind das nicht.»
- fr: «Une demande de paiement que vous déclenchez pour un décompte envoyé avec un montant à payer : d’abord un rappel de paiement, puis au plus un 2e et un 3e rappel. Pour résilier le bail en raison d’un retard de paiement, il faut un délai de paiement écrit distinct d’au moins 30 jours, assorti de la menace de résiliation ; les rappels n’en tiennent pas lieu.»
- it: «Una richiesta di pagamento che avvia per un conteggio inviato con importo dovuto: prima un promemoria di pagamento, poi al massimo un 2° e un 3° sollecito. Per disdire la locazione a causa di un ritardo nel pagamento serve un termine di pagamento scritto a parte di almeno 30 giorni, con l’avvertimento della disdetta; i solleciti non lo sostituiscono.»
- en: «A demand for payment that you issue for a sent statement with an amount due: first a payment reminder, then at most a 2nd and a 3rd reminder. To terminate the rental contract for late payment, you need a separate written payment deadline of at least 30 days that warns of termination; the reminders are not one.»

### V-4 (Minor): `glossary_deadline_text` ohne Rückerstattung

**Belege**
- `messages/de.json:106`: «Das Datum, bis zu dem der Mieter die Abrechnung bezahlt haben muss.»
- `UBIQUITOUS_LANGUAGE.md:181`: «Bei einer Rückerstattung das Datum, bis zu dem der Vermieter zurückerstattet (Anzeige: „Rückerstattung bis“).»; `docs/nebenkostenabrechnung-anforderungen.md:151` (Regel 11); `messages/de.json:1071` `statements_refund_by` «Rückerstattung bis».

**Warum.** Die Abrechnung einer Rückerstattung zeigt eine Frist für den Vermieter. Die Hilfe kennt nur die Frist des Mieters. Das passt nicht zum Entscheid zu #69, dass Rückerstattungen erklärt werden.

**Ersatz**
- de: «Das Datum, bis zu dem der Mieter eine Nachzahlung bezahlt haben muss. Bei einer Rückerstattung ist es das Datum, bis zu dem Sie ihm den Betrag überweisen («Rückerstattung bis»).»
- fr: «La date à laquelle le locataire doit avoir payé un montant à payer. Pour un remboursement, c’est la date à laquelle vous lui versez le montant (« Remboursement au plus tard le »).»
- it: «La data entro cui l’inquilino deve aver pagato un importo dovuto. Per un rimborso è la data entro cui Lei gli versa l’importo («Rimborso entro il»).»
- en: «The date by which the tenant must have paid an amount due. For a refund, it is the date by which you transfer the amount to them (“Refund by”).»

### V-5 (Minor): Verwaltungspauschale «bis 3 %»

**Belege**
- `messages/de.json:98` «Üblich sind bis 3 %.»; `:1170` «Üblich sind bis 3 %; ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen.»
- `UBIQUITOUS_LANGUAGE.md:154`: «Üblich sind etwa 3 %. Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen (Art. 4 Abs. 3 VMWG).»
- Art. 4 Abs. 3 VMWG: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»

**Warum.** «Bis 3 %» macht aus einem üblichen Wert eine Obergrenze. Das Gesetz nennt keine Zahl; Praxisquellen nennen 3 % bis etwa 5 % (Suche: comparis «üblicherweise drei Prozent», WEKA «3–5 %», Mobiliar «um die 4 %», **unsicher**). Das Glossar sagt «etwa». In `glossary_fee_text` fehlt zudem der Satz zum höheren Satz, den das Glossar und `config_help_management_fee` haben.

**Ersatz `glossary_fee_text`**
- de: «Die Abgeltung Ihres Verwaltungsaufwands: ein Prozentsatz der eigenen Nebenkosten jedes Mieters. Nur zulässig, wenn im Mietvertrag vereinbart; das tragen Sie beim Mietvertrag ein. Üblich sind etwa 3 %; ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen. Den Satz wählen Sie beim Erstellen der Abrechnungen, ausser der Mietvertrag nennt einen eigenen.»
- fr: «La rémunération de votre travail de gestion : un pourcentage des frais accessoires propres à chaque locataire. Admis seulement s’ils sont convenus dans le contrat de bail ; vous l’enregistrez avec le contrat de bail dans Dwello. L’usage est d’environ 3 % ; un taux plus élevé doit correspondre à votre travail effectif. Vous choisissez le taux lors de l’établissement des décomptes, sauf si le contrat de bail en indique un propre.»
- it: «Il compenso per il suo lavoro di gestione: una percentuale delle spese accessorie proprie di ogni inquilino. Ammesse solo se pattuite nel contratto di locazione; lo registra presso il contratto di locazione. Di solito circa il 3 %; un’aliquota più alta deve corrispondere al suo onere effettivo. Sceglie la percentuale quando allestisce i conteggi, salvo che il contratto di locazione ne indichi una propria.»
- en: «The compensation for your management work: a percentage of each tenant’s own utility costs. Only allowed if agreed in the rental contract; you record that with the rental contract. About 3 % is usual; a higher rate must match your actual work. You choose the rate when you create the statements, unless the rental contract states its own.»

**Ersatz `config_help_management_fee`** (nur der Teilsatz, Rest bleibt)
- de: «Üblich sind bis 3 %» → «Üblich sind etwa 3 %»
- fr: «L’usage est de 3 % au maximum» → «L’usage est d’environ 3 %»
- it: «È usuale fino al 3 %» → «È usuale circa il 3 %»
- en: «Up to 3 % is usual» → «About 3 % is usual»

### V-6 (Minor): `glossary_balance_text` (it): «le viene rimborsata»

**Beleg.** `messages/it.json:104`: «… se è negativo, la differenza le viene rimborsata (rimborso).»
**Warum.** «Le» ist die Höflichkeitsform an den Leser, also den Vermieter. Gemeint ist der Mieter: «gli».
**Ersatz (nur it):** «La quota dei costi dell’inquilino, spese di gestione comprese, meno i suoi acconti versati, arrotondata a 5 centesimi. Se il saldo è positivo, l’inquilino paga la differenza (importo dovuto); se è negativo, la differenza gli viene rimborsata (rimborso).»
de, fr und en sind richtig. Nachgerechnet: Kosten 1'234.56 + 3 % Pauschale 37.04 = 1'271.60, Akonto 12 × 100.00 → Saldo 71.60 (Nachzahlung). Grenzfälle: 71.62 → 71.60; Rückerstattung −10.02 → kaufmännisch −10.00, zugunsten des Mieters (geplant #79) −10.05. «Auf 5 Rappen gerundet» stimmt für beide Rundungsarten.

### V-7 (Minor): neues `config_help_distribution_key` mit `settings_key_suggested`

**Belege.** `src/routes/config/DefaultsSection.svelte:93`: `${help.distributionKey} ${m.settings_key_suggested()}`; `messages/de.json:1200` «Dieser wird beim Erfassen neuer Rechnungen vorgeschlagen.»; fr «Elle est proposée …», it «Viene proposta …».
**Warum.** Der neue Text endet mit «… ohne ihn wird sie gleichmässig pro Wohnung verteilt.» Darauf folgt in den Einstellungen «Dieser wird … vorgeschlagen». Im Französischen und Italienischen ist dann die Rechnung («elle», «fattura») das nächstliegende weibliche Wort, nicht die Clé bzw. Chiave. Der Leser versteht womöglich, die Rechnung werde vorgeschlagen.
**Ersatz `settings_key_suggested`**
- de: «Der hier gewählte Verteilschlüssel wird beim Erfassen neuer Rechnungen vorgeschlagen.»
- fr: «La clé de répartition choisie ici est proposée lors de la saisie de nouvelles factures.»
- it: «La chiave di riparto scelta qui viene proposta quando registra nuove fatture.»
- en: «The distribution key chosen here is suggested when you add new invoices.»

### V-8 (Minor): `categories_translations` braucht einen Hilfetext

**Belege.** `src/routes/config/categories/CategoryForm.svelte:172–179` (Fieldset ohne Hilfe, drei optionale Felder); `backend/src/services/statement-pdf.service.ts:51–53`: «A category, key or profile in the PDF's language; Romansh and missing translations fall back to German»; `src/lib/names.ts:16` (Oberfläche in der UI-Sprache); `UBIQUITOUS_LANGUAGE.md:227` (Abrechnung in der Sprache des Mieters).
**Warum.** Wer eine eigene Kategorie anlegt, sieht drei leere Felder «Französisch / Italienisch / Englisch» und weiss nicht, wofür sie gut sind. Bleiben sie leer, steht auf der Abrechnung eines französischsprachigen Mieters die deutsche Kategorie. Für den Mieter ist die Abrechnung dann schwerer zu prüfen, und er fragt eher nach.
**Ersatz (neuer Schlüssel, z. B. `categories_translations_help`, sichtbar unter der Legende)**
- de: «Der Name der Kategorie auf Französisch, Italienisch und Englisch. Ihn zeigt die Nebenkostenabrechnung eines Mieters mit dieser Sprache, ebenso Dwello in dieser Sprache. Fehlt er, steht der deutsche Name.»
- fr: «Le nom de la catégorie en français, en italien et en anglais. Il figure sur le décompte des charges d’un locataire de cette langue, ainsi que dans Dwello dans cette langue. S’il manque, le nom allemand s’affiche.»
- it: «Il nome della categoria in francese, italiano e inglese. Figura sul conteggio spese accessorie di un inquilino di questa lingua e in Dwello in questa lingua. Se manca, appare il nome tedesco.»
- en: «The category’s name in French, Italian and English. The utility cost statement of a tenant with that language shows it, and so does Dwello in that language. Without it, the German name appears.»

### V-9 (Minor): neu «Manuell überschrieben»: «Manuell» bedeutet mehr

**Belege.** `src/lib/server/invoice.ts:44–51`: `return r.categoryId === r.llmCategoryId && !r.wasManuallyOverridden ? 'auto-categorized' : 'manual';` Eine Rechnung, deren Kategorie ohne Vorschlag der KI gewählt wurde (`llmCategoryId` leer), zeigt also ebenfalls «Manuell». `UBIQUITOUS_LANGUAGE.md:108–109`; `messages/de.json:792–793` («Grund der Änderung»).
**Warum.** Der Vorschlag stimmt in der einen Richtung: überschrieben → «Manuell». Wer aber «Manuell» bei einer Rechnung sieht, die die KI nie gesehen hat, sucht vergeblich eine Änderung. Das Glossar kennt zudem den «Grund der Änderung», den die Bearbeitung abfragt.
**Ersatz (de, neuer Text):** «Sie haben die Kategorie, die die KI für eine Rechnung vorgeschlagen hat, selbst geändert. Den Grund der Änderung können Sie beim Bearbeiten angeben. Die Rechnungsliste zeigt dann «Manuell», wie bei jeder Rechnung, deren Kategorie Sie selbst gewählt haben.»
Das Szenario (`help.feature:36`, «Manuell» in Guillemets) trifft weiterhin zu. Begriffe für die Übersetzung: «modifié manuellement / motif de la modification», «modificato manualmente / motivo della modifica», «manually overridden / reason for the change» (`i18n-begriffe.md:49`); Badge fr «Manuelle», it «Manuale», en «Manual».

### V-10 (Nit): `settings_iban_help` (Vorschlag) ohne Frist

**Belege.** Vorschlag in `proposed-texts.md`; PDF: «Wir überweisen Ihnen den Betrag bis {date}.» (`backend/src/services/pdf.service.ts`); `UBIQUITOUS_LANGUAGE.md:181`.
**Inhaltlich bestätigt:** Der Text sagt, wer die Rückerstattung überweist, und deckt sich mit dem PDF, das keinen Zahlteil hat und um die IBAN bittet. Er benutzt «Rückerstattung» (Glossar), nicht «Guthaben». Nur die Frist fehlt, die das PDF dem Mieter zusagt.
**Ersatz**
- de: «Konto, auf das Ihre Mieter Nachzahlungen überweisen; es steht auf der QR-Rechnung. Eine Rückerstattung überweisen Sie selbst bis zur Zahlungsfrist auf das Konto des Mieters; die Abrechnung bittet ihn, Ihnen seine IBAN mitzuteilen.»
- fr: «Compte sur lequel vos locataires versent les montants à payer ; il figure sur la QR-facture. Un remboursement, vous le versez vous-même sur le compte du locataire d’ici le délai de paiement ; le décompte lui demande de vous communiquer son IBAN.»
- it: «Conto su cui i suoi inquilini versano gli importi dovuti; figura sulla QR-fattura. Un rimborso lo versa Lei stesso sul conto dell’inquilino entro il termine di pagamento; il conteggio gli chiede di comunicarle il suo IBAN.»
- en: «Account to which your tenants transfer amounts due; it appears on the QR-bill. You transfer a refund yourself to the tenant’s account by the payment deadline; the statement asks the tenant to give you their IBAN.»

### V-11 (Nit): `categories_sort_order_help`

**Belege.** `backend/src/services/category.service.ts:65`: `.orderBy(asc(categories.sortOrder), asc(categories.name))`. Dieselbe Reihenfolge gilt für die Liste unter «Kategorien» (`src/routes/config/categories/+page.svelte`). Leer gespeichert ergibt 0 (`backend/src/db/schema.ts:161`). Die Reihenfolge der Abrechnungspositionen hängt nicht davon ab (`statement.service.ts:365`, `sortOrder: index`).
**Ersatz**
- de: «Position in den Auswahllisten und in der Liste der Kategorien: kleinere Zahlen stehen weiter oben, bei gleicher Zahl entscheidet der Name.»
- fr: «Position dans les listes de choix et dans la liste des catégories : les petits nombres figurent plus haut ; à nombre égal, le nom décide.»
- it: «Posizione negli elenchi di scelta e nell’elenco delle categorie: i numeri più piccoli stanno più in alto; a numero uguale decide il nome.»
- en: «Position in the selection lists and in the list of categories: smaller numbers appear higher up; with the same number, the name decides.»

### V-12 (Nit): `config_help_accounting_period`: «z. B.»

**Beleg.** `messages/de.json:1171`. Inhalt bestätigt (`UBIQUITOUS_LANGUAGE.md:150`, drei Werte der Einstellung).
**Ersatz:** de «z. B.» → «zum Beispiel»; fr «p. ex.» → «par exemple»; it «p. es.» → «per esempio»; en «e.g.» → «for example». Der Rest bleibt.

### V-13 (Nit): neu «Kündigungsfrist»: Ausnahmen

**Belege.** Vorschlag in `proposed-texts.md`; Art. 266a Abs. 2 OR: «Halten die Parteien die Frist oder den Termin nicht ein, so gilt die Kündigung für den nächstmöglichen Termin.»; Art. 266c OR (siehe M-4); Art. 257d Abs. 2 OR («mit einer Frist von mindestens 30 Tagen auf Ende eines Monats»); Art. 264 Abs. 1 OR (Ersatzmieter); `messages/de.json:1431` `contracts_notice_period_short` («Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag, oder Sie haben das Ende mit dem Mieter vereinbart.»).
**Inhalt bestätigt:** mindestens 3 Monate, länger nach Vertrag, zu späte Kündigung auf den nächsten Termin, andere Fristen bei ausserordentlicher Kündigung.
**Vorschlag (optional), als letzter Satz anfügen (de):** «Früher endet der Mietvertrag nur, wenn Sie das Ende mit dem Mieter vereinbaren oder ein Ersatzmieter ihn übernimmt.»

---

## Bestätigt (mit Quelle)

- **`glossary_period_text` (Vorschlag, gleich wie PR #289):** stimmt mit `docs/nebenkostenabrechnung-anforderungen.md:141` (Regel 1) und `UBIQUITOUS_LANGUAGE.md:158` (Abgerechnete Tage) überein. Nachgerechnet: Rechnung CHF 1'200.00, Leistungszeitraum 01.11.2025–31.01.2026 (92 Tage), Periode Kalenderjahr 2025 → 61 Tage → 795.65 (wie das Beispiel in den Anforderungen). Grenzfall: Leistungszeitraum ganz ausserhalb → 0.00. Ohne Leistungszeitraum mit Rechnungsdatum 15.12.2025 → ganz in der Periode 2025. Kein Befund.
- **`config_help_distribution_key` (Vorschlag):** wörtlich Regel 3 (`nebenkostenabrechnung-anforderungen.md:143`) und Glossar «Gleichmässig pro Wohnung» (`UBIQUITOUS_LANGUAGE.md:123`). Kein Befund ausser V-7 (Zusammenspiel mit `settings_key_suggested`).
- **Kündigungsfrist (Vorschlag):** Art. 266a, 266c, 257d OR und `UBIQUITOUS_LANGUAGE.md:41` (siehe V-13).
- **Befristet / Unbefristet, erster und letzter Satz:** Art. 266 Abs. 1 OR.
- **`glossary_advance_text`:** `UBIQUITOUS_LANGUAGE.md:50`.
- **`glossary_net_rent_text`:** `UBIQUITOUS_LANGUAGE.md:48`; Art. 257 OR: «Der Mietzins ist das Entgelt, das der Mieter dem Vermieter für die Überlassung der Sache schuldet.»
- **`glossary_additional_rent_text`:** `UBIQUITOUS_LANGUAGE.md:49`.
- **`glossary_key_text`:** `UBIQUITOUS_LANGUAGE.md:117–121`.
- **`glossary_balance_text`** (de, fr, en): `UBIQUITOUS_LANGUAGE.md:156`; Rechnung siehe V-6.
- **`glossary_channel_text`:** `UBIQUITOUS_LANGUAGE.md:25`; Vorgabe Brief (`backend/src/db/schema.ts:96`).
- **`config_help_heating_profile`:** `UBIQUITOUS_LANGUAGE.md:132, 160`; Regel 5.
- **`config_help_management_fee`** (ausser V-5): Art. 257a Abs. 2 OR, Art. 4 Abs. 3 VMWG; 10 % in `backend/src/services/config.service.ts:35` und `backend/src/routes/statements.ts:35`.
- **`config_help_accounting_period`** (ausser V-12): `UBIQUITOUS_LANGUAGE.md:150`.
- **Inhaltsverzeichnis «Inhalt»:** fachlich ohne Befund.

## Fehlende Begriffe (Product Owner; Issue mit Labels `fachlich`, `entscheiden`)

1. **«Leerstand»** steht in `glossary_days_text` (heute), in `i18n-begriffe.md:64` und in den Anforderungen, aber nicht in `UBIQUITOUS_LANGUAGE.md`. Vorschlag: «**Leerstand**: Zeit, in der eine Wohnung keinen laufenden Mietvertrag hat. Den Anteil der Nebenkosten dafür trägt der Vermieter (für Heizkosten Art. 7 Abs. 1 VMWG); die Ausnahme von Art. 7 Abs. 2 VMWG setzt Dwello nicht um (#188).» Bis dahin vermeidet der Ersatz in V-2 das Wort.
2. **Glossarzeile «Befristet / Unbefristet»** (`UBIQUITOUS_LANGUAGE.md:38`, siehe M-3). Vorschlag: «… bleibt der Mieter danach und lässt ihn der Vermieter bleiben, ohne zu widersprechen, gilt er als unbefristet (stillschweigende Fortsetzung, Art. 266 Abs. 2 OR).»
3. **«Kündigungsfrist» fehlt in `docs/design/i18n-begriffe.md`**, und die Zeile «Kündigungstermin» ist mit ❓ markiert. Die App sagt heute fr «délai de résiliation» / «terme de résiliation», it «termine di disdetta» / «scadenza di disdetta», en «notice period» / «termination date» (`messages/*.json:1428, 1431`). Fedlex: fr Art. 266a «les délais de congé et les termes légaux», Abs. 2 «le délai ou le terme de congé»; it Art. 266a «i termini legali di preavviso e le scadenze di disdetta». Vorschlag: für diese Änderung die Wörter der App verwenden (fr «délai de résiliation», it «termine di disdetta», en «notice period»), damit die Hilfe zu den Vertragsseiten passt. Ob auf die Fedlex-Begriffe («délai de congé», «termine di preavviso») gewechselt wird, entscheidet der Product Owner im bestehenden Punkt #83 (F-20a) oder in einem eigenen Issue.

## Nicht bestätigt

- **Rechtsprechung zur stillschweigenden Fortsetzung** (M-3): wie schnell der Vermieter widersprechen muss. Nur Art. 266 OR auf Fedlex gelesen; BGE nicht gesucht.
- **Rechtsfolge einer Kündigung ohne Fristansetzung nach Art. 257d OR** (M-2): nur der Gesetzestext ist belegt.
- **Üblicher Satz der Verwaltungspauschale** (V-5): Fedlex nennt keine Zahl. Die Praxiswerte (3 %, 3–5 %, um 4 %) stammen aus Suchtreffern (comparis, WEKA, Mobiliar), die ich nicht im Volltext gelesen habe.
- **Leerstand bei anderen Kosten als Heizung:** Nur Art. 7 VMWG regelt die Heizkosten. Für die übrigen Kosten führen die Anforderungen die Regel als unsicher-B (`nebenkostenabrechnung-anforderungen.md:70`); die Dwello-Regel (#188) habe ich nur gegen die Anforderungen geprüft.
- **Fallback nach Art. 266c OR «Ende einer dreimonatigen Mietdauer»**, wenn es keinen Ortsgebrauch gibt: In M-4 bewusst weggelassen (zu fein für die Hilfe). Ob der Product Owner das in der Hilfe will, ist offen.
- **PR #289** habe ich nicht gelesen. Den Wortlaut von `glossary_period_text` habe ich aus `proposed-texts.md` und dem Test (`help-page.dom.test.ts`) genommen.
- **Nicht im Umfang:** die Schritttexte `help_*` der Hilfeseite (nur auf Widersprüche zu den Glossartexten überflogen: `help_invoices_2` «Nur Rechnungen umlagefähiger Kategorien fliessen … ein» passt zu M-1). `glossary_status_text` («Wiedervermietet» statt Glossar «Vermietet ab {Datum}», `UBIQUITOUS_LANGUAGE.md:22`) gehört zu #58. `settings_error_iban` und die IBAN-Prüfung gehören zu #191.
- **fr/it/en der neuen Texte von #109 und #67:** Laut Auftrag folgen sie nach diesem Review. Ich habe nur die Begriffe genannt (M-3, V-9, «Fehlende Begriffe» 3).
