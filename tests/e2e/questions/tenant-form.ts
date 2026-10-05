import type { Actor } from '../fixtures/actor';
import { tenantChannel, tenantLanguage } from '../interactions/tenant-form';

export const correspondenceOf = (actor: Actor) => tenantChannel(actor.page);
export const languageOf = (actor: Actor) => tenantLanguage(actor.page);
