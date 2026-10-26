import { m } from '$lib/paraglide/messages';
import type {
	RentalContract,
	Tenant,
	Apartment,
	Building,
	ApartmentStatus,
	Json
} from '$lib/types';
import type { ContractResponse } from '../../../../backend/src/api/contract';
import type { Actions, PageServerLoad } from './$types';
import { agreeableCategories } from '$lib/server/category';
import { agreedNames } from '$lib/contract-form';
import { error, fail, redirect } from '@sveltejs/kit';
import { invoicesOf } from '$lib/overview';
import { wizardLink } from '$lib/statement-wizard';
import { backendMessage } from '$lib/backend-error';
import { monthlyTotal } from '$lib/server/contract-history';
import { toTenant } from '$lib/server/tenant';
import {
	isDay,
	localToday,
	billedDaysError,
	type RefusedStatement
} from '$lib/contract-status';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ContractDetailsData {
	today: string; // the server's day, for the Vertragsstatus
	// A-10, #142: the latest first, each with its way into the wizard (#199, #408 point 2); no href when step 2 would
	// refuse that period (Fachreview 199-1 V-1)
	missingStatements: {
		start: string;
		end: string;
		href: string | null;
		way: { kind: string; start: string; end: string };
		invoices: { href: string; label: string };
	}[];
	// the contract's statements: it cannot be deleted (#116); null when they cannot be read (review C-1)
	billedBy: { id: string; statementNumber: string; status: string }[] | null;
	nextSteps: { successor: boolean; ended: boolean } | null; // A-4: a notice still running; A-5: after it the address
	fixedTermCheck: boolean; // A-6: an agreed end passed, the tenant may have stayed
	endsToday: boolean; // the contract ends today, the backend says by the Swiss day (#815)
	agreedCosts: string[] | null; // #91: the agreed Nebenkosten by name; null when the categories cannot be read
	contract: RentalContract & {
		tenant: Tenant;
		apartment: Apartment;
		building: Building;
	};
	rentBreakdown: {
		baseRent: number;
		additionalRent: number;
		advancePayment: number;
		flatRateUtilityCharge: number; // «Nebenkostenpauschale» (#429)
		total: number;
	};
}

type Row = Record<string, unknown>;

