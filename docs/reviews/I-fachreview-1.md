# Fachreview I, Runde 1: Mietvertrag auf einen gewählten Tag beenden

Geprüft wurde der Branch `claude/relaxed-ride-tciycq` (`git diff origin/main...HEAD`, Stand 8f8524c). Der Auftrag des Product Owners: Ein Mietvertrag soll auf ein Datum in der Zukunft beendet werden können, wenn der Mieter auf einen bestimmten Tag kündigt. Bisher ging nur «heute».

Umgesetzt ist:

- «Beenden» öffnet einen Dialog mit dem Feld «Vertragsende». Es ist leer, kein Tag ist vorgeschlagen. Erlaubt ist heute oder später, nie vor dem Vertragsbeginn (`contractEndError` in `src/lib/contract-status.ts`, Aktion `end` in `src/routes/contracts/[id]/+page.server.ts`).
- Ein früheres Vertragsende geht nur unter «Bearbeiten» (Assistent, ohne Warnung).
- Der Vertrag ist bis und mit dem Vertragsende «Laufend», danach «Beendet» (`contractStatusOn`).
- Löschen: wie bisher nur mit Vertragsende. Neu ist ein laufender Vertrag mit künftigem Ende bis zu diesem Tag gesperrt.
- Keine Prüfung von Kündigungsfrist oder -termin, kein Feld für den Eingang der Kündigung, keine Erinnerung auf der Übersicht.

Grundlagen:

