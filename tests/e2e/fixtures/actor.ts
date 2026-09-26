import type { Page } from '@playwright/test';

export class Actor {
	constructor(
		public readonly name: string,
		public readonly page: Page
	) {}

	async perform(task: (actor: Actor) => Promise<void>): Promise<void> {
		await task(this);
	}
}
