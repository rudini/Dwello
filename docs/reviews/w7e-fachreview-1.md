# Fachreview 1: Protokoll unter «Einstellungen» (#357)

Gegenstand: `@wip`-Szenarien am Ende von `tests/e2e/features/settings.feature` (Zeilen 67–96) und das neue Beispiel in `tests/e2e/features/breadcrumb.feature` (Zeilen 45–49), Commit f8edd45 (Diff f900e5b..f8edd45), dazu die geplante Umsetzung aus dem Auftrag (Eintragstexte, Anmeldeeintrag, Snapshots, Löschbestätigung, Satz in der Datenschutzerklärung). Alle Dateiangaben beziehen sich auf den Review-Worktree `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/review-audit-fach`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Rechnungen, die ohne eigenen Klick nicht mehr umlagefähig werden (Kategorie wird nicht umlagefähig, Rechnung kommt in eine nicht umlagefähige Kategorie, KI-Kategorisierung), bekommen keinen Eintrag |
| R-1 | Rechtstexte | Major | Snapshots (Rechnungssteller, Beschreibung, Betrag) bleiben nach dem Löschen der Rechnung erhalten; die Datenschutzerklärung sagt, dass die Daten mit der Rechnung gelöscht werden, und der geplante Satz nennt nur die Anmeldungen |
| R-2 | Rechtstexte | Major | Der geplante Satz kollidiert mit «Protokoll des Servers» (`privacy_login_1`, `privacy_demo_1`) und nennt keinen Zweck |
| V-2 | Verwalter | Minor | Die Löschbestätigung nennt weder den Eintrag noch die Tatsache, dass die Änderung selbst bestehen bleibt |
| V-3 | Verwalter | Minor | Ein zurückgesetzter Zahlungseintrag einer Rückerstattung würde «bezahlt am …, CHF -85.00» sagen |
| V-4 | Verwalter | Minor | «Abrechnung <Nummer> korrigiert» weicht vom Glossar ab («Berichtigte Abrechnung», «Ersetzt») |
| V-5 | Verwalter | Minor | Eintrag zur Verwaltungspauschale: Randfälle (gleicher Satz, «3.0» gegen «3», Standardwert, 0 %) und Bedeutung als vorgeschlagener Satz sind nicht geregelt |
| V-6 | Verwalter | Minor | Ein Rechnungseintrag lässt sich bei wiederkehrenden Rechnungen nicht eindeutig zuordnen (Rechnungsdatum und Gebäude fehlen) |
| V-7 | Verwalter | Minor | PRD-Zeilen 766 und 1264–1268 widersprechen dem Entscheid oder werden nicht umgesetzt (KI-Kategorie überschrieben, fehlgeschlagene Zugriffe, «Retention: 1 year») |
| R-3 | Rechtstexte | Minor | Demo-Installation: alle Besucher sehen die Anmeldungen der anderen und können Einträge löschen; `privacy_demo_1` sagt das nicht |
| V-8 | Verwalter | Nit | «jetzt nicht umlagefähig» stimmt nicht mehr, sobald die Kategorie später wieder geändert wird |
| V-9 | Verwalter | Nit | Einträge in fr/it/en: Text und Kategoriename müssen beim Anzeigen pro Sprache gebildet werden, nicht als deutscher Text gespeichert |

Mietrecht (M): kein Befund. Das Protokoll ist ein internes Hilfsmittel des Vermieters; es wird dem Mieter weder gezeigt noch zugestellt und ändert keinen Betrag einer Abrechnung. Dass keine Mieternamen gespeichert werden, ist richtig (siehe «Bestätigt»).

---

## V-1 (Major): stille Ausschlüsse von Rechnungen fehlen im Protokoll

