import type { Actor } from '../fixtures/actor';
import {
	newTenantButton,
	tenantCard,
	tenantSearchButton,
	tenantSearchInput,
	tenantStatusFilter
} from '../interactions/tenants';
import {
	channelSelect,
	emailInput,
	firstNameInput,
	lastNameInput,
	submitTenantButton
} from '../interactions/tenant-form';

export const searchTenant =
	(name: string, status = '') =>
	async (actor: Actor) => {
		await tenantSearchInput(actor.page).fill(name);
		await tenantStatusFilter(actor.page).selectOption(status);
		await tenantSearchButton(actor.page).click();
		await actor.page.waitForURL((url) => url.searchParams.get('search') === name);
	};

export const startNewTenant = async (actor: Actor) => {
	await newTenantButton(actor.page).click();
};

export const openTenant = (name: string) => async (actor: Actor) => {
	await tenantCard(actor.page, name).click();
};

export const createTenantByEmail = (fullName: string) => async (actor: Actor) => {
	const [firstName, ...lastName] = fullName.split(' ');
	await firstNameInput(actor.page).fill(firstName);
	await lastNameInput(actor.page).fill(lastName.join(' '));
	await emailInput(actor.page).fill(`${lastName.at(-1)}@dwello.test`);
	await channelSelect(actor.page).selectOption('email');
	await submitTenantButton(actor.page).click();
};

export const submitEmptyTenant = async (actor: Actor) => {
	await submitTenantButton(actor.page).click();
};
