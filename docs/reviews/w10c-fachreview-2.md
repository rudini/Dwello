# Fachreview W10c, Runde 2: Umsetzung «Vereinbarte Nebenkosten pro Mietvertrag» (#363, Entscheid #91)

Gegenstand: Worktree `review-w10c-fach2`, Commit a9bd54a, Änderung `git diff 3b3bd68 a9bd54a` in den genannten Dateien: `messages/{de,fr,it,en}.json` (Schlüssel `statements_agreement*`, `statements_agreements*`, `statements_not_agreed*`, `statements_finding_new`, `contracts_agreed_costs*`), `backend/src/services/{agreed-category,calculation,statement,statement-invoices,statement-pdf,pdf,contract}.service.ts`, `backend/migrations/0018_contract_categories.sql`, `src/routes/statements/generate/{AgreedCosts,AgreementQuestion}.svelte`, `src/routes/contracts/AgreedCategories.svelte`, `src/lib/server/statement-generation.ts`, `src/lib/contract-form.ts`, die drei Feature-Dateien.

Rechtsquellen: wie Runde 1 (Fedlex-Filestore, OR Fassung 1.10.2026, VMWG Fassung 1.10.2025, abgerufen am 17.10.2026; Wortlaut in `docs/reviews/w10c-fachreview-1.md`, Abschnitt «Gesetzestext»). Keine neue Norm nötig.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | PDF sagt «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: …», rechnet aber Positionen «Nicht kategorisiert» mit ab, die nicht in der Liste stehen (alter Befund M-3, durch die neue Zeile jetzt widersprüchlich) |
| M-2 | Mietrecht | Minor | «Vereinbart, wenn im unterschriebenen Mietvertrag» übergeht Nebenkosten, die mit dem amtlichen Formular eingeführt wurden; der Rat «Nicht vereinbart wählen» bleibt für alle späteren Perioden stehen |
| V-1 | Verwalter | Minor | «Mietvertrag bearbeiten» macht beim Speichern jede noch nicht beantwortete Kategorie zu «nicht vereinbart», auch wenn nur das Akonto geändert wurde; die Frage im Assistenten fällt dann weg |
| V-2 | Verwalter | Minor | it: «per il prossima scadenza di disdetta» (falsches Geschlecht), in zwei Texten |
| V-3 | Verwalter | Minor | fr/it: Frage «« {category} » est-elle convenue» / ««{category}» è pattuita» passt nicht zu männlichen Kategorienamen (Ascenseur, Ascensore) |
| V-4 | Verwalter | Nit | fr «Décochez chacune qui …», it «Tolga la selezione da ognuna che …» unidiomatisch |
| V-5 | Verwalter | Nit | en «rental contracts that agree them» / «agree the utility costs»: kein idiomatisches Englisch |
| V-6 | Verwalter | Nit | fr: normales statt geschütztes Leerzeichen vor «:», «?», «»» in den neuen Texten (das PDF hat es richtig) |
| M-3 | Mietrecht | Nit | «Neue Nebenkosten führen Sie nur mit dem amtlichen Formular ein» gilt für die einseitige Einführung (Art. 269d Abs. 3 OR); **unsicher** für eine einvernehmliche Änderung |
| V-7 | Verwalter | Nit | Mieterwechsel in der Periode: kein Test, dass der Assistent auch beim ausgezogenen Mieter fragt und jede Antwort nur ihren Mietvertrag trifft |

Weiter offen aus Runde 1 (vom Aufrufer so entschieden, Schwere unverändert): V-4 Teil 2 (einmaliger Prüfhinweis für übernommene Listen, Minor), V-5 (Name von Schritt 3, Minor), M-3 (Rechnungen ohne Kategorie, Minor; jetzt Teil von M-1 oben), V-7 Punkt 2 (Hinweis, dass sich die Liste nach dem Entwurf geändert hat; Entscheid des Product Owners), V-7 Punkt 4 (Mietvertrag ohne vereinbarte Nebenkosten, siehe «Nicht bestätigt»), V-11 (Änderungen unten).

