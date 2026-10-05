/**
 * Wording of payment reminders (Zahlungserinnerung, 2. and 3. Mahnung), shared by the PDF and the e-mail
 */

export interface ReminderLetterInput {
	level: number;
	statementNumber: string;
	periodStart: string;
	periodEnd: string;
	balance: number;
	deadline: string;
	tenant: { firstName: string; lastName: string };
	sender: { name: string; iban: string };
}

const TITLES = ['Zahlungserinnerung', '2. Mahnung', '3. Mahnung'];

const swissDate = (date: string) =>
	new Date(`${date}T00:00:00Z`).toLocaleDateString('de-CH', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: 'UTC'
	});

const chf = (amount: number) => `CHF ${amount.toFixed(2)}`;

function opening(level: number, statement: string) {
	if (level === 1) {
		return `gemäss unseren Unterlagen ist die ${statement} noch offen. Möglicherweise haben Sie die Zahlung übersehen.`;
	}
	if (level === 2) return `Trotz unserer Zahlungserinnerung ist die ${statement} noch nicht bezahlt.`;
	return `Trotz zweimaliger Mahnung ist die ${statement} noch immer nicht bezahlt. Begleichen Sie den Betrag bitte umgehend, andernfalls müssen wir weitere Schritte einleiten.`;
}

export function reminderLetter(input: ReminderLetterInput) {
	const title = TITLES[input.level - 1];
	const statement = `Nebenkostenabrechnung ${input.statementNumber} für die Periode ${swissDate(input.periodStart)} – ${swissDate(input.periodEnd)}`;
	const paragraphs = [
		opening(input.level, statement),
		`Offener Betrag: ${chf(input.balance)}`,
		`Bitte überweisen Sie den Betrag bis ${swissDate(input.deadline)} auf folgendes Konto:\nIBAN ${input.sender.iban}`,
		'Haben Sie die Zahlung bereits geleistet, betrachten Sie dieses Schreiben als gegenstandslos.'
	];
	const salutation = `Guten Tag ${input.tenant.firstName} ${input.tenant.lastName}`;
	const closing = `Freundliche Grüsse\n${input.sender.name}`;

	return {
		title,
		subject: `${title} – Nebenkostenabrechnung ${input.statementNumber}`,
		salutation,
		paragraphs,
		closing,
		text: [`${salutation},`, ...paragraphs, closing].join('\n\n')
	};
}
