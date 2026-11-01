/**
 * Everything the landlord entered in Dwello, as one ZIP under «Einstellungen» (#496, decided by the product owner on
 * 31.10.2026; domain review docs/reviews/496-fachreview-1.md): a data file with the relations (English keys, values
 * as stored), one table per kind of data in the UI language, the files and a README.txt. What was deleted is gone
 * from the database and so from the export; Protokoll entries naming it stay (F-3). Left out as secrets or technique
 * (F-2): access keys, accounts, the chosen KI, backups, the numbering. Reads only: the BFF makes the ZIP and then
 * records the export (F-4). TODO(fachlich prüfen, #1039): the terms «Export aller Daten» and «Datendatei»
 */

import { asc, getTableColumns } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	apartments,
	buildings,
	categories,
	contractAdvancePayments,
	contractCategories,
	distributionKeys,
	documents,
	fuelStocks,
	heatingProfiles,
	invoiceDocuments,
	invoices,
	rentalContracts,
	tenants,
	utilityStatementLineItems,
	utilityStatements
} from '../db/schema';
import { auditLogWithExpiries } from './access-key.service';
import { apartmentStatus, nextContractStart } from './apartment.service';
import { getAllConfig } from './config.service';
import { EXTENSIONS, NAMES, safe, zipFiles } from './tenant-export.service';
import { swissToday } from './today';

export type Language = keyof typeof NAMES;
type Cell = string | number | boolean | Date | null | undefined;
const INDEX = { de: 0, fr: 1, it: 2, en: 3 } as const;

