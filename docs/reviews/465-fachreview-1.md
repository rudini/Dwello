# Fachreview #465, Runde 1 (vor der Umsetzung)

Gegenstand: @wip-Szenarien in `tests/e2e/features/statement-detail.feature:288-334` und `tests/e2e/features/settings.feature:30-42` (Commit f5de1862, Worktree `review-465-fach`) und die geplanten Texte (Briefrahmen, Kontakt im Kopf, Quelle der Monatsanteile, Einstellungen).

## Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die geplante Quelle der vordefinierten Heizprofile («Tabelle «Mieterwechsel: So werden die Heizkosten verteilt»») hat niemand gesehen, und sie nennt keinen Herausgeber. Belegt ist das Merkblatt des Mieterinnen- und Mieterverbands, und zwar für alle vier Profile. |
| V-2 | Verwalter | Major | Der Kopf des PDF ist eine einzige Zeile, 290 pt breit, mit Auslassungspunkten (`pdf.service.ts:1331-1333`). Kommen Telefon und E-Mail dazu, wird die Zeile abgeschnitten. |
| V-3 | Verwalter | Minor | `settings_sender_text` sagt «Steht auf jeder Abrechnung und jeder Mahnung». Für Telefon und E-Mail stimmt das nicht: Die Mahnung druckt nur Name und Adresse (`reminder-pdf.ts:40`). Behebung: beide auch in den Absender der Mahnung aufnehmen (die Mahnung soll wie die Abrechnung lesen, #465), oder die Hilfe zum Feld sagt «nur auf der Nebenkostenabrechnung». |
| V-4 | Verwalter | Minor | Die Quelle fehlt in der Momentaufnahme `heatingShare` (`schema.ts:406-419`, `statement-pdf.service.ts:174-180`, #209). Ein neu erzeugtes PDF einer versendeten Abrechnung würde deshalb die Quelle von heute drucken. Behebung: die Quelle beim Erstellen in `heatingShare` speichern (wie `names`). Bei älteren Abrechnungen die Quelle des Profils nachschlagen; ist das Profil gelöscht, entfällt die Zeile. |
| V-5 | Verwalter | Minor | Die Szenarien prüfen nur Anrede, Gruss und die Quelle eines eigenen Profils ohne Beschreibung. Nicht festgehalten sind «{Ort}, {Abrechnungsdatum}», der Einleitungssatz, der Firmenname unter dem Gruss, fr/it/en und die vier Quellen der vordefinierten Profile. Behebung: in `statement-pdf-render.test.ts` bzw. `heating-profiles.pg.test.ts` festhalten (das Abrechnungsdatum ist im E2E-Test nicht fest). |
| V-6 | Verwalter | Minor | Ein eigenes Profil soll seine Beschreibung als Quelle drucken. Diese Beschreibung kann der Liegenschaftsverwalter aber weder sehen noch bearbeiten: Die Formulare unter `src/routes/config/heating-profiles/` haben kein solches Feld, nur die API nimmt es an (`backend/src/routes/heating-profiles.ts:113,179`). Gedruckt würde also ein Text, den er nicht kennt. Behebung: Bei eigenen Profilen immer «Eigenes Profil des Vermieters» drucken, bis das Formular die Beschreibung mit dem Hinweis «steht als Quelle auf der Abrechnung» zeigt. |

### V-1: Quelle der vordefinierten Heizprofile

- **Belege:**
  - `backend/migrations/0002_stammdaten.sql:67,77,87,97` nennt nur den Titel der Tabelle.
  - `backend/src/__tests__/heating-profiles.pg.test.ts:33-35` schreibt: «presumably the table the migration names, not seen».
  - Laut `docs/reviews/w14-review-2.md:28` hat diese Quelle niemand geprüft.
- **Selbst nachgelesen:** Ich habe das Merkblatt heruntergeladen und gelesen (pdftotext): Mieterinnen- und Mieterverband, «Merkblatt für Mieter*innen – Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode», https://www.mieterverband.ch/site/assets/files/2884/merkblatt_nebenkostenabrechnung_waehrend_periode.pdf. Die Werte stimmen Zeile für Zeile:
  - S. 1, «Heizungsanlage ohne Warmwasseraufbereitung»: 17.5 · 14.5 · 13.5 · 9.5 · 3.5 · – · – · – · 1.0 · 10.0 · 13.5 · 17.0, also Heizung Mittelland.
  - S. 2, «Heizungsanlage mit Warmwasseraufbereitung»: 13.6 … 13.0, also Heizung + Warmwasser.
  - S. 2, «Verteilungsschlüssel in Bergebieten und im Tessin», Zeilen «Berggebiete» und «Tessin», also Bergregion und Tessin.
- **Warum falsch:** Die Quellenzeile soll dem Mieter erlauben, die Monatsanteile nachzuprüfen. Eine Tabelle ohne Herausgeber, die zudem unbelegt ist, kann er nicht finden. Auf einem Dokument, das er anfechten kann, ist das irreführend.
- **Behebung:** Die Migration füllt die Quelle mit Merkblatt, Herausgeber und Tabelle (Texte unten). Die bisherige `description` bleibt unverändert.

### V-2: Kopfzeile

- **Beleg:** `frame()` schreibt `senderParts(config).join(' · ')` mit `{ width: 290, height: 10, ellipsis: true, lineBreak: false }` (`pdf.service.ts:1330-1333`).
- **Rechnung:** «Muster Immobilien AG · Bahnhofstrasse 1 · 8001 Zürich · Telefon 044 123 45 67 · info@muster-immobilien.ch» hat 104 Zeichen. In Helvetica 8 pt sind das geschätzt rund 400 pt bei 290 pt Platz. Gemessen habe ich nicht, im Worktree fehlt `node_modules`.
- **Warum falsch:** Die E-Mail-Adresse (und je nach Firmenname auch das Telefon) wird abgeschnitten. Der Test findet das nur, solange die Testdaten zufällig kurz genug sind.
- **Behebung:** Auf Seite 1 einen Briefkopf als Block, links oben, Zeile für Zeile (wie `reminder-pdf.ts:40`): Firmenname, Adresse, PLZ Ort, «Telefon …», E-Mail. Leere Zeilen entfallen. Der Briefkopf muss über dem Adressfeld bei 45 mm enden, sonst die Gebäudeangaben nach unten schieben. Die Seiten ab 2 behalten die kurze Kopfzeile.

## Antworten zu den geplanten Texten

1. **Reihenfolge des Briefs** (übliche Schweizer Briefform, wie die Mahnung):
   1. Adressfeld
   2. «{Ort}, {Abrechnungsdatum}»
   3. Titel als Betreff, mit der Zeile Abrechnungsnr./Abrechnungsdatum
   4. Anrede mit Komma
   5. Einleitungssatz
   6. Satz zum Mietverhältnis und Hinweis «ersetzt»
   7. Saldo …
   8. Hinweise
   9. Gruss mit Firmenname
   10. Zahlteil

   Den Gruss also **nach** den Hinweisen setzen. Die Hinweise (Art. 257b Abs. 2 OR, Art. 8 VMWG) gehören damit zum Brief, und der Zahlteil bleibt der letzte, abtrennbare Teil.
   - Gruss und Firmenname stehen auf derselben Seite wie die letzte Hinweiszeile.
   - Die Prüfung vor dem Zahlteil (`pdf.service.ts:1413`) muss die Höhe des Grusses mitzählen.
   - Im Deutschen beginnt der Einleitungssatz klein oder mit «Sie», weil die Anrede mit Komma endet (wie `reminder-letter.ts`). Der vorgeschlagene Satz beginnt mit «Sie», das passt.
   - Ort und Name fehlen nie: Ohne IBAN gibt es kein PDF (`statement-pdf.service.ts:360`), und eine IBAN verlangt Firmenname, PLZ und Ort (`settings_iban_help`).
2. **Kopf:** «Telefon {Nummer}» und die E-Mail-Adresse ohne Bezeichnung. Ist ein Feld leer, entfällt seine Zeile (siehe V-2).
3. **Quelle:** eine eigene Zeile unter «Heizkosten nach Heizprofil …», in allen drei Varianten (`heatingNote`, `heatingNoteParts`, `heatingNoteOwn`). Ohne Hinweis zum Heizprofil (nach Tagen verteilt, oder Abrechnung vor #209) gibt es keine Quellenzeile.
   - Die Titel des Merkblatts bleiben in fr/it/en deutsch, weil das Merkblatt nur deutsch belegt ist. In Klammern folgt eine kurze Übersetzung.
4. **Einstellungen:** Die Bezeichnungen und die Fehlermeldung übernehmen die bestehenden Texte des Mieterformulars (`tenants_phone`, `tenants_email`, `tenants_error_email_invalid`).

## Endgültige Texte

| Schlüssel | de | fr | it | en |
|---|---|---|---|---|
| Ort, Datum | {Ort}, {Abrechnungsdatum} | {Ort}, {Abrechnungsdatum} | {Ort}, {Abrechnungsdatum} | {Ort}, {Abrechnungsdatum} |
| Anrede | Guten Tag {Vorname} {Nachname}, | Bonjour {Vorname} {Nachname}, | Gentile {Vorname} {Nachname}, | Dear {Vorname} {Nachname}, |
| Einleitung | Sie erhalten die Nebenkostenabrechnung für die Abrechnungsperiode {Beginn} – {Ende}. | Veuillez trouver ci-dessous le décompte des charges pour la période de décompte du {début} au {fin}. | Le inviamo qui di seguito il conteggio spese accessorie per il periodo di conteggio dal {inizio} al {fine}. | Please find below your utility cost statement for the billing period {start} – {end}. |
| Gruss | Freundliche Grüsse⏎{Firmenname} | Meilleures salutations⏎{Firmenname} | Cordiali saluti⏎{Firmenname} | Kind regards⏎{Firmenname} |
| Kopf Telefon | Telefon {Nummer} | Téléphone {numéro} | Telefono {numero} | Phone {number} |
| Kopf E-Mail | {E-Mail} | {E-Mail} | {E-Mail} | {E-Mail} |
| Quellenzeile | Quelle der Monatsanteile: {Quelle} | Source des parts mensuelles : {source} | Fonte delle quote mensili: {fonte} | Source of the monthly shares: {source} |
| Quelle eigenes Profil ohne Beschreibung | Eigenes Profil des Vermieters | Profil établi par le bailleur | Profilo stabilito dal locatore | The landlord’s own profile |
| Quelle Heizung Mittelland | Merkblatt «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» des Mieterinnen- und Mieterverbands (mieterverband.ch), Tabelle «Heizungsanlage ohne Warmwasseraufbereitung» | Fiche « Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode » du Mieterinnen- und Mieterverband (mieterverband.ch, en allemand), tableau « Heizungsanlage ohne Warmwasseraufbereitung » (chauffage sans production d’eau chaude) | Scheda «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» del Mieterinnen- und Mieterverband (mieterverband.ch, in tedesco), tabella «Heizungsanlage ohne Warmwasseraufbereitung» (riscaldamento senza produzione di acqua calda) | Fact sheet ‘Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode’ of the Mieterinnen- und Mieterverband (Swiss tenants’ association, mieterverband.ch, in German), table ‘Heizungsanlage ohne Warmwasseraufbereitung’ (heating without hot water) |
| Quelle Heizung + Warmwasser | wie oben, Tabelle «Heizungsanlage mit Warmwasseraufbereitung» | wie oben, tableau « Heizungsanlage mit Warmwasseraufbereitung » (chauffage avec production d’eau chaude) | wie oben, tabella «Heizungsanlage mit Warmwasseraufbereitung» (riscaldamento con produzione di acqua calda) | wie oben, table ‘Heizungsanlage mit Warmwasseraufbereitung’ (heating with hot water) |
| Quelle Heizung Bergregion | wie oben, Tabelle «Verteilungsschlüssel in Bergebieten und im Tessin», Zeile «Berggebiete» | wie oben, tableau « Verteilungsschlüssel in Bergebieten und im Tessin », ligne « Berggebiete » (régions de montagne) | wie oben, tabella «Verteilungsschlüssel in Bergebieten und im Tessin», riga «Berggebiete» (regioni di montagna) | wie oben, table ‘Verteilungsschlüssel in Bergebieten und im Tessin’, row ‘Berggebiete’ (mountain regions) |
| Quelle Heizung Tessin | wie oben, Tabelle «Verteilungsschlüssel in Bergebieten und im Tessin», Zeile «Tessin» | wie oben, …, ligne « Tessin » | wie oben, …, riga «Tessin» (Ticino) | wie oben, …, row ‘Tessin’ (Ticino) |
| Einstellung Telefon | Telefon | Téléphone | Telefono | Phone |
| Hilfe Telefon | Freiwillig. Steht im Kopf der Nebenkostenabrechnung, damit Ihre Mieter Sie bei Fragen erreichen. | Facultatif. Figure en en-tête du décompte des charges, pour que vos locataires puissent vous joindre en cas de question. | Facoltativo. Figura nell’intestazione del conteggio spese accessorie, così i suoi inquilini possono contattarla in caso di domande. | Optional. Shown in the header of the utility cost statement so your tenants can reach you with questions. |
| Einstellung E-Mail | E-Mail | E-mail | E-mail | Email |
| Hilfe E-Mail | Freiwillig. Steht im Kopf der Nebenkostenabrechnung, damit Ihre Mieter Ihnen schreiben können. | Facultatif. Figure en en-tête du décompte des charges, pour que vos locataires puissent vous écrire. | Facoltativo. Figura nell’intestazione del conteggio spese accessorie, così i suoi inquilini possono scriverle. | Optional. Shown in the header of the utility cost statement so your tenants can write to you. |
| Fehler E-Mail | Bitte geben Sie eine gültige E-Mail-Adresse ein. | Veuillez saisir une adresse e-mail valide. | Inserisca un indirizzo e-mail valido. | Please enter a valid email address. |

«wie oben» steht für denselben Anfang wie in der Zeile Heizung Mittelland, bis vor «Tabelle»/«tableau»/«tabella»/«table».

Wird V-3 durch einen Absender auch auf der Mahnung behoben, heisst es in den Hilfen «Steht im Kopf der Nebenkostenabrechnung und der Mahnungen» (fr «du décompte des charges et des rappels», it «del conteggio spese accessorie e dei solleciti», en «of the utility cost statement and the reminders»).

## Fehlender Begriff (Issue mit `fachlich`, `entscheiden`)

**Quelle der Monatsanteile**: Woher die Monatsanteile eines Heizprofils stammen.
- Bei einem vordefinierten Heizprofil: Merkblatt, Herausgeber und Tabelle.
- Bei einem eigenen Heizprofil: «Eigenes Profil des Vermieters».

Sie steht im PDF unter der Zeile zum Heizprofil, so wie die Abrechnung erstellt wurde. Spalte: `heating_profiles` (geplant, #465).

## Rechtsgrundlage (Fedlex)

- Art. 8 VMWG (Fassung 1.10.2025, Fedlex-Filestore): «1 Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann. 2 Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- Art. 257b Abs. 2 OR (Fedlex, neueste Konsolidierung 1.7.2027): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»

Weder Briefrahmen noch Quellenzeile verlangt das Gesetz. Beides widerspricht ihm aber nicht, und die bestehenden Hinweise auf Art. 8 VMWG und Art. 257b OR bleiben.

Geprüft:
- Anrede- und Grussworte stimmen mit `reminder-letter.ts:44-45,67-68,90-91,113-114` überein.
- «Łukasz Dragoș» liegt im Zeichensatz der QR-Rechnung (`qr-bill.service.ts:232`, SIX IG 4.1.1: Latin Extended-A, Ș ș) und bleibt auch im QR-Code unverändert.
- Das Szenario «eigenes Heizprofil» erreicht die Quellenzeile: «Winter» ist ein eigenes Profil ohne Beschreibung, und Eva Frei mietet 01.01.–31.03.2024, also wird nach Heizprofil verteilt, nicht nach Tagen.

## Nicht bestätigt

- **Tabelle «Mieterwechsel: So werden die Heizkosten verteilt»:** nicht gefunden. Gesucht habe ich in der Migration, in `docs/` und in den Reviews W14 sowie 71/w4. Deshalb V-1.
- **Bergregion und Tessin ohne Warmwasser:** Das Merkblatt sagt nicht, ob die Tabelle Berg/Tessin für Anlagen mit oder ohne Warmwasser gilt. Sie steht auf S. 2, neben der Tabelle «mit Warmwasseraufbereitung». Die Migration nennt beide Profile «ohne Warmwasser». Das bleibt unsicher und betrifft die Beschreibung, nicht die Quelle.
- **Merkblatt auf Französisch und Italienisch:** Ob ASLOCA oder ASI ein gleichlautendes Merkblatt herausgeben, habe ich nicht bestätigt. `mmx search` fand nichts dazu, darum bleibt der Titel deutsch.
- **Breite der Kopfzeile:** nur geschätzt (V-2), weil im Worktree kein `pdfkit` installiert ist.
- **Zahlteil:** Ob der Text unter «Zahlbar durch» bei Zeichen ausserhalb des SIX-Zeichensatzes (z. B. Kyrillisch) mit den Daten des QR-Codes übereinstimmen muss, wenn die eingebettete Schrift sie druckt, die QR-Daten sie aber ersetzen, habe ich in den SIX-Richtlinien nicht nachgelesen. Das soll `daten-pruefer` am PDF prüfen.
