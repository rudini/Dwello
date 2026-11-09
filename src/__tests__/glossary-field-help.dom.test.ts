import { describe, expect, it } from 'vitest';
import { m } from '$lib/paraglide/messages';
import { initialContractValues } from '$lib/contract-form';
import { help } from '../routes/config/help';
import RentStep from '../routes/contracts/new/RentStep.svelte';
import TenantFormFields from '../routes/tenants/TenantFormFields.svelte';
import { byTestId, show } from './helpers/dom';
import de from '../../messages/de.json';
import fr from '../../messages/fr.json';
import it_ from '../../messages/it.json';
import en from '../../messages/en.json';

// #698: a term the glossary explains is explained at a field with the glossary's own message, not a second text
const sentences = (text: string) =>
	text.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.length > 20);
const description = (testid: string) =>
	(byTestId(testid)!.getAttribute('aria-describedby') ?? '')
		.split(' ')
		.map((id) => document.getElementById(id)?.textContent ?? '')
		.join(' ')
		.trim();

describe('Begriffe der Hilfe am Feld', () => {
	it.each([
		['de', de],
		['fr', fr],
		['it', it_],
		['en', en]
	])(
		'wiederholt in %s keinen Satz einer Erklärung der Hilfe in einem anderen Text',
		(_, messages) => {
			const texts = Object.entries(messages as Record<string, string>);
			const copies = texts
				.filter(([key]) => key.startsWith('glossary_') && key.endsWith('_text'))
				.flatMap(([key, text]) =>
					texts
						.filter(([other]) => !other.startsWith('glossary_'))
						.flatMap(([other, value]) =>
							sentences(value)
								.filter((sentence) => sentences(text).includes(sentence))
								.map((sentence) => `${key} ⇄ ${other}: ${sentence}`)
						)
				);
			expect(copies).toEqual([]);
		}
	);

	// The fields whose help defines a term of the glossary (decided in #698); the list lives here, not in the app
	it.each([
		['Heizprofil', () => help.heatingProfile, m.glossary_profile_text],
		['Verteilschlüssel', () => help.distributionKey, m.glossary_key_text],
		['Verwaltungspauschale', () => help.managementFee, m.glossary_fee_text]
	])('erklärt %s in den Einstellungen mit dem Text der Hilfe', (_, shown, glossary) => {
		expect(shown().startsWith(glossary())).toBe(true);
	});

	it('erklärt das Akonto im Mietvertrag mit dem Text der Hilfe', () => {
		show(RentStep, {
			values: initialContractValues(undefined, new URLSearchParams()),
			errors: {},
			categories: []
		});
		expect(
			description('contract-advance-payment-input').startsWith(m.glossary_advance_text())
		).toBe(true);
	});

	it('erklärt den Korrespondenzkanal beim Mieter mit dem Text der Hilfe', () => {
		show(TenantFormFields, {});
		expect(description('tenant-channel-select').startsWith(m.glossary_channel_text())).toBe(true);
	});
});
