# Fachreview #209, Runde 2: gespeicherter Anteil nach dem Heizprofil (Umsetzung)

Gegenstand: `git diff f106ec6b 6e569c26` im Worktree `review-209-fach2` (Commit 6e569c26): Migration `0004_statement_heating_share.sql`, `HeatingShare` (`backend/src/db/schema.ts:319–327`), `heatingOfRun` (`backend/src/services/calculation.service.ts:403–421`), Speichern (`statement.service.ts:334`), PDF (`statement-pdf.service.ts:133–136`), Szenario `statement-detail.feature:220–244`, pg-Tests `statement-pdf.pg.test.ts:239–341`, `docs/data-model.md`, `docs/api-specification.md`. Vorbericht: `docs/reviews/issue-209-fachreview-1.md`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Nit | `docs/data-model.md` nennt als leere Fälle nur «without a heating profile and for statements created before». Es fehlt «ohne Heizkosten-Position» (so in `heatingOfRun` und in `docs/api-specification.md`). |
| V-2 | Verwalter | Nit | Der pg-Test «rechnet bei einer früher erstellten Abrechnung mit dem Heizprofil, wie es jetzt ist» schreibt den Rest von F-3 als erwartetes Verhalten fest (Hinweis 40 %, Position 50 % / CHF 500.00), nennt aber #229 nicht. |

Kein Blocker und kein Major offen.

## Prüfung der Fixes aus Runde 1

- **F-1 (Major): behoben.** `HeatingShare.names` speichert `name`, `nameDE` … `nameEN` beim Erstellen (`calculation.service.ts:418–420`). Das PDF liest bei gespeichertem Wert nur diese Namen, `localName(stored.names, language)` (`statement-pdf.service.ts:136`), auch wenn `heating_profile_id` durch `ON DELETE SET NULL` leer ist. Weil `run.heating` gesetzt ist, ist `byProfile` wahr (`statement-pdf.service.ts:120`). Damit erscheint der Prozentsatz nicht mehr als «Zeitanteil: Ihre Mietstage». Belegt durch den pg-Test «nennt das Heizprofil auch nach dem Umbenennen und Löschen …» (`statement-pdf.pg.test.ts:296–316`), der den ursprünglichen Namen und «50.00 % der Heizkosten» prüft.
- **F-2 (Major): behoben.** `{ byDays: true }` wird gespeichert, wenn `handleMidYearMoves` nach Tagen teilt (Mietvertrag über die ganze Periode, `prorating.service.ts:209`, oder die Monate der Periode haben zusammen 0 %, `:214`). Das gilt auch, wenn das Profil beim Erstellen fehlt (`calculation.service.ts:413`, wie `prorating.service.ts:200`). `null` heisst jetzt nur noch «ohne Profil», «ohne Heizkosten» oder «vor der Migration». In allen drei Fällen ist das Verhalten wie bisher. Der Entscheid in `heatingOfRun` und der in der Schleife pro Position (`calculation.service.ts:320–340`) kommen aus derselben Funktion mit denselben Daten. Nur `totalHeatingCosts` ist verschieden (100 gegenüber dem Wohnungsanteil), und das skaliert nur den Betrag. Gespeicherter Anteil und Positionsbetrag passen also zusammen. Belegt durch den pg-Test «bleibt bei den Mietstagen …» (`:318–341`).
- **F-4 (Minor): behoben.** Das Szenario prüft «43.00 % 430.00» (Zeitanteil-Spalte und Betrag der Position, Format wie im pg-Test `1'000.00 1'000.00 50.00 % 500.00`). F-1 und F-2 sind auf der pg-Ebene gezeigt.
- **F-5 (Minor), Titel: behoben.** Der Szenariotitel verwendet keinen neuen Begriff mehr. Die Begriffe stehen in #75 (offen, Label `fachlich`): Der Kommentar zu #209 schlägt «Monatsanteil» und «Anteil nach Heizprofil» vor, «Zeitanteil» steht schon im Text von #75.
- **F-3, F-6, F-7 -> #229**: Das Issue ist offen, Label `fachlich`, und beschreibt alle drei mit «Done means». **F-8 -> #230**: offen, Labels `entscheiden`, `produkt`. Das Weiterreichen ist bestätigt.
- Zu F-6: Runde 1 hatte vorgeschlagen, `periodPercent` schon jetzt mitzuspeichern. Das ist nicht umgesetzt. Kein Befund, weil sich die Summe der Periode aus den gespeicherten Werten zurückrechnen lässt: Summe der Periode = Summe(`months`) / `percent` × 100. Wegen der Monate auf 2 Stellen ist das Ergebnis leicht ungenau. #229 sollte das beim Umsetzen entscheiden.

