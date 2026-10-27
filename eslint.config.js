import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// Screenplay layers of the acceptance tests (tests/e2e/CLAUDE.md): Playwright is driven only in screenplay/ and targets/
const playwrightActions =
	'click|dblclick|tap|fill|clear|type|press|pressSequentially|selectOption|check|uncheck|setChecked|setInputFiles|hover|focus|blur|dragTo|scrollIntoViewIfNeeded|dispatchEvent|selectText|goto|reload|goBack|goForward|route|unroute|waitFor|waitForEvent|waitForURL|waitForRequest|waitForResponse|waitForLoadState|waitForTimeout|waitForSelector|waitForFunction|evaluate|evaluateAll|evaluateHandle|setViewportSize|emulateMedia|addCookies|clearCookies|setExtraHTTPHeaders|addInitScript|exposeFunction|screenshot|setContent|dragAndDrop|waitForNavigation|\\$|\\$\\$|\\$eval|\\$\\$eval|path|suggestedFilename|saveAs|createReadStream|pdf|content|setDefaultTimeout|setDefaultNavigationTimeout';
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
	{
		selector:
			"Identifier[name='fetch']:not(MemberExpression > Identifier.property, ObjectExpression > Property > Identifier.key), MemberExpression[object.name=/^(globalThis|window|self)$/] > Identifier[name='fetch'].property",
		message: 'Reach the backend through CallTheApi and other services through screenplay/, not with fetch (tests/e2e/CLAUDE.md)'
	},
	{
		selector: "CallExpression[callee.property.name='can']",
		message: 'Pick the protocol driver with throughUiOrApi (screenplay/abilities.ts), not by asking the actor (tests/e2e/CLAUDE.md)'
	},
	{ selector: "CallExpression[callee.name='expect'], MemberExpression[object.name='expect']", message: 'Assert with actor.sees(question) (tests/e2e/CLAUDE.md)' }
];
// A backend response keyed by its path in a stand-in fetch: { '/api/v1/contracts/c1': … }, { [`${API}/api/v1/…`]: … } or backend['/api/v1/…'] = …
const apiPath = '/\\/api\\/v1\\//';
const apiKey = `:matches(${[
	`Property[key.value=${apiPath}]`,
	`Property[key.type='TemplateLiteral']:has(TemplateElement[value.raw=${apiPath}])`,
	`AssignmentExpression[left.property.value=${apiPath}]`
].join(', ')})`;
const playwrightImports = [
	{ group: ['@playwright/test', 'playwright', 'playwright-core', '@axe-core/*'], message: outsideScreenplay },
	{
		group: ['**/screenplay/abilities*', '**/screenplay/**/abilities*'],
		importNames: ['BrowseTheWeb'],
		message: `${outsideScreenplay}: the page stays in the abilities`
	}
];

export default [
	js.configs.recommended,
	{
		// plain Node scripts: no TypeScript, so no-undef stays on
		files: ['tools/**/*.mjs', '.claude/hooks/*.mjs'],
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
				...globals.browser,
				// Baked in by vite.config.ts (src/app.d.ts)
				__APP_VERSION__: 'readonly'
			}
		},
		plugins: {
			svelte,
			'@typescript-eslint': ts
		},
		rules: {
			...Object.assign({}, ...svelte.configs.recommended.map((c) => c.rules)),
			// no paths.base in svelte.config.js, so links need no resolve()
			'svelte/no-navigation-without-resolve': 'off',
			// a $bindable() default is read by the parent, which the core rule cannot see
			'no-useless-assignment': 'off',
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
		// Frontend tests take backend responses from tests/contracts, never invent them (CLAUDE.md, Gotchas: API contracts)
		files: ['src/**/__tests__/**/*.ts', 'tests/unit/**/*.ts'],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector: [`${apiKey} > ObjectExpression`, `${apiKey} > ArrayExpression > ObjectExpression`]
						.map((invented) => `${invented}:not(:has(> SpreadElement))`)
						.join(', '),
					message: 'Take the backend response from tests/contracts/*.json (CLAUDE.md, Gotchas: API contracts)'
				}
			]
		}
	},
	{
		// No exceptions: comments cannot switch the layer rules off
		files: ['tests/e2e/**/*.ts'],
		linterOptions: { noInlineConfig: true }
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
						{ group: ['vitest', 'node:assert', 'assert', 'chai'], message: 'Assert with actor.sees(question) (tests/e2e/CLAUDE.md)' }
					]
				}
			],
			'no-restricted-syntax': [
				'error',
				...noPlaywright,
				{
					selector: "ObjectPattern > Property[key.name='driver'], MemberExpression[property.name='driver']",
					message: 'Steps never branch on the driver: build the task or question with throughUiOrApi (tests/e2e/CLAUDE.md)'
				},
				{
					selector: "CallExpression[callee.property.name='answer']",
					message: 'Steps check with actor.sees(question), which retries and names the question (tests/e2e/CLAUDE.md)'
				}
			]
		}
	},
	{
		// Tasks compose interactions, questions compose web questions; neither drives Playwright itself
		files: ['tests/e2e/tasks/**/*.ts', 'tests/e2e/questions/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						...playwrightImports,
						{ group: ['playwright-bdd', '**/steps/**'], message: 'Tasks and questions sit below the steps (tests/e2e/CLAUDE.md)' }
					]
				}
			],
			'no-restricted-syntax': ['error', ...noPlaywright]
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
						{ group: ['**/targets/**', '**/tasks/**'], message: 'Preconditions go through the backend API, never through the UI (tests/e2e/CLAUDE.md)' },
						{
							group: ['**/screenplay/interactions*'],
							importNamePattern: '^(?!Cookies$)',
							message: 'Fixtures only set the session (Cookies); preconditions go through the backend API (tests/e2e/CLAUDE.md)'
						}
					]
				}
			],
			'no-restricted-syntax': [
				'error',
				...noPlaywright.filter(({ selector }) => !/ObjectPattern|TSImportType/.test(selector)),
				{
					selector: 'MemberExpression[object.name=/^(page|context|browser|request)$/]',
					message: `${outsideScreenplay}: fixtures hand Playwright fixtures on (to an ability), they do not use them`
				},
				{
					selector: 'ObjectPattern > Property[key.name=/^(page|context|browser|request)$/][value.type="Identifier"]:not([value.name=/^(page|context|browser|request)$/])',
					message: `${outsideScreenplay}: keep the names of Playwright fixtures`
				},
				// event handlers on a page: fixtures have no Click.on and the like that would share the name
				call('on|once|off|addListener|removeListener', `${outsideScreenplay}: no handlers on Playwright fixtures`)
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
						}
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
			// the HTML report of the acceptance tests, with the trace viewer's scripts of a failed run (O-47)
			'playwright-report/**',
			// Generated by Paraglide from messages/*.json (bun run i18n)
			'src/lib/paraglide/**',
			// Claude Code worktrees: other checkouts of this repo
			'.claude/worktrees/**'
		]
	}
];
