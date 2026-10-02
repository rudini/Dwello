import type { Actor } from '../fixtures/actor';
import { savedNotice, settingField } from '../interactions/settings';

export const settingsSaved = (actor: Actor) => savedNotice(actor.page);
export const storedSetting = (actor: Actor, name: string) => settingField(actor.page, name);
