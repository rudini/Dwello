# Fach-Review #199, Runde 2: Hilfetext `statements_short_period_help`

Worktree: `review-199-fach2`, Commit 571d2481. Vorbericht: `docs/reviews/199-fachreview-1.md`. Gegenstand: nur der Hilfetext am Link «Kurze Abrechnungsperiode … abrechnen» (`src/routes/statements/generate/OverlapWays.svelte:39-44`, `src/routes/contracts/[id]/MissingStatement.svelte:79-82`, `messages/{de,fr,it,en}.json:1263`), entschieden in #486 (Option 1).

## Status der offenen IDs aus Runde 1

| ID | Status |
|---|---|
| M-1 | **Offen, hochgestuft auf Major** (neu als M-2 geführt). Der Vorschlag aus Runde 1 («informieren Sie die Mieter») war «unsicher». Der Fedlex-Wortlaut zeigt jetzt: «informieren» reicht nicht. Weber P-1 trifft zu. |

## Befunde (Delta)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-2 | Mietrecht | Major | Der entschiedene Text (#486) sagt dem Vermieter, er solle die Mieter «informieren». Steht die Abrechnungsperiode im Mietvertrag, braucht eine Änderung aber die Zustimmung der Mieter (Art. 1 OR) oder, einseitig, das amtliche Formular auf den nächstmöglichen Kündigungstermin (Art. 269d Abs. 1 und 3 OR). Neuer Wortlaut siehe unten. |
| V-1 | Verwalter | Minor | Helga P-3: Der Text sagt nicht, wo man nachsieht. Behebung: Der neue Wortlaut nennt den Ort («oft bei den Nebenkosten») und den Weg (schriftliche Zustimmung oder amtliches Formular). |
| V-2 | Verwalter | Minor | «über den Wechsel» setzt einen Wechsel der Einstellung voraus. Auf der Seite des Mietvertrags steht der Text aber auch unter kurzen Abrechnungsperioden in der Vergangenheit, für die nie ein Wechsel stattfand (Weber P-2, Helga P-1). Behebung: Der neue Wortlaut nennt keinen «Wechsel». Er gilt für jede kurze Abrechnungsperiode. P-2 selbst (das Raster für die Vergangenheit) ist nicht Gegenstand dieses Berichts. |
| V-3 | Verwalter | Nit | Helga möchte eine Vorlage für den Brief an die Mieter. Das ist eine neue Funktion, keine Textfrage. Vorschlag: ein Issue `produkt` «Vorlage für die Zustimmung der Mieter zu einer neuen Abrechnungsperiode». Der neue Wortlaut braucht diese Vorlage nicht. |

### M-2: «informieren» reicht nicht

**Beleg.** `messages/de.json:1263`: «Steht die Abrechnungsperiode in Ihren Mietverträgen, informieren Sie die Mieter über den Wechsel.» Festgehalten in `tests/e2e/features/contract-detail.feature:262`, `src/__tests__/statement-wizard.dom.test.ts:1622` und `src/__tests__/contract-detail-page.dom.test.ts:335`.

Fedlex, OR (SR 220, Stand 1. Januar 2026, `eli/cc/27/317_321_377`):

- Art. 1 Abs. 1 OR: «Zum Abschlusse eines Vertrages ist die übereinstimmende gegenseitige Willensäusserung der Parteien erforderlich.» Abs. 2: «Sie kann eine ausdrückliche oder stillschweigende sein.»
- Art. 269d Abs. 1 OR: «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.»
- Art. 269d Abs. 2 OR: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; c. mit der Mitteilung die Kündigung androht oder ausspricht.»
- Art. 269d Abs. 3 OR: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.»
- Art. 270b Abs. 2 OR: «Absatz 1 gilt auch, wenn der Vermieter sonstwie den Mietvertrag einseitig zu Lasten des Mieters ändert, namentlich seine bisherigen Leistungen vermindert oder neue Nebenkosten einführt.» (Anfechtung innert 30 Tagen, Abs. 1.)
- Art. 16 Abs. 1 OR: «Ist für einen Vertrag, der vom Gesetze an keine Form gebunden ist, die Anwendung einer solchen vorbehalten worden, so wird vermutet, dass die Parteien vor Erfüllung der Form nicht verpflichtet sein wollen.»

VMWG (SR 221.213.11, Stand 1. Oktober 2025, `eli/cc/1990/835_835_835`):

- Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Eine kurze Abrechnungsperiode (unter zwölf Monaten) verletzt das nicht. Sie ist zulässig, sobald die Periode wirksam geändert ist.
- Art. 19 Abs. 1 lit. b VMWG: Das Formular enthält für andere einseitige Vertragsänderungen «1. die Umschreibung dieser Forderung; 2. den Zeitpunkt, auf den sie wirksam wird; 3. die klare Begründung dieser Forderung.»
- Art. 257a/257b OR regeln nur, was Nebenkosten sind und dass sie vereinbart sein müssen (Art. 257a Abs. 2: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»). Zur Abrechnungsperiode sagen sie nichts.

**Warum falsch.** Steht die Abrechnungsperiode im Mietvertrag, ist sie Vertragsinhalt. Eine Mitteilung ändert keinen Vertrag. Dafür braucht es entweder die Zustimmung des Mieters (Art. 1 OR) oder, einseitig, den Weg nach Art. 269d Abs. 3 OR: amtliches Formular, Begründung, Mitteilung mindestens zehn Tage vor Beginn der Kündigungsfrist, Wirkung auf den nächstmöglichen Kündigungstermin. Ob ein Wechsel der Periode «zu Lasten des Mieters» geht, sagt der Normtext nicht (**unsicher**, siehe «Nicht bestätigt»). Für den Text ist das aber egal: Ohne Zustimmung des Mieters bleibt dem Vermieter nur das Formular, und ohne gültige Änderung gilt die Periode im Mietvertrag weiter. Folgt der Vermieter dem heutigen Text, schreibt er einen formlosen Brief und rechnet eine kurze Periode ab. Diese Abrechnung ist dann gegenüber dem Mieter nicht nach dem Vertrag abgegrenzt (Weber, «Fehlerrisiken»).

**Behebung.** Neuer Wortlaut in allen vier Sprachen. Die beiden DOM-Tests und `contract-detail.feature:262` passen sich an, zuerst rot (CLAUDE.md, Workflow 6).

## Empfohlener Wortlaut (eindeutig)

Zwei Sätze sind Praxis eines Verwalters und keine Rechtsaussage: «oft bei den Nebenkosten» und «schriftlich». Das Gesetz verlangt keine Schriftform, ausser der Mietvertrag behält sie vor (Art. 16 OR). Schriftlich ist aber der einzige Weg, die Zustimmung später zu belegen. Alle anderen Aussagen stützen sich auf Art. 1 und 269d OR in der zitierten Fassung. Die Begriffe stammen aus `UBIQUITOUS_LANGUAGE.md` (Abrechnungsperiode, Mietvertrag, Mieter, Kündigungsfrist, Kündigungstermin, Nebenkosten, kurze Abrechnungsperiode) und aus `docs/design/i18n-begriffe.md:20-34,66,70`. Die Formulierung zum Formular folgt dem schon geprüften `contracts_fee_help` (`messages/*.json:761`).

- **de:** «Sehen Sie in den Mietverträgen nach (oft bei den Nebenkosten), ob dort eine Abrechnungsperiode steht. Dann gilt diese, bis die Mieter einer Änderung schriftlich zustimmen. Ohne Zustimmung teilen Sie die Änderung begründet mit dem amtlichen Formular mit, mindestens zehn Tage vor Beginn der Kündigungsfrist. Sie gilt frühestens ab dem nächstmöglichen Kündigungstermin (Art. 269d OR). Bis dahin rechnen Sie nach der Abrechnungsperiode im Mietvertrag ab.»
- **fr:** «Vérifiez dans les contrats de bail (souvent sous les frais accessoires) s’ils fixent une période de décompte. Elle s’applique alors jusqu’à ce que les locataires acceptent une modification par écrit. Sans leur accord, notifiez la modification, avec indication des motifs, au moyen de la formule officielle, dix jours au moins avant le début du délai de congé. Elle ne s’applique qu’à partir du prochain terme de congé possible (art. 269d CO). D’ici là, établissez le décompte selon la période de décompte du contrat de bail.»
- **it:** «Verifichi nei contratti di locazione (spesso alla voce spese accessorie) se vi figura un periodo di conteggio. In tal caso vale finché gli inquilini non accettano una modifica per iscritto. Senza il loro consenso, comunichi e motivi la modifica con il modulo ufficiale, almeno dieci giorni prima dell’inizio del termine di preavviso. Vale solo dalla prossima scadenza di disdetta possibile (art. 269d CO). Fino ad allora allestisca il conteggio secondo il periodo di conteggio del contratto di locazione.»
- **en:** «Check the rental contracts (often under utility costs) for a billing period. If they state one, it applies until the tenants agree to a change in writing. Without their agreement, give notice of the change with reasons on the official form, at least ten days before the notice period begins. It applies at the earliest from the next possible termination date (Art. 269d CO). Until then, bill according to the billing period in the rental contract.»

