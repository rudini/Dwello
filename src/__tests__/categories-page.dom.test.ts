import { describe, it, expect, vi, beforeEach } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { get } from 'svelte/store';

// enhance as SvelteKit wires it: the test plays the server's answer to the last submit
const server = vi.hoisted(() => ({
	submit: null as null | ((input: unknown) => unknown),
	form: null as HTMLFormElement | null
}));
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit?: (input: unknown) => unknown) => {
		if (submit) Object.assign(server, { submit, form });
		return { destroy() {} };
	}
}));
async function answer(result: { type: string }) {
	const after = server.submit!({ formData: new FormData(server.form!) }) as (
		input: unknown
	) => Promise<void>;
	await after({ update: async () => {}, result });
	await settle();
}

import CategoriesPage from '../routes/config/categories/+page.svelte';
import NewCategoryPage from '../routes/config/categories/new/+page.svelte';
import EditCategoryPage from '../routes/config/categories/[id]/edit/+page.svelte';
import { toasts } from '$lib/stores';
import { allByTestId, byTestId, click, fireEvent, settle, show } from './helpers/dom';
import { reactiveProps } from './helpers/reactive-props.svelte';
import { focusFirstError } from '$lib/ui/focus-error';
import { flushSync } from 'svelte';

const category = (
	id: string,
	name: string,
	isAllowedUtilityCost: boolean,
	usageCount = 0,
	more = {}
) => ({
	id,
	name,
	description: '',
	isAllowedUtilityCost,
	usageCount,
	predefined: false,
	...more
});
const categories = [
	category('c1', 'Heizung', true, 3),
	category('c2', 'Reparaturen', false),
	category('c3', 'Lift', true, 1)
];
const names = () => allByTestId('category-name').map((cell) => cell.textContent);
const text = () => document.body.textContent!.replace(/\s+/g, ' ');
const toastTexts = () => get(toasts).map((toast) => toast.message);

beforeEach(() => toasts.set([]));

describe('Kategorien', () => {
	it('filtert nach umlagefähigen und nicht umlagefähigen Kategorien', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);
		expect(names()).toEqual(['Heizung', 'Reparaturen', 'Lift']);

		click('category-filter-allowed');
		expect(names()).toEqual(['Heizung', 'Lift']);
		expect(byTestId('category-filter-allowed')!.getAttribute('aria-pressed')).toBe('true');

		click('category-filter-disallowed');
		expect(names()).toEqual(['Reparaturen']);
		expect(byTestId('category-filter-disallowed')!.textContent).toContain('(1)');
	});

	it('öffnet eine Kategorie über ihren Namen und sagt, ob sie umlagefähig ist', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		const [heating, repairs] = allByTestId('category-row');
		expect(heating.querySelector('a')!.textContent!.trim()).toBe('Heizung');
		expect(heating.querySelector('a')!.getAttribute('href')).toBe('/config/categories/c1/edit');
		expect(allByTestId('category-allowed').map((badge) => badge.textContent!.trim())).toEqual([
			'Umlagefähig',
			'Nicht umlagefähig',
			'Umlagefähig'
		]);
		expect(repairs.textContent).toContain('0 Rechnungen');
	});

	it('zählt die Rechnungen in Einzahl und Mehrzahl', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		expect(allByTestId('category-usage').map((usage) => usage.textContent!.trim())).toEqual([
			'3 Rechnungen',
			'0 Rechnungen',
			'1 Rechnung'
		]);
	});

	// The descriptions of the predefined categories are English
	it('zeigt nur die Beschreibungen eigener Kategorien', () => {
		show(CategoriesPage, {
			data: {
				categories: [
					category('c1', 'Heizung', true, 0, {
						predefined: true,
						description: 'Costs for heating the building'
					}),
					category('c4', 'Treppenhausreinigung', true, 0, { description: 'Reinigung im Haus' })
				]
			},
			form: null
		} as never);

		expect(text()).not.toContain('Costs for heating the building');
		expect(text()).toContain('Reinigung im Haus');
	});

	it('hebt den gewählten Filter zurückhaltend hervor, nicht wie eine Hauptaktion', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);
		const active = byTestId('category-filter-all')!;

		expect(active.className).not.toMatch(/(^| )bg-accent( |$)/);
		expect(active.className).toMatch(/(^| )bg-accent-soft( |$)/);
	});

	it('erklärt, was eine Kategorie bestimmt', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		expect(text()).toContain('Nur Kosten aus umlagefähigen Kategorien');
	});

	it('lässt Kategorien mit Rechnungen nicht löschen', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		const [used, unused] = allByTestId('category-delete-button') as HTMLButtonElement[];
		expect(used.disabled).toBe(true);
		expect(unused.disabled).toBe(false);
		expect(unused.getAttribute('aria-label')).toBe('Kategorie «Reparaturen» löschen');
	});

	it('fragt vor dem Löschen nach und zeigt den Fehler des Backends', () => {
		show(CategoriesPage, {
			data: { categories },
			form: { error: 'Kategorie konnte nicht gelöscht werden' }
		} as never);

		click(allByTestId('category-delete-button')[1]);
		expect(text()).toContain('Kategorie «Reparaturen» löschen?');
		expect(text()).toContain('Kategorie konnte nicht gelöscht werden');
	});

	it('bestätigt das Löschen mit dem Namen der Kategorie', async () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		click(allByTestId('category-delete-button')[1]);
		click('category-delete-confirm');
		await answer({ type: 'redirect' });

		expect(toastTexts()).toEqual(['Kategorie «Reparaturen» gelöscht']);
	});
});

