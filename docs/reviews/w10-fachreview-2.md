# Fachreview W10-2 (Runde 2): #156 (B-16) und #155 (F-23)

Gegenstand: `git diff 095bc39 2e135d9` im Worktree `review-w10-fach2` (Commit 2e135d9), gelesen in den Dateien des Commits: `messages/{de,fr,it,en}.json`, `src/routes/contracts/ContractForm.svelte`, `src/routes/contracts/[id]/+page.svelte`, `src/routes/contracts/[id]/NextSteps.svelte`, `src/routes/contracts/new/OpenContracts.svelte`, `docs/anforderungen-vertragsende.md` (Regel 4) und die Szenarien in `tests/e2e/features/contract-*.feature`.
Vorbericht: `docs/reviews/w10-fachreview-1.md`. Die Gesetzeszitate stammen aus der Fedlex-Fassung, die in Runde 1 abgerufen wurde (OR Stand 01.10.2026, ZGB Stand 01.07.2026). Für diese Runde habe ich sie nicht neu abgerufen.

## Übersicht

| ID | Rolle | Schwere | Befund | Status |
|---|---|---|---|---|
| V-1 | Verwalter | Major | Vorbelegter Mieter beim Mieterwechsel | **erledigt** |
| M-1 | Mietrecht | Major | Hilfe zum Todesfall fehlt im Dialog «Beenden» | **teilweise erledigt, Rest offen (Major)**: der neue Satz verbietet das Vertragsende ohne Ausnahme, auch nach der Kündigung durch die Erben |
| M-2 | Mietrecht | Minor | Übertragung/Zuweisung: ohne Kündigungsfrist, gleiche Bedingungen | erledigt |
| M-3 | Mietrecht | Minor | «läuft weiter, bis er gekündigt wird» / befristet | erledigt (Satz entfernt, Art. 266i OR im Dokument); Folge siehe M-1 |
| M-4 | Mietrecht | Minor | schriftliche Zustimmung | erledigt |
| V-2 | Verwalter | Minor | Titel «unbefristet» | erledigt |
| V-7 | Verwalter | Nit | Adresse der Erben | erledigt |
| V-8 | Verwalter | Nit | Wortlaut des Hinweises | erledigt (Punkte 1 und 2; Punkt 3 nicht übernommen, das ist zulässig) |
| M-5 | Mietrecht | Nit | Solidarhaftung im Dokument | erledigt |

Neue Blocker oder Major: keine, ausser dem Rest von M-1.

---

## Offener Befund

### M-1 (Major, Rest): «beenden Sie den Mietvertrag nicht» ohne Ausnahme

**Beleg.**
- `messages/de.json:630` (`contracts_end_death`), angezeigt im Dialog «Mietvertrag beenden» unter dem Hinweis zur Kündigungsfrist (`src/routes/contracts/[id]/+page.svelte:227-228`): «Ist der Mieter gestorben, beenden Sie den Mietvertrag nicht: Er geht auf die Erben über. Tragen Sie beim Mieter als Korrespondenzadresse die Adresse ein, an die die Post für die Erben geht.»
- `messages/de.json` `contracts_parties_fixed_by_law` (Bearbeiten, «Mieter und Wohnung»): «Stirbt der Mieter, endet der Mietvertrag nicht: Er geht auf die Erben über. Erfassen Sie dann kein Vertragsende, …»
- Art. 266i OR: «Stirbt der Mieter, so können seine Erben mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin kündigen.»
- Regel 4 in `docs/anforderungen-vertragsende.md:34` nennt dieses Kündigungsrecht. In den UI-Texten fehlt es, seit der Satz «läuft weiter, bis er gekündigt wird» wegen M-3 weggefallen ist.

**Warum falsch.** Der Satz steht genau in dem Dialog, in dem der Verwalter später die Kündigung durch die Erben erfassen muss, und er verbietet das Beenden ohne Ausnahme. Den typischen Fall verbietet er damit auch: Die Erben kündigen nach Art. 266i OR, der Verwalter öffnet «Beenden» und liest «Ist der Mieter gestorben, beenden Sie den Mietvertrag nicht». Ein Laie (Zielgruppe laut CLAUDE.md, «Design-Regeln») lässt den Vertrag dann offen. Dwello rechnet die Erben über den Kündigungstermin hinaus als Mieter, mit Akonto und Nebenkosten, die sie nicht schulden. Die Wohnung erscheint nicht als Leerstand. Ein Nachmieter-Vertrag scheitert an der Überschneidung (Regel 1), und der Verwalter weiss nicht, warum. Dasselbe gilt, wenn der Vermieter den Erben ordentlich kündigt.

