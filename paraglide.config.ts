import { compile, type CompilerOptions } from '@inlang/paraglide-js';

// The Paraglide options of the build (vite.config.ts), the unit tests (vitest.config.ts) and `bun run i18n`,
// which runs this file (#695)
export const paraglideOptions = {
	project: './project.inlang',
	outdir: './src/lib/paraglide',
	strategy: ['cookie', 'preferredLanguage', 'baseLocale'],
	// Physical message files, as in Paraglide 2: the E2E steps import BFF code under Node, which cannot load
	// the Vite plugin's default `virtual:` modules
	outputStructure: 'message-modules'
} satisfies CompilerOptions;

if (import.meta.main) await compile(paraglideOptions);
