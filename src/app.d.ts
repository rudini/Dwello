// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// The signed-in user, from the session JWT (hooks.server.ts)
			user?: {
				sub: string;
				email: string;
				name: string;
				provider: string;
				picture?: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	/** The app version, baked in by vite.config.ts from `git describe --tags`; null without a tag */
	const __APP_VERSION__: string | null;
}

export {};
