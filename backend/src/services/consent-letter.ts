/**
 * #521: wording of the letter with which the tenants of a contract agree to a new Abrechnungsperiode, in the tenant's
 * Sprache (Fachreview 521-1, sections 1 and 2); terms as in docs/design/i18n-begriffe.md
 */

import type { Language } from '../db/schema';
import type { AccountingPeriodType, Range } from './period-types';
import { greetingWords } from './reminder-letter';
import { daysAfter } from './today';

export interface ConsentLetterInput {
	earlier: AccountingPeriodType; // the type the landlord billed by so far
	type: AccountingPeriodType; // the setting «Abrechnungsperiode»
	short: Range; // the contract's short Abrechnungsperiode between the two
	contractEnd: string | null;
	date: string; // the day of the letter
	apartment: string; // the Wohnungsnummer
	address: string; // «Adresse, PLZ Ort» of the building
	tenant: { firstName: string; lastName: string };
	sender: string; // the Firmenname
	language?: Language;
}

const REPLY_DAYS = 30; // practice, no legal deadline (Fachreview 521-1 section 1)

type Clause = { apartment: string; address: string; short: string; next: string; first: string };

const WORDING = {
	de: {
		types: { calendar: '1. Januar bis 31. Dezember', 'july-june': '1. Juli bis 30. Juni', 'november-october': '1. November bis 31. Oktober' },
		title: 'Zustimmung zu einer neuen Abrechnungsperiode',
		contract: (apartment: string, address: string) => `Mietvertrag für die Wohnung ${apartment}, ${address}`,
		change: (old: string, next: string) =>
			`bisher haben wir die Nebenkosten jeweils vom ${old} abgerechnet. Für alle Mietverträge im Gebäude rechnen wir sie neu jeweils vom ${next} ab.`,
		short: (short: string) =>
			`Für die Tage dazwischen erhalten Sie eine Nebenkostenabrechnung über die kurze Abrechnungsperiode ${short}. Darin verrechnen wir die Akontobeiträge dieser Monate.`,
		first: (first: string) => `Die erste neue Abrechnungsperiode ist ${first}.`,
		voluntary:
			'Alle übrigen Bestimmungen Ihres Mietvertrags bleiben gleich, auch die Akontobeiträge. Ihre Zustimmung ist freiwillig. Ohne Ihre Unterschrift ändert dieses Schreiben an Ihrem Mietvertrag nichts.',
		reply: (reply: string) =>
			`Sind Sie einverstanden, unterschreiben Sie bitte unten und senden Sie uns dieses Schreiben bis ${reply} zurück. Haben mehrere Personen den Mietvertrag als Mieter unterschrieben, unterschreiben bitte alle. Behalten Sie eine Kopie für Ihre Unterlagen.`,
		heading: 'Zustimmung',
		clause: ({ apartment, address, short, next, first }: Clause) =>
			`Mit ihrer Unterschrift stimmen die Mieter zu, dass die Nebenkosten des Mietvertrags für die Wohnung ${apartment}, ${address}, nach der kurzen Abrechnungsperiode ${short} jeweils vom ${next} abgerechnet werden, erstmals für ${first}. Alle übrigen Bestimmungen des Mietvertrags bleiben unverändert.`,
		clauseEnding: ({ apartment, address, short }: Clause) =>
			`Mit ihrer Unterschrift stimmen die Mieter zu, dass die Nebenkosten des Mietvertrags für die Wohnung ${apartment}, ${address}, für die kurze Abrechnungsperiode ${short} abgerechnet werden. Alle übrigen Bestimmungen des Mietvertrags bleiben unverändert.`,
		placeDate: 'Ort, Datum',
		signature: (tenant: string) => `Unterschrift ${tenant}`,
		signatureOther: 'Unterschrift weiterer Mieter'
	},
	fr: {
		types: { calendar: '1er janvier au 31 décembre', 'july-june': '1er juillet au 30 juin', 'november-october': '1er novembre au 31 octobre' },
		title: 'Accord sur une nouvelle période de décompte',
		contract: (apartment: string, address: string) => `Contrat de bail pour l’appartement ${apartment}, ${address}`,
		change: (old: string, next: string) =>
			`Jusqu’ici, nous avons établi le décompte des frais accessoires chaque année du ${old}. Désormais, nous l’établissons pour tous les contrats de bail de l’immeuble chaque année du ${next}.`,
		short: (short: string) =>
			`Pour la période intermédiaire, vous recevrez un décompte des charges pour la période de décompte courte ${short}. Les acomptes de ces mois y sont imputés.`,
		first: (first: string) => `La première nouvelle période de décompte couvre ${first}.`,
		voluntary:
			'Toutes les autres clauses de votre contrat de bail restent inchangées, y compris les acomptes. Votre accord est facultatif. Sans votre signature, la présente lettre ne modifie en rien votre contrat de bail.',
		reply: (reply: string) =>
			`Si vous êtes d’accord, veuillez signer ci-dessous et nous retourner la présente lettre au plus tard le ${reply}. Si plusieurs personnes ont signé le contrat de bail en tant que locataires, toutes doivent signer. Conservez une copie pour vos dossiers.`,
		heading: 'Accord',
		clause: ({ apartment, address, short, next, first }: Clause) =>
			`Par leur signature, les locataires acceptent que le décompte des frais accessoires du contrat de bail pour l’appartement ${apartment}, ${address}, soit établi, après la période de décompte courte ${short}, chaque année du ${next}, la première fois pour ${first}. Toutes les autres clauses du contrat de bail restent inchangées.`,
		clauseEnding: ({ apartment, address, short }: Clause) =>
			`Par leur signature, les locataires acceptent que le décompte des frais accessoires du contrat de bail pour l’appartement ${apartment}, ${address}, soit établi pour la période de décompte courte ${short}. Toutes les autres clauses du contrat de bail restent inchangées.`,
		placeDate: 'Lieu, date',
		signature: (tenant: string) => `Signature ${tenant}`,
		signatureOther: 'Signature d’autres locataires'
	},
	it: {
		types: { calendar: '1° gennaio al 31 dicembre', 'july-june': '1° luglio al 30 giugno', 'november-october': '1° novembre al 31 ottobre' },
		title: 'Consenso a un nuovo periodo di conteggio',
		contract: (apartment: string, address: string) => `Contratto di locazione per l’appartamento ${apartment}, ${address}`,
		change: (old: string, next: string) =>
			`Finora abbiamo allestito il conteggio delle spese accessorie ogni anno dal ${old}. Ora lo allestiamo per tutti i contratti di locazione dell’immobile ogni anno dal ${next}.`,
		short: (short: string) =>
			`Per il periodo intermedio riceverà un conteggio spese accessorie per il periodo di conteggio breve ${short}, nel quale compensiamo gli acconti di questi mesi.`,
		first: (first: string) => `Il primo nuovo periodo di conteggio è ${first}.`,
		voluntary:
			'Tutte le altre disposizioni del suo contratto di locazione restano invariate, compresi gli acconti. Il suo consenso è facoltativo. Senza la sua firma, la presente lettera non modifica il suo contratto di locazione.',
		reply: (reply: string) =>
			`Se è d’accordo, firmi qui sotto e ci rispedisca la presente lettera entro il ${reply}. Se più persone hanno firmato il contratto di locazione come inquilini, devono firmare tutte. Conservi una copia per i suoi documenti.`,
		heading: 'Consenso',
		clause: ({ apartment, address, short, next, first }: Clause) =>
			`Con la loro firma gli inquilini accettano che il conteggio delle spese accessorie del contratto di locazione per l’appartamento ${apartment}, ${address}, sia allestito, dopo il periodo di conteggio breve ${short}, ogni anno dal ${next}, la prima volta per ${first}. Tutte le altre disposizioni del contratto di locazione restano invariate.`,
		clauseEnding: ({ apartment, address, short }: Clause) =>
			`Con la loro firma gli inquilini accettano che il conteggio delle spese accessorie del contratto di locazione per l’appartamento ${apartment}, ${address}, sia allestito per il periodo di conteggio breve ${short}. Tutte le altre disposizioni del contratto di locazione restano invariate.`,
		placeDate: 'Luogo, data',
		signature: (tenant: string) => `Firma ${tenant}`,
		signatureOther: 'Firma di altri inquilini'
	},
	en: {
		types: { calendar: '1 January to 31 December', 'july-june': '1 July to 30 June', 'november-october': '1 November to 31 October' },
		title: 'Agreement to a new billing period',
		contract: (apartment: string, address: string) => `Rental contract for apartment ${apartment}, ${address}`,
		change: (old: string, next: string) =>
			`So far, we have billed the utility costs each year from ${old}. We now bill them for all rental contracts in the building each year from ${next}.`,
		short: (short: string) =>
			`For the days in between, you will receive a utility cost statement for the short billing period ${short}. It sets off the advance payments for those months.`,
		first: (first: string) => `The first new billing period is ${first}.`,
		voluntary:
			'All other terms of your rental contract stay the same, including the advance payments. Your agreement is voluntary. Without your signature, this letter does not change your rental contract.',
		reply: (reply: string) =>
			`If you agree, please sign below and return this letter to us by ${reply}. If several people signed the rental contract as tenants, all of them must sign. Keep a copy for your records.`,
		heading: 'Agreement',
		clause: ({ apartment, address, short, next, first }: Clause) =>
			`By signing, the tenants agree that, after the short billing period ${short}, the utility costs of the rental contract for apartment ${apartment}, ${address}, are billed each year from ${next}, for the first time for ${first}. All other terms of the rental contract remain unchanged.`,
		clauseEnding: ({ apartment, address, short }: Clause) =>
			`By signing, the tenants agree that the utility costs of the rental contract for apartment ${apartment}, ${address}, are billed for the short billing period ${short}. All other terms of the rental contract remain unchanged.`,
		placeDate: 'Place, date',
		signature: (tenant: string) => `Signature ${tenant}`,
		signatureOther: 'Signature of other tenants'
	}
} satisfies Record<Language, unknown>;

