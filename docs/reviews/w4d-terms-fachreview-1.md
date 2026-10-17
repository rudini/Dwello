# Fach-Review 1: Begriffsvorschlag #83 (F-20a), Option B

Gegenstand: `w4d-term-proposal.md` (Scratchpad), Worktree `review-terms-fach` (Commit 8ded4b1).
Quellen: `co-fr.txt`, `co-it.txt` (SR 220, Stand 1.10.2026), `oblf-fr.txt`, `oblf-it.txt` (SR 221.213.11, Stand 1.10.2025), dazu je ein WebFetch der deutschen Fedlex-Fassung von VMWG und OR (Filestore-HTML, Stand 2025-10-01 bzw. 2026-10-01).
Repo-Belege: `UBIQUITOUS_LANGUAGE.md` (UL), `docs/design/i18n-begriffe.md` (i18n), `messages/{de,fr,it,en}.json`, `backend/src/services/reminder-letter.ts`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | VMWG «anrechenbar / entrant en ligne de compte / computabili» ist nicht Dwellos «umlagefähig»; it «computabile» darf nicht kommen. Der Fedlex-Ausdruck für Dwellos Begriff ist «als Nebenkosten in Rechnung stellen» = it «addebitare come spese accessorie» (Art. 6b, 6c Abs. 3 VMWG): it «addebitabile» bleibt. |
| M-2 | Mietrecht | Major | fr «imputable» hat im Mietrecht eine andere Bedeutung («imputables au locataire» = «zu verantworten», Art. 259a Abs. 1 OR) und darf nicht bestätigt werden. In Fedlex gibt es dafür nur das Verb «facturer (au titre de / en tant que) frais accessoires»: fr bleibt ❓. |
| V-1 | Verwalter | Major | Der Vorschlag regelt bei «Mahnung» nur die 2. und 3. Stufe. Offen bleiben der Oberbegriff (Glossar, Button «Mahnung senden»), Mahnstufe und Mahnfrist sowie die Brieftitel an den Mieter (`reminder-letter.ts`). Sie müssen zusammen entschieden werden. |
| M-3 | Mietrecht | Minor | Die Aussage «kein Fedlex-Wort passt zur Mahnung» ist unvollständig: Für eine (wiederholte) Zahlungsaufforderung verwendet Fedlex «sommation / diffida» (Art. 867 Abs. 3, 496 Abs. 1, 93 Abs. 2 OR). Diese Belege gehören zur Frage an die muttersprachliche Person; Art. 257f («protestation / diffida scritta») und Art. 102 («interpellation») passen nicht als Brieftitel. |
| M-4 | Mietrecht | Minor | Kündigungsfrist fehlt als Zeile in `i18n-begriffe.md` (nur im Glossar). Vorschlag fr «délai de congé», it «termine di preavviso» bestätigt. |
| M-5 | Mietrecht | Minor | Folgetexte: Fedlex sagt «réception du congé» / «ricevimento della disdetta» (Art. 273 Abs. 2 lit. a OR), das Glossar sagt «réception de la résiliation» / «ricezione della disdetta». Ausserdem müssen alle Fundstellen (fr 37 Treffer der geänderten Wörter, it 5) in derselben Änderung angepasst werden. |
| M-6 | Mietrecht | Nit | Kündigungstermin fr: «terme de résiliation» ist ebenfalls Fedlex-Mietrecht (Art. 269d Abs. 1, 270a Abs. 1 OR). Die Wahl von «terme de congé» ist richtig, aber anders zu begründen (Gliederungstitel vor Art. 266a, Art. 264 Abs. 2, 266a Abs. 2). |
| M-7 | Mietrecht | Minor | «Kündigung aufheben»: Kein Fedlex-Wort bestätigt. Hinweis für die muttersprachliche Person: fr «annuler» steht in Fedlex für die Aufhebung durch die Behörde (Art. 271 «annulable»), deckt also nur einen der zwei Fälle aus UL:40 ab. |
| V-2 | Verwalter | Nit | Abrechnungslauf: Das Verb ist in Fedlex belegt (Art. 4 Abs. 1 VMWG «établir» / «allestire»), der «Lauf» nicht. ❓ bleibt, der Beleg gehört zur Frage. |
| M-8 | Mietrecht | Minor | Geltungsbereich von Option B ist offen: Fedlex-it sagt «conduttore», die App sagt «inquilino». Das braucht einen Entscheid des Product Owners, keine stille Änderung. |

