/**
 * Wording of payment reminders (Zahlungserinnerung, 2. and 3. Mahnung), shared by the PDF and the e-mail, in the
 * tenant's Sprache (#106); terms as in docs/design/i18n-begriffe.md
 */

import type { Language } from './pdf.service';

export interface ReminderLetterInput {
	level: number;
	statementNumber: string;
	periodStart: string;
	periodEnd: string;
	balance: number;
	deadline: string;
	tenant: { firstName: string; lastName: string };
	sender: { name: string; iban: string };
	reference?: string; // the QR reference: a QR-IBAN takes a payment only with it
	language?: Language;
}

type Dates = { number: string; start: string; end: string };

const NBSP = ' '; // French puts it before «:»

const WORDING = {
	de: {
		titles: ['Zahlungserinnerung', '2. Mahnung', '3. Mahnung'],
		subject: (number: string) => `Nebenkostenabrechnung ${number}`,
		statement: ({ number, start, end }: Dates) => `Nebenkostenabrechnung ${number} für die Periode ${start} – ${end}`,
		openings: [
			(s: string) => `gemäss unseren Unterlagen ist die ${s} noch offen. Möglicherweise haben Sie die Zahlung übersehen.`,
			(s: string) => `Trotz unserer Zahlungserinnerung ist die ${s} noch nicht bezahlt.`,
			(s: string) =>
				`Trotz zweimaliger Mahnung ist die ${s} noch immer nicht bezahlt. Begleichen Sie den Betrag bitte umgehend, andernfalls müssen wir weitere Schritte einleiten.`
		],
		amount: 'Offener Betrag: ',
		payBy: (date: string) => `Bitte überweisen Sie den Betrag bis ${date} auf folgendes Konto:`,
		reference: (reference: string) => `Referenz ${reference} (bitte bei der Zahlung angeben)`,
		alreadyPaid: 'Haben Sie die Zahlung bereits geleistet, betrachten Sie dieses Schreiben als gegenstandslos.',
		salutation: 'Guten Tag',
		closing: 'Freundliche Grüsse'
	},
	fr: {
		titles: ['Rappel de paiement', '2e rappel', '3e rappel'],
		subject: (number: string) => `Décompte des charges ${number}`,
		statement: ({ number, start, end }: Dates) => `décompte des charges ${number} pour la période du ${start} au ${end}`,
		openings: [
			(s: string) => `Sauf erreur de notre part, le ${s} n’est pas encore payé. Ce paiement vous a peut-être échappé.`,
			(s: string) => `Malgré notre rappel de paiement, le ${s} n’est toujours pas payé.`,
			(s: string) =>
				`Malgré deux rappels, le ${s} n’est toujours pas payé. Veuillez régler le montant immédiatement, faute de quoi nous devrons entreprendre d’autres démarches.`
		],
		amount: `Montant dû${NBSP}: `,
		payBy: (date: string) => `Veuillez virer le montant au plus tard le ${date} sur le compte suivant${NBSP}:`,
		reference: (reference: string) => `Référence ${reference} (à indiquer lors du paiement)`,
		alreadyPaid: 'Si vous avez déjà effectué le paiement, veuillez considérer ce courrier comme sans objet.',
		salutation: 'Bonjour',
		closing: 'Meilleures salutations'
	},
	it: {
		titles: ['Promemoria di pagamento', '2° sollecito', '3° sollecito'],
		subject: (number: string) => `Conteggio spese accessorie ${number}`,
		statement: ({ number, start, end }: Dates) => `conteggio spese accessorie ${number} per il periodo dal ${start} al ${end}`,
		openings: [
			(s: string) => `Secondo la nostra contabilità, il ${s} non è ancora stato pagato. Forse il pagamento le è sfuggito.`,
			(s: string) => `Nonostante il nostro promemoria di pagamento, il ${s} non è ancora stato pagato.`,
			(s: string) =>
				`Nonostante due solleciti, il ${s} non è ancora stato pagato. La preghiamo di saldare l’importo immediatamente, altrimenti dovremo avviare ulteriori provvedimenti.`
		],
		amount: 'Importo dovuto: ',
		payBy: (date: string) => `La preghiamo di versare l’importo entro il ${date} sul seguente conto:`,
		reference: (reference: string) => `Riferimento ${reference} (da indicare al momento del pagamento)`,
		alreadyPaid: 'Se ha già effettuato il pagamento, non tenga conto della presente.',
		salutation: 'Gentile',
		closing: 'Cordiali saluti'
	},
	en: {
		titles: ['Payment reminder', '2nd reminder', '3rd reminder'],
		subject: (number: string) => `Utility cost statement ${number}`,
		statement: ({ number, start, end }: Dates) => `utility cost statement ${number} for the period ${start} – ${end}`,
		openings: [
			(s: string) => `According to our records, the ${s} is still unpaid. You may have overlooked the payment.`,
			(s: string) => `Despite our payment reminder, the ${s} has not yet been paid.`,
			(s: string) =>
				`Despite two reminders, the ${s} has still not been paid. Please settle the amount immediately; otherwise we will have to take further steps.`
		],
		amount: 'Amount outstanding: ',
		payBy: (date: string) => `Please transfer the amount by ${date} to the following account:`,
		reference: (reference: string) => `Reference ${reference} (please quote it with your payment)`,
		alreadyPaid: 'If you have already made the payment, please disregard this letter.',
		salutation: 'Dear',
		closing: 'Kind regards'
	}
} satisfies Record<Language, unknown>;

// dd.mm.yyyy in every language, as on the statement PDF
const swissDate = (date: string) =>
	new Date(`${date}T00:00:00Z`).toLocaleDateString('de-CH', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: 'UTC'
	});

const chf = (amount: number) => `CHF ${amount.toFixed(2)}`;

export function reminderLetter(input: ReminderLetterInput) {
	const w = WORDING[input.language ?? 'de'];
	const title = w.titles[input.level - 1];
	const statement = w.statement({
		number: input.statementNumber,
		start: swissDate(input.periodStart),
		end: swissDate(input.periodEnd)
	});
	const paragraphs = [
		w.openings[input.level - 1](statement),
		`${w.amount}${chf(input.balance)}`,
		`${w.payBy(swissDate(input.deadline))}\nIBAN ${input.sender.iban}${input.reference ? `\n${w.reference(input.reference)}` : ''}`,
		w.alreadyPaid
	];
	const salutation = `${w.salutation} ${input.tenant.firstName} ${input.tenant.lastName}`;
	const closing = `${w.closing}\n${input.sender.name}`;

	return {
		title,
		subject: `${title} – ${w.subject(input.statementNumber)}`,
		salutation,
		paragraphs,
		closing,
		text: [`${salutation},`, ...paragraphs, closing].join('\n\n')
	};
}
