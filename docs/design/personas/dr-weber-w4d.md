# Dr. Weber – Review #83/#84: Texte an Mieter in FR/IT/EN (Abrechnungs-PDF, Mahnbrief)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Oberfläche auf Deutsch belassen. Gespeichert habe ich nur in Musterhaus Zentrum (zwei Mahnungen). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/6d9dc8b3-9638-5e82-8618-3e7a3da13392/scratchpad/persona/dr-weber-w4d/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungs-PDF FR und IT, Seite 1, Zeile unter «Sous-total»/«Subtotale» | «Frais de gestion : 3 % du sous-total …» / «Spese di gestione: 3 % del subtotale …». Art. 4 Abs. 3 OBLF/OLAL (Fedlex) sagt «frais administratifs» / «spese amministrative». Gerade bei einer Pauschale, die der Mieter anfechten kann, sollte das Gesetzeswort stehen. |
| P-2 | Minor | Mahnbrief FR (Pierre Dubois) | Anrede «Bonjour Pierre Dubois,» ist E-Mail-Ton. In einem gedruckten Mahnbrief erwartet ein Romand «Madame, Monsieur,» oder «Monsieur Dubois,». Die italienische Anrede «Gentile Maria Rossi,» ist dagegen in Ordnung. |
| P-3 | Nit | Abrechnungs-PDF FR (Titel, QR-Teil), Mahnbrief FR (Betreff, Text) | Zwei Begriffe für dasselbe: Titel «Décompte des charges», im Text «Vos frais accessoires». Das OR (Art. 257a/257b CO) sagt «frais accessoires». Im Italienischen ist es einheitlich («Conteggio spese accessorie», «spese accessorie»). |
| P-4 | Nit | Mahnbrief FR und IT | IBAN steht ohne Gruppen da: «IBAN CH4431999123000889012». Im Abrechnungs-PDF steht sie in Vierergruppen («CH44 3199 9123 0008 8901 2»). Der Brief hat keinen QR-Teil, also tippt der Mieter IBAN und Referenz von Hand ab. Ohne Gruppen vertippt er sich eher. |
| P-5 | Nit | Mahnbrief FR und IT, Ort und Datum | «Zürich, 17.10.2026» bleibt auf Deutsch. Üblich wären «Zurich, le 17.10.2026» und «Zurigo, 17.10.2026». Kosmetisch, rechtlich ohne Folgen. |
| P-6 | Nit | Abrechnungs-PDF IT, Seite 1 und 2 | Spaltenkopf «Costi immobile», in der Erklärung auf Seite 2 aber «costi dell’immobile». Uneinheitlich, sprachlich ist «Costi dell’immobile» richtig. |

## Beobachtungen