describe('Kategorie erfassen', () => {
	it('bestätigt das Speichern mit dem Namen der Kategorie', async () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');

		await answer({ type: 'redirect' });

		expect(toastTexts()).toEqual(['Kategorie «Gartenpflege» gespeichert']);
	});

	// #678 (Persona Marco): wie die Liste nennt die Bestätigung die Kategorie in der Sprache der Oberfläche
	it('bestätigt das Speichern mit dem Namen in der Sprache der Oberfläche', async () => {
		overwriteGetLocale(() => 'en');
		try {
			show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
			fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');
			fireEvent(document.querySelector<HTMLInputElement>('input[name="nameEN"]')!, 'input', 'Garden care');

			await answer({ type: 'redirect' });
		} finally {
			overwriteGetLocale(() => baseLocale);
		}

		expect(toastTexts()).toEqual(['Category «Garden care» saved']);
	});

	// #678: Enter speichert; die Formulare, die der Browser abschickt, zählt der Test wie enhance
	const submitters = () => {
		const sent: (HTMLElement | null)[] = [];
		server.form!.addEventListener('submit', (event) => {
			event.preventDefault();
			sent.push(event.submitter);
		});
		return sent;
	};
	const pressEnter = (field: HTMLElement, init: KeyboardEventInit = {}) =>
		field.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...init })
		);

	it('speichert mit Enter im Namen nicht ein zweites Mal, solange das Speichern läuft', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		const sent = submitters();
		server.submit!({
			formData: new FormData(server.form!),
			submitter: byTestId('category-submit')
		});
		flushSync();

		pressEnter(byTestId('category-name-input')!);
		pressEnter(byTestId('category-name-input')!);

		expect(sent).toEqual([]);
	});

	it('speichert mit Enter auf der Wahl der Umlagefähigkeit, ohne die KI zu fragen', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		const sent = submitters();
		const option = document.querySelector<HTMLInputElement>(
			'[data-testid="category-allowance"] input'
		)!;

		const browserDefault = pressEnter(option);

		expect({ browserDefault, sent }).toEqual({ browserDefault: false, sent: [null] });
	});

	it('speichert nicht, wenn Enter eine Eingabe mit dem Eingabesystem abschliesst', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		const sent = submitters();

		pressEnter(byTestId('category-name-input')!, { isComposing: true });

		expect(sent).toEqual([]);
	});

	it('meldet, warum die Kategorie nicht gespeichert wurde', () => {
		show(NewCategoryPage, {
			data: { kiEnabled: true },
			form: { errors: { form: 'Eine Kategorie mit dem Namen "Lift" existiert bereits.' } }
		} as never);

		expect(byTestId('form-error')!.textContent).toContain(
			'Eine Kategorie mit dem Namen "Lift" existiert bereits.'
		);
	});
});

