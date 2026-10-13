import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// Screenplay layers of the acceptance tests (tests/e2e/CLAUDE.md): Playwright is driven only in screenplay/ and targets/
const playwrightActions =
	'click|dblclick|tap|fill|clear|type|press|pressSequentially|selectOption|check|uncheck|setChecked|setInputFiles|hover|focus|blur|dragTo|scrollIntoViewIfNeeded|dispatchEvent|selectText|goto|reload|goBack|goForward|route|unroute|waitFor|waitForEvent|waitForURL|waitForRequest|waitForResponse|waitForLoadState|waitForTimeout|waitForSelector|waitForFunction|evaluate|evaluateAll|evaluateHandle|setViewportSize|emulateMedia|addCookies|clearCookies|setExtraHTTPHeaders|addInitScript|exposeFunction|screenshot';
const playwrightReads =
	'getByRole|getByText|getByTestId|getByLabel|getByPlaceholder|getByAltText|getByTitle|locator|frameLocator|textContent|innerText|innerHTML|inputValue|getAttribute|isVisible|isHidden|isChecked|isEnabled|isDisabled|isEditable|allTextContents|allInnerTexts|boundingBox|ariaSnapshot|locate|context|keyboard|mouse';
const call = (methods, message) => ({
	selector: `CallExpression[callee.property.name=/^(${methods})$/]`,
	message
});
const outsideScreenplay = 'Playwright is driven only in tests/e2e/screenplay/ and tests/e2e/targets/ (tests/e2e/CLAUDE.md)';
const noPlaywright = [
	call(playwrightActions, `${outsideScreenplay}: use an Interaction from screenplay/interactions.ts`),
	call(playwrightReads, `${outsideScreenplay}: use a Target from targets/ and a web question from screenplay/questions.ts`),
	{ selector: "MemberExpression[property.name='page']", message: `${outsideScreenplay}: no page outside the abilities` },
	{ selector: "CallExpression[callee.name='expect'], MemberExpression[object.name='expect']", message: 'Assert with actor.sees(question) (tests/e2e/CLAUDE.md)' }
];
const playwrightImports = [
	{ group: ['@playwright/test', 'playwright', 'playwright-core', '@axe-core/*'], message: outsideScreenplay }
];
// Ratchet while the acceptance tests move to Screenplay: files listed here still break the layer rules; the list only shrinks
const notYetScreenplay = [
	'tests/e2e/questions/apartment-detail.ts',
	'tests/e2e/questions/apartment-form.ts',
	'tests/e2e/questions/apartments.ts',
	'tests/e2e/questions/app-frame.ts',
	'tests/e2e/questions/authentication.ts',
	'tests/e2e/questions/building-detail.ts',
	'tests/e2e/questions/buildings.ts',
	'tests/e2e/questions/categories.ts',
	'tests/e2e/questions/coming-soon.ts',
	'tests/e2e/questions/contact.ts',
	'tests/e2e/questions/dashboard.ts',
	'tests/e2e/questions/distribution-keys.ts',
	'tests/e2e/questions/documents.ts',
	'tests/e2e/questions/heating-profiles.ts',
	'tests/e2e/questions/invoice-detail.ts',
	'tests/e2e/questions/invoice-form.ts',
	'tests/e2e/questions/invoices.ts',
	'tests/e2e/questions/language.ts',
	'tests/e2e/questions/settings.ts',
	'tests/e2e/questions/statement-generate.ts',
	'tests/e2e/questions/tenant-detail.ts',
	'tests/e2e/questions/tenant-form.ts',
	'tests/e2e/questions/tenants.ts',
	'tests/e2e/steps/accessibility.steps.ts',
	'tests/e2e/steps/apartment-detail.steps.ts',
	'tests/e2e/steps/apartment-form.steps.ts',
	'tests/e2e/steps/apartment-list.steps.ts',
	'tests/e2e/steps/app-frame.steps.ts',
	'tests/e2e/steps/authentication.steps.ts',
	'tests/e2e/steps/building-detail.steps.ts',
	'tests/e2e/steps/building-form.steps.ts',
	'tests/e2e/steps/buildings.steps.ts',
	'tests/e2e/steps/categories.steps.ts',
	'tests/e2e/steps/coming-soon.steps.ts',
	'tests/e2e/steps/contact.steps.ts',
	'tests/e2e/steps/dashboard.steps.ts',
	'tests/e2e/steps/distribution-keys.steps.ts',
	'tests/e2e/steps/documents.steps.ts',
	'tests/e2e/steps/heating-profiles.steps.ts',
	'tests/e2e/steps/invoice-detail.steps.ts',
	'tests/e2e/steps/invoice-form.steps.ts',
	'tests/e2e/steps/invoices.steps.ts',
	'tests/e2e/steps/language.steps.ts',
	'tests/e2e/steps/settings.steps.ts',
	'tests/e2e/steps/statement-generate.steps.ts',
	'tests/e2e/steps/tenant-detail.steps.ts',
	'tests/e2e/steps/tenant-form.steps.ts',
	'tests/e2e/steps/tenants.steps.ts',
	'tests/e2e/tasks/apartment-detail.ts',
	'tests/e2e/tasks/apartment-form.ts',
	'tests/e2e/tasks/apartments.ts',
	'tests/e2e/tasks/app-frame.ts',
	'tests/e2e/tasks/authentication.ts',
	'tests/e2e/tasks/building-detail.ts',
	'tests/e2e/tasks/building-form.ts',
	'tests/e2e/tasks/buildings.ts',
	'tests/e2e/tasks/categories.ts',
	'tests/e2e/tasks/dashboard.ts',
	'tests/e2e/tasks/distribution-keys.ts',
	'tests/e2e/tasks/documents.ts',
	'tests/e2e/tasks/heating-profiles.ts',
	'tests/e2e/tasks/invoice-detail.ts',
	'tests/e2e/tasks/invoice-form.ts',
	'tests/e2e/tasks/invoices.ts',
	'tests/e2e/tasks/language.ts',
	'tests/e2e/tasks/settings.ts',
	'tests/e2e/tasks/statement-generate.ts',
	'tests/e2e/tasks/tenant-detail.ts',
	'tests/e2e/tasks/tenant-form.ts',
	'tests/e2e/tasks/tenants.ts',
];

