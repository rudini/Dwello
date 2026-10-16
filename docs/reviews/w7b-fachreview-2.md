# Fachreview W7b, Runde 2 (Feature-Review der Umsetzung)

Gegenstand: `git diff 5420300 4b1a50f` (Worktree `review-w7b-fach2`, detached auf `4b1a50f`): Texte `contracts_notice_received`, `contracts_notice_received_help`, `contracts_notice_period_short`, `contracts_withdraw_notice_help` in `messages/{de,fr,it,en}.json`; Regel `shortNoticePeriod` (`src/lib/contract-status.ts:86-96`); `docs/anforderungen-vertragsende.md` (A-3, «Regeln in Dwello» Punkt 3); Dialog «Mietvertrag beenden», Detailseite, «Kündigung aufheben» unter «Bearbeiten» (`src/routes/contracts/[id]/+page.svelte`, `ContractTerms.svelte`, `+page.server.ts`, `backend/src/services/contract.service.ts:379-386`).

Quellen: `UBIQUITOUS_LANGUAGE.md:40,44`, `docs/design/i18n-begriffe.md:29`, `docs/anforderungen-vertragsende.md`, Runde 1 (`docs/reviews/w7b-fachreview-1.md`), OR Stand 1.10.2026 auf Fedlex in fr und it (`fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001/{fr,it}/html/...-html-3.html`), de wie in Runde 1.

Ergebnis: **Keine Blocker, keine Major.** Übernommen aus Runde 1 und richtig umgesetzt: M-5, V-1, V-3. Neu: drei Nits in der it/fr-Übersetzung des Formsatzes. M-1 bis M-4 und V-2 bleiben als Minor in Runde 1 offen (unverändert, nicht wiederholt).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-6 | Mietrecht | Nit | it: «consenso esplicito» statt des Gesetzesworts «consenso espresso» (Art. 266m cpv. 1 CO). |
| M-7 | Mietrecht | Nit | it/fr: «deve essere scritta» / «doit être écrite» statt der Gesetzesformel «data per scritto» / «donnée par écrit» (Art. 266l Abs. 1). |
| V-4 | Verwalter | Nit | it: «inquilino subentrante» ist Praxiswort, das Gesetz sagt «nuovo conduttore»; verständlicher wäre «un nuovo inquilino». |

---

## Bestätigt

### Regel `shortNoticePeriod` (A-3, #112)

Code `src/lib/contract-status.ts:90-96`: Fälligkeit = Eingang + 3 Kalendermonate, Tag auf das Monatsende des Zielmonats gekürzt; Hinweis, wenn Vertragsende < Fälligkeit; ohne einen der beiden Tage kein Hinweis. Monat 1-basiert aus dem ISO-String, `Date.UTC(year, month + 2, …)` ist damit der Monat «Eingang + 3»; `Date.UTC(year, month + 3, 0)` dessen letzter Tag; Jahreswechsel über `Date.UTC`-Überlauf. Richtig.

Gesetz (Runde 1 zitiert): Art. 266c OR («mit einer Frist von drei Monaten auf einen ortsüblichen Termin …»), Art. 266a Abs. 2 OR («… so gilt die Kündigung für den nächstmöglichen Termin.»), Art. 77 Abs. 1 Ziff. 3 OR (Monatsfrist, «wenn dieser Tag in dem letzten Monate fehlt, auf den letzten Tag dieses Monates»).

Nachgerechnet mit dem Code aus dem Commit (Node, Datei im Scratchpad `snp.mjs`):

| Eingang | Vertragsende | Fälligkeit | Hinweis | Erwartet |
|---|---|---|---|---|
| 31.12.2026 | 31.03.2027 | 31.03.2027 | nein | nein (Praxis: Ende März, Eingang bis 31.12.) |
| 01.01.2027 | 31.03.2027 | 01.04.2027 | ja | ja |
| 30.11.2027 | 29.02.2028 | 29.02.2028 | nein | nein (Schaltjahr) |
| 30.11.2026 | 28.02.2027 | 28.02.2027 | nein | nein (gekürzt, kein Schaltjahr) |
| 01.12.2026 | 28.02.2027 | 01.03.2027 | ja | ja |
| 29.11.2026 | 28.02.2027 | 28.02.2027 | nein | nein |
| 15.10.2026 | 14.01.2027 | 15.01.2027 | ja | ja (Randfall ein Tag) |
| 15.10.2026 | 15.01.2027 | 15.01.2027 | nein | nein |
| 15.02.2099 | 31.03.2099 | 15.05.2099 | ja | Szenario «zu kurze Frist» |
| 15.12.2098 | 31.03.2099 | 15.03.2099 | nein | Szenario «genügend Frist» |
| 10.04.2027 | 31.03.2027 | 10.07.2027 | ja | Eingang nach Ende (Tippfehler): Hinweis, vertretbar (Runde 1) |
| leer | 31.03.2027 | – | nein | nein (Feld optional) |

