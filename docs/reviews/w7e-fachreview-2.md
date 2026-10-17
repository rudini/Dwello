# Fachreview 2: Protokoll unter «Einstellungen» (#357), Umsetzung

Gegenstand: Diff f900e5b..27203ee im Worktree `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/review-audit-fach2`. Geprüft wurde, ob die Befunde aus Runde 1 (`docs/reviews/w7e-fachreview-1.md`) behoben sind, dazu alle `audit_*`-Texte in `messages/{de,fr,it,en}.json`, die Eintragstexte aus `src/lib/server/audit-log.ts`, der Absatz in der Datenschutzerklärung und die PRD-Zeilen. Alle Pfade beziehen sich auf diesen Worktree.

## Ergebnis

Kein Blocker, kein Major. R-1, R-2, R-3 und V-1, V-3 bis V-9 sind behoben, V-2 ist im Wesentlichen behoben. Neu: drei Minor und sechs Nit.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-10 | Verwalter | Minor | «Kategorie … von nicht umlagefähig auf umlagefähig geändert» sagt nicht, dass die zuvor ausgeschlossenen Rechnungen nicht umlagefähig bleiben (Antwort auf die Frage: kein Major) |
| V-11 | Verwalter | Minor | Eine Rechnung, die durch eine neue Kategorie (Formular oder KI) nicht mehr umlagefähig ist, heisst im Protokoll «als nicht umlagefähig markiert», ohne Grund |
| V-12 | Verwalter | Minor | «Zahlung der Abrechnung NK-… vom 10.03.2026 zurückgesetzt»: «vom …» lässt sich auf die Abrechnung beziehen, nicht auf die Zahlung |
| V-13 | Verwalter | Nit | Die Löschbestätigung nennt das Datum nicht (gleich lautende Anmeldungen), und «Die Änderung selbst bleibt bestehen» passt nicht zu einer Anmeldung |
| V-14 | Verwalter | Nit | Der Kategorieeintrag nennt nur die Anzahl der ausgeschlossenen Rechnungen, nicht ihre Summe; PRD Z. 1023 klingt, als würde jede Rechnung einzeln aufgeführt |
| V-15 | Verwalter | Nit | Der Satz der Pauschale wird ungekürzt angezeigt; ein Wert, der am Formular vorbei gespeichert wird («4.250»), erscheint als «4.250 %» |
| R-4 | Rechtstexte | Nit | `audit_privacy` nennt nicht, dass ein Eintrag zur zurückgesetzten Zahlung die Abrechnungsnummer festhält und auch bleibt, wenn die Abrechnung gelöscht wird. Mit #358 kommen die berichtigten Abrechnungen dazu |
| R-5 | Rechtstexte | Nit | `audit_privacy_demo` sagt nicht, dass Besucher die Einträge anderer auch löschen können |
| V-16 | Verwalter | Nit | Sprache: de «ohne Name» (richtig «ohne Namen»), en «e-mail» (Glossar: «email»), it «lei» klein (Stil: «Lei») |

Mietrecht (M): kein Befund, wie in Runde 1. Das Protokoll wird dem Mieter weder gezeigt noch zugestellt und ändert keinen Betrag.

---

## Prüfung der Befunde aus Runde 1

