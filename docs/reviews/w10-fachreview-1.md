# Fachreview W10-1: Szenarien und geplante Texte zu #156 (B-16) und #155 (F-23)

Gegenstand: `git diff 87dda97 4abcd04 -- tests/e2e/features` im Worktree `review-w10-fach` (Commit 4abcd04) sowie die vom Aufrufer geplanten deutschen Texte (Nächste Schritte, Hinweis im Assistenten, Hilfetext «Mieter und Wohnung», Abschnitt in `docs/anforderungen-vertragsende.md`).
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md`, Issues #156/#155 (via `gh api`), OR und ZGB in der Fassung von Fedlex (OR Stand 01.10.2026, ZGB Stand 01.07.2026, HTML aus dem Fedlex-Filestore, per SPARQL ermittelt).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Link «Neuen Mietvertrag erfassen» unter «Bearbeiten» wählt den bisherigen Mieter vor, der Text direkt darüber nennt aber zuerst den Mieterwechsel (anderer Mieter) |
| M-1 | Mietrecht | Major | Hilfe zum Todesfall steht nur unter «Bearbeiten»; der Fehler, den #155 verhindern soll, passiert über «Beenden» |
| M-2 | Mietrecht | Minor | Übertragung und Zuweisung: der «neue Mietvertrag» muss die bisherigen Bedingungen übernehmen, und die Kündigungsfrist im Dialog «Beenden» gilt dafür nicht |
| M-3 | Mietrecht | Minor | «läuft weiter, bis er gekündigt wird» ist für befristete Verträge unvollständig; Art. 266i OR gilt als ausserordentliche Kündigung |
| M-4 | Mietrecht | Minor | Art. 263 OR verlangt die *schriftliche* Zustimmung |
| V-2 | Verwalter | Minor | Titel des Hinweises «unbefristeten Mietvertrag» ist ungenau: auch ein gekündigter Vertrag ist unbefristet |
| V-3 | Verwalter | Minor | Text «Nächste Schritte» spricht nur vom Nachmieter, nicht vom Umzug im Haus; dritter Link fehlt, sobald ein Nachmieter erfasst ist |
| V-4 | Verwalter | Minor | Vorbelegter Vertragsbeginn kann bei einem lange beendeten Vertrag weit in der Vergangenheit liegen |
| V-5 | Verwalter | Minor | Szenarien zu #155 prüfen nur den Todesfall, nicht Übertragung/Zuweisung |
| V-6 | Verwalter | Minor | Neue Begriffe ohne Glossareintrag: Erben, Geschäftsmietvertrag, Familienwohnung |
| V-7 | Verwalter | Nit | Korrespondenzadresse der Erben: an wen genau, und der Name bleibt der des Verstorbenen |
| V-8 | Verwalter | Nit | Hinweistext: «jenen Mietvertrag» und «mietet noch» bei einem künftigen Vertrag |
| M-5 | Mietrecht | Nit | Solidarhaftung des bisherigen Mieters (Art. 263 Abs. 4 OR, Art. 121 Abs. 2 ZGB) gehört in den Dokumentabschnitt |

Ihre Fragen (Lesart des Hinweises, frühester Vertragsbeginn) beantworte ich im Abschnitt «Bestätigt».

---

## Befunde

### V-1 (Major): Vorbelegter Mieter passt nicht zum Mieterwechsel

**Beleg.** `src/routes/contracts/ContractForm.svelte:217-229`: Im Zustand mit Vertragsende steht über dem Link `contracts_parties_fixed_ended` (`messages/de.json:625`): «Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab {date}. Bei einem Wechsel der Wohnung erfassen Sie einen neuen Mietvertrag für die andere Wohnung.» Darunter folgt der Link «Neuen Mietvertrag erfassen» (`contract-parties-new`). #156 lässt ihn künftig Mieter und Beginn vorbelegen. Das Szenario `contract-edit.feature` «Neuer Mietvertrag nach dem Vertragsende» verlangt «ist im Mietvertrag der Mieter "Anna Keller" gewählt».

**Warum falsch.** Ein Mieterwechsel heisst laut Glossar: «ein neuer Mietvertrag mit einem *anderen* Mieter beginnt» (`UBIQUITOUS_LANGUAGE.md:45`). Der Text nennt diesen Fall zuerst, der Link führt aber zum bisherigen Mieter mit dem Beginn am Tag nach dem Vertragsende, also genau zu den Daten eines Nachmieters. Ein Laie, der den Mieter im ersten Schritt nicht ändert, erfasst den Nachmieter-Vertrag auf den alten Mieter. Dwello lehnt das nicht ab: dieselbe Wohnung ab dem Tag danach überschneidet sich nicht (Regel 1, `docs/anforderungen-vertragsende.md:31`). Die Folge: Akonto und Nebenkostenabrechnung des Nachmieters gehen an den Vormieter, also an die falsche Person und mit Personendaten des Nachmieters.

**Korrektur** (verträglich mit dem Entscheid in #156, der Mieter und Beginn vorbelegt):
- Der Link nennt den Mieter: «Neuen Mietvertrag für {name} erfassen», gleich wie in «Nächste Schritte». So ist klar, dass er dem Wechsel der Wohnung dient.
- Für den Mieterwechsel gibt es einen eigenen Link «Nachmieter erfassen» nach `/contracts/new?apartment={id}&start={Tag danach}`, wie in `NextSteps.svelte:23`.

Ändert sich damit der Text eines entschiedenen Links, braucht es den Product Owner («Blocked on me»). Die Reihenfolge im Hilfetext sollte zu den Links passen.

### M-1 (Major): Hilfe zum Todesfall erreicht den Verwalter nicht dort, wo er den Fehler macht

**Beleg.** Geplant ist der Text nur im Panel «Mieter und Wohnung» unter «Bearbeiten». #155 beschreibt den Schaden so: «A landlord who reads the help as a Mieterwechsel ends the contract on the day of death: Dwello then counts the time after as Leerstand …». «Where» nennt ausdrücklich `src/routes/contracts/[id]/+page.svelte` («Beenden»). Der Dialog «Beenden» nennt heute nur Kündigungsfrist und Termin (`messages/de.json:1372`).

**Warum falsch.** Ein Verwalter, der nach einem Todesfall den Vertrag «beenden» will, geht zu «Beenden» auf der Vertragsseite, nicht zu «Bearbeiten». Dort erfährt er nicht, dass der Vertrag weiterläuft. Rechtlich endet der Vertrag nicht: Nach Art. 560 Abs. 1 und 2 ZGB gilt: «Die Erben erwerben die Erbschaft als Ganzes mit dem Tode des Erblassers kraft Gesetzes.» und «… die Schulden des Erblassers werden zu persönlichen Schulden der Erben.» Art. 266i OR gibt den Erben nur ein Kündigungsrecht: «Stirbt der Mieter, so können seine Erben mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin kündigen.» Ein Vertragsende am Todestag ist also falsch. Der Vermieter trüge dann die Nebenkosten bis zur Kündigung durch die Erben, obwohl die Erben sie schulden.

**Korrektur.** Dieselbe Aussage kurz auch im Dialog «Beenden», z.B. unter dem Hinweis zur Kündigungsfrist: «Ist der Mieter gestorben, beenden Sie den Mietvertrag nicht. Er geht auf die Erben über. Erfassen Sie das Vertragsende erst, wenn die Erben gekündigt haben.» Dazu ein Schritt im Szenario «Mietvertrag beenden». Ist das nicht vom Entscheid gedeckt («a help text»), gehört es unter «Blocked on me».

### M-2 (Minor): Übertragung und Zuweisung führen denselben Vertrag weiter

**Beleg.** Geplanter Hilfetext: «… erfassen Sie wie bei einem Mieterwechsel ein Vertragsende und einen neuen Mietvertrag.» Art. 263 Abs. 3 OR: «Stimmt der Vermieter zu, so tritt der Dritte anstelle des Mieters in das Mietverhältnis ein.» Art. 121 Abs. 1 ZGB: «… so kann das Gericht ihm die Rechte und Pflichten aus dem Mietvertrag allein übertragen …». Der Dialog «Beenden» sagt: «Für Wohnungen gilt eine Kündigungsfrist von mindestens 3 Monaten. Ist die Kündigung zu spät, gilt sie erst auf den nächsten Kündigungstermin.» (`messages/de.json:1372`).

**Warum ungenau.** Rechtlich bleibt es derselbe Vertrag. Der «neue Mietvertrag» in Dwello ist nur die Abbildung für die Nebenkosten (so auch #155: «For the Nebenkosten … correct»). Zwei Fehlerquellen:
- «wie bei einem Mieterwechsel» lädt dazu ein, neue Bedingungen zu erfassen, etwa einen höheren Mietzins. Der Eintretende übernimmt aber das bestehende Mietverhältnis.
- Der Dialog «Beenden» suggeriert eine Frist von drei Monaten. Bei Übertragung oder Zuweisung gibt es keine Kündigung; das Vertragsende ist der Tag vor dem Eintritt.

**Korrektur.** Text ergänzen: «… erfassen Sie wie bei einem Mieterwechsel ein Vertragsende am Tag vor dem Wechsel (ohne Kündigungsfrist) und einen neuen Mietvertrag mit denselben Bedingungen (Mietzins, Akonto, Vertragsdauer).» Im Dokumentabschnitt sollte stehen, dass «gekündigt» hier rechtlich nicht stimmt und bewusst in Kauf genommen ist (Entscheid #155, Option A).

### M-3 (Minor): Todesfall bei befristetem Vertrag und ausserordentliches Kündigungsrecht

**Beleg.** Geplant: «Er geht auf die Erben über und läuft weiter, bis er gekündigt wird.» Art. 266i OR steht im OR unter «III. Ausserordentliche Kündigung», «3. Tod des Mieters» (Fedlex, Gliederung vor Art. 266g–266i).

**Warum ungenau.** Ein befristeter Vertrag läuft bis zum vereinbarten Ende, nicht bis zu einer Kündigung. Als ausserordentliches Recht gilt Art. 266i OR nach seiner Stellung auch für befristete Verträge und gegen eine längere vereinbarte Frist. Dieser Schluss aus der Gliederung ist für mich **unsicher**, er ist aber herrschende Lehre. Dazu kommt: Nur die Erben haben dieses Sonderrecht, der Vermieter nicht.

**Korrektur.** «Stirbt der Mieter, endet der Mietvertrag nicht: Er geht auf die Erben über. Die Erben können ihn mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin kündigen, auch wenn er befristet ist.»

### M-4 (Minor): Schriftliche Zustimmung

**Beleg.** Art. 263 Abs. 1 OR: «Der Mieter von Geschäftsräumen kann das Mietverhältnis mit schriftlicher Zustimmung des Vermieters auf einen Dritten übertragen.» Abs. 2: «Der Vermieter kann die Zustimmung nur aus wichtigem Grund verweigern.» Geplant ist: «mit Ihrer Zustimmung».

**Korrektur.** «… bei der Übertragung eines Mietvertrags für Geschäftsräume mit Ihrer schriftlichen Zustimmung …». Abs. 2 gehört in den Dokumentabschnitt, nicht in die Hilfe.

### V-2 (Minor): «unbefristet» im Titel des Hinweises

**Beleg.** Geplanter Titel: «{name} hat noch einen unbefristeten Mietvertrag». Szenario `contract-new.feature`: «noch einen unbefristeten Mietvertrag für die Wohnung "2.02"». Glossar `UBIQUITOUS_LANGUAGE.md:38-39`: Ein gekündigter Vertrag bleibt unbefristet («Unbefristet, gekündigt auf den …», `messages/de.json:1377`).

**Warum falsch.** Der Hinweis erscheint nach Ihrer Lesart nur bei Verträgen *ohne* Vertragsende. Ein gekündigter Vertrag ist aber auch unbefristet und löst ihn nicht aus. Der Titel verspricht also mehr, als die Regel tut. Der Fliesstext («ohne Vertragsende») ist richtig.

**Korrektur.** Titel «{name} hat noch einen Mietvertrag ohne Vertragsende» oder «… einen ungekündigten Mietvertrag». Den Szenarioschritt gleich anpassen.

### V-3 (Minor): «Nächste Schritte» beim Umzug im Haus

**Beleg.** `messages/de.json:1389`: «Der Mietvertrag ist gekündigt. Erfassen Sie den Mietvertrag des Nachmieters, sobald er unterschrieben ist. Für die Schlussabrechnung braucht es die neue Adresse des Mieters.» `NextSteps.svelte:22-26`: «Nachmieter erfassen» erscheint nur ohne erfassten Nachmieter.

**Warum.** Der neue Link steht ohne Erklärung neben einem Text, der nur den Auszug kennt. Bei einem Umzug im Haus ist oft schon der Nachmieter der alten Wohnung erfasst, der neue Vertrag des Mieters aber noch nicht. Dann ist der Text `_successor` aktiv, und der Link muss trotzdem erscheinen.

**Korrektur.** Einen Satz in beiden Varianten ergänzen: «Zieht {name} in eine andere Wohnung um, erfassen Sie dafür einen neuen Mietvertrag.» Den dritten Link unabhängig von `shown.successor` zeigen. Optional auch `&start={Tag danach}` mitgeben, wie unter «Bearbeiten».

### V-4 (Minor): Vorbelegter Beginn in der Vergangenheit

**Beleg.** Der Link unter «Bearbeiten» erscheint bei jedem Vertrag mit Vertragsende (`ContractForm.svelte:226`), also auch bei einem, der vor Jahren endete.

**Warum.** Dann schlägt der Assistent z.B. 2021-04-01 vor. Das Szenario «Vertragsbeginn in der Vergangenheit bestätigen» fängt das zwar ab, aber ein Laie bestätigt einen Vorschlag von Dwello eher, als dass er ihn prüft.

**Korrektur.** `start` nur mitgeben, wenn der Tag danach heute oder später ist. Sonst nur den Mieter vorbelegen.

### V-5 (Minor): Szenarien decken #155 nur halb ab

**Beleg.** `contract-edit.feature`, Szenario «Beim Tod des Mieters läuft der Mietvertrag weiter»: Es prüft nur den Tod und die Korrespondenzadresse. Der Entscheid #155 verlangt drei Fälle.

**Korrektur.** Einen Schritt ergänzen: «Und erfährt der Liegenschaftsverwalter, dass er bei einer Übertragung ein Vertragsende und einen neuen Mietvertrag erfasst». Prüfen gegen «Übertragung» und «Vertragsende».

### V-6 (Minor): Fehlende Begriffe

«Erben», «Geschäftsmietvertrag», «Familienwohnung» und «Übertragung» stehen nicht in `UBIQUITOUS_LANGUAGE.md`. Vorschläge für ein Issue (Labels `fachlich`, `entscheiden`):
- **Erben:** «Personen, auf die beim Tod des Mieters der Mietvertrag übergeht (Art. 560 ZGB). Der Mietvertrag läuft weiter; die Erben können ihn mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin kündigen (Art. 266i OR).»
- **Mietvertrag für Geschäftsräume** statt «Geschäftsmietvertrag». Das ist die Wortwahl des Gesetzes (Art. 263, 266d OR) und passt zu den Gebäudetypen Geschäftshaus und Gewerbegebäude.
- **Wohnung der Familie** statt «Familienwohnung». Das ist die Wortwahl von Art. 121 ZGB.
- **Übertragung (des Mietvertrags):** «Ein Dritter tritt mit schriftlicher Zustimmung des Vermieters anstelle des Mieters in den Mietvertrag für Geschäftsräume ein (Art. 263 OR). In Dwello: Vertragsende und neuer Mietvertrag mit denselben Bedingungen.»

Bis zum Entscheid: `TODO(fachlich prüfen, #…)` an den Texten.

### V-7 (Nit): Adresse der Erben

In der Praxis gehen Briefe an «Erben von Anna Keller», an eine Person, die die Post für alle annimmt (Erbenvertreter oder Willensvollstrecker), oder an einen Erben. Die Korrespondenzadresse hat nur Strasse, PLZ und Ort (`UBIQUITOUS_LANGUAGE.md:24`), der Name bleibt der der Verstorbenen. Vorschlag: «tragen Sie die Adresse der Erben ein, z.B. die der Person, die für die Erben die Post annimmt». Ob auch der Name ergänzt werden soll («Erben von …»), ist eine Produktfrage (eigenes Issue, nicht blockierend).

### V-8 (Nit): Wortlaut des Hinweises

- «beenden Sie jenen Mietvertrag» ist steif. Besser: «beenden Sie den Mietvertrag für die Wohnung {apartment} auf seiner Seite mit «Beenden»».
- «mietet noch» stimmt nicht bei einem *künftigen* Vertrag ohne Vertragsende, der nach Ihrer Lesart auch einen Hinweis auslöst. Entweder nur laufende Verträge nehmen, oder neutral formulieren: «{name} hat einen Mietvertrag für die Wohnung {apartment} ({building}) ohne Vertragsende.»
- Bei einem Umzug im Haus wird der alte Vertrag meist im Einvernehmen auf einen Tag aufgelöst, nicht mit drei Monaten Frist. Der Dialog «Beenden» nennt aber nur die Kündigungsfrist (siehe M-2). Ein Zusatz «auf den vereinbarten letzten Tag» würde helfen.

### M-5 (Nit): Haftung des bisherigen Mieters im Dokument

Art. 263 Abs. 4 OR: «Er haftet jedoch solidarisch mit dem Dritten bis zum Zeitpunkt, in dem das Mietverhältnis gemäss Vertrag oder Gesetz endet oder beendet werden kann, höchstens aber für zwei Jahre.» Art. 121 Abs. 2 ZGB: «Der bisherige Mieter haftet solidarisch für den Mietzins … höchstens aber während zweier Jahre». Das gehört in den Abschnitt in `docs/anforderungen-vertragsende.md`, mit dem Hinweis, dass Dwello das nicht abbildet. Für die Nebenkosten zählt das, wenn der neue Mieter nicht bezahlt.

---

## Bestätigt

- **Lesart des Hinweises im Assistenten:** fachlich richtig. Ein Vertrag mit Vertragsende ist gekündigt oder befristet, der Wechsel ist also vorbereitet. Überschneiden sich zwei Wohnungen kurz, ist das beim Umzug üblich (Zügeln, Reinigung) und kein Fehler. Die Einschränkung «andere als die gewählte Wohnung» ist praktisch immer erfüllt: Eine Wohnung mit einem Vertrag ohne Ende ist wegen Regel 1 ohnehin nicht wählbar (`contract-new.feature`, «Vermietete Wohnung ist nicht verfügbar»). Der Hinweis kann also schon nach der Wahl des Mieters erscheinen. Der Hinweis blockiert nicht, und das ist richtig: Ein Mieter darf mehrere Wohnungen mieten. Der Satz «Mietet {name} beide Wohnungen, können Sie hier weitermachen.» deckt das ab. Einschränkungen: V-2 und V-8.
- **Frühester Beginn «Tag nach dem Vertragsende» beim Wechsel der Wohnung:** Als *Vorschlag* ist er richtig und üblich, als *Untergrenze* nicht. Die Überschneidungsregel gilt nur pro Wohnung: `checkContractOverlap(current.apartmentId, …)` (`backend/src/services/contract.service.ts:336`) und Regel 1 «Pro Wohnung» (`docs/anforderungen-vertragsende.md:31`). Für eine andere Wohnung darf der neue Vertrag früher beginnen. Das Szenario sagt richtig «schlägt … vor». Der Assistent darf einen früheren Beginn nicht ablehnen, und kein Text darf hier «frühestens» sagen. «frühestens ab {date}» in `contracts_parties_fixed_ended` gilt nur für den Mieterwechsel, also dieselbe Wohnung, und ist dort richtig.
- **Berechnung «Tag danach»:** `dayAfter` (`ContractForm.svelte:76`) rechnet in UTC. Nachgerechnet: 2099-03-31 → 2099-04-01 (Szenario), 2028-02-28 → 2028-02-29 (Schaltjahr), 2027-02-28 → 2027-03-01, 2099-12-31 → 2100-01-01 (Jahreswechsel), 2026-10-24 → 2026-10-25 (Ende der Sommerzeit). Alle richtig.
- **Kern des Hilfetexts zum Tod** (Vertrag endet nicht, geht auf die Erben über, kein Vertragsende erfassen): bestätigt durch Art. 560 Abs. 1 und 2 ZGB und Art. 266i OR (Wortlaut siehe M-1). Einschränkung: M-3.
- **Übertragung nach Art. 263 OR und Zuweisung nach Art. 121 ZGB als Vertragsende plus neuer Vertrag:** Für die Nebenkosten ist das vertretbar, weil jeder Mieter nach seinen Mietstagen abgerechnet wird. Es entspricht dem Entscheid #155 Option A. Wortlaut siehe M-2 und M-4.
- **Begriffe** Mieter, Mietvertrag, Vertragsende, Korrespondenzadresse («an die Abrechnungen und Mahnungen gehen»), Mieterwechsel, Nachmieter, unbefristet, gekündigt: Die Szenarien und Texte verwenden sie gemäss Glossar, mit Ausnahme von V-1 (Mieterwechsel neben dem vorbelegten bisherigen Mieter) und V-2 (unbefristet).
- **Szenario `contract-detail.feature`** «Neuer Mietvertrag für denselben Mieter nach der Kündigung»: entspricht #156 «Done means».

## Nicht bestätigt

- **Art. 266i OR bei befristeten Verträgen** (M-3): Ich schliesse es nur aus der Gliederung «III. Ausserordentliche Kündigung» auf Fedlex. Lehre und Rechtsprechung habe ich nicht auf Fedlex geprüft: **unsicher**.
- **Eingetragene Partnerschaft:** Ob Art. 32 PartG für die Wohnung der Partner gilt wie Art. 121 ZGB, habe ich nicht auf Fedlex nachgeschlagen. Falls ja, sollte der Dokumentabschnitt den Fall nennen.
- **Ausschlagung der Erbschaft (Art. 566 ff. ZGB) und Kündigung durch den Vermieter an die Erben** (Zustellung an alle Erben, Art. 266l ff. OR): nicht geprüft. Dwello verschickt keine Kündigungen, das liegt also ausserhalb des Gegenstands.
- **Ehegatte schon Mitmieter:** Art. 121 ZGB betrifft den Fall, dass nur der andere Ehegatte Mieter ist. Wie Dwello Ehepaare als Mieter erfasst (eine Person oder «Anna und Peter Keller»), habe ich nicht geprüft. Bei einem gemeinsamen Mieter-Datensatz wäre «Vertragsende + neuer Mietvertrag» unnötig. Gesucht habe ich in `UBIQUITOUS_LANGUAGE.md:23` (Mieter = «Person»), ohne Ergebnis zu Mitmietern.
- **Ort des Hinweises im Assistenten** (Schritt «Wohnung»): Den Bildschirmfluss des Assistenten habe ich nicht geöffnet. Bestätigt ist nur, dass der Szenarioschritt nach «den Mieter … wählt» prüft.
- **Fremdsprachen** (fr/it/en): noch nicht vorhanden, nicht geprüft.
