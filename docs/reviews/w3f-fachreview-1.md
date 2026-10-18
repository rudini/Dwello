# Fachreview W3f-1: #76 (befristeter Mietvertrag) und #119 (verschieden eingestellte Abrechnungen)

Gegenstand: Commit `c46a112`, `tests/e2e/features/statement-generate.feature`, die beiden `@wip`-Szenarien (Z. 173–184 und 386–396), dazu der geplante Umbau laut Auftrag. Worktree: `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/review-w3f-fach`.

Gesetzestext: OR (SR 220), Fassung vom 1.1.2026, Fedlex-Filestore `https://www.fedlex.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20260101/de/html/fedlex-data-admin-ch-eli-cc-27-317_321_377-20260101-de-html.html`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | Akonto-Hinweis beim befristeten Mietvertrag: Der geplante Ersatz der Kündigungstermin-Sätze streicht auch Formular, Begründung und Nichtigkeit (Art. 269d Abs. 2 und 3 OR) |
| V-1 | Verwalter | Major | #119: Die Einstellungen als Ausweg können bei einem Mieterwechsel ein drittes Heizprofil in dieselbe Wohnung bringen; die Anteile nach Heizprofil ergeben dann nicht 100 % |
| V-2 | Verwalter | Minor | Szenario #119 prüft nur, was nicht vorgeschlagen wird; ob das Standard-Heizprofil kommt, prüft es nicht; der Fall «verschiedene Verwaltungspauschale» fehlt |
| V-3 | Verwalter | Minor | Szenario #76 prüft nicht, dass der Hinweis des Gebäudes den Kündigungstermin-Satz für den unbefristeten Mietvertrag (Marc Huber) behält |
| V-4 | Verwalter | Minor | Hinweis auf neue Nebenkosten: Steht der beschlossene Satz am Ende, also hinter «senken Sie diese entsprechend», bezieht sich «eine Erhöhung» auf das Senken der Nettomiete |
| M-2 | Mietrecht | Minor | Was als «laufender» befristeter Mietvertrag gilt, ist nicht festgelegt (Stichtag heute oder Ende der Periode); gekündigte Mietverträge, deren Ende nach der Periode liegt, behalten den Kündigungstermin-Text (bestand schon vorher) |
| V-5 | Verwalter | Minor | #119: Eine Abrechnung ohne Heizprofil (`heating_profile_id` nullable, `onDelete: 'set null'`) ist für den Vergleich nicht geregelt |
| V-6 | Verwalter | Nit | Das Heizprofil «Sommer» hat in der Step-Definition dieselben Monatsanteile wie «Winter»; das Vertragsende 2035-12-31 macht das Szenario ab 2036 rot |

Bestätigt (keine Befunde):
- Der beschlossene Satz «Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor.» ist rechtlich nicht falsch (Belege bei M-1, Teil «Grundlage»). Ich schlage deshalb keine andere Formulierung vor.
- Die geplante Lesart für den Hinweis auf neue Nebenkosten des Gebäudes ist tragfähig: Der bisherige Text bleibt (mit dem Kündigungstermin für die unbefristeten Mietverträge) und der beschlossene Satz kommt dazu, sobald das Gebäude im Lauf einen laufenden befristeten Mietvertrag hat. Begründung: Der Hinweis gilt für das ganze Gebäude und damit für Mietverträge beider Arten. Art. 269d Abs. 3 OR verlangt Formular und Begründung auch für neue Nebenkosten, und dieser Teil bleibt so erhalten. Offen ist nur, wo der Satz steht (V-4).
- Schwellen F-10b bleiben (`src/lib/statement-wizard.ts:195–196`). Nachgerechnet für Lea Graf: Akonto 20 × 12 = CHF 240. Kaltwasser 2000 geht zur Hälfte an Wohnung 3.02 (gleiche Fläche, vgl. das bestehende Szenario Z. 89–99: «die Hälfte für die Wohnung»), also 1000. Mit 3 % Verwaltungspauschale sind es 1030. (1030 − 240) / 240 = 329 % > 15 %, der Hinweis erscheint. Randfall Kosten genau 276: (276 − 240) / 240 = 0.15, das ist nicht > 0.15, also kein Hinweis. Randfall Rückerstattung bei Kosten 150: −37.5 % < −30 % über die ganze Periode, also kommt «Fehlen Rechnungen?» und kein Hinweis zum Erhöhen. Randfall Akonto 0: `null` (Z. 214).
- Der Befund «neu» für Kaltwasser stimmt: Das Vorjahr hat eine Rechnung (Kaminfeger 2023), Kaltwasser hat dort keine. Das ergibt `kind: 'new'` (`backend/src/services/invoice-completeness.service.ts:140`).
- Die Begriffe in beiden Szenarien und im geplanten Text stehen im Glossar: Befristet/Unbefristet (Z. 38), Vertragsende (Z. 37), Kündigungstermin (Z. 39), Akonto (Z. 50), Heizprofil (Z. 132), Verwaltungspauschale (Z. 154, 217), Abrechnungsperiode (Z. 150), Einstellungen/Standard-Heizprofil (Z. 213–218). Der geplante Text zu #119 folgt den bestehenden Meldungen `statements_preset_*` (`messages/de.json:1525–1527`).