Warum «in den Mietverträgen» (Mehrzahl) an beiden Orten: Eine kurze Abrechnungsperiode «gilt für alle Mietverträge des Gebäudes» (`UBIQUITOUS_LANGUAGE.md:167`). Auf der Seite eines Mietvertrags betrifft sie also auch die anderen Mietverträge des Gebäudes.

### Für den Product Owner: Grund und Folge der Änderung am entschiedenen Text (#486)

- **Grund:** #486 hat Option 1 auf der Grundlage eines Vorschlags entschieden, den Runde 1 als «unsicher» markiert hatte. Nach dem Fedlex-Wortlaut (Art. 1, 269d Abs. 1 und 3 OR) ist «informieren» falsch: Der Vermieter braucht die Zustimmung oder das amtliche Formular. Ohne das gilt die Periode im Mietvertrag weiter. Die Wahl des Orts aus Option 1 (am Link) bleibt, nur der Wortlaut ändert sich.
- **Folge:** Der sichtbare Text wird länger (5 statt 1 Satz) und ändert sich an beiden Stellen und in 4 Sprachen. Anzupassen sind `messages/*.json:1263`, `contract-detail.feature:262` und zwei DOM-Tests. In #486 ist der Abschnitt «Decided (product owner)» nachzutragen. Neue Begriffe gibt es nicht, ein Begriffs-Issue ist nicht nötig.
- **Optionen, falls der PO den langen Text nicht will:** (a) wie empfohlen. (b) Nur die ersten beiden und der letzte Satz, ohne Formular-Details («… teilen Sie die Änderung mit dem amtlichen Formular mit (Art. 269d OR).»). Das ist rechtlich noch richtig, aber Frist und Termin fehlen. (c) Den alten Text behalten: Davon rate ich ab (M-2).

## Nicht bestätigt

- Ob ein Wechsel der Abrechnungsperiode eine Änderung «zu Lasten des Mieters» nach Art. 269d Abs. 3 OR ist, ob also das Formular zwingend ist oder ob auch eine stillschweigende Zustimmung genügt. Der Fedlex-Normtext nennt nur Beispiele («Leistungen zu vermindern», «neue Nebenkosten einzuführen»). Rechtsprechung und Kommentare habe ich nicht gesucht. Mit `mmx search` fand ich nur kantonale Formulare (SZ, BL, OW, ZH, SH), den HEV Winterthur und BBl 2022 2100 (zu Abs. 4). **unsicher.** Der empfohlene Text hängt davon nicht ab.
- «Oft bei den Nebenkosten» (wo Mietverträge die Abrechnungsperiode nennen): Das ist Praxis aus Mustermietverträgen, nicht an einer Quelle geprüft. `docs/nebenkostenabrechnung-anforderungen.md:32` nennt nur die üblichen Perioden.
- Ob eine kurze Abrechnungsperiode, die vor dem Kündigungstermin der Änderung beginnt, ganz oder teilweise ungültig ist: im Normtext nicht geregelt. Der Text weicht dem aus mit «Bis dahin rechnen Sie nach der Abrechnungsperiode im Mietvertrag ab».
- Die Übersetzungen fr/it/en sind gegen den Fedlex-Wortlaut von Art. 269d OR (fr, it, Stand 1. Januar 2026) und gegen `contracts_fee_help` abgeglichen, nicht gegen einen Muttersprachler.
- Fedlex-Quellen: Filestore-HTML `fedlex.data.admin.ch/eli/cc/27/317_321_377/20260101/{de,fr,it}` (OR, Stand 1. Januar 2026) und `eli/cc/1990/835_835_835/20251001/de` (VMWG, Stand 1. Oktober 2025). Die VMWG-Fassung vom 1. Januar 2026 lieferte nur eine leere Seite (77 kB, ohne Artikel).
