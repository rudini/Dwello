import { Count, Text } from '../screenplay/questions';
import { monthShare, profileActions, profileCard, profileTotal } from '../targets/heating-profiles';

export const shareOf = (month: string) => Text.of(monthShare(month));
export const totalShare = Text.of(profileTotal);
export const listedProfilesNamed = (name: string) => Count.of(profileCard(name));
export const profileActionCount = Count.of(profileActions);
