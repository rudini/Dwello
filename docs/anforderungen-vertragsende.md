# Anforderungen: Vertragsende und Kündigung

Stand: 12.10.2026. Quelle: Fachreview I (`docs/reviews/I-fachreview-1.md`, Findings IF-2, IF-4, IF-5, IF-6, IF-8, IF-9) und die Personas Helga, Sven und Anna (Lauf I). Die Funktionen «Mietvertrag beenden» auf ein künftiges oder vergangenes Datum, die Bestätigung eines vergangenen Vertragsendes und die Löschregel (nur vor dem Vertragsbeginn) sind umgesetzt. Dieses Dokument beschreibt, was danach noch fehlt.

Jede Anforderung nennt das Problem, was Dwello tun muss, wie wir es prüfen (Szenarien in der Sprache von `tests/e2e/features`), was nicht dazugehört und welche Fragen der Product Owner oder eine Fachperson klären muss. Begriffe, die nicht im Glossar stehen, sind mit *(Glossar fehlt)* markiert und in `docs/design/offene-punkte.md` vorgeschlagen.

| ID | Anforderung | Priorität | Quelle |
|---|---|---|---|
| A-1 | Befristung und Kündigung unterscheiden | hoch | IF-4, Helga |
| A-2 | Vertragsende unter «Bearbeiten» prüfen | hoch | IF-8, IF-3, Helga |
| A-3 | Hinweis auf die Kündigungsfrist | mittel | IF-2 |
| A-4 | Bevorstehendes Vertragsende sichtbar machen | mittel | IF-5, Anna, Helga |
| A-5 | Neue Adresse für die Schlussabrechnung | mittel | IF-6, Anna |
| A-6 | Stillschweigend fortgesetzter befristeter Mietvertrag | niedrig | IF-9 |

Priorität: «hoch» heisst vor dem ersten echten Einsatz, weil sonst falsche Daten oder Geldfolgen entstehen. «mittel» verhindert einen wahrscheinlichen Fehler eines Laien. «niedrig» betrifft einen seltenen Fall.

---

## A-1 Befristung und Kündigung unterscheiden

**Problem.** Ein befristeter Mietvertrag endet am vereinbarten Tag ohne Kündigung. Ein unbefristeter endet erst durch eine Kündigung auf einen Kündigungstermin *(Glossar fehlt)*. Dwello speichert beides im selben Feld «Vertragsende». Nach «Beenden» zeigt der Assistent unter «Bearbeiten» einen gekündigten unbefristeten Vertrag als «Befristet: Der Mietvertrag endet an einem festen Tag, ohne Kündigung». Das ist rechtlich falsch, und wer «befristet» liest, prüft die Kündigung nicht mehr. Ausserdem passt die Definition im Glossar («leer bei unbefristeten Verträgen») nicht mehr.

**Anforderungen**

1. Dwello merkt sich, wie das Vertragsende entstanden ist: *vereinbart* (befristeter Vertrag) oder *gekündigt* (unbefristeter Vertrag).
2. «Mietvertrag beenden» setzt immer *gekündigt*. Wer im Assistenten «Befristet» wählt, setzt *vereinbart*.
3. Die Detailseite, die Mietvertragsliste und der Assistent zeigen:
   - befristet: «Befristet bis TT.MM.JJJJ»,
   - gekündigt: «Unbefristet, gekündigt auf den TT.MM.JJJJ».
4. Im Assistenten kann man bei einem gekündigten Vertrag die Kündigung zurücknehmen («Kündigung aufheben»). Der Vertrag ist danach wieder unbefristet ohne Vertragsende. Die Aktion nennt ihre Folge: «Der Mietvertrag läuft dann ohne Ende weiter.»
5. Bestehende Verträge mit Vertragsende gelten als *vereinbart*. Eine Datenmigration ist nicht nötig, solange es keine produktive Datenbank gibt; die Spalte kommt in `0001_schema.sql`.
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

## A-2 Vertragsende unter «Bearbeiten» prüfen

**Problem.** «Beenden» prüft das Vertragsende jetzt, «Bearbeiten» nicht. Im Assistenten lässt sich ein Vertragsende setzen, das
- vor dem Ende einer schon gespeicherten Nebenkostenabrechnung des Vertrags liegt (die Abrechnung behält ihre alten Mietstage, der Nachmieter könnte dieselben Tage nochmals bezahlen),
- in der Vergangenheit liegt, ohne dass die Folge bestätigt wird (ein Tippfehler im Jahr beendet den Vertrag rückwirkend, die Wohnung gilt als leer).

**Anforderungen**

1. Der Assistent wendet dieselben Regeln an wie «Beenden» (`contractEndError`, `pastEndConfirmation`, die Prüfung gegen gespeicherte Abrechnungen), auch ohne JavaScript in der Server-Aktion.
2. Ein Vertragsende vor dem Ende einer Abrechnung des Vertrags lehnt Dwello ab:
   - bei einem Entwurf: «Die Nebenkostenabrechnung bis TT.MM.JJJJ enthält schon Mietstage nach diesem Tag. Löschen Sie den Entwurf und erstellen Sie ihn danach neu.» mit Link zum Entwurf;
   - bei einer versandten oder bezahlten Abrechnung: «… Wählen Sie den TT.MM.JJJJ oder einen späteren Tag.»
