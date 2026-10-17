# Fach-Review #348, Runde 1: vorgeschlagene Formulierungen

Gegenstand: `/tmp/claude-0/-home-user-Dwello/24437726-9342-5de9-a89f-ca3d43a292e1/scratchpad/w3e-proposal.md`, geprüft gegen den Worktree `review-w3e-fach` (Commit 26d2a42), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, den Code, der die Texte zeigt, und Schweizer Schreibregeln.

Ergebnis: kein Blocker, kein Major. Zwei Minor-Befunde (Dezimalbeispiel, «laufender» Mietvertrag) und fünf Nits. Allen anderen Zeilen stimme ich zu.

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | `statements_error_fee`: «2.5» in de und it widerspricht der Schweizer Regel (Dezimalkomma, Punkt nur bei Frankenbeträgen); die Begründung «it-CH writes 2.5» stimmt für Prozentsätze nicht |
| V-2 | Verwalter | Minor | `contracts_availability_blocked`: «laufender» ist auch für einen künftigen unbefristeten Mietvertrag falsch; der Code sperrt bei jedem Mietvertrag ohne Vertragsende |
| V-3 | Verwalter | Nit | `tenants_channel_help`: «eine Adresse» sagt nicht, dass PLZ und Ort auch nötig sind; das Formular nennt den Abschnitt «Korrespondenzadresse» |
| V-4 | Verwalter | Nit | Liste mit `Intl.ListFormat`: mit `en` statt `en-CH` entsteht ein Oxford-Komma («January, February, and March») |
| V-5 | Verwalter | Nit | fr «La facture pour mars manque»: verständlich, natürlicher ist «La facture de mars manque» |
| V-6 | Verwalter | Nit | Derselbe Fehler wie in Zeile `contracts_availability_blocked` steht auch in `contracts_error_end_required` («… bei befristetem Vertrag»), einem der 34 Texte, die jetzt einen Punkt bekommen |
| V-7 | Verwalter | Nit | `help_tenants_3`: «Entwurf» zweimal im selben Satz (optional) |

## Einzelbefunde

### V-1 (Minor): Dezimalbeispiel in `statements_error_fee`

- Evidenz: Vorschlag Zeile 16 («zum Beispiel 3 oder 2.5», it «2,5» → «2.5», «it-CH writes 2.5»). Schweizer Behörden schreiben Prozentsätze mit Komma: BWO (bwo.admin.ch/de) «Der hypothekarische Referenzzinssatz beträgt 1,25 Prozent», BWO italienisch (bwo.admin.ch/it) «il tasso ipotecario di riferimento è dell’1,25 %», ebenso RSI/tvsvizzera und cdt.ch («1,25%»). Kanton Zürich, «Umgang mit Sprache»: «Franken-Rappen-Beträge schreiben wir mit einem Punkt, sonst verwenden wir überall das Komma als Dezimalzeichen.» Auch die Schreibweisen des Kantons Basel-Landschaft verlangen: «Dezimalstellen werden mit Komma, nicht mit Punkt geschrieben.» (Fundstellen per `mmx search`.)
- Warum falsch: Ein Prozentsatz ist kein Frankenbetrag. «2,5» ist in de, fr und it die übliche Schweizer Schreibweise. «2.5» ist auch nicht falsch, denn CLDR `de-CH`/`it-CH` setzt den Punkt und `parsePercent` (`src/lib/utils/format.ts:67-70`) nimmt beides an. Die Begründung «it-CH writes 2.5» gilt aber nur für CLDR, nicht für die amtliche Praxis. Eine Eingabe scheitert in keiner Sprache.
- Fix (eine Wahl):
  - a) Empfohlen: Befund für de, fr und it mit dieser Begründung in #348 zurückweisen. de behält «2,5», gern mit «Dezimalstellen» statt «Stellen nach dem Komma» (beides korrekt). it bleibt «2,5», en bleibt «2.5».
  - b) Wenn die Einheitlichkeit mit dem vorgefüllten Feldwert wichtiger ist (`SettingsStep.svelte:40` füllt mit `String(number)`, also «2.5»): beide Formen nennen, de «zum Beispiel 3 oder 2,5 (auch 2.5)». Das ist länger, deshalb nur als Alternative.
  - Auf keinen Fall fr und it unterschiedlich behandeln, wie der Vorschlag es tut (fr «2,5», it «2.5»). Die amtliche Praxis ist in beiden Sprachen gleich.

### V-2 (Minor): «laufender» in `contracts_availability_blocked`

