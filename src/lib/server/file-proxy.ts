/** A file of the backend handed to the browser as it came: its kind and the name it is saved under */
export async function proxyFile(fetch: typeof globalThis.fetch, url: string, kind: string) {
	const response = await fetch(url);
	return new Response(response.body, {
		status: response.status,
		headers: {
			'content-type': response.headers.get('content-type') ?? kind,
			'content-disposition': response.headers.get('content-disposition') ?? 'attachment'
		}
	});
}