## Befunde

### M-1 (Major): «anrechenbar» (VMWG) ist nicht «umlagefähig» (Dwello)

**Beleg.**
- VMWG de (WebFetch): Titel Art. 5 «Anrechenbare Heizungs- und Warmwasserkosten», Art. 6 «Nicht anrechenbare Heizungs- und Warmwasserkosten». fr: oblf-fr.txt:29 «Art. 5 Frais de chauffage et de préparation d’eau chaude entrant en ligne de compte», oblf-fr.txt:34 (Art. 6). it: oblf-it.txt:30 «Art. 5 Spese computabili di riscaldamento e d’acqua calda», oblf-it.txt:35 (Art. 6).
- «Anrechnen» bedeutet in der VMWG auch etwas anderes. Art. 4 Abs. 3 de: «… dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden» = fr «portés en compte» (oblf-fr.txt:27) = it «computate» (oblf-it.txt:28). Art. 4 Abs. 2 it: «In caso di computo forfettario» (oblf-it.txt:27), dort ist «computo» die Pauschale.
- Fedlex-Wortlaut für Dwellos Begriff: VMWG de Art. 6b «… als Nebenkosten in Rechnung stellen», Art. 6c Abs. 3 «… während höchstens 10 Jahren als Nebenkosten in Rechnung stellen». it oblf-it.txt:42 (Art. 6b) «il locatore può addebitare come spese accessorie i costi …», oblf-it.txt:49 (Art. 6c cpv. 3) «Il locatore può addebitare come spese accessorie i costi …», oblf-it.txt:50 (cpv. 4) «L’importo addebitato annualmente …». fr oblf-fr.txt:41 (Art. 6b) «le bailleur peut facturer les coûts … en tant que coûts accessoires», oblf-fr.txt:48 (Art. 6c al. 3) «Le bailleur peut facturer au titre de frais accessoires les coûts …».
- Dwellos Begriff: UL:86 «Umlagefähigkeit: Ob die Kosten einer Kategorie in die Nebenkostenabrechnung fliessen können (Art. 257b OR, Art. 4–6c VMWG)», UL:69 «Umlagefähige Rechnung: Die Rechnung fliesst in die Nebenkostenabrechnung ein», UL:91 (Liste: Heizung, Wasser, Hauswart, Lift, Kehricht …).

**Warum das falsch wäre.** «Anrechenbar» beantwortet in Art. 5 und 6 nur die Frage, welche Ausgaben zu den Heizungs- und Warmwasserkosten zählen. Dwellos «umlagefähig» gilt für jede Kategorie (Hauswart, Lift, Kehricht …): Die Kosten dürfen als Nebenkosten in Rechnung gestellt werden. Das ist genau das Verb in Art. 6b und 6c. Mit «computabile» stünde im Italienischen für Hauswart oder Kehricht ein Begriff, den die Verordnung nur für Heizkosten verwendet. Dazu kommt die Mehrdeutigkeit von «computo» in Art. 4.

**Korrektur.** Die bedingte Variante «it computabile» aus dem Vorschlag streichen. it «addebitabile» bleibt, und ❓ entfällt: Das Adjektiv leitet sich vom Fedlex-Verb «addebitare come spese accessorie» (Art. 6b, 6c Abs. 3 VMWG) ab und ist schon das Wort der App (messages/it.json:102–103). Ehrlich gesagt ist das Adjektiv selbst in Fedlex nicht belegt, nur das Verb. Wer nur wörtliche Fedlex-Formen zulässt, lässt auch it bei ❓.

### M-2 (Major): fr «imputable» hat im Mietrecht eine andere Bedeutung

**Beleg.** co-fr.txt:1427 (Art. 259a al. 1 CO): «Lorsque apparaissent des défauts de la chose qui ne sont pas imputables au locataire …». Die deutsche Fassung (WebFetch) lautet: «Mängel, die der Mieter weder zu verantworten … hat». In den 30 Artikeln ab Art. 253 kommt «imputable» nur in dieser Bedeutung vor. Die App verwendet zudem «imputer» schon für die Verrechnung der Akonto: messages/fr.json:89 «Le décompte des charges l’impute sur les coûts effectifs». Heutiges Wort: i18n:45, messages/fr.json:102–103.

