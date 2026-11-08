# Fach-Review #1200, Runde 1 (Commit 4e96d9d)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der geplante Tokenizer läuft in `parseFormula` und damit auch beim Berechnen gespeicherter Verteilschlüssel. Er darf nur Formeln ablehnen, die heute schon mit FORMULA_NOT_COMPUTABLE enden. Heute rechnen auch `%` als nachgestelltes Prozent sowie `+`/`-` als Vorzeichen; der Plan nennt `%` nicht und lehnt ein `+` am Anfang ab. |
| V-2 | Verwalter | Minor | Die Entwürfe für die Klammer- und Rechenzeichen-Texte sagen nur, was passiert ist, aber nicht, was zu tun ist. Das verletzt die Design-Regel «errors say what happened and what to do» (CLAUDE.md, Copy). Fix: die Texte unten übernehmen und die Zeilen in den drei @wip-Szenarien angleichen. |
| V-3 | Verwalter | Minor | «Summe einfügen» weicht vom Glossar ab (UBIQUITOUS_LANGUAGE.md:141: «Summen des Gebäudes») und lässt sich als Summenformel missverstehen. Fix: «Summe des Gebäudes einfügen», analog zu «Baustein einfügen». |
| V-4 | Verwalter | Minor | Die Regel für `part` («Token davor, fehlerhaftes Token, Token danach») ergibt bei `{area} * / {rooms}` nur «* / {rooms}», das Szenario erwartet aber «{area} * / {rooms}». Fix: Als fehlerhaftes Token gilt die ganze Folge von Rechenzeichen. Bei mehreren offenen «(» die letzte nicht geschlossene nehmen (kürzeste Stelle). `part` aus dem eingegebenen Text schneiden (Leerzeichen zusammengefasst, nicht kleingeschrieben), damit der Verwalter die Stelle im Feld wiederfindet. |
| V-5 | Verwalter | Minor | Für FORMULA_MISSING_OPERATOR `part` statt `left`/`right` verwenden, gleich wie bei den anderen vier Codes (ein Platzhalter, ein Text). |
| V-6 | Verwalter | Minor | Die Geschwistertexte `backend_category_name_taken` und `backend_heating_profile_name_taken` (messages/de.json:532, 534) bleiben ohne nächsten Schritt; so lauten drei gleich gebaute Ablehnungen verschieden. Fix: «Wählen Sie einen anderen Namen.» auch dort anhängen, oder dafür ein Issue eröffnen. |
| V-7 | Verwalter | Minor | Gab es schon vor dieser Änderung, ausserhalb des Umfangs: `getDistributionKeyByName` vergleicht mit `ilike(name, name)`, ohne `%` und `_` zu escapen (backend/src/services/distribution-key.service.ts:126). Ein Name wie «70% Fläche» trifft deshalb auch «70 Prozent Fläche», und die verbesserte Meldung lehnt einen freien Namen ab. Fix: Wildcards escapen oder `lower(name) = lower($1)` verwenden; als Issue (`bug`). |

## V-1 (Major)

**Belege:**
- backend/src/services/formula.service.ts:174-177: `evaluateFormula` ruft zuerst `parseFormula` auf. Das geschieht auch bei `calculateDistribution` für gespeicherte Schlüssel, nicht nur beim Speichern und beim Test.
- :125: Die Zeichenprüfung lässt `%` zu.
- :207: `replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)')` macht `%` zu einem nachgestellten Prozent. `{area} * 50%` rechnet heute.
- :148: Die Prüfung auf zwei Rechenzeichen kennt nur `+-*/`, also ist `50% * {area}` heute gültig.
- `+{area}` und `(-{area} + 200)` rechnet JavaScript ebenfalls (`new Function`, :210).

**Warum falsch:** Eine Prüfung, die solche Formeln neu ablehnt, sperrt Verteilschlüssel, die schon gespeichert sind. Zwei Fälle sind im Plan angelegt:
- Ein Tokenizer, der `%` als zweistelliges Rechenzeichen behandelt, meldet bei `50% * {area}` zwei Rechenzeichen hintereinander.
- FORMULA_MISSING_OPERAND «am Anfang (ausser Minus)» lehnt ein `+` am Anfang ab.

Danach lässt sich ein Entwurf mit einem solchen Schlüssel nicht mehr neu berechnen, und das Szenario dafür fehlt.

**Fix:**
- `%` wird ein nachgestelltes Zeichen eines Werts (Zahl, Baustein, «)»), kein Rechenzeichen.
- Ein Vorzeichen `+` oder `-` am Anfang und direkt nach «(» bleibt erlaubt.
- Ein Unit-Test hält fest, dass `{area} * 50%`, `50% * {area}`, `+{area}`, `(-{area} + 200)` und `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` weiterhin ohne Fehlercode durch `parseFormula` gehen.
- Die neuen Codes kommen nur für Eingaben, die auf der Basis mit FORMULA_NOT_COMPUTABLE enden (`{area} *`, `* {area}`, `()`, `{area} 2`).

## Wortlaut

Nachprüfung an den Szenarien:
- `0.7 * ({area} / {area_total} + 0.3`: die erste «(» bleibt offen, `part` = «({area} / {area_total} + 0.3».
- `({area}`: `part` = «({area}».
- `{area}) `: `part` = «{area})».
- `{area} * / {rooms}`: `part` = «{area} * / {rooms}», wenn V-4 umgesetzt ist.

Szenariozeilen damit:
- «Die Klammer am Anfang von «({area} / {area_total} + 0.3» wird nicht geschlossen. Setzen Sie «)» dort, wo sie enden soll.»
- «Bei «{area} * / {rooms}» folgen zwei Rechenzeichen direkt aufeinander. Löschen Sie eines oder setzen Sie eine Zahl oder einen Baustein dazwischen.»
- Name wie im Entwurf.

Hinweise zur Form:
- Die Texte enthalten keine wörtlichen geschweiften Klammern, also ist kein `\\{` nötig. `{part}` und `{name}` sind ICU-Platzhalter; ihr Wert darf `{area}` enthalten.
- Im Französischen steht innerhalb von « » und vor ; : ! ? ein U+00A0. Apostrophe sind U+2019 und nie ASCII `'`, das ICU als Escape liest.

| key | de | fr | it | en |
|---|---|---|---|---|
| backend_formula_unopened_parenthesis | Bei «{part}» schliesst die Formel eine Klammer, die nicht geöffnet wurde. Löschen Sie diese Klammer oder öffnen Sie sie weiter vorne mit «(». | Dans « {part} », la formule ferme une parenthèse qui n’a pas été ouverte. Supprimez cette parenthèse ou ouvrez-la plus tôt avec « ( ». | In «{part}» la formula chiude una parentesi che non è stata aperta. Cancelli questa parentesi o la apra prima con «(». | At «{part}» the formula closes a bracket that was not opened. Delete this bracket or open it earlier with «(». |
| backend_formula_unclosed_parenthesis | Die Klammer am Anfang von «{part}» wird nicht geschlossen. Setzen Sie «)» dort, wo sie enden soll. | La parenthèse au début de « {part} » n’est pas fermée. Placez « ) » là où elle doit se terminer. | La parentesi all’inizio di «{part}» non è chiusa. Inserisca «)» dove deve terminare. | The bracket at the start of «{part}» is not closed. Put «)» where it should end. |
| backend_formula_consecutive_operators | Bei «{part}» folgen zwei Rechenzeichen direkt aufeinander. Löschen Sie eines oder setzen Sie eine Zahl oder einen Baustein dazwischen. | Dans « {part} », deux opérateurs se suivent directement. Supprimez-en un ou placez un nombre ou un élément entre les deux. | In «{part}» due operatori si susseguono direttamente. Ne cancelli uno o inserisca tra i due un numero o un elemento. | At «{part}» two operators follow each other directly. Delete one or put a number or building block between them. |
| backend_formula_missing_operand | Bei «{part}» fehlt eine Zahl oder ein Baustein. Ergänzen Sie den fehlenden Wert oder löschen Sie, was dort zu viel steht. | Dans « {part} », il manque un nombre ou un élément. Complétez la valeur manquante ou supprimez ce qui est en trop. | In «{part}» manca un numero o un elemento. Completi il valore mancante o cancelli ciò che è di troppo. | At «{part}» a number or building block is missing. Add the missing value or delete what does not belong there. |
| backend_formula_missing_operator | Bei «{part}» fehlt ein Rechenzeichen zwischen zwei Werten. Setzen Sie +, -, * oder / dazwischen. | Dans « {part} », il manque un opérateur entre deux valeurs. Placez +, -, * ou / entre les deux. | In «{part}» manca un operatore tra due valori. Inserisca +, -, * o / tra i due. | At «{part}» an operator between two values is missing. Put +, -, * or / between them. |
| backend_distribution_key_name_taken | Ein Verteilschlüssel mit dem Namen «{name}» existiert bereits. Wählen Sie einen anderen Namen. | Une clé de répartition nommée « {name} » existe déjà. Choisissez un autre nom. | Esiste già una chiave di riparto con il nome «{name}». Scelga un altro nome. | A distribution key named «{name}» already exists. Choose another name. |
| keys_insert_total | Summe des Gebäudes einfügen | Insérer une somme de l’immeuble | Inserire una somma dell’immobile | Insert building total |

## Nicht bestätigt

- Ob gespeicherte Verteilschlüssel in der Demo- oder einer Produktionsdatenbank heute `%` oder ein Vorzeichen `+` enthalten: Ich habe nur den Code gelesen (formula.service.ts) und keine Datenbank abgefragt. V-1 gilt unabhängig davon.
- Der Wortlaut des Issues #1200 selbst: Gelesen habe ich nur die Zusammenfassung des Aufrufers, nicht GitHub.

Geprüft: Die Summen-Schaltflächen fügen wie die Bausteine an (Szenario 1). «» für die Stelle passt zu `backend_formula_invalid_characters` und `*_name_taken`. Das französische U+00A0 in bestehenden «»-Texten ist vorhanden (fr.json:533). «Rechenzeichen», «Baustein»/«élément»/«elemento»/«building block» und «Klammer»/«bracket» entsprechen dem Bestand und docs/design/i18n-begriffe.md:78. Der Name wird vor der Formel geprüft (distribution-key.service.ts:150-156); daher kommt der verdeckte Formelfehler. Das Vorhaben berührt keine Regel aus OR 257a/b und VMWG 4–8 (nur Eingabeprüfung, keine Verteilung). Darum ist kein Fedlex-Zitat nötig.