describe('Umlagefähigkeit einer neuen Kategorie', () => {
	const choice = (label: string) =>
		[...document.querySelectorAll<HTMLInputElement>('[data-testid="category-allowance"] input')].find(
			(input) => input.closest('label')!.textContent!.trim().startsWith(label)
		)!;

	it('wählt nichts vor und bietet die Prüfung durch die KI an', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);

		expect(choice('Umlagefähig').checked).toBe(false);
		expect(choice('Nicht umlagefähig').checked).toBe(false);
		expect(byTestId('category-propose-button')!.textContent).toContain('Von der KI prüfen lassen');
	});

	// Art. 257a Absatz 2 OR: umlagefähig heisst noch nicht, dass der Mieter sie schuldet
	it('erklärt, wann der Mieter umlagefähige Kosten bezahlt', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);

		// Wie der Vertragshinweis der Liste, OR ausgeschrieben (#292, Fachreview M-4); #1028, Fachreview 678 V-3: die
		// Angabe bricht nicht um, auch nicht nach dem Strich
		const help = byTestId('category-allowance-help')!.textContent!;
		expect(help).toContain('(Art.\u00a0257a–\u2060257b Obligationenrecht,\u00a0OR)');
		expect(help).toContain('wenn der Mietvertrag jede dieser Kostenarten einzeln nennt (Art.\u00a0257a Absatz\u00a02\u00a0OR)');
		expect(help).toContain('Gebäudeversicherung');
		// Wasser und Abwasser: Merkblatt des Mieterverbands, «Unzulässig» (C-8); Fachreview 678 M-1: nach dem Wert
		expect(help).toContain('Grundgebühren nicht, die sich nach dem Wert richten, z. B. nach dem Versicherungswert des Gebäudes');
		expect(help).toContain('auch nicht die Gebühr für Regenwasser');
	});

	// #678 (Marco P-3), #1028: eine kurze Einleitung, dann jede Regel als eigener Absatz, zuletzt die Rolle der KI
	it('erklärt die Umlagefähigkeit in kurzen Absätzen und zuletzt die Rolle der KI', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);

		const paragraphs = [...byTestId('category-allowance-help')!.querySelectorAll('p')].map((p) => p.textContent!.trim());
		expect(paragraphs).toHaveLength(5);
		expect(paragraphs[0]).toMatch(/^Umlagefähig sind Kosten aus dem Gebrauch des Gebäudes/);
		expect(paragraphs[1]).toBe('Bei Heizung und Lift zählen nur Betrieb und Wartung der Anlage.');
		expect(paragraphs[4]).toMatch(/^Mit «Von der KI prüfen lassen» prüft die KI Name und Beschreibung/);
	});

	// #678 (Persona Helga H-2): «z. B.» bricht nicht zwischen «z.» und «B.» um, in der Einleitung und bei den Regeln
	it.each([
		['de', 'z. B.'],
		['fr', 'p. ex.'],
		['it', 'p. es.']
	] as const)('bricht in der Sprache %s «%s» in der Hilfe nicht um', (locale, abbreviation) => {
		overwriteGetLocale(() => locale);
		try {
			show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
			const help = byTestId('category-allowance-help')!.textContent!;

			expect(help.split(abbreviation.replace(' ', ' ')).length - 1).toBe(2);
			expect(help).not.toContain(abbreviation);
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	});

	// #678: ohne KI und beim Bearbeiten gibt es «Von der KI prüfen lassen» nicht, also auch keinen Satz dazu
	it('erwähnt die KI ohne KI nicht', () => {
		show(NewCategoryPage, { data: { kiEnabled: false }, form: null } as never);

		expect(byTestId('category-allowance-help')!.querySelectorAll('p')).toHaveLength(4);
		expect(byTestId('category-allowance-help')!.textContent).not.toContain('KI');
	});

	// Fachreview #69 (V-8, V-11): wozu die Übersetzungen dienen, was die Reihenfolge ordnet
	it('erklärt die Übersetzungen und die Reihenfolge', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);

		expect(text()).toContain(
			'Ihn zeigt die Nebenkostenabrechnung eines Mieters mit dieser Sprache, ebenso Dwello in dieser Sprache. Fehlt er, steht der deutsche Name.'
		);
		expect(text()).toContain(
			'Position in den Auswahllisten und in der Liste der Kategorien: kleinere Zahlen stehen weiter oben. Ohne Zahl steht die Kategorie ganz oben, wie mit der Zahl 0.'
		);
		// ein Screenreader liest die Hilfe mit den Feldern der Übersetzungen
		const fieldset = [...document.querySelectorAll('fieldset')].find(
			(f) => f.querySelector('legend')?.textContent === 'Übersetzungen'
		);
		expect(
			document.getElementById(fieldset!.getAttribute('aria-describedby') ?? '')?.textContent
		).toContain('Der Name der Kategorie auf Französisch, Italienisch und Englisch.');
	});

	// Die KI hat den Namen geprüft, der im Feld steht: so kommt die Antwort nach «Von der KI prüfen lassen»
	function checked(name: string, proposal: object) {
		const props = reactiveProps({ data: { kiEnabled: true }, form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', name);
		props.form = { proposal: { name, description: '', ...proposal } };
		flushSync();
		return props;
	}

	it('übernimmt den Vorschlag der KI und zeigt ihre Begründung', () => {
		const reasoning = 'Erneuerung des Gebäudes (Art. 256 Abs. 1 OR).';
		checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning });

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-proposal')!.textContent).toContain('Vorschlag der KI: Nicht umlagefähig');
		expect(byTestId('category-proposal')!.textContent).toContain(reasoning);
	});

	// Die Wahl der KI ist ein Vorschlag: das Feld sagt, dass sie gesetzt ist und wer entscheidet (Personas #176)
	it('sagt, dass die Wahl der KI vorgewählt ist und der Liegenschaftsverwalter entscheidet', () => {
		checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung' });

		expect(byTestId('category-proposal')!.textContent).toContain('Dwello hat diese Wahl vorgewählt. Sie entscheiden');
	});

	// Helga P-8 (Runde 2): nach dem Umwählen ist es die eigene Wahl, nicht mehr die der KI
	it('sagt nach dem Umwählen nicht mehr, Dwello habe die Wahl vorgewählt', () => {
		checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung' });
		click(choice('Umlagefähig'));

		expect(byTestId('category-proposal')!.textContent).not.toContain('Dwello hat diese Wahl vorgewählt');
		expect(byTestId('category-proposal')!.textContent).toContain('Ihre Wahl bleibt');
	});

	// G-1: eine Ablehnung beim Speichern (z. B. Name vergeben) nimmt Vorschlag und Wahl der KI nicht weg
	it('behält Vorschlag und Wahl der KI, wenn das Speichern abgelehnt wird', () => {
		const props = checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung' });
		props.form = { errors: { name: 'Eine Kategorie mit dem Namen "Dachsanierung" existiert bereits.' } };
		flushSync();

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-proposal')!.textContent).toContain('Erneuerung');
	});

	// G-4: wählt der Liegenschaftsverwalter selbst wieder denselben Wert, ist es seine Wahl
	it('lässt eine selbst wieder gewählte Wahl beim Umbenennen stehen', () => {
		checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung' });
		click(choice('Umlagefähig'));
		click(choice('Nicht umlagefähig'));
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Dachsanierung Ost');
		flushSync();

		expect(choice('Nicht umlagefähig').checked).toBe(true);
	});

	// G-5: die KI hat Name und Beschreibung geprüft
	it('nimmt den Vorschlag zurück, sobald die Beschreibung ändert', () => {
		checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung', description: '' });
		fireEvent(document.querySelector<HTMLInputElement>('#description')!, 'input', 'Nur Dachrinne reinigen');
		flushSync();

		expect(byTestId('category-proposal')).toBeNull();
		expect(choice('Nicht umlagefähig').checked).toBe(false);
	});

	// Sven P-2: eine eigene Wahl überschreibt die KI nicht
	it('lässt eine eigene Wahl vor der Prüfung stehen und sagt das', () => {
		const props = reactiveProps({ data: { kiEnabled: true }, form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');
		click(choice('Nicht umlagefähig'));
		props.form = { proposal: { name: 'Gartenpflege', description: '', isAllowedUtilityCost: true, reasoning: 'Betrieb' } };
		flushSync();

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-proposal')!.textContent).toContain('Ihre Wahl bleibt');
	});

	// #678 (Helga P-9): Dwello sagt, ob die KI es gleich sieht wie die eigene Wahl
	it('sagt, dass die KI es gleich sieht wie die eigene Wahl', () => {
		const props = reactiveProps({ data: { kiEnabled: true }, form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');
		click(choice('Umlagefähig'));
		props.form = {
			proposal: {
				name: 'Gartenpflege',
				description: '',
				isAllowedUtilityCost: true,
				reasoning: 'Betrieb'
			}
		};
		flushSync();

		expect(byTestId('category-proposal')!.textContent).toContain(
			'Die KI sieht es wie Sie. Ihre Wahl bleibt: «Umlagefähig».'
		);
	});

	// #678 (Helga P-8): nach dem Umwählen sieht die KI es anders als der Liegenschaftsverwalter
	it('sagt nach dem Umwählen, dass die KI es anders sieht', () => {
		checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung' });
		click(choice('Umlagefähig'));

		expect(byTestId('category-proposal')!.textContent).toContain(
			'Die KI sieht es anders als Sie. Ihre Wahl bleibt: «Umlagefähig».'
		);
	});

	// #678 (Code-Review G-8): eine Antwort für einen inzwischen geänderten Namen fällt nicht stumm weg
	it('sagt, dass sich der Name seit der Prüfung geändert hat, wenn die Antwort danach kommt', () => {
		const props = reactiveProps({ data: { kiEnabled: true }, form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenunterhalt');
		props.form = {
			proposal: {
				name: 'Gartenpflege',
				description: '',
				isAllowedUtilityCost: true,
				reasoning: 'Betrieb'
			}
		};
		flushSync();

		const region = byTestId('category-proposal-region')!.textContent!.replace(/\s+/g, ' ');
		expect(region).toContain(
			'Name oder Beschreibung haben sich seit der Prüfung geändert. Wählen Sie selbst oder lassen Sie die KI nochmals prüfen.'
		);
		expect(region).not.toContain('zurückgenommen');
	});

	// #678 (Sven P-11): nach dem Umbenennen bleibt die eigene Wahl, und Dwello sagt es
	it('sagt nach dem Umbenennen, dass die eigene Wahl bleibt', () => {
		const props = reactiveProps({ data: { kiEnabled: true }, form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');
		click(choice('Nicht umlagefähig'));
		props.form = {
			proposal: {
				name: 'Gartenpflege',
				description: '',
				isAllowedUtilityCost: true,
				reasoning: 'Betrieb'
			}
		};
		flushSync();
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenunterhalt');
		flushSync();

		expect(byTestId('category-proposal-region')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Name oder Beschreibung haben sich seit der Prüfung geändert. Ihre Wahl bleibt. Lassen Sie die KI bei Bedarf nochmals prüfen.'
		);
		expect(choice('Nicht umlagefähig').checked).toBe(true);
	});

	// Helga P-1: ein Vorschlag gilt nur für den geprüften Namen
	it('nimmt Vorschlag und Wahl der KI zurück, sobald der Name ändert', () => {
		checked('Treppenhausreinigung', { isAllowedUtilityCost: true, reasoning: 'Betrieb' });
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Dachsanierung');
		flushSync();

		expect(byTestId('category-proposal')).toBeNull();
		expect(choice('Umlagefähig').checked).toBe(false);
	});

	it('lässt ohne Antwort der KI nichts vorgewählt und sagt, dass Sie selbst wählen', () => {
		const error = 'Die KI ist nicht erreichbar oder ist sich nicht sicher. Wählen Sie selbst, ob die Kosten umlagefähig sind.';
		checked('Bewachung', { error });

		expect(choice('Umlagefähig').checked).toBe(false);
		expect(choice('Nicht umlagefähig').checked).toBe(false);
		expect(byTestId('category-proposal')!.textContent).toContain(error);
	});

	// Eine Wahl der KI gilt nur für den Namen, den sie geprüft hat (#176, E-1)
	it('nimmt die Wahl der KI zurück, wenn eine spätere Prüfung keine sichere Antwort bringt', () => {
		const props = checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung' });
		props.form = { proposal: { name: 'Dachsanierung', description: '', error: 'Die KI ist sich nicht sicher.' } };
		flushSync();

		expect(choice('Nicht umlagefähig').checked).toBe(false);
	});

	it('lässt eine eigene Wahl stehen, wenn eine spätere Prüfung keine sichere Antwort bringt', () => {
		const props = checked('Dachsanierung', { isAllowedUtilityCost: false, reasoning: 'Erneuerung' });
		click(choice('Umlagefähig'));
		props.form = { proposal: { name: 'Dachsanierung', description: '', error: 'Die KI ist sich nicht sicher.' } };
		flushSync();

		expect(choice('Umlagefähig').checked).toBe(true);
	});

	// #678 (Helga P-10): ist schon gewählt, sagt Dwello nicht «Wählen Sie selbst», sondern dass die Wahl bleibt
	it('sagt bei einer unsicheren KI, dass die eigene Wahl bleibt', () => {
		const props = reactiveProps({ data: { kiEnabled: true }, form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Bewachung');
		click(choice('Nicht umlagefähig'));
		props.form = { proposal: { name: 'Bewachung', description: '', error: 'Die KI ist sich nicht sicher.', unsure: true } };
		flushSync();

		expect(byTestId('category-proposal')!.textContent).toContain(
			'Die KI ist sich nicht sicher. Ihre Wahl bleibt: «Nicht umlagefähig». Prüfen Sie sie mit den Regeln oben. Im Zweifel: nicht umlagefähig.'
		);
	});

	// Screenreader hören den Vorschlag, ohne den Fokus zu verlieren (E-3)
	it('sagt den Vorschlag der KI an', () => {
		checked('Gartenpflege', { isAllowedUtilityCost: true, reasoning: 'Betrieb' });

		expect(byTestId('category-proposal')!.closest('[role="status"]')).not.toBeNull();
	});

	// Die KI braucht bis zu 30 s: der Knopf zeigt, dass sie prüft, und lässt sich nicht nochmals drücken (E-4)
	it('zeigt während der Prüfung, dass die KI arbeitet', async () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		const button = byTestId<HTMLButtonElement>('category-propose-button')!;
		const after = server.submit!({ formData: new FormData(server.form!), submitter: button }) as (
			input: unknown
		) => Promise<void>;
		flushSync();

		expect(button.textContent).toContain('Bitte warten');
		// Sven P-1: die Ansage sagt, dass die KI prüft, solange der Knopf gesperrt ist
		expect(byTestId('category-proposal-region')!.textContent).toContain('Die KI prüft die Kategorie');
		await after({ update: async () => {}, result: { type: 'success' } });
		await settle();
		expect(button.textContent).toContain('Von der KI prüfen lassen');
	});

	// Der Bereich für die Ansage steht schon vor dem ersten Vorschlag, sonst sagt ihn ein Screenreader nicht an (E-13)
	it('hält den Bereich für den Vorschlag der KI schon vor der Prüfung bereit', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);

		expect(document.querySelector('[role="status"][data-testid="category-proposal-region"]')).not.toBeNull();
	});

	// Ein Speichern während der Prüfung bleibt als laufend markiert, wenn die Prüfung zuerst antwortet (E-12)
	it('zeigt das Speichern weiter als laufend, wenn die Prüfung vorher fertig wird', async () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		const check = server.submit!({
			formData: new FormData(server.form!),
			submitter: byTestId('category-propose-button')
		}) as (input: unknown) => Promise<void>;
		server.submit!({ formData: new FormData(server.form!), submitter: byTestId('category-submit') });
		await check({ update: async () => {}, result: { type: 'success' } });
		await settle();

		expect(byTestId('category-submit')!.textContent).toContain('Wird gespeichert');
	});

	// Nach der Prüfung bleibt der Fokus beim Knopf, statt an den Seitenanfang zu fallen (E-15)
	it('setzt den Fokus nach der Prüfung wieder auf den Knopf', async () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		const button = byTestId<HTMLButtonElement>('category-propose-button')!;
		const after = server.submit!({ formData: new FormData(server.form!), submitter: button }) as (
			input: unknown
		) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'success' } });
		await settle();

		expect(document.activeElement).toBe(button);
	});

	// Sven P-4: wer während der Prüfung weitergegangen ist, bleibt dort
	it('lässt den Fokus, wo er während der Prüfung hingegangen ist', async () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);
		const after = server.submit!({
			formData: new FormData(server.form!),
			submitter: byTestId('category-propose-button')
		}) as (input: unknown) => Promise<void>;
		const sortOrder = document.querySelector<HTMLInputElement>('#sortOrder')!;
		sortOrder.focus();
		// SvelteKit's update can leave the focus on the page
		await after({ update: async () => sortOrder.blur(), result: { type: 'success' } });
		await settle();

		expect(document.activeElement).toBe(sortOrder);
	});

	// Sven P-6, P-9: die Fehlermeldung kommt zuerst und verschwindet mit der Wahl
	it('liest die fehlende Wahl zuerst vor und nimmt sie mit der Wahl zurück', () => {
		show(NewCategoryPage, {
			data: { kiEnabled: true },
			form: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		} as never);
		expect(choice('Umlagefähig').getAttribute('aria-describedby')!.split(' ')[0]).toBe('isAllowedUtilityCost-error');

		click(choice('Umlagefähig'));
		expect(byTestId('category-allowance')!.textContent).not.toContain('Wählen Sie, ob die Kosten umlagefähig sind.');
	});

	it('meldet die fehlende Wahl an der Wahl', () => {
		show(NewCategoryPage, {
			data: { kiEnabled: true },
			form: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		} as never);

		expect(byTestId('category-allowance')!.textContent).toContain('Wählen Sie, ob die Kosten umlagefähig sind.');
	});

	// Nach der Ablehnung führt der Fokus zur Wahl, damit ein Screenreader die Meldung vorliest (E-2)
	it('setzt den Fokus nach der Ablehnung auf die Wahl', async () => {
		show(NewCategoryPage, {
			data: { kiEnabled: true },
			form: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		} as never);
		await focusFirstError(document.querySelector('form')!);

		expect(document.activeElement).toBe(choice('Umlagefähig'));
	});

	// #219: eine ausgeschaltete KI antwortet nie, also bietet die Seite sie nicht an
	it('bietet die Prüfung durch die KI nicht an, solange die KI ausgeschaltet ist', () => {
		show(NewCategoryPage, { data: { kiEnabled: false }, form: null } as never);

		expect(byTestId('category-allowance')).not.toBeNull();
		expect(byTestId('category-propose-button')).toBeNull();
	});

	it('zeigt beim Bearbeiten die gespeicherte Wahl, ohne die KI anzubieten', () => {
		show(EditCategoryPage, { data: { category: category('c2', 'Reparaturen', false) }, form: null } as never);

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-propose-button')).toBeNull();
	});
});