- Evidenz: `src/lib/utils/contract-availability.ts:88-100`. `ongoingContracts` behält jeden Mietvertrag ohne `end_date` (`if (!c.end_date) return true;`), auch einen mit Vertragsbeginn in der Zukunft. Gesperrt wird bei `ongoingContracts.find((c) => !c.end_date)`. Glossar `UBIQUITOUS_LANGUAGE.md:22`: «Vermietet ab {Datum} (`relet`, nur ein künftiger Vertrag ist abgeschlossen)». Glossar `:37`: Vertragsende ist «leer bei einem unbefristeten, ungekündigten Vertrag». `i18n-begriffe.md:29` unterscheidet laufend und künftig.
- Warum falsch: Bei einem künftigen unbefristeten Mietvertrag steht «laufender unbefristeter Mietvertrag», obwohl keiner läuft. Der Vermieter sucht dann einen Vertrag, den es nicht gibt. Der Fehler bestand schon vorher, aber der Vorschlag schreibt den Satz ohnehin neu.
- Fix: das Merkmal nennen, das der Code prüft, nämlich unbefristet und nicht gekündigt (ohne Vertragsende):
  - de «Wohnung nicht verfügbar – unbefristeter Mietvertrag, nicht gekündigt»
  - fr «Appartement non disponible – contrat de bail de durée indéterminée, non résilié»
  - it «Appartamento non disponibile – contratto di locazione a tempo indeterminato, non disdetto»
  - en «Apartment not available – open-ended rental contract, not terminated»

  Alle Begriffe stehen in `i18n-begriffe.md:27,30,31`. Der Halbgeviertstrich mit Leerzeichen ist richtig. Ohne diese Änderung müsste wenigstens «laufender» weg. Das vorgeschlagene en «open-ended rental contract running» ist zudem holprig.

### V-3 (Nit): `tenants_channel_help`

- Evidenz: Für Briefe verlangt das Formular Adresse, PLZ und Ort (`tenants_error_address_letter`, `_postal_code_letter`, `_city_letter`). Der Abschnitt heisst «Korrespondenzadresse» (`messages/de.json:568`, Glossar `:24`).
- Fix (optional): «Für den Versand per E-Mail braucht es eine E-Mail-Adresse, für den Versand per Brief eine vollständige Korrespondenzadresse.» «braucht es» ist korrektes Schweizer Hochdeutsch; das Glossar verwendet es selbst (`UBIQUITOUS_LANGUAGE.md:70`). Dem Rest der Zeile stimme ich zu.

### V-4 (Nit): Locale von `Intl.ListFormat`

- Evidenz (Node, ICU): `en-CH` ergibt «A, B and C», `en` ergibt «A, B, and C». `de-CH`, `fr-CH` und `it-CH` ergeben «A, B und C», «A, B et C», «A, B e C». `BuildingFacts.svelte:14` nutzt schon `${getLocale()}-CH`.
- Fix: dieselbe Locale `${getLocale()}-CH` verwenden. Dann folgt en der britisch-schweizerischen Schreibweise ohne Oxford-Komma, wie sie `statements_list_and` heute hat.

### V-5 (Nit): fr «pour mars»

