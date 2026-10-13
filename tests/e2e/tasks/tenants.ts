import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	channelSelect,
	emailInput,
	firstNameInput,
	lastNameInput,
	submitTenantButton
} from '../targets/tenant-form';
import {
	newTenantButton,
	tenantCard,
	tenantSearchButton,
	tenantSearchInput,
	tenantStatusFilter
} from '../targets/tenants';

export const openTenantList = Navigate.to('/tenants');
export const openNewTenant = Navigate.to('/tenants/new');

export const searchTenant = (name: string, status = ''): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(name).into(tenantSearchInput),
		Select.option(status).from(tenantStatusFilter),
		Click.on(tenantSearchButton),
		Wait.forUrl((url) => url.searchParams.get('search') === name)
	);

export const startNewTenant = Click.on(newTenantButton);

export const openTenant = (name: string) => Click.on(tenantCard(name));

export const createTenantByEmail = (fullName: string): Activity => (actor) => {
	const [firstName, ...lastName] = fullName.split(' ');
	return actor.attemptsTo(
		Enter.theValue(firstName).into(firstNameInput),
		Enter.theValue(lastName.join(' ')).into(lastNameInput),
		Enter.theValue(`${lastName.at(-1)}@dwello.test`).into(emailInput),
		Select.option('email').from(channelSelect),
		Click.on(submitTenantButton)
	);
};

export const submitEmptyTenant = Click.on(submitTenantButton);
