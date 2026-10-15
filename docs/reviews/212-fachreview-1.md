# Fachreview #212, Runde 1: Prüfregeln im Prompt «umlagefähig»

Gegenstand: `212-proposed-prompt.md` (Regeln «SO PRÜFST DU», neues JSON-Beispiel) zum `ALLOCABILITY_PROMPT` in `backend/src/config/llm.ts:140-161`, Worktree `review-212-fach` (Commit 7a3e65a). Rechtsgrundlage: Fedlex-Download im Scratchpad (`fedlex/or.html`, Stand 1. Oktober 2026; `fedlex/vmwg.html`). Die Zitate in `LEGAL_BASIS` (`llm.ts:47-72`) habe ich gegen diese Dateien geprüft: Art. 256 Abs. 1, 256b, 257a Abs. 1–2, 257b Abs. 1 OR und Art. 4 Abs. 3, 5 Abs. 1–2, 6, 6a, 6b VMWG stimmen wörtlich überein.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Regel 1 («ist sie ein Teil davon, gilt deren Einstufung») ohne Vorrang für Reparatur/Ersatz führt zu falschen Antworten: Liftreparatur, Ersatzteile Lift, Neubepflanzung, Anschaffung Rasenmäher, Ersatz der Waschmaschine |
| M-2 | Mietrecht | Major | Regel 3 weist alle öffentlichen Abgaben dem Vermieter zu; Art. 257b Abs. 1 OR macht öffentliche Abgaben, die sich aus dem Gebrauch ergeben, zu Nebenkosten |
| M-3 | Mietrecht | Minor | Regel 3: Wertvermehrung wird auf Art. 256 Abs. 1 OR gestützt (der regelt nur Übergabe und Erhalt); Anschaffung und Ersatz fehlen |
| M-4 | Mietrecht / Verwalter | Minor | «Pflege» in Regel 3 steht nicht im Gesetz, überschneidet sich mit Unterhalt und zieht neue Kategorien wie Wartung von Rauchmeldern oder das Entfernen eines Wespennests auf «umlagefähig», obwohl die verwandten vordefinierten Kategorien nicht umlagefähig sind |
| M-5 | Mietrecht | Nit | In Regel 3 fehlt bei «sind umlagefähig» der Zusatz «wenn im Mietvertrag vereinbart (Art. 257a Abs. 2 OR)» |
| V-1 | Verwalter | Minor | «Die Listen sind Beispiele und nicht abschliessend» lässt sich mit der abschliessenden Liste im Mietvertrag (Glossar) verwechseln |
| V-2 | Verwalter | Nit | Das Beispiel (Reinigung der Waschküche → Hauswart → umlagefähig) stimmt in der Sache. «Teil von» ist aber das falsche Muster (siehe M-1). Ein Gegenbeispiel fehlt |
| M-6 | Mietrecht | Minor | Schon vorher so (Stub): Die Ablehnung «sanierung\|reparatur» stützt sich auf Art. 257a Abs. 1 OR statt auf Art. 256 Abs. 1 OR |
| V-3 | Verwalter | Nit | Das JSON-Beispiel mit `<true oder false>` ist kein gültiges JSON. Kopiert ein kleines Modell es wörtlich, gibt `parseAllocabilityResponse` null zurück und Dwello macht keinen Vorschlag. Das ist fachlich unschädlich, bitte aber bewusst so entscheiden |

## Befunde

### M-1 (Major): «Teil davon» schlägt Reparaturen der umlagefähigen Kategorie zu

**Beleg:** Regel 1 lautet: «Entspricht die neue Kategorie einer vordefinierten Kategorie oder ist sie ein Teil davon, gilt deren Einstufung.» Sie steht vor Regel 3, und erst Regel 3 nennt Reparatur und Erneuerung. Dazu kommt Regel 3: «Passt keine vordefinierte Kategorie: …». Die Ausschlüsse gelten also nur, wenn Regel 1 nicht greift.