**Beleg**
- `backend/src/services/category.service.ts:185-188`: wird eine Kategorie nicht umlagefähig, setzt `updateCategory` alle ihre Rechnungen auf `isValidUtilityCost: false` («Costs no longer allocable leave its invoices too … (OR 257a)»).
- `backend/src/services/invoice.service.ts:226-232` (`applyCategory`): eine Rechnung, die in eine nicht umlagefähige Kategorie kommt, wird nicht umlagefähig.
- `backend/src/services/invoice.service.ts:438-443`: eine sichere KI-Kategorisierung in eine nicht umlagefähige Kategorie macht die Rechnung nicht umlagefähig.
- Entscheid #111/#357: «excluded costs (an invoice excluded from statements)»; PRD `docs/PRD-Dwello.md:1023`: «Audit log shows which invalid costs were excluded».
- Geplant ist nur der Eintrag «Rechnung «…»: als nicht umlagefähig markiert», also der Klick des Verwalters auf die Rechnung.

**Warum falsch.** Der folgenreichste Ausschluss ist der über die Kategorie: Wird «Hauswart» nicht umlagefähig, fallen in einem Schritt alle Hauswart-Rechnungen aus allen künftigen Abrechnungen. Das Protokoll zeigt dann nur «Kategorie «Hauswart»: jetzt nicht umlagefähig» und sagt nicht, welche und wie viele Rechnungen dabei ausgeschlossen wurden. Wird eine einzelne Rechnung umkategorisiert (von Hand oder durch die KI), bleibt der Ausschluss ganz ohne Eintrag. Ein Verwalter, der später herausfinden will, warum eine Abrechnung tiefer ausfiel als im Vorjahr, findet genau diese Fälle nicht. Gerade dafür sieht der Entscheid den Eintrag zu «excluded costs» vor.

**Korrektur.**
- Kategorieeintrag mit Anzahl und Summe der dabei ausgeschlossenen Rechnungen, etwa «Kategorie «Hauswart»: von umlagefähig auf nicht umlagefähig geändert; 4 Rechnungen über CHF 1’800.00 sind nicht mehr umlagefähig». Alternativ ein Rechnungseintrag pro betroffener Rechnung. Snapshot im selben Schritt (Transaktion von `updateCategory`).
- Eine Rechnung, die durch einen Kategoriewechsel (Formular oder KI) nicht mehr umlagefähig ist, bekommt den Rechnungseintrag mit Grund, etwa «…: nicht mehr umlagefähig (Kategorie «Reparaturen»)».
- Wird eine Rechnung schon als nicht umlagefähig erfasst, entsteht kein Eintrag: sie war nie in einer Abrechnung, es wurde also nichts «ausgeschlossen». Bitte im Szenario oder im pg-Test festhalten.
- Ein pg-Test pro Weg (Kategorie, Umkategorisierung, KI).

## R-1 (Major): Rechnungsdaten bleiben nach dem Löschen der Rechnung im Protokoll

**Beleg**
- Geplant: «Entry details store snapshots (category name, invoice description, supplier, amount …) so an entry stays readable when the record changes or is deleted.»
- `messages/de.json:147` (`privacy_stored_1`): «Die Belege … bleiben gespeichert, bis Sie den Beleg ersetzen oder die Rechnung löschen.»
- `messages/de.json:143` (`privacy_llm_external`): «Rechnungssteller (auch Einzelpersonen)». Ein Rechnungssteller kann also eine natürliche Person sein, im Szenario etwa «Hauswart Meier».
- DSG Art. 5 lit. a (Fedlex SR 235.1): «Personendaten: alle Angaben, die sich auf eine bestimmte oder bestimmbare natürliche Person beziehen».
- DSG Art. 6 Abs. 3: «Personendaten dürfen nur zu einem bestimmten und für die betroffene Person erkennbaren Zweck beschafft werden; sie dürfen nur so bearbeitet werden, dass es mit diesem Zweck vereinbar ist.»
- DSG Art. 6 Abs. 4: «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.»
- DSG Art. 19 Abs. 2 lit. b: der Verantwortliche teilt «mindestens mit: … b. den Bearbeitungszweck».