## Nachrechnung

Formel (`prorating.service.ts:212–216`): Anteil = Summe der Monatsanteile der Mietzeit / Summe der Monatsanteile der Periode × 100. Bei 0 % in der Periode oder einem Mietvertrag über die ganze Periode wird nach Tagen geteilt.

1. **Szenario** (Eva Frei, 01.01.–31.03.2024, Profil «Winter» beim Erstellen): 18 + 14 + 11 = 43, Periode 100, also **43.00 %**. CHF 1'000 × 100 % Wohnungsanteil (nur Wohnung 3.01) × 43 % = **CHF 430.00**. Mit dem geänderten Profil wären es 30 + 20 + 10 = 60 %, also CHF 600.00. Die Erwartungen «43.00 % der Heizkosten», «Jan 18.00 %, Feb 14.00 %, Mär 11.00 %» und «43.00 % 430.00» sind bestätigt. Sie stimmen mit dem Szenariogrundriss «Eva Frei | 43 | CHF 430.00» (`statement-detail.feature:33–40`) überein. Das geänderte Profil ergibt zusammen 100 % (30+20+10+5+2+0+0+0+2+6+10+15), ist also nach Regel 6 gültig.
2. **pg-Test 1** (Einzug 01.07.2025, Periode 2025, Profil 10,10,10,10,10,0,0,0,0,10,20,20 = 100): Juli bis Dezember 0+0+0+10+20+20 = **50 %**, CHF 1'000 × 70/70 m² × 50 % = **CHF 500.00**. Nach der Änderung (20,10,10,10,10,0,0,0,0,30,5,5 = 100) wären es 30+5+5 = **40 %**. Die Erwartungen «50.00 % 500.00», «Okt 10.00 %, Nov 20.00 %, Dez 20.00 %» und für den Altbestand «40.00 %» sind bestätigt.
3. **Grenzfall 0 %** (pg-Test 4: Periode 01.06.–31.08.2025, Einzug 01.07., Profil Juni bis August 0 %): Die Summe der Periode ist 0, also wird nach Tagen geteilt. Juli 31 + August 31 = 62 von Juni 30 + 62 = 92 Tagen, also **62/92 Tage**. Nach der Änderung (Juli 5 %) ergäbe die Neuberechnung 5/5 = 100 % nach Profil. Gespeichert ist aber `{ byDays: true }`, das PDF zeigt also weiter «62/92 Tage» und keinen Heizprofil-Hinweis. Das entspricht Regel 5 («die Abrechnung zeigt die Mietstage und keinen Heizprofil-Hinweis», `docs/nebenkostenabrechnung-anforderungen.md:145`). Bestätigt.
4. **Rundung**: `percent` wird ungerundet gespeichert und auf 2 Stellen gedruckt (`pdf.service.ts:644`). `period_share` hat 4 Stellen als Bruch (`calculation.service.ts:352`), das sind ebenfalls 2 Stellen in Prozent. Hinweis und Spalte zeigen also dieselbe Zahl. Beispiel Teilmonat (Einzug 15.01.): 18 × 17/31 + 14 + 11 = 34.8710, also 34.87 % in beiden.

## Befunde

### V-1 (Nit): leere Fälle in `docs/data-model.md`

- **Beleg.** `docs/data-model.md` (neuer Absatz nach den Indizes): «Empty without a heating profile and for statements created before». `calculation.service.ts:411` liefert `null` auch, wenn keine Position eine Heizkosten-Position ist. `docs/api-specification.md` (Preview) nennt das richtig: «`null` without a profile or heating costs».
- **Lösung.** Im Datenmodell ergänzen: «Empty without a heating profile or heating costs, and for statements created before».

