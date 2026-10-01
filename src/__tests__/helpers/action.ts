type Action = (event: never) => Promise<unknown>;
type Call = { method?: string; url: string; body?: unknown };

// Runs a SvelteKit form action against a fake backend that answers every call with `status`
export function runAction(action: unknown, id: string, status = 200) {
	const calls: Call[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
		return new Response(status === 204 ? null : '{}', { status });
	};
	return { calls, result: (action as Action)({ params: { id }, fetch } as never) };
}