**Warum das falsch ist.** Für einen französischsprachigen Mieter oder Verwalter heisst «frais imputables au locataire» im Mietrecht «vom Mieter verschuldet». Dwello meint aber «darf als Nebenkosten verrechnet werden». Zusammen mit der Akonto-Verrechnung trägt dasselbe Wort in der App damit zwei Bedeutungen und im Gesetz eine dritte.

**Korrektur.** fr «imputable» nicht bestätigen; fr bleibt ❓ für die muttersprachliche Person. Ihr werden diese Belege mitgegeben: Das Fedlex-Verb für den Begriff ist «facturer (au titre de / en tant que) frais accessoires» (Art. 6b, 6c al. 3 OBLF), Art. 257a al. 2 CO sagt «à la charge du locataire» (co-fr.txt:1382). Ein Adjektiv gibt Fedlex nicht her, also schlage ich kein Wort vor. Im Unterschied zu it (M-1) ist das heutige fr-Wort nicht vom Fedlex-Verb abgeleitet und hat zudem eine abweichende Fedlex-Bedeutung.

### V-1 (Major): Der Mahnungs-Begriff ist nur teilweise geregelt

**Beleg.** Im Vorschlag betrifft die Zeile «Mahnung» nur die 2. und 3. Stufe. Betroffen sind aber auch:
- i18n:68 «Mahnung / Zahlungserinnerung / 2. Mahnung | rappel / rappel de paiement / 2e rappel | sollecito / …»;
- i18n:69 (Mahnstufe, Mahnfrist: «niveau de rappel / délai de rappel», «livello di sollecito / termine di sollecito»);
- i18n:101 (Button «Mahnung senden» = «Envoyer un rappel» / «Inviare un sollecito»);
- messages/fr.json:108, it.json:108 (Glossar-Oberbegriff «Rappel», «Sollecito»);
- backend/src/services/reminder-letter.ts:44 `titles: ['Rappel de paiement', '2e rappel', '3e rappel']` und :61 `['Promemoria di pagamento', '2° sollecito', '3° sollecito']`, also die Brieftitel an den Mieter;
- UL:182–184 (Mahnung als Oberbegriff, Mahnstufe, Mahnfrist).

**Warum das ein Problem ist.** Werden die 2. und 3. Stufe zu «sommation» / «diffida», während Oberbegriff, Button, Mahnstufe und Mahnfrist bei «rappel» / «sollecito» bleiben, löst der Button «Envoyer un rappel» einen Brief «2e sommation» aus. Glossar, Bildschirm und Brief benennen dann dieselbe Sache verschieden. Aus Sicht der Praxis ist das gerade bei einem Schreiben an den Mieter heikel.

**Korrektur.** Die muttersprachliche Person entscheidet in einem Zug über Oberbegriff, 2./3. Stufe, Mahnstufe, Mahnfrist, Button und Brieftitel. Die 1. Stufe (Zahlungserinnerung «rappel de paiement» / «promemoria di pagamento») und «Mahngebühr» bleiben davon unberührt. Mahngebühr betrifft die Mahnung eines Rechnungsstellers (UL:72) und ist ein eigener Begriff.

### M-3 (Minor): Fedlex-Belege zur Mahnung sind unvollständig

**Beleg.**
- Art. 102 Abs. 1 OR, de (WebFetch): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» fr co-fr.txt:564: «… est mis en demeure par l’interpellation du créancier.» it co-it.txt:564: «… è costituito in mora mediante l’interpellazione del creditore.»
- Art. 257f Abs. 3 OR, de (WebFetch): «Verletzt der Mieter trotz schriftlicher Mahnung des Vermieters seine Pflicht zu Sorgfalt oder Rücksichtnahme weiter …»; fr co-fr.txt:1404 «nonobstant une protestation écrite du bailleur»; it co-it.txt:1401 «nonostante diffida scritta del locatore».
- Im Vorschlag fehlen diese Stellen:
  - co-fr.txt:6421, Art. 867 al. 3 CO: «Lorsque les paiements ne sont point effectués après cette première sommation, l’associé qui ne s’exécute pas dans le mois qui suit une sommation réitérée …»; co-it.txt:6404: «Qualora il pagamento non sia eseguito a seguito della prima diffida né entro un mese decorribile da una seconda …»;
  - co-fr.txt:3621, Art. 496 al. 1 CO: «… qu’il ait été sommé en vain de s’acquitter»; co-it.txt:3612: «… sia stato invano diffidato»;
  - co-fr.txt:517, co-it.txt:517 (Art. 93 Abs. 2 OR): «après sommation préalable» / «previa diffida».