// The rows the backend lists, or null when it cannot answer: better no hint than a wrong one
async function rows(fetch: typeof globalThis.fetch, path: string): Promise<Row[] | null> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`).catch(() => null);
	return response?.ok ? ((await response.json()).data ?? []) : null;
}

type Range = { start: string; end: string };
type MissingPart = Range & { way: Range & { kind: string }; open: boolean };

// The parts of ended Abrechnungsperioden since the Vertragsbeginn with rent days but no statement, the latest first,
// each with its way into the wizard, as the backend decides them (A-10, #142, #199, #408 point 2, H-28), and each to the
// building's invoices (#211). None when they cannot be read: better no hint than a wrong one
async function missingStatements(fetch: typeof globalThis.fetch, contract: Row) {
	const response = await fetch(
		`${BACKEND_URL}/api/v1/contracts/${encodeURIComponent(String(contract.id))}/missing-statements`
	).catch(() => null);
	if (!response?.ok) return [];
	const building = String((contract.building as Row | undefined)?.id);
	return ((await response.json()) as MissingPart[]).map(({ start, end, way, open }) => ({
		start,
		end,
		href: open ? wizardLink(building, way.start, way.end) : null,
		way,
		invoices: invoicesOf(way, building) // the invoices the offered statement takes (Fachreview 454-1 V-2)
	}));
}

// Each field as the backend sends it, or its default when empty or when the record is missing
const filled = <T extends Record<string, unknown>>(values: Record<string, unknown> | null | undefined, defaults: T) =>
	Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, values?.[key] || value])) as T;

// The contract as the page shows it, with tenant, apartment and building
function toContract(
	data: Json<ContractResponse>
): RentalContract & { tenant: Tenant; apartment: Apartment; building: Building } {
	const none = null as string | null;
	return {
		id: data.id,
		apartmentId: data.apartmentId,
		tenantId: data.tenantId,
		startDate: data.startDate,
		...filled(data, { endDate: none, baseRent: '0', additionalRent: none, monthlyAdvancePayment: '0', flatRateUtilityCharge: '0' }),
		terminated: !!data.terminated,
		status: data.status, // the backend decides it (#784, #815)
		noticeReceivedOn: data.noticeReceivedOn ?? null,
		billedUntil: data.billedUntil ?? null,
		advancePayments: data.advancePayments,
		managementFeeAgreed: !!data.managementFeeAgreed,
		managementFeePercent: data.managementFeePercent ?? null,
		tenant: toTenant(data.tenant),
		apartment: filled(data.apartment, {
			id: data.apartmentId as string,
			buildingId: '',
			number: '',
			floor: 0,
			area: '0',
			rooms: '0',
			status: 'occupied' as ApartmentStatus
		}),
		building: filled(data.building, { id: '', name: '', address: '', postalCode: '', city: '', canton: '' })
	};
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<ContractDetailsData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/contracts/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, m.contracts_not_found());
			}
			throw error(response.status, m.contracts_load_failed());
		}

		const data: Json<ContractResponse> = await response.json();

		const baseRent = Number(data.baseRent) || 0;
		const additionalRent = Number(data.additionalRent) || 0;
		const advancePayment = Number(data.monthlyAdvancePayment) || 0;

		const contract = toContract(data);

		const statements = await rows(fetch, `statements?contractId=${data.id}&limit=1000`);
		return {
			today: localToday(),
			missingStatements: await missingStatements(fetch, data),
			billedBy:
				statements?.map((s) => ({
					id: String(s.id),
					statementNumber: String(s.statementNumber),
					status: String(s.status)
				})) ?? null,
			// what a notice or an agreed end still asks of the landlord, the backend decides (A-4 to A-6, #788)
			nextSteps: data.nextSteps ?? null,
			fixedTermCheck: data.fixedTermCheck === true,
			endsToday: data.endsToday === true,
			contract,
			// the agreed Nebenkosten (#91); without the categories the page still shows the rest
			agreedCosts: await agreeableCategories(fetch).then(
				(categories) => agreedNames(data.agreedCategoryIds ?? [], categories, data.agreedFrom),
				() => null
			),
			rentBreakdown: {
				baseRent,
				additionalRent,
				advancePayment,
				flatRateUtilityCharge: Number(data.flatRateUtilityCharge) || 0,
				total: monthlyTotal(data)
			}
		};
	} catch (err) {
		console.error('Failed to fetch contract:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, m.contracts_load_failed());
	}
};

// The day asked for, once the stored contract may end on it; a refusal to show in the dialog otherwise. Whether it is
// before the start or before today (and so needs the confirmation) the backend decides (#788)
async function endDay(fetch: typeof globalThis.fetch, id: string, form: FormData) {
	const endDate = String(form.get('endDate') ?? '');
	// a form sent without a real day (without JavaScript): the dialog's own hint
	if (!isDay(endDate))
		return fail(400, { endError: m.contracts_end_missing({ example: `31.12.${localToday().slice(0, 4)}` }) });
	const stored = await fetch(`${BACKEND_URL}/api/v1/contracts/${id}`);
	if (!stored.ok) return fail(stored.status, { endError: m.contracts_end_failed() });
	// a stale page: an end already set is changed under «Bearbeiten», not overwritten
	if ((await stored.json()).endDate) return fail(409, { endError: m.contracts_end_already_set() });
	return endDate;
}

// The contract's new data; `refused` names the stored statements whose rent days it would change (409, A-10)
async function save(fetch: typeof globalThis.fetch, id: string, body: Record<string, unknown>) {
	const response = await fetch(`${BACKEND_URL}/api/v1/contracts/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	const statements =
		response.status === 409 && (await response.json().catch(() => ({}))).statements;
	return {
		response,
		refused: Array.isArray(statements) ? (statements as RefusedStatement[]) : null
	};
}

// The contract ends by notice (A-1), with the day the notice arrived when known (A-3); a stored statement that
// already bills rent days after that day refuses it, unless it is the one draft named, which the backend then
// deletes with the end, or keeps when it refuses (#141)
async function endOn(
	fetch: typeof globalThis.fetch,
	id: string,
	endDate: string,
	form: FormData,
	draft?: string
) {
	const noticeReceivedOn = String(form.get('noticeReceivedOn') ?? '') || undefined;
	const { response, refused } = await save(fetch, id, {
		endDate,
		terminated: true,
		noticeReceivedOn,
		confirmPastEnd: form.get('pastConfirmed') === 'on' || undefined,
		deleteDraft: draft
	});
	if (refused)
		// the day goes with the offer: another day typed afterwards is not refused (review K-2)
		return fail(409, {
			endError: billedDaysError(refused),
			refused,
			refusedDay: endDate
		});
	if (response.ok) return null;
	// a refusal with its own message, e.g. a later Akonto (review 464-2 C-11); never the backend's own text
	const { code, params } = response.status === 400 ? await response.json().catch(() => ({})) : {};
	return fail(response.status, { endError: backendMessage({ code, params }, m.contracts_end_failed()) });
}