**Warum falsch.** Löscht der Verwalter eine Rechnung, zum Beispiel weil er sie falsch erfasst hat, erwartet er laut Datenschutzerklärung, dass ihre Daten weg sind. Mit dem Snapshot bleiben Name des Rechnungsstellers, Beschreibung und Betrag unbefristet im Protokoll. Die Erklärung würde damit unrichtig. Der geplante Satz nennt nur die Anmeldungen. Gewollt ist, dass die Daten erhalten bleiben («stays readable … when deleted»); das ist auch zulässig, wenn der Zweck (Nachvollziehbarkeit) genannt ist und der Verwalter das Löschen in der Hand hat. Die Erklärung muss es aber sagen.

**Korrektur** (eine der beiden Varianten, die erste empfohlen):
1. Die Datenschutzerklärung nennt den Inhalt des Protokolls vollständig, und `privacy_stored_1` verweist darauf. Formulierungsvorschlag siehe R-2.
2. Oder: Beim Löschen einer Rechnung werden die Snapshots ihrer Einträge anonymisiert (Rechnungssteller und Beschreibung entfernt, Betrag und Datum bleiben), und die Löschbestätigung der Rechnung sagt das.

Eine Betragsrechnung ist nicht betroffen.

## R-2 (Major): Der geplante Satz verwechselt zwei Protokolle und nennt keinen Zweck

**Beleg**
- `messages/de.json:150` (`privacy_login_1`): «Jede Anmeldung und jede Verlängerung der Sitzung … wird mit der E-Mail-Adresse im Protokoll des Servers festgehalten.»
- `messages/de.json:164` (`privacy_demo_1`): «… nur der Betreiber im Protokoll des Servers (siehe «Anmeldung»)».
- Geplanter Satz: «Dwello records each login with time and sign-in provider in the Protokoll under «Einstellungen»; the entries stay until you delete them.»
- DSG Art. 19 Abs. 1: «Der Verantwortliche informiert die betroffene Person angemessen über die Beschaffung von Personendaten …»; Abs. 2 lit. b (Zweck), siehe R-1.
- DSG Art. 20 Abs. 1 lit. a: Die Informationspflicht entfällt, wenn «die betroffene Person … bereits über die entsprechenden Informationen [verfügt]». Das trifft vor der ersten Anmeldung nicht zu, weil der Verwalter das Protokoll dann noch nicht kennt. Die Nennung ist deshalb nötig, die Frage aus #357 ist mit Ja beantwortet.

**Warum falsch.** Unter derselben Überschrift «Anmeldung» stünden zwei Protokolle: eines mit E-Mail-Adresse beim Betreiber und eines ohne E-Mail-Adresse unter «Einstellungen». Ein Laie liest daraus, dass im Protokoll unter «Einstellungen» seine E-Mail-Adresse steht oder dass das Löschen dort auch das Protokoll des Servers leert. Beides stimmt nicht. Der Zweck fehlt (Art. 19 Abs. 2 lit. b), ebenso die Änderungsdaten und Snapshots (R-1).

**Korrektur, Formulierungsvorschlag** (neuer Absatz unter «Welche Daten Dwello speichert», in allen vier Sprachen):
> «Damit Sie später nachvollziehen können, was sich geändert hat, hält Dwello im Protokoll unter «Einstellungen» mit Datum und Uhrzeit fest: jede Anmeldung mit dem gewählten Anbieter (ohne Name und E-Mail-Adresse), Änderungen der Verwaltungspauschale und der Umlagefähigkeit von Kategorien, Rechnungen, die nicht mehr oder wieder umlagefähig sind (mit Rechnungssteller, Beschreibung und Betrag), sowie zurückgesetzte Zahlungen. Die Einträge bleiben, auch wenn Sie die Rechnung löschen, bis Sie sie im Protokoll löschen. Das Protokoll des Servers (siehe «Anmeldung») ist davon getrennt.»