**Bewertung.**
- Art. 257f regelt die Pflichtverletzung (Sorgfalt, Rücksichtnahme), nicht die Zahlung. Das Wort passt nicht, wie der Vorschlag richtig sagt.
- Art. 102 nennt den Rechtsakt, der in Verzug setzt («interpellation» / «interpellazione»), keine Briefart mit Stufen. Für Dwellos gestufte Zahlungsaufforderung (UL:182–183) ist das kein Wort, das die App verwenden muss.
- In Art. 867 Abs. 3 steht dagegen in Fedlex eine erste und eine wiederholte Zahlungsaufforderung mit «sommation» / «diffida». Die Vorschläge aus dem Issue haben also eine Fedlex-Grundlage für Zahlungsaufforderungen, allerdings nicht im Mietrecht. Ob das deutsche Original dort «Mahnung» heisst, habe ich nicht bestätigt (siehe «Nicht bestätigt»).

**Korrektur.** Die Begründung «none fits» ersetzen durch: «Kein Fedlex-Wort für Dwellos Mahnung im Mietrecht. Für Zahlungsaufforderungen verwendet das OR ‹sommation / diffida› (Art. 867 Abs. 3, 496 Abs. 1), für den Verzugsakt ‹interpellation› (Art. 102).» Der Entscheid bleibt bei der muttersprachlichen Person (❓).

### M-4 (Minor): Kündigungsfrist bestätigt, Zeile in `i18n-begriffe.md` fehlt

**Beleg fr.** co-fr.txt:1510 (Art. 266a al. 1) «en observant les délais de congé et les termes légaux»; co-fr.txt:1517 (Art. 266c) «en observant un délai de congé de trois mois pour le terme fixé par l’usage local». Zählung im OR: «délai de congé» 35×, «délai de résiliation» 3×, davon im Mietrecht nur einmal (co-fr.txt:1601, Art. 269d al. 1).

**Beleg it.** co-it.txt:1507 (Art. 266a cpv. 1) «osservando i termini legali di preavviso e le scadenze di disdetta, sempreché non abbiano pattuito un termine di preavviso più lungo»; Art. 269d cpv. 1 (co-it.txt:1598) «prima dell’inizio del termine di preavviso». Das heutige «termine di disdetta» steht im OR nur ausserhalb des Mietrechts (z.B. co-it.txt:2296 Art. 335c, 2366, 2405 Arbeitsvertrag).

**Dwello.** UL:41 definiert den Begriff. In i18n gibt es keine Zeile, der Begriff steht nur im Glossar: messages/fr.json:118 «Délai de résiliation», it.json:118 «Termine di disdetta».

**Korrektur.** Eine Zeile «Kündigungsfrist | délai de congé | termine di preavviso | notice period» in `i18n-begriffe.md` aufnehmen; das ist ein Fedlex-Wort, also ohne ❓.

### M-5 (Minor): Folgetexte und vollständige Ersetzung

**Beleg.** co-fr.txt:1668 (Art. 273 al. 2 let. a CO) «dans les 30 jours qui suivent la réception du congé»; co-it.txt:1665 «entro 30 giorni dal ricevimento della disdetta». Die App schreibt messages/fr.json:119 «Le temps entre la réception de la résiliation et le terme de résiliation» und it.json:119 «Il tempo tra la ricezione della disdetta …». In messages/fr.json kommen «délai de résiliation», «terme de résiliation» und «imputable» 37× vor, in it.json «termine di disdetta» 5×.

**Warum.** Werden nur die Glossarbegriffe geändert, stehen in Hilfetexten, Formularen und Fehlermeldungen weiter die alten Wörter. CLAUDE.md verlangt aber, dass jeder geänderte Text in derselben Änderung angepasst wird.

**Korrektur.** Bei der Umsetzung alle Fundstellen ersetzen und die Formulierung an Fedlex anlehnen, z.B. fr «entre la réception du congé et le terme de congé», it «tra il ricevimento della disdetta e la scadenza di disdetta». Das ist Wortlaut aus Fedlex, keine neue Prägung.

### M-6 (Nit): Kündigungstermin, Begründung präzisieren