// Warum eine vordefinierte Kategorie umlagefähig ist oder nicht, mit festem, fachlich geprüftem Satz (#186)
describe('Grund der Umlagefähigkeit', () => {
	const fireExtinguisher = category('c6', 'Feuerlöscher-Wartung', false, 0, {
		key: 'Fire Extinguisher Maintenance',
		predefined: true
	});
	const lift = category('c3', 'Lift', true, 0, { key: 'Elevator', predefined: true });
	const reasons = () => allByTestId('category-reason').map((reason) => reason.textContent!.trim());

	it('nennt in der Liste den Grund jeder vordefinierten Kategorie', () => {
		show(CategoriesPage, { data: { categories: [fireExtinguisher, lift] }, form: null } as never);

		// «umstritten» mit dem Merkblatt als Quelle, der Wartungsanteil eines Vollservicevertrags (#292, Fachreview M-1, M-2)
		expect(reasons()).toEqual([
			'Ob die Wartung von Feuerlöschern mit dem Gebrauch zusammenhängt (Art. 257a Absatz 1 Obligationenrecht, OR), ist umstritten (Mieterinnen- und Mieterverband, Merkblatt «Zulässige und unzulässige Nebenkosten»). Nach dem Merkblatt gehört Brandschutz, der auch bei leerem Gebäude nötig ist, nicht zu den Nebenkosten. Dwello folgt dem Merkblatt: Die Wartung ist also nicht umlagefähig.',
			'Strom, Notruftelefon und Wartung des Lifts hängen mit dem Gebrauch zusammen (Art. 257a Absatz 1 Obligationenrecht, OR); Reparaturen und Ersatzteile trägt der Vermieter. Deckt der Vertrag mit der Liftfirma auch Reparaturen (Vollservicevertrag), ist nur sein Anteil für die Wartung umlagefähig: Erfassen Sie unter «Lift» nur diesen Anteil. Strom, Notruftelefon und Wartung sind also umlagefähig.'
		]);
	});

	// Each reason stands alone (also on an invoice): it ends with its conclusion and writes out the laws it cites
	// before their abbreviation (#292, Entscheid #221 A)
	const PREDEFINED = [
		['Heating', true],
		['Hot Water', true],
		['Cold Water', true],
		['Wastewater', true],
		['Electricity Common Areas', true],
		['Elevator', true],
		['Caretaker', true],
		['Garden Maintenance', true],
		['Snow Removal', true],
		['Waste Disposal', true],
		['TV/Cable', true],
		['Chimney Sweep', true],
		['Repairs', false],
		['Building Insurance', false],
		['Property Tax', false],
		['Mortgage Interest', false],
		['Administration', false],
		['Renovation', false],
		['Capital Improvements', false],
		['Pest Control', false],
		['Fire Extinguisher Maintenance', false]
	] as const;
	const allReasons = (locale: 'de' | 'fr' | 'it' | 'en') => {
		overwriteGetLocale(() => locale);
		try {
			show(CategoriesPage, {
				data: {
					categories: PREDEFINED.map(([key, allowed], i) => category(`p${i}`, key, allowed, 0, { key, predefined: true }))
				},
				form: null
			} as never);
			return reasons();
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	};

	// #687 (Helga P-7): plain words instead of «abgegolten», «gebrauchstauglich», «Verzinsung und Abschreibung»
	// (wording: docs/reviews/687-1-fach-review.md)
	it.each([
		['de', /abgegolten|gebrauchstauglich|Verzinsung|Abschreibung/],
		['fr', /couverte?s? par le loyer|état approprié|amortissement/],
		['it', /copert[aeio] dalla pigione|stato idoneo|ammortamento/],
		['en', /covered by the rent|fit for use|depreciation/]
	] as const)('nennt die Gründe auf %s ohne schwere Wörter', (locale, hard) => {
		const shown = allReasons(locale);

		expect(shown).toHaveLength(PREDEFINED.length);
		expect(shown.filter((reason) => hard.test(reason))).toEqual([]);
	});

	it('schliesst jeden Grund mit seiner Folgerung', () => {
		const shown = allReasons('de');

		expect(shown).toHaveLength(PREDEFINED.length);
		shown.forEach((reason, i) =>
			expect(reason).toMatch(PREDEFINED[i][1] ? /also umlagefähig\.$/ : /also nicht umlagefähig\.$/)
		);
	});

	// The first abbreviation in a reason is the one its spelled-out name introduces
	it.each([
		['de', 'Obligationenrecht, OR', 'Verordnung über die Miete, VMWG'],
		['fr', 'Code des obligations, CO', 'ordonnance sur le bail, OBLF'],
		['it', 'Codice delle obbligazioni, CO', 'ordinanza concernente la locazione, OLAL'],
		['en', 'Code of Obligations, CO', 'Tenancy Ordinance, VMWG']
	] as const)('schreibt auf %s Gesetz und Verordnung in jedem Grund aus', (locale, ...laws) => {
		for (const reason of allReasons(locale))
			for (const law of laws) {
				const short = law.split(', ')[1];
				if (reason.includes(short)) expect(reason.indexOf(short), reason).toBe(reason.indexOf(law) + law.length - short.length);
			}
	});

	// Sonst stünde neben «Umlagefähig» ein Satz, der das Gegenteil begründet (Fachreview H-4)
	it('nennt keinen festen Grund, wenn der Liegenschaftsverwalter die Umlagefähigkeit geändert hat', () => {
		show(CategoriesPage, { data: { categories: [{ ...fireExtinguisher, isAllowedUtilityCost: true }] }, form: null } as never);

		expect(reasons()).toEqual([]);
	});

	it('nennt bei eigenen Kategorien keinen Grund, auch mit dem Namen einer vordefinierten', () => {
		show(CategoriesPage, { data: { categories: [{ ...lift, predefined: false }] }, form: null } as never);

		expect(reasons()).toEqual([]);
	});

	// Art. 257a Abs. 2 OR, einmal für die ganze Liste (Fachreview H-14)
	it('sagt in der Liste, dass der Mieter nur bezahlt, was der Mietvertrag nennt', () => {
		show(CategoriesPage, { data: { categories: [lift] }, form: null } as never);

		expect(byTestId('category-contract-note')!.textContent).toContain(
			'Der Mieter bezahlt umlagefähige Kosten nur, wenn der Mietvertrag jede dieser Kostenarten einzeln nennt (Art. 257a Absatz 2 Obligationenrecht, OR).'
		);
	});

	// Die Wahl im Formular zählt, nicht der gespeicherte Wert (Code-Review M-1)
	it('nennt keinen festen Grund, sobald im Formular die andere Umlagefähigkeit gewählt ist', async () => {
		show(EditCategoryPage, { data: { category: fireExtinguisher }, form: null } as never);

		click(byTestId('category-allowance-true')!);
		await settle();

		expect(byTestId('category-reason')).toBeNull();
	});

	// Fachreview Runde 2 (H-25 bis H-27) und Dr. Weber P-7: die Vereinbarung verlangt Art. 257a Abs. 2 OR
	it.each([
		['de', 'Administration', false, 'wenn der Mietvertrag sie nennt (Art. 257a Absatz 2 Obligationenrecht, OR)'],
		['it', 'Pest Control', false, 'è controverso'],
		['it', 'Caretaker', true, 'piccoli lavori di conservazione'],
		['fr', 'Administration', false, 'si le contrat de bail les mentionne (art. 257a, al. 2, du Code des obligations, CO)'],
		['it', 'Administration', false, 'se il contratto di locazione le indica (art. 257a cpv. 2 del Codice delle obbligazioni, CO)'],
		['en', 'Administration', false, 'if the rental contract names it (Art. 257a para. 2 Code of Obligations, CO)']
	] as const)('nennt auf %s den Grund von %s im geprüften Wortlaut', (locale, key, allowed, wording) => {
		overwriteGetLocale(() => locale);
		try {
			show(CategoriesPage, {
				data: { categories: [category('c9', key, allowed, 0, { key, predefined: true })] },
				form: null
			} as never);

			expect(reasons()[0]).toContain(wording);
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	});

	// Wie die vordefinierte Kategorie heisst (Fachreview H-26)
	it.each([
		['fr', 'l’assurance du bâtiment et les impôts'],
		['it', 'assicurazione dell’immobile e imposte']
	] as const)('nennt im Hilfetext auf %s die Gebäudeversicherung mit dem Namen ihrer Kategorie', (locale, wording) => {
		overwriteGetLocale(() => locale);
		try {
			show(EditCategoryPage, { data: { category: lift }, form: null } as never);

			expect(text()).toContain(wording);
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	});

	it('nennt den Grund beim Bearbeiten einer vordefinierten Kategorie', () => {
		show(EditCategoryPage, { data: { category: fireExtinguisher }, form: null } as never);

		expect(byTestId('category-reason')!.textContent).toContain('Die Wartung ist also nicht umlagefähig.');
	});

	// Wartung zählt nicht allgemein; Kehricht wie Wasser und Abwasser (#186, Fachreview H-16)
	it('grenzt im Hilfetext Wartung ein und nennt Kehricht', () => {
		show(EditCategoryPage, { data: { category: lift }, form: null } as never);

		expect(text()).toContain('Bei Heizung und Lift zählen nur Betrieb und Wartung der Anlage.');
		// #678 (Fachreview M-1): nach einem Wert, nicht nur dem des Gebäudes
		expect(text()).toContain(
			'Bei Wasser, Abwasser und Kehricht zählen Grundgebühren nicht, die sich nach dem Wert richten, z. B. nach dem Versicherungswert des Gebäudes; beim Abwasser auch nicht die Gebühr für Regenwasser.'
		);
	});
});

describe('Kategorie bearbeiten', () => {
	// #672 (Helga P-3, P-5): what the description is for; the list shows it only for own categories
	const descriptionHelp = () => document.getElementById('description-help')?.textContent?.trim();

	it('sagt bei vordefinierten Kategorien, wofür die Beschreibung dient', () => {
		const heating = category('c1', 'Heizung', true, 0, { predefined: true });
		show(EditCategoryPage, { data: { category: heating, kiEnabled: true }, form: null } as never);

		expect(descriptionHelp()).toBe(
			'Die Beschreibung sagt, welche Kosten zu dieser Kategorie gehören. Die KI liest die Beschreibung, wenn sie für eine Rechnung eine Kategorie vorschlägt. Auf der Nebenkostenabrechnung steht sie nicht.'
		);
	});

	it('sagt bei eigenen Kategorien, wofür die Beschreibung dient und dass die Liste sie zeigt', () => {
		const own = category('c4', 'Treppenhausreinigung', true);
		show(EditCategoryPage, { data: { category: own, kiEnabled: true }, form: null } as never);

		expect(descriptionHelp()).toBe(
			'Beschreiben Sie, welche Kosten zu dieser Kategorie gehören. Die KI liest die Beschreibung, wenn sie für eine Rechnung eine Kategorie vorschlägt. Die Liste der Kategorien zeigt die Beschreibung unter dem Namen. Auf der Nebenkostenabrechnung steht sie nicht.'
		);
		expect(byTestId('category-propose-button')).toBeNull();
	});

	it('nennt die KI bei der Beschreibung nicht, wenn keine KI gewählt ist', () => {
		const own = category('c4', 'Treppenhausreinigung', true);
		show(EditCategoryPage, { data: { category: own, kiEnabled: false }, form: null } as never);

		expect(descriptionHelp()).toBe(
			'Beschreiben Sie, welche Kosten zu dieser Kategorie gehören. Die Liste der Kategorien zeigt die Beschreibung unter dem Namen. Auf der Nebenkostenabrechnung steht sie nicht.'
		);
	});

	// code review 672 C-1: «Neue Kategorie» names the check «Von der KI prüfen lassen» only with a KI
	it('nennt bei einer neuen Kategorie die Prüfung durch die KI, wenn eine KI gewählt ist', () => {
		show(NewCategoryPage, { data: { kiEnabled: true }, form: null } as never);

		expect(descriptionHelp()).toBe(
			'Beschreiben Sie, welche Kosten zu dieser Kategorie gehören. Die KI liest die Beschreibung, wenn Sie «Von der KI prüfen lassen» wählen und wenn sie für eine Rechnung eine Kategorie vorschlägt. Die Liste der Kategorien zeigt die Beschreibung unter dem Namen. Auf der Nebenkostenabrechnung steht sie nicht.'
		);
	});

	it('nennt bei einer neuen Kategorie keine KI, wenn keine gewählt ist', () => {
		show(NewCategoryPage, { data: { kiEnabled: false }, form: null } as never);

		expect(descriptionHelp()).toBe(
			'Beschreiben Sie, welche Kosten zu dieser Kategorie gehören. Die Liste der Kategorien zeigt die Beschreibung unter dem Namen. Auf der Nebenkostenabrechnung steht sie nicht.'
		);
	});

	// Heizkosten folgen beim Mieterwechsel dem Heizprofil statt den Tagen; separates Warmwasser nicht
	it('erfasst, ob eine Kategorie Heizkosten sind, und erklärt die Folge', () => {
		const pellets = { ...category('c5', 'Pellets', true), isHeatingCost: true };
		show(EditCategoryPage, { data: { category: pellets }, form: null } as never);

		const box = byTestId<HTMLInputElement>('category-heating-checkbox')!;
		expect(box.checked).toBe(true);
		expect(box.name).toBe('isHeatingCost');
		expect(text()).toContain('Heizkosten nach dem Heizprofil verteilen');
		expect(text()).toContain('nach dem Heizprofil');
		expect(text()).toContain('Separat abgerechnetes Warmwasser wird das ganze Jahr etwa gleich verbraucht');
	});

	// #100: nur eine Kategorie für Brennstoff hat einen Tankbestand; Brennstoff gibt es nur bei Heizkosten
	it('zeigt die gespeicherte Wahl «Brennstoff» einer Heizkosten-Kategorie', () => {
		const heating = { ...category('c1', 'Heizung', true), isHeatingCost: true, isFuel: true };
		show(EditCategoryPage, { data: { category: heating }, form: null } as never);

		const box = byTestId<HTMLInputElement>('category-fuel-checkbox')!;
		expect(box.checked).toBe(true);
		expect(box.name).toBe('isFuel');
		expect(box.labels![0].textContent!.trim()).toBe('Brennstoff');
		// the predefined «Heizung» also holds servicing invoices: only a category for nothing else is no fuel (personas)
		expect(byTestId('category-fuel-checkbox-help')!.textContent).toContain(
			'Eine Kategorie nur für Service, Wartung oder den Kaminfeger ist kein Brennstoff.'
		);
	});

	it('fragt nach Brennstoff erst bei Heizkosten und wählt ihn bei einer neuen Kategorie nicht vor', () => {
		show(NewCategoryPage, { data: { kiEnabled: false }, form: null } as never);
		expect(byTestId('category-fuel-checkbox')).toBeNull();

		click('category-heating-checkbox');

		expect(byTestId<HTMLInputElement>('category-fuel-checkbox')!.checked).toBe(false);
	});
});