Zusätzlich gehört die Kollision mit «Protokoll des Servers» in #370 (bisher nennt #370 nur «Übergabeprotokoll»), siehe «Fehlende Begriffe».

## V-2 (Minor): Die Löschbestätigung nennt nicht die ganze Folge

**Beleg:** `settings.feature:94` «Der Eintrag wird endgültig aus dem Protokoll gelöscht. Das lässt sich nicht rückgängig machen.»; CLAUDE.md «Irreversible actions confirm with their real consequence».

**Warum.** Ein unerfahrener Vermieter kann «Eintrag „Kategorie «Gartenpflege Süd»: jetzt nicht umlagefähig“ löschen» als «Änderung zurücknehmen» verstehen. Die Bestätigung sagt nicht, welcher Eintrag gemeint ist und dass die Kategorie so bleibt.

**Korrektur:** «Der Eintrag «{text}» vom {datum} wird endgültig aus dem Protokoll gelöscht. Die Änderung selbst bleibt bestehen. Das lässt sich nicht rückgängig machen.» Das Szenario prüft den Text mit Eintrag.

## V-3 (Minor): zurückgesetzte Rückerstattung

**Beleg:** `backend/src/services/statement.service.ts:499`: `paidAmount` ist standardmässig der `balance`. Bei einer Rückerstattung ist der Saldo negativ (Glossar Z. 156: «negativ = Rückerstattung»). `statement.service.ts:520` speichert ihn so im Reset. Der Verlauf unterscheidet schon zwischen den beiden Fällen (`statements_paid_help_refund`, `messages/de.json:945`).

**Nachgerechnet:**
- Nachzahlung, Saldo 120.00, bezahlt am 10.03.2026: «Zahlung der Abrechnung NK-2025-0007 zurückgesetzt (bezahlt am 10.03.2026, CHF 120.00)». Richtig.
- Rückerstattung, Saldo -85.00: «(bezahlt am …, CHF -85.00)». Falsch: der Mieter hat nicht bezahlt, der Vermieter hat zurückerstattet, und ein negativer Betrag ist für Laien unverständlich.
- Saldo 0.00: «CHF 0.00». Unproblematisch.
- `paidDate`/`paidAmount` sind laut Typ `string | null` (`schema.ts:358`); ohne Wert würde «bezahlt am , CHF ». Der Text braucht eine Variante ohne Klammer.

**Korrektur:** eigener Text für die Rückerstattung, «Rückerstattung der Abrechnung NK-… zurückgesetzt (überwiesen am 10.03.2026, CHF 85.00)», mit Betrag ohne Vorzeichen; dazu ein pg-Test für Nachzahlung und Rückerstattung.

## V-4 (Minor): Wortlaut der Korrektur

**Beleg:** Glossar `UBIQUITOUS_LANGUAGE.md:161` «Berichtigte Abrechnung … ersetzt («ersetzt NK-…») … Status «Ersetzt»»; Z. 173 «Ersetzt». Entscheid #120: «No Storno». Geplant ist «Abrechnung <Nummer> korrigiert».

**Korrektur:** «Abrechnung NK-2025-0007 durch die berichtigte Abrechnung NK-2026-0012 ersetzt». Der Text gehört zu #358 und `logStatementCorrection` muss beide Nummern annehmen. «Storno» aus #111 entfällt richtigerweise, weil #120 es ausschliesst.

## V-5 (Minor): Eintrag zur Verwaltungspauschale, Randfälle und Bedeutung

**Beleg:** Glossar Z. 217: Einstellung «Verwaltungspauschale: Satz, den der Abrechnungslauf vorschlägt» (`management_fee_pct`); `config.service.ts:33-37` (Standard 3, 0–10); `calculation.service.ts:265` (der Satz des Laufs geht vor); `src/lib/utils/format.ts:19` (`normalizeDecimal`: die Datenbank liefert «3.0»).

