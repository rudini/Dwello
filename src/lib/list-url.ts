const withParams = (path: string, params: URLSearchParams) =>
	params.size ? `${path}?${params}` : path;

/** URL of a list page filtered by the given values (empty ones left out), starting again at the first page */
export function listSearchUrl(path: string, filters: Record<string, string>): string {
	return withParams(
		path,
		new URLSearchParams(Object.entries(filters).filter(([, value]) => value))
	);
}

/** URL of another page of the current list, keeping its filters; the first page without «page» (#682) */
export function listPageUrl(url: URL, page: number): string {
	const params = new URLSearchParams(url.searchParams);
	if (page > 1) params.set('page', String(page));
	else params.delete('page');
	return withParams(url.pathname, params);
}

type Navigation = { type: string; from: { url: URL } | null; to: { url: URL } | null };

/**
 * The list moved on its own page: searched or filtered (a GET form, also with unchanged filters), or another page,
 * the reset link of an empty list, the browser's back and forward buttons (#681)
 */
export function isListNavigation({ type, from, to }: Navigation): boolean {
	if (!from || !to || from.url.pathname !== to.url.pathname) return false;
	return type === 'form' || from.url.search !== to.url.search;
}