## Bestätigt

- **Ausschluss in der Berechnung** (`calculation.service.ts:317–320`): nur vereinbarte Gruppen, Heizanteil (`heatingOfRun`, Z. 330) erst danach, also V-3 behoben; Tankbestand nur bei vereinbarter Kategorie (`statement.service.ts` `agreedStock`). Rechtsgrund Art. 257a Abs. 2 OR («nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat»).
- **Unbeantwortet = nicht abgerechnet** (`agreedCategoryIds` nur `agreed = true` und umlagefähig) und der Assistent sperrt «Weiter», bis jede offene Frage gespeichert ist (`AgreedCosts.svelte` `blocking`, auch beim Ladefehler): rechtlich die sichere Seite.
- **Wann gefragt wird** (`agreementsInPeriod`): Summe ≠ 0 über Rechnungen, deren abgerechnete Tage Mietstage des Mietvertrags enthalten. V-15 behoben (Gutschrift fragt, sich aufhebende Beträge fragen nicht).
- **Nachgerechnet**, Fläche 50/150 m², ganzes Jahr 2024 (366 Tage), 0 %:
  - Heizung 1000, Lift 400, Lift bei Anna nicht vereinbart: Anna 250.00, Beat 750 + 300 = 1050.00 (Szenario Z. 26–27).
  - + Treppenhausreinigung 200, Anna ja, Beat nein: Anna 250 + 100 + 50 = 400.00, Beat 1050.00; Beats 150 trägt der Vermieter (Z. 54–55).
  - Randfall Mieterwechsel: Anna bis 30.06. (182 Tage), Clara ab 01.07. (184 Tage), Treppenhausreinigung nur bei Clara vereinbart: Clara 50 × 184/366 = 25.14, Anna 0 (statt 24.86, trägt der Vermieter), Beat bei Vereinbarung 150.00. Die Berechnung liest die Liste pro `contractId`, also stimmt das durch die Bauart (Test fehlt: V-7).
  - Randfall Verwaltungspauschale 3 %: Anna ohne Lift 250 × 3 % = 7.50, nicht 350 × 3 % = 10.50 (Grundlage: eigene Nebenkosten, Regel 9).
  - Randfall Gutschrift: Treppenhausreinigung +200 und −200 in der Periode: Summe 0, keine Frage; −50 allein: Frage, und bei «Vereinbart» bekommt Anna −12.50 (Rückerstattung zu ihren Gunsten), bei «Nicht vereinbart» behält der Vermieter die Gutschrift. Beides nachvollziehbar.
