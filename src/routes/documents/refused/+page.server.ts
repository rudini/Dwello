import { backendMessage } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { listOfGone } from '$lib/server/statement';
import type { PageServerLoad } from './$types';

const SETTINGS_CODES = [
	'CREDITOR_ADDRESS_MISSING',
	'ACCOUNT_HOLDER_MISSING',
	'IBAN_MISSING',
	'IBAN_INVALID'
]; // the Kontoinhaber's too (Weber 690 W-1)

/** #734: a PDF or file the backend refused (`pdfRefusal`): what its code says, and the way back */
export const load: PageServerLoad = ({ url }) => {
	const query = url.searchParams;
	const code = query.get('code') ?? undefined;
	// resolved as the browser does (it drops tabs and line breaks): a path of this app only, never another site
	const path = query.get('back');
	const back = path !== null && URL.canParse(path, url) ? new URL(path, url) : null;
	// a record that is gone names itself in the title (#1093)
	const gone: Record<string, () => string> = {
		STATEMENT_NOT_FOUND: m.documents_refused_statement,
		INVOICE_NOT_FOUND: m.documents_refused_invoice,
		DOCUMENT_NOT_FOUND: m.documents_refused_document
	};
	// not their «Laden Sie die Seite neu»: here that shows this page again (personas 1093 P-1)
	const deleted: Record<string, () => string> = {
		INVOICE_NOT_FOUND: m.documents_refused_invoice_gone,
		DOCUMENT_NOT_FOUND: m.documents_refused_document_gone
	};
	// only the code's own entry: `__proto__` and the like name what every object has (fallback review of #1107)
	const of = <T>(table: Record<string, T>) =>
		code && Object.hasOwn(table, code) ? table[code] : undefined;
	// «//x» as a path is another site too (code review 734 C-1, round 2)
	const own = back?.origin === url.origin && !back.pathname.startsWith('//') ? back : null;
	// without a way back: the list of what was refused
	const list = of(listOfGone) ?? '/statements';
	return {
		title: (of(gone) ?? m.documents_refused_pdf)(),
		sentence:
			of(deleted)?.() ??
			backendMessage(
				{ code },
				query.has('view') ? m.statements_pdf_view_failed() : m.backend_pdf_failed()
			),
		back: own ? `${own.pathname}${own.search}` : null,
		list,
		// a way back to the list of a record that is gone names the list (code review 1094 C-1)
		way:
			own && !(of(listOfGone) && own.pathname === list)
				? m.ui_back()
				: list === '/invoices'
					? m.documents_to_invoices()
					: m.documents_to_statements(),
		// a refusal whose way out is in «Einstellungen» links there too (persona Dr. Weber P-2, #450)
		settings: SETTINGS_CODES.includes(code ?? '')
	};
};
