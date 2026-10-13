import { Attribute, Count, Text, Visibility } from '../screenplay/questions';
import { buildingCard, buildingCards, emptyListNotice, routeLink } from '../targets/buildings';

export const buildingListed = (name: string) => Visibility.of(buildingCard(name));
export const listedBuildingCount = (name: string) => Count.of(buildingCard(name));
export const buildingCount = Count.of(buildingCards);
export const emptyListHint = Text.of(emptyListNotice);
export const emptyListShown = Visibility.of(emptyListNotice);
export const routeTo = (name: string) => Attribute.named('href').of(routeLink(name));
