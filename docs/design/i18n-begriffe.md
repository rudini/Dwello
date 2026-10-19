# UI terms in four languages

One French, Italian and English term per German domain term from `UBIQUITOUS_LANGUAGE.md` (which stays German and unchanged). The UI texts in `messages/{fr,it,en}.json` use exactly these words. Where the statement PDF (`backend/src/services/pdf.service.ts`) already translates a term, the UI reuses its translation. Where the official Swiss texts (Fedlex: OR and VMWG in French and Italian) have a word for the term, it is used (#83); English keeps plain words. Terms marked with ❓ have no Fedlex word and wait for a native speaker: issue #342.

Style: French guillemets with a non-breaking space inside (« Immeubles »), Italian and German without; formal address (vous, Lei), buttons start with a verb (French and Italian in the infinitive: «Enregistrer», «Salvare»), Swiss conventions (CHF, «NPA», Italian «pigione»).

| German | Français | Italiano | English |
|---|---|---|---|
| Gebäude, Liegenschaft | immeuble | immobile | building |
| Gebäudetyp | type d’immeuble | tipo di immobile | building type |
| Baujahr | année de construction | anno di costruzione | year built |
| PLZ / Ort / Kanton | NPA / localité / canton | NPA / località / cantone | postcode / town / canton |
| Wohnung | appartement | appartamento | apartment |
| Wohnungsnummer | numéro d’appartement | numero dell’appartamento | apartment number |
| Stockwerk | étage | piano | floor |
| Fläche | surface | superficie | area |
| Zimmeranzahl | nombre de pièces | numero di locali | number of rooms |
| Mietstatus | statut de location | stato di locazione | rental status |
| Vermietet / Vermietet ab {Datum} / Vermietet bis {Datum} / Leer / Leer seit {Datum} / Gesperrt | loué / loué dès le {date} / loué jusqu’au {date} / vacant / vacant depuis le {date} / bloqué | locato / locato dal {date} / locato fino al {date} / sfitto / sfitto dal {date} / bloccato | let / let from {date} / let until {date} / vacant / vacant since {date} / blocked |
| Mieter | locataire | inquilino | tenant |
| Mieter: aktiv / künftig / ehemalig | actif / futur / ancien | attivo / futuro / ex | active / future / former |
| Korrespondenzkanal | canal de correspondance | canale di corrispondenza | correspondence channel |
| Korrespondenzadresse | adresse de correspondance | indirizzo di corrispondenza | correspondence address |
| Brief / E-Mail | lettre / e-mail | lettera / e-mail | letter / email |
| Vermieter | bailleur | locatore | landlord |
| Liegenschaftsverwalter | gérant d’immeubles | amministratore di immobili | property manager |
| Mietvertrag | contrat de bail | contratto di locazione | rental contract |
| Vertragsbeginn / Vertragsende | début du contrat / fin du contrat | inizio del contratto / fine del contratto | contract start / contract end |
| Vertragsstatus: laufend / künftig / beendet | en cours / futur / terminé | in corso / futuro / terminato | current / future / ended |
| Befristet / Unbefristet | durée déterminée / durée indéterminée | a tempo determinato / a tempo indeterminato | fixed-term / open-ended |
| Nachmieter / Mieterwechsel | nouveau locataire / changement de locataire | nuovo inquilino / cambio d’inquilino | new tenant / change of tenant |
| Ersatzmieter | locataire de remplacement | nuovo inquilino ❓ (#405) | replacement tenant |
| Kündigung / gekündigt / Kündigungstermin / Kündigung aufheben | résiliation / résilié / terme de congé / annuler la résiliation | disdetta / disdetto / scadenza di disdetta / revocare la disdetta ❓ | notice of termination / terminated by notice / termination date / withdraw notice |
| Kündigungsfrist | délai de congé | termine di preavviso | notice period |
| Nettomiete (Mietzins) | loyer net (loyer) | pigione netta (pigione) | net rent (rent) |
| Zusatzmiete | loyer supplémentaire | pigione supplementare | additional rent |
| Akonto | acompte | acconto | advance payment |
| Geleistete Akontobeiträge | acomptes versés | acconti versati | advance payments made |
| Vereinbarte Nebenkosten / Nicht vereinbart | frais accessoires convenus / non convenue | spese accessorie pattuite / non pattuita | agreed utility costs / not agreed |
| Referenzindex | taux de référence | tasso di riferimento | reference rate |
| Rechnung | facture | fattura | invoice |
| Beleg (hochgeladene Datei einer Rechnung, #217) | pièce justificative | giustificativo | supporting document |
| Gutschrift (eines Rechnungsstellers) | note de crédit | nota di credito | credit note |
| Akontorechnung (eines Rechnungsstellers) | facture d’acompte | fattura d’acconto | advance invoice |
| Schlussrechnung (eines Rechnungsstellers) | facture finale | fattura finale | final invoice |
| Mahnung eines Rechnungsstellers | rappel (de l’émetteur de la facture) | sollecito (dell’emittente della fattura) | payment reminder (from the invoice issuer) |
| Auslesen | lire (les indications) | leggere (i dati) | read (the details) |
| Mahngebühr / Verzugszins | frais de rappel / intérêt moratoire | spese di sollecito / interesse di mora | reminder fee / default interest |
| Rechnungssteller | émetteur de la facture | emittente della fattura | invoice issuer |
| Lieferant | fournisseur | fornitore | supplier |
| Rechnungsnummer / Rechnungsdatum | numéro de facture / date de facture | numero di fattura / data della fattura | invoice number / invoice date |
| Betrag | montant | importo | amount |
| Fälligkeitsdatum / Zahlungsdatum | date d’échéance / date de paiement | data di scadenza / data di pagamento | due date / payment date |
| Umlagefähig | imputable ❓ | addebitabile | allocable |
| abgerechnet (Rechnung, #409) | décomptée | conteggiata | in a statement |
| Wartung (umlagefähig, Art. 5 Abs. 2 lit. g VMWG; nicht «Unterhalt» nach Art. 256 OR) | maintenance (nicht «entretien») | manutenzione | servicing (nicht «maintenance») |
| Vollservicevertrag (Lift) | contrat de maintenance complet | contratto di manutenzione completo | full-service contract |
| Verordnung über die Miete (VMWG) | ordonnance sur le bail (OBLF) | ordinanza concernente la locazione (OLAL) | Tenancy Ordinance (VMWG) |
| Kategorie / Kategorisierung | catégorie / catégorisation | categoria / categorizzazione | category / categorisation |
| Vordefinierte Kategorie «Von Dwello» / Eigene Kategorie «Eigene» (#166, #205) | «De Dwello» / «Personnalisée» | «Da Dwello» / «Personalizzata» | «From Dwello» / «Custom» |
| KI / KI-Kategorie | IA / catégorie proposée par l’IA | IA / categoria proposta dall’IA | AI / AI category |
| Konfidenz | fiabilité ❓ | affidabilità ❓ | confidence |
| Manuell überschrieben / Grund der Änderung | modifié manuellement / motif de la modification | modificato manualmente / motivo della modifica | manually overridden / reason for the change |
| Verteilschlüssel / Eigener Verteilschlüssel | clé de répartition / clé de répartition personnalisée | chiave di riparto / chiave di riparto personalizzata | distribution key / custom distribution key |
| Wohnungsanteil | part du logement | quota appartamento | apartment share |
| Heizprofil / Standard-Heizprofil | profil de chauffage / profil de chauffage par défaut | profilo di riscaldamento / profilo di riscaldamento predefinito | heating profile / default heating profile |
| Nebenkosten | frais accessoires | spese accessorie | utility costs |
| Nebenkostenabrechnung | décompte des charges | conteggio spese accessorie | utility cost statement |
| Abrechnung (short) | décompte | conteggio | statement |
| Abrechnungslauf | établissement des décomptes | allestimento dei conteggi | statement run |
| Abrechnungsperiode | période de décompte | periodo di conteggio | billing period |
| Abrechnungsposition | poste du décompte | voce del conteggio | statement line |
| Abrechnungsnummer / Abrechnungsdatum | numéro de décompte / date du décompte | numero di conteggio / data del conteggio | statement number / statement date |
| Leistungszeitraum | période de prestation | periodo di prestazione | service period |
| Kosten des Gebäudes | coûts de l’immeuble | costi immobile | building costs |
| Verwaltungspauschale | frais de gestion | spese di gestione | management fee |
| Zahlung zurücksetzen | Retirer le paiement saisi | Rimuovere il pagamento registrato | Reset payment |
| Nebenkostenpauschale (#66) | forfait de frais accessoires ❓ | forfait per le spese accessorie ❓ | flat-rate utility charge |
| Saldo / Nachzahlung / Rückerstattung | solde / montant à payer / remboursement | saldo / importo dovuto / rimborso | balance / amount due / refund |
| Berichtigte Abrechnung (#120) | décompte rectificatif | conteggio rettificato | corrected statement |
| Ersetzt (Abrechnungsstatus, #120) | remplacé | sostituito | replaced |
| Abrechnung berichtigen / Berichtigte Abrechnung erstellen | Rectifier le décompte / Établir le décompte rectificatif | Rettificare il conteggio / Allestire il conteggio rettificato | Correct statement / Create corrected statement |
| Bereits bezahlt / Bereits zurückerstattet auf NK-… (#362) | déjà payé / déjà remboursé sur NK-… | già pagato / già rimborsato su NK-… | already paid / already refunded on NK-… |
| Ausgeglichen (Saldo 0) | solde nul | in pareggio | nil balance |
| Mietstage | jours de location | giorni di locazione | days rented |
| Abgerechnet bis | décompté jusqu’au | conteggiato fino al | billed until |
| Leerstand | vacance | sfitto | vacancy |
| Entwurf / Versendet / Bezahlt / Überfällig | brouillon / envoyé / payé / en retard | bozza / inviato / pagato / scaduto | draft / sent / paid / overdue |
| Zahlungsfrist | délai de paiement | termine di pagamento | payment deadline |
| Mahnung / Zahlungserinnerung / 2. Mahnung | rappel / rappel de paiement / 2e rappel | sollecito / promemoria di pagamento / 2° sollecito | reminder / payment reminder / 2nd reminder |
| Mahnstufe / Mahnfrist | niveau de rappel / délai de rappel | livello di sollecito / termine di sollecito | reminder level / reminder period |
| Dokument / Versandstatus / Zu versenden | document / statut d’envoi / à envoyer | documento / stato di invio / da inviare | document / dispatch status / to send |
| hochladen / Hochgeladenes Dokument | téléverser / document téléversé | caricare / documento caricato | upload / uploaded document |
| Übergabeprotokoll | procès-verbal de remise | verbale di consegna | handover report |
| Betreibungsauszug | extrait du registre des poursuites | estratto del registro delle esecuzioni | debt collection register extract |
| Ausweiskopie | copie de pièce d’identité | copia di un documento d’identità | copy of an ID document |
| QR-Rechnung / Zahlteil / QR-Referenz | QR-facture / section paiement / référence QR | QR-fattura / sezione pagamento / riferimento QR | QR-bill / payment part / QR reference |
| Tankbestand / Heizmaterial | stock de combustible / combustible | scorta di combustibile / combustibile | fuel stock / fuel |
| Veränderung Tankbestand | variation du stock de combustible | variazione della scorta di combustibile | change in fuel stock |
| Anfangsbestand / Endbestand | stock initial / stock final | scorta iniziale / scorta finale | opening stock / closing stock |
| Tank / Tank stillgelegt / Verbrauch (Heizmaterial) | citerne / citerne désaffectée / consommation | serbatoio / serbatoio dismesso / consumo | tank / tank decommissioned / consumption |
| Zeitanteil | part temporelle | quota temporale | time share |
| Firmenname / Firmenadresse | nom de l’entreprise / adresse de l’entreprise | nome dell’azienda / indirizzo dell’azienda | company name / company address |
| Protokoll (Einstellungen) / Protokoll des Servers | journal / journal du serveur | registro / registro del server | log / server log |
| Betreiber / Verantwortlicher (DSG) / Auftragsbearbeiter (DSG) | exploitant / responsable du traitement / sous-traitant | gestore / titolare del trattamento / responsabile del trattamento | operator / controller / processor |
| Mietzinsdepot / Freigabe des Mietzinsdepots | garantie de loyer / libération de la garantie de loyer | deposito di garanzia / svincolo del deposito di garanzia | rent deposit / release of the rent deposit |
| Übersicht | vue d’ensemble | panoramica | overview |

Names of master data (categories, distribution keys, heating profiles) come from the database columns `name_fr`, `name_it`, `name_en`, not from the message files.

## Verbs and labels quoted elsewhere

The help page quotes these labels, so the buttons must use the same words.

| German | Français | Italiano | English |
|---|---|---|---|
| erfassen (… erfassen) | saisir | registrare | add |
| speichern | enregistrer | salvare | save |
| bearbeiten | modifier | modificare | edit |
| löschen | supprimer | eliminare | delete |
| Mietvertrag erfassen | Saisir un contrat de bail | Registrare un contratto di locazione | Add rental contract |
| Mietvertrag speichern | Enregistrer le contrat de bail | Salvare il contratto di locazione | Save rental contract |
| Abrechnungen erstellen | Établir les décomptes | Allestire i conteggi | Create statements |
| Entwürfe erstellen | Créer les brouillons | Creare le bozze | Create drafts |
| Als versendet markieren | Marquer comme envoyé | Segnare come inviato | Mark as sent |
| Als bezahlt markieren | Marquer comme payé | Segnare come pagato | Mark as paid |
| Mahnung senden | Envoyer un rappel | Inviare un sollecito | Send reminder |
| Zurück / Weiter / Abbrechen | Retour / Continuer / Annuler | Indietro / Avanti / Annullare | Back / Next / Cancel |