### V-2 (Nit): Test zum Altbestand ohne Verweis auf #229

- **Beleg.** `statement-pdf.pg.test.ts:279–294` erwartet «40.00 % der Heizkosten». Die Heizkosten-Position derselben Abrechnung lautet 50.00 % / CHF 500.00. Genau diese Abweichung ist F-3 und in #229 offen.
- **Lösung.** Im Kommentar über dem Test `#229` nennen, z. B. «bleibt so, bis #229 den gespeicherten `period_share` nimmt». Wer #229 umsetzt, findet dann den Test, der sich ändern muss (`grep -rn "#229"`).

## Bestätigt

- **Glossar**: Das Szenario und die neuen Schritte verwenden Liegenschaftsverwalter, Nebenkostenabrechnung, Heizprofil, Abrechnung und Mietstage (`UBIQUITOUS_LANGUAGE.md`). Neue Begriffe gibt es nicht. «Zeitanteil» erscheint nur in bestehenden PDF-Texten (#75).
- **Regel 5 und 6** (`docs/nebenkostenabrechnung-anforderungen.md:145–146`): Der Anteil nach Heizprofil gilt nur beim Ein- oder Auszug und wird bei 0 % in der Periode nach Tagen gerechnet. Ein eigenes Profil lässt sich ändern. Die Abrechnung behält den Stand ihrer Erstellung, wie `key_values` und `fuel_stock` (`docs/data-model.md`) und die gespeicherten Mietstage (`docs/anforderungen-vertragsende.md:85`).
- **Altbestand**: Abrechnungen ohne gespeicherten Wert rechnen wie vor dem Commit (`statement-pdf.service.ts:137–152`, unverändert). Bestätigt durch pg-Test 2. Der verbleibende Fehler steht in #229 (F-3).
- **VMWG Art. 8 Abs. 1** (Fedlex, SR 221.213.11, https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.» Der Hinweis hängt weiterhin an den Heizkosten-Positionen (`pdf.service.ts:687`) und nicht an `heating_share`. Nach dem Fix passt die gedruckte Aufteilung zu den Beträgen, mit denen gerechnet wurde.
- **OR Art. 257b Abs. 2** (Fedlex): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Die Änderung berührt das nicht. OR Art. 257a, VMWG Art. 4, 5 und 7 ebenso nicht (Wortlaut in Runde 1).
- **Sprachen**: Der gespeicherte Name wird mit `localName` in der Sprache des PDFs gewählt. Ein vordefiniertes Profil behält also in fr/it/en seinen Namen. Neue PDF-Texte gibt es nicht, deshalb auch keinen Bedarf für eine Persona Dr. Weber.

## Nicht bestätigt

- **Nachvollziehbarkeit als Rechtspflicht** (Profilname im PDF): Dafür gibt es weiterhin keinen Normtext auf Fedlex. Gesucht wurde in OR Art. 257a–257b und VMWG Art. 4–8. Die Pflicht ist **unsicher** und stützt sich auf die Praxis und auf `docs/nebenkostenabrechnung-anforderungen.md:39` (wie in Runde 1).
- **Ausführung**: Weder das Szenario noch die pg-Tests wurden ausgeführt, und das PDF in der laufenden App (localhost:3300) wurde nicht angesehen. Die Erwartungen sind nur nachgerechnet (siehe oben). Die Plan-Zeile mit den Checks ist noch offen (`implementation_plan.md`).
- **Was die Detailseite nach dem Umbenennen zeigt** (F-7): nicht erneut geprüft, liegt in #229.
- **Eine Kategorie, deren Kennzeichen «Heizkosten» später geändert wird**: `hasHeating` liest es beim Erstellen des PDFs aus der Kategorie, nicht aus der Abrechnung (`statement-pdf.service.ts:262`). Dann fehlt oder erscheint der gespeicherte Hinweis. Das ist schon vorher so und nicht Teil von #209. Ob eine Kategorie mit Abrechnungen ihr Kennzeichen ändern darf, wurde nicht geprüft.
