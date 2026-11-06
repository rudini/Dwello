# Fach-Review #667, Schritt 5, Runde 1

Gegenstand: Rat zur Überschneidung (`src/lib/contract-form.ts:291-362`, `messages/*.json:839-846`), die Fragen 1–5 des Aufrufers zu P-1 bis P-4 und C-3, die vier #667-Szenarien. Worktree `review-b667-fach5`, detached bei 8beb200. Recht: OR, Fedlex, Fassung vom 1. Oktober 2026 (dateApplicability 2026-10-01, heute in Kraft).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Rat (b) und Rat (a) «end_earlier» sagen nur, wie man das eigene Datum verschiebt (P-4). So trägt man ein Datum ein, das nicht im unterschriebenen Mietvertrag steht. |
| M-1 | Mietrecht | Major | Rat (a) «end_before» rät im Assistenten ohne Bedingung zu «Befristet». Ist der unterschriebene Mietvertrag unbefristet, erfasst Dwello ihn dann rechtlich falsch (Art. 255 Abs. 2 OR). |
| M-2 | Mietrecht | Minor | Rat (c) (P-3): Ein zweiter Weg fehlt, ebenso ein Link. Weber schlägt als Bedingung «gekündigt» vor, das ist zu eng: Ein Vertragsende kann auch vereinbart sein (Glossar «Vertragsende»). Der Rat nennt zudem nicht, vor welchem Tag der andere Mietvertrag enden muss. Fix: Wortlaut `contracts_overlap_advice_end_other` unten, dazu der Link `contracts_overlap_link`. |
| V-2 | Verwalter | Minor | C-3: Beginnt der andere, unbefristete Mietvertrag am selben Tag, lässt sich Rat (c) nicht befolgen. Jedes Vertragsende liegt dann am oder nach dem gemeinsamen Vertragsbeginn. Fix: eigener Rat `contracts_overlap_advice_same_start`, gewählt bei `other.start === values.startDate && !other.end`. |
| V-3 | Verwalter | Minor | P-2: `ContractWizard.svelte:300` hängt jeden Rat an «Vertragsbeginn». Fix: Rat (a) «end_earlier» kommt an «Vertragsende» (`errors.endDate`). Alle anderen Fälle bleiben an «Vertragsbeginn», auch (a) «end_before» bei «Unbefristet»: Dort gibt es kein Feld «Vertragsende». |
| V-4 | Verwalter | Minor | Ist ein Nachmieter erfasst, führt der Rat in eine Schleife. Beispiel: B dauert vom 01.04.2024 bis 31.03.2027, C (unbefristet) beginnt am 01.04.2027, eingegeben ist 01.01.2027 unbefristet. Dwello nennt nur B (`checkDateRangeOverlap`, frühester zuerst; Backend `.limit(1)`) und rät zu einem Vertragsbeginn nach dem 31.03.2027. Am 01.04.2027 folgt dann C-3. Fix: Mildert der neue Wortlaut V-1 («Prüfen Sie … im unterschriebenen Mietvertrag») schon. Ganz behoben wird es, wenn die Prüfung im Browser bei (b) auch den Tag nach `other.end` prüft. Liegt er in einem weiteren Mietvertrag, gilt der Rat von V-2. |
| V-5 | Verwalter | Minor | Plan zu P-1 im Bearbeitungsformular: Der Kasten in `PeriodStep.svelte:139-143` bleibt nach einer Ablehnung beim Speichern stehen (`ContractForm.svelte:180`, Fehler im Formular). Dann steht derselbe Satz zweimal da. Fix: Wie im Assistenten den Kasten ausblenden, solange `errors.form` dasselbe sagt. |

## V-1 (Major): Der Rat verschiebt das eigene Datum statt es zu prüfen

