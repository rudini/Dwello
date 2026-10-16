# Fach-Review #144 (P-17), Runde 1: @wip-Szenarien und geplante Texte

Geprüft im Worktree `review-p17-fach`, Commit 9f0f08d, Diff `5f7e47c..9f0f08d` (`tests/e2e/features/contract-new.feature` Z. 111–126, dazu Steps/Tasks), plus der vom Aufrufer beschriebene Plan (Regel «letzter Mietvertrag», Vorbelegung, Hinweistext).

Ergebnis: kein Blocker, kein Major. Beträge aus dem letzten Mietvertrag vorzuschlagen ist rechtlich zulässig und in der Praxis sinnvoll. Der bisherige Mietzins ist sogar eine Grösse, die das Gesetz dem neuen Mieter zugänglich macht (Art. 256a Abs. 2 OR, Art. 270 Abs. 1 lit. b OR). Die Begriffe stimmen mit dem Glossar überein. Die Minors betreffen den Hinweistext (leere Felder, Format des Zeitraums, Zusatzmiete) und einen Grenzfall der Regel «letzter Mietvertrag».

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Der Hinweistext nennt «Nettomiete, Akonto und Zusatzmiete», auch wenn ein Feld leer bleibt, weil der Betrag dort 0.00 war |
| V-2 | Verwalter | Minor | Das Format des Zeitraums («01.01.2024 bis 31.12.2025», «seit 01.04.2024») weicht vom Format ab, das die App schon verwendet; ein künftiger Mietvertrag ist nicht abgedeckt |
| V-3 | Verwalter | Minor | Bei der Zusatzmiete (Parkplatz, Garage) fehlt der Hinweis, dass der neue Mieter das Objekt oft gar nicht übernimmt |
| V-4 | Verwalter | Minor | Das Szenario prüft weder Zusatzmiete, noch «0.00 bleibt leer», noch «ein eingetippter Betrag wird nie überschrieben», noch «Hinweis verschwindet nach einer Änderung» |
| V-5 | Verwalter | Nit | Der Akonto des Vormieters ist oft nicht kostendeckend; ein kurzer Verweis auf die letzte Nebenkostenabrechnung wäre praxisnah |
| V-6 | Verwalter | Nit | Ob der Hinweis noch gilt, wird am Text gemessen («900» und «900.00»): nach `normalizeAmounts` vergleichen |
| M-1 | Mietrecht | Minor | «Letzter Mietvertrag = spätester Vertragsbeginn» trifft im Grenzfall nicht das «vorangegangene Mietverhältnis» (Art. 256a Abs. 2 OR), wenn ein älterer Mietvertrag nacherfasst wird |
| M-2 | Mietrecht | Minor | Kein Hinweis darauf, dass eine deutliche Erhöhung gegenüber dem bisherigen Mietzins anfechtbar ist (Art. 270 Abs. 1 lit. b OR) und dass manche Kantone das Formular beim neuen Mietvertrag verlangen (Art. 270 Abs. 2 OR); ausserhalb von #144, eigenes Issue empfohlen |
| M-3 | Mietrecht | Nit | Den Namen des Vormieters zu nennen ist zulässig; Hinweis: der Bildschirm kann beim Vertragsabschluss vor dem neuen Mieter offen sein |

## Befunde im Einzelnen

### V-1 (Minor): Der Hinweistext nennt Felder, die leer sind

**Beleg:** Plan: «Zero amounts stay empty (e.g. Zusatzmiete 0.00 → field empty)». Geplanter Text: «Nettomiete, Akonto und Zusatzmiete stammen aus dem letzten Mietvertrag dieser Wohnung …». Bei Akonto 0.00 zeigt `RentStep.svelte` zusätzlich den Hinweis «Kein Akonto» (`advancePaymentNotice`, `src/lib/contract-wizard.ts:76`).

**Warum falsch:** Im Szenario (Zusatzmiete 0.00) sagt der Text, die Zusatzmiete stamme aus dem letzten Mietvertrag, das Feld ist aber leer. Ein unerfahrener Vermieter liest das als «da fehlt etwas». Bei Akonto 0.00 widersprechen sich die beiden Hinweise.

**Behebung:** Den Text allgemein halten, zum Beispiel: «Die Beträge stammen aus dem letzten Mietvertrag dieser Wohnung ({tenant}, {period}). Ein leeres Feld war dort 0.00. Prüfen Sie die Beträge und passen Sie sie an, wenn im neuen Mietvertrag andere gelten.» Alternativ nur die übernommenen Felder nennen (mehr Varianten in vier Sprachen, nicht empfohlen).