**Nachgerechnet:**
- Gespeichert 3, neu 4: «Verwaltungspauschale von 3 % auf 4 % geändert». Richtig.
- Noch nie gespeichert (Standard), neu 4: Der alte Wert muss der Standard 3 sein, nicht leer («von  % auf 4 %»).
- Einstellungen mit unverändertem Satz gespeichert (das Formular speichert alle Schlüssel): Es darf kein Eintrag «von 3 % auf 3 %» entstehen, auch nicht, wenn «3.0» und «3» verglichen werden. Der Vergleich muss numerisch sein.
- Neu 0: «von 3 % auf 0 % geändert» ist richtig. Optional «(keine Verwaltungspauschale vorgeschlagen)».
- 3.5: In der Schweiz wird mit Punkt geschrieben, «3.5 %». Kein «3,5 %», auch nicht in fr/it, wenn die übrige Oberfläche den Punkt verwendet.

**Warum.** Die Einstellung ändert keine bestehende Abrechnung, sie ist nur der Vorschlag des Abrechnungslaufs. «Verwaltungspauschale … geändert» lässt einen Laien glauben, seine Abrechnungen hätten sich geändert.

**Korrektur:** «Vorgeschlagene Verwaltungspauschale (Einstellung) von 3 % auf 4 % geändert», dazu pg-Tests für «unverändert gespeichert», «Standardwert» und «0».

## V-6 (Minor): Rechnungseintrag nicht eindeutig

**Beleg:** Geplant: «Rechnung «<Beschreibung>» von <Rechnungssteller> über CHF 450.00 …». Glossar Z. 60–68 kennt Rechnungsnummer (optional, `schema.ts:247`) und Rechnungsdatum (Pflicht, `schema.ts:257`).

**Warum.** Hauswart, Reinigung und Gartenpflege kommen oft monatlich mit gleicher Beschreibung und gleichem Betrag. Zwölf gleich lautende Einträge sagen nicht, welche Rechnung ausgeschlossen wurde. Bei mehreren Gebäuden fehlt auch das Gebäude.

**Korrektur:** Rechnungsdatum (und Gebäude) in Snapshot und Text: «Rechnung «Treppenhausreinigung» von Hauswart Meier vom 12.03.2026 über CHF 450.00 (Lindenhof): als nicht umlagefähig markiert».

## V-7 (Minor): PRD widerspricht dem Entscheid

**Beleg:**
- `docs/PRD-Dwello.md:766`: «Override creates audit log entry». Das Überschreiben der KI-Kategorie ist nicht in der Liste von #111/#357.
- `docs/PRD-Dwello.md:1264-1268`: «Log all sensitive operations (invoice changes, statement generation)», «Log invalid access attempts», «Retention: 1 year of logs», «Admin dashboard».
- #357 Done means: «the audit lines point to what is built».

**Warum.** «Retention: 1 year» widerspricht «Entries stay until the landlord deletes them». Die anderen Punkte werden nicht gebaut.

**Korrektur:** Die PRD-Zeilen auf den Entscheid umschreiben. Was nicht gebaut wird (Überschreiben der KI-Kategorie, fehlgeschlagene Zugriffe, Erstellen von Abrechnungen), als Vision markieren oder streichen. Soll das Überschreiben der KI-Kategorie doch ins Protokoll, entscheidet das der Product Owner (`entscheiden`).

## R-3 (Minor): öffentliche Demo

**Beleg:** `messages/de.json:164` (`privacy_demo_1`): «Alle, die sich anmelden, sehen und ändern dieselben Daten …»; `deploy/demo/reset-demo.sh` legt die Datenbank jede Nacht neu an, das Protokoll wird also mit geleert (bestätigt).

