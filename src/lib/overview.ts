import type { IconName } from './ui/icons';
import type { IllustrationName } from './ui/illustrations';
import { formatDate } from './utils/format';

/** What the overview knows: the dashboard counts plus the statements, letters and contracts with a date ahead */
export interface OverviewInput {
	today: string;
	portfolio: {
		totalBuildings: number;
		totalApartments: number;
		occupiedApartments: number;
		reletApartments: number;
	};
	statementCounts: { draft: number; sent: number; paid: number; overdue: number };
	dueStatements: { id: string; tenantName: string; paymentDeadline: string }[];
	lettersToSend: number;
	// ended Abrechnungsperiode with rented buildings that have no statements yet
	missingPeriod?: { start: string; end: string; buildings: string[] } | null;
	endingContracts: { id: string; tenantName: string; endDate: string }[];
}

/** One thing the landlord should do now, with the page where it is done */
export interface Task {
	id: string;
	title: string;
	text: string;
	href: string;
	action: string;
	icon: IconName;
	illustration?: IllustrationName; // set-up steps, where a new landlord starts
	link?: { href: string; label: string }; // a second way, shown as a text link beside the one action
}

// Set-up in the order a new landlord needs it; only the first missing step is shown
const setup: { missing: (portfolio: OverviewInput['portfolio']) => boolean; task: Task }[] = [
	{
		missing: (p) => p.totalBuildings === 0,
		task: {
			id: 'first-building',
			title: 'Erstes Gebäude erfassen',
			text: 'Beginnen Sie mit der Adresse Ihrer Liegenschaft. Danach erfassen Sie die Wohnungen.',
			href: '/buildings/new',
			action: 'Gebäude erfassen',
			icon: 'building',
			illustration: 'building'
		}
	},
	{
		missing: (p) => p.totalApartments === 0,
		task: {
			id: 'first-apartment',
			title: 'Wohnungen erfassen',
			text: 'Erfassen Sie jede Wohnung mit Wohnungsnummer, Stockwerk, Fläche und Zimmeranzahl.',
			href: '/apartments/new',
			action: 'Wohnung erfassen',
			icon: 'apartment',
			illustration: 'apartment'
		}
	},
	{
		missing: (p) => p.occupiedApartments + p.reletApartments === 0,
		task: {
			id: 'first-contract',
			title: 'Ersten Mietvertrag erfassen',
			text: 'Der Mietvertrag verbindet einen Mieter mit einer Wohnung. Den Mieter können Sie dabei gleich erfassen.',
			href: '/contracts/new',
			action: 'Mietvertrag erfassen',
			icon: 'contract',
			illustration: 'contract'
		}
	}
];

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// The invoices of a period: one calendar year can be filtered, a period across the turn of the year cannot
function invoicesOf({ start, end }: { start: string; end: string }) {
	const year = start.slice(0, 4);
	return start === `${year}-01-01` && end === `${year}-12-31`
		? { href: `/invoices?year=${year}`, label: `Rechnungen ${year} ansehen` }
		: { href: '/invoices', label: 'Rechnungen ansehen' };
}