- Code: `src/lib/contract-status.ts`, `src/routes/contracts/[id]/+page.svelte` und `+page.server.ts`, `src/routes/contracts/new/PeriodStep.svelte`, `src/lib/server/statement-generation.ts`, `backend/src/services/calculation.service.ts`, `prorating.service.ts`, `heating-profile.service.ts` (`calculateHeatingShare`), `contract.service.ts`, `apartment.service.ts` (`apartmentStatus`), `pdf.service.ts` (Empfängeradresse)
- Tests: `backend/src/__tests__/prorating.pg.test.ts`, `advance-payments.test.ts`, die Szenarien in `tests/e2e/features/contract-detail.feature`
- `UBIQUITOUS_LANGUAGE.md`, `docs/PRD-Dwello.md` (5.4), `docs/design/offene-punkte.md` (Session 12), `docs/design/design-decisions.md` (Session 12), `docs/reviews/I-review-1.md` bis `I-review-3.md`
- Quellen im Netz (gelesen über Suchzusammenfassungen):
  - Art. 266c OR, Wortlaut: [droit-bilingue.ch, Art. 266c OR](https://www.droit-bilingue.ch/de-en/2/22/220-266c-318.html)
  - Fristen, Termine, Art. 266a Abs. 2 OR: [Gerichte Zürich, Ordentliche Kündigungsfristen und -termine](https://www.gerichte-zh.ch/de/themen/miete/kuendigung-rueckgabe), [MV-Merkblatt Kündigung durch Mieter](https://www.mieterverband.ch/dam/jcr:18f9d5c2-25b3-40d5-88f1-478854d91144/Merkblatt_Kuendigung_Mieter.pdf), [Kanton Zug, Kündigung Mietvertrag](https://publiclogin2.zg.ch/dam/jcr:d34b55d3-ff27-44f1-875e-bffc8431e0cf/K%C3%BCndigung%20Mietvertrag.pdf)
  - Form, Familienwohnung (Art. 266l, 266m OR): [law.ch, Besondere Bestimmungen zur Miete von Wohn- und Geschäftsräumen](https://law.ch/lawinfo/wohnungsmiete/besondere-bestimmungen-im-or-zur-miete-von-wohn-und-geschaeftsraeumen/), [law.ch, Kündigung der Familienwohnung](https://law.ch/lawinfo/mietvertragskuendigung/kuendigung-des-mietvertrages/kuendigung-der-familienwohnung/), [Kanton Bern, amtliches Kündigungsformular](https://www.zsg.justice.be.ch/content/dam/zsg_justice/dokumente/de/zivilrecht/formular-kuendigung-miete-be.pdf)
  - Ortsübliche Termine: [SRF, Übersicht Zügeltermine](https://www.srf.ch/static/radio/modules/data/attachments/2010/100324_zuegeltermine_uebersicht.pdf), [comparis.ch, Zügeltage](https://www.comparis.ch/immobilien/umzug/vor-dem-umzug/zuegeltage)
  - Vorzeitige Rückgabe (Art. 264 OR): [Gerichte Zürich, Vorzeitige Rückgabe der Mietsache](https://www.gerichte-zh.ch/de/themen/miete/kuendigung-rueckgabe/vorzeitige-rueckgabe-der-mietsache), [law.ch, Vorzeitige Rückgabe OR 264](https://law.ch/lawinfo/nachmieter-vorzeitige-rueckgabe/vorzeitige-rueckgabe-or-264)
  - Rückgabetag: [Beobachter, Wann muss ich die Wohnung abgeben?](https://www.beobachter.ch/wohnen/umzug/wohnungswechsel-wann-muss-ich-die-wohnung-abgeben)
  - Abrechnung beim Auszug: [cash.ch, Nebenkosten](https://www.cash.ch/dossier/hypotheken/lassen-sie-die-nebenkosten-nicht-zur-nebensache-verkommen-409058)

**Nicht auf Fedlex gelesen:** fedlex.admin.ch war aus der Umgebung nicht erreichbar, ebenso die Seiten von Mieterverband und Gerichten Zürich im Volltext. Den Wortlaut von Art. 264, 266, 266a, 266c, 266l–266o OR und Art. 4 VMWG kenne ich aus den Zusammenfassungen der genannten Quellen. Rechtliche Aussagen unten sind deshalb mit **(unsicher)** markiert, wo sie über diese Zusammenfassungen hinausgehen. Kantonale Termine sind nicht abschliessend geprüft (siehe IF-2).

## Übersicht

| Nr. | Stufe | Kurz | Gehört zu |
|---|---|---|---|
| – | – | **Kein kritisches Finding.** Die Kernregel «Vertragsende = letzter Tag, bis und mit» ist richtig, die Abrechnung rechnet den letzten Tag mit | – |
| IF-1 | hoch | Ein beendeter Mietvertrag ohne Abrechnung lässt sich löschen, auch wenn seine Periode noch nicht abgerechnet ist. Dann fehlt die Abrechnung des Mieters, und seine Tage werden Leerstand | eigener Produktentscheid, vor dem ersten Einsatz |
| IF-2 | mittel | Kein Hinweis auf Frist, Termin und Form der Kündigung. Ein zu frühes Datum (falscher Termin, Auszugstag statt Kündigungstermin) macht die Wohnung zu früh leer und verschiebt Kosten zum Vermieter | diese Änderung (nur Hilfetext) |
| IF-3 | mittel | «Nicht vor heute» passt schlecht zur Praxis: Kündigungen werden oft spät erfasst. Der Umweg «Bearbeiten» nennt den Vertrag dann «Befristet … ohne Kündigung» | diese Änderung (Text) und Produktentscheid (Regel) |
| IF-4 | mittel | Befristet und gekündigt sind im Modell dasselbe (Vertragsende gesetzt). Der Assistent beschreibt einen gekündigten Vertrag rechtlich falsch | eigener Produktentscheid |
| IF-5 | mittel | Keine Erinnerung an das bevorstehende Vertragsende. Die Wohnung zeigt bis zum letzten Tag nur «Vermietet» | eigener Produktentscheid (vermerkt) |
| IF-6 | mittel | Die Schlussabrechnung geht an die gespeicherte Mieteradresse. Nach dem Auszug ist das meist die alte Wohnung | eigener Produktentscheid |
| IF-7 | niedrig | Begriffe: «gekündigt» und «frei» sind keine Glossarbegriffe. Vorschläge für Text und Glossar | diese Änderung |
| IF-8 | niedrig | Ein Vertragsende unter «Bearbeiten» kann in eine schon abgerechnete Periode zurückreichen. Die gespeicherte Abrechnung stimmt dann nicht mehr | eigener Produktentscheid (bestehend) |
| IF-9 | niedrig | Stillschweigende Fortsetzung eines befristeten Vertrags (Art. 266 Abs. 2 OR) ist nicht abbildbar: Dwello zeigt «Beendet» und Leerstand, obwohl der Mieter bleibt | eigener Produktentscheid (bestehend) |
| IF-10 | niedrig | «Heute» im Backend in UTC (bzw. `current_date` der Datenbank): um Mitternacht kurz falscher Mietstatus | bestehend, vermerkt (R5-4, I-10) |

---

## Geprüft, ohne Befund

- **Letzter Tag inklusive (Frage 1):** In der Schweiz kündigt man «auf» einen Termin, z.B. «auf den 31. März». Das Mietverhältnis endet mit diesem Tag. Die Rückgabe ist an diesem Tag fällig, nach Ortsgebrauch oder Vertrag oft am nächsten Werktag, wenn der Termin auf einen Sonntag oder Feiertag fällt ([Beobachter](https://www.beobachter.ch/wohnen/umzug/wohnungswechsel-wann-muss-ich-die-wohnung-abgeben)). Die Mietzinspflicht läuft bis und mit dem Termin. «Bis und mit diesem Tag läuft der Mietvertrag» ist also richtig. Die Folgemiete beginnt am Tag danach. Das passt zur Überschneidungsprüfung: `checkContractOverlap` lässt einen Nachfolger ab dem Folgetag zu und lehnt denselben Tag ab (`contract.service.ts:200-233`).
- **Mietstage bis und mit dem Vertragsende (Frage 5):** `calculateDaysBetween` zählt inklusive (`prorating.service.ts:49-54`). Ein Vertrag bis 30.06.2024 hat 182 Tage, der Juli 31 Tage Leerstand (`prorating.pg.test.ts:44-93`). Auszug ohne Nachmieter: Leerstand vom Folgetag bis Periodenende (`:79-93`).
- **Akonto:** Pro Kalendermonat, ein angebrochener Monat tagesgenau (`calculateTotalAdvancePayments`, `calculation.service.ts:197-215`). Getestet für Ein- und Auszug unter dem Jahr (`advance-payments.test.ts:24`, 16.03.–15.09. = 902.42). Ein Vertragsende am 15. ergibt also den halben Monat. Richtig.
- **Heizkosten:** Nach Heizprofil, angebrochene Monate tagesgenau (`calculateHeatingShare`, `heating-profile.service.ts:324ff.`). Ich habe den Monatsanteil für ein Ende am 15.03. und am 31.03. (auch über die Sommerzeit-Umstellung) von Hand nachgerechnet: 15 bzw. 31 Tage. Die Rundung mit `Math.ceil` fängt den Zeitzonenversatz ab.
- **Abrechnung für den ausziehenden Mieter:** Der Abrechnungslauf nimmt jeden Vertrag, der die Periode berührt (`contractsInPeriod`, `statement-generation.ts:39-61`). Ein Mieterwechsel ergibt zwei Abrechnungen. `movedOut` unterdrückt beim Ausgezogenen den Vorschlag, das Akonto zu erhöhen. Eine Zwischenabrechnung beim Auszug ist in der Schweiz nicht üblich und ohne Vereinbarung nicht geschuldet; der Mieter erhält die ordentliche Abrechnung nach Periodenende ([cash.ch](https://www.cash.ch/dossier/hypotheken/lassen-sie-die-nebenkosten-nicht-zur-nebensache-verkommen-409058)). Das entspricht dem jetzigen Ablauf.
- **Wohnung danach leer:** `apartmentStatus` zeigt «Vermietet», solange ein Vertrag heute läuft, sonst «Wiedervermietet», wenn ein künftiger Vertrag besteht, sonst den von Hand gesetzten Status (`apartment.service.ts:31-40`). Am Tag nach dem Vertragsende wechselt die Wohnung also auf Leer oder Wiedervermietet. Eine Doppelbelegung ist durch die Überschneidungsprüfung ausgeschlossen.
- **Löschsperre (Frage 4, erster Teil):** Richtig. Ein gekündigter, aber laufender Vertrag ist ein lebendes Mietverhältnis. Mietzins, Akonto und die Abrechnung hängen daran. Ihn zu löschen wäre ein Datenverlust. Vorher konnte man einen Vertrag direkt nach «Beenden» (Ende heute, also noch laufend) löschen; das ist jetzt zu.
- **Befristete Verträge:** «Beenden» erscheint nur ohne Vertragsende. Ein befristeter Vertrag lässt sich also nicht versehentlich überschreiben; eine Verkürzung (z.B. vorzeitige Rückgabe mit Ersatzmieter) geht unter «Bearbeiten». Das ist vertretbar.

---

## IF-1 (hoch): Beendeter Vertrag ohne Abrechnung lässt sich löschen, auch in einer offenen Periode

- **Was:** Der Löschdialog sperrt nur Verträge ohne Ende und neu laufende Verträge. Ein beendeter Vertrag ohne Abrechnung lässt sich löschen (`deleteContract`, `contract.service.ts:332-357`, prüft nur `utility_statements`). Fall: Mieter kündigt auf den 31.03.2026. Im April räumt der Verwalter auf und löscht den beendeten Vertrag. Die Nebenkosten 2026 sind noch nicht abgerechnet.
- **Folge:**
  - Der Abrechnungslauf 2026 findet den Vertrag nicht mehr. Der Mieter erhält keine Abrechnung über drei Monate Akonto.
  - `calculateApartmentProrating` zählt Januar bis März als Leerstand. Die Kosten dieser Tage trägt der Vermieter.
  - Der Mieter hat Anspruch auf eine Abrechnung über seine Akontozahlungen (Art. 257b OR, Art. 4 VMWG: Abrechnung mindestens jährlich, **unsicher**, Wortlaut nicht auf Fedlex gelesen). Eine Rückforderung wäre nicht mehr belegbar.
  - Die PRD verlangt eine Historie aller Mieter («Audit trail: Historical record of all past tenants», `docs/PRD-Dwello.md` 5.3).
- **Warum hier:** Der Dialog sagt «Ein Mietvertrag mit Nebenkostenabrechnungen kann nicht gelöscht werden.» Ein unerfahrener Verwalter liest das als «ohne Abrechnung darf ich löschen». Die Persona Anna (Lauf I, R2) hat genau das getan. Review I-3 (K-4) hat es als Text-Lücke vermerkt, nicht als Geldfolge.
- **Fix:**
  - Kurz: Löschen eines Vertrags sperren, der Tage in einer noch nicht abgerechneten Periode hat. Pragmatisch: gesperrt, wenn der Vertrag begonnen hat und nicht für jede Periode bis zu seinem Ende eine Abrechnung besteht. Noch einfacher: löschen nur, solange der Vertrag nie gelaufen ist (künftig) oder irrtümlich erfasst wurde. Ein beendeter Vertrag bleibt als Historie.
  - Text im Dialog: «Der Mietvertrag lief bis am {Datum}. Er wird für die Nebenkostenabrechnung gebraucht und kann nicht gelöscht werden.»
  - Test (`*.pg.test.ts`): beendeter Vertrag, Periode ohne Abrechnung → Löschen abgelehnt.
- **Gehört zu:** eigener Produktentscheid. Bestand vorher, ist aber vor dem ersten Einsatz zu lösen, weil die Folge Geld kostet.

## IF-2 (mittel): Kein Hinweis auf Frist, Termin und Form

- **Was:** Der Dialog nimmt jeden Tag ab heute an. Er sagt nichts zur Kündigungsfrist, zum Kündigungstermin und zur Form.
- **Warum (Rechtslage, Zusammenfassung):**
  - Wohnungen: 3 Monate Frist auf einen ortsüblichen Termin, ohne Ortsgebrauch auf das Ende einer dreimonatigen Mietdauer (Art. 266c OR, [droit-bilingue.ch](https://www.droit-bilingue.ch/de-en/2/22/220-266c-318.html)). Kürzere Fristen sind nicht vereinbar, längere schon. Der Vertrag geht vor.
  - Termine sind kantonal und kommunal verschieden: z.B. Stadt Bern 30. April und 31. Oktober, Basel und andere jedes Monatsende ausser Dezember, Zürich verbreitet Ende März und Ende September ([SRF-Übersicht](https://www.srf.ch/static/radio/modules/data/attachments/2010/100324_zuegeltermine_uebersicht.pdf), [comparis.ch](https://www.comparis.ch/immobilien/umzug/vor-dem-umzug/zuegeltage); **unsicher**, Quellen teils alt und nicht amtlich).
  - Eine Kündigung auf einen falschen Termin oder mit zu kurzer Frist gilt auf den nächsten zulässigen Termin (Art. 266a Abs. 2 OR, [Gerichte Zürich](https://www.gerichte-zh.ch/de/themen/miete/kuendigung-rueckgabe)).
  - Form: schriftlich (Art. 266l Abs. 1 OR). Bei der Familienwohnung braucht es die ausdrückliche Zustimmung des Ehegatten (Art. 266m OR). Ohne sie ist die Kündigung nichtig ([law.ch](https://law.ch/lawinfo/mietvertragskuendigung/kuendigung-des-mietvertrages/kuendigung-der-familienwohnung/)). Kündigt der Vermieter, braucht er das amtliche Formular des Kantons (Art. 266l Abs. 2 OR), sonst ist die Kündigung nichtig (Art. 266o OR).
  - Zieht der Mieter früher aus, haftet er bis zum Termin, ausser er stellt einen zumutbaren Ersatzmieter (Art. 264 OR, [Gerichte Zürich](https://www.gerichte-zh.ch/de/themen/miete/kuendigung-rueckgabe/vorzeitige-rueckgabe-der-mietsache)).
- **Echter Schaden:** Der Verwalter trägt das Datum aus dem Kündigungsbrief ein, z.B. «auf den 31. Januar». Gilt rechtlich der 31. März, ist die Wohnung in Dwello zwei Monate zu früh leer. Die Nebenkosten dieser zwei Monate gehen in der Abrechnung an den Vermieter, das Akonto wird nicht mehr gerechnet. Gleiches, wenn er den Auszugstag statt des Kündigungstermins einträgt. Dazu kommt das Risiko, die Wohnung auf eine nichtige Kündigung hin weiterzuvermieten.
- **Was ein MVP muss:** keine Rechtsprüfung, keine Terminliste. Die Termine hängen von Gemeinde und Vertrag ab; eine automatische Prüfung wäre oft falsch und wäre Rechtsberatung. Es genügt ein kurzer, sichtbarer Hinweis am Feld, damit der Laie die drei Fehler kennt.
- **Fix (Text, diese Änderung):** Hilfe unter dem Feld, z.B.:
  > Der letzte Tag des Mietverhältnisses, also der Kündigungstermin, zum Beispiel der 31. März. Nicht der Auszugstag: Zieht der Mieter früher aus, läuft der Mietvertrag trotzdem bis zu diesem Tag. Prüfen Sie Frist und Termin im Mietvertrag. Für Wohnungen gelten mindestens 3 Monate auf einen Kündigungstermin. Ist die Kündigung zu spät, gilt sie auf den nächsten Termin.

  Optional ein zweiter Satz unter dem Feld (nicht als Tooltip): «Die Kündigung muss schriftlich sein, bei Ehepaaren von beiden unterschrieben.» Alle diese Begriffe mit `TODO(fachlich prüfen)` und Eintrag in `offene-punkte.md`.
- **Später, Produktentscheid:** ein sanfter Hinweis (keine Sperre), wenn das Vertragsende weniger als 3 Monate nach heute liegt: «Liegt die Kündigung beim Mieter weniger als 3 Monate vor diesem Tag? Dann gilt sie wohl erst auf den nächsten Termin. Ausnahme: Ein Ersatzmieter übernimmt.» Eine Sperre ist falsch, weil Ersatzmieter, Aufhebungsvereinbarung und spät erfasste Kündigungen legitim kürzere Abstände ergeben. Ein Feld «Kündigung erhalten am» ist erst mit dieser Prüfung sinnvoll; bis dahin genügen die Notizen des Vertrags.

## IF-3 (mittel): «Nicht vor heute» und der Umweg über «Bearbeiten»

- **Was:** Der Dialog lehnt ein Vertragsende vor heute ab und schickt zu «Bearbeiten». Der Assistent nimmt jedes Datum ohne Rückfrage an und nennt den Vertrag «Befristet: Der Mietvertrag endet an einem festen Tag, ohne Kündigung» (`PeriodStep.svelte:29-39`).
- **Warum:** Die Zielgruppe nutzt Dwello wenige Male im Jahr. Eine Kündigung wird oft erst erfasst, wenn der Mieter schon weg ist, spätestens bei der Nebenkostenabrechnung. Ein Vertragsende in der Vergangenheit ist also ein häufiger, legitimer Fall. Fachlich ist an einem Ende in der Vergangenheit nichts falsch, solange es stimmt.
- **Beurteilung:** Die Regel schützt vor einem Versehen (Tippfehler im Jahr, «heute» aus Gewohnheit). Das ist für Laien ein guter Grund. Der Umweg ist für das MVP vertretbar, weil die Fehlermeldung sagt, wohin. Schlecht ist, dass der Umweg den Laien mit einem falschen Begriff empfängt: Er hat eine Kündigung, der Assistent spricht von «befristet, ohne Kündigung» (siehe IF-4).
- **Fix:**
  - Diese Änderung (Text): Fehlermeldung präziser, z.B. «Das Vertragsende liegt vor heute. Ist der Mieter schon ausgezogen, tragen Sie das Vertragsende unter «Bearbeiten» ein.»
  - Produktentscheid (besser): ein Ende vor heute im Dialog zulassen, mit Bestätigung der echten Folge: «Der Mietvertrag gilt seit dem 01.10.2026 als beendet. Die Wohnung gilt ab dann als leer.» Ablehnen nur, wenn eine gespeicherte Abrechnung den Zeitraum nach dem neuen Ende schon enthält (siehe IF-8).

## IF-4 (mittel): Befristet und gekündigt sind dasselbe Feld

- **Was:** Das Glossar definiert «Vertragsende» als «leer bei unbefristeten Verträgen». Nach der Kündigung hat ein unbefristeter Vertrag ein Vertragsende. Unter «Bearbeiten» erscheint er als «Befristet … ohne Kündigung».
- **Warum:** Rechtlich sind das zwei Dinge. Ein befristeter Vertrag endet ohne Kündigung am vereinbarten Tag; wird er stillschweigend fortgesetzt, gilt er als unbefristet (Art. 266 OR, **unsicher**). Ein unbefristeter Vertrag endet durch Kündigung; ist sie nichtig oder zu spät, läuft er weiter oder endet später (Art. 266a Abs. 2, 266o OR). Wer «befristet» liest, prüft keine Kündigung mehr. Die Persona Helga hat das bemerkt (vermerkt in `offene-punkte.md`, Session 12).
- **Fix (Produktentscheid):** Im Assistenten bei einem unbefristeten Vertrag mit Ende den Text «Unbefristet, gekündigt auf den {Datum}» zeigen. Technisch reicht ein Merker, ob das Ende vereinbart (befristet) oder durch Kündigung gesetzt ist. Glossar: Definition von «Vertragsende» anpassen lassen (nicht selbst ändern), Vorschlag in `offene-punkte.md`: «Letzter Tag des Mietverhältnisses: bei befristeten Verträgen vereinbart, bei unbefristeten der Kündigungstermin. Leer, solange ein unbefristeter Vertrag nicht gekündigt ist.»

## IF-5 (mittel): Keine Erinnerung an das bevorstehende Ende

- **Was:** Bis zum letzten Tag zeigt die Wohnung «Vermietet», ohne Hinweis auf das Ende. Die Übersicht erinnert nicht.
- **Warum:** In der Kündigungszeit fallen Aufgaben an: Wiedervermietung (sonst Leerstand zulasten des Vermieters), Wohnungsabnahme, Rückgabe des Mietzinsdepots, neue Adresse für die Abrechnung (IF-6). Ein Laie, der Dwello selten öffnet, verpasst sie. Das ist kein Rechtsfehler, aber ein realer Geldschaden (Leerstand).
- **Fix (Produktentscheid, vermerkt):** In der Übersicht: «Der Mietvertrag von {Name}, Wohnung {Nr}, endet am {Datum}.» In Wohnungsliste und -seite neben «Vermietet» das Ende nennen: «Vermietet bis 31.03.2027».

## IF-6 (mittel): Adresse für die Schlussabrechnung

- **Was:** Die Abrechnung geht an `tenant.address` (`pdf.service.ts:457`). Nach dem Auszug ist das meist die Adresse der verlassenen Wohnung. Dwello fragt beim Beenden nicht nach der neuen Adresse.
- **Warum:** Die Abrechnung des Ausgezogenen kommt Monate später. Geht sie an die alte Adresse, kommt sie zurück oder an den Nachmieter (Datenschutz). Eine Nachzahlung wird nicht bezahlt, eine Rückerstattung nicht abgeholt.
- **Fix (Produktentscheid):** Nach dem Beenden ein Hinweis mit Link: «Bitten Sie {Name} um die neue Adresse und tragen Sie sie beim Mieter ein. Dorthin geht die Nebenkostenabrechnung.» Im Abrechnungsassistenten bei ausgezogenen Mietern (`movedOut`) warnen, wenn die Mieteradresse gleich der Gebäudeadresse ist.

## IF-7 (niedrig): Begriffe

- **«Vertragsende»** und **«Vertragsbeginn»** sind Glossarbegriffe und richtig verwendet. **«Laufend» / «Beendet»** entsprechen «Vertragsstatus».
- **«gekündigt»** ist kein Glossarbegriff. In der Schweizer Praxis heisst der Tag, auf den gekündigt wird, **Kündigungstermin**; die Zeit davor **Kündigungsfrist**. Vorschlag für den Hilfetext: «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin, zum Beispiel der 31. März.» Vorschlag für `offene-punkte.md` (Glossar nicht selbst ändern):
  - **Kündigung:** Schriftliche Erklärung von Mieter oder Vermieter, dass ein unbefristeter Mietvertrag auf einen Kündigungstermin endet.
  - **Kündigungstermin:** Tag, auf den gekündigt wird. Er wird zum Vertragsende.
  - **Kündigungsfrist:** Zeit zwischen dem Eingang der Kündigung und dem Kündigungstermin; bei Wohnungen mindestens 3 Monate.
- **«Ab dem Tag danach ist die Wohnung frei»:** «frei» ist kein Wert des Mietstatus. Ausserdem zeigt Dwello danach den von Hand gesetzten Status, also auch «Gesperrt». Vorschlag: «Ab dem Tag danach gilt die Wohnung als leer, wenn kein neuer Mietvertrag beginnt.» Oder ohne Statusbegriff: «Ein neuer Mietvertrag kann am Tag danach beginnen.» Das ist zugleich die nützlichere Information.
- **Fix:** diese Änderung, Text und Eintrag in `offene-punkte.md`.

## IF-8 (niedrig): Vertragsende rückwirkend in eine abgerechnete Periode

- **Was:** `updateContract` prüft nur Überschneidungen (`contract.service.ts:293-326`). Unter «Bearbeiten» lässt sich ein Ende setzen, das vor dem Ende einer schon gespeicherten Abrechnung liegt. Die Abrechnung behält ihre alten Mietstage.
- **Warum:** Danach widersprechen sich Vertrag und Abrechnung; eine neue Abrechnung des Nachmieters würde dieselben Tage nochmals verrechnen, falls die Perioden sich decken. Selten, aber gerade beim späten Erfassen (IF-3) denkbar.
- **Fix (Produktentscheid):** Warnung oder Ablehnung im Assistenten: «Für diesen Mietvertrag gibt es eine Nebenkostenabrechnung bis {Datum}. Ein früheres Vertragsende ändert sie nicht. Löschen Sie den Entwurf und erstellen Sie ihn neu.» Bei versandten Abrechnungen ablehnen.

## IF-9 (niedrig): Stillschweigende Fortsetzung

- **Was:** Bleibt ein Mieter nach dem Ende eines befristeten Vertrags mit Wissen des Vermieters, gilt der Vertrag als unbefristet fortgesetzt (Art. 266 Abs. 2 OR, **unsicher**). Dwello zeigt «Beendet» und rechnet Leerstand.
- **Warum:** Die Kosten der Zeit gehen dann an den Vermieter statt an den Mieter. Bestand schon vorher. Die neue Funktion macht Verträge mit Ende häufiger.
- **Fix (Produktentscheid):** Unter «Bearbeiten» «Unbefristet» wählen (geht heute schon). Ein Hinweis in der Übersicht nach Ablauf (IF-5) würde den Fall sichtbar machen.

## IF-10 (niedrig): «Heute» in UTC

- `contract.service.ts:86` und `apartment.service.ts:152, 254` rechnen «heute» in UTC, `apartmentStatus` mit `current_date` der Datenbank. In der Nacht nach dem Vertragsende kann die Wohnung bis zu zwei Stunden noch «Vermietet» heissen. Fachlich ohne Geldfolge, bereits vermerkt (R5-4, I-10). Kein weiterer Fix in dieser Änderung.

---

## Antworten auf die Fragen

1. **Vertragsende als letzter Tag, bis und mit:** richtig (siehe «Geprüft, ohne Befund»). Wörter: «Kündigungstermin» statt «der Tag, auf den gekündigt ist»; «leer» statt «frei» (IF-7).
2. **«Nicht vor heute»:** vertretbar als Schutz für Laien, aber nicht fachlich geboten. Späte Erfassung ist häufig. Der Umweg ist für das MVP annehmbar, wenn die Meldung den Fall «schon ausgezogen» nennt; der falsche Begriff «Befristet» auf dem Umweg ist zu beheben (IF-3, IF-4).
3. **Fristen, Termine, Form:** Das MVP muss nichts prüfen, aber kurz darauf hinweisen (IF-2). Prüfung, Terminliste und Eingangsdatum sind spätere Produktentscheide. Befristete Verträge sind richtig ausgenommen, ihre Abgrenzung zum gekündigten Vertrag fehlt (IF-4).
4. **Löschsperre:** richtig. Das Löschen beendeter Verträge ohne Abrechnung ist aber gefährlich, solange ihre Periode nicht abgerechnet ist (IF-1, hoch).
5. **Abrechnung:** Mietstage, Akonto und Heizkosten rechnen das Vertragsende inklusive. Der Ausgezogene erhält seine Abrechnung im ordentlichen Lauf. Die Wohnung wird am Folgetag leer oder wiedervermietet. Offen ist nur die Adresse (IF-6).
6. **Weiteres:** Leerstand zu früh durch falschen Termin (IF-2), fehlende Erinnerung (IF-5), rückwirkende Änderungen (IF-8), stillschweigende Fortsetzung (IF-9). Doppelbelegung ist durch die Überschneidungsprüfung ausgeschlossen.
