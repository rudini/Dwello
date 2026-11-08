import type { Activity } from '../screenplay/actor';
import { Check, Click, DownloadFrom, Enter, Navigate, Uncheck } from '../screenplay/interactions';
import { exportAllDataButton, holderIsSenderBox, masterDataLink, saveSettingsButton, settingField } from '../targets/settings';

export const openSettings = Navigate.to('/config');

/** #1202: types the settings without saving them */
export const enterSettings = (fields: Record<string, string>): Activity => (actor) =>
	actor.attemptsTo(...Object.entries(fields).map(([name, value]) => Enter.theValue(value).into(settingField(name))));

export const saveSettings = (fields: Record<string, string>): Activity => (actor) =>
	actor.attemptsTo(enterSettings(fields), Click.on(saveSettingsButton));

export const openMasterData = (label: string) => Click.on(masterDataLink(label));

/** #496: the ZIP with everything Dwello holds, from the Einstellungen */
export const exportAllData: Activity = (actor) =>
	actor.attemptsTo(openSettings, DownloadFrom(exportAllDataButton));

/** #1166: the Kontoinhaber of the IBAN is someone other than the Absender, or the Absender again */
export const giveOwnHolder = Uncheck.the(holderIsSenderBox);
export const giveSenderAsHolder = Check.the(holderIsSenderBox);
