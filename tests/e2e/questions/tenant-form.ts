import type { Actor } from '../fixtures/actor';
import { tenantChannel } from '../interactions/tenant-form';

export const correspondenceOf = (actor: Actor) => tenantChannel(actor.page);
