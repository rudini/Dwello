import type { IconName } from './ui/icons';
import type { IllustrationName } from './ui/illustrations';
import { formatDate } from './utils/format';
import { periodName } from './accounting-period';
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
	// toSend: the current drafts, as the backend counts them (#454, H-28 #717)
	statementCounts: { draft: number; toSend: number; sent: number; paid: number; overdue: number };
	// the sent ones; once the Zahlungsfrist passed, whether a Mahnung is due now, else null, as the backend decides (#788)
	dueStatements: {
		id: string;
		tenantName: string;
		paymentDeadline: string;
		reminderDue?: boolean | null;
	}[];
	// the setting: Zahlungsfrist in days (#87)
	paymentDeadlineDays: number;
	lettersToSend: number;
	// per building the parts of ended Abrechnungsperioden without a statement, the latest first (#211)
	missingStatements?: { building: string; buildingId: string; periods: { start: string; end: string }[] }[];
	// drafts with a change since and sent, paid or settled statements due for correcting, with what changed (#454)
	outdatedStatements?: {
		id: string;
		statementNumber: string;
		tenantName: string;
		status: string;
		buildingId: string;
		building: string;
		periodStart: string;
		periodEnd: string;
		invoices: number; // recorded, changed or deleted since
		fuelStock: boolean; // the Tankbestand changed since
		olderThanFiveYears: boolean; // the period ended more than five years ago, by the Swiss day (#788)
	}[];
	endingContracts: { id: string; tenantName: string; endDate: string }[];
	// moved out with a draft statement, still at the building's address (A-5, #114)
	oldAddresses?: { tenantId: string; tenantName: string }[];
	// ended by notice, still running and without a following contract (A-4)
	noticedContracts: {
		id: string;
		tenantName: string;
		apartmentId: string;
		apartmentNumber: string;
		endDate: string;
	}[];
	// agreed end passed, without a following contract and without «Mieter ist ausgezogen» (A-6)
	expiredContracts: { id: string; tenantName: string; endDate: string }[];
	// ehemalige Mieter with uploads from before their last Vertragsende (#178)
	formerTenants?: { tenantId: string; tenantName: string; endDate: string; count: number }[];
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
	links?: { href: string; label: string }[]; // several of them, one per building and period (#454)
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

/**
 * The invoices of a building that fall into an Abrechnungsperiode (#211, #454): «Rechnungen 2025 ansehen», another
 * range by its days; named the building where the text names several (Fachreview 454-2 V-22)
 */
export function invoicesOf(period: { start: string; end: string }, building: string, named?: string) {
	const name = periodName(period);
	const filter = new URLSearchParams({ building, periodStart: period.start, periodEnd: period.end });
	return {
		href: `/invoices?${filter}`,
		label: named
			? m.dashboard_invoices_of_building({ building: named, period: name })
			: name === period.start.slice(0, 4)
				? m.dashboard_invoices_of_year({ year: name })
				: m.dashboard_invoices_of_period({ period: name })
	};
}

type Missing = NonNullable<OverviewInput['missingStatements']>;
// «Ahornhof (2025, 01.07.2024 – 31.12.2024), Seeblick (2023)»
function missingText(missing: Missing) {
	const buildings = missing
		.map(({ building, periods }) => `${building} (${periods.map(periodName).join(', ')})`)
		.join(', ');
	return missing.flatMap((b) => b.periods).length === 1
		? m.dashboard_task_missing_period_text({ buildings })
		: m.dashboard_task_missing_periods_text({ buildings });
}
// the newest period without a statement, with its building
function newestInvoices(missing: Missing) {
	const [newest] = missing
		.flatMap((b) => b.periods.map((period) => ({ period, b })))
		.sort((x, y) => y.period.start.localeCompare(x.period.start));
	return invoicesOf(newest.period, newest.b.buildingId, missing.length > 1 ? newest.b.building : undefined);
}

type Outdated = NonNullable<OverviewInput['outdatedStatements']>;

// #454 (#408 point 7): the drafts no longer current, one way per building and period (Fachreview 454-1 V-14)
function outdatedDraftsTask(drafts: Outdated): Task | false {
	if (!drafts.length) return false;
	const ways = new Map<string, { href: string; label: string }>();
	for (const d of drafts) {
		const filter = new URLSearchParams({ building: d.buildingId, periodStart: d.periodStart, periodEnd: d.periodEnd, status: 'draft' });
		const label = `${d.building}, ${periodName({ start: d.periodStart, end: d.periodEnd })}`;
		ways.set(String(filter), { href: `/statements?${filter}`, label });
	}
	return {
		id: 'outdated-drafts',
		title: count(drafts.length, m.dashboard_task_outdated_drafts_one, m.dashboard_task_outdated_drafts_many),
		text: m.dashboard_task_outdated_drafts_text(),
		href: '/statements?status=draft',
		action: m.dashboard_task_drafts_action(),
		icon: 'statement',
		links: [...ways.values()]
	};
}

// What changed since a statement, as the statement page says it (#454, Fachreview 454-1 V-8)
export function laterText(invoices: number, fuelStock: boolean) {
	const changed = invoices === 1 ? m.statements_later_one() : m.statements_later_many({ count: invoices });
	if (!fuelStock) return changed;
	return invoices ? m.statements_later_and_fuel_stock({ later: changed }) : m.statements_later_fuel_stock();
}