---

## M-1 (Major, Mietrecht): Formular, Begründung und Nichtigkeit fallen beim befristeten Mietvertrag weg

**Beleg.** Geplant ist: Für einen laufenden befristeten Mietvertrag lautet der Hinweis «Prüfen Sie, ob Sie das Akonto erhöhen.» plus der beschlossene Satz, *statt* der Kündigungstermin-Sätze. Heute lautet `statements_akonto_raise` (`messages/de.json:999`): «… Eine Erhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig.» Szenario Z. 183 verlangt nur `toContain`, hält also beide Lesarten offen.

Art. 269d OR (Fedlex):
- Abs. 1: «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.»
- Abs. 2: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; c. mit der Mitteilung die Kündigung androht oder ausspricht.»
- Abs. 3: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.»

Grundlage für den beschlossenen Satz: Art. 255 Abs. 2 OR: «Befristet ist das Mietverhältnis, wenn es ohne Kündigung mit Ablauf der vereinbarten Dauer endigen soll.» Art. 266 Abs. 1 OR: «… so endet das Mietverhältnis ohne Kündigung mit Ablauf dieser Dauer.» Abs. 2: «Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.» Die Ausnahmen, die ein Mietvertrag vorsehen kann: Art. 269b OR (Index, «nur gültig, wenn der Mietvertrag für mindestens fünf Jahre abgeschlossen …») und Art. 269c OR (Staffel, «mindestens drei Jahre»). Sekundärquelle (Obergericht ZH, Snippet über `mmx search`): «Während einer festen Vertragsdauer ist eine Mietzinserhöhung also grundsätzlich unzulässig. Eine Ausnahme gilt für indexierte und gestaffelte Mietzinse.»

**Warum falsch.** Der beschlossene Satz sagt, *wann* eine Erhöhung möglich ist, aber nicht *wie*. Zwei Fälle bleiben, in denen der Vermieter erhöht:
1. Der Mietvertrag sieht eine Erhöhung vor (der «ausser»-Fall).
2. Das Mietverhältnis läuft nach dem Vertragsende stillschweigend als unbefristetes weiter (Art. 266 Abs. 2).

In beiden Fällen bleibt eine Erhöhung des Akontos eine einseitige Änderung zu Lasten des Mieters. Dafür gelten Abs. 1 und 2 über Abs. 3. Fällt der Satz «Ohne Formular oder Begründung ist sie nichtig» weg, liest ein unerfahrener Vermieter mit Anpassungsklausel daraus, dass er das Akonto einfach brieflich erhöhen darf. Die Erhöhung wäre dann nichtig. Beim Hinweis auf neue Nebenkosten bleibt dieser Teil erhalten, weil dort ergänzt statt ersetzt wird. Die beiden Hinweise wären also uneinheitlich.

