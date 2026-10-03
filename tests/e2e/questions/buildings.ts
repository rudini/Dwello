import type { Actor } from '../fixtures/actor';
import { buildingCard, buildingCards, emptyListNotice, routeLink } from '../interactions/buildings';

export const listedBuilding = (actor: Actor, name: string) => buildingCard(actor.page, name);
export const allListedBuildings = (actor: Actor) => buildingCards(actor.page);
export const emptyList = (actor: Actor) => emptyListNotice(actor.page);
export const routeTo = (actor: Actor, name: string) => routeLink(actor.page, name);
