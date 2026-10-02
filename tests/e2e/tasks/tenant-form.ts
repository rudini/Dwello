import type { Actor } from '../fixtures/actor';
import {
	addressInput,
	channelSelect,
	cityInput,
	emailInput,
	postalCodeInput,
	submitTenantButton
} from '../interactions/tenant-form';

export const correspondByLetter = (address: string, place: string) => async (actor: Actor) => {
	const [postalCode, city] = place.split(' ');
	await channelSelect(actor.page).selectOption('letter');
	await addressInput(actor.page).fill(address);
	await postalCodeInput(actor.page).fill(postalCode);
	await cityInput(actor.page).fill(city);
	await submitTenantButton(actor.page).click();
};

export const correspondByEmailWithoutAddress = async (actor: Actor) => {
	await channelSelect(actor.page).selectOption('email');
	await emailInput(actor.page).fill('');
	await submitTenantButton(actor.page).click();
};