- **Gespeicherte Abrechnungen** behalten ihre Liste (`agreed_category_ids`), «Rechnung geändert» und «fehlt in» prüfen gegen diese Liste (`statement-invoices.service.ts` `agreedIn`, `stateIn`): V-2 behoben; vor #91 erstellte (`null`) wie bisher.
- **Migration 0018**: Mietverträge mit Abrechnungen vereinbaren die abgerechneten noch umlagefähigen Kategorien und die umlagefähigen Rechnungen ihrer Laufzeit bis zur letzten Abrechnung (V-4 Punkt 1 umgesetzt); ohne Abrechnung alle umlagefähigen (wie ein neuer Mietvertrag, kein Betrag ändert sich); Kategorien ohne Kosten und neue Kategorien danach bleiben unbeantwortet und werden nachgefragt (Entscheid 3). Schlüssel und Cascade wie V-9 empfohlen. Die Überlappungsbedingung entspricht `getInvoicesForStatement` (Rechnungsdatum oder Leistungszeitraum).
- **PDF-Zeile** nur bei Abrechnungen seit #91, nur Kategorien mit Position, Namen wie in der Kostentabelle in der Sprache des Mieters (M-2 aus Runde 1 umgesetzt, V-9 so beantwortet); im Abschnitt «Hinweise» passt sie zur Praxis. Einschränkung: M-1 oben.
- **Deutsche Texte**: Frage mit Wohnung, Hinweis «Nicht vereinbarte Nebenkosten», Eintrag, Hilfe beim neuen Mietvertrag und beim Bearbeiten wie in Runde 1 vorgeschlagen (V-6, V-12). Der Fehler «Bitte wählen Sie, ob …» folgt der Form der übrigen Pflichtwahlen im Assistenten (`statements_error_period_start`, `statements_error_heating_profile`, `contracts_error_fee_choice`): Punkt aus Runde 1 erledigt.
- **`statements_finding_new`** in allen vier Sprachen gegen Art. 269d Abs. 1–3 OR: «auf den nächstmöglichen Kündigungstermin», «mindestens zehn Tage vor Beginn der Kündigungsfrist», «amtlich genehmigtes Formular», «begründen», «nichtig» (Abs. 2 lit. a, b). Inhalt stimmt.
- **Begriffe** nach `docs/design/i18n-begriffe.md`: Mietvertrag (contrat de bail / contratto di locazione / rental contract, Z. 27), Kündigungstermin (terme de congé / scadenza di disdetta / termination date, Z. 31), Kündigungsfrist (délai de congé / termine di preavviso / notice period, Z. 32), umlagefähig (imputable / addebitabile / allocable, Z. 47), Nebenkosten (Z. 56), Abrechnungsperiode (Z. 60), Kategorie (Z. 49): überall richtig verwendet. «vereinbart» = convenus / pattuite / agreed wie bei der Verwaltungspauschale. `UBIQUITOUS_LANGUAGE.md` ist unverändert; «Vereinbarte Nebenkosten» trägt `TODO(fachlich prüfen, #369)` in `AgreedCosts.svelte`, `AgreedCategories.svelte`, `pdf.service.ts`.

## Befunde

### M-1 (Major): PDF behauptet «nur vereinbarte», rechnet aber «Nicht kategorisiert» ab

**Beleg.** `calculation.service.ts:319`: `filter((group) => !group.categoryId || agreed.includes(group.categoryId))`, also bleibt eine umlagefähige Rechnung ohne Kategorie in der Abrechnung; Name «Nicht kategorisiert» (`calculation.service.ts:107`). `getInvoicesForStatement` (`invoice.service.ts:526–538`) prüft die Kategorie nicht, und vor dem Lauf sperrt nichts (`invoice-completeness.service.ts:268` nennt sie nur bei fehlendem Leistungszeitraum). `statement-pdf.service.ts:138–140` nimmt in `agreedCosts` nur Positionen mit Namen (`?? []`), `pdf.service.ts:107`: «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: {categories}.»

**Warum falsch.** Beispiel: Heizung 1000 und eine Rechnung 120 ohne Kategorie. Annas PDF zeigt die Positionen «Heizung» und «Nicht kategorisiert» (30.00) und darunter «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Heizung.» Der Satz ist falsch, und zwar auf dem Dokument an den Mieter. Nach Art. 257a Abs. 2 OR schuldet der Mieter die 30.00 nur mit besonderer Vereinbarung, die Dwello hier nicht prüfen kann. Vorher war das ein stiller Mangel (Runde 1 M-3, Minor, «schon vorher so»). Die neue Zeile macht ihn widersprüchlich. Darum gilt die Ausnahme «existed before» aus CLAUDE.md («Done means») nicht mehr.

**Behebung.** Eine dieser Lösungen, die kleinste zuerst:
1. Die Zeile nur drucken, wenn jede Position eine Kategorie hat. Das ist der kleinste Eingriff, M-3 bleibt dann als Issue offen.
2. Besser: Eine umlagefähige Rechnung ohne Kategorie in der Periode sperrt den Lauf oder fehlt in der Abrechnung, mit einem Hinweis in Schritt 4 («Ordnen Sie diese Rechnungen einer Kategorie zu: Dwello rechnet nur vereinbarte Nebenkosten ab.»).

Test: pg-Test oder PDF-Render-Test mit einer Position ohne Kategorie. Danach enthält das PDF den Satz nicht (Lösung 1), oder es entsteht keine Position «Nicht kategorisiert» (Lösung 2). M-3 bekommt ein Issue (`fachlich`), falls es noch keins gibt (offene Issues konnte ich nicht durchsuchen, siehe unten).

