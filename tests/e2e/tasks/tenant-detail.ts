import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Navigate } from '../screenplay/interactions';
import { historyLink } from '../targets/apartment-detail';
import {
	anonymiseTenantButton,
	confirmAnonymiseTenantButton,
	confirmDeleteTenantButton,
	deleteTenantButton,
	editTenantButton,
	exportTenantButton,
	newContractButton,
	rentalApartmentLink
} from '../targets/tenant-detail';

export const openTenantDetail = (tenantId: string) => Navigate.to(`/tenants/${tenantId}`);

/** #435: the ZIP with everything Dwello holds about the tenant */
export const exportTenantData = (tenantId: string): Activity => (actor) =>
	actor.attemptsTo(openTenantDetail(tenantId), DownloadFrom(exportTenantButton));

export const editTenant = Click.on(editTenantButton);

export const startContractForTenant = Click.on(newContractButton);

export const openTenantApartment = Click.on(rentalApartmentLink);

export const openContractOfApartment = (number: string) => Click.on(historyLink(`Wohnung ${number}`));

export const startDeletingTenant = Click.on(deleteTenantButton);

export const deleteTenant: Activity = (actor) =>
	actor.attemptsTo(startDeletingTenant, Click.on(confirmDeleteTenantButton));

export const startAnonymisingTenant = Click.on(anonymiseTenantButton);

export const confirmAnonymising = Click.on(confirmAnonymiseTenantButton);