**Beleg.** «terme de congé»: co-fr.txt:1497 (Art. 264 al. 2), co-fr.txt:1511 (Art. 266a al. 2), Gliederungstitel vor Art. 266a «II. Délais et termes de congés». «terme de résiliation» steht ebenfalls im Mietrecht: co-fr.txt:1601 (Art. 269d al. 1), co-fr.txt:1616 (Art. 270a al. 1). it «scadenza di disdetta»: co-it.txt:1507–1508 (Art. 266a), 1598 (Art. 269d), 1613 (Art. 270a).

**Bewertung.** Beide fr-Wörter sind Fedlex. «terme de congé» gehört zu dem Abschnitt (Art. 266a–266c), auf den sich UL:39 und UL:41 stützen, und passt zu «délai de congé». Der Vorschlag ist damit bestätigt, it bleibt unverändert. Zu korrigieren ist nur die Begründung: «terme de congé» steht nicht nur in Art. 266a al. 2.

### M-7 (Minor): Kündigung aufheben, kein Fedlex-Wort

**Beleg.** co-fr.txt:1633–1636 (Titel «A. Annulabilité du congé», Art. 271 al. 1 «Le congé est annulable lorsqu’il contrevient aux règles de la bonne foi»); co-it.txt:1630–1633 («Contestabilità della disdetta», «può essere contestata»). Ein Wort für die einvernehmliche Rücknahme einer Kündigung gibt es im Mietrecht nicht; «revoc…» und «retir… le congé» kommen in den Art. 253–274g nicht vor.

**Bewertung.** Der Vorschlag ist bestätigt: ❓ bleibt. Als Hinweis für die muttersprachliche Person: fr «annuler» bezeichnet in Fedlex die Aufhebung durch die Behörde, also nur einen der zwei Fälle aus UL:40 (Einvernehmen oder Ungültigerklärung). en «withdraw notice» bleibt nach dem Entscheid in #83 (Klartext).

### V-2 (Nit): Abrechnungslauf

**Beleg.** oblf-fr.txt:25 (Art. 4 al. 1) «il doit établir celui-ci au moins une fois par an»; oblf-it.txt:26 «deve allestirlo almeno una volta all’anno». Die heutigen Wörter «établissement des décomptes» und «allestimento dei conteggi» sowie die Buttons i18n:97 («Établir les décomptes» / «Allestire i conteggi») verwenden dieses Verb.

**Bewertung.** Für den «Lauf», also einen Durchgang über mehrere Gebäude mit Heizprofil und Pauschale (UL:149), gibt es kein Fedlex-Wort; ❓ bleibt wie vorgeschlagen. Der Beleg gehört zur Frage an die muttersprachliche Person, weil die heutigen Wörter zum Verordnungsverb passen.

### M-8 (Minor): Geltungsbereich von Option B

**Beleg.** Im OR-it steht «conduttore» 122×, «inquilino» nur 1× (co-it.txt). OBLF it verwendet «conduttore» (oblf-it.txt:26, Art. 4 cpv. 1), in Art. 6c cpv. 2 lit. b aber «agli inquilini» (oblf-it.txt:48). «pigione» ist Fedlex (Art. 257e cpv. 2, 269d cpv. 1). Die App sagt «inquilino» (i18n, Zeile Mieter).

**Warum.** Option B sagt: «wo Fedlex ein Wort hat, wird es verwendet». Ob das nur für die ❓-Begriffe gilt oder auch für schon festgelegte Begriffe, steht nicht im Entscheid. Der Vorschlag hält das richtigerweise nur fest.

**Korrektur.** Der Aufrufer eröffnet ein Issue (Labels `fachlich`, `entscheiden`) mit dem Titel-Vorschlag «Option B auch für festgelegte Begriffe? it ‹inquilino› vs. Fedlex ‹conduttore›». Bis zum Entscheid gibt es keine Änderung.

## Bestätigt ohne Befund

- Kündigung / gekündigt: fr «résiliation / résilié» (Verb «résilier» Art. 257d al. 1, 266a al. 1; Nomen «résiliation» Art. 266a al. 2) und it «disdetta / disdetto» (Art. 266l cpv. 1, 257d cpv. 1 «sarà disdetto») sind Fedlex und bleiben. fr «congé» (Art. 266l–266o) wäre ebenso Fedlex; der Vorschlag lässt den Stand der App, das ist zulässig.
- Konfidenz: Das ist kein Rechtsbegriff, Fedlex hat kein Wort dafür. ❓ für fr/it bleibt, en «confidence» bleibt.
- Englisch: Nach dem Entscheid in #83 bleiben die Klartext-Wörter, das ❓ für en entfällt (i18n:30, 45, 57).
- Mahngebühr / Verzugszins (i18n:39): nicht Teil von #83. «intérêt moratoire» / «interesse di mora» entsprechen Art. 104 OR (co-fr.txt:571 «l’intérêt moratoire»).

