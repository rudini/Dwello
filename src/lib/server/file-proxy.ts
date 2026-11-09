import { pdfRefusal } from './statement';

const SHOWN = ['application/pdf', 'image/jpeg', 'image/png'];

/** A file of the backend handed to the browser with its name; `inline` shows it in the browser with its kind (a Beleg
 * to look at). Any other is saved: a photo as bytes, since WebKit shows it even as an attachment (#424) and the
 * link cannot ask for saving (`download` would save the error page too). A refusal opens the app's error page (#1093) */
export async function proxyFile(
	fetch: typeof globalThis.fetch,
	request: Request,
	url: string,
	inline = false
) {
	const response = await fetch(url);
	if (!response.ok) return pdfRefusal(request, await response.json().catch(() => null));
	const kind = String(response.headers.get('content-type'));
	// only the kinds an upload may have are shown: a row that came another way (a restore) is saved; none runs as a
	// page of the app (#1377)
	const shown = inline && SHOWN.includes(kind);
	return new Response(response.body, {
		status: response.status,
		headers: {
			'content-type': shown || kind === 'application/pdf' ? kind : 'application/octet-stream',
			'content-disposition': (response.headers.get('content-disposition') ?? 'attachment').replace(
				/^attachment/,
				shown ? 'inline' : 'attachment'
			),
			'content-security-policy': 'sandbox'
		}
	});
}
