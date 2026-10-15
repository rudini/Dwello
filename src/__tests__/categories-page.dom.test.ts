import { describe, it, expect, vi, beforeEach } from 'vitest';
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
		show(NewCategoryPage, { form: null } as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');

		await answer({ type: 'redirect' });

		expect(toastTexts()).toEqual(['Kategorie «Gartenpflege» gespeichert']);
	});

	it('meldet, warum die Kategorie nicht gespeichert wurde', () => {
		show(NewCategoryPage, {
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
		show(NewCategoryPage, { form: null } as never);

		expect(choice('Umlagefähig').checked).toBe(false);
		expect(choice('Nicht umlagefähig').checked).toBe(false);
		expect(byTestId('category-propose-button')!.textContent).toContain('Von der KI prüfen lassen');
	});

	// Art. 257a Absatz 2 OR: umlagefähig heisst noch nicht, dass der Mieter sie schuldet
	it('erklärt, wann der Mieter umlagefähige Kosten bezahlt', () => {
		show(NewCategoryPage, { form: null } as never);

		expect(text()).toContain('wenn der Mietvertrag sie als Nebenkosten nennt (Art. 257a Absatz 2 OR)');
		expect(text()).toContain('Gebäudeversicherung');
		// Wasser und Abwasser: Merkblatt des Mieterverbands, «Unzulässig» (C-8)
		expect(text()).toContain('die Gebühr für Regenwasser nicht');
	});

	// Die KI hat den Namen geprüft, der im Feld steht: so kommt die Antwort nach «Von der KI prüfen lassen»
	function checked(name: string, proposal: object) {
		const props = reactiveProps({ form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', name);
		props.form = { proposal: { name, description: '', ...proposal } };
		flushSync();
		return props;
	}

	it('übernimmt den Vorschlag der KI und zeigt ihre Begründung', () => {
		const reasoning = 'Erneuerung des Gebäudes (Art. 257a Abs. 1 OR).';
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
		const props = reactiveProps({ form: null as unknown });
		show(NewCategoryPage, props as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');
		click(choice('Nicht umlagefähig'));
		props.form = { proposal: { name: 'Gartenpflege', description: '', isAllowedUtilityCost: true, reasoning: 'Betrieb' } };
		flushSync();

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-proposal')!.textContent).toContain('Ihre Wahl bleibt');
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

	// Screenreader hören den Vorschlag, ohne den Fokus zu verlieren (E-3)
	it('sagt den Vorschlag der KI an', () => {
		checked('Gartenpflege', { isAllowedUtilityCost: true, reasoning: 'Betrieb' });

		expect(byTestId('category-proposal')!.closest('[role="status"]')).not.toBeNull();
	});

	// Die KI braucht bis zu 30 s: der Knopf zeigt, dass sie prüft, und lässt sich nicht nochmals drücken (E-4)
	it('zeigt während der Prüfung, dass die KI arbeitet', async () => {
		show(NewCategoryPage, { form: null } as never);
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
		show(NewCategoryPage, { form: null } as never);

		expect(document.querySelector('[role="status"][data-testid="category-proposal-region"]')).not.toBeNull();
	});

	// Ein Speichern während der Prüfung bleibt als laufend markiert, wenn die Prüfung zuerst antwortet (E-12)
	it('zeigt das Speichern weiter als laufend, wenn die Prüfung vorher fertig wird', async () => {
		show(NewCategoryPage, { form: null } as never);
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
		show(NewCategoryPage, { form: null } as never);
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
		show(NewCategoryPage, { form: null } as never);
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
			form: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		} as never);
		expect(choice('Umlagefähig').getAttribute('aria-describedby')!.split(' ')[0]).toBe('isAllowedUtilityCost-error');

		click(choice('Umlagefähig'));
		expect(byTestId('category-allowance')!.textContent).not.toContain('Wählen Sie, ob die Kosten umlagefähig sind.');
	});

	it('meldet die fehlende Wahl an der Wahl', () => {
		show(NewCategoryPage, {
			form: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		} as never);

		expect(byTestId('category-allowance')!.textContent).toContain('Wählen Sie, ob die Kosten umlagefähig sind.');
	});

	// Nach der Ablehnung führt der Fokus zur Wahl, damit ein Screenreader die Meldung vorliest (E-2)
	it('setzt den Fokus nach der Ablehnung auf die Wahl', async () => {
		show(NewCategoryPage, {
			form: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		} as never);
		await focusFirstError(document.querySelector('form')!);

		expect(document.activeElement).toBe(choice('Umlagefähig'));
	});

	it('zeigt beim Bearbeiten die gespeicherte Wahl, ohne die KI anzubieten', () => {
		show(EditCategoryPage, { data: { category: category('c2', 'Reparaturen', false) }, form: null } as never);

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-propose-button')).toBeNull();
	});
});

describe('Kategorie bearbeiten', () => {
	// The list hides the (English) descriptions of the predefined categories
	it('sagt bei vordefinierten Kategorien, dass die Beschreibung nicht in der Liste steht', () => {
		const heating = category('c1', 'Heizung', true, 0, { predefined: true });
		show(EditCategoryPage, { data: { category: heating }, form: null } as never);

		expect(text()).toContain('Die Liste zeigt die Beschreibung vordefinierter Kategorien nicht.');
	});

	it('zeigt den Hinweis bei eigenen Kategorien nicht', () => {
		const own = category('c4', 'Treppenhausreinigung', true);
		show(EditCategoryPage, { data: { category: own }, form: null } as never);

		expect(text()).not.toContain('vordefinierter Kategorien');
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
});
