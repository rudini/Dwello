import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate } from '../screenplay/interactions';
import {
	confirmDeleteButton,
	deleteButton,
	monthInput,
	nameInput,
	profileCard,
	submitButton
} from '../targets/heating-profiles';

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export const openHeatingProfiles = Navigate.to('/config/heating-profiles');
export const openNewHeatingProfile = Navigate.to('/config/heating-profiles/new');
export const openHeatingProfileDetail = (profileId: string) => Navigate.to(`/config/heating-profiles/${profileId}`);
export const openHeatingProfileEdit = (profileId: string) => Navigate.to(`/config/heating-profiles/${profileId}/edit`);

const enterShares = (shares: Record<string, string>) =>
	Object.entries(shares).map(([month, share]) => Enter.theValue(share).into(monthInput(month)));

export const createHeatingProfile = (name: string, january: string, otherMonths: string): Activity => (actor) =>
	actor.attemptsTo(
		...enterShares(Object.fromEntries(MONTHS.map((month) => [month, month === 'january' ? january : otherMonths]))),
		Enter.theValue(name).into(nameInput),
		Click.on(submitButton)
	);

export const changeShares = (shares: Record<string, string>): Activity => (actor) =>
	actor.attemptsTo(...enterShares(shares), Click.on(submitButton));

export const deleteHeatingProfile: Activity = (actor) =>
	actor.attemptsTo(Click.on(deleteButton), Click.on(confirmDeleteButton));

export const openHeatingProfile = (name: string) => Click.on(profileCard(name));