### V-2 (Minor): Format des Zeitraums

**Beleg:** `messages/de.json:195-196` («ab {date}, unbefristet», «seit {date}, unbefristet») und `:1381-1382` («{start} – {end}, befristet», «… gekündigt»). Der Plan verwendet «01.01.2024 bis 31.12.2025» und «seit 01.04.2024».

**Warum falsch:** Derselbe Mietvertrag erscheint in der Mietvertragsliste anders als im Hinweis. Ausserdem kann der Mietvertrag mit dem spätesten Vertragsbeginn ein künftiger sein (Mietstatus «Vermietet ab»). Für ihn passt «seit» nicht.

**Behebung:** Die bestehenden Meldungen für den Zeitraum wiederverwenden, zum Beispiel «(Bruno Meier, 01.01.2024 – 31.12.2025, befristet)». Damit sind auch «ab …» und «gekündigt» abgedeckt.

### V-3 (Minor): Zusatzmiete beim Mieterwechsel

**Beleg:** Glossar `UBIQUITOUS_LANGUAGE.md:49`: «Zusatzmiete: Zusätzliche monatliche Kosten (Garage, Parkplatz, Keller).»

**Warum:** In der Praxis werden Parkplatz und Garage beim Mieterwechsel oft nicht mit übernommen oder an jemand anderen vermietet. Wird die Zusatzmiete stillschweigend übernommen, kommt ein Betrag für ein Objekt in den neuen Mietvertrag, das der neue Mieter nicht mietet, und gelangt auch in «Monatlich total».

**Behebung:** Einen Satz im Hinweis ergänzen: «Mietet der neue Mieter zum Beispiel den Parkplatz nicht, leeren Sie die Zusatzmiete.» Nicht übernehmen ist keine Alternative: #144 (Option A) verlangt alle drei Beträge.

### V-4 (Minor): Abdeckung im Szenario

**Beleg:** `contract-new.feature` Z. 120–126: Gesät werden nur Nettomiete 900 und Akonto 150 (Zusatzmiete 0). Der Then-Step prüft Nettomiete, Akonto und das Textstück «aus dem letzten Mietvertrag dieser Wohnung».

**Warum:** Laut #144 sind die Beträge «editable and marked as taken over». Die Regeln des Plans (0.00 bleibt leer, ein eingetippter Betrag wird nie überschrieben, ein Wechsel der Wohnung ersetzt nur vorbelegte Beträge, der Hinweis verschwindet nach einer Änderung, ein wiederhergestellter Entwurf behält seine Beträge) zeigt kein Szenario. Die Zusatzmiete wird nicht übernommen und nicht geprüft.

**Behebung:** Mindestens Zusatzmiete im Given (z.B. «… mit "120" Franken Zusatzmiete») und eine Prüfung «Zusatzmiete leer» bei 0.00 ins E2E-Szenario. Die anderen Regeln reichen als DOM- oder Unit-Tests für `contract-wizard`. Nachgerechnet mit dem Code in `RentStep.svelte` (Summe der drei Felder, leer = 0): 900 + 150 + leer = CHF 1’050.00. Mit Zusatzmiete 120: CHF 1’170.00. Ein Then-Step «Monatlich total CHF 1’050.00» würde zeigen, dass der leere Wert als 0 zählt.

### V-5 (Nit): Akonto und letzte Nebenkostenabrechnung

**Beleg:** `docs/nebenkostenabrechnung-anforderungen.md:80`: «Höhe soll sich an den tatsächlichen Kosten (letzte Abrechnung) orientieren.»

**Warum:** Beim Mieterwechsel ist der neue Mietvertrag der einfachste Zeitpunkt, ein zu tiefes Akonto anzupassen, denn ohne Formular nach Art. 269d geht das erst beim nächsten Mieterwechsel wieder. Der Plan fordert schon allgemein zum Prüfen auf.

**Behebung (optional):** «Richten Sie das Akonto nach der letzten Nebenkostenabrechnung aus.» als Hilfetext. Nicht nötig für #144.

### V-6 (Nit): Vergleich «noch übernommen»

**Beleg:** Plan: «while the three fields still hold exactly the taken-over amounts». `normalizeAmounts` (`src/lib/contract-wizard.ts:83`) bereinigt Eingaben wie «1'450».

**Warum:** Tippt der Vermieter «900» statt «900.00» erneut ein, ist der Betrag fachlich unverändert. Der Hinweis sollte dann bleiben.

**Behebung:** Die Beträge nach dem Normalisieren als Zahlen vergleichen.

### M-1 (Minor): Wie wird der «letzte Mietvertrag» bestimmt?

