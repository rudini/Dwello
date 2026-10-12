import { describe, it, expect, vi } from 'vitest';
import { readable } from 'svelte/store';
import { goto } from '$app/navigation';
import Header from '$lib/ui/Header.svelte';
import { click, fakeBff, settle, show } from './helpers/dom';

vi.mock('$app/stores', () => ({ page: readable({ url: new URL('http://localhost/tenants') }) }));
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

describe('Abmelden', () => {
	it('lädt die Anmeldeseite mit frischen Daten, damit öffentliche Seiten niemanden mehr als angemeldet zeigen', async () => {
		fakeBff();
		show(Header, {
			user: { id: 'u1', sub: 'u1', name: 'Vera Verwalter', email: 'vera@example.ch' }
		});
		click('user-menu-button');
		click('logout-button');
		await settle();
		expect(goto).toHaveBeenCalledWith('/login', { invalidateAll: true });
	});
});
