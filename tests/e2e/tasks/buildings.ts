import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate } from '../screenplay/interactions';
import { buildingCard, cityFilterInput, newBuildingButton, searchButton, searchInput } from '../targets/buildings';

export const openBuildingList = Navigate.to('/buildings');

export const searchBuildings = (term: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(term).into(searchInput), Click.on(searchButton));

export const filterByCity = (city: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(city).into(cityFilterInput), Click.on(searchButton));

export const startNewBuilding = Click.on(newBuildingButton);

export const openBuilding = (name: string) => Click.on(buildingCard(name));
