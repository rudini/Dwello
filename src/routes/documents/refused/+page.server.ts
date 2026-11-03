import { backendMessage } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import type { PageServerLoad } from './$types';

const SETTINGS_CODES = ['CREDITOR_ADDRESS_MISSING', 'IBAN_MISSING', 'IBAN_INVALID'];

/** #734: a PDF or letter the backend refused (`pdfRefusal`): what its code says, and the way back */
export const load: PageServerLoad = ({ url }) => {
	const query = url.searchParams;
	const code = query.get('code') ?? undefined;
	const back = query.get('back');
	return {
		title: query.has('letter')
			? m.documents_refused_letter()
			: code === 'STATEMENT_NOT_FOUND'
				? m.documents_refused_statement()
				: m.documents_refused_pdf(),
		sentence: backendMessage(
			{ code },
			query.has('view') ? m.statements_pdf_view_failed() : m.backend_pdf_failed()
		),
		// a path of this app only, never another site
		back: back && /^\/(?![/\\])/.test(back) ? back : null,
		// a refusal whose way out is in «Einstellungen» links there too (persona Dr. Weber P-2, #450)
		settings: SETTINGS_CODES.includes(code ?? '')
	};
};
