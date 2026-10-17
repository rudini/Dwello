import { m } from '$lib/paraglide/messages';
import type { RentalContract, Tenant, Apartment, Building, ApartmentStatus } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { agreeableCategories } from '$lib/server/category';
import { agreedNames } from '$lib/contract-form';
import { error, fail, redirect } from '@sveltejs/kit';
import { endedPeriodsSince, type AccountingPeriodType } from '$lib/accounting-period';
import { wizardLink } from '$lib/statement-wizard';
import { backendMessage } from '$lib/backend-error';
import {
	contractEndError,
	localToday,
	pastEndConfirmation,
	billedDaysError,
	type RefusedStatement
} from '$lib/contract-status';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ContractDetailsData {
	today: string; // the server's day, for the Vertragsstatus
	missingStatements: { start: string; end: string; href: string }[]; // A-10, #142: newest first
	// the contract's statements: it cannot be deleted (#116); null when they cannot be read (review C-1)
	billedBy: { id: string; statementNumber: string; status: string }[] | null;
	nextSteps: { successor: boolean; ended: boolean } | null; // A-4: a notice still running; A-5: after it the address
	fixedTermCheck: boolean; // A-6: an agreed end passed, the tenant may have stayed
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
		total: number;
	};
}

type Row = Record<string, unknown>;

// The kind of Abrechnungsperiode the settings define; null when they cannot be read
async function periodType(fetch: typeof globalThis.fetch) {
	const config = await fetch(`${BACKEND_URL}/api/v1/config`).catch(() => null);
	if (!config?.ok) return null;
	return (
		((await config.json()).data?.accounting_period as AccountingPeriodType | undefined) ??
		'calendar'
	);
}

// The rows the backend lists, or null when it cannot answer: better no hint than a wrong one
async function rows(fetch: typeof globalThis.fetch, path: string): Promise<Row[] | null> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`).catch(() => null);
	return response?.ok ? ((await response.json()).data ?? []) : null;
}

const rentDaysIn = (contract: Row, { start, end }: { start: string; end: string }) =>
	String(contract.startDate).slice(0, 10) <= end &&
	(!contract.endDate || String(contract.endDate).slice(0, 10) >= start);

// Whether the apartment has a contract starting after the end; null when its contracts cannot be read
async function successorAfter(fetch: typeof globalThis.fetch, contract: Row, end: string) {
	const response = await fetch(
		`${BACKEND_URL}/api/v1/contracts?apartmentId=${contract.apartmentId}`
	).catch(() => null);
	if (!response?.ok) return null;
	const others: Row[] = (await response.json()).contracts ?? [];
	return others.some((o) => String(o.startDate).slice(0, 10) > end);
}

// A notice still running: the new address is due, the next tenant until a later contract is recorded (A-4,
// review K-1); null without one, or when the apartment's contracts cannot be read: no hint rather than a wrong one
async function nextStepsDue(fetch: typeof globalThis.fetch, contract: Row) {
	const end = contract.endDate ? String(contract.endDate).slice(0, 10) : null;
	if (!contract.terminated || !end) return null;
	// after the end only the new address, while the moved-out tenant still has the building's (A-5, #114)
	if (end < localToday()) return contract.oldAddress ? { successor: false, ended: true } : null;
	const successor = await successorAfter(fetch, contract, end);
	return successor === null ? null : { successor, ended: false };
}

// An agreed end passed without a later contract or «Mieter ist ausgezogen»: the tenant may have stayed, and then
// the contract continues open-ended (Art. 266 Abs. 2 OR, A-6); not asked when the apartment's contracts cannot be read
async function fixedTermCheckDue(fetch: typeof globalThis.fetch, contract: Row) {
	const end = contract.endDate ? String(contract.endDate).slice(0, 10) : null;
	if (contract.terminated || contract.movedOut || !end || end >= localToday()) return false;
	return (await successorAfter(fetch, contract, end)) === false;
}

// Every ended Abrechnungsperiode from the Vertragsbeginn on in which the contract has rent days but no statement,
// the newest first (A-10, #142); none when the settings or the statements cannot be read
async function missingStatements(
	fetch: typeof globalThis.fetch,
	contract: Row,
	statements: Row[] | null
) {
	if (!statements) return [];
	const type = await periodType(fetch);
	if (!type) return [];
	const periods = endedPeriodsSince(type, String(contract.startDate).slice(0, 10)).filter(
		(period) => rentDaysIn(contract, period)
	);
	const building = String((contract.building as Row | undefined)?.id);
	return periods
		.filter(
			({ start, end }) =>
				!statements.some(
					// a replaced statement no longer bills the period (#120)
					(s) => s.status !== 'replaced' && String(s.periodStart) >= start && String(s.periodEnd) <= end
				)
		)
		.map(({ start, end }) => ({ start, end, href: wizardLink(building, start, end) }));
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

		const data = await response.json();

		const baseRent = Number(data.baseRent) || 0;
		const additionalRent = Number(data.additionalRent) || 0;
		const advancePayment = Number(data.monthlyAdvancePayment || data.advancePayment) || 0;

		const apartmentStatus: ApartmentStatus = data.apartment?.status || 'occupied';
		const contract: RentalContract & { tenant: Tenant; apartment: Apartment; building: Building } =
			{
				id: data.id,
				apartmentId: data.apartmentId,
				tenantId: data.tenantId,
				startDate: data.startDate,
				endDate: data.endDate || null,
				terminated: !!data.terminated,
				noticeReceivedOn: data.noticeReceivedOn ?? null,
				baseRent: data.baseRent || '0',
				additionalRent: data.additionalRent || null,
				monthlyAdvancePayment: data.monthlyAdvancePayment || '0',
				managementFeeAgreed: !!data.managementFeeAgreed,
				managementFeePercent: data.managementFeePercent ?? null,
				tenant: {
					id: data.tenant?.id || data.tenantId,
					firstName: data.tenant?.firstName || '',
					lastName: data.tenant?.lastName || '',
					email: data.tenant?.email || null,
					phone: data.tenant?.phone || null,
					language: data.tenant?.language || 'de'
				},
				apartment: {
					id: data.apartment?.id || data.apartmentId,
					buildingId: data.apartment?.buildingId || '',
					number: data.apartment?.number || '',
					floor: data.apartment?.floor || 0,
					area: data.apartment?.area || '0',
					rooms: data.apartment?.rooms || '0',
					status: apartmentStatus
				},
				building: {
					id: data.building?.id || '',
					name: data.building?.name || '',
					address: data.building?.address || '',
					postalCode: data.building?.postalCode || '',
					city: data.building?.city || '',
					canton: data.building?.canton || ''
				}
			};

		const statements = await rows(fetch, `statements?contractId=${data.id}&limit=1000`);
		return {
			today: localToday(),
			missingStatements: await missingStatements(fetch, data, statements),
			billedBy:
				statements?.map((s) => ({
					id: String(s.id),
					statementNumber: String(s.statementNumber),
					status: String(s.status)
				})) ?? null,
			nextSteps: await nextStepsDue(fetch, data),
			fixedTermCheck: await fixedTermCheckDue(fetch, data),
			contract,
			// the agreed Nebenkosten (#91); without the categories the page still shows the rest
			agreedCosts: await agreeableCategories(fetch).then(
				(categories) => agreedNames(data.agreedCategoryIds ?? [], categories),
				() => null
			),
			rentBreakdown: {
				baseRent,
				additionalRent,
				advancePayment,
				total: baseRent + additionalRent + advancePayment
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

/** Why the contract cannot end on that day, or null */
function endRefusal(
	contract: { startDate?: string; endDate?: string | null },
	endDate: string,
	pastConfirmed: boolean
) {
	// a stale page: an end already set is changed under «Bearbeiten», not overwritten
	if (contract.endDate)
		return fail(409, {
			endError: m.contracts_end_already_set()
		});
	const endError =
		contractEndError(endDate, String(contract.startDate ?? ''), localToday()) ??
		(pastConfirmed ? null : pastEndConfirmation(endDate, localToday()));
	return endError ? fail(400, { endError }) : null;
}

// The day asked for, once the stored contract may end on it; a refusal to show in the dialog otherwise
async function endDay(fetch: typeof globalThis.fetch, id: string, form: FormData) {
	const endDate = String(form.get('endDate') ?? '');
	const stored = await fetch(`${BACKEND_URL}/api/v1/contracts/${id}`);
	if (!stored.ok) return fail(stored.status, { endError: m.contracts_end_failed() });
	return endRefusal(await stored.json(), endDate, form.get('pastConfirmed') === 'on') ?? endDate;
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
		deleteDraft: draft
	});
	if (refused)
		// the day goes with the offer: another day typed afterwards is not refused (review K-2)
		return fail(409, {
			endError: billedDaysError(refused),
			refused,
			refusedDay: endDate
		});
	return response.ok ? null : fail(response.status, { endError: m.contracts_end_failed() });
}

// Only a draft of this contract: a stale page or another form must not delete a sent statement
async function ownDraft(fetch: typeof globalThis.fetch, contractId: string, statementId: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/statements/${statementId}`);
	const statement: Row = response.ok ? await response.json() : {};
	return statement.contractId === contractId && statement.status === 'draft' ? statement : null;
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

