# Fachreview B-15 (#152), Runde 1

Gegenstand: Szenario «Mieter und Wohnung stehen im Mietvertrag fest» (`tests/e2e/features/contract-edit.feature:71-75`, Schritte `tests/e2e/steps/contract-form.steps.ts:225-236`), Texte `contracts_parties_fixed_help` und `backend_contract_parties_fixed` in `messages/{de,fr,it,en}.json` (Zeilen 606 und 1251 im Arbeitsbaum), Entscheid Variante (a) in Issue #152.

Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md`, `docs/PRD-Dwello.md`, `docs/data-model.md`, `docs/design/i18n-begriffe.md`; OR (SR 220) in der Fassung vom 01.10.2026 und ZGB (SR 210) in der Fassung vom 01.07.2026, beide aus dem Fedlex-Filestore (`fedlex.data.admin.ch/filestore/.../eli/cc/27/317_321_377/20261001/de/html/...` bzw. `.../eli/cc/24/233_245_233/20260701/de/html/...`).

## Ergebnis

Die Regel selbst ist fachlich und rechtlich haltbar: Ein Mietvertrag betrifft eine bestimmte Sache (Art. 253 OR), ein Wechsel der Wohnung ist ein neuer Mietvertrag, und ein Mieterwechsel ist im Wohnungsbereich praktisch immer ein neuer Vertrag mit dem Nachfolger (Art. 264 OR). Die Regel verhindert nichts, was der Vermieter erfassen muss: Mietstage, Akonto und Nebenkostenabrechnung pro Mieter bleiben korrekt, weil jeder Mietvertrag eine eigene Abrechnung erhält (Glossar «Nebenkostenabrechnung»). Kein Blocker. Ein Major: Die Hilfe nennt keinen Weg für einen Erfassungsfehler, den häufigsten Grund, Mieter oder Wohnung ändern zu wollen.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Die Hilfe nennt nur Mieterwechsel und Wechsel der Wohnung. Wer den falschen Mieter oder die falsche Wohnung erfasst hat, wird zu «Beenden» geführt und erzeugt eine falsche Kündigung und falsche Mietstage. |
| V-2 | Verwalter | Minor | «beenden Sie diesen Mietvertrag»: Bei einem Mietvertrag mit Vertragsende (befristet, gekündigt, beendet) gibt es die Schaltfläche «Beenden» nicht. |
| M-1 | Mietrecht | Minor | Tod des Mieters (Art. 266i OR, Art. 560 ZGB), Zuweisung der Familienwohnung (Art. 121 ZGB) und Übertragung einer Geschäftsmiete (Art. 263 OR): Hier läuft der Mietvertrag rechtlich weiter. Dwello erfasst den Fall als «gekündigt» plus neuen Vertrag. Zulässig, aber nicht als Mieterwechsel im Sinne der Hilfe; beim Todesfall droht ein falsches Vertragsende. |
| V-3 | Verwalter | Minor | Das Szenario prüft nicht, dass die Hilfe sichtbar ist. Gerade sie führt unerfahrene Vermieter weiter. |
| V-4 | Verwalter | Nit | en: «create a new one». Laut `i18n-begriffe.md` heisst «erfassen» auf Englisch «add» («Add rental contract»). |
| V-5 | Verwalter | Nit | Das Entscheid-Issue #148 (gleicher Gegenstand, Optionen 1–3) ist noch offen, obwohl der Entscheid in #152 steht. |

## Befunde

### V-1 (Major): kein Weg für einen Erfassungsfehler

**Beleg.**
- `messages/de.json:606`: «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung beenden Sie diesen Mietvertrag und erfassen einen neuen.»
- `docs/anforderungen-vertragsende.md:215` (A-7, #116): «ein ‹Duplikat› ist darum meist ein zweiter Vertrag für eine falsche Wohnung, einen falschen Mieter oder einen falschen Zeitraum.» Ein begonnener Mietvertrag lässt sich heute nicht löschen (`anforderungen-vertragsende.md:3, 211`; `messages/de.json:1234` gibt es nur für einen künftigen Vertrag).
- «Beenden» setzt immer *gekündigt* (`anforderungen-vertragsende.md:37`). Nach dem Vertragsende gilt die Zeit als Leerstand, und das Akonto zählt nur bis zum Vertragsende (`messages/de.json:1230`).

**Warum falsch.** Bisher bot das Formular die Auswahl an. Wer einen Vertrag versehentlich dem falschen Mieter oder der falschen Wohnung zuordnete, versuchte ihn genau hier zu korrigieren. Die neue Hilfe schickt ihn zu «Beenden» und «neu erfassen». Das Ergebnis ist ein Mietvertrag, den es nie gab, mit einer Kündigung, die nie ausgesprochen wurde, und mit mindestens einem Mietstag in der falschen Wohnung. Diese Mietstage kommen in die Nebenkostenabrechnung der falschen Wohnung, und die Übersicht meldet «Nachmieter suchen». Ein Treuhänder würde so einen Vertrag stornieren, nicht kündigen.

**Korrektur.** Die Hilfe um den Fehlerfall ergänzen und auf den heute möglichen Weg führen:
- Hat der Vertrag noch nicht begonnen: «Haben Sie beim Erfassen den falschen Mieter oder die falsche Wohnung gewählt, löschen Sie den Mietvertrag und erfassen ihn neu.»
- Hat er begonnen: Bis #116 (A-7) umgesetzt ist, gibt es keinen sauberen Weg. Die Hilfe sollte dann nicht «beenden» empfehlen. Vorschlag: Die Hilfe nennt den Fehlerfall erst, wenn #116 umgesetzt ist, und #152 verweist bis dahin auf #116. Oder das Szenario bzw. die Hilfe unterscheidet künftige und begonnene Verträge. Das entscheidet der Product Owner (`entscheiden`).

Vorgeschlagener Text (de), für einen künftigen Vertrag:
«Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung beenden Sie diesen Mietvertrag und erfassen einen neuen. Haben Sie den falschen Mieter oder die falsche Wohnung gewählt, löschen Sie den Mietvertrag und erfassen ihn neu.»

### V-2 (Minor): «beenden» ohne Schaltfläche «Beenden»

**Beleg.** `src/routes/contracts/[id]/+page.svelte:117-121` zeigt «Beenden» nur `{#if !contract.endDate}`; `+page.server.ts:162-165` lehnt sonst ab mit «Der Mietvertrag hat schon ein Vertragsende. Ändern Sie es unter «Bearbeiten».» (`messages/de.json:1231`).

**Warum falsch.** Bei einem befristeten Vertrag findet der Vermieter auf der Detailseite kein «Beenden». Er muss das Vertragsende hier im Formular vorziehen. Bei einem gekündigten oder beendeten Vertrag ist nichts mehr zu beenden, nur noch der neue Vertrag zu erfassen. Die Hilfe stimmt in der Sache, nennt aber den falschen Weg.

**Korrektur.** Neutral formulieren, ohne Bezug auf die Schaltfläche: «… geben Sie diesem Mietvertrag ein Vertragsende und erfassen einen neuen.» Oder die Hilfe nach Vertragsstatus wählen: ohne Vertragsende «Beenden», mit Vertragsende «erfassen Sie einen neuen Mietvertrag ab dem Tag nach dem Vertragsende». Für die Backend-Ablehnung (`messages/de.json:1251`) genügt der jetzige Text, weil sie nur bei einer veralteten Seite oder einem direkten API-Aufruf erscheint.

### M-1 (Minor): Fälle, in denen der Mietvertrag rechtlich weiterläuft

**Beleg (Fedlex, wörtlich).**
- Art. 263 OR: «¹ Der Mieter von Geschäftsräumen kann das Mietverhältnis mit schriftlicher Zustimmung des Vermieters auf einen Dritten übertragen. ² Der Vermieter kann die Zustimmung nur aus wichtigem Grund verweigern. ³ Stimmt der Vermieter zu, so tritt der Dritte anstelle des Mieters in das Mietverhältnis ein. ⁴ Der Mieter ist von seinen Verpflichtungen gegenüber dem Vermieter befreit. Er haftet jedoch solidarisch mit dem Dritten bis zum Zeitpunkt, in dem das Mietverhältnis gemäss Vertrag oder Gesetz endet oder beendet werden kann, höchstens aber für zwei Jahre.»
- Art. 264 Abs. 1 OR: «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen.»
- Art. 266i OR: «Stirbt der Mieter, so können seine Erben mit der gesetzlichen Frist auf den nächsten gesetzlichen Termin kündigen.»
- Art. 560 Abs. 1 und 2 ZGB: «¹ Die Erben erwerben die Erbschaft als Ganzes mit dem Tode des Erblassers kraft Gesetzes. ² Mit Vorbehalt der gesetzlichen Ausnahmen gehen die Forderungen, das Eigentum, die beschränkten dinglichen Rechte und der Besitz des Erblassers ohne weiteres auf sie über, und die Schulden des Erblassers werden zu persönlichen Schulden der Erben.»
- Art. 121 Abs. 1 ZGB: «Ist ein Ehegatte wegen der Kinder oder aus anderen wichtigen Gründen auf die Wohnung der Familie angewiesen, so kann das Gericht ihm die Rechte und Pflichten aus dem Mietvertrag allein übertragen, sofern dies dem anderen billigerweise zugemutet werden kann.»

**Bewertung.**
- **Art. 264 OR (Ersatzmieter, der häufigste Mieterwechsel bei Wohnungen):** Der neue Mieter übernimmt «zu den gleichen Bedingungen»; in der Praxis schliesst der Vermieter mit ihm einen neuen Vertrag. Den Fall als «beenden + neu erfassen» abzubilden, ist korrekt. **Bestätigt.**
- **Art. 263 OR und Art. 121 ZGB:** Der Dritte bzw. der Ehegatte tritt in *denselben* Vertrag ein. Dwello bildet das als Vertragsende mit *gekündigt* plus neuen Vertrag ab. Für die Nebenkosten ist das richtig (Abrechnung je Mieter nach Mietstagen). «Gekündigt» stimmt rechtlich aber nicht, und die solidarische Haftung des bisherigen Mieters (bis zwei Jahre) lässt sich nicht erfassen. Das widerspricht nichts, was Dwello erfassen muss: Dwello führt weder Haftung noch Vertragsidentität. Art. 263 OR betrifft Dwello, weil der Gebäudetyp auch Geschäftshaus und Gewerbegebäude kennt (Glossar «Gebäudetyp»).
- **Tod des Mieters:** Der Vertrag geht auf die Erben über (Art. 560 ZGB) und läuft, bis sie kündigen (Art. 266i OR). Die Erben sind kein Mieterwechsel, aber ein Vermieter kann die Hilfe so lesen. Er beendet dann den Vertrag auf den Todestag. Folge: Dwello zählt die Zeit danach als Leerstand, die Nebenkosten trägt der Vermieter, und das Akonto zählt nur bis zum Vertragsende (`messages/de.json:1230`). Zum Nachteil des Vermieters, nicht des Mieters; darum Minor.

**Korrektur.** Für B-15 nicht nötig. Als offene Arbeit: Den Fall «Mieter verstorben» (Vertrag bleibt; Adresse oder Kontaktperson der Erben beim Mieter eintragen) in der Hilfe oder in `anforderungen-vertragsende.md` beschreiben. Dazu gehört auch die offene Frage «Aufhebungsvereinbarung» (`anforderungen-vertragsende.md:66`), denn Art. 263 OR und Art. 121 ZGB sind ebenfalls keine Kündigung. Issue mit den Labels `fachlich` und `entscheiden`.

### V-3 (Minor): Das Szenario prüft die Hilfe nicht

**Beleg.** `contract-edit.feature:73-75` prüft nur die Namen und dass es keine Auswahl gibt (`contract-form.steps.ts:233-236`: `tenantChoices`/`apartmentChoices` = 0).

**Warum.** «Done means» in #152 verlangt, dass das Formular keine Änderung anbietet. Für die Zielgruppe (CLAUDE.md, Design-Regeln: «Explain terms with visible help text at the field») gehört der Hinweis auf den richtigen Weg zur Regel. Ohne Prüfung kann er unbemerkt wegfallen.

**Korrektur.** Einen Schritt ergänzen, z. B. `Und sieht der Liegenschaftsverwalter den Hinweis "Bei einem Mieterwechsel oder einem Wechsel der Wohnung beenden Sie diesen Mietvertrag und erfassen einen neuen."`, mit dem Text nach V-1/V-2.

### V-4 (Nit): en «create» statt «add»

**Beleg.** `docs/design/i18n-begriffe.md`, Tabelle «Verbs and labels»: «erfassen (… erfassen) | saisir | registrare | add», «Mietvertrag erfassen | … | Add rental contract». `messages/en.json:606, 1251`: «… and create a new one.»

**Korrektur.** «… end this rental contract and add a new one.» / «End the rental contract and add a new one.» fr («saisissez-en un nouveau», «Terminez» passend zu «Terminer») und it («ne registri uno nuovo», «Termini» passend zu «Terminare») stimmen mit `i18n-begriffe.md` und `contracts_end_action` überein. Auch «changement de locataire» und «cambio d’inquilino» sind wie in `help_statements_2` (Zeile 72). **Bestätigt.**

### V-5 (Nit): Das Entscheid-Issue #148 ist offen

**Beleg.** `gh api repos/rudini/Dwello/issues/148`: state `open`, «Done means: The product owner's decision is recorded in this issue … The issue is closed.» Der Entscheid steht in #152 («Decided (product owner)»).

**Korrektur.** Den Entscheid in #148 eintragen (Option 2) und #148 mit Verweis auf #152 schliessen (CLAUDE.md, «Open work»: ein Entscheid-Issue wird geschlossen, sobald der Entscheid darin steht und das Umsetzungs-Issue existiert).

## Bestätigt

- **Regel «Wohnung fest»:** Art. 253 OR: «Durch den Mietvertrag verpflichtet sich der Vermieter, dem Mieter eine Sache zum Gebrauch zu überlassen, und der Mieter, dem Vermieter dafür einen Mietzins zu leisten.» Eine andere Sache bedeutet einen anderen Vertrag. Der Wechsel der Wohnung ist darum ein neuer Mietvertrag.
- **Datenmodell:** `utility_statements.tenant_id` und `apartment_id` verweisen mit RESTRICT auf Mieter und Wohnung (`docs/data-model.md:45, 230-231`). Würden die Parteien geändert, passten gespeicherte Abrechnungen nicht mehr zum Vertrag. Die Regel schützt das.
- **Glossar:** «Mietvertrag», «Mieter», «Wohnung», «erfassen» und «Liegenschaftsverwalter» stehen im Glossar. «Mieterwechsel» ist kein eigener Eintrag, wird aber im Glossar selbst verwendet («Heizkosten (Kategorie)», «Heizprofil», «Nebenkostenabrechnung») und in bestehenden UI-Texten (`messages/de.json:72, 953, 1130`). Zulässig.
- **PRD:** `docs/PRD-Dwello.md:913-923` (Mieterverlauf als Zeitachse aller Mieter einer Wohnung) setzt einen Vertrag pro Mieter und Wohnung voraus. Die Regel passt dazu.
- **Backend-Ablehnung:** Der Text `backend_contract_parties_fixed` ist sachlich richtig, nennt, was zu tun ist, und erscheint nur bei veralteter Seite oder API-Aufruf. fr und it sind sprachlich und begrifflich korrekt.
- **Szenario-Formulierung:** Die Begriffe in Zeilen 71-75 stammen aus dem Glossar. Die Grundlage (`contract-edit.feature:8-12`) setzt einen laufenden, unbefristeten Vertrag. Die Prüfung der Namen vor dem Fehlen der Auswahl verhindert, dass eine Fehlerseite besteht (`contract-form.steps.ts:232`).
- **Keine Formel betroffen:** Die Änderung berechnet keine Beträge.

## Fehlende Begriffe

- **Mieterwechsel** (optional, für den Product Owner): «Ein anderer Mieter übernimmt eine Wohnung: Der Mietvertrag des bisherigen Mieters endet, für den neuen wird ein eigener Mietvertrag erfasst. Jeder Mietvertrag erhält eine eigene Nebenkostenabrechnung.» Issue mit den Labels `fachlich` und `entscheiden`; kann mit F-22 (#140, «Nachmieter») zusammengehen.

## Nicht bestätigt

- **Praxis bei Art. 263 OR und Art. 121 ZGB:** ob Verwaltungen hier eine Zwischenabrechnung der Nebenkosten auf den Übertragungstag erstellen (wie es Dwello mit zwei Verträgen tut) oder ob der Eintretende die ganze Periode trägt. Keine Fedlex-Grundlage, nicht gesucht. **unsicher**.
- **Formularpflicht für den neuen Vertrag (Art. 270 Abs. 2 OR):** In Kantonen mit Formularpflicht braucht der neue Vertrag nach einem Mieterwechsel das Formular zum Anfangsmietzins. Dwello erfasst Verträge nur und verlangt das nicht; ausserhalb von B-15. Nicht geprüft, welche Kantone die Pflicht haben.
- **Mitmieter oder Ehepaar als Mieter:** Dwello kennt einen Mieter pro Vertrag. Wie das Ausscheiden eines Mitmieters erfasst wird (Mieter-Datensatz ändern vs. neuer Vertrag), steht in keinem der Dokumente (gesucht: «Solidar», «Mitmieter», «Erben» in `PRD-Dwello.md`, `anforderungen-vertragsende.md`, Glossar). Ausserhalb von B-15.
- **Name des Mieters ändern als Umweg:** Ob «Mieter bearbeiten» einen Mieterwechsel als Umbenennung zulässt (und so Vertrag und Abrechnungen rückwirkend einem anderen Namen gibt), ist nicht geprüft. Ausserhalb von B-15.
