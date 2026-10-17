import { localName } from '$lib/names';
import { m } from '$lib/paraglide/messages';
import { formatCurrency, formatDate, formatDateTime } from '$lib/utils/format';

/** An entry of GET /api/v1/audit-log: what happened, with a snapshot of what it names (#357) */
type BackendEntry = {
	id: string;
	occurredAt: string;
	action: string;
	details: Record<string, unknown>;
};
type Details = Record<string, string | number | boolean | null | undefined>;

export type AuditEntry = { id: string; when: string; text: string };

const PROVIDERS: Record<string, string> = { google: 'Google', microsoft: 'Microsoft' };

// The entry in the UI language, built when it is shown (fach review V-9)
const TEXTS: Record<string, (d: Details) => string> = {
	login: (d) => m.audit_login({ provider: PROVIDERS[String(d.provider)] ?? String(d.provider) }),
	management_fee_changed: (d) => m.audit_fee({ from: String(d.from), to: String(d.to) }),
	category_allocability_changed: (d) => {
		const name = localName(d as { name: string });
		if (d.allocable) return m.audit_category_included({ name });
		if (!d.invoices) return m.audit_category_excluded({ name });
		return d.invoices === 1
			? m.audit_category_excluded_invoice({ name })
			: m.audit_category_excluded_invoices({ name, count: Number(d.invoices) });
	},
	invoice_allocability_changed: (d) => {
		const values = {
			description: String(d.description),
			supplier: String(d.supplier),
			date: formatDate(String(d.invoiceDate)),
			amount: formatCurrency(Number(d.amount)),
			building: String(d.building)
		};
		return d.allocable ? m.audit_invoice_included(values) : m.audit_invoice_excluded(values);
	},
	payment_reset: (d) =>
		d.paidDate
			? m.audit_payment_reset({ number: String(d.number), date: formatDate(String(d.paidDate)) })
			: m.audit_payment_reset_undated({ number: String(d.number) }),
	statement_corrected: (d) =>
		m.audit_statement_corrected({
			number: String(d.number),
			replacement: String(d.replacementNumber)
		})
};

export const toAuditEntries = (entries: BackendEntry[]): AuditEntry[] =>
	entries.map(({ id, occurredAt, action, details }) => ({
		id,
		when: formatDateTime(occurredAt),
		text: TEXTS[action](details as Details)
	}));