export const actions: Actions = {
	// The last day of the tenancy, the Kündigungstermin of an open-ended contract; a past day only confirmed, never before a statement's end
	end: async ({ params, fetch, request }) => {
		const form = await request.formData();
		const day = await endDay(fetch, params.id, form);
		if (typeof day !== 'string') return day;
		const refused = await endOn(fetch, params.id, day, form);
		if (refused) return refused;
	},
	// The one draft the end would change is deleted with it; the wizard then creates the statement anew (A-10)
	endDeletingDraft: async ({ params, fetch, request }) => {
		const form = await request.formData();
		const day = await endDay(fetch, params.id, form);
		if (typeof day !== 'string') return day;
		const draft = await ownDraft(fetch, params.id, String(form.get('statementId') ?? ''));
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
		const draft = await ownDraft(fetch, params.id, String(form.get('statementId') ?? ''));
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
	delete: async ({ params, fetch, request }) => {
		const confirmed = (await request.formData()).get('mistakeConfirmed') === 'on';
		const url = `${BACKEND_URL}/api/v1/contracts/${params.id}`;
		const stored = await fetch(url);
		if (!stored.ok) return fail(stored.status, { deleteError: m.contracts_delete_failed() });
		const { startDate } = await stored.json();
		if (String(startDate).slice(0, 10) <= localToday() && !confirmed)
			return fail(400, { deleteError: m.contracts_delete_mistake_unconfirmed() });
		const response = await fetch(confirmed ? `${url}?confirmMistake=true` : url, {
			method: 'DELETE'
		});
		if (!response.ok) {
			const body = await response.json().catch(() => null);
			return fail(response.status, {
				deleteError: backendMessage(body, m.contracts_delete_failed())
			});
		}
		throw redirect(303, '/contracts');
	}
};
