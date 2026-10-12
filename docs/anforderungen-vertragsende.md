# Anforderungen: Vertragsende und Kündigung

Stand: 12.10.2026. Quelle: Fachreview I (`docs/reviews/I-fachreview-1.md`, Findings IF-2, IF-4, IF-5, IF-6, IF-8, IF-9), Review I Runde 4 (`docs/reviews/I-review-4.md`) und die Personas Helga, Sven und Anna (Läufe I, I2, I3). Umgesetzt sind: «Mietvertrag beenden» auf ein künftiges oder vergangenes Datum, die Bestätigung eines vergangenen Vertragsendes (auch unter «Bearbeiten»), die Ablehnung eines Vertragsendes vor dem Ende einer gespeicherten Abrechnung (im Backend) und die Löschregel (nur vor dem Vertragsbeginn). Dieses Dokument beschreibt, was danach noch fehlt.

Jede Anforderung nennt das Problem, was Dwello tun muss, wie wir es prüfen (Szenarien in der Sprache von `tests/e2e/features`), was nicht dazugehört und welche Fragen der Product Owner oder eine Fachperson klären muss. Begriffe, die nicht im Glossar stehen, sind mit *(Glossar fehlt)* markiert und in `docs/design/offene-punkte.md` vorgeschlagen.

| ID | Anforderung | Priorität | Quelle |
|---|---|---|---|
| A-1 | Befristung und Kündigung unterscheiden | umgesetzt | IF-4, Helga |
| A-2 | Vertragsende unter «Bearbeiten» prüfen | umgesetzt | IF-8, IF-3, Helga, Anna |
| A-3 | Hinweis auf die Kündigungsfrist | mittel | IF-2 |
| A-4 | Bevorstehendes Vertragsende sichtbar machen | mittel | IF-5, Anna, Helga |
| A-5 | Neue Adresse für die Schlussabrechnung | mittel | IF-6, Anna |
| A-6 | Stillschweigend fortgesetzter befristeter Mietvertrag | niedrig | IF-9 |
| A-7 | Doppelt erfassten Mietvertrag entfernen | mittel | Anna (I2, M2) |
| A-8 | Früheren Mietvertrag als Historie erkennbar machen | mittel | Anna (I2, M3) |
| A-9 | «Noch nicht abgerechnet» nach den Mietverträgen der Periode | umgesetzt | Helga (I3 M3, I4 M2) |
| A-10 | Abrechnung nach einem geänderten Vertragsende neu erstellen | mittel | Anna (I2 M1, I3 M1–M3) |
| A-11 | Versendete Abrechnung korrigieren | mittel | Anna (I4 M1), Review I-6 |

Priorität: «hoch» heisst vor dem ersten echten Einsatz, weil sonst falsche Daten oder Geldfolgen entstehen. «mittel» verhindert einen wahrscheinlichen Fehler eines Laien. «niedrig» betrifft einen seltenen Fall.

---

## A-1 Befristung und Kündigung unterscheiden – umgesetzt

**Umgesetzt** (Session 15): Spalte `rental_contracts.terminated` (*gekündigt*; sonst *vereinbart*), «Mietvertrag beenden» setzt sie. Die Detailseite zeigt «Befristet bis …» oder «Unbefristet, gekündigt auf den …», die Listen (Mietverträge, Wohnung, Mieter) hängen «befristet» oder «gekündigt» an den Zeitraum. Unter «Bearbeiten» bietet die Vertragsdauer bei einem gekündigten Vertrag «Unbefristet, gekündigt auf den …», «Kündigung aufheben» («Der Mietvertrag läuft dann ohne Ende weiter.») und «Befristet» an. Offen bleiben Punkt 6 (Glossar, Product Owner) und die offene Frage zur Aufhebungsvereinbarung. Unter «Bearbeiten» heisst die Option nur «Befristet»; das Datum steht im Feld darunter (Review J-1, J-7). Die Demo-Daten kennzeichnen die Vormieter als gekündigt; ältere Verträge gelten nach Punkt 5 als befristet.


