import type { Activity } from '../screenplay/actor';
import { Click, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	apartmentBuildingFilter,
	apartmentCard,
	apartmentSearchButton,
	apartmentStatusFilter,
	newApartmentButton
} from '../targets/apartments';

const APARTMENTS = '/apartments';
export const openApartmentList = Navigate.to(APARTMENTS);

// The filter navigates on the client; the list is filtered once the URL carries the building
const filteredBy = (buildingId: string) => Wait.forUrl((url) => url.searchParams.get('building') === buildingId);

export const showApartmentsOfBuilding = (buildingId: string, status = ''): Activity => (actor) =>
	actor.attemptsTo(
		Select.option(buildingId).from(apartmentBuildingFilter),
		Select.option(status).from(apartmentStatusFilter),
		Click.on(apartmentSearchButton),
		filteredBy(buildingId)
	);

// The building is chosen before the page is hydrated; the search runs once it is
export const showApartmentsOfBuildingWhileLoading = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(
		Navigate.toWithScriptsHeldBack(APARTMENTS),
		Select.option(buildingId).from(apartmentBuildingFilter),
		Navigate.releaseScripts,
		Click.on(apartmentSearchButton),
		filteredBy(buildingId)
	);

export const startNewApartment = Click.on(newApartmentButton);

export const openApartment = (number: string) => Click.on(apartmentCard(number));