Fälle in `backend/scripts/llm-eval.ts` mit erwartetem Ergebnis `false`, die ein kleines Modell nach Regel 1 dem Thema nach einer umlagefähigen Kategorie zuordnet:
- Liftreparatur, Ersatzteile Lift → Lift
- Heizungsreparatur, Amortisation der Heizungsanlage → Heizung. Regel 2 und Art. 6 VMWG retten das nur, wenn das Modell sie anwendet. Regel 1 sagt aber «gilt deren Einstufung».
- Neubepflanzung im Garten, Anschaffung Rasenmäher → Gartenpflege
- Ersatz der Waschmaschine → Waschküche → Hauswart. Das neue Beispiel bahnt diesen Fehler sogar an.
- Serviceabo Flachdach → mit «Wartung» nahe bei Lift

Das ist genau der Fehler, den #212 beim Treppenhaus in die Gegenrichtung behebt. Die vordefinierten Beschreibungen schliessen Reparaturen zwar mit «ohne …» aus (`0002_stammdaten.sql:20-21`, Lift und Hauswart). Regel 1 verweist aber nur auf die Einstufung, nicht auf die Beschreibung.

**Recht:** Art. 256 Abs. 1 OR: «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.» Art. 6 VMWG: «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.» Die Pflicht zu erhalten liegt beim Vermieter, unabhängig davon, welche Anlage betroffen ist.

**Lösung:** Den Ausschluss als erste Regel setzen und für alle Kategorien gelten lassen. «Teil von» durch «Leistung derselben Art» ersetzen und auf die «ohne …»-Ausschlüsse der Beschreibung verweisen (Wortlaut unten).

### M-2 (Major): Öffentliche Abgaben aus dem Gebrauch sind Nebenkosten

**Beleg:** Regel 3 sagt: «… ebenso die mit der Sache verbundenen Lasten und öffentlichen Abgaben (Art. 256b OR)». Danach trägt der Vermieter alle öffentlichen Abgaben.

**Recht:** Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Art. 256b OR erfasst nur die Abgaben, die «mit der Sache verbunden» sind, etwa eine Steuer auf den Wert der Liegenschaft. Gebühren nach Verbrauch (Abwassergebühr, Kehrichtgebühr) ergeben sich aus dem Gebrauch und sind umlagefähig.

Die Eval-Fälle «Abwassergebühr nach Verbrauch» und «Kehrichtgebühr nach Verbrauch» erwarten `true`. Bei einer neuen Gebühr ohne vordefinierte Entsprechung lehrt Regel 3 die falsche Antwort. Das gilt zum Beispiel für eine Grüngutgebühr nach Gewicht.

**Lösung:** Die Unterscheidung ausdrücklich in die Regel schreiben: Abgaben, die sich aus dem Gebrauch ergeben, sind umlagefähig (Art. 257b Abs. 1 OR). Abgaben, die mit der Sache verbunden sind, trägt der Vermieter (Art. 256b OR). Beispiele für Letztere: Liegenschaftssteuer und Grundgebühren nach dem Wert der Liegenschaft. Das entspricht den Beschreibungen von Kaltwasser und Abwasser in `0002_stammdaten.sql:17-18`.

### M-3 (Minor): Falsche Stütze für Wertvermehrung; Anschaffung und Ersatz fehlen

**Beleg:** Regel 3 nennt «Erhalt, Reparatur, Erneuerung und Wertvermehrung … (Art. 256 Abs. 1 OR)».

**Warum falsch:** Art. 256 Abs. 1 OR regelt nur Übergabe und Erhalt (Zitat bei M-1). Wertvermehrende Investitionen sind keine Leistung, die mit dem Gebrauch zusammenhängt (Art. 257b Abs. 1 OR). Der Vermieter kann sie allenfalls über den Mietzins weitergeben, siehe Art. 269a lit. b OR: Mietzinse sind in der Regel nicht missbräuchlich, wenn sie «durch Kostensteigerungen oder Mehrleistungen des Vermieters begründet sind». Diese Bestimmung steht nicht in `LEGAL_BASIS`, und das Modell soll nur daraus zitieren. «Anschaffung» und «Ersatz» fehlen, obwohl die Eval-Fälle «Anschaffung Rasenmäher» und «Ersatz der Waschmaschine» sie brauchen.

