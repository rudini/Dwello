import { Click, Navigate } from '../screenplay/interactions';
import type { Activity } from '../screenplay/actor';
import {
	confirmDeleteButton,
	confirmRemoveSizeChangeButton,
	deleteButton,
	editButton,
	historyLink,
	removeSizeChangeButton,
	tenantProfileButton
} from '../targets/apartment-detail';

export const openApartmentDetail = (apartmentId: string) => Navigate.to(`/apartments/${apartmentId}`);

export const editApartment = Click.on(editButton);

export const openTenantProfile = Click.on(tenantProfileButton);

export const openContractFromHistory = (tenantName: string) => Click.on(historyLink(tenantName));

export const startDeletingApartment = Click.on(deleteButton);

export const deleteApartment: Activity = (actor) =>
	actor.attemptsTo(startDeletingApartment, Click.on(confirmDeleteButton));

// #1301
export const startRemovingSizeChange = Click.on(removeSizeChangeButton);
export const confirmRemovingSizeChange = Click.on(confirmRemoveSizeChangeButton);