**Behebung.** Der Entscheid in #76 sagt, welchen Satz die Hinweise sagen, aber nicht, dass Formular und Nichtigkeit wegfallen. Nur die Frist «frühestens auf den nächsten Kündigungstermin … 10 Tage vor Beginn der Kündigungsfrist» passt nicht zum befristeten Vertrag. Vorschlag für den Text beim befristeten Mietvertrag. Der Zusatz ist ein neuer Text und braucht deshalb den Entscheid des Product Owners; der Aufrufer eröffnet ein Issue mit den Labels `fachlich` und `entscheiden`:

> «Prüfen Sie, ob Sie das Akonto erhöhen. Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.»

Lehnt der Product Owner das ab, gehört M-1 unter «Blocked on me».

## V-1 (Major, Verwalter): Das Heizprofil aus den Einstellungen passt bei einem Mieterwechsel nicht zur selben Wohnung

**Beleg.** Done means von #119: «the wizard keeps the settings' defaults». Typischer Fall nach A-10 (`docs/anforderungen-vertragsende.md:304–316`): Das Vertragsende ändert sich, der Entwurf des ausziehenden Mieters wird gelöscht und neu erstellt, und der Nachmieter derselben Wohnung hat seine Abrechnung schon. Im Grundlage-Teil sind das Eva Frei (3.01, Januar–März) und Marc Huber (3.01, ab Mai). Das Glossar (Z. 134, 160) definiert den Zeitanteil der Heizkosten beim Ein- und Auszug als Anteil nach Heizprofil. Art. 257b Abs. 1 OR: «… sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters …».

**Nachgerechnet** mit «Winter» aus der Step-Definition (`tests/e2e/steps/statement-generate.steps.ts:306`: 18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15):
- Beide mit «Winter»: Eva Januar–März 47 %, Marc Mai–Dezember 4+1+0+0+3+9+13+15 = 45 %, April leer 8 % (Vermieter). Zusammen 100 %, das stimmt.
- Eva neu mit einem Profil aus den Einstellungen, angenommen gleichmässig 8.33 % pro Monat: Eva 25 % + Marc 45 % = 70 %. Der Vermieter trägt 30 % statt 8 %.
- Umgekehrt (Marc mit gleichmässigem Profil, Eva mit «Winter»): 47 % + 66.67 % = 113.67 %. Die Mieter der Wohnung zahlen 13.67 Prozentpunkte mehr Heizkosten, als angefallen sind. Das widerspricht Art. 257b Abs. 1.

**Warum falsch.** Verschieden eingestellte Abrechnungen einer Periode sind schon ein Zeichen, dass etwas nicht stimmt. Kommt dann das Standard-Heizprofil, kann es zu keiner der bestehenden Abrechnungen passen und den Fehler in derselben Wohnung vergrössern. Heute wird die neueste Abrechnung genommen (`src/routes/statements/generate/+page.server.ts:49`, `others[0]`); sie trifft wenigstens eine bestehende Einstellung. Der geplante Text «Prüfen Sie sie …» meint nur die Einstellungen des Laufs und sagt nicht, worauf es ankommt.

