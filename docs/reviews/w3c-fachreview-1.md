# Fachreview W3c (1. Runde): @wip-Szenarien zu #68, #102, #191, #114

Gegenstand: Commit d03ec92 (`git diff HEAD~1 HEAD`) im Worktree `review-wip-fach`, neue bzw. geänderte `@wip`-Szenarien in `tests/e2e/features/{settings,tenant-new,tenant-edit,statement-detail,statement-generate,dashboard,contract-detail}.feature`.

Ergebnis: kein Blocker, kein Major. Die Szenarien entsprechen den Entscheiden in #68, #102 und #191 und dem «Done means» von #114. Die Funde betreffen Einzelheiten der geplanten Umsetzung (Sprache des Landesnamens, Liechtenstein im Zahlteil, IBAN-Format), die Schärfe der PDF-Prüfung und veraltete Stellen in der Dokumentation.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Landesname im Adressfeld in der Sprache des PDF: auf it/de-PDFs für Länder, die keine Nachbarländer sind, nicht nach der Empfehlung der Post (französisch oder englisch) |
| V-2 | Verwalter | Minor | Zahlteil: Ländercode laut SIX «inklusive Liechtenstein»; nach dem Plan («ausserhalb der Schweiz») ist das offen |
| V-3 | Verwalter | Minor | PDF-Szenario prüft nicht, dass das Land allein auf der letzten Zeile steht und das Adressfeld kein «DE-» trägt; es hängt stillschweigend an einer Nachzahlung |
| V-4 | Verwalter | Minor | Warntext «Die Adresse ist noch die der Wohnung» nennt den Glossarbegriff «Korrespondenzadresse» nicht (entschiedener Text, nur gemeldet) |
| V-5 | Verwalter | Minor | IBAN-Prüfung der Einstellungen: CH- und LI-IBAN haben ein alphanumerisches Kontofeld, die heutige Prüfung (`^CH\d{19}$`, fest «1217») passt für keinen der beiden Fälle |
| V-6 | Verwalter | Minor | `docs/anforderungen-vertragsende.md` Z. 34 und 132 werden mit #68/#114 falsch («im Mieterformular «Adresse»», «bis A-5») |
| V-7 | Verwalter | Nit | Hilfetext #68 und Warnung #114 gelten auch beim Korrespondenzkanal E-Mail (entschiedene Texte, nur gemeldet) |
| V-8 | Verwalter | Nit | «ausgezogen» laut #114 (kein laufender Mietvertrag heute) warnt auch bei einem künftigen Mietvertrag im selben Gebäude |
| V-9 | Verwalter | Nit | Mahnungs-PDF mit Korrespondenzadresse im Ausland ohne Szenario |
| V-10 | Verwalter | Nit | Plan: der Punkt «Blocked on me: glossary changes» ist schon erledigt, offen bleibt nur die Code-Spalte «Land geplant (#102)» |

Ohne Fund geprüft: Mietrecht (M) und Rechtstexte (R), siehe «Bestätigt».

---

## V-1 (Minor): Sprache des Landesnamens im Adressfeld

**Beleg.**
- Plan (Auftrag, #102): Landesname «in capitals as last line when it is not Schweiz», in der Sprache des PDF, z.B. «DEUTSCHLAND» in einem deutschen PDF. Szenario `statement-detail.feature` (neu, «Abrechnung an eine Korrespondenzadresse im Ausland»): `Dann steht im PDF "78462 Konstanz DEUTSCHLAND"`.
- Die Sprache des PDF ist die Sprache des Mieters (`pdf.service.ts:511`, `addresses({ …, language })`).
- Schweizerische Post, «Angebote und Preise für Geschäftskunden» (2012, gespiegelt bei philatelie-digital.de): «Wir empfehlen Ihnen, das Bestimmungsland in französischer oder englischer Sprache und in Grossbuchstaben auf der letzten Adresszeile aus[zuschreiben].» Post-Broschüre «versenden – international» (2018, gespiegelt bei funkelettershop.ch): «… in Grossbuchstaben. Für Sendungen in die Nachbarländer der Schweiz können Sie es in der jeweiligen Landessprache vermerken.» Post-Spezifikation «Briefgestaltung von A–Z» (post.ch, nur Suchauszug): «Es dürfen bei der Adressierung von Auslandsendungen vor der Postleitzahl keine ISO-Ländercodes (etwa «DE» für Deutschland) angebracht werden.»

**Warum falsch.** «DEUTSCHLAND» auf einem deutschen PDF passt: Deutschland ist ein Nachbarland, der Name steht in seiner Landessprache. Die Regel «Sprache des PDF» trifft aber nicht immer: ein italienisches PDF nach Deutschland ergäbe «GERMANIA», ein deutsches nach Portugal oder in die USA «VEREINIGTE STAATEN». Das ist weder Französisch oder Englisch noch die Landessprache eines Nachbarlands. Die Post stellt solche Briefe meist trotzdem zu; es ist eine Empfehlung, kein Annahmegrund.

**Behebung.** Den Landesnamen französisch oder englisch drucken (`Intl.DisplayNames(['en'])`, Grossbuchstaben). Für die Nachbarländer DE, AT, FR, IT und LI geht auch die Sprache des Bestimmungslands. Will man «DEUTSCHLAND» im Szenario behalten: Nachbarländer in ihrer Landessprache, alle übrigen englisch. Im UI bleibt der Name in der Sprache der Oberfläche, wie geplant.

## V-2 (Minor): Liechtenstein im Zahlteil

**Beleg.** SIX, Schweizer Implementation Guidelines QR-Rechnung v2.3 (de) und v2.2 (de) (Suchauszüge der six-group.com-PDFs): «Für die Rechnungstellung ins Ausland, inklusive Liechtenstein, sollte der Ländercode auf dem Zahlteil angedruckt werden.» v2.4 (de), Abschnitt «Zahlbar durch (Name/Adresse)»: «Hat der Zahlungspflichtige eine Adresse im Ausland, sollte der Ländercode auf dem Zahlteil angedruckt werden.» Der Plan im Auftrag sagt «when the debtor is outside Switzerland» und für die PLZ «4 digits only checked for CH and LI». Liechtenstein zählt dort also wie die Schweiz.

**Warum falsch.** Wer LI wie CH behandelt, druckt für einen Mieter in Vaduz kein «LI-». SIX nennt Liechtenstein für den Zahlteil ausdrücklich als Ausland (v2.2/2.3). Im QR-Code steht ohnehin «LI», das ist richtig.

**Behebung.** Den Ländercode im Zahlteil und im Empfangsschein drucken, sobald das Land nicht CH ist, also auch für LI («LI-9490 Vaduz»). Ein Unit-Test für LI. Die PLZ-Prüfung mit 4 Ziffern für CH und LI bleibt richtig. Für das Adressfeld des Briefs siehe «Nicht bestätigt» (Liechtenstein im Postverkehr).

## V-3 (Minor): Was das PDF-Szenario nicht prüft

**Beleg.** `statement-detail.feature`, Szenario «Abrechnung an eine Korrespondenzadresse im Ausland»: `Dann steht im PDF "78462 Konstanz DEUTSCHLAND"` und `Und steht im PDF "DE-78462 Konstanz"`. Glossar Z. 156 (Saldo): «Saldo 0.00: keine Zahlung, kein Zahlteil», und bei einer Rückerstattung gibt es ebenfalls keinen Zahlteil. Der Seed setzt die Akontobeiträge auf 0 (`tests/e2e/fixtures/backend.ts:148`, `monthlyAdvancePayment: '0'`). Nur deshalb ergibt sich eine Nachzahlung und damit ein Zahlteil.

**Warum falsch.**
1. «78462 Konstanz DEUTSCHLAND» ist auch dann im PDF-Text, wenn das Land auf derselben Zeile wie der Ort steht. Die Post verlangt das Land allein auf der letzten Zeile (V-1).
2. Ob das Adressfeld fälschlich «DE-78462» trägt, prüft das Szenario nicht. Die Post verbietet das ausdrücklich (Beleg V-1). Der Zahlteil soll es dagegen tragen.
3. Die zweite Erwartung hängt an einer Nachzahlung, die das Szenario nicht nennt. Ändert jemand den Seed (Akonto), fehlt der Zahlteil und das Szenario scheitert ohne erkennbaren Grund.

**Behebung.** Die Erwartung auf das Adressfeld beziehen: Die letzten zwei Zeilen sind «78462 Konstanz» und «DEUTSCHLAND», und kein «DE-78462». Die Nachzahlung im Szenario nennen, etwa mit einem Kommentar oder einem Schritt «… mit einer Nachzahlung». Eine Alternative ist ein Unit-Test von `addresses()` auf Zeilenebene; das E2E-Szenario bliebe dann wie es ist.

## V-4 (Minor, nur gemeldet): «Adresse» statt «Korrespondenzadresse» im Warntext

**Beleg.** Szenarien `statement-detail.feature` und `statement-generate.feature`: «Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.» Glossar Z. 24: «**Korrespondenzadresse** | Adresse des Mieters (mit Land, Vorgabe Schweiz), an die Abrechnungen und Mahnungen gehen. Nach dem Auszug trägt der Vermieter die neue Adresse ein.» CLAUDE.md, Design-Regeln: «Domain terms only from `UBIQUITOUS_LANGUAGE.md`».

**Bewertung.** Die Inkonsistenz wiegt leicht. Wer der Warnung folgt, landet beim Feld «Korrespondenzadresse», und dessen Hilfe sagt ebenfalls «nach dem Auszug die neue Adresse eintragen». Der Zusammenhang ist für den Vermieter also erkennbar. «Die Adresse» lässt aber offen, welche gemeint ist: die Adresse des Mieters oder die Gebäudeadresse, die in derselben Vorschau steht. Ausserdem weicht der Text vom Glossarbegriff ab, den #68 eben eingeführt hat. «Tragen Sie die neue Adresse ein» und der Titel «Neue Adresse eintragen» sind dagegen in Ordnung, denn so steht es auch im Glossar.

**Vorschlag (Entscheid Product Owner).** «{Name} ist ausgezogen. Die Korrespondenzadresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.» Bis zu einem Entscheid gilt der Text aus #114.

## V-5 (Minor): IBAN-Format für CH und LI

**Beleg.** `src/lib/server/settings.ts:24-25` (Prüfziffer mit festem «1217» = CH) und `:42` (`/^CH\d{19}$/`). `backend/src/services/qr-bill.service.ts:109` lässt dagegen alphanumerische Zeichen zu (`/^[A-Z]{2}[0-9]{2}[A-Z0-9]{17}$/`). Das Szenario verwendet «LI21 0881 0000 2324 013A A», also Buchstaben im Kontofeld.

**Nachgerechnet** (ISO 13616: die ersten vier Zeichen ans Ende stellen, Buchstaben als A=10 … Z=35 schreiben, die Zahl mod 97 muss 1 ergeben):
- LI21 0881 0000 2324 013A A: Länge 21 (richtig für LI), mod 97 = **1**, gültig.
- CH93 0076 2011 6238 5295 7: Länge 21, mod 97 = 1, gültig.
- DE89 3704 0044 0532 0130 00 (Szenario «Ungültige IBAN»): mod 97 = 1, also eine gültige Prüfziffer. Abgewiesen wird sie wegen des Landes. Damit prüft das Szenario genau die Länderregel. Gut so.

**Warum falsch.** Wer `^CH\d{19}$` nur um `LI` erweitert oder das feste «1217» beibehält, weist die IBAN aus dem Szenario ab. Das Kontofeld ist bei CH und LI laut IBAN-Register alphanumerisch (Format `5!n12!c`). Für CH ist das nicht an der Quelle bestätigt, siehe «Nicht bestätigt». Die Prüfung muss also Buchstaben zulassen und die Prüfziffer allgemein berechnen.

**Behebung.** Dieselbe Regel wie im QR-Dienst: `^(CH|LI)\d{2}[A-Z0-9]{17}$` plus MOD-97 mit Buchstabenumrechnung. Am besten nutzt die Einstellung die Prüfung des QR-Diensts, statt eine zweite zu pflegen. Unit-Tests: LI mit Buchstaben gültig, LI mit falscher Prüfziffer ungültig, DE mit gültiger Prüfziffer ungültig.

## V-6 (Minor): Veraltete Stellen in `docs/anforderungen-vertragsende.md`

**Beleg.** Z. 34: «beim Mieter steht als Korrespondenzadresse (im Mieterformular «Adresse», bei Post per E-Mail auch «E-Mail») …». Z. 132: «… «Neue Adresse eintragen» (bis A-5: die Bearbeitung des Mieters)». Z. 186, Akzeptanzkriterium A-5: «die Adresse von "Anna Keller" ist die Adresse des Gebäudes».

**Warum falsch.** Nach #68 heisst das Feld im Formular «Korrespondenzadresse». Nach #114 ist A-5 umgesetzt, das «bis A-5» stimmt dann nicht mehr. #114 verlangt ohnehin, A-5 als umgesetzt zu markieren.

**Behebung.** Im selben Änderungssatz wie #68/#114: Z. 34 «im Mieterformular «Korrespondenzadresse»», Z. 132 ohne «bis A-5», A-5 mit «Umgesetzt» und den Szenarien von heute («Korrespondenzadresse von … ist noch die Adresse des Gebäudes»).

## V-7 (Nit, nur gemeldet): Korrespondenzkanal E-Mail

**Beleg.** Hilfe #68: «Hierhin gehen Abrechnungen und Mahnungen; nach dem Auszug die neue Adresse eintragen». Glossar Z. 25: Korrespondenzkanal Brief oder E-Mail. #114 knüpft die Warnung nicht an den Kanal.

**Bewertung.** Bei Korrespondenz per E-Mail geht die Abrechnung nicht an diese Adresse. Die Hilfe sagt dann zu viel. Die Warnung bleibt trotzdem sinnvoll: Die Adresse steht im Adressfeld des PDF und als «Zahlbar durch» im Zahlteil, und eine spätere Mahnung per Brief ginge dorthin. Beide Texte sind entschieden, ein Handlungsbedarf besteht nicht. Falls der Product Owner nachschärfen will, wäre ein Vorschlag: «Hierhin gehen Abrechnungen und Mahnungen per Brief; die Adresse steht auch auf der Abrechnung».

## V-8 (Nit): «ausgezogen» und ein künftiger Mietvertrag

**Beleg.** #114: «the statement's Mietvertrag has a Vertragsende before today and the tenant has no Mietvertrag running today». Glossar Z. 23: Mieter «künftig mit nur einem künftigen Mietvertrag».

**Warum.** Zieht ein Mieter im selben Gebäude um und beginnt der neue Mietvertrag erst in der Zukunft (eine Lücke zwischen den Verträgen), meldet Dwello in dieser Zeit «{Name} ist ausgezogen … Tragen Sie die neue Adresse ein». Die Adresse (Strasse und PLZ des Gebäudes) ist dann aber richtig. Der Fall ist selten, und die Warnung sperrt nichts.

**Behebung (optional).** Statt «läuft heute» die Bedingung «kein laufender oder künftiger Mietvertrag» verwenden, mit einem Unit-Test. Andernfalls bewusst so lassen und in A-5 notieren.

## V-9 (Nit): Mahnung an eine Korrespondenzadresse im Ausland

**Beleg.** Der Plan im Auftrag sieht die Adressfeld-Regel auch für das Mahnungs-PDF vor (`backend/src/services/reminder-pdf.ts`, `reminder-letter.ts`). Die Mahnung hat keinen Zahlteil, nur die Referenz (`reminder.service.ts:88`). Ein Szenario fehlt.

**Behebung.** Ein Unit-Test für das Adressfeld der Mahnung genügt, weil dieselbe Funktion gelten soll. Andernfalls im Pull Request «No scenario: …» angeben.

## V-10 (Nit): Planpunkt Glossar

**Beleg.** `implementation_plan.md` (neu): «Blocked on me: glossary changes #68 asks for (`UBIQUITOUS_LANGUAGE.md`, Mieter: «Korrespondenzadresse», country)». Das Glossar enthält beides bereits: Z. 23 (Mieter … Korrespondenzadresse) und Z. 24 (Korrespondenzadresse mit Land, Vorgabe Schweiz).

**Behebung.** Den Punkt als erledigt führen. Offen bleibt nur die Code-Spalte von Z. 24 («Land geplant (#102)»), die nach der Umsetzung auf das neue Feld zeigen muss. Das ist eine Glossar-Änderung des Product Owners und gehört unter «Blocked on me».

---

## Bestätigt

- **#68:** Der Begriff «Korrespondenzadresse» steht im Glossar (Z. 23, 24). Der Hilfetext im Szenario `tenant-new.feature` entspricht wörtlich dem Entscheid in #68. In `tenant-edit.feature` werden «Ahornweg 3, 8400 Winterthur» (ohne Land, weil Schweiz) und «Marktstätte 3, 78462 Konstanz, Deutschland» angezeigt. Das passt zu «Vorgabe Schweiz» und zum Landesnamen in der Sprache der Oberfläche.
- **#102:** Das Land gehört zur Korrespondenzadresse, die Vorgabe ist Schweiz, eine eigene Hausnummer gibt es nicht, und der QR-Code trägt den ISO-Code. Das stimmt mit dem Entscheid überein. SIX v2.4: «Hat der Zahlungspflichtige eine Adresse im Ausland, sollte der Ländercode auf dem Zahlteil angedruckt werden.» SIX v2.2 (de, Suchauszug): «Die Postleitzahl ist immer ohne vorangestellten Landescode» (gemeint ist das Datenfeld im QR-Code). Der Plan trennt das richtig: im QR-Code die PLZ ohne Präfix plus das Land «DE», gedruckt im Zahlteil «DE-78462 Konstanz», im Adressfeld kein Präfix. Eine 5-stellige PLZ für DE ist zulässig, weil nur CH und LI auf 4 Ziffern geprüft werden.
- **#191:** Die Szenarien entsprechen dem Entscheid: LI wird gespeichert, und die Fehlermeldung nennt beide Länder. Die Prüfziffern der LI-IBAN sind gültig (V-5). Grammatik und Rechtschreibung von «Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein» sind in Ordnung.
- **#114:**
  - Die Voraussetzungen stimmen. Eva Frei: Mietvertrag bis 31.03.2024, kein laufender Vertrag (Grundlage in `statement-detail.feature` Z. 26–27 und `statement-generate.feature` Z. 10–11). Bruno Meier: bis 30.06.2024, die Abrechnung ist ein Entwurf (Seed `statements/generate`). Anna Keller (contract-detail): gekündigt auf den 31.12.2024, das liegt vor heute (16.10.2026).
  - Die Warntexte und der Text der nächsten Schritte entsprechen wörtlich #114 bzw. A-5 Anforderung 1–3.
  - Die Warnung sperrt den Versand nicht; das Szenario versendet danach.
  - Die Aufgabe in der Übersicht erscheint nur bei einem Entwurf. «Neue Adresse eintragen» führt zur Bearbeitung des Mieters.
  - Der Vergleich über Strasse und PLZ reicht für die Szenarien, weil der Schritt die Gebäudeadresse übernimmt.
- **Mietrecht (M), kein Fund:** Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11, zitiert nach `docs/reviews/241-fachreview-1.md:163`): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Die Abrechnung muss den ausgezogenen Mieter also erreichen. Die Warnung (#114) und die Korrespondenzadresse mit Land (#102) dienen genau dem. Nichts in den Szenarien ist für den Mieter unzulässig oder irreführend.
- **Rechtstexte (R), kein Fund:** Das Land ist ein neues Feld der Korrespondenzadresse. Es gibt keine neuen Empfänger und keine Bekanntgabe ins Ausland durch Dwello; den Brief versendet der Vermieter selbst. `privacy_stored_1` nennt die «Korrespondenzadresse» bereits. Die Datenschutzerklärung muss nicht angepasst werden.
- **Glossar:** In den Szenarien kommen vor: Korrespondenzadresse, Korrespondenzkanal (Brief), Nebenkostenabrechnung, Entwurf/Versendet, Vertragsende, Mieter, Gebäude, Wohnung, IBAN, Zahlteil (im Kommentar), Übersicht. Alle stehen im Glossar oder werden in bestehenden Szenarien schon so verwendet. «Land» ist ein gewöhnliches Wort und im Glossareintrag Korrespondenzadresse genannt. Ein neuer Begriff ist nicht nötig, und es gibt keinen Vorschlag für ein Issue.

## Nicht bestätigt

- **Post-Regeln aus erster Hand:** `post.ch` war nicht erreichbar (WebFetch DNS-Fehler, curl über den Proxy 403). Die Zitate in V-1 stammen aus Post-Broschüren, die Dritte spiegeln (philatelie-digital.de 2012, funkelettershop.ch 2018), und aus einem Suchauszug der Post-Spezifikation «Briefgestaltung von A–Z». Ob die heutige Post-Vorgabe gleich lautet, ist **unsicher**.
- **Liechtenstein im Adressfeld des Briefs:** Liechtenstein gehört zum schweizerischen Postleitzahlsystem; post.li führt Briefe in die Schweiz unter «Briefe Inland». Ob ein Brief aus der Schweiz nach Liechtenstein die Zeile «LIECHTENSTEIN» braucht, konnte ich nicht bestätigen. Sie schadet nicht. Gesucht habe ich mit `mmx search` (Post CH, post.li, pingen.com); pingen.com war nicht erreichbar.
- **Druckformat «DE-78462 Konstanz» im Zahlteil:** SIX verlangt laut v2.2–2.4 nur, dass der Ländercode «angedruckt» wird. Die genaue Form (Präfix mit Bindestrich vor der PLZ) habe ich im Style Guide nicht gefunden. Die IG- und Style-Guide-PDFs auf six-group.com waren nicht ladbar (Proxy 403), ich hatte nur Suchauszüge. Verbreitete QR-Bibliotheken drucken so (Suchauszug glama.ai: Option «print CH- in front of Swiss postal codes too»). Ob der Ländercode auch auf dem Empfangsschein stehen muss, sagt der Auszug nicht; er nennt nur den Zahlteil. Ihn dort auch zu drucken ist unschädlich.
- **IBAN-Format CH «5!n12!c»:** Das IBAN-Register (SWIFT) habe ich nicht abgerufen. Die Angabe stammt aus dem Kommentar in `qr-bill.service.ts:93` (für LI) und aus der Regex `:109`. Dass auch CH-IBANs Buchstaben enthalten können, ist **unsicher**. Für LI belegt es das Szenario.
- **Fedlex:** Art. 4 VMWG habe ich nicht neu abgerufen; das Zitat stammt aus einem früheren Fachreview mit Fedlex-Quelle. Weitere Rechtsfragen, etwa die vorzeitige Rückgabe nach Art. 264 OR (Auszug vor dem Vertragsende, dann keine Warnung) oder der Zugang einer Abrechnung an eine alte Adresse, habe ich nicht geprüft. Sie ändern an den Szenarien nichts.
