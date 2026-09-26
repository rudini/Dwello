import type { Actor } from '../fixtures/actor';
import { breadcrumbLink } from '../interactions/navigation';
import {
	buildingCard,
	cityFilterInput,
	newBuildingButton,
	searchButton,
	searchInput
} from '../interactions/buildings';

export const searchBuildings = (term: string) => async (actor: Actor) => {
	await searchInput(actor.page).fill(term);
	await searchButton(actor.page).click();
};

export const filterByCity = (city: string) => async (actor: Actor) => {
	await cityFilterInput(actor.page).fill(city);
	await searchButton(actor.page).click();
};

export const startNewBuilding = async (actor: Actor) => {
	await newBuildingButton(actor.page).click();
};

export const openBuilding = (name: string) => async (actor: Actor) => {
	await buildingCard(actor.page, name).click();
};

export const chooseBreadcrumb = (label: string) => async (actor: Actor) => {
	await breadcrumbLink(actor.page, label).click();
};