// dd.mm.yyyy in every language, as on the statement PDF
const swissDate = (date: string) => date.split('-').reverse().join('.');
const days = ({ start, end }: Range) => `${swissDate(start)} – ${swissDate(end)}`;

// room for a handwritten signature above the line that names it
const signatureLine = (name: string) => `\n\n______________________________\n${name}`;

export function consentLetter(input: ConsentLetterInput) {
	const language = input.language ?? 'de';
	const w = WORDING[language];
	const words = greetingWords(language);
	const start = daysAfter(input.short.end, 1);
	const first = days({ start, end: daysAfter(`${Number(start.slice(0, 4)) + 1}${start.slice(4)}`, -1) });
	const next = w.types[input.type];
	const tenant = `${input.tenant.firstName} ${input.tenant.lastName}`;
	// a contract that ends by the end of the short period has no first new period (Fachreview 521-1 V-3)
	const ending = !!input.contractEnd && input.contractEnd <= input.short.end;
	const paragraphs = [w.change(w.types[input.earlier], next), w.short(days(input.short)), ...(ending ? [] : [w.first(first)]), w.voluntary, w.reply(swissDate(daysAfter(input.date, REPLY_DAYS)))];
	const clause = (ending ? w.clauseEnding : w.clause)({ apartment: input.apartment, address: input.address, short: days(input.short), next, first });
	const agreement = [clause, signatureLine(w.placeDate), signatureLine(w.signature(tenant)), signatureLine(w.signatureOther)];
	const subject = `${w.title}\n${w.contract(input.apartment, input.address)}`;
	const salutation = `${words.salutation} ${tenant}`;
	// room for the landlord's handwritten signature above the Firmenname (Fachreview 521-1 M-1)
	const closing = `${words.closing}\n\n\n\n${input.sender}`;
	return {
		title: w.title,
		subject,
		salutation,
		paragraphs,
		closing,
		agreement: { heading: w.heading, paragraphs: agreement },
		text: [subject, `${salutation},`, ...paragraphs, closing, w.heading, ...agreement].join('\n\n')
	};
}
