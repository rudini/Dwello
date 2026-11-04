import { pdfRefusal } from './statement';

/** A file of the backend handed to the browser as it came: its kind and its name; `inline` shows it in the browser
 * (a Beleg to look at) instead of saving it. A refusal opens the app's error page with its code (#1093) */
export async function proxyFile(
	fetch: typeof globalThis.fetch,
	request: Request,
	url: string,
	kind: string,
	inline = false
) {
	const response = await fetch(url);
	if (!response.ok) return pdfRefusal(request, await response.json().catch(() => null));
	return new Response(response.body, {
		status: response.status,
		headers: {
			'content-type': response.headers.get('content-type') ?? kind,
			'content-disposition': (response.headers.get('content-disposition') ?? 'attachment').replace(
				/^attachment/,
				inline ? 'inline' : 'attachment'
			)
		}
	});
}