Zweiter Punkt am selben Satz: Unter «Bearbeiten» erscheint «Erfassen Sie dann kein Vertragsende» auch bei einem Vertrag, der schon ein Vertragsende hat (befristet, oder vom Verstorbenen noch gekündigt). Dort kann man ihn als «Vertragsende entfernen» lesen. Rechtlich bleibt ein solches Vertragsende bestehen. Für sich allein wäre das Minor, es lässt sich aber mit derselben Korrektur beheben.

Den Fehler aus #155 (Vertragsende am Todestag) verhindert der neue Satz. Er ersetzt ihn aber durch den umgekehrten Fehler. Darum bleibt M-1 offen, zurückgestuft vom ursprünglichen Befund auf diesen Rest, in der Schwere aber Major.

**Korrektur** (ein Halbsatz pro Text, in allen vier Sprachen):
- `contracts_end_death`: «Ist der Mieter gestorben, endet der Mietvertrag nicht von selbst: Er geht auf die Erben über. Erfassen Sie das Vertragsende erst, wenn die Erben oder Sie gekündigt haben. Tragen Sie bis dahin beim Mieter als Korrespondenzadresse die Adresse ein, an die die Post für die Erben geht.»
- `contracts_parties_fixed_by_law`, erster Teil: «Stirbt der Mieter, endet der Mietvertrag nicht von selbst: Er geht auf die Erben über. Ändern Sie das Vertragsende deswegen nicht; erfassen Sie eines erst, wenn die Erben oder Sie gekündigt haben, und tragen Sie bis dahin …»
- Optional, ebenfalls aus Art. 266i OR: «Die Erben können mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin kündigen.» Dieser Satz ist rechtlich richtig. Ich lasse ihn optional, weil die Erben die Kündigung selbst aussprechen und Dwello die Frist nicht prüft (Regel 3).
- In Regel 4 von `docs/anforderungen-vertragsende.md`: «Der Mietvertrag bleibt erfasst, ohne Vertragsende, *bis er gekündigt ist*».
- Die Szenarien prüfen heute nur «Erben» (`tests/e2e/steps/contract-detail.steps.ts:200`). Ein Schritt «… dass er das Vertragsende erst nach der Kündigung erfasst» würde den Rest absichern.

Kommt diese Ergänzung nach Ihrer Lesart nicht aus dem Entscheid in #155 («a help text»), gehört sie unter «Blocked on me». Aus meiner Sicht gehört sie zum selben Hilfetext und braucht keinen neuen Entscheid.

---

## Geprüft und erledigt

### V-1 (erledigt)
`ContractForm.svelte:228-234`: Der Link heisst jetzt «Neuen Mietvertrag für {name} erfassen» (`contracts_new_for_tenant`) und führt nach `/contracts/new?tenant=…&start={Tag danach}`. Damit ist klar, dass er zum bisherigen Mieter gehört. Wer einen Nachmieter erfassen will, folgt einem Link mit dem Namen des Vormieters nicht versehentlich. Ihre Begründung, keinen zweiten Link anzubieten, trägt: #156 hat keinen entschieden. Dass der Hilfetext darüber zuerst den Mieterwechsel nennt, ist nur noch eine Frage der Reihenfolge (Minor, nicht neu erhoben). `nextDay` ist unverändert dieselbe UTC-Rechnung wie in Runde 1 (nachgerechnet: 2099-03-31 → 2099-04-01, 2028-02-28 → 2028-02-29, 2099-12-31 → 2100-01-01).

### M-2 (erledigt)
`contracts_parties_fixed_by_law`: «… erfassen Sie ein Vertragsende am Tag vor dem Wechsel, ohne Kündigungsfrist, und ab dem Tag des Wechsels einen neuen Mietvertrag mit denselben Bedingungen.» Das stimmt mit Art. 263 Abs. 3 OR überein («tritt der Dritte anstelle des Mieters in das Mietverhältnis ein»), ebenso mit Art. 121 Abs. 1 ZGB («die Rechte und Pflichten aus dem Mietvertrag allein übertragen»). Dass «gekündigt» bewusst in Kauf genommen wird, steht in Regel 4. Zur Lücke: Der Dialog «Beenden» nennt weiterhin nur die Kündigungsfrist, nicht den Fall ohne Frist. Unter «Bearbeiten» steht er aber, und der Dialog prüft die Frist nicht (Regel 3). Das ist nicht Major.

