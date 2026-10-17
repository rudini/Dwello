import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate, Select } from '../screenplay/interactions';
import {
	addressInput,
	channelSelect,
	cityInput,
	countrySelect,
	emailInput,
	languageSelect,
	postalCodeInput,
	submitTenantButton
} from '../targets/tenant-form';

export const openTenantEdit = (tenantId: string) => Navigate.to(`/tenants/${tenantId}/edit`);

export const correspondByLetter = (address: string, place: string, country?: string): Activity => (actor) => {
	const [postalCode, city] = place.split(' ');
	return actor.attemptsTo(
		Select.option('letter').from(channelSelect),
		Enter.theValue(address).into(addressInput),
		Enter.theValue(postalCode).into(postalCodeInput),
		Enter.theValue(city).into(cityInput),
		...(country ? [Select.option({ label: country }).from(countrySelect)] : []),
		Click.on(submitTenantButton)
	);
};

export const correspondByEmailWithoutAddress: Activity = (actor) =>
	actor.attemptsTo(Select.option('email').from(channelSelect), Enter.theValue('').into(emailInput), Click.on(submitTenantButton));

export const chooseLanguage = (language: string): Activity => (actor) =>
	actor.attemptsTo(Select.option({ label: language }).from(languageSelect), Click.on(submitTenantButton));
