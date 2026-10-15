# Fachreview #135, Runde 3 (Delta-Review)

Gegenstand: Delta `4931f65..93f6877` (Worktree `review-135-fach3`, Commit `93f6877`). Geprüft sind die offenen Befunde V-8 und V-9 aus Runde 2 (`docs/reviews/issue-135-fachreview-2.md`), die Schrittnummern der Texte zum weggefallenen Entwurf und ob das Delta neue fachliche Fragen aufwirft. Geändert haben sich `messages/{de,fr,it,en}.json:964–970`, `src/lib/statement-wizard.ts:271–287`, `src/__tests__/statement-generation.test.ts:74–85`, `src/__tests__/statement-wizard.dom.test.ts:990–1040` und `tests/e2e/features/statement-generate.feature:161`.

Weiter offen und hier nicht nochmals erhoben: die Zählregel (#199), der Begriff «Entwurf» (#200) und das Verhalten bei einem ganz abgerechneten Gebäude (#201).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-10 | Verwalter | Nit | it: «Dei {total} contratti …» ist bei Zahlen, die mit einem Vokal gesprochen werden (8, 11, 80 …), falsch. Dort heisst es «Degli 8 contratti». |
| V-11 | Verwalter | Nit | en: «… a statement that covers all or part of it». «it» kann sich auf den Mietvertrag statt auf die Abrechnungsperiode beziehen. Genau diese Doppeldeutigkeit vermeidet das Deutsche mit «diesen Zeitraum». |

Keine Blocker, keine Major, keine Minor.

## Status der Befunde aus Runde 2

| ID | Status in 93f6877 | Beleg |
|---|---|---|
| V-8 (Minor) | **behoben** | siehe unten |
| V-9 (Nit) | **behoben** | siehe unten |

### V-8: behoben

**Beleg.** `messages/de.json:967–970`:
- `_one`: «Von {total} Mietverträgen in dieser Abrechnungsperiode hat {billed} schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt.»
- `_many`: «… haben {billed} …»
- `_all_one`: «Der einzige Mietvertrag in dieser Abrechnungsperiode hat schon …»
- `_all_many`: «Alle Mietverträge in dieser Abrechnungsperiode haben schon …»

fr «contrats de bail de cette période de décompte», it «contratti di locazione di questo periodo di conteggio» und en «rental contracts in this billing period» sagen dasselbe. Szenario `statement-generate.feature:161` und DOM-Tests `statement-wizard.dom.test.ts:993, 1024, 1027, 1039` sind nachgeführt.

**Nachgerechnet** mit den Fällen aus Runde 2:
- Fall 1 (Lea Graf 2023, Eva Frei und Marc Huber 2024 mit Abrechnung 2024, Periode 2024): `total` 2, `billed` 2. Der Text lautet: «Alle Mietverträge in dieser Abrechnungsperiode haben schon …». Leas Mietvertrag liegt nicht in der Periode (`statement-generation.ts:60–62`). Der Satz stimmt jetzt wörtlich.
- Fall 2 (nur Marc in der Periode, mit Abrechnung): `total` 1, `billed` 1. Der Text lautet: «Der einzige Mietvertrag in dieser Abrechnungsperiode hat schon …». Der Verwalter weiss jetzt, dass die übrigen Mietverträge des Gebäudes ausserhalb der Periode liegen.
- Fall 3 (`total` 3, `billed` 1): «Von 3 Mietverträgen in dieser Abrechnungsperiode hat 1 schon …». Die Bezugsmenge ist jetzt genannt.
- Fall 0 (`billed` 0): kein Text (`BuildingChoice.svelte:33`). Unverändert und richtig.

«Diesen Zeitraum» bezieht sich eindeutig auf die Abrechnungsperiode. `UBIQUITOUS_LANGUAGE.md:129` definiert die Abrechnungsperiode selbst als «Zeitraum der Abrechnung». Es ist also kein neuer Fachbegriff, sondern das Wort aus der Definition. «Mietverträge in dieser Abrechnungsperiode» heisst Mietverträge, die sich mit der Periode überschneiden. Das entspricht `inPeriod` und dem Sprachgebrauch von «Mietstage» (`UBIQUITOUS_LANGUAGE.md:137`, «Tage, die ein Mietvertrag in der Abrechnungsperiode läuft»).

Grammatik: «Von 3 … haben 2», «Von 2 … hat 1» stimmen. `_one` kommt nur bei `billed === 1` und `billed < total` zum Zug, also bei `total ≥ 2`. Der Plural «Von {total} Mietverträgen» ist darum immer richtig. fr «Sur 2 contrats …, 1 a déjà» und «2 ont déjà» stimmen ebenfalls, it «1 ha già» und «2 hanno già» auch (zu «Dei» siehe V-10).

### V-9: behoben

**Beleg.** `src/__tests__/statement-generation.test.ts:74–85`, «zählt eine Abrechnung, die die Periode nur teilweise abdeckt, und keine, die vorher endet».

**Nachgerechnet.** Die Periode ist 01.10.2024–30.09.2025. Die Mietverträge kommen aus `:32–37`:
- `vorher` (bis 31.12.2023) und `auszug` (bis 31.03.2024) enden vor dem 01.10.2024 und sind nicht in der Periode.
- `einzug` (ab 01.05.2024) und `nachher` (ab 01.01.2025) sind in der Periode, also `contracts` 2.
- Abrechnung `nachher` 01.01.–31.12.2025: `2025-01-01 <= 2025-09-30` und `2025-12-31 >= 2024-10-01` treffen zu. Sie deckt die Periode teilweise ab und zählt als abgerechnet.
- Abrechnung `einzug` 01.10.2023–30.09.2024: `2024-09-30 >= 2024-10-01` trifft nicht zu. Sie endet am Tag vor dem Periodenbeginn und zählt nicht.
- Ergebnis `billed` 1, wie erwartet.

Der Test legt die Regel fest: Unter der Regel «nur Abrechnungen ganz innerhalb der Periode» (eine der Varianten in #199) wäre `billed` 0, der Test würde rot. Er zeigt also an, wenn die Texte mit #199 mitgehen müssen. Der Kommentar verweist auf #199.

Am Rand: Die Abrechnung von `einzug` beginnt am 01.10.2023, der Mietvertrag erst am 01.05.2024. In der Praxis endet eine Abrechnung nicht vor dem Mietbeginn. Für die geprüfte Grenze (Ende am Tag vor dem Periodenbeginn) spielt das keine Rolle. Darum kein Befund.

### Schrittnummern: bestätigt

`statement-wizard.ts:273–276` nimmt Nummer und Name aus derselben Liste `stepNames` (`:23–29`: Abrechnungsperiode, Gebäude, Heizprofil und Verwaltungspauschale, Vorschau, Erstellen). Gebäude ergibt `indexOf + 1` = 2, Heizprofil und Verwaltungspauschale ergibt 3. Das passt zu `de.json:818–822` und zur Kopfzeile «Schritt 3 von 5» (`statement-wizard.dom.test.ts:128`). Die Texte in allen vier Sprachen nehmen `{number}` an der Stelle der früheren festen 2 und 3. Die erwarteten Texte im DOM-Test (`:832–833, 842`) und im Szenario (`statement-generate.feature:156`) sind unverändert und stimmen weiter.

## Neue Befunde

### V-10 (Nit): it «Dei {total}» vor Zahlen mit Vokal

**Beleg.** `messages/it.json:967–968`: «Dei {total} contratti di locazione di questo periodo di conteggio, …».

**Warum.** Im Italienischen richtet sich der Artikel nach der gesprochenen Zahl: «dei 3 / dei 5 contratti», aber «degli 8 (otto) / degli 11 (undici) contratti». Bei einem Gebäude mit 8 oder 11 Mietverträgen in der Periode steht dann «Dei 8 contratti». Das ist sprachlich falsch, in einer App für unter 50 Wohnungen aber selten und ohne fachliche Folge.

**Was es behebt.** Eine Form ohne Artikel, wie im Französischen: «Su {total} contratti di locazione di questo periodo di conteggio, {billed} ha già un conteggio …» (`_many`: «… {billed} hanno già …»). Der DOM-Test prüft nur Deutsch und ändert sich nicht.

### V-11 (Nit): en «covers all or part of it» lässt den Bezug offen

**Beleg.** `messages/en.json:967–970`: «Of {total} rental contracts in this billing period, {billed} already has a statement that covers all or part of it.» Ebenso `_all_one` und `_all_many`.

**Warum.** «it» kann sich auf den Mietvertrag («one … has a statement that covers … it») oder auf die Abrechnungsperiode beziehen. Gemeint ist die Periode. Die deutsche Fassung vermeidet genau diese Doppeldeutigkeit mit «diesen Zeitraum» (Vorschlag aus Runde 2), fr und it mit «cette période» und «questo periodo». Inhaltlich ist der Satz nicht falsch, weil beide Lesarten ungefähr dasselbe ergeben.

**Was es behebt.** «… a statement that covers all or part of this period.» in allen vier en-Schlüsseln.

## Bestätigt (Delta)

- **Glossar und i18n-Begriffe:** Mietvertrag/contrat de bail/contratto di locazione/rental contract, Abrechnung/décompte/conteggio/statement und Abrechnungsperiode/période de décompte/periodo di conteggio/billing period entsprechen `UBIQUITOUS_LANGUAGE.md:129` und `docs/design/i18n-begriffe.md:54`. Neu ist nur das Alltagswort «Zeitraum»/«période»/«periodo». Es steht in der Definition der Abrechnungsperiode und ist kein fehlender Fachbegriff.
- **Stil:** förmliche Anrede unverändert, «ss» statt «ß», fr mit Guillemets und geschütztem Leerzeichen unverändert (`« {step} »`).
- **Mietrecht:** Das Delta ändert nur Erklärtexte im Assistenten und einen Test. Es enthält keine Aussage gegenüber dem Mieter und keine Rechtsaussage. Eine Fedlex-Stelle ist nicht nötig.
- **Implementation-Plan:** Die Zeile zu Runde 2 (`implementation_plan.md:12`) gibt V-8 und V-9 richtig wieder.

## Nicht bestätigt

- **Darstellung im Browser:** Ich habe nur Code, Texte und Tests gelesen. Weder die App noch die Tests habe ich ausgeführt. Ob der DOM-Test rot war, bevor die Texte geändert wurden, habe ich nicht nachgeprüft. Der Plan sagt es (`implementation_plan.md:12`).
- **`statements_existing_note`** (`de.json:1005`, «… in dieser Periode …»): unverändert und weiter Teil von #199, wie in Runde 2. Ob #199 diesen Text nennt, habe ich nicht nachgesehen.
- **Art. 4 Abs. 1 VMWG:** In dieser Runde nicht erneut auf Fedlex nachgelesen, weil das Delta keine Rechtsaussage enthält. Es gilt der Stand aus Runde 1 (**unsicher**).
