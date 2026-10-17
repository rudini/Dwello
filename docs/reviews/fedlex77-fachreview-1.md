# Fach-Review #77 (F-17a), Runde 1

Gegenstand: Commit 1373aee1 (Worktree `review-fedlex77-fach`), Diff `docs/nebenkostenabrechnung-anforderungen.md` und `implementation_plan.md`; dazu die PDF-Hinweise in `backend/src/services/pdf.service.ts` und die Hilfetexte in `messages/{de,fr,it,en}.json`, die Art. 257a, 257b, 269d, 270b, 128 OR oder Art. 4–8 VMWG zitieren, und `UBIQUITOUS_LANGUAGE.md`.

Grundlage: Fedlex-Texte im Scratchpad (`fedlex/or-{de,fr,it}.txt`, OR Stand 1.10.2026, Kopfzeile «Stand am 1. Oktober 2026» geprüft; `fedlex/vmwg-{de,fr,it}.txt`, VMWG Stand 1.10.2025). Echtheit stichprobenartig geprüft: Die VMWG-PDF/A von `fedlex.data.admin.ch` (WebFetch) hat dieselbe Grösse wie die lokale Datei (221,5 KB = 226 776 Byte), Titel und Gliederung stimmen.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Minor | `contracts_fee_help` (de): «ab dem nächsten Kündigungstermin» statt Fedlex «nächstmöglichen»; Zehn-Tage-Vorlauf und Begründung fehlen in allen Sprachen |
| M-2 | Mietrecht | Minor | Anforderungen Thema 5: «Art. 8 Abs. 2 VMWG für die Heizkosten» – der Normtext beschränkt die Einsicht in die Originalunterlagen nicht auf Heizkosten |
| M-3 | Mietrecht | Minor | Anforderungen Thema 3, Umsetzungsvorschlag Art. 8 Abs. 2: Bestand «einsehen» statt «Auskunft verlangen» (widerspricht dem daneben zitierten Wortlaut) |
| M-4 | Mietrecht | Nit | `noteReceipts` (alle Sprachen): die bevollmächtigte Person steht nicht in Art. 257b Abs. 2 OR; Zitat könnte Art. 8 Abs. 2 VMWG ergänzen |
| M-5 | Mietrecht | Nit | `categories_reason_administration`: «Art. 5 Absatz 2 VMWG» – genau ist Bst. i |
| M-6 | Mietrecht | Nit | `invoices_service_period_boiler`: Art. 5 Abs. 2 Bst. e nennt «der Boiler» ausdrücklich; «umstritten» ist nicht auf Fedlex belegbar, Abgrenzung über Abs. 1 («zentralen») fehlt |
| V-1 | Verwalter | Nit | «Methodische Einschränkung» sagt weiterhin «Kein Normtext wurde im amtlichen Wortlaut auf Fedlex geprüft» |
| V-2 | Verwalter | Nit | «Stand»: «Art. 4 Abs. 3 und 5–6c VMWG» im Prompt – der Prompt enthält Art. 5 Abs. 1–2 und Art. 6c nur Abs. 3 |
| V-3 | Verwalter | Nit | Zeile «Heizung und Warmwasser aus einer Anlage»: Fedlex-Aussage ohne Link, Sicherheit unverändert «unsicher-B» |
| V-4 | Verwalter | Nit | Abschnitt PDF-Aufbau Punkt 7: «Belegeinsicht jederzeit» – Fedlex sagt «auf Verlangen» |
| V-5 | Verwalter | Nit | Zeile Verwaltungskosten verweist auf «Glossar: Richtwert, keine Obergrenze»; das Glossar enthält «Richtwert» nicht mehr |
| M-7 | Mietrecht | Nit | `contracts_fee_help` (fr): «terme de congé»; Fedlex fr «terme de résiliation» |

Keine Blocker, keine Major.

## Befunde

### M-1 (Minor) `contracts_fee_help`: «nächsten» statt «nächstmöglichen» Kündigungstermin

