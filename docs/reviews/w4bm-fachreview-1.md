# Fachreview W4b-Mietstatus, Runde 1 (Szenarien vor der Umsetzung)

Gegenstand: `git diff c069e25 b3ff5d3 -- tests/e2e/features` im Worktree `review-w4bm-fach` (Commit b3ff5d3), mit den geplanten Texten aus #117 (A-8), #145 und #58.
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/PRD-Dwello.md`, `docs/design/i18n-begriffe.md`, `messages/*.json`, Fedlex (OR SR 220, Fassung 01.01.2026; VMWG SR 221.213.11, Fassung 01.06.2020, aus dem Fedlex-Filestore gelesen).

Ergebnis: kein Blocker, kein Major. Die Regeln und Texte stimmen mit Glossar, Anforderungen und Gesetz überein. Es bleiben Lücken in den Randfällen und in der Abdeckung sowie ein fehlender Glossarbegriff.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | «Vermietet ab» nach einem Auszug: In der Lücke bis zum Einzug trägt ebenfalls der Vermieter die Nebenkosten, aber die Hilfe dazu fehlt dort |
| V-2 | Verwalter | Minor | Der Löschdialog ohne Abrechnung sagt «keine Nebenkostenabrechnung» und gleich danach «fehlen noch Nebenkostenabrechnungen»; ohne «in Dwello» missverständlich |
| V-3 | Verwalter | Minor | Mieterstatus bei einem beendeten und einem künftigen Mietvertrag ist nicht festgelegt, und kein Szenario prüft diesen Fall |
| V-4 | Verwalter | Minor | «Leer seit» ist nur auf der Wohnungsseite und in der Übersicht belegt, nicht in der Wohnungsliste und auf der Gebäudeseite; in der Übersicht fehlt zudem der Gegenfall «nie vermietet» |
| V-5 | Verwalter | Minor | Begriff «Leer seit {Datum}» fehlt im Glossar (Mietstatus); Vorschlag unten |
| V-6 | Verwalter | Minor | `i18n-begriffe.md` Zeile 19 nennt noch «Wiedervermietet / reloué / rilocato / re-let ❓»; die Übersetzungen für die neuen Texte fehlen (Vorschläge unten) |
| V-7 | Verwalter | Nit | Die Beschriftung «Vermietet ab …» mit Auslassungspunkten in Filter, Legende und Kennzahl |
| V-8 | Verwalter | Nit | Eine gesperrte Wohnung nach dem Auszug bekommt weder «seit» noch die Hilfe zu den Nebenkosten |
| M-1 | Mietrecht | Nit | Die Hilfe «Bleibt als Historie erhalten: …» nennt nur die Abrechnungen. Den Vormietzins (Art. 256a Abs. 2 OR) braucht der Vermieter auch |
| M-2 | Mietrecht | Nit | «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter»: Art. 7 Abs. 2 VMWG kennt eine Ausnahme bei den Heizkosten, die Dwello bewusst nicht umsetzt (#188). Das ist richtig, wird hier nur zur Kenntnis genommen |

## Bestätigt

- **«Vermietet ab {Datum}» statt «Wiedervermietet» (#58).** Das Glossar steht schon so: `UBIQUITOUS_LANGUAGE.md:22`: «Vermietet ab {Datum} (`relet`, nur ein künftiger Vertrag ist abgeschlossen)». Die Szenarien passen dazu: `apartment-detail.feature` «Wohnung mit künftigem Mieter» (3.02, nie vermietet, jetzt ohne «Wieder»), `apartments.feature:24`, `buildings.feature` «1 vermietet ab 01.11.2099», `dashboard.feature` (Belegung, Kennzahl «Vermietet ab …»). Die Übersicht gruppiert schon heute nach Vertragsbeginn (`src/routes/dashboard/BuildingFigures.svelte:49-54`). Bei mehreren Daten entsteht also keine mehrdeutige Zeile, sofern die Gebäudekarte dieselbe Gruppierung übernimmt (siehe V-4, Hinweis).
- **Mieter «Künftig» und «Aktiv» (#58).** `UBIQUITOUS_LANGUAGE.md:23`: «Aktiv mit laufendem Mietvertrag, künftig mit nur einem künftigen Mietvertrag, ehemalig, wenn alle seine Mietverträge beendet sind». Das Szenario «Künftiger Mieter» (`tenants.feature`) und der auf 2014 umgestellte «Aktiver Mieter» passen dazu. Vorher galt ein Mieter mit Vertrag ab 2099 als aktiv. Das war falsch und ist jetzt behoben.
- **«Frühere Mietverträge» und die Hilfe zur Historie (#117).** Sie stimmen wörtlich mit `docs/anforderungen-vertragsende.md:256-257` überein. «Beendet» ist der Vertragsstatus aus dem Glossar (`UBIQUITOUS_LANGUAGE.md:42`). «Frühere Mietverträge» ist eine Überschrift in einfachen Worten und kein neuer Fachbegriff.
- **Löschdialog mit Abrechnungen (#117).** Der Text «Dieser Mietvertrag kann nicht gelöscht werden. Seine Mietstage sind abgerechnet in:» besteht schon (`messages/de.json:1399`, `contracts_delete_billed`). Die Regel (kein Löschen mit Abrechnung, #116) steht in `docs/anforderungen-vertragsende.md:225`. Die Links erfüllen A-8 Punkt 3.
- **«Leer seit» = Tag nach dem Vertragsende (#145).** Laut Glossar ist das Vertragsende der «letzte Tag des Mietverhältnisses» (`UBIQUITOUS_LANGUAGE.md:37`). Damit ist der erste leere Tag der Tag danach. Nachgerechnet:
  - 31.03.2024 → 01.04.2024 (Szenarien `apartment-detail.feature`, `dashboard.feature`),
  - 29.02.2024 (Schaltjahr) → 01.03.2024,
  - 31.12.2025 → 01.01.2026 (Jahreswechsel),
  - Grenzfall Vertragsende = heute: Der Vertrag läuft heute noch (Grenze des Backends, `design-decisions.md:44`), der Status ist «Vermietet bis {heute}», und erst morgen erscheint «Leer seit {morgen}». Das ist richtig.
  - Mieterwechsel mit Lücke (A endet am 31.03., B beginnt am 01.06. in der Zukunft): Der Status lautet «Vermietet ab 01.06.», nicht «Leer seit». Das entspricht dem Glossar «Leer: … keinen künftigen Mietvertrag».

  Mietrecht: Vorzeitig zurückgeben befreit den Mieter nicht. Art. 264 Abs. 2 OR: «Andernfalls muss er den Mietzins bis zu dem Zeitpunkt leisten, in dem das Mietverhältnis gemäss Vertrag oder Gesetz endet oder beendet werden kann.» Massgebend ist also das Vertragsende und nicht der Auszugstag. Dwello rechnet richtig vom Vertragsende aus. Zur stillschweigenden Fortsetzung (Art. 266 Abs. 2 OR) besteht die Lücke schon (`anforderungen-vertragsende.md:199`); diese Änderung macht sie nicht schlimmer.
- **«Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.»** Für die Heizkosten steht es im Gesetz. VMWG Art. 7 Abs. 1: «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.» Für die übrigen Nebenkosten folgt es aus Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Für eine leere Wohnung gibt es keinen Mieter mit einer solchen Vereinbarung. Für die Praxis siehe «Nicht bestätigt». Dwello rechnet genau so: Geteilt wird durch alle Wohnungen, und den Anteil leerer Wohnungen und leerer Tage trägt der Vermieter (`docs/nebenkostenabrechnung-anforderungen.md:143-144`, Entscheid #188). Die Hilfe sagt also, was die Abrechnung tut. Sie vermeidet das offene Wort «Leerstand» (#279) und hängt darum nicht von diesem Entscheid ab.

## Befunde

### V-1 (Minor, Verwalter): Lücke vor einem künftigen Mietvertrag ohne Hinweis auf die Nebenkosten

**Beleg.** `messages/de.json:181` (`apartments_status_help_relet`): «… die Wohnung ist ab seinem Vertragsbeginn vermietet, auch wenn sie bis dahin leer ist.» Die neue Hilfe zu den Nebenkosten ist nur für «Leer seit» geplant (#145; `apartment-detail.feature` «Leere Wohnung nach dem Auszug», `dashboard.feature` «Leere Wohnung in der Belegung»).
**Warum falsch.** Endet A am 31.03. und beginnt B am 01.06., so zeigt die Wohnung «Vermietet ab 01.06.». Die Nebenkosten April und Mai trägt aber ebenfalls der Vermieter (VMWG Art. 7 Abs. 1, siehe oben). Gerade dort, wo der Laie «vermietet» liest, fehlt der Hinweis. Für ihn ist das der häufigere Fall von Leerstand.
**Korrektur.** Die Hilfe zu «Vermietet ab» ergänzen, Vorschlag: «Ein künftiger Mietvertrag ist abgeschlossen; die Wohnung ist ab seinem Vertragsbeginn vermietet. Bis dahin tragen Sie als Vermieter ihre Nebenkosten.» Dafür braucht es einen Entscheid des Product Owners, weil der Text über #145 hinausgeht. Wenn er ihn nicht in diesem Pull Request will: ein Issue `fachlich`, `entscheiden`.

### V-2 (Minor, Verwalter): «Zu diesem Mietvertrag gibt es keine Nebenkostenabrechnung.»

**Beleg.** Szenario `contract-detail.feature` «Löschdialog eines beendeten Mietvertrags ohne Abrechnung» (Vertrag 2018–2021). Für diesen Vertrag nennt Dwello fehlende Abrechnungen (Glossar «Hinweis auf fehlende Abrechnungen», `UBIQUITOUS_LANGUAGE.md:46`). Der Dialog zeigt dann auch `contracts_delete_missing_statements` (`messages/de.json:1395`): «Für diesen Mietvertrag fehlen noch Nebenkostenabrechnungen. …»
**Warum falsch.** Zwei Sätze hintereinander, «es gibt keine» und «es fehlen noch», lesen sich für einen Laien wie ein Widerspruch oder wie ein «also darf ich löschen». In der Praxis hat ein Vermieter, der 2018–2021 vor Dwello abgerechnet hat, sehr wohl Abrechnungen, nur nicht in Dwello. Diese Forderungen verjähren nach fünf Jahren (Art. 128 Ziff. 1 OR: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen»; ob Nebenkosten darunter fallen, ist **unsicher**). Die Abrechnung 2021 kann also noch offen sein.
**Korrektur.** «Zu diesem Mietvertrag gibt es in Dwello keine Nebenkostenabrechnung.» Den Satz vor `contracts_delete_missing_statements` stellen, damit beide zusammen lesbar sind. Das Szenario prüft mit `toContain` und bleibt grün, solange der geplante Text Teil des neuen ist. Es kann aber auch auf den neuen Wortlaut angepasst werden.

### V-3 (Minor, Verwalter): Mieterstatus bei einem beendeten und einem künftigen Mietvertrag

**Beleg.** `UBIQUITOUS_LANGUAGE.md:23`: «künftig mit nur einem künftigen Mietvertrag, ehemalig, wenn alle seine Mietverträge beendet sind». In #58 heisst es: «A tenant whose only Mietvertrag starts in the future gets … «Künftig»». Das Szenario «Künftiger Mieter» deckt nur den Mieter ohne weiteren Vertrag ab.
**Warum falsch.** Ein früherer Mieter, der später wieder eine Wohnung mietet (Umzug innerhalb des Bestands mit Lücke, Rückkehr), hat einen beendeten und einen künftigen Vertrag. «nur einem künftigen» lässt sich als «einzigen Vertrag» lesen, und dann hätte dieser Mieter keinen Status. «Ehemalig» passt auch nicht, weil nicht alle Verträge beendet sind. Je nach Lesart filtert die Mieterliste ihn als «Künftige Mieter» oder unter keinem Filter.
**Korrektur.** Die Regel festlegen: «Künftig: kein laufender, mindestens ein künftiger Mietvertrag (beendete zählen nicht)». Ein Szenario oder ein Backend-Test (`*.pg.test.ts`) mit beendetem und künftigem Vertrag soll «Künftig» und den Filter «Künftige Mieter» zeigen. Die Glossarformulierung ist Sache des Product Owners (#140 ist schon offen). Den Hinweis dort ergänzen.

### V-4 (Minor, Verwalter): Abdeckung von «Leer seit»

**Beleg.** Geplant in #145: «shown wherever the Mietstatus of an apartment shows (apartment page, apartment list, building page)». Szenarien gibt es nur in `apartment-detail.feature` und `dashboard.feature`. Den Gegenfall «nie vermietet bleibt Leer» prüft nur die Wohnungsseite (`apartment-detail.feature` «Leere Wohnung»). Die Übersicht hat im Hintergrund die nie vermietete 1.02, aber kein Szenario stellt fest, dass sie dort keine Zeile «Wohnung 1.02 leer seit …» bekommt.
**Warum falsch.** Derselbe Status könnte in der Wohnungsliste und auf der Gebäudeseite anders lauten. Genau das war der Grund für #58 («same wording everywhere»).
**Korrektur.** `apartments.feature` mit einem Schritt «Dann ist die Wohnung "2.02" "Leer seit …"» ergänzen, oder für die Gebäudeseite einen tieferen Test. In `dashboard.feature` «Belegung pro Gebäude» festhalten, dass die Belegung kein «leer seit» nennt. Hinweis zu den Gebäudekarten: Haben zwei Wohnungen verschiedene Daten für «vermietet ab», sollte die Karte wie die Übersicht pro Datum gruppieren (`BuildingFigures.svelte:50-54`). Heute zählt `src/routes/buildings/+page.server.ts:46` nur.

### V-5 (Minor, Verwalter): fehlender Begriff «Leer seit {Datum}»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:22` erklärt «Vermietet bis {Datum}» ausdrücklich als Anzeige und nicht als eigenen Mietstatus. «Leer seit {Datum}» kommt dort nicht vor.
**Korrektur (Vorschlag für ein Issue `fachlich`, `entscheiden`, oder als Zusatz zu #140/#279).** Den Eintrag Mietstatus ergänzen: «Leer seit {Datum} ist kein eigener Mietstatus, sondern zeigt bei einer leeren Wohnung den Tag nach dem Vertragsende ihres letzten Mietvertrags an; eine Wohnung, die nie einen Mietvertrag hatte, heisst nur Leer.» Den Code bis dahin mit `TODO(fachlich prüfen, #<issue>)` markieren, ausser der Product Owner hat den Begriff in #145 schon entschieden (dann ohne Marker, siehe CLAUDE.md).

### V-6 (Minor, Verwalter): Übersetzungen

**Beleg.** `docs/design/i18n-begriffe.md:19`: «Vermietet / Wiedervermietet / Leer / Gesperrt | loué / reloué / vacant / bloqué | locato / rilocato / sfitto / bloccato | let / re-let ❓ / vacant / blocked». Zu «Leer seit», «Künftig» (Mieter), «Frühere Mietverträge» und den zwei Hilfen gibt es keinen Eintrag.
**Korrektur.** Zeile 19 auf «Vermietet / Vermietet ab {Datum} / Leer / Leer seit {Datum} / Gesperrt» ändern. Damit entfällt auch das ❓ bei «re-let» (#83 nachführen). Die Vorschläge folgen der vorhandenen Wortwahl: «Loué jusqu’au», «dès le» aus `dashboard_relet_from`, «Locato fino al», «Let until», «Futur» aus dem Vertragsstatus, «décompte des charges», «conteggio spese accessorie», «utility cost statement», «jours de location», «giorni di locazione», «days rented».

| Deutsch | Français | Italiano | English |
|---|---|---|---|
| Vermietet ab {Datum} | Loué dès le {date} | Locato dal {date} | Let from {date} |
| Vermietet ab … (Filter, Legende, Kennzahl) | Loué dès le … | Locato dal … | Let from … |
| {n} vermietet ab {Datum} | {count} loué(s) dès le {date} | {count} locato/i dal {date} | {count} let from {date} |
| Leer seit {Datum} | Vacant depuis le {date} | Sfitto dal {date} | Vacant since {date} |
| Wohnung {Nr} leer seit {Datum} | Appartement {number} vacant depuis le {date} | Appartamento {number} sfitto dal {date} | Apartment {number} vacant since {date} |
| Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter. | En tant que bailleur, vous supportez les frais accessoires d’un appartement vacant. | Le spese accessorie di un appartamento sfitto sono a Suo carico in quanto locatore. | As the landlord, you bear the utility costs of a vacant apartment. |
| Frühere Mietverträge | Contrats de bail antérieurs | Contratti di locazione precedenti | Previous rental contracts |
| Bleibt als Historie erhalten: Nebenkostenabrechnungen brauchen seine Mietstage. | Reste dans l’historique : les décomptes des charges ont besoin de ses jours de location. | Resta nella storia: i conteggi spese accessorie hanno bisogno dei suoi giorni di locazione. | Kept as history: utility cost statements need its days rented. |
| Zu diesem Mietvertrag gibt es (in Dwello) keine Nebenkostenabrechnung. | Il n’existe (dans Dwello) aucun décompte des charges pour ce contrat de bail. | Per questo contratto di locazione non esiste (in Dwello) alcun conteggio spese accessorie. | There is no utility cost statement (in Dwello) for this rental contract. |
| Künftig (Mieter) | Futur | Futuro | Future |
| Künftige Mieter (Filter) | Futurs locataires | Inquilini futuri | Future tenants |

«Historie» heisst in fr/it schon «historique» und «storia» (`messages/fr.json:1394`, `messages/it.json:1394`). Im Englischen heisst es dort «history». Zu prüfen ist das grammatische Geschlecht von fr «Futur» und it «Futuro» für eine Mieterin. Das Kennzeichen bezieht sich auf «locataire» bzw. «inquilino»; das passt zur bestehenden Form «Actif»/«Attivo».

Ebenfalls anzupassen sind `glossary_status_text` (`messages/de.json:112`) und `apartments_legend_text` (`:478`) samt fr/it/en. Beide nennen noch «Wiedervermietet», und kein Szenario prüft sie (Hilfeseite: `src/__tests__/help-page.dom.test.ts`).

### V-7 (Nit, Verwalter): «Vermietet ab …» als Beschriftung

**Beleg.** `dashboard.feature`, Beispiele «Vermietet ab …». Geplant für Statusfilter, Legende und Kennzahl.
**Warum.** Der Product Owner hat das entschieden, und es ist verständlich. Ein Screenreader liest die Auslassungspunkte aber nicht oder als «Punkt Punkt Punkt», und in der Kennzahl wirkt der Text abgeschnitten. Kein Fachfehler.
**Korrektur.** Keine nötig. Höchstens bei der Persona- oder a11y-Prüfung darauf achten.

### V-8 (Nit, Verwalter): Gesperrt nach dem Auszug

**Beleg.** `UBIQUITOUS_LANGUAGE.md:22`: Gesperrt = von Hand gesperrt, z. B. Renovation. #145 nennt nur «Leer».
**Warum.** Auch bei einer gesperrten Wohnung trägt der Vermieter die Nebenkosten (VMWG Art. 7 Abs. 1). Für den Laien ist das selbstverständlich, also kein Handlungsbedarf in diesem Pull Request.

### M-1 (Nit, Mietrecht): Historie ist auch für den Vormietzins nötig

**Beleg.** Geplante Hilfe: «Bleibt als Historie erhalten: Nebenkostenabrechnungen brauchen seine Mietstage.» Art. 256a Abs. 2 OR: «Ebenso kann der Mieter verlangen, dass ihm die Höhe des Mietzinses des vorangegangenen Mietverhältnisses mitgeteilt wird.»
**Warum.** Der Grund in der Hilfe stimmt, ist aber nicht der einzige. Wer einen früheren Vertrag löscht, verliert auch den Vormietzins, den der Nachmieter verlangen kann. Der Text ist vom Product Owner entschieden (A-8). Darum nur ein Hinweis, keine Änderung ohne seinen Entscheid.

### M-2 (Nit, Mietrecht): Ausnahme in Art. 7 Abs. 2 VMWG

**Beleg.** VMWG Art. 7 Abs. 2: «Sind keine Geräte zur Erfassung des Wärmeverbrauchs der einzelnen Verbraucher installiert und wurden nicht vermietete Wohn- und Geschäftsräume nachweisbar nur soweit geheizt, als dies zur Verhinderung von Frostschäden notwendig ist, muss der Vermieter nur einen Teil der Heizungskosten übernehmen, die nach dem normalen Verteilungsschlüssel auf Wohn- und Geschäftsräume entfallen.»
**Warum.** Die Ausnahme entlastet den Vermieter. Dwello wendet sie nicht an (#188), also trägt er in Dwello immer den ganzen Anteil. Die Hilfe sagt genau das, und den Mieter benachteiligt das nicht. Nichts zu ändern.

## Fehlende Begriffe (Issues durch den Aufrufer, Labels `fachlich`, `entscheiden`)

1. «Leer seit {Datum}» im Glossareintrag Mietstatus, Wortlaut siehe V-5. Alternativ als Zusatz zu #279 («Leerstand»), falls der Product Owner beides zusammen entscheiden will.
2. Regel des Mieterstatus bei beendetem und künftigem Vertrag, siehe V-3. Gehört als Kommentar zu #140 (Glossar «Mieter»), wenn dieses noch offen ist.
3. Hilfe zu «Vermietet ab» mit dem Hinweis auf die Nebenkosten bis zum Vertragsbeginn, siehe V-1.

## Nicht bestätigt

- **Leerstand bei den übrigen Nebenkosten (nicht Heizung).** Dass der Vermieter auch diese trägt, ergibt sich nicht aus einem eigenen Gesetzestext. Es folgt aus Art. 257a Abs. 2 und Art. 257b Abs. 1 OR (zitiert oben; «tatsächlichen Aufwendungen … für Leistungen, die mit dem Gebrauch zusammenhängen») und aus der Praxis. `docs/nebenkostenabrechnung-anforderungen.md:70, 162` führt das als «unsicher-B». Ein Bundesgerichtsentscheid dazu wurde nicht gesucht. Für die Hilfe genügt das, weil Dwello so rechnet (#188).
- **Verjährung von Nebenkostenforderungen** nach Art. 128 Ziff. 1 OR (V-2): Ob Nebenkosten als «andere periodische Leistungen» gelten, wurde nicht auf Fedlex oder in der Rechtsprechung geprüft und ist **unsicher**.
- **Ortsüblicher Rückgabetag** (z. B. Rückgabe am nächsten Werktag, wenn das Vertragsende auf einen Sonntag fällt): kantonaler Ortsgebrauch, nicht geprüft. Für «Leer seit» ist das ohne Belang, weil das Vertragsende und nicht die Rückgabe zählt.
- **Die Übersetzungsvorschläge (V-6)** sind aus `i18n-begriffe.md` und den vorhandenen `messages/{fr,it,en}.json` abgeleitet. Mit einer Muttersprachlerin oder einem Muttersprachler bzw. dem Wortlaut von Formularen aus der Romandie oder dem Tessin sind sie nicht abgeglichen.
- **Die Texte der Issues #58, #117 und #145** wurden nicht auf GitHub gelesen, sondern aus der Zusammenfassung des Aufrufers übernommen. Gelesen wurden `docs/anforderungen-vertragsende.md` (A-8, Zeilen 250–268) und die Glossareinträge, die #58 und #140 betreffen. Diese sind schon nachgeführt.
- **Fedlex-Wortlaute** stammen aus den HTML-Dateien im Fedlex-Filestore: OR Stand 01.01.2026, VMWG Stand 01.06.2020. Ob seither eine neuere VMWG-Fassung gilt, wurde nicht geprüft.
