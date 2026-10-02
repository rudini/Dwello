import type { Actor } from '../fixtures/actor';
import { masterDataLink, saveSettingsButton, settingField } from '../interactions/settings';

export const saveSettings = (fields: Record<string, string>) => async (actor: Actor) => {
	for (const [name, value] of Object.entries(fields)) await settingField(actor.page, name).fill(value);
	await saveSettingsButton(actor.page).click();
};

export const openMasterData = (label: string) => async (actor: Actor) => {
	await masterDataLink(actor.page, label).click();
};
