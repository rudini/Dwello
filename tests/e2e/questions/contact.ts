import type { Actor } from '../fixtures/actor';
import { tenantEmailLink, tenantPhoneLink } from '../interactions/contact';

export const emailLink = (actor: Actor) => tenantEmailLink(actor.page);
export const phoneLink = (actor: Actor) => tenantPhoneLink(actor.page);