// Column names in the UI language, with the words of the UI (domain review V-4, F-5)
const COLUMNS = {
	id: ['ID', 'ID', 'ID', 'ID'],
	name: ['Name', 'Nom', 'Nome', 'Name'],
	nameDE: ['Name de', 'Nom de', 'Nome de', 'Name de'],
	nameFR: ['Name fr', 'Nom fr', 'Nome fr', 'Name fr'],
	nameIT: ['Name it', 'Nom it', 'Nome it', 'Name it'],
	nameEN: ['Name en', 'Nom en', 'Nome en', 'Name en'],
	address: ['Adresse', 'Adresse', 'Indirizzo', 'Address'],
	postalCode: ['PLZ', 'NPA', 'NPA', 'Postcode'],
	city: ['Ort', 'Localité', 'Località', 'Town'],
	canton: ['Kanton', 'Canton', 'Cantone', 'Canton'],
	country: ['Land', 'Pays', 'Paese', 'Country'],
	latitude: ['Breitengrad', 'Latitude', 'Latitudine', 'Latitude'],
	longitude: ['Längengrad', 'Longitude', 'Longitudine', 'Longitude'],
	buildingType: ['Gebäudetyp', 'Type d’immeuble', 'Tipo di immobile', 'Building type'],
	yearBuilt: ['Baujahr', 'Année de construction', 'Anno di costruzione', 'Year built'],
	noTank: ['Kein Tank', 'Pas de citerne', 'Nessun serbatoio', 'No tank'],
	createdAt: ['Erfasst am', 'Saisi le', 'Registrato il', 'Entered on'],
	updatedAt: ['Geändert am', 'Modifié le', 'Modificato il', 'Changed on'],
	buildingId: ['Gebäude-ID', 'ID de l’immeuble', 'ID dell’immobile', 'Building ID'],
	building: ['Gebäude', 'Immeuble', 'Immobile', 'Building'],
	number: ['Nummer', 'Numéro', 'Numero', 'Number'],
	floor: ['Stockwerk', 'Étage', 'Piano', 'Floor'],
	area: ['Fläche (m²)', 'Surface (m²)', 'Superficie (m²)', 'Area (m²)'],
	rooms: ['Zimmer', 'Pièces', 'Locali', 'Rooms'],
	status: ['Status', 'Statut', 'Stato', 'Status'],
	rentalStatus: ['Mietstatus', 'Statut de location', 'Stato di locazione', 'Rental status'],
	firstName: ['Vorname', 'Prénom', 'Nome', 'First name'],
	lastName: ['Nachname', 'Nom', 'Cognome', 'Last name'],
	email: ['E-Mail', 'E-mail', 'E-mail', 'Email'],
	phone: ['Telefon', 'Téléphone', 'Telefono', 'Phone'],
	language: ['Sprache', 'Langue', 'Lingua', 'Language'],
	correspondenceAddress: ['Korrespondenzadresse', 'Adresse de correspondance', 'Indirizzo di corrispondenza', 'Correspondence address'],
	correspondencePostalCode: ['Korrespondenzadresse PLZ', 'Adresse de correspondance NPA', 'Indirizzo di corrispondenza NPA', 'Correspondence address postcode'],
	correspondenceCity: ['Korrespondenzadresse Ort', 'Adresse de correspondance localité', 'Indirizzo di corrispondenza località', 'Correspondence address town'],
	correspondenceCountry: ['Korrespondenzadresse Land', 'Adresse de correspondance pays', 'Indirizzo di corrispondenza paese', 'Correspondence address country'],
	correspondenceChannel: ['Korrespondenzkanal', 'Canal de correspondance', 'Canale di corrispondenza', 'Correspondence channel'],
	anonymisedOn: ['Anonymisiert am', 'Anonymisé le', 'Anonimizzato il', 'Anonymised on'],
	apartmentId: ['Wohnung-ID', 'ID de l’appartement', 'ID dell’appartamento', 'Apartment ID'],
	apartment: ['Wohnung', 'Appartement', 'Appartamento', 'Apartment'],
	tenantId: ['Mieter-ID', 'ID du locataire', 'ID dell’inquilino', 'Tenant ID'],
	tenant: ['Mieter', 'Locataire', 'Inquilino', 'Tenant'],
	startDate: ['Vertragsbeginn', 'Début du contrat', 'Inizio del contratto', 'Contract start'],
	endDate: ['Vertragsende', 'Fin du contrat', 'Fine del contratto', 'Contract end'],
	terminated: ['Gekündigt', 'Résilié', 'Disdetto', 'Terminated by notice'],
	noticeReceivedOn: ['Kündigung erhalten am', 'Résiliation reçue le', 'Disdetta ricevuta il', 'Notice received on'],
	billedUntil: ['Abgerechnet bis', 'Décompté jusqu’au', 'Conteggiato fino al', 'Billed until'],
	movedOut: ['Auszug bestätigt', 'Déménagement confirmé', 'Trasloco confermato', 'Move-out confirmed'],
	documentsCheckedOn: ['Dokumente geprüft am', 'Documents vérifiés le', 'Documenti verificati il', 'Documents checked on'],
	baseRent: ['Nettomiete', 'Loyer net', 'Pigione netta', 'Net rent'],
	additionalRent: ['Zusatzmiete', 'Loyer supplémentaire', 'Pigione supplementare', 'Additional rent'],
	monthlyAdvancePayment: ['Akonto', 'Acompte', 'Acconto', 'Advance payment'],
	flatRateUtilityCharge: ['Nebenkostenpauschale', 'Forfait de frais accessoires', 'Forfait per le spese accessorie', 'Flat-rate utility charge'],
	managementFeeAgreed: ['Vereinbarte Verwaltungspauschale', 'Frais d’administration convenus', 'Spese amministrative pattuite', 'Agreed management fee'],
	ownRate: ['Eigener Satz (%)', 'Taux propre (%)', 'Aliquota propria (%)', 'Own rate (%)'],
	contractFile: ['Mietvertrag im Export', 'Contrat de bail dans l’exportation', 'Contratto di locazione nell’esportazione', 'Rental contract in the export'],
	notes: ['Bemerkungen', 'Remarques', 'Osservazioni', 'Notes'],
	contractId: ['Mietvertrag-ID', 'ID du contrat de bail', 'ID del contratto di locazione', 'Rental contract ID'],
	validFrom: ['Gültig ab', 'Valable dès le', 'Valido dal', 'Valid from'],
	amount: ['Betrag', 'Montant', 'Importo', 'Amount'],
	categoryId: ['Kategorie-ID', 'ID de la catégorie', 'ID della categoria', 'Category ID'],
	category: ['Kategorie', 'Catégorie', 'Categoria', 'Category'],
	agreed: ['Vereinbart', 'Convenu', 'Pattuito', 'Agreed'],
	agreedFrom: ['Vereinbart ab', 'Convenu dès le', 'Pattuito dal', 'Agreed from'],
	invoiceNumber: ['Rechnungsnummer', 'Numéro de facture', 'Numero di fattura', 'Invoice number'],
	supplier: ['Rechnungssteller', 'Émetteur de la facture', 'Emittente della fattura', 'Invoice issuer'],
	supplierAddress: ['Adresse Rechnungssteller', 'Adresse de l’émetteur de la facture', 'Indirizzo dell’emittente della fattura', 'Invoice issuer address'],
	description: ['Beschreibung', 'Description', 'Descrizione', 'Description'],
	distributionKeyId: ['Verteilschlüssel-ID', 'ID de la clé de répartition', 'ID della chiave di riparto', 'Distribution key ID'],
	distributionKey: ['Verteilschlüssel', 'Clé de répartition', 'Chiave di riparto', 'Distribution key'],
	allocable: ['Umlagefähig', 'Répercutable', 'Addebitabile', 'Allocable'],
	invoiceDate: ['Rechnungsdatum', 'Date de facture', 'Data della fattura', 'Invoice date'],
	servicePeriodStart: ['Leistung von', 'Prestation du', 'Prestazione dal', 'Service from'],
	servicePeriodEnd: ['Leistung bis', 'Prestation au', 'Prestazione al', 'Service to'],
	dueDate: ['Fällig am', 'Échéance le', 'Scadenza il', 'Due on'],
	paidDate: ['Bezahlt am', 'Payé le', 'Pagato il', 'Paid on'],
	llmCategory: ['KI-Kategorie', 'Catégorie proposée par l’IA', 'Categoria proposta dall’IA', 'AI category'],
	llmConfidence: ['Konfidenz (%)', 'Degré de confiance (%)', 'Grado di certezza (%)', 'Confidence (%)'],
	overridden: ['Von Hand geändert', 'Modifié à la main', 'Modificato a mano', 'Changed by hand'],
	overrideReason: ['Grund der Änderung', 'Motif de la modification', 'Motivo della modifica', 'Reason for the change'],
	invoiceId: ['Rechnung-ID', 'ID de la facture', 'ID della fattura', 'Invoice ID'],
	fileName: ['Dateiname', 'Nom du fichier', 'Nome del file', 'File name'],
	file: ['Datei im Export', 'Fichier dans l’exportation', 'File nell’esportazione', 'File in the export'],
	deductedAmount: ['Abgezogener Betrag', 'Montant déduit', 'Importo dedotto', 'Deducted amount'],
	nonAllocableItems: ['Nicht umlagefähige Positionen', 'Postes non répercutables', 'Voci non addebitabili', 'Non-allocable items'],
	uploadedAt: ['Hochgeladen am', 'Téléversé le', 'Caricato il', 'Uploaded on'],
	readingDate: ['Ablesedatum', 'Date du relevé', 'Data della lettura', 'Reading date'],
	statementId: ['Abrechnung-ID', 'ID du décompte', 'ID del conteggio', 'Statement ID'],
	statementNumber: ['Abrechnungsnummer', 'Numéro du décompte', 'Numero del conteggio', 'Statement number'],
	periodStart: ['Periode von', 'Période du', 'Periodo dal', 'Period from'],
	periodEnd: ['Periode bis', 'Période au', 'Periodo al', 'Period to'],
	statementDate: ['Abrechnungsdatum', 'Date du décompte', 'Data del conteggio', 'Statement date'],
	rentalDays: ['Mietstage', 'Jours de location', 'Giorni di locazione', 'Days rented'],
	rentalStart: ['Mietbeginn', 'Début de la location', 'Inizio della locazione', 'Rental start'],
	rentalEnd: ['Mietende', 'Fin de la location', 'Fine della locazione', 'Rental end'],
	costShare: ['Kostenanteil (mit Verwaltungspauschale)', 'Part des coûts (avec frais d’administration)', 'Quota dei costi (con spese amministrative)', 'Cost share (with management fee)'],
	advancePayments: ['Akontobeiträge', 'Acomptes', 'Acconti', 'Advance payments'],
	managementFeePercent: ['Verwaltungspauschale (%)', 'Frais d’administration (%)', 'Spese amministrative (%)', 'Management fee (%)'],
	managementFee: ['Verwaltungspauschale', 'Frais d’administration', 'Spese amministrative', 'Management fee'],
	heatingProfile: ['Heizprofil', 'Profil de chauffage', 'Profilo di riscaldamento', 'Heating profile'],
	carryOver: ['Übertrag', 'Report', 'Riporto', 'Carried over'],
	carriedFrom: ['Übertrag aus Abrechnung', 'Report du décompte', 'Riporto dal conteggio', 'Carried over from statement'],
	carrySettledOn: ['Von Hand ausgeglichen am', 'Soldé manuellement le', 'Saldato manualmente il', 'Settled by hand on'],
	priorPayments: ['Bereits bezahlt', 'Déjà payé', 'Già pagato', 'Already paid'],
	balance: ['Saldo', 'Solde', 'Saldo', 'Balance'],
	paidAmount: ['Bezahlter Betrag', 'Montant payé', 'Importo pagato', 'Amount paid'],
	openAmount: ['Offener Betrag', 'Montant dû', 'Importo dovuto', 'Amount outstanding'],
	paymentDeadline: ['Zahlungsfrist', 'Délai de paiement', 'Termine di pagamento', 'Payment deadline'],
	reminderSentDate: ['Erinnert am', 'Rappel envoyé le', 'Promemoria inviato il', 'Reminded on'],
	replaces: ['Ersetzt Abrechnung', 'Remplace le décompte', 'Sostituisce il conteggio', 'Replaces statement'],
	correctionDeclined: ['Nicht berichtigt am', 'Non rectifié le', 'Non rettificato il', 'Not corrected on'],
	qrBillReference: ['QR-Referenz', 'Référence QR', 'Riferimento QR', 'QR reference'],
	pdf: ['PDF im Export', 'PDF dans l’exportation', 'PDF nell’esportazione', 'PDF in the export'],
	date: ['Datum', 'Date', 'Data', 'Date'],
	buildingCosts: ['Kosten des Gebäudes', 'Coûts de l’immeuble', 'Costi dell’immobile', 'Building costs'],
	apartmentShare: ['Wohnungsanteil', 'Part du logement', 'Quota appartamento', 'Apartment share'],
	sharePercentage: ['Anteil (%)', 'Part (%)', 'Quota (%)', 'Share (%)'],
	periodShare: ['Zeitanteil', 'Part temporelle', 'Quota temporale', 'Time share'],
	positionRentalDays: ['Mietstage der Position', 'Jours de location du poste', 'Giorni di locazione della voce', 'Days rented of the item'],
	billedDays: ['Abgerechnete Tage', 'Jours décomptés', 'Giorni conteggiati', 'Billed days'],
	tenantShare: ['Mieteranteil', 'Part du locataire', 'Quota dell’inquilino', 'Tenant share'],
	statement: ['Abrechnung', 'Décompte', 'Conteggio', 'Statement'],
	type: ['Art', 'Type', 'Tipo', 'Type'],
	reminderLevel: ['Mahnstufe', 'Niveau de rappel', 'Livello di sollecito', 'Reminder level'],
	title: ['Titel', 'Titre', 'Titolo', 'Title'],
	channel: ['Kanal', 'Canal', 'Canale', 'Channel'],
	sentAt: ['Versendet am', 'Envoyé le', 'Inviato il', 'Sent on'],
	recipient: ['Empfänger', 'Destinataire', 'Destinatario', 'Recipient'],
	deliveryError: ['Zustellfehler', 'Erreur de distribution', 'Errore di recapito', 'Delivery error'],
	isHeatingCost: ['Heizkosten', 'Frais de chauffage', 'Spese di riscaldamento', 'Heating costs'],
	isFuel: ['Brennstoff', 'Combustible', 'Combustibile', 'Fuel'],
	sortOrder: ['Reihenfolge', 'Ordre', 'Ordine', 'Order'],
	formula: ['Formel', 'Formule', 'Formula', 'Formula'],
	sourceDE: ['Quelle de', 'Source de', 'Fonte de', 'Source de'],
	sourceFR: ['Quelle fr', 'Source fr', 'Fonte fr', 'Source fr'],
	sourceIT: ['Quelle it', 'Source it', 'Fonte it', 'Source it'],
	sourceEN: ['Quelle en', 'Source en', 'Fonte en', 'Source en'],
	occurredAt: ['Datum und Uhrzeit', 'Date et heure', 'Data e ora', 'Date and time'],
	entry: ['Eintrag', 'Entrée', 'Voce', 'Entry'],
	details: ['Angaben (JSON)', 'Indications (JSON)', 'Indicazioni (JSON)', 'Details (JSON)'],
	setting: ['Einstellung', 'Paramètre', 'Impostazione', 'Setting'],
	value: ['Wert', 'Valeur', 'Valore', 'Value'],
	januaryPct: ['Januar (%)', 'janvier (%)', 'gennaio (%)', 'January (%)'],
	februaryPct: ['Februar (%)', 'février (%)', 'febbraio (%)', 'February (%)'],
	marchPct: ['März (%)', 'mars (%)', 'marzo (%)', 'March (%)'],
	aprilPct: ['April (%)', 'avril (%)', 'aprile (%)', 'April (%)'],
	mayPct: ['Mai (%)', 'mai (%)', 'maggio (%)', 'May (%)'],
	junePct: ['Juni (%)', 'juin (%)', 'giugno (%)', 'June (%)'],
	julyPct: ['Juli (%)', 'juillet (%)', 'luglio (%)', 'July (%)'],
	augustPct: ['August (%)', 'août (%)', 'agosto (%)', 'August (%)'],
	septemberPct: ['September (%)', 'septembre (%)', 'settembre (%)', 'September (%)'],
	octoberPct: ['Oktober (%)', 'octobre (%)', 'ottobre (%)', 'October (%)'],
	novemberPct: ['November (%)', 'novembre (%)', 'novembre (%)', 'November (%)'],
	decemberPct: ['Dezember (%)', 'décembre (%)', 'dicembre (%)', 'December (%)']
} as const;
type Column = keyof typeof COLUMNS;