## Fehlende Begriffe (Issue durch den Aufrufer)

- M-8: Entscheid über den Geltungsbereich von Option B (Labels `fachlich`, `entscheiden`), Formulierung siehe oben.
- Kein neuer deutscher Domänenbegriff nötig. Kündigungsfrist steht schon in UL:41, es fehlt nur die Zeile in i18n (M-4).

## Nicht bestätigt

- Ob der deutsche Wortlaut von Art. 496 Abs. 1 OR («erfolglos gemahnt»?) und Art. 867 Abs. 3 OR («Mahnung» oder «Aufforderung»?) das Wort «Mahnung» enthält, habe ich nicht geprüft. Der WebFetch der deutschen OR-Fassung deckte nur die Zeichen 0–260 000 ab (bis etwa Art. 270); beide Artikel liegen dahinter, und die Regel erlaubt nicht beliebig viele Abrufe. Die Gleichsetzung «sommation / diffida = Mahnung» bleibt daher **unsicher**; die fr/it-Stellen selbst sind belegt (co-fr.txt:3621, 6421; co-it.txt:3612, 6404).
- Wie Verwaltungen in der Romandie und im Tessin ihre Mahnbriefe in der Praxis betiteln («2e rappel» oder «sommation», «sollecito» oder «diffida»), habe ich nicht recherchiert. Dafür gibt es keine Fedlex-Quelle; das entscheidet die muttersprachliche Person.
- ZGB (SR 210) habe ich nicht durchsucht. Keiner der geprüften Begriffe ist dort geregelt; die Mietrechtsbegriffe stehen im OR und in der VMWG.
- Die deutschen Wortlaute aus den WebFetch-Abrufen (VMWG Art. 4–6c; OR Art. 102, 257a, 257d, 257f, 259a, 266a, 269d) wurden von einem Hilfsmodell zusammengefasst und nur in Auszügen zitiert. Die fr/it-Zitate stammen direkt aus den Textdateien.

## Ergebnis: Begriff → fr / it / en

| Deutsch | Français | Italiano | English |
|---|---|---|---|
| Kündigungsfrist | délai de congé (Art. 266a, 266c CO) | termine di preavviso (Art. 266a, 269d CO) | notice period |
| Kündigungstermin | terme de congé (Art. 264, 266a CO) | scadenza di disdetta (Art. 266a, 269d CO), unverändert | termination date |
| Kündigung / gekündigt | résiliation / résilié, unverändert | disdetta / disdetto, unverändert | notice of termination / terminated by notice |
| Kündigung aufheben | ❓ muttersprachliche Person (heute «annuler la résiliation»; zu «annuler» siehe M-7) | ❓ muttersprachliche Person (heute «revocare la disdetta») | withdraw notice |
| Umlagefähig | ❓ muttersprachliche Person; nicht «imputable» (M-2); Fedlex-Verb «facturer au titre de frais accessoires» (Art. 6c al. 3 OBLF) | addebitabile (Fedlex-Verb «addebitare come spese accessorie», Art. 6b, 6c cpv. 3 OBLF); nicht «computabile» | allocable |
| Mahnung (Oberbegriff, 2. und 3. Stufe, Mahnstufe, Mahnfrist, Button, Brieftitel, zusammen) | ❓ muttersprachliche Person: «rappel» oder «sommation» (Fedlex «sommation» Art. 867 al. 3, 496 al. 1 CO) | ❓ muttersprachliche Person: «sollecito» oder «diffida» (Fedlex «diffida» Art. 867 cpv. 3, 496 cpv. 1 CO) | reminder / 2nd reminder |
| Zahlungserinnerung (1. Stufe) | rappel de paiement, unverändert, ausserhalb #83 | promemoria di pagamento, unverändert, ausserhalb #83 | payment reminder |
| Abrechnungslauf | ❓ muttersprachliche Person (heute «établissement des décomptes», Verb Art. 4 al. 1 OBLF) | ❓ muttersprachliche Person (heute «allestimento dei conteggi», Verb Art. 4 cpv. 1 OBLF) | statement run |
| Konfidenz | ❓ muttersprachliche Person (heute «fiabilité») | ❓ muttersprachliche Person (heute «affidabilità») | confidence |
