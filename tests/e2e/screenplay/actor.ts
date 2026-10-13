import { expect } from '@playwright/test';
import { BrowseTheWeb } from './abilities';

/** A task or an interaction: something the actor does */
export type Activity = (actor: Actor) => Promise<unknown>;

/** Something the actor finds out: a value, never a locator; answering never waits for the page */
export type Question<T> = { answeredBy(actor: Actor): Promise<T>; toString(): string };

export const question = <T>(description: string, answer: (actor: Actor) => Promise<T> | T): Question<T> => ({
	answeredBy: async (actor) => answer(actor),
	toString: () => description
});

type AbilityType<A> = abstract new (...args: never[]) => A;

export class Actor {
	private readonly abilities: object[] = [];
	// What a task noticed for a later question, e.g. a request the browser sent
	private readonly memory = new Map<string, unknown>();

	constructor(public readonly name: string) {}

	whoCan(...abilities: object[]) {
		this.abilities.push(...abilities);
		return this;
	}

	can(ability: AbilityType<unknown>) {
		return this.abilities.some((candidate) => candidate instanceof ability);
	}

	abilityTo<A>(ability: AbilityType<A>): A {
		const found = this.abilities.find((candidate) => candidate instanceof ability);
		if (!found) throw new Error(`${this.name} cannot ${ability.name}`);
		return found as A;
	}

	async attemptsTo(...activities: Activity[]) {
		for (const activity of activities) await activity(this);
	}

	answer<T>(question: Question<T>) {
		return question.answeredBy(this);
	}

	/** An assertion on the answer, asked again until it holds or the expect timeout ends */
	sees<T>(question: Question<T>, options: { timeout?: number } = {}) {
		return expect.poll(() => this.answer(question), { message: `${this.name} sees ${question}`, ...options });
	}

	// Transitional: for steps, tasks and questions not yet moved to Screenplay; removed with the last one
	get page() {
		return this.abilityTo(BrowseTheWeb).page;
	}

	perform(task: Activity) {
		return task(this);
	}

	remember(key: string, value: unknown) {
		this.memory.set(key, value);
	}

	recall<T>(key: string): T {
		return this.memory.get(key) as T;
	}
}