// Values the UI shows as words (F-5): Ja/Nein, the status of a statement, Von Dwello/Eigene
const WORDS = {
	yes: ['ja', 'oui', 'sì', 'yes'],
	no: ['nein', 'non', 'no', 'no'],
	draft: ['Entwurf', 'Brouillon', 'Bozza', 'Draft'],
	sent: ['Versendet', 'Envoyé', 'Inviato', 'Sent'],
	overdue: ['Überfällig', 'En retard', 'Scaduto', 'Overdue'],
	paid: ['Bezahlt', 'Payé', 'Pagato', 'Paid'],
	settled: ['Erledigt', 'Clôturé', 'Chiuso', 'Closed'],
	replaced: ['Ersetzt', 'Remplacé', 'Sostituito', 'Replaced'],
	predefined: ['Von Dwello', 'De Dwello', 'Da Dwello', 'From Dwello'],
	keyPredefined: ['Vordefiniert', 'Prédéfinie', 'Preimpostata', 'Predefined'],
	profilePredefined: ['Vordefiniert', 'Prédéfini', 'Preimpostato', 'Predefined'],
	custom: ['Eigene', 'Personnalisée', 'Personalizzata', 'Custom'],
	occupied: ['Vermietet', 'Loué', 'Locato', 'Let'],
	relet: ['Vermietet ab {date}', 'Loué dès le {date}', 'Locato dal {date}', 'Let from {date}'],
	vacant: ['Leer', 'Vacant', 'Sfitto', 'Vacant'],
	reserved: ['Gesperrt', 'Bloqué', 'Bloccato', 'Blocked'],
	feeRun: ['Ja, zum Satz des Abrechnungslaufs', 'Oui, au taux de l’établissement des décomptes', 'Sì, all’aliquota dell’allestimento dei conteggi', 'Yes, at the rate of the statement run'],
	feeOwn: ['Ja, mit eigenem Satz', 'Oui, avec un taux propre', 'Sì, con un’aliquota propria', 'Yes, with its own rate'],
	feeNone: ['Nein', 'Non', 'No', 'No'],
	de: ['Deutsch', 'Allemand', 'Tedesco', 'German'],
	fr: ['Französisch', 'Français', 'Francese', 'French'],
	it: ['Italienisch', 'Italien', 'Italiano', 'Italian'],
	en: ['Englisch', 'Anglais', 'Inglese', 'English'],
	letter: ['Per Brief', 'Par lettre', 'Per lettera', 'By letter'],
	email: ['Per E-Mail', 'Par e-mail', 'Per e-mail', 'By email'],
	to_send: ['Zu versenden', 'À envoyer', 'Da inviare', 'To send'],
	// the kind of a Dokument; TODO(fachlich prüfen, #1039): these five terms
	reminder: ['Mahnung', 'Rappel', 'Sollecito', 'Reminder'],
	statement: ['Abrechnung', 'Décompte', 'Conteggio', 'Statement'],
	new_pdf: ['Neues PDF', 'Nouveau PDF', 'Nuovo PDF', 'New PDF'],
	pdf_before_change: ['PDF vor der Änderung', 'PDF avant la modification', 'PDF prima della modifica', 'PDF before the change'],
	upload: ['Hochgeladen', 'Téléversé', 'Caricato', 'Uploaded'],
	calendar: ['Kalenderjahr (Januar – Dezember)', 'Année civile (janvier – décembre)', 'Anno civile (gennaio – dicembre)', 'Calendar year (January – December)'],
	'july-june': ['Juli – Juni', 'Juillet – juin', 'Luglio – giugno', 'July – June'],
	'november-october': ['November – Oktober', 'Novembre – octobre', 'Novembre – ottobre', 'November – October']
} as const;

