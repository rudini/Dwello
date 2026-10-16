# Fachreview W10-3 (Runde 3, letzte): #156 (B-16) und #155 (F-23)

Gegenstand: `git diff 2e135d9 552536c` im Worktree `review-w10-fach3` (Commit 552536c). Gelesen: `messages/{de,fr,it,en}.json` (`contracts_parties_fixed_by_law`, `contracts_parties_fixed_transfer`, `contracts_end_death`), `src/routes/contracts/ContractForm.svelte:217-225`, `src/routes/contracts/[id]/+page.svelte:226-228`, `src/routes/tenants/TenantFormFields.svelte`, `docs/anforderungen-vertragsende.md` Regel 4, die geänderten Tests und Schritte sowie `docs/design/personas/weber-f23.md`.
Vorberichte: `docs/reviews/w10-fachreview-1.md`, `docs/reviews/w10-fachreview-2.md`.
Gesetzeswortlaut aus dem Fedlex-Filestore, den ich in Runde 1 abgerufen habe (OR Stand 1. Oktober 2026, ZGB Stand 1. Juli 2026). Für diese Runde habe ich daraus neu Art. 121 und 176 ZGB, Art. 263 und 266i OR sowie die Gliederung vor Art. 119/121 ZGB ausgelesen.

## Übersicht

| ID | Rolle | Schwere | Befund | Status |
|---|---|---|---|---|
| M-1 | Mietrecht | Major (Rest) | «beenden Sie den Mietvertrag nicht» galt ohne Ausnahme, auch nach der Kündigung durch die Erben (Art. 266i OR) | **erledigt** |
| Weber P-1 | Verwalter | (Persona: Major) | Hinweis nannte ein Feld «Korrespondenzadresse», das es im Mieterformular nicht gibt | **erledigt** |
| Weber P-3 | Mietrecht | (Persona: Major) | Zuweisung durch ein Gericht war zu weit gefasst (Eheschutz, Art. 176 ZGB) | **erledigt** |
| Weber P-9 | Verwalter | (Persona: Nit) | Tod und Eintritt eines Dritten standen in einem langen Absatz | **erledigt** |
| Weber P-4 | Mietrecht | (Persona: Major) | Solidarhaftung und Verweigerung nur aus wichtigem Grund fehlen im Hilfetext | **Ablehnung trägt**, aus fachlicher Sicht höchstens Minor |

Neue Blocker oder Major: keine.

---

## M-1 (erledigt)

**Beleg.**
- `contracts_end_death` (de): «Ist der Mieter gestorben, endet der Mietvertrag nicht von selbst: Er geht auf die Erben über. Erfassen Sie das Vertragsende erst, wenn die Erben oder Sie gekündigt haben. Tragen Sie bis dahin …»
- `contracts_parties_fixed_by_law` (de): «… Ändern Sie das Vertragsende deswegen nicht; erfassen Sie eines erst, wenn die Erben oder Sie gekündigt haben, …»
- Art. 266i OR: «Stirbt der Mieter, so können seine Erben mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin kündigen.»
- Regel 4 (`docs/anforderungen-vertragsende.md:34`): «Der Mietvertrag bleibt erfasst, ohne neues Vertragsende, bis die Erben oder der Vermieter gekündigt haben; erst dann erfasst «Beenden» den Kündigungstermin».

**Bewertung.** Beide Texte erlauben jetzt das Beenden nach einer Kündigung durch die Erben oder den Vermieter. Der Rest aus Runde 2 ist damit behoben. Behoben ist auch der zweite Punkt aus Runde 2: «Ändern Sie das Vertragsende deswegen nicht» lässt ein bestehendes Vertragsende (befristet oder vom Verstorbenen gekündigt) stehen. Das stimmt mit Art. 560 ZGB überein: Die Erben treten in den Vertrag ein, wie er ist. Der optionale Satz zur Frist der Erben fehlt in der UI. Das ist zulässig, Regel 4 nennt ihn.
fr «les héritiers ou vous avez résilié», it «gli eredi o Lei avete dato disdetta» und en «the heirs or you have given notice» sagen inhaltlich dasselbe wie de.
Die Szenarien sichern den Rest ab: `tests/e2e/steps/contract-detail.steps.ts:199-200` prüft «erst, wenn die Erben oder Sie gekündigt haben». Dazu kommen die DOM-Tests `contract-detail-page.dom.test.ts:176-180` und `contract-edit.dom.test.ts:149-150`.