**Lösung:** «Reparatur, Ersatz, Erneuerung, Renovation, Anschaffung und wertvermehrende Investitionen» nennen. Den Erhalt auf Art. 256 Abs. 1 OR stützen, alles andere auf «keine Nebenkosten, Art. 257b Abs. 1 OR».

### M-4 (Minor): «Pflege»

**Beleg:** Regel 3 nennt «(Betrieb, Reinigung, Pflege, Verbrauch)».

**Warum:** Art. 257b Abs. 1 OR spricht von «Heizungs-, Warmwasser- und ähnliche[n] Betriebskosten». «Pflege» kommt dort nicht vor. Für ein kleines Modell liegt das Wort nahe bei Unterhalt und Wartung. Dwello führt aber «Feuerlöscher-Wartung» und «Schädlingsbekämpfung» als nicht umlagefähig (`0002_stammdaten.sql:38-39`, Glossar «Nicht umlagefähig»). Eine neue Kategorie wie «Wartung der Rauchmelder» oder «Wespennest entfernen» landet über «Pflege/Betrieb» bei «umlagefähig». Ob Dwello solche Fälle so einstufen will, bleibt offen. Die Rechtslage dazu habe ich nicht belegt, siehe «Nicht bestätigt».

**Lösung:** «Pflege» streichen. Die Gartenpflege ist ohnehin vordefiniert. Wartung von Brandschutzeinrichtungen und Schädlingsbekämpfung ausdrücklich den vordefinierten Kategorien zuordnen (Wortlaut unten).

### M-5 (Nit): Vereinbarung

Regel 3 sagt «sind umlagefähig». Art. 257a Abs. 2 OR lautet: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Die Überschrift der vordefinierten Liste (`llm.ts:146`) sagt es schon. Für Regel 3 genügt der Zusatz «wenn im Mietvertrag vereinbart».

### V-1 (Minor): «nicht abschliessend»

**Beleg:** Das Glossar definiert «Umlagefähige Nebenkosten» als «Kosten, die der Vermieter dem Mieter in Rechnung stellen darf (abschliessende Liste im Mietvertrag)» (`UBIQUITOUS_LANGUAGE.md:184`). Der Prompt meint dagegen Dwellos vordefinierte Kategorien.

**Lösung:** Statt «Die Listen sind Beispiele und nicht abschliessend» besser «Die vordefinierten Kategorien sind nicht vollständig». Achtung: Der Stub prüft den alten Satz wörtlich (`backend/scripts/llm-stub.ts`, `when`: `prompt.includes('Die Listen sind Beispiele und nicht abschliessend.')`). Dort muss der Satz mitgeändert werden.

### V-2 (Nit): Beispiel Waschküche

**Bestätigt in der Sache:** Die Reinigung der Waschküche ist umlagefähig. Sie ist eine laufende Leistung für einen gemeinsam genutzten Raum, also eine «ähnliche Betriebskost[]» nach Art. 257b Abs. 1 OR. Der vordefinierte Hauswart umfasst den «Lohn für Reinigung» (`0002_stammdaten.sql:21`). In der Praxis gilt das Reinigen von Gemeinschaftsräumen (Waschküche, Keller) als zulässiger Hauswartaufwand (pruefenlassen.ch/nebenkosten/hauswart, nur das Suchergebnis gesehen). Der Fall steht nicht in `llm-eval.ts`. «Hauswart Reinigung» und «Treppenhausreinigung» liegen aber sehr nahe daran.

**Verbesserung:** Wenn eine Reinigungsfirma die Arbeit macht, ist das kein Lohn des Hauswarts. «Teil von «Hauswart»» passt dann wörtlich nicht. «Eine Reinigung wie beim «Hauswart»» passt immer. Ein Gegenbeispiel, das nicht aus der Eval stammt, schützt gegen M-1: «die Reparatur der Waschküchentür ist eine Reparatur und nicht umlagefähig».

### M-6 (Minor, schon vorher so): Stub-Begründung