| Runde 1 | Status | Beleg |
|---|---|---|
| V-1 (Major) | **behoben** | Kategorie: `backend/src/services/category.service.ts:178-201`, Eintrag in derselben Transaktion, nur wenn sich die Umlagefähigkeit tatsächlich ändert (`before.allocable !== category.isAllowedUtilityCost`), mit der Anzahl der dabei ausgeschlossenen Rechnungen (`returning`, gezählt werden nur die bisher umlagefähigen). Formular: `invoice.service.ts:342` `recordAllocability(existing, …)` nach `applyCategory`. KI: `invoice.service.ts:470`. Eine schon als nicht umlagefähig erfasste Rechnung bekommt keinen Eintrag, weil `createInvoice` nichts protokolliert. Das ist richtig, denn sie war nie in einer Abrechnung. Tests: `audit-log.pg.test.ts:99, 139, 151`. Weitere Schreibstellen für `isValidUtilityCost` gibt es nicht (gesucht in `backend/src`). Der Wortlaut ist unter V-11 behandelt. |
| R-1 (Major) | **behoben** | `messages/de.json` `audit_privacy` nennt Rechnungssteller, Beschreibung, Datum, Betrag und Gebäude und sagt: «Die Einträge bleiben, auch wenn Sie die Rechnung löschen, bis Sie sie im Protokoll löschen.» Der Satz in `privacy_stored_1` über die Belege bleibt richtig, weil das Protokoll keine Datei speichert. Die Pflicht zur Information über den Zweck (DSG Art. 19 Abs. 2 lit. b, Wortlaut in Runde 1) ist erfüllt: «Damit Sie später nachvollziehen können, was sich geändert hat». |
| R-2 (Major) | **behoben** | Der Absatz steht unter «Welche Daten Dwello speichert» (`src/routes/privacy/+page.svelte:23`), nicht unter «Anmeldung», und schliesst mit «Das Protokoll des Servers (siehe «Anmeldung») ist davon getrennt.». Die Anmeldung wird «ohne Name und E-Mail-Adresse» festgehalten. Das stimmt mit dem Code überein: Gespeichert wird nur `provider` (`backend/src/routes/audit-log.ts:17-25`, `src/lib/server/login-flow.ts:57-72`), und nur nach einem erfolgreichen Callback (`src/routes/auth/callback/+server.ts:61`), nicht bei `auth/refresh`. In fr/it/en verweist der Text auf «Connexion», «Accesso» und «Sign-in», so wie `privacy_login_title` jeweils heisst. Szenario: `privacy.feature:33-36`. |
| V-2 (Minor) | **im Wesentlichen behoben** | `audit_delete_text` nennt den Eintrag und «Die Änderung selbst bleibt bestehen.» (`settings.feature:92`). Der Rest steht unter V-13. |
| V-3 (Minor) | **behoben** | `statement.service.ts:533`: gespeichert werden nur Nummer und Zahlungsdatum, kein Betrag und damit kein Vorzeichen. Für den Fall ohne Datum gibt es `audit_payment_reset_undated`. Nachgerechnet: Nachzahlung, bezahlt am 10.03.2026, ergibt «Zahlung der Abrechnung NK-2025-0007 vom 10.03.2026 zurückgesetzt». Bei einer Rückerstattung entsteht derselbe Text, ebenfalls ohne «CHF -85.00». Ohne Datum: «Zahlung der Abrechnung NK-2025-0007 zurückgesetzt». Das Wort «Zahlung» auch für die Rückerstattung entspricht dem Verlauf (`statements_history_payment_reset` «Zahlung vom {date} zurückgesetzt»). Die Wortstellung ist unter V-12 behandelt. |
| V-4 (Minor) | **behoben** | `audit-log.service.ts:74-84` `recordStatementCorrection(replaced, replacement)`; `audit_statement_corrected` «Abrechnung {number} durch die berichtigte Abrechnung {replacement} ersetzt» entspricht Glossar Z. 161 und 173. fr «décompte rectifié», it «conteggio rettificato» und en «corrected statement» entsprechen der Mehrheit der bestehenden Texte. |
| V-5 (Minor) | **behoben** | `config.service.ts:208-212, 268-276`: numerischer Vergleich, ohne gespeicherten Wert gilt die Vorgabe 3 als alter Wert, und das Zurücksetzen (Feld geleert, `DELETE`) wird festgehalten. Nachgerechnet: nichts gespeichert, neu 4 ergibt «von 3 % auf 4 %». Gespeichert 3, Formular mit 3 ergibt keinen Eintrag. Gespeichert 4, Feld geleert ergibt «von 4 % auf 3 %». Gespeichert 3, Feld geleert ergibt keinen Eintrag. Neu 0 ergibt «von 3 % auf 0 %». Neu «3,5» ergibt «3.5», weil das Formular mit `String(parsePercent(…))` normalisiert (`src/lib/server/settings.ts:74`). «Vorgeschlagene Verwaltungspauschale» passt zum Glossar Z. 217 («Satz, den der Abrechnungslauf vorschlägt»). Tests: `audit-log.pg.test.ts:44-79`, `audit-log-mapping.test.ts:57`. |
| V-6 (Minor) | **behoben** | Rechnungsdatum und Gebäude stehen im Snapshot (`invoice.service.ts:348-357`) und im Text. Alle Felder sind `notNull` (`schema.ts:244-257`), deshalb kann weder «von null» noch «(undefined)» entstehen. Nachgerechnet: «Rechnung «Treppenhausreinigung» von Hauswart Meier vom 31.03.2026 über CHF 450.00 (Lindenhof): als nicht umlagefähig markiert» (`settings.feature:84`). Bei 1800.00 erscheint «CHF 1’800.00» (`formatCurrency`). Ein negativer Betrag kommt nicht vor, weil Gutschriften vom Rechnungsbetrag abgezogen werden (Glossar Z. 70). |
| V-7 (Minor) | **behoben** | PRD Z. 486, 766, 1023, 1251, 1264-1267, 1550 und 1710 beschreiben, was gebaut ist. «Retention: 1 year» ist gestrichen, und «Not part of the decision: other invoice changes, statement generation, failed access attempts» ist ergänzt. Das Überschreiben der KI-Kategorie wird nicht mehr als Eintrag genannt. Die Korrektur versendeter Abrechnungen ist richtig mit «(#358)» gekennzeichnet. Zu Z. 1023 siehe V-14. |
| V-8 (Nit) | **behoben** | «von umlagefähig auf nicht umlagefähig geändert» bzw. «von nicht umlagefähig auf umlagefähig geändert». Der Hinweis zu den Rechnungen ist nicht übernommen, siehe V-10. |
| V-9 (Nit) | **behoben** | Der Text wird beim Anzeigen gebildet (`src/lib/server/audit-log.ts:19-49`). Der Kategoriename kommt über `localName` mit allen vier Namen aus dem Snapshot (`category.service.ts:192-196`). |
| R-3 (Minor) | **behoben** | `audit_privacy_demo` als eigener Absatz in der Demo (`privacy/+page.svelte:72`). Dass der nächtliche Neuaufbau das Protokoll leert, deckt `privacy_demo_1` ab («jede Nacht werden alle Änderungen gelöscht»). Den Rest siehe R-5. |

---

## V-10 (Minor): Kategorie wieder umlagefähig, die Rechnungen bleiben ausgeschlossen

**Beleg**
- `category.service.ts:189-191`: Die Kaskade läuft nur in Richtung `false`. Wird die Kategorie wieder umlagefähig, bleiben ihre Rechnungen `isValidUtilityCost: false`.
- `messages/de.json`: `audit_category_excluded_invoices` sagt «…; 4 Rechnungen sind damit nicht mehr umlagefähig», das Gegenstück `audit_category_included` sagt nur «Kategorie «{name}»: von nicht umlagefähig auf umlagefähig geändert».
- Das Kategorieformular sagt ebenfalls nichts darüber (`categories_allocable_yes` «Die Kosten fliessen in die Nebenkostenabrechnung.»).

**Nachgerechnet.** «Hauswart» mit 4 umlagefähigen Rechnungen über CHF 1’800.00 wird nicht umlagefähig. Der Eintrag lautet «…; 4 Rechnungen sind damit nicht mehr umlagefähig». Danach wird die Kategorie wieder umlagefähig, und der Eintrag lautet «… von nicht umlagefähig auf umlagefähig geändert». Die 4 Rechnungen bleiben trotzdem aus der nächsten Abrechnung draussen. Wer die beiden Einträge untereinander liest, erwartet die 4 Rechnungen wieder in der Abrechnung, weil der Text spiegelbildlich gebaut ist.

**Schwere: Minor, kein Major.** Der Eintrag ist wahr, denn er beschreibt die Kategorie. Der Fehler geht zulasten des Vermieters (CHF 1’800.00 nicht weiterverrechnet), nicht des Mieters, und ist mietrechtlich unbedenklich. Weniger umzulegen ist nie unzulässig. Ursache ist ein Verhalten, das schon auf dem Basis-Commit besteht und das das Kategorieformular ebenfalls verschweigt. Das Protokoll macht es nicht falscher, nur sichtbarer.

**Korrektur.** Beim Wechsel auf umlagefähig die Anzahl der Rechnungen der Kategorie speichern, die nicht umlagefähig sind, und bei mehr als 0 diesen Text verwenden: «Kategorie «Hauswart»: von nicht umlagefähig auf umlagefähig geändert; 4 Rechnungen bleiben nicht umlagefähig, bis Sie sie wieder als umlagefähig markieren» (Einzahl entsprechend, in allen vier Sprachen). Wie beim Formular braucht es dafür ein Issue (`fachlich`). Dort soll auch derselbe Hinweis am Schalter «Umlagefähige Nebenkosten» im Kategorieformular festgehalten werden.

## V-11 (Minor): «als nicht umlagefähig markiert» auch ohne Klick des Verwalters

**Beleg:** `audit-log.ts:31-39` wählt `audit_invoice_excluded` («…: als nicht umlagefähig markiert») für alle drei Wege. Dazu gehören der Wechsel in eine nicht umlagefähige Kategorie (`audit-log.pg.test.ts:139`) und die KI (`audit-log.pg.test.ts:151`). Der Snapshot enthält keinen Grund. In Runde 1 (V-1) wurde ein Grund vorgeschlagen: «…: nicht mehr umlagefähig (Kategorie «Reparaturen»)».

**Warum.** Wer herausfinden will, warum eine Rechnung fehlt, liest «markiert» und meint, er habe sie selbst ausgeschlossen. Bei der KI stimmt das nicht. Beim Kategoriewechsel hat er zwar geklickt, aber auf etwas anderes, nämlich die Kategorie.

**Korrektur:** Im Snapshot die neue Kategorie speichern, wenn sie der Grund ist (alle vier Namen wie bei V-9). Text dann: «Rechnung «…» von … vom … über … (…): mit der Kategorie «Reparaturen» nicht mehr umlagefähig». Den Text «als nicht umlagefähig markiert» nur verwenden, wenn die Kategorie umlagefähig ist.

## V-12 (Minor): Bezug von «vom …» im Eintrag zur Zahlung

**Beleg:** `audit_payment_reset` «Zahlung der Abrechnung {number} vom {date} zurückgesetzt». Nachgerechnet: «Zahlung der Abrechnung NK-2025-0007 vom 10.03.2026 zurückgesetzt».

**Warum.** Im Deutschen hängt «vom 10.03.2026» am nächststehenden Nomen, also an der Abrechnung. Ein Laie liest daraus das Datum der Abrechnung, nicht das Zahlungsdatum. Im Verlauf der Abrechnung (`statements_history_payment_reset`) fehlt das Nomen dazwischen, deshalb ist es dort eindeutig. In fr, it und en stimmt die Wortstellung schon («Paiement du {date} du décompte {number} retiré», «Payment of {date} on statement {number} reset»).

**Korrektur:** «Zahlung vom {date} zur Abrechnung {number} zurückgesetzt», ohne Datum «Zahlung zur Abrechnung {number} zurückgesetzt».

## V-13 (Nit): Löschbestätigung

`audit_delete_text` nennt das Datum nicht. Bei mehreren «Anmeldung mit Google» sind die Bestätigungen gleich. Der Dialog öffnet sich aber aus der Zeile, deshalb ist das nur ein Nit. «Die Änderung selbst bleibt bestehen» passt nicht zu einer Anmeldung. Vorschlag: «Dieser Eintrag vom {when} wird endgültig aus dem Protokoll gelöscht: {text}. Was er festhält, bleibt bestehen. Das lässt sich nicht rückgängig machen.» Die beiden Doppelpunkte in «gelöscht: Kategorie «…»: von …» lesen sich holprig; das löst der Vorschlag nicht, ist aber hinnehmbar.

## V-14 (Nit): Summe beim Kategorieeintrag, PRD Z. 1023

Runde 1 schlug Anzahl und Summe vor («4 Rechnungen über CHF 1’800.00»). Umgesetzt ist nur die Anzahl. Das genügt, um den Ausschluss zu finden, die Summe würde die Folge für die Abrechnung zeigen. PRD Z. 1023 «lists each invoice that becomes not allocable …, also through its category» kann man so lesen, dass beim Wechsel der Kategorie jede Rechnung einzeln erscheint. Tatsächlich erscheint nur die Anzahl. Vorschlag: «… also when it is moved to a non-allocable category or by the KI; a category that becomes not allocable is listed with the number of invoices it excluded».

## V-15 (Nit): Anzeige des Satzes

`audit-log.ts:21` zeigt `from`/`to` als gespeicherten Text. Über das Formular ist der Wert normalisiert. Ein `PUT /api/v1/config` mit «4.250» würde aber «von 3 % auf 4.250 %» ergeben (der Kommentar in `config.service.ts:208` nennt diesen Fall selbst). Abhilfe: in `audit-log.ts` mit `normalizeDecimal` (`src/lib/utils/format.ts:19`) anzeigen.

## R-4 (Nit): Datenschutzerklärung, Abrechnungsnummer und berichtigte Abrechnungen

`audit_privacy` nennt «zurückgesetzte Zahlungen» ohne Inhalt. Der Eintrag hält die Abrechnungsnummer und das Zahlungsdatum fest (`statement.service.ts:533`) und bleibt auch, wenn die Abrechnung gelöscht wird. Die Nummer verweist auf einen Mieter, enthält aber keinen Namen. Nach dem Löschen der Abrechnung lässt sie sich in der App keinem Mieter mehr zuordnen, deshalb nur ein Nit. Vorschlag: «… sowie zurückgesetzte Zahlungen (mit Abrechnungsnummer und Zahlungsdatum). Die Einträge bleiben, auch wenn Sie die Rechnung oder die Abrechnung löschen, …». Wenn #358 `recordStatementCorrection` aufruft, muss der Absatz die berichtigten Abrechnungen nennen. Bitte in #358 vermerken.

## R-5 (Nit): Demo, Löschen fremder Einträge

`audit_privacy_demo` «sehen alle Besucher das Protokoll mit den Anmeldungen der anderen». Besucher können diese Einträge aber auch löschen (`audit-log.ts` DELETE ohne Einschränkung). Vorschlag: «… sehen und löschen alle Besucher die Einträge im Protokoll, auch die Anmeldungen der anderen, ohne Namen und E-Mail-Adresse.»

## V-16 (Nit): Sprache

- de: «ohne Name und E-Mail-Adresse» in `audit_privacy` und `audit_privacy_demo`; «ohne» verlangt den Akkusativ: «ohne Namen und E-Mail-Adresse». (Der Fehler stand schon in meinem Vorschlag aus Runde 1.) Das Szenario `privacy.feature:34` prüft den Text und muss mit angepasst werden.
- en: «e-mail address» in `audit_privacy` und `audit_privacy_demo`; `docs/design/i18n-begriffe.md:24` und die übrigen Texte (25 Mal) schreiben «email».
- it: «Affinché lei possa» in `audit_privacy`; `i18n-begriffe.md:5` schreibt «formal address (vous, Lei)», und die bestehenden Texte schreiben das Pronomen gross («Lei verifica», «Lei sceglie»).
- en `audit_privacy`: «invoices that are no longer or again allocable» liest sich holprig, besser «invoices that stop being allocable or become allocable again».

---

## Bestätigt

- **Begriffe** (Glossar und `i18n-begriffe.md`): Verwaltungspauschale/frais de gestion/spese di gestione/management fee (Z. 63); Rechnungssteller, in der Datenschutzerklärung émetteur, emittente, invoice issuer (Z. 41); Gebäude als immeuble, immobile (Z. 9); Abrechnung als décompte, conteggio, statement (Z. 57); Rechnung als facture, fattura (Z. 37). «Umlagefähig» als imputable, addebitabile, allocable ist dort noch mit ❓ markiert (Z. 46); die neuen Texte verwenden dieselben Wörter wie die bestehenden (`categories_allocable`). «retiré» und «rimosso» entsprechen `statements_history_payment_reset`. Einstellungen als Paramètres, Impostazioni, Settings entspricht `nav_settings`. «Journal», «Registro» und «Log» stehen neben «journal du serveur», «registro del server» und «server log». Die Datenschutzerklärung trennt die beiden ausdrücklich. Der Begriff selbst bleibt offen in #370 (Marker `src/routes/config/audit-log/+page.svelte:10`, `settings.feature:71`).
- **Französische Typografie:** In allen `audit_*` steht vor «:», «;» und «?» und innerhalb von «» ein geschütztes Leerzeichen, wie in den übrigen Texten.
- **Datensparsamkeit beim Anmeldeeintrag** (DSG Art. 6 Abs. 2, Art. 7 Abs. 3, Wortlaut in Runde 1): nur der Anbieter, als Union `google`/`microsoft` geprüft (`audit-log.pg.test.ts:221`).
- **Keine Mieternamen** in den Snapshots.
- **Aufbewahrung:** Ein Eintrag bleibt, bis der Verwalter ihn löscht (`deleteAuditEntry`, eine Bestätigung pro Eintrag); das sagen `audit_purpose` und `audit_privacy`, und die PRD stimmt damit überein.
- **Formeln:** Es gibt keine Betragsformel. Nachgerechnet sind der alte und der neue Satz der Pauschale (V-5, fünf Fälle), die Anzahl der Rechnungen in der Kaskade (0, 1, 4: `audit-log-mapping.test.ts:43`, `audit-log.pg.test.ts:99`), die Zahlung bei Nachzahlung, Rückerstattung und fehlendem Datum (V-3) und das Betragsformat ab 1’000 (V-6).

## Fehlende Begriffe

- **Protokoll:** weiter #370 (Vorschlag in Runde 1). Für #370 ergänzen: fr/it/en «Journal», «Registro» und «Log» stehen neben «journal du serveur», «registro del server» und «server log». Die Begriffe in `i18n-begriffe.md` mit festhalten.
- Für V-10 kein neuer Begriff, aber ein Issue (`fachlich`): Hinweis am Kategorieschalter und im Protokoll, dass Rechnungen beim Wechsel auf umlagefähig nicht umlagefähig bleiben.

## Nicht bestätigt

- **Rechtsquellen:** Die DSG-Zitate (Art. 5 lit. a, Art. 6 Abs. 2–4, Art. 7 Abs. 3, Art. 19 Abs. 1/2, Art. 20 Abs. 1 lit. a) stammen aus Runde 1 (Fedlex-Filestore, SR 235.1, Fassung 01.09.2023). In dieser Runde habe ich sie nicht erneut abgerufen; der Absatz ändert an ihrer Anwendung nichts.
- **Ob ein Zeitpunkt mit Anbieter in der Demo eine Personendate ist** (Art. 5 lit. a «bestimmbar»): weiterhin **unsicher**, wie in Runde 1.
- **Atomarität des Rechnungseintrags:** `recordAllocability` schreibt nach dem Update und ausserhalb einer Transaktion (`invoice.service.ts:342, 470`). Schlägt das Schreiben fehl, bleibt die Rechnung ohne Eintrag ausgeschlossen. Das gehört zum `code-reviewer` und ist fachlich nicht bewertet.
- **Gelöschte umlagefähige Rechnung:** Auch sie fällt aus der Abrechnung, bekommt aber keinen Eintrag. Laut PRD Z. 1267 («other invoice changes … not part of the decision») gehört sie nicht zum Entscheid; ob das so bleiben soll, entscheidet der Product Owner.
- **Testname** `audit-log.pg.test.ts:168` «… mit dem Zahlungsdatum und dem Betrag fest» nennt noch den Betrag, den es seit V-3 nicht mehr gibt. Das gehört zum `code-reviewer`.
- **Ob die Demo-Daten beim Laden schon Protokolleinträge erzeugen** (Seed über `updateCategory` oder `setConfig`): nicht geprüft.
- **Offene Issues zu V-10:** in GitHub nicht gesucht (kein Zugriff in dieser Rolle); bitte vor dem Anlegen `search_issues` ausführen.