**Problem.** Ein befristeter Mietvertrag endet am vereinbarten Tag ohne Kündigung. Ein unbefristeter endet erst durch eine Kündigung auf einen Kündigungstermin *(Glossar fehlt)*. Dwello speichert beides im selben Feld «Vertragsende». Nach «Beenden» zeigt der Assistent unter «Bearbeiten» einen gekündigten unbefristeten Vertrag als «Befristet: Der Mietvertrag endet an einem festen Tag, ohne Kündigung». Das ist rechtlich falsch, und wer «befristet» liest, prüft die Kündigung nicht mehr. Ausserdem passt die Definition im Glossar («leer bei unbefristeten Verträgen») nicht mehr.

**Anforderungen**

1. Dwello merkt sich, wie das Vertragsende entstanden ist: *vereinbart* (befristeter Vertrag) oder *gekündigt* (unbefristeter Vertrag).
2. «Mietvertrag beenden» setzt immer *gekündigt*. Wer im Assistenten «Befristet» wählt, setzt *vereinbart*.
3. Die Detailseite, die Mietvertragsliste und der Assistent zeigen:
   - befristet: «Befristet bis TT.MM.JJJJ»,
   - gekündigt: «Unbefristet, gekündigt auf den TT.MM.JJJJ».
4. Im Assistenten kann man bei einem gekündigten Vertrag die Kündigung zurücknehmen («Kündigung aufheben»). Der Vertrag ist danach wieder unbefristet ohne Vertragsende. Die Aktion nennt ihre Folge: «Der Mietvertrag läuft dann ohne Ende weiter.»
5. Bestehende Verträge mit Vertragsende gelten als *vereinbart*. Eine Datenmigration ist nicht nötig, solange es keine produktive Datenbank gibt; die Spalte kommt in `0001_schema.sql`. Zu A-6: Die Aufgabe dort gilt nur für Verträge, deren vereinbartes Ende nach der Einführung von A-1 liegt; sonst fragt die Übersicht nach jedem alten befristeten Vertrag.
6. Der Product Owner passt die Definition von «Vertragsende» im Glossar an. Vorschlag: «Letzter Tag des Mietverhältnisses: bei befristeten Verträgen vereinbart, bei unbefristeten der Kündigungstermin. Leer, solange ein unbefristeter Vertrag nicht gekündigt ist.»

**Akzeptanzkriterien**

```gherkin
Szenario: Gekündigter Mietvertrag bleibt unbefristet
  Angenommen "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken
  Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beendet
  Dann zeigt der Mietvertrag "Unbefristet, gekündigt auf den 31.03.2099"
  Und zeigt der Assistent beim Bearbeiten "Unbefristet, gekündigt auf den 31.03.2099"

Szenario: Befristeter Mietvertrag
  Angenommen "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2099-12-31" für "900" Franken
  Dann zeigt der Mietvertrag "Befristet bis 31.12.2099"

Szenario: Kündigung aufheben
  Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
  Wenn der Liegenschaftsverwalter die Kündigung aufhebt
  Dann ist der Mietvertrag unbefristet
```

**Nicht dazu:** wer gekündigt hat (Mieter oder Vermieter), das Datum des Kündigungsschreibens (siehe A-3), Aufhebungsvereinbarungen als eigene Art.

**Offene Fragen:** Braucht es «Aufhebungsvereinbarung» (beide Parteien beenden im Einvernehmen) als dritte Art, oder genügt *gekündigt*?

---

## A-2 Vertragsende unter «Bearbeiten» prüfen – umgesetzt

Umgesetzt nach Review I Runde 4 und den Personas Anna (I2, Blocker B1) und Helga (I3, M4):