`backend/scripts/llm-stub.ts` antwortet bei der Regel `match: /sanierung|reparatur/i` mit «Erhalt und Erneuerung des Gebäudes hängen nicht mit dem Gebrauch zusammen (Art. 257a Abs. 1 OR).» Art. 257a Abs. 1 OR definiert, was Nebenkosten sind. Die Pflicht des Vermieters, die Sache zu erhalten, steht in Art. 256 Abs. 1 OR. Das ist derselbe Zitierfehler, den das Modell bei der Treppenhausreinigung gemacht hat. Eine Szenario-Erwartung, die diesen Text prüft, sollte mitgeändert werden. Vorschlag: «Erhalt und Erneuerung trägt der Vermieter (Art. 256 Abs. 1 OR).» Dazu die Übersetzungen fr «(art. 256, al. 1, CO)», it «(art. 256 cpv. 1 CO)», en «(Art. 256 para. 1 CO)».

Das neue JSON-Beispiel streicht «z.B. (Art. 257a Abs. 1 OR)». Das ist richtig: Das alte Beispiel hat eine Ablehnung mit genau diesem Artikel vorgemacht, und das Modell hat es übernommen.

## Korrigierter Wortlaut (ersetzt «SO PRÜFST DU»)

```
SO PRÜFST DU, der Reihe nach:
1. Reparatur, Ersatz, Erneuerung, Renovation, Anschaffung und wertvermehrende Investitionen trägt immer der Vermieter, auch wenn sie eine umlagefähige Kategorie betreffen, z.B. den Lift, die Heizung oder den Garten (Art. 256 Abs. 1 OR; für Heizung und Warmwasser Art. 6 VMWG). Ebenso die mit der Sache verbundenen Lasten und öffentlichen Abgaben, z.B. Gebäudeversicherung und Liegenschaftssteuer (Art. 256b OR).
2. Die vordefinierten Kategorien sind nicht vollständig. Ist die neue Kategorie eine Leistung derselben Art wie eine vordefinierte Kategorie, gilt deren Einstufung; was deren Beschreibung mit «ohne» ausschliesst, gehört nicht dazu. Beispiel: Die Reinigung der Waschküche ist eine Reinigung wie beim «Hauswart» und damit umlagefähig; die Reparatur der Waschküchentür ist eine Reparatur und nicht umlagefähig. Wartung von Brandschutzeinrichtungen gilt wie «Feuerlöscher-Wartung», Bekämpfung von Ungeziefer wie «Schädlingsbekämpfung».
3. Art. 5 und 6 VMWG nur anwenden, wenn die Kategorie Heizung oder Warmwasser betrifft.
4. Passt keine vordefinierte Kategorie: Laufende Kosten für Leistungen, die mit dem Gebrauch zusammenhängen (Betrieb, Reinigung, Verbrauch), und öffentliche Abgaben, die sich aus dem Gebrauch ergeben (z.B. Gebühren nach Verbrauch), sind umlagefähig, wenn im Mietvertrag vereinbart (Art. 257b Abs. 1, Art. 257a Abs. 2 OR). Abgaben, die vom Wert der Liegenschaft abhängen, trägt der Vermieter (Art. 256b OR).
```

Hinweise zur Umsetzung:
- Den Satz im `when` des Stubs anpassen (V-1).
- Die Wortlaute «Feuerlöscher-Wartung» und «Schädlingsbekämpfung» in Regel 2 sind die deutschen Namen. Die Prompt-Liste zeigt sie als `Fire Extinguisher Maintenance (Feuerlöscher-Wartung)` und `Pest Control (Schädlingsbekämpfung)` (`llm.ts:87`). Das passt.
- Ob das kleine Modell die Treppenhausreinigung danach richtig beurteilt, muss `bun run llm:eval` mit qwen2.5:3b zeigen. Das habe ich nicht ausgeführt.

## Fachbegriffe