// The settings by the names of the form under «Einstellungen»
const SETTINGS: Record<string, readonly [string, string, string, string]> = {
	company_name: ['Firmenname', 'Nom de l’entreprise', 'Nome dell’azienda', 'Company name'],
	company_address: ['Strasse und Hausnummer', 'Rue et numéro', 'Via e numero civico', 'Street and house number'],
	company_postal_code: ['PLZ', 'NPA', 'NPA', 'Postcode'],
	company_city: ['Ort', 'Localité', 'Località', 'Town'],
	company_phone: ['Telefon', 'Téléphone', 'Telefono', 'Phone'],
	company_email: ['E-Mail', 'E-mail', 'E-mail', 'Email'],
	iban: ['IBAN', 'IBAN', 'IBAN', 'IBAN'],
	payment_deadline_days: ['Zahlungsfrist (Tage)', 'Délai de paiement (jours)', 'Termine di pagamento (giorni)', 'Payment deadline (days)'],
	reminder_after_days: ['Mahnfrist (Tage)', 'Délai de rappel (jours)', 'Termine di sollecito (giorni)', 'Reminder period (days)'],
	management_fee_pct: ['Verwaltungspauschale in %', 'Frais d’administration en %', 'Spese amministrative in %', 'Management fee in %'],
	default_distribution_key_id: ['Standard-Verteilschlüssel', 'Clé de répartition par défaut', 'Chiave di riparto predefinita', 'Default distribution key'],
	default_heating_profile_id: ['Standard-Heizprofil', 'Profil de chauffage par défaut', 'Profilo di riscaldamento predefinito', 'Default heating profile'],
	accounting_period: ['Abrechnungsperiode', 'Période de décompte', 'Periodo di conteggio', 'Billing period'],
	default_language: ['Sprache', 'Langue', 'Lingua', 'Language']
};

// Folder and table names in the UI language (draft docs/reviews/496-entwurf.md, F-6); the rest as the tenant's export
const FILES = {
	de: { tables: 'tabellen', belege: 'belege', buildings: 'gebäude', apartments: 'wohnungen', tenants: 'mieter', contracts: 'mietverträge', advances: 'akonto', agreed: 'vereinbarte-nebenkosten', invoices: 'rechnungen', belegeTable: 'belege', fuelStocks: 'tankbestände', statements: 'abrechnungen', lineItems: 'abrechnungspositionen', payments: 'zahlungen', documents: 'dokumente', categories: 'kategorien', keys: 'verteilschlüssel', profiles: 'heizprofile', log: 'protokoll', settings: 'einstellungen' },
	fr: { tables: 'tableaux', belege: 'pièces-justificatives', buildings: 'immeubles', apartments: 'appartements', tenants: 'locataires', contracts: 'contrats-de-bail', advances: 'acomptes', agreed: 'charges-convenues', invoices: 'factures', belegeTable: 'pièces-justificatives', fuelStocks: 'stocks-de-combustible', statements: 'décomptes', lineItems: 'postes-des-décomptes', payments: 'paiements', documents: 'documents', categories: 'catégories', keys: 'clés-de-répartition', profiles: 'profils-de-chauffage', log: 'journal', settings: 'paramètres' },
	it: { tables: 'tabelle', belege: 'giustificativi', buildings: 'immobili', apartments: 'appartamenti', tenants: 'inquilini', contracts: 'contratti-di-locazione', advances: 'acconti', agreed: 'spese-accessorie-pattuite', invoices: 'fatture', belegeTable: 'giustificativi', fuelStocks: 'scorte-di-combustibile', statements: 'conteggi', lineItems: 'voci-dei-conteggi', payments: 'pagamenti', documents: 'documenti', categories: 'categorie', keys: 'chiavi-di-riparto', profiles: 'profili-di-riscaldamento', log: 'registro', settings: 'impostazioni' },
	en: { tables: 'tables', belege: 'supporting-documents', buildings: 'buildings', apartments: 'apartments', tenants: 'tenants', contracts: 'rental-contracts', advances: 'advance-payments', agreed: 'agreed-costs', invoices: 'invoices', belegeTable: 'supporting-documents', fuelStocks: 'fuel-stocks', statements: 'statements', lineItems: 'statement-lines', payments: 'payments', documents: 'documents', categories: 'categories', keys: 'distribution-keys', profiles: 'heating-profiles', log: 'log', settings: 'settings' }
};
type Table = Exclude<keyof (typeof FILES)['de'], 'tables' | 'belege'>;

const swissTime = (at: Date) => at.toLocaleString('sv-SE', { timeZone: 'Europe/Zurich' }).slice(0, 16);
const LOCAL_NAME = { de: 'nameDE', fr: 'nameFR', it: 'nameIT', en: 'nameEN' } as const;

