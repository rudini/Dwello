# Fach-Review #66, Runde 2 (Commit a65a2c03)

Gegenstand: `git diff c5288844 a65a2c03`. Geändert sind `contracts_advance_help`, `contracts_running_text` und das neue `contracts_running_text_fixed_term` in `messages/{de,fr,it,en}.json`, dazu `src/routes/contracts/ContractForm.svelte:70–74, 232–236`, `src/__tests__/contract-edit.dom.test.ts:159–174` und die Szenarien in `contract-new.feature:153–157` und `contract-edit.feature:172–184` (jetzt ohne @wip).

Gesetzestexte: Fedlex-Filestore, OR Fassung 1.1.2026, in de, fr und it (`eli/cc/27/317_321_377/20260101/{de,fr,it}/html/…-11.html`).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-7 | Mietrecht | Nit | fr: «Sans formule ni motif, elle est nulle» lässt sich so lesen, dass beides fehlen muss. Der Satz ist wortgleich mit dem schon beschlossenen `statements_akonto_raise` (fr). Nur zusammen mit diesem ändern. |

Es gibt keinen neuen Blocker oder Major. Die Befunde aus Runde 1 (M-3 bis M-6, V-2, V-4) bleiben im Bericht von Runde 1. M-1 und V-1 liegen beim Product Owner bzw. bei #90.

---

## M-2 aus Runde 1: Ist der Marker eine annehmbare Lösung?

Ja, als Übergang bis zum Entscheid in #388. Das war die Ausweichlösung, die Runde 1 vorgeschlagen hat.

- Der Marker steht beim Hinweis: `ContractForm.svelte:232–233` `TODO(fachlich prüfen, #388): the befristet text without the form rule`.
- #388 ist offen und hat die Labels `fachlich` und `entscheiden` (über `gh api` geprüft). Der zweite Kommentar in #388 nennt `contracts_running_text_fixed_term`, die Stelle in `ContractForm.svelte` und den Befund 66 M-2. Er übernimmt auch M-5 (Index- und Staffelmiete).
- Der Mangel an sich bleibt bestehen. Auch beim befristeten Vertrag ist eine Erhöhung ohne Formular oder Begründung nichtig (Art. 269d Abs. 2 OR, Fedlex: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; …»). Der Hinweis nennt das nicht. Er hängt nun aber am selben offenen Entscheid wie der gleichlautende Satz aus #76. Der Text ist also nicht falsch, nur unvollständig. Deshalb gehört er unter «Blocked on me» und muss nicht im PR behoben werden.
- Hinweis zum Abschluss von #388: Im Abschnitt «Where» von #388 stehen nur `statements_akonto_raise_fixed_term` und `statement-wizard.ts`. Der neue Schlüssel steht nur im Kommentar. Wer #388 umsetzt, muss beide Schlüssel in vier Sprachen ändern. Am besten ergänzen Sie «Where» entsprechend (das ist kein Befund an diesem PR).
- Die Persona-Anmerkung P-1 in #388 trifft auch den neuen Text: Nach dem Ende eines befristeten Vertrags gibt es nichts mehr zu erhöhen, ausser er läuft stillschweigend als unbefristeter Vertrag weiter (Art. 266 Abs. 2 OR). Auch das wird in #388 entschieden.

## Unterscheidung befristet, unbefristet, gekündigt: bestätigt

Die Unterscheidung `contract.endDate && !contract.terminated` (`ContractForm.svelte:71`) entspricht dem Glossar:
- `UBIQUITOUS_LANGUAGE.md:38`: Befristet/Unbefristet = `end_date`, `terminated`.
- Z. 39: gekündigt = `end_date` mit `terminated = true`.
- Z. 37: unbefristet und ungekündigt = `end_date` leer.

Der befristete Fall erhält also den befristeten Text. Der unbefristete und der gekündigte Fall erhalten den Text zu Art. 269d. Für den gekündigten Fall bleibt M-4 aus Runde 1 (Minor) bestehen. Der DOM-Test prüft alle drei Fälle, jeweils mit und ohne den Satz des anderen Falls. Damit ist V-3 erledigt.

## Deutsche Texte: bestätigt

- `contracts_running_text`: Der zweite Satz ist wortgleich mit `statements_akonto_raise` (`messages/de.json:1077`), nur steht «Eine Mietzinserhöhung» statt «Eine Erhöhung». Er stimmt mit Art. 269d Abs. 1 und Abs. 2 lit. a/b OR überein (Wortlaut in Runde 1). Der erste Satz ist unverändert und folgt V-1 bzw. #90.
- `contracts_running_text_fixed_term`: Er übernimmt den Satz von #76 (`statements_akonto_raise_fixed_term`, Z. 1078), mit «Mietzinserhöhung» statt «Erhöhung». Grundlage sind Art. 255 Abs. 2 und Art. 266 OR. Der Vorbehalt betrifft M-2 und M-5, siehe oben.
- `contracts_advance_help`: Option A des Entscheids von #66, jetzt mit «zum Beispiel». Damit ist V-5 erledigt, die Schreibweise passt zu `contracts_additional_help`. Grundlage sind Art. 257a Abs. 2 und Art. 257b Abs. 1 OR (Wortlaut in Runde 1).

## fr/it/en: Abgleich mit dem Deutschen, `statements_akonto_raise` und dem OR

Die Begriffe stimmen mit `docs/design/i18n-begriffe.md` überein:
- Z. 27: Mietvertrag
- Z. 28: Vertragsende
- Z. 30: befristet
- Z. 31: Kündigungstermin
- Z. 32: Kündigungsfrist
- Z. 33: Mietzins
- Z. 57: Nebenkosten

