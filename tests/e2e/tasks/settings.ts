import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate } from '../screenplay/interactions';
import { masterDataLink, saveSettingsButton, settingField } from '../targets/settings';

export const openSettings = Navigate.to('/config');

export const saveSettings = (fields: Record<string, string>): Activity => (actor) =>
	actor.attemptsTo(
		...Object.entries(fields).map(([name, value]) => Enter.theValue(value).into(settingField(name))),
		Click.on(saveSettingsButton)
	);

export const openMasterData = (label: string) => Click.on(masterDataLink(label));