**Beleg:** Art. 256a Abs. 2 OR (Fedlex, SR 220, Fassung 1.1.2026): «Ebenso kann der Mieter verlangen, dass ihm die Höhe des Mietzinses des vorangegangenen Mietverhältnisses mitgeteilt wird.» Art. 270 Abs. 1 lit. b OR: «der Vermieter den Anfangsmietzins gegenüber dem früheren Mietzins für dieselbe Sache erheblich erhöht hat.»

**Bewertung:** Im Normalfall (Nachmieter, Mieterwechsel, leere Wohnung) ist der Mietvertrag mit dem spätesten Vertragsbeginn genau das «vorangegangene Mietverhältnis». Die Regel ist dafür bestätigt. Sie greift auch richtig, wenn der letzte Mietvertrag schon länger beendet ist (wie im Szenario mit dem Leerstand 2026).

Nicht richtig ist sie, wenn ein Vermieter beim Einstieg in Dwello ältere Mietverträge nacherfasst (z.B. 2019–2023, obwohl schon ein Mietvertrag ab 2024 erfasst ist). Dann werden die Beträge eines späteren Mietvertrags vorgeschlagen. Möglich ist auch, dass schon ein künftiger Mietvertrag erfasst ist.

**Behebung:** Spätestens beim Betreten des Schritts «Miete» (der Vertragsbeginn steht dann fest), solange die Felder noch leer oder vorbelegt sind: den Mietvertrag mit dem spätesten Vertragsbeginn **vor dem neuen Vertragsbeginn** nehmen. Wer die einfache Regel behält: Der Zeitraum im Hinweis (V-2) macht den Fall wenigstens sichtbar. Dann als bewusst offenen Grenzfall im Plan festhalten. Bei gleichem Vertragsbeginn sollte es keinen Gleichstand geben, weil sich Mietverträge derselben Wohnung nicht überschneiden. Nicht im Code geprüft.

**Mietzinsanpassungen:** Dwello speichert keinen Verlauf. Die Beträge stehen am Mietvertrag (`backend/src/db/schema.ts:122-124`). Vorgeschlagen werden also die zuletzt erfassten Beträge. Hat der Vermieter eine Erhöhung nicht nachgetragen, sind sie veraltet. Der Auftrag «Prüfen Sie sie» deckt das ab. Kein eigener Befund.

### M-2 (Minor): Anfangsmietzins und Formularpflicht (ausserhalb von #144)

**Beleg:**
- Art. 270 Abs. 2 OR: «Im Falle von Wohnungsmangel können die Kantone für ihr Gebiet oder einen Teil davon die Verwendung des Formulars gemäss Artikel 269d beim Abschluss eines neuen Mietvertrags obligatorisch erklären.»
- Art. 19 Abs. 3 VMWG (SR 221.213.11, Fassung 1.10.2025): «Die Absätze 1 und 1bis sind sinngemäss anzuwenden, wenn die Kantone im Sinne von Artikel 270 Absatz 2 OR die Verwendung des Formulars beim Abschluss eines neuen Mietvertrags für obligatorisch erklären. Zusätzlich muss dieses Formular enthalten: a. den für den bisherigen Mietzins geltenden Stand des Referenzzinssatzes; …»
- Art. 19 Abs. 1 lit. a Ziff. 1 VMWG: «den bisherigen Mietzins und die bisherige Belastung des Mieters für Nebenkosten».

**Bewertung:** Die Vorbelegung ist damit nicht nur zulässig, sie liefert genau die Angaben (bisheriger Mietzins und bisheriges Akonto), die der Vermieter auf Verlangen (Art. 256a Abs. 2) oder im Formular nennen muss. Unzulässig oder irreführend ist nichts: Der Vermieter darf den Anfangsmietzins frei vereinbaren, und die Anfechtung nach Art. 270 ist Sache des Mieters.

**Hinweis für die Zielgruppe:** Ein unerfahrener Vermieter weiss oft nicht, dass ein deutlich erhöhter Anfangsmietzins anfechtbar ist und dass sein Kanton das Formular verlangen kann.

**Behebung:** Nicht in #144. Wenn gewünscht, ein eigenes Issue (`fachlich`, `entscheiden`) für einen Hilfetext am Feld Nettomiete, zum Beispiel: «Erhöhen Sie die Nettomiete deutlich gegenüber dem letzten Mietvertrag, kann der neue Mieter sie anfechten. In manchen Kantonen müssen Sie den Anfangsmietzins mit dem amtlichen Formular mitteilen.» Welche Kantone das sind, ist nicht bestätigt (siehe unten).

### M-3 (Nit): Name des Vormieters im Hinweis

