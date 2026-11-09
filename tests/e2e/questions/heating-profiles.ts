import { Accessible, Count, Text } from '../screenplay/questions';
import {
	cardTranslations,
	detailTranslations,
	monthShare,
	nameInput,
	profileActions,
	profileCard,
	profileTotal,
	sharesHelp
} from '../targets/heating-profiles';

export const shareOf = (month: string) => Text.of(monthShare(month));
export const totalShare = Text.of(profileTotal);
export const listedProfilesNamed = (name: string) => Count.of(profileCard(name));
export const profileActionCount = Count.of(profileActions);
export const sharesHelpText = Text.of(sharesHelp);
export const nameProblem = Accessible.descriptionOf(nameInput);
export const listedTranslationsOf = (name: string) => Text.of(cardTranslations(name));
export const translationsOnDetail = Text.of(detailTranslations);
export const listedTranslationMarkers = (name: string) => Count.of(cardTranslations(name));
export const translationMarkersOnDetail = Count.of(detailTranslations);