- **Brunner (FR) und Weber (EN) kommen auf Deutsch.** Auf den Mieterseiten steht bei «Sprache für Abrechnung und Mahnungen» «Französisch» bzw. «Englisch». Beide Abrechnungs-PDFs (Entwürfe; über die Liste und über «PDF herunterladen» auf der Detailseite) sind aber vollständig deutsch: «Nebenkostenabrechnung», «Rückerstattung», «Wir überweisen Ihnen den Betrag bis 16.11.2026. Teilen Sie uns dafür Ihre IBAN mit, falls Sie das noch nicht getan haben.» Laut Detailseite wurde das PDF schon um 17.10.2026, 02:35 erstellt («PDF erstellt»), vermutlich also vor der Sprachänderung per SQL. Ob eine Sprachänderung über die Oberfläche das PDF neu erstellen lässt, konnte ich nicht prüfen (Seepark Residenz ist nicht mein Gebäude). Den französischen und den englischen Rückerstattungssatz und den englischen Text überhaupt habe ich deshalb **nicht gelesen**. Wenn die Sprachänderung über die Oberfläche einen Entwurf auch nicht neu erstellen lässt, ist das ein Major: Der Mieter bekäme dann die falsche Sprache.
- **Fristen widersprechen sich (wohl Testaufbau):** Bei Dubois zeigt die Detailseite die Zahlungsfrist 01.10.2026. Im PDF steht «Veuillez payer le montant au plus tard le 16.11.2026», Abrechnungsdatum und «Versendet» sind der 17.10.2026. Am selben Tag sagt die Mahnung, die Rechnung sei unbezahlt (neue Frist 27.10.2026). Ein Mieter mit diesem PDF in der Hand bestreitet den Verzug zu Recht. Rossi: dasselbe. Wahrscheinlich ein Artefakt der SQL-Vorbereitung, deshalb kein Befund.
- Dialog «Mahnung senden»: «Markieren Sie den Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet. Drucken Sie ihn danach aus und schicken Sie ihn per Post.» Die Reihenfolge ist verkehrt: zuerst drucken und zur Post bringen, dann als versendet markieren. Der Knopf heisst «Zahlungserinnerung senden», versendet aber nichts, er erstellt nur das PDF.
- Detailseite Rossi: «Der Mieter bezahlt die Nachzahlung von CHF 238.10.» Bei einer Mieterin klingt das schief (deutsche Oberfläche, nicht Teil dieses Reviews).
- Positiv: Die Gesetzesverweise stimmen in FR und IT mit Fedlex überein: «art. 257b al. 2 CO» / «art. 257b cpv. 2 CO» (Einsicht in die Belege), «art. 8 al. 1 OBLF» / «art. 8 cpv. 1 OLAL» (detaillierte Heizkostenabrechnung), «art. 8 al. 2 OBLF» / «art. 8 cpv. 2 OLAL» (Anfangs- und Endbestand). Die Abkürzungen OBLF/OLAL sind richtig. «pièces justificatives» und «giustificativi» passen. Die QR-Teil-Beschriftungen entsprechen dem SIX-Standard («Récépissé», «Section paiement», «Point de dépôt», «À détacher avant le versement» bzw. «Ricevuta», «Sezione pagamento», «Punto di accettazione», «Da staccare prima del versamento»).
- Positiv: Beide Mahnbriefe sind höflich, kurz und juristisch sauber («Sauf erreur de notre part …», «Si vous avez déjà effectué le paiement, veuillez considérer ce rappel comme sans objet.» / «Secondo la nostra contabilità …», «Se ha già effettuato il pagamento, non tenga conto della presente.»). Es gibt keine Drohung mit Folgen, das passt zu einer ersten Zahlungserinnerung. Auch die Dateinamen sind übersetzt («Rappel de paiement NK-….pdf», «Promemoria di pagamento NK-….pdf»).
- Heizkostenabschnitt FR/IT verständlich: «Le décompte porte sur le combustible consommé et non sur les achats.» / «Si conteggia il combustibile consumato, non quello acquistato.» Danach folgt die Rechnung Anfangsbestand + Rechnungen – Endbestand. Rechnerisch geprüft: 2’650.00 + 6’565.00 – 2’257.20 = 6’957.80, stimmt.
- Kleinigkeit in den Daten: Der Verteilschlüssel heisst «Chauffage (surface 70% / unité 30%)», ohne Leerzeichen vor %, darunter aber «70 % × …». Das kommt aus dem Namen des Schlüssels, nicht aus dem übersetzten Text.

## Aufgabe geschafft: teilweise

Dubois (FR, Nachzahlung) und Rossi (IT, Nachzahlung) habe ich vollständig gelesen, die beiden Mahnungen erstellt und gelesen. Brunner (FR, Rückerstattung) und Weber (EN, Rückerstattung) kamen auf Deutsch, deshalb konnte ich die französischen und englischen Rückerstattungstexte nicht lesen.

## Aufwand

Etwa 25 Minuten, 14 Schritte (Liste, 4 PDFs, 2 Mieterseiten, 2 Abrechnungsdetails, 2 Mahnungen mit Dialog, 2 Mieterseiten «Dokumente», 2 Mahnbriefe).

## Ablauf