Beleg: `messages/de.json:743`: «Eine neue Verwaltungspauschale während der Mietdauer müssen Sie dem Mieter mit dem amtlichen Formular mitteilen; sie gilt erst ab dem nächsten Kündigungstermin (Art. 269d OR).» fr/it/en: Zeile 743 sinngemäss gleich («prochain terme de congé», «prossima scadenza di disdetta», «next termination date»).

Fedlex Art. 269d Abs. 1 OR (de): «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.» Abs. 3: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich […] neue Nebenkosten einzuführen.» fr: «pour le prochain terme de résiliation. L'avis […] doit parvenir au locataire dix jours au moins avant le début du délai de résiliation»; it: «per la prossima scadenza di disdetta […] almeno dieci giorni prima dell'inizio del termine di preavviso».

Warum falsch: Die Schlussfolgerung «passt zu Fedlex» trägt nur für fr/it, und auch dort nur, weil der Zehn-Tage-Vorlauf im selben Satz steht. Der Hilfetext lässt diesen Vorlauf weg. Ein Vermieter mit wenig Erfahrung liest «gilt erst ab dem nächsten Kündigungstermin» als «gilt ab dem nächsten Kündigungstermin». Liegt der nächste Termin näher als Kündigungsfrist plus zehn Tage, ist das falsch. Im Deutschen weicht das Wort zudem vom Gesetz ab («nächstmöglichen»). Die Begründungspflicht (Abs. 1; Nichtigkeitsgrund nach Abs. 2 Bst. b) fehlt ebenfalls. Die Folge einer verspäteten Mitteilung regelt Fedlex nicht (Praxis: Wirkung auf den nächsten zulässigen Termin, **unsicher**). Der Text schadet dem Mieter nicht, führt den Vermieter aber zu einem Termin, der nicht hält. Darum Minor, nicht Major.

Korrektur (Vorschlag; Textänderung mit vorher rotem Test nach CLAUDE.md):
- de: «… müssen Sie dem Mieter mit dem amtlichen Formular mitteilen und begründen, mindestens zehn Tage vor Beginn der Kündigungsfrist. Sie gilt frühestens ab dem nächstmöglichen Kündigungstermin (Art. 269d OR).»
- fr: «… doivent être notifiés au locataire, avec indication des motifs, au moyen de la formule officielle, dix jours au moins avant le début du délai de résiliation ; ils ne s'appliquent qu'à partir du prochain terme de résiliation possible (art. 269d CO).»
- it: «… devono essere comunicate e motivate all'inquilino con il modulo ufficiale, almeno dieci giorni prima dell'inizio del termine di preavviso; valgono solo dalla prossima scadenza di disdetta possibile (art. 269d CO).»
- en: «… must be notified to the tenant with the official form, with reasons, at least ten days before the notice period begins; it applies at the earliest from the next possible termination date (Art. 269d CO).»

Falls der Wortlaut in einem Issue entschieden ist: entscheidet der Product Owner (Issue mit `fachlich`, `entscheiden`).

### M-2 (Minor) Anforderungen: Art. 8 Abs. 2 VMWG «für die Heizkosten»

Beleg: `docs/nebenkostenabrechnung-anforderungen.md`, Thema 5, Zeile Belegeinsicht (Diff-Zeile +92): «Eine Bevollmächtigte nennt Art. 257b Abs. 2 OR nicht, wohl aber Art. 8 Abs. 2 VMWG für die Heizkosten («sein bevollmächtigter Vertreter»)».

Fedlex Art. 8 VMWG, Sachüberschrift «Abrechnung», Verweis «(Art. 257b OR)», nicht «(Art. 257b Abs. 1 OR)» wie Art. 5–7. Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» fr: «consulter les pièces justificatives originales et à demander des renseignements sur l'état des stocks de combustibles»; it gleich.

