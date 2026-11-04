import { backendMessage } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { listOfGone } from '$lib/server/statement';
import type { PageServerLoad } from './$types';

const SETTINGS_CODES = ['CREDITOR_ADDRESS_MISSING', 'IBAN_MISSING', 'IBAN_INVALID'];

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
	return {
		title: (gone[code ?? ''] ?? m.documents_refused_pdf)(),
		sentence: backendMessage(
			{ code },
			query.has('view') ? m.statements_pdf_view_failed() : m.backend_pdf_failed()
		),
		// «//x» as a path is another site too (code review 734 C-1, round 2)
		back:
			back?.origin === url.origin && !back.pathname.startsWith('//')
				? `${back.pathname}${back.search}`
				: null,
		// without a way back: the list of what was refused
		list: listOfGone[code ?? ''] ?? '/statements',
		// a refusal whose way out is in «Einstellungen» links there too (persona Dr. Weber P-2, #450)
		settings: SETTINGS_CODES.includes(code ?? '')
	};
};
