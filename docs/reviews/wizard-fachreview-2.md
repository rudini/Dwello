# Fachreview 2: Assistent «Abrechnungen erstellen», #251, #201, #252

Gegenstand: `git diff a7088d0 b881ac0` (Umsetzung und angepasste Szenarien). Worktree: `/tmp/claude-0/-home-user-Dwello/987bcc32-5bc2-548b-b1db-07cf87dd37fd/scratchpad/review-wizard-fach2` (b881ac0). Vorbericht: `docs/reviews/wizard-fachreview-1.md`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | erledigt | Die Bestätigung bei Tagen ohne Abrechnung ist wieder da, und «Alle Gebäude» wählt solche Gebäude. Die Regel stimmt in allen 12 nachgerechneten Fällen. |
| M-2 | Mietrecht | Minor (bestand schon vorher) | Sind alle Mietverträge der Wahl schon abgerechnet und lässt eine Abrechnung Tage offen, ist die Vorschau leer. Dann gibt es keine Bestätigung, und die Vorschau meldet «Alle Mietverträge haben in dieser Periode schon eine Abrechnung.». Das ist genau der Fall im neuen Szenario zu «Alle Gebäude» und der Fall Helga P-6. |
| V-9 | Verwalter | Minor | Schritt 2 sagt bei einem Gebäude mit offenen Tagen «Sie müssen es nicht wählen», aber «Alle Gebäude» wählt es. Das widerspricht sich ohne Begründung. Ausserdem weicht die Regel bewusst vom Wortlaut ab, den der Product Owner in #201 entschieden hat. |
| V-10 | Verwalter | Nit | fr «rien n’est créé pour lui» und it «per esso non viene creato nulla» klingen holprig. |
| V-11 | Verwalter | Nit | fr `ui_draft_discard_title` «Supprimer les saisies ?» hat ein normales Leerzeichen vor «?», kein geschütztes. |
| V-1…V-6 | Verwalter | erledigt | Siehe «Bestätigt». V-7 und V-8 bleiben offen wie angekündigt (Product Owner bzw. #57). |

## M-1 (Mietrecht): erledigt

**Beleg.**
- `src/lib/server/statement-generation.ts:44-82`: `covers()` prüft, ob die überlappenden Abrechnungen eines Mietvertrags lückenlos vom Tag `max(Vertragsbeginn, Periodenbeginn)` bis `min(Vertragsende ?? Periodenende, Periodenende)` reichen. Ist das nicht so, zählt der Vertrag als `partly`.
- `src/lib/statement-wizard.ts:227-228`: `needsConfirmation` verlangt die Bestätigung bei `partlyBilled > 0`.
- `PreviewChecks.svelte:30-31, 44-47`: Der Hinweis «Es gibt schon Abrechnungen» erscheint nur dann als `caution` und gehört zur Bestätigung, sonst als `info`.
- `BuildingStep.svelte:444-452` (Diff): «Alle Gebäude» lässt nur Gebäude mit `billed === contracts && !partly` aus.
- `src/routes/statements/generate/+page.server.ts:93-101`: Der Server berechnet `partlyBilled` für die Vorschau neu. Er verlässt sich nicht auf einen Wert aus dem Browser.
- Fedlex, VMWG Art. 4 Abs. 1 (SR 221.213.11, https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de, Snippet über `mmx search`): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»

**Nachgerechnet.** Ich habe `covers` und die Grenzen aus dem Diff unverändert in einem Skript laufen lassen, mit `node`:

| Fall | Ergebnis | richtig |
|---|---|---|
| Eva Frei 01.01.–31.03.2024, Abrechnung 2024, Lauf 2024 | abgedeckt | ja |
| Marc Huber ab 01.05.2024, Abrechnung 2024, Lauf 01.07.2024–30.06.2025 | Tage offen (01.01.–30.06.2025) | ja |
| offener Vertrag, Abrechnung 2024, Lauf 01.10.2024–30.09.2025 (Helga P-6) | Tage offen (273 Tage) | ja |
| Vertrag endet 31.12.2024 in der Periode, Abrechnung 2024, Lauf Okt.–Sep. | abgedeckt (seine Tage enden mit der Abrechnung) | ja |
| Vertrag beginnt 01.02.2025 in der Periode, Abrechnung 2025, Lauf Okt.–Sep. | abgedeckt | ja |
| zwei Abrechnungen 01.01.–30.06. und 01.07.–31.12.2025 (unsortiert), Lauf 2025 | abgedeckt | ja |
| zwei Abrechnungen mit Lücke im Juni 2025 | Tage offen | ja |
| verschachtelt (Jan.–Dez. und Jan.–Juni) | abgedeckt | ja |
| Schaltjahr: 01.01.–28.02.2024 und 01.03.–31.12.2024 | Tage offen (29.02.) | ja |
| Schaltjahr: bis 29.02.2024 und ab 01.03.2024 | abgedeckt | ja |
| Vertrag 30.06.–31.12.2024, Abrechnung 01.07.2023–30.06.2024, Lauf 2024 | Tage offen | ja |
| Abrechnungen 07/2023–06/2024 und 07/2024–06/2025, Lauf 2024 | abgedeckt | ja |

Die Fälle aus der Aufgabe sind damit abgedeckt: mehrere Abrechnungen eines Vertrags, auch unsortiert, verschachtelt oder mit Lücke, sowie Vertragsende und Vertragsbeginn in der Periode. Datumsformat: Verträge und Abrechnungen liefern `YYYY-MM-DD` (`tests/contracts/contracts.json:7-8`, `period-statements.json:6-7`). Der Textvergleich und `nextDay` in UTC sind deshalb richtig, auch über die Zeitumstellung. `invoicesInPeriod` (Z. 155, 189) zählt `existing` mit derselben Überlappungsregel. Wo `partlyBilled > 0` ist, steht deshalb immer auch der Hinweis, auf den `aria-describedby` der Bestätigung zeigt.

Die Unit-Tests `statement-generation.test.ts` (Tage offen bzw. zwei Abrechnungen, die zusammen abdecken) und `statement-wizard.test.ts` (`needsConfirmation` mit und ohne `partlyBilled`) prüfen die Regel. Das Szenario «Eine Abrechnung für einen Teil der Periode verlangt weiter eine Bestätigung» hat dank «Lea Graf» eine nicht leere Vorschau und prüft so den Fall, um den es in M-1 ging.

Die offenen Tage werden weiterhin nicht abgerechnet: `contractsInPeriod` überspringt jeden Vertrag mit einer überlappenden Abrechnung. Der Hinweis nennt sie nicht. Wie im Vorbericht vorgeschlagen («bis #199 umgesetzt ist, genügt die Bestätigung»), ist das annehmbar. Den Rest regeln #199 und #281 (offen, `entscheiden`). Die Änderung legt nichts fest, was #281 vorwegnimmt: Sie fragt nur nach und erstellt keine kurze Abrechnungsperiode.

## M-2 (Mietrecht, Minor, bestand schon vorher): Leere Vorschau verschweigt offene Tage

**Beleg.**
- `PreviewStep.svelte:89-98`: `PreviewChecks` (Hinweis und Bestätigung) erscheint nur, wenn `previewRows.length > 0`. Sonst zeigt `PreviewEmpty.svelte:11` den Text `statements_all_billed`: «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. …»
- Neues Szenario «Alle Gebäude wählt ein Gebäude, dessen Abrechnung nur einen Teil der Periode abdeckt»: Lauf 01.07.2024–30.06.2025. In Lindenhof läuft dann nur Marc Huber (Eva Frei endet am 31.03.2024). Er hat die Abrechnung 2024, also bleiben 01.01.–30.06.2025 offen (181 Tage). «Alle Gebäude» wählt Lindenhof. Die Vorschau ist leer, weil kein Vertrag neu abgerechnet wird. Es gibt keine Bestätigung, und der Text sagt, alles sei abgerechnet. Das Szenario prüft nur die Wahl in Schritt 2.
- Derselbe Fall ist Helga P-6 (Alpenblick allein, Okt.–Sep.).

**Warum.** Im Fall, auf dem M-1 beruht, hilft die Korrektur nur, wenn noch ein anderer Mietvertrag der Wahl abgerechnet wird. Wählt der Liegenschaftsverwalter nur Gebäude, deren Verträge alle (teilweise) abgerechnet sind, gilt weiter: Der Text sagt «schon eine Abrechnung», und die Akontobeiträge der offenen Tage werden nie abgerechnet (Art. 4 Abs. 1 VMWG, oben). Auf dem Basis-Commit zeigte dieselbe Wahl denselben Text, und «Alle Gebäude» wählte schon damals jedes Gebäude. Die Änderung macht den Fall also weder häufiger noch widersprüchlicher. Nach «Done means» ist das kein offener Blocker.

**Lösung.** In die Umsetzung von #199/#281 aufnehmen, als Kommentar in #281 («Where» nennt `BuildingChoice.svelte`, aber nicht `PreviewEmpty.svelte`): Die leere Vorschau unterscheidet «alle Tage abgerechnet» von «Tage offen». Bis dahin geht es auch ohne neuen Begriff: `statements_all_billed` nur zeigen, wenn kein gewähltes Gebäude `partly > 0` hat, und sonst den Hinweis `existing-statements` mit `caution` zeigen.

## V-9 (Verwalter, Minor): Schritt 2 widerspricht «Alle Gebäude» bei offenen Tagen

**Beleg.**
- `BuildingChoice.svelte:32-45` (Diff): `billedText` richtet sich nur nach `billed` und `contracts`, nicht nach `partly`. Im Szenario oben (1 Vertrag, abgerechnet, Tage offen) steht bei Lindenhof `statements_building_billed_all_one`: «Der einzige Mietvertrag … hat schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen. Wenn Sie es wählen, wird dafür nichts erstellt. …». Gleichzeitig hakt «Alle Gebäude» Lindenhof an. Unter dem Zähler steht kein Hinweis zum Auslassen, weil `leftOut` leer ist.
- #201, «Decided (product owner)»: «Alle Gebäude» lässt Gebäude aus, «whose Mietverträge all have a statement in the period». Der Code weicht auf Grund von M-1 bewusst davon ab.

**Warum.** Der Liegenschaftsverwalter liest «Sie müssen es nicht wählen» und sieht das Gebäude trotzdem gewählt. Gerade das ist der Fall, in dem es fachlich etwas zu prüfen gibt. Der Text gibt den Grund («teilweise») nur im Nebensatz an, der für ganz abgedeckte Gebäude genauso lautet. Die Sätze bleiben wahr («entsteht keine neue Abrechnung», «wird dafür nichts erstellt»). Der Widerspruch steht also in der Führung, nicht im Ergebnis.

**Lösung.**
- Bei `partly > 0` nicht «Sie müssen es nicht wählen» sagen, sondern zum Beispiel: «Mindestens eine dieser Abrechnungen deckt die Mietdauer in dieser Abrechnungsperiode nicht ganz ab. Für die übrigen Tage erstellt dieser Lauf keine Abrechnung.» Der Satz verwendet nur Begriffe aus dem Glossar. Die Tage nennt erst #199/#281.
- Die Abweichung vom entschiedenen Wortlaut als Kommentar in #201 festhalten, mit Verweis auf diesen Bericht und M-1 aus Bericht 1. Sie geht über das hinaus, was die «Coding guidelines» ohne Product Owner erlauben. Ich halte sie fachlich für nötig. Der Kommentar gibt dem Product Owner Gelegenheit zu widersprechen.

## V-10 (Verwalter, Nit): fr/it-Nachsatz holprig

**Beleg.** `messages/fr.json`, `statements_building_billed_all_*`: «Si vous le choisissez, rien n’est créé pour lui.» `messages/it.json`: «Se lo sceglie, per esso non viene creato nulla.»

**Lösung.** fr: «Si vous le choisissez, aucun décompte n’est créé pour cet immeuble.» it: «Se lo sceglie, non viene allestito alcun conteggio.» Das passt zu «Allestire i conteggi» (`docs/design/i18n-begriffe.md:96`).

## V-11 (Verwalter, Nit): geschütztes Leerzeichen im Französischen

**Beleg.** `messages/fr.json:41`: `"Supprimer les saisies ?"` hat vor «?» das Byte `0x20`. In `fr.json` stehen 12 andere Fragezeichen mit geschütztem Leerzeichen. `i18n-begriffe.md:5` verlangt das bei den Guillemets, und die Datei hält es meist auch so.

**Lösung.** Vor «?» ein U+00A0 setzen.

## Bestätigt

- **V-1:** Die Texte `statements_all_buildings_left_out_one/_many` in allen vier Sprachen beschreiben die ausgelassenen Gebäude jetzt genau. Ein Gebäude ohne Mietvertrag in der Periode wird nicht ausgelassen, und der Text behauptet das auch nicht. **Ein Issue zur Entscheidung halte ich nicht mehr für nötig.** Für ein solches Gebäude entsteht nichts, es fehlt kein Betrag, und der Text ist nicht mehr falsch. Wenn Personas das Gebäude ohne Mietvertrag als verwirrend melden, kann es später als `produkt`-Punkt kommen.
- **V-2:** Der Dialog hat den Titel «Angaben verwerfen?», den Text «Ihre Angaben werden gelöscht.» und den Knopf «Angaben verwerfen» (`messages/de.json:41-43`). fr «Supprimer les saisies», it «Scartare i dati», en «Discard entries» stimmen mit «Ihre Angaben» bzw. «Vos saisies» / «I suoi dati» / «Your entries» in `ui_draft_back` überein. Der öffnende Knopf heisst bis #57 in allen Sprachen noch «Entwurf/brouillon/bozza/draft». Das ist angekündigt.
- **V-3:** `statements_building_recalculate` stimmt in allen vier Sprachen wörtlich mit dem Nachsatz von `statements_all_billed` überein (fr «établissez à nouveau», it «allestisca di nuovo», en «Sent statements cannot be recalculated.»). Der Grund, keinen Link zu setzen (die ganze Karte ist das Label der Checkbox), ist stichhaltig: Ein Link im Label würde das Gebäude an- oder abwählen. Die Vorschau hat den Link (`PreviewChecks.svelte:86-90`). Fachlich genügt das.
- **V-4:** Das Szenario «Bestehende Abrechnungen allein verlangen keine Bestätigung» prüft «Für Lindenhof gibt es in dieser Abrechnungsperiode schon» (`statement-generate.steps.ts:384-386`). Ist alles abgedeckt, ist der Ton `info`, sonst `caution`.
- **V-5:** `restoredStep` öffnet in Schritt 2 oder 3 wie verlassen. Aus Schritt 4 oder 5 öffnet es Schritt 3, sodass der Server die Vorschau neu berechnet, und es geht zum ersten Schritt zurück, der nicht mehr gilt (`statement-wizard.ts:221-233`). Unit-Tests und Szenario («ist der Assistent im Schritt "Gebäude"») decken das ab. Nach dem Erstellen wird nichts mehr gespeichert (`touched = false` in `created()`).
- **V-6:** `formatDate(at.toISOString())` rechnet bei einem Zeitpunkt mit `Europe/Zurich` (`format.ts:43-51`), `formatTime` ebenso. Nachgerechnet: 09.10.2026 22:32 UTC ergibt 10.10.2026 00:32 (MESZ, UTC+2; die Zeitumstellung ist am 25.10.2026). 31.12.2026 23:30 UTC ergibt 01.01.2027 00:30 (MEZ, UTC+1). Beides stimmt. `SaveStatus.svelte` verwendet ebenfalls `formatTime`.
- **#251:** Für ganz abgedeckte Verträge ist der Verzicht auf die Bestätigung richtig. Es entsteht keine doppelte Abrechnung, und die Miettage sind abgerechnet (Tabelle oben, Zeilen 1, 4 und 5).
- **#201 b:** «Wenn Sie es wählen, wird dafür nichts erstellt.» stimmt auch bei offenen Tagen, weil `contractsInPeriod` den Vertrag überspringt. Die fr/it/en-Übersetzungen haben denselben Inhalt (Ausdruck: V-10).
- **Begriffe:** In den neuen Texten kommen Mietvertrag, Abrechnungsperiode, Abrechnung, Gebäude und Entwurf (als Status) vor. Alle stehen in `UBIQUITOUS_LANGUAGE.md` (Z. 35, 150, 169). «Angaben» ist laut #57 bewusst kein Begriff des Glossars. Die Übersetzungen folgen `docs/design/i18n-begriffe.md` (contrat de bail / contratto di locazione / rental contract, période de décompte / periodo di conteggio / billing period, brouillon / bozza / draft, immeuble / immobile / building). Die Schreibweise von «Alle Gebäude» stimmt mit `apartments_all_buildings` überein, in fr mit geschützten Leerzeichen in den Guillemets.

## Fehlende Begriffe

Keine für diese Änderung. Die Begriffe «Tage ohne Abrechnung» und «kurze Abrechnungsperiode» bzw. «Rumpfperiode» stehen schon in #281 (offen, `fachlich`, `entscheiden`). Ein neues Issue ist nicht nötig.

## Nicht bestätigt

- Was ein Mieter verlangen kann, wenn für Teile der Periode nie abgerechnet wird (Rückforderung der Akontobeiträge, Verjährung). Auf Fedlex nicht gesucht, **unsicher**. Belegt ist nur Art. 4 Abs. 1 VMWG.
- Die Szenarien habe ich nicht ausgeführt, auch nicht den Weg von M-2 bis zur leeren Vorschau. M-2 beruht auf dem Lesen von `PreviewStep.svelte`, `PreviewEmpty.svelte` und `contractsInPeriod` und auf der Grundlage der Feature-Datei (Z. 8-15).
- Ob Abrechnungen eines anderen Status (z. B. eine spätere berichtigte Abrechnung, #120) mitzählen sollen: Die Liste `statements?buildingId=` filtert nicht nach Status, und die Änderung ändert daran nichts. Geprüft habe ich nur, dass die Regel für Entwurf, Versendet und Bezahlt gleich gilt.
- Nach einem Umsetzungs-Issue zu #199 habe ich in den letzten 100 Issues (alle Status) gesucht, im Text nach «#199» und «uncovered» (`gh api repos/rudini/Dwello/issues?state=all&per_page=100`). Gefunden habe ich nur #281 (Entscheidung offen) und #211.