// #454 (#408 point 7, PO 2026-10-20 E-4, E-5): a sent, paid or settled statement to correct
const correctTasks = (statements: Outdated): Task[] =>
	statements.map((s) => ({
		id: `correct-${s.id}`,
		title: m.statements_correct(),
		text: [
			m.dashboard_task_correct_text({ number: s.statementNumber, tenant: s.tenantName, later: laterText(s.invoices, s.fuelStock) }),
			s.olderThanFiveYears && m.dashboard_task_correct_old()
		]
			.filter(Boolean)
			.join(' '),
		href: `/statements/${s.id}`,
		action: m.dashboard_task_correct_action(),
		icon: 'statement'
	}));

// Recurring work, most urgent first: money already late, letters waiting at home, statements not yet sent
function workTasks({
	statementCounts,
	dueStatements,
	lettersToSend,
	missingStatements = [],
	outdatedStatements = []
}: OverviewInput): Task[] {
	const outdatedDrafts = outdatedStatements.filter((s) => s.status === 'draft');
	// «Überfällig» from the day after the Zahlungsfrist, a Mahnung only when the backend names it due (#64, #107, #788);
	// an overdue statement whose list failed to load still counts
	const overdue =
		statementCounts.overdue - dueStatements.filter((s) => s.reminderDue === false).length;
	const tasks: (Task | false)[] = [
		// before a Mahnung of the same statement (Fachreview 454-1 V-12)
		...correctTasks(outdatedStatements.filter((s) => s.status !== 'draft')),
		overdue > 0 && {
			id: 'overdue',
			title: m.dashboard_task_overdue(),
			text: count(overdue, m.dashboard_task_overdue_text_one, m.dashboard_task_overdue_text_many),
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
		missingStatements.length > 0 && {
			// right after the Abrechnungsperiode, without a legal deadline: a UX choice (#64)
			id: 'missing-period',
			title: m.dashboard_task_missing_period(),
			text: missingText(missingStatements),
			href: '/statements/generate',
			action: m.dashboard_create_statements(),
			icon: 'calculate',
			link: newestInvoices(missingStatements)
		},
		outdatedDraftsTask(outdatedDrafts),
		statementCounts.toSend > 0 && {
			id: 'drafts',
			title: m.dashboard_task_drafts(),
			text: count(
				statementCounts.toSend,
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

// A notice gives time to find the next tenant; the earliest end first (A-4)
const successorTasks = ({ noticedContracts }: OverviewInput): Task[] =>
	[...noticedContracts]
		.sort((a, b) => a.endDate.localeCompare(b.endDate))
		.map((c) => ({
			id: `successor-${c.id}`,
			title: m.dashboard_task_successor({ apartment: c.apartmentNumber }),
			text: m.dashboard_task_successor_text({ name: c.tenantName, date: formatDate(c.endDate) }),
			href: `/contracts/new?apartment=${c.apartmentId}`,
			action: m.dashboard_add_contract(),
			icon: 'contract'
		}));

// A draft would go to the apartment the tenant left: the new address first (A-5, #114)
const addressTasks = ({ oldAddresses = [] }: OverviewInput): Task[] =>
	oldAddresses.map((t) => ({
		id: `old-address-${t.tenantId}`,
		title: m.contracts_next_address(),
		text: m.statements_old_address({ name: t.tenantName }),
		href: `/tenants/${t.tenantId}/edit`,
		action: m.contracts_next_address(),
		icon: 'edit'
	}));

// The tenant who stayed after an agreed end continues the contract open-ended (Art. 266 Abs. 2 OR, A-6);
// wording of the question decided in #410 (#308)
const fixedTermTasks = ({ expiredContracts }: OverviewInput): Task[] =>
	[...expiredContracts]
		.sort((a, b) => a.endDate.localeCompare(b.endDate))
		.map((c) => ({
			id: `fixed-term-${c.id}`,
			title: m.dashboard_task_fixed_term(),
			text: m.contracts_fixed_term_question({ name: c.tenantName, date: formatDate(c.endDate) }),
			href: `/contracts/${c.id}`,
			action: m.dashboard_task_fixed_term_action(),
			icon: 'contract'
		}));
const formerCount = (count: number, endDate: string) =>
	(count === 1
		? m.dashboard_task_former_documents_text_one
		: m.dashboard_task_former_documents_text_many)({ count, date: formatDate(endDate) });
// ends once the landlord marks the documents as checked (#459); documents from the end day on are not counted
const formerDocumentTasks = ({ formerTenants = [] }: OverviewInput): Task[] =>
	formerTenants.map((t) => ({
		id: `former-documents-${t.tenantId}`,
		title: m.dashboard_task_former_documents({ name: t.tenantName }),
		text: `${formerCount(t.count, t.endDate)} ${m.tenants_former_documents_end_day()}`,
		href: `/tenants/${t.tenantId}`,
		action: m.dashboard_task_former_documents_action(),
		icon: 'document'
	}));

/** Tasks in the order they should be done; set-up comes first */
export function overviewTasks(input: OverviewInput): Task[] {
	const step = setup.find(({ missing }) => missing(input.portfolio));
	return [
		...(step ? [step.task()] : []),
		...workTasks(input),
		...addressTasks(input),
		...successorTasks(input),
		...fixedTermTasks(input),
		...formerDocumentTasks(input)
	];
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

// How far ahead the overview looks at contract ends: a UX choice (#64); payments within the Zahlungsfrist (#87)
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
	endingContracts,
	paymentDeadlineDays
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
		...payments.filter((d) => d.days <= paymentDeadlineDays),
		...ends.filter((d) => d.days >= 0 && d.days <= CONTRACT_END_WINDOW_DAYS)
	]
		.sort((a, b) => a.days - b.days)
		.map((d) => ({ ...d, when: when(d.days) }));
}