**Behebung** (das Verhalten hat #119 festgelegt, deshalb braucht es einen Entscheid des Product Owners; Issue mit den Labels `fachlich` und `entscheiden`):
- Variante a: Das Heizprofil kommt aus den Abrechnungen *derselben Wohnung* in der Periode, wenn diese übereinstimmen; erst sonst aus den Einstellungen.
- Variante b (ohne Änderung am Verhalten): Der Text sagt, worauf der Vermieter achten muss. Vorschlag: «Die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode sind verschieden eingestellt. Heizprofil und Verwaltungspauschale kommen deshalb aus den Einstellungen. Wählen Sie bei einem Mieterwechsel das Heizprofil, mit dem die Abrechnung des Vor- oder Nachmieters derselben Wohnung erstellt ist. Prüfen Sie sie und gehen Sie weiter zur Vorschau.»

Bis zum Entscheid gehört V-1 unter «Blocked on me». Für die Verwaltungspauschale besteht dieses Problem nicht: Sie wird pro Mietvertrag gerechnet und verschiebt keine Anteile zwischen Mietern.

## V-2 (Minor): Szenario #119 prüft nur, was nicht vorgeschlagen wird

**Beleg.** Z. 395–396 prüfen nur «… "Winter" nicht vor» und «… "Sommer" nicht vor». Das Szenario wäre auch grün, wenn gar kein Heizprofil vorgeschlagen würde, zum Beispiel weil `default_heating_profile_id` leer ist. Done means #119 sagt «differ in Heizprofil **or** Verwaltungspauschale»; ein Fall mit verschiedener Verwaltungspauschale bei gleichem Heizprofil fehlt in diesem Szenario.

**Behebung.** Positiv prüfen: `Und schlägt der Assistent das Heizprofil "<Standard-Heizprofil der Einstellungen>" vor`. Dazu eine Verwaltungspauschale, die aus den Einstellungen kommt. Den Fall «gleiches Heizprofil, verschiedener Satz» mindestens in `statement-generate-actions.test.ts` abdecken, und zwar nur mit Abrechnungen von Mietverträgen, die den Satz des Laufs nehmen (#89).

## V-3 (Minor): Szenario #76 prüft nicht, dass der unbefristete Mietvertrag seinen Text behält

**Beleg.** Der Kommentar in Z. 173–174 sagt: «ein unbefristeter behält den Hinweis auf den nächsten Kündigungstermin». Marc Huber (unbefristet, Lindenhof) ist im Lauf, aber Z. 184 prüft nur den neuen Satz. Ein Umbau, der den Kündigungstermin-Satz für das ganze Gebäude ersetzt, bliebe grün.

**Behebung.** Ergänzen: `Und meldet die Prüfung der Kategorien für "Kaltwasser": "frühestens auf den nächsten Kündigungstermin"`.

## V-4 (Minor): Wo steht der beschlossene Satz im Hinweis auf neue Nebenkosten?

**Beleg.** `messages/de.json:988` endet mit «Waren die Kosten bisher in der Nettomiete enthalten, senken Sie diese entsprechend.» Wird der beschlossene Satz am Ende angehängt, folgt «eine Erhöhung» direkt auf «senken Sie diese». Der Leser bezieht die Erhöhung dann auf die Nettomiete statt auf die neuen Nebenkosten.

**Behebung.** Den Wortlaut nicht ändern, aber den Satz direkt nach «Ohne Formular oder Begründung ist die Änderung nichtig.» und vor «Waren die Kosten …» stellen. Das Szenario (Z. 184, `toContain`) bleibt gültig.

## M-2 (Minor): Wann ein befristeter Mietvertrag «läuft», ist nicht festgelegt; gekündigte Mietverträge

**Beleg.** Geplant: «Vertragsende set, not gekündigt, not yet reached». Glossar Z. 37 und 39: Ein gekündigter unbefristeter Mietvertrag hat ein Vertragsende, nämlich den Kündigungstermin. `akontoHint` lässt heute nur aus, was in der Periode endet (`movedOut`, `src/lib/statement-wizard.ts:203, 219`).

**Warum.** Eine Erhöhung gilt immer für die Zukunft. Massgebend ist deshalb, ob das Vertragsende nach *heute* liegt, nicht nach dem Ende der Periode. Ein befristeter Vertrag, dessen Ende zwischen Periodenende und heute liegt, ist entweder beendet (dann gibt es nichts zu erhöhen) oder läuft nach Art. 266 Abs. 2 als unbefristeter weiter (dann passt der Kündigungstermin-Text; vgl. die Aufgabe «Befristeten Mietvertrag prüfen», `docs/anforderungen-vertragsende.md:202`). Ein gekündigter Mietvertrag, dessen Ende nach der Periode liegt, erhält weiter «frühestens auf den nächsten Kündigungstermin». Dieser Termin ist sein Vertragsende, eine Erhöhung bringt also nichts. Das bestand schon vor dieser Änderung.

**Behebung.** Im Code und im Test festhalten: Stichtag heute, nicht das Ende der Periode. Für gekündigte Mietverträge ein eigenes Issue (Label `fachlich`), zum Beispiel denselben Weg wie `movedOut` (nur die Kostendifferenz, kein Hinweis zum Erhöhen).

## V-5 (Minor): Abrechnung ohne Heizprofil im Vergleich

**Beleg.** `backend/src/db/schema.ts:404`: `heatingProfileId: uuid('heating_profile_id').references(() => heatingProfiles.id, { onDelete: 'set null' })`. Eine Abrechnung, deren Heizprofil gelöscht wurde, hat `null`. Bei einem einfachen Vergleich gelten «Winter» und `null` als verschieden.

**Behebung.** Festlegen und testen, ob `null` im Vergleich zählt. Fachlich naheliegend: Eine Abrechnung ohne Heizprofil sagt nichts über das Heizprofil der Periode und wird übergangen (vgl. #280).

## V-6 (Nit)

- `tests/e2e/steps/statement-generate.steps.ts:306` legt jedes Heizprofil mit denselben Monatsanteilen an. «Sommer» unterscheidet sich von «Winter» nur im Namen. Das reicht für den Test, ist fachlich aber irreführend. Ein neutraler Name wie «Profil B» wäre besser.
- Z. 179: Das Vertragsende 2035-12-31 ist für Wohnungen ungewöhnlich lang. Ab 2036 läuft der Vertrag nicht mehr und das Szenario wird rot. Besser wäre ein Datum relativ zu heute, wie es andere Steps schon verwenden («in 30 Tagen»).

## Fehlende Begriffe

Keiner. Alle Begriffe der Szenarien und des geplanten Texts stehen in `UBIQUITOUS_LANGUAGE.md`. Neue Wortlaute schlage ich nur bei M-1 und V-1 vor (je ein Issue mit den Labels `fachlich` und `entscheiden`).

## Nicht bestätigt

- **unsicher:** Ob ein Mietvertrag während der festen Dauer eine Erhöhung des *Akontos* oder neue Nebenkosten wirksam vorbehalten kann, also der «ausser»-Teil für Nebenkosten. Fedlex nennt als Ausnahmen nur Index und Staffel (Art. 269b, 269c OR) für den Mietzins; zu Nebenkosten steht dort nichts. Gesucht mit `mmx search`. Die Seiten von HEV Luzern, geschaeftsmieter.org, martinproperty.ch und gerichte-zh.ch waren über WebFetch nicht erreichbar (DNS). Gesehen habe ich nur Snippets: HEV Winterthur («Eine Erhöhung der Akontozahlungen für die Nebenkosten ist nur auf einen Kündigungstermin gemäss Mietvertrag möglich, unter Einhaltung der …»), ZMP 2025 Nr. 6 («Eine Anpassung der mietvertraglichen Nebenkostenregelung ist in Form einer einseitigen Vertragsänderung mit amtlichem Formular anzuzeigen.») und SVIT (empfiehlt für die Erhöhung der Akontozahlungen statt einer einseitigen Vertragsänderung …). Der beschlossene Satz bleibt davon unberührt, weil er nur auf den Mietvertrag verweist.
- **unsicher:** Dass eine Erhöhung auf das Ende einer festen Dauer hin mit Formular für die stillschweigende Fortsetzung mitgeteilt werden kann (Lehre; keine Fedlex-Stelle gefunden).
- Die Übersetzungen fr/it/en des beschlossenen Satzes und des Texts zu #119 gibt es im Commit noch nicht. Ich habe sie nicht geprüft.
- `docs/PRD-Dwello.md` enthält nichts zu befristeten Verträgen, Kündigungsterminen beim Akonto-Hinweis oder zur Vorauswahl aus übrigen Abrechnungen (grep ohne Treffer). Massgebend sind A-10 (`docs/anforderungen-vertragsende.md:304–316`) und die Issues #76 und #119.
- Ob die Seed-Wohnung 3.02 dieselbe Fläche wie 3.01 hat, habe ich nur aus dem bestehenden Szenario Z. 89–99 («die Hälfte für die Wohnung») geschlossen, nicht in `seed.apartment` nachgesehen. Für die Schwelle ist es unerheblich, weil schon ein Anteil von 13.4 % (276 / 2060) reicht.
- Ein offenes Issue zur Einheitlichkeit des Heizprofils pro Wohnung bei einem Mieterwechsel habe ich in den offenen Issues (Titelsuche «Heiz/profile») nicht gefunden: #345, #336, #315, #302 und #280 betreffen anderes.
