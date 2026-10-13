import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: {
		subscribe: (run: (value: unknown) => void) => (
			run({ url: new URL('http://localhost/contracts/c1/edit') }),
			() => {}
		)
	}
}));

import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import EditPage from '../routes/contracts/[id]/edit/+page.svelte';
import { toasts } from '$lib/stores';
import { byTestId, click, fakeBff, fireEvent, settle, show, submit } from './helpers/dom';
import refused from '../../tests/contracts/contract-end-refused.json';

const contract = (endDate: string | null = null, terminated = false) => ({
	id: 'c1',
	tenantId: 't1',
	apartmentId: 'a1',
	startDate: '2024-04-01',
	endDate,
	terminated,
	baseRent: '950.00',
	additionalRent: null,
	monthlyAdvancePayment: '150.00'
});
const data = (endDate: string | null = null, terminated = false) => ({
	contract: contract(endDate, terminated),
	tenants: [{ id: 't1', name: 'Anna Keller' }],
	apartments: [
		{ id: 'a1', unit: '2.01', building: 'Ahornhof', status: 'Vermietet' },
		{ id: 'a2', unit: '2.02', building: 'Ahornhof', status: 'Leer' }
	]
});

let calls: ReturnType<typeof fakeBff>;

beforeEach(() => {
	vi.mocked(goto).mockClear();
	toasts.set([]);
	calls = fakeBff(({ method }) =>
		method === 'PUT'
			? [200, {}]
			: [200, { contracts: [{ id: 'c1', startDate: '2024-04-01', endDate: null }] }]
	);
});

async function open(endDate: string | null = null, terminated = false) {
	show(EditPage, { data: data(endDate, terminated) } as never);
	await settle();
}

const type = (testid: string, value: string) =>
	fireEvent(byTestId<HTMLInputElement>(testid)!, 'input', value);
const save = async () => {
	submit('submit-button');
	await settle();
};
const puts = () => calls.filter((c) => c.method === 'PUT');

