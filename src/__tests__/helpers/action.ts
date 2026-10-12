type Action = (event: never) => Promise<unknown>;
type Call = { method?: string; url: string; body?: unknown };

// Runs a SvelteKit form action (optionally with submitted form fields) against a fake backend that answers every call with `status` and `answer`, PUT with `put` if given
export function runAction(
	action: unknown,
	id: string,
	status = 200,
	fields: Record<string, string> = {},
	answer: unknown = {},
	put?: { status: number; answer: unknown } // a different answer to PUT, e.g. a refusal
) {
	const form = new FormData();
	for (const [name, value] of Object.entries(fields)) form.append(name, value);
	const request = new Request('http://localhost:3000', { method: 'POST', body: form });
	const calls: Call[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
		if (put && init?.method === 'PUT')
			return new Response(JSON.stringify(put.answer), { status: put.status });
		return new Response(status === 204 ? null : JSON.stringify(answer), { status });
	};
	return { calls, result: (action as Action)({ params: { id }, fetch, request } as never) };
}
