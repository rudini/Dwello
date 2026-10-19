# Fachreview #457, Runde 1: Einspruchshilfe nach dem Ende eines befristeten Mietvertrags

Gegenstand: Commit `2d0596d6` (Worktree `/home/user/Dwello`, HEAD = `2d0596d6`), @wip-Szenario «Die Frage nach dem Vertragsende nennt die stillschweigende Fortsetzung» (`tests/e2e/features/contract-detail.feature:324-331`), DOM-Test (`src/__tests__/contract-detail-page.dom.test.ts:844-847`) und die fr/it/en-Entwürfe des zweiten Satzes von `contracts_fixed_term_objection` aus Issue #457. Der deutsche Satz ist vom Product Owner entschieden (#410 Punkt 3).

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | en: «the end of the contract» weicht vom Begriff «contract end» ab (`i18n-begriffe.md:28`, `en.json` sonst «contract end»); «for a longer time» ist ein Germanismus, «usually already continues open-ended» holpert. Fix: Wortlaut unten |
| V-2 | Verwalter | Nit | fr: «pendant longtemps» ist stärker als «längere Zeit»; «pendant une période prolongée» trifft es (wie it «per un periodo prolungato»). Sonst korrekt: «loyer», «fin du contrat», «durée indéterminée», «résiliation» wie in der Begriffstabelle und in `contracts_fixed_term_question` |
| V-3 | Verwalter | Nit | Szenario: Der Schritt «Dann sagt die Frage nach dem Vertragsende "…"» prüft den Hinweis im Feld «Befristeter Mietvertrag abgelaufen», nicht die Frage. Er passt aber, weil er den ganzen Bereich `contract-fixed-term-check` liest. Besser wäre «Dann sagt der Hinweis zum abgelaufenen Mietvertrag "…"»; wenn er bleibt, ist das kein Hindernis |
| M-1 | Mietrecht | Nit | de (entschieden) «endet nur mit einer Kündigung»: Ein unbefristeter Vertrag endet auch durch eine Aufhebungsvereinbarung mit dem Mieter. Das Gesetz regelt sie nicht in Art. 266 ff. OR, deshalb **unsicher**. Für den Laien stimmt die Aussage praktisch (Rückgabe verlangen genügt nicht, es braucht eine Kündigung nach Art. 266a OR), deshalb keine Änderung. Nur zur Kenntnis |

Keine Blocker, keine Major.

## Empfohlener Wortlaut (ganzer Schlüssel `contracts_fixed_term_objection`)

- **de** (entschieden, unverändert): «Sind Sie nicht einverstanden, verlangen Sie die Rückgabe der Wohnung sofort schriftlich und lassen Sie sich beraten. Haben Sie den Mietzins nach dem Vertragsende längere Zeit angenommen, läuft der Mietvertrag meist schon unbefristet weiter und endet nur mit einer Kündigung.»
- **fr**: «Si vous n’êtes pas d’accord, exigez immédiatement par écrit la restitution de l’appartement et faites-vous conseiller. Si vous avez accepté le loyer pendant une période prolongée après la fin du contrat, le contrat de bail se poursuit en général déjà pour une durée indéterminée et ne prend fin que par une résiliation.»
- **it** (Entwurf unverändert übernehmen): «Se non è d’accordo, esiga subito per iscritto la restituzione dell’appartamento e si faccia consigliare. Se dopo la fine del contratto ha accettato la pigione per un periodo prolungato, di regola il contratto di locazione prosegue già a tempo indeterminato e termina solo con una disdetta.»
- **en**: «If you do not agree, demand the return of the apartment in writing at once and get advice. If you have accepted the rent for an extended period after the contract end, the rental contract has usually already become open-ended and ends only with a notice of termination.»

Begründung en: «become open-ended» steht schon in `glossary_fixed_term_text` («the contract becomes open-ended»), «contract end» kommt aus der Begriffstabelle, und «notice of termination» stimmt mit `i18n-begriffe.md:33` überein.

## Bestätigt

