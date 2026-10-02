import type { Page } from '@playwright/test';

export class Actor {
	constructor(
		public readonly name: string,
		public readonly page: Page
	) {}

	// What a task noticed for a later question, e.g. a request the browser sent
	private readonly memory = new Map<string, unknown>();

	async perform(task: (actor: Actor) => Promise<void>): Promise<void> {
		await task(this);
	}

	remember(key: string, value: unknown) {
		this.memory.set(key, value);
	}

	recall<T>(key: string): T {
		return this.memory.get(key) as T;
	}
}