1. Nebenkostenabrechnungen geöffnet. Erwartet: Dubois und Rossi «Versendet». Gesehen: beide «Überfällig» (Frist 01.10.2026 ist vorbei), Brunner und Weber «Entwurf». Plausibel.
2. PDF Dubois. Erwartet: durchgehend Französisch. Gesehen: ja, sprachlich gut, Gesetzesverweise korrekt; P-1 und P-3. Die Frist im PDF (16.11.2026) widerspricht der Frist der Seite (01.10.2026), siehe Beobachtungen.
3. PDF Brunner. Erwartet: Französisch mit Rückerstattungssatz. Gesehen: Deutsch. Mieterseite zeigt «Französisch». Neu laden über die Detailseite: weiterhin Deutsch.
4. PDF Rossi. Erwartet: Italienisch. Gesehen: ja, gut; P-1, P-6.
5. PDF Weber. Erwartet: Englisch. Gesehen: Deutsch; Mieterseite zeigt «Englisch».
6. Dubois, «Mahnung senden». Erwartet: Bestätigung mit Betrag. Gesehen: Dialog mit «Pierre Dubois schuldet noch CHF 142.40.»; nach «Zahlungserinnerung senden» die Meldung «Mahnung erstellt», Zahlungsfrist der Mahnung 27.10.2026, «Zu versenden».
7. Rossi, gleich. Gesehen: wie bei Dubois, Betrag CHF 238.10.
8. Mieterseiten Dubois und Rossi, «Dokumente». Gesehen: je «Zahlungserinnerung · NK-… · per Brief · Zu versenden», PDF geöffnet. FR-Brief: P-2, P-3, P-4, P-5. IT-Brief: P-4, P-5, sonst einwandfrei.

## Verwirrung

- Warum ist das PDF eines Entwurfs nach einer Sprachänderung noch in der alten Sprache, und wie erzeuge ich es neu? Ich finde keinen Knopf «PDF neu erstellen».
- «Zahlungserinnerung senden» versendet nichts.
- Im Französischen «charges» neben «frais accessoires»: Ist das dasselbe? (Ja, aber der Mieter muss raten.)

## Fehlerrisiken

- Mieter mit anderer Sprache bekommen eine Abrechnung in der falschen Sprache, wenn der Verwalter das PDF eines Entwurfs vor der Sprachänderung erzeugt hat (noch nicht bestätigt, siehe Beobachtungen).
- Ein Mieter tippt die ungruppierte IBAN aus dem Mahnbrief falsch ab (P-4).
- «Frais de gestion» statt «frais administratifs» gibt einem streitbaren Mieter einen Ansatzpunkt (P-1).

## Vorschläge

- **P-1:** Ein Abrechnungs-PDF eines Mieters mit Französisch oder Italienisch öffnen, Zeile unter «Sous-total». Besser: «Frais administratifs : 3 % du sous-total …» und «Spese amministrative: 3 % del subtotale …».
- **P-2:** Für einen französischen Mieter eine Mahnung erstellen, den Brief unter «Dokumente» öffnen. Besser: «Madame, Monsieur,» (ohne Geschlecht in den Daten) oder eine neutrale Briefanrede statt «Bonjour».
- **P-3:** Abrechnungs-PDF und Mahnbrief FR lesen. Besser: einheitlich «Décompte des frais accessoires», wie im OR.
- **P-4:** Mahnbrief öffnen. Besser: IBAN wie im Abrechnungs-PDF in Vierergruppen.
- **P-5:** Mahnbrief öffnen. Besser: Ortsname und Datumsform je Sprache («Zurich, le …», «Zurigo, …»), oder nur das Datum ohne Ort.
- **P-6:** PDF IT, Seite 1, Spaltenkopf. Besser: «Costi dell’immobile».

## Nicht geprüft

- Französischer Rückerstattungssatz (Brunner) und der ganze englische Text (Weber): Die PDFs kamen auf Deutsch, und ich darf in Seepark Residenz nichts speichern, also auch kein neues PDF erzeugen.
- Fedlex-Begriffe für Kündigungsfrist und Kündigungstermin («délai de congé» / «terme de congé», «termine di disdetta» / «scadenza di disdetta»): Sie kommen in Abrechnung und Mahnbrief nicht vor. Die Mietvertragsseiten und die Hilfe sind auf Deutsch, die Oberflächensprache durfte ich nicht ändern.
- Englischer Mahnbrief: Die Aufgabe sah keine Mahnung für Weber vor (Rückerstattung).

## Runde 2