**Warum.** In der Demo sieht jeder Besucher Zeitpunkt und Anbieter der Anmeldungen der anderen und kann sie löschen. Ohne Name und E-Mail-Adresse ist das kaum einer Person zuzuordnen (Art. 5 lit. a «bestimmbar»: **unsicher**). Gesagt werden sollte es trotzdem.

**Korrektur:** Ergänzung in `privacy_demo_1`: «Das Protokoll unter «Einstellungen» zeigt allen Besuchern die Anmeldungen des Tages mit Zeitpunkt und Anbieter, ohne Namen.»

## V-8 (Nit): «jetzt»

«Kategorie «X»: jetzt nicht umlagefähig» wird falsch, sobald die Kategorie später wieder umlagefähig ist und man den älteren Eintrag liest. Vorschlag, gleich gebaut wie der Eintrag zur Pauschale: «Kategorie «X»: von umlagefähig auf nicht umlagefähig geändert» bzw. «… von nicht umlagefähig auf umlagefähig geändert». Hinweis: Wird eine Kategorie wieder umlagefähig, bleiben ihre Rechnungen nicht umlagefähig (`category.service.ts:186`, die Kaskade läuft nur in Richtung `false`). Der Eintrag soll nicht den Eindruck erwecken, die Rechnungen seien zurück, etwa mit dem Zusatz «Ihre Rechnungen bleiben nicht umlagefähig».

## V-9 (Nit): Sprache der Einträge

Der Eintrag muss aus Typ und Snapshot beim Anzeigen mit `m.<key>()` gebildet werden, nicht als deutscher Satz gespeichert, sonst zeigen fr/it/en Deutsch (`sprachen-bildschirme.feature`). Für den Kategorienamen beide Namen speichern (`name`, `nameDE`), damit die Liste den Namen so wählt wie der Rest der App.

---

## Bestätigt

- **Begriffe im Glossar:** «Liegenschaftsverwalter», «Einstellungen» (Abschnitt Z. 213), «Verwaltungspauschale» (Z. 154, 217), «Kategorie» (Z. 81), «Umlagefähigkeit» (Z. 86), «Umlagefähige Rechnung» (Z. 69), «Rechnungssteller» (Z. 61), «Beschreibung» (Z. 68), «Betrag» (Z. 65), «Zahlungsdatum» (Z. 67). «als nicht umlagefähig markieren» verwendet die App bereits (`messages/de.json:984`).
- **Betragsformat:** «CHF 450.00» passt zu `formatCurrency` (`src/lib/utils/format.ts:25`). Ab 1’000 mit typografischem Apostroph «CHF 1’800.00»; der Snapshot sollte den Betrag als Zahl speichern und erst beim Anzeigen formatieren.
- **Schweizer Zeit:** `formatDateTime` mit `Europe/Zurich` (`format.ts:55 ff.`).
- **Datensparsamkeit beim Anmeldeeintrag:** nur Zeitpunkt und Anbieter, keine E-Mail, kein Name, keine IP, kein User-Agent, nur nach erfolgreichem Callback und nicht bei jeder Sitzungsverlängerung. Das entspricht DSG Art. 6 Abs. 2 («verhältnismässig») und Art. 7 Abs. 3 («… dass die Bearbeitung der Personendaten auf das für den Verwendungszweck nötige Mindestmass beschränkt ist, soweit die betroffene Person nicht etwas anderes bestimmt»). Betroffen ist der Verwalter selbst, und er bestimmt mit dem Löschen über die Aufbewahrung. Unbefristete Aufbewahrung bis zum Löschen ist so vertretbar.
- **Keine Mieternamen** in den Snapshots: richtig. Die Abrechnungsnummer verweist auf den Mieter, aber diese Daten stehen in der Abrechnung ohnehin und sind unter «Zahlungen» in `privacy_stored_1` genannt.
- **Zurückgesetzte Zahlung:** passt zu #92 und `resetPayment` (`statement.service.ts:516 ff.`); bis auf V-3 ist der Text konsistent mit dem Verlauf (`statements_history_payment_reset`).
- **Korrektur einer versendeten Abrechnung:** Gemäss #357 «Stop and ask» wird sie erst mit #358 geloggt, ohne Storno (#120).
- **Datenschutzerklärung muss das Protokoll nennen:** ja (Art. 19 Abs. 1/2, Art. 20 Abs. 1 lit. a greift nicht, siehe R-2).
- **Navigation:** Einstellungen > Protokoll, zwei Ebenen; der Breadcrumb führt zu «Einstellungen» (`breadcrumb.feature:45-49`). Fachlich passend.
- **Formeln:** keine Betragsformel; die einzige Rechnung ist alt/neu der Pauschale (nachgerechnet unter V-5) und das Vorzeichen bei der Zahlung (V-3).

