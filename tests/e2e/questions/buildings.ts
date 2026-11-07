import { Accessible, Attribute, Count, Text, Visibility } from '../screenplay/questions';
import { buildingCard, buildingCards, cityFilterInput, emptyListNotice, routeLink, searchInput } from '../targets/buildings';

export const buildingListed = (name: string) => Visibility.of(buildingCard(name));
export const listedBuildingCount = (name: string) => Count.of(buildingCard(name));
export const buildingCardText = (name: string) => Text.of(buildingCard(name));
export const buildingCount = Count.of(buildingCards);
export const emptyListHint = Text.of(emptyListNotice);
export const emptyListShown = Visibility.of(emptyListNotice);
export const routeTo = (name: string) => Attribute.named('href').of(routeLink(name));
// #682: as a screen reader announces the fields
export const searchHelp = Accessible.descriptionOf(searchInput);
export const searchLabel = Accessible.nameOf(searchInput);
export const cityFilterLabel = Accessible.nameOf(cityFilterInput);
