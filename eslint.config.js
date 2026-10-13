import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// Screenplay layers of the acceptance tests (tests/e2e/CLAUDE.md): Playwright is driven only in screenplay/ and targets/
const playwrightActions =
	'click|dblclick|tap|fill|clear|type|press|pressSequentially|selectOption|check|uncheck|setChecked|setInputFiles|hover|focus|blur|dragTo|scrollIntoViewIfNeeded|dispatchEvent|selectText|goto|reload|goBack|goForward|route|unroute|waitFor|waitForEvent|waitForURL|waitForRequest|waitForResponse|waitForLoadState|waitForTimeout|waitForSelector|waitForFunction|evaluate|evaluateAll|evaluateHandle|setViewportSize|emulateMedia|addCookies|clearCookies|setExtraHTTPHeaders|addInitScript|exposeFunction|screenshot|setContent|dragAndDrop|waitForNavigation|\\$|\\$\\$|\\$eval|\\$\\$eval|path|suggestedFilename|saveAs|createReadStream|pdf|content';
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
	{
		selector: 'MemberExpression[property.name=/^(page|context|mouse|keyboard|request)$/]',
		message: `${outsideScreenplay}: no page outside the abilities`
	},
	{
		selector: 'ObjectPattern > Property[key.name=/^(page|context|browser|request|mouse|keyboard)$/]',
		message: `${outsideScreenplay}: reach the system through an actor, not through the page or Playwright fixtures`
	},
	{ selector: 'CallExpression > MemberExpression.callee[computed=true]', message: `${outsideScreenplay}: no calls by computed name` },
	{
		selector: "MemberExpression[computed=true][property.type=/^(Literal|TemplateLiteral)$/]:not([property.raw=/^[0-9]+$/])",
		message: `${outsideScreenplay}: no access by computed name`
	},
	{ selector: "ImportExpression, CallExpression[callee.name='require']", message: `${outsideScreenplay}: static imports only` },
	{ selector: 'TSImportType', message: outsideScreenplay },
	{ selector: "CallExpression[callee.name='expect'], MemberExpression[object.name='expect']", message: 'Assert with actor.sees(question) (tests/e2e/CLAUDE.md)' },
	{
		selector: "MemberExpression[property.name='expect'], ObjectPattern > Property[key.name='expect']",
		message: 'Assert with actor.sees(question) (tests/e2e/CLAUDE.md)'
	},
	{
		selector: 'ExportNamedDeclaration:not([declaration]), ExportAllDeclaration',
		message: 'No re-exports: each layer exports only what it defines (tests/e2e/CLAUDE.md)'
	},
	{
		selector:
			"CallExpression[callee.name=/^(setTimeout|setInterval)$/], MemberExpression[property.name=/^(setTimeout|setInterval)$/]:not([object.name='$testInfo']), MemberExpression[object.name='scheduler']",
		message: 'No waiting by the clock: actor.sees retries until the expectation holds (tests/e2e/CLAUDE.md)'
	},
	{
		selector: "CallExpression[callee.property.name='info'], MemberExpression[property.name='project']",
		message: 'No look at the test run: tasks and questions choose UI or API by the ability (tests/e2e/CLAUDE.md)'
	}
];
// The backend only through the ability CallTheApi; questions keep fetch for the mail catcher (H-19)
const noFetch = {
	selector: "CallExpression[callee.name='fetch'], MemberExpression[property.name='fetch']",
	message: 'The backend only through the ability CallTheApi (tests/e2e/CLAUDE.md)'
};
const playwrightImports = [
	{ group: ['@playwright/test', 'playwright', 'playwright-core', '@axe-core/*'], message: outsideScreenplay },
	{ group: ['timers', 'timers/*', 'node:timers', 'node:timers/*'], message: 'No waiting by the clock: actor.sees retries (tests/e2e/CLAUDE.md)' },
	{
		group: ['**/screenplay/abilities*', '**/screenplay/**/abilities*'],
		importNames: ['BrowseTheWeb'],
		message: `${outsideScreenplay}: the page stays in the abilities`
	}
];
// Nothing from outside tests/e2e but the backend's PDF reader (questions/download.ts)
const insideE2e = {
	regex: '^\\.\\./\\.\\./(?!\\.\\./backend/src/__tests__/helpers/pdf-text$)',
	message: 'The layers import nothing from outside tests/e2e (tests/e2e/CLAUDE.md)'
};
// Tasks and questions sit below the steps
const belowSteps = [
	insideE2e,
	...playwrightImports,
	{ group: ['playwright-bdd', '**/steps/**'], message: 'Tasks and questions sit below the steps (tests/e2e/CLAUDE.md)' }
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
		// No exceptions: comments cannot switch the layer rules off
		files: ['tests/e2e/**/*.ts'],
		linterOptions: { noInlineConfig: true }
	},
	{
		// Any other file in tests/e2e (a helper folder, a file at the top) is held to the same limits as the layers;
		// the layer blocks below replace these rules with their own
		files: ['tests/e2e/**/*.ts'],
		ignores: ['tests/e2e/screenplay/**', 'tests/e2e/targets/**'],
		rules: {
			'no-restricted-imports': ['error', { patterns: [...playwrightImports, insideE2e] }],
			'no-restricted-syntax': ['error', ...noPlaywright, noFetch]
		}
	},
	{
		files: ['tests/e2e/screenplay/target.ts'],
		rules: {
			'no-restricted-imports': ['error', { patterns: [{ group: ['./*', '../*'], message: 'target.ts depends on Playwright only' }] }]
		}
	},
	{
		// Interactions act on targets; they never look elements up in the page themselves
		files: ['tests/e2e/screenplay/interactions.ts'],
		rules: {
			'no-restricted-properties': [
				'error',
				...['querySelector', 'querySelectorAll', 'getElementById', 'getElementsByClassName', 'getElementsByTagName'].map(
					(property) => ({ property, message: 'Interactions act on targets (tests/e2e/CLAUDE.md)' })
				)
			]
		}
	},
	{
		// The core drives Playwright but depends on no layer above it; where things are, only target.ts describes
		files: ['tests/e2e/screenplay/**/*.ts'],
		ignores: ['tests/e2e/screenplay/target.ts'],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector: 'CallExpression[callee.property.name=/^(getBy[A-Za-z]+|locator|frameLocator|\\$|\\$\\$|\\$eval|\\$\\$eval)$/]',
					message: 'The core finds elements only through targets: describe the place in screenplay/target.ts or targets/ (tests/e2e/CLAUDE.md)'
				},
				{
					// the page itself is used for the page as a whole; elements only through targets
					selector:
						"CallExpression[callee.object.callee.name='pageOf']:not([callee.property.name=/^(context|emulateMedia|evaluate|goto|reload|route|unroute|setExtraHTTPHeaders|setViewportSize|waitForEvent|waitForRequest|waitForResponse|waitForURL|title|url)$/]), CallExpression[callee.object.name='page']:not([callee.property.name=/^(context|emulateMedia|evaluate|goto|reload|route|unroute|setExtraHTTPHeaders|setViewportSize|waitForEvent|waitForRequest|waitForResponse|waitForURL|title|url)$/])",
					message: 'The core uses the page only as a whole (navigation, viewport, evaluate …); elements through targets (tests/e2e/CLAUDE.md)'
				},
				{
					selector:
						"CallExpression[callee.object.property.name='page']:not([callee.property.name=/^(context|emulateMedia|evaluate|goto|reload|route|unroute|setExtraHTTPHeaders|setViewportSize|waitForEvent|waitForRequest|waitForResponse|waitForURL|title|url)$/]), MemberExpression[property.name=/^(mouse|keyboard|touchscreen)$/]",
					message: 'The core uses the page only as a whole; elements through targets (tests/e2e/CLAUDE.md)'
				},
				{
					selector: 'ExportNamedDeclaration:not([declaration]), ExportAllDeclaration',
					message: 'No re-exports: the core exports only what it defines (tests/e2e/CLAUDE.md)'
				},
				{
					selector:
						"CallExpression[callee.name=/^(setTimeout|setInterval)$/], MemberExpression[property.name=/^(setTimeout|setInterval)$/], CallExpression[callee.property.name='info'], MemberExpression[property.name='project']",
					message: 'The core neither waits by the clock nor looks at the test run (tests/e2e/CLAUDE.md)'
				},
				{
					selector: "CallExpression[callee.property.name=/^(querySelector|querySelectorAll|closest)$/][arguments.0.value=/data-testid/]",
					message: 'The core finds elements only through targets (tests/e2e/CLAUDE.md)'
				}
			],
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['**/steps/**', '**/tasks/**', '**/questions/**', '**/fixtures/**', '**/targets/**'],
							message: 'The Screenplay core depends on no layer above it (tests/e2e/CLAUDE.md)'
						},
						insideE2e,
						playwrightImports[1]
					]
				}
			]
		}
	},
	{
		// Steps speak the domain: tasks, questions and fixtures only; assertions through actor.sees(question)
		files: ['tests/e2e/steps/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						...playwrightImports,
						{ group: ['**/screenplay/**', '**/targets/**'], message: 'Steps use tasks/ and questions/ only (tests/e2e/CLAUDE.md)' },
						{
							regex: '^(?!playwright-bdd$|\\.\\./(tasks|questions|fixtures)/[\\w.-]+$)',
							message: 'Steps import only playwright-bdd, tasks/, questions/ and fixtures/ (tests/e2e/CLAUDE.md)'
						},
						{ group: ['vitest', 'node:assert', 'assert', 'chai'], message: 'Assert with actor.sees(question) (tests/e2e/CLAUDE.md)' }
					]
				}
			],
			'no-restricted-syntax': [
				'error',
				...noPlaywright,
				noFetch,
				{
					selector:
						"WhileStatement, DoWhileStatement, TryStatement, CallExpression[callee.property.name=/^(answer|then|catch|finally)$/]",
					message: 'Steps do not poll or check answers themselves: actor.sees retries until the expectation holds (tests/e2e/CLAUDE.md)'
				},
				{
					selector: "ObjectPattern > Property[key.name='driver'], MemberExpression[property.name='driver']",
					message: 'Steps do not choose between UI and API: tasks and questions choose by the ability (tests/e2e/CLAUDE.md)'
				},
				{
					selector: 'MemberExpression[property.name=/^(backend|expect)$/], ObjectPattern > Property[key.name=/^(backend|expect)$/]',
					message: 'Steps reach the system through tasks and assert with actor.sees(question) (tests/e2e/CLAUDE.md)'
				},
				{ selector: 'ThrowStatement', message: 'Assert with actor.sees(question), not with a check of its own (tests/e2e/CLAUDE.md)' },
				{
					selector:
						"CallExpression[callee.name=/^(setTimeout|setInterval)$/], MemberExpression[property.name=/^(setTimeout|setInterval)$/]:not([object.name='$testInfo']), MemberExpression[object.name='scheduler']",
					message: 'Steps do not wait by the clock: actor.sees retries until the expectation holds (tests/e2e/CLAUDE.md)'
				},
				{
					selector: "MemberExpression[object.name='$testInfo']:not([property.name='setTimeout']), CallExpression[callee.property.name=/^(can|abilityTo|whoCan)$/]",
					message: 'Steps do not look at the test run (project, title …): tasks and questions choose by the ability (tests/e2e/CLAUDE.md)'
				}
			]
		}
	},
	{
		// Tasks compose interactions, questions compose web questions; neither drives Playwright itself
		files: ['tests/e2e/tasks/**/*.ts'],
		rules: {
			'no-restricted-imports': ['error', { patterns: belowSteps }],
			'no-restricted-syntax': [
				'error',
				...noPlaywright,
				noFetch
			]
		}
	},
	{
		// Questions only ask: no interactions, no tasks performed
		files: ['tests/e2e/questions/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						...belowSteps,
						{ group: ['**/screenplay/interactions*'], message: 'Questions only ask; actions belong in tasks (tests/e2e/CLAUDE.md)' }
					]
				}
			],
			'no-restricted-syntax': [
				'error',
				...noPlaywright,
				{
					selector: "CallExpression[callee.property.name='attemptsTo'], CallExpression[arguments.0.name='actor']:not([callee.type='MemberExpression'])",
					message: 'Questions only ask; actions belong in tasks (tests/e2e/CLAUDE.md)'
				},
				{
					selector:
						"CallExpression[callee.property.name='sees'], WhileStatement, DoWhileStatement, ForStatement, ForOfStatement, ForInStatement, MemberExpression[property.name=/^(post|put|patch|remove|delete)$/], MemberExpression[object.name='scheduler']",
					message: 'Questions answer at once; sees() in the step retries them (tests/e2e/CLAUDE.md)'
				},
				{
					selector: "CallExpression[callee.name=/^(setTimeout|setInterval)$/], MemberExpression[property.name=/^(setTimeout|setInterval)$/]",
					message: 'Questions answer at once; sees() retries them (tests/e2e/CLAUDE.md)'
				}
			]
		}
	},
	{
		// Fixtures wire actors, test data and sessions; they take Playwright fixtures as parameters but drive nothing
		files: ['tests/e2e/fixtures/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{ ...playwrightImports[0], allowTypeImports: true }, // fixtures create the abilities
						insideE2e,
						{ group: ['**/targets/**'], message: 'Fixtures wire actors; targets belong to interactions and questions (tests/e2e/CLAUDE.md)' },
						{ group: ['**/tasks/**', '**/questions/**'], message: 'Fixtures wire actors; steps perform tasks and ask questions (tests/e2e/CLAUDE.md)' }
					]
				}
			],
			'no-restricted-syntax': [
				'error',
				...noPlaywright.filter(({ selector }) => !/ObjectPattern|TSImportType/.test(selector)),
				noFetch,
				{
					selector:
						"ImportDeclaration[source.value=/screenplay\\/interactions$/] > :matches(ImportSpecifier:not([imported.name='Cookies']), ImportNamespaceSpecifier), :matches(ExportNamedDeclaration, ExportAllDeclaration)[source.value=/screenplay\\/interactions$/]",
					message: 'Fixtures hand no interactions to steps; only the session cookies are set here (tests/e2e/CLAUDE.md)'
				},
				{
					selector: 'MemberExpression[object.name=/^(page|context|browser|request)$/]',
					message: `${outsideScreenplay}: fixtures hand Playwright fixtures on (to an ability), they do not use them`
				},
				{
					selector: 'ObjectPattern > Property[key.name=/^(page|context|browser|request)$/][value.type="Identifier"]:not([value.name=/^(page|context|browser|request)$/])',
					message: `${outsideScreenplay}: keep the names of Playwright fixtures`
				}
			]
		}
	},
	{
		// Targets only describe where something is on the page
		files: ['tests/e2e/targets/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['**/tasks/**', '**/questions/**', '**/steps/**', '**/fixtures/**', '**/screenplay/*', '!**/screenplay/target'],
							message: 'Targets depend on nothing but screenplay/target.ts'
						},
						insideE2e,
						playwrightImports[1]
					]
				}
			],
			'no-restricted-syntax': [
				'error',
				call(playwrightActions, 'Targets only locate; actions are Interactions in screenplay/interactions.ts'),
				call(
					'textContent|innerText|innerHTML|inputValue|getAttribute|isVisible|isHidden|isChecked|isEnabled|isDisabled|isEditable|allTextContents|allInnerTexts|boundingBox|ariaSnapshot|count|all|url|title|context',
					'Targets only locate; reading is a web question in screenplay/questions.ts'
				),
				...noPlaywright.slice(2).filter(({ selector }) => !/property.name=|ObjectPattern/.test(selector)),
				{
					selector: 'MemberExpression[object.name="page"]:not([property.name=/^(getBy[A-Za-z]+|locator|frameLocator)$/])',
					message: 'Targets only locate: page.getBy… or page.locator'
				},
				noFetch,
				{
					selector: "CallExpression[callee.name=/^(setTimeout|setInterval)$/], CallExpression[callee.property.name='info']",
					message: 'Targets only locate (tests/e2e/CLAUDE.md)'
				}
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