### M-2 (Minor): Mit dem Formular eingeführte Nebenkosten, und der Rat «Nicht vereinbart»

**Beleg.** `messages/de.json:728` `statements_agreements_text`: «Vereinbart ist eine Kategorie, wenn sie im unterschriebenen Mietvertrag steht. … Gilt eine Vereinbarung erst ab einem Datum in dieser Periode, etwa weil Sie diese Nebenkosten mit dem amtlichen Formular neu eingeführt haben, …: Wählen Sie dann «Nicht vereinbart» und rechnen Sie den Rest selbst ab.» `:740` `statements_not_agreed_text`: «Steht eine davon im unterschriebenen Mietvertrag, tragen Sie sie dort nach.» Die Antwort ist dauerhaft (`answerAgreement`, Upsert). Art. 269d Abs. 3 OR: Abs. 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, «neue Nebenkosten einzuführen».

**Warum falsch.** Eine wirksam mit dem Formular eingeführte Nebenkostenart ist danach geschuldet, steht aber nicht im unterschriebenen Mietvertrag. Der Liegenschaftsverwalter folgt dem Rat und wählt «Nicht vereinbart». In der nächsten Periode, für die die Kosten das ganze Jahr geschuldet sind, fragt Dwello nicht mehr nach. Der Hinweis schickt ihn dann zum «unterschriebenen Mietvertrag», wo die Kategorie nicht steht. Der Vermieter trägt die Kosten so dauerhaft selbst. Rechtlich ist das die sichere Seite, praktisch ein stiller Verlust.

**Behebung (Wortlaut).**
- `statements_agreements_text`, zweiter Satz: «Vereinbart ist eine Kategorie, wenn sie im unterschriebenen Mietvertrag steht oder Sie sie mit dem amtlichen Formular wirksam eingeführt haben.» Letzter Satz: «… Wählen Sie dann «Nicht vereinbart», rechnen Sie den Rest selbst ab und kreuzen Sie die Kategorie danach beim Mietvertrag an, damit Dwello sie ab der nächsten Abrechnungsperiode abrechnet.»
- `statements_not_agreed_text`, letzter Satz: «Steht eine davon im unterschriebenen Mietvertrag oder haben Sie sie mit dem amtlichen Formular eingeführt, kreuzen Sie sie beim Mietvertrag an.»
- `contracts_agreed_costs_help` und `_help_edit`: «… bei jeder, die weder im unterschriebenen Mietvertrag steht noch mit dem amtlichen Formular eingeführt ist.»
- fr: «… ou que vous avez introduite valablement avec la formule officielle»; it: «… o che ha introdotto validamente con il modulo ufficiale»; en: «… or that you have validly introduced on the official form».

Die Szenarien prüfen diese Texte nicht wörtlich (`statement-agreed-costs.feature` Z. 43, 87, 97 betreffen andere Schlüssel), also ist kein Szenario anzupassen.

### V-1 (Minor): Bearbeiten macht Unbeantwortetes zu «nicht vereinbart»

**Beleg.**
- `src/lib/contract-form.ts:80` lädt `agreedCategoryIds` (nur `agreed = true`).
- `AgreedCategories.svelte` `isAgreed`: Eine Kategorie ohne Zeile ist leer angezeigt.
- `contract-form.ts:140` sendet die Liste immer mit.
- `agreed-category.service.ts` `setAgreedCategories` schreibt für jede umlagefähige Kategorie ausserhalb der Liste `agreed = false`.

