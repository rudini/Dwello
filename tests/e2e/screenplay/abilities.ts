import type { APIRequestContext, APIResponse, Page } from '@playwright/test';
import type { Activity, Actor, Question } from './actor';

/** The UI protocol driver: a browser page */
export class BrowseTheWeb {
	constructor(public readonly page: Page) {}
}

const BACKEND_API = 'http://localhost:3101/api/v1'; // E2E backend (playwright.config.ts)

async function body(response: APIResponse) {
	if (!response.ok()) throw new Error(`${response.url()} antwortet ${response.status()}: ${await response.text()}`);
	return response.json();
}

/** The API protocol driver: the backend API as the signed-in Liegenschaftsverwalter; the test data use it too */
export class CallTheApi {
	private readonly headers: { Authorization: string };

	constructor(
		private readonly request: APIRequestContext,
		token: string,
		private readonly api = BACKEND_API // the fresh installation's backend (fixtures/fresh-installation.ts) is another
	) {
		this.headers = { Authorization: `Bearer ${token}` };
	}

	get(path: string) {
		return this.request.get(`${this.api}/${path}`, { headers: this.headers }).then(body);
	}

	post(path: string, data: object) {
		return this.request.post(`${this.api}/${path}`, { data, headers: this.headers }).then(body);
	}

	put(path: string, data: object) {
		return this.request.put(`${this.api}/${path}`, { data, headers: this.headers }).then(body);
	}

	/** The backend API as `fetch` for the BFF's own server code (`src/lib/server`), which builds its URLs itself */
	readonly fetch: typeof globalThis.fetch = (input, init) =>
		globalThis.fetch(`${this.api}/${String(input).replace(/^.*?\/api\/v1\//, '')}`, {
			...init,
			headers: { ...(init?.headers as Record<string, string> | undefined), ...this.headers }
		});

	/** Removes a record; a record that is already gone is no error */
	remove(path: string) {
		return this.request.delete(`${this.api}/${path}`, { headers: this.headers });
	}
}

/** One activity or question with an implementation per protocol driver; the actor's ability picks it */
export const throughUiOrApi = <T extends Activity | Question<unknown>>(ui: T, api: T): T => {
	const pick = (actor: Actor) => (actor.can(CallTheApi) ? api : ui);
	if (typeof ui === 'function') return ((actor: Actor) => (pick(actor) as Activity)(actor)) as T;
	return { answeredBy: (actor: Actor) => actor.answer(pick(actor) as Question<unknown>), toString: () => String(ui) } as T;
};
