# Fachreview W1c (#132), Runde 2: Feature-Review

Gegenstand: Diff `69508c2..a2a921a` im Worktree `review-w1c-fach2` (detached, a2a921a). Geprüft wurden die Übernahme der Befunde aus Runde 1 (`docs/reviews/w1c-fachreview-1.md`) und das Neue: die leere Vorschau (`PreviewEmpty.svelte`), sieben neue Texte `statements_existing_*` in vier Sprachen, Szenarien und Unit-Tests. Rollen: Verwalter und Mietrecht. Die Rolle Rechtstexte ist nicht betroffen.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-12 | Verwalter | Minor | «Heizprofil bearbeitet» richtet sich nach `updatedAt` und meldet deshalb auch ein Umbenennen und Änderungen, die den Anteil nach Heizprofil dieser Abrechnung nicht ändern |
| V-13 | Verwalter | Minor | Der Hinweis «Heizprofil bearbeitet» sagt nicht, was zu tun ist. Bei Entwürfen widerspricht er `profiles_shares_keep`, bei versendeten Abrechnungen fehlt jeder Rat |
| M-2 | Mietrecht | Minor | «… im Mietvertrag ist heute keine Verwaltungspauschale vereinbart» bei einer versendeten oder bezahlten Abrechnung: Der Hinweis auf die Berichtigung aus der Korrektur zu M-1 fehlt |
| V-14 | Verwalter | Nit | «Sie rechnet mit den Monatsanteilen von damals.»: Das «Sie» am Satzanfang liest sich wie die Anrede |
| V-15 | Verwalter | Nit | en: «the rental contract now agrees no management fee» ist ungewöhnliches Englisch |
| V-16 | Verwalter | Nit | `statements_existing_same_settings` ist mehrdeutig, wenn sich die bestehenden Abrechnungen schon untereinander unterscheiden |

Aus Runde 1 offen und nicht übernommen, wie vom Aufrufer gemeldet: V-3 (Produktfrage), V-6 (für den Pull Request vorgemerkt), V-8, V-9, V-10 (Nits). Sie gelten unverändert und stehen im Bericht von Runde 1.

## Übernahme der Befunde aus Runde 1