**Beleg:** Art. 6 Abs. 2 DSG (SR 235.1, Fedlex-Fassung 1.9.2023): «Die Bearbeitung muss nach Treu und Glauben erfolgen und verhältnismässig sein.» Art. 6 Abs. 3: «Personendaten dürfen nur zu einem bestimmten und für die betroffene Person erkennbaren Zweck beschafft werden; sie dürfen nur so bearbeitet werden, dass es mit diesem Zweck vereinbar ist.»

**Bewertung:** Der Hinweis zeigt dem Vermieter seine eigenen Daten zur Verwaltung derselben Wohnung. Das ist mit dem Zweck vereinbar. Es werden keine Daten bekanntgegeben, und es entsteht kein neuer Datenfluss, also ist die Datenschutzerklärung nicht betroffen. Der Name hilft, den richtigen Mietvertrag zu erkennen. Aus der Praxis: Der Assistent ist manchmal beim Vertragsabschluss vor dem neuen Mieter offen. Der neue Mieter darf den bisherigen Mietzins erfahren (Art. 256a Abs. 2), den Namen braucht er nicht. Das genügt nicht für eine Änderung. Wer vorsichtig sein will, nennt nur den Zeitraum.

## Begriffe

Bestätigt aus `UBIQUITOUS_LANGUAGE.md`: Nettomiete (Z. 48), Zusatzmiete (Z. 49), Akonto (Z. 50), Monatlich total (Z. 51), Mietvertrag (Z. 35), Nachmieter (Z. 43: Mietvertrag beginnt nach dem Vertragsende eines gekündigten oder befristeten Mietvertrags; trifft auf Bruno Meier, befristet bis 31.12.2025, und Anna Keller ab 01.01.2027 zu), Vertragsbeginn. Die Reihenfolge im Hinweis (Nettomiete, Akonto, Zusatzmiete) entspricht der Reihenfolge der Felder in `RentStep.svelte`.

Fehlende Begriffe: keine. «Letzter Mietvertrag der Wohnung» ist gewöhnliche Sprache und braucht keinen Glossareintrag. Wer die Regel festhalten will, kann vorschlagen: «Letzter Mietvertrag (einer Wohnung): der Mietvertrag der Wohnung mit dem spätesten Vertragsbeginn vor dem Vertragsbeginn des neuen Mietvertrags; seine Beträge schlägt der Assistent für einen neuen Mietvertrag vor.»

Nit zum Step-Text: «schlägt **die Miete** … vor» meint den Schritt «Miete». Fachlich klingt «Miete» wie Mietzins. Besser wäre «schlägt der Schritt "Miete" … vor».

Das Szenario «Vorgewählte Wohnung bleibt beim Erfassen eines neuen Mieters» (Z. 111–116) entspricht #144 und M2 (`docs/design/personas/helga-k2.md:81`). Fachlich nichts einzuwenden.

## Nicht bestätigt

- **Welche Kantone die Formularpflicht bei neuen Mietverträgen kennen** (Art. 270 Abs. 2 OR): kantonales Recht, nicht auf der Bundesseite von Fedlex. Nicht geprüft, **unsicher**. Gesucht mit `mmx search` (keine brauchbaren Treffer), Fedlex SR 220 und SR 221.213.11.
- **Ab wann ein Anfangsmietzins «erheblich erhöht» ist** (Art. 270 Abs. 1 lit. b OR): Das ist Rechtsprechung, nicht Gesetz. Nicht geprüft, **unsicher**. Für #144 nicht nötig.
- **Wortlaut auf Fedlex:** Art. 256a, 269d und 270 OR stammen aus der Fedlex-Fassung vom 1.1.2026, Art. 19 VMWG aus der Fassung vom 1.10.2025, Art. 6 DSG aus der Fassung vom 1.9.2023 (neuere Fassungen lieferte der Filestore nicht als Text). Die Absatznummern sind aus dem HTML abgeleitet, weil die Hochzahlen beim Extrahieren verloren gingen. Die Zuordnung (z.B. «1bis» in Art. 19 Abs. 3 VMWG) folgt dem Aufbau des Artikels.
- **Ob sich Mietverträge derselben Wohnung überschneiden können** (Gleichstand beim spätesten Vertragsbeginn, M-1): nicht im Backend geprüft.
- **Verhalten beim wiederhergestellten Entwurf und beim Abbrechen im Mieterformular** (Persona M2: «Abbrechen» führt auf `/contracts/new` ohne Wohnung): keine fachliche Regel, nicht geprüft. Der Plan nennt das Abbrechen nicht. Bitte prüfen, ob es zu #144 gehört.