## Fehlende Begriffe (für #370 ergänzen, Labels `fachlich`, `entscheiden`)

- **Protokoll** (Liste unter «Einstellungen»): #370 offen; Marker `TODO(fachlich prüfen, #370)` steht in `settings.feature:71`. In #370 ergänzen: Kollision auch mit «Protokoll des Servers» (`privacy_login_1`, `privacy_demo_1`), nicht nur mit «Übergabeprotokoll». Vorschlag für das Glossar (Abschnitt «Einstellungen»): «**Protokoll** | Liste unter «Einstellungen», die mit Datum und Uhrzeit Anmeldungen und Änderungen festhält, die Abrechnungen beeinflussen (Verwaltungspauschale, Umlagefähigkeit, nicht umlagefähige Rechnungen, zurückgesetzte Zahlungen, berichtigte Abrechnungen). Einträge bleiben, bis der Liegenschaftsverwalter sie löscht. Nicht zu verwechseln mit dem Protokoll des Servers und dem Übergabeprotokoll. | `audit_log` Tabelle». Alternative mit weniger Verwechslungsgefahr: «Änderungsprotokoll», falls die Anmeldungen als «Anmeldungen und Änderungen» im Seitentitel erklärt werden.
- **Eintrag (im Protokoll):** braucht keinen eigenen Glossarbegriff.

## Nicht bestätigt

- **Ob ein Zeitpunkt mit Anbieter ohne Namen in der Demo Personendaten sind** (Art. 5 lit. a «bestimmbar»): **unsicher**, nur der Gesetzestext ist geprüft, keine Lehre oder Praxis.
- **Aufbewahrungspflicht für Protokolleinträge** (etwa Art. 958f OR für Buchführungspflichtige): nicht geprüft. Für private Vermieter ohne Buchführungspflicht ist mir keine bekannt; eine Aussage dazu ist **unsicher**. Das Löschen durch den Vermieter berührt die Belegeinsicht des Mieters (Art. 8 VMWG) nicht, weil sich diese auf die Belege bezieht, nicht auf ein Protokoll. Auch das ist ohne Fedlex-Zitat **unsicher**.
- **Wer Verantwortlicher im Sinne des DSG ist** (Betreiber der Installation oder Vermieter), wenn beide verschieden sind: `privacy_stored_2` nennt den Betreiber. Nicht vertieft, weil es den Satz zum Protokoll nicht ändert.
- **Ob die Anmeldung in der Demo-/E2E-Umgebung über denselben Callback läuft:** Laut Kommentar in `settings.feature:68-70` prüfen pg-Tests die Anmeldung. Der Eintrag wird aber vom BFF geschrieben (`src/routes/auth/callback`), und das kann ein Backend-pg-Test allein nicht zeigen. Das muss der Code-Reviewer prüfen; fachlich nicht bewertet.
- **Rechtsquellen:** DSG-Zitate stammen aus dem Fedlex-Filestore (SR 235.1, Fassung 01.09.2023, `fedlex-data-admin-ch-eli-cc-2022-491-20230901-de-html-1.html`). Die Fedlex-Webseite selbst lädt nur mit JavaScript.