export async function exportAllData(language: Language) {
	const names = NAMES[language];
	const folders = FILES[language];
	const index = INDEX[language];
	const word = (key: keyof typeof WORDS) => WORDS[key][index];
	const { files, file } = zipFiles();

	const cell = (value: Cell): string | null => {
		if (value === null || value === undefined) return null;
		if (typeof value === 'boolean') return word(value ? 'yes' : 'no');
		if (value instanceof Date) return swissTime(value);
		return String(value);
	};
	const tables: { path: string; rows: (string | null)[][] }[] = [];
	const table = (name: Table, columns: Column[], records: Record<string, unknown>[]) =>
		tables.push({
			path: `${folders.tables}/${folders[name]}.csv`,
			rows: [columns.map((column) => COLUMNS[column][index]), ...records.map((record) => columns.map((column) => cell(record[column] as Cell)))]
		});
	const localName = (record: { name: string; nameDE?: string | null; nameFR?: string | null; nameIT?: string | null; nameEN?: string | null } | undefined) =>
		record && (record[LOCAL_NAME[language]] ?? record.name);
	const byId = <T extends { id: string }>(rows: T[]) => new Map(rows.map((row) => [row.id, row]));
	// the name in the UI language first, and the kind as the page of its kind words it (V-14)
	const named = <T extends { type: string; name: string }>(predefined: 'predefined' | 'keyPredefined' | 'profilePredefined') => (row: T) => ({
		...row,
		name: localName(row),
		type: word(row.type === 'predefined' ? predefined : 'custom')
	});

	// one snapshot: a record deleted while the export reads stays out of every table, not only some (a Beleg without
	// its invoice)
	const [[allTenants, allBuildings, allApartments, allContracts, advances, agreements, allCategories, keys, profiles], [allInvoices, belege, stocks, statements, lineItems, allDocuments]] = await db.transaction(
		async (tx) => [
			await Promise.all([
				tx.select().from(tenants).orderBy(asc(tenants.lastName), asc(tenants.firstName), asc(tenants.createdAt)),
				tx.select().from(buildings).orderBy(asc(buildings.name)),
				// the Mietstatus on the day of the export, as the UI shows it (Fachreview 496-2 V-11)
				tx
					.select({ ...getTableColumns(apartments), rentalStatus: apartmentStatus, nextContractStart })
					.from(apartments)
					.orderBy(asc(apartments.number)),
				tx.select().from(rentalContracts).orderBy(asc(rentalContracts.startDate)),
				tx.select().from(contractAdvancePayments).orderBy(asc(contractAdvancePayments.validFrom)),
				tx.select().from(contractCategories),
				tx.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
				tx.select().from(distributionKeys).orderBy(asc(distributionKeys.name)),
				tx.select().from(heatingProfiles).orderBy(asc(heatingProfiles.name))
			]),
			await Promise.all([
				tx.select().from(invoices).orderBy(asc(invoices.invoiceDate), asc(invoices.createdAt)),
				tx.select().from(invoiceDocuments).orderBy(asc(invoiceDocuments.createdAt)),
				tx.select().from(fuelStocks).orderBy(asc(fuelStocks.readingDate)),
				tx.select().from(utilityStatements).orderBy(asc(utilityStatements.periodStart), asc(utilityStatements.createdAt)),
				tx.select().from(utilityStatementLineItems).orderBy(asc(utilityStatementLineItems.sortOrder)),
				tx.select().from(documents).orderBy(asc(documents.createdAt))
			])
		] as const,
		{ isolationLevel: 'repeatable read', accessMode: 'read only' }
	);
	const [auditLog, settings] = await Promise.all([auditLogWithExpiries(), getAllConfig()]);
	const buildingOf = byId(allBuildings);
	const apartmentOf = byId(allApartments);
	const tenantOf = byId(allTenants);
	const contractOf = byId(allContracts);
	const categoryOf = byId(allCategories);
	const keyOf = byId(keys);
	const statementOf = byId(statements);
	const profileOf = byId(profiles);
	// the words and names the form shows; the data file keeps the codes and ids (V-14)
	const settingValue = (key: string, value: string | null) => {
		if (value === null) return null;
		if (key === 'default_distribution_key_id') return localName(keyOf.get(value)) ?? value;
		if (key === 'default_heating_profile_id') return localName(profileOf.get(value)) ?? value;
		return ['accounting_period', 'default_language'].includes(key) && value in WORDS ? word(value as keyof typeof WORDS) : value;
	};
	const invoiceOf = byId(allInvoices);
	const tenantName = (id: string | null) => {
		const tenant = id ? tenantOf.get(id) : undefined;
		return tenant && `${tenant.firstName} ${tenant.lastName}`;
	};
	const contractNames = (id: string) => {
		const contract = contractOf.get(id);
		return { tenant: tenantName(contract?.tenantId ?? null), apartment: contract && apartmentOf.get(contract.apartmentId)?.number };
	};

	// one folder per tenant; a second tenant of the same name gets a counter (V-7)
	const folderOf = new Map<string, string>();
	for (const tenant of allTenants) {
		const base = `${names.documents}/${safe(`${tenant.lastName} ${tenant.firstName}`)}`;
		let folder = base;
		for (let n = 2; [...folderOf.values()].includes(folder); n++) folder = `${base} (${n})`;
		folderOf.set(tenant.id, folder);
	}

	const contractRows = allContracts.map(({ contractPdf, ...contract }) => {
		const apartment = apartmentOf.get(contract.apartmentId);
		const fileName = `${contract.startDate} ${names.contract} ${apartment?.number}`;
		return {
			...contract,
			file: contractPdf ? file(folderOf.get(contract.tenantId)!, fileName, contractPdf) : null,
			advancePayments: advances.filter((advance) => advance.contractId === contract.id).map(({ validFrom, amount }) => ({ validFrom, amount })),
			agreedCategories: agreements
				.filter((agreement) => agreement.contractId === contract.id)
				.map(({ categoryId, agreed, agreedFrom }) => ({ categoryId, agreed, agreedFrom }))
		};
	});

	const belegRows = belege.map(({ content, ...beleg }) => {
		const invoice = invoiceOf.get(beleg.invoiceId)!;
		const dot = beleg.fileName.lastIndexOf('.');
		const [base, extension] = dot > 0 ? [beleg.fileName.slice(0, dot), beleg.fileName.slice(dot + 1)] : [beleg.fileName, EXTENSIONS[beleg.mimeType] ?? 'pdf'];
		return { ...beleg, file: file(folders.belege, `${invoice.invoiceDate} ${invoice.billingEntityName} ${base}`, content, extension) };
	});

	const today = swissToday();
	const statementRows = statements.map(({ pdfBlob, ...statement }) => {
		const status = statement.status === 'sent' && statement.paymentDeadline && statement.paymentDeadline < today ? 'overdue' : statement.status;
		const carried = statement.carriedFromId ? statementOf.get(statement.carriedFromId) : undefined;
		// the Saldo less the part payments, for a sent statement only (V-1)
		const openAmount =
			status === 'draft' ? null : ['sent', 'overdue'].includes(status) ? (Number(statement.balance) - Number(statement.paidAmount ?? 0)).toFixed(2) : '0.00';
		return {
			...statement,
			status,
			carryOver: carried?.balance ?? null,
			openAmount,
			file: pdfBlob ? file(names.statements, statement.statementNumber, pdfBlob) : null,
			lineItems: lineItems.filter((item) => item.statementId === statement.id)
		};
	});

	const documentRows = allDocuments.map(({ content, ...document }) => {
		const date = document.createdAt.toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
		return { ...document, file: file(folderOf.get(document.tenantId)!, `${date} ${document.title}`, content, EXTENSIONS[document.mimeType] ?? 'pdf') };
	});

	const data = {
		format: 'dwello-export',
		version: 1,
		exportedAt: new Date(),
		language,
		settings,
		categories: allCategories,
		distributionKeys: keys,
		heatingProfiles: profiles,
		tenants: allTenants.map((tenant) => ({ ...tenant, documents: documentRows.filter((document) => document.tenantId === tenant.id) })),
		buildings: allBuildings.map((building) => ({
			...building,
			apartments: allApartments
				.filter((apartment) => apartment.buildingId === building.id)
				.map(({ nextContractStart: _, ...apartment }) => ({ ...apartment, contracts: contractRows.filter((contract) => contract.apartmentId === apartment.id) })),
			invoices: allInvoices
				.filter((invoice) => invoice.buildingId === building.id)
				.map((invoice) => ({ ...invoice, documents: belegRows.filter((beleg) => beleg.invoiceId === invoice.id) })),
			fuelStocks: stocks.filter((stock) => stock.buildingId === building.id)
		})),
		statements: statementRows,
		auditLog
	};

	table('buildings', ['id', 'name', 'address', 'postalCode', 'city', 'canton', 'country', 'latitude', 'longitude', 'buildingType', 'yearBuilt', 'noTank', 'createdAt', 'updatedAt'], allBuildings);
	table(
		'apartments',
		['id', 'buildingId', 'building', 'number', 'floor', 'area', 'rooms', 'rentalStatus', 'createdAt', 'updatedAt'],
		allApartments.map((apartment) => ({
			...apartment,
			building: buildingOf.get(apartment.buildingId)?.name,
			rentalStatus: word(apartment.rentalStatus).replace('{date}', apartment.nextContractStart ?? '')
		}))
	);
	table(
		'tenants',
		['id', 'firstName', 'lastName', 'email', 'phone', 'language', 'correspondenceAddress', 'correspondencePostalCode', 'correspondenceCity', 'correspondenceCountry', 'correspondenceChannel', 'anonymisedOn', 'createdAt', 'updatedAt'],
		allTenants.map((tenant) => ({
			...tenant,
			language: word(tenant.language),
			correspondenceChannel: word(tenant.correspondenceChannel),
			correspondenceAddress: tenant.address,
			correspondencePostalCode: tenant.postalCode,
			correspondenceCity: tenant.city,
			correspondenceCountry: tenant.country
		}))
	);
	table(
		'contracts',
		['id', 'apartmentId', 'building', 'apartment', 'tenantId', 'tenant', 'startDate', 'endDate', 'terminated', 'noticeReceivedOn', 'billedUntil', 'movedOut', 'documentsCheckedOn', 'baseRent', 'additionalRent', 'monthlyAdvancePayment', 'flatRateUtilityCharge', 'managementFeeAgreed', 'ownRate', 'contractFile', 'notes', 'createdAt', 'updatedAt'],
		contractRows.map((contract) => {
			const apartment = apartmentOf.get(contract.apartmentId);
			return {
				...contract,
				building: apartment && buildingOf.get(apartment.buildingId)?.name,
				apartment: apartment?.number,
				tenant: tenantName(contract.tenantId),
				// the choice of the contract form (V-4)
				managementFeeAgreed: word(contract.managementFeeAgreed ? (contract.managementFeePercent ? 'feeOwn' : 'feeRun') : 'feeNone'),
				ownRate: contract.managementFeePercent,
				contractFile: contract.file
			};
		})
	);
	table(
		'advances',
		['contractId', 'tenant', 'apartment', 'validFrom', 'amount'],
		advances.map((advance) => ({ ...advance, ...contractNames(advance.contractId) }))
	);
	table(
		'agreed',
		['contractId', 'tenant', 'apartment', 'categoryId', 'category', 'agreed', 'agreedFrom'],
		agreements.map((agreement) => ({ ...agreement, ...contractNames(agreement.contractId), category: localName(categoryOf.get(agreement.categoryId)) }))
	);
	table(
		'invoices',
		['id', 'buildingId', 'building', 'invoiceNumber', 'supplier', 'supplierAddress', 'description', 'categoryId', 'category', 'distributionKeyId', 'distributionKey', 'amount', 'allocable', 'invoiceDate', 'servicePeriodStart', 'servicePeriodEnd', 'dueDate', 'paidDate', 'llmCategory', 'llmConfidence', 'overridden', 'overrideReason', 'notes', 'createdAt', 'updatedAt'],
		allInvoices.map((invoice) => ({
			...invoice,
			building: buildingOf.get(invoice.buildingId)?.name,
			supplier: invoice.billingEntityName,
			supplierAddress: invoice.billingEntityAddress,
			category: invoice.categoryId && localName(categoryOf.get(invoice.categoryId)),
			distributionKey: invoice.distributionKeyId && localName(keyOf.get(invoice.distributionKeyId)),
			allocable: invoice.isValidUtilityCost,
			llmCategory: invoice.llmCategoryId && localName(categoryOf.get(invoice.llmCategoryId)),
			// a share of 1 as the UI shows it, in % (V-4)
			llmConfidence: invoice.llmConfidence === null ? null : Math.round(Number(invoice.llmConfidence) * 100),
			overridden: invoice.wasManuallyOverridden,
			overrideReason: invoice.manualOverrideReason
		}))
	);
	table(
		'belegeTable',
		['invoiceId', 'supplier', 'fileName', 'file', 'deductedAmount', 'nonAllocableItems', 'uploadedAt'],
		belegRows.map((beleg) => ({ ...beleg, supplier: invoiceOf.get(beleg.invoiceId)?.billingEntityName, uploadedAt: beleg.createdAt }))
	);
	table(
		'fuelStocks',
		['id', 'buildingId', 'building', 'readingDate', 'amount', 'categoryId', 'category', 'createdAt'],
		stocks.map((stock) => ({ ...stock, building: buildingOf.get(stock.buildingId)?.name, category: localName(categoryOf.get(stock.categoryId)) }))
	);
	table(
		'statements',
		['id', 'statementNumber', 'tenantId', 'tenant', 'apartmentId', 'apartment', 'contractId', 'periodStart', 'periodEnd', 'statementDate', 'rentalDays', 'rentalStart', 'rentalEnd', 'costShare', 'carryOver', 'carriedFrom', 'carrySettledOn', 'advancePayments', 'priorPayments', 'balance', 'paidAmount', 'openAmount', 'status', 'paymentDeadline', 'paidDate', 'reminderSentDate', 'managementFeePercent', 'managementFee', 'heatingProfile', 'replaces', 'correctionDeclined', 'qrBillReference', 'pdf', 'notes', 'createdAt', 'updatedAt'],
		statementRows.map((statement) => ({
			...statement,
			tenant: tenantName(statement.tenantId),
			apartment: apartmentOf.get(statement.apartmentId)?.number,
			costShare: statement.totalCosts,
			carriedFrom: statement.carriedFromId && statementOf.get(statement.carriedFromId)?.statementNumber,
			advancePayments: statement.totalAdvancePayments,
			status: word(statement.status as keyof typeof WORDS),
			heatingProfile: statement.heatingProfileId && localName(profileOf.get(statement.heatingProfileId)),
			replaces: statement.replacesId && statementOf.get(statement.replacesId)?.statementNumber,
			correctionDeclined: statement.correctionDeclined?.on,
			pdf: statement.file
		}))
	);
	table(
		'lineItems',
		['id', 'statementId', 'statementNumber', 'description', 'category', 'distributionKey', 'buildingCosts', 'apartmentShare', 'sharePercentage', 'periodShare', 'positionRentalDays', 'billedDays', 'tenantShare'],
		lineItems.map((item) => ({
			...item,
			statementNumber: statementOf.get(item.statementId)?.statementNumber,
			category: item.categoryId && localName(categoryOf.get(item.categoryId)),
			distributionKey: item.distributionKeyId && localName(keyOf.get(item.distributionKeyId)),
			buildingCosts: item.totalAmount
		}))
	);
	// one row per part payment; a statement paid before #959 has no list but its date and amount (V-1)
	table(
		'payments',
		['statementId', 'statementNumber', 'tenant', 'date', 'amount'],
		statements.flatMap((statement) =>
			(statement.payments.length ? statement.payments : statement.paidDate ? [{ date: statement.paidDate, amount: statement.paidAmount }] : []).map((payment) => ({
				...payment,
				statementId: statement.id,
				statementNumber: statement.statementNumber,
				tenant: tenantName(statement.tenantId)
			}))
		)
	);
	table(
		'documents',
		['id', 'tenantId', 'tenant', 'statement', 'type', 'reminderLevel', 'title', 'file', 'channel', 'status', 'sentAt', 'recipient', 'paymentDeadline', 'deliveryError', 'createdAt'],
		documentRows.map((document) => ({
			...document,
			type: word(document.type),
			channel: document.channel && word(document.channel),
			status: document.status && word(document.status),
			tenant: tenantName(document.tenantId),
			statement: document.statementId && statementOf.get(document.statementId)?.statementNumber
		}))
	);
	table(
		'categories',
		['id', 'name', 'nameDE', 'nameFR', 'nameIT', 'nameEN', 'allocable', 'isHeatingCost', 'isFuel', 'type', 'description', 'sortOrder'],
		allCategories.map((category) => ({ ...named<typeof category>('predefined')(category), allocable: category.isAllowedUtilityCost }))
	);
	table('keys', ['id', 'name', 'nameDE', 'nameFR', 'nameIT', 'nameEN', 'type', 'formula', 'description'], keys.map(named('keyPredefined')));
	table(
		'profiles',
		['id', 'name', 'nameDE', 'nameFR', 'nameIT', 'nameEN', 'type', 'januaryPct', 'februaryPct', 'marchPct', 'aprilPct', 'mayPct', 'junePct', 'julyPct', 'augustPct', 'septemberPct', 'octoberPct', 'novemberPct', 'decemberPct', 'description', 'sourceDE', 'sourceFR', 'sourceIT', 'sourceEN'],
		profiles.map(named('profilePredefined'))
	);
	// the entry's text is the UI's: the BFF fills it in (column «Eintrag»)
	table(
		'log',
		['id', 'occurredAt', 'entry', 'type', 'details'],
		// the raw query answers the time as text in UTC, not as a Date (C-6): in Swiss time like every other column
		auditLog.map((entry) => ({ ...entry, occurredAt: new Date(entry.occurredAt), type: entry.action, details: JSON.stringify(entry.details) }))
	);
	table(
		'settings',
		['setting', 'value'],
		Object.entries(settings).map(([key, value]) => ({ setting: SETTINGS[key]?.[index] ?? key, value: settingValue(key, value) }))
	);

	files.unshift({ path: 'README.txt', content: Buffer.from(readme(language, folders, names)).toString('base64') });

	return { fileName: `Dwello-${names.zip}-${today}.zip`, dataFile: names.data, data, tables, logTable: `${folders.tables}/${folders.log}.csv`, files };
}