Alle Fälle stimmen; die Unit-Tests (`src/__tests__/contract-status.test.ts:151-168`) decken die Fälle aus #112 ab.

### Verhalten

- Hinweis, keine Sperre (`+page.svelte:40-48`, `note` am Feld): A-3 Punkte 2 und 3 erfüllt.
- Tag gespeichert und auf der Detailseite unter dem Vertragsende gezeigt, nur wenn vorhanden (`ContractTerms.svelte:48-55`): Punkt 4.
- «Kündigung aufheben» (`endDate: null`) und «Befristet» (`terminated: false`) löschen den Tag (`contract.service.ts:384`): fachlich richtig, ohne Kündigung gibt es keinen Eingang.
- Der Dialog erscheint nur ohne Vertragsende (`+page.svelte:128`), `startEnding` leert das Feld: kein alter Eingang bleibt hängen.

### Deutsche Texte

- `contracts_notice_received_help`: Art. 266l Abs. 1 OR «Vermieter und Mieter von Wohn- und Geschäftsräumen müssen schriftlich kündigen.», Art. 266m Abs. 1 «… nur mit der ausdrücklichen Zustimmung des anderen kündigen.», Abs. 3 (eingetragene Partnerschaft). Stimmt; V-1 aus Runde 1 im Anforderungsdokument behoben (`docs/anforderungen-vertragsende.md:107`).
- `contracts_notice_period_short`: wörtlich wie entschieden in #112 und A-3 Punkt 2; «Ersatzmieter» im Glossar (`UBIQUITOUS_LANGUAGE.md:44`, Art. 264 Abs. 1 OR).
- `contracts_withdraw_notice_help`: genau der Vorschlag aus Runde 1 (M-5); entspricht Glossar `UBIQUITOUS_LANGUAGE.md:40` («im Einvernehmen zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt. Nach dem Eingang kann eine Kündigung nicht einseitig zurückgenommen werden.»). «Schlichtungsbehörde»: Art. 273 Abs. 1 OR. Der `TODO(fachlich prüfen, #52)` in `PeriodStep.svelte` ist zu Recht entfernt.
- `docs/anforderungen-vertragsende.md:33` (Regel 3) beschreibt die Regel so, wie der Code sie rechnet («3 Kalendermonate, Tag auf das Monatsende gekürzt», kein Sperren, keine ortsüblichen Termine); A-3 «umgesetzt», offene Fragen als «Entschieden (#112)». Stimmt mit dem Code.
- V-3: Steps prüfen jetzt den Ausnahme-Satz, den Formsatz und «weder der Mieter noch der Vermieter allein» (`contract-detail.steps.ts:245,252`, `contract-form.steps.ts:359`).

### fr/it gegen den Gesetzestext auf Fedlex

| Wort in der App | Gesetz fr | Gesetz it | Urteil |
|---|---|---|---|
| fr «logement de la famille» / it «abitazione familiare» (Familienwohnung) | Art. 266m al. 1: «Lorsque la chose louée sert de logement à la famille, un époux ne peut résilier le bail sans le consentement exprès de son conjoint.» | Art. 266m cpv. 1: «Se la cosa locata è adibita ad abitazione familiare, un coniuge può disdire il contratto soltanto con il consenso espresso dell’altro.» | richtig; fr «consentement exprès» richtig; it siehe M-6 |
| fr «partenaire enregistré» / it «partner registrato» | al. 3: «Le présent article s’applique par analogie aux partenaires enregistrés.» | cpv. 3: «… si applica per analogia ai partner registrati.» | richtig |
| fr «autorité de conciliation» / it «autorità di conciliazione» (Schlichtungsbehörde) | Art. 273 al. 1: «La partie qui veut contester le congé doit saisir l’autorité de conciliation dans les 30 jours …» | Art. 273 cpv. 1: «… deve presentare la richiesta all’autorità di conciliazione entro 30 giorni …» | richtig |
| fr «locataire de remplacement» / it «inquilino subentrante» (Ersatzmieter) | Art. 264 al. 1: «… s’il lui présente un nouveau locataire qui soit solvable …» | Art. 264 cpv. 1: «… se gli propone un nuovo conduttore solvibile …» | fr: Gesetz sagt «nouveau locataire», das Bundesgericht und die Praxis «locataire de remplacement» (BGE 119 II 36, über `mmx search`): richtig. it: siehe V-4 |
| fr «tribunal» / it «tribunale» | – | – | Laienwort, passt (Art. 273 Abs. 4/5: Verfahren nach ZPO) |

Weitere fr/it/en-Wörter folgen `i18n-begriffe.md:29` (résiliation/disdetta, terme de résiliation/scadenza di disdetta, annuler la résiliation/revocare la disdetta mit ❓ wie bisher). it «Lei ha concordato» in der Höflichkeitsform richtig. en: Begriffe aus `i18n-begriffe.md` («notice of termination», «termination date»); «conciliation authority», «family home», «express consent», «replacement tenant» sinngemäss richtig (siehe «Nicht bestätigt»).

---

## Befunde

### M-6 (Nit) it: «consenso esplicito»

**Beleg:** `messages/it.json:1391` «… serve il consenso esplicito del coniuge o del partner registrato.» Art. 266m cpv. 1 CO: «… soltanto con il consenso espresso dell’altro.»

**Warum:** Gleiche Bedeutung, aber der Formsatz zitiert sinngemäss das Gesetz; ein Verwalter oder Mieter, der nachschlägt, findet «consenso espresso». fr folgt dem Gesetz («consentement exprès»).

**Behebung:** «consenso espresso».

### M-7 (Nit) fr/it: «doit être écrite» / «deve essere scritta»

**Beleg:** `messages/fr.json:1391` «La résiliation du locataire doit être écrite.»; `messages/it.json:1391` «La disdetta dell’inquilino deve essere scritta.» Art. 266l al. 1: «Le congé … doit être donné par écrit.»; cpv. 1: «La disdetta … deve essere data per scritto.»

**Warum:** «écrite / scritta» liest sich als «verfasst», nicht als Formvorschrift; die Gesetzesformel ist eindeutig.

**Behebung:** fr «La résiliation du locataire doit être donnée par écrit.»; it «La disdetta dell’inquilino deve essere data per scritto.»

### V-4 (Nit) it: «inquilino subentrante»

**Beleg:** `messages/it.json:1392` «Eccezione: un inquilino subentrante riprende il contratto di locazione …»; Art. 264 cpv. 1 CO «un nuovo conduttore … disposto a riprendere il contratto alle medesime condizioni». Tessiner Praxis spricht vom «subentro» / «nuovo inquilino» (Suche `mmx search`, z. B. comparis.ch it, tisubentro.ch).

**Warum:** «subentrante» ist verständlich, aber nicht das Wort des Gesetzes; zudem verwendet `it.json:630` «subentra» für den Eintritt eines Dritten (Art. 263 OR / Art. 121 ZGB), ein anderer Fall. Kein Fehler, nur eine Verwechslungsgefahr.

**Behebung (optional):** «Eccezione: un nuovo inquilino riprende il contratto di locazione alle stesse condizioni, oppure …». Fehlende Begriffe «Ersatzmieter», «Familienwohnung», «Schlichtungsbehörde» in `i18n-begriffe.md`: Vorschlag für das Issue (Labels `fachlich`, `entscheiden`), eine Zeile:

| Ersatzmieter / Familienwohnung / Schlichtungsbehörde | locataire de remplacement / logement de la famille / autorité de conciliation | nuovo inquilino / abitazione familiare / autorità di conciliazione | replacement tenant / family home / conciliation authority |

(Zusammen mit V-2 aus Runde 1, Glossar «Familienwohnung».)

### Offen aus Runde 1 (unverändert, Minor)

M-1 (ausserordentliche Kündigung, Art. 257d OR), M-2 (Vermieterkündigung, Art. 266l Abs. 2, 266n OR; das Label «Kündigung erhalten am» passt dann nur halb), M-3 (Folge eines Formfehlers, Art. 266o OR), M-4 (nichtige Kündigung in der Hilfe «Kündigung aufheben»), V-2 (Glossar «Familienwohnung»). Die Umsetzung macht keinen davon sichtbarer als im entschiedenen Wortlaut vorgesehen.

---

## Nicht bestätigt

- **Englische Fassung:** Die englische Übersetzung des OR auf Fedlex hat keine Rechtskraft; die Datei `.../20261001/en/html/...-en-html-3.html` liess sich laden, enthält die Anker `art_264`, `art_266_m`, `art_273` aber nicht (Struktur anders). en-Wörter nur sinngemäss geprüft.
- **«locataire de remplacement»:** nicht im Gesetzestext, nur in Rechtsprechung und Praxis (BGE 119 II 36, Genfer Urteil ACJC/535/2019, via `mmx search`); als Fachwort gängig.
- **«inquilino subentrante»:** nur Praxisquellen (`mmx search`), kein amtlicher Text.
- **Art. 77 OR auf die Kündigungsfrist ab Eingang, Empfangstheorie, Widerruf vor Eingang:** wie in Runde 1, **unsicher** (Lehre, nicht Fedlex-Wortlaut).
- Nicht geprüft: Layout, a11y, Darstellung in fr/it/en auf dem Bildschirm (Persona- und a11y-Läufe).