**Warum falsch.** Ein Beispiel: Ein Gebäude hat 2025 erstmals «Lift», der Mietvertrag von Anna hat keine Zeile dafür, der Assistent würde nachfragen (Entscheid 3). Der Liegenschaftsverwalter öffnet «Mietvertrag bearbeiten», nur um das Akonto anzupassen, und speichert. Jetzt ist «Lift» «nicht vereinbart», ohne dass er die Frage je beantwortet hat. Der Assistent fragt nicht mehr und nennt den Lift nur noch im Hinweis «Nicht vereinbarte Nebenkosten». Dasselbe trifft nach der Migration jede umlagefähige Kategorie, die ein Mietvertrag mit Abrechnungen nie abgerechnet hat. Der Hilfetext erklärt die leeren Kästchen zwar. Die ausdrückliche Nachfrage, die #91 als Schutz vorsieht, geht so aber still verloren.

**Behebung.** Beim Bearbeiten nur Kategorien schreiben, deren Kästchen der Liegenschaftsverwalter geändert hat, oder die schon eine Zeile haben. Unberührte ohne Zeile bleiben unbeantwortet. Alternativ den Zustand sichtbar machen («Noch nicht angegeben» neben dem Kästchen). pg-Test: Mietvertrag ohne Zeile für eine umlagefähige Kategorie, Update nur mit `monthlyAdvancePayment` und unveränderter Liste, danach bleibt `agreementsInPeriod` für diese Kategorie `null`.

### V-2 (Minor): it «per il prossima scadenza di disdetta»

**Beleg.** `messages/it.json:723` (`contracts_agreed_costs_help_edit`) und `:1009` (`statements_finding_new`). «scadenza» ist weiblich. **Behebung:** «per la prossima scadenza di disdetta» an beiden Stellen. Das ist entstanden, als «termine» durch «scadenza» ersetzt wurde. Prüfen Sie auch die übrigen Schlüssel, die diese Ersetzung bekommen haben (`grep -n "il prossima" messages/it.json`).

### V-3 (Minor): fr/it Frage mit männlichen Kategorienamen

**Beleg.** `messages/fr.json:733` «« {category} » est-elle convenue dans le contrat de bail de {tenant} … ?», `it.json:733` ««{category}» è pattuita …». Mit «Ascenseur» / «Ascensore», «Chauffage» / «Riscaldamento» steht das Partizip im falschen Geschlecht. **Behebung:**
- fr: «La catégorie « {category} » est-elle convenue dans le contrat de bail de {tenant} (appartement {apartment}) ?»
- it: «La categoria «{category}» è pattuita nel contratto di locazione di {tenant} (appartamento {apartment})?»

Die Knöpfe «Convenue» / «Pattuita» passen dann.

### V-4 (Nit): fr/it Hilfe beim Mietvertrag

**Beleg.** `fr.json:722` «Décochez chacune qui ne figure pas …», `it.json:722` «Tolga la selezione da ognuna che non figura …». **Behebung:** «Décochez chaque catégorie qui ne figure pas dans le contrat de bail signé.» / «Tolga la selezione da ogni categoria che non figura nel contratto di locazione firmato.»

### V-5 (Nit): en «agree»

**Beleg.**
- `en.json:729`: «whether the rental contracts agree the utility costs of this period»
- `:731`: «agree all utility costs»
- `:1009`: «rental contracts that agree them»

**Behebung:** «include»: «whether the rental contracts include the utility costs of this period», «include all utility costs», «rental contracts that include them».

### V-6 (Nit): fr geschütztes Leerzeichen

**Beleg.** Die neuen fr-Schlüssel (Z. 722–741, 1009) haben ein normales Leerzeichen vor «:», «?» und «»», `pdf.service.ts:185` hat U+00A0. Bei 390 px kann «?» allein auf eine Zeile rutschen. Die Datei ist gemischt (188 mit, 161 ohne), und `i18n-begriffe.md` regelt es nicht. Darum nur Nit. **Behebung:** U+00A0 in den neuen Schlüsseln.

### M-3 (Nit, unsicher): «nur mit dem amtlichen Formular»