3. Ein Vertragsende vor heute verlangt im Assistenten dieselbe Bestätigung wie im Dialog («Der Mietvertrag ist seit dem TT.MM.JJJJ beendet.»).
4. Das Backend setzt Regel 2 selbst durch (`updateContract`), damit kein anderer Weg sie umgeht. Antwort 409 mit einer Meldung, die die BFF übersetzt.

**Akzeptanzkriterien**

```gherkin
Szenario: Vertragsende im Assistenten vor dem Ende einer Abrechnung
  Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
  Wenn der Liegenschaftsverwalter im Assistenten das Vertragsende "2025-03-31" speichert
  Dann meldet der Assistent "Die Nebenkostenabrechnung bis 31.12.2025 enthält schon Mietstage nach diesem Tag."

Szenario: Vergangenes Vertragsende im Assistenten
  Wenn der Liegenschaftsverwalter im Assistenten das Vertragsende "2025-03-31" speichert, ohne die Folge zu bestätigen
  Dann meldet der Assistent "Bitte bestätigen Sie, dass der Mietvertrag seit dem 01.04.2025 beendet ist."
```

Dazu ein `*.pg.test.ts` für Regel 4.

**Nicht dazu:** eine gespeicherte Abrechnung automatisch neu berechnen.

---

## A-3 Hinweis auf die Kündigungsfrist

**Problem.** Für Wohnungen gilt eine Kündigungsfrist *(Glossar fehlt)* von mindestens 3 Monaten auf einen ortsüblichen Termin (Art. 266c OR). Eine zu späte Kündigung gilt erst auf den nächsten Termin (Art. 266a Abs. 2 OR). Trägt der Verwalter das Datum aus einem zu spät eingegangenen Kündigungsschreiben ein, ist die Wohnung in Dwello zu früh leer: Die Nebenkosten dieser Monate gehen an den Vermieter, das Akonto des Mieters wird nicht mehr gerechnet. Heute steht nur ein allgemeiner Satz im Dialog.

**Anforderungen**

1. Der Dialog «Mietvertrag beenden» fragt zusätzlich: «Kündigung erhalten am» (Datum, optional, vorgeschlagen ist heute). Hilfe am Feld: «Der Tag, an dem das Kündigungsschreiben angekommen ist.»
2. Liegen zwischen «Kündigung erhalten am» und dem Vertragsende weniger als 3 Monate, zeigt Dwello einen Hinweis, keine Sperre: «Zwischen Eingang und Vertragsende liegen weniger als 3 Monate. Dann gilt die Kündigung wohl erst auf den nächsten Kündigungstermin. Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag, oder Sie haben das Ende mit dem Mieter vereinbart.»
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

**Problem.** Die Übersicht nennt ein Vertragsende erst 60 Tage vorher als Frist. Die Wohnung zeigt bis zum letzten Tag «Vermietet», ohne Hinweis. In der Kündigungszeit fallen aber Aufgaben an: Wiedervermietung (sonst Leerstand zulasten des Vermieters), Wohnungsabnahme, Rückgabe des Mietzinsdepots, neue Adresse (A-5). Ein Laie, der Dwello wenige Male im Jahr öffnet, verpasst sie.

**Anforderungen**

1. Die Übersicht nennt jedes gekündigte Vertragsende ab dem Tag, an dem es erfasst ist, als Aufgabe: «Der Mietvertrag von {Name}, Wohnung {Nr}, endet am TT.MM.JJJJ. Suchen Sie einen Nachmieter.» Die Aufgabe verschwindet, sobald für die Wohnung ein Mietvertrag ab dem Tag danach erfasst ist.
2. Wohnungsliste, Wohnungsseite und Mieterseite zeigen neben «Vermietet» das Ende: «Vermietet bis TT.MM.JJJJ».
3. Nach dem Beenden zeigt die Meldung, was jetzt zu tun ist, mit Links: neuen Mietvertrag erfassen, neue Adresse eintragen (A-5).
4. Die bestehende Frist «Vertragsende» (60 Tage) bleibt.

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

## Ebenfalls offen (kleiner, in `docs/design/offene-punkte.md`)

- Das Backend löscht über die API jeden Mietvertrag ohne Abrechnung; die Regel «nur vor dem Vertragsbeginn» setzen Dialog und BFF durch. Für das Backend müsste die Testbereinigung (`tests/e2e/fixtures/backend.ts`, Backend-Hilfen) anders aufräumen.
- «Heute» rechnet das Backend in UTC, die App in Schweizer Zeit (IF-10, I-10).
- Tab-Reihenfolge im Dialog: Der Bestätigen-Knopf kommt vor dem Feld (Sven).
- Gebäude- und Wohnungsseite erklären Leer und Gesperrt widersprüchlich (Anna).
