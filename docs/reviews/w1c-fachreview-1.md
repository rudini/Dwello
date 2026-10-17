# Fachreview W1c (#132): veraltete Entwürfe und andere Einstellungen in der Vorschau, Runde 1

Gegenstand: die fünf `@wip`-Szenarien am Ende von `tests/e2e/features/statement-generate.feature` (Z. 270–317) und das vom Aufrufer beschriebene geplante Verhalten (Regeln a–c, vier Texte). Worktree `review-w1c-fach`, Commit b9660be. Rollen: Verwalter, Mietrecht. Die Rolle Rechtstexte ist nicht betroffen.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Regel (b) vergleicht nur die Heizprofil-ID. Wurden die Monatsanteile eines eigenen Heizprofils nach dem Entwurf geändert, schweigt die Vorschau, obwohl die bestehende und die neue Abrechnung verschiedene Monatsanteile haben |
| V-2 | Verwalter | Major | Bei anderen Einstellungen sagt der Hinweis nicht, was zu tun ist, und nennt das Heizprofil nicht. Bei einer versendeten Abrechnung lautet die naheliegende Korrektur «Lauf mit denselben Einstellungen», nicht «Entwurf löschen» |
| M-1 | Mietrecht | Major | Der Satz-Text «…, die neuen Abrechnungen mit {run} %» ist falsch, wenn {run} der eigene Satz des Mietvertrags oder 0 % (nicht vereinbart) ist. Den Fall «nicht vereinbart» nennt der Text nicht als Problem nach Art. 257a Abs. 2 OR |
| V-3 | Verwalter | Minor | Eine versendete oder bezahlte Abrechnung erscheint wegen anderer Einstellungen in der Liste. Dass ihr seither Rechnungen fehlen, verschweigt die Liste |
| V-4 | Verwalter | Minor | «Periode überschneidet sich» schliesst Abrechnungen einer anderen Abrechnungsperiode ein (Wechsel Kalenderjahr/Juli–Juni). Ein Vergleich der Einstellungen über verschiedene Perioden ist fachlich kein Widerspruch |
| V-5 | Verwalter | Minor | Der Begriff «veralteter Entwurf» (Titel Z. 310) fehlt im Glossar |
| V-6 | Verwalter | Minor | Zusammenspiel mit PR #298 (Ton «info»): Nennt die Liste Abrechnungen, muss der Ton «caution» bleiben |
| V-7 | Verwalter | Minor | Szenarien decken «jeder Status» (b, c) und die Satzregel (eigener Satz, nicht vereinbart) nicht ab |
| V-8 | Verwalter | Nit | Ein anderes Heizprofil ändert nichts am Betrag eines Mietvertrags über die ganze Periode. Die Abrechnung erscheint trotzdem |
| V-9 | Verwalter | Nit | Ist das Heizprofil gelöscht (`heating_profile_id` = null), lässt sich «dasselbe Heizprofil» nicht wählen |
| V-10 | Verwalter | Nit | Der Hinweis «löschen Sie ihn» sagt nicht, dass Notiz und Zahlungsfrist verloren gehen und eine neue Abrechnungsnummer entsteht (#97) |
| V-11 | Verwalter | Nit | Die Satzanzeige muss aus dem gespeicherten «3.00» die Anzeige «3 %» machen, nicht «3.00 %» (Szenario Z. 297) |

## Bestätigt

- **Regel (a), veralteter Entwurf:** `backend/src/services/statement-invoices.service.ts:33-46` (`changedInvoices`) ist dieselbe Regel wie der Hinweis «Rechnungen seit der Abrechnung geändert» (`src/routes/statements/[id]/+page.svelte:155-159`, Texte `statements_later_*`, `messages/de.json:1023-1027`). Erfasst, geändert und gelöscht zählen. Der Tankbestand fällt bei «gone» heraus (`!billed.fuelStock`), offen in #307. Der geplante Satz «Seit dem Erstellen dieses Entwurfs wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht.» stimmt wörtlich mit `statements_later_draft`/`statements_later_many` überein.
- **Szenario Z. 273:** Die Rechnung Hauswart 732 vom 31.12.2024 hat keinen Leistungszeitraum und zählt damit für die ganze Periode 2024. Eva Frei (01.01.–31.03.) hat Mietstage darin. Der vorher erstellte Entwurf (`seed.statement` → `POST statements/generate`, `tests/e2e/fixtures/backend.ts:176-193`) enthält die Rechnung nicht. `billedAsIs` ist also false, und der Entwurf gilt als veraltet. Richtig.
- **Szenario Z. 300:** Die Rechnung ist vor der Abrechnung erfasst, Heizprofil und Satz sind gleich. Keine der Regeln a–c trifft zu. Richtig.
- **Regel (c), Satz des Laufs je Mietvertrag:** Die Regel entspricht `feePercentOf` in `backend/src/services/calculation.service.ts:257-266`: 0 ohne Vereinbarung, sonst der eigene Satz, sonst der Satz des Laufs. Das Glossar (`UBIQUITOUS_LANGUAGE.md:154`) und `docs/nebenkostenabrechnung-anforderungen.md` Regel 9 (Z. 149) sagen dasselbe. Die E2E-Fixture vereinbart standardmässig «zum Satz des Abrechnungslaufs» (`tests/e2e/fixtures/backend.ts:160`). Deshalb gilt für Eva Frei in Z. 292–297 der Satz des Laufs, und 3 % gegen 4.5 % ist ein echter Unterschied.
- **Rechtsgrundlage Verwaltungspauschale**, VMWG Art. 4 Abs. 3 (Fedlex, Fassung 1.10.2025): «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.» OR Art. 257a Abs. 2 (Fedlex, Fassung 1.10.2026): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- **Warum das Heizprofil zählt (Nachrechnung):** Lindenhof hat nur die Wohnung 3.01, der Wohnungsanteil ist also 100 %. Die Heizkosten betragen 1000 Franken.
  - Einheitlich «Heizung Mittelland» (`backend/migrations/0002_stammdaten.sql:74-76`): Eva Jan–Mär 17.5+14.5+13.5 = 45.5 % → 455.00. Marc Mai–Dez 3.5+0+0+0+1+10+13.5+17 = 45 % → 450.00. Leerstand April 9.5 % → 95.00. Summe 1000.00.
  - Einheitlich «Winter» (Z. 49–62): Eva 18+14+11 = 43 % → 430.00. Marc 2+0+0+0+2+8+14+26 = 52 % → 520.00. Leerstand 5 % → 50.00. Summe 1000.00.
  - Gemischt wie in Z. 284–289 (Eva «Winter», Marc «Mittelland»): Die Mieter tragen 880.00, der Vermieter 120.00, mehr als bei jedem einheitlichen Profil.
  - Umgekehrt gemischt: Die Mieter tragen 975.00, der Vermieter nur 25.00. Zusammen zahlen die Mieter dann mehr als bei jedem einheitlichen Profil.
  - Das berührt den Grundsatz der tatsächlichen Aufwendungen. OR Art. 257b Abs. 1 (Fedlex): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, …». Regel (b) ist fachlich begründet.
  - Randfall: Für einen Mietvertrag über die ganze Periode zählt das Heizprofil nicht (`heating_share.byDays`, `reason: 'wholePeriod'`), siehe V-8.
- **Nachrechnung Satz (Regel c):** Hauswart 732 Franken, Periode 2024 mit 366 Tagen.
  - Eva hat 91 Mietstage → 732 × 91/366 = 182.00. Mit 3 % sind das 5.46, mit 4.5 % 8.19.
  - Marc hat 245 Mietstage (01.05.–31.12.) → 490.00. Mit 3 % sind das 14.70, mit 4.5 % 22.05.
  - Randfall «nicht vereinbart»: Der Mietvertrag erhält 0 %, gespeichert ist 0. Kein Hinweis. Richtig.
- **Neuer Hinweistext** «Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe.»: Er entspricht dem Entscheid in #132 («says that existing drafts are kept») und `contractsInPeriod` (`src/lib/server/statement-generation.ts:68-73`). Gegen das Glossar (Entwurf, Abrechnungsperiode, Mietvertrag) ist er in Ordnung.
- **Link zur Detailseite (Z. 310–317):** Er entspricht dem Entscheid («links to them»).

## Befunde

### V-1 (Major): Ein geändertes eigenes Heizprofil bleibt unbemerkt

- **Beleg:** Die Abrechnung speichert nur `heating_profile_id` (`backend/src/db/schema.ts:402`) und, bei Ein- oder Auszug, die verwendeten Monatsanteile in `heating_share.months` (`schema.ts:358-366`). Ein eigenes Heizprofil lässt sich nach dem Erstellen ändern (`backend/src/services/heating-profile.service.ts:198-243`; nur vordefinierte Profile sind gesperrt). `profiles_shares_keep` (`messages/de.json:1350`) sagt selbst: «Bestehende Abrechnungen behalten die Monatsanteile, mit denen sie erstellt wurden.»
- **Warum falsch:** Nach einer Änderung der Monatsanteile haben die bestehende und die neue Abrechnung dieselbe ID, aber verschiedene Monatsanteile. Die Summen aus der Nachrechnung oben stimmen dann nicht mehr, und die Vorschau sagt nichts. Genau diesen Fall will der Entscheid in #132 erkennen («existing statements whose Heizprofil … differ from the run's»).
- **Korrektur:** Regel (b) vergleicht bei einer Abrechnung mit `heating_share.byDays === false` zusätzlich die gespeicherten Monatsanteile mit den heutigen des Profils. Text zum Beispiel: «Erstellt mit früheren Monatsanteilen des Heizprofils «{name}».» Den Fall deckt ein Test unterhalb E2E ab, zum Beispiel `*.pg.test.ts`. Wird das abgelehnt, gehört der Fall in ein Issue.

### V-2 (Major): Der Hinweis auf andere Einstellungen sagt nicht, was zu tun ist

- **Beleg:** geplante Texte «Erstellt mit einem anderen Heizprofil als die neuen Abrechnungen.» und «Erstellt mit {used} % Verwaltungspauschale, die neuen Abrechnungen mit {run} %.» Die einzige Handlung im Hinweis ist «Um einen Entwurf neu zu berechnen, löschen Sie ihn …». CLAUDE.md, Design-Regeln: «errors say what happened and what to do».
- **Warum falsch:** Ein unerfahrener Vermieter sieht einen Unterschied und hat zwei Möglichkeiten:
  1. die neuen Abrechnungen an die bestehenden angleichen (im Schritt «Einstellungen» dasselbe Heizprofil und denselben Satz wählen);
  2. die bestehenden Entwürfe löschen.
  Bei einer versendeten oder bezahlten Abrechnung (b und c gelten für jeden Status) bleibt nur der erste Weg, sonst sind die Abrechnungen derselben Periode und Liegenschaft uneinheitlich (Nachrechnung oben). Ohne den Namen des Heizprofils kann der Vermieter den ersten Weg nicht gehen.
- **Korrektur:** Den Namen des Heizprofils nennen, zum Beispiel «Erstellt mit dem Heizprofil «Winter», die neuen Abrechnungen mit «Heizung Mittelland».» Ohne Heizprofil im Lauf: «… die neuen Abrechnungen ohne Heizprofil». Dazu ein Satz im Hinweis, wenn eine Abrechnung andere Einstellungen hat: «Damit die Abrechnungen dieser Periode gleich gerechnet sind, wählen Sie im Schritt «Einstellungen» dasselbe Heizprofil und denselben Satz wie die bestehenden Abrechnungen.» Das Szenario Z. 289 entsprechend anpassen.

### M-1 (Major): Der Satz-Text ist bei eigenem Satz und bei «nicht vereinbart» irreführend

- **Beleg:** Der Aufrufer plant: «{run}» = 0 ohne Vereinbarung, sonst der eigene Satz des Mietvertrags, sonst der Satz des Laufs. Der Text sagt aber «die neuen Abrechnungen mit {run} %». Satz und Vereinbarung lassen sich am Mietvertrag nach der Abrechnung ändern (`backend/src/services/contract.service.ts:286-287, 390`).
- **Warum falsch:**
  1. **Eigener Satz:** Der Mietvertrag hat heute 2.5 %, die Abrechnung wurde mit 3 % erstellt, der Lauf rechnet mit 4.5 %. Der Text lautet dann «…, die neuen Abrechnungen mit 2.5 %». Im Schritt «Einstellungen» stehen aber 4.5 %, und dieser Mietvertrag erhält gar keine neue Abrechnung.
  2. **Nicht vereinbart:** «Erstellt mit 3 % Verwaltungspauschale, die neuen Abrechnungen mit 0 %.» verschweigt den Grund. Laut Mietvertrag schuldet der Mieter keine Verwaltungspauschale. Art. 257a Abs. 2 OR (Fedlex): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Bei einer versendeten Abrechnung verlangt der Vermieter dann womöglich zu viel. Das muss der Hinweis sagen, nicht ein Satzvergleich.
- **Korrektur:** Je Fall ein eigener Text:
  - Satz des Laufs: «Erstellt mit {used} % Verwaltungspauschale, die neuen Abrechnungen mit {run} %.» Für das Szenario Z. 297 bleibt der Text damit gleich.
  - Eigener Satz: «Erstellt mit {used} % Verwaltungspauschale; im Mietvertrag ist heute ein Satz von {own} % vereinbart.»
  - Nicht vereinbart: «Erstellt mit {used} % Verwaltungspauschale; im Mietvertrag ist heute keine Verwaltungspauschale vereinbart.»

  Für versendete Abrechnungen im Fall «nicht vereinbart» genügt der Hinweis auf die Berichtigung wie in `statements_later_sent` («Verlangt die Abrechnung zu viel, schulden Sie dem Mieter die Differenz …»). Die beiden neuen Fälle bekommen je einen Test unterhalb E2E.

### V-3 (Minor): Bei versendeten Abrechnungen fehlt der Grund «Rechnungen geändert»

- **Beleg:** Regel (a) gilt nur für Entwürfe, die Regeln (b) und (c) für jeden Status. Die Detailseite warnt auch bei versendeten Abrechnungen (`statements_later_sent`, `messages/de.json:1026`).
- **Warum:** Erscheint eine versendete Abrechnung wegen des Heizprofils in der Liste, verschweigt die Liste, dass ihr auch Rechnungen fehlen. Der Entscheid in #132 nennt nur «outdated drafts». Das ist also gedeckt, aber widersprüchlich.
- **Korrektur:** Steht eine Abrechnung ohnehin in der Liste, auch Grund (a) nennen (Text wie `statements_later_sent` gekürzt). Oder die Entscheidung so lassen und in #132 begründen. Das ist eine Produktfrage.

### V-4 (Minor): Abrechnungen einer anderen Abrechnungsperiode

- **Beleg:** geplant «existing statements whose period overlaps the run's». `statements_building_billed_*` (`messages/de.json:1126-1129`) sprechen von einer Abrechnung, «die diese Abrechnungsperiode ganz oder teilweise abdeckt».
- **Warum:** Nach einem Wechsel von Juli–Juni auf das Kalenderjahr überschneidet sich die Abrechnung 01.07.2023–30.06.2024 mit 2024. Dass sie einen anderen Satz oder ein anderes Heizprofil hat, ist kein Widerspruch: Die Heizkosten einer anderen Periode werden getrennt verteilt. «Die neuen Abrechnungen» betreffen dort andere Tage.
- **Korrektur:** Die Regeln (b) und (c) nur auf Abrechnungen mit gleichem Beginn und gleichem Ende anwenden. Regel (a) gilt weiter für alle, die sich überschneiden.

### V-5 (Minor): Begriff «veralteter Entwurf» fehlt im Glossar

- **Beleg:** Szenario Z. 310 «Von der Vorschau zu einem veralteten Entwurf». `UBIQUITOUS_LANGUAGE.md` kennt Entwurf (Z. 169), aber nicht «veraltet».
- **Korrektur:** Entweder den Titel umformulieren, zum Beispiel «Von der Vorschau zu einem Entwurf, dem eine Rechnung fehlt», oder `TODO(fachlich prüfen, #…)` mit einem Issue (Labels `fachlich`, `entscheiden`). Vorschlag für den Glossareintrag:
  > **Veralteter Entwurf**: Entwurf einer Nebenkostenabrechnung, für dessen Abrechnungsperiode seit dem Erstellen Rechnungen erfasst, geändert oder gelöscht wurden, gemessen an den gespeicherten Rechnungen seiner Abrechnungspositionen (#96); der Tankbestand zählt nicht (#307). Code: `changedInvoices`.

### V-6 (Minor): Ton des Hinweises neben PR #298

- **Beleg:** PR #298 (offen) setzt den Ton auf «info», wenn alle abgerechneten Mietverträge ganz abgedeckt sind.
- **Warum:** Ein veralteter Entwurf oder andere Einstellungen sind ein Grund zur Vorsicht, auch wenn die Abdeckung vollständig ist.
- **Korrektur:** Nennt die Liste mindestens eine Abrechnung, bleibt der Ton «caution» (Regel und Test in der Umsetzung, die zuletzt gemergt wird).

### V-7 (Minor): Lücken in der Abdeckung durch Szenarien

- **Beleg:** Alle fünf Szenarien verwenden einen Entwurf und den Satz des Laufs.
- **Korrektur:** Mindestens ein Test unterhalb E2E je Fall:
  - eine versendete Abrechnung mit anderem Heizprofil erscheint, eine versendete veraltete ohne andere Einstellungen nicht (Regel a nur für Entwürfe);
  - ein eigener Satz im Mietvertrag;
  - «nicht vereinbart» mit gespeicherten 0 % ergibt keinen Hinweis (M-1);
  - eine Abrechnung mit `management_fee_percent` = null (Spalte nullable, `schema.ts:399`) wird wie 0 behandelt und zeigt nicht «Erstellt mit  %».

### V-8 (Nit): Heizprofil bei einem Mietvertrag über die ganze Periode

Für einen Mietvertrag über die ganze Periode zählt das Heizprofil nicht (`heating_share.byDays`, `reason: 'wholePeriod'`). Der Hinweis wäre dort Rauschen. Vorschlag: Regel (b) nur, wenn `heating_share.byDays === false`. Entweder bei der bestehenden Abrechnung oder bei der neuen dieses Mietvertrags, falls sie nach Heizprofil verteilt würde.

### V-9 (Nit): Gelöschtes Heizprofil

`heating_profile_id` hat `onDelete: 'set null'` (`schema.ts:402`). Text für diesen Fall: «Erstellt mit einem Heizprofil, das es nicht mehr gibt.» Der Name steht noch in `heating_share.names`, wo vorhanden.

### V-10 (Nit): Folgen des Löschens

Ein gelöschter Entwurf verliert Notiz und Zahlungsfrist (das Einzige, was sich bearbeiten lässt, `src/routes/statements/[id]/edit/+page.server.ts:15`). Seine Abrechnungsnummer wird nicht wieder vergeben (Szenario Z. 77–87, #97). Bis «Neu berechnen» kommt (Option 4), könnte der Hinweis das in einem Halbsatz sagen.

### V-11 (Nit): Zahlenformat

`management_fee_percent` ist `decimal(5,2)` und wird als «3.00» gespeichert. Das Szenario verlangt «3 %» und «4.5 %». Die Anzeige formatiert wie das Feld im Assistenten, ohne nachgestellte Nullen.

## Fehlende Begriffe

- «Veralteter Entwurf»: Vorschlag unter V-5. Labels `fachlich`, `entscheiden`.
- «Abrechnungsnummer» im Linktext «NK-…, <Mieter>»: Der Begriff fehlt schon, das Issue ist offen (#294, Marker Z. 77). Kein neues Issue nötig.

## Nicht bestätigt

- **Art. 269d OR** (Fedlex, Abs. 3: «… namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen»): Ob ein höherer Satz des Laufs gegenüber früheren Abrechnungen desselben Mieters eine einseitige Vertragsänderung ist, habe ich nicht geprüft. Hier geht es um verschiedene Mieter derselben Periode, nicht um denselben Mieter über mehrere Jahre. `contracts_fee_help` (`messages/de.json:699`) behandelt nur die neue Vereinbarung. **unsicher**, nicht Gegenstand dieser Änderung.
- **Ob sich die gesamte Verteilung auf die Mieter bei gemischten Heizprofilen** (Nachrechnung oben) mit Art. 257b Abs. 1 OR anfechten lässt: Rechtsprechung habe ich nicht gesucht. **unsicher**.
- **Übersetzungen fr/it/en** der geplanten Texte: Es liegen noch keine vor. Nicht geprüft.
- **Umsetzung von PR #298:** Nicht gelesen. Ich stütze mich nur auf die Beschreibung des Aufrufers.
- **Ob `POST statements/generate` beim Seed die Rechnungen in den Positionen speichert** (Voraussetzung für Z. 300): Nur aus `changedInvoices` und dem Kommentar zu #96 geschlossen, nicht im Generierungscode nachgelesen. Ohne gespeicherte Rechnungen greift der Pfad `recordedAfter`, der dasselbe Ergebnis liefert.

Quellen der Gesetzestexte: Fedlex-Filestore, VMWG Fassung 20251001 und OR Fassung 20261001 (über `fedlex.data.admin.ch/sparqlendpoint` gefunden).
