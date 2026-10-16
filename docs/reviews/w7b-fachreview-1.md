# Fachreview W7b, Runde 1 (vor der Umsetzung)

Gegenstand: Commit `5420300` (Worktree `review-w7b-fach`): `@wip`-Szenarien «Kündigung mit zu kurzer Frist», «Kündigung mit genügend Frist» (`tests/e2e/features/contract-detail.feature:170-184`), geändertes Szenario «Kündigung aufheben» (`tests/e2e/features/contract-edit.feature:79-87`) mit ihren Steps, dazu die vorgeschlagenen Texte aus #112 (A-3) und #52 (F-7).

Quellen: `UBIQUITOUS_LANGUAGE.md:37-44`, `docs/anforderungen-vertragsende.md:33, 94-122`, Issues #112 und #52 (gelesen per `gh api`), OR in der Fassung vom 1.10.2026 von Fedlex (`fedlex.data.admin.ch/filestore/.../eli/cc/27/317_321_377/20261001/de/html/...-de-html-3.html`).

Ergebnis: Keine Blocker, keine Major. Regel, Formel, Szenarien und der Formsatz stimmen mit Gesetz und Glossar. Sechs Minor/Nit, die meisten betreffen entschiedenen Wortlaut und sind deshalb als Vorschläge für ein Folge-Issue formuliert.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Minor | Fristhinweis kennt keine ausserordentlichen Kündigungen (z.B. Art. 257d OR, 30 Tage); bei einer Kündigung des Vermieters wegen Zahlungsrückstand sagt er fälschlich «gilt wohl erst auf den nächsten Kündigungstermin». |
| M-2 | Mietrecht | Minor | Der Formsatz gilt nur für die Kündigung des Mieters; für die Kündigung des Vermieters (gleicher Dialog) fehlen amtliches Formular und separate Zustellung (Art. 266l Abs. 2, 266n OR). Kein Fehler im entschiedenen Satz, aber eine Lücke. |
| M-3 | Mietrecht / Verwalter | Minor | Der Formsatz sagt nicht, was die Folge ist (Kündigung nichtig, Art. 266o OR); der Laie weiss nicht, was er tun soll. |
| M-4 | Mietrecht | Minor | #52: «Das geht nur, wenn …» schliesst die nichtige Kündigung aus, die die neue A-3-Hilfe im selben Dialogfluss selbst beschreibt (fehlende Zustimmung des Ehegatten). |
| M-5 | Mietrecht | Nit | #52: «Einseitig lässt sich eine Kündigung nicht zurücknehmen.» weicht vom Glossar ab («Nach dem Eingang …») und ist ein Fachwort. |
| V-1 | Verwalter | Minor | `docs/anforderungen-vertragsende.md:104` führt noch den alten, falschen Formsatz («Unterschrift beider Ehegatten»). |
| V-2 | Verwalter | Minor | Fehlender Begriff «Familienwohnung» (Gesetz: «Wohnung der Familie») im Glossar. |
| V-3 | Verwalter | Nit | Die Steps prüfen weder den Ausnahme-Satz des Hinweises noch den Formsatz; der Formsatz ist in keinem Szenario geprüft. |

---

## Bestätigt

### Regel und Formel (#112)

Regel: Hinweis, wenn Vertragsende < Eingang + 3 Kalendermonate (Tag auf Monatsende begrenzt).

Gesetz:
- Art. 266c OR: «Bei der Miete von Wohnungen können die Parteien mit einer Frist von drei Monaten auf einen ortsüblichen Termin oder, wenn es keinen Ortsgebrauch gibt, auf Ende einer dreimonatigen Mietdauer kündigen.»
- Art. 266a Abs. 2 OR: «Halten die Parteien die Frist oder den Termin nicht ein, so gilt die Kündigung für den nächstmöglichen Termin.»
- Fristberechnung, Art. 77 Abs. 1 Ziff. 3 OR: «wenn die Frist nach Monaten … bestimmt ist, auf denjenigen Tag des letzten Monates, der durch seine Zahl dem Tage des Vertragsabschlusses entspricht, und, wenn dieser Tag in dem letzten Monate fehlt, auf den letzten Tag dieses Monates.» Das ist genau die Begrenzung auf das Monatsende. (Dass Art. 77 auf die Kündigungsfrist ab Eingang angewendet wird, ist Lehre und Praxis, nicht Wortlaut: siehe «Nicht bestätigt».)