## Weber P-1 (erledigt)

**Beleg.** Im Mieterformular heisst der Abschnitt der Adresse «Adresse»: `TenantFormFields.svelte:92` `m.buildings_address()`, de «Adresse», fr «Adresse», it «Indirizzo», en «Address». Das Feld E-Mail ist `TenantFormFields.svelte:63` `m.tenants_email()`, de «E-Mail», fr «E-mail», it «E-mail», en «Email». Die Hilfetexte zitieren in allen vier Sprachen genau diese Namen: «unter «Adresse» … bei Post per E-Mail auch unter «E-Mail»», fr «sous « Adresse » … sous « E-mail »», it «sotto «Indirizzo» … sotto «E-mail»», en «under «Address» … under «Email»».

**Bewertung.** Der Verwalter findet die Felder jetzt. Er erfährt auch, dass er beim Korrespondenzkanal E-Mail die E-Mail-Adresse ändern muss. Damit ist das Fehlerrisiko aus der Persona behoben, dass die Post an die E-Mail-Adresse der Verstorbenen geht. Dass das Glossar den Begriff Korrespondenzadresse führt (`UBIQUITOUS_LANGUAGE.md:24`, Felder `address`, `postal_code`, `city`), widerspricht dem nicht. Regel 4 verbindet beide: «Korrespondenzadresse (im Mieterformular «Adresse», bei Post per E-Mail auch «E-Mail»)». Im UI-Text ist «Adresse» die Beschriftung des Felds, kein neuer Fachbegriff. Den Schritt in `contract-edit.feature:104` («… als Korrespondenzadresse einträgt») darf das Szenario nach dem Glossar so nennen.

## Weber P-3 (erledigt)

**Beleg.**
- `contracts_parties_fixed_transfer` (de): «… oder wenn ein Gericht bei der Scheidung die Wohnung der Familie einem Ehegatten zuweist, …». fr «lors du divorce», it «con il divorzio», en «in a divorce».
- Art. 121 Abs. 1 ZGB: «Ist ein Ehegatte wegen der Kinder oder aus anderen wichtigen Gründen auf die Wohnung der Familie angewiesen, so kann das Gericht ihm die Rechte und Pflichten aus dem Mietvertrag allein übertragen, sofern dies dem anderen billigerweise zugemutet werden kann.» Die Bestimmung steht auf Fedlex unter «Vierter Titel: Die Ehescheidung und die Ehetrennung», «Dritter Abschnitt: Die Scheidungsfolgen», «C. Wohnung der Familie».
- Art. 176 Abs. 1 Ziff. 2 ZGB: «die Benützung der Wohnung und des Hausrates regeln».
- Art. 118 Abs. 2 ZGB (Ehetrennung): «Im Übrigen finden die Bestimmungen über Massnahmen zum Schutz der ehelichen Gemeinschaft sinngemäss Anwendung.»

**Bewertung.** Eine Übertragung des Mietvertrags sieht nur Art. 121 ZGB vor, und zwar als Scheidungsfolge. Eheschutz (Art. 176 ZGB) und Ehetrennung (Art. 118 Abs. 2 ZGB) regeln nur die Benützung. «Bei der Scheidung» ist darum richtig und reicht aus. Regel 4 sagt dasselbe («durch das Scheidungsgericht … nicht bei Eheschutzmassnahmen, Art. 176 ZGB, die nur die Benutzung regeln»). Dass das Gesetz «Benützung» schreibt, ist nur eine Variante der Schreibweise und kein Befund. Dass Art. 176 ZGB nur im Dokument steht und nicht in der UI, ist vertretbar: Der Hilfetext nennt den Fall nur noch positiv (Scheidung), sodass ein Laie den Eheschutz nicht mehr darunter liest.