// Recurring work, most urgent first: money already late, letters waiting at home, statements not yet sent
function workTasks({ statementCounts, lettersToSend, missingPeriod }: OverviewInput): Task[] {
	const tasks: (Task | false)[] = [
		statementCounts.overdue > 0 && {
			id: 'overdue',
			// TODO(fachlich prüfen): shown from the Zahlungsfrist on; a Mahnung is customary only after the Mahnfrist
			title: 'Überfällige Abrechnungen prüfen',
			text: `${count(statementCounts.overdue, 'Nebenkostenabrechnung ist', 'Nebenkostenabrechnungen sind')} über der Zahlungsfrist. Prüfen Sie, ob das Geld eingegangen ist: Dann markieren Sie die Abrechnung als bezahlt, sonst können Sie eine Mahnung senden. Bei einer Rückerstattung überweisen Sie den Betrag und markieren die Abrechnung danach als bezahlt.`,
			href: '/statements?status=overdue',
			action: 'Überfällige ansehen',
			icon: 'reminder'
		},
		lettersToSend > 0 && {
			id: 'letters',
			title: 'Briefe verschicken',
			text: `${count(lettersToSend, 'Brief ist', 'Briefe sind')} zum Versand bereit. Drucken Sie sie aus, schicken Sie sie per Post und markieren Sie sie danach als versendet.`,
			href: '/documents?status=to_send',
			action: 'Briefe ansehen',
			icon: 'mail'
		},
		!!missingPeriod && {
			// TODO(fachlich prüfen): suggestion without legal deadline, see docs/design/offene-punkte.md
			id: 'missing-period',
			title: 'Nebenkostenabrechnungen erstellen',
			text: `Die Abrechnungsperiode ${formatDate(missingPeriod.start)} – ${formatDate(missingPeriod.end)} ist abgelaufen. Noch nicht abgerechnet: ${missingPeriod.buildings.join(', ')}. Erfassen Sie zuerst alle Rechnungen dieser Periode und erstellen Sie dann die Abrechnungen.`,
			href: '/statements/generate',
			action: 'Abrechnungen erstellen',
			icon: 'calculate',
			link: invoicesOf(missingPeriod)
		},
		statementCounts.draft > 0 && {
			id: 'drafts',
			title: 'Abrechnungen prüfen und versenden',
			text: `${count(statementCounts.draft, 'Nebenkostenabrechnung ist', 'Nebenkostenabrechnungen sind')} noch im Entwurf. Prüfen Sie sie und stellen Sie sie den Mietern zu.`,
			href: '/statements?status=draft',
			action: 'Entwürfe ansehen',
			icon: 'statement'
		}
	];
	return tasks.filter((task): task is Task => !!task);
}

/** Tasks in the order they should be done; set-up comes first */
export function overviewTasks(input: OverviewInput): Task[] {
	const step = setup.find(({ missing }) => missing(input.portfolio));
	return [...(step ? [step.task] : []), ...workTasks(input)];
}

/** A date the landlord should not miss, with how far away it is in words */
export interface Deadline {
	id: string;
	kind: 'Zahlungsfrist' | 'Vertragsende';
	name: string;
	date: string;
	days: number;
	when: string;
	href: string;
}

// How far ahead the overview looks – TODO(fachlich prüfen): windows chosen for usability, no legal basis
const PAYMENT_WINDOW_DAYS = 30; // the payment deadline the app gives: every open one shows
const CONTRACT_END_WINDOW_DAYS = 60;

const daysFrom = (today: string, date: string) =>
	Math.round((Date.parse(date.slice(0, 10)) - Date.parse(today)) / 86_400_000);

function when(days: number) {
	if (days < 0) return `seit ${-days} ${-days === 1 ? 'Tag' : 'Tagen'} abgelaufen`;
	return days === 0 ? 'heute' : days === 1 ? 'morgen' : `in ${days} Tagen`;
}

/** Payment deadlines due soon or passed, and contracts ending soon, earliest first */
export function overviewDeadlines({
	today,
	dueStatements,
	endingContracts
}: OverviewInput): Deadline[] {
	const payments = dueStatements.map((s) => ({
		id: s.id,
		kind: 'Zahlungsfrist' as const,
		name: s.tenantName,
		date: s.paymentDeadline,
		days: daysFrom(today, s.paymentDeadline),
		href: `/statements/${s.id}`
	}));
	const ends = endingContracts.map((c) => ({
		id: c.id,
		kind: 'Vertragsende' as const,
		name: c.tenantName,
		date: c.endDate,
		days: daysFrom(today, c.endDate),
		href: `/contracts/${c.id}`
	}));
	return [
		...payments.filter((d) => d.days <= PAYMENT_WINDOW_DAYS),
		...ends.filter((d) => d.days >= 0 && d.days <= CONTRACT_END_WINDOW_DAYS)
	]
		.sort((a, b) => a.days - b.days)
		.map((d) => ({ ...d, when: when(d.days) }));
}