**Beleg:** `messages/de.json:844-845`: «Wählen Sie ein Vertragsende vor dem {date}.» und «Wählen Sie einen Vertragsbeginn nach dem {date}.» Persona P-4 bearbeitet A2 und ändert den Vertragsbeginn auf 01.06.2025. Antwort: «… (01.08.2021 – 30.06.2025, gekündigt). Wählen Sie einen Vertragsbeginn nach dem 30.06.2025.» Dasselbe gilt für das Szenario `contract-edit.feature` (#667).

**Warum falsch:** Vertragsbeginn und Vertragsende sind Abmachungen des Mietvertrags (Art. 253 OR: «Durch den Mietvertrag verpflichtet sich der Vermieter, dem Mieter eine Sache zum Gebrauch zu überlassen, und der Mieter, dem Vermieter dafür einen Mietzins zu leisten.»). Dwello rechnet mit diesen Tagen die Miettage der Nebenkostenabrechnung und die Schlussabrechnung. Eine Überschneidung hat in der Praxis drei Ursachen:
- Das eingegebene Datum ist falsch.
- Das Datum des anderen Mietvertrags ist falsch erfasst oder hat sich geändert, etwa bei einem Ende im Einvernehmen oder mit einem Ersatzmieter (Art. 264 Abs. 1 OR; Glossar «Vertragsende»).
- Die Wohnung ist wirklich doppelt vermietet.

Der Rat nennt nur den ersten Weg und lädt dazu ein, ein Datum zu erfinden. Dieses Datum verfälscht dann die Abrechnung beider Mieter. Ein Verwalter prüft zuerst den Vertrag, dann die erfasste Gegenseite.

**Fix:** Jeder Rat nennt zuerst die Bedingung («muss nach/vor dem {date} liegen»), dann die Prüfung am unterschriebenen Mietvertrag, dann den anderen Mietvertrag. Den Namen trägt schon der erste Satz, also heisst der andere Mietvertrag im Rat «der andere Mietvertrag». Die Schlüssel brauchen dadurch keinen Platzhalter {tenant} mehr, und es braucht keine Fassung für anonymisierte Mieter. Darunter steht ein Link zum anderen Mietvertrag (`contracts_overlap_link`, Param `contract` = id), wie bei `contracts_open_contract_link` in Schritt 2. Im Assistenten bleibt die Eingabe als Entwurf erhalten (`ContractWizard.svelte:55`). Wortlaut unten.

## M-1 (Major): «Wählen Sie «Befristet»» ohne Bedingung

**Beleg:** `messages/de.json:843`, «Wählen Sie «Befristet» mit einem Vertragsende vor dem {date}.». Im Assistenten erscheint der Rat, wenn «Unbefristet» gewählt ist (`contract-form.ts:313-316`). Szenario «Die Ablehnung rät zu einem Vertragsende vor dem späteren Mietvertrag».

**Recht (OR, Stand 1. Oktober 2026):**
- Art. 255 Abs. 2 OR: «Befristet ist das Mietverhältnis, wenn es ohne Kündigung mit Ablauf der vereinbarten Dauer endigen soll.»
- Art. 255 Abs. 3 OR: «Die übrigen Mietverhältnisse gelten als unbefristet.»
- Art. 266 Abs. 1 OR: «Haben die Parteien eine bestimmte Dauer ausdrücklich oder stillschweigend vereinbart, so endet das Mietverhältnis ohne Kündigung mit Ablauf dieser Dauer.»
- Art. 266a Abs. 1 OR: «Die Parteien können das unbefristete Mietverhältnis unter Einhaltung der gesetzlichen Fristen und Termine kündigen, …»

**Warum falsch:** Ob ein Mietvertrag befristet ist, entscheidet die Vereinbarung (Abs. 2), nicht Dwello. Hat der Liegenschaftsverwalter «Unbefristet» gewählt, weil der unterschriebene Mietvertrag unbefristet ist, sagt ihm der Rat, ihn als befristet zu erfassen. Danach behandelt Dwello den Mietvertrag so, als ende er ohne Kündigung: Es fragt nach der stillschweigenden Fortsetzung (`contracts_fixed_term_question`) und nennt keinen Kündigungstermin. Der Vermieter kann dann meinen, der Mieter müsse ohne Kündigung ausziehen, und das ist für den Mieter irreführend. In Schritt 1 habe ich den Rat für den Assistenten als richtig bestätigt. Diese Bestätigung war zu weit, denn sie setzte voraus, dass das «Unbefristet» falsch gewählt ist.

**Fix:** Der Rat macht die Wahl von «Befristet» davon abhängig, ob im unterschriebenen Mietvertrag ein Ende vereinbart ist. Sonst verweist er auf den anderen Mietvertrag. Wortlaut `contracts_overlap_advice_end_before` unten.

## Antworten auf die Fragen

1. **P-3, Rat (c):** Ja, mit Link. Text: «Zum Mietvertrag von {tenant}» (`contracts_overlap_link`), gebaut wie `contracts_open_contract_link`. Er steht bei allen Fällen, denn jeder Rat verweist jetzt auf den anderen Mietvertrag (V-1). Die Bedingung «gekündigt» allein ist zu eng (M-2). Der Wortlaut nennt deshalb Kündigung oder vereinbartes Vertragsende. Der zweite Satz «Sonst wählen Sie eine andere Wohnung.» gilt nur im Assistenten. Im Bearbeitungsformular lässt sich die Wohnung nicht ändern (`contracts_parties_fixed_open`), dort gilt `contracts_overlap_advice_end_other_edit`.
2. **P-4, Rat (b) und (a):** Berechtigt, siehe V-1. Für (a) gilt dasselbe, siehe V-1 und M-1. Weber schlägt «korrigieren Sie zuerst das Vertragsende» vor. Ich schreibe «prüfen Sie», denn auch eine echte Doppelvermietung ist möglich, und dann gibt es nichts zu korrigieren.
3. **C-3:** eigener Rat `contracts_overlap_advice_same_start` (V-2). Ein Rat zum Vertragsende des anderen Mietvertrags kann hier nicht helfen. Helfen kann nur, den eigenen Vertragsbeginn zu prüfen oder den anderen Mietvertrag, der dann doppelt oder falsch erfasst ist. Gilt im Assistenten und im Bearbeitungsformular.
4. **P-1:** Ja, der Satz kann wegfallen. Die Regel stammt von Dwello (`docs/anforderungen-vertragsende.md:31`, Regel 1), nicht aus dem Gesetz. Der neue Satz mit Rat sagt, was blockiert und was zu tun ist. Mit `contracts_overlap_text` fallen auch das falsche Wort «Vertrag» in `contracts_overlap` und der Bindestrich statt «–» im Zeitraum (`contract-availability.ts:132`) weg. Das Bearbeitungsformular siehe V-5. Ein Kasten in der Farbe «caution», der das Speichern sperrt, ist eine Frage des Designs, nicht des Fachs.
5. **P-2:** Nein, das ist so nicht richtig. Siehe V-3. Mit «Befristet» kommt der Rat (a) an «Vertragsende».

## Regel für die Wahl des Rats (ersetzt die Regel aus Runde 1 von Schritt 1)

Der eingegebene Zeitraum heisst A, der andere Mietvertrag B. Beide Grenzen zählen mit.
1. B beginnt nach A: Im Assistenten mit «Unbefristet» gilt `end_before`, sonst `end_earlier`. {date} ist der Vertragsbeginn von B.
2. B beginnt am selben Tag oder früher und hat ein Vertragsende: `start_after`. {date} ist das Vertragsende von B.
3. B beginnt am selben Tag wie A und hat kein Vertragsende: `same_start` (neu, C-3).
4. B beginnt früher und hat kein Vertragsende: im Assistenten `end_other`, im Bearbeitungsformular `end_other_edit`. {date} ist der Vertragsbeginn von A (neu, statt {tenant}).

Nachgerechnet:
- Regel 4: A beginnt am 01.01.2027, B ist gekündigt auf den 31.12.2026. Das liegt «vor dem 01.01.2027», keine Überschneidung. Endet B am 01.01.2027, überschneiden sie sich (`lte`), und auch das stimmt mit «vor dem» überein.
- Regel 3: A und B beginnen beide am 01.04.2027. Jedes Vertragsende von B liegt am oder nach dem 01.04.2027, also bleibt eine Überschneidung. Darum gilt hier nicht Regel 4.
- Regel 2: B endet am 31.03.2027, A beginnt am 01.04.2027. Keine Überschneidung.
- Regel 1: B beginnt am 01.04.2027, A endet am 31.03.2027. Keine Überschneidung.

## Wortlaut

fr wie in `messages/fr.json`: U+00A0 nach «, vor » : ? ! (hier als ` ` geschrieben, gleichwertig zum Zeichen in der Datei). Die Sätze `contracts_overlap_with` und `contracts_overlap_with_anonymised` bleiben unverändert.

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_overlap_advice_end_before (geändert; {date}; nur Assistent bei «Unbefristet») | Ist im unterschriebenen Mietvertrag ein Vertragsende vor dem {date} vereinbart, wählen Sie «Befristet» mit diesem Vertragsende. Sonst prüfen Sie den Vertragsbeginn des anderen Mietvertrags. | "Si le contrat de bail signé prévoit une fin du contrat antérieure au {date}, choisissez « Durée déterminée » avec cette fin du contrat. Sinon, vérifiez le début du contrat de l’autre contrat de bail." | Se nel contratto di locazione firmato è pattuita una fine del contratto anteriore al {date}, scelga «A tempo determinato» con questa fine del contratto. Altrimenti verifichi l’inizio del contratto dell’altro contratto di locazione. | If the signed rental contract sets a contract end before {date}, choose «Fixed-term» with that contract end. Otherwise check the contract start of the other rental contract. |
| contracts_overlap_advice_end_earlier (geändert; {date}; Assistent bei «Befristet», Bearbeitungsformular) | Das Vertragsende muss vor dem {date} liegen. Prüfen Sie es im unterschriebenen Mietvertrag oder in der Kündigung. Stimmt es, prüfen Sie den Vertragsbeginn des anderen Mietvertrags. | "La fin du contrat doit être antérieure au {date}. Vérifiez-la dans le contrat de bail signé ou dans la résiliation. Si elle est correcte, vérifiez le début du contrat de l’autre contrat de bail." | La fine del contratto deve essere anteriore al {date}. La verifichi nel contratto di locazione firmato o nella disdetta. Se è corretta, verifichi l’inizio del contratto dell’altro contratto di locazione. | The contract end must be before {date}. Check it in the signed rental contract or in the notice of termination. If it is correct, check the contract start of the other rental contract. |
| contracts_overlap_advice_start_after (geändert; {date}) | Der Vertragsbeginn muss nach dem {date} liegen. Prüfen Sie ihn im unterschriebenen Mietvertrag. Stimmt er, prüfen Sie das Vertragsende des anderen Mietvertrags. | "Le début du contrat doit être postérieur au {date}. Vérifiez-le dans le contrat de bail signé. S’il est correct, vérifiez la fin du contrat de l’autre contrat de bail." | L’inizio del contratto deve essere successivo al {date}. Lo verifichi nel contratto di locazione firmato. Se è corretto, verifichi la fine del contratto dell’altro contratto di locazione. | The contract start must be after {date}. Check it in the signed rental contract. If it is correct, check the contract end of the other rental contract. |
| contracts_overlap_advice_end_other (geändert; {date} statt {tenant}; Assistent) | Endet der andere Mietvertrag vor dem {date}, weil er gekündigt oder ein Vertragsende vereinbart ist, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung. | "Si l’autre contrat de bail prend fin avant le {date}, parce qu’il est résilié ou qu’une fin du contrat a été convenue, saisissez d’abord la fin du contrat sur sa page avec « Saisir la date de fin ». Sinon, choisissez un autre appartement." | Se l’altro contratto di locazione termina prima del {date}, perché è disdetto o è stata pattuita una fine del contratto, inserisca prima la fine del contratto sulla sua pagina con «Registrare la data di fine». Altrimenti scelga un altro appartamento. | If the other rental contract ends before {date} because it was terminated by notice or a contract end was agreed, first enter the contract end on its page with «Enter end date». Otherwise choose another apartment. |
| contracts_overlap_advice_end_other_edit (neu; {date}; Bearbeitungsformular) | Endet der andere Mietvertrag vor dem {date}, weil er gekündigt oder ein Vertragsende vereinbart ist, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst prüfen Sie den Vertragsbeginn im unterschriebenen Mietvertrag. | "Si l’autre contrat de bail prend fin avant le {date}, parce qu’il est résilié ou qu’une fin du contrat a été convenue, saisissez d’abord la fin du contrat sur sa page avec « Saisir la date de fin ». Sinon, vérifiez le début du contrat dans le contrat de bail signé." | Se l’altro contratto di locazione termina prima del {date}, perché è disdetto o è stata pattuita una fine del contratto, inserisca prima la fine del contratto sulla sua pagina con «Registrare la data di fine». Altrimenti verifichi l’inizio del contratto nel contratto di locazione firmato. | If the other rental contract ends before {date} because it was terminated by notice or a contract end was agreed, first enter the contract end on its page with «Enter end date». Otherwise check the contract start in the signed rental contract. |
| contracts_overlap_advice_same_start (neu, C-3; ohne Param) | Der andere Mietvertrag beginnt am selben Tag und hat kein Vertragsende. Prüfen Sie den Vertragsbeginn im unterschriebenen Mietvertrag. Stimmt er, prüfen Sie den anderen Mietvertrag und korrigieren Sie ihn, wenn er falsch erfasst ist. | "L’autre contrat de bail commence le même jour et n’a pas de fin du contrat. Vérifiez le début du contrat dans le contrat de bail signé. S’il est correct, vérifiez l’autre contrat de bail et corrigez-le s’il a été mal saisi." | L’altro contratto di locazione inizia lo stesso giorno e non ha una fine del contratto. Verifichi l’inizio del contratto nel contratto di locazione firmato. Se è corretto, verifichi l’altro contratto di locazione e lo corregga se è stato registrato in modo errato. | The other rental contract starts on the same day and has no contract end. Check the contract start in the signed rental contract. If it is correct, check the other rental contract and correct it if it was entered wrongly. |
| contracts_overlap_link (neu; {tenant}; Ziel `/contracts/{contract}`) | Zum Mietvertrag von {tenant} | "Vers le contrat de bail de {tenant}" | Al contratto di locazione di {tenant} | Go to the rental contract of {tenant} |
| contracts_overlap_link_anonymised (neu) | Zum Mietvertrag des anonymisierten Mieters | "Vers le contrat de bail du locataire anonymisé" | Al contratto di locazione dell’inquilino anonimizzato | Go to the rental contract of the anonymised tenant |
| contracts_overlap_text | entfällt (P-1) | entfällt | entfällt | entfällt |

## Szenarien: Ersatzzeilen

Die Zeilen zitieren nur den Text der Ablehnung. Der Link ist ein eigenes Element und nicht Teil des Zitats.

`contract-new.feature`, «Die Ablehnung nennt den laufenden Mietvertrag ohne Vertragsende» (Regel 4, Assistent, {date} = 01.01.2027):
```
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (seit 01.04.2024, unbefristet). Endet der andere Mietvertrag vor dem 01.01.2027, weil er gekündigt oder ein Vertragsende vereinbart ist, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung."
```
`contract-new.feature`, «Die Ablehnung rät zu einem Vertragsbeginn nach dem früheren Mietvertrag» (Regel 2):
```
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (01.04.2024 – 31.03.2027, befristet). Der Vertragsbeginn muss nach dem 31.03.2027 liegen. Prüfen Sie ihn im unterschriebenen Mietvertrag. Stimmt er, prüfen Sie das Vertragsende des anderen Mietvertrags."
```
`contract-new.feature`, «Die Ablehnung rät zu einem Vertragsende vor dem späteren Mietvertrag» (Regel 1, Assistent, «Unbefristet»):
```
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (ab 01.04.2027, unbefristet). Ist im unterschriebenen Mietvertrag ein Vertragsende vor dem 01.04.2027 vereinbart, wählen Sie «Befristet» mit diesem Vertragsende. Sonst prüfen Sie den Vertragsbeginn des anderen Mietvertrags."
```
`contract-edit.feature`, «Die Ablehnung beim Bearbeiten sagt, was zu tun ist» (Regel 2):
```
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (01.01.2022 – 31.03.2024, befristet). Der Vertragsbeginn muss nach dem 31.03.2024 liegen. Prüfen Sie ihn im unterschriebenen Mietvertrag. Stimmt er, prüfen Sie das Vertragsende des anderen Mietvertrags."
```
Die Szenarionamen passen weiter. Kein Szenario ohne @wip auf main zitiert einen dieser Texte (Schritt 1, Grep).

## Fehlende Begriffe

Keine. Verwendet sind nur Mietvertrag, Vertragsbeginn, Vertragsende, Befristet/Unbefristet, Kündigung/gekündigt, Wohnung und anonymisierter Mieter, in den Übersetzungen nach `docs/design/i18n-begriffe.md:15, 35-41`. «Enddatum erfassen» ist der Name der Schaltfläche (`contracts_end_action`), kein Fachbegriff. Dass Schaltfläche und Feld verschieden heissen (Beobachtung Weber), besteht schon vor dieser Änderung.

## Nicht bestätigt

- Ob beim Bearbeitungsformular ungespeicherte Änderungen verloren gehen, wenn man dem Link folgt. Nur im Assistenten gesehen (Entwurf, `ContractWizard.svelte:55`). Das Bearbeitungsformular nicht geprüft.
- Ob «Vertragsdauer» (Befristet/Unbefristet) im Assistenten selbst einen Feldfehler tragen kann (V-3, Fall `end_before`). Nur `PeriodStep.svelte:85, 121` gelesen (`errors.startDate`, `errors.endDate`).
- Ob Regel 3 im Bearbeitungsformular erreichbar ist. Nicht ausgeführt, nur aus `overlapText` geschlossen.
- Laut Code-Review (C-3-Umfeld) tritt `end_other` für einen anonymisierten Mieter nie auf. Ich habe das übernommen und nicht selbst geprüft. Der neue Wortlaut braucht {tenant} ohnehin nicht mehr.

Geprüft: Fedlex OR Stand 2026-10-01, Art. 253, 255, 264, 266, 266a (Wortlaut oben); Glossar (`UBIQUITOUS_LANGUAGE.md:39-49`); Regel 1 in `docs/anforderungen-vertragsende.md:31`; P-5 und P-6 nicht beurteilt (ausserhalb des Auftrags).
