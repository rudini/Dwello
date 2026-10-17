# Fachreview W3c (2. Runde, Feature-Review): Umsetzung #68, #102, #191, #114

Gegenstand: Worktree `review-feature-fach`, detached auf 04c3b05, `git diff d03ec92 04c3b05`, beschränkt auf die genannten Texte, Dienste, Bildschirme, Dokumente und die Szenarien in `tests/e2e/features`. Vorrunde: `docs/reviews/w3c-fachreview-1.md`.

Ergebnis: kein Blocker, kein Major. V-1, V-2, V-3 und V-5 aus der 1. Runde sind wie vorgeschlagen umgesetzt, V-6 zum grössten Teil. Neu: zwei UI-Texte verweisen noch auf das Feld «Adresse», das jetzt «Korrespondenzadresse» heisst. Dazu kommen Übersetzungs-Nits und ein Folgepunkt zur Mahnung.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-11 | Verwalter | Minor | `contracts_end_death` und `contracts_parties_fixed_by_law` (alle 4 Sprachen) schicken den Vermieter zum Feld «Adresse», das es seit #68 nicht mehr gibt |
| V-12 | Verwalter | Minor | fr/it/en: «saisissez-la chez le locataire», «lo inserisca presso l’inquilino», «enter it with the tenant» lassen sich als «zusammen mit dem Mieter» lesen statt «in den Angaben des Mieters» |
| V-13 | Verwalter | Minor | Mahnung: keine Warnung vor der alten Adresse, obwohl die Mahnung per Brief an dieselbe Korrespondenzadresse geht (ausserhalb von #114, Folgepunkt) |
| V-14 | Verwalter | Nit | `docs/anforderungen-vertragsende.md` A-5: Akzeptanzkriterium und «Offene Fragen» sind nach dem Vermerk «umgesetzt» veraltet (Rest von V-6) |
| V-15 | Verwalter | Nit | Übersicht: Titel und Knopf der Aufgabe lauten beide «Neue Adresse eintragen» |
| V-16 | Verwalter | Nit | `oldAddress` vergleicht das Land nicht: eine Adresse im Ausland mit zufällig gleicher Strasse und PLZ würde warnen |
| V-8 | Verwalter | Nit | (offen aus Runde 1) Ein künftiger Mietvertrag desselben Mieters verhindert die Warnung nicht |
| V-10 | Verwalter | Nit | (offen aus Runde 1) Glossar Z. 24, Code-Spalte «Land geplant (#102)»: das Feld `country` gibt es jetzt (Änderung nur durch den Product Owner) |

Mietrecht (M) und Rechtstexte (R): kein Fund, siehe «Bestätigt».

---

## Prüfung der Funde aus Runde 1

- **V-1 umgesetzt.** `backend/src/services/postal-address.ts:3-8`: Für die Nachbarländer DE, AT, LI (Deutsch), FR (Französisch) und IT (Italienisch) steht der Name in der Landessprache, für alle anderen Länder englisch, in Grossbuchstaben, für CH nichts. Nachgerechnet mit `bun -e`: DE → «DEUTSCHLAND», AT → «ÖSTERREICH», LI → «LIECHTENSTEIN», FR → «FRANCE», IT → «ITALIA», US → «UNITED STATES», PT → «PORTUGAL», CH, `null` und `''` → nichts. Die Regel gilt für alle PDF-Sprachen (Unit-Test mit einem PDF auf fr: «DEUTSCHLAND», `statement-pdf-render.test.ts:143-145`). Abrechnung (`pdf.service.ts:515-519`) und Mahnung (`reminder-pdf.ts:16-17`) verwenden dieselbe Funktion. Das schliesst auch V-9 (Unit-Test `reminder-pdf.test.ts:25`).
- **V-2 umgesetzt.** `qrTown` (`postal-address.ts:11-12`) setzt den Präfix bei jedem Land ausser CH, also auch «LI-9490 Vaduz» (nachgerechnet). Der Zahlteil (`pdf.service.ts:856`) und der Empfangsschein (`:863`, gleiche `debtor`-Zeilen) verwenden ihn. Im QR-Code stehen PLZ und Land getrennt (`qr-bill.service.ts:241-243`, `:360` `statement.tenant.country ?? 'CH'`). Für LI gibt es einen Unit-Test (`statement-pdf-render.test.ts:150`).
- **V-3 umgesetzt**, und zwar über die vorgeschlagene Alternative auf Zeilenebene: `statement-pdf-render.test.ts:145` erwartet `'Nina Brunner\nMarktstätte 3\n78462 Konstanz\nDEUTSCHLAND'`, Z. 148 `pageTexts[0]` ohne «DE-», Z. 151-153 CH ohne «SCHWEIZ» und ohne «CH-». Der Kommentar im Szenario nennt jetzt die Nachzahlung «(ohne Akonto)» (`statement-detail.feature`, Szenario «Abrechnung an eine Korrespondenzadresse im Ausland»).
- **V-5 umgesetzt.** `src/lib/server/settings.ts:24-27` rechnet MOD-97 allgemein (Buchstaben A = 10 …), `:45` prüft `^(CH|LI)\d{7}[A-Z0-9]{12}$`, also 2 + 2 + 5 Ziffern und 12 alphanumerische Zeichen (Format `5!n12!c`). Nachgerechnet mit derselben Regel:
  - LI21 0881 0000 2324 013A A → gültig; LI22 … (falsche Prüfziffer) → ungültig;
  - CH93 0076 2011 6238 5295 7 → gültig; CH94 … → ungültig;
  - DE89 3704 0044 0532 0130 00 (Prüfziffer gültig) → ungültig, wegen des Landes;
  - CH56 0483 5012 3456 7800 9 → gültig.

  Die Fehlermeldung `settings_error_iban` nennt in allen vier Sprachen beide Länder, wie #191 es entschieden hat. Die PRD (5.10, Tab 7) beschreibt jetzt eine einzige Regel.
- **V-6 zum grössten Teil umgesetzt.** Z. 34 sagt jetzt «im Mieterformular «Korrespondenzadresse»», in Z. 132 ist «bis A-5» ersetzt, A-5 ist in der Tabelle und im Titel als umgesetzt markiert, mit einem Absatz «Umgesetzt». Was noch fehlt, steht unter V-14.
- V-4 und V-7 waren nur gemeldet (die Texte sind entschieden) und bleiben so. V-8 und V-10 sind offen (Tabelle oben).

---

## V-11 (Minor): Zwei Texte verweisen noch auf das Feld «Adresse»

**Beleg.** `messages/de.json`, `contracts_end_death`: «Tragen Sie bis dahin beim Mieter unter «Adresse» die Adresse ein, an die die Post für die Erben geht …». `contracts_parties_fixed_by_law` sagt dasselbe. fr «sous « Adresse »», it «sotto «Indirizzo»», en entsprechend. Angezeigt werden die Texte in `src/routes/contracts/[id]/+page.svelte:252` und `src/routes/contracts/ContractForm.svelte:218`. Im Mieterformular heisst der Abschnitt jetzt `m.tenants_correspondence_address()` («Korrespondenzadresse», `TenantFormFields.svelte:96-97`), die Felder heissen «Strasse», «PLZ», «Ort» (`buildings_street` …). Ein Feld «Adresse» gibt es dort nicht mehr. `docs/anforderungen-vertragsende.md` Z. 34 wurde in diesem Änderungssatz schon auf «Korrespondenzadresse» korrigiert, die beiden UI-Texte nicht.

**Warum falsch.** Wer nach dem Tod eines Mieters die Post für die Erben umleiten will, sucht ein Feld, das es nicht gibt. Das widerspricht #68 und dem Glossar (Z. 24, Korrespondenzadresse).

**Behebung.** In allen vier Sprachen «unter «Adresse»» durch «unter «Korrespondenzadresse»» ersetzen (fr «sous « Adresse de correspondance »», it «sotto «Indirizzo di corrispondenza»», en «under “Correspondence address”», Begriffe aus `docs/design/i18n-begriffe.md`). Die Szenarien, die diese Texte prüfen, wären mit anzupassen. Ich habe in `tests/e2e/features` kein ««Adresse»» gefunden.

## V-12 (Minor): «beim Mieter eintragen» in fr/it/en

**Beleg.** `contracts_next_steps_text`, `…_successor`, `contracts_next_steps_address`: fr «saisissez-la chez le locataire», it «lo inserisca presso l’inquilino», en «enter it with the tenant».

**Warum.** Auf Deutsch ist «beim Mieter eintragen» im Dwello-Kontext klar: gemeint sind die Angaben des Mieters. «chez le locataire» und «presso l’inquilino» heissen aber wörtlich «bei der Person des Mieters», und «enter it with the tenant» liest man als «zusammen mit dem Mieter». In fr und it kommt die Wendung schon in bestehenden Texten vor (`contracts_end_death`), sie ist also gewohnt, aber unscharf. Im Englischen ist sie irreführend.

**Behebung (Übersetzung, kein Entscheid nötig).** en: «enter it in the tenant’s details». fr: «saisissez-la dans la fiche du locataire». it: «lo inserisca nella scheda dell’inquilino». Die deutsche Fassung ist entschieden (#114) und bleibt.

## V-13 (Minor, Folgepunkt): Mahnung an die alte Adresse

**Beleg.** `oldAddress` wird nur in Abrechnungen und Mietverträgen gelesen (`statement.service.ts:53`, `contract.service.ts:49`). Gezeigt wird die Warnung in der Vorschau des Assistenten, im Dialog «Als versendet markieren», in der Übersicht (nur bei Entwürfen, `dashboard/+page.server.ts:103-108`) und in den Nächsten Schritten. Die Mahnung geht per Brief an dieselbe Korrespondenzadresse (`reminder.service.ts:90-91`), ohne Warnung. Glossar Z. 24: «an die Abrechnungen und Mahnungen gehen».

**Warum.** Wurde eine Abrechnung trotz Warnung versendet und nicht bezahlt, ginge auch die Mahnung an die verlassene Wohnung. #114 verlangt das nicht («Done means» nennt nur das Erstellen und den Versand), darum kein Major.

**Behebung.** Ein Issue (Labels `fachlich`, `entscheiden`), Vorschlag: «Vor dem Erstellen einer Mahnung warnt Dwello wie beim Versand: «{Name} ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.»; die Mahnung bleibt möglich.»

## V-14 (Nit): Veraltete Reste in A-5

**Beleg.** `docs/anforderungen-vertragsende.md`, A-5: Das Akzeptanzkriterium sagt «Und die Adresse von "Anna Keller" ist die Adresse des Gebäudes "Ahornhof"» und «Dann warnt Dwello, dass die Adresse noch die der Wohnung ist». Darunter steht weiter «**Offene Fragen:** Genügt der Vergleich von Strasse und Postleitzahl …», obwohl der Absatz «Umgesetzt» sagt: «Die offene Frage ist entschieden».

**Behebung.** Die offene Frage streichen oder als entschieden markieren. Im Akzeptanzkriterium «Korrespondenzadresse» schreiben oder auf die Szenarien verweisen (`statement-detail.feature` «Abrechnung an einen ausgezogenen Mieter mit alter Adresse», `statement-generate.feature`, `dashboard.feature`, `contract-detail.feature`).

## V-15 (Nit): Aufgabe mit gleichem Titel und Knopf

**Beleg.** `src/lib/overview.ts:184-192`: `title: m.contracts_next_address()` und `action: m.contracts_next_address()`, beide «Neue Adresse eintragen». Der Text nennt die Warnung.

**Bewertung.** So verlangt es der Auftrag (Titel «Neue Adresse eintragen»). Ein Knopf, der den Titel wiederholt, ist eine Doppelung, aber nicht falsch. Will man sie vermeiden, könnte der Titel den Namen tragen, etwa «Neue Adresse von {Name}», mit dem Knopf «Neue Adresse eintragen». Das wäre ein neuer Text und damit ein Entscheid des Product Owners.

## V-16 (Nit): Land im Adressvergleich

**Beleg.** `backend/src/services/old-address.ts:21-22` vergleicht nur Strasse und PLZ. #114 legt genau das fest.

**Bewertung.** Eine Korrespondenzadresse im Ausland mit gleicher Strasse und gleicher PLZ wie das Gebäude (etwa «Hauptstrasse 1», «8400» in einem fiktiven Land) würde warnen. Praktisch kommt das kaum vor, und die Warnung sperrt nichts. Optional: `and t.country = 'CH'` (Gebäude liegen in der Schweiz).

---

## Bestätigt

**Regel «ausgezogen» (`old-address.ts`)** gegen #114 («Vertragsende before today», «no Mietvertrag running today», «street and postal code, compared ignoring case and extra spaces», «missing tenant address: no warning»):
- `c.end_date < today`: Am Tag des Vertragsendes gibt es noch keine Warnung, am Tag danach schon. Das passt zu «before today» und zu `nextStepsDue` (`end < localToday()`, `contracts/[id]/+page.server.ts:63`).
- «läuft heute» heisst `start_date <= today and (end_date is null or end_date >= today)`, für jeden Mietvertrag des Mieters, auch in einer anderen Wohnung oder einem anderen Gebäude. Ein Umzug im Haus warnt also nicht (Test `old-address.pg.test.ts`, «laufenden Mietvertrag in einer anderen Wohnung»).
- Die Normalisierung `lower(regexp_replace(btrim(x), '\s+', ' ', 'g'))` macht aus «  TESTWEG   1 » «testweg 1» und aus «8400 » «8400». Getestet, ebenso eine andere Strasse und eine andere PLZ (keine Warnung).
- Ohne Adresse des Mieters ist `lower(NULL) = …` nicht wahr, also keine Warnung. Getestet.
- Ein laufender Mietvertrag (Ende 2099) ergibt keine Warnung. Getestet.

**Wo die Warnung erscheint**, wie in #114 und A-5 Anforderungen 1–3 verlangt:
- in der Vorschau des Assistenten (`PreviewStep.svelte:128-136`, aus `contract.oldAddress`, `statement-generation.ts:114`);
- im Dialog «Als versendet markieren» als Hinweis mit Link «Neue Adresse eintragen» zur Bearbeitung des Mieters; der Versand bleibt möglich (`SendDialog.svelte:64-76`, Szenario «… den Versand trotzdem bestätigt»);
- in der Übersicht nur bei Entwürfen, einmal pro Mieter (`dashboard/+page.server.ts:103-108`), mit Titel «Neue Adresse eintragen» und Link `/tenants/{id}/edit`;
- in den Nächsten Schritten nach dem Vertragsende nur mit dem Adressschritt und dem Link, solange `oldAddress` gilt; vorher wie bisher mit dem neuen Satz (`NextSteps.svelte:25-42`).

Die Texte entsprechen in allen vier Sprachen dem Entscheid: `statements_old_address` wörtlich wie in #114, `contracts_next_steps_text` und `…_successor` mit dem Satz aus #114 und A-5 Anforderung 1, `contracts_next_steps_address` als dieser Satz allein.

**Texte #68 und #102:**
- `tenants_correspondence_address` heisst «Korrespondenzadresse» bzw. «adresse de correspondance», «indirizzo di corrispondenza», «correspondence address», wie in der neuen Zeile von `i18n-begriffe.md`.
- Die Hilfe ist wörtlich die aus #68. Ihre Übersetzungen geben sie sinngemäss wieder: fr «après le déménagement, saisir la nouvelle adresse», it «dopo il trasloco inserire il nuovo indirizzo», en «after moving out, enter the new address».
- `tenants_country` lautet «Land», «Pays», «Paese», «Country».
- Die Detailseite des Mieters und der Versanddialog nennen das Land nur im Ausland und in der Sprache der Oberfläche (`TenantContactCard.svelte`, `statements/[id]/+page.server.ts:16-23`).
- Die PLZ wird nur für CH und LI auf 4 Ziffern geprüft (`tenant-form.ts:32-34`). Ein unbekannter Ländercode wird zu CH (`:19`). Das Backend nimmt nur `^[A-Z]{2}$` an.

**Zahlteil:** SIX v2.4 (Suchauszug, siehe Runde 1): «Hat der Zahlungspflichtige eine Adresse im Ausland, sollte der Ländercode auf dem Zahlteil angedruckt werden.» Umgesetzt mit «DE-78462 Konstanz». Im QR-Code steht die PLZ ohne Präfix, das Land als ISO-Code.

**Dokumente:**
- `docs/PRD-Dwello.md`: der Kopf der Abrechnung mit Korrespondenzadresse und der Länder-Regel, der Schuldner mit Ländercode, IBAN CH/LI mit einer einzigen Regel, das Mieterformular mit Korrespondenzadresse, Land und Hilfe.
- `docs/design/i18n-begriffe.md`: neue Zeile «Korrespondenzadresse».
- `docs/anforderungen-vertragsende.md` A-5: der Absatz «Umgesetzt» beschreibt die Regel richtig, auch «ein Umzug im Haus warnt nicht» und die Abweichung von Anforderung 1. Ausnahme: V-14.

**Szenarien:** Ohne `@wip` und unverändert gegenüber Runde 1 sind `tenant-new`, `tenant-edit`, `settings`, `statement-generate` (Vorschau), `dashboard` und `contract-detail`. In `statement-detail` hat der Versand-Schritt jetzt den Namen «… den Versand trotzdem bestätigt», und das PDF-Szenario erwartet «Marktstätte 3 78462 Konstanz DEUTSCHLAND» (mit der Strasse). Die Zeilenstruktur prüft der Unit-Test (V-3).

**Mietrecht (M), kein Fund.** Art. 4 Abs. 1 VMWG (SR 221.213.11): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Der Wortlaut ist identisch bei justement.ch (`/doc/act/ch/221_213_11/art_4`), im Merkblatt des Mieterverbands 2026 und bei SVIT (Suche `mmx search`). Die Warnung hilft, dass die Abrechnung den ausgezogenen Mieter erreicht. Sie sperrt nichts und sagt dem Mieter nichts Falsches. Das Land im Adressfeld und im Zahlteil ändert am Inhalt der Abrechnung nichts.

**Rechtstexte (R), kein Fund.** Das Land ist Teil der Korrespondenzadresse, die `privacy_stored_1` schon nennt. Es gibt keine neuen Empfänger, keine Bekanntgabe ins Ausland durch Dwello (Art. 16–17 DSG) und keine Cookies.

**Glossar:** Alle Begriffe in den geprüften Texten stehen im Glossar oder in `i18n-begriffe.md`: Korrespondenzadresse, Mieter, Mietvertrag, Nebenkostenabrechnung, Nachmieter (Glossar Z. 43), Vertragsende, IBAN. «Land» und «Adresse» sind gewöhnliche Wörter. Ein neuer Begriff ist nicht nötig.

## Nicht bestätigt

- **Fedlex direkt:** Den Wortlaut von Art. 4 VMWG habe ich nicht auf fedlex.admin.ch abgerufen, nur über `mmx search` bei Spiegeln (justement.ch, lexfind.ch, Mieterverband, SVIT). Alle lauten gleich. Formal gilt das Zitat als **unsicher**, bis es auf Fedlex nachgelesen ist.
- **Post- und SIX-Quellen:** Wie in Runde 1 habe ich sie nicht neu an der Quelle abgerufen. Ob die Empfehlung der Post zur Sprache des Landesnamens heute noch so lautet und ob Liechtenstein im Adressfeld eines Briefs aus der Schweiz eine Länderzeile braucht, bleibt **unsicher**. Die Zeile «LIECHTENSTEIN» schadet nicht.
- **Ländercode auf dem Empfangsschein:** SIX nennt im Auszug nur den Zahlteil. Dass Dwello den Ländercode auch auf dem Empfangsschein druckt, halte ich für unschädlich, an der Quelle bestätigt ist es nicht.
- **CH-IBAN mit Buchstaben im Kontofeld:** Das Format `5!n12!c` für CH habe ich nicht im SWIFT-IBAN-Register nachgesehen. Die Regex lässt Buchstaben zu, das ist für CH unschädlich.
- **Übersetzungen** (V-12): Ich habe sie fachlich und sprachlich gelesen. Eine muttersprachliche Prüfung fr/it fehlt.
- **Laufzeitverhalten** (E2E, Personas): nicht ausgeführt. Geprüft habe ich den Code, die Unit- und pg-Tests im Quelltext und `countryLine`, `qrTown` und die IBAN-Regel mit `bun -e`.
