import { pdfRefusal } from './statement';

/** A file of the backend handed to the browser with its name; `inline` shows it in the browser with its kind (a Beleg
 * to look at). Any other is saved: sent as bytes, since WebKit shows a photo sent as an attachment (#424) and the
 * link cannot ask for saving (`download` would save the error page too). A refusal opens the app's error page (#1093) */
export async function proxyFile(
	fetch: typeof globalThis.fetch,
	request: Request,
	url: string,
	inline = false
) {
	const response = await fetch(url);
	if (!response.ok) return pdfRefusal(request, await response.json().catch(() => null));
	const kind = response.headers.get('content-type') ?? 'application/octet-stream';
	return new Response(response.body, {
		status: response.status,
		headers: {
			'content-type': inline ? kind : 'application/octet-stream',
			'content-disposition': (response.headers.get('content-disposition') ?? 'attachment').replace(
				/^attachment/,
				inline ? 'inline' : 'attachment'
			)
		}
	});
}
