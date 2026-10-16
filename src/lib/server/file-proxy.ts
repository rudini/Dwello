/** A file of the backend handed to the browser as it came: its kind and its name; `inline` shows it in the browser
 * (a Beleg to look at) instead of saving it */
export async function proxyFile(fetch: typeof globalThis.fetch, url: string, kind: string, inline = false) {
	const response = await fetch(url);
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