Warum falsch: Nur der zweite Teil (Heizmaterial) ist auf Heizung beschränkt. Die Einsicht in die «sachdienlichen Originalunterlagen» ist im Wortlaut nicht auf Heizkosten begrenzt, und der Artikel verweist auf ganz Art. 257b OR. Ob Abs. 2 für alle Nebenkosten gilt, ist eine Auslegungsfrage (**unsicher**, keine Rechtsprechung geprüft). Das Dokument stellt eine Auslegung als Normaussage dar und trägt so die Schlussfolgerung zu `noteReceipts`.

Korrektur: «Eine bevollmächtigte Person nennt Art. 257b Abs. 2 OR nicht; Art. 8 Abs. 2 VMWG (Verweis auf Art. 257b OR) nennt «sein bevollmächtigter Vertreter» für die sachdienlichen Originalunterlagen und für den Bestand des Heizmaterials. Ob Abs. 2 über die Heizkosten hinaus gilt, steht nicht im Normtext (unsicher).»

### M-3 (Minor) Anforderungen: Umsetzungsvorschlag zu Art. 8 Abs. 2 sagt «einsehen» für den Bestand

Beleg: Thema 3, Zeile «Einsicht in Originalunterlagen …» (Diff-Zeile +72). Die Spalte Quelle zitiert jetzt «… Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen». Die Spalte Umsetzung schlägt dagegen weiter vor: «Sie oder eine bevollmächtigte Person können die Originalbelege und den Anfangs- und Endbestand des Heizmaterials einsehen.»

Warum falsch: Der Bestand wird nach Fedlex nicht eingesehen, der Mieter kann darüber Auskunft verlangen. Die Zeile ist jetzt «Fedlex geprüft» und widerspricht sich selbst. Das umgesetzte PDF ist richtig (`pdf.service.ts:121` «Über den Anfangs- und Endbestand des Heizmaterials erhalten Sie Auskunft (Art. 8 Abs. 2 VMWG).»). Nur der Vorschlag im Dokument ist veraltet.

Korrektur: Umsetzungsspalte auf den umgesetzten Text stellen, z. B. «Umgesetzt: `noteReceipts` (Belege einsehen, Kontakt) und `noteStock` («Über den Anfangs- und Endbestand des Heizmaterials erhalten Sie Auskunft»)».

### M-4 (Nit) `noteReceipts`: Zitat der bevollmächtigten Person

Beleg: `pdf.service.ts:119` «Sie oder eine bevollmächtigte Person können die Belege einsehen. Melden Sie sich dafür bei {contact} (Art. 257b Abs. 2 OR).»; fr 208, it 297, en 386 gleich aufgebaut. Fedlex Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» (fr «permettre au locataire, à sa demande, de consulter les pièces justificatives»; it «dar visione, a domanda del conduttore, dei documenti giustificativi»).

Bewertung: Die Schlussfolgerung «keine Änderung nötig» hält. Der Satz ist inhaltlich nicht falsch: Art. 8 Abs. 2 VMWG nennt den bevollmächtigten Vertreter. Dass der Mieter sich allgemein vertreten lassen kann (Art. 32 ff. OR), ist **unsicher**, weil nicht auf Fedlex gelesen. Den Mieter führt der Satz nicht in die Irre. Nur das Zitat deckt den Zusatz «oder eine bevollmächtigte Person» nicht. Optional: «(Art. 257b Abs. 2 OR, Art. 8 Abs. 2 VMWG)». Das wäre eine PDF-Änderung mit vorher rotem Test, deshalb nur ein Nit.

### M-5 (Nit) `categories_reason_administration`: Buchstabe fehlt

Beleg: `messages/de.json:1395` «Verwaltungsarbeit für den Heizbetrieb gehört zur Heizung (Art. 5 Absatz 2 VMWG)»; fr/it/en gleich. Fedlex Art. 5 Abs. 2 Bst. i: «die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt». Nicht falsch, nur ungenau; die anderen Hilfetexte nennen den Buchstaben (`categories_reason_chimney` Bst. d, `invoices_service_period_boiler` Bst. e). Vorschlag: «(Art. 5 Absatz 2 Bst. i VMWG)», fr «let. i», it «lett. i», en «let. i».