## Weber P-9 (erledigt)

**Beleg.** `ContractForm.svelte:224-225`: `contracts_parties_fixed_by_law` (Tod) und `contracts_parties_fixed_transfer` (Eintritt eines Dritten) stehen jetzt in zwei eigenen `<p>`. Zusammen ergeben sie denselben Text wie bisher, nur ist der Satz zur Übertragung abgetrennt. Inhaltlich hat sich nichts verschoben, die Tests prüfen beide Teile im Container `contract-parties-help`.

## Weber P-4 (Ablehnung trägt)

**Beleg.**
- Art. 263 Abs. 2 OR: «Der Vermieter kann die Zustimmung nur aus wichtigem Grund verweigern.»
- Art. 263 Abs. 4 OR: «Er haftet jedoch solidarisch mit dem Dritten bis zum Zeitpunkt, in dem das Mietverhältnis gemäss Vertrag oder Gesetz endet oder beendet werden kann, höchstens aber für zwei Jahre.» Ebenso Art. 121 Abs. 2 ZGB.
- Regel 4: «Der bisherige Mieter haftet höchstens zwei Jahre solidarisch weiter (Art. 263 Abs. 4 OR, Art. 121 Abs. 2 ZGB); Dwello bildet das nicht ab.»

**Bewertung.** Der Hilfetext sagt, wie man in Dwello erfasst, und behauptet nichts Falsches. Er sagt weder, dass der Vermieter frei verweigern darf, noch, dass der bisherige Mieter entlassen ist. #155 hat nur einen beschreibenden Hilfetext entschieden. Eine Rechtsberatung zur Verweigerung gehört nicht dazu. Ein Restrisiko bleibt: Das Vertragsende des bisherigen Mieters (*gekündigt*) kann man als Entlassung aus der Haftung lesen. Fachlich ist das höchstens Minor. So habe ich es schon in Runde 1 eingestuft (M-5 Nit, ins Dokument). Es betrifft nicht die Nebenkostenabrechnung des neuen Mieters, nur ein Inkasso bei dessen Zahlungsausfall. Ein Satz wie «Der bisherige Mieter haftet bis zu zwei Jahre mit (Art. 263 Abs. 4 OR).» wäre eine mögliche spätere Verbesserung, ist aber für diese Runde kein Blocker oder Major.

---

## Nicht bestätigt

- **Fedlex nicht neu heruntergeladen:** Ich habe aus den Dateien zitiert, die ich in Runde 1 vom Fedlex-Filestore geladen habe. Sie liegen im Scratchpad unter `fedlex/` (OR Stand 1. Oktober 2026, ZGB Stand 1. Juli 2026). Ob seither eine neuere Fassung gilt, habe ich nicht geprüft.
- **Art. 32 PartG** (eingetragene Partnerschaft, Weber P-8, Minor): weiterhin nicht auf Fedlex nachgeschlagen. Ob der Hilfetext «oder eingetragenen Partner» nennen sollte, bleibt offen.
- **Französischer und italienischer Gesetzeswortlaut** für «divorce» und «divorzio» (CC 121): nicht auf Fedlex abgerufen. Die Begriffe sind aber allgemeinsprachlich eindeutig: **unsicher**, inhaltlich unkritisch.
- **Unverändert aus den Runden 1 und 2 offen:** Art. 266i OR bei befristeten Verträgen (**unsicher**), Ehegatte als Mitmieter, Ausschlagung der Erbschaft. Wo ich gesucht habe, steht in den Vorberichten.
- **Bildschirme nicht geöffnet:** Ich habe nur den Code und die Texte gelesen. Die Darstellung der zwei Absätze unter «Bearbeiten» habe ich nicht im Browser gesehen.