Der Koordinator hat die gespeicherten PDFs gelöscht. Danach habe ich die Abrechnungen 2025 von Nina Brunner (FR, Rückerstattung) und Thomas Weber (EN, Rückerstattung) neu geöffnet, nur angesehen, nichts gespeichert. Beide kommen jetzt in der richtigen Sprache. Die Beobachtung «Brunner und Weber kommen auf Deutsch» aus Runde 1 ist damit erledigt: Ursache war das zwischengespeicherte PDF aus der Zeit vor der Sprachänderung per SQL.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-7 | Nit | Abrechnungs-PDF EN (Weber), Hinweise | «Art. 257b para. 2 CO» nennt das Gesetz englisch/französisch abgekürzt, «Art. 8 para. 1 VMWG» dagegen deutsch. Einem englischsprachigen Mieter sagt «VMWG» nichts. Besser einmal ausschreiben, z. B. «Art. 8 para. 1 of the Ordinance on the Lease of Residential and Commercial Property (VMWG)». |
| P-8 | Nit | Abrechnungs-PDF EN, Kostenübersicht | Verteilschlüssel «Per Unit» / «Per Area» in Grossschreibung, und ohne «(m²)», das FR («Par surface (m²)») und DE haben. Die Zeile darunter zeigt zwar «68.00 / 320.00 m²», trotzdem uneinheitlich. Übliche Schreibweise: «Per unit», «Per area (m²)». |

P-1 gilt auch für Brunner (FR): «Frais de gestion : 3 % du sous-total de CHF 1'306.92». Das Englische «Management fee» ist unbedenklich, weil es keinen amtlichen englischen Wortlaut gibt.

### Gelesen und in Ordnung

- **Rückerstattungssatz FR:** «Nous vous verserons le montant au plus tard le 16.11.2026. Pour ce faire, veuillez nous communiquer votre IBAN si vous ne l’avez pas encore fait.» Klar und höflich.
- **Rückerstattungssatz EN:** «We will transfer the amount to you by 16.11.2026. Please send us your IBAN if you have not already done so.» Klar.
- **Erklärung FR:** wie bei Dubois, ergänzt um «Pour les frais de chauffage, la part temporelle est la part selon le profil de chauffage.» Verständlich.
- **Erklärung EN:** «Building costs: the invoices for the billing period; an invoice with a service period counts only for its days within the period. Apartment share: your apartment’s part of the building costs under the distribution key. Time share: your days rented in the billing period. Your share is the apartment share multiplied by the time share.» Gut lesbar.
- **Heizabschnitt FR (Brunner):** «Frais de chauffage selon le profil « Chauffage + eau chaude » : 44.20 % des frais de chauffage de votre logement pour la période de décompte», danach «Parts des mois de votre bail : juil. 3.70 %, août 3.60 %, sept. 3.70 %, oct. 9.50 %, nov. 10.70 %, déc. 13.00 %». Nachgerechnet: Die Monate ergeben zusammen 44.20 %, das stimmt. 1’054.47 × 44.20 % = 466.08, stimmt auch.
- **Heizabschnitt EN (Weber):** Weber hat keinen eigenen Heizabschnitt. Er war das ganze Jahr Mieter, die Heizung wird also wie die übrigen Positionen nach Tagen geteilt (365/365). Plausibel.
- **Hinweise FR:** art. 257b al. 2 CO, art. 8 al. 1 OBLF, korrekt.
- **Hinweise EN:** «You or a person you authorise may inspect the supporting documents. To do so, please contact Muster Immobilien AG, …» Inhaltlich korrekt (Art. 257b Abs. 2 OR, Art. 8 Abs. 1 VMWG).
- **Rundung:** Brunner 93.87 → 93.85, Weber 34.56 → 34.55. Beide auf 5 Rappen abgerundet, zugunsten des Verwalters, aber im Rahmen des Rundungsbetrags.

### Nicht geprüft (Runde 2)

- Englischer und französischer Mahnbrief bei Rückerstattung: Bei einer Rückerstattung gibt es keine Mahnung.
- Mit «Aufgabe geschafft» ist jetzt auch Schritt 1 erledigt: Alle vier PDFs sind gelesen. Gesamtergebnis: ja.