### M-6 (Nit) `invoices_service_period_boiler`: Boiler steht in Bst. e

Beleg: `messages/de.json:827` «Das Entkalken der zentralen Warmwasseranlage ist umlagefähig (Art. 5 Absatz 2 Bst. e VMWG) … Bei einem Boiler in der Wohnung ist das umstritten …». Fedlex Bst. e: «die periodische Revision der Heizungsanlage einschliesslich des Öltanks sowie das Entkalken der Warmwasseranlage, der Boiler und des Leitungsnetzes»; Abs. 1: «… der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen».

Bewertung: Der zitierte Teil stimmt mit Fedlex überein. Ein Vermieter, der Bst. e nachliest, findet aber «der Boiler» ausdrücklich. Dass das Entkalken eines Boilers in der Wohnung nicht darunter fällt, folgt nur aus Abs. 1 («zentralen»). «Umstritten» ist Praxis und auf Fedlex nicht belegbar (**unsicher**). Für den Mieter ist der Text vorsichtig («im Zweifel nicht umlagefähig»), er schadet ihm nicht. Optional: «… gilt nur für die zentrale Warmwasseraufbereitung (Art. 5 Absatz 1 VMWG)».

### M-7 (Nit) `contracts_fee_help` fr: «terme de congé»

Fedlex fr Art. 269d Abs. 1: «prochain terme de résiliation». Gleichbedeutend, aber nicht der Gesetzeswortlaut. Wenn M-1 umgesetzt wird, gleich mitziehen.

### V-1 (Nit) «Methodische Einschränkung» widerspricht dem neuen «Stand»

Beleg: Diff-Zeile +16: Der Satz «Kein Normtext wurde im amtlichen Wortlaut auf Fedlex geprüft.» bleibt stehen, der Folgesatz hebt ihn auf. Vorschlag: «In der ersten Recherche (10.10.2026) wurde kein Normtext im amtlichen Wortlaut auf Fedlex geprüft.»

### V-2 (Nit) «Stand»: Umfang des Prompts

Beleg: Diff-Zeile +10 «Art. 4 Abs. 3 und 5–6c VMWG waren schon für den Prompt der KI wörtlich übernommen». `backend/src/config/llm.ts:56–73` enthält Art. 4 Abs. 3, 5 Abs. 1–2, 6, 6a, 6b und 6c Abs. 3 (so auch richtig in Thema 1, Diff-Zeile +39). Vorschlag: dieselbe Aufzählung wie in Thema 1.

### V-3 (Nit) Zeile «Heizung und Warmwasser aus einer Anlage»