- **V-1 (Major): umgesetzt, Befund geschlossen.** `profileDifference` (`src/lib/server/statement-generation.ts:146-159`) meldet ein bearbeitetes Heizprofil nur bei gleicher ID, `heatingShare.byDays === false` und `updatedAt > createdAt`. `updateHeatingProfile` setzt `updatedAt` bei jeder Änderung (`backend/src/services/heating-profile.service.ts:239`). Vordefinierte Profile lassen sich in der App nicht bearbeiten (`src/routes/config/heating-profiles/[id]/edit/+page.server.ts:9`). Für den Mietvertrag über die ganze Periode (`byDays: true`) gibt es keinen Hinweis (Unit-Test Z. 352–361). Das Szenario «Vorschau nennt eine Abrechnung, deren Heizprofil danach bearbeitet wurde» hat Monatsanteile mit der Summe 100 (30+20+10+5+2+0+0+0+2+6+10+15). Die Genauigkeit der Regel behandelt V-12, den fehlenden Rat V-13.
- **V-2 (Major): umgesetzt, Befund geschlossen.** Beide Namen werden genannt (`statements_existing_profile`). Der alte Name kommt aus `heatingShare.names` (#209), auch bei einem gelöschten Profil (Unit-Test Z. 342–348). Den Ratschlag `statements_existing_same_settings` gibt es nur, wenn der Lauf den Unterschied beheben kann, also bei einem anderen Heizprofil oder `fee.source === 'run'` (`src/lib/statement-wizard.ts:336-339`). Bei einem eigenen Satz und bei «nicht vereinbart» fehlt er zu Recht, denn dort hilft eine andere Wahl im Lauf nicht. Schritt 3 heisst «Heizprofil und Verwaltungspauschale» (`messages/de.json:955`), wie im Szenario.
- **M-1 (Major): umgesetzt, Befund geschlossen.** Die drei Texte entsprechen dem Vorschlag wörtlich. `feeDifference` (`statement-generation.ts:162-170`) folgt derselben Rangfolge wie `feePercentOf` (`backend/src/services/calculation.service.ts:257-266`): ohne Vereinbarung 0, sonst der eigene Satz, sonst der Satz des Laufs. Der Hinweis auf die Berichtigung, der zur Korrektur gehörte, fehlt noch, siehe M-2. Rechtsgrundlage wie in Runde 1, OR Art. 257a Abs. 2 (Fedlex): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- **V-4 (Minor): umgesetzt.** Die Einstellungen werden nur bei gleichem Beginn und gleichem Ende verglichen (`statement-generation.ts:184-186`). Veraltete Entwürfe zählen in jeder Periode, die sich überschneidet (Unit-Test «vergleicht die Einstellungen nur mit Abrechnungen derselben Abrechnungsperiode»).
- **V-5 (Minor): umgesetzt.** Neuer Titel «Von der Vorschau zu einem Entwurf, dem Rechnungen fehlen». In den Texten und Szenarien steht «veraltet» nirgends. Im Code (`outdated`, `preview-outdated`) ist das in Ordnung, weil es dort kein Domänenbegriff in der UI ist.
- **V-7 (Minor): umgesetzt.** `src/__tests__/statement-generation.test.ts` deckt ab:
  - versendet oder bezahlt mit anderem Heizprofil: erscheint;
  - versendet und veraltet: erscheint nicht, und es gibt keine Abfrage;
  - eigener Satz;
  - «nicht vereinbart» mit 0.00: kein Hinweis, mit 3.00: Hinweis;
  - `managementFeePercent = null` wird zu 0, angezeigt als «0 %», nicht als «Erstellt mit  %».
- **V-11 (Nit): umgesetzt.** `Number('3.00')` ergibt 3, die Anzeige lautet «3 %» (DOM-Test Z. 920). Alle Sprachen zeigen den Dezimalpunkt («4.5 %»). Das passt zum Rest der App, die Zahlen durchgehend mit `de-CH` formatiert (`src/lib/utils/format.ts:27`).

## Neu bestätigt

- **Leere Vorschau (`PreviewEmpty.svelte`):** Sie zeigt nur Entwürfe, denen Rechnungen fehlen, und keine Unterschiede in den Einstellungen. Fachlich richtig: Der Lauf erstellt nichts, also gibt es keine «neuen Abrechnungen», mit denen sich vergleichen liesse. Den Rat liefert schon `statements_all_billed` (`messages/de.json:1183`): «Um einen Entwurf neu zu berechnen, löschen Sie ihn … Versendete Abrechnungen lassen sich nicht neu berechnen.» Nach dem Löschen nennt der nächste Lauf allfällige Unterschiede zu den übrigen Abrechnungen. Das Szenario «Vorschau ohne neue Abrechnung nennt einen Entwurf, dem eine danach erfasste Rechnung fehlt» und der DOM-Test Z. 459–470 belegen beides.
- **Regel (a) nur für Entwürfe:** `status === 'draft'` vor der Abfrage (`statement-generation.ts:199`). Versendete Abrechnungen berichtigt der Vermieter mit einer berichtigten Abrechnung (`UBIQUITOUS_LANGUAGE.md:161`, #120). Die Detailseite verwendet weiterhin dieselbe Regel (`changedInvoiceCount`, `src/lib/server/statement.ts:111-119`).
- **Nachrechnung Satz** (Hauswart 732 Franken, 2024 mit 366 Tagen, Eva Frei mit 91 Mietstagen, 182.00):
  - 3 % ergibt 5.46, 4.5 % ergibt 8.19;
  - eigener Satz 2.5 % ergibt 4.55: Text «Satz von 2.5 %»;
  - nicht vereinbart ergibt 0.00, gespeichert 0: kein Hinweis;
  - gespeichert null ergibt 0, mit dem Lauf 4.5 %: Hinweis «0 % … 4.5 %», richtig.
- **Nachrechnung V-1-Szenario** (Lindenhof, Heizkosten 1000 Franken, Wohnungsanteil 100 %):
  - Eva hat mit dem alten «Winter» Januar bis März 18+14+11 = 43 %, also 430.00. Mit dem bearbeiteten Profil sind es 30+20+10 = 60 %, also 600.00. Der Unterschied ist echt.
- **Übersetzungen** gegen `docs/design/i18n-begriffe.md`:
  - Heizprofil: profil de chauffage / profilo di riscaldamento / heating profile (Z. 53);
  - Abrechnungsperiode: période de décompte / periodo di conteggio / billing period (Z. 58);
  - Verwaltungspauschale: frais de gestion / spese di gestione / management fee (Z. 62);
  - Entwurf: brouillon / bozza / draft (Z. 66);
  - «Établi/Allestito» wie «Abrechnungen erstellen» (Z. 98);
  - Monatsanteile: parts mensuelles / quote mensili / monthly shares, wie in `profiles_shares_keep`.
  Die französischen Guillemets haben das geschützte Leerzeichen innen, das Italienische hat keines (Stilregel Z. 5). «aucuns frais de gestion» ist korrekt, weil «frais» nur im Plural steht. Formelle Anrede (vous, Lei, «scelga») stimmt.

## Befunde

### V-12 (Minor): «Heizprofil bearbeitet» meldet mehr, als sich geändert hat

- **Beleg:** `statement-generation.ts:155-158`: `Date.parse(edited) > Date.parse(listed.createdAt)`. `updatedAt` ändert sich bei jedem Speichern, auch beim Umbenennen (`heating-profile.service.ts:239`). Die Abrechnung speichert die Monatsanteile ihrer Miettage in `heatingShare.months` und bei einer Periode, die nicht 100 % trägt, auch `periodMonths` (`backend/src/db/schema.ts:362-368`).
- **Warum falsch:** In diesen Fällen sagt der Text «wurde … bearbeitet. Sie rechnet mit den Monatsanteilen von damals», obwohl die Abrechnung genau gleich rechnen würde:
  1. Das Profil wurde nur umbenannt.
  2. Die Änderung betrifft nur Monate ausserhalb der Miettage. Beispiel: Eva Frei hat Januar bis März, im Profil werden November und Dezember gegeneinander verschoben. Ihr Anteil bleibt bei 43/100, und die Summe der übrigen Anteile bleibt ebenfalls gleich.
  Der unerfahrene Vermieter löscht dann einen Entwurf ohne Grund, und dabei gehen Notiz und Zahlungsfrist verloren (V-10).
- **Korrektur:** Die gespeicherten `months` (und `periodMonths`, wo vorhanden) mit den heutigen Monatsanteilen des Profils vergleichen. Dazu müssen die Monatsfelder in `tests/contracts/heating-profiles.json` stehen. Ein Unit-Test für das Umbenennen gehört dazu. Wird das abgelehnt: Im Text «bearbeitet» stehen lassen (das stimmt), aber nicht behaupten, dass sich die Rechnung unterscheidet. Der heutige Satz «Sie rechnet mit den Monatsanteilen von damals» ist wahr, legt aber einen Unterschied nahe.

### V-13 (Minor): Der Hinweis «Heizprofil bearbeitet» sagt nicht, was zu tun ist

- **Beleg:** `statements_existing_profile_edited` gibt keinen Rat. `sameSettingsNote` schliesst den Fall aus (`statement-wizard.ts:336-339`), zu Recht, weil dasselbe Profil schon gewählt ist. Bleibt der allgemeine Satz «Um einen Entwurf neu zu berechnen, löschen Sie ihn …» (`statements_existing_note`). `profiles_shares_keep` (`messages/de.json`) rät beim Bearbeiten des Profils aber: «… löschen Sie die Entwürfe aller Mietverträge der betroffenen Wohnungen in der betroffenen Abrechnungsperiode …».
- **Warum falsch:** Die neuen Abrechnungen rechnen mit den heutigen Monatsanteilen, die bestehende mit den alten. Das ist der gemischte Fall aus Runde 1. Nachrechnung mit 1000 Franken, Lindenhof:
  - **Szenario-Profil:** Eva behält ihren Anteil mit dem alten «Winter» (43 %, also 430.00). Marc erhält neu Mai bis Dezember 2+0+0+0+2+6+10+15 = 35 %, also 350.00. Der Leerstand im April beträgt 5 %, also 50.00. Zusammen sind das 830.00, und 170.00 werden niemandem verteilt.
  - **Umgekehrt:** Das bearbeitete Profil hat Januar 4, Februar 3, März 3, April 5, Mai 5, Juni bis August 0, September 5, Oktober 15, November 30 und Dezember 30 (Summe 100). Dann erhält Marc 85 %, also 850.00. Mit Eva (430.00) tragen die Mieter 1280.00 von 1000.00 Heizkosten.
  - OR Art. 257b Abs. 1 (Fedlex, Wortlaut aus Runde 1): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters …».
  - **Was geraten wird:** Bei einem Entwurf löscht der Vermieter nach dem allgemeinen Satz nur diesen einen Entwurf. Bei einer versendeten Abrechnung bekommt er gar keinen Rat.
- **Korrektur:** Ein Satz, der nur bei `profileEdited` erscheint, zum Beispiel: «Die neuen Abrechnungen rechnen mit den heutigen Monatsanteilen. Damit alle gleich gerechnet sind, löschen Sie die Entwürfe dieser Abrechnungsperiode und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.» Wörtlich gestützt auf `profiles_shares_keep`. Ein DOM-Test gehört dazu. Ob der Vermieter bei einer versendeten Abrechnung das Profil zurücksetzen soll, ist eine Produktfrage und gehört allenfalls in #132 oder in ein neues Issue.

### M-2 (Minor): «Nicht vereinbart» bei einer versendeten Abrechnung ohne Hinweis auf die Berichtigung

- **Beleg:** `statements_existing_fee_none` gilt für jeden Status (Unit-Test Z. 365–381 mit `sent`). Zur Korrektur in Runde 1 (M-1) gehörte der Satz: «Für versendete Abrechnungen im Fall ‹nicht vereinbart› genügt der Hinweis auf die Berichtigung wie in `statements_later_sent`». Umgesetzt ist er nicht.
- **Warum:** Eine versendete Abrechnung mit 3 % Verwaltungspauschale bei einem Mietvertrag ohne Vereinbarung verlangt womöglich zu viel. OR Art. 257a Abs. 2 (Fedlex): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Wurde die Vereinbarung erst nach dem Versand im Mietvertrag entfernt (Korrektur eines Erfassungsfehlers oder neue Abrede), kann die Abrechnung auch richtig gewesen sein. Deshalb nur Minor.
- **Korrektur:** Bei `fee.source === 'none'` und einem anderen Status als «Entwurf» den Satz aus `statements_later_sent` anhängen: «Verlangt die Abrechnung zu viel, schulden Sie dem Mieter die Differenz: Ziehen Sie sie von der Nachzahlung ab oder erstatten Sie sie.» Dafür muss `ChangedStatement` den Status tragen. Oder den Rest in #132 mit Begründung festhalten.

### V-14 (Nit): «Sie rechnet …»

`statements_existing_profile_edited` (de): «Sie rechnet mit den Monatsanteilen von damals.» Am Satzanfang lässt sich das «Sie» nicht von der Anrede unterscheiden. Vorschlag: «Die Abrechnung rechnet mit den Monatsanteilen von damals.» Das Englische sagt es schon so: «The statement uses …».

### V-15 (Nit): en «agrees no management fee»

`statements_existing_fee_contract` und `_none` (en): «the rental contract now agrees a rate of {now} %» und «now agrees no management fee». Vorschlag: «the rental contract now provides for a rate of {now} %» und «the rental contract now provides for no management fee».

### V-16 (Nit): «denselben Satz wie bei den bestehenden Abrechnungen»

Ein Beispiel: Eva hat 3 %, Marc 4.5 % aus einem früheren Lauf, der Lauf rechnet mit 4.5 %. Dann erscheint der Rat für Eva, aber «die bestehenden Abrechnungen» haben keinen gemeinsamen Satz. Das ist selten und ohne Handlungsbedarf, solange die Szenarien nur einen Wert haben. Möglich wäre «wie bei der Abrechnung NK-…», wenn es nur eine gibt.

## Fehlende Begriffe

Keine neuen. «Veralteter Entwurf» ist aus den Texten und Szenarien entfernt (V-5). «Abrechnungsnummer» bleibt offen unter #294 (Runde 1).

## Nicht bestätigt

- **Fedlex-Wortlaute:** In dieser Runde habe ich sie nicht neu abgerufen. Ich übernehme sie aus Runde 1 (Fedlex-Filestore, OR Fassung 20261001). `mmx search "Art. 257b OR Nebenkosten tatsächlichen Aufwendungen fedlex"` lieferte nur Sekundärquellen (unter anderem kuebler-immobilien.ch, gleicher Wortlaut von Abs. 1).
- **Ob eine Verteilung, bei der die Mieter mehr als 100 % der Heizkosten tragen** (V-13, 1280 von 1000 Franken), gegen Art. 257b Abs. 1 OR verstösst und anfechtbar ist: Rechtsprechung habe ich nicht gesucht. **unsicher**.
- **Ob `GET /heating-profiles` die Monatsfelder mitliefert** (Voraussetzung für die Korrektur von V-12): nicht nachgelesen. Der Vertrag `tests/contracts/heating-profiles.json` enthält nur Namen und `updatedAt`.
- **E2E-Lauf:** Die Szenarien habe ich nicht ausgeführt (Review nur lesend). Dass `listStatements` `heatingShare`, `createdAt` und `contractId` liefert, schliesse ich aus `statementColumns = { ...tableColumns, nextReminderFrom }` (`backend/src/services/statement.service.ts:52`) und `tests/contracts/statements.json`. Geprüft wird das in `api-contracts.pg.test.ts`.
- **Gleichzeitigkeit `updatedAt`/`createdAt`:** Werden Profil und Abrechnung in derselben Millisekunde gespeichert, gilt das Profil nicht als bearbeitet. Praktisch nicht relevant, nicht getestet.
- **PR #298 (V-6):** weiterhin nicht gelesen.