Nachgerechnet (Python, `add3` = +3 Monate mit Begrenzung):

| Eingang | Vertragsende | Eingang + 3 M. | Ergebnis | Erwartet |
|---|---|---|---|---|
| 31.12.2026 | 31.03.2027 | 31.03.2027 | kein Hinweis | kein (Issue) |
| 01.01.2027 | 31.03.2027 | 01.04.2027 | Hinweis | Hinweis (Issue) |
| 30.11.2027 | 29.02.2028 | 29.02.2028 | kein Hinweis | kein (Issue, Schaltjahr) |
| 31.03.2027 | 30.06.2027 | 30.06.2027 | kein Hinweis | kein (Issue) |
| 15.02.2099 | 31.03.2099 | 15.05.2099 | Hinweis | Szenario «zu kurze Frist» |
| 15.12.2098 | 31.03.2099 | 15.03.2099 | kein Hinweis | Szenario «genügend Frist» |
| 30.11.2026 | 28.02.2027 | 28.02.2027 | kein Hinweis | richtig (Nicht-Schaltjahr) |
| 01.12.2026 | 28.02.2027 | 01.03.2027 | Hinweis | richtig |
| 30.09.2026 | 31.12.2026 | 30.12.2026 | kein Hinweis | richtig |
| 10.04.2027 | 31.03.2027 | 10.07.2027 | Hinweis | Randfall: Eingang nach Vertragsende (Tippfehler im Jahr) zeigt denselben Hinweis; vertretbar, kein Befund |

Alle Fälle entsprechen der Praxis («für Ende März muss die Kündigung spätestens am 31.12. eintreffen»).

### Szenarien

- `contract-detail.feature:170-184`: Daten, Erwartungen und «trotzdem beenden» (keine Sperre) decken A-3 Punkte 1–4 und das Issue. Die Detailseite zeigt «Unbefristet, gekündigt auf den 31.03.2099» (Glossar «Kündigungstermin», «gekündigt») und das Eingangsdatum.
- `contract-edit.feature:79-87`: neuer Schritt prüft «gemeinsam zurücknehmen», «die Schlichtungsbehörde oder ein Gericht», «Der Mietvertrag läuft dann ohne Ende weiter.» (`tests/e2e/steps/contract-form.steps.ts:353-361`), passt zu #52.
- Begriffe in Szenarien und Steps: Liegenschaftsverwalter, Mietvertrag, Vertragsende, Kündigung, Kündigungstermin, Eingang, Ersatzmieter, Kündigung aufheben stehen im Glossar (`UBIQUITOUS_LANGUAGE.md:37-44`).

### Formsatz (#112)

«Die Kündigung des Mieters muss schriftlich sein. Bei einer Familienwohnung braucht es die ausdrückliche Zustimmung des Ehegatten oder eingetragenen Partners.»

- Art. 266l Abs. 1 OR: «Vermieter und Mieter von Wohn- und Geschäftsräumen müssen schriftlich kündigen.» – stimmt.
- Art. 266m Abs. 1 OR: «Dient die gemietete Sache als Wohnung der Familie, kann ein Ehegatte den Mietvertrag nur mit der ausdrücklichen Zustimmung des anderen kündigen.» – stimmt («ausdrückliche Zustimmung», nicht «Unterschrift»).
- Art. 266m Abs. 3 OR: «Die gleiche Regelung gilt bei eingetragenen Partnerschaften sinngemäss.» – stimmt.

Der Wortlaut ist richtig. Zur Kündigung durch den Vermieter: siehe M-2 (Lücke, kein Fehler: der Satz sagt ausdrücklich «des Mieters»).

### Fristhinweis-Text (#112)

«… Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag, oder Sie haben das Ende mit dem Mieter vereinbart.»
- Art. 264 Abs. 1 OR: «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen.» – stimmt mit Glossar «Ersatzmieter».
- Vereinbartes Ende: Aufhebungsvereinbarung, Vertragsfreiheit; kein Befund.
- «wohl» passt, da Dwello den ortsüblichen Termin nicht prüft (Entscheid #112).

### Hilfe «Kündigung aufheben» (#52)

- Glossar `UBIQUITOUS_LANGUAGE.md:40`: «… wenn Mieter und Vermieter die Kündigung im Einvernehmen zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt. Nach dem Eingang kann eine Kündigung nicht einseitig zurückgenommen werden.» Der Vorschlag gibt das sinngemäss und in einfachen Worten wieder.
- Art. 273 Abs. 1 OR: «Will eine Partei die Kündigung anfechten, so muss sie das Begehren innert 30 Tagen nach Empfang der Kündigung der Schlichtungsbehörde einreichen.» und Art. 271 Abs. 1 OR: «Die Kündigung ist anfechtbar, wenn sie gegen den Grundsatz von Treu und Glauben verstösst.» – tragen «die Schlichtungsbehörde oder ein Gericht … für ungültig erklärt» als Laienformulierung.
- `contracts_end_notice_hint` bleibt; mit dem neuen Feld ergänzt es sich, kein Widerspruch.

---

## Befunde

### M-1 (Minor) Fristhinweis bei ausserordentlicher Kündigung

**Beleg:** Hinweistext #112; der Dialog «Mietvertrag beenden» dient jeder Kündigung (Aufgabe des Callers). Glossar `UBIQUITOUS_LANGUAGE.md:41`: «Für ausserordentliche Kündigungen (z.B. Zahlungsrückstand, Art. 257d OR) gelten andere Fristen.» Art. 257d Abs. 2 OR: «Bezahlt der Mieter innert der gesetzten Frist nicht, so kann der Vermieter fristlos, bei Wohn- und Geschäftsräumen mit einer Frist von mindestens 30 Tagen auf Ende eines Monats kündigen.»

**Warum falsch:** Kündigt der Vermieter wegen Zahlungsrückstand und trägt den Eingang beim Mieter ein, erscheint der Hinweis «Dann gilt die Kündigung wohl erst auf den nächsten Kündigungstermin». Folgt der Laie dem und schiebt das Vertragsende hinaus, rechnet Dwello dem Mieter Akonto und Nebenkosten über ein gültiges Vertragsende hinaus an. Gemildert durch «wohl», das leere Feld (optional) und die Seltenheit; der Wortlaut ist entschieden, darum Minor.

**Behebung (Folge-Issue, `fachlich`, `entscheiden`):** Ausnahme ergänzen: «Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag, Sie haben das Ende mit dem Mieter vereinbart, oder es ist eine ausserordentliche Kündigung, zum Beispiel wegen Zahlungsrückstand.» In dieser Runde nicht ändern.

### M-2 (Minor) Formsatz deckt die Kündigung des Vermieters nicht ab

**Beleg:** Art. 266l Abs. 2 OR: «Der Vermieter muss mit einem Formular kündigen, das vom Kanton genehmigt ist …». Art. 266n OR: «Die Kündigung durch den Vermieter … sind dem Mieter und seinem Ehegatten, seiner eingetragenen Partnerin oder seinem eingetragenen Partner separat zuzustellen.» Art. 266o OR: «Die Kündigung ist nichtig, wenn sie den Artikeln 266l–266n nicht entspricht.» `docs/anforderungen-vertragsende.md:117` «Nicht dazu: … Kündigung durch den Vermieter (amtliches Formular)».

**Warum:** Der entschiedene Satz ist richtig («des Mieters»), aber der Vermieter, der selbst kündigt, liest im selben Dialog nur die Regeln für den Mieter. Eine formlose Vermieterkündigung ist nichtig. Kein Fehler, den diese Änderung einführt; die Lücke ist von A-3 bewusst ausgeschlossen.

**Behebung (Folge-Issue, `fachlich`, `entscheiden`):** Zweiter Satz für den Vermieter, z.B.: «Kündigen Sie selbst, brauchen Sie das amtliche Formular Ihres Kantons. Bei einer Familienwohnung schicken Sie es beiden Ehegatten oder eingetragenen Partnern in getrennten Briefen.» Für diese Umsetzung nichts nötig. Auch das Feldlabel «Kündigung erhalten am» passt in diesem Fall nur halb; die Hilfe «angekommen ist» ist neutral und genügt.

### M-3 (Minor) Folge eines Formfehlers fehlt

**Beleg:** Art. 266o OR (oben zitiert). Design-Regeln: Hilfe sagt, was zu tun ist.

**Warum:** Der Laie erfährt, dass Schriftform und Zustimmung nötig sind, aber nicht, dass ohne sie die Kündigung nicht gilt und der Mietvertrag weiterläuft; er erfasst dann trotzdem das Vertragsende.

**Behebung (Folge-Issue, `entscheiden`, entschiedener Wortlaut):** Satz anfügen: «Fehlt das, ist die Kündigung ungültig, und der Mietvertrag läuft weiter.»

### M-4 (Minor) #52: nichtige Kündigung nicht erfasst

**Beleg:** Vorschlag «Das geht nur, wenn Mieter und Vermieter die Kündigung gemeinsam zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt.» Art. 266o OR (oben). Die A-3-Hilfe derselben Änderung nennt die Zustimmung des Ehegatten.

**Warum:** Eine Kündigung des Mieters ohne Zustimmung des Ehegatten ist von Gesetzes wegen nichtig, ohne dass eine Behörde sie für ungültig erklären muss. Der Verwalter, der eine solche Kündigung erfasst hat (oder sich beim Erfassen vertan hat), soll sie in Dwello aufheben können; die Hilfe sagt ihm, das gehe «nur» gemeinsam oder vor Behörde. Das Glossar definiert den Begriff so eng; deshalb kein Major, aber der Begriff braucht eine Ergänzung.

**Behebung:** Für diese Umsetzung kann der Vorschlag bleiben (er folgt dem Glossar). Folge-Issue (`fachlich`, `entscheiden`) für Glossar und Text, Vorschlag: «… oder die Kündigung war von Anfang an ungültig, zum Beispiel ohne die nötige Zustimmung des Ehegatten.» Falls der Product Owner sofort will: Satz anhängen und Glossar über das Issue ändern (Glossar nie selbst editieren).

### M-5 (Nit) #52: «Einseitig»

**Beleg:** Glossar: «Nach dem Eingang kann eine Kündigung nicht einseitig zurückgenommen werden.» Vorschlag: «Einseitig lässt sich eine Kündigung nicht zurücknehmen.»

**Warum:** Ohne «nach dem Eingang» weicht der Satz vom Glossar ab (ein Widerruf, der vor oder mit der Kündigung eintrifft, wirkt; Art. 9 Abs. 1 OR sinngemäss, siehe «Nicht bestätigt»). Praktisch belanglos, weil der Verwalter erst nach dem Eingang erfasst. «Einseitig» ist für Laien ein Fachwort.

**Behebung:** «Ist eine Kündigung angekommen, kann sie weder der Mieter noch der Vermieter allein zurücknehmen.»

Vollständiger Vorschlag Deutsch (erfüllt die drei `toContain` der Steps):
«Der Mietvertrag läuft dann ohne Ende weiter. Das geht nur, wenn Mieter und Vermieter die Kündigung gemeinsam zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt. Ist eine Kündigung angekommen, kann sie weder der Mieter noch der Vermieter allein zurücknehmen.»

Übersetzungen (Begriffe nach `docs/design/i18n-begriffe.md:20-29`: locataire/bailleur/contrat de bail/résiliation; inquilino/locatore/contratto di locazione/disdetta; tenant/landlord/rental contract/notice of termination):
- fr: «Le contrat de bail court alors sans date de fin. Ce n’est possible que si le locataire et le bailleur retirent ensemble la résiliation, ou si l’autorité de conciliation ou un tribunal la déclare non valable. Une fois reçue, une résiliation ne peut être retirée ni par le locataire ni par le bailleur seul.»
- it: «Il contratto di locazione prosegue allora senza scadenza. È possibile solo se inquilino e locatore ritirano insieme la disdetta, oppure se l’autorità di conciliazione o un tribunale la dichiara non valida. Una volta ricevuta, la disdetta non può essere ritirata né dall’inquilino né dal locatore da solo.»
- en: «The rental contract then runs on without an end. This is only possible if tenant and landlord withdraw the notice of termination together, or if the conciliation authority or a court declares it invalid. Once received, a notice cannot be withdrawn by the tenant or the landlord alone.»

### V-1 (Minor) Anforderungsdokument führt den alten Formsatz

**Beleg:** `docs/anforderungen-vertragsende.md:104`: «Bei einer Familienwohnung braucht es die Unterschrift beider Ehegatten.» Art. 266m Abs. 1 OR verlangt die «ausdrückliche Zustimmung des anderen», keine Mitunterschrift; eingetragene Partner fehlen (Abs. 3).

**Behebung:** Beim Markieren von A-3 als umgesetzt (Planpunkt) den Satz durch den Wortlaut aus #112 ersetzen.

### V-2 (Minor) Fehlender Begriff «Familienwohnung»

**Beleg:** `UBIQUITOUS_LANGUAGE.md` kennt weder «Familienwohnung» noch «Wohnung der Familie» (grep); der Formsatz führt das Wort in die UI ein.

**Vorschlag Glossar:** «**Familienwohnung** | Wohnung, die einem Ehepaar oder eingetragenen Paar als gemeinsames Zuhause dient (Gesetz: Wohnung der Familie). Der Mieter kann sie nur mit ausdrücklicher Zustimmung des Ehegatten oder eingetragenen Partners kündigen; die Kündigung des Vermieters geht an beide separat (Art. 266m, 266n OR). | — |» Issue mit `fachlich`, `entscheiden`; bis dahin `TODO(fachlich prüfen, #<issue>)` an der Stelle, sofern der Product Owner das Wort nicht in #112 schon entschieden hat (es steht im entschiedenen Text von #112; dann genügt die Glossar-Ergänzung über das Issue).

### V-3 (Nit) Steps prüfen nicht alles, was entschieden ist

**Beleg:** `tests/e2e/steps/contract-detail.steps.ts:241-246` prüft nur «Zwischen Eingang …» und «erst auf den nächsten Kündigungstermin», nicht den Ausnahme-Satz (Ersatzmieter, Vereinbarung). `contract-detail.steps.ts:249-252` prüft nur den Eingangssatz der Feldhilfe, nicht den Formsatz. `contract-detail.steps.ts:254-256` prüft den Wert, nicht das Label «Kündigung erhalten am».

**Warum:** Gerade der Ausnahme-Satz und der Formsatz sind fachlich die tragenden Teile; ein Wegfall bliebe in E2E unbemerkt (Unit- oder Sprach-Screens decken ihn evtl. ab).

**Behebung:** Im Schritt «weist der Dialog darauf hin …» zusätzlich `toContain('Ein Ersatzmieter übernimmt den Mietvertrag')`; im Schritt «zeigt der Dialog keinen Hinweis …» zusätzlich `toContain('muss schriftlich sein')`.

---

## Nicht bestätigt

- **Art. 77 OR für die Kündigungsfrist ab Eingang:** Der Wortlaut spricht vom «Abschluss des Vertrages»; Abs. 2 («In gleicher Weise wird die Frist auch dann berechnet, wenn sie nicht von d[em Vertragsabschluss an läuft] …») trägt die Anwendung, ich habe ihn auf Fedlex nur angeschnitten gesehen. Die Anwendung auf Kündigungsfristen ist Lehre/Praxis: **unsicher** im Sinn der Regeln, fachlich aber gängig.
- **Massgeblicher Eingang bei eingeschriebener Post** (absolute Empfangstheorie, BGE 137 III 208): Holt der Vermieter das Kündigungsschreiben des Mieters spät ab, gilt es früher als empfangen als am Abholtag. Folge in Dwello nur ein überflüssiger Hinweis (Richtung «zu kurz»), keine Sperre. Nicht auf Fedlex, **unsicher**; kein Befund.
- **Unwiderruflichkeit der Kündigung nach Eingang** (Gestaltungsrecht) und Widerruf vor/mit Eingang: Art. 9 Abs. 1 OR regelt den Widerruf des Antrags («Trifft der Widerruf bei dem anderen Teile vor oder mit dem Antrage ein, … so ist der Antrag als nicht geschehen zu betrachten.»); die Übertragung auf die Kündigung ist Lehre, **unsicher**. Der Glossar-Satz und der Vorschlag widersprechen dem nicht.
- **Zuständigkeit der Schlichtungsbehörde, eine Kündigung für ungültig zu erklären** (Urteilsvorschlag/Entscheid nach ZPO Art. 210, 212): nicht auf Fedlex nachgelesen; Art. 273 Abs. 1 und 5 OR (Anfechtung bei der Schlichtungsbehörde) bestätigt. Für die Laienformulierung genügt das.
- **fr/it/en-Wortlaut** der Übersetzungsvorschläge: Begriffe aus `i18n-begriffe.md`; «autorité de conciliation», «autorità di conciliazione», «conciliation authority» sind dort nicht geführt und in `messages/*.json` nicht vorhanden (grep). «annuler la résiliation / revocare la disdetta / withdraw notice» sind dort mit ❓ markiert (`i18n-begriffe.md:29`).
- Nicht geprüft: Umsetzung (gibt es noch nicht), Platzierung auf dem Bildschirm, a11y.