Beleg: Diff-Zeile +118. Die neue Fedlex-Aussage stimmt: Art. 8 Abs. 1 fr «ainsi que de leur répartition entre les locataires», it «della loro ripartizione tra i conduttori». Es fehlen aber der Link mit Fassung, wie ihn die anderen Zeilen haben (Done means #77), und eine Sicherheit «Fedlex geprüft (keine Pflicht zur Aufteilung Heizung/Warmwasser im Normtext)». Die Spalte steht weiter auf «unsicher-B».

### V-4 (Nit) «Belegeinsicht jederzeit»

Beleg: `docs/nebenkostenabrechnung-anforderungen.md:121` (Abschnitt Aufbau des PDF, Punkt 7). Fedlex: «auf Verlangen». «Jederzeit» stammt aus der Praxis (ohne Frist). Vorschlag: «Belegeinsicht auf Verlangen (Art. 257b Abs. 2 OR)».

### V-5 (Nit) Veralteter Verweis auf das Glossar

Beleg: Thema 3, Zeile Verwaltungskosten (Diff-Zeile +73): «Hinweis in der App über 3 % (Glossar: Richtwert, keine Obergrenze)». `UBIQUITOUS_LANGUAGE.md:154` sagt heute «Üblich sind etwa 3 %. Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen (Art. 4 Abs. 3 VMWG).» Das Wort «Richtwert» steht nicht mehr im Glossar. Vorschlag: «(Glossar: üblich etwa 3 %, keine Obergrenze)».

## Bestätigt (mit Quelle)

Anforderungsdokument, gegen Fedlex de (fr/it stichprobenartig):
- Art. 257a Abs. 1 und 2 OR: Wortlaut und Zitat stimmen.
- Art. 257b Abs. 1 und 2 OR: Wortlaut stimmt. «Kein Gewinn» ist richtig als Folgerung gekennzeichnet.
- Art. 256 Abs. 1 und 256b OR: stimmen.
- Art. 269d Abs. 1–4 OR: «vom Kanton genehmigten Formular», «nächstmöglichen», «mindestens zehn Tage vor Beginn der Kündigungsfrist», Nichtigkeit nur nach Abs. 2 Bst. a–c, «neue Nebenkosten einzuführen» (Abs. 3) und die mechanische Unterschrift (Abs. 4, Fussnote 106: in Kraft seit 1. Okt. 2025) stimmen. Die Korrektur «Zehn-Tage-Frist kein Nichtigkeitsgrund» ist richtig.
- Art. 270b Abs. 1 und 2 OR: 30 Tage, Schlichtungsbehörde, «namentlich seine bisherigen Leistungen vermindert oder neue Nebenkosten einführt»: stimmt.
- Art. 128 Ziff. 1 OR («für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen»), Art. 67 Abs. 1 OR (drei Jahre ab Kenntnis, zehn Jahre seit Entstehung; Fussnote 39: in Kraft seit 1. Jan. 2020): stimmen. Dass Nebenkosten «periodische Leistungen» sind, ist richtig als unsicher-B (BGE) markiert.
- Art. 4 Abs. 1–3 VMWG, Art. 5 Abs. 1–3 (Bst. a–i im Wortlaut), Art. 6 Bst. a–b, Art. 6a, 6b, 6c Abs. 3 und 4, Art. 7 Abs. 1 und 2 Bst. a–c, Art. 8 Abs. 1: stimmen. Die Einschränkung von Art. 6 auf Heizungs- und Warmwasserkosten ist richtig (Sachüberschrift «Nicht anrechenbare Heizungs- und Warmwasserkosten»).
- Quellenliste: Fassungen (OR 1.10.2026, VMWG 1.10.2025) und ELI-Links stimmen.

PDF-Hinweise (`pdf.service.ts:119–121, 208–210, 297–299, 386–388`):
- `noteReceipts`: Art. 257b Abs. 2 OR stimmt in de/fr/it (al. 2 / cpv. 2); zum Zusatz «bevollmächtigte Person» siehe M-4.
- `noteHeating`: Art. 8 Abs. 1 VMWG stimmt. Der Hinweis ist nach Fedlex nur ohne detaillierte Abrechnung Pflicht; ihn immer zu drucken ist zulässig und entspricht dem Vorschlag im Anforderungsdokument.
- `noteStock`: «Auskunft» entspricht Art. 8 Abs. 2 («Auskunft zu verlangen», fr «demander des renseignements», it «chiedere informazioni»). Abkürzungen OBLF/OLAL stimmen mit den Fedlex-Erlasstiteln fr/it überein.
- en: «CO» für OR (die übliche englische Abkürzung, nicht die deutsche, anders als im Auftrag beschrieben) und «VMWG» (es gibt keine amtliche englische Abkürzung). Das ist vertretbar.

Hilfetexte `messages/*.json` (de, fr, it, en gleiche Artikel und Absätze): `invoices_missed_text`, `statements_correct_limit`, `statements_later_sent` (Art. 128 Ziff. 1), `invoices_legal_text` (Art. 256 Abs. 1, 256b, 257a), `categories_allocable_help`, `categories_contract_note` (Art. 257a Abs. 2: «besonders vereinbart», sinngemäss «wenn der Mietvertrag sie nennt»), `categories_reason_heating`, `_hot_water`, `_chimney` (Art. 5 Abs. 1, Abs. 2 Bst. d, Art. 6), `_cold_water`, `_wastewater`, `_waste` (Art. 257b Abs. 1 «öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»), `_repairs`, `_building_insurance`, `_property_tax` (Art. 256 Abs. 1, 256b). Ausnahmen: M-1, M-5, M-6, M-7.

Glossar: Die drei im Issue genannten Abweichungen (Zeilen «Art. 257b OR» mit «Reparaturen, Erneuerungen und Steuern gehören nicht dazu», «Art. 257a OR» ohne «oder eines Dritten», «Art. 4 Abs. 3 VMWG» mit «3 % als Richtwert») stehen nicht mehr in `UBIQUITOUS_LANGUAGE.md`: Die verbliebenen Fundstellen (Zeilen 70, 73, 86, 137, 138, 154, 161, 207) zitieren richtig. Zeile 137 zitiert «Anfangs- und Endbestand von Heizmaterialien» wörtlich nach Fedlex. Neue Abweichungen habe ich nicht gefunden. Zeile 154 («Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen») ist eine vertretbare Lesart von Art. 4 Abs. 3 («nach Aufwand oder im Rahmen der üblichen Ansätze»); «etwa 3 %» ist Praxis und nicht als VMWG-Aussage formuliert. Für das Issue empfehle ich einen Kommentar, dass die Abweichungen schon behoben sind (Commits zu #243, z. B. c825422d, b8a6fc70). Damit ist der Punkt «listed in this issue» erledigt.

Formeln: Der Diff ändert keine Formel. Die Anteile in Art. 7 Abs. 2 (1/3, 1/2, 2/3) sind richtig zitiert und in Dwello bewusst nicht umgesetzt (#188); es gibt nichts nachzurechnen.

`implementation_plan.md`: Die abgehakten Punkte «all match Fedlex, no change» gelten nur, wenn M-1 abgelehnt wird. Sonst ist der Punkt für `messages/*.json` zu öffnen.

## Fehlende Begriffe

Keine. Die verwendeten Begriffe (Verwaltungspauschale, Heizmaterial, Beleg, Umlagefähigkeit, Tankbestand) stehen im Glossar.

## Nicht bestätigt

- Allgemeine Stellvertretung bei der Belegeinsicht (Art. 32 ff. OR) nicht auf Fedlex gelesen; ebenso nicht geprüft, ob Art. 8 Abs. 2 VMWG über die Heizkosten hinaus gilt (Lehre/Rechtsprechung nicht gesucht). Gesucht in: `fedlex/vmwg-*.txt`, Art. 8; `fedlex/or-de.txt`, Art. 257b.
- Folge einer verspäteten Mitteilung nach Art. 269d (Wirkung auf den nächsten zulässigen Termin): nicht auf Fedlex geregelt, keine Rechtsprechung geprüft (**unsicher**).
- «Umstritten» beim Entkalken eines Boilers in der Wohnung (`invoices_service_period_boiler`): Praxis, Fedlex sagt nichts dazu.
- Grundgebühren nach Liegenschaftswert und Regenwassergebühr (Hilfetexte zu Wasser, Abwasser, Kehricht): Abgrenzung aus Praxis, im Normtext nicht enthalten (Art. 257b Abs. 1 nennt nur «öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»).
- `categories_reason_capital_improvements` (Art. 269a Bst. b OR, Art. 14 VMWG): ausserhalb des Auftrags von #77, nicht geprüft.
- Echtheit der OR-Textdateien nur über die Kopfzeile und die Fussnoten (106, 107, 39) geprüft, nicht per WebFetch gegen Fedlex (der WebFetch-Konverter liest den komprimierten PDF-Text nicht). Die VMWG-PDF stimmt in der Dateigrösse mit Fedlex überein.