Die Sätze zu Art. 269d sind in jeder Sprache wortgleich mit `statements_akonto_raise` (`messages/{fr,it,en}.json:1077`), nur ist «augmentation» zu «augmentation de loyer», «aumento» zu «aumento della pigione» und «increase» zu «rent increase» erweitert. Die befristeten Sätze sind ebenso wortgleich mit `…_fixed_term` (Z. 1078).

**Französisch.** Art. 269d Abs. 1 CO (Fedlex): «Le bailleur peut en tout temps majorer le loyer pour le prochain terme de résiliation. L'avis de majoration du loyer, avec indication des motifs, doit parvenir au locataire dix jours au moins avant le début du délai de résiliation et être effectué au moyen d'une formule agréée par le canton.»
- Die App schreibt «terme de congé» und «délai de congé». Beides ist ebenfalls Gesetzessprache, Art. 266a Abs. 2 CO: «Lorsque le délai ou le terme de congé n'est pas respecté …». Das ist gleichwertig und passt zum Glossar.
- «formule officielle» steht in Abs. 2 lit. a: «elles ne sont pas notifiées au moyen de la formule officielle».
- «reçue par le locataire» entspricht «doit parvenir au locataire».
- Art. 255 Abs. 2 CO: «Il est de durée déterminée lorsqu'il doit prendre fin, sans congé, à l'expiration de la durée convenue.» Das passt zu «contrat de bail de durée déterminée».

**Italienisch.** Art. 269d Abs. 1 CO (Fedlex): «Il locatore può aumentare in qualsiasi momento la pigione per la prossima scadenza di disdetta. Deve comunicare, motivandolo, l'aumento al conduttore almeno dieci giorni prima dell'inizio del termine di preavviso su un modulo approvato dal Cantone.»
- «scadenza di disdetta», «termine di preavviso», «pigione», «motivato» und «modulo» sind wörtlich so im Gesetz.
- Abs. 2: «L'aumento è nullo se il locatore: a. non lo comunica mediante il modulo prescritto; b. non lo motiva; …». Das passt zu «Senza modulo o motivazione è nullo».
- Für die Partei steht «inquilino» statt «conduttore», wie im Glossar der App (i18n-begriffe Z. 20). Das ist so beschlossen und kein Befund.
- Art. 255 Abs. 2 CO: «È a tempo determinato se destinata ad estinguersi, senza disdetta, alla scadenza pattuita.»

**Englisch.** Es gibt keine amtliche Fassung. Die Begriffe folgen dem Glossar. «received by the tenant» entspricht dem «doit parvenir» der amtlichen französischen Fassung.

**Akonto-Hilfe.** Die Übersetzungen passen zu den Labels der vereinbarten Nebenkosten (`contracts_agreed_costs_label`, Z. 753):
- fr «convenus dans le contrat de bail» passt zu «Frais accessoires convenus».
- it «pattuite nel contratto di locazione» passt zu «Spese accessorie pattuite».
- en «agreed in the rental contract» passt zu «Agreed utility costs».

«par exemple», «per esempio» und «for example» passen zu `contracts_additional_help` in jeder Sprache.

Ergebnis: fr, it und en sagen dasselbe wie das Deutsche. Sie lassen keine Regel weg und fügen keine hinzu.

## M-7 (Nit, Mietrecht): «Sans formule ni motif» im Französischen

**Beleg.** `messages/fr.json`, `contracts_running_text`: «Sans formule ni motif, elle est nulle.» Das Deutsche sagt «Ohne Formular oder Begründung», das Italienische «Senza modulo o motivazione», das Englische «Without the form or reasons». Das Gesetz zählt beide Fälle getrennt auf (Art. 269d Abs. 2 lit. a und b CO, «nulles lorsque: a. … b. …»).

**Warum.** «sans A ni B» ist die übliche Verneinung, kann aber als «wenn weder A noch B vorliegt» gelesen werden. Ein Laie könnte daraus schliessen, eine begründete Erhöhung ohne Formular sei gültig.

**Fix.** Zum Beispiel «Sans la formule officielle ou sans motif, elle est nulle.» Das ist nur in `statements_akonto_raise` (fr) und `contracts_running_text` (fr) zugleich sinnvoll, weil der Wortlaut beschlossen ist. Wenn der Satz bleibt, ist das vertretbar.

---

## Fehlende Begriffe

Keine neuen. «Indexmiete» und «Staffelmiete» (M-5) sind im Kommentar zu #388 aufgenommen. Die übrigen offenen Begriffe stehen in Runde 1.

## Nicht bestätigt

- **unsicher (unverändert aus Runde 1):** Ob ein befristeter Mietvertrag nach Art. 269b/269c OR hinaus eine Erhöhung «vorsehen» kann (M-5). Das wird in #388 entschieden.
- **Erledigt aus Runde 1:** Den Zugang beim Mieter («beim Mieter», «reçue», «recapitato», «received») bestätigt die amtliche französische Fassung von Art. 269d Abs. 1 CO: «doit parvenir au locataire». Die deutsche Fassung sagt nur «mitteilen». Der Text ist damit nicht mehr unsicher.
- Nicht geprüft habe ich, ob die E2E-Szenarien ohne @wip auf a65a2c03 grün laufen. Ich habe nichts ausgeführt, nur den Diff, die Glossare, Fedlex und #388 gelesen.
- Die englischen Begriffe lassen sich nicht an einer amtlichen Fassung prüfen, weil es keine gibt. Ich habe sie nur mit dem Glossar abgeglichen.
