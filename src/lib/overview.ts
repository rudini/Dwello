import type { IconName } from './ui/icons';
import type { IllustrationName } from './ui/illustrations';
import { formatDate } from './utils/format';
import { m } from '$lib/paraglide/messages';

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

// Set-up in the order a new landlord needs it; only the first missing step is shown.
// Tasks are built when asked for, so their texts are in the language of the request
const setup: { missing: (portfolio: OverviewInput['portfolio']) => boolean; task: () => Task }[] = [
	{
		missing: (p) => p.totalBuildings === 0,
		task: () => ({
			id: 'first-building',
			title: m.dashboard_task_first_building(),
			text: m.dashboard_task_first_building_text(),
			href: '/buildings/new',
			action: m.buildings_add(),
			icon: 'building',
			illustration: 'building'
		})
	},
	{
		missing: (p) => p.totalApartments === 0,
		task: () => ({
			id: 'first-apartment',
			title: m.dashboard_task_first_apartment(),
			text: m.dashboard_task_first_apartment_text(),
			href: '/apartments/new',
			action: m.buildings_add_apartment(),
			icon: 'apartment',
			illustration: 'apartment'
		})
	},
	{
		missing: (p) => p.occupiedApartments + p.reletApartments === 0,
		task: () => ({
			id: 'first-contract',
			title: m.dashboard_task_first_contract(),
			text: m.dashboard_task_first_contract_text(),
			href: '/contracts/new',
			action: m.dashboard_add_contract(),
			icon: 'contract',
			illustration: 'contract'
		})
	}
];

type CountMessage = (inputs: { count: number }) => string;
const count = (n: number, one: CountMessage, many: CountMessage) =>
	(n === 1 ? one : many)({ count: n });

// The invoices of a period: one calendar year can be filtered, a period across the turn of the year cannot
function invoicesOf({ start, end }: { start: string; end: string }) {
	const year = start.slice(0, 4);
	return start === `${year}-01-01` && end === `${year}-12-31`
		? { href: `/invoices?year=${year}`, label: m.dashboard_invoices_of_year({ year }) }
		: { href: '/invoices', label: m.dashboard_invoices() };
}

// Recurring work, most urgent first: money already late, letters waiting at home, statements not yet sent
function workTasks({ statementCounts, lettersToSend, missingPeriod }: OverviewInput): Task[] {
	const tasks: (Task | false)[] = [
		statementCounts.overdue > 0 && {
			id: 'overdue',
			// TODO(fachlich prüfen, #64): shown from the Zahlungsfrist on; a Mahnung is customary only after the Mahnfrist
			title: m.dashboard_task_overdue(),
			text: count(
				statementCounts.overdue,
				m.dashboard_task_overdue_text_one,
				m.dashboard_task_overdue_text_many
			),
			href: '/statements?status=overdue',
			action: m.dashboard_task_overdue_action(),
			icon: 'reminder'
		},
		lettersToSend > 0 && {
			id: 'letters',
			title: m.dashboard_task_letters(),
			text: count(
				lettersToSend,
				m.dashboard_task_letters_text_one,
				m.dashboard_task_letters_text_many
			),
			href: '/documents?status=to_send',
			action: m.dashboard_task_letters_action(),
			icon: 'mail'
		},
		!!missingPeriod && {
			// TODO(fachlich prüfen, #64): suggestion without legal deadline
			id: 'missing-period',
			title: m.dashboard_task_missing_period(),
			text: m.dashboard_task_missing_period_text({
				start: formatDate(missingPeriod.start),
				end: formatDate(missingPeriod.end),
				buildings: missingPeriod.buildings.join(', ')
			}),
			href: '/statements/generate',
			action: m.dashboard_create_statements(),
			icon: 'calculate',
			link: invoicesOf(missingPeriod)
		},
		statementCounts.draft > 0 && {
			id: 'drafts',
			title: m.dashboard_task_drafts(),
			text: count(
				statementCounts.draft,
				m.dashboard_task_drafts_text_one,
				m.dashboard_task_drafts_text_many
			),
			href: '/statements?status=draft',
			action: m.dashboard_task_drafts_action(),
			icon: 'statement'
		}
	];
	return tasks.filter((task): task is Task => !!task);
}

/** Tasks in the order they should be done; set-up comes first */
export function overviewTasks(input: OverviewInput): Task[] {
	const step = setup.find(({ missing }) => missing(input.portfolio));
	return [...(step ? [step.task()] : []), ...workTasks(input)];
}

/** A date the landlord should not miss, with how far away it is in words; `kind` is an id, shown via a message */
export interface Deadline {
	id: string;
	kind: 'Zahlungsfrist' | 'Vertragsende';
	name: string;
	date: string;
	days: number;
	when: string;
	href: string;
}

// How far ahead the overview looks – TODO(fachlich prüfen, #64): windows chosen for usability, no legal basis
const PAYMENT_WINDOW_DAYS = 30; // the payment deadline the app gives: every open one shows
const CONTRACT_END_WINDOW_DAYS = 60;

const daysFrom = (today: string, date: string) =>
	Math.round((Date.parse(date.slice(0, 10)) - Date.parse(today)) / 86_400_000);

function when(days: number) {
	if (days < 0)
		return (-days === 1 ? m.dashboard_passed_one : m.dashboard_passed_many)({ days: -days });
	return days === 0
		? m.dashboard_today()
		: days === 1
			? m.dashboard_tomorrow()
			: m.dashboard_in_days({ days });
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