**Beleg.** `de.json:723` «Neue Nebenkosten führen Sie nur mit dem amtlichen Formular ein …»; Art. 269d Abs. 3 OR spricht von der Absicht, den Mietvertrag «einseitig» zu ändern. Ob eine einvernehmliche schriftliche Vertragsänderung ohne Formular genügt, regelt der Normtext nicht (**unsicher**; Rechtsprechung nicht geprüft). Für Laien ist der Satz auf der sicheren Seite. **Behebung (optional):** «Neue Nebenkosten führen Sie ohne Zustimmung des Mieters nur mit dem amtlichen Formular ein …». Sonst so lassen.

### V-7 (Nit): Mieterwechsel ohne Test

**Beleg.** `agreed-categories.pg.test.ts` hat keinen Fall mit zwei Mietverträgen derselben Wohnung in der Periode. `contractAgreements` (`statement-generation.ts:97`) fragt pro Mietvertrag aus `contractsInPeriod`. **Behebung:** ein pg-Test mit den Zahlen oben (Clara 25.14, Anna ohne Position), damit die Regel «die Antwort gilt je Mietvertrag» belegt ist und nicht nur aus dem Aufbau folgt.

## V-11: Änderungen in `docs/nebenkostenabrechnung-anforderungen.md`

Zeilennummern im Worktree (a9bd54a).

**Z. 26, letzte Spalte.** Ersetze
> Dwello sollte Kategorien pro Vertrag als «vereinbart» führen und nicht vereinbarte Kategorien nicht auf dem PDF dieses Mieters ausweisen (oder den Export blockieren).