- **Rechtsgrundlage** Art. 266 OR, Fassung vom 01.10.2026, heute aus dem Fedlex-Filestore geladen (`eli/cc/27/317_321_377/20261001`, de/fr/it):
  - de: «¹ Haben die Parteien eine bestimmte Dauer ausdrücklich oder stillschweigend vereinbart, so endet das Mietverhältnis ohne Kündigung mit Ablauf dieser Dauer. ² Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»
  - fr: «¹ Lorsque les parties sont convenues expressément ou tacitement d’une durée déterminée, le bail prend fin sans congé à l’expiration de la durée convenue. ² Si le bail est reconduit tacitement, il devient un contrat de durée indéterminée.»
  - it: «¹ La locazione conclusa tacitamente o espressamente per un tempo determinato cessa senza disdetta con lo spirare del tempo previsto. ² In caso di riconduzione tacita, la locazione è considerata a tempo indeterminato.»
  - Art. 266a Abs. 1 OR (de): «Die Parteien können das unbefristete Mietverhältnis unter Einhaltung der gesetzlichen Fristen und Termine kündigen, sofern sie keine längere Frist oder keinen anderen Termin vereinbart haben.» fr: «… une partie peut le résilier …», it: «… ciascuna delle parti può dare la disdetta …».
  - Die Entwürfe geben die Folge von Abs. 2 richtig wieder: unbefristet, Ende nur durch Kündigung nach Art. 266a OR. «résiliation» (fr) und «disdetta» (it) sind die Wörter des Gesetzes. Die Absicherung «meist» erscheint in allen Sprachen («en général», «di regola», «usually») und ist nötig, weil das Gesetz den Zeitpunkt offenlässt.
- **Begriffe** (`docs/design/i18n-begriffe.md`): Mietzins = loyer / pigione / rent (Z. 35), Vertragsende = fin du contrat / fine del contratto / contract end (Z. 28), Unbefristet = durée indéterminée / a tempo indeterminato / open-ended (Z. 30), Kündigung = résiliation / disdetta / notice of termination (Z. 33). fr und it halten sie ein, en nicht beim Vertragsende (V-1). «Mietzins» ist im Glossar ein Synonym von Nettomiete (`UBIQUITOUS_LANGUAGE.md:49`); «Befristet / Unbefristet» und «stillschweigende Fortsetzung» stehen in `UBIQUITOUS_LANGUAGE.md:38`.
- **Stil:** fr und it übernehmen das Verb der Frage (`contracts_fixed_term_question`: «se poursuit alors pour une durée indéterminée» / «prosegue a tempo indeterminato»). Die Anrede (vous, Lei) und die typografischen Apostrophe stimmen mit den Nachbartexten überein.
- **Szenario:** Es gehört zum Abschnitt A-6 und hat dieselben Vorbedingungen wie «Befristeten Mietvertrag unbefristet weiterführen» (Ende 31.12.2025, heute später). Es prüft den entschiedenen deutschen Satz wörtlich. Ein Szenario ohne «Wenn» prüft nur einen Zustand, und das passt hier. Der DOM-Test prüft denselben Satz. Dass fr/it/en kein Deutsch zeigen, prüft `sprachen-bildschirme.feature`; ein eigenes Szenario pro Sprache verlangt das Issue nicht.
- **Ort:** Die Übersicht (`src/lib/overview.ts:221-233`) zeigt nur `contracts_fixed_term_question`, die Einspruchshilfe steht nur in `FixedTermCheck.svelte:51`. Das entspricht dem Issue («Where», «Done means»). Der Marker #308 in `overview.ts` betrifft den Fragetext, der nach #410 Punkt 3 unverändert bleibt; er darf weg.

## Nicht bestätigt

- **Ab wann die stillschweigende Fortsetzung eintritt und ob ein sofortiger Widerspruch sie verhindert:** Das Gesetz sagt es nicht (Art. 266 OR oben). `mmx search` fand nur Lehre und Rechtsprechung, ohne dass ich sie im Wortlaut gelesen habe: BGE 139 III 145 (Snippet: «l’art. 266 al. 2 CO envisage expressément une reconduction tacite du bail à durée déterminée et présume que le nouveau contrat est de durée indéterminée»), mietrecht.ch MP 3/03 und L. Bieri, «La requalification des baux de durée déterminée» (2019). Deshalb **unsicher**. Der Text fängt das mit «meist» und «lassen Sie sich beraten» auf.
- **Aufhebungsvereinbarung als weiterer Endgrund** (M-1): steht nicht im Gesetzestext (gelesen: Art. 266, 266a OR auf Fedlex). **Unsicher.**
- **Darstellung am Bildschirm:** Die Texte habe ich nicht im Browser gesehen, also weder die Länge im Panel bei 390 px noch die Darstellung in fr/it/en. Das prüft die Persona-Runde.