- Ein geändertes Vertragsende in der Vergangenheit verlangt im Formular dieselbe Bestätigung wie im Dialog «Beenden» (`src/routes/contracts/PastEndConfirm.svelte`). Ein unverändertes Vertragsende wird nicht nochmals bestätigt.
- Jede Abrechnung speichert ihre abgerechneten Tage (`rental_start`, `rental_end`). Das Backend lehnt neue Vertragsdaten ab, die diese Tage ändern würden, kürzer oder länger (`updateContract`, 409 mit den Abrechnungen; Entscheid des Product Owners nach Review I Runde 6). Bei einem Entwurf sagt Dwello: «Die Nebenkostenabrechnung … (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.» Bei einer versendeten oder bezahlten Abrechnung sagt Dwello, dass sie bleibt und das Datum sich darum nicht speichern lässt; stimmt es, klärt der Verwalter die Korrektur direkt mit dem Mieter (siehe A-11).
- Die Bestätigung unter «Bearbeiten» prüft nur der Browser: Das Formular speichert über die BFF-Weiterleitung `PUT /api/contracts/[id]`, nicht über eine Server-Aktion. Die Prüfung gegen die Abrechnungen macht das Backend.
- Szenarien in `tests/e2e/features/contract-edit.feature` und `contract-detail.feature`, Backend-Test `contract-end.pg.test.ts`.

**Offen:** siehe A-10.

---

## A-3 Hinweis auf die Kündigungsfrist

**Problem.** Für Wohnungen gilt eine Kündigungsfrist *(Glossar fehlt)* von mindestens 3 Monaten auf einen ortsüblichen Termin (Art. 266c OR). Eine zu späte Kündigung gilt erst auf den nächsten Termin (Art. 266a Abs. 2 OR). Trägt der Verwalter das Datum aus einem zu spät eingegangenen Kündigungsschreiben ein, ist die Wohnung in Dwello zu früh leer: Die Nebenkosten dieser Monate gehen an den Vermieter, das Akonto des Mieters wird nicht mehr gerechnet. Heute steht nur ein allgemeiner Satz im Dialog.

**Anforderungen**

1. Der Dialog «Mietvertrag beenden» fragt zusätzlich: «Kündigung erhalten am» (Datum, optional, leer). Kein Vorschlag: Heute wäre bei jeder spät erfassten Kündigung falsch und löste den Hinweis aus Punkt 2 grundlos aus. Hilfe am Feld: «Der Tag, an dem das Kündigungsschreiben angekommen ist.»
2. Ist «Kündigung erhalten am» ausgefüllt und liegen bis zum Vertragsende weniger als 3 Monate, zeigt Dwello einen Hinweis, keine Sperre: «Zwischen Eingang und Vertragsende liegen weniger als 3 Monate. Dann gilt die Kündigung wohl erst auf den nächsten Kündigungstermin. Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag, oder Sie haben das Ende mit dem Mieter vereinbart.»
3. Der Verwalter kann trotzdem speichern. Dwello prüft keine ortsüblichen Termine und keine Formvorschriften; das wäre Rechtsberatung und je nach Gemeinde falsch.
4. «Kündigung erhalten am» wird beim Mietvertrag gespeichert und auf der Detailseite gezeigt.
5. Die Hilfe nennt die Form: «Die Kündigung des Mieters muss schriftlich sein. Bei einer Familienwohnung braucht es die Unterschrift beider Ehegatten.» (Art. 266l, 266m OR; Wortlaut fachlich prüfen.)

**Akzeptanzkriterien**

```gherkin
Szenario: Kündigung mit zu kurzer Frist
  Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beenden will
  Und als Eingang der Kündigung den "2099-02-15" angibt
  Dann weist der Dialog darauf hin, dass weniger als 3 Monate dazwischen liegen
  Und kann der Liegenschaftsverwalter den Mietvertrag trotzdem beenden

Szenario: Kündigung mit genügend Frist
  Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beenden will
  Und als Eingang der Kündigung den "2098-12-15" angibt
  Dann zeigt der Dialog keinen Hinweis auf die Frist
```

**Nicht dazu:** Liste der ortsüblichen Termine, vertraglich längere Fristen, Kündigung durch den Vermieter (amtliches Formular).

**Offene Fragen:** Gilt die 3-Monats-Regel als Faustregel für alle Kantone genügend genau für einen Hinweis? Soll der Hinweis vertraglich längere Fristen kennen (ein Feld «Kündigungsfrist» beim Mietvertrag)?

---

## A-4 Bevorstehendes Vertragsende sichtbar machen

**Voraussetzung:** A-1 (nur *gekündigte* Verträge).

**Problem.** Die Übersicht nennt ein Vertragsende erst 60 Tage vorher als Frist. Die Wohnung zeigt bis zum letzten Tag «Vermietet», ohne Hinweis. In der Kündigungszeit fallen aber Aufgaben an: Wiedervermietung (sonst Leerstand zulasten des Vermieters), Wohnungsabnahme, Rückgabe des Mietzinsdepots, neue Adresse (A-5). Ein Laie, der Dwello wenige Male im Jahr öffnet, verpasst sie.

**Anforderungen**

1. Die Übersicht nennt jedes gekündigte Vertragsende ab dem Tag, an dem es erfasst ist, als Aufgabe «Nachmieter für Wohnung {Nr} suchen» mit dem Text: «Der Mietvertrag von {Name} endet am TT.MM.JJJJ. Suchen Sie einen Nachmieter *(Glossar fehlt)*.» Die Aufgabe verschwindet, sobald für die Wohnung ein Mietvertrag ab dem Tag danach erfasst ist.
2. Wohnungsliste, Wohnungsseite und Mieterseite zeigen neben «Vermietet» das Ende: «Vermietet bis TT.MM.JJJJ».
3. Nach dem Beenden zeigt die Meldung, was jetzt zu tun ist, mit Links: neuen Mietvertrag erfassen, neue Adresse eintragen (A-5).
4. Für einen Vertrag mit dieser Aufgabe entfällt die bestehende Frist «Vertragsende» (60 Tage, `src/lib/overview.ts`), damit derselbe Vertrag nicht zweimal erscheint. Für befristete Verträge bleibt die Frist.

**Akzeptanzkriterien**

```gherkin
Szenario: Gekündigter Mietvertrag in der Übersicht
  Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
  Wenn der Liegenschaftsverwalter die Übersicht öffnet
  Dann nennt die Übersicht die Aufgabe "Nachmieter für Wohnung 2.01 suchen"

Szenario: Nachmieter erfasst
  Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
  Und "Bruno Meier" mietet die Wohnung "2.01" seit "2099-04-01" für "950" Franken
  Wenn der Liegenschaftsverwalter die Übersicht öffnet
  Dann nennt die Übersicht keine Aufgabe für die Wohnung "2.01"

Szenario: Wohnung mit gekündigtem Mietvertrag
  Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
  Dann zeigt die Wohnung "2.01" den Mietstatus "Vermietet bis 31.03.2099"
```

**Nicht dazu:** E-Mail-Erinnerungen, Checklisten für Wohnungsabnahme und Mietzinsdepot.

**Offene Fragen:** Ist «Vermietet bis …» eine Erweiterung des Mietstatus oder nur eine Anzeige? Der Mietstatus im Glossar kennt kein Ende.

---

## A-5 Neue Adresse für die Schlussabrechnung

**Problem.** Die Nebenkostenabrechnung geht an die Adresse des Mieters. Nach dem Auszug ist das meist die verlassene Wohnung. Die Abrechnung kommt Monate später, geht zurück oder an den Nachmieter (Datenschutz). Eine Nachzahlung wird nicht bezahlt, eine Rückerstattung nicht ausbezahlt.

**Anforderungen**

1. Nach dem Beenden nennt die Meldung: «Bitten Sie {Name} um die neue Adresse und tragen Sie sie beim Mieter ein. Dorthin geht die Nebenkostenabrechnung.» mit Link zum Mieter.
2. Beim Erstellen und vor dem Versand einer Abrechnung warnt Dwello, wenn der Mieter ausgezogen ist und seine Adresse gleich der Adresse des Gebäudes ist: «{Name} ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.» Der Versand bleibt möglich.
3. Die Warnung steht auch in der Übersicht als Aufgabe, solange eine solche Abrechnung im Entwurf ist.

**Akzeptanzkriterien**

```gherkin
Szenario: Abrechnung an einen ausgezogenen Mieter mit alter Adresse
  Angenommen "Anna Keller" mietete die Wohnung "2.01" von "2024-04-01" bis "2025-03-31"
  Und die Adresse von "Anna Keller" ist die Adresse des Gebäudes "Ahornhof"
  Wenn der Liegenschaftsverwalter die Abrechnung 2025 von "Anna Keller" versenden will
  Dann warnt Dwello, dass die Adresse noch die der Wohnung ist
```

**Nicht dazu:** Adressprüfung bei der Post, Weiterleitung.

**Offene Fragen:** Genügt der Vergleich von Strasse und Postleitzahl, oder braucht es ein Feld «Neue Adresse ab» beim Mieter?

---

## A-6 Stillschweigend fortgesetzter befristeter Mietvertrag

**Problem.** Bleibt ein Mieter nach dem Ende eines befristeten Vertrags mit Wissen des Vermieters, gilt der Vertrag als unbefristet fortgesetzt (Art. 266 Abs. 2 OR; im Fachreview als unsicher markiert). Dwello zeigt dann «Beendet» und rechnet Leerstand: Die Nebenkosten gehen an den Vermieter statt an den Mieter.

**Anforderungen**

1. Ist ein *vereinbartes* Vertragsende (A-1) vorbei und hat die Wohnung keinen Folgevertrag, nennt die Übersicht eine Aufgabe: «Der befristete Mietvertrag von {Name} ist am TT.MM.JJJJ abgelaufen. Wohnt {Name} noch in der Wohnung? Dann läuft der Mietvertrag unbefristet weiter.» Aktionen: «Unbefristet weiterführen» (entfernt das Vertragsende) oder «Mieter ist ausgezogen» (die Aufgabe verschwindet).
2. Für gekündigte Verträge erscheint diese Aufgabe nicht.

**Akzeptanzkriterien**

```gherkin
Szenario: Abgelaufener befristeter Mietvertrag ohne Nachmieter
  Angenommen "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
  Wenn der Liegenschaftsverwalter die Übersicht öffnet
  Dann nennt die Übersicht die Aufgabe "Befristeten Mietvertrag prüfen"

Szenario: Befristeten Mietvertrag unbefristet weiterführen
  Wenn der Liegenschaftsverwalter den Mietvertrag von "Bruno Meier" unbefristet weiterführt
  Dann ist der Mietvertrag unbefristet
```

**Voraussetzung:** A-1.

---

## A-7 Doppelt erfassten Mietvertrag entfernen

**Problem.** Seit der Löschregel lässt sich ein Mietvertrag nur vor seinem Beginn löschen. Ein Vertrag, der irrtümlich doppelt erfasst wurde und schon begonnen hat, bleibt stehen. Anna (I2) fand nur einen Trick: den Vertragsbeginn in die Zukunft schieben und dann löschen.

**Anforderungen**

1. Ein Mietvertrag, der begonnen hat, aber in keiner Nebenkostenabrechnung vorkommt, lässt sich löschen, wenn der Verwalter ausdrücklich bestätigt: «Dieser Mietvertrag wurde irrtümlich erfasst. Seine Mietstage zählen danach als Leerstand, wenn kein anderer Mietvertrag die Zeit abdeckt.» Zwei Mietverträge derselben Wohnung im selben Zeitraum lässt das Backend nicht zu (Überschneidung); ein «Duplikat» ist darum meist ein zweiter Vertrag für eine falsche Wohnung, einen falschen Mieter oder einen falschen Zeitraum.
2. Ein Mietvertrag mit einer Abrechnung bleibt gesperrt.
3. Der Trick über einen künftigen Vertragsbeginn ist für Verträge mit Abrechnung schon gesperrt (seit Review I Runde 5: ein Vertragsbeginn nach den abgerechneten Mietstagen wird abgelehnt). Für Verträge ohne Abrechnung genügt Punkt 1.
4. Das Backend setzt die Löschregel selbst durch (heute nur BFF und Dialog). Die Testbereinigung (`tests/e2e/fixtures/backend.ts`, Backend-Hilfen) räumt dann über die Wohnung oder direkt in der Datenbank auf.

**Akzeptanzkriterien**

```gherkin
Szenario: Irrtümlich erfassten Mietvertrag löschen
  Angenommen "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken
  Und "Anna Keller" mietet irrtümlich auch die Wohnung "2.02" seit "2024-04-01" für "950" Franken
  Wenn der Liegenschaftsverwalter den Mietvertrag der Wohnung "2.02" löscht und bestätigt, dass er irrtümlich erfasst wurde
  Dann ist der Mietvertrag der Wohnung "2.02" nicht mehr auffindbar
```

**Offene Fragen:** Genügt die Bestätigung, oder soll Dwello das Löschen eines begonnenen Vertrags nur innerhalb einer Frist nach dem Erfassen anbieten?

---

## A-8 Früheren Mietvertrag als Historie erkennbar machen

**Problem.** Anna (I2) hielt einen beendeten Mietvertrag von 2018–2021 in derselben Wohnung für ein Duplikat. Nichts zeigt, dass er die Historie der Wohnung ist und für alte Abrechnungen gebraucht wird.

**Anforderungen**

1. Die Wohnungsseite zeigt die Mietverträge der Wohnung nach Zeit geordnet, der laufende oben, darunter «Frühere Mietverträge».
2. Ein beendeter Mietvertrag zeigt neben «Beendet» die Hilfe: «Bleibt als Historie erhalten: Nebenkostenabrechnungen brauchen seine Mietstage.»
3. Der Löschdialog eines beendeten Vertrags nennt, ob es Abrechnungen dazu gibt, und verlinkt sie.

**Akzeptanzkriterien**

```gherkin
Szenario: Früherer Mietvertrag auf der Wohnungsseite
  Angenommen "Bruno Meier" mietete die Wohnung "2.01" von "2018-01-01" bis "2021-12-31" für "900" Franken
  Und "Anna Keller" mietet die Wohnung "2.01" seit "2022-01-01" für "950" Franken
  Wenn der Liegenschaftsverwalter die Wohnung "2.01" öffnet
  Dann steht der Mietvertrag von "Bruno Meier" unter "Frühere Mietverträge"
```

---

## A-9 «Noch nicht abgerechnet» nach den Mietverträgen der Periode – umgesetzt

**Umgesetzt** (Session 15): Die Übersicht liest alle Mietverträge und nennt jedes Gebäude, das in der letzten Periode einen Mietvertrag ohne Abrechnung hatte; die Erinnerung prüft pro Mietvertrag, nicht mehr pro Gebäude.


**Problem.** Die Übersicht erinnert an eine nicht abgerechnete Periode eines Gebäudes nur, solange heute eine Wohnung vermietet ist (`missingPeriod` in `src/routes/dashboard/+page.server.ts` prüft die heutige Belegung). Helga (I3) beendete den letzten laufenden Vertrag eines Gebäudes rückwirkend: Die Erinnerung an die Abrechnung 2025 verschwand, obwohl der Mieter für 2025 noch eine Abrechnung bekommen muss. Das bestand schon vorher; mit einem Vertragsende in der Vergangenheit tritt es öfter auf. Folge: Der Mieter erhält keine Abrechnung über sein Akonto.

**Anforderungen**

1. Die Erinnerung «Noch nicht abgerechnet» gilt für jedes Gebäude, das in der Periode einen Mietvertrag hatte, nicht nur für Gebäude mit heutiger Belegung.
2. Sie verschwindet, wenn jeder Mietvertrag der Periode eine Abrechnung hat.

**Akzeptanzkriterien**

```gherkin
Szenario: Erinnerung bleibt nach dem Auszug des letzten Mieters
  Angenommen "Anna Keller" mietete die Wohnung "2.01" von "2024-04-01" bis "2025-09-30" für "950" Franken
  Und die Wohnung "2.01" ist die einzige Wohnung des Gebäudes "Ahornhof"
  Wenn der Liegenschaftsverwalter die Übersicht öffnet
  Dann nennt die Übersicht die Aufgabe "Noch nicht abgerechnet: Ahornhof"
```

---

## A-10 Abrechnung nach einem geänderten Vertragsende neu erstellen

**Problem.** Anna (I3) trug einen Auszug per 31.03.2025 nach, für den es einen Entwurf der Abrechnung 2025 gab. Dwello lehnte richtig ab und sagte, was zu tun ist. Der Weg war aber mühsam: Die Entwurfsnummer ist kein Link, sie musste die Abrechnung suchen, löschen, den Vertrag wieder finden und alles neu eintippen. Nach dem Beenden erinnerte nichts an die nun fehlende Abrechnung 2025. Beim Neuerstellen musste sie Heizprofil und Verwaltungspauschale neu wählen, ohne zu wissen, was die gelöschte Abrechnung verwendet hatte.

**Anforderungen**

1. Die Ablehnung verlinkt jeden genannten Entwurf.
2. Bei genau einem Entwurf bietet die Ablehnung eine Aktion an: «Entwurf löschen und Mietvertrag beenden». Sie bestätigt die Folge («Der Entwurf NK-… wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.») und führt danach in den Abrechnungsassistenten für dieses Gebäude und diese Periode.
3. Hat ein Mietvertrag Mietstage in einer abgeschlossenen Periode ohne Abrechnung, zeigt die Detailseite des Mietvertrags «Abrechnung {Jahr} fehlt» mit Link zum Assistenten; die Übersicht nennt es als Aufgabe (zusammen mit A-9).
4. Der Assistent schlägt Heizprofil und Verwaltungspauschale vor, die die übrigen Abrechnungen derselben Periode und desselben Gebäudes verwenden. Die Detailseite einer Abrechnung nennt ihr Heizprofil.

**Akzeptanzkriterien**

```gherkin
Szenario: Entwurf löschen und Mietvertrag beenden
  Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Entwurf im Gebäude "Ahornhof"
  Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2025-03-31" beenden will und das vergangene Vertragsende bestätigt
  Und die Aktion «Entwurf löschen und Mietvertrag beenden» bestätigt
  Dann endet der Mietvertrag am "31.03.2025"
  Und ist die Abrechnung 2025 von "Anna Keller" nicht mehr auffindbar
  Und ist der Liegenschaftsverwalter im Abrechnungsassistenten für 2025 im Gebäude "Ahornhof"

Szenario: Unter «Bearbeiten» einen Vertragsbeginn nach dem Beginn eines Entwurfs speichern
  Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Entwurf im Gebäude "Ahornhof"
  Wenn der Liegenschaftsverwalter den Vertragsbeginn "2025-05-01" speichern will
  Dann bietet das Formular an, den Entwurf zu löschen und den Mietvertrag zu speichern"
```

---

## A-11 Versendete Abrechnung korrigieren

**Problem.** Eine versendete oder bezahlte Abrechnung ändert Dwello nicht. Stellt sich danach heraus, dass Vertragsbeginn oder -ende falsch waren (Anna, I4: Der Mieter zog erst am 01.05.2025 ein, die Abrechnung 2024 ist bezahlt), lässt sich das Datum nicht speichern. Die Meldung sagt, die Korrektur direkt mit dem Mieter zu klären; in Dwello bleibt der Fehler.

**Anforderungen**

1. Eine versendete oder bezahlte Abrechnung lässt sich stornieren: Dwello erstellt eine Gutschrift (Gegenbuchung mit eigener Nummer) und markiert die Abrechnung als storniert. Erst danach lassen sich die Vertragsdaten ändern.
2. Die neue Abrechnung verrechnet, was der Mieter schon bezahlt hat.
3. Der Verwalter bestätigt die Folge: «Die Abrechnung NK-… wird storniert. Senden Sie dem Mieter die Gutschrift und die neue Abrechnung.»

**Offene Fragen (fachlich prüfen):** Ist eine Gutschrift mit Gegenbuchung in der Schweizer Praxis üblich, oder genügt eine korrigierte Abrechnung mit Hinweis? Wie lange nach dem Versand ist eine Korrektur zulässig (Verjährung, Art. 128 OR)?

---

## Ebenfalls offen (kleiner, in `docs/design/offene-punkte.md`)

- «Heute» rechnet das Backend in UTC, die App in Schweizer Zeit (IF-10, I-10).
- Tab-Reihenfolge im Dialog: Der Bestätigen-Knopf kommt vor dem Feld (Sven).
- Gebäude- und Wohnungsseite erklären Leer und Gesperrt widersprüchlich (Anna).
