import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	apartmentBuildingFilter,
	apartmentCard,
	apartmentSearchButton,
	apartmentSearchInput,
	apartmentStatusFilter,
	newApartmentButton,
	showAllApartmentsLink
} from '../targets/apartments';

const APARTMENTS = '/apartments';
export const openApartmentList = Navigate.to(APARTMENTS);

// The filter navigates on the client; the list is filtered once the URL carries the building
// the status too: a second search in the same building waits for its own list (code review 1311-1 C-4)
const filteredBy = (buildingId: string, status = '') =>
	Wait.forUrl((url) => url.searchParams.get('building') === buildingId && (url.searchParams.get('status') ?? '') === status);

export const showApartmentsOfBuilding = (buildingId: string, status = ''): Activity => (actor) =>
	actor.attemptsTo(
		Select.option(buildingId).from(apartmentBuildingFilter),
		Select.option(status).from(apartmentStatusFilter),
		Click.on(apartmentSearchButton),
		filteredBy(buildingId, status)
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

// #662: applies at once, without «Suchen»
export const chooseVacantApartments = Select.option('vacant').from(apartmentStatusFilter);

export const searchApartments = (term: string, buildingId = ''): Activity => (actor) =>
	actor.attemptsTo(
		// the choice first: it applies at once and drops a text not searched yet (#662)
		Select.option(buildingId).from(apartmentBuildingFilter),
		Wait.forUrl((url) => (url.searchParams.get('building') ?? '') === buildingId),
		Enter.theValue(term).into(apartmentSearchInput),
		Click.on(apartmentSearchButton),
		Wait.forUrl((url) => url.searchParams.get('search') === term)
	);

// The link of the empty result leads back to the unfiltered list
export const showAllApartments: Activity = (actor) =>
	actor.attemptsTo(Click.on(showAllApartmentsLink), Wait.forUrl((url) => url.search === ''));

export const startNewApartment = Click.on(newApartmentButton);

export const openApartment = (number: string) => Click.on(apartmentCard(number));
