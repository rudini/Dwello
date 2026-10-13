import { Click, Navigate } from '../screenplay/interactions';
import { editButton, historyLink, tenantProfileButton } from '../targets/apartment-detail';

export const openApartmentDetail = (apartmentId: string) => Navigate.to(`/apartments/${apartmentId}`);

export const editApartment = Click.on(editButton);

export const openTenantProfile = Click.on(tenantProfileButton);

export const openContractFromHistory = (tenantName: string) => Click.on(historyLink(tenantName));