// The README in the UI language (draft, domain review V-5, V-6, M-1, F-7); the folder names as in the ZIP
function readme(language: Language, folders: (typeof FILES)[Language], names: (typeof NAMES)[Language]) {
	const [date, time] = swissTime(new Date()).split(' ');
	const day = date.split('-').reverse().join('.');
	const t = folders.tables;
	const agreed = `${folders.agreed}.csv`;
	const payments = `${folders.payments}.csv`;
	const belege = `${folders.belegeTable}.csv`;
	const texts = {
		de: `Dwello – Export aller Daten
Erstellt am ${day} um ${time} Uhr

Diese ZIP-Datei enthält alle Daten, die Sie in Dwello erfasst haben, so wie sie zu diesem Zeitpunkt gespeichert waren. Was Sie vorher gelöscht haben, ist nicht dabei.

Inhalt
- ${t}/: eine Tabelle je Art von Daten (Gebäude, Wohnungen, Mieter, Mietverträge, Rechnungen, Abrechnungen, Kategorien, Verteilschlüssel, Heizprofile, Protokoll und weitere). Öffnen Sie sie mit Excel oder einem anderen Tabellenprogramm. Die Spalten sind durch Strichpunkte getrennt; Beträge in Franken mit Punkt (1234.50), Datum als Jahr-Monat-Tag (2026-03-31).
- ${names.data}: dieselben Daten mit allen Beziehungen, für ein anderes Programm. Jeder Datensatz hat eine ID; die Tabellen nennen einen anderen Datensatz mit seiner ID, seinem Namen oder seiner Nummer.
- ${folders.belege}/: die Belege Ihrer Rechnungen, wie Sie sie hochgeladen haben. Haben Sie keinen Beleg hochgeladen, fehlt der Ordner, und ${belege} hat nur die Kopfzeile.
- ${names.documents}/: die Dokumente zu Ihren Mietern, auch versendete Zahlungserinnerungen und Mahnungen, und die PDF der Mietverträge.
- ${names.statements}/: das aktuelle PDF jeder Abrechnung. Das PDF, das der Mieter erhalten hat (Versendetes PDF), liegt unter ${names.documents}/, sofern Dwello es beim Versand oder vor einer Änderung aufbewahrt hat; sonst ist es das aktuelle PDF.

Saldo: positiv ist eine Nachzahlung des Mieters, negativ eine Rückerstattung. Der Saldo ist auf 5 Rappen gerundet. Bereits bezahlt, Bezahlter Betrag, Offener Betrag und die Beträge in ${payments} haben das Vorzeichen des Saldos: Bei einer Rückerstattung sind sie negativ und nennen, was Sie zurückerstattet haben oder noch zurückerstatten. Offener Betrag: Saldo minus die Teilzahlungen in ${payments}. Bei einer ersetzten Abrechnung kann Bezahlter Betrag auch einen Saldo enthalten, den die nächste Abrechnung als Übertrag verrechnet hat oder den Sie von Hand ausgeglichen haben.

${agreed} nennt je Mietvertrag die Kategorien, zu denen Sie etwas angegeben haben. Fehlt eine Kategorie, ist beim Mietvertrag noch nichts angegeben, und Dwello rechnet sie nicht ab.

Das Protokoll und die Abrechnungen können Rechnungen und andere Datensätze nennen, die Sie inzwischen gelöscht haben; sie halten fest, was damals galt.

Die Datei enthält Personendaten Ihrer Mieter und Rechnungssteller. Bewahren Sie sie sicher auf und löschen Sie sie, wenn Sie sie nicht mehr brauchen.

Dwello kann diese Datei nicht wieder einlesen.
`,
		fr: `Dwello – Exportation de toutes les données
Créé le ${day} à ${time}

Ce fichier ZIP contient toutes les données que vous avez saisies dans Dwello, telles qu’elles étaient enregistrées à ce moment. Ce que vous avez supprimé auparavant n’y figure pas.

Contenu
- ${t}/\u00a0: un tableau par type de données (immeubles, appartements, locataires, contrats de bail, factures, décomptes, catégories, clés de répartition, profils de chauffage, journal et autres). Ouvrez-les avec Excel ou un autre tableur. Les colonnes sont séparées par des points-virgules\u00a0; montants en francs avec un point (1234.50), dates sous la forme année-mois-jour (2026-03-31).
- ${names.data}\u00a0: les mêmes données avec toutes leurs relations, pour un autre programme. Chaque enregistrement a un ID\u00a0; les tableaux mentionnent un autre enregistrement par son ID, son nom ou son numéro.
- ${folders.belege}/\u00a0: les pièces justificatives de vos factures, telles que vous les avez téléversées. Si vous n’avez téléversé aucune pièce justificative, le dossier manque et ${belege} ne contient que la ligne d’en-tête.
- ${names.documents}/\u00a0: les documents de vos locataires, y compris les rappels de paiement et les rappels envoyés, et les PDF des contrats de bail.
- ${names.statements}/\u00a0: le PDF actuel de chaque décompte. Le PDF que le locataire a reçu (PDF envoyé) se trouve sous ${names.documents}/ si Dwello l’a conservé lors de l’envoi ou avant une modification\u00a0; sinon, c’est le PDF actuel.

Solde\u00a0: positif, c’est un montant à payer par le locataire\u00a0; négatif, un remboursement. Le solde est arrondi à 5 centimes. Déjà payé, Montant payé, Montant dû et les montants de ${payments} ont le signe du solde\u00a0: pour un remboursement, ils sont négatifs et indiquent ce que vous avez remboursé ou devez encore rembourser. Montant dû\u00a0: solde moins les paiements partiels de ${payments}. Pour un décompte remplacé, Montant payé peut aussi contenir un solde que le décompte suivant a compensé comme report ou que vous avez soldé manuellement.

${agreed} indique pour chaque contrat de bail les catégories pour lesquelles vous avez fait une indication. Si une catégorie manque, rien n’est encore indiqué pour ce contrat et Dwello ne la décompte pas.

Le journal et les décomptes peuvent mentionner des factures et d’autres données que vous avez supprimées depuis\u00a0; ils consignent ce qui valait alors.

Le fichier contient des données personnelles de vos locataires et des émetteurs des factures. Conservez-le en lieu sûr et supprimez-le lorsque vous n’en avez plus besoin.

Dwello ne peut pas réimporter ce fichier.
`,
		it: `Dwello – Esportazione di tutti i dati
Creato il ${day} alle ${time}

Questo file ZIP contiene tutti i dati che ha registrato in Dwello, così come erano salvati in quel momento. Ciò che ha eliminato prima non è incluso.

Contenuto
- ${t}/: una tabella per tipo di dati (immobili, appartamenti, inquilini, contratti di locazione, fatture, conteggi, categorie, chiavi di riparto, profili di riscaldamento, registro e altri). Le apra con Excel o con un altro programma di fogli di calcolo. Le colonne sono separate da punti e virgola; importi in franchi con il punto (1234.50), date nella forma anno-mese-giorno (2026-03-31).
- ${names.data}: gli stessi dati con tutte le relazioni, per un altro programma. Ogni record ha un ID; le tabelle indicano un altro record con il suo ID, il suo nome o il suo numero.
- ${folders.belege}/: i giustificativi delle sue fatture, come li ha caricati. Se non ha caricato alcun giustificativo, la cartella manca e ${belege} contiene solo la riga d’intestazione.
- ${names.documents}/: i documenti dei suoi inquilini, anche i promemoria di pagamento e i solleciti inviati, e i PDF dei contratti di locazione.
- ${names.statements}/: il PDF attuale di ogni conteggio. Il PDF che l’inquilino ha ricevuto (PDF inviato) si trova in ${names.documents}/ se Dwello lo ha conservato all’invio o prima di una modifica; altrimenti è il PDF attuale.

Saldo: positivo è un importo dovuto dall’inquilino, negativo un rimborso. Il saldo è arrotondato a 5 centesimi. Già pagato, Importo pagato, Importo dovuto e gli importi in ${payments} hanno il segno del saldo: per un rimborso sono negativi e indicano ciò che ha rimborsato o deve ancora rimborsare. Importo dovuto: saldo meno i pagamenti parziali in ${payments}. Per un conteggio sostituito, Importo pagato può contenere anche un saldo che il conteggio successivo ha compensato come riporto o che Lei ha saldato manualmente.

${agreed} indica per ogni contratto di locazione le categorie per cui ha dato un’indicazione. Se una categoria manca, per il contratto non è ancora indicato nulla e Dwello non la conteggia.

Il registro e i conteggi possono menzionare fatture e altri dati che ha eliminato nel frattempo; registrano ciò che valeva allora.

Il file contiene dati personali dei suoi inquilini e degli emittenti delle fatture. Lo conservi al sicuro e lo elimini quando non Le serve più.

Dwello non può reimportare questo file.
`,
		en: `Dwello – Export of all data
Created on ${day} at ${time}

This ZIP file contains all the data you have entered in Dwello, as it was stored at that time. What you deleted before is not included.

Contents
- ${t}/: one table per kind of data (buildings, apartments, tenants, rental contracts, invoices, statements, categories, distribution keys, heating profiles, log and others). Open them with Excel or another spreadsheet program. The columns are separated by semicolons; amounts in francs with a point (1234.50), dates as year-month-day (2026-03-31).
- ${names.data}: the same data with all relations, for another program. Every record has an ID; the tables name another record by its ID, its name or its number.
- ${folders.belege}/: the supporting documents of your invoices, as you uploaded them. If you have not uploaded any supporting document, the folder is missing and ${belege} holds only the header row.
- ${names.documents}/: the documents of your tenants, also payment reminders and reminders sent, and the PDFs of the rental contracts.
- ${names.statements}/: the current PDF of each statement. The PDF the tenant received (PDF sent) is under ${names.documents}/ if Dwello kept it when sending or before a change; otherwise it is the current PDF.

Balance: positive is an amount due from the tenant, negative a refund. The balance is rounded to 5 centimes. Already paid, Amount paid, Amount outstanding and the amounts in ${payments} have the sign of the balance: for a refund they are negative and show what you have refunded or still have to refund. Amount outstanding: the balance minus the part payments in ${payments}. For a replaced statement, Amount paid may also hold a balance that the next statement offset as carried over or that you settled by hand.

${agreed} lists for each rental contract the categories you have answered. If a category is missing, nothing has been answered for that contract yet, and Dwello does not bill it.

The log and the statements may name invoices and other records you have deleted since; they record what applied at the time.

The file contains personal data of your tenants and invoice issuers. Keep it safe and delete it when you no longer need it.

Dwello cannot read this file back in.
`
	};
	return texts[language].replace(/\n/g, '\r\n');
}
