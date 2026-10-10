/** URL of a list page filtered by the given values (empty ones left out), starting again at page 1 */
export function listSearchUrl(path: string, filters: Record<string, string>): string {
	const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
	params.set('page', '1');
	return `${path}?${params}`;
}

/** URL of another page of the current list, keeping its filters */
export function listPageUrl(url: URL, page: number): string {
	const params = new URLSearchParams(url.searchParams);
	params.set('page', String(page));
	return `${url.pathname}?${params}`;
}

type Navigation = { type: string; from: { url: URL } | null; to: { url: URL } | null };

/** The list was searched or filtered on its own page (a GET form, or a filter changing the URL) */
export function isListSearch({ type, from, to }: Navigation): boolean {
	if (!from || !to || from.url.pathname !== to.url.pathname) return false;
	return type === 'form' || (type === 'goto' && from.url.search !== to.url.search);
}
