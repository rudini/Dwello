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
		token: string
	) {
		this.headers = { Authorization: `Bearer ${token}` };
	}

	get(path: string) {
		return this.request.get(`${BACKEND_API}/${path}`, { headers: this.headers }).then(body);
	}

	post(path: string, data: object) {
		return this.request.post(`${BACKEND_API}/${path}`, { data, headers: this.headers }).then(body);
	}

	put(path: string, data: object) {
		return this.request.put(`${BACKEND_API}/${path}`, { data, headers: this.headers }).then(body);
	}

	/** Removes a record; a record that is already gone is no error */
	remove(path: string) {
		return this.request.delete(`${BACKEND_API}/${path}`, { headers: this.headers });
	}
}

/** One activity or question with an implementation per protocol driver; the actor's ability picks it */
export const throughUiOrApi = <T extends Activity | Question<unknown>>(ui: T, api: T): T => {
	const pick = (actor: Actor) => (actor.can(CallTheApi) ? api : ui);
	if (typeof ui === 'function') return ((actor: Actor) => (pick(actor) as Activity)(actor)) as T;
	return { answeredBy: (actor: Actor) => actor.answer(pick(actor) as Question<unknown>), toString: () => String(ui) } as T;
};