### M-3 (erledigt)
Der ungenaue Satz «läuft weiter, bis er gekündigt wird» ist weg. Regel 4 nennt Art. 266i OR richtig («mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin»). Das Weglassen in den UI-Texten verursacht den Rest von M-1 (siehe oben).

### M-4 (erledigt)
«mit Ihrer schriftlichen Zustimmung» entspricht Art. 263 Abs. 1 OR: «mit schriftlicher Zustimmung des Vermieters». Ebenso fr «avec votre consentement écrit», it «con il Suo consenso scritto», en «with your written consent».

### V-2 (erledigt)
Titel `contracts_open_contract_title`: «{name} hat einen Mietvertrag ohne Vertragsende». Das passt zum Filter `!c.end_date` (`ContractWizard.svelte:79-85`) und zum umbenannten Szenario «Mieter hat noch einen Mietvertrag ohne Vertragsende» (`contract-new.feature`).

### V-7 (erledigt)
«die Adresse …, an die die Post für die Erben geht» steht in beiden Texten. Dass der Name bleibt, steht in Regel 4. Der Begriff Korrespondenzadresse ist gemäss Glossar verwendet.

### V-8 (erledigt)
`contracts_open_contract_text`: «Für {name} ist ein Mietvertrag für die Wohnung {apartment} ({building}) ohne Vertragsende erfasst. Zieht {name} in eine andere Wohnung um, beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden». Mietet {name} beide Wohnungen, machen Sie hier weiter.» Der Text ist neutral und stimmt auch bei einem künftigen Vertrag. Den Button gibt es: `contracts_end_action` heisst «Beenden», fr «Terminer», it «Terminare», en «End contract», jeweils gleich wie im Text. Punkt 3 (Auflösung im Einvernehmen) haben Sie nicht übernommen. Das war ein Nit und ist zulässig.

### M-5 (erledigt)
Regel 4: «Der bisherige Mieter haftet höchstens zwei Jahre solidarisch weiter (Art. 263 Abs. 4 OR, Art. 121 Abs. 2 ZGB); Dwello bildet das nicht ab.» Das stimmt mit Art. 263 Abs. 4 OR überein («… höchstens aber für zwei Jahre») und mit Art. 121 Abs. 2 ZGB («… höchstens aber während zweier Jahre»).

### Übersetzungen der neuen Texte
- fr: «bail de locaux commerciaux», «logement de la famille» und «délai de résiliation». Die ersten beiden folgen dem Gesetzeswortlaut (CO 263, CC 121), der dritte dem bestehenden `contracts_end_notice_hint`.
- it: «locali commerciali», «abitazione familiare» und «termine di disdetta».
- en: Der Sinn ist gleich.

Keine Abweichung im Inhalt gegenüber de.

### Szenarien
`contract-detail.feature` «Beenden nennt den Tod des Mieters» (neu) und die drei Szenarien ohne `@wip` in `contract-edit.feature` und `contract-new.feature` entsprechen den Texten. Einschränkung: siehe M-1, Korrektur, letzter Punkt.

## Nicht bestätigt

- **Fedlex-Wortlaut in dieser Runde:** nicht neu abgerufen. Die Zitate (Art. 263 Abs. 1, 3, 4 OR; Art. 266i OR; Art. 121 Abs. 1, 2 ZGB; Art. 560 ZGB) stammen aus Runde 1, Fedlex-Filestore, gleicher Stand.
- **Französischer und italienischer Gesetzeswortlaut** (CO/CC 263, 121): Die Begriffe habe ich aus meiner Kenntnis der Gesetzestexte verglichen, nicht auf Fedlex abgerufen: **unsicher**, inhaltlich aber unkritisch.
- **Unverändert aus Runde 1 offen:** Art. 266i OR bei befristeten Verträgen (**unsicher**), Art. 32 PartG, Ehegatte als Mitmieter, Ausschlagung der Erbschaft. Wo ich gesucht habe, steht im Vorbericht.
- **Ablauf im Assistenten mit `?tenant=&start=`** (bei welchem Schritt er beginnt, ob der vorbelegte Beginn sichtbar ist): Den Bildschirm habe ich nicht geöffnet, nur `startValues` in `src/lib/contract-wizard.ts:168` gelesen (der Beginn aus der Adresse hat Vorrang vor einem Entwurf).