describe('Mietvertrag bearbeiten', () => {
	it('erklärt die Beträge wie der Assistent', async () => {
		await open();
		const help = document.getElementById('baseRent-help')!.textContent!;
		expect(help).toContain('Monatliche Grundmiete ohne Nebenkosten.');
		expect(document.querySelector('label[for="advancePayment"]')!.textContent).toContain('Akonto');
		expect(document.querySelector('label[for="additionalRent"]')!.textContent).toContain(
			'Zusatzmiete'
		);
		expect(byTestId('contract-monthly-total')!.textContent).toContain('1’100.00');
	});

	it('wiederholt den Vertragsbeginn in Worten und fragt bei unverändertem Beginn nicht nach', async () => {
		await open();
		expect(byTestId('start-date-input-words')!.textContent).toContain('Montag, 1. April 2024');
		expect(byTestId('start-date-notice')!.textContent!.trim()).toBe('');
	});

	it('nimmt Beträge in Schweizer Schreibweise an und nennt den Mieter beim Speichern', async () => {
		await open();
		type('contract-base-rent-input', "1'450");
		await save();

		expect(puts()).toEqual([
			expect.objectContaining({
				path: '/contracts/c1',
				body: expect.objectContaining({ baseRent: '1450', monthlyAdvancePayment: '150.00' })
			})
		]);
		expect(get(toasts).map((t) => t.message)).toEqual(['Mietvertrag von Anna Keller gespeichert']);
		expect(goto).toHaveBeenCalledWith('/contracts/c1');
	});

	it('speichert ohne Nettomiete nicht und nennt den Fehler beim Feld', async () => {
		await open();
		type('contract-base-rent-input', '');
		await save();

		expect(puts()).toEqual([]);
		expect(byTestId('form-error')!.textContent).toContain('Nettomiete ist erforderlich');
		expect(document.activeElement).toBe(byTestId('contract-base-rent-input'));
	});

	it('weist bei einem laufenden Mietvertrag darauf hin, dass Änderungen sofort gelten', async () => {
		await open();
		expect(document.body.textContent).toContain('Laufender Mietvertrag');
	});

	it('kehrt beim Abbrechen zum Mietvertrag zurück', async () => {
		await open();
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/contracts/c1');
	});

	// Fehler behoben (#143): ohne ihre Mietverträge galt die Wohnung als frei, der Vertragsbeginn ohne Untergrenze
	it('zeigt eine Wohnung, deren Mietverträge nicht geladen werden konnten, nicht als frei', async () => {
		fakeBff(({ path }) =>
			path.endsWith('=a2')
				? [500, {}]
				: [200, { contracts: [{ id: 'c1', startDate: '2024-04-01', endDate: null }] }]
		);
		await open();
		expect(byTestId('apartment-contracts-unknown')).toBeNull();
		const select = byTestId<HTMLSelectElement>('apartment-select')!;
		select.value = 'a2';
		select.dispatchEvent(new Event('change', { bubbles: true }));
		await settle();
		const unknown =
			'Die Mietverträge der Wohnung konnten nicht geladen werden. Laden Sie die Seite neu und versuchen Sie es erneut.';
		expect(byTestId('apartment-contracts-unknown')!.textContent).toContain(unknown);
		expect(byTestId('start-contracts-unknown')!.textContent).toContain(unknown);
		expect(byTestId('availability-info')).toBeNull();
		const calendar =
			byTestId('start-date-input')!.parentElement!.querySelector('input[type="date"]');
		expect((calendar as HTMLInputElement).min).toBe('');
		// Review M3: both hints are read out when they appear
		expect(byTestId('apartment-contracts-unknown')!.closest('[role="status"]')).not.toBeNull();
		expect(byTestId('start-contracts-unknown')!.closest('[role="status"]')).not.toBeNull();
	});

	// Review M1: the availability of all apartments and the chosen one's contracts are two requests
	describe('wenn nur eine der beiden Anfragen zu den Mietverträgen scheitert', () => {
		const later = [{ id: 'c2', startDate: '2015-01-01', endDate: '2099-12-31' }]; // free from 2100
		async function chooseA2(failing: number) {
			let a2 = 0;
			fakeBff(({ path }) =>
				path.endsWith('=a2') && ++a2 === failing ? [500, {}] : [200, { contracts: later }]
			);
			await open();
			const select = byTestId<HTMLSelectElement>('apartment-select')!;
			select.value = 'a2';
			select.dispatchEvent(new Event('change', { bubbles: true }));
			await settle();
		}

		it('zeigt die Wohnung nicht als frei, wenn ihre Verfügbarkeit nicht geladen werden konnte', async () => {
			await chooseA2(1);
			expect(byTestId('apartment-contracts-unknown')).not.toBeNull();
			expect(byTestId('availability-info')).toBeNull();
		});

		it('nennt kein «frei ab», wenn die Mietverträge der gewählten Wohnung nicht geladen werden konnten', async () => {
			await chooseA2(2);
			expect(byTestId('apartment-contracts-unknown')).not.toBeNull();
			expect(byTestId('availability-info')).toBeNull();
		});
	});

	// wie beim Beenden: ein Tippfehler im Jahr soll den Mietvertrag nicht rückwirkend beenden
	describe('Vertragsende in der Vergangenheit', () => {
		async function endOn(day: string) {
			document.querySelector<HTMLInputElement>('input[value="limited"]')!.click();
			await settle();
			type('end-date-input', day);
			await settle();
		}

		// die Live-Region steht schon vor «Befristet», sonst sagt ein Screenreader das Kästchen nicht an
		it('sagt das Kästchen auch bei einem unbefristeten Mietvertrag an', async () => {
			await open();
			const notice = byTestId('contract-end-past-notice')!;
			expect(notice.getAttribute('aria-live')).toBe('polite');
			await endOn('31.03.2025');
			expect(notice.textContent).toContain('Bestätigen Sie das Vertragsende mit dem Kästchen.');
		});

		it('speichert ohne Bestätigung nicht und sagt am Kästchen, was zu tun ist', async () => {
			await open();
			await endOn('31.03.2025');
			await save();

			expect(puts()).toEqual([]);
			expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain(
				'Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.'
			);
			expect(document.activeElement).toBe(byTestId('contract-end-past-confirm'));
		});

		// der Fehler am Kästchen wird vor der Hilfe gelesen
		it('liest den Fehler am Kästchen vor seiner Hilfe', async () => {
			await open();
			await endOn('31.03.2025');
			await save();
			const described = byTestId('contract-end-past-confirm')!.getAttribute('aria-describedby')!;
			expect(described.split(' ')[0]).toBe('pastConfirmed-error');
		});

		it('nimmt die Meldung am Kästchen zurück, wenn das Datum ändert', async () => {
			await open();
			await endOn('31.03.2025');
			await save();
			type('end-date-input', '30.04.2025');
			await settle();
			expect(byTestId('contract-end-past-confirm')).not.toBeNull();
			expect(document.body.textContent).not.toContain('Bitte bestätigen Sie');
		});

		it('speichert ein bestätigtes Vertragsende in der Vergangenheit', async () => {
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();

			expect(puts()[0].body).toMatchObject({ endDate: '2025-03-31' });
		});

		// beim Ändern des Mietzinses eines beendeten Mietvertrags wird das Ende nicht nochmals bestätigt
		it('fragt bei einem unveränderten Vertragsende nicht nach', async () => {
			await open('2024-12-31');
			expect(byTestId('contract-end-past-confirm')).toBeNull();
			type('contract-base-rent-input', '980');
			await save();

			expect(puts()).toHaveLength(1);
		});

		it('sagt bei einem Entwurf, der schon Mietstage nach dem Tag enthält, was zu tun ist', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();

			expect(byTestId('form-error')!.textContent).toContain(
				'Die Nebenkostenabrechnung NK-2025-0003 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.'
			);
			expect(byTestId('refused-statement-link')!.getAttribute('href')).toBe('/statements/s1');
			// Haiku-Review R1: der Knopf nennt seine Folge auch unter «Bearbeiten»
			const described = byTestId('delete-draft-and-save')!.getAttribute('aria-describedby')!;
			expect(document.getElementById(described)!.textContent).toContain('wird gelöscht');
		});

		// Haiku-Review R5: ohne die Mietverträge der Wohnung ist eine Überschneidung nicht auszuschliessen
		it('löscht keinen Entwurf, wenn die Mietverträge der Wohnung nicht geladen werden konnten', async () => {
			calls = fakeBff(({ method }) => (method === 'PUT' ? [409, refused] : [500, {}]));
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			// Haiku-Review N2: die Meldung sagt, was fehlt und was zu tun ist
			expect(byTestId('form-error')!.textContent).toContain(
				'Die Mietverträge der Wohnung konnten nicht geladen werden. Laden Sie die Seite neu und versuchen Sie es erneut.'
			);
		});

		// Review K-2: das Angebot gehört zu den abgelehnten Werten
		it('nimmt das Angebot zurück, sobald ein Feld geändert ist', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			expect(byTestId('delete-draft-and-save')).not.toBeNull();
			type('contract-base-rent-input', '980');
			await settle();
			expect(byTestId('delete-draft-and-save')).toBeNull();
			// Haiku-Review P1: die Meldung verweist auf den Knopf unten, sie geht mit ihm
			expect(byTestId('form-error')).toBeNull();
		});

		// Review K-2: eine Überschneidung lehnte das Speichern nach dem Löschen ab; der Entwurf bleibt
		it('löscht keinen Entwurf, solange sich der Zeitraum überschneidet', async () => {
			calls = fakeBff(({ method }) => {
				if (method === 'PUT') return [409, refused];
				return [200, { contracts: [{ id: 'c2', startDate: '2025-02-01', endDate: null }] }];
			});
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			expect(byTestId('form-error')!.textContent).toContain('überschneidet');
		});

		// Haiku-Review: solange die Mietverträge der Wohnung laden, wird nichts gelöscht, und die Meldung sagt es
		it('löscht keinen Entwurf, solange die Mietverträge der Wohnung noch laden', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			const answer = globalThis.fetch;
			globalThis.fetch = ((url: string, init?: RequestInit) =>
				String(url).includes('/contracts?apartmentId=a1')
					? new Promise(() => {}) // still loading
					: answer(url, init)) as typeof fetch;
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			expect(byTestId('form-error')!.textContent).toContain(
				'Die Mietverträge der Wohnung werden noch geladen.'
			);
		});

		// Haiku-Review: beim Wechsel der Wohnung gilt die Überschneidung der vorigen nicht mehr
		it('nennt nach dem Wechsel der Wohnung keine Überschneidung der vorigen', async () => {
			calls = fakeBff(() => [
				200,
				{ contracts: [{ id: 'c2', startDate: '2025-02-01', endDate: null }] }
			]);
			const answer = globalThis.fetch;
			let switched = false; // once switched, the new apartment's contracts keep loading
			globalThis.fetch = ((url: string, init?: RequestInit) =>
				switched && String(url).includes('/contracts?apartmentId=a2')
					? new Promise(() => {})
					: answer(url, init)) as typeof fetch;
			await open();
			await endOn('31.03.2025');
			expect(byTestId('overlap-warning')).not.toBeNull();
			switched = true;
			const select = byTestId<HTMLSelectElement>('apartment-select')!;
			select.value = 'a2';
			select.dispatchEvent(new Event('change', { bubbles: true }));
			await settle();
			expect(byTestId('overlap-warning')).toBeNull();
		});

		// Haiku-Review: nur die letzte Antwort zählt; die Überschneidung der gewählten Wohnung erscheint mit ihr
		it('nimmt nur die letzte Antwort zu den Mietverträgen der Wohnung', async () => {
			calls = fakeBff(() => [200, { contracts: [] }]);
			const answer = globalThis.fetch;
			const pending: ((contracts: unknown[]) => void)[] = [];
			let held = false;
			globalThis.fetch = ((url: string, init?: RequestInit) =>
				held && String(url).includes('/contracts?apartmentId=')
					? new Promise((resolve) =>
							pending.push((contracts) => resolve(Response.json({ contracts })))
						)
					: answer(url, init)) as typeof fetch;
			await open();
			await endOn('31.03.2025');
			held = true;
			const select = byTestId<HTMLSelectElement>('apartment-select')!;
			const choose = async (id: string) => {
				select.value = id;
				select.dispatchEvent(new Event('change', { bubbles: true }));
				await settle();
			};
			await choose('a2'); // pending[0]: a2, will answer late
			await choose('a1'); // pending[1]
			await choose('a2'); // pending[2]: the latest
			const overlapping = [{ id: 'c2', startDate: '2025-02-01', endDate: null }];
			pending[2]([]);
			await settle();
			pending[0](overlapping); // a stale answer for the same apartment
			await settle();
			expect(byTestId('overlap-warning')).toBeNull();
			await choose('a1'); // pending[3]
			pending[3](overlapping);
			await settle();
			expect(byTestId('overlap-warning')).not.toBeNull();
		});

		// Haiku-Review: eine Antwort ohne Liste gilt als nicht geladen; der Entwurf bleibt
		it('löscht keinen Entwurf, wenn die Mietverträge der Wohnung keine Liste sind', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: 'x' }]
			);
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			expect(byTestId('form-error')!.textContent).toContain('konnten nicht geladen werden');
		});

		// Review K-7: ein inzwischen versendeter Entwurf; die Meldung des Backends, kein zweites Angebot
		it('nennt den Grund, wenn der Entwurf nicht gelöscht werden kann', async () => {
			calls = fakeBff(({ method }) => {
				if (method === 'PUT') return [409, refused];
				if (method === 'DELETE')
					return [400, { error: 'not a draft', code: 'STATEMENT_NOT_DRAFT' }];
				return [200, { contracts: [] }];
			});
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(byTestId('form-error')!.textContent).toContain(
				'Die Abrechnung ist kein Entwurf mehr und kann nicht gelöscht werden.'
			);
			expect(byTestId('delete-draft-and-save')).toBeNull();
		});

		// A-10: der einzige Entwurf wird gelöscht, der Mietvertrag gespeichert, danach geht es in den Assistenten
		it('löscht den Entwurf, speichert und öffnet den Assistenten für Gebäude und Periode', async () => {
			let refuse = true;
			calls = fakeBff(({ method }) => {
				if (method === 'PUT') return refuse ? [409, refused] : [200, {}];
				if (method === 'DELETE') return ((refuse = false), [204]);
				return [200, { contracts: [] }];
			});
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();

			expect(calls.filter((c) => c.method !== 'GET').map((c) => [c.method, c.path])).toEqual([
				['PUT', '/contracts/c1'],
				['DELETE', '/statements/s1'],
				['PUT', '/contracts/c1']
			]);
			expect(goto).toHaveBeenCalledWith(
				'/statements/generate?building=b1&start=2025-01-01&end=2025-12-31'
			);
		});
	});

	// A-1: ein gekündigter Mietvertrag bleibt unbefristet, bis die Kündigung aufgehoben wird
	describe('Gekündigter Mietvertrag', () => {
		const duration = (value: string) =>
			document.querySelector<HTMLInputElement>(`input[name="duration"][value="${value}"]`)!;

		it('zeigt die Kündigung statt einer Befristung', async () => {
			await open('2099-03-31', true);
			expect(duration('terminated').checked).toBe(true);
			expect(byTestId('contract-duration')!.textContent).toContain(
				'Unbefristet, gekündigt auf den 31.03.2099'
			);
		});

		it('bleibt beim Speichern gekündigt', async () => {
			await open('2099-03-31', true);
			type('contract-base-rent-input', '980');
			await save();
			expect(puts()[0].body).toMatchObject({ endDate: '2099-03-31', terminated: true });
		});

		it('hebt die Kündigung auf und nennt die Folge', async () => {
			await open('2099-03-31', true);
			expect(byTestId('contract-duration')!.textContent).toContain(
				'Der Mietvertrag läuft dann ohne Ende weiter.'
			);
			click(duration('unlimited'));
			await settle();
			await save();
			expect(puts()[0].body).toMatchObject({ endDate: null, terminated: false });
			expect(get(toasts).map((t) => t.message)).toEqual([
				'Kündigung von Anna Keller aufgehoben. Der Mietvertrag läuft ohne Ende weiter.'
			]);
		});

		it('wird befristet, wenn der Liegenschaftsverwalter «Befristet» wählt', async () => {
			await open('2099-03-31', true);
			click(duration('limited'));
			await settle();
			await save();
			expect(puts()[0].body).toMatchObject({ endDate: '2099-03-31', terminated: false });
		});

		it('bietet bei einem nicht gekündigten Mietvertrag keine Kündigung an', async () => {
			await open('2099-03-31');
			expect(document.querySelector('input[name="duration"][value="terminated"]')).toBeNull();
			type('contract-base-rent-input', '980');
			await save();
			expect(puts()[0].body).toMatchObject({ terminated: false });
		});
	});

	// Sven K1 M1: wer bei einem unbefristeten Mietvertrag «Befristet» wählt, meint oft eine Kündigung
	describe('Hinweis auf «Beenden»', () => {
		const choose = async (value: string) => {
			click(document.querySelector<HTMLInputElement>(`input[name="duration"][value="${value}"]`)!);
			await settle();
		};

		it('verweist bei «Befristet» auf «Beenden»', async () => {
			await open();
			await choose('limited');
			const hint = byTestId('contract-notice-hint')!;
			expect(hint.textContent).toContain('Hat der Mieter gekündigt?');
			expect(hint.querySelector('a')!.getAttribute('href')).toBe('/contracts/c1');
		});

		// Persona Sven K2 M1: der Hinweis erscheint erst nach der Wahl; er wird angesagt, der Link sagt, wozu er führt
		it('sagt den Hinweis an und nennt im Link, was dort zu tun ist', async () => {
			await open();
			const region = document.querySelector('[data-testid="contract-notice-region"]')!;
			expect(region.getAttribute('aria-live')).toBe('polite');
			expect(region.classList.contains('sr-only')).toBe(true); // empty, it takes no gap in the form
			await choose('limited');
			expect(region.classList.contains('sr-only')).toBe(false);
			expect(region.contains(byTestId('contract-notice-hint'))).toBe(true);
			expect(byTestId('contract-notice-hint')!.querySelector('a')!.textContent).toBe(
				'Kündigung mit «Beenden» eintragen'
			);
		});

		it('verweist nicht darauf bei einem befristeten Mietvertrag', async () => {
			await open('2099-12-31');
			expect(byTestId('contract-notice-hint')).toBeNull();
		});
	});
});
