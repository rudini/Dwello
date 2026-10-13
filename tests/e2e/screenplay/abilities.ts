import type { Page } from '@playwright/test';
import type { TestData } from '../fixtures/backend';
import type { Activity, Actor, Question } from './actor';

/** The UI protocol driver: a browser page */
export class BrowseTheWeb {
	constructor(public readonly page: Page) {}
}

/** The API protocol driver: the backend API as the signed-in Liegenschaftsverwalter */
export class CallTheApi {
	constructor(public readonly backend: TestData['backend']) {}
}

/** One activity or question with an implementation per protocol driver; the actor's ability picks it */
export const throughUiOrApi = <T extends Activity | Question<unknown>>(ui: T, api: T): T => {
	const pick = (actor: Actor) => (actor.can(CallTheApi) ? api : ui);
	if (typeof ui === 'function') return ((actor: Actor) => (pick(actor) as Activity)(actor)) as T;
	return { answeredBy: (actor: Actor) => actor.answer(pick(actor) as Question<unknown>), toString: () => String(ui) } as T;
};
