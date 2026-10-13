import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { historyLink } from '../targets/apartment-detail';
import {
	confirmDeleteTenantButton,
	deleteTenantButton,
	editTenantButton,
	newContractButton,
	rentalApartmentLink
} from '../targets/tenant-detail';

export const openTenantDetail = (tenantId: string) => Navigate.to(`/tenants/${tenantId}`);

export const editTenant = Click.on(editTenantButton);

export const startContractForTenant = Click.on(newContractButton);

export const openTenantApartment = Click.on(rentalApartmentLink);

export const openContractOfApartment = (number: string) => Click.on(historyLink(`Wohnung ${number}`));

export const startDeletingTenant = Click.on(deleteTenantButton);

export const deleteTenant: Activity = (actor) =>
	actor.attemptsTo(startDeletingTenant, Click.on(confirmDeleteTenantButton));