durch
> Umgesetzt (#91, Regel 12): Jeder Mietvertrag hält pro umlagefähiger Kategorie fest, ob sie vereinbart ist; nicht vereinbarte und noch nicht beantwortete Kategorien rechnet Dwello diesem Mieter nicht ab, den Anteil seiner Wohnung trägt der Vermieter.

**Z. 101, letzte Spalte.** Ersetze
> Vor dem Erstellen: Kategorie nicht im Vertrag vereinbart → Fehler (setzt vereinbarte Kategorien pro Mietvertrag voraus, in Dwello noch nicht vorhanden; TODO fachlich prüfen). Vorjahresvergleich: neue Kategorie → Warnung.

durch
> Umgesetzt (#91, Regel 12): Hat eine Kategorie in der Abrechnungsperiode Kosten und ist beim Mietvertrag nicht angegeben, ob sie vereinbart ist, fragt der Schritt «Einstellungen» nach und geht ohne Antwort nicht weiter; nicht vereinbarte nennt er mit einem Link zum Mietvertrag. Vorjahresvergleich: neue Kategorie → Hinweis «Neu» mit Verweis auf die Mietverträge und Art. 269d Abs. 3 OR. Offen: Rechnungen ohne Kategorie werden ohne Prüfung der Vereinbarung abgerechnet (Fachreview W10c M-3, Runde 2 M-1).

**Z. 120 (PDF, Punkt 7 «Hinweise»).** Nach «Hinweise**: » einfügen:
> die im Mietvertrag vereinbarten Nebenkosten, die die Abrechnung abrechnet (#91; nur Abrechnungen seit #91),

**Z. 135 (Begriffe).** Ersetze «Belegliste, vereinbarte Nebenkosten pro Vertrag, VHKA» durch «Belegliste, vereinbarte Nebenkosten (#369), VHKA».

**Nach Z. 151 (neue Regel 12 in «Regeln in Dwello»):**
> 12. **Vereinbarte Nebenkosten.** Der Mieter bezahlt nur die Nebenkosten, die sein Mietvertrag vereinbart (#91; Art. 257a Abs. 2 OR). Der Mietvertrag hält pro umlagefähiger Kategorie fest: vereinbart, nicht vereinbart oder noch nicht angegeben. Ein neuer Mietvertrag beginnt mit allen umlagefähigen Kategorien angekreuzt; was nicht im unterschriebenen Mietvertrag steht, entfernt der Vermieter. Hat eine Kategorie ohne Angabe in der Abrechnungsperiode Kosten in Tagen, die der Mietvertrag mietet (Summe nicht 0, auch eine Gutschrift), fragt der Schritt «Einstellungen» nach und speichert die Antwort beim Mietvertrag. Abgerechnet werden nur vereinbarte Kategorien; den Anteil der Wohnung an den übrigen trägt der Vermieter (wie beim Leerstand, Regel 4), und die Verwaltungspauschale rechnet mit den eigenen Nebenkosten danach (Regel 9). Sind die Heizkosten nicht vereinbart, zeigt das PDF weder Heizprofil noch Tankbestand. Jede Abrechnung hält beim Erstellen fest, welche Kategorien vereinbart waren (`agreed_category_ids`); eine spätere Änderung am Mietvertrag ändert sie nicht, und Rechnungen nicht vereinbarter Kategorien gelten ihr nicht als fehlend oder geändert. Das PDF nennt unter «Hinweise» die vereinbarten Kategorien, die es abrechnet. Bestehende Mietverträge (Migration 0018): mit Abrechnungen vereinbart, was sie abgerechnet haben und was bis zur letzten Abrechnung hätte abgerechnet werden können; ohne Abrechnung alle umlagefähigen Kategorien. Offen: Vereinbarung ab einem Datum und Folgevertrag (#368), Begriff (#369), Rechnungen ohne Kategorie (Fachreview W10c M-3).

**Optional Z. 155 (Unsicherheiten, Punkt 1).** Anhängen: «Art. 257a, 257b, 269d OR und Art. 4, 5 Abs. 2, 7 Abs. 1 VMWG sind seit der Fachreview W10c (17.10.2026) auf Fedlex im Wortlaut geprüft (`docs/reviews/w10c-fachreview-1.md`).»

Z. 116 («je vereinbarter Kategorie») und Z. 80 (Art. 269d OR) stimmen und bleiben.

## Fehlende Begriffe

Keine neuen. «Vereinbarte Nebenkosten» und «Nicht vereinbart» sind in #369 (fachlich, entscheiden), mit den Vorschlägen aus Runde 1.

## Nicht bestätigt

- **Offene Issues zu M-3 / M-1** (Rechnungen ohne Kategorie): Ich konnte die Issues nicht durchsuchen. Die GitHub-Suche liefert in dieser Sitzung 403, weil nur Endpunkte des Repositorys erlaubt sind. Bitte vor dem Anlegen mit `search_issues` prüfen.
- **Mietvertrag ohne vereinbarte Nebenkosten** (Runde 1 V-7 Punkt 4): Den Fall habe ich nicht im Code verfolgt. Nach der Berechnung entsteht vermutlich eine Abrechnung ohne Position, deren Saldo die ganzen Akontobeiträge zurückerstattet. Nach Art. 257a Abs. 2 OR ist das im Ergebnis richtig (ohne Vereinbarung kein Rechtsgrund für Akonto). Ob der Lauf dann eine Abrechnung erstellen soll, ist weiter Sache des Product Owners. Pauschale Nebenkosten (Art. 4 Abs. 2 VMWG) kennt Dwello nach meinem Stand nicht, nicht geprüft.
- **Einvernehmliche Einführung neuer Nebenkosten ohne Formular** (M-3): keine Rechtsprechung geprüft.
- **BGE 135 III 591** (Sammelklausel, Hilfetext «übrige Nebenkosten genügt nicht»): wie in Runde 1 nur die Regeste, nicht die Erwägungen.
- **Bildschirme und Sprachen** (`tests/a11y/screens.json`, `sprachen-bildschirme.feature`) für Frage, Ladefehler, «Gespeichert», Hinweis und Feldgruppe: nicht geprüft. Das ist eine Aufgabe für `code-reviewer` und die Personas.
- **PDF in fr/it/en** gerendert: nur den Quelltext der Zeile gelesen (`pdf.service.ts:107/185/263/341`), kein PDF erzeugt (Backend-Tests und E2E waren nicht erlaubt).
- **Migrationstest** (`migrations.pg.test.ts`): nur den Testnamen gesehen, nicht ausgeführt. Ob er den Fall «Rechnung nach der letzten Abrechnung bleibt unbeantwortet» abdeckt, nicht geprüft.
