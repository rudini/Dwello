import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Enter, Navigate } from '../screenplay/interactions';
import { exportAllDataButton, masterDataLink, saveSettingsButton, settingField } from '../targets/settings';

export const openSettings = Navigate.to('/config');

export const saveSettings = (fields: Record<string, string>): Activity => (actor) =>
	actor.attemptsTo(
		...Object.entries(fields).map(([name, value]) => Enter.theValue(value).into(settingField(name))),
		Click.on(saveSettingsButton)
	);

export const openMasterData = (label: string) => Click.on(masterDataLink(label));

/** #496: the ZIP with everything Dwello holds, from the Einstellungen */
export const exportAllData: Activity = (actor) =>
	actor.attemptsTo(openSettings, DownloadFrom(exportAllDataButton));