- Evidenz: Vorschlag Zeile 10 und der Test `statements-i18n.test.ts` («La facture pour mars manque.»).
- Fix (optional): «La facture de mars manque» klingt natürlicher, passt aber nicht in die Vorlage «pour {parts}» mit Quartalen und Daten («pour le trimestre 1»). Kann bleiben, bis eine französischsprachige Person drüberliest (#342).

### V-6 (Nit): `contracts_error_end_required`

- Evidenz: `messages/de.json:611` «Vertragsende ist erforderlich bei befristetem Vertrag». Der Text bekommt in dieser Änderung einen Punkt. Er hat denselben Fehler, den #348 für `contracts_availability_blocked` nennt («Vertrag» statt «Mietvertrag»), und eine nachgestellte Bedingung.
- Fix: «Bei einem befristeten Mietvertrag ist das Vertragsende erforderlich.» Weitere «Vertrag» ohne «Miet-» (`contracts_overlap`, `contracts_not_found`, `contracts_load_failed`) liegen ausserhalb von #348. Kein eigenes Issue nötig, solange das Glossar «Vertrag» als Kurzform duldet (`UBIQUITOUS_LANGUAGE.md:37-38` sagt selbst «Vertrag»).

### V-7 (Nit): `help_tenants_3`

- Der neue Satz ist korrekt und behebt das doppelte «bis». Optional kann man die Wiederholung von «Entwurf» vermeiden: «Bis Sie speichern, den Entwurf verwerfen oder sich abmelden, bewahrt Dwello Ihre Eingaben in diesem Browser auf.» So sagt es auch `privacy_draft_notice`.

## Bewertung je Zeile des Vorschlags

| Zeile | Urteil | Beleg |
|---|---|---|
| `dashboard_task_drafts_text_one` | Zustimmung (de, fr, it, en) | Eine Abrechnung hat einen Mieter (`backend/src/db/schema.ts:382`, `statements.tenant_id`). Glossar «Versendet: Abrechnung dem Mieter zugestellt» (`UBIQUITOUS_LANGUAGE.md:170`). `_one` gilt nur für count 1 (`src/lib/overview.ts:166-170`). `_many` bleibt im Plural, das ist richtig |
| `statements_finding_stock_missing_one/_many` | Zustimmung | «Die Tankbestände am 31.12.2024 und am 31.12.2025 fehlen.» ist korrekt; das «am … und am …» kommt aus `statements_stock_dates_and` (`statement-wizard.ts:136-139`). Begriff Tankbestand: Glossar `:135-136`. fr und it hatten den Artikel schon |
| `statements_finding_gap_one/_many` | Zustimmung | Artikel ergänzt, it und fr hatten ihn schon. Hinweis ohne Befund: `_one`/`_many` richten sich nach der Zahl der fehlenden Teile, nicht der Rechnungen (`statement-wizard.ts:176`). Das ist unverändert |
| `statements_part_month`, `statements_list_and` | Zustimmung, mit V-4 und V-5 | «Die Rechnungen für Januar, Februar und März fehlen.» ist korrekt. «für das 1. Quartal und das 3. Quartal» bleibt richtig. Monatsnamen kommen aus `toLocaleDateString(`${getLocale()}-CH`)` (`statement-wizard.ts:122`), fr und it klein geschrieben, korrekt |
| `backend_formula_sample_negative` | Zustimmung | Der Beispielname ist ein Etikett mit Grossbuchstaben («Kleine Wohnung (50 m², 2 Zimmer)», `messages/de.json:440`). «für das Beispiel «…»» ist korrekt; fr und it sagen es schon so |
| `contracts_availability_blocked` | Ändern, siehe V-2 | Halbgeviertstrich und «Mietvertrag» sind richtig, «laufender» nicht |
| `backend_*_name_taken`, `apartments_number_taken_text` | Zustimmung | de und en ohne Leerzeichen innen, wie en schon in `help_tenants_3` («Save rental contract»). Der Platzhalter in `apartments_number_taken_text` heisst `{number}`, nicht `{name}`. Nicht umbenennen |
| `buildings_saved_toast`, `buildings_deleted_toast` | Zustimmung | Wie `tenants_deleted_toast`. fr mit U+00A0 innen («« {name} »», wie `messages/fr.json:561`), it, de und en ohne |
| `buildings_canton_fr` | Zustimmung | Alle anderen Kantone haben in de die deutschen Namen (Genf, Waadt, Neuenburg, Wallis, Tessin, `messages/de.json:367-392`). BV Art. 1 (deutsch) nennt «… Glarus, Zug, Freiburg, Solothurn …» (Wortlaut nur aus Suchtreffern, siehe «Nicht bestätigt»). Der Wert ist der Kantonscode; nirgends wird mit dem Label «Fribourg» verglichen (`grep` in src, backend/src, tests: kein Treffer). fr, it und en bleiben unverändert, korrekt |
| `statements_error_fee` | Ändern, siehe V-1 | |
| 34 `*_error_*`-Texte mit Punkt | Zustimmung | Alle 34 sind ganze Sätze (Liste per Node geprüft). Für den Punkt ist kein anderer Umbau nötig. Zu `contracts_error_end_required` siehe V-6 |
| `help_tenants_3` | Zustimmung (de, fr, it), siehe V-7 | fr «enregistriez, supprimiez, vous déconnectiez»: Subjonctif nach «jusqu’à ce que», korrekt. «supprimiez le brouillon» passt zum Knopf «Supprimer le brouillon» (`fr.json:40`). it «finché non li salva, non scarta la bozza o non si disconnette»: korrekt, passt zu «Scartare la bozza» (`it.json:40`). Die Aussage stimmt: Abmelden löscht die Entwürfe (`src/lib/ui/Header.svelte:24`). en ist schon richtig |
| `tenants_channel_help` | Zustimmung, Nit V-3 | |
| `statements_compared_text` | Zustimmung | Glossar `:61` «Lieferant / Rechnungssteller» sind Synonyme; die Oberfläche sagt «Rechnungssteller» (`invoices_error_billing_entity`). fr «émetteur de la facture», it «emittente della fattura», en «invoice issuer» wie `i18n-begriffe.md:42`. «calcule»/«calcola» vermeidet die Wiederholung von «facture»/«fattura» |

## Fehlende Begriffe

Keine. Alle Wörter der vorgeschlagenen Texte stehen im Glossar oder in `i18n-begriffe.md`.

## Nicht bestätigt

- Wortlaut von BV Art. 1 («Freiburg»): Fedlex (`fedlex.admin.ch/eli/cc/1999/404/de`) liefert ohne JavaScript keinen Text, lexfind.ch war nicht erreichbar. Ich habe nur Suchtreffer-Snippets von `mmx search` gesehen. Für die Zeile ist das unkritisch, denn sie stützt sich schon auf die übrigen deutschen Kantonsnamen in `de.json`.
- Bundeskanzlei, Schreibweisungen zum Dezimalzeichen: Das Dokument selbst habe ich nicht gelesen. V-1 stützt sich auf die BWO-Mitteilungen (de, it) und die Schreibregeln der Kantone Zürich und Basel-Landschaft, alle aus `mmx search`-Treffern.
- fr- und it-Sätze sind nicht von einer muttersprachlichen Person gegengelesen (#342). Grammatik und Begriffe habe ich gegen `i18n-begriffe.md` und die vorhandenen Knopfbeschriftungen geprüft.
- Die Zeile `help_tenants_3` fr ist im Vorschlag abgeschnitten («vos saisies restent …»). Geprüft habe ich die Annahme «… restent comme brouillon dans ce navigateur.».