Ich habe die Begriffe gegen `UBIQUITOUS_LANGUAGE.md` geprüft:
- Bestätigt: Vermieter (Z. 25), Mieter (Z. 23), Mietvertrag (Z. 34), Kategorie (Z. 71) und umlagefähig. Die Kategorienamen Hauswart, Lift, Gartenpflege, Gebäudeversicherung, Liegenschaftssteuer, Feuerlöscher-Wartung und Schädlingsbekämpfung stehen in den Listen der Z. 76 und 80.
- «Waschküche» und «Brandschutzeinrichtungen» sind Alltagswörter. «Brandschutzeinrichtungen» steht zudem in der Beschreibung `0002_stammdaten.sql:39`. Beides sind keine Fachbegriffe, für die ein Issue nötig wäre.
- «vordefinierte Kategorie» steht nicht im Glossar. Der Prompt (`llm.ts:146,149`) verwendet es schon vor #212. Ein Issue ist nicht nötig, weil das Wort nur im Prompt steht und nicht in der Oberfläche. Sollte es in der Oberfläche auftauchen, wäre ein Glossarvorschlag fällig: «Vordefinierte Kategorie: Kategorie, die Dwello mitbringt (Stammdaten); der Vermieter kann eigene Kategorien ergänzen.»

## Bestätigt

- Regel 2: Die Sachüberschriften auf Fedlex lauten «Art. 5 Anrechenbare Heizungs- und Warmwasserkosten (Art. 257b Abs. 1 OR)» und «Art. 6 Nicht anrechenbare Heizungs- und Warmwasserkosten (Art. 257b Abs. 1 OR)». Art. 5 und 6 gelten also nur für Heizung und Warmwasser. Die Regel ist richtig. Sie behebt den beobachteten Fehler («nicht als Heizungs- oder Warmwasserkosten anrechenbar»). Sie wiederholt `llm.ts:72`, was bei einem kleinen Modell sinnvoll ist. Art. 6b VMWG (ZEV) bleibt anwendbar, die Regel sperrt ihn nicht.
- Regel 3, Teil «laufende Kosten für Leistungen, die mit dem Gebrauch zusammenhängen» mit Verweis auf Art. 257b Abs. 1 OR: stimmt mit dem Wortlaut überein (Zitat bei M-2).
- Lasten und öffentliche Abgaben nach Art. 256b OR: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.» Das stimmt, aber nur mit der Abgrenzung aus M-2.
- Vordefinierte nicht umlagefähige Kategorien nach dem korrigierten Wortlaut: Gebäudeversicherung, Liegenschaftssteuer, Hypothekarzinsen, Reparaturen, Renovation und Wertvermehrende Investitionen bleiben nicht umlagefähig, über die neue Regel 1 und den Listenabgleich in Regel 2. Schädlingsbekämpfung und Feuerlöscher-Wartung bleiben es über den Listenabgleich in Regel 2. Nach dem vorgeschlagenen Wortlaut der Kopie zieht dagegen «Pflege/Betrieb» in Regel 3 neue, verwandte Kategorien auf «umlagefähig» (M-4).

## Nicht bestätigt

- Gebäudeversicherung als «Last» im Sinn von Art. 256b OR: Der Fedlex-Wortlaut nennt keine Versicherungen. Die Zuordnung stammt aus Lehre und Praxis. **unsicher**. Gesucht habe ich in `fedlex/or.html` (Art. 256b). Die Einstufung als nicht umlagefähig steht im Glossar (Z. 80) und in den Stammdaten. Ich prüfe sie nicht neu.
- Schädlingsbekämpfung und Feuerlöscher-Wartung als nicht umlagefähig: Fedlex regelt das nicht ausdrücklich. Ob Wartung ausserhalb von Heizung und Warmwasser eine Betriebskost ist (vgl. Art. 5 Abs. 2 lit. g VMWG «die Wartung», nur Heizung), bleibt **unsicher**. Ich übernehme die Einstufung des Glossars. Das Merkblatt des Mieterverbands «Zulässige und unzulässige Nebenkosten» (2026) habe ich nur als Suchtreffer gesehen, nicht geöffnet.
- Reinigung der Waschküche als Hauswartaufwand: in der Praxis nur über ein Suchergebnis belegt (pruefenlassen.ch). Rechtlich stütze ich mich auf «ähnliche Betriebskosten» in Art. 257b Abs. 1 OR.
- Wirkung auf qwen2.5:3b: nicht gemessen. Ich hatte kein Modell zur Verfügung und habe `bun run llm:eval` nicht ausgeführt.
- Art. 269a lit. b OR (M-3) habe ich nur als Begründung zitiert. Er gehört nicht in den Prompt.