export default [
	js.configs.recommended,
	{
		// plain Node scripts: no TypeScript, so no-undef stays on
		files: ['tools/**/*.mjs'],
		languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...globals.node } }
	},
	{
		files: ['**/*.ts', '**/*.js'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module'
			},
			globals: {
				...globals.node,
				...globals.browser,
				fetch: 'readonly',
				Request: 'readonly',
				Response: 'readonly',
				Headers: 'readonly',
				URL: 'readonly',
				URLSearchParams: 'readonly',
				TextEncoder: 'readonly',
				TextDecoder: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': ts
		},
		rules: {
			...ts.configs.recommended.rules,
			// Disable no-undef for TypeScript files - TypeScript handles this better
			'no-undef': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			},
			globals: {
				...globals.browser
			}
		},
		plugins: {
			svelte,
			'@typescript-eslint': ts
		},
		rules: {
			...svelte.configs.recommended.rules,
			// Ignore underscore-prefixed variables (used for callback type parameters)
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			]
		}
	},
	{
		files: ['tests/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.node,
				describe: 'readonly',
				it: 'readonly',
				expect: 'readonly',
				vi: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly'
			}
		}
	},
	{
		// Steps speak the domain: tasks, questions and fixtures only; assertions through actor.sees(question)
		files: ['tests/e2e/steps/**/*.ts'],
		ignores: notYetScreenplay,
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						...playwrightImports,
						{ group: ['**/screenplay/**', '**/targets/**', '**/interactions/**'], message: 'Steps use tasks/ and questions/ only (tests/e2e/CLAUDE.md)' }
					]
				}
			],
			'no-restricted-syntax': [
				'error',
				...noPlaywright,
				{
					selector: 'ObjectPattern > Property[key.name=/^(page|context|browser|request)$/]',
					message: 'Steps reach the system through an actor, not through Playwright fixtures (tests/e2e/CLAUDE.md)'
				}
			]
		}
	},
	{
		// Tasks compose interactions, questions compose web questions; neither drives Playwright itself
		files: ['tests/e2e/tasks/**/*.ts', 'tests/e2e/questions/**/*.ts'],
		ignores: notYetScreenplay,
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						...playwrightImports,
						{ group: ['playwright-bdd', '**/steps/**', '**/interactions/**'], message: 'Tasks and questions sit below the steps (tests/e2e/CLAUDE.md)' }
					]
				}
			],
			'no-restricted-syntax': ['error', ...noPlaywright]
		}
	},
	{
		// Targets only describe where something is on the page
		files: ['tests/e2e/targets/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{ patterns: [{ group: ['**/tasks/**', '**/questions/**', '**/steps/**', '**/fixtures/**'], message: 'Targets depend on nothing but screenplay/target.ts' }] }
			],
			'no-restricted-syntax': [
				'error',
				call(playwrightActions, 'Targets only locate; actions are Interactions in screenplay/interactions.ts')
			]
		}
	},
	prettier,
	{
		ignores: [
			'.svelte-kit/**',
			'.features-gen/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'backend/node_modules/**',
			'backend/dist/**',
			'coverage/**',
			'backend/coverage/**',
			// Generated by Paraglide from messages/*.json (bun run i18n)
			'src/lib/paraglide/**',
			// Claude Code worktrees: other checkouts of this repo
			'.claude/worktrees/**'
		]
	}
];
