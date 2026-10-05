import type { Actor } from '../fixtures/actor';
import {
	confirmDeleteButton,
	deleteButton,
	monthInput,
	nameInput,
	profileCard,
	submitButton
} from '../interactions/heating-profiles';

const MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];

export const createHeatingProfile =
	(name: string, january: string, otherMonths: string) => async (actor: Actor) => {
		for (const month of MONTHS)
			await monthInput(actor.page, month).fill(month === 'january' ? january : otherMonths);
		await nameInput(actor.page).fill(name);
		await submitButton(actor.page).click();
	};

export const changeShares = (shares: Record<string, string>) => async (actor: Actor) => {
	for (const [month, share] of Object.entries(shares))
		await monthInput(actor.page, month).fill(share);
	await submitButton(actor.page).click();
};

export const deleteHeatingProfile = async (actor: Actor) => {
	await deleteButton(actor.page).click();
	await confirmDeleteButton(actor.page).click();
};

export const openHeatingProfile = (name: string) => async (actor: Actor) => {
	await profileCard(actor.page, name).click();
};