// The draft named, for the wizard afterwards; whether it may be deleted is the backend's (H-28, #717): only a draft
// of this contract that the change touches, never a sent statement
async function namedDraft(fetch: typeof globalThis.fetch, statementId: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/statements/${statementId}`);
	return response.ok ? ((await response.json()) as Row) : null;
}

// The agreed end removed: the tenant stayed and the contract continues open-ended (A-6); a stored statement that
// bills rent days only up to the end refuses it, unless it is the one draft named, which the backend then deletes
async function continueOpenEnded(fetch: typeof globalThis.fetch, id: string, draft?: string) {
	const { response, refused } = await save(fetch, id, { endDate: null, deleteDraft: draft });
	if (refused)
		return fail(409, {
			fixedTermError: billedDaysError(refused, m.contracts_continue_locked_rest),
			fixedTermRefused: refused
		});
	return response.ok ? null : fail(response.status, { fixedTermError: m.contracts_save_failed() });
}

// The deleted draft's period in the statement wizard, to create it anew (A-10)
const toWizard = (draft: Row) =>
	redirect(
		303,
		wizardLink(
			String((draft.building as Row | undefined)?.id),
			String(draft.periodStart),
			String(draft.periodEnd)
		)
	);

// The end on the day of the form
async function endOnFormDay(fetch: typeof globalThis.fetch, id: string, form: FormData) {
	const day = await endDay(fetch, id, form);
	return typeof day === 'string' ? endOn(fetch, id, day, form) : day;
}

export const actions: Actions = {
	// The last day of the tenancy, the Kündigungstermin of an open-ended contract; a past day only confirmed, never before a statement's end
	end: async ({ params, fetch, request }) => {
		const refused = await endOnFormDay(fetch, params.id, await request.formData());
		if (refused) return refused;
	},
	// The one draft the end would change is deleted with it; the wizard then creates the statement anew (A-10)
	endDeletingDraft: async ({ params, fetch, request }) => {
		const form = await request.formData();
		const day = await endDay(fetch, params.id, form);
		if (typeof day !== 'string') return day;
		const draft = await namedDraft(fetch, String(form.get('statementId') ?? ''));
		if (!draft) return fail(409, { endError: m.contracts_end_failed() });
		const refused = await endOn(fetch, params.id, day, form, String(draft.id));
		if (refused) return refused;
		throw toWizard(draft);
	},
	continueOpenEnded: async ({ params, fetch }) => {
		const refused = await continueOpenEnded(fetch, params.id);
		if (refused) return refused;
	},
	// The one draft the continuation would change is deleted with it; the wizard then creates the statement anew
	continueDeletingDraft: async ({ params, fetch, request }) => {
		const form = await request.formData();
		const draft = await namedDraft(fetch, String(form.get('statementId') ?? ''));
		if (!draft) return fail(409, { fixedTermError: m.contracts_save_failed() });
		const refused = await continueOpenEnded(fetch, params.id, String(draft.id));
		if (refused) return refused;
		throw toWizard(draft);
	},
	// the tenant left on the agreed end: the overview stops asking (A-6)
	movedOut: async ({ params, fetch }) => {
		const { response } = await save(fetch, params.id, { movedOut: true });
		if (!response.ok) return fail(response.status, { movedOutError: m.contracts_save_failed() });
	},
	// a contract that has started only when confirmed as entered by mistake (A-7, #116); the backend refuses one
	// that a statement bills
	// #464 (product owner on F-13): a later Akonto; the backend refuses one that would change a statement
	deleteAdvance: async ({ params, fetch, request }) => {
		const validFrom = String((await request.formData()).get('validFrom'));
		// only a day's shape goes into the backend path (review 464-1 C-9); whether it is a real day is the backend's (H-28)
		if (!/^\d{4}-\d{2}-\d{2}$/.test(validFrom)) return fail(400, { validFrom, advanceDeleteError: m.contracts_save_failed() });
		const response = await fetch(`${BACKEND_URL}/api/v1/contracts/${params.id}/advance-payments/${validFrom}`, {
			method: 'DELETE'
		});
		if (response.ok) return null;
		const body = await response.json().catch(() => null);
		return fail(response.status, { validFrom, advanceDeleteError: backendMessage(body, m.contracts_save_failed()) });
	},
	delete: async ({ params, fetch, request }) => {
		const confirmed = (await request.formData()).get('mistakeConfirmed') === 'on';
		const url = `${BACKEND_URL}/api/v1/contracts/${params.id}`;
		// whether it has started, and so needs the confirmation, the backend decides (CONTRACT_STARTED, #788)
		const response = await fetch(confirmed ? `${url}?confirmMistake=true` : url, {
			method: 'DELETE'
		});
		if (!response.ok) {
			// a refusal with a code has its message; any other answer (a contract deleted meanwhile) the own text
			const body = await response.json().catch(() => null);
			return fail(response.status, {
				deleteError: backendMessage(body?.code ? body : null, m.contracts_delete_failed())
			});
		}
		throw redirect(303, '/contracts');
	}
};
